-- Fix the update_profile_featured_from_subscription function to check start_date
-- This ensures daily passes don't activate before their start_date

CREATE OR REPLACE FUNCTION "public"."update_profile_featured_from_subscription"() RETURNS "trigger"
    LANGUAGE "plpgsql"
    AS $$
DECLARE
  profile_user_id UUID;
  has_active_subscription BOOLEAN;
  latest_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the user_id from the subscription
  profile_user_id := NEW.user_id;
  
  -- Check if there are any active subscriptions for this user
  -- A subscription is "active" for featured purposes if:
  -- 1. status = 'active'
  -- 2. start_date has arrived (or is null for immediate activation)
  -- 3. end_date hasn't passed (or is null for lifetime subscriptions)
  SELECT 
    COUNT(*) > 0,
    MAX(end_date)
  INTO 
    has_active_subscription,
    latest_end_date
  FROM subscriptions
  WHERE user_id = profile_user_id 
    AND status = 'active'
    AND (start_date IS NULL OR start_date <= NOW())
    AND (end_date IS NULL OR end_date > NOW());
  
  -- Update profile featured status
  UPDATE profiles
  SET 
    is_featured = has_active_subscription,
    featured_until = CASE 
      WHEN has_active_subscription THEN latest_end_date
      ELSE NULL
    END,
    updated_at = NOW()
  WHERE id = profile_user_id;
  
  RETURN NEW;
END;
$$;

ALTER FUNCTION "public"."update_profile_featured_from_subscription"() OWNER TO "postgres";

-- Update the trigger to also fire when start_date changes
DROP TRIGGER IF EXISTS "update_profile_on_subscription_update" ON "public"."subscriptions";

CREATE TRIGGER "update_profile_on_subscription_update" 
  AFTER UPDATE OF "status", "end_date", "start_date" ON "public"."subscriptions" 
  FOR EACH ROW 
  WHEN ((("new"."status" = 'active'::"text") OR ("old"."status" = 'active'::"text"))) 
  EXECUTE FUNCTION "public"."update_profile_featured_from_subscription"();

