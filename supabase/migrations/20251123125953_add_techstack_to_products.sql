ALTER TABLE "public"."products" 
ADD COLUMN "techstack" text[] DEFAULT ARRAY[]::text[];

ALTER TABLE "public"."products"
RENAME COLUMN "product_hunt_url" TO "instagram_url";
