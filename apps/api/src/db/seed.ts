import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { hashPassword } from '../lib/hashPassword';
import * as schema from './schema';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is not defined');
}
const sql = neon(process.env.NEON_DATABASE_URL);

const db = drizzle(sql, {
  schema,
});

const main = async () => {
  try {
    if (!process.env.DEFAULT_USER || !process.env.DEFAULT_PASSWORD) {
      throw new Error('NEON_DATABASE_URL is not defined');
    }
    const hash = await hashPassword(process.env.DEFAULT_PASSWORD);
    const users = await db.query.users.findMany();
    if (users.length > 0) {
      console.log('Users table already has data');
    } else {
      await db
        .insert(schema.users)
        .values({
          username: process.env.DEFAULT_USER,
          hash,
        })
        .execute();
      console.log('Default user added');
    }
  } catch (error) {
    console.error(error);
    throw new Error('Failed to seed database');
  }
};

main();
