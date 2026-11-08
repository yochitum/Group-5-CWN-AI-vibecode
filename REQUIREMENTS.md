# LAB 2 — Requirements baseline

Retrospective baseline v1. [D] มาจาก INTERVIEW เท่านั้น ขีดจำกัดตัวเลขด้านล่างเป็น [A] policy เดิมที่เสนอให้ยืนยัน; oracle เชิงเหตุผล [R] ต้องคงข้อมูล/เงิน/สถานะ ไม่ใช่การยืนยัน policy โดยผู้ใช้

## Functional requirements

| FR | US | ฟังก์ชัน |
|---|---|---|
| FR-01 | US-01 | จัดแผนเที่ยว |
| FR-02 | US-02 | ดูเส้นทางถนน |
| FR-03 | US-03 | แนบรูปของแต่ละจุด |
| FR-04 | US-04 | เก็บทริปไว้แก้ภายหลัง |
| FR-05 | US-05 | แบ่งปันแผน |
| FR-06 | US-06 | บันทึกผู้ร่วมทริป |
| FR-07 | US-07 | ตัดสินข้อเสนอ |
| FR-08 | US-08 | หารค่าใช้จ่าย |
| FR-09 | US-09 | หาจุดบนแผนที่ |
| FR-10 | US-10 | รันทดสอบซ้ำ |
| FR-11 | US-11 | อ่านแผนที่และข้อมูลได้ง่าย |

## Business rules และ boundary/partitions

กฎเชิงหมวดหมู่ใช้สาม partition แทนตัวเลข ไม่อ้างว่าทุกค่าด้านล่างถูก execute แล้ว ดู case matrix แยก coverage

| BR | FR | กฎ | ค่าขอบ/สามกลุ่ม | Expected |
|---|---|---|---|---|
| BR-01 | FR-01 | วันเป็น integer1..4 | 0/1/2 และ 3/4/5 | 0,5,เศษปฏิเสธ |
| BR-02 | FR-01 | งบ500..100000บาท finite | 499/500/501 และ 99999/100000/100001 | นอกช่วงปฏิเสธ |
| BR-03 | FR-01 | เลือกสูงสุด6จุดต่อวัน ไม่รวม anchors; วันว่างไม่เติมซ้ำ | 5/6/7 ต่อ1วัน; 0/1/2 จุดที่เลือก | 6ผ่าน7ไม่ผ่าน; ต้องเลือกอย่างน้อย1 |
| BR-04 | FR-06 | สมาชิกสูงสุด100; ID unique; 3สถานะ | 99/100/101 คน | 101ปฏิเสธ; unknown status ปฏิเสธ |
| BR-05 | FR-08 | ค่าใช้จ่าย integer1..100000000สตางค์; อ้างสมาชิกจริง | 0/1/2 และ 99999999/100000000/100000001 | 0,เกิน,เศษ,unknown ปฏิเสธ |
| BR-06 | FR-08 | หารเท่า ๆ กัน แจกเศษสตางค์ตามลำดับคน; sum balances=0 | 99/100/101 สตางค์ ÷3 =33,33,33 /34,33,33 /34,34,33 | ยอดเงินต้องไม่หาย |
| BR-07 | FR-07 | pending→accepted/rejected ครั้งเดียว; target≤8รวมanchors | 7/8/9 จุดหลังเพิ่ม; pending/accepted/rejected | เต็ม8ห้ามเพิ่ม; stale ไม่แก้บางส่วน |
| BR-08 | FR-05 | เชิญ1..100คน; export escape user HTML | 0/1/2 และ 99/100/101 คน; plain/HTML/script | 0และ101ปฏิเสธ; text ไม่ executable |
| BR-09 | FR-02 | ใช้ถนนจริง; lat±90 lng±180; upstream error502 | lat89/90/91; lng179/180/181; -91/-90/-89 | พิกัดนอกช่วงปฏิเสธ; ไม่มี fake road |
| BR-10 | FR-10 | reset ต้อง explicit flag และ separate data file | disabled/enabled-isolated/enabled-default | 404 / resetได้ / constructorปฏิเสธ |
| BR-11 | FR-09 | discovery validate bbox, cache และ throttle | missing/valid/reversed bbox; same/new/throttled query | invalidปฏิเสธ; error503ไม่ใช่ว่าง200 |
| BR-12 | FR-03 FR-04 | บันทึกรูป JPEGdataURL≤200000อักขระ; updateคงID | 199999/200000/200001 อักขระ | เกินปฏิเสธ; save/restart รูปยังอยู่ |

## Non-functional requirements

- NFR-01 [D02,D05]: readable responsive UI ที่ 375px/1440px และ DPR1/2; ยังไม่มี visual evidence จึง NOT VERIFIED
- NFR-02 [R]: rerun Node tests2รอบโดยไม่ใช้ข้อมูลจริง; ผ่าน35/35ทั้งสองรอบ ดู TEST-RUN-1
- NFR-03 [R]: ข้อมูลเงินใช้ integer satang และห้ามส่ง user HTML เป็น executable export; ทดสอบเฉพาะขอบเขต cases
- NFR-04 [R]: provider unavailable ต้องแสดง error ไม่อ้างถนน/สถานที่สมมติ; unit/API ผ่าน แต่ข้อความ UI ยังไม่ตรวจ
- NFR-05 [A]: localhost prototype ไม่มี authentication/authorization จริง; ห้ามอ้างว่าบทบาทใน UI ป้องกัน API ได้

ไม่มีข้อกำหนดสมาชิก Silver/Gold ของสปาใน domain ท่องเที่ยวนี้ จึงไม่ใส่ระดับสมาชิกปลอมเพื่อให้ดูตรง rubric
