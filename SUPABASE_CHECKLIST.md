# Supabase Migration Checklist

Quick checklist to migrate from Firebase to Supabase + PostGIS.

## ✅ Pre-Migration

- [x] Created Supabase project
- [x] Enabled PostGIS extension in Supabase
- [x] Added environment variables to `.env.local`:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY` (for migration only)
- [x] Installed dependencies (`@supabase/supabase-js`, `@supabase/ssr`)

## 📊 Database Setup

- [ ] Open Supabase Dashboard → SQL Editor
- [ ] Run `supabase/migrations/001_setup_polling_stations.sql`
- [ ] Verify tables created in Table Editor:
  - `polling_stations`
  - `constituencies`
  - `wards`
  - `polling_station_reviews`
- [ ] Test a function in SQL Editor:
  ```sql
  SELECT * FROM get_nearest_stations(-1.2921, 36.8219, 5);
  ```

## 📥 Data Migration

- [ ] Ensure `/data` directory has GeoJSON files:
  - `polling-stations.geojson`
  - `constituencies.geojson`
  - `wards.geojson`
- [ ] Run migration script:
  ```bash
  npm run supabase:migrate
  ```
- [ ] Verify data uploaded:
  - Check Supabase Table Editor
  - Should see ~26k polling stations
  - ~290 constituencies
  - ~1,450 wards

## 💻 Code Updates

- [ ] Backup current Firebase version:
  ```bash
  mv src/app/find/page.tsx src/app/find/page-firebase-backup.tsx
  ```
- [ ] Use new Supabase version:
  ```bash
  mv src/app/find/page-supabase.tsx src/app/find/page.tsx
  ```
- [ ] Check imports are correct
- [ ] No TypeScript errors: `npm run typecheck`

## 🧪 Testing

- [ ] Start dev server: `npm run dev`
- [ ] Open http://localhost:9002/find
- [ ] Test features:
  - [ ] Page loads without errors
  - [ ] "Near Me" button works
  - [ ] Stations load from Supabase
  - [ ] Distance calculated correctly
  - [ ] Constituency banner shows
  - [ ] Search works
  - [ ] Filters work (constituency/ward)
  - [ ] Map displays markers
  - [ ] Marker popups work
  - [ ] Details sheet works
- [ ] Check browser console (no errors)
- [ ] Check Network tab (Supabase requests)

## 🚀 Performance Check

- [ ] Test query speed in Supabase SQL Editor:
  ```sql
  EXPLAIN ANALYZE
  SELECT * FROM get_nearest_stations(-1.2921, 36.8219, 10, 50000);
  ```
  - Should use spatial index
  - Execution time < 50ms
- [ ] Test in app:
  - Initial load < 2 seconds
  - "Near Me" results < 1 second
  - Filtering instant

## 🧹 Cleanup (Optional)

- [ ] Remove Firebase dependencies:
  ```bash
  npm uninstall firebase firebase-admin
  ```
- [ ] Delete Firebase files:
  - `src/firebase/` directory
  - `scripts/upload-election-data.ts`
  - `firestore.rules`
- [ ] Remove Firebase from `.gitignore`
- [ ] Delete `service-account-key.json`

## 📝 Documentation

- [ ] Read `SUPABASE_MIGRATION.md` for details
- [ ] Update README with Supabase info
- [ ] Document any custom changes

## 🎯 Production Deployment

- [ ] Set production environment variables in hosting platform
- [ ] Run build: `npm run build`
- [ ] Test production build locally: `npm run start`
- [ ] Deploy to production
- [ ] Test production URL
- [ ] Monitor Supabase dashboard for usage

---

## Quick Commands

```bash
# 1. Run SQL migration (in Supabase SQL Editor - manual)

# 2. Migrate data
npm run supabase:migrate

# 3. Test app
npm run dev

# 4. Build for production
npm run build
```

## Need Help?

1. Check `SUPABASE_MIGRATION.md` for detailed guide
2. Review Supabase Dashboard logs
3. Check browser console for errors
4. Test SQL functions in SQL Editor

## Success Criteria

✅ All polling stations loaded from Supabase
✅ Distance calculations using PostGIS
✅ Constituency detection working
✅ Map markers display correctly
✅ No Firebase dependencies in code
✅ Page loads in < 2 seconds
✅ Query execution < 50ms

---

**Date completed**: ___________
**Deployed to**: ___________
**Notes**: ___________
