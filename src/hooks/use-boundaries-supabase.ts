"use client";

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { Coordinates } from '@/lib/geospatial';

export interface Constituency {
  id: string;
  name: string;
  code: string | null;
}

export interface Ward {
  id: string;
  name: string;
  constituency_name: string | null;
  code: string | null;
}

interface UseBoundariesResult {
  detectedConstituency: Constituency | null;
  detectedWard: Ward | null;
  loading: boolean;
  error: Error | null;
  detectLocation: (location: Coordinates) => Promise<void>;
}

/**
 * Custom hook to detect constituency and ward from user location
 * Uses PostGIS point-in-polygon queries
 */
export function useBoundaries(): UseBoundariesResult {
  const [detectedConstituency, setDetectedConstituency] = useState<Constituency | null>(null);
  const [detectedWard, setDetectedWard] = useState<Ward | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const detectLocation = useCallback(async (location: Coordinates) => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createClient();

      // Detect constituency
      const { data: constituencyData, error: constituencyError } = await supabase
        .rpc('detect_constituency', {
          user_lat: location.lat,
          user_lng: location.lng
        }) as any;

      if (constituencyError) {
        console.error('Error detecting constituency:', constituencyError);
      } else if (constituencyData && constituencyData.length > 0) {
        setDetectedConstituency(constituencyData[0]);
      }

      // Detect ward
      const { data: wardData, error: wardError } = await supabase
        .rpc('detect_ward', {
          user_lat: location.lat,
          user_lng: location.lng
        }) as any;

      if (wardError) {
        console.error('Error detecting ward:', wardError);
      } else if (wardData && wardData.length > 0) {
        setDetectedWard(wardData[0]);
      }

      setLoading(false);
    } catch (err) {
      console.error('Error detecting location:', err);
      setError(err instanceof Error ? err : new Error('Failed to detect location'));
      setLoading(false);
    }
  }, []);

  return {
    detectedConstituency,
    detectedWard,
    loading,
    error,
    detectLocation
  };
}
