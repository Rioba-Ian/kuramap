#!/bin/bash

# Kenya Election Data Download Script
# This script downloads sample polling stations and boundary data

set -e

echo "🇰🇪 Downloading Kenya Election Data"
echo "===================================="
echo ""

# Create data directory
mkdir -p data
cd data

echo "📥 Downloading polling stations from GitHub..."
# Download from Mike Maron's Kenya election data repository
curl -L "https://github.com/mikelmaron/kenya-election-data/raw/master/output/polling/polling-stations.geojson" \
  -o polling-stations.geojson \
  || echo "⚠️  Failed to download polling stations. Please download manually from:"
echo "   https://github.com/mikelmaron/kenya-election-data/tree/master/output/polling"
echo ""

echo "📥 Downloading constituencies from HDX..."
# Note: HDX requires manual download, so we'll provide instructions
echo "⚠️  Constituencies and Wards require manual download:"
echo ""
echo "1. Visit: https://data.humdata.org/dataset/kenya-elections"
echo "2. Download 'Kenya Admin Level 2 - Constituencies' (Shapefile or GeoJSON)"
echo "3. Download 'Kenya Admin Level 3 - Wards' (Shapefile or GeoJSON)"
echo "4. Save as 'constituencies.geojson' and 'wards.geojson' in the /data folder"
echo ""
echo "Alternative sources:"
echo "- IEBC Official: https://www.iebc.or.ke/registration/"
echo "- Kenya Open Data: https://kenya.opendataforafrica.org/"
echo ""

# Check if GDAL is installed for shapefile conversion
if command -v ogr2ogr &> /dev/null; then
  echo "✅ GDAL is installed - you can convert shapefiles to GeoJSON"
  echo "   Usage: ogr2ogr -f GeoJSON output.geojson input.shp"
else
  echo "ℹ️  Install GDAL to convert shapefiles:"
  echo "   macOS: brew install gdal"
  echo "   Ubuntu: sudo apt-get install gdal-bin"
  echo "   Or use online tools: https://mapshaper.org/"
fi

echo ""
echo "✅ Setup complete! Next steps:"
echo "1. Manually download constituencies and wards data"
echo "2. Convert shapefiles to GeoJSON if needed"
echo "3. Run: npx tsx scripts/upload-election-data.ts"
echo ""

cd ..
