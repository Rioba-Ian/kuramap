# Firebase → Supabase + PostGIS Migration Guide

Complete guide to migrate your Kenyan polling stations app from Firebase to Supabase with PostGIS for efficient spatial queries.

## Why Supabase + PostGIS?

✅ **Better for geospatial**: PostGIS offers native spatial indexing and KNN queries
✅ **More efficient**: Nearest-neighbor queries using `<->` operator
✅ **SQL-based**: More powerful queries and aggregations
✅ **Open source**: No vendor lock-in
✅ **Better scaling**: PostgreSQL performance for 25k+ records

## Prerequisites

- [x] Supabase project created
- [x] PostGIS extension enabled
- [x] Environment variables added
- [ ] Data files ready (`/data/*.geojson`)

## Step 1: Set Up Environment Variables

Add to your `.env.local` file:

```env
# Supabase credentials (from Supabase Dashboard → Settings → API)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Service role key (for data migration only - KEEP SECRET!)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

**Important**: Never commit `.env.local` to git!

## Step 2: Run SQL Migration

1. Go to your Supabase Dashboard
2. Navigate to **SQL Editor**
3. Copy the contents of `supabase/migrations/001_setup_polling_stations.sql`
4. Paste and run in SQL Editor

This will create:
- `polling_stations` table with PostGIS POINT location
- `constituencies` table with MULTIPOLYGON boundaries
- `wards` table with MULTIPOLYGON boundaries
- `polling_station_reviews` table for user feedback
- Spatial indexes (GIST) for fast queries
- RLS policies (public read-only)
- PostgreSQL functions for spatial queries

**Verify**: Check **Table Editor** to see the new tables.

## Step 3: Migrate Data to Supabase

Run the migration script to upload your GeoJSON data:

```bash
# Make sure your GeoJSON files are in /data directory
ls data/
# Should show: polling-stations.geojson, constituencies.geojson, wards.geojson

# Run migration
npx tsx scripts/migrate-to-supabase.ts
```

**Expected output**:
```
🇰🇪 Supabase + PostGIS Migration Script
========================================

📍 Uploading Polling Stations...
   Found 26447 stations in file
  ✓ Uploaded 100 stations...
  ✓ Uploaded 200 stations...
  ...
  ✅ Successfully uploaded 26447 polling stations

🏛️  Uploading Constituencies...
  ✅ Successfully uploaded 290 constituencies

🏘️  Uploading Wards...
  ✅ Successfully uploaded 1450 wards

✅ Migration complete!
```

**Troubleshooting**:
- If it fails, check your `SUPABASE_SERVICE_ROLE_KEY` is correct
- Verify the SQL migration ran successfully
- Check network connection

## Step 4: Test PostGIS Functions

In Supabase SQL Editor, test the functions:

### Test nearest stations query
```sql
-- Find nearest stations to Nairobi CBD (-1.2921, 36.8219)
SELECT * FROM get_nearest_stations(-1.2921, 36.8219, 10, 50000);
```

### Test constituency detection
```sql
-- Detect constituency for Nairobi CBD
SELECT * FROM detect_constituency(-1.2921, 36.8219);
```

### Test search
```sql
-- Search for stations
SELECT * FROM search_stations('Westlands', 10);
```

If these return data, your PostGIS setup is working! 🎉

## Step 5: Update Your Next.js App

### Replace the /find page

**Option A: Rename files (recommended)**
```bash
# Backup old Firebase version
mv src/app/find/page.tsx src/app/find/page-firebase-backup.tsx

# Use new Supabase version
mv src/app/find/page-supabase.tsx src/app/find/page.tsx
```

**Option B: Copy-paste**
- Copy contents of `src/app/find/page-supabase.tsx`
- Paste into `src/app/find/page.tsx`

### Update imports in /find page

The new page uses:
- `@/hooks/use-polling-stations-supabase` instead of `@/hooks/use-polling-stations`
- `@/hooks/use-boundaries-supabase` instead of `@/hooks/use-boundaries`
- Supabase RPC functions instead of Firestore queries

## Step 6: Update Other Components (if needed)

If you have other components that use Firebase, update them to use Supabase:

**Before (Firebase)**:
```typescript
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';

