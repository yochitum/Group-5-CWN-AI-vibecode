/* One browser-restricted key is shared by Maps JavaScript and Places (New). */
window.TripGoogle={
 load(){
  if(this.pending)return this.pending;
  this.pending=(async()=>{
   const response=await fetch('/api/maps-config');
   if(!response.ok)throw Error('โหลดการตั้งค่า Google Maps ไม่ได้ กรุณารีสตาร์ตเซิร์ฟเวอร์');
   const config=await response.json();this.mapId=config.mapId;
   if(!config.apiKey)throw Error('ยังไม่ได้ตั้งค่า GOOGLE_MAPS_BROWSER_KEY ดูวิธีตั้งค่าใน GOOGLE-MAPS.md');
   await new Promise((resolve,reject)=>{
    const script=document.createElement('script');
    const timer=setTimeout(()=>reject(Error('Google Maps ใช้เวลาโหลดนาน กรุณารีเฟรชเพื่อลองใหม่')),20000);
    window.tripGoogleReady=()=>{clearTimeout(timer);resolve();};
    window.gm_authFailure=()=>{clearTimeout(timer);reject(Error('Google Maps ไม่อนุญาตให้ใช้คีย์นี้ ตรวจ API, Billing และเว็บไซต์ที่อนุญาต'));document.dispatchEvent(new Event('trip-google-auth-error'));};
    const query=new URLSearchParams({key:config.apiKey,callback:'tripGoogleReady',loading:'async',v:'weekly',language:'th',region:'TH',libraries:'maps,marker,places'});
    script.src='https://maps.googleapis.com/maps/api/js?'+query;
    script.onerror=()=>{clearTimeout(timer);reject(Error('เชื่อมต่อ Google Maps ไม่ได้'));};document.head.append(script);
   });
   return google.maps;
  })();return this.pending;
 },
 async create(id){await this.load();return new google.maps.Map(document.getElementById(id),{center:{lat:18.79,lng:98.98},zoom:12,mapId:this.mapId,mapTypeControl:false,streetViewControl:false,fullscreenControl:false,gestureHandling:'cooperative',clickableIcons:false});},
 fit(map,stops){if(!stops.length)return;const bounds=new google.maps.LatLngBounds();stops.forEach(s=>bounds.extend({lat:s.lat,lng:s.lng}));map.fitBounds(bounds,50);},
 marker(map,stop,label,onClick){
  const content=document.createElement('span');content.className='google-trip-pin';content.textContent=label;
  const marker=new google.maps.marker.AdvancedMarkerElement({map,position:{lat:stop.lat,lng:stop.lng},title:stop.name,content});
  if(onClick)marker.addListener('click',onClick);return marker;
 }
};
window.RoadMap=class GoogleRoadMap{
 constructor(onStop){this.onStop=onStop;this.markers=[];this.lines=[];this.ready=TripGoogle.create('map').then(map=>this.map=map);}
 async clear(stops){this.stops=stops;this.points=[];await this.ready;this.markers.forEach(m=>m.map=null);this.lines.forEach(l=>l.setMap(null));this.lines=[];this.markers=stops.map((s,i)=>TripGoogle.marker(this.map,s,String(i+1),()=>this.onStop(i)));this.fit();}
 setRoute(data){if(data.mode!=='road'||!Array.isArray(data.points)||data.points.length<2||data.points.some(p=>!Array.isArray(p)||!Number.isFinite(p[0])||!Number.isFinite(p[1])))throw Error('ข้อมูลพิกัดเส้นทางไม่สมบูรณ์');this.points=data.points;this.lines.forEach(l=>l.setMap(null));this.lines=[['#ffffff',9],['#fa541c',5]].map(([strokeColor,strokeWeight])=>new google.maps.Polyline({map:this.map,path:data.points.map(([lat,lng])=>({lat,lng})),strokeColor,strokeWeight,strokeOpacity:1}));this.fit();}
 fit(){if(this.map)TripGoogle.fit(this.map,this.points?.length?this.points.map(([lat,lng])=>({lat,lng})):this.stops||[]);}
 reset(){}
};
