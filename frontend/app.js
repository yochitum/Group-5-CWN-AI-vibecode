const $ = id => document.getElementById(id);
const photos = ['https://images.unsplash.com/photo-1512553353614-82a7370096dc?w=400&q=80','https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=400&q=80','https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80','https://images.unsplash.com/photo-1537956965359-7573183d1f57?w=400&q=80'];
let presets = {};
let state = {destination:'เชียงใหม่',origin:'เชียงใหม่',days:3,budget:5000,interests:['↟ ธรรมชาติ','◉ อาหารท้องถิ่น'],plans:[]};
let roadMap;
let day=0,requestId=0,toastTimer;

function toast(message){$('toast').textContent=message;$('toast').style.display='block';clearTimeout(toastTimer);toastTimer=setTimeout(()=>$('toast').style.display='none',4200);}
async function savedTrips(){return api('/api/trips');}
async function updateCount(){try{$('saved-count').textContent=(await savedTrips()).length;}catch{}}
document.querySelectorAll('.chip').forEach(button=>button.addEventListener('click',()=>{button.classList.toggle('selected');button.setAttribute('aria-pressed',button.classList.contains('selected'));}));
function render(){
 $('result').hidden=false;
 $('trip-title').textContent=`${state.destination} — ค่อย ๆ ไป ให้ใจได้พัก`;
 $('trip-description').textContent=`แผนตัวอย่าง ${state.days} วัน · เริ่มเที่ยวใน${state.destination} · ${state.interests.join(' / ')||'เที่ยวตามใจ'}${state.origin!==state.destination?' · ยังไม่รวมเส้นทางจาก'+state.origin:''}`;
 $('day-summary').textContent=state.days;$('stop-summary').textContent=state.plans[day].filter(s=>!s.anchor).length;$('budget-summary').textContent=Number(state.budget).toLocaleString('th-TH');
 $('day-tabs').replaceChildren();for(let i=0;i<state.days;i++){const b=document.createElement('button');b.textContent=`วันที่ ${i+1}`;b.className=i===day?'active':'';b.setAttribute('aria-pressed',i===day);b.onclick=()=>{day=i;render();};$('day-tabs').append(b);}
 $('day-title').textContent=['วันแรก เริ่มต้นด้วยเรื่องดี ๆ','วันที่สอง ออกไปเจออะไรใหม่','วันที่สาม เก็บความทรงจำดี ๆ','วันที่สี่ ค่อย ๆ เที่ยวอีกนิด'][day];
 $('stops').replaceChildren();state.plans[day].forEach((stop,index)=>{
 const row=document.createElement('div');row.className='stop';
 const number=document.createElement('span');number.className='stop-number';number.textContent=index+1;
 const img=document.createElement('img');img.src=stop.photo||photos[stop.image];img.alt=(stop.photo?'รูปที่เพิ่ม: ':'ภาพประกอบ ')+stop.name;
 const content=document.createElement('div'),time=document.createElement('small'),name=document.createElement('h4'),type=document.createElement('p'),controls=document.createElement('div');time.textContent=`${String(9+index*2).padStart(2,'0')}:00 · เวลาตัวอย่าง`;name.textContent=stop.name;type.textContent=stop.type;controls.className='stop-controls';
 [['↑','เลื่อนขึ้น',()=>moveStop(index,-1),index===0],['↓','เลื่อนลง',()=>moveStop(index,1),index===state.plans[day].length-1],['×','ลบจุดแวะ',()=>{state.plans[day].splice(index,1);render();},state.plans[day].length<=0]].forEach(([label,title,action,disabled])=>{const b=document.createElement('button');b.textContent=label;b.title=title;b.setAttribute('aria-label',`${title} ${stop.name}`);b.onclick=action;b.disabled=disabled||!!stop.anchor;controls.append(b);});
 const upload=document.createElement('button');upload.textContent=stop.photo?'เปลี่ยนรูป':'＋ ใส่รูป';upload.onclick=()=>chooseStopPhoto(stop);controls.append(upload);
 if(stop.photo){const remove=document.createElement('button');remove.textContent='ลบรูป';remove.onclick=()=>{delete stop.photo;render();};controls.append(remove);}
 const detailButton=document.createElement('button');detailButton.textContent='✎ รายละเอียด';detailButton.onclick=()=>editStopDetails(stop);controls.append(detailButton);
 if(stop.details?.arrival)time.textContent=stop.details.arrival+' · เวลาที่วางไว้';
 if(stop.anchor)time.textContent=stop.anchor==='start'?'จุดเริ่มต้น':'ที่พัก / จุดจบ';
 if(!stop.anchor){const move=document.createElement('select');move.setAttribute('aria-label','ย้าย '+stop.name+' ไปวันอื่น');for(let d=0;d<state.days;d++){const o=document.createElement('option');o.value=d;o.textContent='วันที่ '+(d+1);move.append(o);}move.value=day;move.onchange=()=>moveAcrossDays(index,Number(move.value));controls.append(move);row.draggable=true;row.ondragstart=e=>e.dataTransfer.setData('text/plain',String(index));row.ondragover=e=>e.preventDefault();row.ondrop=e=>{e.preventDefault();const from=Number(e.dataTransfer.getData('text/plain'));if(Number.isInteger(from)&&state.plans[day][from]&&!state.plans[day][from].anchor){const item=state.plans[day].splice(from,1)[0];state.plans[day].splice(index,0,item);render();}};}
 content.append(time,name,type,controls,stopDetailSummary(stop));row.append(number,img,content);$('stops').append(row);
 });
 const notice=document.createElement('p');notice.className='day-planning-note';notice.textContent=(state.plans[day].length?'เวลาเปิด–ปิดยังไม่ตรวจสอบ · ':'วันอิสระ ยังไม่ได้เลือกสถานที่ · ')+(state.plans[day].some(s=>/อาหาร|คาเฟ่/.test(s.type))?'':'พักกินข้าว 60 นาที (ยังไม่เลือกร้าน)');$('stops').append(notice);
 if(state.warnings?.length){const warning=document.createElement('p');warning.className='day-planning-note';warning.textContent=state.warnings.join(' · ');$('stops').append(warning);}
 window.renderFeedback?.();window.refreshTripMembers?.();drawRoute();
}
function moveStop(index,offset){const list=state.plans[day];if(!list[index+offset]||list[index+offset].anchor)return;[list[index],list[index+offset]]=[list[index+offset],list[index]];render();}
function moveAcrossDays(index,target){
 if(target===day)return;const list=state.plans[target];if(list.length>=8){toast('วันปลายทางมีจุดแวะเต็มแล้ว');render();return;}
 const stop=state.plans[day].splice(index,1)[0];
 if(!list.length&&state.setup){list.push({...state.setup.start,anchor:'start'},{...state.setup.end,anchor:'end'});}
 const end=list.findIndex(s=>s.anchor==='end');list.splice(end<0?list.length:end,0,stop);render();toast('ย้ายจุดแวะแล้ว ตรวจลำดับเวลาอีกครั้ง');
}
function chooseStopPhoto(stop){
 if(window.isTripLeader&&!window.isTripLeader())return;
 const input=document.createElement('input');input.type='file';input.accept='image/jpeg,image/png,image/webp';
 input.onchange=async()=>{const file=input.files?.[0];if(!file)return;if(!['image/jpeg','image/png','image/webp'].includes(file.type)||file.size>10*1024*1024){toast('เลือกรูป JPG, PNG หรือ WebP ขนาดไม่เกิน 10 MB');return;}
  const url=URL.createObjectURL(file);
  try{const image=new Image();image.src=url;await image.decode();const ratio=Math.min(1,640/Math.max(image.naturalWidth,image.naturalHeight));const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(image.naturalWidth*ratio));canvas.height=Math.max(1,Math.round(image.naturalHeight*ratio));const context=canvas.getContext('2d');context.fillStyle='#fff';context.fillRect(0,0,canvas.width,canvas.height);context.drawImage(image,0,0,canvas.width,canvas.height);let photo=canvas.toDataURL('image/jpeg',.75);if(photo.length>200000)photo=canvas.toDataURL('image/jpeg',.45);if(photo.length>200000)throw Error('รูปยังมีขนาดใหญ่เกินไป ลองเลือกรูปอื่น');stop.photo=photo;render();toast('เพิ่มรูปแล้ว กดบันทึกทริปเพื่อเก็บรูปไว้');}catch(error){toast(error.message||'อ่านรูปไม่ได้ กรุณาเลือกรูปใหม่');}finally{URL.revokeObjectURL(url);}
 };input.click();
}
async function api(url,options={}){
 const response=await fetch(url,{...options,headers:{'Content-Type':'application/json'},signal:options.signal||AbortSignal.timeout(16000)});
 const data=await response.json();if(!response.ok)throw Error(data.error||'เชื่อมต่อ backend ไม่สำเร็จ');return data;
}
function fit(){roadMap?.fit();}
async function drawRoute(){
 window.showRouteLegs?.(null);$('stop-preview')?.remove();const current=++requestId;
 $('distance').textContent='—';$('route-status').textContent='กำลังคำนวณเส้นทางถนน…';$('map-error').hidden=true;
 try{
  if(!roadMap)roadMap=new RoadMap(showStop);await roadMap.clear(state.plans[day]);if(current!==requestId)return;
  if(state.plans[day].length<2){$('route-status').textContent='เพิ่มอย่างน้อย 2 จุดเพื่อคำนวณเส้นทาง';return;}
  const data=await api('/api/route',{method:'POST',body:JSON.stringify({stops:state.plans[day]})});if(current!==requestId)return;
  roadMap.setRoute(data);window.showRouteLegs?.(data);$('distance').textContent=data.distanceKm+' km';$('route-status').textContent='ขับรถประมาณ '+data.minutes+' นาที · ไม่รวมแวะ/จราจรสด';
  
 }catch(error){if(current!==requestId)return;$('route-status').textContent='เส้นทางไม่พร้อม';$('map-error').hidden=false;$('map-error').replaceChildren(document.createTextNode(error.message+' '));const retry=document.createElement('button');retry.textContent='ลองใหม่';retry.className='outline';retry.onclick=drawRoute;$('map-error').append(retry);}
}
function showStop(index){
 let card=$('stop-preview');if(!card){card=document.createElement('div');card.id='stop-preview';$('map-panel').append(card);}card.replaceChildren();
 const stop=state.plans[day][index],img=document.createElement('img'),name=document.createElement('strong'),small=document.createElement('small'),close=document.createElement('button');img.src=stop.photo||photos[stop.image];img.alt=stop.photo?'รูปที่เพิ่ม':'ภาพประกอบ';name.textContent=stop.name;small.textContent=`จุดแวะ ${index+1} · ${stop.photo?'รูปของคุณ':'ภาพประกอบตัวอย่าง'}`;close.textContent='×';close.setAttribute('aria-label','ปิดภาพสถานที่');close.onclick=()=>card.remove();const upload=document.createElement('button');upload.className='preview-upload';upload.textContent=stop.photo?'เปลี่ยนรูป':'＋ ใส่รูปจุดแวะ';upload.onclick=()=>chooseStopPhoto(stop);card.append(img,name,small,close,upload);
 const details=stopDetailSummary(stop);card.append(details);const edit=document.createElement('button');edit.className='preview-upload';edit.textContent='✎ แก้รายละเอียด';edit.onclick=()=>editStopDetails(stop);card.append(edit);
}
async function generate(event){event?.preventDefault();window.startProvinceFlow?.($('destination').value.trim());}

