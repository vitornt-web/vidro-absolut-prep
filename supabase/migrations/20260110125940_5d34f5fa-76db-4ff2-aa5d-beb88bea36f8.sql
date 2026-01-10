-- Add DELETE policy for purchases table to allow admins to delete purchases
CREATE POLICY "Admins can delete purchases"
ON public.purchases
FOR DELETE
USING (public.has_role(auth.uid(), 'admin'));