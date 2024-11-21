CREATE TYPE "public"."message_status" AS ENUM('unread', 'opened', 'answered');--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "messages" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"answer" text,
	"status" "message_status" DEFAULT 'unread' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"username" text NOT NULL,
	"hash" text NOT NULL,
	CONSTRAINT "users_username_unique" UNIQUE("username")
);
