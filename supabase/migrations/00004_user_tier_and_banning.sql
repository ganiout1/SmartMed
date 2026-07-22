-- ============================================================================
-- ADD TIER AND BANNING COLUMNS TO PROFILES
-- ============================================================================

ALTER TABLE public.profiles
ADD COLUMN IF NOT EXISTS tier TEXT DEFAULT 'regular',
ADD COLUMN IF NOT EXISTS is_banned BOOLEAN DEFAULT false;

-- Add check constraint for tier
ALTER TABLE public.profiles
ADD CONSTRAINT valid_profile_tier CHECK (tier IN ('regular', 'pro'));
