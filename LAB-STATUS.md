# LAB0–12 status

สถานะเป็นชนิดหลักฐาน ไม่ใช่คะแนน. DOCUMENTED_RETROSPECTIVE = มีเอกสารย้อนหลัง; PARTIAL = หลักฐานยังไม่ครบ; ADAPTED = วิธีต่างจากโจทย์

| LAB | งาน | Status | Artifact | ข้อจำกัด |
|---|---|---|---|---|
| LAB-00 | เครื่องมือ | PARTIAL | [LAB0.md](LAB0.md), [package.json](package.json) | ไม่มี browser installation/run evidence |
| LAB-01 | Interview / User Stories | DOCUMENTED_RETROSPECTIVE | [INTERVIEW.md](INTERVIEW.md), [USER-STORIES.md](USER-STORIES.md) | policy[A]ยังต้องผู้ใช้ยืนยัน; ไม่ใช่interviewใหม่ |
| LAB-02 | FR / BR / NFR | DOCUMENTED_RETROSPECTIVE | [REQUIREMENTS.md](REQUIREMENTS.md) | numeric policyยังไม่ใช่[D] |
| LAB-03 | Design | PARTIAL | [DESIGN.md](DESIGN.md) | Mermaidยังไม่มีrender proof |
| LAB-04 | Test data | PARTIAL | [TEST-DATA.md](TEST-DATA.md) | ไม่มีPostgresseed; ไม่ได้executeทุกboundarytriple |
| LAB-05 | Build prompt | DOCUMENTED_RETROSPECTIVE | [BUILD-PROMPT.md](BUILD-PROMPT.md) | ไม่ใช่promptที่ใช้เริ่มพัฒนาจริง |
| LAB-06 | Implementation | ADAPTED | [SPEC.md](SPEC.md), [backend/server.cjs](backend/server.cjs), [assessment/serve.cjs](assessment/serve.cjs), [frontend/index.html](frontend/index.html) | ไม่มีNext/Postgres/Dockerสองโปรเจกต์ตามโจทย์ |
| LAB-07 | Exploration A/B/D | PARTIAL | [EXPLORATION.md](EXPLORATION.md) | code-informed; ไม่ใช่blind UI exploration |
| LAB-08 | Exploration C/E/F | PARTIAL | [EXPLORATION.md](EXPLORATION.md) | [O]จำกัดNode/API; ไม่มีvisualobservation |
| LAB-09 | Test plan1–5 / run | PARTIAL | [TEST-PLAN.md](TEST-PLAN.md), [TEST-RUN-1.md](TEST-RUN-1.md), [assessment/cases.json](assessment/cases.json) | 5UIcasesยังNOT_RUN |
| LAB-10 | Test plan6–8 / review | DOCUMENTED_RETROSPECTIVE | [TEST-PLAN.md](TEST-PLAN.md), [PLAN-REVIEW.md](PLAN-REVIEW.md) | FullbrowserExitยังNOT_MET |
| LAB-11 | Automated evidence | PARTIAL | [assessment/verify.cjs](assessment/verify.cjs), [evidence/latest.json](evidence/latest.json), [evidence/index.html](evidence/index.html), [evidence/triage.json](evidence/triage.json) | ไม่มีPlaywright3browser/GIF/MP4 |
| LAB-12 | Bug hunt | ADAPTED | [BUG-HUNT.md](BUG-HUNT.md), [assessment/mutations.cjs](assessment/mutations.cjs), [evidence/mutations/results.json](evidence/mutations/results.json) | knownsource mutations ไม่ใช่blind BUG_MODE |
