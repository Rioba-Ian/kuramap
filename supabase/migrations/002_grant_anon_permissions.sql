-- Grant permissions to anon role for public read access
-- This is required even with RLS policies

-- Grant SELECT on all tables to anon role
GRANT SELECT ON polling_stations TO anon;
GRANT SELECT ON constituencies TO anon;
GRANT SELECT ON wards TO anon;
GRANT SELECT ON polling_station_reviews TO anon;

-- Grant EXECUTE on all RPC functions to anon role
GRANT EXECUTE ON FUNCTION get_nearest_stations(FLOAT, FLOAT, INT, INT) TO anon;
GRANT EXECUTE ON FUNCTION detect_constituency(FLOAT, FLOAT) TO anon;
GRANT EXECUTE ON FUNCTION detect_ward(FLOAT, FLOAT) TO anon;
GRANT EXECUTE ON FUNCTION get_stations_by_constituency(TEXT, INT) TO anon;
GRANT EXECUTE ON FUNCTION search_stations(TEXT, INT) TO anon;

-- Grant INSERT on reviews for authenticated users (for future review feature)
GRANT INSERT ON polling_station_reviews TO authenticated;
GRANT UPDATE ON polling_station_reviews TO authenticated;
GRANT DELETE ON polling_station_reviews TO authenticated;
