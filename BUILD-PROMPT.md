# LAB 5 — Reproduction prompt (ย้อนหลัง)

นี่เป็น prompt สำหรับสร้าง/บำรุงเวอร์ชันนี้ซ้ำ ไม่ใช่หลักฐานว่าพัฒนาด้วย prompt นี้ตั้งแต่ต้น ไม่ใช่ prompt ต้นฉบับของผู้สอน

> อ่าน INTERVIEW, USER-STORIES, REQUIREMENTS, DESIGN และ TEST-DATA ในโฟลเดอร์นี้ก่อนทำงาน
> สร้างเว็บวางแผนเที่ยวไทยตาม FR-01..11 ด้วย frontend HTML/CSS/JS และ Node22+ HTTP API แบบ no dependencies; bind127.0.0.1:8080; JSON persistence ใน backend/data/trips.json.
> ใช้ deterministic mock planner สำหรับเชียงใหม่/ภูเก็ต/กรุงเทพฯ; แยก actual road geometry ผ่าน OSRM จาก heuristic การจัดแผน; providerล่มต้อง error ไม่วาด fake road.
> รองรับเลือกสถานที่/จุดเริ่มจบ/วันอิสระ รูปและรายละเอียดแต่ละจุด save/update/delete ทริป; mock invitations/members/feedback/expense ledger ตาม BR ที่ยังต้องยืนยัน ไม่เพิ่ม real payments หรือ messaging.
> คิดเงินเป็น integer satang ตาม TEST-DATA; reject invalid inputs และรักษาแผนเดิมหาก feedback ย้ายไม่ได้; escape exported text.
> ใช้ assessment server แยกไฟล์พร้อม opt-in reset และ clock injection; production resetปิด; ใส่ stable data-testid ที่ controls; ไม่ล้างข้อมูลผู้ใช้เพื่อทดสอบ.
> รัน npm run verify สองรอบและ npm run test:mutations ใน temp copies; เก็บ TAP/JSON/source hashes. Expected มาจากเอกสาร/คณิตศาสตร์ ห้ามเปลี่ยนเพื่อให้ตาม bug.
> ระบุความต่างจากโจทย์ Next.js/PostgreSQL/Docker และส่วน UI/3browser ที่ยังไม่ตรวจ ไม่รายงาน Node tests เป็น Playwright.

Acceptance ของ prompt: case matrix มี traceability, raw results อ่านได้, mutationไม่แก้ sourceจริง. เป้าหมาย UI ตาม FR-03/11 ต้องตรวจภาพเพิ่มก่อนรับรอง.
