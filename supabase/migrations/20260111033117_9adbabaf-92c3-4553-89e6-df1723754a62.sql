-- Remove age constraints first
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS valid_age;
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS valid_purchase_age;
ALTER TABLE public.purchases DROP CONSTRAINT IF EXISTS valid_purchase_age_2;

-- Remove age columns from profiles
ALTER TABLE public.profiles DROP COLUMN age;

-- Add phone column to profiles
ALTER TABLE public.profiles ADD COLUMN phone text;

-- Remove age columns from purchases
ALTER TABLE public.purchases DROP COLUMN age;
ALTER TABLE public.purchases DROP COLUMN age_2;

-- Add phone columns to purchases
ALTER TABLE public.purchases ADD COLUMN phone text;
ALTER TABLE public.purchases ADD COLUMN phone_2 text;

-- Update handle_new_user function to use phone instead of age
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, name, phone, telegram)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data ->> 'name', ''),
    COALESCE(new.raw_user_meta_data ->> 'phone', ''),
    COALESCE(new.raw_user_meta_data ->> 'telegram', '')
  );
  RETURN new;
END;
$$;