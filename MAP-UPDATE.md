# Thailand planner update

## Implemented

- Existing vanilla JS, Node HTTP API and JSON persistence retained; no new framework or dependency.
- Planner opens a Leaflet Thailand overview at step 1. Province selection and existing five-step itinerary flow remain.
- Seven Thai category filters and icon markers; selected stops show basket numbers.
- Pixel-grid clustering below zoom 16; clicking a cluster zooms in. This is lightweight grid grouping, not Leaflet.markercluster.
- Popups show returned/stored names, category, address when present, coordinates, add/remove action and source link when present. Only user-provided photos are shown in popups.
- Photon autocomplete, local history, debounce, stale-response suppression and backend caching/rate limiting retained.
- Category/address/source metadata survives trip save. Maps resize with their container.
- Existing manual stop reordering, start/end selection, per-day road routes retained.
- Route panel includes OSRM road distance/duration for each leg. No straight-line replacement route on service failure.
- Name, save, reopen, update by ID, delete with confirmation, and clear-current-day actions added.
- Disabled road-order optimization button explains adapter limitation; existing geographic day grouping is explicitly approximate.
- Existing invitations, slides, feedback, members and expense features remain.

## Files

New: `frontend/planner-map.js`, `frontend/trip-management.js`, `backend/trip-management.test.cjs`.
Updated: `frontend/index.html`, `frontend/app.js`, `frontend/trip-wizard.js`, `frontend/editorial.css`, `backend/places.cjs`, `backend/server.cjs`, `backend/routing.cjs`, `package.json`, `.env.example`.

## Run and configuration

Node.js 22+. From `hw_week1`, run `npm.cmd start`, then visit http://localhost:8080/#planner.
No API key or billing registration is required. Optional `.env` settings:

```env
PORT=8080
PHOTON_URL=https://photon.komoot.io/api/
OSRM_URL=https://router.project-osrm.org
```

Restart after changing backend code or environment. Frontend changes require a refresh only.

## Verification

- Existing 23 backend tests passed after implementation changes.
- New automated persistence test passes: named save, metadata preservation, same-ID update without duplication, invalid update rejection, deletion and not-found deletion.
- Browser checks: initial Thailand center/zoom, marker popup, add to basket, category filter, mobile map width and no JavaScript errors in those actions.
- Public road service is external: automated route tests use response fixtures, not proof of current public-service availability.

## Deliberately deferred from the supplied prompt

- Geoapify adapters/tiles and key registration: not configured. Photon/OSRM are the working no-key providers. Environment URLs switch compatible endpoints, not API protocols.
- Nationwide province selector: retains the original three provinces. Thailand overview does not imply full nationwide itinerary support.
- Nearby/category business discovery API: filters apply to loaded locations; typing a category is not guaranteed to discover all nearby businesses.
- Road-network stop optimization: disabled rather than presenting the existing geographic heuristic as a guaranteed optimal route.
- Dedicated mobile bottom sheet and complete left/right page redesign: retained the existing responsive layout and five-step flow.
- Saved route geometry/metadata: recalculated on reopening a trip; not persisted. Stop order is persisted.
- Authentication and multiuser access controls: absent from original local prototype. JSON stores the latest 20 trips on this machine; not a production shared database.
- Missing external descriptions, opening hours, ratings and photos are not synthesized.

## Production services

Public services are limited, not unlimited production infrastructure. Use an appropriate hosted or self-hosted service for production and review current policies:

- [OSM tile usage](https://operations.osmfoundation.org/policies/tiles/)
- [Photon demo limits](https://github.com/komoot/photon#demo-server)
- [OSRM project](https://project-osrm.org/)

Do not remove attribution. Keep real credentials out of Git. The abandoned Google files are not loaded and no Google key endpoint is active.

## Viewport discovery update

`backend/discovery.cjs` and `frontend/map-discovery.js` load named OSM points in the settled viewport (zoom 14+, each dimension at most 0.16 degrees). Includes amenity/tourism/shop/leisure/natural/historic/office tags. Up to 800 returned objects; zoom further when truncated. Thailand bounding rectangle is a guard, not a precise country polygon. Labels start at zoom 16 with screen-space decluttering. Category filters remain available.

One request at a time, debounce and 4-second backend throttle, bounded one-hour server cache. `DISCOVERY_OVERPASS_URL` selects a compatible endpoint. Default: https://overpass.private.coffee/api/interpreter . No automatic error retries; the user can retry. Photon remains the name-search provider.

Four new backend tests and a browser fixture test verify viewport validation, categories, cache/throttle, failures, zoom-triggered loading, popup and adding stops. Live Overpass checks during implementation timed out; real POI availability is not verified. This is not a guarantee of complete business coverage. Public-service terms: https://overpass.kumi.systems/ .
