-- Restore EXECUTE privilege on is_admin() for authenticated users
-- It is required for RLS policies to evaluate correctly.

GRANT EXECUTE ON FUNCTION public.is_admin() TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_admin() TO anon;
GRANT EXECUTE ON FUNCTION public.is_admin() TO PUBLIC;
