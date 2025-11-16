-- Migration: Update featured status sync trigger to allow manual unfeature
-- This allows users to manually unfeature products even when profile is featured
-- The trigger only syncs when profile becomes featured (subscription starts)
-- Manual unfeature changes will persist

-- Update the function to only sync when profile becomes featured
CREATE OR REPLACE FUNCTION sync_profile_featured_to_products()
RETURNS TRIGGER AS $$
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
$$ LANGUAGE plpgsql;

-- Drop and recreate the trigger to only fire on is_featured changes
-- (not on featured_until changes, which allows manual unfeature to persist)
DROP TRIGGER IF EXISTS sync_profile_featured_trigger ON profiles;

CREATE TRIGGER sync_profile_featured_trigger
  AFTER UPDATE OF is_featured ON profiles
  FOR EACH ROW
  WHEN (OLD.is_featured IS DISTINCT FROM NEW.is_featured)
  EXECUTE FUNCTION sync_profile_featured_to_products();

