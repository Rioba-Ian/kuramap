/**
 * TypeScript types for Supabase database schema
 * Generated from: supabase gen types typescript --local
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      polling_stations: {
        Row: {
          id: string
          name: string
          address: string | null
          constituency: string
          ward: string
          station_code: string | null
          location: unknown // PostGIS geography type
          type: 'registration' | 'polling' | 'both'
          voter_count: number | null
          operating_hours: string
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          address?: string | null
          constituency: string
          ward: string
          station_code?: string | null
          location: unknown
          type?: 'registration' | 'polling' | 'both'
          voter_count?: number | null
          operating_hours?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          address?: string | null
          constituency?: string
          ward?: string
          station_code?: string | null
          location?: unknown
          type?: 'registration' | 'polling' | 'both'
          voter_count?: number | null
          operating_hours?: string
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      constituencies: {
        Row: {
          id: string
          name: string
          code: string | null
          boundary: unknown // PostGIS geography type
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          code?: string | null
          boundary?: unknown
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          code?: string | null
          boundary?: unknown
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      wards: {
        Row: {
          id: string
          name: string
          constituency_id: string | null
          constituency_name: string | null
          code: string | null
          boundary: unknown // PostGIS geography type
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          name: string
          constituency_id?: string | null
          constituency_name?: string | null
          code?: string | null
          boundary?: unknown
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          constituency_id?: string | null
          constituency_name?: string | null
          code?: string | null
          boundary?: unknown
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
      }
      polling_station_reviews: {
        Row: {
          id: string
          station_id: string
          user_id: string | null
          rating: number | null
          comment: string | null
          wait_time_minutes: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          station_id: string
          user_id?: string | null
          rating?: number | null
          comment?: string | null
          wait_time_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          station_id?: string
          user_id?: string | null
          rating?: number | null
          comment?: string | null
          wait_time_minutes?: number | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_nearest_stations: {
        Args: {
          user_lat: number
          user_lng: number
          limit_count?: number
          max_distance_meters?: number
        }
        Returns: Array<{
          id: string
          name: string
          address: string
          constituency: string
          ward: string
          station_code: string
          type: string
          operating_hours: string
          lat: number
          lng: number
          distance_meters: number
        }>
      }
      detect_constituency: {
        Args: {
          user_lat: number
          user_lng: number
        }
        Returns: Array<{
          id: string
          name: string
          code: string
        }>
      }
      detect_ward: {
        Args: {
          user_lat: number
          user_lng: number
        }
        Returns: Array<{
          id: string
          name: string
          constituency_name: string
          code: string
        }>
      }
      search_stations: {
        Args: {
          search_query: string
          limit_count?: number
        }
        Returns: Array<{
          id: string
          name: string
          address: string
          constituency: string
          ward: string
          lat: number
          lng: number
        }>
      }
      get_stations_by_constituency: {
        Args: {
          constituency_name: string
          limit_count?: number
        }
        Returns: Array<{
          id: string
          name: string
          address: string
          constituency: string
          ward: string
          lat: number
          lng: number
        }>
      }
    }
    Enums: {
      [_ in never]: never
    }
  }
}
