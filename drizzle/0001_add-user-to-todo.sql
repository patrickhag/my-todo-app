ALTER TABLE "todos" DROP CONSTRAINT "todos_userId_user_id_fk";
--> statement-breakpoint
ALTER TABLE "todos" ADD COLUMN "userName" text NOT NULL;--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_userName_user_name_fk" FOREIGN KEY ("userName") REFERENCES "public"."user"("name") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN IF EXISTS "userId";