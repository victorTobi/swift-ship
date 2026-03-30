
ALTER TABLE public.packages ADD COLUMN current_location TEXT DEFAULT NULL;

ALTER TABLE public.packages DROP CONSTRAINT IF EXISTS packages_status_check;
ALTER TABLE public.packages ADD CONSTRAINT packages_status_check CHECK (status IN ('Order Placed', 'Picked Up', 'In Transit', 'Out for Delivery', 'Delivered', 'Seized', 'Suspended'));
