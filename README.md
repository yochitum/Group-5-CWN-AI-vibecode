# เที่ยวไหนดี — Travel planner / LAB 0–12 evidence

เว็บวางแผนเที่ยวไทย ใช้ HTML/CSS/JavaScript + Node.js และ JSON storage. ชุดนี้เพิ่มเอกสารเชื่อม **ความต้องการ → กฎ → Test Case → ผลรันจริง** สำหรับตรวจงาน LAB0–12 ของ [บทเรียนอ้างอิง](../00_week01/04_sabai-spa-web-and-testplan-from-interview/README.md).

**ผลที่พิสูจน์แล้ว:** Node tests35/35สองรอบ; known mutationsตรวจพบ3/3ในสำเนาชั่วคราว. **ยังไม่ครบเกณฑ์ต้นฉบับ:** Docker web/dbสองโปรเจกต์, Playwright3เบราว์เซอร์, GIF/MP4, blindBUG_MODEและvisualUI verification. เอกสารส่วนใหญ่จัดทำย้อนหลัง ไม่ใช่หลักฐานว่าทำตามลำดับLABตั้งแต่ต้น และไม่รับรองคะแนนแทนผู้ตรวจ.

## งานนี้ตอบโจทย์ LAB อะไร และตรวจตรงไหน

ตารางนี้เป็นแผนที่หลักฐานของ **LAB 0–12 ครบทั้ง 13 LAB**: คอลัมน์ “ส่วนที่ตอบโจทย์” บอกสิ่งที่ทำไว้ ส่วน “เปิดตรวจที่ไหน” ระบุไฟล์และหัวข้อที่ผู้ตรวจควรอ่านโดยตรง การมีไฟล์ไม่ได้หมายความว่าผ่านทุกเงื่อนไขของ LAB; ดูข้อจำกัดในคอลัมน์สุดท้ายประกอบ

