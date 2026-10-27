/* ================= Grundfunktionen ================= */
const $=s=>document.querySelector(s);
const $$=s=>[...document.querySelectorAll(s)];
const esc=t=>String(t??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid=()=>Math.random().toString(36).slice(2,10);
const pad=n=>String(n).padStart(2,"0");
const dkey=d=>{d=new Date(d);return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())};
const ym=d=>d.getFullYear()+"-"+pad(d.getMonth()+1);
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
const chf=(n,d=0)=>(n<0?"−":"")+Math.abs(n).toLocaleString("de-CH",{minimumFractionDigits:d,maximumFractionDigits:d});
function toast(t){if(!t)return;const e=document.createElement("div");e.className="toast";e.textContent=t;document.body.append(e);setTimeout(()=>e.remove(),2000)}
function mondayOf(d){d=new Date(d);d.setHours(0,0,0,0);d.setDate(d.getDate()-((d.getDay()+6)%7));return d}
const WD=["Mo","Di","Mi","Do","Fr","Sa","So"];

const ICONS={
 home:'<path d="M3 11l9-7 9 7v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z"/>',
 budget:'<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18M16 15h2"/>',
 film:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 9h18M8 5v4M16 5v4"/>',
 training:'<path d="M12 3c-1 3-4 4-4 8a4 4 0 0 0 8 0c0-2-1-3-1-3s-1 2-2 2c0-3 1-5-1-7z"/><path d="M6 21h12"/>',
 ziele:'<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4"/><circle cx="12" cy="12" r="1"/>',
 timer:'<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2 2M9 2h6"/>',book:'<path d="M4 4h7a3 3 0 0 1 3 3v13a2 2 0 0 0-2-2H4zM20 4h-3a3 3 0 0 0-3 3"/>',cal:'<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M3 9h18M8 2v4M16 2v4"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',mouse:'<rect x="6" y="3" width="12" height="18" rx="6"/><path d="M12 7v4"/>',list:'<path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01"/>',
 chart:'<path d="M4 20h4v-6H4zM10 20h4V9h-4zM16 20h4V4h-4z"/>',ladder:'<path d="M7 3v18M17 3v18M7 7h10M7 12h10M7 17h10"/>',flag:'<path d="M5 21V4h11l-2 4 2 4H5"/>',
 users:'<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3 3-5 6-5s6 2 6 5M16 5a3 3 0 0 1 0 6M21 20c0-2-1-4-3-5"/>',chat:'<path d="M4 5h16v11H8l-4 4z"/>',
 eye:'<path d="M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>',brain:'<path d="M9 4a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 2 5 3 3 0 0 0 6 1V5a3 3 0 0 0-3-1zM15 4a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-2 5 3 3 0 0 1-6 1"/>',
 grid:'<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/>',gear:'<circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2"/>',
 server:'<rect x="3" y="4" width="18" height="7" rx="1"/><rect x="3" y="13" width="18" height="7" rx="1"/><path d="M7 8h.01M7 17h.01"/>',flame:'<path d="M12 3c-1 3-4 4-4 8a4 4 0 0 0 8 0c0-2-1-3-1-3s-1 2-2 2c0-3 1-5-1-7z"/>'
};
const svg=n=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${ICONS[n]||""}</svg>`;
const ico=n=>`<span class="ico">${svg(n)}</span>`;

/* ================= Verbindung zu Claude ================= */
const App={db:null,user:null,sample:null,me:null,cloud:false,names:{},mods:{},order:[],cur:"home",tick:null};
async function getClaude(){for(let i=0;i<25;i++){if(window.claude&&window.claude.use)return window.claude;await new Promise(r=>setTimeout(r,100))}return null}

/* Privates Dokument: nur der Besitzer sieht es (data/users/<id>/<name>) */
class PrivateDoc{
  constructor(name,upgrade){this.name=name;this.upgrade=upgrade||(x=>x);this.S=null;this.loaded=false;this.ref=null;this.timer=null;this.saving=false;this.again=false}
  start(){
    if(App.cloud){
      this.ref=App.db.collection("data/users/"+App.me).doc(this.name);
      this.ref.onSnapshot(s=>{if(this.timer||this.saving)return;this.S=s.exists?this.upgrade(structuredClone(s.data())):null;this.loaded=true;rerender()},()=>{this.ref=null;this.local()});
    } else this.local();
  }
  local(){try{const r=localStorage.getItem("own-"+this.name);this.S=r?this.upgrade(JSON.parse(r)):null}catch(e){this.S=null}this.loaded=true;rerender()}
  save(){
    if(!this.ref){try{this.S===null?localStorage.removeItem("own-"+this.name):localStorage.setItem("own-"+this.name,JSON.stringify(this.S))}catch(e){}return}
    clearTimeout(this.timer);this.timer=setTimeout(()=>this.flush(),450);
  }
  async flush(){
    this.timer=null;if(this.saving){this.again=true;return}
    this.saving=true;
    try{this.S===null?await this.ref.delete():await this.ref.set(JSON.parse(JSON.stringify(this.S)))}catch(e){toast("Speichern fehlgeschlagen – bitte nochmals versuchen")}
    this.saving=false;if(this.again){this.again=false;this.flush()}
  }
}
/* Geteilte Sammlung: alle mit Zugriff auf die App sehen sie */
class SharedCol{
  constructor(path){this.path=path;this.items=[];this.loaded=false;this.col=null}
  start(){
    if(App.cloud){this.col=App.db.collection(this.path);
      this.col.onSnapshot(s=>{this.items=s.docs.map(d=>({id:d.id,...d.data()}));this.loaded=true;resolveNames(this.items);rerender()},()=>{this.col=null;this.local()});}
    else this.local();
  }
  local(){try{this.items=JSON.parse(localStorage.getItem("own-"+this.path)||"[]")}catch(e){this.items=[]}this.loaded=true;rerender()}
  persist(){try{localStorage.setItem("own-"+this.path,JSON.stringify(this.items))}catch(e){}rerender()}
  async add(data,id){
    if(this.col){try{id?await this.col.doc(id).set(data):await this.col.add(data);return true}catch(e){toast(e&&e.code==="permission_denied"?"Keine Berechtigung zum Speichern":"Konnte nicht speichern");return false}}
    const i=id||uid();this.items=this.items.filter(x=>x.id!==i);this.items.push({id:i,...data});this.persist();return true;
  }
  async set(id,data){return this.add(data,id)}
  async update(id,data){
    if(this.col){try{await this.col.doc(id).update(data);return true}catch(e){toast("Konnte nicht speichern");return false}}
    const m=this.items.find(x=>x.id===id);if(m){for(const k in data){if(data[k]&&typeof data[k]==="object"&&!Array.isArray(data[k])&&m[k]&&typeof m[k]==="object")Object.assign(m[k],data[k]);else m[k]=data[k]}}this.persist();return true;
  }
  async remove(id){if(this.col){try{await this.col.doc(id).delete()}catch(e){}return}this.items=this.items.filter(x=>x.id!==id);this.persist()}
}
async function resolveNames(items){
  if(!App.user)return;
  const ids=[...new Set(items.flatMap(m=>[m.addedBy,m.owner,...Object.keys(m.ratings||{})]).filter(x=>x&&x.startsWith("u_")))].filter(id=>!(id in App.names));
  if(!ids.length)return;
  try{const ps=await App.user.profiles(ids);let ch=false;for(const id of ids){const p=ps[id];const n=p&&p.isMe?"Du":((p&&p.name)||"");App.names[id]=n;ch=true}if(ch)rerender()}catch(e){}
}
const who=id=>!id?"":id===App.me?"Du":(App.names[id]||"Jemand");

/* ================= Navigation & Rendern ================= */
function register(mod){App.mods[mod.id]=mod;App.order.push(mod.id)}
let pendingRender=false,rafId=0;
function typing(){const a=document.activeElement;return a&&$("#root").contains(a)&&(a.tagName==="TEXTAREA"||(a.tagName==="INPUT"&&!["button","checkbox","radio","date","time"].includes(a.type)))}
function rerender(){if(typing()){pendingRender=true;return}cancelAnimationFrame(rafId);rafId=requestAnimationFrame(render)}
document.addEventListener("focusout",()=>setTimeout(()=>{if(pendingRender&&!typing()){pendingRender=false;render()}},50));
function go(id){if(!App.mods[id])id="home";App.cur=id;try{if(location.hash.slice(1)!==id)location.hash=id}catch(e){}render();scrollTo(0,0)}
window.addEventListener("hashchange",()=>{const h=location.hash.slice(1);if(App.mods[h]&&h!==App.cur){App.cur=h;render();scrollTo(0,0)}});
function render(){
  const m=App.mods[App.cur];
  document.body.dataset.mod=App.cur;
  $$(".nav button").forEach(b=>b.setAttribute("aria-current",b.dataset.go===App.cur?"page":"false"));
  $("#root").innerHTML=m.view();
  const fab=$("#fab");fab.hidden=!m.fab||!m.fab();
  if(m.bind)m.bind();
  clearInterval(App.tick);if(m.tick)App.tick=setInterval(m.tick,250);
}
function sheet(html,onOpen){
  const host=$("#sheetHost");
  host.innerHTML=`<div class="sheet" id="sh"><div role="dialog">${html}</div></div>`;
  const close=()=>host.innerHTML="";
  $("#sh").onclick=e=>{if(e.target.id==="sh")close()};
  host.querySelectorAll("[data-close]").forEach(b=>b.onclick=close);
  if(onOpen)onOpen(host,close);
  return close;
}
function seg(items,cur,attr){return `<div class="seg" role="tablist">${items.map(([k,l])=>`<button data-${attr}="${k}" aria-pressed="${k===cur}">${l}</button>`).join("")}</div>`}
function copyText(text,el){navigator.clipboard.writeText(text).then(()=>toast("Kopiert")).catch(()=>{if(el){const r=document.createRange();r.selectNodeContents(el);const s=getSelection();s.removeAllRanges();s.addRange(r)}toast("Text markiert – jetzt kopieren")})}
