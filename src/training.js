/* ================= Modul: Fire Trainer (Minecraft-PvP) =================
   Aufbau: oben der Modus (Kit) – alles darunter gilt für diesen Modus.
   Bereiche: Übersicht · Taktiken · Clips · Training · Mehr                    */
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
const TEMPLATES={
 Mace:[{name:"Wind-Charge-Opener",when:"Fightstart auf 5–6 Blöcke Abstand",steps:["Abstand halten, nicht direkt reinlaufen","Wind Charge unter dich werfen","Am höchsten Punkt auf Density-Mace wechseln","Smash setzen, wenn der Gegner direkt unter dir ist"],counter:"Gegner nimmt Schild hoch → in der Luft auf Axt wechseln und Schild disablen"},
       {name:"Breach gegen Netherite",when:"Gegner hat volle Rüstung und blockt Smash-Schaden",steps:["Erst normalen Hit für Knockback","Kurz Höhe aufbauen","Auf Breach-Mace wechseln","Treffer landen, dann sofort wieder Abstand"],counter:"Gegner pearlt weg → nicht hinterher, Höhe halten"}],
 Sword:[{name:"W-Tap-Combo",when:"Du landest den ersten Hit",steps:["Nach jedem Hit kurz W loslassen","Sofort wieder vorwärts","Crosshair auf Kopfhöhe halten","Nicht spammen: auf Cooldown warten"],counter:"Gegner strafed seitlich → mitstrafen, nicht geradeaus verfolgen"},
        {name:"Hit-Select-Reset",when:"Gegner hat die Combo und du nimmst Hits",steps:["Nicht zurückspammen","Seitlich ausweichen","Auf den ersten sauberen Hit warten","Mit dem Hit die Combo übernehmen"],counter:"Gegner wartet auch → Crit-Jump als Überraschung"}],
 Axe:[{name:"Disable-Punish",when:"Gegner hält den Schild hoch",steps:["Auf Axt wechseln","Schild disablen","Sofort auf Schwert","2–3 schnelle Hits, dann Abstand"],counter:"Gegner wechselt auch auf Axt → eigenen Schild nur kurz nutzen"}],
 UHC:[{name:"Rod-Opener",when:"Gegner läuft auf dich zu",steps:["Rod auswerfen, wenn er ca. 4 Blöcke weg ist","Treffer abwarten","Direkt auf Schwert und W-Tap","Combo halten"],counter:"Gegner springt über die Rod → Abstand nehmen, nochmals rodden"},
      {name:"Lava-Druck",when:"Gegner ist am Boden und kann nicht weg",steps:["Lava neben ihn setzen","Wasser bereithalten","Gegner im Feuer mit Bogen oder Rod treffen","Lava wieder aufnehmen"],counter:"Gegner löscht mit Wasser → sofort Druck mit Schwert"}],
 Pot:[{name:"Pot-Reset mit Perle",when:"Unter 4 Herzen und Gegner drückt",steps:["Perle nach hinten werfen","Beim Landen sofort 2 Pots","Strafe beim Heilen","Erst bei vollem Leben wieder rein"],counter:"Gegner pearlt hinterher → Pot werfen, bevor er landet"}],
 NethOP:[{name:"Gapple-Bait",when:"Langer Fight, beide müde",steps:["Abstand nehmen","So tun, als würdest du essen","Gegner kommt rein → sofort kontern","Erst essen, wenn er zurückweicht"],counter:"Gegner fällt nicht drauf rein → normal heilen und Rüstung checken"}],
 SMP:[{name:"Totem-Pop-Push",when:"Das Totem des Gegners ist gerade geplatzt",steps:["Sofort nachsetzen, nicht zögern","Stärkste Waffe nehmen","Gegner nicht zum Swap kommen lassen","Nach 3 Sekunden Lage neu prüfen"],counter:"Gegner hat schnellen Swap → nicht überziehen, Totem selbst bereithalten"}]
};
const WARMUPS={"Kurz (10 Min.)":[["Reaktionstest",2],["Strafe & Bewegung ohne Gegner",3],["2 lockere Duels",5]],"Normal (20 Min.)":[["Reaktionstest + CPS",3],["Bridge / Block-Clutch",4],["Aim auf Bot oder Freund",5],["3 Duels im Haupt-Kit",8]],"Vor Tier-Test (30 Min.)":[["Wasser trinken, Handy weg",1],["Reaktionstest",3],["Movement",5],["Drill im Test-Kit",8],["4 ernste Duels",10],["2 Min. Pause, durchatmen",3]]};
/* Profi-Niveau: Mace (LT3+) */
DRILLS.Mace.push(
 ["Attribute-Swap","Schwert halten, kurz vor dem Treffer auf die Mace wechseln, einen Tick danach zurück","Profi"],
 ["Stun-Slam","Axt-Disable und Smash im selben Moment, während der Schild unten ist","Profi"],
 ["Pearl-Catching","Mit Wind Charge und Perle schnell Höhe gewinnen","Profi"],
 ["Windcharge-Punching","Die Wind Charge des Gegners wegschlagen, damit sein Catch ins Leere geht","Elite"],
 ["Pearl-Stalking","Dem Gegner auf seinen Landepunkt nachpearlen und Druck halten","Elite"],
 ["Pearl-Sniping","Die Perle des Gegners in der Luft abfangen oder ablenken","Elite"],
 ["Elytra-Raketen-Dive","Mit Raketen tauchen, Chestplate-Swap, Treffer","Elite"],
 ["Catch-Konter","Catches des Gegners lesen und nicht unter ihm stehen bleiben","Elite"]);
TEMPLATES.Mace=[
 {name:"Stun-Slam",level:"Profi",when:"Gegner blockt mit Schild, während du von oben kommst",steps:["Mit Wind Charge über den Gegner","Im Fall die Axt in die Hand","Mit der Axt treffen (Schild-Disable) und im selben Moment auf die Mace wechseln","Smash landet, solange der Schild unten ist"],counter:"Gegner nimmt den Schild nicht hoch → direkt Smash oder Attribute-Swap"},
 {name:"Attribute-Swap",level:"Profi",when:"Gegner in voller Netherite, ein normaler Smash macht zu wenig",steps:["Wind Charge hoch","Im Fall das Schwert in der Hand halten","Kurz vor dem Treffer auf die Mace wechseln","Einen Tick nach dem Treffer zurück aufs Schwert"],counter:"Gegner weicht seitlich aus → nicht blind smashen, Höhe halten und neu anvisieren"},
 {name:"Pearl-Catching",level:"Profi",when:"Du brauchst schnell viel Höhe oder willst aus einer Combo raus",steps:["Springen und Wind Charge auf die Füsse","Nach oben schauen","Perle werfen","Sofort eine Wind Charge hinterher, die die Perle trifft – du landest oben"],counter:"Gegner punched deine Wind Charge weg → Perle allein werfen oder seitlich raus"},
 {name:"Pearl-Stalking",level:"Elite",when:"Gegner pearlt weg, um sich zu resetten oder zu heilen",steps:["Seine Perle mit dem Blick verfolgen","Sofort eigene Perle auf seinen Landepunkt","Beim Landen direkt Wind Charge hoch","Von oben Druck machen, bevor er heilen kann"],counter:"Gegner pearlt zurück → nicht blind nach, Höhe halten und seinen Landepunkt abwarten"},
 {name:"Pearl-Sniping",level:"Elite",when:"Gegner wirft eine Perle (Flucht oder Catch)",steps:["Flugbahn seiner Perle früh lesen","Eigene Wind Charge in die Flugbahn – die Perle wird abgelenkt","Gegner landet falsch oder gar nicht → sofort Position über ihm","Smash, solange er sich neu orientiert"],counter:"Verpasst → nicht nachjagen, Abstand halten und nächste Chance abwarten"},
 {name:"Elytra-Raketen-Dive",level:"Elite",when:"Offenes Gelände, Gegner am Boden",steps:["Elytra an, mit Raketen hoch","Mit Rakete auf den Gegner tauchen","Kurz vorher Elytra gegen Brustpanzer tauschen","Mace-Treffer, optional mit Attribute-Swap"],counter:"Gegner schaut hoch und weicht aus → vorbeifliegen und neu ansetzen statt zu crashen"},
 {name:"Catch-Konter",level:"Elite",when:"Gegner macht einen Pearl-Catch über dir",steps:["Sobald er hochgeht: nicht stehen bleiben","Seitlich raus aus seinem Landepunkt","Schild bereit, wenn er fällt","Nach seinem Versuch sofort selbst hoch"],counter:"Gegner bleibt oben und wartet → selber catchen oder Pearl-Sniping"}];
const ADV_TECH={Mace:"Attribute-Swap, Stun-Slam, Pearl-Catching, Pearl-Stalking, Pearl-Sniping, Windcharge-Punching, Elytra-Dives mit Raketen und Chestplate-Swap, Catches lesen und kontern"};
const MISTAKES=["Positionierung","Aim","Timing","Inventar","Movement","Tilt","Ping/Lag","Zu aggressiv","Zu passiv"];
const PREP=["Genug geschlafen","Gegessen & getrunken","Warm-up gemacht","Discord/Handy stumm","Maus & Settings gecheckt","Kein Stress vorher"];
const TSTAT=["Idee","Testen","Sitzt"];
const blank=()=>({v:3,ign:"FireTino",tiers:{Mace:{cur:"LT3",goal:"HT3"},Sword:{cur:"LT4",goal:"LT3"},Axe:{cur:"LT4",goal:"LT3"},UHC:{cur:"LT4",goal:"LT3"},Pot:{cur:"LT4",goal:"LT3"},NethOP:{cur:"LT4",goal:"LT3"},SMP:{cur:"LT4",goal:"LT3"}},weeklyGoalMin:900,sessions:[],tests:[]});
function upgrade(s){const d={drillStatus:{},customDrills:[],plan:WD.map((_,i)=>({time:i===5?"19:00":"22:30",kit:"",min:120})),reaction:[],cps:[],rivals:[],reviews:[],prep:{},loadouts:{},servers:["mcpvp.club","mcpvp.com","pvphq.com"],nextTest:null,mode:"",tactics:[]};for(const k in d)if(s[k]===undefined)s[k]=d[k];return s}
const doc=new PrivateDoc("pvp",upgrade);
const S=()=>{if(!doc.S&&doc.loaded)doc.S=upgrade(blank());return doc.S};

/* ---------- Clips: eigene private Sammlung (Standbilder + Analyse, kein Video) ---------- */
const clips={items:[],loaded:false,col:null,
  start(){if(App.cloud){this.col=App.db.collection("data/users/"+App.me+"/pvp/clips");this.col.onSnapshot(s=>{this.items=s.docs.map(d=>({id:d.id,...d.data()})).sort((a,b)=>b.ts-a.ts);this.loaded=true;rerender()},()=>{this.col=null;this.local()})}else this.local()},
  local(){try{this.items=JSON.parse(localStorage.getItem("own-clips")||"[]")}catch(e){this.items=[]}this.loaded=true;rerender()},
  persist(){try{localStorage.setItem("own-clips",JSON.stringify(this.items))}catch(e){toast("Speicher voll – alte Clips löschen")}rerender()},
  async put(id,data){if(this.col){try{await this.col.doc(id).set(data);return true}catch(e){toast("Clip konnte nicht gespeichert werden");return false}}this.items=[{id,...data},...this.items.filter(x=>x.id!==id)];this.persist();return true},
  async del(id){if(this.col){try{await this.col.doc(id).delete()}catch(e){}return}this.items=this.items.filter(x=>x.id!==id);this.persist()}
};

