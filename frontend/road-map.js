/* Geographic map and road playback; all positions are latitude/longitude. */
window.RoadMap=class {
 static heading(a,b){const rad=Math.PI/180;const y=lat=>Math.log(Math.tan(Math.PI/4+lat*rad/2));return Math.atan2(-(y(b[0])-y(a[0])),(b[1]-a[1])*rad)*180/Math.PI;}
 constructor(onStop){
  if(!window.L)throw Error('โหลดเครื่องมือแผนที่ไม่ได้ กรุณาตรวจอินเทอร์เน็ตแล้วรีเฟรช');
  this.onStop=onStop;this.map=L.map('map',{zoomControl:false,scrollWheelZoom:false}).setView([18.79,98.97],12);
  L.control.zoom({position:'topright'}).addTo(this.map);
  const notice=document.createElement('div');notice.className='tile-notice';notice.hidden=true;notice.textContent='พื้นแผนที่โหลดไม่ได้ ตรวจการเชื่อมต่อหรือส่วนขยายที่บล็อก Referer';document.getElementById('map-panel').append(notice);
  const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,referrerPolicy:'strict-origin-when-cross-origin',attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(this.map);
  tiles.on('tileerror',()=>{notice.hidden=false;});
  this.lines=L.layerGroup().addTo(this.map);this.markers=L.layerGroup().addTo(this.map);
  new ResizeObserver(()=>this.map.invalidateSize()).observe(document.getElementById('map'));
 }
 clear(stops){this.reset();this.points=[];this.lines.clearLayers();this.markers.clearLayers();this.stops=stops;
  stops.forEach((s,i)=>{const icon=document.createElement('div');if(s.photo){const img=document.createElement('img');img.src=s.photo;img.alt='';icon.append(img);}const number=document.createElement('span');number.textContent=i+1;icon.append(number);L.marker([s.lat,s.lng],{title:s.name,icon:L.divIcon({className:s.photo?'photo-marker':'route-marker',html:icon,iconSize:s.photo?[54,54]:[30,30],iconAnchor:s.photo?[27,27]:[15,15]})}).addTo(this.markers).on('click',()=>this.onStop(i));});
  this.fit();
 }
 setRoute(data){
  if(data?.mode!=='road')throw Error('เซิร์ฟเวอร์ยังเป็นเวอร์ชันเก่า กรุณาหยุดด้วย Ctrl+C แล้วรัน node backend/server.cjs ใหม่');
  const validPoint=p=>Array.isArray(p)&&p.length>=2&&Number.isFinite(p[0])&&Number.isFinite(p[1])&&Math.abs(p[0])<=90&&Math.abs(p[1])<=180;
  if(!Array.isArray(data.points)||data.points.length<2||!data.points.every(validPoint))throw Error('ข้อมูลพิกัดเส้นทางไม่สมบูรณ์ กรุณาลองใหม่');
  this.points=data.points;this.waypoints=Array.isArray(data.waypoints)?data.waypoints:[];this.cumulative=[0];for(let i=1;i<this.points.length;i++)this.cumulative.push(this.cumulative[i-1]+this.map.distance(this.points[i-1],this.points[i]));
  L.polyline(this.points,{color:'#fff',weight:9}).addTo(this.lines);L.polyline(this.points,{color:'#fa541c',weight:5}).addTo(this.lines);
  this.stopDistances=[];let from=0;
  this.stops.forEach((s,i)=>{const candidate=this.waypoints[i]?.point;const target=validPoint(candidate)?candidate:[s.lat,s.lng];let best=from,min=Infinity;for(let j=from;j<this.points.length;j++){const d=this.map.distance(target,this.points[j]);if(d<min){min=d;best=j;}}this.stopDistances.push(this.cumulative[best]);from=best;});
  this.fit();
 }
 fit(){this.map.invalidateSize();const points=this.points?.length?this.points:this.stops?.map(s=>[s.lat,s.lng]);if(points?.length)this.map.fitBounds(points,{paddingTopLeft:[40,70],paddingBottomRight:[40,170],maxZoom:15});}
 reset(){if(this.car){this.car.remove();this.car=null;}this.last=-1;this.angle=undefined;}
};
