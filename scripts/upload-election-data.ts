/**
 * Upload Kenya Election Data to Firestore
 *
 * Usage:
 * 1. Place your GeoJSON files in the /data directory:
 *    - data/polling-stations.geojson
 *    - data/constituencies.geojson
 *    - data/wards.geojson
 * 2. Run: npx tsx scripts/upload-election-data.ts
 */

import * as fs from 'fs';
import * as path from 'path';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

// Initialize Firebase Admin
// Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
// or provide the path to your service account key
const app = initializeApp();
const db = getFirestore(app);

interface PollingStationFeature {
  type: 'Feature';
  properties: {
    name?: string;
    station_name?: string;
    constituency?: string;
    ward?: string;
    type?: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Point';
    coordinates: [number, number]; // [lng, lat]
  };
}

interface BoundaryFeature {
  type: 'Feature';
  properties: {
    name?: string;
    constituency?: string;
    ward?: string;
    code?: string;
    [key: string]: any;
  };
  geometry: {
    type: 'Polygon' | 'MultiPolygon';
    coordinates: number[][][] | number[][][][];
  };
}

interface GeoJSONCollection {
  type: 'FeatureCollection';
  features: any[];
}

// Helper function to add delay between batches
function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function uploadPollingStations(filePath: string) {
  console.log('\n📍 Uploading Polling Stations...');

  const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`   Found ${data.features.length} stations in file`);
  console.log(`   Uploading in batches of 100 with 2s delay between batches...`);
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;
  const BATCH_SIZE = 100; // Reduced from 500 to avoid quota limits

  for (const feature of data.features as PollingStationFeature[]) {
    const props = feature.properties;
    const [lng, lat] = feature.geometry.coordinates;

    // Generate a unique ID (use existing ID or create from name)
    const id = props.id || `station_${count}`;

    const stationData = {
      id,
      name: props.name || props.station_name || 'Unknown Station',
      constituency: props.constituency || 'Unknown',
      ward: props.ward || 'Unknown',
      coordinates: {
        lat,
        lng
      },
      type: props.type || 'registration',
      operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
      // Preserve any additional metadata
      metadata: {
        ...props,
        imported: new Date().toISOString()
      }
    };

    batch.set(db.collection('pollingStations').doc(id), stationData);
    count++;
    batchCount++;

    // Upload in smaller batches to avoid quota limits
    if (batchCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  ✓ Uploaded ${count} stations...`);
      batch = db.batch(); // Create new batch
      batchCount = 0;

      // Add delay to avoid rate limits
      await delay(2000); // 2 second delay between batches
    }
  }

  // Commit remaining
  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✓ Uploaded ${count} stations (final batch)...`);
  }

  console.log(`  ✅ Successfully uploaded ${count} polling stations`);
  return count;
}

async function uploadConstituencies(filePath: string) {
  console.log('\n🏛️  Uploading Constituencies...');

  const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`   Found ${data.features.length} constituencies in file`);
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;
  const BATCH_SIZE = 50;

  for (const feature of data.features as BoundaryFeature[]) {
    const props = feature.properties;
    const id = props.code || props.name?.toLowerCase().replace(/\s+/g, '-') || `constituency_${count}`;

    const constituencyData = {
      id,
      name: props.name || props.constituency || 'Unknown',
      code: props.code || '',
      geometry: feature.geometry,
      metadata: {
        ...props,
        imported: new Date().toISOString()
      }
    };

    batch.set(db.collection('constituencies').doc(id), constituencyData);
    count++;
    batchCount++;

    if (batchCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  ✓ Uploaded ${count} constituencies...`);
      batch = db.batch(); // Create new batch
      batchCount = 0;
      await delay(2000);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✓ Uploaded ${count} constituencies (final batch)...`);
  }

  console.log(`  ✅ Successfully uploaded ${count} constituencies`);
  return count;
}

async function uploadWards(filePath: string) {
  console.log('\n🏘️  Uploading Wards...');

  const data: GeoJSONCollection = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  console.log(`   Found ${data.features.length} wards in file`);
  console.log(`   Uploading in batches of 50 with 2s delay between batches...`);
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;
  const BATCH_SIZE = 50;

  for (const feature of data.features as BoundaryFeature[]) {
    const props = feature.properties;
    const id = props.code || props.name?.toLowerCase().replace(/\s+/g, '-') || `ward_${count}`;

    const wardData = {
      id,
      name: props.name || props.ward || 'Unknown',
      constituency: props.constituency || 'Unknown',
      code: props.code || '',
      geometry: feature.geometry,
      metadata: {
        ...props,
        imported: new Date().toISOString()
      }
    };

    batch.set(db.collection('wards').doc(id), wardData);
    count++;
    batchCount++;

    if (batchCount >= BATCH_SIZE) {
      await batch.commit();
      console.log(`  ✓ Uploaded ${count} wards...`);
      batch = db.batch(); // Create new batch
      batchCount = 0;
      await delay(2000);
    }
  }

  if (batchCount > 0) {
    await batch.commit();
    console.log(`  ✓ Uploaded ${count} wards (final batch)...`);
  }

  console.log(`  ✅ Successfully uploaded ${count} wards`);
  return count;
}

async function main() {
  console.log('🇰🇪 Kenya Election Data Upload Script');
  console.log('=====================================\n');

  const dataDir = path.join(process.cwd(), 'data');

  // Check if data directory exists
  if (!fs.existsSync(dataDir)) {
    console.error('❌ Error: /data directory not found');
    console.log('\nPlease create a /data directory and add your GeoJSON files:');
    console.log('  - data/polling-stations.geojson');
    console.log('  - data/constituencies.geojson');
    console.log('  - data/wards.geojson');
    process.exit(1);
  }

  const files = {
    pollingStations: path.join(dataDir, 'polling-stations.geojson'),
    constituencies: path.join(dataDir, 'constituencies.geojson'),
    wards: path.join(dataDir, 'wards.geojson')
  };

  try {
    // Upload polling stations if file exists
    if (fs.existsSync(files.pollingStations)) {
      await uploadPollingStations(files.pollingStations);
    } else {
      console.log('⚠️  Skipping polling stations (file not found)');
    }

    // Upload constituencies if file exists
    if (fs.existsSync(files.constituencies)) {
      await uploadConstituencies(files.constituencies);
    } else {
      console.log('⚠️  Skipping constituencies (file not found)');
    }

    // Upload wards if file exists
    if (fs.existsSync(files.wards)) {
      await uploadWards(files.wards);
    } else {
      console.log('⚠️  Skipping wards (file not found)');
    }

    console.log('\n✅ Upload complete!');
  } catch (error) {
    console.error('\n❌ Upload failed:', error);
    process.exit(1);
  }
}

main();
