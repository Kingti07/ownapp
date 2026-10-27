/* ================= Modul: Filmabend (geteilt) ================= */
(()=>{
const movies=new SharedCol("movies");
let tab="find",listFilter="watch",results=[],searching=false,searchNote="",calMonth=new Date(),selDay=null;calMonth.setDate(1);
const M=()=>movies.items;
const keyOf=m=>(m.title+"|"+(m.year||"")).toLowerCase();
function hue(s){let h=0;for(const c of s)h=(h*31+c.charCodeAt(0))%360;return h}
function poster(t){const h=hue(t),h2=(h+50)%360;return `<div class="poster" style="background:linear-gradient(160deg,hsl(${h} 62% 52%),hsl(${h2} 55% 26%))">${esc(t)}</div>`}
const jw=t=>"https://www.justwatch.com/ch/Suche?q="+encodeURIComponent(t);

const PROV_SPEC=`Liste, wo man den Film in der Schweiz schauen kann: [{"name": einer von "Netflix","Disney+","Prime Video","Apple TV+","Sky Show","Play Suisse","SRF Play","Blue TV","Canal+","Paramount+","Apple iTunes","Google Play", "type": "flat" (im Abo enthalten) oder "rent" (leihen/kaufen), "sure": true wenn du dir ziemlich sicher bist, sonst false}]. Gib IMMER deine beste Einschätzung an – mindestens die Plattform, auf der der Film am wahrscheinlichsten im Abo ist, und eine Leih-Option (Apple iTunes oder Google Play gibt es fast immer). Markiere Vermutungen mit "sure": false statt sie wegzulassen.`;
const PROMPT=(q,mode)=>`Du bist eine Film-Datenbank für ein Paar in der Schweiz. ${mode==="mood"?`Schlage 6 passende Filme vor für diese Stimmung: "${q}". Mische bekannte und weniger bekannte Filme.`:`Finde bis zu 6 Filme, die zur Suche "${q}" passen (Titel, Schauspieler, Regisseur oder Thema). Bester Treffer zuerst.`}
Antworte NUR mit einem JSON-Array. Jedes Element:
{"title": deutscher Verleihtitel falls üblich sonst Originaltitel, "original": Originaltitel, "year": Zahl, "genre": kurz auf Deutsch, "runtime": Minuten als Zahl, "desc": ein Satz auf Deutsch ohne Spoiler, "providers": ${PROV_SPEC}}`;
const PROV_PROMPT=m=>`Wo kann man den Film "${m.title}"${m.year?" ("+m.year+")":""} in der Schweiz streamen? Antworte NUR mit JSON: ${PROV_SPEC}`;

async function runSearch(q,mode){
  if(!q.trim())return;
  if(!App.sample){searchNote="Die Suche braucht Claude. Öffne die App über deinen Claude-Link.";results=[];render();return}
  searching=true;searchNote="";render();
  try{const r=await App.sample.json(PROMPT(q.trim(),mode),{modelTier:"default"});results=Array.isArray(r)?r.filter(x=>x&&x.title).slice(0,8):[];if(!results.length)searchNote="Nichts gefunden. Versuch einen anderen Titel."}
  catch(e){results=[];searchNote=e&&e.code==="not_granted"?"Die Suche braucht deine Erlaubnis, Claude zu fragen.":e&&e.code==="rate_limited"?"Zu viele Anfragen – kurz warten.":"Suche fehlgeschlagen. Nochmals versuchen."}
  searching=false;render();
}
async function refreshProv(id){
  const m=M().find(x=>x.id===id);if(!m)return;
  if(!App.sample){toast("Geht nur über deinen Claude-Link");return}
  toast("Claude prüft Streaming …");
  try{const r=await App.sample.json(PROV_PROMPT(m),{modelTier:"default",cache:false});const p=Array.isArray(r)?r.filter(x=>x&&x.name):[];await movies.update(id,{providers:p});toast(p.length?"Streaming aktualisiert":"Nichts gefunden – auf JustWatch prüfen")}
  catch(e){toast("Konnte nicht prüfen")}
}
async function addMovie(m,extra={}){
  if(M().some(x=>keyOf(x)===keyOf(m))){toast("Ist schon auf eurer Liste");return}
  const ok=await movies.add({title:m.title,year:m.year||null,genre:m.genre||"",runtime:m.runtime||null,desc:m.desc||"",providers:m.providers||[],status:"watch",date:null,addedBy:App.me,ratings:{},createdAt:Date.now(),...extra});
  if(ok)toast(extra.status==="planned"?"Filmabend eingetragen":"Auf die Liste gesetzt");
}
function provHTML(p){if(!p||!p.length)return `<span class="note">Noch keine Streaming-Info</span>`;return p.map(x=>`<span class="${x.type==="flat"?"flat":"rent"} ${x.sure===false?"maybe":""}">${esc(x.name)}${x.type==="rent"?" · leihen":""}${x.sure===false?" ?":""}</span>`).join("")}
const metaLine=m=>[m.year,m.genre,m.runtime?m.runtime+" Min.":""].filter(Boolean).map(esc).join(" · ");
const fmtWhen=d=>new Date(d).toLocaleString("de-CH",{weekday:"long",day:"numeric",month:"long",hour:"2-digit",minute:"2-digit"});

function nextPlanned(){const now=Date.now()-3*3600e3;return M().filter(m=>m.status==="planned"&&m.date&&new Date(m.date).getTime()>=now).sort((a,b)=>a.date.localeCompare(b.date))[0]}
function summary(){if(!movies.loaded)return {text:"Lädt …",big:""};const n=nextPlanned();if(n)return {text:"Nächster Filmabend: "+n.title,big:new Date(n.date).toLocaleDateString("de-CH",{weekday:"short",day:"numeric",month:"short"})};const w=M().filter(m=>m.status==="watch").length;return {text:w?w+" Filme auf der Merkliste":"Noch keine Filme gemerkt",big:""}}

function view(){
  return `<h1>${tab==="find"?"Was schauen wir?":tab==="list"?"Unsere Liste":"Filmabende"}</h1>`+seg([["find","Entdecken"],["list","Unsere Liste"],["cal","Kalender"]],tab,"ftab")+(tab==="find"?findV():tab==="list"?listV():calV());
}
function findV(){
  const moods=["Romantisch","Lustig","Spannend","Gruselig","Feelgood","Animation","Kurz (unter 100 Min.)"];
  const res=searching?`<p class="muted"><span class="spin"></span>Claude sucht Filme …</p>`:
    results.length?`<div class="films">${results.map((m,i)=>{const on=M().some(x=>keyOf(x)===keyOf(m));return `<article class="film">${poster(m.title)}<div class="body"><h3>${esc(m.title)}</h3><div class="meta">${metaLine(m)}${m.original&&m.original!==m.title?" · "+esc(m.original):""}</div>
      <div class="note" style="color:var(--ink)">${esc(m.desc)}</div><div class="prov">${provHTML(m.providers)}</div>
      <div class="actions"><button class="btn small" data-add="${i}" ${on?"disabled":""}>${on?"Auf der Liste":"+ Merken"}</button><button class="btn small ghost" data-plan="${i}">Planen</button><a class="btn small ghost" href="${jw(m.title)}" target="_blank" rel="noopener">Prüfen ↗</a></div></div></article>`}).join("")}</div>
      <p class="note">Streaming-Angaben aus Claudes Wissen (Stand Mitte 2026). Gestrichelt mit «?» = Vermutung. «Prüfen» öffnet JustWatch Schweiz.</p>`:
    `<div class="empty"><h2>Film suchen oder Stimmung wählen</h2><p class="muted">Titel, Schauspieler oder Thema eintippen. Claude zeigt, wo der Film in der Schweiz läuft.</p></div>`;
  return `<form class="row" id="sf"><input id="q" placeholder="Titel, Schauspieler, Thema …" autocomplete="off" aria-label="Film suchen"><button class="btn" type="submit">Suchen</button></form>
  <div class="chips">${moods.map(m=>`<button data-mood="${esc(m)}">${esc(m)}</button>`).join("")}</div>${searchNote?`<p class="note">${esc(searchNote)}</p>`:""}${res}`;
}
function card(m){
  const st=m.status,mine=(m.ratings||{})[App.me||"local"]||0;
  return `<article class="film">${poster(m.title)}<div class="body">
    ${st==="planned"&&m.date?`<span class="badge">Geplant · ${esc(new Date(m.date).toLocaleString("de-CH",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}))}</span>`:st==="seen"?`<span class="badge" style="color:var(--good)">Gesehen</span>`:""}
    <h3>${esc(m.title)}</h3><div class="meta">${metaLine(m)}${m.addedBy?" · von "+esc(who(m.addedBy)):""}</div><div class="prov">${provHTML(m.providers)}</div>
    ${st==="seen"?`<div class="row" style="flex-wrap:wrap"><div class="stars" aria-label="Deine Bewertung">${[1,2,3,4,5].map(n=>`<button data-rate="${m.id}" data-n="${n}" class="${n<=mine?"on":""}" aria-label="${n} Herzen">♥</button>`).join("")}</div>
      <span class="note">${Object.entries(m.ratings||{}).filter(([k])=>k!==App.me&&k!=="local").map(([k,v])=>esc(who(k))+": "+"♥".repeat(v)).join(" · ")}</span></div>`:""}
    <div class="actions">${st!=="seen"?`<button class="btn small" data-planid="${m.id}">${st==="planned"?"Verschieben":"Planen"}</button>`:""}
      ${st==="planned"?`<button class="btn small ghost" data-cal="${m.id}">In Kalender</button>`:""}${st!=="seen"?`<button class="btn small ghost" data-seen="${m.id}">Gesehen</button>`:""}
      <button class="btn small ghost" data-prov="${m.id}">${(m.providers||[]).length?"Streaming neu prüfen":"Streaming suchen"}</button>
      <a class="btn small ghost" href="${jw(m.title)}" target="_blank" rel="noopener">JustWatch ↗</a><button class="btn small ghost" data-rm="${m.id}">Entfernen</button></div></div></article>`;
}
function listV(){
  if(!movies.loaded)return `<p class="muted"><span class="spin"></span>Lädt eure Liste …</p>`;
  const g={watch:M().filter(m=>m.status==="watch"),planned:M().filter(m=>m.status==="planned").sort((a,b)=>(a.date||"").localeCompare(b.date||"")),seen:M().filter(m=>m.status==="seen")};
  const L=g[listFilter];
  return `<div class="chips">${[["watch","Merkliste"],["planned","Geplant"],["seen","Gesehen"]].map(([k,l])=>`<button data-lf="${k}" aria-pressed="${listFilter===k}">${l} (${g[k].length})</button>`).join("")}</div>
  ${listFilter==="watch"&&L.length>1?`<button class="btn ghost" id="random">🎲 Zufallsfilm für heute</button>`:""}
  ${L.length?`<div class="films">${L.map(card).join("")}</div>`:`<div class="empty"><p class="muted">${listFilter==="watch"?"Noch nichts gemerkt. Such unter «Entdecken» einen Film.":listFilter==="planned"?"Noch kein Filmabend geplant.":"Hier landen gesehene Filme mit euren Bewertungen."}</p></div>`}
  <p class="note">${movies.col?"Diese Liste ist geteilt: Alle, mit denen du die App teilst, sehen sie.":"Nur in diesem Browser gespeichert."}</p>`;
}
function calV(){
  const planned=M().filter(m=>m.status==="planned"&&m.date),next=nextPlanned();
  const y=calMonth.getFullYear(),mo=calMonth.getMonth(),start=(new Date(y,mo,1).getDay()+6)%7,dim=new Date(y,mo+1,0).getDate();
  const byDay={};planned.forEach(m=>{const k=m.date.slice(0,10);(byDay[k]=byDay[k]||[]).push(m)});
  let cells=WD.map(d=>`<div class="dow">${d}</div>`).join("");for(let i=0;i<start;i++)cells+="<div></div>";
  const today=dkey(new Date());
  for(let d=1;d<=dim;d++){const k=y+"-"+pad(mo+1)+"-"+pad(d);cells+=`<button class="day ${k===today?"today":""} ${k===selDay?"sel":""}" data-day="${k}">${d}${byDay[k]?`<span class="dot"></span>`:""}</button>`}
  const dl=selDay?(byDay[selDay]||[]):[];
  return `${next?`<section class="next"><span class="badge">Nächster Filmabend</span><div class="when">${esc(fmtWhen(next.date))}</div><h2>${esc(next.title)}</h2><div class="prov">${provHTML(next.providers)}</div></section>`:`<div class="empty"><p class="muted">Kein Filmabend geplant. Wählt in eurer Liste einen Film und tippt auf «Planen».</p></div>`}
  <section class="card"><div class="top"><button class="back" data-cm="-1" aria-label="Vormonat">‹</button><h2>${calMonth.toLocaleDateString("de-CH",{month:"long",year:"numeric"})}</h2><button class="back" data-cm="1" aria-label="Nächster Monat">›</button></div><div class="calgrid">${cells}</div></section>
  ${selDay?`<div class="films">${dl.length?dl.map(card).join(""):`<p class="note">An diesem Tag ist nichts geplant.</p>`}</div>`:""}
  <p class="note">Sperrbildschirm: Trag Filmabende mit «In Kalender» in euren gemeinsamen Apple-Kalender ein – das Kalender-Widget von Apple zeigt sie dann an.</p>`;
}
function nextFriday(){const d=new Date();d.setDate(d.getDate()+((5-d.getDay()+7)%7||7));return dkey(d)}
function openPlan(m,isNew,random){
  sheet(`<div class="top"><h2>${random?"Heute schaut ihr …":"Filmabend planen"}</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <div class="film" style="border:0;padding:0">${poster(m.title)}<div class="body"><h3>${esc(m.title)}</h3><div class="meta">${metaLine(m)}</div><div class="prov">${provHTML(m.providers)}</div></div></div>
    <div class="row"><input type="date" id="pd" value="${m.date?m.date.slice(0,10):nextFriday()}" aria-label="Datum"><input type="time" id="pt" value="${m.date?m.date.slice(11,16):"20:00"}" aria-label="Zeit" style="max-width:120px"></div>
    <button class="btn" id="psave">Eintragen</button>`,(host,close)=>{
    $("#psave").onclick=async()=>{const date=$("#pd").value+"T"+($("#pt").value||"20:00");
      if(isNew)await addMovie(m,{status:"planned",date});else{await movies.update(m.id,{status:"planned",date});toast("Filmabend eingetragen")}
      close();tab="cal";const d=new Date(date);calMonth=new Date(d.getFullYear(),d.getMonth(),1);selDay=date.slice(0,10);render()};
  });
}
function openCal(m){
  const d=new Date(m.date),end=new Date(d.getTime()+((m.runtime||120)+15)*60000);
  const text=`🍿 ${m.title}\n${fmtWhen(d)} – ${end.toLocaleTimeString("de-CH",{hour:"2-digit",minute:"2-digit"})}\n${(m.providers||[]).filter(p=>p.type==="flat").map(p=>p.name).join(", ")||"Streaming prüfen"}`;
  const g=x=>x.toISOString().replace(/[-:]/g,"").replace(/\.\d+/,"");
  const gUrl="https://calendar.google.com/calendar/render?action=TEMPLATE&text="+encodeURIComponent("🍿 "+m.title)+"&dates="+g(d)+"/"+g(end);
  sheet(`<div class="top"><h2>In den Kalender</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <p class="muted">Text kopieren, in der Apple-Kalender-App ein neues Ereignis im gemeinsamen Kalender erstellen und einfügen.</p>
    <div class="copy" id="ctext">${esc(text)}</div><div class="actions"><button class="btn" id="ccopy">Text kopieren</button><a class="btn ghost" href="${gUrl}" target="_blank" rel="noopener">Google Kalender ↗</a></div>
    <p class="note">Oder schreib Claude im Chat: «Trag den Filmabend ein» – dann macht Claude das für dich.</p>`,()=>{$("#ccopy").onclick=()=>copyText(text,$("#ctext"))});
}
function bind(){
  $$("[data-ftab]").forEach(b=>b.onclick=()=>{tab=b.dataset.ftab;render()});
  const sf=$("#sf");if(sf)sf.onsubmit=e=>{e.preventDefault();runSearch($("#q").value,"search")};
  $$("[data-mood]").forEach(b=>b.onclick=()=>runSearch(b.dataset.mood,"mood"));
  $$("[data-add]").forEach(b=>b.onclick=()=>addMovie(results[+b.dataset.add]));
  $$("[data-plan]").forEach(b=>b.onclick=()=>openPlan(results[+b.dataset.plan],true));
  $$("[data-planid]").forEach(b=>b.onclick=()=>openPlan(M().find(m=>m.id===b.dataset.planid),false));
  $$("[data-seen]").forEach(b=>b.onclick=()=>{movies.update(b.dataset.seen,{status:"seen"});toast("Als gesehen markiert – jetzt bewerten")});
  $$("[data-rm]").forEach(b=>b.onclick=()=>movies.remove(b.dataset.rm));
  $$("[data-prov]").forEach(b=>b.onclick=()=>refreshProv(b.dataset.prov));
  $$("[data-rate]").forEach(b=>b.onclick=()=>movies.update(b.dataset.rate,{ratings:{[App.me||"local"]:+b.dataset.n}}));
  $$("[data-cal]").forEach(b=>b.onclick=()=>openCal(M().find(m=>m.id===b.dataset.cal)));
  $$("[data-lf]").forEach(b=>b.onclick=()=>{listFilter=b.dataset.lf;render()});
  $$("[data-cm]").forEach(b=>b.onclick=()=>{calMonth.setMonth(calMonth.getMonth()+ +b.dataset.cm);render()});
  $$("[data-day]").forEach(b=>b.onclick=()=>{selDay=selDay===b.dataset.day?null:b.dataset.day;render()});
  const r=$("#random");if(r)r.onclick=()=>{const L=M().filter(m=>m.status==="watch");openPlan(L[Math.floor(Math.random()*L.length)],false,true)};
}
register({id:"film",title:"Film",icon:"film",col:movies,view,bind,summary});
})();
