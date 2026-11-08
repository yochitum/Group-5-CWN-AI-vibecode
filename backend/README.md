# API กฎและ Node tests

## Metadata

- folder_id: backend
- lab_ids: LAB-04 บางส่วน, LAB-06, LAB-09/11 บางส่วน
- purpose: API และจัดเก็บทริปใน JSON
- assessment_status: NOT_GRADED

## Artifacts

| Path | หน้าที่ |
|---|---|
| [server.cjs](server.cjs) | API, static server และ persistence |
| [catalog.cjs](catalog.cjs) | ข้อมูลสถานที่ตัวอย่าง |
| [routing.cjs](routing.cjs) | เส้นทาง |
| [selected-plan.cjs](selected-plan.cjs) | จัดแผนจากจุดเลือก |
| [members.cjs](members.cjs) | ข้อมูลสมาชิก |
| [expenses.cjs](expenses.cjs) | validation ค่าใช้จ่าย |
| [server.test.cjs](server.test.cjs) | Node test ของ server |
| [routing.test.cjs](routing.test.cjs) | Node test ของ routing |
| [road-map.test.cjs](road-map.test.cjs) | Node test ของ road-map |
| [selected-plan.test.cjs](selected-plan.test.cjs) | Node test ของ selected-plan |
| [invite.test.cjs](invite.test.cjs) | Node test ของ invite |
| [trip-slides.test.cjs](trip-slides.test.cjs) | Node test ของ trip-slides |
| [feedback.test.cjs](feedback.test.cjs) | Node test ของ feedback |
| [members.test.cjs](members.test.cjs) | Node test ของ members |
| [expenses.test.cjs](expenses.test.cjs) | Node test ของ expenses |

## Verification and limitations

จาก hw_week1 รัน npm.cmd start หรือ npm.cmd test; test code ไม่ใช่รายงานผลผ่าน และไม่ใช่ Playwright สามเบราว์เซอร์; backend/data/trips.json สร้างเมื่อบันทึกครั้งแรกและไม่ติดตามใน Git

การจัดเอกสารรอบนี้ไม่ได้รันเว็บหรือ tests ใหม่ ต้องตรวจ assertion จริงก่อนสรุปว่าครอบคลุมเกณฑ์ใด

## Navigation

- [README หลัก](../README.md)
- [ดัชนีผู้ตรวจ](../REVIEW-INDEX.md)
- [สถานะ LAB](../LAB-STATUS.md)
