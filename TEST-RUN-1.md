# LAB 9 / 11 — Actual Node/API run

Executed `2026-11-07T03:07:16.093Z` on `darwin`, `v26.5.1`. Command: `npm run verify`. Scope: **Node unit + API integration; not browser E2E**. Integration tests listen on ephemeral localhost ports and use temporary data; external provider calls are stubbed.

| Round | Tests | Passed | Failed | Skipped | Exit code | Raw evidence |
|---|---|---|---|---|---|---|
| 1 | 35 | 35 | 0 | 0 | 0 | [TAP](evidence/2026-11-07T03-07-15-482Z/run-1.tap) |
| 2 | 35 | 35 | 0 | 0 | 0 | [TAP](evidence/2026-11-07T03-07-15-482Z/run-2.tap) |

[Results JSON + source SHA256](evidence/2026-11-07T03-07-15-482Z/results.json) · [HTML report](evidence/index.html) · [Machine triage](evidence/triage.json) · [Case index](assessment/cases.json).

35 top-level tests; each may have multiple assertions. ไม่ใช้จำนวน assertions เป็นจำนวน test cases. รอบ2เป็นการรันใหม่จริงไม่ใช่คัดลอกผลรอบ1. Expectedในexistingtestsไม่ถูกแก้เพื่อให้ผ่าน; เพิ่ม7caseในassessment.test.cjsและเติมIDในtesttitlesเดิม.

## Verdict

- Node subset Exit: **MET** — 35/35 ทั้งสองรอบ ไม่มี failed/skipped.
- Full40case browser Exit: **NOT_MET** — Chromium/Firefox/WebKit NOT_RUN ทั้งหมด;5plannedUIcasesยังไม่รัน และ35Nodecasesยังไม่ถูกย้ายเป็นbrowsercases.
- GIF=0, MP4=0. ไม่มีหลักฐานvisualแผนที่ชัดหรือรูปตรงจังหวะreplay.
- Date/timeล็อกเฉพาะtest savedAtตามTEST-DATA; UUIDไม่deterministicแต่testsไม่ผูกกับUUIDค่าตายตัว.
- คำว่า“ผ่าน”ข้างต้นไม่รวมpublicproviderสด,securityproduction,fullThailandcoverage,concurrencyหรือDockerDB.

## Triage

ไม่มีnormalfailureในสองรอบนี้. Injectedfailures3รายการแยกเป็นintentionalmutationในtriage.json; ไม่ใช้mutantfailureนับเป็นnormalappdefect. หากรันใหม่เกิดfailureให้เก็บrawTAPก่อนแยกapp/test/requirement/environment. ข้อมูลผลใหม่ดูevidence/latest.json; เอกสารนี้เป็นsnapshotของtimestampด้านบน.
