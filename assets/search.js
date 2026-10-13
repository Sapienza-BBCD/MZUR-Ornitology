(() => {
 const cards=[...document.querySelectorAll('.specimen-card')];
 const order=document.querySelector('#order'),family=document.querySelector('#family'),genus=document.querySelector('#genus'),query=document.querySelector('#query');
 const counter=document.querySelector('#counter'),empty=document.querySelector('#empty');
 const values=(key,subset)=>[...new Set(subset.map(el=>el.dataset[key]).filter(Boolean))].sort((a,b)=>a.localeCompare(b));
 function options(el,vals){const selected=el.value;el.replaceChildren(new Option('All',''),...vals.map(v=>new Option(v,v)));el.value=vals.includes(selected)?selected:'';}
 function update(source){
  if(source==='order'){family.value='';genus.value='';}
  if(source==='family')genus.value='';
  options(order,values('order',cards));
  const byOrder=cards.filter(el=>!order.value||el.dataset.order===order.value);
  options(family,values('family',byOrder));
  const byFamily=byOrder.filter(el=>!family.value||el.dataset.family===family.value);
  options(genus,values('genus',byFamily));
  const q=query.value.trim().toLocaleLowerCase();let visible=0;
  for(const card of cards){const show=(!order.value||card.dataset.order===order.value)&&(!family.value||card.dataset.family===family.value)&&(!genus.value||card.dataset.genus===genus.value)&&(!q||card.dataset.search.includes(q));card.hidden=!show;if(show)visible++;}
  counter.textContent=`${visible} specimens found`;empty.hidden=visible!==0;
 }
 order.addEventListener('change',()=>update('order'));family.addEventListener('change',()=>update('family'));genus.addEventListener('change',()=>update('genus'));query.addEventListener('input',()=>update('query'));
 document.querySelector('#reset').addEventListener('click',()=>{order.value='';family.value='';genus.value='';query.value='';update('order')});update('order');
})();
