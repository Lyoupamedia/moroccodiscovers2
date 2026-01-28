-- Add restrictive SELECT policy to trip_requests table
-- This denies public read access to protect customer PII (names, emails, travel plans)
-- Only authenticated users with proper roles should be able to read this data

-- Create a policy that denies all SELECT access by default
-- When an admin system is implemented, this can be updated to allow staff access
CREATE POLICY "No public read access to trip requests"
ON public.trip_requests
FOR SELECT
USING (false);

-- Also deny UPDATE and DELETE access to protect data integrity
CREATE POLICY "No public update access to trip requests"
ON public.trip_requests
FOR UPDATE
USING (false);

CREATE POLICY "No public delete access to trip requests"
ON public.trip_requests
FOR DELETE
USING (false);