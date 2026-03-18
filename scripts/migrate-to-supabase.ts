/**
 * Migrate polling stations data from GeoJSON to Supabase + PostGIS
 *
 * Usage:
 * 1. Make sure you have data/*.geojson files
 * 2. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env
 * 3. Run: npx tsx scripts/migrate-to-supabase.ts
 */

import * as fs from "fs";
import * as path from "path";
import { createClient } from "@supabase/supabase-js";
import type { Database } from "../src/lib/supabase/database.types";

// Load environment variables
import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });
dotenv.config();

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !supabaseServiceKey) {
 console.error("❌ Error: Missing Supabase credentials");
 console.log("Required environment variables:");
 console.log("  - NEXT_PUBLIC_SUPABASE_URL");
 console.log(
  "  - SUPABASE_SERVICE_ROLE_KEY (get from Supabase Dashboard → Settings → API)",
 );
 process.exit(1);
}

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey, {
 auth: {
  autoRefreshToken: false,
  persistSession: false,
 },
});

interface GeoJSONFeature {
 type: "Feature";
 properties: Record<string, any>;
 geometry: {
  type: string;
  coordinates: any;
 };
}

interface GeoJSONCollection {
 type: "FeatureCollection";
 features: GeoJSONFeature[];
}

// Helper to convert GeoJSON geometry to WKT (Well-Known Text) for PostGIS
function geometryToWKT(geometry: any): string {
 if (geometry.type === "Point") {
  const [lng, lat] = geometry.coordinates;
  return `POINT(${lng} ${lat})`;
 } else if (geometry.type === "Polygon") {
  // Convert Polygon to MultiPolygon for compatibility with MULTIPOLYGON column type
  const rings = geometry.coordinates;
  const polygonWKT = rings
   .map((ring: number[][]) => {
    const points = ring.map(([lng, lat]) => `${lng} ${lat}`).join(", ");
    return `(${points})`;
   })
   .join(", ");
  // Wrap as MultiPolygon: MULTIPOLYGON(((...)))
  return `MULTIPOLYGON((${polygonWKT}))`;
 } else if (geometry.type === "MultiPolygon") {
  const polygons = geometry.coordinates;
  const multiPolygonWKT = polygons
   .map((polygon: number[][][]) => {
    const rings = polygon
     .map((ring: number[][]) => {
      const points = ring.map(([lng, lat]) => `${lng} ${lat}`).join(", ");
      return `(${points})`;
     })
     .join(", ");
    return `(${rings})`;
   })
   .join(", ");
  return `MULTIPOLYGON(${multiPolygonWKT})`;
 }
 throw new Error(`Unsupported geometry type: ${geometry.type}`);
}

