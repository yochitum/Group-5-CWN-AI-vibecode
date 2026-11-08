# LAB 12 — Controlled mutation experiment

Executed `2026-11-07T03:07:18.856Z` via `npm run test:mutations`.

**ADAPTED:** known source mutations in isolated copies. ผู้เขียนทราบfaultล่วงหน้า ไม่ใช่blindBUG_MODE ไม่ใช่การฝัง3bugลับในเว็บแล้วเปิดเฉลยภายหลัง จึงไม่รับรองว่าได้คะแนนrubric20ตามต้นฉบับ.

## Method

1. Copy backend/frontend to os.tmpdir; exclude user data/assets.
2. Run selected suite on unmodified copy; baseline must exit0.
3. Replace exactly one unique source expression; run the same tests and oracle.
4. Mark detected only if baselineexit0, mutantexit1 and TAP records at least1failedtest. Crash/timeout withoutfailedtest does not count.
5. Save baseline/mutant TAP and resultsJSON; delete temporarycopy in finally. Normal source never changed by this experiment.

| Mutation | Injected fault | Oracle / detecting case | Baseline / mutant | Result |
|---|---|---|---|---|
| M1 | Drop remainder satang | TC-EXPENSES-01: net=[5666,-1333,-4333],sum0 | 0 / 1 | DETECTED |
| M2 | Reject visit6 by changing cap6→5 | TC-ASSESSMENT-03:6visitsaccepted,7rejected | 0 / 1 | DETECTED |
| M3 | Accepted/rejected proposal remains pending | TC-FEEDBACK-01/02:terminalstateandno repeateddecision | 0 / 1 | DETECTED |

[Machine results](evidence/mutations/results.json)

- M1: [baseline](evidence/mutations/M1-baseline.tap), [mutant](evidence/mutations/M1-mutant.tap)
- M2: [baseline](evidence/mutations/M2-baseline.tap), [mutant](evidence/mutations/M2-mutant.tap)
- M3: [baseline](evidence/mutations/M3-baseline.tap), [mutant](evidence/mutations/M3-mutant.tap)

## Interpretation

Detected3/3 for these selected mutations only. M1 demonstratesindependentmoneyoracle; M2 boundarytestatallowedmaximum; M3 statetransitionguard. ไม่มีmutantที่พลาดในชุดนี้ แต่ไม่แปลว่าจับunknownbugได้ทั้งหมด และmutationเลือกให้ตรงrisksที่วางไว้ ไม่ใช่randomsampling.

ไม่แก้expectedให้ตามbug. Normalappไม่ถูกmutateจึงไม่ต้องtoggleกลับBUG_MODE; normalresultsสองรอบอยู่TEST-RUN-1 และsourcehashตรวจด้วยnpm run docs:check. ไม่มีการอ่านBUGS.mdเฉลยของteacherในworkflowนี้ แต่ไม่มีหลักฐานblindprocessให้รับรองrubric7.

ช่องว่างเพื่อให้ตรงLAB12เคร่งครัด: ผู้สร้างอื่นฝังbugลับ, รันbrowserplanโดยไม่อ่านsourceเฉลย, เก็บGIF/MP4พร้อมtriage, เปิดเฉลยท้ายสุด, กลับnormalmodeและตรวจซ้ำ.
