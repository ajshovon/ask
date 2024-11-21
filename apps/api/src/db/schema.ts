import { pgEnum, pgTable, serial, text, timestamp } from 'drizzle-orm/pg-core';

export const messageStatusEnum = pgEnum('message_status', ['unread', 'opened', 'answered']);

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  username: text().notNull().unique(),
  hash: text().notNull(),
});

// Define the messages table
export const messages = pgTable('messages', {
  id: serial('id').primaryKey(),
  message: text().notNull(),
  answer: text(),
  status: messageStatusEnum().notNull().default('unread'),
  createdAt: timestamp('created_at').notNull().defaultNow(),
  updatedAt: timestamp('updated_at')
    .notNull()
    .$onUpdate(() => new Date()),
});
