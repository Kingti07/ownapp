/* ================= Startseite + Start der App ================= */
(()=>{
function view(){
  const h=new Date().getHours(),greet=h<11?"Guete Morge":h<17?"Hoi":"Guete Abig";
  const name=(App.myName||"").split(" ")[0];
  const cards=["budget","film","training","ziele"].map(id=>{const m=App.mods[id],s=m.summary();return `<button class="modcard" data-c="${id}" data-go="${id}">${ico(m.icon)}<div style="min-width:0"><b>${m.title==="Film"?"Filmabend":m.title}</b><span>${esc(s.text)}</span></div><span class="big">${esc(s.big)}</span></button>`}).join("");
  return `<div class="hello"><span class="date">${new Date().toLocaleDateString("de-CH",{weekday:"long",day:"numeric",month:"long"})}</span><h1>${greet}${name?" "+esc(name):""}</h1></div>
  <div class="list" style="gap:10px">${cards}</div>
  ${App.cloud?"":`<div class="alert">Du bist nicht über Claude angemeldet. Die App speichert gerade nur in diesem Browser, und Filmsuche, Coach und Teilen gehen nicht. Öffne die App über deinen Claude-Link.</div>`}`;
}
function bind(){$$("#root [data-go]").forEach(b=>b.onclick=()=>go(b.dataset.go))}
register({id:"home",title:"Start",icon:"home",view,bind});

async function boot(){
  const h=location.hash.slice(1);App.cur=App.mods[h]?h:"home";
  render();
  const c=await getClaude();
  if(c){try{[App.db,App.user,App.sample]=await Promise.all([c.use("db"),c.use("user"),c.use("sample")])}catch(e){}}
  if(App.user){App.me=await App.user.id().catch(()=>null);try{const me=await App.user.me();App.myName=me.name||""}catch(e){}}
  App.cloud=!!(App.db&&App.me);
  Object.values(App.mods).forEach(m=>{if(m.doc)m.doc.start();if(m.col)m.col.start()});
  render();
}
$$(".nav button").forEach(b=>b.onclick=()=>go(b.dataset.go));
$("#fab").onclick=()=>{const m=App.mods[App.cur];if(m.onFab)m.onFab()};
// Startseite zuerst in der Navigation
App.order=["home",...App.order.filter(x=>x!=="home")];
boot();
})();
