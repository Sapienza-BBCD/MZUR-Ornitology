
(async function(){
 const status=document.getElementById('map-count');
 if(typeof L==='undefined'){status.textContent='Map library unavailable. Check your internet connection.';return;}
 let data;
 try{const response=await fetch('data/map_points.json');if(!response.ok)throw Error('HTTP '+response.status);data=await response.json();}
 catch(e){status.textContent='Cannot load map data. Open the site through GitHub Pages or a local web server (not file://).';return;}
 const map=L.map('collection-map',{scrollWheelZoom:true}).setView([42.5,12.5],5);
 L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:18,attribution:'© OpenStreetMap contributors'}).addTo(map);
 const cluster=L.markerClusterGroup({showCoverageOnHover:false,maxClusterRadius:45});map.addLayer(cluster);
 let uncertaintyCircle=null;
 function clearUncertainty(){if(uncertaintyCircle){map.removeLayer(uncertaintyCircle);uncertaintyCircle=null;}}
 function uncertaintyRadius(value){const n=Number(String(value??'').trim().replace(',','.'));return Number.isFinite(n)&&n>0?n:null;}
 const q=document.getElementById('map-query'),o=document.getElementById('map-order'),f=document.getElementById('map-family'),g=document.getElementById('map-genus');
 const clean=s=>String(s||'');
 const escape=s=>clean(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 function options(select,vals,label,keep){select.replaceChildren(new Option(label,''));[...new Set(vals.filter(Boolean))].sort((a,b)=>a.localeCompare(b)).forEach(x=>select.add(new Option(x,x)));select.value=keep&&[...select.options].some(x=>x.value===keep)?keep:'';}
 function menus(){const order=o.value,family=f.value,genus=g.value;options(o,data.map(x=>x.order),'All orders',order);const filtered=data.filter(x=>!o.value||x.order===o.value);options(f,filtered.map(x=>x.family),'All families',family);const ff=filtered.filter(x=>!f.value||x.family===f.value);options(g,ff.map(x=>x.genus),'All genera',genus);}
 function update(){menus();const term=q.value.trim().toLocaleLowerCase();const filtered=data.filter(x=>(!o.value||x.order===o.value)&&(!f.value||x.family===f.value)&&(!g.value||x.genus===g.value)&&(!term||[x.name,x.locality,x.country,x.id].some(v=>clean(v).toLocaleLowerCase().includes(term))));clearUncertainty();cluster.clearLayers();const points=[];
 for(const x of filtered){const marker=L.marker([x.lat,x.lon]);marker.bindPopup('<strong><em>'+escape(x.name)+'</em></strong><br>'+escape(x.locality||x.country||'Locality not specified')+'<br>Occurrence: '+escape(x.id)+(x.uncertainty?'<br>Coordinate uncertainty (m): '+escape(x.uncertainty):'')+'<br><a href="'+encodeURIComponent(x.id)+'.html">View specimen →</a>');marker.on('click',()=>{clearUncertainty();const radius=uncertaintyRadius(x.uncertainty);if(radius!==null){uncertaintyCircle=L.circle([x.lat,x.lon],{radius:radius,color:'#2878b5',weight:2,fillColor:'#2878b5',fillOpacity:0.12,interactive:false}).addTo(map);}});points.push(marker);}cluster.addLayers(points);
 status.textContent=filtered.length+' mapped specimen'+(filtered.length===1?'':'s')+' · '+data.length+' total georeferenced records';
 }
 map.on('popupclose',clearUncertainty);
 o.addEventListener('change',()=>{f.value='';g.value='';update()});f.addEventListener('change',()=>{g.value='';update()});g.addEventListener('change',update);q.addEventListener('input',update);
 document.getElementById('map-reset').addEventListener('click',()=>{q.value='';o.value='';f.value='';g.value='';update()});
 update();if(data.length){const bounds=L.latLngBounds(data.map(x=>[x.lat,x.lon]));map.fitBounds(bounds.pad(.1),{maxZoom:8});}else status.textContent='No specimens have valid geographic coordinates.';
})();
