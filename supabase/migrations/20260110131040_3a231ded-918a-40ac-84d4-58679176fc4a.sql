-- Add INSERT policy for admin_settings table (allows admins to recover from accidental deletion)
CREATE POLICY "Admins can insert admin_settings"
ON public.admin_settings
FOR INSERT
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Add CPF format validation constraint to profiles table
-- Accepts both formatted (XXX.XXX.XXX-XX) and unformatted (11 digits) CPF
ALTER TABLE public.profiles
ADD CONSTRAINT valid_cpf_format
CHECK (cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' OR cpf ~ '^\d{11}$');

-- Add CPF format validation constraint to purchases table
ALTER TABLE public.purchases
ADD CONSTRAINT valid_cpf_format
CHECK (cpf ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' OR cpf ~ '^\d{11}$');

-- Add CPF format validation constraint to purchases cpf_2 column (nullable, so allow NULL)
ALTER TABLE public.purchases
ADD CONSTRAINT valid_cpf_2_format
CHECK (cpf_2 IS NULL OR cpf_2 ~ '^\d{3}\.\d{3}\.\d{3}-\d{2}$' OR cpf_2 ~ '^\d{11}$');