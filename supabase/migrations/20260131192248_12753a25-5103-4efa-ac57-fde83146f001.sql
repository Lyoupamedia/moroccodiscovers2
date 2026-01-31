-- Allow admins to read trip requests
CREATE POLICY "Admins can read trip requests"
ON public.trip_requests
FOR SELECT
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to update trip requests
CREATE POLICY "Admins can update trip requests"
ON public.trip_requests
FOR UPDATE
USING (has_role(auth.uid(), 'admin'));

-- Allow admins to delete trip requests
CREATE POLICY "Admins can delete trip requests"
ON public.trip_requests
FOR DELETE
USING (has_role(auth.uid(), 'admin'));