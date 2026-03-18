/**
 * Geospatial utilities for calculating distances and detecting boundaries
 */

export interface Coordinates {
  lat: number;
  lng: number;
}

/**
 * Calculate distance between two points using the Haversine formula
 * @param point1 First coordinate
 * @param point2 Second coordinate
 * @returns Distance in kilometers
 */
export function calculateDistance(point1: Coordinates, point2: Coordinates): number {
  const R = 6371; // Earth's radius in kilometers
  const dLat = toRad(point2.lat - point1.lat);
  const dLng = toRad(point2.lng - point1.lng);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(point1.lat)) *
    Math.cos(toRad(point2.lat)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;

  return Math.round(distance * 10) / 10; // Round to 1 decimal
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Format distance for display
 */
export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
}

/**
 * Sort polling stations by distance from user location
 */
export function sortByDistance<T extends { coordinates: Coordinates }>(
  stations: T[],
  userLocation: Coordinates
): (T & { distance: number })[] {
  return stations
    .map(station => ({
      ...station,
      distance: calculateDistance(userLocation, station.coordinates)
    }))
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Filter stations within a radius
 */
export function filterByRadius<T extends { coordinates: Coordinates }>(
  stations: T[],
  userLocation: Coordinates,
  radiusKm: number
): T[] {
  return stations.filter(station =>
    calculateDistance(userLocation, station.coordinates) <= radiusKm
  );
}

/**
 * Point-in-polygon detection using ray casting algorithm
 * @param point The point to test
 * @param polygon Array of coordinates forming the polygon boundary
 */
export function isPointInPolygon(point: Coordinates, polygon: Coordinates[]): boolean {
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i].lng;
    const yi = polygon[i].lat;
    const xj = polygon[j].lng;
    const yj = polygon[j].lat;

    const intersect =
      yi > point.lat !== yj > point.lat &&
      point.lng < ((xj - xi) * (point.lat - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }
  return inside;
}

/**
 * Detect which constituency/ward contains the given point
 * Handles both Polygon and MultiPolygon GeoJSON geometries
 */
export function detectBoundary<T extends { geometry: { type: string; coordinates: any } }>(
  point: Coordinates,
  boundaries: T[]
): T | null {
  for (const boundary of boundaries) {
    const { type, coordinates } = boundary.geometry;

    if (type === 'Polygon') {
      // Polygon: coordinates[0] is the outer ring
      const polygonCoords = coordinates[0].map((coord: number[]) => ({
        lat: coord[1],
        lng: coord[0]
      }));

      if (isPointInPolygon(point, polygonCoords)) {
        return boundary;
      }
    } else if (type === 'MultiPolygon') {
      // MultiPolygon: coordinates is an array of polygons
      for (const polygon of coordinates) {
        const polygonCoords = polygon[0].map((coord: number[]) => ({
          lat: coord[1],
          lng: coord[0]
        }));

        if (isPointInPolygon(point, polygonCoords)) {
          return boundary;
        }
      }
    }
  }
  return null;
}
