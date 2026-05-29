-- Migration: add time_of_birth and place_of_birth columns
-- For consultations table
ALTER TABLE consultations
  ADD COLUMN time_of_birth TIME NULL,
  ADD COLUMN place_of_birth VARCHAR(255) NULL;

-- For demo_bookings table
ALTER TABLE demo_bookings
  ADD COLUMN time_of_birth TIME NULL,
  ADD COLUMN place_of_birth VARCHAR(255) NULL;
