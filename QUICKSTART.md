# Quick Start Guide - Real Kenya Polling Stations

Get your app running with real Kenyan polling station data in 5 steps.

## ⚡ Fast Track (5 Steps)

### Step 1: Install Dependencies

```bash
npm install --save-dev firebase-admin tsx
```

### Step 2: Download Data

```bash
npm run data:download
```

This will:
- Try to download polling stations from GitHub
- Show instructions for downloading constituencies and wards

**Manual downloads required:**
1. Visit: https://data.humdata.org/dataset/kenya-elections
2. Download "Admin Level 2 - Constituencies" (GeoJSON)
3. Download "Admin Level 3 - Wards" (GeoJSON)
4. Save to `/data` folder as:
   - `constituencies.geojson`
   - `wards.geojson`

### Step 3: Get Firebase Admin Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Settings → Service Accounts
4. Click "Generate New Private Key"
5. Save as `service-account-key.json` in project root

### Step 4: Upload Data to Firestore

```bash
# Set the credentials path
export GOOGLE_APPLICATION_CREDENTIALS="./service-account-key.json"

# Upload data
npm run data:upload
```

Expected output:
```
📍 Uploading Polling Stations...
  ✅ Uploaded 24,123 polling stations
🏛️  Uploading Constituencies...
  ✅ Uploaded 290 constituencies
🏘️  Uploading Wards...
  ✅ Uploaded 1,450 wards
✅ Upload complete!
```

### Step 5: Run the App

```bash
npm run dev
```

Visit http://localhost:9002/find

You should now see:
- Real polling stations sorted by distance
- "Your Constituency: XXX" banner
- Filter dropdowns with real constituencies/wards
- Map with marker clustering

## 🎯 What You Get

### Features Now Available:
- ✅ 24,000+ real polling stations
- ✅ Real-time distance calculation
- ✅ Auto-detect user's constituency
- ✅ Filter by constituency/ward
- ✅ Map clustering for performance
- ✅ Sort by proximity

### UI Enhancements:
- Distance badges on cards (e.g., "2.3km")
- Constituency detection banner
- Advanced filter dropdowns
- Clear filters button
- Loading states
- Error handling

## 📁 File Structure

```
kuramap/
├── data/                          # GeoJSON data files (gitignored)
│   ├── polling-stations.geojson
│   ├── constituencies.geojson
│   └── wards.geojson
├── scripts/
│   ├── download-sample-data.sh    # Download helper
│   ├── upload-election-data.ts    # Upload to Firestore
│   └── README.md                  # Detailed data guide
├── src/
│   ├── app/find/page.tsx          # Updated with real data
│   ├── components/
│   │   ├── InteractiveMap.tsx     # Added clustering
│   │   └── VoterCenterCard.tsx    # Added distance badge
│   ├── hooks/
│   │   ├── use-polling-stations.ts # Fetch from Firestore
│   │   └── use-boundaries.ts       # Constituency detection
│   └── lib/
│       └── geospatial.ts          # Distance calculations
├── service-account-key.json       # Your Firebase key (gitignored)
├── IMPLEMENTATION.md              # Full technical guide
└── QUICKSTART.md                  # This file
```

## 🔍 Verify It Works

### 1. Check Firestore Console
- Go to Firebase Console → Firestore Database
- Should see collections: `pollingStations`, `constituencies`, `wards`

### 2. Test the App
```bash
npm run dev
# Open http://localhost:9002/find
```

**Expected behavior:**
1. Page loads with loading spinner
2. GPS permission requested
3. "Your Constituency: XXX" banner appears
4. Polling stations sorted by distance
5. Filter dropdowns populated with real data
6. Map shows clustered markers

### 3. Test Filters
- **Search**: Type "Westlands" → Filters stations
- **Constituency**: Select from dropdown → Shows only that constituency
- **Ward**: Select from dropdown → Further filters
- **Clear Filters**: Resets everything

### 4. Test Map
- **Zoom out**: Markers cluster together
- **Zoom in**: Clusters expand
- **Click marker**: Shows popup with station details and distance
- **Click "View Details"**: Opens station sheet

## 🐛 Common Issues

### "No stations showing"
**Fix**: Check browser console for errors. Verify Firestore has data.

### "Location access denied"
**Fix**: Allow location in browser settings, or search manually.

### "Upload failed"
**Fix**: Check `service-account-key.json` path and permissions.

### "Module not found: firebase-admin"
**Fix**: Run `npm install --save-dev firebase-admin tsx`

## 📚 Next Steps

### Optional Enhancements:

1. **Add Reviews System**
   - Already set up in Firestore rules
   - Users can add reviews to stations

2. **Cache Data Locally**
   - Use IndexedDB
   - Reduce Firestore reads
   - Offline support

3. **Geohash Indexing**
   - Add geohash field
   - Enable geo-queries
   - Faster proximity search

4. **Real-time Updates**
   - Use Firestore listeners
   - Live station status

## 📞 Need Help?

1. Check `IMPLEMENTATION.md` for full technical details
2. See `scripts/README.md` for data import guide
3. Review browser console for errors
4. Verify Firestore data structure

## 🎉 You're Done!

Your app now uses real Kenyan polling station data from official sources. Users can find their nearest registration center with accurate distances and filtering.

---

**Next**: Share your feedback or contribute improvements!
