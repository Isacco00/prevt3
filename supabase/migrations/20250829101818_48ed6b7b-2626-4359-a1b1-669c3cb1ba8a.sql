-- Populate the listino_accessori_desk table with the specified desk accessories
-- This will insert accessories for all existing users

DO $$
DECLARE
    user_record RECORD;
BEGIN
    -- Loop through all users in profiles table
    FOR user_record IN SELECT user_id FROM profiles WHERE active = true LOOP
        -- Insert desk accessories for each user
        INSERT INTO public.listino_accessori_desk (user_id, nome, costo_unitario, attivo) VALUES
            (user_record.user_id, 'Porta scorrevole con chiave', 150.00, true),
            (user_record.user_id, 'Ripiano Superiore L 100', 80.00, true),
            (user_record.user_id, 'Ripiano Inferiore L 100', 80.00, true),
            (user_record.user_id, 'Teca in plexiglass', 120.00, true),
            (user_record.user_id, 'Fronte luminoso dim. 100x100', 200.00, true),
            (user_record.user_id, 'Borsa', 50.00, true)
        ON CONFLICT DO NOTHING;
    END LOOP;
END
$$;