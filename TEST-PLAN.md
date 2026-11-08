# LAB 9–10 — Test plan

## 1. ภาพรวม

ตรวจ correctness และการเก็บข้อมูลของเที่ยวไหนดี. 35 executable Node cases +5 UI casesที่ยังไม่รัน รวม40 case records. เอกสารย้อนหลัง ไม่ใช่ pre-development plan. Expectedเลข/สถานะต้องคงเดิมเมื่อเจอbug; ห้ามแก้expectedเพื่อให้ตามimplementationผิด.

## 2. ขอบเขต

Node covers validation, planning, road/discovery adapter mocks, feedback, members, expenses, invitations, slides, save/restart/delete และ isolated reset. ไม่ครอบคลุม browser rendering, live routing quality, whole Thailand, authจริง, payments, concurrency, Photon search. UI five casesด้านล่างเป็นงานค้าง ไม่รวมในตัวเลข35ผ่าน.

## 3. วิธีคิด test cases

หกเทคนิค: Happy, Negative, Boundary, Equivalence, State, Security/API. Oracle[R] ได้แก่ conservation of money,ไม่มีจุดหาย/ซ้ำ,atomic failed decision,output escaping,unit conversion; policyตัวเลขจาก[A]ยังต้องยืนยัน ไม่เปลี่ยนป้ายเป็น[D]. [D]ใช้เป้าหมายถนน/รูป/readability ไม่ใช้ตัดสินตัวเลขที่ผู้ใช้ไม่เคยยืนยัน.

PreconditionสำหรับทุกNodecase: Node22+, temp storageว่าง, importfixtureตามfile, networkจำลองในtestที่เรียกprovider. Steps/assertionsอยู่ใน executable sourceที่ลิงก์และชื่อtestมีIDตรงกัน; ไม่ต้องเดาข้อมูลจากภาพ. ตรวจทันทีหลังoperation; TC-SERVER-01 ตรวจอีกรอบหลังปิด/เปิดserverใหม่ (ไม่ใช่browserreload). Feedback coreตรวจทันที; persistence feedbackตรวจที่servercase.

## 4. ระดับความสำคัญ

35 NodecasesกำหนดP1 regression baseline เนื่องจากตรวจdata integrity/validation/critical output; ไม่ได้หมายความทุกฟีเจอร์เป็นMust. UI01–04เป็นP1,UI05เป็นP2. ความสำคัญของcaseแยกจากMust/Should/Couldของfeature.

## 5. Test cases

ที่มา oracle และ checkpointรายcase: [cases.json](assessment/cases.json). ทุกค่าขอบเป็นproposed policy[A]ร่วมกับเหตุผล[R]; ยังไม่ผ่านเกณฑ์ผู้สอนเรื่อง[D/R]ทั้งหมดหากต้องการข้อกำหนดยืนยันจากเจ้าของเท่านั้น.

