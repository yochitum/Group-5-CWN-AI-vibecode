# LAB 4 — Test data และ independent oracle

เวลาล็อก `2026-11-07T09:00:00+07:00` = `2026-11-07T02:00:00.000Z` ใช้เฉพาะ savedAt ใน assessment server หลัง POST reset ไม่ได้ freeze Date.now ทุกจุดใน frontend/feedback และไม่อ้างว่า seed ฐานข้อมูล PostgreSQL

## Fixtures

| ชุด | ข้อมูล | ใช้ใน |
|---|---|---|
| PLAN | เชียงใหม่ → เชียงใหม่,1วัน,5000บาท,interests=[] | assessment/server tests |
| SELECTED | 7 custom points,lat=18.7+i×0.001,lng=98.9; start/endจุดแรก | TC-ASSESSMENT-03 |
| MEMBERS | a,b,c; สมาชิก boundary สร้าง ID0..100 ไม่ซ้ำ | expenses / assessment tests |
| EXPENSE | a จ่าย10000, bจ่าย3000สตางค์; แต่ละรายการหาร[a,b,c] | TC-EXPENSES-01 |
| PHOTO | JPEG data URL ใน server fixture | TC-SERVER-01; เป็น payload ไม่ใช่หลักฐานภาพ UI |
| ROUTE | providerจำลอง12345m,1200s,3พิกัด | TC-ROUTING-01 |

## วิธีคิด [R] ก่อนใช้เป็น oracle

10000÷3 =3333 เศษ1 → [3334,3333,3333]; 3000÷3=[1000,1000,1000].
ค่าใช้จ่ายแต่ละคน=[4334,4333,4333]. aจ่าย10000จึงรับคืน5666; bจ่าย3000จึงคืน1333; cไม่ได้จ่ายจึงคืน4333.
5666−1333−4333=0; b→a1333 และ c→a4333 ทำให้ balance ทุกคน0. รวมค่าใช้จ่าย13000สตางค์ ไม่คำนวณด้วย floating point บาท

12345/1000=12.345 → แสดง12.3km หนึ่งตำแหน่ง;1200/60=20นาที. ทิศ E0,N−90,W±180,S90 จากแกนพิกัดจอ.

ทุก BR มี boundary/partition data ใน [REQUIREMENTS.md](REQUIREMENTS.md); ยังไม่ได้ execute ทุก triple เช่น photo199999/200000/200001 และ invitation99/100/101 จึงห้ามเรียกว่า boundary coverage100%.

## Isolation / reset

`npm run start:test` ใช้ `assessment/.runtime/trips.json` ที่ไม่ติด Git; POST `/api/test/reset` ด้วย `{}` ล้างเฉพาะไฟล์นี้และล็อกเวลา; รับ `{ "now":"2026-11-07T09:00:00+07:00" }` ได้. ค่าไม่ใช่วันได้400และไม่ล้างข้อมูล.
`npm start` ไม่เปิด reset (404). Constructor ปฏิเสธ allowTestReset กับ pathข้อมูลหลัก. Automated tests ใช้ os.tmpdir แยกและลบหลังจบ ไม่มี seed ใส่ backend/data/trips.json.
