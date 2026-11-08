> ARCHIVED: คู่มือก่อนจัดชุดส่งงาน ไม่ใช่สถานะล่าสุด ใช้ [README.md](README.md) และ Node.js22+ แทนคำสั่ง/ผลทดสอบเก่าในเอกสารนี้

# เที่ยวไหนดี — Original interactive mockup

## เริ่มอ่านและตรวจงาน

นี่คือ `hw_week1` เวอร์ชัน HTML/CSS/JavaScript + Node.js และไฟล์ JSON ไม่ใช่ `hw_week1_code_teacher` ที่ใช้ Next.js + PostgreSQL เอกสารนี้จัดทำเป็นสารบัญย้อนหลัง ไม่ใช่หลักฐานว่าพัฒนาตามลำดับ LAB ตั้งแต่เริ่ม

1. [REVIEW-INDEX.md](REVIEW-INDEX.md) — ขอบเขตและลำดับอ่านสำหรับผู้ตรวจ
2. [LAB-STATUS.md](LAB-STATUS.md) — รายการส่งงาน LAB 0–12 และสิ่งที่ยังขาด
3. [RUBRIC-MAP.md](RUBRIC-MAP.md) — ตำแหน่งหลักฐานของเกณฑ์ 20 ข้อ
4. [submission.json](submission.json) — ดัชนีไฟล์ที่โปรแกรมอ่านได้

## โฟลเดอร์และ LAB ที่เกี่ยวข้อง

| โฟลเดอร์ | หน้าที่ | LAB |
|---|---|---|
| [frontend](frontend/README.md) | หน้าเว็บ แผนที่ wizard และการโต้ตอบ | 6; เป็นเป้าหมายสำรวจของ 7–8 และ 11 |
| [backend](backend/README.md) | API, catalogue, กฎ, JSON persistence และ Node tests | 4, 6, 9, 11 บางส่วน |
| backend/data/ | สร้างเมื่อบันทึกทริปครั้งแรก; ไม่ติดตามใน Git | ข้อมูล runtime ไม่ใช่ TEST-DATA ที่ยืนยัน |
| .preview/ | ไฟล์ชั่วคราวในเครื่อง; ไม่ติดตามใน Git | ไม่ใช้แทนรายงานส่งงาน |

เอกสาร LAB 1–5 และรายงานสำรวจ/แผนทดสอบตามบทเรียนยังไม่มีในโฟลเดอร์นี้ ดูรายละเอียดใน LAB-STATUS ไม่ใช้ผล 45/45 หรือ mutation 3/3 ของโปรเจกต์ teacher มาอ้างเป็นผลของเวอร์ชันนี้

## วิธีรันบน Windows

ใช้ Node.js 18 ขึ้นไป ไม่ต้องเปิด Docker และไม่ต้องติดตั้ง dependencies:

```powershell
cd C:\Users\TiraputTirapongtawat\Documents\Teaching_CWN2026-main\hw_week1
npm.cmd start
```

เปิด **http://localhost:8080** และตรวจ API ด้วย `Invoke-RestMethod http://localhost:8080/api/health` รัน Node tests ด้วย `npm.cmd test` จากโฟลเดอร์เดียวกัน หากพอร์ตไม่ว่าง ตั้ง `$env:PORT=8082` ก่อนรันแล้วใช้พอร์ตใหม่ การจัดเอกสารรอบนี้ไม่ได้รันเว็บหรือทดสอบใหม่

## Technical reference / Run

Requires Node.js 18+. No dependency installation or API key required.

```powershell
cd C:\Users\TiraputTirapongtawat\Documents\Teaching_CWN2026-main\hw_week1
npm.cmd start
```

Open http://localhost:8080. Keep the terminal running; Ctrl+C stops it. If port 8080 is occupied, set PORT to an available port. Do not use Live Server or open frontend/index.html directly: this version requires the backend.

## Structure

- frontend/: HTML, CSS, JavaScript and a Leaflet geographic map.
- backend/server.cjs: mock planning and real road-routing APIs and static frontend server.
- backend/catalog.cjs: sample stops in Chiang Mai, Phuket and Bangkok.
- backend/data/trips.json: saved trips, created on first save, ignored by Git.
- backend/server.test.cjs: API integration tests; run npm test.

The backend serves the frontend on the same origin and binds to the local computer. This single-user prototype has no login. Browsers using this server share the same trips. Previous localStorage trips are not migrated. The latest 20 saved trips are retained.

## API

