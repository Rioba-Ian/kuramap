"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { RegistrationCenter } from "@/lib/data";
import { Coordinates } from "@/lib/geospatial";

interface UsePollingStationsOptions {
 userLocation?: Coordinates | null;
 maxDistance?: number; // in meters
 maxResults?: number;
 constituency?: string;
 ward?: string;
 searchQuery?: string;
}

interface UsePollingStationsResult {
 stations: RegistrationCenter[];
 loading: boolean;
 error: Error | null;
 refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch polling stations from Supabase + PostGIS
 * Uses efficient spatial queries for nearest-neighbor search
 */
export function usePollingStations(
 options: UsePollingStationsOptions = {},
): UsePollingStationsResult {
 const {
  userLocation,
  maxDistance = 50000, // 50km default
  maxResults = 100,
  constituency,
  ward,
  searchQuery,
 } = options;

 const [stations, setStations] = useState<RegistrationCenter[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<Error | null>(null);

 const fetchStations = async () => {
  try {
   setLoading(true);
   setError(null);

   const supabase = createClient();

   let fetchedStations: RegistrationCenter[] = [];

   // Priority 1: Search by query if provided
   if (searchQuery && searchQuery.trim()) {
    const { data, error: searchError } = (await supabase.rpc(
     "search_stations",
     {
      search_query: searchQuery,
      limit_count: maxResults,
     },
    )) as any;

    if (searchError) throw searchError;

    fetchedStations = (data || []).map((station: any) => ({
     id: station.id,
     name: station.name,
     address:
      station.address || `${station.ward} Ward, ${station.constituency}`,
     constituency: station.constituency,
     ward: station.ward,
     coordinates: {
      lat: station.lat,
      lng: station.lng,
     },
     operatingHours: "08:00 AM - 05:00 PM (Mon-Fri)",
     reviews: [],
     distance: undefined,
    }));
   }
   // Priority 2: Filter by constituency if provided
   else if (constituency && constituency !== "all" && constituency !== "") {
    const { data, error: constituencyError } = (await supabase.rpc(
     "get_stations_by_constituency",
     {
      constituency_name: constituency,
      limit_count: maxResults,
     },
    )) as any;

    if (constituencyError) throw constituencyError;

    fetchedStations = (data || []).map((station: any) => ({
     id: station.id,
     name: station.name,
     address:
      station.address || `${station.ward} Ward, ${station.constituency}`,
     constituency: station.constituency,
     ward: station.ward,
     coordinates: {
      lat: station.lat,
      lng: station.lng,
     },
     operatingHours: "08:00 AM - 05:00 PM (Mon-Fri)",
     reviews: [],
     distance: undefined,
    }));

    // Further filter by ward if specified
    if (ward && ward !== "") {
     fetchedStations = fetchedStations.filter(
      (s) => s.ward.toLowerCase() === ward.toLowerCase(),
     );
    }
   }
   // Priority 3: Get nearest stations if user location available
   else if (userLocation) {
    const { data, error: nearestError } = (await supabase.rpc(
     "get_nearest_stations",
     {
      user_lat: userLocation.lat,
      user_lng: userLocation.lng,
      limit_count: maxResults,
      max_distance_meters: maxDistance,
     },
    )) as any;

    if (nearestError) throw nearestError;

    fetchedStations = (data || []).map((station: any) => ({
     id: station.id,
     name: station.name,
     address:
      station.address || `${station.ward} Ward, ${station.constituency}`,
     constituency: station.constituency,
     ward: station.ward,
     coordinates: {
      lat: station.lat,
      lng: station.lng,
     },
     operatingHours: station.operating_hours,
     reviews: [],
     distance: station.distance_meters / 1000, // Convert to km
    }));
   }
   // Fallback: Get first N stations (sorted by name)
   else {
    const { data, error: fallbackError } = await supabase
     .from("polling_stations")
     .select(
      `
            id,
            name,
            address,
            constituency,
            ward,
            operating_hours,
            location
          `,
     )
     .limit(maxResults);

    if (fallbackError) throw fallbackError;

    fetchedStations = (data || []).map((station) => {
     // Parse location from PostGIS geography
     const locationMatch = station.location
      ?.toString()
      .match(/POINT\(([-\d.]+)\s+([-\d.]+)\)/);
     const lng = locationMatch ? parseFloat(locationMatch[1]) : 0;
     const lat = locationMatch ? parseFloat(locationMatch[2]) : 0;

     return {
      id: station.id,
      name: station.name,
      address:
       station.address || `${station.ward} Ward, ${station.constituency}`,
      constituency: station.constituency,
      ward: station.ward,
      coordinates: { lat, lng },
      operatingHours: station.operating_hours,
      reviews: [],
      distance: undefined,
     };
    });
   }

   setStations(fetchedStations);
   setLoading(false);
  } catch (err) {
   console.error("Error fetching polling stations:", err);
   setError(err instanceof Error ? err : new Error("Failed to fetch stations"));
   setLoading(false);
  }
 };

 useEffect(() => {
  fetchStations();
 }, [
  userLocation?.lat,
  userLocation?.lng,
  constituency,
  ward,
  searchQuery,
  maxDistance,
  maxResults,
 ]);

 return {
  stations,
  loading,
  error,
  refetch: fetchStations,
 };
}

/**
 * Get unique constituencies from stations
 */
export function getUniqueConstituencies(
 stations: RegistrationCenter[],
): string[] {
 const constituencies = new Set(stations.map((s) => s.constituency));
 return Array.from(constituencies).sort();
}

/**
 * Get unique wards from stations, optionally filtered by constituency
 */
export function getUniqueWards(
 stations: RegistrationCenter[],
 constituency?: string,
): string[] {
 let filteredStations = stations;

 if (
  constituency &&
  constituency.toLowerCase() !== "all" &&
  constituency !== ""
 ) {
  filteredStations = stations.filter((s) => s.constituency === constituency);
 }

 const wards = new Set(filteredStations.map((s) => s.ward));
 return Array.from(wards).sort();
}
