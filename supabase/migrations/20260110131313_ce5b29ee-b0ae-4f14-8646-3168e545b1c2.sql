-- Remove CPF constraints first
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS valid_cpf_format;
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS valid_cpf_format;
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS valid_cpf_2_format;

-- Remove CPF columns from profiles
ALTER TABLE public.profiles DROP COLUMN cpf;

-- Add age column to profiles
ALTER TABLE public.profiles ADD COLUMN age integer;

-- Add age constraint (must be between 1 and 150)
ALTER TABLE public.profiles ADD CONSTRAINT valid_age CHECK (age IS NULL OR (age >= 1 AND age <= 150));

-- Remove CPF columns from purchases
ALTER TABLE public.purchases DROP COLUMN cpf;
ALTER TABLE public.purchases DROP COLUMN cpf_2;

-- Add age columns to purchases
ALTER TABLE public.purchases ADD COLUMN age integer;
ALTER TABLE public.purchases ADD COLUMN age_2 integer;

-- Add age constraints to purchases
ALTER TABLE public.purchases ADD CONSTRAINT valid_purchase_age CHECK (age IS NULL OR (age >= 1 AND age <= 150));
ALTER TABLE public.purchases ADD CONSTRAINT valid_purchase_age_2 CHECK (age_2 IS NULL OR (age_2 >= 1 AND age_2 <= 150));

-- Update handle_new_user function to use age instead of cpf
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, age, telegram)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    (new.raw_user_meta_data ->> 'age')::integer,
    COALESCE(new.raw_user_meta_data ->> 'telegram', '')
  );
  RETURN new;
END;
$$;