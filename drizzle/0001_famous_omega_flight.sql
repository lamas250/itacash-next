CREATE TABLE IF NOT EXISTS "transaction" (
	"id" text PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"amount" integer NOT NULL,
	"user_id" text NOT NULL,
	"date" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"category_id" text
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "transaction" ADD CONSTRAINT "transaction_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
