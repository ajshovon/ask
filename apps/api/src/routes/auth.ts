import { zValidator } from '@hono/zod-validator';
import { Pool } from '@neondatabase/serverless';
import { eq } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { HTTPException } from 'hono/http-exception';
import { sign } from 'hono/jwt';
import { z } from 'zod';
import * as schema from '../db/schema';
import { verifyPassword } from '../lib/hashPassword';
import HonoBindings from '../types/bindings';

const auth = new Hono<{ Bindings: HonoBindings }>();

const UserLoginSchema = z
  .object({
    username: z.string().min(3, { message: 'This field has to be filled.' }),
    password: z.string().min(3, { message: 'Minimum 8 characters required.' }),
  })
  .strict();

// Login JWT
auth.post('/login', zValidator('json', UserLoginSchema), async (c) => {
  const { username, password } = c.req.valid('json');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  // const targetUser = await db.select().from(schema.users).where(eq(schema.users.username, username)).get();
  const targetUser = await db.query.users.findFirst({
    where: (users) => eq(users.username, username),
  });
  if (!targetUser) throw new HTTPException(404);
  const isMatch = await verifyPassword(targetUser.hash, password);
  if (!isMatch) throw new HTTPException(401);
  const payload = {
    sub: username,
    exp: Math.floor(Date.now() / 1000) + 60 * 60, // Token expires in 60 minutes
  };
  const secret = env(c).JWT_SECRET;
  const token = await sign(payload, secret);
  return c.json({ status: 'Authorized', tokens: { accessToken: token } });
});

export default auth;
