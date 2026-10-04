-- CLEAR EXISTING DATA (Optional, remove these lines if you want to keep old data)
-- TRUNCATE TABLE public.withdrawals CASCADE;
-- TRUNCATE TABLE public.users CASCADE;
-- TRUNCATE TABLE public.pins CASCADE;

-- 1. INSERT PINS (We need 12 pins for this test. Using 5-digit numbers as required!)
INSERT INTO public.pins (pin, status) VALUES 
('10000', 'used'),
('10001', 'used'), ('10002', 'used'), ('10003', 'used'), ('10004', 'used'),
('10005', 'used'), ('10006', 'used'), ('10007', 'used'), ('10008', 'used'),
('20001', 'used'), ('20002', 'used'),
('30001', 'used');

-- 2. INSERT TOP LEADER (The Boss)
INSERT INTO public.users (username, name, phone, password, pin, referral_pin, role, total_bonus, bonus_count)
VALUES ('bos', 'Top Leader (Boss)', '0100000000', 'password123', '10000', NULL, 'user', 0, '{}'::jsonb);

-- 3. INSERT LEVEL 1 DOWNLINES (Directly under Boss)
INSERT INTO public.users (username, name, phone, password, pin, referral_pin, role) VALUES 
('user_l1_1', 'Level 1 - User 1', '0110000001', 'password123', '10001', '10000', 'user'),
('user_l1_2', 'Level 1 - User 2', '0110000002', 'password123', '10002', '10000', 'user'),
('user_l1_3', 'Level 1 - User 3', '0110000003', 'password123', '10003', '10000', 'user'),
('user_l1_4', 'Level 1 - User 4', '0110000004', 'password123', '10004', '10000', 'user'),
('user_l1_5', 'Level 1 - User 5', '0110000005', 'password123', '10005', '10000', 'user'),
('user_l1_6', 'Level 1 - User 6', '0110000006', 'password123', '10006', '10000', 'user'),
('user_l1_7', 'Level 1 - User 7', '0110000007', 'password123', '10007', '10000', 'user'),
('user_l1_8', 'Level 1 - User 8', '0110000008', 'password123', '10008', '10000', 'user');

-- 4. INSERT LEVEL 2 DOWNLINES (Under User L1-1)
INSERT INTO public.users (username, name, phone, password, pin, referral_pin, role) VALUES 
('user_l2_1', 'Level 2 - User 1', '0120000001', 'password123', '20001', '10001', 'user'),
('user_l2_2', 'Level 2 - User 2', '0120000002', 'password123', '20002', '10001', 'user');

-- 5. INSERT LEVEL 3 DOWNLINES (Under User L2-1)
INSERT INTO public.users (username, name, phone, password, pin, referral_pin, role) VALUES 
('user_l3_1', 'Level 3 - User 1', '0130000001', 'password123', '30001', '20001', 'user');