| LAB / เป้าหมายในบทเรียน | ส่วนที่ตอบโจทย์ในโปรเจกต์นี้ | เปิดตรวจที่ไหน | สถานะและส่วนที่ยังขาด |
|---|---|---|---|
| **LAB 0 — เตรียมเครื่องมือและวิธีรัน** | บันทึกเวอร์ชัน Node, npm, Docker และ ffmpeg ที่ตรวจจริง พร้อมคำสั่งเปิดเว็บ ตรวจ health และรันทดสอบ | [LAB0.md](LAB0.md); คำสั่งใน [package.json](package.json); หัวข้อ “เริ่มรัน” ด้านล่าง | **บางส่วน:** ยังไม่มีหลักฐานติดตั้งและรันเบราว์เซอร์ของ Playwright |
| **LAB 1 — สัมภาษณ์ → User Stories / Acceptance Criteria** | สรุปข้อความผู้ใช้ D01–D06 เป็นความต้องการ; มี US-01–US-11 พร้อม Must/Should/Could, acceptance criteria และ FR ที่เกี่ยวข้อง | [INTERVIEW.md](INTERVIEW.md) ตารางข้อความผู้ใช้; [USER-STORIES.md](USER-STORIES.md) ตาราง US และ AC | **มีเอกสารย้อนหลัง:** อ้างบทสนทนาที่มีจริง; ฟีเจอร์เสริมและ policy ที่ติดป้าย [A] ยังต้องยืนยันกับผู้ใช้ |
| **LAB 2 — Functional / Business / Non-functional Requirements** | ระบุ FR-01–FR-11, BR-01–BR-12 และ NFR-01–NFR-05; เชื่อม US → FR → BR พร้อมค่าขอบต่ำกว่า/ที่ขอบ/เกินขอบ หรือสามกลุ่มข้อมูลสำหรับกฎที่ไม่ใช่ตัวเลข | [REQUIREMENTS.md](REQUIREMENTS.md) หัวข้อ Functional requirements, Business rules และ Non-functional requirements | **มีเอกสารย้อนหลัง:** ค่าจำกัดจากโค้ดเป็น policy [A] ไม่ใช่ข้อกำหนด [D] ที่ผู้ใช้ยืนยันแล้ว |
| **LAB 3 — ออกแบบระบบด้วยแผนภาพ** | มี Architecture, Use Case, Flowchart 2 แบบ, logical ERD และ Sequence 2 แบบ รวม 7 แผนภาพ Mermaid; อธิบายขอบเขตข้อมูลและบทบาท | [DESIGN.md](DESIGN.md) ทั้ง 7 หัวข้อแผนภาพ | **บางส่วน:** มี Mermaid source แต่ยังไม่มีหลักฐาน render; ERD เป็นโมเดล JSON ไม่ใช่ PostgreSQL schema |
| **LAB 4 — Test Data และผลที่คำนวณเอง** | กำหนดเวลาล็อก, fixtures แผน/สถานที่/สมาชิก/ค่าใช้จ่าย/รูป/เส้นทาง; แสดงวิธีคิดยอด 13,000 สตางค์และ balance แต่ละคน; มีข้อมูลขอบเขตตาม BR | [TEST-DATA.md](TEST-DATA.md) หัวข้อ Fixtures, วิธีคิด และ Isolation / reset; [REQUIREMENTS.md](REQUIREMENTS.md) ตารางค่าขอบ | **บางส่วน:** ล็อกเฉพาะ savedAt ใน test server; ไม่มี PostgreSQL seed และยังไม่ได้รันทดสอบทุกค่าขอบในเอกสาร |
| **LAB 5 — Build Prompt จากเอกสาร** | มี prompt ที่ให้อ่าน requirements/design/test data ก่อนสร้างระบบ พร้อม stack, ขอบเขต mock, validation, isolation และเงื่อนไขทดสอบ | [BUILD-PROMPT.md](BUILD-PROMPT.md) ข้อความ reproduction prompt และ acceptance | **มีเอกสารย้อนหลัง:** ใช้สร้างหรือบำรุงเวอร์ชันนี้ซ้ำได้ แต่ไม่อ้างว่าเป็น prompt ที่ใช้เริ่มพัฒนาจริง |
| **LAB 6 — สร้างเว็บและระบบเก็บข้อมูลที่ทดสอบได้** | มีเว็บวางแผนเที่ยว, API, JSON persistence, validation, static data-testid และ server ทดสอบที่เปิด reset แบบ opt-in โดยแยกไฟล์ข้อมูลจริง | [frontend/index.html](frontend/index.html); [backend/server.cjs](backend/server.cjs); [assessment/serve.cjs](assessment/serve.cjs); [SPEC.md](SPEC.md) | **ดัดแปลงจากโจทย์:** ใช้ HTML/JS + Node + JSON; ยังไม่มี Next.js + PostgreSQL และ Docker web/db แยกสองโปรเจกต์ |
| **LAB 7 — สำรวจสิ่งที่ผู้ใช้ขอ / เว็บมี / ช่องว่าง** | ส่วน A รวบรวมสิ่งที่ควรพบ, ส่วน B ทำ sitemap และ feature inventory, ส่วน D แยกช่องว่าง 3 ประเภท | [EXPLORATION.md](EXPLORATION.md) **ส่วน A, B และ D** | **บางส่วน:** เป็นการตรวจย้อนหลังหลังอ่านโค้ด ไม่ใช่ blind UI exploration และไม่อ้างว่าเขียน expected ก่อนเปิดเว็บ |
| **LAB 8 — เทียบกฎสามทางและตั้งคำถาม** | ส่วน C เทียบ [D] ผู้ใช้ขอ / [A] ระบบอ้าง / [O] ผลที่มีหลักฐาน พร้อม verdict; ส่วน E จัดความเสี่ยง; ส่วน F แยกคำถามถึงผู้ใช้และผู้สร้าง | [EXPLORATION.md](EXPLORATION.md) **ส่วน C, E และ F** | **บางส่วน:** [O] ครอบคลุมผล Node/API; ยังไม่มีผลเดินหน้าเว็บและภาพยืนยัน UI |
| **LAB 9 — Test Plan หัวข้อ 1–5 และทดลองรัน** | มีภาพรวม, ขอบเขต, 6 เทคนิค, ระดับความสำคัญ และตาราง cases พร้อม expected/FR/BR; มี 35 Node cases ที่รันได้ และ 5 UI cases ที่วางแผนไว้ | [TEST-PLAN.md](TEST-PLAN.md) **หัวข้อ 1–5**; [assessment/cases.json](assessment/cases.json); [TEST-RUN-1.md](TEST-RUN-1.md) | **บางส่วน:** Node ผ่าน 35/35 สองรอบ; UI อีก 5 cases ยัง NOT_RUN ไม่รวมเป็นผลผ่าน |
| **LAB 10 — Test Plan หัวข้อ 6–8 และทบทวน coverage** | มี Entry/Exit ที่วัดได้, ข้อมูลทดสอบ, failure predictions 8 แบบ และตาราง BR → TC; แยกเกณฑ์ผ่านของ Node subset จากเกณฑ์เต็มรายเบราว์เซอร์ | [TEST-PLAN.md](TEST-PLAN.md) **หัวข้อ 6–8**; [PLAN-REVIEW.md](PLAN-REVIEW.md) หัวข้อ Traceability และ Review findings | **มีเอกสารย้อนหลัง:** ระบุช่องว่าง coverage แล้ว; เกณฑ์ผ่านเต็มของ browser plan ยัง NOT_MET |
| **LAB 11 — รันอัตโนมัติซ้ำและเก็บหลักฐาน** | มี runner สองรอบ, raw TAP, results JSON พร้อม source SHA256, รายงาน HTML และ triage; ตรวจย้อนกลับถึง TC และ source ได้ | [assessment/verify.cjs](assessment/verify.cjs); [TEST-RUN-1.md](TEST-RUN-1.md); [evidence/latest.json](evidence/latest.json); [รายงาน HTML](evidence/index.html); [triage.json](evidence/triage.json) | **บางส่วน:** หลักฐานเป็น Node/API ไม่ใช่ Playwright; Chromium/Firefox/WebKit ยัง NOT_RUN; GIF = 0, MP4 = 0 |
| **LAB 12 — ทดลองว่าชุดทดสอบจับบั๊กได้หรือไม่** | ทดลองเปลี่ยนโค้ด 3 จุดในสำเนาชั่วคราว: ทิ้งเศษสตางค์, จำกัดจำนวนจุดผิด, ไม่เปลี่ยนสถานะข้อเสนอ; เก็บ baseline/mutant logs และจับได้ 3/3 โดยไม่แก้ expected | [BUG-HUNT.md](BUG-HUNT.md) Method / Results / Interpretation; [assessment/mutations.cjs](assessment/mutations.cjs); [ผล JSON](evidence/mutations/results.json) | **ดัดแปลงจากโจทย์:** เป็น known mutation experiment ไม่ใช่ blind BUG_MODE หรือหลักฐานจับบั๊กลับผ่าน UI |

