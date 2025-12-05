-- Henley AI Pathfinder - Supabase Database Schema
-- Run this in your Supabase SQL Editor to create the participants table

-- Create participants table
CREATE TABLE IF NOT EXISTS participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  timestamp TIMESTAMPTZ DEFAULT NOW(),

  -- Basic Details
  name TEXT NOT NULL,
  organisation TEXT NOT NULL,
  role TEXT NOT NULL,
  focus_area TEXT NOT NULL,

  -- Conversational Answers
  ai_hope TEXT NOT NULL,
  ai_stuck TEXT NOT NULL,
  ai_tried TEXT NOT NULL,
  workshop_success TEXT NOT NULL,

  -- AI Analysis
  summary TEXT NOT NULL,
  track TEXT NOT NULL,
  readiness TEXT NOT NULL,
  themes JSONB NOT NULL,

  -- Metadata
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on timestamp for faster sorting
CREATE INDEX IF NOT EXISTS idx_participants_timestamp ON participants(timestamp DESC);

-- Create index on focus_area for filtering
CREATE INDEX IF NOT EXISTS idx_participants_focus_area ON participants(focus_area);

-- Create index on readiness for filtering
CREATE INDEX IF NOT EXISTS idx_participants_readiness ON participants(readiness);

-- Enable Row Level Security (RLS)
ALTER TABLE participants ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for form submissions)
CREATE POLICY "Allow anonymous inserts" ON participants
  FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create policy to allow authenticated reads (for admin dashboard)
CREATE POLICY "Allow authenticated reads" ON participants
  FOR SELECT
  TO authenticated
  USING (true);

-- Optional: Create policy to allow public reads (if you want admin dashboard without auth)
-- Uncomment the lines below if you want to allow unauthenticated admin access
-- WARNING: This makes all participant data publicly readable
-- CREATE POLICY "Allow public reads" ON participants
--   FOR SELECT
--   TO anon
--   USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_participants_updated_at
  BEFORE UPDATE ON participants
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON participants TO anon, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;

-- Success message
DO $$
BEGIN
  RAISE NOTICE 'Participants table created successfully!';
  RAISE NOTICE 'Anonymous users can INSERT (form submissions)';
  RAISE NOTICE 'Authenticated users can SELECT (admin dashboard)';
END $$;