GET /api/health - health and mock mode
GET /api/catalog - destinations and sample stops
POST /api/plan - destination, origin, days, budget, interests
POST /api/route - real OSRM driving route for selected stops
GET /api/trips - saved trips
POST /api/trips - save a validated trip

## Scope

Planning uses deterministic mock logic, not an LLM. Interests rank stops and a lower daily budget reduces the number of daily stops. Nationwide AI is future work; unsupported destinations receive a clear message. The map uses OpenStreetMap tiles and routes use OSRM road geometry. Driving distance and duration come from routing data; duration excludes live traffic and stops. Catalog coordinates are sample POIs; driving routes snap to nearby roads, so the final approach to a POI may require walking. Travel from a different origin is not included. Stops can repeat across days in the small sample catalog.

Internet is required for Leaflet, OpenStreetMap tiles, and OSRM. Map requests go directly from the browser with its Referer; open via the Node server on localhost, never file://. The backend caches road routes for one hour. Routing failures show an unavailable state; no schematic route is substituted. Public services are best-effort; production should use provisioned providers. Photos and fonts still need internet. Photos are illustrative, not verified photos of each stop.

The implementation includes API calls, validation, add/remove/reorder stops and JSON persistence. Simulation was replaced by trip invitations. Routing uses OSRM; planning AI and external messaging remain mock features. These are implementation descriptions, not fresh verification results.

After changing backend code, stop the previous Node process (Ctrl+C) and restart `node backend/server.cjs`.

## Province-first flow

The UI now selects province/days, attraction pins, optional dining areas or custom restaurants, then starting/ending points before arranging the chosen places. The initial catalog still covers only three sample provinces. There is no verified restaurant or opening-hours database. Add actual restaurant coordinates manually or by clicking the map.

The planner groups selected points geographically using a nearest-neighbor heuristic and splits them across days. It does not use AI or road travel times for optimization. Driving routes are fetched separately from OSRM after planning. Rough workload warnings include estimated transit and visit times. Optional places remain included until the user removes them. Empty days are free days, not duplicate sample trips. Dining can be skipped; the itinerary shows a 60-minute meal break without inventing a restaurant.

Start/end choices, priority, custom stops, notes, and images persist with saved trips. Drag stops within a day or use the day selector to move them across days; check timing after manual edits.

## Group feedback mockup

Main plan now has a feedback panel below it. Switch between friend and leader views in the same browser to test proposals: add a place/meal stop, move a stop to another day, or leave a comment. Accept applies a proposal; Reject preserves the itinerary. Stale moves and full days are rejected without partial mutations. Save the trip to preserve feedback and review history.

Roles are UI simulation only, not authenticated authorization. There is no cross-device collaboration, notification, or real friend identity yet. Accepting a plain comment acknowledges it without changing the plan. Exported slides reflect the main plan only, not pending feedback.

## Shared expenses mockup

Below members, record payer, title, date, amount and selected participants. Equal splits use integer satang; remaining satang are assigned in participant order. Net balances produce suggested reimbursement transfers. Members referenced by expenses cannot be removed until those expenses are edited or deleted. Save the trip to persist the ledger.

Email/LINE reminders are simulated only; the copy button copies the visible reminder text. There is no external sending, payment processing or tracking of actual reimbursements. Proposed debts do not subtract transfers already made outside the app.

## แผนที่และค้นหาสถานที่ (ปัจจุบัน)

ใช้ Leaflet + OpenStreetMap สำหรับแผนที่, Photon สำหรับค้นหาชื่อสถานที่ และ OSRM สำหรับเส้นทาง ไม่ใช้ Google API หรือ Google Billing แล้ว

รัน `npm.cmd start` ด้วย Node.js 22+ แล้วเปิด http://localhost:8080 ค่า `.env` เป็นตัวเลือก ดู `.env.example` บริการ Photon สาธารณะอาจตอบช้าหรือไม่พร้อมใช้งาน ยังเลือกจากรายการเดิมหรือปักหมุดเองได้

ค้นหาเมื่อกดปุ่มเท่านั้น แคช 1 ชั่วโมง และจำกัดคำขอ คำค้นเพิ่มจังหวัดเพื่อช่วยจัดอันดับ แต่ไม่ได้จำกัดขอบเขตจังหวัดแบบเข้มงวด ให้ตรวจที่อยู่ก่อนเลือก เปลี่ยนผู้ให้บริการผ่าน PHOTON_URL ได้ Public demo ไม่มีการรับประกันความพร้อมใช้งาน ดู https://github.com/komoot/photon