| ID | Priority / technique | Trace | Expected ที่ตรวจได้ | Steps + fixtures + assertions |
|---|---|---|---|---|
| TC-ASSESSMENT-01 | P1 / Boundary | FR-01; BR-01 | 1/4 วันผ่าน; 0/5/1.5 ถูกปฏิเสธ | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-02 | P1 / Boundary | FR-01; BR-02 | 500/100000 ผ่าน; 499/100001/NaN ถูกปฏิเสธ | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-03 | P1 / Boundary | FR-01; BR-03 | 6 จุดต่อวันผ่าน; 7 จุดถูกปฏิเสธ | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-04 | P1 / Boundary | FR-06; BR-04 | 99/100 คนผ่าน; 101 คนถูกปฏิเสธ | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-05 | P1 / Boundary | FR-08; BR-05 | 1..100000000 สตางค์ผ่าน; 0/100000001/1.5 ถูกปฏิเสธ | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-06 | P1 / Security/API | FR-10; BR-10 | reset ปกติได้ 404; ห้ามเปิด reset บนไฟล์ข้อมูลหลัก | [test](backend/assessment.test.cjs) |
| TC-ASSESSMENT-07 | P1 / State | FR-10; BR-10 | reset ล้างข้อมูลทดสอบ; savedAt เท่ากับเวลาล็อก; เวลาผิดไม่ล้างข้อมูล | [test](backend/assessment.test.cjs) |
| TC-DISCOVERY-01 | P1 / Negative | FR-09; BR-11 | bbox กว้าง/กลับด้าน/นอกพื้นที่/ไม่ใช่ตัวเลขถูกปฏิเสธ | [test](backend/discovery.test.cjs) |
| TC-DISCOVERY-02 | P1 / Equivalence | FR-09; BR-11 | แปลง POI มีชื่อ; ข้ามรายการไม่มีชื่อ; แยกหมวด | [test](backend/discovery.test.cjs) |
| TC-DISCOVERY-03 | P1 / State | FR-09; BR-11 | viewport ซ้ำใช้ cache; คำขอใหม่ที่ถี่เกินได้ 429 | [test](backend/discovery.test.cjs) |
| TC-DISCOVERY-04 | P1 / Negative | FR-09; BR-11 | provider ล่มได้ 503 ไม่ใช่ผลสำเร็จว่าง | [test](backend/discovery.test.cjs) |
| TC-EXPENSES-01 | P1 / Happy | FR-08; BR-06 | รวม 13000; a=5666 b=-1333 c=-4333; โอนแล้วทุกยอด=0 | [test](backend/expenses.test.cjs) |
| TC-EXPENSES-02 | P1 / Equivalence | FR-08; BR-06 | a จ่าย 500 ให้ b: b คืน a 500 | [test](backend/expenses.test.cjs) |
| TC-EXPENSES-03 | P1 / Negative | FR-08; BR-05 | คนไม่รู้จัก/ไม่เลือกคนหาร/เศษสตางค์/คนซ้ำถูกปฏิเสธ | [test](backend/expenses.test.cjs) |
| TC-FEEDBACK-01 | P1 / Negative | FR-07; BR-07 | friend ตัดสินไม่ได้; reject คงแผนและสถานะเป็น rejected | [test](backend/feedback.test.cjs) |
| TC-FEEDBACK-02 | P1 / State | FR-07; BR-07 | accept ย้ายครั้งเดียวก่อน end; accept ซ้ำถูกปฏิเสธ | [test](backend/feedback.test.cjs) |
| TC-FEEDBACK-03 | P1 / Negative | FR-07; BR-07 | ต้นทางหายหรือปลายทางเต็ม: แผนและ pending ไม่เปลี่ยน | [test](backend/feedback.test.cjs) |
| TC-FEEDBACK-04 | P1 / Happy | FR-07; BR-07 | accept add เพิ่มร้าน; accept comment ไม่แก้แผน | [test](backend/feedback.test.cjs) |
| TC-INVITE-01 | P1 / Happy | FR-05; BR-08 | ข้อความมี 01/12/2026, 4 คน, สถานี 08:00, วันอิสระ และไม่มี localhost | [test](backend/invite.test.cjs) |
| TC-INVITE-02 | P1 / Boundary | FR-05; BR-08 | ข้อมูลเชิญ 4 คนคงเดิม; 0 คนถูกปฏิเสธ | [test](backend/invite.test.cjs) |
| TC-MEMBERS-01 | P1 / Happy | FR-06; BR-04 | going/interested/maybe ผ่าน; trim ข้อความ; ไม่มีสมาชิกได้ [] | [test](backend/members.test.cjs) |
| TC-MEMBERS-02 | P1 / Negative | FR-06; BR-04 | สถานะผิด/ID ซ้ำ/ชื่อว่าง/101 รายการถูกปฏิเสธ | [test](backend/members.test.cjs) |
| TC-ROAD-MAP-01 | P1 / Negative | FR-02; BR-09 | schematic ถูกปฏิเสธก่อนวาด | [test](backend/road-map.test.cjs) |
| TC-ROAD-MAP-02 | P1 / Happy | FR-02; BR-09 | ไม่มี optional waypoints ยังได้ระยะเริ่ม0และปลาย>0 | [test](backend/road-map.test.cjs) |
| TC-ROAD-MAP-03 | P1 / Negative | FR-02; BR-09 | พิกัดว่าง/null/latitude999 ถูกปฏิเสธ | [test](backend/road-map.test.cjs) |
| TC-ROAD-MAP-04 | P1 / Equivalence | FR-02; BR-09 | ทิศ E=0 N=-90 W=±180 S=90 องศา | [test](backend/road-map.test.cjs) |
| TC-ROUTING-01 | P1 / Happy | FR-02; BR-09 | 12345m→12.3km;1200s→20min; lon/lat สลับถูก; เรียก provider ครั้งเดียว | [test](backend/routing.test.cjs) |
| TC-ROUTING-02 | P1 / Negative | FR-02; BR-09 | offline/HTTP error/NoRoute ได้ 502 ไม่สร้างถนนปลอม | [test](backend/routing.test.cjs) |
| TC-SELECTED-PLAN-01 | P1 / Happy | FR-01; BR-03 | 5 จุดที่เลือกปรากฏอย่างละ1ครั้ง; hotel เป็น end ทุกวัน | [test](backend/selected-plan.test.cjs) |
| TC-SELECTED-PLAN-02 | P1 / Equivalence | FR-01; BR-03 | 1 จุด4วัน: วันแรก3จุดรวม anchors; อีก3วันเป็น [] | [test](backend/selected-plan.test.cjs) |
| TC-SELECTED-PLAN-03 | P1 / Negative | FR-01; BR-03 | ไม่มีจุดเลือกและเกิน6ต่อวันถูกปฏิเสธ | [test](backend/selected-plan.test.cjs) |
| TC-SERVER-01 | P1 / Security/API | FR-01 FR-03 FR-04; BR-01 BR-02 BR-12 | API plan/save/route ผ่าน; validation ปฏิเสธ; รูปและรายละเอียดคงอยู่หลัง restart; backend file ไม่เปิดเผย | [test](backend/server.test.cjs) |
| TC-TRIP-MANAGEMENT-01 | P1 / State | FR-04; BR-12 | บันทึก/ตั้งชื่อ/แก้ไขคง ID และ metadata; ลบแล้วหาไม่พบ | [test](backend/trip-management.test.cjs) |
| TC-TRIP-SLIDES-01 | P1 / Happy | FR-05; BR-08 | 6จุด2วันได้4สไลด์; ครบทุกจุดและวันอิสระ | [test](backend/trip-slides.test.cjs) |
| TC-TRIP-SLIDES-02 | P1 / Security/API | FR-05; BR-08 | escape script/img/b และไม่ใส่ javascript: เป็นรูป | [test](backend/trip-slides.test.cjs) |

