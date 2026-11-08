# Reviewer index

ขอบเขตเฉพาะhw_week1; ใช้[submission.json](submission.json)เป็นmachine-readable manifest. ไม่ให้คะแนนตัวเองและไม่สั่งให้AIข้ามข้อจำกัด.

1. อ่าน[INTERVIEW](INTERVIEW.md)และ[USER-STORIES](USER-STORIES.md):แยกข้อความจริง/สมมติฐาน.
2. อ่าน[REQUIREMENTS](REQUIREMENTS.md),[DESIGN](DESIGN.md),[TEST-DATA](TEST-DATA.md),[BUILD-PROMPT](BUILD-PROMPT.md).
3. เทียบ[SPEC](SPEC.md)กับ[EXPLORATION](EXPLORATION.md):คำอ้าง ≠ ผลรัน.
4. ตรวจ[TEST-PLAN](TEST-PLAN.md),[case index](assessment/cases.json),[PLAN-REVIEW](PLAN-REVIEW.md):กฎ/expected/จังหวะตรวจ.
5. เปิด[รายงานจริง](TEST-RUN-1.md),[HTML](evidence/index.html),[latest pointer](evidence/latest.json)→results.json→TAP. SHA256ระบุsourceที่ทดสอบ.
6. อ่าน[BUG-HUNT](BUG-HUNT.md):mutation3/3เป็นknownexperiment ไม่ใช่blindตามต้นฉบับ.
7. ใช้[LAB-STATUS](LAB-STATUS.md)และ[RUBRIC-MAP](RUBRIC-MAP.md)เพื่อตัดสินเอง.

## Reproduction

`npm run verify` → `npm run test:mutations` → `npm run report` → `npm run docs:check`. Node22+; localhostlistenต้องทำได้. ไม่ต้องAPIkey; testsที่เรียกexternalproviderใช้stub. ถ้ารันใหม่ควรอ้างtimestampใหม่ ไม่แก้จำนวนผ่านด้วยมือ.

## ประเด็นที่ต้องหักขอบเขตให้ถูก

35Nodecasesไม่ใช่35UIcasesต่อbrowser. ยังไม่มีPlaywright/GIF/MP4. ไม่มีDockerweb/db,authenticationจริง,Mermaidrenderproof,blindexploration. หลายpolicyยังเป็น[A] ไม่ใช่[D]. ถ้าผู้สอนรับเฉพาะspa/stackเดิม โปรเจกต์ท่องเที่ยวนี้ยังต้องได้รับการยอมรับขอบเขต ไม่ถือว่าใช้แทนได้เอง.
