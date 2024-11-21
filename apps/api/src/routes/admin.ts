import { zValidator } from '@hono/zod-validator';
import { Pool } from '@neondatabase/serverless';
import { eq, sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { decode } from 'hono/jwt';
import { z } from 'zod';
import * as schema from '../db/schema';
import { hashPassword, verifyPassword } from '../lib/hashPassword';
import HonoBindings from '../types/bindings';

const admin = new Hono<{ Bindings: HonoBindings }>();

// Schemas
const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(3, { message: 'This field has to be filled.' }),
    confirmNewPassword: z.string().min(3, { message: 'This field has to be filled.' }),
  })
  .strict();

const ansSchema = z
  .object({
    answer: z.string().min(1, { message: 'String cannot be empty' }),
  })
  .strict();

// Change password
admin.patch('/change-password', zValidator('json', changePasswordSchema), async (c) => {
  const jwtPayload = c.req.header('Authorization');
  if (!jwtPayload) throw new HTTPException(401, { message: 'Authorization header is missing' });
  const token = jwtPayload.split(' ')[1];
  const decoded = decode(token);
  const username = decoded.payload.sub as string;
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const { oldPassword, confirmNewPassword } = c.req.valid('json');
  // const user = await db.select().from(schema.users).where(eq(schema.users.id, 1)).get();
  const user = await db.query.users.findFirst({
    where: (users) => eq(users.username, username),
  });

  if (!user) throw new HTTPException(404);
  const isMatch = await verifyPassword(user.hash, oldPassword);
  if (!isMatch) throw new HTTPException(401);
  const newHash = await hashPassword(confirmNewPassword);
  await db.update(schema.users).set({ hash: newHash }).where(eq(schema.users.id, 1)).execute();
  return c.json({ status: 'Password Changed Successfully' });
});

// Get all links route
admin.get('/messages', async (c) => {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const allMessages = await db
    .select({ id: schema.messages.id, status: schema.messages.status, message: schema.messages.message, created_at: schema.messages.createdAt })
    .from(schema.messages)
    .orderBy(sql`${schema.messages.createdAt} DESC`);
  return c.json({ status: 'ok', data: allMessages, count: allMessages.length });
});

// Get one message route
admin.get('/messages/:id', async (c) => {
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const targetMsg = await db.query.messages.findFirst({
    where: (messages) => eq(messages.id, +id),
  });
  if (!targetMsg) throw new HTTPException(404);
  if (targetMsg.status === 'unread') {
    await db.update(schema.messages).set({ status: 'opened' }).where(eq(schema.messages.id, +id)).execute();
  }
  return c.json({ status: 'ok', data: targetMsg });
});

// Update a message route
admin.patch('/messages/:id', zValidator('json', ansSchema), async (c) => {
  const { answer } = c.req.valid('json');
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const targetMsg = await findById(c, +id);
  if (!targetMsg) throw new HTTPException(404);
  await db.update(schema.messages).set({ answer, status: 'answered' }).where(eq(schema.messages.id, +id)).execute();
  return c.json({ status: 'Answered' });
});

// Delete a message route
admin.delete('/messages/:id', async (c) => {
  const id = c.req.param('id');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const targetMsg = await findById(c, +id);
  if (!targetMsg) throw new HTTPException(404);
  await db.delete(schema.messages).where(eq(schema.messages.id, +id)).execute();
  return c.json({ status: 'Deleted Successfully' });
});

export default admin;

// Helper functions

// find by id
async function findById(c: any, id: number) {
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  const link = await db.query.messages.findFirst({
    where: (messages) => eq(messages.id, id),
  });
  return link;
}