### ตัวอย่างการตรวจย้อนกลับหนึ่งเรื่อง

เรื่อง **หารค่าใช้จ่ายโดยเงินไม่หาย** เชื่อมหลักฐานได้ดังนี้:

1. **LAB 1:** US-08 ใน [USER-STORIES.md](USER-STORIES.md) ระบุเป้าหมายยอดสุทธิรวม 0 สตางค์ และระบุว่าฟีเจอร์นี้ยังเป็นขอบเขต [A]
2. **LAB 2:** FR-08 / BR-05–06 ใน [REQUIREMENTS.md](REQUIREMENTS.md) กำหนดจำนวนเต็มสตางค์และการแจกเศษ
3. **LAB 4:** [TEST-DATA.md](TEST-DATA.md) คำนวณเองว่า a = 5,666, b = −1,333, c = −4,333 สตางค์ รวมเป็น 0
4. **LAB 9–10:** TC-EXPENSES-01 ใน [TEST-PLAN.md](TEST-PLAN.md) ระบุ expected และ [PLAN-REVIEW.md](PLAN-REVIEW.md) ผูกกลับไปยัง BR-06
5. **LAB 11:** [backend/expenses.test.cjs](backend/expenses.test.cjs) มี assertion ตรงตัวเลข และ [TEST-RUN-1.md](TEST-RUN-1.md) ลิงก์ผลรันจริงสองรอบ
6. **LAB 12:** M1 ใน [BUG-HUNT.md](BUG-HUNT.md) ทดลองทำให้เศษสตางค์หาย แล้ว test เดิมตรวจพบความผิดพลาด

สำหรับเกณฑ์คะแนนรายข้อ ใช้ [RUBRIC-MAP.md](RUBRIC-MAP.md) ซึ่งจับคู่หลักฐานกับ rubric 20 ข้อ; สำหรับดัชนีที่โปรแกรมอ่านได้ ใช้ [submission.json](submission.json)

