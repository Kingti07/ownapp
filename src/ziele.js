/* ================= Modul: Ziele-Challenge (geteilt, jeder schreibt nur seine eigenen Ziele) ================= */
(()=>{
const END=new Date("2027-01-01T00:00:00");
const PRESETS=[["Velo fahren",2],["Gym",2],["Bewusst essen",7],["7 Std. Schlaf",7],["Lesen",3],["Calisthenics",3],["Morgenroutine",5],["Lernen",3],["Jemand Neues ansprechen",1]];
const BONUS=25,PER=10;
const col=new SharedCol("challenge");
let tab="today",weekOff=0;
const myId=()=>App.me||"local";
const mine=()=>col.items.find(x=>x.id===myId());
const people=()=>col.items.filter(x=>x.goals&&x.goals.length);
function save(d){d.owner=myId();d.updatedAt=Date.now();const {id,...data}=d;col.set(myId(),JSON.parse(JSON.stringify(data)))}
function weekDays(off){const m=mondayOf(new Date());m.setDate(m.getDate()+off*7);return WD.map((_,i)=>{const d=new Date(m);d.setDate(m.getDate()+i);return dkey(d)})}
const done=(p,day,gid)=>((p.log||{})[day]||[]).includes(gid);
function weekCount(p,g,days){return days.filter(d=>done(p,d,g.id)).length}
function weekPct(p,days){const t=p.goals.reduce((a,g)=>a+g.target,0);if(!t)return 0;return Math.round(p.goals.reduce((a,g)=>a+Math.min(g.target,weekCount(p,g,days)),0)/t*100)}
function points(p){
  const log=p.log||{},checks=Object.values(log).reduce((a,l)=>a+l.length,0);
  const dates=Object.keys(log).filter(d=>log[d].length);if(!dates.length)return 0;
  const first=mondayOf(dates.sort()[0]+"T12:00"),now=mondayOf(new Date());let bonus=0;
  for(let m=new Date(first);m<=now;m.setDate(m.getDate()+7)){const off=Math.round((m-now)/(7*864e5));const days=weekDays(off);p.goals.forEach(g=>{if(weekCount(p,g,days)>=g.target)bonus+=BONUS})}
  return checks*PER+bonus;
}
function streak(p){let n=0;const d=new Date();if(!((p.log||{})[dkey(d)]||[]).length)d.setDate(d.getDate()-1);while(((p.log||{})[dkey(d)]||[]).length){n++;d.setDate(d.getDate()-1)}return n}
const daysLeft=()=>Math.max(0,Math.ceil((END-new Date())/864e5));
function ranking(){return people().map(p=>({p,pts:points(p),wk:weekPct(p,weekDays(0)),st:streak(p)})).sort((a,b)=>b.pts-a.pts||b.wk-a.wk)}
function summary(){if(!col.loaded)return {text:"Lädt …",big:""};const m=mine();if(!m||!m.goals?.length)return {text:"Ziele festlegen",big:""};const r=ranking(),pos=r.findIndex(x=>x.p.id===myId())+1;const days=weekDays(0),d=m.goals.reduce((a,g)=>a+Math.min(g.target,weekCount(m,g,days)),0),t=m.goals.reduce((a,g)=>a+g.target,0);return {text:`Diese Woche ${d}/${t}${r.length>1?" · Platz "+pos+" von "+r.length:""}`,big:weekPct(m,days)+"%"}}

function view(){
  if(!col.loaded)return `<h1>Ziele</h1><p class="muted"><span class="spin"></span>Lädt …</p>`;
  const m=mine();
  if(!m||!m.goals||!m.goals.length)return `<h1>Ziele-Challenge</h1>`+setupV(true);
  return `<div class="top"><h1>Ziele-Challenge</h1><span class="pill num">noch ${daysLeft()} Tage</span></div>`+seg([["today","Diese Woche"],["rank","Rangliste"],["goals","Meine Ziele"]],tab,"ztab")+(tab==="today"?todayV(m):tab==="rank"?rankV():setupV(false));
}
function todayV(m){
  const days=weekDays(weekOff),today=dkey(new Date()),pct=weekPct(m,days);
  const from=new Date(days[0]+"T12:00").toLocaleDateString("de-CH",{day:"numeric",month:"short"}),to=new Date(days[6]+"T12:00").toLocaleDateString("de-CH",{day:"numeric",month:"short"});
  return `<section class="hero"><div class="top"><span class="lbl">${weekOff===0?"Diese Woche":"Woche "+from+" – "+to}</span><span class="note">${streak(m)?"🔥 "+streak(m)+(streak(m)===1?" Tag":" Tage")+" am Stück":""}</span></div>
    <div class="big num">${pct}<small style="margin-left:4px">%</small></div><div class="bar"><i style="width:${pct}%"></i></div>
    <div class="row" style="justify-content:space-between"><button class="btn small clear" data-wk="-1">‹ Vorwoche</button>${weekOff<0?`<button class="btn small clear" data-wk="1">Nächste ›</button>`:`<span class="note">${points(m)} Punkte total</span>`}</div></section>
  <section class="card">${m.goals.map(g=>{const c=weekCount(m,g,days),ok=c>=g.target,isNow=weekOff===0;return `<div class="goal">
      ${isNow?`<button class="tick" data-tick="${g.id}" aria-pressed="${done(m,today,g.id)}" aria-label="${esc(g.name)} heute erledigt">✓</button>`:`<span class="tick" aria-hidden="true" style="color:var(--muted)">${ok?"✓":"–"}</span>`}
      <div style="min-width:0"><h3>${esc(g.name)}</h3><div class="dots">${days.map((d,i)=>`<button data-dot="${g.id}" data-day="${d}" class="${done(m,d,g.id)?"on":""} ${d===today?"today":""}" ${d>today?"disabled":""} aria-label="${WD[i]} ${esc(g.name)}">${WD[i]}</button>`).join("")}</div></div>
      <span class="cnt ${ok?"done":""}">${c}/${g.target}${ok?" ✓":""}</span></div>`}).join("")}</section>
  <p class="note">Tippe auf ✓ für heute oder auf einen Tag, um etwas nachzutragen. Pro Häkchen gibt's ${PER} Punkte, für jedes erreichte Wochenziel ${BONUS} Bonus-Punkte.</p>`;
}
function rankV(){
  const r=ranking();
  return `<section class="card"><div class="top"><h2>Rangliste</h2><span class="note">bis 1. Januar 2027</span></div>
    ${r.map((x,i)=>`<div class="rank ${x.p.id===myId()?"me":""}"><span class="pos">${["🥇","🥈","🥉"][i]||i+1}</span><div><b>${esc(who(x.p.owner||x.p.id))}</b><div class="note">${x.p.goals.length} Ziele · diese Woche ${x.wk}%${x.st?" · 🔥 "+x.st:""}</div><div class="bar" style="margin-top:6px"><i style="width:${x.wk}%"></i></div></div><span class="pts">${x.pts}</span></div>`).join("")}</section>
  ${r.length<2?`<div class="empty"><p class="muted">Noch bist du allein. Teile die App mit Levin und Yanic – sobald sie ihre Ziele festlegen, erscheinen sie hier.</p></div>`:""}
  <section class="card"><h2>Ziele der anderen</h2>${r.filter(x=>x.p.id!==myId()).map(x=>`<div class="item"><div class="t">${esc(who(x.p.owner||x.p.id))}</div><div class="note">${x.wk}%</div><div class="s">${x.p.goals.map(g=>esc(g.name)+" "+weekCount(x.p,g,weekDays(0))+"/"+g.target).join(" · ")}</div></div>`).join("")||`<p class="note">Noch niemand.</p>`}</section>`;
}
let draft=null;
function setupV(first){
  const m=mine();if(!draft)draft=(m&&m.goals?m.goals:[]).map(g=>({...g}));
  return `${first?`<section class="card"><h2>Welche Ziele willst du bis 1.1.2027 schaffen?</h2><p class="muted">Wähl Vorschläge oder schreib eigene. Lege fest, wie oft pro Woche. Levin und Yanic sehen deine Ziele und Häkchen, aber nichts aus Budget oder Training.</p></section>`:""}
  <section class="card"><h2>Meine Ziele</h2>${draft.length?draft.map((g,i)=>`<div class="item"><div class="t">${esc(g.name)}</div><div class="stepper"><button data-tg="${i}" data-d="-1" aria-label="weniger">−</button><b>${g.target}</b><button data-tg="${i}" data-d="1" aria-label="mehr">+</button><button class="x" data-gdel="${i}" aria-label="Ziel löschen">×</button></div><div class="s">${g.target}× pro Woche</div></div>`).join(""):`<p class="note">Noch keine Ziele gewählt.</p>`}
    <span class="note">Vorschläge</span><div class="chips">${PRESETS.filter(([n])=>!draft.some(g=>g.name===n)).map(([n,t])=>`<button data-pre="${esc(n)}" data-t="${t}">+ ${esc(n)}</button>`).join("")}</div>
    <div class="inline"><label>Eigenes Ziel<input id="zg-n" placeholder="z.B. 10 Liegestütze"></label><button class="btn" id="zg-add">+</button></div>
    <button class="btn" id="zg-save" ${draft.length?"":"disabled"}>${first?"Challenge starten":"Speichern"}</button></section>`;
}
function bind(){
  const on=(q,f)=>{const e=$(q);if(e)e.onclick=f};
  $$("[data-ztab]").forEach(b=>b.onclick=()=>{tab=b.dataset.ztab;draft=null;render()});
  $$("[data-wk]").forEach(b=>b.onclick=()=>{weekOff=Math.min(0,weekOff+ +b.dataset.wk);render()});
  const toggle=(gid,day)=>{const m=structuredClone(mine());m.log=m.log||{};const L=new Set(m.log[day]||[]);const add=!L.has(gid);add?L.add(gid):L.delete(gid);if(L.size)m.log[day]=[...L];else delete m.log[day];save(m);
    const g=m.goals.find(x=>x.id===gid),days=weekDays(weekOff);if(add&&g&&weekCount(m,g,days)===g.target)toast("Wochenziel «"+g.name+"» geschafft! +"+BONUS)};
  $$("[data-tick]").forEach(b=>b.onclick=()=>toggle(b.dataset.tick,dkey(new Date())));
  $$("[data-dot]").forEach(b=>b.onclick=()=>toggle(b.dataset.dot,b.dataset.day));
  $$("[data-tg]").forEach(b=>b.onclick=()=>{const g=draft[+b.dataset.tg];g.target=Math.max(1,Math.min(7,g.target+ +b.dataset.d));render()});
  $$("[data-gdel]").forEach(b=>b.onclick=()=>{draft.splice(+b.dataset.gdel,1);render()});
  $$("[data-pre]").forEach(b=>b.onclick=()=>{draft.push({id:uid(),name:b.dataset.pre,target:+b.dataset.t});render()});
  on("#zg-add",()=>{const n=$("#zg-n").value.trim();if(!n)return;draft.push({id:uid(),name:n,target:3});render()});
  on("#zg-save",()=>{const m=mine()?structuredClone(mine()):{log:{},createdAt:Date.now()};m.goals=draft.map(g=>({id:g.id,name:g.name,target:g.target}));save(m);draft=null;tab="today";toast("Ziele gespeichert")});
}
register({id:"ziele",title:"Ziele",icon:"ziele",col,view,bind,summary});
})();
