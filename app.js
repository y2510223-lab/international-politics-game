import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getDatabase, ref, set, get, update, push, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const ROUND_SECONDS = 90;
const MAX_ROUNDS = 8;
const AP_PER_ROUND = 3;

const NATIONS = {
  auroria: {
    name:"아우로리아 연방", role:"군사 강국",
    desc:"막강한 군사력을 지녔지만 주변국은 당신의 움직임을 위협으로 해석합니다.",
    military:85,economy:58,influence:62,trust:38,
    goals:[
      ["군사력 90 이상", c=>c.military>=90],
      ["영향력 65 이상", c=>c.influence>=65],
      ["세계 긴장도 90 미만", c=>c.worldTension<90]
    ]
  },
  belvar: {
    name:"벨바르 공화국", role:"경제 강국",
    desc:"무역망과 금융 영향력이 강하지만 전쟁이 길어질수록 큰 손해를 봅니다.",
    military:48,economy:88,influence:72,trust:63,
    goals:[
      ["경제력 85 이상", c=>c.economy>=85],
      ["신뢰도 60 이상", c=>c.trust>=60],
      ["세계 긴장도 70 미만", c=>c.worldTension<70]
    ]
  },
  cyrene: {
    name:"키레네 왕국", role:"자원 강국",
    desc:"에너지와 해협 접근권을 쥐고 있어 모든 강대국이 당신을 주시합니다.",
    military:55,economy:70,influence:58,trust:52,
    goals:[
      ["경제력 80 이상", c=>c.economy>=80],
      ["영향력 60 이상", c=>c.influence>=60],
      ["동시에 전쟁 중인 상대 1개 이하", c=>c.warCount<=1]
    ]
  },
  doran: {
    name:"도란 중립연합", role:"외교 강국",
    desc:"군사력은 약하지만 높은 국제 신뢰와 협상력을 가집니다.",
    military:36,economy:61,influence:84,trust:82,
    goals:[
      ["신뢰도 80 이상", c=>c.trust>=80],
      ["세계 긴장도 65 미만", c=>c.worldTension<65],
      ["전쟁 선포 0회", c=>c.warsDeclared===0]
    ]
  }
};

const STORY = [
  {round:1,title:"제1막 · 충돌",phase:"불안",event:"해협 경비정 충돌",body:"아르덴 해협에서 정체불명의 무장 세력과 경비정이 충돌했습니다. 책임 소재는 밝혀지지 않았고 각국은 서로를 의심하고 있습니다.",delta:3},
  {round:2,title:"제2막 · 선전전",phase:"의심",event:"민간인 피해 영상 확산",body:"민간인 피해를 담았다는 영상이 전 세계에 퍼졌습니다. 원본 여부는 확인되지 않았지만 각국 여론은 빠르게 악화되고 있습니다.",delta:5},
  {round:3,title:"제3막 · 에너지 위기",phase:"압박",event:"대형 유조선 피격",body:"해협 중앙에서 대형 유조선이 피격됐습니다. 공격 주체는 불명확하며 원유 가격과 보험료가 폭등하기 시작했습니다.",delta:8},
  {round:4,title:"제4막 · 동맹의 선택",phase:"분열",event:"비밀 군사협정 문서 유출",body:"한 국가가 비밀 군사협정을 추진했다는 문서가 유출됐습니다. 진위는 확인되지 않았지만 기존의 약속들이 흔들리고 있습니다.",delta:6},
  {round:5,title:"제5막 · 오인 경보",phase:"위기",event:"미사일 발사 경보",body:"조기경보망이 미사일 발사 징후를 포착했습니다. 몇 분 뒤 오인 가능성이 제기됐지만 이미 여러 국가의 군이 경계태세에 들어갔습니다.",delta:12},
  {round:6,title:"제6막 · 시장 붕괴",phase:"붕괴",event:"국제 금융시장 급락",body:"전쟁 우려가 현실 경제를 덮쳤습니다. 금융시장과 에너지 시장이 동반 급락하며 강대국들도 국내 압력에서 자유롭지 못합니다.",delta:7},
  {round:7,title:"제7막 · 핵 그림자",phase:"극한",event:"전술핵 배치 정보 유출",body:"한 국가가 전술핵을 전진 배치했다는 정보가 공개됐습니다. 사실 여부와 무관하게 세계는 최악의 시나리오를 준비하기 시작합니다.",delta:14},
  {round:8,title:"최종막 · 마지막 외교",phase:"결단",event:"긴급 정상회의",body:"국제사회가 마지막 정상회의를 소집했습니다. 회의장 안에서는 평화를 말하지만, 회의장 밖에서는 병력 이동과 비밀 협상이 계속되고 있습니다.",delta:-4}
];

