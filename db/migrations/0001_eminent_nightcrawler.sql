CREATE TABLE IF NOT EXISTS "services" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"working_hours" text NOT NULL,
	"rating" integer NOT NULL
);
--> statement-breakpoint
DROP TABLE "todos";--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "title_index" ON "services" ("title");