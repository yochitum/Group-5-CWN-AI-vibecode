> คู่มือเก่า: เวอร์ชันปัจจุบันไม่ใช้ Google API แล้ว ใช้ OpenStreetMap + Overpass + OSRM แทน

# Google Maps + Google Places setup

Scope: `hw_week1` (original app), not `hw_week1_code_teacher`.

## Enable real data

1. In Google Cloud, create/select a project and connect Billing.
2. Enable **Maps JavaScript API** and **Places API (New)**.
3. Create a browser API key. Restrict applications to Websites (HTTP referrers):
   - `http://localhost:8080/*`
   - `http://127.0.0.1:8080/*`
   - Add the exact production domain when deploying.
4. Restrict the key to the two APIs above. Configure quotas and billing alerts.
5. Stop the old server and start from PowerShell:

```powershell
cd C:\Users\TiraputTirapongtawat\Documents\Teaching_CWN2026-main\hw_week1
$env:GOOGLE_MAPS_BROWSER_KEY = 'YOUR_BROWSER_RESTRICTED_KEY'
# Optional: use your JavaScript Map ID in production; demo defaults to DEMO_MAP_ID.
$env:GOOGLE_MAPS_MAP_ID = 'YOUR_MAP_ID'
npm.cmd start
```

Open http://localhost:8080. Choose a province, then search by name/category above the map.
Press Search to request real Places data. Click a result or marker to add it to the trip.
The search appends the selected province; verify results before adding (this is not an administrative-boundary filter).

## Implementation and limits

- `/api/maps-config` deliberately exposes the **browser** key. Browser keys are visible to visitors; website/API restrictions protect usage. Never use a server secret here or commit a real key.
- `frontend/google-maps.js`: shared SDK loader, Google basemap, route markers and polylines.
- `frontend/google-places.js`: Places `Place.searchByText`, explicit search, result selection and manual coordinate picking.
- Both selection and itinerary maps use Google Maps. Route calculation remains OSRM; Google Routes is not enabled or billed by this implementation.
- Only the existing three provinces are offered by the planner. This change does not add nationwide planning.
- Catalog cards remain curated mock data, separate from Google search results. No Google reviews/photos are requested; itinerary pictures remain labeled illustrations or user uploads.
- No key: shows a setup message instead of silently claiming live Google data.
- This local prototype reuses existing trip/export storage. Before public deployment, implement provider-specific retention/refresh rules for Places content, public Terms of Use and Privacy Policy, and review attribution requirements. Place IDs can be retained; do not treat other Google content as an unrestricted permanent database.
- Live API operation requires your authorized Cloud project and key; stubbed tests are not evidence of a successful billed Google request.

## Official references

- [Places text search example](https://developers.google.com/maps/documentation/javascript/examples/place-text-search)
- [API security practices](https://developers.google.com/maps/api-security-best-practices)
- [Places policies](https://developers.google.com/maps/documentation/places/web-service/policies)