async function uploadPollingStations(filePath: string) {
 console.log("\n📍 Uploading Polling Stations...");

 const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, "utf-8"));
 console.log(`   Found ${data.features.length} stations in file`);

 const BATCH_SIZE = 100;
 let count = 0;
 let successCount = 0;
 let errorCount = 0;

 for (let i = 0; i < data.features.length; i += BATCH_SIZE) {
  const batch = data.features.slice(i, i + BATCH_SIZE);

  const records = batch.map((feature) => {
   const props = feature.properties;
   const [lng, lat] = feature.geometry.coordinates;

   return {
    id: props.id || `station_${count++}`,
    name: props.name || props.station_name || "Unknown Station",
    address:
     props.address ||
     `${props.ward || "Unknown"} Ward, ${props.constituen?.trim() || props.constituency || "Unknown"}`,
    constituency: props.constituen?.trim() || props.constituency || "Unknown",
    ward: props.ward || "Unknown",
    station_code: props.station_code || props.code || null,
    location: `POINT(${lng} ${lat})`,
    type: (props.type || "registration") as "registration" | "polling" | "both",
    voter_count: props.voter_count || null,
    operating_hours: props.operating_hours || "08:00 AM - 05:00 PM (Mon-Fri)",
    metadata: props,
   };
  });

  const { error } = await supabase.from("polling_stations").insert(records);

  if (error) {
   console.error(`  ❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
   errorCount += batch.length;
  } else {
   successCount += batch.length;
   console.log(`  ✓ Uploaded ${successCount} stations...`);
  }

  // Small delay to avoid rate limits
  await new Promise((resolve) => setTimeout(resolve, 100));
 }

 console.log(`  ✅ Successfully uploaded ${successCount} polling stations`);
 if (errorCount > 0) {
  console.log(`  ⚠️  ${errorCount} stations failed`);
 }
 return successCount;
}

async function uploadConstituencies(filePath: string) {
 console.log("\n🏛️  Uploading Constituencies...");

 const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, "utf-8"));
 console.log(`   Found ${data.features.length} constituencies in file`);

 const BATCH_SIZE = 50;
 let successCount = 0;
 let errorCount = 0;

 for (let i = 0; i < data.features.length; i += BATCH_SIZE) {
  const batch = data.features.slice(i, i + BATCH_SIZE);

  const records = batch.map((feature, idx) => {
   const props = feature.properties;
   const wkt = geometryToWKT(feature.geometry);

   return {
    id:
     props.CONST_CODE?.toString() ||
     props.code ||
     props.id ||
     props.CONSTITUEN?.toLowerCase().replace(/\s+/g, "-") ||
     `constituency_${i + idx}`,
    name: props.CONSTITUEN || props.name || props.constituency || "Unknown",
    code: props.CONST_CODE?.toString() || props.code || null,
    boundary: wkt,
    metadata: props,
   };
  });

  const { error } = await supabase.from("constituencies").insert(records);

  if (error) {
   console.error(`  ❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
   errorCount += batch.length;
  } else {
   successCount += batch.length;
   console.log(`  ✓ Uploaded ${successCount} constituencies...`);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
 }

 console.log(`  ✅ Successfully uploaded ${successCount} constituencies`);
 if (errorCount > 0) {
  console.log(`  ⚠️  ${errorCount} constituencies failed`);
 }
 return successCount;
}

async function uploadWards(filePath: string) {
 console.log("\n🏘️  Uploading Wards...");

 const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, "utf-8"));
 console.log(`   Found ${data.features.length} wards in file`);

 const BATCH_SIZE = 50;
 let successCount = 0;
 let errorCount = 0;

 for (let i = 0; i < data.features.length; i += BATCH_SIZE) {
  const batch = data.features.slice(i, i + BATCH_SIZE);

  const records = batch.map((feature, idx) => {
   const props = feature.properties;
   const wkt = geometryToWKT(feature.geometry);

   return {
    id:
     props.CONST_CODE?.toString() +
      "_" +
      props.NAME?.toLowerCase().replace(/\s+/g, "-") ||
     props.code ||
     props.id ||
     props.NAME?.toLowerCase().replace(/\s+/g, "-") ||
     `ward_${i + idx}`,
    name: props.NAME || props.name || props.ward || "Unknown",
    constituency_id:
     props.CONST_CODE?.toString() ||
     props.constituency_code ||
     props.constituency_id ||
     null,
    constituency_name:
     props.CONSTITUEN || props.constituency || props.constituency_name || null,
    code: props.code || null,
    boundary: wkt,
    metadata: props,
   };
  });

  const { error } = await supabase.from("wards").insert(records);

  if (error) {
   console.error(`  ❌ Error in batch ${i / BATCH_SIZE + 1}:`, error.message);
   errorCount += batch.length;
  } else {
   successCount += batch.length;
   console.log(`  ✓ Uploaded ${successCount} wards...`);
  }

  await new Promise((resolve) => setTimeout(resolve, 100));
 }

 console.log(`  ✅ Successfully uploaded ${successCount} wards`);
 if (errorCount > 0) {
  console.log(`  ⚠️  ${errorCount} wards failed`);
 }
 return successCount;
}

async function main() {
 console.log("🇰🇪 Supabase + PostGIS Migration Script");
 console.log("========================================\n");

 const dataDir = path.join(process.cwd(), "data");

 if (!fs.existsSync(dataDir)) {
  console.error("❌ Error: /data directory not found");
  process.exit(1);
 }

 const files = {
  pollingStations: path.join(dataDir, "polling-stations.geojson"),
  constituencies: path.join(dataDir, "constituencies.geojson"),
  wards: path.join(dataDir, "wards.geojson"),
 };

 try {
  // Test Supabase connection
  const { error: testError } = await supabase
   .from("polling_stations")
   .select("count")
   .limit(1);
  if (testError) {
   console.error("❌ Error connecting to Supabase:", testError);
   console.log("\nMake sure you have:");
   console.log("1. Run the SQL migration in Supabase SQL Editor");
   console.log("2. Set correct environment variables");
   process.exit(1);
  }

  // Upload polling stations
  if (fs.existsSync(files.pollingStations)) {
   await uploadPollingStations(files.pollingStations);
  } else {
   console.log("⚠️  Skipping polling stations (file not found)");
  }

  // Upload constituencies
  if (fs.existsSync(files.constituencies)) {
   await uploadConstituencies(files.constituencies);
  } else {
   console.log("⚠️  Skipping constituencies (file not found)");
  }

  // Upload wards
  if (fs.existsSync(files.wards)) {
   await uploadWards(files.wards);
  } else {
   console.log("⚠️  Skipping wards (file not found)");
  }

  console.log("\n✅ Migration complete!");
  console.log("\nNext steps:");
  console.log("1. Verify data in Supabase Dashboard → Table Editor");
  console.log("2. Test the RPC functions in SQL Editor");
  console.log("3. Update your Next.js app to use Supabase");
 } catch (error) {
  console.error("\n❌ Migration failed:", error);
  process.exit(1);
 }
}

main();