### UI cases ที่ยังไม่รัน (NOT_RUN)

| ID | Priority/technique | Trace | Steps และ expected |
|---|---|---|---|
| TC-UI-01 | P1 Happy/State | FR03/BR12/D03 | แนบ JPEGต่างกัน2จุด → save → reload → เปิดทริป → replay; รูปต้องตรงจุดทั้ง2 และไม่แสดงรูปอีกจุดก่อนถึง |
| TC-UI-02 | P1 Boundary | FR11/D05 | เปิดviewport375/1440 DPR1/2 → zoomแผนที่ → เลือกจุด; ชื่อจุดไม่ถูกcontrolบัง ไม่มีhorizontaloverflow; ตรวจภาพด้วยคน |
| TC-UI-03 | P1 Happy | FR01/FR02/BR03/09 | เลือก2จุดจริงเชียงใหม่ → จัดแผน → เลือกวัน → เปิดครบเส้นทาง; geometryตามproviderและpinsตรงPOI ไม่ใช่เส้นschematic |
| TC-UI-04 | P1 Negative | FR02/BR09 | จำลองroute503/offline → กดดูเส้นทาง; เห็นerror/retry และไม่มีfake successful road; recoveryแล้ว routeกลับมา |
| TC-UI-05 | P2 State | FR04/BR12 | ตั้งชื่อทริป → save → reload → เปลี่ยนชื่อ → save → reload → delete; IDเดิม/ชื่อใหม่/ท้ายสุดไม่มีรายการ |

## 6. Entry / Exit criteria

Entry(Node): Node22+, isolatedtemp writable, localhost ephemeral listenได้, fixtures deterministic, sourcehashบันทึก. Entry(browserตามต้นฉบับ): web/dbhealthyและseedพร้อม; **ยังไม่ครบ** เพราะใช้Node+JSONและไม่มีDockerDB.

Exit(Node subset): P1ทั้งหมดผ่านสองรอบ, failed/skipped=0, sourceตรงhash. Exit(full40caseplan): ทุกP1ผ่านและอย่างน้อยceil(0.95×40)=38/40 แยกChromium/Firefox/WebKit, รันซ้ำผลเดิม; NOT_RUNนับไม่ผ่าน. Node35/35ไม่ใช้แทนคะแนนbrowser. สถานะfullplan=NOT_MET.

## 7. ข้อมูลทดสอบ

ใช้ TEST-DATA; runผ่าน`npm run verify`; resetผ่าน`npm run start:test`เท่านั้น. ห้ามใช้backend/dataของผู้ใช้. รายการID/fixture pathในcases.json. วันที่เชิญอาจใช้2026-12-01เพื่อtestformat ส่วนเวลาsavedAtล็อก2026-11-07 ไม่ปะปนกัน.

## 8. คุณภาพแผน / failure predictions

| ถ้าพังแบบนี้ | Caseที่ควรล้ม | สถานะหลักฐาน |
|---|---|---|
| หารเงินทิ้งเศษ1สตางค์ | TC-EXPENSES-01 | mutation M1จับได้ |
| จำกัด5แทน6จุด | TC-ASSESSMENT-03 | M2จับได้ |
| acceptแล้วยังpending | TC-FEEDBACK-02 | M3จับได้ |
| routefailureกลายเป็นroadปลอม | TC-ROUTING-02 | normalnegative testผ่าน; ยังไม่mutate |
| resetเปิดในserverปกติ | TC-ASSESSMENT-06 | normaltestผ่าน |
| updateสร้างIDใหม่ | TC-TRIP-MANAGEMENT-01 | normaltestผ่าน |
| HTMLจากชื่อผู้ใช้ถูกexecuteในexport | TC-TRIP-SLIDES-02 | stringassertionsผ่าน; browserยังไม่รัน |
| savedtripรูปหายเมื่อrestart | TC-SERVER-01 | APIpersistenceผ่าน |

จุดกำกวม/coverage gaps: EXPLORATION F และ PLAN-REVIEW. Failureให้จำแนก app defect/test defect/unclear requirement/environment ด้วยTAPหรือUIหลักฐาน; ไม่สรุปว่าทุกfailureเป็นเว็บผิด.
