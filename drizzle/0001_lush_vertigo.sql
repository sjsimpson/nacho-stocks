CREATE TYPE "public"."classroom_request_status" AS ENUM('pending', 'approved', 'rejected');--> statement-breakpoint
CREATE TABLE "classroom_request" (
	"id" serial PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"school_name" text NOT NULL,
	"class_name" text NOT NULL,
	"expected_students" integer NOT NULL,
	"message" text,
	"status" "classroom_request_status" DEFAULT 'pending' NOT NULL,
	"rejection_reason" text,
	"organization_id" text,
	"reviewed_by" text,
	"reviewed_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "session" ADD COLUMN "impersonated_by" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "role" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "banned" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_reason" text;--> statement-breakpoint
ALTER TABLE "user" ADD COLUMN "ban_expires" timestamp;--> statement-breakpoint
ALTER TABLE "classroom_request" ADD CONSTRAINT "classroom_request_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_request" ADD CONSTRAINT "classroom_request_organization_id_organization_id_fk" FOREIGN KEY ("organization_id") REFERENCES "public"."organization"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "classroom_request" ADD CONSTRAINT "classroom_request_reviewed_by_user_id_fk" FOREIGN KEY ("reviewed_by") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "classroom_request_status_idx" ON "classroom_request" USING btree ("status","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX "classroom_request_one_pending_idx" ON "classroom_request" USING btree ("user_id") WHERE "classroom_request"."status" = 'pending';--> statement-breakpoint
ALTER TABLE "user" DROP COLUMN "account_type";