CREATE OR REPLACE FUNCTION "public"."set_product_featured_on_insert"() RETURNS "trigger"
LANGUAGE "plpgsql"
AS $$
DECLARE
  profile_is_featured BOOLEAN;
  profile_featured_until TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the profile's featured status
  SELECT is_featured, featured_until
  INTO profile_is_featured, profile_featured_until
  FROM profiles
  WHERE id = NEW.user_id;
  
  -- If profile is featured, set product to featured
  IF profile_is_featured = true THEN
    NEW.is_featured := true;
    NEW.featured_until := profile_featured_until;
  END IF;
  
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."set_product_featured_on_insert"() OWNER TO "postgres";

CREATE OR REPLACE TRIGGER "set_product_featured_on_insert_trigger"
  BEFORE INSERT ON "public"."products"
  FOR EACH ROW
  EXECUTE FUNCTION "public"."set_product_featured_on_insert"();

