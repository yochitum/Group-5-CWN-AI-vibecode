# Rubric20ข้อ — evidence map

อิงบทเรียนต้นฉบับ; ไม่ใช่คะแนนและไม่แนะนำให้ผู้ตรวจให้คะแนนโดยไม่อ่านหลักฐาน

| ID | เกณฑ์ย่อ | หลักฐาน | สถานะ/ข้อจำกัด |
|---|---|---|---|
| R01 | Stories + AC | [USER-STORIES.md](USER-STORIES.md) | มี11USและAC; scope[A]ต้องยืนยัน |
| R02 | BR boundaries / US trace | [REQUIREMENTS.md](REQUIREMENTS.md) | มีtriple/partitionsและtrace; ไม่ได้executeทุกค่า |
| R03 | Design + render | [DESIGN.md](DESIGN.md) | ครบ5ชนิด7แผนภาพ; ยังไม่มีrenderproof |
| R04 | Test data + math | [TEST-DATA.md](TEST-DATA.md) | fixedsavedAt+สูตรเงิน; ไม่ใช่spatier/Postgresseed |
| R05 | Build prompt | [BUILD-PROMPT.md](BUILD-PROMPT.md) | มีreproductionpromptย้อนหลัง |
| R06 | Docker web/db | [SPEC.md](SPEC.md) | ADAPTED: Node+JSON; ไม่ครบสองDockerprojects |
| R07 | ไม่เปิดเฉลยก่อนท้าย | [BUG-HUNT.md](BUG-HUNT.md) | ไม่มีblindworkflow; ไม่อ้างคะแนนข้อนี้ |
| R08 | Expectedก่อนเปิดเว็บ | [EXPLORATION.md](EXPLORATION.md) | retrospective; ไม่อ้างลำดับก่อนเปิดเว็บ |
| R09 | D/A/O + verdict | [EXPLORATION.md](EXPLORATION.md) | มีครบป้าย; Oเป็นNode/APIไม่ใช่visual |
| R10 | 3gaptypes + questions | [EXPLORATION.md](EXPLORATION.md) | มีD3ประเภทและFผู้ใช้/ผู้สร้าง |
| R11 | FR/BR test trace | [PLAN-REVIEW.md](PLAN-REVIEW.md) | ทุกBRมีcase; FR11UIค้างและpartialfeaturecoverage |
| R12 | 6techniques / P1 | [TEST-PLAN.md](TEST-PLAN.md) | มี6เทคนิค; ยังขาดUInegativeบางfeature |
| R13 | Measurableexpected + math | [TEST-DATA.md](TEST-DATA.md) | ตัวเลขชัด; caseindexมีexpected |
| R14 | D/R provenance | [assessment/cases.json](assessment/cases.json) | มีRreasoningแต่policyAยังไม่ยืนยัน; ไม่อ้างครบเกณฑ์ |
| R15 | ไม่เปลี่ยนexpectedตามbug | [BUG-HUNT.md](BUG-HUNT.md) | mutationใช้oracleเดิม; ไม่มีhistoricalblindproof |
| R16 | Entry/Exit + ≥6 predictions | [TEST-PLAN.md](TEST-PLAN.md) | เกณฑ์วัดได้;8failurepredictions |
| R17 | State checkpoints | [TEST-PLAN.md](TEST-PLAN.md) | ทันที/หลังserverrestart; browserreloadNOT_RUN |
| R18 | 3browsersstable | [TEST-RUN-1.md](TEST-RUN-1.md) | NOT_RUN; Node2รอบไม่ใช่browser |
| R19 | GIF/MP4/triage | [evidence/triage.json](evidence/triage.json) | มีNode/mutationtriage; GIF0 MP40 |
| R20 | Blindbughunt ≥2/3 | [BUG-HUNT.md](BUG-HUNT.md) | knownmutation3/3; ยังไม่เท่ากับblindBUG_MODE |