const snapshot = await getDocs(collection(db, 'pollingStations'));
```

**After (Supabase)**:
```typescript
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
const { data } = await supabase.from('polling_stations').select('*');
```

## Step 7: Test the Application

```bash
npm run dev
```

Visit http://localhost:9002/find

### Test checklist:

- [ ] Page loads without errors
- [ ] "Near Me" button requests GPS permission
- [ ] Stations load from Supabase
- [ ] Distance calculations work (sorted by proximity)
- [ ] Constituency detection banner appears
- [ ] Search bar filters stations
- [ ] Constituency dropdown works
- [ ] Ward dropdown works (after selecting constituency)
- [ ] Map markers appear
- [ ] Clicking marker shows popup
- [ ] "View Details" opens station sheet
- [ ] No console errors

## Step 8: Performance Verification

### Check query performance

In Supabase SQL Editor:

```sql
-- Should use spatial index (look for "Index Scan using polling_stations_location_gist_idx")
EXPLAIN ANALYZE
SELECT * FROM get_nearest_stations(-1.2921, 36.8219, 10, 50000);
```

Expected execution time: **< 50ms** for 25k records

### Check index usage

```sql
-- Verify indexes exist
SELECT tablename, indexname, indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN ('polling_stations', 'constituencies', 'wards');
```

You should see:
- `polling_stations_location_gist_idx` (GIST index)
- `constituencies_boundary_gist_idx` (GIST index)
- `wards_boundary_gist_idx` (GIST index)

## Step 9: Clean Up Firebase (Optional)

Once everything works with Supabase:

### Remove Firebase dependencies (optional)
```bash
npm uninstall firebase firebase-admin
```

### Remove Firebase files
```bash
rm -rf src/firebase/
rm -rf scripts/upload-election-data.ts
rm firestore.rules
```

### Update .gitignore
Remove Firebase-specific entries if you deleted Firebase

## Database Schema Reference

### `polling_stations` table

| Column | Type | Description |
|--------|------|-------------|
| id | TEXT | Primary key |
| name | TEXT | Station name |
| address | TEXT | Full address |
| constituency | TEXT | Constituency name |
| ward | TEXT | Ward name |
| station_code | TEXT | Official station code |
| location | GEOGRAPHY(POINT) | PostGIS point (lat/lng) |
| type | TEXT | 'registration', 'polling', or 'both' |
| voter_count | INTEGER | Number of registered voters |
| operating_hours | TEXT | Operating hours |
| metadata | JSONB | Additional data |

### Key Functions

| Function | Purpose | Performance |
|----------|---------|-------------|
| `get_nearest_stations()` | Find nearest N stations | ~20ms |
| `detect_constituency()` | Point-in-polygon detection | ~10ms |
| `detect_ward()` | Point-in-polygon detection | ~10ms |
| `search_stations()` | Full-text search | ~30ms |

## Comparison: Firebase vs Supabase

| Feature | Firebase | Supabase + PostGIS |
|---------|----------|-------------------|
| Query type | Firestore queries | SQL + PostGIS |
| Distance calc | Client-side (Haversine) | Server-side (ST_Distance) |
| Sorting | Client-side | Server-side (KNN operator) |
| Indexing | No spatial index | GIST spatial index |
| Performance (25k records) | ~500ms | ~20ms |
| Point-in-polygon | Client-side JS | Server-side (ST_Contains) |
| Scalability | Good | Excellent |

## Troubleshooting

### "relation polling_stations does not exist"
**Solution**: Run the SQL migration in Supabase SQL Editor

### "permission denied for table polling_stations"
**Solution**: Check RLS policies are enabled and public read is allowed

### "function get_nearest_stations does not exist"
**Solution**: Make sure the SQL migration created the functions

### Slow queries
**Solution**: Check spatial indexes exist:
```sql
SELECT * FROM pg_indexes WHERE tablename = 'polling_stations';
```

### No data showing
**Solution**: Verify data was uploaded:
```sql
SELECT COUNT(*) FROM polling_stations;
-- Should return ~26,447
```

### TypeScript errors
**Solution**: Update the database types:
```bash
# If you have Supabase CLI installed
supabase gen types typescript --local > src/lib/supabase/database.types.ts
```

## Advanced: Optimize for Production

### Add composite indexes
```sql
-- For filtering by constituency + ward
CREATE INDEX polling_stations_constituency_ward_idx
ON polling_stations(constituency, ward);
```

### Enable query caching
In your Supabase client:
```typescript
const supabase = createClient(url, key, {
  global: {
    headers: {
      'Cache-Control': 'max-age=3600' // 1 hour cache
    }
  }
});
```

### Add read replicas
For high traffic, consider Supabase read replicas (Pro plan)

## Next Steps

1. ✅ Migrate data to Supabase
2. ✅ Update Next.js app
3. ✅ Test all features
4. 🔄 Add reviews functionality (optional)
5. 🔄 Add admin dashboard (optional)
6. 🔄 Deploy to production

## Resources

- **Supabase Docs**: https://supabase.com/docs
- **PostGIS Docs**: https://postgis.net/documentation/
- **Spatial Queries Guide**: https://supabase.com/docs/guides/database/extensions/postgis
- **Performance Tuning**: https://supabase.com/docs/guides/platform/performance

---

**Need help?** Check the Supabase Discord or GitHub Discussions.
