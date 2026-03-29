
CREATE TABLE public.packages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tracking_number TEXT NOT NULL UNIQUE,
  sender_name TEXT NOT NULL,
  recipient_name TEXT NOT NULL,
  origin TEXT NOT NULL,
  destination TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Order Placed' CHECK (status IN ('Order Placed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered')),
  estimated_delivery DATE,
  order_placed_at TIMESTAMPTZ DEFAULT now(),
  picked_up_at TIMESTAMPTZ,
  in_transit_at TIMESTAMPTZ,
  out_for_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read" ON public.packages FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON public.packages FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON public.packages FOR UPDATE USING (true);
CREATE POLICY "Allow public delete" ON public.packages FOR DELETE USING (true);

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_packages_updated_at
  BEFORE UPDATE ON public.packages
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
