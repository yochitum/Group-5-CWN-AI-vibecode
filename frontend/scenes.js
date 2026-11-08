/* Native-scroll, pinned destination showcase inspired by the supplied recording. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const mobile = matchMedia('(max-width: 750px), (max-height: 650px)');
  const destinations = [
    {tag:'01 / THE MOUNTAINS',name:'เชียงใหม่',title:'ให้ภูเขา เป็นคนปลุกคุณ',description:'ค่อย ๆ จิบกาแฟ เดินเล่นในเมืองเก่า แล้วออกไปสูดอากาศบนดอย',image:'1512553353614-82a7370096dc',stops:['ประตูท่าแพ','นิมมานเหมินท์','ดอยสุเทพ'],label:'ภูเขาและธรรมชาติ',icon:'↟'},
    {tag:'02 / THE OCEAN',name:'ภูเก็ต',title:'วันนี้ มีนัดกับทะเล',description:'แวะเมืองเก่า ขับรถเลียบหาด แล้วเก็บแสงสุดท้ายไว้เป็นความทรงจำ',image:'1537956965359-7573183d1f57',stops:['เมืองเก่าภูเก็ต','หาดกะตะ','แหลมพรหมเทพ'],label:'ทะเลและแสงแดด',icon:'≈'},
    {tag:'03 / THE CITY',name:'กรุงเทพมหานคร',title:'หลงทาง ในเมืองที่คุ้นเคย',description:'เรื่องราวในตรอกเล็ก ๆ ร้านอร่อยระหว่างทาง และมุมใหม่ของเมืองเดิม',image:'1508009603885-50cf7c579365',stops:['วัดโพธิ์','เยาวราช','ตลาดน้อย'],label:'เมืองและเรื่องราว',icon:'◇'}
  ];
  const section=document.createElement('section');section.className='scene-scroll';section.setAttribute('aria-label','ค้นพบสามสไตล์การเดินทาง');
  section.innerHTML='<div class="scene-sticky"><div class="scene-intro"><span class="eyebrow">A DIFFERENT PLACE. A DIFFERENT YOU.</span><h2>ไปในที่ที่ใช่ <span>ในแบบของคุณ</span></h2></div><div class="scene-layout"><nav class="scene-nav" aria-label="สไตล์จุดหมาย"></nav><div class="scene-canvas"></div></div><div class="scene-hint"><span>เลื่อนเพื่อค้นพบจุดหมาย</span><div class="scene-track"><i></i></div><span class="scene-number">01 / 03</span></div></div>';
  document.querySelector('#planner').before(section);
  const canvas=section.querySelector('.scene-canvas'),nav=section.querySelector('.scene-nav');
  const panels=[],buttons=[];
  destinations.forEach((destination,i)=>{
    const button=document.createElement('button');button.type='button';button.innerHTML=`<span>0${i+1}</span> ${destination.label}<b>↗</b>`;
    button.onclick=()=>{
      if(reduced.matches||mobile.matches){activate(i);schedule();return;}
      const top=scrollY+section.getBoundingClientRect().top;
      window.scrollTo({top:top+(section.offsetHeight-innerHeight)*(i/3+.08),behavior:'smooth'});
    };nav.append(button);buttons.push(button);
    const panel=document.createElement('article');panel.className='scene-card';
    panel.innerHTML=`<div class="scene-card-head"><span class="scene-avatar">${destination.icon}</span><div><span class="eyebrow">${destination.tag}</span><h3>${destination.name}</h3></div><span class="scene-pill">ทริปตัวอย่าง</span></div><div class="scene-picture"><img src="https://images.unsplash.com/photo-${destination.image}?w=1100&q=85" alt="ภาพประกอบบรรยากาศ${destination.name}" loading="lazy"><div><small>TAKE THE SCENIC ROUTE</small><h4>${destination.title}</h4></div></div><div class="scene-details"><p>${destination.description}</p><div class="scene-stop-list">${destination.stops.map((stop,j)=>`<span><b>${j+1}</b>${stop}</span>`).join('<i>—</i>')}</div><a href="#planner" class="scene-choose">ออกแบบทริปนี้ <span>↗</span></a></div>`;
    panel.querySelector('.scene-choose').onclick=()=>{document.getElementById('destination').value=destination.name;document.getElementById('origin').value=destination.name;window.startProvinceFlow?.(destination.name);};
    canvas.append(panel);panels.push(panel);
  });
  let active=-1,frame=0;
  function activate(index){if(index===active)return;active=index;section.style.setProperty("--scene-landscape", `url("assets/landscapes/${["mountains","sea","city"][index]}.jpg")`);panels.forEach((panel,i)=>{panel.classList.toggle('is-current',i===index);panel.inert=i!==index;panel.setAttribute('aria-hidden',String(i!==index));});buttons.forEach((button,i)=>{button.classList.toggle('is-current',i===index);button.setAttribute('aria-pressed',String(i===index));});section.querySelector('.scene-number').textContent=`0${index+1} / 03`;}
  function paint(){frame=0;if(reduced.matches||mobile.matches){section.style.setProperty('--scene-progress',(active+1)/3);return;}const p=Math.max(0,Math.min(1,-section.getBoundingClientRect().top/(section.offsetHeight-innerHeight)));activate(Math.min(2,Math.floor(p*3)));section.style.setProperty('--scene-progress',p);}
  function schedule(){if(!frame)frame=requestAnimationFrame(paint);}
  window.addEventListener('scroll',schedule,{passive:true});window.addEventListener('resize',schedule,{passive:true});reduced.addEventListener('change',schedule);mobile.addEventListener('change',schedule);
  activate(0);schedule();
  const closing=document.createElement('section');closing.className='journey-closing';
  closing.innerHTML='<span class="eyebrow">THE BEST PART IS STILL AHEAD.</span><h2>เรื่องราวครั้งต่อไป<br>เริ่มที่<span>การออกเดินทาง.</span></h2><p>ให้แผนที่เป็นแค่จุดเริ่มต้น ที่เหลือคือชีวิตระหว่างทาง</p><a href="#planner">เริ่มวางแผนทริปของคุณ ↗</a><span class="closing-coordinate">THAILAND / YOUR NEXT CHAPTER</span>';
  document.querySelector('#discover').after(closing);
})();
