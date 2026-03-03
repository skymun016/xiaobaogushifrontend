
-- Create storage bucket for order photos (shipping and receiving)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-photos', 'order-photos', true);

-- Allow authenticated users to upload photos
CREATE POLICY "Authenticated users can upload order photos"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'order-photos');

-- Allow public read access to order photos
CREATE POLICY "Anyone can view order photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'order-photos');

-- Allow authenticated users to delete their own uploads
CREATE POLICY "Authenticated users can delete order photos"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'order-photos');
