BEGIN;

ALTER TABLE profiles ALTER COLUMN selected_theme SET DEFAULT 'flame';
ALTER TABLE profiles ALTER COLUMN selected_background SET DEFAULT 'light';

UPDATE profiles
SET selected_theme = 'flame'
WHERE selected_theme IS NULL
   OR selected_theme NOT IN ('flame', 'ultra', 'mint', 'grape', 'pink', 'lime', 'sun', 'sky');

UPDATE profiles
SET selected_background = 'light'
WHERE selected_background IS NULL
   OR selected_background NOT IN ('light', 'dark');

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_accent_ink;
ALTER TABLE profiles ADD CONSTRAINT valid_accent_ink
  CHECK (selected_theme IN ('flame', 'ultra', 'mint', 'grape', 'pink', 'lime', 'sun', 'sky'));

ALTER TABLE profiles DROP CONSTRAINT IF EXISTS valid_paper_mode;
ALTER TABLE profiles ADD CONSTRAINT valid_paper_mode
  CHECK (selected_background IN ('light', 'dark'));

COMMENT ON COLUMN profiles.selected_theme IS 'Accent ink (Ink & Riso): flame|ultra|mint|grape|pink|lime|sun|sky';
COMMENT ON COLUMN profiles.selected_background IS 'Paper mode: light (Daylight) | dark (After Hours)';

UPDATE profiles p
SET total_whisprs = COALESCE((SELECT COUNT(*) FROM whisprs w WHERE w.user_id = p.user_id), 0);

COMMIT;
