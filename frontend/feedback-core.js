function decideFeedback(trip,id,decision,role){
 if(role!=='leader')throw Error('ให้หัวตี้เป็นผู้ตัดสินใจ');
 const proposal=(trip.feedback||[]).find(p=>p.id===id);
 if(!proposal||proposal.status!=='pending')throw Error('ข้อเสนอนี้ถูกพิจารณาแล้วหรือไม่พบ');
 if(!['accepted','rejected'].includes(decision))throw Error('สถานะไม่ถูกต้อง');
 if(decision==='accepted'&&proposal.action!=='comment'){
  const next=structuredClone(trip.plans);const target=next[proposal.targetDay];if(!target)throw Error('ไม่พบวันปลายทางในแผนนี้');
  let stop;
  if(proposal.action==='move'){
   const source=next[proposal.sourceDay];const index=source?.findIndex(s=>s.stopId===proposal.stopId&&!s.anchor)??-1;
   if(index<0)throw Error('แผนเปลี่ยนแล้ว ไม่พบจุดเดิมในวันที่เสนอ ให้เพื่อนเสนอใหม่');
   if(proposal.sourceDay===proposal.targetDay)throw Error('ต้องเลือกวันปลายทางต่างจากวันเดิม');
   stop=source.splice(index,1)[0];
  }else if(proposal.action==='add')stop={...structuredClone(proposal.stop),stopId:'accepted-'+proposal.id};
  else throw Error('ประเภทข้อเสนอไม่ถูกต้อง');
  if(target.length>=8)throw Error('วันปลายทางเต็ม 8 จุดแล้ว กรุณาจัดแผนก่อน Accept');
  const end=target.findIndex(s=>s.anchor==='end');target.splice(end<0?target.length:end,0,stop);trip.plans=next;
 }
 proposal.status=decision;proposal.decidedAt=Date.now();
}
if(typeof module!=='undefined')module.exports={decideFeedback};
