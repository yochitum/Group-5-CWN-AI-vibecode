function validateExpenses(input,members){
 const bad=()=>{const error=Error('รายการค่าใช้จ่ายไม่ถูกต้อง ตรวจผู้จ่าย จำนวนเงิน และผู้ร่วมจ่าย');error.status=400;throw error;};
 if(input===undefined)return [];if(!Array.isArray(input)||input.length>200)bad();const people=new Set(members.map(m=>m.id)),ids=new Set();
 return input.map(x=>{if(!x||typeof x.id!=='string'||!x.id||x.id.length>100||ids.has(x.id)||typeof x.title!=='string'||!x.title.trim()||x.title.length>120||!Number.isSafeInteger(x.amountSatang)||x.amountSatang<1||x.amountSatang>100000000||!people.has(x.payer)||!Array.isArray(x.participants)||!x.participants.length||x.participants.length>100||new Set(x.participants).size!==x.participants.length||x.participants.some(id=>!people.has(id))||typeof x.date!=='string'||!/^\d{4}-\d{2}-\d{2}$/.test(x.date)||!Number.isFinite(Date.parse(x.date)))bad();ids.add(x.id);return {id:x.id,title:x.title.trim(),date:x.date,amountSatang:x.amountSatang,payer:x.payer,participants:x.participants};});
}
module.exports={validateExpenses};
