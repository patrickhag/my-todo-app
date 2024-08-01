CREATE TABLE IF NOT EXISTS "todo" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"done" boolean DEFAULT false NOT NULL,
	"text" text NOT NULL
);
