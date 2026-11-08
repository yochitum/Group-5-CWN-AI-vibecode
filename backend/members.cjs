function validateMembers(value){
 if(value===undefined)return [];
 function bad(){const error=Error('ข้อมูลสมาชิกไม่ถูกต้อง รองรับสูงสุด 100 คน');error.status=400;throw error;}
 if(!Array.isArray(value)||value.length>100)bad();const ids=new Set();
 return value.map(member=>{if(!member||typeof member.id!=='string'||!member.id||member.id.length>100||ids.has(member.id)||typeof member.name!=='string'||!member.name.trim()||member.name.length>60||!['going','interested','maybe'].includes(member.status)||member.note!==undefined&&(typeof member.note!=='string'||member.note.length>200))bad();ids.add(member.id);return {id:member.id,name:member.name.trim(),status:member.status,note:(member.note||'').trim()};});
}
module.exports={validateMembers};
