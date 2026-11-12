import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import { getAuth, signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import { getDatabase, ref, get, set, onValue, runTransaction } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const $ = id => document.getElementById(id);
const ACTION_SECONDS = 60;
const ROOM_ROOT = "rooms/rps-card-duel";
const OTHER = {p1:"p2",p2:"p1"};
const CARD = {
  fist:{name:"주먹",icon:"✊",kind:"유닛",base:"fist",desc:"가위를 이긴다",tag:"유닛"},
  scissors:{name:"가위",icon:"✂",kind:"유닛",base:"scissors",desc:"보를 이긴다",tag:"유닛"},
  paper:{name:"보",icon:"▤",kind:"유닛",base:"paper",desc:"주먹을 이긴다",tag:"유닛"},
  specialPaper:{name:"특수 보",icon:"★",kind:"특수",base:"paper",desc:"비길 때 1점 획득",tag:"특수"},
  specialFist:{name:"특수 주먹",icon:"✊",kind:"특수",base:"fist",desc:"이 세로줄 점수 2배",tag:"특수"},
  specialScissors:{name:"특수 가위",icon:"✂",kind:"특수",base:"scissors",desc:"패배한 줄의 상대 점수 차단",tag:"특수"},
  duelist:{name:"조건부 승리",icon:"⚔",kind:"특수",base:null,desc:"상대 줄 카드가 1장뿐이면 승리",tag:"특수"},
  magicSwap:{name:"전열 교환",icon:"⇅",kind:"마법",base:null,desc:"내 한 줄의 전열과 후열 교환",tag:"마법"},
  magicDestroy:{name:"카드 파괴",icon:"⌁",kind:"마법",base:null,desc:"상대 유닛 카드 1장 파괴",tag:"마법"},
  magicReinforce:{name:"긴급 배치",icon:"＋",kind:"마법",base:null,desc:"손패 유닛을 빈칸에 추가 배치",tag:"마법"}
};
const UNITS = ["fist","scissors","paper","specialPaper","specialFist","specialScissors","duelist"];
const MAGICS = ["magicSwap","magicDestroy","magicReinforce"];
let app,auth,db,currentUser=null,roomRef=null,roomCode="",mySeat="",room=null,offRoom=null,timer=null,toastTimer=null;
let selectedCard=null,pendingMagic=null,pendingUnit=null,pendingPlacements=[],modalAction=null;
let marketOverlayOpen=false,marketOverlayTurn=null,historyShowAll=false;

function uid(){return crypto.randomUUID();}
function copy(value){return JSON.parse(JSON.stringify(value));}
function shuffle(list){const a=[...list];for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;}
function newCard(type){return {id:uid(),type};}
function makeDeck(){
  const a=[];
  // 카드 종류별 4장씩은 플레이 테스트용 임시 수량이다.
  [...UNITS,...MAGICS].forEach(type=>{for(let i=0;i<4;i++)a.push(newCard(type));});
  return shuffle(a);
}
function draw(state,n){
  const out=[];
  for(let i=0;i<n;i++){
    if(!state.deck.length&&state.discard.length){state.deck=shuffle(state.discard);state.discard=[];}
    if(!state.deck.length)break;
    out.push(state.deck.shift());
  }
  return out;
}
function other(seat){return OTHER[seat];}
function startAction(state,seat){state.activeSeat=seat;state.actionStartedAt=Date.now();}
function newPlayer(id,name){return {uid:id,name:name,hand:[],field:Array(6).fill(false),score:0};}
function startPlacement(state){
  state.market=[];state.marketOrder=[];state.marketPickIndex=0;state.phase="placement";state.consecutivePasses=0;
  state.lastMessage="공격자부터 한 장씩 번갈아 배치하세요.";startAction(state,state.attackerSeat);
}
function beginTurn(state,attacker){
  state.turnNumber=state.turnNumber||1;state.attackerSeat=attacker;state.market=draw(state,4);
  state.marketOrder=[attacker,other(attacker),other(attacker),attacker].slice(0,state.market.length);
  state.marketPickIndex=0;state.consecutivePasses=0;state.phase="market";
  state.lastMessage="용병 시장에서 카드를 영입하세요.";
  if(!state.marketOrder.length)startPlacement(state);else startAction(state,state.marketOrder[0]);
}
function recordMarketPick(state,seat,card,pickNumber,automatic=false){
  state.marketHistory=state.marketHistory||[];
  state.marketHistory.push({
    turn:state.turnNumber,
    seat,
    playerName:state.players[seat]?.name||"플레이어",
    pickNumber,
    card:{id:card.id,type:card.type},
    automatic,
    timestamp:Date.now()
  });
}
function advanceMarket(state){
  state.marketPickIndex++;
  if(state.marketPickIndex>=state.marketOrder.length){
    state.market.forEach(card=>{if(card)state.discard.push(card);});
    startPlacement(state);
  }else startAction(state,state.marketOrder[state.marketPickIndex]);
}
function nextTurn(state){
  const ended=state.turnNumber;
  if(ended>0&&ended%2===0){
    ["p1","p2"].forEach(s=>{const p=state.players[s];state.discard.push(...p.hand);p.hand=draw(state,2);});
    state.lastMessage="짝수 턴 종료: 손패를 모두 버리고 2장씩 드로우했습니다.";
  }
  state.turnNumber=ended+1;
  beginTurn(state,other(state.attackerSeat));
}
function beginSpells(state){
  state.phase="spells";state.consecutivePasses=0;state.lastMessage="공격자부터 마법을 사용할 수 있습니다.";startAction(state,state.attackerSeat);
}
function countLane(field,lane){return [field[lane],field[lane+3]].filter(Boolean).length;}
function promote(field,lane){if(!field[lane]&&field[lane+3]){field[lane]=field[lane+3];field[lane+3]=false;}}
function compare(a,b,aCount,bCount){
  const aWins=a.type==="duelist"&&bCount===1,bWins=b.type==="duelist"&&aCount===1;
  if(aWins&&bWins)return 0;if(aWins)return 1;if(bWins)return -1;
  const x=CARD[a.type].base,y=CARD[b.type].base;
  if(!x||!y||x===y)return 0;
  if((x==="fist"&&y==="scissors")||(x==="scissors"&&y==="paper")||(x==="paper"&&y==="fist"))return 1;
  return -1;
}
function addBattleEvent(events,event,durationMs){
  events.push({...event,durationMs});
}
function buildBattleEvents(state){
  const sim=normalizeGameState(copy(state));
  const events=[];
  for(let lane=0;lane<3;lane++){
    for(const seat of ["p1","p2"]){
      const field=sim.players[seat].field;
      if(!field[lane]&&field[lane+3]){
        const card=copy(field[lane+3]);
        addBattleEvent(events,{type:"advance",seat,lane,fromIndex:lane+3,toIndex:lane,cardId:card.id,card,text:sim.players[seat].name+"의 후열 카드가 전열로 이동합니다."},520);
        field[lane]=field[lane+3];field[lane+3]=false;
      }
    }
    const aField=sim.players.p1.field,bField=sim.players.p2.field;
    for(let round=0;round<3;round++){
      const a=aField[lane],b=bField[lane];
      if(!a||!b)break;
      const result=compare(a,b,countLane(aField,lane),countLane(bField,lane));
      if(result===0){
        addBattleEvent(events,{type:"tie",lane,seatA:"p1",seatB:"p2",cardA:copy(a),cardB:copy(b),text:"양쪽 카드가 무승부입니다. 이 세로줄의 대결을 중지합니다."},650);
        if(a.type==="specialPaper"){
          addBattleEvent(events,{type:"bonusScore",seat:"p1",lane,points:1,text:"나의 특수 보가 무승부 보너스 1점을 획득합니다."},620);
          sim.players.p1.score+=1;
        }
        if(b.type==="specialPaper"){
          addBattleEvent(events,{type:"bonusScore",seat:"p2",lane,points:1,text:"상대의 특수 보가 무승부 보너스 1점을 획득합니다."},620);
          sim.players.p2.score+=1;
        }
        break;
      }
      const winnerSeat=result>0?"p1":"p2";
      const loserSeat=other(winnerSeat);
      const winnerCard=result>0?a:b;
      const loserCard=result>0?b:a;
      const loserField=sim.players[loserSeat].field;
      addBattleEvent(events,{
        type:"attack",lane,attackerSeat:winnerSeat,attackerCardId:winnerCard.id,
        targetSeat:loserSeat,targetCardId:loserCard.id,
        text:sim.players[winnerSeat].name+"의 "+CARD[winnerCard.type].name+"이(가) 유리한 상성으로 공격합니다."
      },560);
      addBattleEvent(events,{
        type:"destroy",lane,seat:loserSeat,index:lane,cardId:loserCard.id,card:copy(loserCard),
        text:sim.players[loserSeat].name+"의 "+CARD[loserCard.type].name+" 카드가 파괴됩니다."
      },540);
      sim.discard.push(loserCard);
      loserField[lane]=loserField[lane+3]||false;
      loserField[lane+3]=false;
      if(loserField[lane]){
        const promoted=copy(loserField[lane]);
        addBattleEvent(events,{
          type:"advance",seat:loserSeat,lane,fromIndex:lane+3,toIndex:lane,
          cardId:promoted.id,card:promoted,
          text:sim.players[loserSeat].name+"의 후열 카드가 전열로 전진합니다."
        },520);
      }
    }
    const aCount=countLane(aField,lane),bCount=countLane(bField,lane);
    if(aCount===bCount)continue;
    const winnerSeat=aCount>bCount?"p1":"p2";
    const loserSeat=other(winnerSeat);
    const winnerField=sim.players[winnerSeat].field,loserField=sim.players[loserSeat].field;
    const shield=[loserField[lane],loserField[lane+3]].some(card=>card&&card.type==="specialScissors");
    if(shield){
      addBattleEvent(events,{type:"blocked",lane,seat:winnerSeat,text:sim.players[loserSeat].name+"의 특수 가위가 이 세로줄의 점수 획득을 막습니다."},650);
      continue;
    }
    const doubled=[winnerField[lane],winnerField[lane+3]].some(card=>card&&card.type==="specialFist");
    const points=doubled?2:1;
    addBattleEvent(events,{type:"score",lane,seat:winnerSeat,points,text:sim.players[winnerSeat].name+" 플레이어가 "+["왼쪽","가운데","오른쪽"][lane]+" 줄에서 "+points+"점을 획득합니다."},760);
    sim.players[winnerSeat].score+=points;
  }
  if(events.length===0){
    addBattleEvent(events,{type:"empty",text:"대결할 카드가 없어 전투를 마무리합니다."},650);
  }
  return events;
}
function applyBattleEvent(state,event){
  if(event.type==="destroy"){
    const field=state.players[event.seat].field;
    const card=field[event.index];
    if(card&&card.id===event.cardId){
      event.card=copy(card);
      state.discard.push(card);
      field[event.index]=false;
    }
  }else if(event.type==="advance"){
    const field=state.players[event.seat].field;
    const card=field[event.fromIndex];
    if(card&&card.id===event.cardId&&!field[event.toIndex]){
      field[event.toIndex]=card;
      field[event.fromIndex]=false;
    }
  }else if(event.type==="score"||event.type==="bonusScore"){
    state.players[event.seat].score+=event.points;
  }
}
function showBattleEvent(state,index,now){
  const event=state.battleEvents[index];
  if(!event)return false;
  state.battleEventIndex=index;
  state.battleEvent=copy(event);
  state.battleEventStartedAt=now;
  applyBattleEvent(state,state.battleEvent);
  state.lastMessage=event.text||"전투가 진행 중입니다.";
  return true;
}
function finishBattleAnimation(state,now){
  state.phase="battleResult";
  state.battleResultAt=now;
  state.pendingResult=state.players.p1.score>=12?"p1":state.players.p2.score>=12?"p2":null;
  state.lastMessage="전투가 종료되었습니다. 점수 결과를 확인하세요.";
  state.actionStartedAt=now;
  delete state.battleEvent;
}
function progressBattleAnimation(state,now){
  if(state.phase!=="battleAnimation")return false;
  const event=state.battleEvent;
  const duration=event?.durationMs||600;
  if(now-(state.battleEventStartedAt||now)<duration)return false;
  const nextIndex=(state.battleEventIndex||0)+1;
  if(nextIndex>=state.battleEvents.length){
    finishBattleAnimation(state,now);
    return true;
  }
  return showBattleEvent(state,nextIndex,now);
}
function resolveBattle(state){
  state.battleEvents=buildBattleEvents(state);
  state.phase="battleAnimation";
  state.consecutivePasses=0;
  state.battleEventIndex=0;
  state.battleStartedAt=Date.now();
  showBattleEvent(state,0,state.battleStartedAt);
}
function finishBattle(state){
  ["p1","p2"].forEach(s=>{const p=state.players[s];p.field.forEach(c=>{if(c)state.discard.push(c);});p.field=Array(6).fill(false);});
  state.battleEvents=[];
  state.battleEvent=false;
  state.battleEventIndex=0;
  if(state.pendingResult){state.status="finished";state.phase="finished";state.winnerSeat=state.pendingResult;state.endReason="score";state.lastMessage="12점을 먼저 달성했습니다.";return;}
  state.pendingResult=null;nextTurn(state);
}
function skipBattle(state){
  state.lastMessage="이번 턴은 전투 없이 종료되었습니다. 필드는 유지됩니다.";nextTurn(state);
}
function applyTimeout(state,now){
  if(!state||state.status!=="playing")return false;
  if(state.phase==="battleAnimation")return progressBattleAnimation(state,now);
  if(state.phase==="battleResult"){if(now-(state.battleResultAt||0)>=2600)finishBattle(state);return true;}
  if(!["market","placement","decision","spells"].includes(state.phase))return false;
  if(now-(state.actionStartedAt||now)<ACTION_SECONDS*1000)return false;
  if(state.phase==="market"){
    const seat=state.marketOrder[state.marketPickIndex],index=state.market.findIndex(Boolean);
    if(seat&&index>=0){
      const picked=state.market[index];
      state.players[seat].hand.push(picked);
      recordMarketPick(state,seat,picked,state.marketPickIndex+1,true);
      state.market[index]=false;
      state.lastMessage="시간 초과: 첫 번째 카드를 자동 영입했습니다.";
    }
    advanceMarket(state);return true;
  }
  if(state.phase==="placement"){
    state.consecutivePasses++;
    state.lastMessage="시간 초과: 자동으로 배치하지 않음을 선택했습니다.";
    if(state.consecutivePasses>=2){state.phase="decision";state.consecutivePasses=0;startAction(state,state.attackerSeat);}
    else startAction(state,other(state.activeSeat));
    return true;
  }
  if(state.phase==="decision"){skipBattle(state);return true;}
  if(state.phase==="spells"){
    state.consecutivePasses++;
    if(state.consecutivePasses>=2)resolveBattle(state);
    else startAction(state,other(state.activeSeat));
    state.lastMessage="시간 초과: 마법 사용을 건너뛰었습니다.";return true;
  }
  return false;
}

function setScreen(id){
  ["setupScreen","lobbyScreen","gameScreen","resultScreen"].forEach(s=>$(s).classList.toggle("hidden",s!==id));
}
function toast(message){
  $("toast").textContent=message;$("toast").classList.remove("hidden");clearTimeout(toastTimer);
  toastTimer=setTimeout(()=>$("toast").classList.add("hidden"),2400);
}
function modal(title,message,confirm,onYes){
  $("modalTitle").textContent=title;$("modalMessage").textContent=message;$("modalConfirmButton").textContent=confirm;
  modalAction=onYes;$("confirmModal").classList.remove("hidden");
}
function closeModal(){$("confirmModal").classList.add("hidden");modalAction=null;}
function resetSelection(){selectedCard=null;pendingMagic=null;pendingUnit=null;pendingPlacements=[];}
function settings(open){$("settingsMenu").classList.toggle("hidden",!open);}
function setupFirebase(){
  app=initializeApp(firebaseConfig);auth=getAuth(app);db=getDatabase(app);
  onAuthStateChanged(auth,user=>{
    currentUser=user;
    if(!user){
      $("connectionBadge").textContent="로그인 중";
      $("connectionBadge").classList.remove("online");
      return;
    }
    $("connectionBadge").textContent="인증 완료 · DB 확인 중";
    $("connectionBadge").classList.add("online");
  });
  onValue(ref(db,".info/connected"),snap=>{
    const connected=snap.val()===true;
    $("connectionBadge").textContent=connected?"온라인 연결":"서버 연결 끊김";
    $("connectionBadge").classList.toggle("online",connected);
  },error=>{
    $("connectionBadge").textContent="DB 연결 오류";
    $("connectionBadge").classList.remove("online");
    setError("Firebase 데이터베이스 연결 오류: "+error.message);
  });
  signInAnonymously(auth).catch(e=>{
    $("connectionBadge").textContent="로그인 실패";
    $("connectionBadge").classList.remove("online");
    setError("Firebase 익명 로그인 실패: "+e.message+" (Firebase Console에서 Anonymous 로그인이 켜져 있는지 확인하세요.)");
  });
}
function path(code){return ROOM_ROOT+"/"+code;}
function watchRoom(code,seat){
  if(offRoom)offRoom();roomCode=code;mySeat=seat;roomRef=ref(db,path(code));
  // sessionStorage is isolated per browser tab: it supports refresh/reconnect
  // without mistaking a second tab on the same Firebase anonymous UID as the same seat.
  sessionStorage.setItem("rps-card-duel-seat:"+code,JSON.stringify({seat,uid:currentUser?.uid||""}));
  offRoom=onValue(roomRef,snap=>{
    const value=snap.val();
    if(!value){room=null;toast("방이 삭제되었거나 존재하지 않습니다.");home();return;}
    // RTDB may return sparse list values as objects; normalize before UI reads.
    room=normalizeGameState(value);
    render();
  },err=>toast("실시간 연결 오류: "+err.message));
  resetSelection();settings(false);
}
async function createRoom(){
  if(!currentUser)return setError("온라인 연결을 기다려 주세요.");
  const name=$("playerName").value.trim()||"플레이어 1";setError("");$("createRoomButton").disabled=true;
  try{
    let code="",found=false;
    const alphabet="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
    for(let t=0;t<8;t++){code=Array.from({length:6},()=>alphabet[Math.floor(Math.random()*alphabet.length)]).join("");if(!(await get(ref(db,path(code)))).exists()){found=true;break;}}
    if(!found)throw new Error("방 코드를 만들지 못했습니다. 다시 시도해 주세요.");
    const state={status:"lobby",phase:"lobby",roomCode:code,hostUid:currentUser.uid,players:{p1:newPlayer(currentUser.uid,name),p2:null},createdAt:Date.now(),turnNumber:0,attackerSeat:"p1",activeSeat:"p1",deck:[],discard:[],market:[],marketOrder:[],marketPickIndex:0,consecutivePasses:0,actionStartedAt:Date.now(),lastMessage:"상대 플레이어를 기다리는 중입니다."};
    await set(ref(db,path(code)),state);watchRoom(code,"p1");
  }catch(e){setError(e.message||"방 생성 실패");}finally{$("createRoomButton").disabled=false;}
}
async function joinRoom(){
  if(!currentUser)return setError("온라인 인증이 완료되지 않았습니다. 상단 연결 상태를 확인해 주세요.");
  const code=$("roomCodeInput").value.trim().toUpperCase(),name=$("playerName").value.trim()||"플레이어 2";
  if(!/^[A-Z0-9]{6}$/.test(code))return setError("초대 코드는 영문 대문자와 숫자 6자리여야 합니다.");
  setError("");$("joinRoomButton").disabled=true;
  try{
    const targetRef=ref(db,path(code));
    const initial=await get(targetRef);
    if(!initial.exists())throw new Error("해당 초대 코드의 방을 찾을 수 없습니다. 방장에게 새 코드를 확인해 주세요.");
    const current=initial.val();
    // 이 탭(sessionStorage)에 저장된 좌석만 재접속 좌석으로 인정한다.
    // 같은 브라우저의 새 탭은 별도 참가자로 취급되어 p2에 입장할 수 있다.
    let savedSeat=null;
    try{savedSeat=JSON.parse(sessionStorage.getItem("rps-card-duel-seat:"+code)||"null");}catch{}
    if(savedSeat?.uid===currentUser.uid&&["p1","p2"].includes(savedSeat.seat)&&current.players?.[savedSeat.seat]?.uid===currentUser.uid){
      watchRoom(code,savedSeat.seat);return;
    }
    if(current.status!=="lobby")throw new Error("이 방은 이미 게임이 시작되었거나 종료되었습니다.");
    if(current.players?.p2)throw new Error("이 방은 이미 두 명이 참가했습니다. 방장에게 새 방을 만들어 달라고 요청하세요.");

    // Realtime Database transactions may call the updater with null on the
    // first local pass even when the room exists on the server. Use the room
    // snapshot just fetched as that first-pass value; the server hash check
    // will rerun the updater with the latest authoritative room if it changed.
    const roomFromServer=current;
    let usedPrefetchedRoom=false;
    const tx=await runTransaction(targetRef,localValue=>{
      let latest=localValue;
      if(latest===null&&!usedPrefetchedRoom){
        latest=roomFromServer;
        usedPrefetchedRoom=true;
      }
      if(!latest||latest.status!=="lobby")return;
      if(latest.players?.p2){
        if(latest.players.p2.uid===currentUser.uid)return latest;
        return;
      }
      const next=copy(latest);
      next.players=next.players||{};
      next.players.p2=newPlayer(currentUser.uid,name);
      next.lastMessage=name+" 플레이어가 입장했습니다.";
      return next;
    },{applyLocally:false});

    const joined=tx.snapshot?.val();
    const finalState=joined || (await get(targetRef)).val();
    if(finalState?.players?.p2?.uid===currentUser.uid)watchRoom(code,"p2");
    else if(finalState?.status!=="lobby")throw new Error("이 방은 이미 게임이 시작되었거나 종료되었습니다. 새 방을 만들어 주세요.");
    else if(finalState?.players?.p2)throw new Error("이 방은 이미 다른 플레이어가 참가했습니다. 방장에게 새 방을 만들어 달라고 요청하세요.");
    else if(!tx.committed)throw new Error("방 참가 트랜잭션이 완료되지 않았습니다. 인터넷 연결을 확인하고 다시 시도해 주세요.");
    else throw new Error("방 참가 확인에 실패했습니다. 다시 시도해 주세요.");
  }catch(e){
    const message=e?.code==="PERMISSION_DENIED"||e?.code==="permission-denied"
      ? "Firebase 접근이 거부되었습니다. Realtime Database 규칙에서 /rooms/rps-card-duel 경로의 읽기·쓰기를 허용했는지 확인해야 합니다."
      : e?.code==="NETWORK_ERROR"
      ? "Firebase 서버에 연결할 수 없습니다. 인터넷 연결과 브라우저의 추적 방지 설정을 확인해 주세요."
      : (e.message||"방 참가 실패");
    setError(message);
  }finally{$("joinRoomButton").disabled=false;}
}
function setError(msg){$("setupError").textContent=msg||"";}
function arrayValue(value,preserveSlots=false){
  if(Array.isArray(value))return value;
  if(value&&typeof value==="object"){
    const keys=Object.keys(value).filter(key=>/^\d+$/.test(key)).sort((a,b)=>Number(a)-Number(b));
    if(!keys.length)return [];
    if(!preserveSlots)return keys.map(key=>value[key]);
    const length=Math.max(...keys.map(Number))+1;
    return Array.from({length},(_,index)=>Object.prototype.hasOwnProperty.call(value,String(index))?value[index]:false);
  }
  return [];
}
function normalizeGameState(state){
  // Realtime Database can omit empty arrays and serializes sparse arrays as objects.
  // Restore collections before any game action calls push(), shift(), filter(), or length.
  state.deck=arrayValue(state.deck);
  state.discard=arrayValue(state.discard);
  state.market=arrayValue(state.market,true);
  state.marketOrder=arrayValue(state.marketOrder);
  state.marketHistory=arrayValue(state.marketHistory);
  state.battleEvents=arrayValue(state.battleEvents);
  state.players=state.players||{};
  for(const seat of ["p1","p2"]){
    const player=state.players[seat];
    if(!player)continue;
    player.hand=arrayValue(player.hand);
    const savedField=arrayValue(player.field,true);
    player.field=Array.from({length:6},(_,index)=>savedField[index]||false);
    if(typeof player.score!=="number")player.score=0;
  }
  return state;
}
async function mutate(fn){
  if(!roomRef)throw new Error("방에 연결되어 있지 않습니다.");
  const tx=await runTransaction(roomRef,current=>{
    if(!current)return;
    const next=normalizeGameState(copy(current));
    if(fn(next)===false)return;
    next.updatedAt=Date.now();
    return next;
  },{applyLocally:false});
  if(!tx.committed)throw new Error("지금은 행동할 수 없거나 상태가 변경되었습니다.");
  return tx.snapshot.val();
}
function myTurn(state,phase){return state&&state.status==="playing"&&state.phase===phase&&state.activeSeat===mySeat;}
async function startGame(){
  try{
    await mutate(state=>{
      if(state.status!=="lobby"||state.hostUid!==currentUser.uid||!state.players.p2)return false;
      state.deck=makeDeck();state.discard=[];
      ["p1","p2"].forEach(s=>{state.players[s].hand=draw(state,2);state.players[s].score=0;state.players[s].field=Array(6).fill(false);});
      state.marketHistory=[];state.battleEvents=[];state.status="playing";state.turnNumber=1;beginTurn(state,"p1");state.lastMessage="게임 시작! 공격자부터 용병을 선택하세요.";
    });
  }catch(e){toast(e.message);}
}
async function selectMarket(index){
  try{
    await mutate(state=>{
      if(!myTurn(state,"market")||state.marketOrder[state.marketPickIndex]!==mySeat||!state.market[index])return false;
      const picked=state.market[index];
      state.players[mySeat].hand.push(picked);
      recordMarketPick(state,mySeat,picked,state.marketPickIndex+1,false);
      state.market[index]=false;
      state.lastMessage=state.players[mySeat].name+" 플레이어가 용병을 영입했습니다.";advanceMarket(state);
    });resetSelection();
  }catch(e){toast(e.message);}
}
async function placeUnit(cardId,index){
  if(!cardId){toast("먼저 손패에서 배치할 유닛 카드를 선택하세요.");return;}
  if(!Number.isInteger(index)||index<0||index>5){toast("올바른 필드 칸을 선택하세요.");return;}
  try{
    await mutate(state=>{
      if(!myTurn(state,"placement"))return false;
      const p=state.players?.[mySeat];
      if(!p)return false;
      if(p.field[index])return false;
      const ci=p.hand.findIndex(card=>card.id===cardId&&UNITS.includes(card.type));
      if(ci<0)return false;
      const card=p.hand.splice(ci,1)[0];
      p.field[index]=card;
      state.consecutivePasses=0;
      state.lastMessage=p.name+" 플레이어가 "+CARD[card.type].name+" 카드를 배치했습니다.";
      startAction(state,other(mySeat));
    });
    resetSelection();
  }catch(e){toast(e.message);}
}
async function passPlacement(){
  try{
    await mutate(state=>{
      if(!myTurn(state,"placement"))return false;
      state.consecutivePasses++;state.lastMessage=state.players[mySeat].name+" 플레이어가 배치를 건너뛰었습니다.";
      if(state.consecutivePasses>=2){state.phase="decision";state.consecutivePasses=0;state.lastMessage="두 플레이어가 연속으로 배치를 멈췄습니다.";startAction(state,state.attackerSeat);}
      else startAction(state,other(mySeat));
    });resetSelection();
  }catch(e){toast(e.message);}
}
async function decision(battle){
  try{
    await mutate(state=>{
      if(!myTurn(state,"decision")||state.activeSeat!==state.attackerSeat)return false;
      if(battle){state.players.p1.fieldRevealed=true;state.players.p2.fieldRevealed=true;beginSpells(state);}
      else skipBattle(state);
    });resetSelection();
  }catch(e){toast(e.message);}
}
function consumeSpell(state,id){
  const p=state.players[mySeat],i=p.hand.findIndex(c=>c.id===id&&MAGICS.includes(c.type));
  if(i<0)return null;const card=p.hand.splice(i,1)[0];state.discard.push(card);return card;
}
async function swapLane(id,lane){
  try{
    await mutate(state=>{
      if(!myTurn(state,"spells"))return false;
      const card=consumeSpell(state,id);if(!card||card.type!=="magicSwap")return false;
      const f=state.players[mySeat].field;[f[lane],f[lane+3]]=[f[lane+3],f[lane]];
      state.lastMessage=["왼쪽","가운데","오른쪽"][lane]+" 세로줄의 전열과 후열을 바꿨습니다.";state.consecutivePasses=0;startAction(state,mySeat);
    });resetSelection();
  }catch(e){toast(e.message);}
}
async function destroyUnit(id,index){
  try{
    await mutate(state=>{
      if(!myTurn(state,"spells"))return false;
      const spell=consumeSpell(state,id);if(!spell||spell.type!=="magicDestroy")return false;
      const enemy=state.players[other(mySeat)],target=enemy.field[index];if(!target)return false;
      state.discard.push(target);enemy.field[index]=false;state.lastMessage="상대 유닛 카드 한 장을 파괴했습니다.";
      state.consecutivePasses=0;startAction(state,mySeat);
    });resetSelection();
  }catch(e){toast(e.message);}
}
async function finishReinforce(){
  if(!pendingMagic||!pendingPlacements.length){toast("손패의 유닛을 빈 필드에 먼저 배치하세요.");return;}
  const id=pendingMagic.id,placements=[...pendingPlacements];
  try{
    await mutate(state=>{
      if(!myTurn(state,"spells"))return false;
      const spell=consumeSpell(state,id);if(!spell||spell.type!=="magicReinforce")return false;
      const p=state.players[mySeat],seen=new Set();
      for(const item of placements){
        if(seen.has(item.cardId)||p.field[item.index])return false;
        const i=p.hand.findIndex(c=>c.id===item.cardId&&UNITS.includes(c.type));if(i<0)return false;
        const card=p.hand.splice(i,1)[0];p.field[item.index]=card;seen.add(item.cardId);
      }
      state.lastMessage=placements.length+"장의 유닛을 추가 배치했습니다.";state.consecutivePasses=0;startAction(state,mySeat);
    });resetSelection();
  }catch(e){toast(e.message);}
}
async function passSpells(){
  try{
    await mutate(state=>{
      if(!myTurn(state,"spells"))return false;
      state.consecutivePasses++;
      if(state.consecutivePasses>=2)resolveBattle(state);
      else{state.lastMessage=state.players[mySeat].name+" 플레이어가 마법 사용을 마쳤습니다.";startAction(state,other(mySeat));}
    });resetSelection();
  }catch(e){toast(e.message);}
}
function surrender(){
  modal("항복하기","항복하면 이번 대전은 즉시 패배로 종료됩니다. 정말 항복할까요?","항복하기",async()=>{
    closeModal();
    try{await mutate(state=>{if(state.status!=="playing")return false;state.status="finished";state.phase="finished";state.winnerSeat=other(mySeat);state.endReason="surrender";state.lastMessage=state.players[mySeat].name+" 플레이어가 항복했습니다.";});settings(false);}
    catch(e){toast(e.message);}
  });
}
function home(){
  if(offRoom)offRoom();offRoom=null;roomRef=null;room=null;roomCode="";mySeat="";resetSelection();settings(false);setScreen("setupScreen");
}
function leaveRoom(){
  if(room?.status==="playing"){surrender();return;}
  modal("방 나가기","현재 대기실에서 나갈까요?","나가기",()=>{closeModal();home();});
}
function fieldCard(card,back,animationClass=""){
  if(back)return '<div class="field-card back"><span>?</span></div>';
  const c=CARD[card.type];return '<div class="field-card '+animationClass+'"><span class="card-icon">'+c.icon+'</span><span class="card-name">'+c.name+'</span><span class="card-desc">'+c.desc+'</span><span class="card-tag">'+c.tag+'</span></div>';
}
function renderField(id,targetSeat,opponentView){
  const box=$(id),field=room.players[targetSeat].field||Array(6).fill(false);
  const reveal=room.phase==="spells"||room.phase==="battleAnimation"||room.phase==="battleResult"||room.phase==="finished";
  const offsets=opponentView?[3,0]:[0,3];
  const destroyTarget=pendingMagic?.type==="magicDestroy"&&room.phase==="spells"&&room.activeSeat===mySeat&&targetSeat===other(mySeat);
  // Keep this player's empty field slots clickable during their placement turn.
  // The click handler can then ask for a hand-card selection instead of silently disabling the board.
  const canPlace=room.phase==="placement"&&room.activeSeat===mySeat&&!opponentView;
  const canReinforce=room.phase==="spells"&&room.activeSeat===mySeat&&pendingMagic?.type==="magicReinforce"&&pendingUnit&&!opponentView;
  const event=room.battleEvent;
  const seat=targetSeat;
  box.innerHTML=[0,1,2].map(lane=>{
    const slots=offsets.map(offset=>{
      const index=lane+offset;
      let card=field[index];
      let anim="";
      // Keep the just-destroyed card visible only for its brief break animation.
      if(event?.type==="destroy"&&event.seat===seat&&event.index===index){
        card=event.card;
        anim="destroying";
      }else if(event?.type==="attack"&&event.attackerSeat===seat&&event.lane===lane&&index===lane){
        anim=seat===mySeat?"attack-mine":"attack-opponent";
      }else if(event?.type==="attack"&&event.targetSeat===seat&&event.lane===lane&&index===lane){
        anim="target-hit";
      }else if(event?.type==="advance"&&event.seat===seat&&event.toIndex===index){
        anim=opponentView?"advancing-opponent":"advancing-mine";
      }else if(event?.type==="tie"&&event.lane===lane&&index===lane){
        anim="tie-flash";
      }
      const back=opponentView&&!reveal;
      const click=(!card&&(canPlace||canReinforce))||(!!card&&destroyTarget);
      const cls="field-slot "+(card?"occupied":"empty")+(click?" clickable":"")+(destroyTarget&&card?" targetable":"")+(anim==="destroying"?" destroying-slot":"");
      const inner=card?fieldCard(card,back,anim):"";
      return '<button type="button" class="'+cls+'" data-field-side="'+(opponentView?"opponent":"mine")+'" data-field-index="'+index+'" '+(click?"":"disabled")+'>'+inner+'</button>';
    }).join("");
    return '<div class="lane-column">'+slots+'</div>';
  }).join("");
}
function renderHand(){
  const hand=room.players[mySeat].hand||[];$("handCount").textContent=hand.length+"장";
  const center=(hand.length-1)/2;
  $("handCards").innerHTML=hand.map((card,index)=>{
    const c=CARD[card.type],active=room.activeSeat===mySeat;
    let enabled=(room.phase==="placement"&&active&&UNITS.includes(card.type))||(room.phase==="spells"&&active&&MAGICS.includes(card.type));
    if(pendingMagic?.type==="magicReinforce"&&active&&UNITS.includes(card.type))enabled=true;
    const selected=card.id===selectedCard||card.id===pendingUnit||pendingPlacements.some(p=>p.cardId===card.id);
    const delta=index-center;
    const angle=Math.max(-13,Math.min(13,delta*5.2));
    const lift=Math.abs(delta)*2.6;
    const z=index+1;
    return '<button type="button" class="hand-card '+(selected?"selected":"")+'" style="--fan-angle:'+angle+'deg;--fan-lift:'+lift+'px;z-index:'+z+'" data-hand-id="'+card.id+'" '+(enabled?"":"disabled")+'><span class="card-icon">'+c.icon+'</span><span class="card-name">'+c.name+'</span><span class="card-desc">'+c.desc+'</span><span class="card-tag">'+c.tag+'</span></button>';
  }).join("");
  $("handHint").textContent=pendingMagic?.type==="magicReinforce"?(pendingUnit?"내 필드의 빈칸을 선택하세요.":"추가 배치 "+pendingPlacements.length+"장 · 유닛 선택"):(room.phase==="placement"?"유닛 선택 후 내 필드의 빈칸을 누르세요.":room.phase==="spells"?"마법카드를 선택해 효과를 사용하세요.":"현재 단계에서는 손패를 사용할 수 없습니다.");
  $("handCards").querySelectorAll("[data-hand-id]").forEach(button=>{
    const card=hand.find(item=>item.id===button.dataset.handId);
    if(card&&UNITS.includes(card.type)&&room.phase==="placement"&&active){
      button.draggable=true;
      button.addEventListener("dragstart",event=>{
        selectedCard=card.id;
        event.dataTransfer.effectAllowed="move";
        event.dataTransfer.setData("text/plain",card.id);
        button.classList.add("dragging");
        $("handHint").textContent="카드를 놓을 필드 칸으로 드래그하세요.";
      });
      button.addEventListener("dragend",()=>button.classList.remove("dragging"));
    }
    button.addEventListener("click",()=>handleHand(button.dataset.handId));
  });
}
function renderMarket(){
  const cards=room.market||[];
  const mine=room.phase==="market"&&room.activeSeat===mySeat;
  $("marketCards").innerHTML=cards.map((card,index)=>{
    if(!card)return '<div class="market-card taken"><small>선택 완료</small><strong>영입됨</strong></div>';
    const info=CARD[card.type];
    return '<button class="market-card '+(mine?"available":"")+'" data-market-index="'+index+'" type="button" '+(mine?"":"disabled")+'><span class="market-card-icon">'+info.icon+'</span><strong>'+info.name+'</strong><small>'+info.desc+'</small><em>'+(mine?"선택하기":"선택 대기")+'</em></button>';
  }).join("");
  $("marketCards").querySelectorAll("[data-market-index]").forEach(button=>button.addEventListener("click",()=>selectMarket(Number(button.dataset.marketIndex))));
  $("marketPickInfo").textContent="선택 순서 "+Math.min(room.marketPickIndex+1,room.marketOrder.length)+" / "+room.marketOrder.length;
  const pickerSeat=room.marketOrder[room.marketPickIndex];
  $("marketCurrentPicker").textContent=pickerSeat?(pickerSeat===mySeat?"내 선택 차례":room.players[pickerSeat].name+" 선택 차례"):"선택 종료";
  $("marketHint").textContent=mine?"네 차례야. 영입할 카드 한 장을 선택해.":(room.players[room.activeSeat]?.name||"상대")+"의 선택을 기다리는 중이야.";
}
function setMarketOverlay(open){
  marketOverlayOpen=Boolean(open)&&room?.phase==="market";
  $("marketOverlay").classList.toggle("hidden",!marketOverlayOpen);
  $("openMarketButton").classList.toggle("hidden",room?.phase!=="market"||marketOverlayOpen);
}
function renderMarketHistory(){
  const history=room.marketHistory||[];
  const showAll=historyShowAll;
  const grouped=new Map();
  history.forEach(entry=>{
    const key=entry.turn||1;
    if(!grouped.has(key))grouped.set(key,[]);
    grouped.get(key).push(entry);
  });
  let turns=[...grouped.keys()].sort((a,b)=>b-a);
  if(!showAll)turns=turns.slice(0,4);
  if(!history.length){
    $("marketHistory").innerHTML='<p class="history-empty">아직 영입 기록이 없습니다.<br>용병시장에서 카드가 선택되면 여기에 표시됩니다.</p>';
  }else{
    $("marketHistory").innerHTML=turns.map(turn=>{
      const entries=grouped.get(turn).sort((a,b)=>(a.pickNumber||0)-(b.pickNumber||0));
      return '<section class="history-turn"><p class="history-turn-title">'+turn+'번째 턴</p>'+entries.map(entry=>{
        const info=CARD[entry.card?.type]||{name:"카드",icon:"◇"};
        const mine=entry.seat===mySeat;
        return '<div class="history-entry '+(mine?"mine":"enemy")+'"><span class="history-player">'+(mine?"나":"상대")+'</span><span class="history-card">'+info.icon+' '+info.name+(entry.automatic?" · 자동":"")+'</span><span class="history-pick">'+(entry.pickNumber||"")+'번째</span></div>';
      }).join("")+'</section>';
    }).join("");
  }
  $("historyLatestButton").textContent=showAll?"최근 4턴":"전체 기록";
}
function renderSpellExtra(){
  const area=$("spellExtra");if(!pendingMagic||room.activeSeat!==mySeat){area.innerHTML="";return;}
  if(pendingMagic.type==="magicSwap"){
    area.innerHTML='<span class="action-hint">바꿀 세로줄:</span><button data-lane="0">왼쪽</button><button data-lane="1">가운데</button><button data-lane="2">오른쪽</button><button data-cancel="1">취소</button>';
    area.querySelectorAll("[data-lane]").forEach(b=>b.addEventListener("click",()=>swapLane(pendingMagic.id,Number(b.dataset.lane))));
  }else if(pendingMagic.type==="magicDestroy"){
    area.innerHTML='<span class="action-hint">상대 필드에서 파괴할 카드를 선택하세요.</span><button data-cancel="1">취소</button>';
  }else{
    area.innerHTML='<span class="action-hint">유닛을 선택하고 빈칸에 배치하세요. 선택 '+pendingPlacements.length+'장</span><button data-finish="1">배치 완료</button><button data-cancel="1">취소</button>';
    area.querySelector("[data-finish]")?.addEventListener("click",finishReinforce);
  }
  area.querySelector("[data-cancel]")?.addEventListener("click",()=>{pendingMagic=null;pendingUnit=null;pendingPlacements=[];render();});
}
function renderActions(){
  ["placementArea","decisionArea","spellArea","waitingArea"].forEach(id=>$(id).classList.add("hidden"));
  const mine=room.activeSeat===mySeat;
  if(room.phase==="market"){
    if(!mine){$("waitingArea").classList.remove("hidden");$("waitingText").textContent=room.players[room.activeSeat].name+"의 용병 선택을 기다리는 중";}
  }else if(room.phase==="placement"){
    if(mine){$("placementArea").classList.remove("hidden");$("placementTurnInfo").textContent=room.activeSeat===room.attackerSeat?"공격자 차례":"상대 차례";}
    else{$("waitingArea").classList.remove("hidden");$("waitingText").textContent=room.players[room.activeSeat].name+"의 카드 배치를 기다리는 중";}
  }else if(room.phase==="decision"){
    if(mine)$("decisionArea").classList.remove("hidden");else{$("waitingArea").classList.remove("hidden");$("waitingText").textContent="공격자의 전투 결정을 기다리는 중";}
  }else if(room.phase==="spells"){
    if(mine){$("spellArea").classList.remove("hidden");$("spellTurnInfo").textContent=room.activeSeat===room.attackerSeat?"공격자의 마법 턴":"상대의 마법 턴";renderSpellExtra();}
    else{$("waitingArea").classList.remove("hidden");$("waitingText").textContent=room.players[room.activeSeat].name+"의 마법 사용을 기다리는 중";}
  }else if(room.phase==="battleAnimation"){
    $("waitingArea").classList.remove("hidden");$("waitingText").textContent="카드들이 전투 중입니다";$("gameNotice").textContent=room.battleEvent?.text||"전투 진행 중";
  }else if(room.phase==="battleResult"){
    $("waitingArea").classList.remove("hidden");$("waitingText").textContent="전투 결과 계산 완료";
  }
  $("gameNotice").textContent=room.phase==="battleAnimation"?(room.battleEvent?.text||"전투 진행 중"):(room.lastMessage||"");
  $("passPlacementButton").disabled=!mine;$("declareBattleButton").disabled=!mine;$("skipBattleButton").disabled=!mine;$("passSpellButton").disabled=!mine;
}
function renderLobby(){
  const a=room.players.p1,b=room.players.p2;
  $("lobbyRoomCode").textContent=roomCode;$("lobbyPlayerOne").textContent=a?.name||"-";$("lobbyPlayerTwo").textContent=b?.name||"상대 대기 중";
  $("lobbyPlayerOneState").textContent="방장";$("lobbyPlayerTwoState").textContent=b?"접속 완료":"초대 코드를 공유하세요";
  $("lobbyStatus").textContent=b?"두 플레이어 접속 완료":"상대 플레이어 대기 중";
  $("lobbyMessage").textContent=b?"방장이 게임을 시작할 수 있습니다.":"친구에게 방 코드를 공유하세요.";
  $("startGameButton").disabled=!b||currentUser?.uid!==room.hostUid;
  $("startGameButton").textContent=currentUser?.uid===room.hostUid?"게임 시작":"방장 시작 대기 중";
}
function renderResult(){
  const won=room.winnerSeat===mySeat;$("resultSymbol").textContent=won?"★":"×";$("resultTitle").textContent=won?"승리!":"패배";
  $("resultMessage").textContent=room.endReason==="surrender"?(won?"상대 플레이어가 항복했습니다.":"항복하여 대전이 종료되었습니다."):(won?"먼저 12점을 획득했습니다.":"상대가 먼저 12점을 획득했습니다.");
  $("resultMyScore").textContent=room.players[mySeat].score;$("resultOpponentScore").textContent=room.players[other(mySeat)].score;
}
function render(){
  if(!room)return;
  $("surrenderButton").classList.toggle("hidden",room.status!=="playing");$("leaveRoomButton").classList.toggle("hidden",room.status==="playing");
  if(room.status==="lobby"){setMarketOverlay(false);setScreen("lobbyScreen");renderLobby();return;}
  if(room.status==="finished"){setMarketOverlay(false);setScreen("resultScreen");renderResult();return;}
  setScreen("gameScreen");
  const me=room.players[mySeat],enemy=room.players[other(mySeat)];
  $("opponentName").textContent=enemy.name;$("opponentHandCount").textContent="손패 "+enemy.hand.length+"장";$("opponentScore").textContent=enemy.score+"점";
  $("myScore").textContent=me.score+"점";$("turnNumber").textContent=room.turnNumber+"번째 턴";
  const scoringEvent=room.battleEvent&&(room.battleEvent.type==="score"||room.battleEvent.type==="bonusScore")?room.battleEvent:null;
  $("myScore").classList.toggle("score-pulse",!!scoringEvent&&scoringEvent.seat===mySeat);
  $("opponentScore").classList.toggle("score-pulse",!!scoringEvent&&scoringEvent.seat===other(mySeat));
  $("attackerBadge").textContent="공격자: "+(room.attackerSeat===mySeat?"나":enemy.name);
  $("activePlayerBadge").textContent=room.phase==="battleAnimation"?"전투 중":room.phase==="battleResult"?"전투 결과":(room.activeSeat===mySeat?"내 차례":enemy.name+" 차례");
  $("phaseLabel").textContent=({market:"용병 선택",placement:"카드 배치",decision:"전투 결정",spells:"마법 사용",battleAnimation:"전투 진행 중",battleResult:"전투 결과"})[room.phase]||"진행 중";
  $("fieldUsage").textContent=me.field.filter(Boolean).length+" / 6칸 사용";
  $("opponentFieldUsage").textContent=enemy.field.filter(Boolean).length+" / 6칸 사용";
  $("myScore").textContent=me.score+"점";
  renderField("opponentField",other(mySeat),true);renderField("myField",mySeat,false);renderHand();renderMarket();renderMarketHistory();renderActions();
  if(room.phase==="market"){
    if(marketOverlayTurn!==room.turnNumber){marketOverlayTurn=room.turnNumber;marketOverlayOpen=true;}
    setMarketOverlay(marketOverlayOpen);
  }else{
    marketOverlayOpen=false;marketOverlayTurn=null;setMarketOverlay(false);
  }
  ["opponentField","myField"].forEach(id=>$(id).querySelectorAll("[data-field-index]").forEach(button=>{
    button.addEventListener("click",()=>handleField(button));
    if(id==="myField"&&room.phase==="placement"&&room.activeSeat===mySeat&&!room.players[mySeat].field[Number(button.dataset.fieldIndex)]){
      button.addEventListener("dragover",event=>{event.preventDefault();event.dataTransfer.dropEffect="move";button.classList.add("drop-target");});
      button.addEventListener("dragleave",()=>button.classList.remove("drop-target"));
      button.addEventListener("drop",event=>{
        event.preventDefault();button.classList.remove("drop-target");
        const cardId=event.dataTransfer.getData("text/plain")||selectedCard;
        if(cardId)placeUnit(cardId,Number(button.dataset.fieldIndex));
      });
    }
  }));
  updateTimer();
}
async function handleHand(id){
  if(!room||room.activeSeat!==mySeat)return;
  const card=room.players[mySeat].hand.find(c=>c.id===id);if(!card)return;
  if(room.phase==="placement"&&UNITS.includes(card.type)){selectedCard=selectedCard===id?null:id;render();return;}
  if(room.phase==="spells"){
    if(pendingMagic?.type==="magicReinforce"&&UNITS.includes(card.type)){pendingUnit=pendingUnit===id?null:id;render();return;}
    if(MAGICS.includes(card.type)){pendingMagic={id:card.id,type:card.type};pendingUnit=null;pendingPlacements=[];render();}
  }
}
async function handleField(button){
  const index=Number(button.dataset.fieldIndex),side=button.dataset.fieldSide;
  if(room.phase==="placement"&&side==="mine"){
    if(!selectedCard){
      $("handHint").textContent="먼저 손패에서 유닛 카드를 선택한 뒤 이 빈칸을 눌러주세요.";
      toast("손패에서 유닛 카드를 먼저 선택하세요.");
      return;
    }
    await placeUnit(selectedCard,index);return;
  }
  if(room.phase==="spells"&&pendingMagic?.type==="magicDestroy"&&side==="opponent"){await destroyUnit(pendingMagic.id,index);return;}
  if(room.phase==="spells"&&pendingMagic?.type==="magicReinforce"&&side==="mine"&&pendingUnit&&!room.players[mySeat].field[index]){
    if(pendingPlacements.some(p=>p.index===index))return;
    pendingPlacements.push({cardId:pendingUnit,index});pendingUnit=null;render();
  }
}
function updateTimer(){
  const timerEl=$("actionTimer"),marketTimer=$("marketActionTimer");
  if(!room||room.phase==="battleAnimation"||room.phase==="battleResult"){
    timerEl.textContent="—";timerEl.className="";
    if(marketTimer){marketTimer.textContent="—";marketTimer.className="market-action-timer";}
    return;
  }
  const elapsed=Math.max(0,Date.now()-(room.actionStartedAt||Date.now()));
  const remain=Math.max(0,ACTION_SECONDS-Math.floor(elapsed/1000));
  const label="00:"+String(remain).padStart(2,"0");
  timerEl.textContent=label;
  timerEl.className=remain<=5?"danger":remain<=10?"warning":"";
  if(marketTimer){marketTimer.textContent=label;marketTimer.className="market-action-timer "+(remain<=5?"danger":remain<=10?"warning":"");}
}
function timerLoop(){
  clearInterval(timer);timer=setInterval(()=>{
    if(!room||room.status!=="playing")return;
    updateTimer();const now=Date.now();
    if(room.phase==="battleAnimation"){
      const event=room.battleEvent;
      if(event&&now-(room.battleEventStartedAt||now)>=(event.durationMs||600)){
        mutate(state=>progressBattleAnimation(state,now)).catch(()=>{});
      }
      return;
    }
    if(room.phase==="battleResult"&&now-(room.battleResultAt||0)>=2600){
      mutate(state=>{if(state.phase!=="battleResult"||now-(state.battleResultAt||0)<2600)return false;finishBattle(state);}).catch(()=>{});return;
    }
    if(["market","placement","decision","spells"].includes(room.phase)&&now-(room.actionStartedAt||now)>=ACTION_SECONDS*1000){
      mutate(state=>applyTimeout(state,now)).catch(()=>{});
    }
  },150);
}
function wire(){
  $("createRoomButton").addEventListener("click",createRoom);$("joinRoomButton").addEventListener("click",joinRoom);$("startGameButton").addEventListener("click",startGame);
  $("copyRoomCodeButton").addEventListener("click",async()=>{try{await navigator.clipboard.writeText(roomCode);toast("방 코드를 복사했습니다.");}catch{toast("방 코드: "+roomCode);}});
  $("exitLobbyButton").addEventListener("click",leaveRoom);$("passPlacementButton").addEventListener("click",passPlacement);
  $("declareBattleButton").addEventListener("click",()=>decision(true));$("skipBattleButton").addEventListener("click",()=>decision(false));
  $("passSpellButton").addEventListener("click",()=>{pendingMagic=null;pendingUnit=null;pendingPlacements=[];passSpells();});
  $("openMarketButton").addEventListener("click",()=>setMarketOverlay(true));
  $("closeMarketButton").addEventListener("click",()=>setMarketOverlay(false));
  $("historyLatestButton").addEventListener("click",()=>{historyShowAll=!historyShowAll;renderMarketHistory();});
  $("surrenderButton").addEventListener("click",surrender);$("leaveRoomButton").addEventListener("click",leaveRoom);
  $("settingsToggle").addEventListener("click",()=>settings($("settingsMenu").classList.contains("hidden")));
  $("closeSettingsButton").addEventListener("click",()=>settings(false));$("returnHomeButton").addEventListener("click",home);
  $("modalCancelButton").addEventListener("click",closeModal);$("modalConfirmButton").addEventListener("click",()=>{if(modalAction)modalAction();});
  $("confirmModal").addEventListener("click",e=>{if(e.target===$("confirmModal"))closeModal();});
  $("animationsToggle").checked=localStorage.getItem("rpsAnimations")!=="false";
  $("animationsToggle").addEventListener("change",e=>localStorage.setItem("rpsAnimations",String(e.target.checked)));
  $("roomCodeInput").addEventListener("input",e=>{e.target.value=e.target.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);});
  document.addEventListener("click",e=>{if(!$("settingsMenu").contains(e.target)&&e.target!==$("settingsToggle"))settings(false);});
}
wire();setupFirebase();timerLoop();