const $ = id => document.getElementById(id);
const screens = ["setupScreen","lobbyScreen","gameScreen","resultScreen"];
let app,auth,db,user,roomCode=null,roomUnsub=null,currentRoom=null;
let timerHandle=null,lastMajorSeen=null,advanceLock=false;

function showScreen(id){ screens.forEach(s=>$(s).classList.toggle("active",s===id)); }
function toast(msg){ $("toast").textContent=msg; $("toast").classList.add("show"); setTimeout(()=>$("toast").classList.remove("show"),1800); }
function safeName(){ return ($("playerName").value.trim()||"익명 외교관").slice(0,18); }
function makeRoomCode(){ const chars="ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; return Array.from({length:6},()=>chars[Math.floor(Math.random()*chars.length)]).join(""); }
function getNation(id){ return NATIONS[id]||null; }
function getStory(round){ return STORY.find(x=>x.round===round)||STORY[STORY.length-1]; }
function esc(v=""){ return String(v).replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;"); }
function clamp(v){ return Math.max(0,Math.min(100,v)); }

async function bootstrap(){
  try{
    app=initializeApp(firebaseConfig); auth=getAuth(app); db=getDatabase(app);
    $("authStatus").textContent="Firebase 연결 중";
    onAuthStateChanged(auth,u=>{ if(u){ user=u; $("authStatus").textContent="온라인"; } });
    await signInAnonymously(auth);
  }catch(err){ console.error(err); $("authStatus").textContent="Firebase 설정 필요"; toast("Firebase 연결을 확인해주세요."); }
}

async function createRoom(){
  if(!user) return toast("Firebase 연결을 확인해주세요.");
  let code; for(let i=0;i<5;i++){ code=makeRoomCode(); if(!(await get(ref(db,`rooms/${code}`))).exists()) break; }
  roomCode=code; const now=Date.now();
  await set(ref(db,`rooms/${code}`),{
    meta:{hostUid:user.uid,status:"lobby",createdAt:now,scenario:"strait_crisis"},
    world:{round:1,tension:25,roundDeadline:null,latestEvent:null,ended:false},
    players:{[user.uid]:{name:safeName(),nationId:"",joinedAt:now,ap:AP_PER_ROUND,stats:{}}},
    feed:{system0:{type:"system",typeLabel:"SYSTEM",text:`${safeName()} 님이 협상장을 열었습니다.`,at:now}}
  });
  enterRoom();
}

async function joinRoom(){
  if(!user) return toast("Firebase 연결을 확인해주세요.");
  const code=$("roomCodeInput").value.trim().toUpperCase(); if(!code) return toast("방 코드를 입력해주세요.");
  const snap=await get(ref(db,`rooms/${code}`)); if(!snap.exists()) return toast("존재하지 않는 방입니다.");
  const room=snap.val(); roomCode=code;
  const old=room.players?.[user.uid];
  await set(ref(db,`rooms/${code}/players/${user.uid}`),old?{...old,name:safeName()}:{name:safeName(),nationId:"",joinedAt:Date.now(),ap:AP_PER_ROUND,stats:{}});
  await push(ref(db,`rooms/${code}/feed`),{type:"system",typeLabel:"SYSTEM",text:`${safeName()} 님이 협상장에 들어왔습니다.`,at:Date.now()});
  enterRoom();
}

function enterRoom(){
  $("roomBadge").textContent=`ROOM ${roomCode}`; $("roomBadge").classList.remove("hidden"); showScreen("lobbyScreen");
  if(roomUnsub) roomUnsub(); roomUnsub=onValue(ref(db,`rooms/${roomCode}`),renderRoom);
}

function renderRoom(snapshot){
  const room=snapshot.val(); if(!room||!user) return; currentRoom=room;
  if(room.meta.status==="lobby"){ showScreen("lobbyScreen"); renderLobby(room); stopTimer(); }
  else if(room.world?.ended || room.meta.status==="finished"){ showScreen("resultScreen"); renderResults(room); stopTimer(); }
  else{ showScreen("gameScreen"); renderGame(room); startTimer(); }
}

function renderLobby(room){
  const players=room.players||{},taken=new Map(); Object.entries(players).forEach(([uid,p])=>{ if(p.nationId) taken.set(p.nationId,uid); });
  $("nationCards").innerHTML=Object.entries(NATIONS).map(([id,n])=>{
    const owner=taken.get(id),mine=owner===user.uid,unavailable=owner&&!mine;
    return `<div class="nation ${mine?"selected":""} ${unavailable?"taken":""}"><p class="eyebrow">${n.role}</p><h3>${n.name}</h3><p class="hint">${n.desc}</p><div class="stats"><span>군사 ${n.military}</span><span>경제 ${n.economy}</span><span>영향 ${n.influence}</span><span>신뢰 ${n.trust}</span></div><button ${unavailable?"disabled":""} data-nation="${id}">${mine?"선택됨":unavailable?"다른 플레이어가 선택":"이 국가 선택"}</button></div>`;
  }).join("");
  document.querySelectorAll("[data-nation]").forEach(b=>b.addEventListener("click",()=>claimNation(b.dataset.nation)));
  $("lobbyPlayers").innerHTML=Object.entries(players).map(([uid,p])=>`<div class="player-row"><strong>${esc(p.name)}</strong><div class="hint">${p.nationId?getNation(p.nationId)?.name:"국가 선택 중"} ${uid===room.meta.hostUid?"· 방장":""}</div></div>`).join("");
  const isHost=room.meta.hostUid===user.uid; $("startGameBtn").classList.toggle("hidden",!isHost); $("hostNotice").classList.toggle("hidden",isHost);
  const ps=Object.values(players),ready=ps.length>=2&&ps.every(p=>p.nationId); $("startGameBtn").disabled=!ready; $("startGameBtn").textContent=ps.length<2?"최소 2명 필요":"게임 시작";
}

async function claimNation(nationId){
  const res=await runTransaction(ref(db,`rooms/${roomCode}`),room=>{
    if(!room||room.meta.status!=="lobby") return room;
    const occupied=Object.entries(room.players||{}).some(([uid,p])=>uid!==user.uid&&p.nationId===nationId); if(occupied) return;
    room.players[user.uid].nationId=nationId; return room;
  });
  if(!res.committed) toast("이미 선택된 국가입니다.");
}

async function startGame(){
  const room=(await get(ref(db,`rooms/${roomCode}`))).val(); if(!room||room.meta.hostUid!==user.uid) return;
  const ps=Object.values(room.players||{}); if(ps.length<2||ps.some(p=>!p.nationId)) return toast("모든 플레이어가 국가를 선택해야 합니다.");
  const now=Date.now(), states={},updates={"meta/status":"playing","world/round":1,"world/tension":28,"world/roundDeadline":now+ROUND_SECONDS*1000,"world/ended":false};
  ps.forEach(p=>{ const n=getNation(p.nationId); states[p.nationId]={military:n.military,economy:n.economy,influence:n.influence,trust:n.trust,atWarWith:{}}; });
  updates.nationState=states;
  Object.keys(room.players).forEach(uid=>{ updates[`players/${uid}/ap`]=AP_PER_ROUND; updates[`players/${uid}/stats`]={statements:0,treaties:0,aid:0,sanctions:0,military:0,wars:0,privateMessages:0}; });
  const s=getStory(1); updates["world/latestEvent"]={title:s.event,body:s.body,type:"story",at:now};
  await update(ref(db,`rooms/${roomCode}`),updates);
  await push(ref(db,`rooms/${roomCode}/feed`),{type:"story",major:true,typeLabel:"메인 사건",text:`${s.event} — ${s.body}`,round:1,at:now});
}

function renderGame(room){
  const mine=room.players?.[user.uid]; if(!mine?.nationId) return;
  const n=getNation(mine.nationId),s=room.nationState?.[mine.nationId]||n,round=room.world?.round||1,story=getStory(round),t=clamp(room.world?.tension??25);
  $("roundValue").textContent=`${round} / ${MAX_ROUNDS}`; $("apValue").textContent=`${mine.ap??0} / ${AP_PER_ROUND}`; $("tensionValue").textContent=t; $("tensionBar").style.width=`${t}%`;
  $("trustValue").textContent=s.trust; $("influenceValue").textContent=s.influence; $("militaryValue").textContent=s.military; $("economyValue").textContent=s.economy;
  $("myNationCard").innerHTML=`<p class="eyebrow">${n.role}</p><h2>${n.name}</h2><p class="hint">8라운드 종료 후 목표 체크리스트와 다차원 평가가 공개됩니다.</p>`;
  $("scenarioTitle").textContent=story.title; $("phaseBadge").textContent=story.phase; $("scenarioDesc").textContent=story.body;
  const ev=room.world?.latestEvent; $("latestEvent").innerHTML=ev?`<strong>${esc(ev.title)}</strong><br>${esc(ev.body)}`:"";
  const options=Object.entries(room.players||{}).filter(([uid,p])=>uid!==user.uid&&p.nationId).map(([uid,p])=>`<option value="${p.nationId}">${getNation(p.nationId).name} — ${esc(p.name)}</option>`).join("");
  ["publicTarget","privateTarget","militaryTarget"].forEach(id=>$(id).innerHTML=options||`<option value="">대상 없음</option>`);
  $("worldStates").innerHTML=Object.values(room.players||{}).filter(p=>p.nationId).map(p=>{ const nn=getNation(p.nationId),ss=room.nationState?.[p.nationId]||nn,wars=Object.keys(ss.atWarWith||{}).filter(k=>ss.atWarWith[k]).map(k=>getNation(k)?.name).join(", "); return `<div class="world-state"><div class="state-head"><strong>${nn.name}</strong><span>${esc(p.name)}</span></div><div class="state-sub">군 ${ss.military} · 경제 ${ss.economy} · 영향 ${ss.influence} · 신뢰 ${ss.trust}</div>${wars?`<div class="state-sub">⚔ 전쟁 중: ${wars}</div>`:""}</div>`; }).join("");
  renderFeed(room.feed||{}); renderPrivate(room.privateMessages||{},mine.nationId); renderChecklist(room,mine);
  document.querySelectorAll("[data-action]").forEach(btn=>{ const a=btn.dataset.action,cost=a==="war"?2:(a==="statement"?0:1); btn.disabled=(mine.ap??0)<cost; });
  maybeShowMajor(room.feed||{});
}

function renderChecklist(room,mine){
  const n=NATIONS[mine.nationId],s=room.nationState[mine.nationId],ctx={...s,worldTension:room.world.tension,warCount:Object.values(s.atWarWith||{}).filter(Boolean).length,warsDeclared:mine.stats?.wars||0};
  $("liveChecklist").innerHTML=n.goals.map(([label,fn])=>`<div class="check-item ${fn(ctx)?"ok":"no"}">${fn(ctx)?"✓":"○"} ${label}</div>`).join("");
}

function renderFeed(feed){
  const arr=Object.entries(feed).map(([id,x])=>({id,...x})).sort((a,b)=>(a.at||0)-(b.at||0));
  $("worldFeed").innerHTML=arr.slice(-100).map(i=>`<div class="feed-item ${i.major?"major":""} ${["war","sanction"].includes(i.type)?"danger":""} ${["aid","treaty"].includes(i.type)?"good":""}"><div class="feed-meta">ROUND ${i.round||"-"} · ${esc(i.typeLabel||"SYSTEM")}</div><div>${esc(i.text||"")}</div></div>`).join("");
}

function renderPrivate(messages,myNationId){
  const arr=Object.values(messages).filter(m=>m.from===myNationId||m.to===myNationId).sort((a,b)=>(a.at||0)-(b.at||0));
  $("privateInbox").innerHTML=arr.slice(-30).map(m=>`<div class="private-msg"><div class="feed-meta">${getNation(m.from)?.name} → ${getNation(m.to)?.name}</div>${esc(m.text)}</div>`).join("");
}

function maybeShowMajor(feed){
  const majors=Object.entries(feed).map(([id,x])=>({id,...x})).filter(x=>x.major).sort((a,b)=>(a.at||0)-(b.at||0)); if(!majors.length) return;
  const latest=majors[majors.length-1]; if(lastMajorSeen===latest.id) return; lastMajorSeen=latest.id; showMajor(latest);
}
function showMajor(item){
  const card=$("majorOverlayCard"); card.className="major-card "+(item.type==="war"?"war":item.type==="story"?"story":"statement");
  $("majorEyebrow").textContent=item.type==="war"?"WAR DECLARATION":item.type==="story"?"BREAKING STORY":"OFFICIAL ACTION";
  $("majorTitle").textContent=item.typeLabel||"주요 사건"; $("majorBody").textContent=item.text; $("majorOverlay").classList.remove("hidden");
}

function startTimer(){
  if(timerHandle) return;
  timerHandle=setInterval(async()=>{
    const room=currentRoom; if(!room||room.world?.ended) return;
    const left=Math.max(0,Math.ceil(((room.world.roundDeadline||Date.now())-Date.now())/1000));
    $("timerValue").textContent=`${String(Math.floor(left/60)).padStart(2,"0")}:${String(left%60).padStart(2,"0")}`;
    if(room.meta.hostUid!==user.uid||advanceLock) return;
    const allSpent=Object.values(room.players||{}).length>0&&Object.values(room.players||{}).every(p=>(p.ap??0)<=0);
    if(left<=0||allSpent){ advanceLock=true; try{ await advanceRound(); }finally{ setTimeout(()=>advanceLock=false,800); } }
  },500);
}
function stopTimer(){ if(timerHandle){ clearInterval(timerHandle); timerHandle=null; } }

async function spendAP(cost){
  if(cost===0) return true;
  const res=await runTransaction(ref(db,`rooms/${roomCode}/players/${user.uid}/ap`),v=>{ v=v??0; if(v<cost) return; return v-cost; });
  if(!res.committed){ toast("행동력이 부족합니다."); return false; } return true;
}
async function bumpStat(key){ await runTransaction(ref(db,`rooms/${roomCode}/players/${user.uid}/stats/${key}`),v=>(v||0)+1); }

async function doPublicAction(action){
  const target=$("publicTarget").value,text=$("publicMessage").value.trim(); if(!target) return toast("대상 국가가 없습니다.");
  const cost=action==="statement"?0:1; if(!(await spendAP(cost))) return;
  const room=(await get(ref(db,`rooms/${roomCode}`))).val(),from=room.players[user.uid].nationId,fn=getNation(from).name,tn=getNation(target).name,round=room.world.round;
  let label,feedText,delta=0,major=false; const ups={};
  if(action==="statement"){ label="공식 성명"; feedText=`${fn}: “${text||"국제사회에 자제를 촉구한다."}”`; major=true; await bumpStat("statements"); }
  else if(action==="treaty"){ label="협정 제안"; feedText=`${fn}이(가) ${tn}에 협정을 제안했다. ${text?`조건: “${text}”`:""}`; delta=-2; ups[`nationState/${from}/trust`]=clamp(room.nationState[from].trust+2); await bumpStat("treaties"); }
  else if(action==="aid"){ label="경제 원조"; feedText=`${fn}이(가) ${tn}에 경제 원조를 제공했다. ${text||""}`; ups[`nationState/${from}/economy`]=clamp(room.nationState[from].economy-4); ups[`nationState/${target}/economy`]=clamp(room.nationState[target].economy+5); ups[`nationState/${from}/influence`]=clamp(room.nationState[from].influence+3); delta=-1; await bumpStat("aid"); }
  else{ label="경제 제재"; feedText=`${fn}이(가) ${tn}에 경제 제재를 발표했다. ${text||""}`; ups[`nationState/${target}/economy`]=clamp(room.nationState[target].economy-5); ups[`nationState/${from}/trust`]=clamp(room.nationState[from].trust-2); delta=5; major=true; await bumpStat("sanctions"); }
  if(delta) ups["world/tension"]=clamp(room.world.tension+delta); await update(ref(db,`rooms/${roomCode}`),ups);
  await push(ref(db,`rooms/${roomCode}/feed`),{type:action,major,typeLabel:label,text:feedText,round,at:Date.now()}); $("publicMessage").value="";
}

async function sendPrivate(){
  const target=$("privateTarget").value,text=$("privateMessage").value.trim(); if(!target||!text) return toast("대상과 메시지를 입력해주세요.");
  const room=(await get(ref(db,`rooms/${roomCode}`))).val(),from=room.players[user.uid].nationId;
  await push(ref(db,`rooms/${roomCode}/privateMessages`),{from,to:target,text,at:Date.now()}); await bumpStat("privateMessages"); $("privateMessage").value=""; toast("암호 전문을 전송했습니다.");
}

async function doMilitary(action){
  const target=$("militaryTarget").value; if(!target) return toast("대상 국가가 없습니다.");
  const cost=action==="war"?2:1; if(!(await spendAP(cost))) return;
  const room=(await get(ref(db,`rooms/${roomCode}`))).val(),from=room.players[user.uid].nationId,fn=getNation(from).name,tn=getNation(target).name,round=room.world.round,ups={};
  let label,text,delta;
  if(action==="deploy"){ label="군사 배치"; text=`${fn}이(가) ${tn} 방향 국경에 병력을 증강 배치했다.`; delta=7; ups[`nationState/${from}/military`]=clamp(room.nationState[from].military+2); ups[`nationState/${from}/trust`]=clamp(room.nationState[from].trust-3); }
  else if(action==="warning"){ label="최후통첩"; text=`${fn}이(가) ${tn}에 공개 최후통첩을 보냈다.`; delta=9; ups[`nationState/${from}/trust`]=clamp(room.nationState[from].trust-5); }
  else{ label="전쟁 선포"; text=`⚠ ${fn}이(가) ${tn}에 전쟁을 선포했다. 다른 국가들의 선택이 전쟁의 규모를 결정한다.`; delta=20; ups[`nationState/${from}/atWarWith/${target}`]=true; ups[`nationState/${target}/atWarWith/${from}`]=true; ups[`nationState/${from}/trust`]=clamp(room.nationState[from].trust-12); }
  ups["world/tension"]=clamp(room.world.tension+delta); await update(ref(db,`rooms/${roomCode}`),ups); await bumpStat(action==="war"?"wars":"military");
  await push(ref(db,`rooms/${roomCode}/feed`),{type:action==="war"?"war":"military",major:true,typeLabel:label,text,round,at:Date.now()});
}

async function advanceRound(){
  await runTransaction(ref(db,`rooms/${roomCode}`),room=>{
    if(!room||room.meta.hostUid!==user.uid||room.world.ended) return room;
    const now=Date.now(),allSpent=Object.values(room.players||{}).every(p=>(p.ap??0)<=0),expired=(room.world.roundDeadline||0)<=now;
    if(!allSpent&&!expired) return room;
    if((room.world.round||1)>=MAX_ROUNDS){ room.world.ended=true; room.meta.status="finished"; room.world.finishedAt=now; room.feed=room.feed||{}; room.feed[`end_${now}`]={type:"system",major:true,typeLabel:"게임 종료",text:"8개 라운드가 종료되었습니다. 각국의 선택이 남긴 결과를 평가합니다.",round:MAX_ROUNDS,at:now}; return room; }
    const nr=room.world.round+1,s=getStory(nr); room.world.round=nr; room.world.roundDeadline=now+ROUND_SECONDS*1000; room.world.tension=clamp((room.world.tension||0)+s.delta); room.world.latestEvent={title:s.event,body:s.body,type:"story",at:now};
    Object.values(room.players||{}).forEach(p=>p.ap=AP_PER_ROUND);
    room.feed=room.feed||{}; room.feed[`story_${nr}_${now}`]={type:"story",major:true,typeLabel:"메인 사건",text:`${s.event} — ${s.body}`,round:nr,at:now};
    return room;
  });
}

function renderResults(room){
  const mine=room.players?.[user.uid]; if(!mine?.nationId) return;
  const n=NATIONS[mine.nationId],s=room.nationState[mine.nationId],stats=mine.stats||{},ctx={...s,worldTension:room.world.tension,warCount:Object.values(s.atWarWith||{}).filter(Boolean).length,warsDeclared:stats.wars||0};
  const goals=n.goals.map(([label,fn])=>({label,ok:fn(ctx)})),done=goals.filter(g=>g.ok).length;
  $("resultTitle").textContent=`${n.name} · 최종 평가`; $("resultSummary").textContent=`국가 목표 ${goals.length}개 중 ${done}개를 달성했습니다. 세계 긴장도는 ${room.world.tension}으로 종료되었습니다.`;
  $("resultChecklist").innerHTML=goals.map(g=>`<div class="check-item ${g.ok?"ok":"no"}">${g.ok?"✓":"✕"} ${g.label}</div>`).join("");
  const metrics=[["국가 안보",s.military],["경제 성과",s.economy],["국제 신뢰",s.trust],["외교 영향력",s.influence],["세계 안정",clamp(100-room.world.tension)]];
  $("resultMetrics").innerHTML=metrics.map(([k,v])=>`<div class="metric"><div class="metric-head"><span>${k}</span><strong>${v}</strong></div><div class="metric-bar"><i style="width:${clamp(v)}%"></i></div></div>`).join("");
  const coercive=(stats.sanctions||0)+(stats.military||0)+(stats.wars||0)*2,cooperative=(stats.treaties||0)+(stats.aid||0)+(stats.privateMessages||0)*0.3;
  let analysis;
  if(coercive>cooperative*1.4) analysis="이번 플레이에서는 현실주의적 성향이 강하게 나타났습니다. 안보와 강압 수단을 중시했고, 그 과정에서 상대의 대응을 자극하는 안보 딜레마가 커질 가능성이 있었습니다.";
  else if(cooperative>coercive*1.4) analysis="이번 플레이에서는 자유주의적 성향이 강하게 나타났습니다. 협정, 원조, 외교 채널을 활용해 상호의존과 협력의 비용 구조를 바꾸려 했습니다.";
  else analysis="이번 플레이는 혼합 전략에 가까웠습니다. 협력과 강압을 상황에 따라 병행했고, 특정 이론 하나보다 전략적 적응을 중시했습니다.";
  $("theoryAnalysis").textContent=analysis+" 이 평가는 옳고 그름을 채점하는 것이 아니라 플레이 결과를 국제정치 이론의 관점에서 해석하기 위한 것입니다.";
}

$("createRoomBtn").addEventListener("click",createRoom); $("joinRoomBtn").addEventListener("click",joinRoom); $("startGameBtn").addEventListener("click",startGame);
$("copyCodeBtn").addEventListener("click",async()=>{ await navigator.clipboard.writeText(roomCode); toast(`방 코드 ${roomCode} 복사됨`); });
$("sendPrivateBtn").addEventListener("click",sendPrivate); $("closeMajorBtn").addEventListener("click",()=>$("majorOverlay").classList.add("hidden"));
document.querySelectorAll(".tab").forEach(btn=>btn.addEventListener("click",()=>{ document.querySelectorAll(".tab").forEach(b=>b.classList.remove("active")); document.querySelectorAll(".tab-panel").forEach(p=>p.classList.remove("active")); btn.classList.add("active"); $(`${btn.dataset.tab}Tab`).classList.add("active"); }));
document.querySelectorAll("[data-action]").forEach(btn=>btn.addEventListener("click",()=>{ const a=btn.dataset.action; if(["statement","treaty","aid","sanction"].includes(a)) doPublicAction(a); else doMilitary(a); }));
bootstrap();
