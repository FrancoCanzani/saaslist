-- Function to check and unfeature expired subscriptions
CREATE OR REPLACE FUNCTION "public"."check_expired_featured"() RETURNS void
LANGUAGE "plpgsql"
AS $$
DECLARE
  expired_profile RECORD;
BEGIN
  -- Find profiles that are featured but their featured_until date has passed
  FOR expired_profile IN
    SELECT id, user_id
    FROM profiles
    WHERE is_featured = true
      AND featured_until IS NOT NULL
      AND featured_until < NOW()
  LOOP
    -- Check if there are any active subscriptions
    IF NOT EXISTS (
      SELECT 1
      FROM subscriptions
      WHERE user_id = expired_profile.id
        AND status = 'active'
        AND (end_date IS NULL OR end_date > NOW())
    ) THEN
      -- No active subscription, unfeature the profile
      -- This will trigger sync_profile_featured_trigger to unfeature products
      UPDATE profiles
      SET 
        is_featured = false,
        featured_until = NULL,
        updated_at = NOW()
      WHERE id = expired_profile.id;
    END IF;
  END LOOP;
END;
$$;

ALTER FUNCTION "public"."check_expired_featured"() OWNER TO "postgres";

-- Also update the sync function to check expiration when syncing
CREATE OR REPLACE FUNCTION "public"."sync_profile_featured_to_products"() RETURNS "trigger"
LANGUAGE "plpgsql"
AS $$
BEGIN
  -- Only update products when profile becomes featured (true)
  -- This allows users to manually unfeature products even when profile is featured
  IF NEW.is_featured = true AND (OLD.is_featured IS NULL OR OLD.is_featured = false) THEN
    -- When profile becomes featured, set all products to featured
    UPDATE products
    SET 
      is_featured = true,
      featured_until = NEW.featured_until,
      updated_at = NOW()
    WHERE user_id = NEW.id;
  ELSIF NEW.is_featured = false AND OLD.is_featured = true THEN
    -- When profile becomes unfeatured, set all products to unfeatured
    UPDATE products
    SET 
      is_featured = false,
      featured_until = NULL,
      updated_at = NOW()
    WHERE user_id = NEW.id AND is_featured = true;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Function to automatically check featured_until on products and unfeature if expired
CREATE OR REPLACE FUNCTION "public"."check_product_featured_expiration"() RETURNS void
LANGUAGE "plpgsql"
AS $$
BEGIN
  -- Unfeature products where featured_until has passed
  UPDATE products
  SET 
    is_featured = false,
    featured_until = NULL,
    updated_at = NOW()
  WHERE is_featured = true
    AND featured_until IS NOT NULL
    AND featured_until < NOW();
END;
$$;

ALTER FUNCTION "public"."check_product_featured_expiration"() OWNER TO "postgres";

