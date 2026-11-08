function buildTripInvite(trip){
 const info=trip.invitation||{};
 const lines=[`ไปเที่ยว${trip.destination}ด้วยกันไหม?`,`${trip.days} วัน · งบประมาณ ${Number(trip.budget).toLocaleString('th-TH')} บาท/คน`];
 if(info.date){const [y,m,d]=info.date.split('-');lines.push(`เริ่มเดินทาง ${d}/${m}/${y}`);}
 if(info.people)lines.push(`ชวนไปด้วยกัน ${info.people} คน`);
 if(info.meeting)lines.push(`นัดเจอ: ${info.meeting}`);
 if(info.message)lines.push('',info.message);
 trip.plans.forEach((stops,i)=>{lines.push('',`วันที่ ${i+1}`);if(!stops.some(s=>!s.anchor)){lines.push('วันอิสระ พักผ่อนตามสบาย');return;}stops.forEach(s=>{const label=s.anchor==='start'?'เริ่มที่':s.anchor==='end'?'จบที่':'แวะ';lines.push(`${s.details?.arrival?s.details.arrival+' ':''}${label} ${s.name}${s.priority==='optional'?' (ถ้ามีเวลา)':''}`);for(const [key,title] of [['eat','อยากกิน'],['buy','อยากซื้อ'],['explore','อยากไปดู'],['notes','โน้ต']])if(s.details?.[key])lines.push(`  ${title}: ${s.details[key]}`);});if(!stops.some(s=>/อาหาร|คาเฟ่/.test(s.type)))lines.push('พักกินข้าว 60 นาที — ค่อยเลือกร้านด้วยกัน');});
 lines.push('','แผนเบื้องต้น ปรับด้วยกันได้ · งบประมาณการ · ยังไม่ได้ตรวจเวลาเปิด–ปิด','ใครสนใจไปด้วยกันบ้าง?');return lines.join('\n');
}
if(typeof module!=='undefined')module.exports={buildTripInvite};
if(typeof document!=='undefined'){
 const mapPanel=document.getElementById('map-panel');
 const tripPanel=mapPanel.querySelector('.map-bottom');
 tripPanel.id='map-trip-panel';
 tripPanel.classList.add('map-trip-popover');
 tripPanel.hidden=true;
 tripPanel.setAttribute('role','region');
 tripPanel.setAttribute('aria-label','รายละเอียดทริปและชวนเพื่อน');
 const toggle=document.createElement('button');
 toggle.type='button';toggle.className='map-trip-toggle';toggle.id='map-trip-toggle';
 toggle.setAttribute('aria-controls',tripPanel.id);toggle.setAttribute('aria-expanded','false');
 toggle.setAttribute('aria-label','เปิดรายละเอียดทริปและชวนเพื่อน');toggle.title='รายละเอียดทริป / ชวนเพื่อน';
 toggle.innerHTML='<svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2a6 6 0 0 1 12 0v2M16 5a3 3 0 0 1 0 6M19 14v6M16 17h6"/></svg>';
 const closePanel=document.createElement('button');
 closePanel.type='button';closePanel.className='map-trip-close';closePanel.textContent='×';
 closePanel.setAttribute('aria-label','ปิดรายละเอียดทริป');tripPanel.prepend(closePanel);
 mapPanel.append(toggle);
 function setTripPanel(open,restoreFocus=false){
  tripPanel.hidden=!open;toggle.setAttribute('aria-expanded',String(open));
  toggle.setAttribute('aria-label',open?'ปิดรายละเอียดทริป':'เปิดรายละเอียดทริปและชวนเพื่อน');
  if(open)closePanel.focus();else if(restoreFocus)toggle.focus();
 }
 toggle.addEventListener('click',()=>setTripPanel(tripPanel.hidden));
 closePanel.addEventListener('click',()=>setTripPanel(false,true));
 document.addEventListener('pointerdown',event=>{
  if(!tripPanel.hidden&&!tripPanel.contains(event.target)&&!toggle.contains(event.target)&&!document.querySelector('dialog[open]'))setTripPanel(false);
 });
 document.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!tripPanel.hidden&&!document.querySelector('dialog[open]')){setTripPanel(false,true);event.preventDefault();}
 });
 const dialog=document.createElement('dialog');dialog.id='invite-dialog';dialog.innerHTML='<div class="invite-heading"><span class="eyebrow">BETTER TOGETHER</span><h2>ชวนเพื่อนออกไปเที่ยวกัน</h2><p>เติมรายละเอียด แล้วคัดลอกแผนไปส่งในกลุ่มเพื่อน</p></div><div class="detail-grid"><label>วันเริ่มเดินทาง<input id="invite-date" type="date"></label><label>จำนวนคนที่อยากชวน<input id="invite-people" type="number" min="1" max="100" placeholder="เช่น 4"></label></div><label>จุดนัดพบ / เวลานัด<input id="invite-meeting" maxlength="200" placeholder="เช่น เจอหน้าสถานี 08:00 น."></label><label>ข้อความชวน<textarea id="invite-message" maxlength="600" rows="2" placeholder="ทริปนี้เน้นกินกับถ่ายรูป ใครว่างไปด้วยกันไหม?"></textarea></label><label>ข้อความพร้อมส่ง<textarea id="invite-preview" readonly rows="12"></textarea></label><p class="invite-hint">ตรวจข้อความก่อนคัดลอก รวมโน้ตของจุดแวะด้วย · กดบันทึกทริปเพื่อเก็บรายละเอียดคำชวน</p><div class="dialog-actions"><button type="button" class="outline" id="invite-close">ปิด</button><button type="button" class="outline" id="invite-download">ดาวน์โหลดแผน .txt</button><button type="button" class="primary" id="invite-copy">คัดลอกคำชวน</button></div>';
 document.body.append(dialog);
 const ids={date:'invite-date',people:'invite-people',meeting:'invite-meeting',message:'invite-message'};
 function update(){if(!$('invite-people').reportValidity())return;const info={};for(const [key,id] of Object.entries(ids)){if($(id).value)info[key]=key==='people'?Number($(id).value):$(id).value.trim();}state.invitation=info;$('invite-preview').value=buildTripInvite(state);}
 for(const id of Object.values(ids))$(id).addEventListener('input',update);
 $('invite-open').onclick=async()=>{if(document.fullscreenElement)await document.exitFullscreen();for(const [key,id] of Object.entries(ids))$(id).value=state.invitation?.[key]??'';$('invite-preview').value=buildTripInvite(state);dialog.showModal();};
 $('invite-close').onclick=()=>dialog.close();
 $('invite-copy').onclick=async()=>{if(!$('invite-people').reportValidity())return;update();try{await navigator.clipboard.writeText($('invite-preview').value);toast('คัดลอกแล้ว นำไปวางในแชตกลุ่มได้เลย');}catch{$('invite-preview').focus();$('invite-preview').select();toast('เลือกข้อความให้แล้ว กด Ctrl+C เพื่อคัดลอก');}};
 $('invite-download').onclick=()=>{if(!$('invite-people').reportValidity())return;update();const url=URL.createObjectURL(new Blob(['\ufeff'+$('invite-preview').value],{type:'text/plain;charset=utf-8'}));const link=document.createElement('a');link.href=url;link.download='roam-trip-invitation.txt';link.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
}
