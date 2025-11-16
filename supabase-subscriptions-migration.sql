-- Subscriptions table for featured products
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  plan_type TEXT NOT NULL CHECK (plan_type IN ('daily', 'monthly', 'lifetime')),
  stripe_checkout_session_id TEXT,
  stripe_subscription_id TEXT, -- For monthly recurring
  stripe_payment_intent_id TEXT, -- For one-time payments
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'expired', 'cancelled')),
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE, -- NULL for lifetime
  amount_paid INTEGER NOT NULL, -- Amount in cents
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add featured info to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Add featured info to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE products ADD COLUMN IF NOT EXISTS featured_until TIMESTAMP WITH TIME ZONE;

-- Function to sync featured status from profile to all products
CREATE OR REPLACE FUNCTION sync_profile_featured_to_products()
RETURNS TRIGGER AS $$
BEGIN
  -- Update all products belonging to this profile
  UPDATE products
  SET 
    is_featured = NEW.is_featured,
    featured_until = NEW.featured_until,
    updated_at = NOW()
  WHERE user_id = NEW.id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically sync featured status from profile to products
CREATE TRIGGER sync_profile_featured_trigger
  AFTER UPDATE OF is_featured, featured_until ON profiles
  FOR EACH ROW
  WHEN (OLD.is_featured IS DISTINCT FROM NEW.is_featured OR 
        OLD.featured_until IS DISTINCT FROM NEW.featured_until)
  EXECUTE FUNCTION sync_profile_featured_to_products();

-- Function to update profile featured status when subscription changes
CREATE OR REPLACE FUNCTION update_profile_featured_from_subscription()
RETURNS TRIGGER AS $$
DECLARE
  profile_user_id UUID;
  has_active_subscription BOOLEAN;
  latest_end_date TIMESTAMP WITH TIME ZONE;
BEGIN
  -- Get the user_id from the subscription
  profile_user_id := NEW.user_id;
  
  -- Check if there are any active subscriptions for this user
  SELECT 
    COUNT(*) > 0,
    MAX(end_date)
  INTO 
    has_active_subscription,
    latest_end_date
  FROM subscriptions
  WHERE user_id = profile_user_id 
    AND status = 'active'
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
$$ LANGUAGE plpgsql;

-- Trigger to update profile when subscription is created/updated
CREATE TRIGGER update_profile_on_subscription_insert
  AFTER INSERT ON subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active')
  EXECUTE FUNCTION update_profile_featured_from_subscription();

CREATE TRIGGER update_profile_on_subscription_update
  AFTER UPDATE OF status, end_date ON subscriptions
  FOR EACH ROW
  WHEN (NEW.status = 'active' OR OLD.status = 'active')
  EXECUTE FUNCTION update_profile_featured_from_subscription();