/* ---------- Zustand ---------- */
let tab="over",sub=null,drills=new Set(),run=null,coachText="",coachBusy=false,warm=null,react={st:"idle"},cpsRun=null,pause=null,revTags=new Set(),tacFilter="all",tacAI=null,clipAll=false,qaBusy=false,confirmDel=null;
try{run=JSON.parse(localStorage.getItem("own-run")||"null")}catch(e){}
function commit(m){doc.save();rerender();toast(m)}
const ti=t=>TIERS.indexOf(t);
const todayIdx=()=>(new Date().getDay()+6)%7;
const dstr=d=>new Date(d).toLocaleDateString("de-CH",{weekday:"short",day:"numeric",month:"short"});
const gap=k=>Math.max(0,ti(S().tiers[k].goal)-ti(S().tiers[k].cur));
function minutes(k,days){const from=Date.now()-days*864e5;return S().sessions.filter(s=>s.ts>=from&&(!k||s.kit===k)).reduce((a,s)=>a+s.min,0)}
function weakest(){return KITS.slice().sort((a,b)=>gap(b)-gap(a)||minutes(a,7)-minutes(b,7))[0]}
const K=()=>KITS.includes(S().mode)?S().mode:weakest();
function streak(){const days=new Set(S().sessions.map(s=>new Date(s.ts).toDateString()));let n=0,d=new Date();if(!days.has(d.toDateString()))d.setDate(d.getDate()-1);while(days.has(d.toDateString())){n++;d.setDate(d.getDate()-1)}return n}
function weekBars(){const out=[];for(let i=6;i>=0;i--){const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-i);const e=d.getTime()+864e5;out.push({l:WD[(d.getDay()+6)%7],m:S().sessions.filter(s=>s.ts>=d.getTime()&&s.ts<e).reduce((a,s)=>a+s.min,0)})}return out}
function tilt(){const L=S().sessions.slice(-4);if(!L.length)return 0;const feel=avg(L.map(s=>s.feel||3));const w=L.reduce((a,s)=>a+(s.w||0),0),l=L.reduce((a,s)=>a+(s.l||0),0);const wr=w+l?w/(w+l):.5;return Math.max(0,Math.min(100,Math.round(((5-feel)/4*60)+((1-wr)*40))))}
const fmtT=ms=>{const s=Math.max(0,Math.floor(ms/1000));return (s>=3600?Math.floor(s/3600)+":":"")+pad(Math.floor(s/60)%60)+":"+pad(s%60)};
const fmtS=sec=>Math.floor(sec/60)+":"+pad(Math.floor(sec%60))+"."+Math.floor((sec*10)%10);
const hm=m=>m>=60?Math.floor(m/60)+" Std."+(m%60?" "+m%60+" Min.":""):m+" Min.";
const ADV=k=>ti(S().tiers[k].cur)>=ti("LT3");
let showBasics=false;
const visDrills=k=>ADV(k)&&!showBasics?allDrills(k).filter(d=>d[2]!=="Basis"):allDrills(k);
const level=k=>{const t=S().tiers[k];return ADV(k)?`Der Spieler ist ${t.cur} in ${k} (Ziel ${t.goal}) und beherrscht die Grundlagen sicher (einfache Smash-Hits, Wind-Charge-Combos, Density-Timing, Breach-Swap). Schlage NICHTS Einfaches vor – nur fortgeschrittene Techniken auf ${t.goal}-Niveau und darüber${ADV_TECH[k]?", z.B. "+ADV_TECH[k]:""}.`:`Der Spieler ist ${t.cur} in ${k} (Ziel ${t.goal}).`};
const allDrills=k=>[...(DRILLS[k]||[]),...S().customDrills.filter(d=>d.kit===k).map(d=>[d.name,d.desc,"Eigener"])];
const todayKit=()=>{const p=S().plan[todayIdx()];return p.kit&&p.kit!=="-"?p.kit:weakest()};
const kitTac=k=>S().tactics.filter(t=>t.kit===k);
function tacStats(id){let ok=0,no=0;const hist=[];S().sessions.slice().sort((a,b)=>a.ts-b.ts).forEach(s=>{const v=(s.tactics||{})[id];if(v===1){ok++;hist.push(1)}else if(v===-1){no++;hist.push(-1)}});return {ok,no,n:ok+no,pct:ok+no?Math.round(ok/(ok+no)*100):null,hist:hist.slice(-8)}}
function kitWL(k){const L=S().sessions.filter(x=>x.kit===k);const w=L.reduce((a,x)=>a+(x.w||0),0),l=L.reduce((a,x)=>a+(x.l||0),0);return {w,l,n:L.length,pct:w+l?Math.round(w/(w+l)*100):null}}
const tile=(go,icon,title,desc,badge)=>`<button class="tile" data-sub="${go}">${ico(icon)}<b>${title}</b><span>${desc}</span>${badge!==undefined&&badge!==""?`<em>${badge}</em>`:""}</button>`;
const trackHTML=k=>{const t=S().tiers[k],c=ti(t.cur),g=ti(t.goal);return `<div class="track" aria-label="${k}: ${t.cur}, Ziel ${t.goal}">${TIERS.map((_,i)=>`<i class="${i<=c?"on":""} ${i===g?"goal":""}"></i>`).join("")}</div>`};

function summary(){if(!doc.loaded)return {text:"Lädt …",big:""};const p=S().plan[todayIdx()];if(run)return {text:"Session läuft · "+run.kit,big:"▶"};return {text:p.kit==="-"?"Heute Pausentag":`Heute ${p.time} · ${todayKit()}`,big:streak()?"🔥 "+streak():""}}

/* ================= Ansicht ================= */
const SUBT={"tak/new":"Neue Taktik",warm:"Warm-up","more/plan":"Wochenplan","more/tiers":"Alle Tier-Ziele","more/tests":"Tier-Tests","more/rivals":"Gegner-Notizen","more/mental":"Kopf & Tilt","more/react":"Reaktionstest","more/cps":"CPS-Test","more/loadouts":"Hotbar-Layouts","more/servers":"Server","more/stats":"Statistik","more/log":"Session-Log","more/coach":"Coach","more/review":"Fight-Review","more/settings":"Einstellungen"};
const TABS=[["over","Übersicht"],["tak","Taktiken"],["clips","Clips"],["train","Training"],["more","Mehr"]];
function view(){
  if(!doc.loaded)return `<h1>Fire Trainer</h1><p class="muted"><span class="spin"></span>Lädt …</p>`;
  const k=K();
  const kitbar=`<div class="kitbar" role="tablist" aria-label="Modus">${KITS.map(x=>{const t=S().tiers[x];return `<button data-mode="${x}" aria-pressed="${x===k}"><b>${x}${run&&run.kit===x?' <i class="live" aria-label="läuft"></i>':""}</b><span class="num">${t.cur}→${t.goal}</span></button>`}).join("")}</div>`;
  let body;
  if(sub){
    const title=sub.startsWith("tak/edit/")?"Taktik bearbeiten":sub.startsWith("tak/")&&sub!=="tak/new"?"Taktik":sub.startsWith("clip/")?"Clip-Analyse":SUBT[sub]||"";
    body=`<button class="back" data-back>‹ ${TABS.find(t=>t[0]===tab)[1]}</button><h2 class="subh">${title}</h2>`+subView(k);
  } else body=seg(TABS,tab,"ttab")+({over:overV,tak:takV,clips:clipsV,train:trainV,more:moreV}[tab])(k);
  return `<div class="top"><h1>Fire Trainer</h1><span class="pill num">${esc(S().ign)}</span></div>${kitbar}${body}`;
}
function subView(k){
  if(sub==="tak/new")return tacEditV(null,k);
  if(sub.startsWith("tak/edit/"))return tacEditV(sub.slice(9),k);
  if(sub.startsWith("tak/"))return tacDetailV(sub.slice(4));
  if(sub.startsWith("clip/"))return clipDetailV(sub.slice(5));
  return ({warm:warmV,"more/plan":planV,"more/tiers":tiersV,"more/tests":testsV,"more/rivals":rivalsV,"more/mental":mentalV,"more/react":reactV,"more/cps":cpsV,"more/loadouts":loadV,"more/servers":serversV,"more/stats":statsV,"more/log":logV,"more/coach":askV,"more/review":reviewV,"more/settings":setV}[sub]||(()=>""))(k);
}

/* ---------- Übersicht (pro Modus) ---------- */
function overV(k){
  const t=S().tiers[k],wl=kitWL(k),running=run&&run.kit===k;
  const act=kitTac(k).filter(x=>x.active);
  const lastClip=clips.items.find(c=>c.kit===k&&c.analysis);
  const open=visDrills(k).filter(d=>(S().drillStatus[d[0]]||0)<2).slice(0,2);
  const p=S().plan[todayIdx()];
  return `<section class="hero ${running?"running":""}">
    <div class="top"><span class="pill">${esc(k)} · ${t.cur} → Ziel ${t.goal}</span><span class="note">${gap(k)?gap(k)+(gap(k)===1?" Stufe":" Stufen")+" bis Ziel":"Ziel erreicht ✓"}</span></div>
    ${running?`<div class="timer num" id="tm">${fmtT(Date.now()-run.start)}</div><div class="grid2"><button class="btn dark" data-stop>Beenden & speichern</button><button class="btn clear" data-ttab2="train">Drills ansehen</button></div>`
      :`${trackHTML(k)}<button class="btn" data-start>Training starten · ${esc(k)}</button>${run?`<span class="note">Läuft gerade: ${esc(run.kit)}</span>`:""}`}
  </section>
  ${!running&&p.kit!=="-"&&todayKit()!==k?`<p class="note">Heute im Plan: ${esc(todayKit())} um ${esc(p.time)} · <button class="linkbtn" data-mode="${todayKit()}">wechseln</button></p>`:""}
  <div class="stats"><div class="stat"><b>${wl.pct??"–"}${wl.pct!=null?"%":""}</b><span>Winrate ${esc(k)}</span></div><div class="stat"><b>${Math.round(minutes(k,30)/6)/10}</b><span>Std. letzte 30 T.</span></div><div class="stat"><b>${wl.n}</b><span>Sessions</span></div></div>
  <section class="card"><div class="top"><h2>Fokus-Taktiken</h2><button class="linkbtn" data-ttab2="tak">Alle ›</button></div>
    ${act.length?`<div class="list">${act.map(x=>{const st=tacStats(x.id);return `<button class="tacrow" data-sub="tak/${x.id}"><span class="star on">★</span><span class="tn">${esc(x.name)}<small>${esc(x.when||"")}</small></span><span class="num tp">${st.pct!=null?st.pct+"%":"neu"}</span></button>`}).join("")}</div>`
      :`<p class="muted">Noch keine Fokus-Taktik für ${esc(k)}. Leg eine an und markier sie mit ★ – dann fragt dich die App nach jeder Session, ob sie geklappt hat.</p><button class="btn ghost" data-sub="tak/new">+ Taktik anlegen</button>`}</section>
  <section class="card"><div class="top"><h2>Letzte Clip-Analyse</h2><button class="linkbtn" data-ttab2="clips">Clips ›</button></div>
    ${lastClip?clipCard(lastClip):`<p class="muted">Lade einen Medal-Clip von einem ${esc(k)}-Fight hoch – Claude sagt dir, was falsch lief.</p><button class="btn ghost" data-upload>🎬 Clip hochladen</button>`}</section>
  ${open.length?`<section class="card"><div class="top"><h2>Noch üben</h2><button class="linkbtn" data-ttab2="train">Drills ›</button></div><div class="lib">${open.map(d=>`<div class="libitem"><span class="lvl">${esc(d[2])}</span><b>${esc(d[0])}</b><span class="note">${esc(d[1])}</span></div>`).join("")}</div></section>`:""}
  <section class="card"><h2>Coach fragen</h2><form class="row" id="qcf"><input id="qcq" placeholder="z.B. Wie werde ich besser in ${esc(k)}?" aria-label="Frage an den Coach"><button class="btn" type="submit">Fragen</button></form></section>`;
}

