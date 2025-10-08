-- ============================================================================
-- ADMIN INSTANT ACCESS - Simplified Configuration
-- ============================================================================
-- This is a simplified version that works reliably with Supabase
-- Run this in your Supabase SQL Editor
-- ============================================================================

-- Step 1: Create function to auto-confirm admin users
CREATE OR REPLACE FUNCTION public.auto_confirm_admin_users()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Auto-confirm if role is admin
  IF (NEW.raw_user_meta_data->>'role' = 'admin' OR 
      NEW.raw_user_meta_data->>'role' = 'Admin') THEN
    NEW.email_confirmed_at = NOW();
  END IF;
  RETURN NEW;
END;
$$;

-- Step 2: Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_auto_confirm_admin ON auth.users;

-- Step 3: Create trigger
CREATE TRIGGER trigger_auto_confirm_admin
  BEFORE INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.auto_confirm_admin_users();

-- Step 4: Manually confirm any existing unconfirmed admin users
-- (Run this as a separate query if needed)
-- UPDATE auth.users
-- SET email_confirmed_at = NOW()
-- WHERE (raw_user_meta_data->>'role' = 'admin' OR raw_user_meta_data->>'role' = 'Admin')
--   AND email_confirmed_at IS NULL;

-- ============================================================================
-- Verification
-- ============================================================================
-- Check if trigger was created successfully
SELECT 
  trigger_name,
  event_manipulation,
  action_timing
FROM information_schema.triggers
WHERE trigger_name = 'trigger_auto_confirm_admin';

-- ============================================================================
-- Success!
-- ============================================================================
-- If you see the trigger listed above, the setup is complete!
-- New admin signups will be automatically confirmed.
-- ============================================================================
