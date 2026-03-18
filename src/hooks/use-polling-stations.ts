"use client";

import { useState, useEffect } from "react";
import {
 collection,
 getDocs,
 query,
 limit as firestoreLimit,
} from "firebase/firestore";
import { db } from "@/firebase";
import { RegistrationCenter } from "@/lib/data";
import { Coordinates, sortByDistance, filterByRadius } from "@/lib/geospatial";

interface UsePollingStationsOptions {
 userLocation?: Coordinates | null;
 maxDistance?: number; // in kilometers
 maxResults?: number;
 constituency?: string;
 ward?: string;
}

interface UsePollingStationsResult {
 stations: RegistrationCenter[];
 loading: boolean;
 error: Error | null;
 refetch: () => Promise<void>;
}

/**
 * Custom hook to fetch polling stations from Firestore with optional filtering
 */
export function usePollingStations(
 options: UsePollingStationsOptions = {},
): UsePollingStationsResult {
 const {
  userLocation,
  maxDistance = 50, // Default 50km radius
  maxResults = 100,
  constituency,
  ward,
 } = options;

 const [stations, setStations] = useState<RegistrationCenter[]>([]);
 const [loading, setLoading] = useState(true);
 const [error, setError] = useState<Error | null>(null);

 const fetchStations = async () => {
  try {
   setLoading(true);
   setError(null);

   // Build query
   let q = query(
    collection(db, "pollingStations"),
    firestoreLimit(maxResults * 2), // Fetch more to account for filtering
   );

   const snapshot = await getDocs(q);

   let fetchedStations: RegistrationCenter[] = snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
     id: doc.id,
     name: data.name || "Unknown Station",
     address:
      data.address ||
      data.metadata?.address ||
      `${data.ward} Ward, ${data.constituency}`,
     constituency: data.constituency || "Unknown",
     ward: data.ward || "Unknown",
     coordinates: {
      lat: data.coordinates?.lat || 0,
      lng: data.coordinates?.lng || 0,
     },
     operatingHours: data.operatingHours || "08:00 AM - 05:00 PM (Mon-Fri)",
     reviews: data.reviews || [],
    };
   });

   // Filter by constituency if specified
   if (constituency) {
    fetchedStations = fetchedStations.filter(
     (s) => s.constituency.toLowerCase() === constituency.toLowerCase(),
    );
   }

   // Filter by ward if specified
   if (ward) {
    fetchedStations = fetchedStations.filter(
     (s) => s.ward.toLowerCase() === ward.toLowerCase(),
    );
   }

   // Filter by distance and sort if user location is available
   if (userLocation) {
    // Filter within radius
    fetchedStations = filterByRadius(
     fetchedStations,
     userLocation,
     maxDistance,
    );

    // Sort by distance
    const stationsWithDistance = sortByDistance(fetchedStations, userLocation);

    // Limit results
    setStations(stationsWithDistance.slice(0, maxResults));
   } else {
    // Just limit results if no user location
    setStations(fetchedStations.slice(0, maxResults));
   }

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

 if (constituency && constituency.toLowerCase() !== "all") {
  filteredStations = stations.filter((s) => s.constituency === constituency);
 }

 const wards = new Set(filteredStations.map((s) => s.ward));
 return Array.from(wards).sort();
}
