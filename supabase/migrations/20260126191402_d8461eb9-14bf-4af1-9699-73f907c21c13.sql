-- Create a table for trip quote requests
CREATE TABLE public.trip_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  destinations TEXT[] NOT NULL,
  arrival_date DATE NOT NULL,
  departure_date DATE NOT NULL,
  travelers TEXT NOT NULL,
  budget TEXT NOT NULL,
  interests TEXT[],
  special_requests TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (public submissions, no auth required)
ALTER TABLE public.trip_requests ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert trip requests (public form)
CREATE POLICY "Anyone can submit trip requests"
ON public.trip_requests
FOR INSERT
WITH CHECK (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_trip_requests_updated_at
BEFORE UPDATE ON public.trip_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();