/* ---------- Taktiken ---------- */
function takV(k){
  const all=kitTac(k);
  const L=all.filter(t=>tacFilter==="all"||(tacFilter==="act"?t.active:t.status===+tacFilter));
  const used=new Set(all.map(t=>t.name));
  const tpl=(TEMPLATES[k]||[]).filter(t=>!used.has(t.name));
  return `<div class="grid2"><button class="btn" data-sub="tak/new">+ Neue Taktik</button><button class="btn ghost" id="tak-ai" ${App.sample?"":"disabled"}>✨ Coach-Vorschlag</button></div>
  ${tacAI?`<section class="card ai">${tacAI.busy?`<p><span class="spin"></span>Coach überlegt eine Taktik für ${esc(k)} …</p>`:tacAI.err?`<p class="note">${esc(tacAI.err)}</p>`:tacPreview(tacAI.t)+`<div class="grid2"><button class="btn" id="ai-take">Übernehmen</button><button class="btn ghost" id="ai-no">Verwerfen</button></div>`}</section>`:""}
  ${all.length?`<div class="chips">${[["all","Alle"],["act","★ Fokus"],["0","Idee"],["1","Testen"],["2","Sitzt"]].map(([v,l])=>`<button data-tf="${v}" aria-pressed="${tacFilter===v}">${l}</button>`).join("")}</div>`:""}
  ${L.length?`<div class="taclist">${L.map(t=>{const st=tacStats(t.id);return `<button class="tac" data-sub="tak/${t.id}"><div class="top"><b>${t.active?'<span class="star on">★</span> ':""}${esc(t.name)}</b><span class="tstat s${t.status}">${TSTAT[t.status]}</span></div>
      ${t.when?`<span class="note">Wann: ${esc(t.when)}</span>`:""}
      <div class="hbar"><span class="note">${st.n?st.ok+"/"+st.n+" geklappt":"noch nicht bewertet"}</span><div class="b"><i class="win" style="width:${st.pct||0}%"></i></div><span class="num">${st.pct!=null?st.pct+"%":""}</span></div></button>`}).join("")}</div>`
    :all.length?`<p class="note">Keine Taktik in diesem Filter.</p>`:`<div class="empty"><p class="muted">Noch keine eigenen Taktiken für ${esc(k)}. Schreib auf, was du in welcher Situation machst – oder starte mit einer Vorlage.</p></div>`}
  ${tpl.length?`<section class="card"><h2>${ADV(k)?"Profi-Vorlagen":"Vorlagen"} für ${esc(k)}</h2>${ADV(k)?`<p class="note">Startpunkte auf deinem Niveau – pass die Schritte so an, wie du es spielst.</p>`:""}${tpl.map((t,i)=>`<div class="libitem">${t.level?`<span class="lvl">${esc(t.level)}</span>`:""}<b>${esc(t.name)}</b><span class="note">Wann: ${esc(t.when)}</span><button class="btn small ghost" data-tpl="${i}">+ Übernehmen und anpassen</button></div>`).join("")}</section>`:""}
  <p class="note">So setzt du sie um: Taktik öffnen → «Jetzt üben». Nach der Session sagst du pro Fokus-Taktik, ob sie geklappt hat. Daraus entsteht die Erfolgsquote.</p>`;
}
function tacPreview(t){return `<span class="lvl">Vorschlag</span><h3>${esc(t.name)}</h3>${t.when?`<p class="note">Wann: ${esc(t.when)}</p>`:""}<ol class="steps">${(t.steps||[]).map(s=>`<li>${esc(s)}</li>`).join("")}</ol>${t.counter?`<p class="note">Wenn der Gegner kontert: ${esc(t.counter)}</p>`:""}${t.tip?`<p class="note">Tipp: ${esc(t.tip)}</p>`:""}`}
function tacDetailV(id){
  const t=S().tactics.find(x=>x.id===id);if(!t)return `<p class="muted">Diese Taktik gibt es nicht mehr.</p>`;
  const st=tacStats(id);
  return `<section class="card"><div class="top"><h2>${esc(t.name)}</h2><span class="pill">${esc(t.kit)}</span></div>
    <div class="seg3">${TSTAT.map((l,i)=>`<button class="s${i}" data-tst="${i}" aria-pressed="${t.status===i}">${l}</button>`).join("")}</div>
    <button class="btn ${t.active?"":"ghost"}" id="t-act">${t.active?"★ Im Fokus – wird nach jeder Session abgefragt":"☆ In den Fokus nehmen"}</button></section>
  ${t.when?`<section class="card"><span class="lvl">Wann</span><p>${esc(t.when)}</p></section>`:""}
  <section class="card"><span class="lvl">So geht's</span>${(t.steps||[]).length?`<ol class="steps">${t.steps.map(s=>`<li>${esc(s)}</li>`).join("")}</ol>`:`<p class="note">Noch keine Schritte.</p>`}</section>
  ${t.counter?`<section class="card"><span class="lvl">Wenn der Gegner kontert</span><p>${esc(t.counter)}</p></section>`:""}
  <section class="card"><span class="lvl">Erfolg</span>${st.n?`<p><b class="num">${st.pct}%</b> geklappt (${st.ok} von ${st.n} Sessions)</p><div class="dots">${st.hist.map(v=>`<button class="${v===1?"on":"off"}" disabled aria-label="${v===1?"geklappt":"nicht geklappt"}">${v===1?"✓":"✗"}</button>`).join("")}</div>`:`<p class="note">Noch nicht bewertet. Nimm sie in den Fokus und trainier sie.</p>`}</section>
  ${t.ai?`<section class="card ai">${t.ai.busy?`<p><span class="spin"></span>Coach verbessert die Taktik …</p>`:t.ai.err?`<p class="note">${esc(t.ai.err)}</p>`:tacPreview(t.ai.t)+`<div class="grid2"><button class="btn" id="tai-take">Übernehmen</button><button class="btn ghost" id="tai-no">Verwerfen</button></div>`}</section>`:""}
  <button class="btn" id="t-practice">▶ Jetzt üben</button>
  <div class="grid2"><button class="btn ghost" data-sub="tak/edit/${t.id}">Bearbeiten</button><button class="btn ghost" id="t-ai" ${App.sample?"":"disabled"}>✨ Coach verbessert</button></div>
  ${confirmDel===t.id?`<div class="inline"><span class="note">Taktik wirklich löschen?</span><button class="btn small" id="t-delyes">Ja, löschen</button><button class="btn small ghost" id="t-delno">Abbrechen</button></div>`:`<button class="btn danger" id="t-del">Taktik löschen</button>`}`;
}
let tplDraft=null;
function tacEditV(id,k){
  const t=id?S().tactics.find(x=>x.id===id):(tplDraft||{name:"",when:"",steps:[],counter:"",kit:k});
  if(!t)return `<p class="muted">Diese Taktik gibt es nicht mehr.</p>`;
  return `<section class="card">
    <label>Name<input id="te-name" value="${esc(t.name)}" placeholder="z.B. Rod-Opener"></label>
    <label>Modus<select id="te-kit">${KITS.map(x=>`<option ${x===(t.kit||k)?"selected":""}>${x}</option>`).join("")}</select></label>
    <label>Wann setze ich sie ein?<textarea id="te-when" rows="2" placeholder="z.B. Wenn der Gegner direkt auf mich zuläuft">${esc(t.when)}</textarea></label>
    <label>Schritte (eine Zeile pro Schritt)<textarea id="te-steps" rows="5" placeholder="Rod werfen&#10;Auf Schwert wechseln&#10;W-Tap">${esc((t.steps||[]).join("\n"))}</textarea></label>
    <label>Wenn der Gegner kontert …<textarea id="te-counter" rows="2" placeholder="Was mache ich dann?">${esc(t.counter||"")}</textarea></label>
    <button class="btn" id="te-save">Speichern</button></section>`;
}

/* ---------- Clips ---------- */
function clipCard(c){
  const a=c.analysis||{},f=(a.fehler||[])[0];
  return `<button class="clip" data-sub="clip/${c.id}">${c.frames&&c.frames[0]?`<img src="${c.frames[Math.min(c.frames.length-1,Math.floor(c.frames.length/2))].img}" alt="">`:`<span class="noimg">🎬</span>`}
    <span class="cbody"><b>${esc(c.title)}</b><span class="note">${dstr(c.ts)}${c.result?" · "+(c.result==="W"?'<span class="w">Gewonnen</span>':'<span class="l">Verloren</span>'):""}${a.note?" · Note "+a.note+"/10":""}</span>${f?`<span class="note">⚠ ${esc(f.titel)}</span>`:a.zusammenfassung?`<span class="note">${esc(a.zusammenfassung.slice(0,90))}</span>`:""}</span></button>`;
}
function clipsV(k){
  const L=clips.items.filter(c=>clipAll||c.kit===k);
  return `<section class="card upl"><h2>Fight analysieren lassen</h2>
    <p class="note">Lade einen Medal-Clip oder eine ganze Aufnahme hoch. Claude schaut sich Standbilder daraus an und sagt dir, was falsch lief und was du besser machen kannst.</p>
    <button class="btn" data-upload ${App.sample?"":"disabled"}>🎬 Clip hochladen</button>
    ${App.sample?"":`<p class="note">Geht nur, wenn du die App über deinen Claude-Link öffnest.</p>`}
    <details><summary class="note">So kommt dein Medal-Clip aufs Handy</summary><ol class="steps note"><li>Ein Medal-Link allein geht leider nicht: Die App darf keine Videos von anderen Seiten laden.</li><li>Medal-App öffnen und den Clip antippen</li><li>Teilen → «Video sichern» bzw. «Herunterladen»</li><li>Hier auf «Clip hochladen» und das Video aus Fotos wählen</li><li>Am PC: Medal speichert Clips als MP4 im Medal-Ordner. Die kannst du direkt hier hochladen.</li></ol></details></section>
  <div class="top"><h2>${clipAll?"Alle Clips":"Clips "+esc(k)}</h2><button class="linkbtn" id="clip-all">${clipAll?"Nur "+esc(k):"Alle Modi"}</button></div>
  ${!clips.loaded?`<p class="muted"><span class="spin"></span>Lädt …</p>`:L.length?`<div class="cliplist">${L.map(clipCard).join("")}</div>`:`<div class="empty"><p class="muted">Noch keine Clips${clipAll?"":" für "+esc(k)}.</p></div>`}`;
}
function clipDetailV(id){
  const c=clips.items.find(x=>x.id===id);if(!c)return `<p class="muted">Diesen Clip gibt es nicht mehr.</p>`;
  const a=c.analysis||{},fr=c.frames||[];
  const frameAt=n=>fr[Math.max(0,Math.min(fr.length-1,(n||1)-1))];
  return `<section class="card"><div class="top"><h2>${esc(c.title)}</h2>${a.note?`<span class="score">${a.note}<small>/10</small></span>`:""}</div>
    <p class="note">${dstr(c.ts)} · ${esc(c.kit)}${c.result?" · "+(c.result==="W"?"Gewonnen":"Verloren"):""}${c.opp?" · vs "+esc(c.opp):""}</p>
    <div class="thumbs">${fr.map((f,i)=>`<figure><img src="${f.img}" alt="Bild ${i+1}"><figcaption class="num">${i+1} · ${fmtS(f.t)}</figcaption></figure>`).join("")}</div>
    ${a.zusammenfassung?`<p>${esc(a.zusammenfassung)}</p>`:""}</section>
  ${(a.fehler||[]).length?`<h2 class="subh">Was falsch lief</h2>${a.fehler.map((f,i)=>{const F=frameAt(f.bild);return `<section class="card mist"><div class="mhead">${F?`<img src="${F.img}" alt="">`:""}<div><span class="lvl">Fehler ${i+1}${F?" · "+fmtS(F.t):""}</span><h3>${esc(f.titel)}</h3></div></div>
      ${f.was?`<p class="note">${esc(f.was)}</p>`:""}${f.besser?`<p><b>Besser:</b> ${esc(f.besser)}</p>`:""}</section>`}).join("")}`:""}
  ${(a.gut||[]).length?`<section class="card"><span class="lvl">Das war gut</span><ul class="steps">${a.gut.map(g=>`<li>${esc(g)}</li>`).join("")}</ul></section>`:""}
  ${a.taktik_check?`<section class="card"><span class="lvl">Deine Taktiken</span><p>${esc(a.taktik_check)}</p></section>`:""}
  ${a.taktik&&a.taktik.name?`<section class="card ai">${tacPreview({name:a.taktik.name,when:a.taktik.wann,steps:a.taktik.schritte,counter:a.taktik.konter})}<button class="btn" id="c-tac">Als Taktik speichern</button></section>`:""}
  ${a.drill?`<section class="card"><span class="lvl">Drill dazu</span><p>${esc(a.drill)}</p></section>`:""}
  ${a.unsicher?`<p class="note">Auf Standbildern nicht erkennbar: ${esc(a.unsicher)}</p>`:""}
  ${c.focus?`<p class="note">Deine Frage: ${esc(c.focus)}</p>`:""}
  ${c.link?`<a class="btn ghost" href="${esc(c.link)}" target="_blank" rel="noopener">Auf Medal ansehen ↗</a>`:""}
  <section class="card"><h2>Nachfragen</h2>${(c.qa||[]).map(q=>`<div class="qa"><b>${esc(q.q)}</b><div class="coach">${esc(q.a)}</div></div>`).join("")}
    ${qaBusy?`<p><span class="spin"></span>Claude schaut nochmals hin …</p>`:""}
    <form class="row" id="qa-f"><input id="qa-q" placeholder="z.B. Was hätte ich bei Bild 4 machen sollen?" aria-label="Frage zum Clip"><button class="btn" type="submit" ${qaBusy||!App.sample?"disabled":""}>Fragen</button></form></section>
  ${confirmDel===c.id?`<div class="inline"><span class="note">Clip-Analyse löschen?</span><button class="btn small" id="c-delyes">Ja, löschen</button><button class="btn small ghost" id="c-delno">Abbrechen</button></div>`:`<button class="btn danger" id="c-del">Clip löschen</button>`}`;
}

