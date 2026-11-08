# LAB 7–8 — Three-source comparison

**วิธีการ:** retrospective, code-informed audit + Node/API evidence. ผู้จัดทำอ่าน source มาก่อน จึงไม่อ้าง black-box exploration หรือเขียน oracle ก่อนเปิดเว็บ หลักฐานนี้ไม่มีการเดิน UI สดหรือภาพหน้าจอ.

## A. สิ่งที่ผู้ใช้ขอและ expected

[D01] วางแผนเที่ยว; [D04] เส้นทางถนนจริง; [D03] รูปแสดงเมื่อถึงจุด; [D05] แผนที่ชัด. Expectedเชิงคณิตศาสตร์ใน TEST-DATA เช่นแบ่ง13000สตางค์แล้ว net=[5666,-1333,-4333] เป็น [R] ไม่ได้อ้างว่าคำนวณก่อนพัฒนา.

## B. Sitemap และ feature inventory [A]

หน้า `/` → เลือกจังหวัด/วัน → จุดท่องเที่ยวและอาหาร → จุดเริ่ม/จบ → แผนรายวัน/แผนที่ → รายละเอียด/รูปจุดแวะ → save/reopen → คำเชิญ/สไลด์ → สมาชิก/feedback/ค่าใช้จ่าย. ไม่มีหน้า login หรือ admin ที่ยืนยันตัวตน.

## C. กฎสามทางและ verdict

[O] ในตารางหมายถึง test execution ไม่ใช่ visual UI observation. ✅ เฉพาะขอบเขตที่ทดสอบ, ⚠️ ยังพิสูจน์บางส่วน, ❌ ข้อจำกัดที่รู้ว่าไม่รองรับ.

| Requirement | [D] ผู้ใช้ | [A] ระบบอ้าง | [O] หลักฐาน | Verdict |
|---|---|---|---|---|
| FR01 / BR01–03 | D01 วางแผน | 1..4วัน/งบจำกัด/6จุด | ASSESSMENT01–03, SELECTED-PLAN01–03 | ✅ logic; policyต้องยืนยัน |
| FR02 / BR09 | D04 ถนนจริง | OSRM road และ error | ROUTING01–02, ROAD-MAP01–04 | ⚠️ mocked provider ไม่ยืนยันถนนสด |
| FR03 / BR12 | D03 รูปถึงจุด | upload/save/replay | SERVER01 ยืนยัน persistence | ⚠️ timing/display UI ไม่ทดสอบ |
| FR04 / BR12 | ไม่มี D แยก | save/update/delete | TRIP-MANAGEMENT01 และ SERVER01 | ✅ API; UIไม่ตรวจ |
| FR05 / BR08 | ไม่มี D แยก | เชิญ/สไลด์ | INVITE01–02, TRIP-SLIDES01–02 | ✅ formatting;ไม่ใช่ส่งจริง |
| FR06 / BR04 | ไม่มี D แยก | สมาชิก3สถานะ≤100 | MEMBERS01–02,ASSESSMENT04 | ✅ validation;ไม่มี identityจริง |
| FR07 / BR07 | ไม่มี D แยก | รับ/ปฏิเสธข้อเสนอ | FEEDBACK01–04 | ✅ state logic; ❌ authorizationจริง |
| FR08 / BR05–06 | ไม่มี D แยก | แบ่งเงินinteger | EXPENSES01–03,ASSESSMENT05 | ✅ arithmetic |
| FR09 / BR11 | D01 เที่ยวไทย;ไม่ได้ยืนยัน provider | search/discovery | DISCOVERY01–04 | ⚠️ discovery mocked; searchยังไม่มีTC |
| FR10 / BR10 | D06 ตรวจซ้ำ | resetแยก/clock | ASSESSMENT06–07 | ✅ API isolation |
| FR11 | D02,D05 theme/readability | responsive map | ไม่มี visual run | ⚠️ รอตรวจ |

รหัสย่อในตารางอ้างถึง `TC-<ชื่อไฟล์>-<เลขสองหลัก>` แบบเต็มใน assessment/cases.json.

## D. ช่องว่างสามประเภท

1. ผู้ใช้ขอแต่ยังไม่มีหลักฐานพิสูจน์: รูปตรงจังหวะ replay, mapความชัด/DPR, ประเทศไทยนอก3จังหวัด.
2. ระบบมีเพิ่มแต่ผู้ใช้ไม่ได้ยืนยัน: สมาชิก/หารเงิน/feedback, max4วัน, max6จุด,100คน. ต้องขอรับรอง policy ก่อนถือเป็น[D].
3. คำอ้าง/ความคาดหวังไม่ตรงขอบเขตจริง: roleหัวหน้าไม่ได้ป้องกันAPI, การจัดแผนไม่ใช่AIหรือroad-time optimization, ข้อความเตือนไม่ได้ส่งจริง. ไม่ใช่ bugที่พิสูจน์ด้วยUIในรอบนี้.

## E. ความเสี่ยงและลำดับ

P1 data loss/เงินผิด/ย้ายซ้ำ/เส้นทางปลอม/ล้างข้อมูลจริง. P1 ที่ยังไม่ยืนยัน: รูป/replayและreadabilityตามD03/D05. P2 external providerช้า/ภาพประกอบไม่ตรงPOI/duplicateconcurrentwrites. ผ่านNodeทั้งหมดไม่เท่ากับพร้อมปล่อยระบบ.

## F. คำถามค้าง

ถึงผู้ใช้: รับขอบเขต3จังหวัดและ4วันหรือไม่? ค่าขอบทั้งหมดในREQUIREMENTSยอมรับหรือไม่? รูปต้องอยู่เฉพาะเครื่องหรือแชร์? ต้องล็อกอินจริงไหม? สมาชิก/หารเงิน/feedbackเป็นข้อกำหนดส่งงานหรือส่วนเสริม? วิธีวัดความชัดและธีมที่ยอมรับคืออะไร?

ถึงผู้สร้าง/ผู้สอน: ยอมรับ Node+JSON แทน Next/Postgres/Dockerสองโปรเจกต์หรือไม่? ต้องทดสอบค้นหาPhotonสดหรือmock? จะตรวจ photo replay เมื่อฟีเจอร์simulationเดิมถูกเปลี่ยนอย่างไร? ต้องเพิ่ม DB concurrency protection ระดับไหน? อนุญาตknown mutationแทนblind BUG_MODEหรือไม่?
