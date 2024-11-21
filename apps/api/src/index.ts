import { zValidator } from '@hono/zod-validator';
import { Pool } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-serverless';
import { Hono } from 'hono';
import { env } from 'hono/adapter';
import { cors } from 'hono/cors';
import { jwt } from 'hono/jwt';
import { logger } from 'hono/logger';
import { secureHeaders } from 'hono/secure-headers';
import { z } from 'zod';
import * as schema from './db/schema';
import admin from './routes/admin';
import auth from './routes/auth';
import HonoBindings from './types/bindings';

const app = new Hono<{ Bindings: HonoBindings }>();
app.use(logger());
app.use(secureHeaders());
app.use('/*', cors());

const messageSchema = z
  .object({
    message: z.string().min(1, { message: 'String cannot be empty' }),
  })
  .strict();

// Assuming `messageSchema` only validates the `message` field
app.post('/v1/ask', zValidator('json', messageSchema), async (c) => {
  const { message } = c.req.valid('json');
  const client = new Pool({ connectionString: c.env.NEON_DATABASE_URL });
  const db = drizzle(client, { schema });
  try {
    await db
      .insert(schema.messages)
      .values({
        message,
      })
      .execute();

    return c.json({ message: 'Message sent' }, 200);
  } catch (error) {
    console.error(error);
    return c.json({ message: 'Error sending message' }, 500);
  }
});

// Auth routes
app.route('/v1/auth', auth);

// JWT middleware
app.use('/v1/admin/*', (c, next) => {
  const jwtMiddleware = jwt({
    secret: env(c).JWT_SECRET,
  });
  return jwtMiddleware(c, next);
});

app.route('/v1/admin', admin);

export default app;