/* ---------- Training (pro Modus) ---------- */
function trainV(k){
  const running=run&&run.kit===k,L=visDrills(k),hidden=allDrills(k).length-L.length;
  const recent=S().sessions.filter(s=>s.kit===k).sort((a,b)=>b.ts-a.ts).slice(0,5);
  return `<section class="hero ${running?"running":""}"><div class="top"><span class="pill">${running?"Läuft · "+esc(k):"Bereit · "+esc(k)}</span>${running&&run.tactics&&run.tactics.length?`<span class="note">Fokus: ${run.tactics.map(id=>esc((S().tactics.find(t=>t.id===id)||{}).name||"")).join(", ")}</span>`:""}</div>
    <div class="timer num" id="tm">${running?fmtT(Date.now()-run.start):"00:00"}</div>
    ${running?`<div class="grid2"><button class="btn dark" data-stop>Beenden & speichern</button><button class="btn clear" id="cancel">Verwerfen</button></div>`:run?`<p class="note">Es läuft schon eine ${esc(run.kit)}-Session. <button class="linkbtn" data-mode="${run.kit}">Zu ${esc(run.kit)}</button></p>`:`<button class="btn" data-start>Start · ${esc(k)}</button>`}</section>
  <div class="grid2"><button class="btn ghost" data-sub="warm">🔥 Warm-up</button><button class="btn ghost" id="manual">Session nachtragen</button></div>
  <section class="card"><div class="top"><h2>Drills ${esc(k)}</h2><span class="note">${L.filter(d=>S().drillStatus[d[0]]===2).length}/${L.length} sitzen</span></div>
    ${ADV(k)?`<button class="linkbtn" id="basics">${showBasics?"Grundlagen ausblenden":"Grundlagen anzeigen ("+hidden+")"}</button>`:""}
    ${running?`<p class="note">Tippe ☐, um einen Drill zu dieser Session hinzuzufügen.</p>`:""}
    <div class="lib">${L.map(([n,d,lv])=>{const s=S().drillStatus[n]||0,inRun=running&&run.drills.includes(n);return `<div class="libitem"><div class="top"><span class="lvl">${esc(lv)}</span>${running?`<button class="linkbtn" data-drill="${esc(n)}" aria-pressed="${inRun}">${inRun?"☑ in Session":"☐ üben"}</button>`:""}</div><b>${esc(n)}</b><span class="note">${esc(d)}</span>
      <div class="seg3">${["Neu","Lerne ich","Sitzt"].map((t,i)=>`<button class="s${i}" data-ds="${esc(n)}" data-v="${i}" aria-pressed="${s===i}">${t}</button>`).join("")}</div></div>`}).join("")}</div>
    <div class="inline"><label>Eigener Drill<input id="cd-n" placeholder="z.B. Rod-Reset"></label><button class="btn" id="cd-add">+</button></div></section>
  <section class="card"><div class="top"><h2>Letzte Sessions</h2><button class="linkbtn" data-sub="more/log">Alle ›</button></div>
    ${recent.length?recent.map(sessRow).join(""):`<p class="muted">Noch keine ${esc(k)}-Sessions.</p>`}</section>`;
}
function sessRow(x){const tac=Object.entries(x.tactics||{}).map(([id,v])=>{const t=S().tactics.find(t=>t.id===id);return t?(v===1?"✓ ":"✗ ")+esc(t.name):""}).filter(Boolean);
  return `<div class="item"><div class="t">${esc(x.kit)} · ${hm(x.min)}</div><div class="wl"><span class="w">${x.w||0}W</span> <span class="l">${x.l||0}L</span> ${["","😖","😕","😐","🙂","🔥"][x.feel||0]} <button class="x" data-sdel="${x.id}" aria-label="Session löschen">×</button></div>
    <div class="s">${new Date(x.ts).toLocaleString("de-CH",{weekday:"short",day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"})}${x.server?" · "+esc(x.server):""}${x.drills&&x.drills.length?" · "+x.drills.map(esc).join(", "):""}${tac.length?"<br>"+tac.join(" · "):""}${x.note?"<br>"+esc(x.note):""}</div></div>`}
function warmV(){
  if(warm){const steps=WARMUPS[warm.name],c=steps[warm.i];return `<section class="hero running"><span class="pill">${esc(warm.name)} · Schritt ${warm.i+1}/${steps.length}</span><h2>${esc(c[0])}</h2><div class="timer num" id="wt">${fmtT(warm.end-Date.now())}</div>
    <div class="grid2"><button class="btn" id="wnext">Weiter</button><button class="btn dark" id="wstop">Abbrechen</button></div></section>
    <section class="card">${steps.map((s,i)=>`<div class="step ${i===warm.i?"now":i<warm.i?"done":""}"><span class="n">${i+1}</span><span>${esc(s[0])}</span><span class="note num">${s[1]} Min.</span></div>`).join("")}</section>`}
  return Object.entries(WARMUPS).map(([n,steps])=>`<section class="card"><div class="top"><h2>${esc(n)}</h2><button class="btn small" data-warm="${esc(n)}">Starten</button></div>${steps.map((s,i)=>`<div class="step"><span class="n">${i+1}</span><span>${esc(s[0])}</span><span class="note num">${s[1]} Min.</span></div>`).join("")}</section>`).join("");
}
function warmNext(){const steps=WARMUPS[warm.name];warm.i++;if(warm.i>=steps.length){warm=null;toast("Warm-up fertig – los geht's! 🔥");render();return}warm.end=Date.now()+steps[warm.i][1]*60000;try{navigator.vibrate&&navigator.vibrate(200)}catch(e){}render()}

