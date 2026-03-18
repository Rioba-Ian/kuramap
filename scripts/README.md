# Kenya Election Data Import Guide

This guide will help you import real Kenyan polling station, constituency, and ward data into your Firestore database.

## Step 1: Download the Data

### Option A: Polling Stations (Recommended)
1. Visit: https://github.com/mikelmaron/kenya-election-data
2. Navigate to `/output/polling` directory
3. Download the GeoJSON version or shapefile

### Option B: Latest Official Data from HDX
1. **Polling Stations**: https://data.humdata.org/dataset/kenya-polling-stations
2. **Constituencies**: https://data.humdata.org/dataset/kenya-elections
   - Look for "Kenya Admin Level 2 - Constituencies"
3. **Wards**: https://data.humdata.org/dataset/kenya-elections
   - Look for "Kenya Admin Level 3 - Wards"

## Step 2: Convert Shapefiles to GeoJSON (if needed)

### Using QGIS (GUI Method)
1. Download QGIS: https://qgis.org/download/
2. Open QGIS → Layer → Add Layer → Add Vector Layer
3. Select your shapefile (.shp)
4. Right-click layer → Export → Save Features As
5. Format: GeoJSON
6. CRS: EPSG:4326 (WGS 84)
7. Save

### Using ogr2ogr (Command Line)
```bash
# Install GDAL
brew install gdal  # macOS
# or
sudo apt-get install gdal-bin  # Ubuntu

# Convert shapefile to GeoJSON
ogr2ogr -f GeoJSON \
  -t_srs EPSG:4326 \
  polling-stations.geojson \
  polling-stations.shp

ogr2ogr -f GeoJSON \
  -t_srs EPSG:4326 \
  constituencies.geojson \
  constituencies.shp

ogr2ogr -f GeoJSON \
  -t_srs EPSG:4326 \
  wards.geojson \
  wards.shp
```

### Using Online Tools
- https://mapshaper.org/ - Upload shapefile, export as GeoJSON
- https://mygeodata.cloud/converter/shp-to-geojson

## Step 3: Organize Your Files

Create a `data` directory in your project root and add your GeoJSON files:

```
kuramap/
├── data/
│   ├── polling-stations.geojson
│   ├── constituencies.geojson
│   └── wards.geojson
└── scripts/
    └── upload-election-data.ts
```

## Step 4: Set Up Firebase Admin SDK

1. Go to Firebase Console: https://console.firebase.google.com/
2. Select your project
3. Go to Project Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save the JSON file as `service-account-key.json` in your project root
6. **Add to .gitignore**: Make sure this file is in .gitignore!

## Step 5: Install Dependencies

```bash
npm install --save-dev firebase-admin tsx
```

## Step 6: Set Environment Variable

```bash
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"
```

Or add to your `.env.local`:
```
GOOGLE_APPLICATION_CREDENTIALS=./service-account-key.json
```

## Step 7: Run the Upload Script

```bash
npx tsx scripts/upload-election-data.ts
```

The script will:
- Upload all polling stations to `/pollingStations` collection
- Upload constituencies to `/constituencies` collection
- Upload wards to `/wards` collection
- Show progress and completion status

## Expected Data Format

### Polling Stations GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Karura Primary School",
        "constituency": "Westlands",
        "ward": "Parklands/Highridge",
        "station_code": "001"
      },
      "geometry": {
        "type": "Point",
        "coordinates": [36.8043, -1.2662]
      }
    }
  ]
}
```

### Constituencies/Wards GeoJSON
```json
{
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
        "name": "Westlands",
        "code": "047"
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [[...]]
      }
    }
  ]
}
```

## Troubleshooting

### "Firebase Admin not initialized"
Make sure GOOGLE_APPLICATION_CREDENTIALS is set correctly

### "File not found"
Check that your GeoJSON files are in the `/data` directory

### "Quota exceeded"
Firestore has write limits. The script batches uploads (500 per batch) to handle this.

### Large files taking too long
Consider filtering the data first or uploading in chunks

## Next Steps

After successful upload:
1. Verify data in Firebase Console → Firestore Database
2. The frontend will automatically start using real data
3. Clear your browser cache if you see old data

## Data Sources

- Mike Maron's Kenya Election Data: https://github.com/mikelmaron/kenya-election-data
- HDX Kenya Electoral Data: https://data.humdata.org/dataset/kenya-elections
- IEBC Official: https://www.iebc.or.ke/