## เริ่มรัน

Node.js22+; ไม่มีdependenciesหรือAPIkeyที่ต้องติดตั้งก่อนรัน.

```sh
cd /Users/tiraputtirapongtawat/travel-in-thai/Agent/hw_week1
npm start
```

เปิด **http://localhost:8080**; หยุดด้วยCtrl+C. Windowsใช้terminalที่โฟลเดอร์นี้แล้ว`npm.cmd start`. ห้ามเปิดindex.htmlผ่านfile://หรือLive Serverเพราะต้องใช้backendAPI. ถ้าพอร์ตชนใช้`PORT=8082 npm start`บนmacOS หรือ`$env:PORT=8082; npm.cmd start`บนPowerShell.

แผนเป็นdeterministic mock ไม่ใช่LLM. Catalogตัวอย่าง3จังหวัด; แผนที่OSM/เส้นทางOSRM/searchPhoton/discoveryOverpassและภาพภายนอกต้องใช้อินเทอร์เน็ต. ไม่มีlogin/payment/การส่งข้อความจริง. ข้อมูลบันทึกอยู่backend/data/trips.jsonและไม่ติดGit.

## ผู้ตรวจเริ่มตรงนี้

1. [REVIEW-INDEX](REVIEW-INDEX.md) — ลำดับอ่านและหลักฐาน
2. [LAB-STATUS](LAB-STATUS.md) — ครบทั้ง13LABพร้อมสถานะและช่องว่าง
3. [RUBRIC-MAP](RUBRIC-MAP.md) — ผูกหลักฐานกับเกณฑ์20ข้อ
4. [submission.json](submission.json) — ดัชนีสำหรับโปรแกรม/AI
5. [รายงานHTML](evidence/index.html) / [ผลรัน](TEST-RUN-1.md) / [bug experiment](BUG-HUNT.md)

## ตรวจซ้ำ

```sh
npm test                 # Node tests หนึ่งรอบ
npm run verify           # สองรอบ + TAP/JSON + source SHA256
npm run test:mutations   # baseline/mutant แยก temp copies
npm run report           # สรุปหลักฐานที่มีเป็น HTML + triage
npm run docs:check       # ตรวจ links, IDs, traceability และsource hashes
```

รายงานใหม่อยู่`evidence/<timestamp>/`; pointerล่าสุด`evidence/latest.json`. ผลmutationอยู่`evidence/mutations/`และจะถูกแทนเมื่อรันใหม่. Testsใช้temporaryfiles ไม่ล้างทริปจริง. `report`เป็นตัวสรุปไม่ใช่ตัวรันทดสอบ; ดูgeneratedAtก่อนอ้างผล.

## Server สำหรับทดสอบแยก

`npm run start:test` เปิด **http://localhost:8082** ใช้`assessment/.runtime/trips.json`. POST `/api/test/reset` ด้วยJSON `{}`ล้างเฉพาะข้อมูลtestและล็อกsavedAtไว้2026-11-07T09:00:00+07:00. Serverปกติไม่เปิดreset (404). ถ้ารันappปกติที่8082ให้เปลี่ยนTEST_PORTก่อน.

## โครงสร้าง

| Path | หน้าที่ |
|---|---|
| frontend/ | UI, map, photo/details, group/expenses |
| backend/ | API, domainlogic,35Nodecases |
| assessment/ | isolatedserver,verify,mutations,caseindex,docchecker |
| evidence/ | rawTAP,JSON,sourcehash,HTML; commitเป็นหลักฐานได้ |
| INTERVIEW → REQUIREMENTS → DESIGN → TEST-DATA | ที่มาความต้องการและoracle |
| TEST-PLAN / PLAN-REVIEW / TEST-RUN-1 / BUG-HUNT | แผน,coverage,ผลจริง,การทดลองbug |
| README-LEGACY.md | คู่มือเดิมเก็บอ้างอิง; ข้อความสถานะเก่าไม่ใช้แทนREADMEนี้ |

[D]ข้อความผู้ใช้, [R]เหตุผล/คณิตศาสตร์, [A]คำอ้างหรือpolicyจากโค้ด, [O]ผลที่มีหลักฐาน. ไม่ใช้ผลของhw_week1_code_teacherหรือผลbrowserที่ไม่ได้รันมาเพิ่มตัวเลขของงานนี้.