$('trip-form').addEventListener('submit',generate);$('fit').onclick=fit;
$('fullscreen').onclick=async()=>{try{if(document.fullscreenElement)await document.exitFullscreen();else await $('map-panel').requestFullscreen();}catch{toast('เบราว์เซอร์นี้ไม่รองรับการแสดงเต็มจอ');}};document.addEventListener('fullscreenchange',()=>setTimeout(()=>{fit();},200));
$('add-stop').onclick=()=>{const select=$('extra-stop');select.replaceChildren();presets[state.destination].forEach((s,i)=>{const option=document.createElement('option');option.value=i;option.textContent=s.name;select.append(option);});$('add-dialog').showModal();};$('cancel-add').onclick=()=>$('add-dialog').close();$('add-form').onsubmit=e=>{e.preventDefault();if(state.plans[day].length>=8){toast('ตัวอย่างรองรับสูงสุด 8 จุดต่อวัน');return;}state.plans[day].push({...presets[state.destination][Number($('extra-stop').value)]});$('add-dialog').close();render();};
$('save').onclick=async()=>{const button=$('save');button.disabled=true;try{await api('/api/trips',{method:'POST',body:JSON.stringify(state)});await updateCount();toast('บันทึกทริปลง backend แล้ว');}catch(error){toast(error.message);}finally{button.disabled=false;}};
$('saved').onclick=async()=>{let trips;try{trips=await savedTrips();}catch(error){toast(error.message);return;}$('saved-list').replaceChildren();if(!trips.length)$('saved-list').textContent='ยังไม่มีทริปที่บันทึกไว้';trips.forEach(trip=>{const b=document.createElement('button');b.textContent=`${trip.destination} · ${trip.days} วัน · ฿${Number(trip.budget).toLocaleString()} / คน`;b.onclick=()=>{state=structuredClone(trip);day=0;$('destination').value=state.destination;$('days').value=state.days;$('budget').value=state.budget;$('origin').value=state.origin;document.querySelectorAll('.chip').forEach(c=>{const selected=state.interests.includes(c.textContent);c.classList.toggle('selected',selected);c.setAttribute('aria-pressed',selected);});$('saved-dialog').close();render();$('result').scrollIntoView({behavior:'smooth'});};$('saved-list').append(b);});$('saved-dialog').showModal();};$('close-saved').onclick=()=>$('saved-dialog').close();
document.querySelectorAll('.destination').forEach(b=>b.onclick=()=>{$('destination').value=b.dataset.place;$('origin').value=b.dataset.place;generate();});
async function init(){try{presets=await api('/api/catalog');updateCount();}catch(error){$('map-error').hidden=false;$('map-error').textContent=error.message;toast(error.message);}}
init();
