/*
# Create tours and bookings tables (single-tenant, no auth)

1. New Tables
- `tours`: stores the travel tours (pre-populated with sample data).
  - id (uuid PK), title (text), slug (text unique), destination (text),
  - tour_type (text: yoga, hiking, eco, cultural), difficulty (text: easy, moderate, hard),
  - duration_days (int), price_toman (bigint), image_url (text), gallery (jsonb array of text),
  - description (text), itinerary (jsonb array of {day, title, description}),
  - included_services (jsonb array of text), guide_name (text), guide_bio (text),
  - guide_avatar_url (text), safety_guidelines (jsonb array of text), max_group_size (int),
  - rating (numeric), created_at (timestamptz)
- `bookings`: stores customer booking submissions.
  - id (uuid PK), tour_id (uuid FK -> tours), full_name (text), phone (text),
  - national_id (text), room_sharing (boolean), receipt_file_name (text),
  - status (text default 'pending'), created_at (timestamptz)

2. Security
- Enable RLS on both tables.
- Allow anon + authenticated CRUD (single-tenant, no sign-in screen).
- Tours are publicly readable; bookings can be created and read by anon.

3. Notes
- This is a no-auth marketplace: anyone can browse tours and submit a booking.
- Bookings are intentionally public-readable for demo simplicity.
*/

CREATE TABLE IF NOT EXISTS tours (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  destination text NOT NULL,
  tour_type text NOT NULL DEFAULT 'cultural',
  difficulty text NOT NULL DEFAULT 'easy',
  duration_days int NOT NULL DEFAULT 1,
  price_toman bigint NOT NULL DEFAULT 0,
  image_url text,
  gallery jsonb DEFAULT '[]'::jsonb,
  description text,
  itinerary jsonb DEFAULT '[]'::jsonb,
  included_services jsonb DEFAULT '[]'::jsonb,
  guide_name text,
  guide_bio text,
  guide_avatar_url text,
  safety_guidelines jsonb DEFAULT '[]'::jsonb,
  max_group_size int DEFAULT 12,
  rating numeric DEFAULT 4.8,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tours ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tours" ON tours;
CREATE POLICY "anon_select_tours" ON tours FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_tours" ON tours;
CREATE POLICY "anon_insert_tours" ON tours FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_tours" ON tours;
CREATE POLICY "anon_update_tours" ON tours FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_tours" ON tours;
CREATE POLICY "anon_delete_tours" ON tours FOR DELETE
  TO anon, authenticated USING (true);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tour_id uuid REFERENCES tours(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text NOT NULL,
  national_id text NOT NULL,
  room_sharing boolean NOT NULL DEFAULT false,
  receipt_file_name text,
  status text NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_bookings" ON bookings;
CREATE POLICY "anon_select_bookings" ON bookings FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "anon_insert_bookings" ON bookings;
CREATE POLICY "anon_insert_bookings" ON bookings FOR INSERT
  TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_update_bookings" ON bookings;
CREATE POLICY "anon_update_bookings" ON bookings FOR UPDATE
  TO anon, authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "anon_delete_bookings" ON bookings;
CREATE POLICY "anon_delete_bookings" ON bookings FOR DELETE
  TO anon, authenticated USING (true);
