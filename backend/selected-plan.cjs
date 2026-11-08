const distance=(a,b)=>Math.hypot((a.lat-b.lat)*111,(a.lng-b.lng)*105);
function arrangeSelected(input,validateStops,invalid){
 const selected=validateStops(input.selected,1,24);
 if(selected.length>input.days*6)invalid('เลือกได้ไม่เกิน 6 จุดต่อวัน ลองเพิ่มวันหรือลดจุดแวะ');
 const start=validateStops([input.start],1,1)[0],end=validateStops([input.end],1,1)[0];
 const returnDaily=input.returnDaily===true;
 let current=start;const pool=[...selected],ordered=[];
 // Greedy geographic grouping: approximate, not a traffic-aware optimizer.
 while(pool.length){pool.sort((a,b)=>distance(current,a)-distance(current,b));current=pool.shift();ordered.push(current);}
 const plans=[],warnings=[];let cursor=0,previous=start;
 for(let d=0;d<input.days;d++){
  const count=Math.ceil((ordered.length-cursor)/(input.days-d));const visits=ordered.slice(cursor,cursor+count);cursor+=count;
  if(!visits.length){plans.push([]);continue;}
  const first=returnDaily?(d===0?start:end):previous;const last=returnDaily||cursor===ordered.length?end:null;
  const plan=[{...first,anchor:'start'},...visits,...(last?[{...last,anchor:'end'}]:[])];
  let minutes=60;for(let i=1;i<plan.length;i++)minutes+=distance(plan[i-1],plan[i])*1.3/35*60;
  minutes+=visits.reduce((sum,s)=>sum+(s.details?.duration||60),0);
  if(minutes>480)warnings.push(`วันที่ ${d+1} อาจแน่นเกินไป (ประมาณ ${Math.round(minutes/60)} ชั่วโมงรวมพัก) ลองย้ายจุดไปวันอื่น`);
  plans.push(plan);previous=visits.at(-1);
 }
 return {plans,setup:{start,end,returnDaily,restaurantSkipped:input.restaurantSkipped===true},warnings};
}
module.exports={arrangeSelected};
