-- Enable PostGIS extension (if not already enabled)
CREATE EXTENSION IF NOT EXISTS postgis;

-- Drop existing tables if they exist (for clean migration)
DROP TABLE IF EXISTS polling_station_reviews CASCADE;
DROP TABLE IF EXISTS polling_stations CASCADE;
DROP TABLE IF EXISTS wards CASCADE;
DROP TABLE IF EXISTS constituencies CASCADE;

-- Create constituencies table with polygon boundaries
CREATE TABLE constituencies (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  code TEXT,
  boundary GEOGRAPHY(MULTIPOLYGON, 4326),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create wards table with polygon boundaries
CREATE TABLE wards (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  constituency_id TEXT REFERENCES constituencies(id),
  constituency_name TEXT,
  code TEXT,
  boundary GEOGRAPHY(MULTIPOLYGON, 4326),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create polling_stations table with PostGIS point location
CREATE TABLE polling_stations (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT,
  constituency TEXT NOT NULL,
  ward TEXT NOT NULL,
  station_code TEXT,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  type TEXT DEFAULT 'registration' CHECK (type IN ('registration', 'polling', 'both')),
  voter_count INTEGER,
  operating_hours TEXT DEFAULT '08:00 AM - 05:00 PM (Mon-Fri)',
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create reviews table (user feedback on stations)
CREATE TABLE polling_station_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id TEXT NOT NULL REFERENCES polling_stations(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  wait_time_minutes INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create spatial indexes for fast nearest-neighbor queries
CREATE INDEX IF NOT EXISTS polling_stations_location_gist_idx
  ON polling_stations USING GIST (location);

CREATE INDEX IF NOT EXISTS constituencies_boundary_gist_idx
  ON constituencies USING GIST (boundary);

CREATE INDEX IF NOT EXISTS wards_boundary_gist_idx
  ON wards USING GIST (boundary);

-- Create regular indexes for faster lookups
CREATE INDEX IF NOT EXISTS polling_stations_constituency_idx
  ON polling_stations(constituency);

CREATE INDEX IF NOT EXISTS polling_stations_ward_idx
  ON polling_stations(ward);

CREATE INDEX IF NOT EXISTS polling_station_reviews_station_id_idx
  ON polling_station_reviews(station_id);

CREATE INDEX IF NOT EXISTS polling_station_reviews_user_id_idx
  ON polling_station_reviews(user_id);

-- Enable Row Level Security
ALTER TABLE polling_stations ENABLE ROW LEVEL SECURITY;
ALTER TABLE constituencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE wards ENABLE ROW LEVEL SECURITY;
ALTER TABLE polling_station_reviews ENABLE ROW LEVEL SECURITY;

-- RLS Policies: Public read-only for polling data
CREATE POLICY "Public can view polling stations"
  ON polling_stations FOR SELECT
  USING (true);

CREATE POLICY "Public can view constituencies"
  ON constituencies FOR SELECT
  USING (true);

CREATE POLICY "Public can view wards"
  ON wards FOR SELECT
  USING (true);

CREATE POLICY "Public can view reviews"
  ON polling_station_reviews FOR SELECT
  USING (true);

-- Users can create reviews (must be authenticated)
CREATE POLICY "Authenticated users can create reviews"
  ON polling_station_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own reviews
CREATE POLICY "Users can update their own reviews"
  ON polling_station_reviews FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own reviews
CREATE POLICY "Users can delete their own reviews"
  ON polling_station_reviews FOR DELETE
  USING (auth.uid() = user_id);

-- Function: Get nearest polling stations with distance calculation
-- Uses KNN operator (<->) for efficient nearest-neighbor search
CREATE OR REPLACE FUNCTION get_nearest_stations(
  user_lat FLOAT,
  user_lng FLOAT,
  limit_count INT DEFAULT 10,
  max_distance_meters INT DEFAULT 50000
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  address TEXT,
  constituency TEXT,
  ward TEXT,
  station_code TEXT,
  type TEXT,
  operating_hours TEXT,
  lat FLOAT,
  lng FLOAT,
  distance_meters FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.id,
    ps.name,
    ps.address,
    ps.constituency,
    ps.ward,
    ps.station_code,
    ps.type,
    ps.operating_hours,
    ST_Y(ps.location::geometry) AS lat,
    ST_X(ps.location::geometry) AS lng,
    ST_Distance(
      ps.location,
      ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
    ) AS distance_meters
  FROM polling_stations ps
  WHERE ST_DWithin(
    ps.location,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography,
    max_distance_meters
  )
  ORDER BY ps.location <-> ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)::geography
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Detect constituency from user location (point-in-polygon)
CREATE OR REPLACE FUNCTION detect_constituency(
  user_lat FLOAT,
  user_lng FLOAT
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  code TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    c.id,
    c.name,
    c.code
  FROM constituencies c
  WHERE ST_Contains(
    c.boundary::geometry,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Detect ward from user location (point-in-polygon)
CREATE OR REPLACE FUNCTION detect_ward(
  user_lat FLOAT,
  user_lng FLOAT
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  constituency_name TEXT,
  code TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    w.id,
    w.name,
    w.constituency_name,
    w.code
  FROM wards w
  WHERE ST_Contains(
    w.boundary::geometry,
    ST_SetSRID(ST_MakePoint(user_lng, user_lat), 4326)
  )
  LIMIT 1;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Get stations by constituency
CREATE OR REPLACE FUNCTION get_stations_by_constituency(
  constituency_name TEXT,
  limit_count INT DEFAULT 100
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  address TEXT,
  constituency TEXT,
  ward TEXT,
  lat FLOAT,
  lng FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.id,
    ps.name,
    ps.address,
    ps.constituency,
    ps.ward,
    ST_Y(ps.location::geometry) AS lat,
    ST_X(ps.location::geometry) AS lng
  FROM polling_stations ps
  WHERE ps.constituency ILIKE constituency_name
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Function: Search stations by name/constituency/ward
CREATE OR REPLACE FUNCTION search_stations(
  search_query TEXT,
  limit_count INT DEFAULT 50
)
RETURNS TABLE (
  id TEXT,
  name TEXT,
  address TEXT,
  constituency TEXT,
  ward TEXT,
  lat FLOAT,
  lng FLOAT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    ps.id,
    ps.name,
    ps.address,
    ps.constituency,
    ps.ward,
    ST_Y(ps.location::geometry) AS lat,
    ST_X(ps.location::geometry) AS lng
  FROM polling_stations ps
  WHERE
    ps.name ILIKE '%' || search_query || '%'
    OR ps.constituency ILIKE '%' || search_query || '%'
    OR ps.ward ILIKE '%' || search_query || '%'
  LIMIT limit_count;
END;
$$ LANGUAGE plpgsql STABLE;

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers for updated_at
CREATE TRIGGER update_polling_stations_updated_at
  BEFORE UPDATE ON polling_stations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_constituencies_updated_at
  BEFORE UPDATE ON constituencies
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wards_updated_at
  BEFORE UPDATE ON wards
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
