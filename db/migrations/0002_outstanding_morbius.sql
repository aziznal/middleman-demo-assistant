CREATE TABLE IF NOT EXISTS "assistant_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"thread_id" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users_to_assistant_threads" (
	"user_id" uuid NOT NULL,
	"assistant_thread_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "assistant_threads" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "thread_id_index" ON "assistant_threads" ("thread_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "email_index" ON "users" ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_id_index" ON "users_to_assistant_threads" ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "assistant_thread_id_index" ON "users_to_assistant_threads" ("assistant_thread_id");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_assistant_threads" ADD CONSTRAINT "users_to_assistant_threads_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users_to_assistant_threads" ADD CONSTRAINT "users_to_assistant_threads_assistant_thread_id_assistant_threads_id_fk" FOREIGN KEY ("assistant_thread_id") REFERENCES "assistant_threads"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