/* ---------- Mehr ---------- */
function moreV(){
  const r=S().reaction.length?Math.min(...S().reaction):null,c=S().cps.length?Math.max(...S().cps):null;
  const grp=(t,tiles)=>`<h2 class="subh">${t}</h2><div class="tiles">${tiles}</div>`;
  return grp("Planen",tile("more/plan","cal","Wochenplan","Wann du welchen Modus trainierst","")+tile("more/tiers","ladder","Alle Tier-Ziele","Dein Weg zu HT3 und LT3","")+tile("more/tests","flag","Tier-Tests","Ergebnisse und nächster Test",S().nextTest?"geplant":""))
   +grp("Auswerten",tile("more/stats","chart","Statistik","Winrate und Zeit pro Modus","")+tile("more/log","list","Session-Log","Alle Trainings",S().sessions.length)+tile("more/review","eye","Fight-Review","Fight ohne Video auswerten",S().reviews.length||"")+tile("more/rivals","users","Gegner","Notizen und Bilanz",S().rivals.length||""))
   +grp("Kopf & Skills",tile("more/coach","chat","Coach","Frag Claude zu deinem Training","")+tile("more/mental","brain","Kopf & Tilt","Tilt-Meter, Pause, Checkliste",tilt()+"%")+tile("more/react","bolt","Reaktionstest","Wie schnell bist du?",r?r+" ms":"")+tile("more/cps","mouse","CPS-Test","Klicks pro Sekunde",c?c.toFixed(1):""))
   +grp("Setup",tile("more/loadouts","grid","Hotbar-Layouts","Inventar pro Modus","")+tile("more/servers","server","Server","Wo du spielst","")+tile("more/settings","gear","Einstellungen","IGN, Wochenziel, Daten",""));
}
function planV(){
  const t=todayIdx(),pl=S().plan.reduce((a,p)=>a+(p.kit==="-"?0:p.min),0),done=minutes(null,t+1);
  return `<section class="card"><p class="note">Zeit, Modus und Dauer pro Tag. «Auto» = der Modus, der am weitesten vom Ziel ist.</p>
  <div class="plan">${S().plan.map((p,i)=>`<div class="pday ${i===t?"today":""}"><b>${WD[i]}</b><input type="time" data-pt="${i}" value="${esc(p.time)}" aria-label="${WD[i]} Zeit"><select data-pk="${i}" aria-label="${WD[i]} Modus"><option value="">Auto</option><option value="-" ${p.kit==="-"?"selected":""}>Pause</option>${KITS.map(k=>`<option ${p.kit===k?"selected":""}>${k}</option>`).join("")}</select><select data-pm="${i}" aria-label="${WD[i]} Dauer">${[30,60,90,120,150,180].map(m=>`<option value="${m}" ${p.min===m?"selected":""}>${m<60?m+" Min":m/60+" h"}</option>`).join("")}</select></div>`).join("")}</div>
  <button class="btn" id="autoplan">Plan automatisch erstellen</button><p class="note">Modi mit der grössten Lücke zum Ziel kommen öfter dran, Donnerstag ist Pause.</p></section>
  <section class="card"><h2>Diese Woche</h2><p>Geplant <b class="num">${hm(pl)}</b> · bisher <b class="num">${hm(done)}</b></p><div class="hbar"><span>Stand</span><div class="b"><i style="width:${pl?Math.min(100,done/pl*100):0}%"></i></div><span class="num">${pl?Math.round(done/pl*100):0}%</span></div></section>`;
}
const tierOpts=sel=>TIERS.map(t=>`<option ${t===sel?"selected":""}>${t}</option>`).join("");
function tiersV(){
  return `<section class="card"><div class="ladder">${KITS.map(k=>{const t=S().tiers[k];return `<div class="rung"><span class="k">${k}</span>${trackHTML(k)}<span class="tier">${t.cur} <small>→ ${t.goal}</small></span></div>`}).join("")}</div>
    <p class="note">Farbig = aktueller Stand, grüner Rahmen = Ziel. Skala von LT5 (links) bis HT1 (rechts).</p></section>
  <section class="card"><h2>Stand anpassen</h2>${KITS.map(k=>`<div class="grid2"><label>${k} jetzt<select data-cur="${k}">${tierOpts(S().tiers[k].cur)}</select></label><label>${k} Ziel<select data-goal="${k}">${tierOpts(S().tiers[k].goal)}</select></label></div>`).join("")}</section>`;
}
function testsV(k){
  return `<section class="card"><h2>Nächster Test</h2>${S().nextTest?`<p><b>${esc(S().nextTest.kit)}</b> am ${dstr(S().nextTest.date+"T12:00")} <button class="btn small ghost" id="nt-clear">Entfernen</button></p>`:""}
    <div class="grid2"><label>Modus<select id="nt-kit">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label><label>Datum<input type="date" id="nt-date"></label></div><button class="btn ghost" id="nt-save">Test planen</button></section>
  <section class="card"><h2>Ergebnis eintragen</h2><div class="grid2"><label>Modus<select id="t-kit">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label><label>Ergebnis<select id="t-tier">${tierOpts(S().tiers[k].cur)}</select></label></div>
    <label>Notiz<input id="t-note" placeholder="Tester, Server, was gut lief"></label><button class="btn" id="t-add">Ergebnis speichern</button></section>
  <section class="card"><h2>Bisherige Tests</h2>${S().tests.length?S().tests.slice().reverse().map(t=>`<div class="item"><div class="t">${esc(t.kit)} → ${esc(t.tier)}</div><div class="note">${new Date(t.ts).toLocaleDateString("de-CH")}</div>${t.note?`<div class="s">${esc(t.note)}</div>`:""}</div>`).join(""):`<p class="muted">Noch keine Tests eingetragen.</p>`}</section>`;
}
function rivalsV(k){
  return `<section class="card"><h2>Neuer Gegner</h2><div class="grid2"><label>IGN<input id="rv-n" placeholder="Spielername"></label><label>Modus<select id="rv-k">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label></div><label>Wie spielt er?<input id="rv-note" placeholder="z.B. spammt, jumpt viel, schwach im Bogen"></label><button class="btn" id="rv-add">Speichern</button></section>
  ${S().rivals.map(r=>`<section class="card"><div class="top"><h3>${esc(r.name)} <span class="note">· ${esc(r.kit)}</span></h3><button class="x" data-rvdel="${r.id}" aria-label="Löschen">×</button></div>
    <div class="grid2"><div><span class="note">Gewonnen</span><div class="stepper"><button data-rv="${r.id}" data-f="w" data-d="-1">−</button><b class="w">${r.w}</b><button data-rv="${r.id}" data-f="w" data-d="1">+</button></div></div><div><span class="note">Verloren</span><div class="stepper"><button data-rv="${r.id}" data-f="l" data-d="-1">−</button><b class="l">${r.l}</b><button data-rv="${r.id}" data-f="l" data-d="1">+</button></div></div></div>
    ${r.note?`<p class="note">${esc(r.note)}</p>`:""}</section>`).join("")}`;
}
function statsV(){
  const per=KITS.map(k=>({k,...kitWL(k),m30:minutes(k,30)}));
  const mx=Math.max(60,...per.map(p=>p.m30)),feel=S().sessions.slice(-10).map(s=>s.feel||3),tot=S().sessions.reduce((a,s)=>a+s.min,0);
  const c={};S().reviews.forEach(r=>(r.tags||[]).forEach(t=>c[t]=(c[t]||0)+1));const cm=Math.max(1,...Object.values(c));
  return `<div class="stats"><div class="stat"><b>${Math.round(tot/6)/10}</b><span>Std. total</span></div><div class="stat"><b>${streak()}</b><span>Tage Streak</span></div><div class="stat"><b>${feel.length?avg(feel).toFixed(1):"–"}</b><span>Gefühl Ø (1–5)</span></div></div>
  <section class="card"><h2>Letzte 7 Tage</h2><div class="bars">${(()=>{const b=weekBars(),m=Math.max(60,...b.map(x=>x.m));return b.map(x=>`<div><i style="height:${x.m/m*100}%"></i><span>${x.l}</span></div>`).join("")})()}</div></section>
  <section class="card"><h2>Zeit letzte 30 Tage</h2>${per.map(p=>`<div class="hbar"><span>${p.k}</span><div class="b"><i style="width:${p.m30/mx*100}%"></i></div><span class="num">${hm(p.m30)}</span></div>`).join("")}</section>
  <section class="card"><h2>Winrate pro Modus</h2>${per.map(p=>`<div class="hbar"><span>${p.k}</span><div class="b"><i class="win" style="width:${p.pct||0}%"></i></div><span class="num">${p.pct!=null?p.pct+"%":"–"} <span class="note">(${p.w}/${p.l})</span></span></div>`).join("")}</section>
  ${Object.keys(c).length?`<section class="card"><h2>Häufigste Fehler</h2>${Object.entries(c).sort((a,b)=>b[1]-a[1]).slice(0,5).map(([t,n])=>`<div class="hbar"><span style="font-size:12px">${esc(t)}</span><div class="b"><i class="loss" style="width:${n/cm*100}%"></i></div><span class="num">${n}×</span></div>`).join("")}</section>`:""}`;
}
function logV(){const s=S().sessions.slice().sort((a,b)=>b.ts-a.ts);return `<section class="card">${s.length?s.map(sessRow).join(""):`<p class="muted">Noch keine Sessions.</p>`}</section>`}
function reviewV(k){
  return `<section class="card"><p class="note">Für Fights ohne Video: kurz aufschreiben, woran es lag.</p><div class="grid2"><label>Modus<select id="rw-k">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label><label>Gegner<input id="rw-o" placeholder="optional"></label></div>
    <span class="note">Woran lag's?</span><div class="chips">${MISTAKES.map(m=>`<button data-tag="${esc(m)}" aria-pressed="${revTags.has(m)}">${esc(m)}</button>`).join("")}</div>
    <label>Was ist passiert?<textarea id="rw-what" rows="2"></textarea></label><label>Was mache ich nächstes Mal anders?<input id="rw-l"></label><button class="btn" id="rw-add">Review speichern</button></section>
  ${S().reviews.slice().reverse().map(r=>`<section class="card"><div class="top"><h3>${esc(r.kit)}${r.opp?" vs "+esc(r.opp):""}</h3><span class="note">${dstr(r.ts)} <button class="x" data-rwdel="${r.id}" aria-label="Löschen">×</button></span></div>
    ${(r.tags||[]).length?`<p class="note l">${r.tags.map(esc).join(" · ")}</p>`:""}${r.what?`<p class="note">${esc(r.what)}</p>`:""}${r.lesson?`<p><b>Lektion:</b> ${esc(r.lesson)}</p>`:""}</section>`).join("")}`;
}
function askV(k){
  return `<section class="card"><p class="note">Claude sieht deine Sessions, Taktiken, Clip-Analysen und Tier-Ziele.</p>
    <div class="chips">${["Plan für nächste Woche","Was mache ich falsch?",`Wie werde ich besser in ${k}?`,"Welche Taktik soll ich als Nächstes lernen?","Analysiere meine Clips"].map(q=>`<button data-q="${esc(q)}">${esc(q)}</button>`).join("")}</div>
    <form class="row" id="cf"><input id="cq" placeholder="Eigene Frage …" aria-label="Frage an den Coach"><button class="btn" type="submit">Fragen</button></form></section>
  ${coachBusy||coachText?`<section class="card"><div class="coach" id="ct">${coachBusy&&!coachText?"Coach denkt nach …":esc(coachText)}</div></section>`:""}
  ${!App.sample?`<p class="note">Der Coach funktioniert nur über deinen Claude-Link.</p>`:""}`;
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
function reactV(){
  const L=S().reaction,best=L.length?Math.min(...L):null,a=L.length?Math.round(avg(L.slice(-10))):null;
  const msg={idle:"Tippen zum Starten",wait:"Warte auf Grün …",go:"JETZT!",early:"Zu früh! Tippen für neuen Versuch",done:react.ms+" ms<br><small>Tippen für nochmal</small>"}[react.st];
  return `<button class="react ${react.st==="early"?"wait":react.st}" id="rx">${msg}</button>
  <div class="stats"><div class="stat"><b>${best??"–"}</b><span>Bestzeit ms</span></div><div class="stat"><b>${a??"–"}</b><span>Schnitt (10)</span></div><div class="stat"><b>${L.length}</b><span>Versuche</span></div></div>
  <p class="note">Mit dem Finger gemessen, nicht mit der Maus – gut zum Vergleichen von Tag zu Tag. Unter 250 ms ist ein guter Wert.</p>`;
}
function cpsV(){
  const L=S().cps,best=L.length?Math.max(...L):null,running=cpsRun&&cpsRun.end>Date.now();
  return `<button class="react ${running?"go":cpsRun&&cpsRun.result!=null?"done":"idle"}" id="cx">${running?`<span id="cc">${cpsRun.n}</span>`:cpsRun&&cpsRun.result!=null?`${cpsRun.result.toFixed(1)} CPS<br><small>Tippen für nochmal</small>`:"Tippe so schnell du kannst – 10 Sekunden"}</button>
  <div class="stats"><div class="stat"><b>${best?best.toFixed(1):"–"}</b><span>Rekord CPS</span></div><div class="stat"><b>${L.length?avg(L.slice(-10)).toFixed(1):"–"}</b><span>Schnitt</span></div><div class="stat"><b>${L.length}</b><span>Tests</span></div></div>`;
}
function loadV(k){
  const L=S().loadouts[k]||Array(10).fill("");
  return `<section class="card"><h2>Hotbar ${esc(k)}</h2><p class="note">Oben den Modus wechseln, um andere Layouts zu sehen.</p><div class="slots">${L.slice(0,9).map((v,i)=>`<input data-slot="${i}" value="${esc(v)}" placeholder="${i+1}" aria-label="Slot ${i+1}">`).join("")}</div>
  <label>Offhand<input data-slot="9" value="${esc(L[9]||"")}" placeholder="z.B. Totem, Schild"></label><p class="note">Kurz eintragen, z.B. «Mace», «WC», «Perle». Speichert automatisch.</p></section>`;
}
function serversV(){
  const c={};S().sessions.forEach(s=>{if(s.server)c[s.server]=(c[s.server]||0)+s.min});
  return `<section class="card"><div class="list">${S().servers.map((s,i)=>`<div class="item"><div class="t num">${esc(s)}</div><div class="note">${c[s]?hm(c[s]):"–"} <button class="x" data-svdel="${i}" aria-label="Entfernen">×</button></div></div>`).join("")}</div>
    <div class="row"><input id="sv-n" placeholder="Server-IP"><button class="btn" id="sv-add">+</button></div></section>`;
}
function setV(){
  return `<section class="card"><div class="grid2"><label>IGN<input id="s-ign" value="${esc(S().ign)}"></label><label>Wochenziel (Std.)<input id="s-wk" type="number" inputmode="decimal" value="${(S().weeklyGoalMin||0)/60}"></label></div>
    <p class="note">${App.cloud?"Privat in deinem Claude-Konto gespeichert.":"Nur in diesem Browser gespeichert."}</p></section>
  <section class="card"><h2>Daten</h2><button class="btn danger" id="reset">Alle Trainingsdaten löschen</button><div id="rc"></div></section>`;
}

/* ================= Aktionen ================= */
function persistRun(){try{run?localStorage.setItem("own-run",JSON.stringify(run)):localStorage.removeItem("own-run")}catch(e){}}
function startRun(k,tacIds){run={start:Date.now(),kit:k,drills:[...drills],tactics:tacIds||kitTac(k).filter(t=>t.active).map(t=>t.id)};drills.clear();persistRun()}
function nav(s){sub=s;confirmDel=null;render();scrollTo(0,0)}
function setMode(k){if(S().mode!==k){S().mode=k;doc.save()}render()}
function bind(){
  if(!doc.loaded)return;
  const s=S(),k=K(),on=(q,f)=>{const e=$(q);if(e)e.onclick=f},ch=(q,f)=>{const e=$(q);if(e)e.onchange=f};
  $$("[data-mode]").forEach(b=>b.onclick=()=>setMode(b.dataset.mode));
  $$("[data-ttab]").forEach(b=>b.onclick=()=>{tab=b.dataset.ttab;sub=null;render()});
  $$("[data-ttab2]").forEach(b=>b.onclick=()=>{tab=b.dataset.ttab2;sub=null;render();scrollTo(0,0)});
  $$("[data-sub]").forEach(b=>b.onclick=()=>{if(b.dataset.sub==="tak/new")tplDraft=null;nav(b.dataset.sub)});
  on("[data-back]",()=>nav(null));
  $$("[data-start]").forEach(b=>b.onclick=()=>{startRun(k);render()});
  $$("[data-stop]").forEach(b=>b.onclick=()=>openFinish(Math.max(1,Math.round((Date.now()-run.start)/60000)),run.kit,run.drills,false,run.tactics));
  on("#cancel",()=>{run=null;persistRun();render();toast("Session verworfen")});
  on("#manual",()=>openFinish(60,k,[],true,kitTac(k).filter(t=>t.active).map(t=>t.id)));
  $$("[data-upload]").forEach(b=>b.onclick=openClipUpload);
  $$("[data-drill]").forEach(b=>b.onclick=()=>{const n=b.dataset.drill,set=new Set(run.drills);set.has(n)?set.delete(n):set.add(n);run.drills=[...set];persistRun();render()});
  $$("[data-ds]").forEach(b=>b.onclick=()=>{s.drillStatus[b.dataset.ds]=+b.dataset.v;commit(+b.dataset.v===2?"Sitzt! 💪":"")});
  on("#basics",()=>{showBasics=!showBasics;render()});
  on("#cd-add",()=>{const n=$("#cd-n").value.trim();if(!n){toast("Name eingeben");return}s.customDrills.push({name:n,desc:"",kit:k});commit("Drill hinzugefügt")});
  const qcf=$("#qcf");if(qcf)qcf.onsubmit=e=>{e.preventDefault();const q=$("#qcq").value.trim();if(!q)return;tab="more";sub="more/coach";askCoach(q)};
  // Taktiken
  $$("[data-tf]").forEach(b=>b.onclick=()=>{tacFilter=b.dataset.tf;render()});
  $$("[data-tpl]").forEach(b=>b.onclick=()=>{const t=TEMPLATES[k].filter(t=>!kitTac(k).some(x=>x.name===t.name))[+b.dataset.tpl];tplDraft={...t,kit:k};nav("tak/new")});
  on("#te-save",()=>{const name=$("#te-name").value.trim();if(!name){toast("Gib der Taktik einen Namen");return}
    const data={name,kit:$("#te-kit").value,when:$("#te-when").value.trim(),steps:$("#te-steps").value.split("\n").map(x=>x.trim()).filter(Boolean),counter:$("#te-counter").value.trim()};
    const edit=sub.startsWith("tak/edit/")?s.tactics.find(t=>t.id===sub.slice(9)):null;
    if(edit){Object.assign(edit,data);commit("Taktik gespeichert");nav("tak/"+edit.id)}
    else{const t={id:uid(),...data,status:0,active:true,createdAt:Date.now()};s.tactics.push(t);tplDraft=null;if(s.mode!==t.kit)s.mode=t.kit;commit("Taktik angelegt – sie ist im Fokus ★");nav("tak/"+t.id)}});
  const curTac=sub&&sub.startsWith("tak/")&&!sub.startsWith("tak/edit/")&&sub!=="tak/new"?s.tactics.find(t=>t.id===sub.slice(4)):null;
  if(curTac){
    $$("[data-tst]").forEach(b=>b.onclick=()=>{curTac.status=+b.dataset.tst;commit(curTac.status===2?"Sitzt! 💪":"Gespeichert")});
    on("#t-act",()=>{curTac.active=!curTac.active;commit(curTac.active?"Im Fokus ★":"Aus dem Fokus genommen")});
    on("#t-practice",()=>{curTac.active=true;if(curTac.status===0)curTac.status=1;s.mode=curTac.kit;if(!run)startRun(curTac.kit,[...new Set([curTac.id,...kitTac(curTac.kit).filter(t=>t.active).map(t=>t.id)])]);else if(run.kit===curTac.kit&&!run.tactics.includes(curTac.id)){run.tactics.push(curTac.id);persistRun()}
      doc.save();tab="train";sub=null;render();scrollTo(0,0);toast("Session läuft – Fokus: "+curTac.name)});
    on("#t-ai",()=>improveTactic(curTac));
    on("#tai-take",()=>{const n=curTac.ai.t;Object.assign(curTac,{name:n.name||curTac.name,when:n.when||curTac.when,steps:n.steps&&n.steps.length?n.steps:curTac.steps,counter:n.counter||curTac.counter});delete curTac.ai;commit("Taktik aktualisiert")});
    on("#tai-no",()=>{delete curTac.ai;render()});
    on("#t-del",()=>{confirmDel=curTac.id;render()});on("#t-delno",()=>{confirmDel=null;render()});
    on("#t-delyes",()=>{s.tactics=s.tactics.filter(t=>t.id!==curTac.id);confirmDel=null;sub=null;commit("Taktik gelöscht")});
  }
  on("#tak-ai",()=>suggestTactic(k));
  on("#ai-take",()=>{const n=tacAI.t;const t={id:uid(),kit:k,name:n.name||"Neue Taktik",when:n.when||"",steps:n.steps||[],counter:n.counter||"",status:0,active:true,createdAt:Date.now()};s.tactics.push(t);tacAI=null;commit("Taktik übernommen ★");nav("tak/"+t.id)});
  on("#ai-no",()=>{tacAI=null;render()});
  // Clips
  on("#clip-all",()=>{clipAll=!clipAll;render()});
  const curClip=sub&&sub.startsWith("clip/")?clips.items.find(c=>c.id===sub.slice(5)):null;
  if(curClip){
    on("#c-tac",()=>{const a=curClip.analysis.taktik;const t={id:uid(),kit:curClip.kit,name:a.name,when:a.wann||"",steps:a.schritte||[],counter:a.konter||"",status:0,active:true,createdAt:Date.now(),source:"clip"};s.tactics.push(t);s.mode=curClip.kit;tab="tak";commit("Als Taktik gespeichert ★");nav("tak/"+t.id)});
    on("#c-del",()=>{confirmDel=curClip.id;render()});on("#c-delno",()=>{confirmDel=null;render()});
    on("#c-delyes",()=>{clips.del(curClip.id);confirmDel=null;nav(null);toast("Clip gelöscht")});
    const f=$("#qa-f");if(f)f.onsubmit=e=>{e.preventDefault();const q=$("#qa-q").value.trim();if(q)askClip(curClip,q)};
  }
  // Mehr
  $$("[data-warm]").forEach(b=>b.onclick=()=>{const n=b.dataset.warm;warm={name:n,i:0,end:Date.now()+WARMUPS[n][0][1]*60000};render()});
  on("#wnext",warmNext);on("#wstop",()=>{warm=null;render()});
  const rx=$("#rx");if(rx)rx.onpointerdown=reactTap;
  const cx=$("#cx");if(cx)cx.onpointerdown=cpsTap;
  $$("[data-sdel]").forEach(b=>b.onclick=()=>{s.sessions=s.sessions.filter(x=>x.id!==b.dataset.sdel);commit("Gelöscht")});
  $$("[data-pt]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pt].time=i.value;commit()});
  $$("[data-pk]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pk].kit=i.value;commit()});
  $$("[data-pm]").forEach(i=>i.onchange=()=>{s.plan[+i.dataset.pm].min=+i.value;commit()});
  on("#autoplan",()=>{const order=KITS.slice().sort((a,b)=>gap(b)-gap(a)),pool=[];order.forEach((x,i)=>{const w=Math.max(1,gap(x)+(i<2?1:0));for(let j=0;j<w;j++)pool.push(x)});let pi=0;s.plan=s.plan.map((p,i)=>i===3?{...p,kit:"-"}:{...p,kit:pool[(pi++)%pool.length]});commit("Plan erstellt")});
  $$("[data-cur]").forEach(x=>x.onchange=()=>{s.tiers[x.dataset.cur].cur=x.value;commit("Gespeichert")});
  $$("[data-goal]").forEach(x=>x.onchange=()=>{s.tiers[x.dataset.goal].goal=x.value;commit("Gespeichert")});
  on("#nt-save",()=>{const d=$("#nt-date").value;if(!d){toast("Datum wählen");return}s.nextTest={kit:$("#nt-kit").value,date:d};commit("Test geplant")});
  on("#nt-clear",()=>{s.nextTest=null;commit()});
  on("#t-add",()=>{const kk=$("#t-kit").value,t=$("#t-tier").value;s.tests.push({id:uid(),ts:Date.now(),kit:kk,tier:t,note:$("#t-note").value.trim()});s.tiers[kk].cur=t;if(s.nextTest&&s.nextTest.kit===kk)s.nextTest=null;commit(ti(t)>=ti(s.tiers[kk].goal)?"Ziel erreicht! 🔥":"Test gespeichert")});
  on("#rv-add",()=>{const n=$("#rv-n").value.trim();if(!n){toast("IGN eingeben");return}s.rivals.push({id:uid(),name:n,kit:$("#rv-k").value,note:$("#rv-note").value.trim(),w:0,l:0});commit("Gegner gespeichert")});
  $$("[data-rv]").forEach(b=>b.onclick=()=>{const r=s.rivals.find(x=>x.id===b.dataset.rv);r[b.dataset.f]=Math.max(0,r[b.dataset.f]+ +b.dataset.d);commit()});
  $$("[data-rvdel]").forEach(b=>b.onclick=()=>{s.rivals=s.rivals.filter(r=>r.id!==b.dataset.rvdel);commit()});
  $$("[data-q]").forEach(b=>b.onclick=()=>askCoach(b.dataset.q));
  const cf=$("#cf");if(cf)cf.onsubmit=e=>{e.preventDefault();const q=$("#cq").value.trim();if(q)askCoach(q)};
  $$("[data-tag]").forEach(b=>b.onclick=()=>{const t=b.dataset.tag;revTags.has(t)?revTags.delete(t):revTags.add(t);b.setAttribute("aria-pressed",revTags.has(t))});
  on("#rw-add",()=>{s.reviews.push({id:uid(),ts:Date.now(),kit:$("#rw-k").value,opp:$("#rw-o").value.trim(),tags:[...revTags],what:$("#rw-what").value.trim(),lesson:$("#rw-l").value.trim()});revTags.clear();commit("Review gespeichert")});
  $$("[data-rwdel]").forEach(b=>b.onclick=()=>{s.reviews=s.reviews.filter(r=>r.id!==b.dataset.rwdel);commit()});
  on("#pstart",()=>{pause={end:Date.now()+300000};render()});on("#pstop",()=>{pause=null;render()});
  $$("[data-prep]").forEach(b=>b.onclick=()=>{const d=new Date().toDateString(),p=b.dataset.prep,L=new Set(s.prep[d]||[]);L.has(p)?L.delete(p):L.add(p);s.prep={[d]:[...L]};commit()});
  $$("[data-slot]").forEach(i=>i.onchange=()=>{const L=(s.loadouts[k]||Array(10).fill("")).slice();L[+i.dataset.slot]=i.value.trim();s.loadouts[k]=L;commit("Gespeichert")});
  on("#sv-add",()=>{const n=$("#sv-n").value.trim();if(n){s.servers.push(n);commit()}});
  $$("[data-svdel]").forEach(b=>b.onclick=()=>{s.servers.splice(+b.dataset.svdel,1);commit()});
  ch("#s-ign",e=>{s.ign=e.target.value.trim()||"FireTino";commit()});
  ch("#s-wk",e=>{s.weeklyGoalMin=Math.round((+e.target.value||0)*60);commit()});
  on("#reset",()=>{$("#rc").innerHTML=`<div class="inline"><span class="note">Wirklich alles löschen?</span><button class="btn small" id="ry">Ja, löschen</button><button class="btn small ghost" id="rn">Abbrechen</button></div>`;$("#ry").onclick=()=>{doc.S=upgrade(blank());commit("Zurückgesetzt")};$("#rn").onclick=()=>$("#rc").innerHTML=""});
}
function tick(){
  const tm=$("#tm");if(tm&&run&&tm.closest(".running"))tm.textContent=fmtT(Date.now()-run.start);
  if(warm){const e=$("#wt");if(e)e.textContent=fmtT(warm.end-Date.now());if(warm.end<=Date.now()&&sub==="warm")warmNext()}
  if(pause){const e=$("#pt");if(e)e.textContent=fmtT(pause.end-Date.now());if(pause.end<=Date.now()){pause=null;toast("Pause vorbei – weiter geht's!");if(sub==="more/mental")render()}}
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

/* ---------- Session speichern (mit Taktik-Bewertung) ---------- */
function openFinish(min,k,dr,manual,tacIds){
  let w=0,l=0,feel=4,tmp=null;const tv={};
  const keep=()=>{tmp={k:$("#fk").value,m:$("#fm").value,sv:$("#fsv").value,n:$("#fn").value}};
  const restore=()=>{if(!tmp)return;$("#fk").value=tmp.k;$("#fm").value=tmp.m;$("#fsv").value=tmp.sv;$("#fn").value=tmp.n};
  const draw=()=>{const kk=tmp?tmp.k:k;const tacs=S().tactics.filter(t=>t.kit===kk&&(t.active||(tacIds||[]).includes(t.id)));
    sheet(`<div class="top"><h2>${manual?"Session nachtragen":"Session speichern"}</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <div class="grid2"><label>Modus<select id="fk">${KITS.map(x=>`<option ${x===kk?"selected":""}>${x}</option>`).join("")}</select></label><label>Minuten<input id="fm" type="number" inputmode="numeric" value="${min}"></label></div>
    <div class="grid2"><div><span class="note">Wins</span><div class="stepper"><button data-s="w-">−</button><b class="w">${w}</b><button data-s="w+">+</button></div></div><div><span class="note">Losses</span><div class="stepper"><button data-s="l-">−</button><b class="l">${l}</b><button data-s="l+">+</button></div></div></div>
    ${tacs.length?`<div><span class="note">Hat deine Taktik geklappt?</span>${tacs.map(t=>`<div class="tacrate"><span>${esc(t.name)}</span><div class="seg3"><button class="s0" data-tr="${t.id}" data-v="0" aria-pressed="${!tv[t.id]}">nicht probiert</button><button class="s2" data-tr="${t.id}" data-v="1" aria-pressed="${tv[t.id]===1}">✓ klappt</button><button class="s1" data-tr="${t.id}" data-v="-1" aria-pressed="${tv[t.id]===-1}">✗ nicht</button></div></div>`).join("")}</div>`:""}
    <div><span class="note">Wie lief's?</span><div class="feel">${["😖","😕","😐","🙂","🔥"].map((e,i)=>`<button data-feel="${i+1}" aria-pressed="${feel===i+1}" aria-label="Gefühl ${i+1} von 5">${e}</button>`).join("")}</div></div>
    <label>Server<select id="fsv"><option value="">–</option>${S().servers.map(s=>`<option ${s===S().lastServer?"selected":""}>${esc(s)}</option>`).join("")}</select></label>
    <label>Notiz<textarea id="fn" rows="2" placeholder="Was lief gut, was nicht?"></textarea></label><button class="btn" id="fsave">Speichern</button>`,(host,close)=>{
    host.querySelectorAll("[data-s]").forEach(b=>b.onclick=()=>{keep();const v=b.dataset.s;if(v==="w+")w++;if(v==="w-")w=Math.max(0,w-1);if(v==="l+")l++;if(v==="l-")l=Math.max(0,l-1);draw();restore()});
    host.querySelectorAll("[data-feel]").forEach(b=>b.onclick=()=>{keep();feel=+b.dataset.feel;draw();restore()});
    host.querySelectorAll("[data-tr]").forEach(b=>b.onclick=()=>{keep();const v=+b.dataset.v;if(v)tv[b.dataset.tr]=v;else delete tv[b.dataset.tr];draw();restore()});
    $("#fk").onchange=()=>{keep();draw();restore()};
    $("#fsave").onclick=()=>{const kk=$("#fk").value,mm=Math.max(1,+$("#fm").value||1),sv=$("#fsv").value;
      const tres={};Object.entries(tv).forEach(([id,v])=>{const t=S().tactics.find(x=>x.id===id);if(t&&t.kit===kk)tres[id]=v});
      S().sessions.push({id:uid(),ts:manual?Date.now()-mm*60000:run.start,kit:kk,min:mm,w,l,feel,server:sv,drills:dr,tactics:tres,note:$("#fn").value.trim()});S().lastServer=sv;
      if(!manual){run=null;persistRun()}close();commit("Session gespeichert 🔥");if(l>=3&&w===0)setTimeout(()=>toast("3+ Losses – gönn dir eine Pause"),2100)};
  })};
  draw();
}

/* ---------- Claude: Coach, Taktiken ---------- */
function context(k){
  const s=S();
  return `Spieler: ${s.ign}. ${k?level(k):KITS.map(level).join(" ")} Tier-Stand und Ziele: ${JSON.stringify(s.tiers)}
Eigene Taktiken: ${JSON.stringify(s.tactics.filter(t=>!k||t.kit===k).map(t=>({modus:t.kit,name:t.name,wann:t.when,schritte:t.steps,status:TSTAT[t.status],erfolg:tacStats(t.id)})))}
Letzte Sessions: ${JSON.stringify(s.sessions.slice(-20).map(x=>({datum:dkey(x.ts),modus:x.kit,min:x.min,w:x.w,l:x.l,gefuehl:x.feel,notiz:x.note})))}
Letzte Clip-Analysen: ${JSON.stringify(clips.items.filter(c=>c.analysis&&(!k||c.kit===k)).slice(0,5).map(c=>({modus:c.kit,ergebnis:c.result,zusammenfassung:c.analysis.zusammenfassung,fehler:(c.analysis.fehler||[]).map(f=>f.titel)})))}`;
}
async function askCoach(q){
  if(!App.sample){toast("Coach nur über deinen Claude-Link");return}
  coachBusy=true;coachText="";render();
  const prompt=`Du bist ein Minecraft-PvP-Coach (Java 1.21, MCTiers-Modi). Antworte auf Deutsch (Schweizer Schreibweise mit ss), kurz und konkret, ohne Markdown-Überschriften, Aufzählungen mit "•".
Aktueller Modus: ${K()}. Wochenplan: ${JSON.stringify(S().plan.map((p,i)=>WD[i]+" "+p.time+" "+(p.kit||"auto")+" "+p.min+"min"))}
${context(null)}
Frage: ${q}`;
  try{await App.sample(prompt,{modelTier:"default",cache:false,onText:({text})=>{coachText=text;const e=$("#ct");if(e)e.textContent=text;else rerender()}})}
  catch(e){coachText=e&&e.code==="not_granted"?"Der Coach braucht deine Erlaubnis, Claude zu fragen.":"Der Coach ist gerade nicht erreichbar. Versuch es gleich nochmal."}
  coachBusy=false;render();
}
const TAC_JSON=`{"name": kurzer Name, "when": "in welcher Situation", "steps": ["Schritt 1", "..."] (3-6 kurze Schritte), "counter": "was tun, wenn der Gegner kontert", "tip": "ein Satz, worauf man beim Üben achten soll"}`;
async function suggestTactic(k){
  if(!App.sample)return;tacAI={busy:true};render();
  try{const t=await App.sample.json(`Du bist ein Minecraft-PvP-Coach (Java 1.21, MCTiers). Schlage dem Spieler EINE neue, konkrete und anspruchsvolle Taktik für den Modus ${k} vor, die zu seinen Schwächen passt und die er noch nicht hat. Keine Grundlagen. Deutsch, Schweizer Schreibweise (ss).
${context(k)}
Antworte NUR mit JSON: ${TAC_JSON}`,{modelTier:"default",cache:false});tacAI={t}}
  catch(e){tacAI={err:e&&e.code==="not_granted"?"Der Coach braucht deine Erlaubnis.":"Hat nicht geklappt. Versuch es nochmals."}}
  render();
}
async function improveTactic(t){
  if(!App.sample)return;t.ai={busy:true};render();
  try{const n=await App.sample.json(`Du bist ein Minecraft-PvP-Coach (Java 1.21, MCTiers). Verbessere diese Taktik des Spielers für den Modus ${t.kit}: mach die Schritte klarer und konkreter, ergänze, was fehlt, behalte seine Idee bei. Deutsch, Schweizer Schreibweise (ss).
Taktik: ${JSON.stringify({name:t.name,wann:t.when,schritte:t.steps,konter:t.counter,erfolg:tacStats(t.id)})}
${context(t.kit)}
Antworte NUR mit JSON: ${TAC_JSON}`,{modelTier:"default",cache:false});t.ai={t:n}}
  catch(e){t.ai={err:"Hat nicht geklappt. Versuch es nochmals."}}
  render();
}

/* ---------- Clip hochladen und analysieren ---------- */
function frameTimes(a,b,marks,n){
  const m=marks.filter(x=>x>=a&&x<=b),ts=[];
  const nm=m.length?Math.min(n-3,m.length*3):0,ne=n-nm;
  for(let i=0;i<ne;i++)ts.push(a+(b-a)*(i+0.5)/ne);
  const offs=[-0.8,0,0.6];for(let j=0;j<nm;j++){const mk=m[Math.floor(j/3)%m.length];ts.push(Math.min(b,Math.max(a,mk+offs[j%3])))}
  return [...new Set(ts.map(t=>Math.round(t*10)/10))].sort((x,y)=>x-y);
}
function seekTo(v,t){return new Promise(res=>{let done=false;const fin=()=>{if(done)return;done=true;v.removeEventListener("seeked",fin);setTimeout(res,90)};v.addEventListener("seeked",fin);v.currentTime=Math.min(Math.max(0,t),Math.max(0,v.duration-0.05));setTimeout(fin,4000)})}
function toBlob(c,q){return new Promise(r=>c.toBlob(r,"image/jpeg",q))}
function dataURLtoBlob(u){const [h,b]=u.split(",");const bin=atob(b);const arr=new Uint8Array(bin.length);for(let i=0;i<bin.length;i++)arr[i]=bin.charCodeAt(i);return new Blob([arr],{type:(h.match(/data:(.*?);/)||[])[1]||"image/jpeg"})}
async function grabFrames(v,times,maxBytes,onP){
  try{await v.play()}catch(e){}v.pause();
  const out=[],W=Math.min(1024,v.videoWidth||1024),H=Math.round(W*(v.videoHeight||576)/(v.videoWidth||1024));
  const big=document.createElement("canvas");big.width=W;big.height=H;const bc=big.getContext("2d");
  const sm=document.createElement("canvas");sm.width=320;sm.height=Math.round(320*H/W);const sc=sm.getContext("2d");
  for(let i=0;i<times.length;i++){
    await seekTo(v,times[i]);bc.drawImage(v,0,0,W,H);sc.drawImage(v,0,0,sm.width,sm.height);
    let blob=await toBlob(big,.78);if(maxBytes&&blob&&blob.size>maxBytes)blob=await toBlob(big,.5);
    out.push({t:times[i],blob,img:sm.toDataURL("image/jpeg",.62)});onP((i+1)/times.length);
  }
  const px=bc.getImageData(Math.floor(W/2),Math.floor(H/2),1,1).data;
  if(!v.videoWidth||(out.length&&px[0]+px[1]+px[2]===0&&px[3]===0))throw new Error("decode");
  return out;
}
async function openClipUpload(){
  const k=K();let lim=null;
  try{lim=App.sample?await App.sample.limits():null}catch(e){}
  if(!App.sample){toast("Clip-Analyse geht nur über deinen Claude-Link");return}
  if(!lim||!lim.images){toast("Bilder an Claude senden ist hier nicht erlaubt – Erlaubnis prüfen");return}
  const maxN=Math.max(4,Math.min(12,lim.images.maxCount||8));
  let url=null,dur=0,a=0,b=0;const marks=[];
  sheet(`<div class="top"><h2>Clip analysieren</h2><button class="x" data-close aria-label="Schliessen">×</button></div>
    <label class="btn ghost wide filebtn">🎬 Video wählen (Medal-Clip, MP4)<input type="file" id="cv-file" accept="video/*"></label>
    <div id="cv-body" hidden>
      <video id="cv-v" controls playsinline muted preload="auto"></video>
      <p class="note" id="cv-info"></p>
      <div class="grid2"><button class="btn small ghost" id="cv-s">⇤ Start = jetzt</button><button class="btn small ghost" id="cv-e">Ende = jetzt ⇥</button></div>
      <button class="btn small ghost" id="cv-m">📍 Wichtiger Moment (z.B. hier verloren)</button><div class="chips" id="cv-marks"></div>
      <div class="grid2"><label>Modus<select id="cv-k">${KITS.map(x=>`<option ${x===k?"selected":""}>${x}</option>`).join("")}</select></label><label>Ergebnis<select id="cv-r"><option value="">–</option><option value="W">Gewonnen</option><option value="L">Verloren</option></select></label></div>
      <div class="grid2"><label>Gegner<input id="cv-o" placeholder="optional"></label><label>Medal-Link<input id="cv-l" type="url" inputmode="url" placeholder="optional"></label></div>
      <label>Worauf soll Claude achten?<textarea id="cv-q" rows="2" placeholder="z.B. Warum verliere ich die Trades? Habe ich meine Taktik umgesetzt?"></textarea></label>
      <button class="btn" id="cv-go">Analysieren</button>
      <p class="note">Claude bekommt ${maxN} Standbilder aus dem gewählten Bereich, keine Bewegung und keinen Ton. Für Timing-Fragen setz 📍 auf die wichtigen Momente. Das Video selbst wird nicht gespeichert.</p>
    </div>
    <div id="cv-prog" hidden><p><span class="spin"></span><span id="cv-pt">Bilder werden ausgeschnitten …</span></p><div class="bar"><i id="cv-pb" style="width:0%"></i></div></div>`,(host,close)=>{
    const v=$("#cv-v");
    const info=()=>{$("#cv-info").textContent=`Bereich ${fmtS(a)} – ${fmtS(b)} (${Math.round(b-a)} Sek.) von ${fmtS(dur)}. ${b-a>90?"Tipp: Kürzer = genauere Analyse.":""}`;
      $("#cv-marks").innerHTML=marks.map((m,i)=>`<button data-mk="${i}">📍 ${fmtS(m)} ×</button>`).join("");
      host.querySelectorAll("[data-mk]").forEach(x=>x.onclick=()=>{marks.splice(+x.dataset.mk,1);info()})};
    $("#cv-file").onchange=e=>{const f=e.target.files[0];if(!f)return;if(url)URL.revokeObjectURL(url);url=URL.createObjectURL(f);v.src=url;
      v.onloadedmetadata=()=>{dur=v.duration;if(!isFinite(dur)||!dur){toast("Video konnte nicht gelesen werden");return}a=0;b=dur<=90?dur:Math.min(dur,60);$("#cv-body").hidden=false;info()};
      v.onerror=()=>toast("Dieses Video-Format geht nicht. Versuch ein MP4.")};
    $("#cv-s").onclick=()=>{a=Math.min(v.currentTime,b-1);info()};
    $("#cv-e").onclick=()=>{b=Math.max(v.currentTime,a+1);info()};
    $("#cv-m").onclick=()=>{marks.push(Math.round(v.currentTime*10)/10);marks.sort((x,y)=>x-y);info()};
    $("#cv-go").onclick=async()=>{
      const kit=$("#cv-k").value,res=$("#cv-r").value,opp=$("#cv-o").value.trim(),focus=$("#cv-q").value.trim(),lk=$("#cv-l").value.trim(),link=/^https:\/\//.test(lk)?lk:"";
      $("#cv-body").hidden=true;$("#cv-prog").hidden=false;$(".filebtn").hidden=true;
      let frames;
      try{frames=await grabFrames(v,frameTimes(a,b,marks,maxN),lim.images.maxInputBytes,p=>{$("#cv-pb").style.width=Math.round(p*40)+"%"})}
      catch(e){toast("Video konnte nicht gelesen werden. Versuch ein MP4 (H.264).");$("#cv-body").hidden=false;$("#cv-prog").hidden=true;$(".filebtn").hidden=false;return}
      $("#cv-pt").textContent="Claude schaut sich den Fight an … (kann 30–60 Sek. dauern)";$("#cv-pb").style.width="55%";
      const tacs=S().tactics.filter(t=>t.kit===kit);
      const prompt=`Du bist ein erfahrener Minecraft-PvP-Coach (Java 1.21, MCTiers-Modi). Du bekommst ${frames.length} Standbilder aus einem Fight-Clip von ${S().ign}, Modus ${kit}. Die Bilder sind in zeitlicher Reihenfolge:
${frames.map((f,i)=>`Bild ${i+1} = ${fmtS(f.t)}`).join("\n")}
${marks.length?"Der Spieler hat diese Momente als wichtig markiert: "+marks.map(fmtS).join(", "):""}
Ergebnis: ${res==="W"?"gewonnen":res==="L"?"verloren":"unbekannt"}.${opp?" Gegner: "+opp+".":""}
${focus?"Frage des Spielers: "+focus:""}
${level(kit)} Bewerte auf diesem Niveau – keine Anfänger-Tipps. Benutze seine Begriffe für Techniken.
Seine Taktiken für ${kit}: ${tacs.length?JSON.stringify(tacs.map(t=>({name:t.name,wann:t.when,schritte:t.steps}))):"keine"}
Achte auf: Abstand und Positionierung, Fadenkreuz und Blickrichtung, Item in der Hand und Hotbar, Leben, Rüstung, Hunger, Effekte, Höhe und Umgebung, und was sich zwischen den Bildern verändert.
Sei ehrlich, konkret und hilfreich. Was man auf Standbildern nicht sicher erkennt (z.B. Klick-Timing, CPS), schreib unter "unsicher" statt zu raten. Wenn die Bilder kein Minecraft-PvP zeigen, sag das in "zusammenfassung" und lass die Listen leer.
Antworte NUR mit JSON, Deutsch mit Schweizer Schreibweise (ss):
{"zusammenfassung":"2-3 Sätze","note":Zahl 1-10,"fehler":[{"bild":Nummer,"titel":"kurz","was":"was passiert ist","besser":"was du stattdessen machen solltest"}],"gut":["..."],"taktik_check":"Hat er seine Taktiken umgesetzt? Leer, wenn er keine hat.","taktik":{"name":"...","wann":"...","schritte":["..."],"konter":"..."},"drill":"ein konkreter Drill","unsicher":"..."}
Höchstens 5 Fehler, die wichtigsten zuerst.`;
      try{
        const an=await App.sample.json(prompt,{images:frames.map(f=>f.blob),modelTier:"complex"});
        $("#cv-pb").style.width="100%";
        const id=uid();
        const title=`${kit}${opp?" vs "+opp:""}${res?" · "+(res==="W"?"Win":"Loss"):""}`;
        await clips.put(id,{ts:Date.now(),kit,result:res,opp,focus,link,title,range:[a,b],marks,frames:frames.map(f=>({t:f.t,img:f.img})),analysis:an,qa:[]});
        if(url)URL.revokeObjectURL(url);
        close();S().mode=kit;doc.save();tab="clips";sub="clip/"+id;render();scrollTo(0,0);toast("Analyse fertig");
      }catch(e){
        const msg=e&&e.code==="not_granted"?"Du musst erlauben, dass die App Bilder an Claude schickt.":e&&e.code==="rate_limited"?"Zu viele Anfragen – kurz warten und nochmals.":e&&e.code==="image_rejected"?"Claude hat die Bilder abgelehnt (zu gross?). Wähl einen kürzeren Bereich.":"Analyse fehlgeschlagen. Versuch es nochmals.";
        toast(msg);$("#cv-body").hidden=false;$("#cv-prog").hidden=true;$(".filebtn").hidden=false;
      }
    };
  });
}
async function askClip(c,q){
  if(!App.sample)return;qaBusy=true;render();
  try{const r=await App.sample(`Du bist ein Minecraft-PvP-Coach. Das sind Standbilder (in zeitlicher Reihenfolge: ${(c.frames||[]).map((f,i)=>"Bild "+(i+1)+" = "+fmtS(f.t)).join(", ")}) aus einem ${c.kit}-Fight von ${S().ign}. Deine frühere Analyse: ${JSON.stringify(c.analysis)}
Bisherige Fragen: ${JSON.stringify(c.qa||[])}
Neue Frage: ${q}
Antworte kurz und konkret auf Deutsch (Schweizer Schreibweise, ss), ohne Markdown-Überschriften.`,{images:(c.frames||[]).slice(0,12).map(f=>dataURLtoBlob(f.img)),modelTier:"default",cache:false});
    const qa=[...(c.qa||[]),{q,a:r.text}];const {id,...data}=c;await clips.put(c.id,{...data,qa});}
  catch(e){toast("Hat nicht geklappt. Versuch es nochmals.")}
  qaBusy=false;render();
}
register({id:"training",title:"Training",icon:"training",doc,col:clips,view,bind,tick,summary});
})();
