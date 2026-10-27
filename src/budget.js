/* ================= Modul: Budget ================= */
(()=>{
const DEFAULT_CATS=[{id:"essen",name:"Essen & Snacks",limit:150},{id:"ausgang",name:"Ausgang",limit:120},{id:"kleider",name:"Kleider",limit:80},{id:"gaming",name:"Gaming",limit:40},{id:"oev",name:"Velo & ÖV",limit:30},{id:"geschenke",name:"Geschenke",limit:40},{id:"sonst",name:"Sonstiges",limit:60}];
const blank=()=>({v:1,income:0,saveRate:0,fixed:[],cats:DEFAULT_CATS.map(c=>({...c})),tx:[],goals:[],etf:{monthly:0,rate:4},example:false});
const doc=new PrivateDoc("budget",s=>{const b=blank();for(const k in b)if(s[k]===undefined)s[k]=b[k];return s});
let tab="home",cur=new Date();cur.setDate(1);
const B=()=>doc.S;
function commit(msg){doc.save();rerender();toast(msg)}

function monthTx(){const k=ym(cur);return B().tx.filter(t=>t.date.startsWith(k)).sort((a,b)=>b.date.localeCompare(a.date))}
function stats(){
  const S=B(),tx=monthTx(),spent=tx.reduce((a,t)=>a+t.amount,0),fixed=S.fixed.reduce((a,f)=>a+f.amount,0);
  const plan=S.income-fixed-S.saveRate-(S.etf.monthly||0),left=plan-spent;
  const now=new Date(),isNow=ym(now)===ym(cur),dim=new Date(cur.getFullYear(),cur.getMonth()+1,0).getDate();
  const daysLeft=isNow?dim-now.getDate()+1:0;const byCat={};tx.forEach(t=>byCat[t.cat]=(byCat[t.cat]||0)+t.amount);
  return {tx,spent,fixed,plan,left,daysLeft,byCat};
}
function summary(){if(!doc.loaded)return {text:"Lädt …",big:""};if(!B())return {text:"Noch nicht eingerichtet",big:""};const c0=cur;cur=new Date();cur.setDate(1);const st=stats();cur=c0;return {text:st.daysLeft?`Noch ${st.daysLeft} Tage · ${chf(Math.max(0,st.left/st.daysLeft),0)} CHF/Tag`:"diesen Monat",big:"CHF "+chf(st.left)}}

function view(){
  if(!doc.loaded)return `<h1>Budget</h1><p class="muted"><span class="spin"></span>Lädt …</p>`;
  if(!B())return onboarding();
  return `<div class="top"><h1>Budget</h1>${tab==="home"||tab==="tx"?monthNav():""}</div>`+seg([["home","Übersicht"],["tx","Ausgaben"],["goals","Sparen"],["set","Einstellungen"]],tab,"btab")+
    (B().example?`<p class="note"><span class="pill">Beispieldaten</span> Erfundene Zahlen zum Ausprobieren. Unter Einstellungen löschst du sie.</p>`:"")+
    (tab==="home"?home():tab==="tx"?txView():tab==="goals"?goalsView():settings());
}
function monthNav(){return `<div class="month"><button data-m="-1" aria-label="Vormonat">‹</button><span>${cur.toLocaleDateString("de-CH",{month:"long",year:"numeric"})}</span><button data-m="1" aria-label="Nächster Monat">›</button></div>`}
function onboarding(){
  return `<h1>Budget</h1><div class="card empty" style="border-style:solid"><h2>Wie viel kommt pro Monat rein?</h2>
    <p class="muted">Trag deinen Lehrlingslohn (netto) ein. Fixkosten, Kategorien und Sparziele passt du danach an.</p>
    <label style="width:100%">Lohn pro Monat in CHF<input id="ob-income" type="number" inputmode="decimal" placeholder="z.B. 950"></label>
    <button class="btn wide" id="ob-go">Los geht's</button><button class="btn ghost wide" id="ob-demo">Erst mit Beispieldaten ausprobieren</button></div>`;
}
function home(){
  const S=B(),st=stats(),pct=st.plan>0?Math.min(100,st.spent/st.plan*100):0,perDay=st.daysLeft?st.left/st.daysLeft:null;
  const cats=S.cats.map(c=>{const sp=st.byCat[c.id]||0,p=c.limit?sp/c.limit*100:0;return `<div class="item cat"><div class="t">${esc(c.name)}</div><div class="v num">${chf(sp)} <span class="muted">/ ${chf(c.limit)}</span></div><div class="bar ${p>100?"over":p>80?"near":""}"><i style="width:${Math.min(100,p)}%"></i></div></div>`}).join("");
  const g=S.goals[0];
  return `<section class="hero"><span class="lbl">Noch frei diesen Monat</span><div class="big num"><small>CHF</small>${chf(st.left)}</div><div class="bar"><i style="width:${pct}%"></i></div>
    <div class="row" style="flex-wrap:wrap;gap:14px;font-size:13px"><span>Ausgegeben <b class="num">${chf(st.spent)}</b></span><span>Budget <b class="num">${chf(st.plan)}</b></span>${perDay!==null?`<span>Pro Tag <b class="num">${chf(Math.max(0,perDay),2)}</b></span>`:""}</div></section>
  <section class="card"><h2>So verteilt sich dein Lohn</h2><div class="list">
    <div class="item"><div class="t">Lohn</div><div class="v num">${chf(S.income)}</div></div>
    <div class="item"><div class="t">Fixkosten</div><div class="v num">−${chf(st.fixed)}</div></div>
    <div class="item"><div class="t">Sparen</div><div class="v num">−${chf(S.saveRate)}</div></div>
    <div class="item"><div class="t">ETF-Sparplan</div><div class="v num">−${chf(S.etf.monthly||0)}</div></div>
    <div class="item"><div class="t">Zum Ausgeben</div><div class="v num"><b>${chf(st.plan)}</b></div></div></div></section>
  <section class="card"><h2>Kategorien</h2><div class="list">${cats}</div></section>
  ${g?`<section class="card"><div class="top"><h2>${esc(g.name)}</h2><span class="pill">${Math.round(g.saved/g.target*100)}%</span></div><div class="bar"><i style="width:${Math.min(100,g.saved/g.target*100)}%"></i></div><p class="note num">${chf(g.saved)} von ${chf(g.target)} CHF</p></section>`:""}`;
}
function txView(){
  const S=B(),st=stats();
  const rows=st.tx.map(t=>{const c=S.cats.find(c=>c.id===t.cat);return `<div class="item"><div><div class="t">${esc(t.note||c?.name||"Ausgabe")}</div><div class="note">${new Date(t.date).toLocaleDateString("de-CH",{weekday:"short",day:"numeric",month:"short"})} · ${esc(c?.name||"–")}</div></div><div class="v"><span class="num">${chf(t.amount,2)}</span><button class="x" data-del="${t.id}" aria-label="Löschen">×</button></div></div>`}).join("");
  return `<section class="card">${rows?`<div class="list">${rows}</div>`:`<p class="muted">Noch keine Ausgaben in diesem Monat. Tipp unten rechts auf +.</p>`}</section><p class="note num">Total: CHF ${chf(st.spent,2)}</p>`;
}
function goalsView(){
  const S=B();
  const g=S.goals.map(g=>`<div class="item"><div class="t">${esc(g.name)}</div><div class="v"><span class="num">${chf(g.saved)} / ${chf(g.target)}</span> <button class="x" data-gdel="${g.id}" aria-label="Ziel löschen">×</button></div>
    <div class="bar" style="grid-column:1/-1"><i style="width:${Math.min(100,g.saved/g.target*100)}%"></i></div>
    <div class="inline" style="grid-column:1/-1">${[20,50,100].map(a=>`<button class="btn small ghost" data-gadd="${g.id}" data-amt="${a}">+${a}</button>`).join("")}
    ${g.saved<g.target&&S.saveRate>0?`<span class="note">bei ${chf(S.saveRate)}/Mt. in ca. ${Math.ceil((g.target-g.saved)/S.saveRate)} Monaten</span>`:""}</div></div>`).join("");
  const m=S.etf.monthly||0,r=(S.etf.rate||0)/100/12,fv=n=>r?m*((Math.pow(1+r,n*12)-1)/r):m*n*12;
  return `<section class="card"><h2>Sparziele</h2>${g?`<div class="list">${g}</div>`:`<p class="muted">Noch kein Ziel – zum Beispiel neues Velo, Ferien oder Führerausweis.</p>`}
    <div class="inline"><label>Ziel<input id="g-name" placeholder="z.B. Neues Velo"></label><label style="flex:0 1 110px">CHF<input id="g-target" type="number" inputmode="decimal" placeholder="1200"></label><button class="btn" id="g-add">Hinzufügen</button></div></section>
  <section class="card"><h2>ETF-Sparplan</h2><p class="note">Zeigt, wie ein monatlicher Betrag wachsen könnte. Die Rendite ist eine Annahme zum Rechnen, keine Prognose und keine Anlageberatung.</p>
    <div class="grid2"><label>Pro Monat (CHF)<input id="etf-m" type="number" inputmode="decimal" value="${m||""}" placeholder="50"></label><label>Rendite-Annahme % p.a.<input id="etf-r" type="number" inputmode="decimal" step="0.5" value="${S.etf.rate}"></label></div>
    <div class="proj"><div><b>${chf(fv(5))}</b><span>nach 5 Jahren</span></div><div><b>${chf(fv(10))}</b><span>nach 10 Jahren</span></div><div><b>${chf(fv(20))}</b><span>nach 20 Jahren</span></div></div>
    <p class="note num">Selbst einbezahlt nach 10 Jahren: CHF ${chf(m*120)}</p></section>`;
}
function settings(){
  const S=B();
  const fx=S.fixed.map(f=>`<div class="item"><div class="t">${esc(f.name)}</div><div class="v"><span class="num">${chf(f.amount,2)}</span><button class="x" data-fdel="${f.id}" aria-label="Löschen">×</button></div></div>`).join("");
  const cs=S.cats.map(c=>`<div class="item"><div class="t">${esc(c.name)}</div><div class="v"><input class="num" style="width:90px" type="number" inputmode="decimal" data-lim="${c.id}" value="${c.limit}" aria-label="Limit ${esc(c.name)}"></div></div>`).join("");
  return `<section class="card"><h2>Einnahmen</h2><div class="grid2"><label>Lohn pro Monat<input id="s-income" type="number" inputmode="decimal" value="${S.income}"></label><label>Fix sparen pro Monat<input id="s-save" type="number" inputmode="decimal" value="${S.saveRate}"></label></div></section>
  <section class="card"><h2>Fixkosten</h2>${fx?`<div class="list">${fx}</div>`:`<p class="muted">Zum Beispiel Handy-Abo, Streaming oder Gym-Abo.</p>`}
    <div class="inline"><label>Name<input id="f-name" placeholder="Handy-Abo"></label><label style="flex:0 1 100px">CHF<input id="f-amt" type="number" inputmode="decimal" placeholder="25"></label><button class="btn" id="f-add">+</button></div></section>
  <section class="card"><h2>Monatslimit pro Kategorie</h2><div class="list">${cs}</div><div class="inline"><label>Neue Kategorie<input id="c-name" placeholder="z.B. Gym"></label><button class="btn" id="c-add">+</button></div></section>
  <section class="card"><h2>Daten</h2><p class="note">${App.cloud?"Privat in deinem Claude-Konto gespeichert – nur du siehst dein Budget.":"Nur in diesem Browser gespeichert."}</p>
    ${S.example?`<button class="btn" id="d-real">Beispieldaten löschen und eigene starten</button>`:""}<button class="btn danger" id="d-reset">Budget zurücksetzen</button><div id="d-confirm"></div></section>`;
}
function bind(){
  const on=(id,f)=>{const e=$(id);if(e)e.onclick=f},ch=(id,f)=>{const e=$(id);if(e)e.onchange=f},num=id=>parseFloat($(id).value);
  on("#ob-go",()=>{const v=num("#ob-income");if(!(v>0)){toast("Bitte einen Betrag eingeben");return}doc.S=blank();doc.S.income=v;commit("Gestartet")});
  on("#ob-demo",()=>{doc.S=demo();commit("Beispieldaten geladen")});
  if(!B())return;
  const S=B();
  $$("[data-btab]").forEach(b=>b.onclick=()=>{tab=b.dataset.btab;render()});
  $$("[data-m]").forEach(b=>b.onclick=()=>{cur.setMonth(cur.getMonth()+ +b.dataset.m);render()});
  $$("[data-del]").forEach(b=>b.onclick=()=>{S.tx=S.tx.filter(t=>t.id!==b.dataset.del);commit("Gelöscht")});
  $$("[data-gdel]").forEach(b=>b.onclick=()=>{S.goals=S.goals.filter(g=>g.id!==b.dataset.gdel);commit("Ziel gelöscht")});
  $$("[data-gadd]").forEach(b=>b.onclick=()=>{const g=S.goals.find(g=>g.id===b.dataset.gadd);g.saved+= +b.dataset.amt;commit(g.saved>=g.target?"Ziel erreicht! 🎉":"+"+b.dataset.amt+" CHF gespart")});
  $$("[data-fdel]").forEach(b=>b.onclick=()=>{S.fixed=S.fixed.filter(f=>f.id!==b.dataset.fdel);commit()});
  $$("[data-lim]").forEach(i=>i.onchange=()=>{S.cats.find(c=>c.id===i.dataset.lim).limit=+i.value||0;commit("Gespeichert")});
  on("#g-add",()=>{const n=$("#g-name").value.trim(),t=num("#g-target");if(!n||!(t>0)){toast("Name und Betrag eingeben");return}S.goals.push({id:uid(),name:n,target:t,saved:0});commit("Ziel hinzugefügt")});
  on("#f-add",()=>{const n=$("#f-name").value.trim(),a=num("#f-amt");if(!n||!(a>0)){toast("Name und Betrag eingeben");return}S.fixed.push({id:uid(),name:n,amount:a});commit("Fixkosten hinzugefügt")});
  on("#c-add",()=>{const n=$("#c-name").value.trim();if(!n)return;S.cats.push({id:uid(),name:n,limit:50});commit("Kategorie hinzugefügt")});
  ch("#s-income",e=>{S.income=+e.target.value||0;commit("Gespeichert")});
  ch("#s-save",e=>{S.saveRate=+e.target.value||0;commit("Gespeichert")});
  ch("#etf-m",e=>{S.etf.monthly=+e.target.value||0;commit()});
  ch("#etf-r",e=>{S.etf.rate=+e.target.value||0;commit()});
  on("#d-real",()=>{const inc=S.income;doc.S=blank();doc.S.income=inc;commit("Bereit für deine Daten")});
  on("#d-reset",()=>{$("#d-confirm").innerHTML=`<div class="inline"><span class="note">Wirklich das ganze Budget löschen?</span><button class="btn small" id="d-yes">Ja, löschen</button><button class="btn small ghost" id="d-no">Abbrechen</button></div>`;
    $("#d-yes").onclick=()=>{doc.S=null;commit("Budget gelöscht")};$("#d-no").onclick=()=>$("#d-confirm").innerHTML=""});
}
function openAdd(){
  const S=B();let cat=S.cats[0].id;
  sheet(`<div class="top"><h2>Neue Ausgabe</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <input class="amount num" id="sh-amt" type="number" inputmode="decimal" placeholder="0.00" aria-label="Betrag in CHF">
    <div class="chips">${S.cats.map((c,i)=>`<button data-c="${c.id}" aria-pressed="${i===0}">${esc(c.name)}</button>`).join("")}</div>
    <div class="grid2"><label>Notiz<input id="sh-note" placeholder="z.B. Döner"></label><label>Datum<input id="sh-date" type="date" value="${dkey(new Date())}"></label></div>
    <button class="btn" id="sh-save">Speichern</button>`,(host,close)=>{
      setTimeout(()=>{const e=$("#sh-amt");if(e)e.focus()},50);
      host.querySelectorAll("[data-c]").forEach(b=>b.onclick=()=>{cat=b.dataset.c;host.querySelectorAll("[data-c]").forEach(x=>x.setAttribute("aria-pressed",x===b))});
      $("#sh-save").onclick=()=>{const a=parseFloat($("#sh-amt").value);if(!(a>0)){toast("Betrag eingeben");return}S.tx.push({id:uid(),date:$("#sh-date").value||dkey(new Date()),amount:a,cat,note:$("#sh-note").value.trim()});close();commit("Ausgabe gespeichert")};
    });
}
function demo(){
  const s=blank();s.example=true;s.income=950;s.saveRate=100;s.etf={monthly:50,rate:4};
  s.fixed=[{id:uid(),name:"Handy-Abo",amount:29},{id:uid(),name:"Streaming",amount:13.9},{id:uid(),name:"Gym-Abo",amount:45}];
  const day=new Date().getDate(),k=ym(new Date());
  [["essen",12.5,"Mittagessen",0],["gaming",19.9,"Skin",1],["ausgang",35,"Kino + Pizza",3],["essen",8.4,"Döner",4],["kleider",59.9,"Hoodie",6],["oev",14,"Tageskarte",8],["essen",6.2,"Snacks",9],["ausgang",22,"Bowling",11]]
    .forEach(([c,a,n,o])=>{if(o<day)s.tx.push({id:uid(),date:k+"-"+pad(day-o),amount:a,cat:c,note:n})});
  s.goals=[{id:uid(),name:"Neues Velo",target:1200,saved:420},{id:uid(),name:"Führerausweis",target:3000,saved:250}];
  return s;
}
register({id:"budget",title:"Budget",icon:"budget",doc,view,bind,summary,fab:()=>!!B(),onFab:openAdd});
})();
