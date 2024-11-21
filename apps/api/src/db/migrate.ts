import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { drizzle } from 'drizzle-orm/neon-http';
import { migrate } from 'drizzle-orm/neon-http/migrator';

if (!process.env.NEON_DATABASE_URL) {
  throw new Error('NEON_DATABASE_URL is not defined');
}
const sql = neon(process.env.NEON_DATABASE_URL);

const db = drizzle(sql);

const main = async () => {
  try {
    await migrate(db, {
      migrationsFolder: 'drizzle/',
    });

    console.log('Migration successful');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

main();
