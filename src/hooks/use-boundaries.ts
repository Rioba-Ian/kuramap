"use client";

import { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import { Coordinates, detectBoundary } from '@/lib/geospatial';

export interface Boundary {
  id: string;
  name: string;
  code?: string;
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface UseBoundariesResult {
  constituencies: Boundary[];
  wards: Boundary[];
  loading: boolean;
  error: Error | null;
  detectConstituency: (point: Coordinates) => Boundary | null;
  detectWard: (point: Coordinates) => Boundary | null;
}

/**
 * Custom hook to fetch constituency and ward boundaries from Firestore
 */
export function useBoundaries(): UseBoundariesResult {
  const [constituencies, setConstituencies] = useState<Boundary[]>([]);
  const [wards, setWards] = useState<Boundary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchBoundaries = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch constituencies
        const constituenciesSnapshot = await getDocs(collection(db, 'constituencies'));
        const constituenciesData = constituenciesSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          code: doc.data().code,
          geometry: doc.data().geometry
        }));
        setConstituencies(constituenciesData);

        // Fetch wards
        const wardsSnapshot = await getDocs(collection(db, 'wards'));
        const wardsData = wardsSnapshot.docs.map(doc => ({
          id: doc.id,
          name: doc.data().name,
          code: doc.data().code,
          geometry: doc.data().geometry
        }));
        setWards(wardsData);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching boundaries:', err);
        setError(err instanceof Error ? err : new Error('Failed to fetch boundaries'));
        setLoading(false);
      }
    };

    fetchBoundaries();
  }, []);

  const detectConstituency = (point: Coordinates): Boundary | null => {
    return detectBoundary(point, constituencies);
  };

  const detectWard = (point: Coordinates): Boundary | null => {
    return detectBoundary(point, wards);
  };

  return {
    constituencies,
    wards,
    loading,
    error,
    detectConstituency,
    detectWard
  };
}
