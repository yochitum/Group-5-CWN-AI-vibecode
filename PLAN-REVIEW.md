# LAB 10 — Plan review

35 executable Nodecases +5 NOT_RUN UIcases. Scope-reviewed, **not approved for release or full lab completion**.

## Traceability

| BR | Executable cases | Assessment |
|---|---|---|
| BR-01 | TC-ASSESSMENT-01, TC-SERVER-01 | assertion scope only; see limitations below |
| BR-02 | TC-ASSESSMENT-02, TC-SERVER-01 | assertion scope only; see limitations below |
| BR-03 | TC-ASSESSMENT-03, TC-SELECTED-PLAN-01, TC-SELECTED-PLAN-02, TC-SELECTED-PLAN-03 | assertion scope only; see limitations below |
| BR-04 | TC-ASSESSMENT-04, TC-MEMBERS-01, TC-MEMBERS-02 | assertion scope only; see limitations below |
| BR-05 | TC-ASSESSMENT-05, TC-EXPENSES-03 | assertion scope only; see limitations below |
| BR-06 | TC-EXPENSES-01, TC-EXPENSES-02 | assertion scope only; see limitations below |
| BR-07 | TC-FEEDBACK-01, TC-FEEDBACK-02, TC-FEEDBACK-03, TC-FEEDBACK-04 | assertion scope only; see limitations below |
| BR-08 | TC-INVITE-01, TC-INVITE-02, TC-TRIP-SLIDES-01, TC-TRIP-SLIDES-02 | assertion scope only; see limitations below |
| BR-09 | TC-ROAD-MAP-01, TC-ROAD-MAP-02, TC-ROAD-MAP-03, TC-ROAD-MAP-04, TC-ROUTING-01, TC-ROUTING-02 | assertion scope only; see limitations below |
| BR-10 | TC-ASSESSMENT-06, TC-ASSESSMENT-07 | assertion scope only; see limitations below |
| BR-11 | TC-DISCOVERY-01, TC-DISCOVERY-02, TC-DISCOVERY-03, TC-DISCOVERY-04 | assertion scope only; see limitations below |
| BR-12 | TC-SERVER-01, TC-TRIP-MANAGEMENT-01 | assertion scope only; see limitations below |

FR01..10มีNodecaseอย่างน้อย1ข้อ; FR03มีเฉพาะpersistenceไม่ใช่replay; FR09ครอบคลุมdiscoveryแต่ไม่ใช่Photonsearch. FR11ไม่มีautomatedcaseมีUI02ค้าง. การมี1TCต่อBRไม่ใช่branch/boundarycoverage100%.

## Review findings

- หกเทคนิคมีชื่อcaseชัดในcases.json; P1featureplanning/routing/feedback/members/expenses มีhappyและnegative/boundary. Save/deleteมีhappy/stateรวมinvalid APIในSERVER01; UI photo/readabilityยังขาดnegativevisualproof.
- BR01/02/03/04/05มีnumericboundarytestsเพิ่ม; BR08ยังไม่ครบ99/100/101; BR12photoขอบ200000ยังไม่มีtripleassertion. BR11bboxขอบnumericละเอียดและsearchยังขาด.
- OracleเงินและระยะคำนวณเองในTEST-DATA; policy[A]ต้องผู้ใช้ยืนยันก่อนบอก[D]. ไม่ได้ทำpre-webblindexploration จึงไม่ผ่านเงื่อนไขลำดับLAB7.
- Statecheckpointระบุทันที/หลังserverrestartชัด; browserreloadมีเฉพาะplannedUIcasesจึงยังNOT_RUN.
- มีfailureprediction8แบบ;3แบบทดลองmutationจริง; normalcodeไม่ถูกแก้ด้วยmutation.
- Staticdata-testidช่วยเริ่มE2E แต่ไม่ได้พิสูจน์ทุกdynamiccontrolหรือcrossbrowseraccessibility.
- Next/Postgres/Dockerสองโปรเจกต์, Mermaidrender, fullPlaywrightsuite3browsers, GIF/MP4, blindBUG_MODE เป็นช่องว่างที่ยังต้องทำหากผู้สอนใช้เกณฑ์ต้นฉบับเคร่งครัด.

## การตัดสิน

Node correctness subset: ดูรายงานจริงในTEST-RUN-1. Full40case browser Exit: NOT_MET. ไม่คำนวณคะแนน20ข้อแทนผู้ตรวจ ไม่ใช้ผลโปรเจกต์teacher.
