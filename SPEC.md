# Implementation claims [A]

- Node HTTP serverเสิร์ฟ frontend; `/api/health`, `/api/catalog`, `/api/plan`, `/api/route`, `/api/trips`, search/discovery APIs; JSON persistence. อ่านรายละเอียดเดิมที่ README-LEGACY.
- Planner deterministic ไม่ใช่ LLM; ไม่คำนวณ live traffic/optimal road itinerary. Catalog3จังหวัด; public providersต้องมี internet.
- Leaflet + OSM tiles, OSRM routing, Photon search, Overpass discovery. ภาพประกอบไม่รับรองเป็นภาพจริงแต่ละสถานที่.
- แบ่งปัน/บทบาท/เตือนจ่ายเงินเป็น mock UI; ไม่มี authentication, multi-device synchronization, payment หรือข้อความส่งจริง.
- JPEG dataURL มี validation รูปแบบ/ขนาดข้อความ ไม่ใช่ full image decoder/security scan.
- data-testid เพิ่มให้ static elements ที่มี id; dynamic controls ยังไม่ได้ตรวจความครอบคลุมด้วย browser.
- Testreset opt-in เฉพาะ assessment server; ไม่ใช้ reset ใน server ปกติ.

คำอ้างเหล่านี้ไม่ใช่ผลทดสอบ ดู TEST-RUN-1 และ EXPLORATION เพื่อแยก [O].
