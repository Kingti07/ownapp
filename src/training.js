/* ================= Modul: Fire Trainer (Minecraft-PvP) ================= */
(()=>{
const TIERS=["LT5","HT5","LT4","HT4","LT3","HT3","LT2","HT2","LT1","HT1"];
const KITS=["Mace","Sword","Axe","UHC","Pot","NethOP","SMP"];
const DRILLS={
 Mace:[["Wind-Charge-Combos","Mit Wind Charge hochschiessen und sauber Smash-Hits landen","Basis"],["Density-Timing","Fallhöhe abschätzen und den Smash im richtigen Moment setzen","Basis"],["Breach-Swap","Schnell auf die Breach-Mace wechseln, um Rüstung zu knacken","Fortgeschritten"],["Pearl-Smash","Mit Enderperle Höhe gewinnen und von oben angreifen","Fortgeschritten"],["Konter von unten","Ausweichen und kontern, wenn der Gegner von oben kommt","Fortgeschritten"],["Elytra-Mace","Aus dem Flug heraus treffen, ohne zu verpassen","Profi"]],
 Sword:[["W-Tap & S-Tap","Knockback steuern und Combos verlängern","Basis"],["Hit-Select","Nicht spammen, nur auf Cooldown treffen","Basis"],["Crit-Timing","Sprung-Crits im richtigen Takt setzen","Fortgeschritten"],["Strafe-Pattern","Seitlich bewegen, damit der Gegner weniger trifft","Fortgeschritten"],["Combo halten","Gegner in der Luft halten, ohne dass er zurückschlägt","Profi"],["Reach-Kontrolle","Immer am Rand der eigenen Reichweite bleiben","Profi"]],
 Axe:[["Schild-Disable","Mit der Axt den Schild des Gegners ausschalten","Basis"],["Schild-Timing","Eigenen Schild nur kurz und gezielt hochnehmen","Basis"],["Axt-Sword-Swap","Nach dem Disable sofort Druck machen","Fortgeschritten"],["Schild-Fakes","Gegner zum Disable verleiten und dann kontern","Profi"]],
 UHC:[["Rod-Combos","Mit der Angel Knockback und Combos aufbauen","Basis"],["Block-Clutch","Blöcke unter sich setzen, um Fallschaden zu vermeiden","Basis"],["Bogen-Duelle","Auf Distanz treffen und vorhalten","Fortgeschritten"],["Lava & Wasser","Lava platzieren und mit Wasser kontern","Fortgeschritten"],["Golden-Apple-Timing","Gapple im sicheren Moment essen","Fortgeschritten"],["Kopf-Heilung","Nach dem Kill sofort heilen und neu aufbauen","Profi"]],
 Pot:[["Pot-Timing","Heiltränke im richtigen Moment werfen, nicht zu früh","Basis"],["Pot beim Rückzug","Beim Weglaufen nach hinten werfen","Fortgeschritten"],["Pearl-Escape","Mit Enderperlen Abstand gewinnen","Fortgeschritten"],["Pot-Effizienz","Mit wenigen Tränken möglichst lange überleben","Profi"]],
 NethOP:[["Rüstung im Blick","Haltbarkeit checken und rechtzeitig rotieren","Basis"],["Trank-Management","Stärke- und Speed-Tränke sinnvoll nutzen","Fortgeschritten"],["Lange Fights","Konzentration halten bei langen Kämpfen","Fortgeschritten"],["Gapple-Rotation","Goldäpfel so einsetzen, dass der Gegner zuerst leer ist","Profi"]],
 SMP:[["Inventar-Setup","Hotbar so ordnen, dass alles schnell erreichbar ist","Basis"],["Totem-Swap","Totem nach dem Pop sofort ersetzen","Fortgeschritten"],["Kit-Wechsel","Schnell zwischen Waffen und Utility wechseln","Fortgeschritten"],["Druck nach Totem-Pop","Sofort nachsetzen, wenn der Gegner sein Totem verliert","Profi"]]
};
const WARMUPS={"Kurz (10 Min.)":[["Reaktionstest",2],["Strafe & Bewegung ohne Gegner",3],["2 lockere Duels",5]],"Normal (20 Min.)":[["Reaktionstest + CPS",3],["Bridge / Block-Clutch",4],["Aim auf Bot oder Freund",5],["3 Duels im Haupt-Kit",8]],"Vor Tier-Test (30 Min.)":[["Wasser trinken, Handy weg",1],["Reaktionstest",3],["Movement",5],["Drill im Test-Kit",8],["4 ernste Duels",10],["2 Min. Pause, durchatmen",3]]};
const MISTAKES=["Positionierung","Aim","Timing","Inventar","Movement","Tilt","Ping/Lag","Zu aggressiv","Zu passiv"];
const PREP=["Genug geschlafen","Gegessen & getrunken","Warm-up gemacht","Discord/Handy stumm","Maus & Settings gecheckt","Kein Stress vorher"];
const blank=()=>({v:2,ign:"FireTino",tiers:{Mace:{cur:"LT3",goal:"HT3"},Sword:{cur:"LT4",goal:"LT3"},Axe:{cur:"LT4",goal:"LT3"},UHC:{cur:"LT4",goal:"LT3"},Pot:{cur:"LT4",goal:"LT3"},NethOP:{cur:"LT4",goal:"LT3"},SMP:{cur:"LT4",goal:"LT3"}},weeklyGoalMin:900,sessions:[],tests:[]});
function upgrade(s){const d={drillStatus:{},customDrills:[],plan:WD.map((_,i)=>({time:i===5?"19:00":"22:30",kit:"",min:120})),reaction:[],cps:[],rivals:[],reviews:[],prep:{},loadouts:{},servers:["mcpvp.club","mcpvp.com","pvphq.com"],nextTest:null};for(const k in d)if(s[k]===undefined)s[k]=d[k];return s}
const doc=new PrivateDoc("pvp",upgrade);
const S=()=>{if(!doc.S&&doc.loaded)doc.S=upgrade(blank());return doc.S};
let view_="heute",kit=null,drills=new Set(),run=null,coachText="",coachBusy=false,libKit=null,warm=null,react={st:"idle"},cpsRun=null,pause=null,revTags=new Set();
try{run=JSON.parse(localStorage.getItem("own-run")||"null")}catch(e){}
function commit(m){doc.save();rerender();toast(m)}
const ti=t=>TIERS.indexOf(t);
const todayIdx=()=>(new Date().getDay()+6)%7;
const dstr=d=>new Date(d).toLocaleDateString("de-CH",{weekday:"short",day:"numeric",month:"short"});
const gap=k=>Math.max(0,ti(S().tiers[k].goal)-ti(S().tiers[k].cur));
function minutes(k,days){const from=Date.now()-days*864e5;return S().sessions.filter(s=>s.ts>=from&&(!k||s.kit===k)).reduce((a,s)=>a+s.min,0)}
function weakest(){return KITS.slice().sort((a,b)=>gap(b)-gap(a)||minutes(a,7)-minutes(b,7))[0]}
function streak(){const days=new Set(S().sessions.map(s=>new Date(s.ts).toDateString()));let n=0,d=new Date();if(!days.has(d.toDateString()))d.setDate(d.getDate()-1);while(days.has(d.toDateString())){n++;d.setDate(d.getDate()-1)}return n}
function weekBars(){const out=[];for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const e=d.getTime()+864e5;out.push({l:WD[(d.getDay()+6)%7],m:S().sessions.filter(s=>s.ts>=d.getTime()&&s.ts<e).reduce((a,s)=>a+s.min,0)})}return out}
function tilt(){const L=S().sessions.slice(-4);if(!L.length)return 0;const feel=avg(L.map(s=>s.feel||3));const w=L.reduce((a,s)=>a+(s.w||0),0),l=L.reduce((a,s)=>a+(s.l||0),0);const wr=w+l?w/(w+l):.5;return Math.max(0,Math.min(100,Math.round(((5-feel)/4*60)+((1-wr)*40))))}
const fmtT=ms=>{const s=Math.max(0,Math.floor(ms/1000));return (s>=3600?Math.floor(s/3600)+":":"")+pad(Math.floor(s/60)%60)+":"+pad(s%60)};
const hm=m=>m>=60?Math.floor(m/60)+" Std."+(m%60?" "+m%60+" Min.":""):m+" Min.";
const allDrills=k=>[...(DRILLS[k]||[]),...S().customDrills.filter(d=>d.kit===k).map(d=>[d.name,d.desc,"Eigener"])];
const todayKit=()=>{const p=S().plan[todayIdx()];return p.kit&&p.kit!=="-"?p.kit:weakest()};
const tile=(go,icon,title,desc,badge)=>`<button class="tile" data-tgo="${go}">${ico(icon)}<b>${title}</b><span>${desc}</span>${badge!==undefined&&badge!==""?`<em>${badge}</em>`:""}</button>`;

function summary(){if(!doc.loaded)return {text:"Lädt …",big:""};const p=S().plan[todayIdx()];if(run)return {text:"Session läuft · "+run.kit,big:"▶"};return {text:p.kit==="-"?"Heute Pausentag":`Heute ${p.time} · ${todayKit()}`,big:streak()?"🔥 "+streak():""}}

const TITLES={heute:"Heute",train:"Training","train/timer":"Session-Timer","train/drills":"Drill-Bibliothek","train/plan":"Wochenplan","train/warmup":"Warm-up","train/react":"Reaktionstest","train/cps":"CPS-Test",prog:"Fortschritt","prog/log":"Session-Log","prog/stats":"Statistik","prog/tiers":"Tier-Ziele","prog/tests":"Tier-Tests","prog/rivals":"Gegner-Notizen",coach:"Coach","coach/ask":"Frag den Coach","coach/review":"Fight-Review","coach/mental":"Kopf & Tilt",more:"Mehr","more/loadouts":"Hotbar-Layouts","more/servers":"Server","more/settings":"Einstellungen"};
function view(){
  if(!doc.loaded)return `<h1>Fire Trainer</h1><p class="muted"><span class="spin"></span>Lädt …</p>`;
  if(!kit)kit=weakest();
  const root=view_.split("/")[0],sub=view_.includes("/");
  const V={heute:heuteV,train:trainV,"train/timer":timerV,"train/drills":drillsV,"train/plan":planV,"train/warmup":warmV,"train/react":reactV,"train/cps":cpsV,prog:progV,"prog/log":logV,"prog/stats":statsV,"prog/tiers":tiersV,"prog/tests":testsV,"prog/rivals":rivalsV,coach:coachV,"coach/ask":askV,"coach/review":reviewV,"coach/mental":mentalV,more:moreV,"more/loadouts":loadV,"more/servers":serversV,"more/settings":setV}[view_]||heuteV;
  return `<div class="top"><h1>${sub?TITLES[view_]:"Fire Trainer"}</h1><span class="pill num">${esc(S().ign)}</span></div>`+
    (sub?`<button class="back" data-tgo="${root}">‹ ${TITLES[root]}</button>`:seg([["heute","Heute"],["train","Training"],["prog","Fortschritt"],["coach","Coach"],["more","Mehr"]],root,"tgo"))+V();
}
function heuteV(){
  const p=S().plan[todayIdx()],pk=todayKit(),wk=minutes(null,7),goal=S().weeklyGoalMin||0,t=tilt();
  const nt=S().nextTest?Math.round((new Date(S().nextTest.date+"T00:00")-new Date(dkey(new Date())+"T00:00"))/864e5):null;
  return `<section class="hero ${run?"running":""}"><div class="top"><span class="pill">${run?"Läuft · "+esc(run.kit):p.kit==="-"?"Heute Pausentag":"Heute "+esc(p.time)+" · "+esc(pk)}</span><span class="note">${p.kit==="-"?"Erholung zählt auch":hm(p.min)+" geplant"}</span></div>
    <div class="timer num" id="tm">${run?fmtT(Date.now()-run.start):"00:00"}</div>
    ${run?`<button class="btn dark" data-tgo="train/timer">Zur laufenden Session</button>`:`<button class="btn" id="qstart">Training starten · ${esc(pk)}</button>`}</section>
  ${t>=60?`<div class="alert"><b>Tilt-Warnung:</b> Die letzten Sessions liefen zäh. Lockeres Warm-up und nach 3 Losses am Stück aufhören. <button class="btn small ghost" data-tgo="coach/mental">Tipps</button></div>`:""}
  ${nt!==null&&nt>=0?`<div class="ok"><b>${nt===0?"Heute":"In "+nt+" Tagen"}: Tier-Test ${esc(S().nextTest.kit)}</b> · Ziel ${esc(S().tiers[S().nextTest.kit]?.goal||"")}. <button class="btn small ghost" data-tgo="train/warmup">Warm-up</button></div>`:""}
  <div class="stats"><div class="stat"><b>${streak()}</b><span>Tage Streak</span></div><div class="stat"><b>${Math.round(wk/6)/10}</b><span>Std. diese Woche</span></div><div class="stat"><b>${goal?Math.min(999,Math.round(wk/goal*100)):0}%</b><span>vom Wochenziel</span></div></div>
  <section class="card"><h2>Fokus heute</h2><p>Am weitesten vom Ziel: <b>${esc(weakest())}</b> (${gap(weakest())} Stufen bis ${esc(S().tiers[weakest()].goal)}).</p>
    <div class="lib">${allDrills(pk).filter(d=>(S().drillStatus[d[0]]||0)<2).slice(0,2).map(d=>`<div class="libitem"><span class="lvl">${esc(pk)} · ${esc(d[2])}</span><b>${esc(d[0])}</b><span class="note">${esc(d[1])}</span></div>`).join("")||`<p class="note">Alle Drills für ${esc(pk)} sitzen. Stark!</p>`}</div></section>
  <section class="card"><h2>Letzte 7 Tage</h2><div class="bars">${(()=>{const b=weekBars(),mx=Math.max(60,...b.map(x=>x.m));return b.map(x=>`<div><i style="height:${x.m/mx*100}%"></i><span>${x.l}</span></div>`).join("")})()}</div></section>`;
}
function trainV(){
  const r=S().reaction.length?Math.min(...S().reaction):null,c=S().cps.length?Math.max(...S().cps):null;
  return `<div class="tiles">${tile("train/timer","timer","Session-Timer","Training starten, Drills wählen, Ergebnis speichern",run?"läuft":"")}${tile("train/drills","book","Drill-Bibliothek","Alle Techniken pro Kit mit Lernstand",Object.values(S().drillStatus).filter(x=>x===2).length+" sitzen")}
  ${tile("train/plan","cal","Wochenplan","Wann du welches Kit trainierst","")}${tile("train/warmup","flame","Warm-up","Geführte Routinen mit Countdown","")}
  ${tile("train/react","bolt","Reaktionstest","Wie schnell reagierst du?",r?r+" ms":"")}${tile("train/cps","mouse","CPS-Test","Klicks pro Sekunde messen",c?c.toFixed(1)+" CPS":"")}</div>`;
}
function timerV(){
  const sel=run?run.kit:kit;
  const list=allDrills(sel).map(([n,d])=>`<button class="drill" data-drill="${esc(n)}" aria-pressed="${(run?run.drills:[...drills]).includes(n)}"><span class="box"></span><span><b>${esc(n)}</b><span>${esc(d)}</span></span></button>`).join("");
  return `<section class="hero ${run?"running":""}"><div class="top"><span class="pill">${run?"Läuft · "+esc(run.kit):"Bereit"}</span><span class="note">Fokus-Tipp: ${esc(weakest())}</span></div>
    <div class="timer num" id="tm">${run?fmtT(Date.now()-run.start):"00:00"}</div>
    ${run?`<div class="grid2"><button class="btn dark" id="stop">Beenden & speichern</button><button class="btn clear" id="cancel">Verwerfen</button></div>`:`<button class="btn" id="start">Start · ${esc(kit)}</button>`}</section>
  ${run?"":`<div class="chips">${KITS.map(k=>`<button data-kit="${k}" aria-pressed="${k===kit}">${k}</button>`).join("")}</div>`}
  <section class="card"><h2>Drills für ${esc(sel)}</h2><p class="note">Wähl aus, woran du arbeitest. Sie werden mit der Session gespeichert.</p><div class="lib">${list}</div></section>
  <button class="btn ghost" id="manual">Session nachtragen</button>`;
}
function drillsV(){
  const k=libKit||kit,L=allDrills(k);
  return `<div class="chips">${KITS.map(x=>`<button data-libkit="${x}" aria-pressed="${x===k}">${x}</button>`).join("")}</div>
  <section class="card"><div class="top"><h2>${esc(k)}</h2><span class="note">${L.filter(d=>S().drillStatus[d[0]]===2).length}/${L.length} sitzen</span></div>
  <div class="lib">${L.map(([n,d,lv])=>{const s=S().drillStatus[n]||0;return `<div class="libitem"><span class="lvl">${esc(lv)}</span><b>${esc(n)}</b><span class="note">${esc(d)}</span><div class="seg3">${["Neu","Lerne ich","Sitzt"].map((t,i)=>`<button class="s${i}" data-ds="${esc(n)}" data-v="${i}" aria-pressed="${s===i}">${t}</button>`).join("")}</div></div>`}).join("")}</div></section>
  <section class="card"><h2>Eigenen Drill hinzufügen</h2><label>Name<input id="cd-n" placeholder="z.B. Rod-Reset"></label><label>Beschreibung<input id="cd-d" placeholder="Was übst du genau?"></label><button class="btn" id="cd-add">Zu ${esc(k)} hinzufügen</button></section>`;
}
function planV(){
  const t=todayIdx(),pl=S().plan.reduce((a,p)=>a+(p.kit==="-"?0:p.min),0),done=minutes(null,t+1);
  return `<section class="card"><h2>Deine Woche</h2><p class="note">Zeit, Kit und Dauer pro Tag. «Auto» = das Kit, das am weitesten vom Ziel ist.</p>
  <div class="plan">${S().plan.map((p,i)=>`<div class="pday ${i===t?"today":""}"><b>${WD[i]}</b><input type="time" data-pt="${i}" value="${esc(p.time)}" aria-label="${WD[i]} Zeit"><select data-pk="${i}" aria-label="${WD[i]} Kit"><option value="">Auto</option><option value="-" ${p.kit==="-"?"selected":""}>Pause</option>${KITS.map(k=>`<option ${p.kit===k?"selected":""}>${k}</option>`).join("")}</select><select data-pm="${i}" aria-label="${WD[i]} Dauer">${[30,60,90,120,150,180].map(m=>`<option value="${m}" ${p.min===m?"selected":""}>${m<60?m+" Min":m/60+" h"}</option>`).join("")}</select></div>`).join("")}</div>
  <button class="btn" id="autoplan">Plan automatisch erstellen</button><p class="note">Kits mit der grössten Lücke zum Ziel kommen öfter dran, Donnerstag ist Pause.</p></section>
  <section class="card"><h2>Diese Woche</h2><p>Geplant <b class="num">${hm(pl)}</b> · bisher <b class="num">${hm(done)}</b></p><div class="hbar"><span>Stand</span><div class="b"><i style="width:${pl?Math.min(100,done/pl*100):0}%"></i></div><span class="num">${pl?Math.round(done/pl*100):0}%</span></div></section>`;
}
function warmV(){
  if(warm){const steps=WARMUPS[warm.name],c=steps[warm.i];return `<section class="hero running"><span class="pill">${esc(warm.name)} · Schritt ${warm.i+1}/${steps.length}</span><h2>${esc(c[0])}</h2><div class="timer num" id="wt">${fmtT(warm.end-Date.now())}</div>
    <div class="grid2"><button class="btn" id="wnext">Weiter</button><button class="btn dark" id="wstop">Abbrechen</button></div></section>
    <section class="card">${steps.map((s,i)=>`<div class="step ${i===warm.i?"now":i<warm.i?"done":""}"><span class="n">${i+1}</span><span>${esc(s[0])}</span><span class="note num">${s[1]} Min.</span></div>`).join("")}</section>`}
  return Object.entries(WARMUPS).map(([n,steps])=>`<section class="card"><div class="top"><h2>${esc(n)}</h2><button class="btn small" data-warm="${esc(n)}">Starten</button></div>${steps.map((s,i)=>`<div class="step"><span class="n">${i+1}</span><span>${esc(s[0])}</span><span class="note num">${s[1]} Min.</span></div>`).join("")}</section>`).join("");
}
function warmNext(){const steps=WARMUPS[warm.name];warm.i++;if(warm.i>=steps.length){warm=null;toast("Warm-up fertig – los geht's! 🔥");render();return}warm.end=Date.now()+steps[warm.i][1]*60000;try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}render()}
function reactV(){
  const L=S().reaction,best=L.length?Math.min(...L):null,a=L.length?Math.round(avg(L.slice(-10))):null;
  const msg={idle:"Tippen zum Starten",wait:"Warte auf Grün …",go:"JETZT!",early:"Zu früh! Tippen für neuen Versuch",done:react.ms+" ms<br><small>Tippen für nochmal</small>"}[react.st];
  return `<button class="react ${react.st==="early"?"wait":react.st}" id="rx">${msg}</button>
  <div class="stats"><div class="stat"><b>${best??"–"}</b><span>Bestzeit ms</span></div><div class="stat"><b>${a??"–"}</b><span>Schnitt (10)</span></div><div class="stat"><b>${L.length}</b><span>Versuche</span></div></div>
  <p class="note">Mit dem Finger gemessen, nicht mit der Maus – gut zum Vergleichen von Tag zu Tag. Unter 250 ms ist ein guter Wert.</p>
  ${L.length>2?`<section class="card"><h2>Verlauf</h2><div class="bars">${L.slice(-14).map(v=>`<div><i style="height:${Math.max(5,Math.min(100,(500-v)/3))}%"></i><span>${v}</span></div>`).join("")}</div><p class="note">Höherer Balken = schneller.</p></section>`:""}`;
}
function cpsV(){
  const L=S().cps,best=L.length?Math.max(...L):null,running=cpsRun&&cpsRun.end>Date.now();
  return `<button class="react ${running?"go":cpsRun&&cpsRun.result!=null?"done":"idle"}" id="cx">${running?`<span id="cc">${cpsRun.n}</span>`:cpsRun&&cpsRun.result!=null?`${cpsRun.result.toFixed(1)} CPS<br><small>Tippen für nochmal</small>`:"Tippe so schnell du kannst – 10 Sekunden"}</button>
  <div class="stats"><div class="stat"><b>${best?best.toFixed(1):"–"}</b><span>Rekord CPS</span></div><div class="stat"><b>${L.length?avg(L.slice(-10)).toFixed(1):"–"}</b><span>Schnitt</span></div><div class="stat"><b>${L.length}</b><span>Tests</span></div></div>
  <p class="note">Gemessen mit Tippen – am PC mit der Maus sind die Werte anders.</p>`;
}
function progV(){
  const w=S().sessions.reduce((a,s)=>a+(s.w||0),0),l=S().sessions.reduce((a,s)=>a+(s.l||0),0);
  return `<div class="tiles">${tile("prog/log","list","Session-Log","Alle Trainings mit Wins, Losses und Notizen",S().sessions.length+" Sessions")}${tile("prog/stats","chart","Statistik","Winrate, Stunden und Trends pro Kit",w+l?Math.round(w/(w+l)*100)+"% Winrate":"")}
  ${tile("prog/tiers","ladder","Tier-Ziele","Dein Weg zu HT3 und LT3","")}${tile("prog/tests","flag","Tier-Tests","Ergebnisse und nächster Test",S().nextTest?"Test geplant":"")}${tile("prog/rivals","users","Gegner-Notizen","Wie spielen deine häufigsten Gegner?",S().rivals.length||"")}</div>`;
}
function logV(){
  const s=S().sessions.slice().sort((a,b)=>b.ts-a.ts);
  return `<section class="card">${s.length?s.map(x=>`<div class="item"><div class="t">${esc(x.kit)} · ${hm(x.min)}</div><div class="wl"><span class="w">${x.w||0}W</span> <span class="l">${x.l||0}L</span> ${["","😖","😕","😐","🙂","🔥"][x.feel||0]} <button class="x" data-sdel="${x.id}" aria-label="Session löschen">×</button></div>
    <div class="s">${new Date(x.ts).toLocaleString("de-CH",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}${x.server?" · "+esc(x.server):""}${x.drills&&x.drills.length?" · "+x.drills.map(esc).join(", "):""}${x.note?"<br>"+esc(x.note):""}</div></div>`).join(""):`<p class="muted">Noch keine Sessions. Starte unter Training → Session-Timer.</p>`}</section>`;
}
function statsV(){
  const per=KITS.map(k=>{const L=S().sessions.filter(x=>x.kit===k),w=L.reduce((a,x)=>a+(x.w||0),0),l=L.reduce((a,x)=>a+(x.l||0),0);return {k,w,l,m30:minutes(k,30)}});
  const mx=Math.max(60,...per.map(p=>p.m30)),feel=S().sessions.slice(-10).map(s=>s.feel||3),tot=S().sessions.reduce((a,s)=>a+s.min,0);
  const c={};S().reviews.forEach(r=>(r.tags||[]).forEach(t=>c[t]=(c[t]||0)+1));const cm=Math.max(1,...Object.values(c));
  return `<div class="stats"><div class="stat"><b>${Math.round(tot/6)/10}</b><span>Std. total</span></div><div class="stat"><b>${S().sessions.length}</b><span>Sessions</span></div><div class="stat"><b>${feel.length?avg(feel).toFixed(1):"–"}</b><span>Gefühl Ø (1–5)</span></div></div>
  <section class="card"><h2>Trainingszeit letzte 30 Tage</h2>${per.map(p=>`<div class="hbar"><span>${p.k}</span><div class="b"><i style="width:${p.m30/mx*100}%"></i></div><span class="num">${hm(p.m30)}</span></div>`).join("")}</section>
  <section class="card"><h2>Winrate pro Kit</h2>${per.map(p=>{const t=p.w+p.l;return `<div class="hbar"><span>${p.k}</span><div class="b"><i class="win" style="width:${t?p.w/t*100:0}%"></i></div><span class="num">${t?Math.round(p.w/t*100)+"%":"–"} <span class="note">(${p.w}/${p.l})</span></span></div>`}).join("")}</section>
  ${Object.keys(c).length?`<section class="card"><h2>Häufigste Fehler</h2>${Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t,n])=>`<div class="hbar"><span style="font-size:12px">${esc(t)}</span><div class="b"><i class="loss" style="width:${n/cm*100}%"></i></div><span class="num">${n}×</span></div>`).join("")}</section>`:""}`;
}
const tierOpts=sel=>TIERS.map(t=>`<option ${t===sel?"selected":""}>${t}</option>`).join("");
function tiersV(){
  return `<section class="card"><h2>Weg zum Ziel</h2><div class="ladder">${KITS.map(k=>{const t=S().tiers[k],c=ti(t.cur),g=ti(t.goal);return `<div class="rung"><span class="k">${k}</span><div class="track" aria-label="${k}: ${t.cur}, Ziel ${t.goal}">${TIERS.map((_,i)=>`<i class="${i<=c?"on":""} ${i===g?"goal":""}"></i>`).join("")}</div><span class="tier">${t.cur} <small>→ ${t.goal}</small></span></div>`}).join("")}</div>
    <p class="note">Farbig = aktueller Stand, grüner Rahmen = Ziel. Skala von LT5 (links) bis HT1 (rechts).</p></section>
  <section class="card"><h2>Stand anpassen</h2>${KITS.map(k=>`<div class="grid2"><label>${k} jetzt<select data-cur="${k}">${tierOpts(S().tiers[k].cur)}</select></label><label>${k} Ziel<select data-goal="${k}">${tierOpts(S().tiers[k].goal)}</select></label></div>`).join("")}</section>`;
}
function testsV(){
  return `<section class="card"><h2>Nächster Test</h2>${S().nextTest?`<p><b>${esc(S().nextTest.kit)}</b> am ${dstr(S().nextTest.date+"T12:00")} <button class="btn small ghost" id="nt-clear">Entfernen</button></p>`:""}
    <div class="grid2"><label>Kit<select id="nt-kit">${KITS.map(k=>`<option>${k}</option>`).join("")}</select></label><label>Datum<input type="date" id="nt-date"></label></div><button class="btn ghost" id="nt-save">Test planen</button></section>
  <section class="card"><h2>Ergebnis eintragen</h2><div class="grid2"><label>Kit<select id="t-kit">${KITS.map(k=>`<option>${k}</option>`).join("")}</select></label><label>Ergebnis<select id="t-tier">${tierOpts("LT3")}</select></label></div>
    <label>Notiz<input id="t-note" placeholder="Tester, Server, was gut lief"></label><button class="btn" id="t-add">Ergebnis speichern</button></section>
  <section class="card"><h2>Bisherige Tests</h2>${S().tests.length?S().tests.slice().reverse().map(t=>`<div class="item"><div class="t">${esc(t.kit)} → ${esc(t.tier)}</div><div class="note">${new Date(t.ts).toLocaleDateString("de-CH")}</div>${t.note?`<div class="s">${esc(t.note)}</div>`:""}</div>`).join(""):`<p class="muted">Noch keine Tests eingetragen.</p>`}</section>`;
}
function rivalsV(){
  return `<section class="card"><h2>Neuer Gegner</h2><div class="grid2"><label>IGN<input id="rv-n" placeholder="Spielername"></label><label>Kit<select id="rv-k">${KITS.map(k=>`<option>${k}</option>`).join("")}</select></label></div><label>Wie spielt er?<input id="rv-note" placeholder="z.B. spammt, jumpt viel, schwach im Bogen"></label><button class="btn" id="rv-add">Speichern</button></section>
  ${S().rivals.map(r=>`<section class="card"><div class="top"><h3>${esc(r.name)} <span class="note">· ${esc(r.kit)}</span></h3><button class="x" data-rvdel="${r.id}" aria-label="Löschen">×</button></div>
    <div class="grid2"><div><span class="note">Gewonnen</span><div class="stepper"><button data-rv="${r.id}" data-f="w" data-d="-1">−</button><b class="w">${r.w}</b><button data-rv="${r.id}" data-f="w" data-d="1">+</button></div></div><div><span class="note">Verloren</span><div class="stepper"><button data-rv="${r.id}" data-f="l" data-d="-1">−</button><b class="l">${r.l}</b><button data-rv="${r.id}" data-f="l" data-d="1">+</button></div></div></div>
    ${r.note?`<p class="note">${esc(r.note)}</p>`:""}</section>`).join("")}`;
}
function coachV(){return `<div class="tiles">${tile("coach/ask","chat","Frag den Coach","Claude analysiert deine Sessions und gibt Tipps","")}${tile("coach/review","eye","Fight-Review","Verlorene Fights auswerten",S().reviews.length?S().reviews.length+" Reviews":"")}${tile("coach/mental","brain","Kopf & Tilt","Tilt-Meter, Pausen, Test-Checkliste",tilt()+"% Tilt")}</div>`}
function askV(){
  return `<section class="card"><p class="note">Claude sieht deine letzten Sessions, Fight-Reviews, deinen Plan und deine Tier-Ziele.</p>
    <div class="chips">${["Plan für nächste Woche","Was mache ich falsch?","Wie komme ich in Sword auf LT3?","Wie werde ich HT3 in Mace?","Analysiere meine Fehler"].map(q=>`<button data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
    <form class="row" id="cf"><input id="cq" placeholder="Eigene Frage …" aria-label="Frage an den Coach"><button class="btn" type="submit">Fragen</button></form></section>
  ${coachBusy||coachText?`<section class="card"><div class="coach" id="ct">${coachBusy&&!coachText?"Coach denkt nach …":esc(coachText)}</div></section>`:""}
  ${!App.sample?`<p class="note">Der Coach funktioniert nur über deinen Claude-Link.</p>`:""}`;
}
function reviewV(){
  return `<section class="card"><h2>Fight auswerten</h2><div class="grid2"><label>Kit<select id="rw-k">${KITS.map(k=>`<option ${k===kit?"selected":""}>${k}</option>`).join("")}</select></label><label>Gegner<input id="rw-o" placeholder="optional"></label></div>
    <span class="note">Woran lag's?</span><div class="chips">${MISTAKES.map(m=>`<button data-tag="${esc(m)}" aria-pressed="${revTags.has(m)}">${esc(m)}</button>`).join("")}</div>
    <label>Was ist passiert?<textarea id="rw-what" rows="2" placeholder="z.B. Combo nicht gebrochen, zu früh gepottet"></textarea></label>
    <label>Was mache ich nächstes Mal anders?<input id="rw-l" placeholder="Die Lektion in einem Satz"></label><button class="btn" id="rw-add">Review speichern</button></section>
  ${S().reviews.slice().reverse().map(r=>`<section class="card"><div class="top"><h3>${esc(r.kit)}${r.opp?" vs "+esc(r.opp):""}</h3><span class="note">${dstr(r.ts)} <button class="x" data-rwdel="${r.id}" aria-label="Löschen">×</button></span></div>
    ${(r.tags||[]).length?`<div class="chips">${r.tags.map(t=>`<span class="lvl" style="color:var(--bad)">${esc(t)}</span>`).join(" ")}</div>`:""}${r.what?`<p class="note">${esc(r.what)}</p>`:""}${r.lesson?`<p><b>Lektion:</b> ${esc(r.lesson)}</p>`:""}</section>`).join("")}`;
}
function mentalV(){
  const t=tilt(),done=S().prep[new Date().toDateString()]||[];
  return `<section class="card"><h2>Tilt-Meter</h2><div class="meter"><i style="left:${t}%"></i></div>
    <p>${t<35?"Du bist im grünen Bereich. Gute Zeit für ernste Fights oder einen Test.":t<60?"Leicht angespannt. Plan kurze Pausen ein.":"Du bist tilted. Heute lieber Drills und lockere Fights statt Tests."}</p><p class="note">Aus Gefühl und Winrate deiner letzten 4 Sessions.</p></section>
  <section class="card"><h2>Pause nach Losses</h2><p class="note">Regel: Nach 3 Losses am Stück 5 Minuten weg vom Bildschirm.</p>
    ${pause?`<div class="timer num" id="pt" style="font-size:40px">${fmtT(pause.end-Date.now())}</div><button class="btn ghost" id="pstop">Pause beenden</button>`:`<button class="btn" id="pstart">5-Minuten-Pause starten</button>`}</section>
  <section class="card"><h2>Checkliste vor Tests</h2><div>${PREP.map(p=>`<button class="check" data-prep="${esc(p)}" aria-pressed="${done.includes(p)}"><span class="box"></span>${esc(p)}</button>`).join("")}</div>
    <p class="note">${done.length===PREP.length?"Alles erledigt – du bist bereit! 🔥":done.length+" von "+PREP.length+" erledigt"}</p></section>`;
}
function moreV(){return `<div class="tiles">${tile("more/loadouts","grid","Hotbar-Layouts","Dein Inventar-Setup pro Kit","")}${tile("more/servers","server","Server","Wo du am meisten spielst","")}${tile("more/settings","gear","Einstellungen","IGN, Wochenziel, Daten","")}</div>`}
function loadV(){
  const k=libKit||kit,L=S().loadouts[k]||Array(10).fill("");
  return `<div class="chips">${KITS.map(x=>`<button data-libkit="${x}" aria-pressed="${x===k}">${x}</button>`).join("")}</div>
  <section class="card"><h2>Hotbar ${esc(k)}</h2><div class="slots">${L.slice(0,9).map((v,i)=>`<input data-slot="${i}" value="${esc(v)}" placeholder="${i+1}" aria-label="Slot ${i+1}">`).join("")}</div>
  <label>Offhand<input data-slot="9" value="${esc(L[9]||"")}" placeholder="z.B. Totem, Schild"></label><p class="note">Kurz eintragen, z.B. «Mace», «WC», «Perle». Speichert automatisch.</p></section>`;
}
function serversV(){
  const c={};S().sessions.forEach(s=>{if(s.server)c[s.server]=(c[s.server]||0)+s.min});
  return `<section class="card"><h2>Deine Server</h2><div class="list">${S().servers.map((s,i)=>`<div class="item"><div class="t num">${esc(s)}</div><div class="note">${c[s]?hm(c[s]):"–"} <button class="x" data-svdel="${i}" aria-label="Entfernen">×</button></div></div>`).join("")}</div>
    <div class="row"><input id="sv-n" placeholder="Server-IP"><button class="btn" id="sv-add">+</button></div></section>`;
}
function setV(){
  return `<section class="card"><div class="grid2"><label>IGN<input id="s-ign" value="${esc(S().ign)}"></label><label>Wochenziel (Std.)<input id="s-wk" type="number" inputmode="decimal" value="${(S().weeklyGoalMin||0)/60}"></label></div>
    <p class="note">${App.cloud?"Privat in deinem Claude-Konto gespeichert.":"Nur in diesem Browser gespeichert."}</p></section>
  <section class="card"><h2>Daten</h2><button class="btn danger" id="reset">Alle Trainingsdaten löschen</button><div id="rc"></div></section>`;
}

function persistRun(){try{run?localStorage.setItem("own-run",JSON.stringify(run)):localStorage.removeItem("own-run")}catch(e){}}
function startRun(){run={start:Date.now(),kit,drills:[...drills]};persistRun()}
function tgo(v){view_=v;render();scrollTo(0,0)}
function bind(){
  if(!doc.loaded)return;
  const s=S(),on=(q,f)=>{const e=$(q);if(e)e.onclick=f},ch=(q,f)=>{const e=$(q);if(e)e.onchange=f};
  $$("[data-tgo]").forEach(b=>b.onclick=()=>tgo(b.dataset.tgo));
  on("#qstart",()=>{kit=todayKit();startRun();tgo("train/timer")});
  $$("[data-kit]").forEach(b=>b.onclick=()=>{kit=b.dataset.kit;drills.clear();render()});
  $$("[data-drill]").forEach(b=>b.onclick=()=>{const n=b.dataset.drill,set=run?new Set(run.drills):drills;set.has(n)?set.delete(n):set.add(n);if(run){run.drills=[...set];persistRun()}render()});
  on("#start",()=>{startRun();render()});
  on("#stop",()=>openFinish(Math.max(1,Math.round((Date.now()-run.start)/60000)),run.kit,run.drills));
  on("#cancel",()=>{run=null;persistRun();render();toast("Session verworfen")});
  on("#manual",()=>openFinish(60,kit,[...drills],true));
  $$("[data-libkit]").forEach(b=>b.onclick=()=>{libKit=b.dataset.libkit;render()});
  $$("[data-ds]").forEach(b=>b.onclick=()=>{s.drillStatus[b.dataset.ds]=+b.dataset.v;commit(+b.dataset.v===2?"Sitzt! 💪":"")});
  on("#cd-add",()=>{const n=$("#cd-n").value.trim();if(!n){toast("Name eingeben");return}s.customDrills.push({name:n,desc:$("#cd-d").value.trim(),kit:libKit||kit});commit("Drill hinzugefügt")});
  $$("[data-pt]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pt].time=i.value;commit()});
  $$("[data-pk]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pk].kit=i.value;commit()});
  $$("[data-pm]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pm].min=+i.value;commit()});
  on("#autoplan",()=>{const order=KITS.slice().sort((a,b)=>gap(b)-gap(a)),pool=[];order.forEach((k,i)=>{const w=Math.max(1,gap(k)+(i<2?1:0));for(let j=0;j<w;j++)pool.push(k)});let pi=0;s.plan=s.plan.map((p,i)=>i===3?{...p,kit:"-"}:{...p,kit:pool[(pi++)%pool.length]});commit("Plan erstellt")});
  $$("[data-warm]").forEach(b=>b.onclick=()=>{const n=b.dataset.warm;warm={name:n,i:0,end:Date.now()+WARMUPS[n][0][1]*60000};render()});
  on("#wnext",warmNext);on("#wstop",()=>{warm=null;render()});
  const rx=$("#rx");if(rx)rx.onpointerdown=reactTap;
  const cx=$("#cx");if(cx)cx.onpointerdown=cpsTap;
  $$("[data-sdel]").forEach(b=>b.onclick=()=>{s.sessions=s.sessions.filter(x=>x.id!==b.dataset.sdel);commit("Gelöscht")});
  $$("[data-cur]").forEach(x=>x.onchange=()=>{s.tiers[x.dataset.cur].cur=x.value;commit("Gespeichert")});
  $$("[data-goal]").forEach(x=>x.onchange=()=>{s.tiers[x.dataset.goal].goal=x.value;commit("Gespeichert")});
  on("#nt-save",()=>{const d=$("#nt-date").value;if(!d){toast("Datum wählen");return}s.nextTest={kit:$("#nt-kit").value,date:d};commit("Test geplant")});
  on("#nt-clear",()=>{s.nextTest=null;commit()});
  on("#t-add",()=>{const k=$("#t-kit").value,t=$("#t-tier").value;s.tests.push({id:uid(),ts:Date.now(),kit:k,tier:t,note:$("#t-note").value.trim()});s.tiers[k].cur=t;if(s.nextTest&&s.nextTest.kit===k)s.nextTest=null;commit(ti(t)>=ti(s.tiers[k].goal)?"Ziel erreicht! 🔥":"Test gespeichert")});
  on("#rv-add",()=>{const n=$("#rv-n").value.trim();if(!n){toast("IGN eingeben");return}s.rivals.push({id:uid(),name:n,kit:$("#rv-k").value,note:$("#rv-note").value.trim(),w:0,l:0});commit("Gegner gespeichert")});
  $$("[data-rv]").forEach(b=>b.onclick=()=>{const r=s.rivals.find(x=>x.id===b.dataset.rv);r[b.dataset.f]=Math.max(0,r[b.dataset.f]+ +b.dataset.d);commit()});
  $$("[data-rvdel]").forEach(b=>b.onclick=()=>{s.rivals=s.rivals.filter(r=>r.id!==b.dataset.rvdel);commit()});
  $$("[data-q]").forEach(b=>b.onclick=()=>askCoach(b.dataset.q));
  const cf=$("#cf");if(cf)cf.onsubmit=e=>{e.preventDefault();const q=$("#cq").value.trim();if(q)askCoach(q)};
  $$("[data-tag]").forEach(b=>b.onclick=()=>{const t=b.dataset.tag;revTags.has(t)?revTags.delete(t):revTags.add(t);b.setAttribute("aria-pressed",revTags.has(t))});
  on("#rw-add",()=>{s.reviews.push({id:uid(),ts:Date.now(),kit:$("#rw-k").value,opp:$("#rw-o").value.trim(),tags:[...revTags],what:$("#rw-what").value.trim(),lesson:$("#rw-l").value.trim()});revTags.clear();commit("Review gespeichert")});
  $$("[data-rwdel]").forEach(b=>b.onclick=()=>{s.reviews=s.reviews.filter(r=>r.id!==b.dataset.rwdel);commit()});
  on("#pstart",()=>{pause={end:Date.now()+300000};render()});on("#pstop",()=>{pause=null;render()});
  $$("[data-prep]").forEach(b=>b.onclick=()=>{const k=new Date().toDateString(),p=b.dataset.prep,L=new Set(s.prep[k]||[]);L.has(p)?L.delete(p):L.add(p);s.prep={[k]:[...L]};commit()});
  $$("[data-slot]").forEach(i=>i.onchange=()=>{const k=libKit||kit,L=(s.loadouts[k]||Array(10).fill("")).slice();L[+i.dataset.slot]=i.value.trim();s.loadouts[k]=L;commit("Gespeichert")});
  on("#sv-add",()=>{const n=$("#sv-n").value.trim();if(n){s.servers.push(n);commit()}});
  $$("[data-svdel]").forEach(b=>b.onclick=()=>{s.servers.splice(+b.dataset.svdel,1);commit()});
  ch("#s-ign",e=>{s.ign=e.target.value.trim()||"FireTino";commit()});
  ch("#s-wk",e=>{s.weeklyGoalMin=Math.round((+e.target.value||0)*60);commit()});
  on("#reset",()=>{$("#rc").innerHTML=`<div class="inline"><span class="note">Wirklich alles löschen?</span><button class="btn small" id="ry">Ja, löschen</button><button class="btn small ghost" id="rn">Abbrechen</button></div>`;$("#ry").onclick=()=>{doc.S=upgrade(blank());commit("Zurückgesetzt")};$("#rn").onclick=()=>$("#rc").innerHTML=""});
}
function tick(){
  const tm=$("#tm");if(tm&&run)tm.textContent=fmtT(Date.now()-run.start);
  if(warm){const e=$("#wt");if(e)e.textContent=fmtT(warm.end-Date.now());if(warm.end<=Date.now()&&view_==="train/warmup")warmNext()}
  if(pause){const e=$("#pt");if(e)e.textContent=fmtT(pause.end-Date.now());if(pause.end<=Date.now()){pause=null;toast("Pause vorbei – weiter geht's!");if(view_==="coach/mental")render()}}
}
let rTimer=null,rStart=0;
function reactTap(e){e.preventDefault();
  if(["idle","done","early"].includes(react.st)){react={st:"wait"};render();clearTimeout(rTimer);rTimer=setTimeout(()=>{react={st:"go"};rStart=performance.now();render()},1500+Math.random()*2500);return}
  if(react.st==="wait"){clearTimeout(rTimer);react={st:"early"};render();return}
  if(react.st==="go"){const ms=Math.round(performance.now()-rStart);react={st:"done",ms};S().reaction=[...S().reaction,ms].slice(-60);commit(S().reaction.length>1&&ms<=Math.min(...S().reaction)?"Neue Bestzeit!":"")}
}
let cTimer=null;
function cpsTap(e){e.preventDefault();
  if(!cpsRun||cpsRun.end<=Date.now()){if(cpsRun&&cpsRun.result==null)return;cpsRun={n:0,end:Date.now()+10000,result:null};render();clearTimeout(cTimer);
    cTimer=setTimeout(()=>{cpsRun.result=cpsRun.n/10;S().cps=[...S().cps,cpsRun.result].slice(-60);commit(cpsRun.result>=Math.max(...S().cps)?"Neuer Rekord!":"")},10000);return}
  cpsRun.n++;const c=$("#cc");if(c)c.textContent=cpsRun.n;
}
function openFinish(min,k,dr,manual){
  let w=0,l=0,feel=4,tmp=null;
  const keep=()=>{tmp={k:$("#fk").value,m:$("#fm").value,sv:$("#fsv").value,n:$("#fn").value}};
  const restore=()=>{if(!tmp)return;$("#fk").value=tmp.k;$("#fm").value=tmp.m;$("#fsv").value=tmp.sv;$("#fn").value=tmp.n};
  const draw=()=>sheet(`<div class="top"><h2>${manual?"Session nachtragen":"Session speichern"}</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <div class="grid2"><label>Kit<select id="fk">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label><label>Minuten<input id="fm" type="number" inputmode="numeric" value="${min}"></label></div>
    <div class="grid2"><div><span class="note">Wins</span><div class="stepper"><button data-s="w-">−</button><b class="w">${w}</b><button data-s="w+">+</button></div></div><div><span class="note">Losses</span><div class="stepper"><button data-s="l-">−</button><b class="l">${l}</b><button data-s="l+">+</button></div></div></div>
    <div><span class="note">Wie lief's?</span><div class="feel">${["😖","😕","😐","🙂","🔥"].map((e,i)=>`<button data-feel="${i+1}" aria-pressed="${feel===i+1}" aria-label="Gefühl ${i+1} von 5">${e}</button>`).join("")}</div></div>
    <label>Server<select id="fsv"><option value="">–</option>${S().servers.map(s=>`<option ${s===S().lastServer?"selected":""}>${esc(s)}</option>`).join("")}</select></label>
    <label>Notiz<textarea id="fn" rows="2" placeholder="Was lief gut, was nicht?"></textarea></label><button class="btn" id="fsave">Speichern</button>`,(host,close)=>{
    host.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{keep();const v=b.dataset.s;if(v==="w+")w++;if(v==="w-")w=Math.max(0,w-1);if(v==="l+")l++;if(v==="l-")l=Math.max(0,l-1);draw();restore()});
    host.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>{keep();feel=+b.dataset.feel;draw();restore()});
    $("#fsave").onclick=()=>{const kk=$("#fk").value,mm=Math.max(1,+$("#fm").value||1),sv=$("#fsv").value;
      S().sessions.push({id:uid(),ts:manual?Date.now()-mm*60000:run.start,kit:kk,min:mm,w,l,feel,server:sv,drills:dr,note:$("#fn").value.trim()});S().lastServer=sv;
      if(!manual){run=null;persistRun()}close();drills.clear();commit("Session gespeichert 🔥");if(l>=3&&w===0)setTimeout(()=>toast("3+ Losses – gönn dir eine Pause"),2100)};
  });
  draw();
}
async function askCoach(q){
  if(!App.sample){toast("Coach nur über deinen Claude-Link");return}
  coachBusy=true;coachText="";render();
  const s=S(),recent=s.sessions.slice(-25).map(x=>({datum:dkey(x.ts),kit:x.kit,min:x.min,w:x.w,l:x.l,gefuehl:x.feel,drills:x.drills,notiz:x.note}));
  const reviews=s.reviews.slice(-15).map(r=>({kit:r.kit,fehler:r.tags,was:r.what,lektion:r.lesson}));
  const prompt=`Du bist ein Minecraft-PvP-Coach (Java 1.21, MCTiers-Modi). Antworte auf Deutsch (Schweizer Schreibweise mit ss), kurz und konkret, ohne Markdown-Überschriften, Aufzählungen mit "•".
Spieler: ${s.ign}. Wochenplan: ${JSON.stringify(s.plan.map((p,i)=>WD[i]+" "+p.time+" "+(p.kit||"auto")+" "+p.min+"min"))}
Tier-Stand und Ziele: ${JSON.stringify(s.tiers)}
Lernstand Drills: ${JSON.stringify(s.drillStatus)}
Letzte Sessions: ${JSON.stringify(recent)}
Fight-Reviews: ${JSON.stringify(reviews)}
Bester Reaktionstest: ${s.reaction.length?Math.min(...s.reaction)+" ms":"keiner"}
Frage: ${q}`;
  try{await App.sample(prompt,{modelTier:"default",cache:false,onText:({text})=>{coachText=text;const e=$("#ct");if(e)e.textContent=text;else rerender()}})}
  catch(e){coachText=e&&e.code==="not_granted"?"Der Coach braucht deine Erlaubnis, Claude zu fragen.":"Der Coach ist gerade nicht erreichbar. Versuch es gleich nochmal."}
  coachBusy=false;render();
}
register({id:"training",title:"Training",icon:"training",doc,view,bind,tick,summary});
})();
