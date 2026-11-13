(() => {
"use strict";

const CARD = {
  fist:{name:"주먹",icon:"✊",type:"유닛",base:"fist",desc:"가위에 승리"},
  scissors:{name:"가위",icon:"✂",type:"유닛",base:"scissors",desc:"보에 승리"},
  paper:{name:"보",icon:"▤",type:"유닛",base:"paper",desc:"주먹에 승리"},
  specialPaper:{name:"특수 보",icon:"★",type:"특수 유닛",base:"paper",desc:"비기면 보너스 점수"},
  specialFist:{name:"특수 주먹",icon:"✊",type:"특수 유닛",base:"fist",desc:"세로줄 점수 배율"},
  specialScissors:{name:"특수 가위",icon:"✂",type:"특수 유닛",base:"scissors",desc:"패배한 줄의 상대 점수 차단"},
  duelist:{name:"조건부 승리",icon:"⚔",type:"특수 유닛",base:null,desc:"상대 줄 카드가 1장뿐이면 승리"},
  magicSwap:{name:"전열 교환",icon:"⇅",type:"마법",base:null,desc:"선택한 줄의 전열과 후열 교환"},
  magicDestroy:{name:"카드 파괴",icon:"⌁",type:"마법",base:null,desc:"선택한 상대 카드 파괴"},
  magicReinforce:{name:"긴급 배치",icon:"＋",type:"마법",base:null,desc:"선택한 유닛을 빈칸에 추가 배치"}
};
const BASIC=["fist","scissors","paper"];
const SPECIAL=["specialPaper","specialFist","specialScissors","duelist"];
const MAGIC=["magicSwap","magicDestroy","magicReinforce"];
const UNIT=[...BASIC,...SPECIAL];
const $=id=>document.getElementById(id);
const state={
  fields:{p1:Array(6).fill(false),p2:Array(6).fill(false)},
  scores:{p1:0,p2:0},
  activeSide:"p1",
  selectedType:null,
  selectedMagic:null,
  events:[],
  eventIndex:-1,
  currentEvent:null,
  snapshot:null,
  status:"idle",
  timer:null,
  targetScore:12,
  linePoint:1,
  fistMultiplier:2,
  paperBonus:1,
  animationSpeed:550,
  notes:[]
};
const sideName=side=>side==="p1"?"플레이어 A":"플레이어 B";
const other=side=>side==="p1"?"p2":"p1";
const laneName=lane=>["왼쪽","가운데","오른쪽"][lane];
const rowName=index=>index<3?"전열":"후열";
const cardName=card=>card?CARD[card.type]?.name||"알 수 없는 카드":"빈칸";
const clone=value=>JSON.parse(JSON.stringify(value));
let toastTimer=null;

function toast(message){
  const el=$("toast");el.textContent=message;el.classList.remove("hidden");
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.classList.add("hidden"),2200);
}
function addNote(message){
  state.notes.push({time:new Date().toLocaleTimeString("ko-KR"),message});
}
function getRules(){
  state.targetScore=Number($("winTarget").value)||12;
  state.linePoint=Number($("linePoint").value)||1;
  state.fistMultiplier=Number($("fistMultiplier").value)||1;
  state.paperBonus=Number($("paperBonus").value)||0;
  state.animationSpeed=Number($("animationSpeed").value)||550;
}
function setActiveSide(side){
  state.activeSide=side;
  document.querySelectorAll("[data-side]").forEach(button=>button.classList.toggle("active",button.dataset.side===side));
  $("selectedSideLabel").textContent=side==="p1"?"A 필드 선택 중":"B 필드 선택 중";
  render();
}
function chooseCard(type){
  if(state.status==="playing"){toast("전투를 중지하거나 되돌린 뒤 카드를 수정하세요.");return;}
  if(MAGIC.includes(type)){
    state.selectedMagic=type;
    state.selectedType=null;
    $("magicLabPanel").classList.remove("hidden");
    $("magicLabTitle").textContent=CARD[type].name+" 실험";
    $("magicLabHelp").textContent=CARD[type].desc+" · 대상과 위치를 선택한 뒤 적용하세요.";
    $("magicUnitRow").classList.toggle("hidden",type!=="magicReinforce");
    renderLibrary();
    $("selectedStatus").textContent=CARD[type].name+" 선택 · 마법 적용 대기";
    return;
  }
  state.selectedType=type;
  state.selectedMagic=null;
  $("magicLabPanel").classList.add("hidden");
  $("selectedStatus").textContent=CARD[type].name+" 선택 · "+sideName(state.activeSide)+" 빈 슬롯을 클릭";
  renderLibrary();
}
function createLibraryCard(type){
  const c=CARD[type];
  return '<button class="library-card '+(state.selectedType===type||state.selectedMagic===type?"active":"")+'" data-card-type="'+type+'" type="button"><span class="icon">'+c.icon+'</span><span><strong>'+c.name+'</strong><small>'+c.desc+'</small></span></button>';
}
function renderLibrary(){
  $("basicCards").innerHTML=BASIC.map(createLibraryCard).join("");
  $("specialCards").innerHTML=SPECIAL.map(createLibraryCard).join("");
  $("magicCards").innerHTML=MAGIC.map(createLibraryCard).join("");
}
function renderField(side){
  const host=$(side==="p1"?"fieldA":"fieldB");
  const field=state.fields[side];
  const event=state.currentEvent;
  host.innerHTML=[0,1,2].map(lane=>{
    const slots=[lane,lane+3].map(index=>{
      // Keep a destroyed card on screen just for the short break animation.
      let card=field[index];
      let destroyed=false;
      if(event?.type==="destroy"&&event.seat===side&&event.index===index){
        card=event.card;
        destroyed=true;
      }
      if(!card)return '<button class="lab-slot '+(state.selectedType?"selected-target":"")+'" data-field-side="'+side+'" data-index="'+index+'" type="button" aria-label="'+sideName(side)+' '+laneName(lane)+' '+rowName(index)+' 빈칸"></button>';
      let anim="";
      if(destroyed)anim="anim-destroy";
      else if(event?.type==="attack"&&event.attacker===side&&event.lane===lane)anim=side==="p1"?"anim-attack-a":"anim-attack-b";
      else if(event?.type==="advance"&&event.seat===side&&event.to===index)anim=side==="p1"?"anim-advance-a":"anim-advance-b";
      else if(event?.type==="attack"&&event.target===side&&event.lane===lane)anim="anim-hit";
      return '<button class="lab-slot occupied" data-field-side="'+side+'" data-index="'+index+'" type="button"><span class="slot-card '+anim+'"><span class="slot-icon">'+CARD[card.type].icon+'</span><span class="slot-copy"><strong>'+CARD[card.type].name+'</strong><small>'+CARD[card.type].desc+'</small></span></span><span class="slot-remove" title="카드 제거">×</span></button>';
    }).join("");
    return '<div class="lane-column">'+slots+'</div>';
  }).join("");
}
function render(){
  renderField("p1");renderField("p2");
  $("scoreA").textContent=state.scores.p1;
  $("scoreB").textContent=state.scores.p2;
  $("targetPoints").textContent=state.targetScore;
  $("attackerName").textContent="A";
  $("eventCounter").textContent=(state.eventIndex+1)+" / "+state.events.length;
  $("selectedSideLabel").textContent=state.activeSide==="p1"?"A 필드 선택 중":"B 필드 선택 중";
  $("startBattle").disabled=state.status==="playing"||state.status==="done";
  $("stepBattle").disabled=!state.events.length||state.status==="done"||state.status==="idle";
  $("autoBattle").disabled=!state.events.length||state.status==="done"||state.status==="idle";
  $("stopBattle").disabled=state.status!=="playing";
  $("undoBattle").disabled=!state.snapshot;
  $("battleState").textContent=({idle:"대기 중",ready:"전투 준비",playing:"전투 진행 중",paused:"일시 중지",done:"전투 완료"})[state.status]||"대기 중";
}
function compare(cardA,cardB,countA,countB){
  const aDuel=cardA.type==="duelist"&&countB===1;
  const bDuel=cardB.type==="duelist"&&countA===1;
  if(aDuel&&bDuel)return 0;
  if(aDuel)return 1;
  if(bDuel)return -1;
  const a=CARD[cardA.type].base,b=CARD[cardB.type].base;
  if(!a||!b||a===b)return 0;
  if((a==="fist"&&b==="scissors")||(a==="scissors"&&b==="paper")||(a==="paper"&&b==="fist"))return 1;
  return -1;
}
function countLane(field,lane){return [field[lane],field[lane+3]].filter(Boolean).length;}
function addEvent(events,event){
  events.push({...event,text:event.text||"",duration:state.animationSpeed});
}
function buildBattleEvents(){
  const fields=clone(state.fields);
  const scores=clone(state.scores);
  const events=[];
  for(let lane=0;lane<3;lane++){
    for(const seat of ["p1","p2"]){
      const field=fields[seat];
      if(!field[lane]&&field[lane+3]){
        const card=clone(field[lane+3]);
        addEvent(events,{type:"advance",seat,lane,from:lane+3,to:lane,cardId:card.id,card,text:sideName(seat)+"의 "+laneName(lane)+" 줄 후열 카드가 전열로 이동합니다."});
        field[lane]=field[lane+3];field[lane+3]=false;
      }
    }
    const aField=fields.p1,bField=fields.p2;
    for(let round=0;round<3;round++){
      const a=aField[lane],b=bField[lane];
      if(!a||!b)break;
      const result=compare(a,b,countLane(aField,lane),countLane(bField,lane));
      if(result===0){
        addEvent(events,{type:"tie",lane,cardA:clone(a),cardB:clone(b),text:laneName(lane)+" 줄에서 "+CARD[a.type].name+"과(와) "+CARD[b.type].name+"이(가) 비겼습니다. 해당 줄의 대결을 중지합니다."});
        if(a.type==="specialPaper"&&state.paperBonus>0){addEvent(events,{type:"bonus",seat:"p1",lane,points:state.paperBonus,text:"플레이어 A의 특수 보가 무승부 보너스 "+state.paperBonus+"점을 획득합니다."});scores.p1+=state.paperBonus;}
        if(b.type==="specialPaper"&&state.paperBonus>0){addEvent(events,{type:"bonus",seat:"p2",lane,points:state.paperBonus,text:"플레이어 B의 특수 보가 무승부 보너스 "+state.paperBonus+"점을 획득합니다."});scores.p2+=state.paperBonus;}
        break;
      }
      const winner=result>0?"p1":"p2",loser=other(winner);
      const winnerCard=result>0?a:b,loserCard=result>0?b:a;
      addEvent(events,{type:"attack",lane,attacker:winner,target:loser,cardId:winnerCard.id,text:sideName(winner)+"의 "+CARD[winnerCard.type].name+"이(가) 유리한 상성으로 공격합니다."});
      addEvent(events,{type:"destroy",seat:loser,lane,index:lane,cardId:loserCard.id,card:clone(loserCard),text:sideName(loser)+"의 "+CARD[loserCard.type].name+" 카드가 파괴됩니다."});
      const losingField=fields[loser];
      losingField[lane]=losingField[lane+3]||false;losingField[lane+3]=false;
      if(losingField[lane]){
        addEvent(events,{type:"advance",seat:loser,lane,from:lane+3,to:lane,cardId:losingField[lane].id,card:clone(losingField[lane]),text:sideName(loser)+"의 후열 카드가 전열로 이동합니다."});
      }
    }
    const countA=countLane(aField,lane),countB=countLane(bField,lane);
    if(countA===countB)continue;
    const winner=countA>countB?"p1":"p2",loser=other(winner);
    const winnerField=fields[winner],loserField=fields[loser];
    const shield=[loserField[lane],loserField[lane+3]].some(card=>card&&card.type==="specialScissors");
    if(shield){addEvent(events,{type:"blocked",lane,seat:loser,text:sideName(loser)+"의 특수 가위가 "+laneName(lane)+" 줄의 점수 획득을 막습니다."});continue;}
    const doubled=[winnerField[lane],winnerField[lane+3]].some(card=>card&&card.type==="specialFist");
    const points=state.linePoint*(doubled?state.fistMultiplier:1);
    addEvent(events,{type:"score",lane,seat:winner,points,text:sideName(winner)+"가 "+laneName(lane)+" 줄에서 "+points+"점을 획득합니다."});
    scores[winner]+=points;
  }
  if(!events.length)addEvent(events,{type:"empty",text:"대결할 카드가 없어 전투 결과가 없습니다."});
  return events;
}
function applyEvent(event){
  if(event.type==="destroy"){
    const field=state.fields[event.seat];
    if(field[event.index]&&field[event.index].id===event.cardId)field[event.index]=false;
  }else if(event.type==="advance"){
    const field=state.fields[event.seat];
    if(field[event.from]&&field[event.from].id===event.cardId&&!field[event.to]){
      field[event.to]=field[event.from];field[event.from]=false;
    }
  }else if(event.type==="score"||event.type==="bonus"){
    state.scores[event.seat]+=event.points;
  }
}
function startBattle(){
  stopAuto();
  getRules();
  state.snapshot={fields:clone(state.fields),scores:clone(state.scores)};
  state.events=buildBattleEvents();
  state.eventIndex=-1;state.currentEvent=null;state.status="ready";
  $("eventTimeline").innerHTML=state.events.map((event,index)=>'<div class="event-line" data-event="'+index+'"><b>'+(index+1)+'.</b><span>'+event.text+'</span></div>').join("");
  $("battleMessage").textContent="전투 이벤트 "+state.events.length+"개를 준비했습니다. 다음 단계 또는 자동 재생을 눌러주세요.";
  render();
}
function stepBattle(){
  if(!state.events.length||state.status==="done")return;
  state.eventIndex++;
  if(state.eventIndex>=state.events.length){
    state.status="done";state.currentEvent=null;
    $("battleMessage").textContent="전투가 끝났습니다. 최종 점수: A "+state.scores.p1+"점 / B "+state.scores.p2+"점";
    render();return;
  }
  const event=state.events[state.eventIndex];
  state.currentEvent=event;applyEvent(event);
  state.status=state.eventIndex===0?"playing":"playing";
  $("battleMessage").textContent=event.text;
  document.querySelectorAll(".event-line").forEach((el,index)=>{
    el.classList.toggle("active",index===state.eventIndex);
    el.classList.toggle("done",index<state.eventIndex);
  });
  render();
  if(state.eventIndex===state.events.length-1){
    // One final step advances the simulator to the completed state.
  }
}
function stopAuto(){
  if(state.timer){clearTimeout(state.timer);state.timer=null;}
  if(state.status==="playing"&&state.eventIndex>=0)state.status="paused";
}
function autoBattle(){
  if(!state.events.length)return;
  if(state.status==="done")return;
  state.status="playing";
  const tick=()=>{
    if(state.status!=="playing")return;
    stepBattle();
    if(state.status==="playing"){
      const duration=state.currentEvent?.duration||state.animationSpeed;
      state.timer=setTimeout(tick,duration);
    }else state.timer=null;
  };
  tick();
  render();
}
function undoBattle(){
  stopAuto();
  if(!state.snapshot){toast("되돌릴 전투 기록이 없습니다.");return;}
  state.fields=clone(state.snapshot.fields);
  state.scores=clone(state.snapshot.scores);
  state.eventIndex=-1;state.currentEvent=null;state.status="idle";
  $("eventTimeline").innerHTML="";
  $("battleMessage").textContent="전투 전 상태로 되돌렸습니다. 카드를 수정하고 다시 실험할 수 있습니다.";
  state.events=[];state.snapshot=null;
  render();
}
function resetAll(){
  stopAuto();
  state.fields.p1=Array(6).fill(false);state.fields.p2=Array(6).fill(false);
  state.scores={p1:0,p2:0};state.selectedType=null;state.selectedMagic=null;
  state.events=[];state.eventIndex=-1;state.currentEvent=null;state.snapshot=null;state.status="idle";
  $("eventTimeline").innerHTML="";$("battleMessage").textContent="실험실을 초기화했습니다.";
  $("selectedStatus").textContent="선택된 카드 없음";$("magicLabPanel").classList.add("hidden");
  renderLibrary();render();
}
function placeSelected(side,index){
  if(state.status==="playing"||state.status==="done"){toast("전투를 되돌린 뒤 필드를 수정하세요.");return;}
  if(state.fields[side][index]){state.fields[side][index]=false;render();return;}
  if(!state.selectedType){toast("오른쪽 카드 목록에서 먼저 카드를 선택하세요.");return;}
  if(!UNIT.includes(state.selectedType)){toast("마법 카드는 필드에 놓는 대신 마법 테스트 패널에서 적용하세요.");return;}
  const card={id:"lab-"+Date.now()+"-"+Math.random().toString(36).slice(2,7),type:state.selectedType};
  state.fields[side][index]=card;
  state.selectedType=null;$("selectedStatus").textContent="카드가 배치되었습니다. 다음 카드를 선택하세요.";
  renderLibrary();render();
}
function applyMagic(){
  const type=state.selectedMagic;
  if(!type){toast("먼저 마법 카드를 선택하세요.");return;}
  if(state.snapshot&&state.status!=="idle"){toast("먼저 전투를 되돌리세요.");return;}
  const side=$("magicTargetSide").value;
  const lane=Number($("magicLane").value);
  const row=Number($("magicRow").value);
  const index=lane+(row===0?0:3);
  if(type==="magicSwap"){
    const field=state.fields[side];
    [field[lane],field[lane+3]]=[field[lane+3],field[lane]];
    addNote(sideName(side)+" · "+laneName(lane)+" 줄의 전열/후열 교환");
    $("battleMessage").textContent=sideName(side)+"의 "+laneName(lane)+" 줄 전열과 후열을 교환했습니다.";
  }else if(type==="magicDestroy"){
    const victim=state.fields[side][index];
    if(!victim){toast("선택한 칸에 파괴할 카드가 없습니다.");return;}
    state.fields[side][index]=false;
    addNote(sideName(side)+" · "+laneName(lane)+" "+rowName(index)+"의 "+CARD[victim.type].name+" 파괴");
    $("battleMessage").textContent=sideName(side)+"의 "+CARD[victim.type].name+"를 파괴했습니다.";
  }else if(type==="magicReinforce"){
    const typeToAdd=$("magicUnitType").value;
    if(state.fields[side][index]){toast("선택한 필드 칸이 이미 차 있습니다.");return;}
    state.fields[side][index]={id:"lab-magic-"+Date.now(),type:typeToAdd};
    addNote(sideName(side)+" · "+CARD[typeToAdd].name+" 긴급 배치");
    $("battleMessage").textContent=sideName(side)+" 필드에 "+CARD[typeToAdd].name+"를 추가 배치했습니다.";
  }
  render();
}
function downloadNotes(){
  const lines=[
    "승부수 실험실 테스트 결과",
    "일시: "+new Date().toLocaleString("ko-KR"),
    "A 점수: "+state.scores.p1,
    "B 점수: "+state.scores.p2,
    "",
    "[플레이어 A 필드]",
    ...state.fields.p1.map((card,index)=>(index<3?"전열 ":"후열 ")+laneName(index%3)+": "+cardName(card)),
    "",
    "[플레이어 B 필드]",
    ...state.fields.p2.map((card,index)=>(index<3?"전열 ":"후열 ")+laneName(index%3)+": "+cardName(card)),
    "",
    "[전투 이벤트]",
    ...state.events.map((event,index)=>(index+1)+". "+event.text),
    "",
    "[실험 메모]",
    $("testNotes").value
  ];
  const blob=new Blob([lines.join("\n")],{type:"text/plain;charset=utf-8"});
  const url=URL.createObjectURL(blob);
  const link=document.createElement("a");link.href=url;link.download="승부수_실험결과.txt";link.click();
  URL.revokeObjectURL(url);
}
function handleFieldClick(event){
  const button=event.target.closest("[data-field-side][data-index]");
  if(!button)return;
  const side=button.dataset.fieldSide,index=Number(button.dataset.index);
  if(state.fields[side][index]){
    if(state.status==="playing"||state.status==="done"){toast("전투를 되돌린 뒤 카드를 제거하세요.");return;}
    state.fields[side][index]=false;render();return;
  }
  placeSelected(side,index);
}
function wire(){
  document.querySelectorAll("[data-side]").forEach(button=>button.addEventListener("click",()=>setActiveSide(button.dataset.side)));
  document.querySelectorAll("[data-card-type]").forEach(()=>{}); // Library buttons are delegated below.
  ["basicCards","specialCards","magicCards"].forEach(id=>$(id).addEventListener("click",event=>{
    const button=event.target.closest("[data-card-type]");
    if(button)chooseCard(button.dataset.cardType);
  }));
  $("fieldA").addEventListener("click",handleFieldClick);
  $("fieldB").addEventListener("click",handleFieldClick);
  $("clearSelection").addEventListener("click",()=>{
    state.selectedType=null;state.selectedMagic=null;$("magicLabPanel").classList.add("hidden");
    $("selectedStatus").textContent="선택된 카드 없음";renderLibrary();
  });
  $("clearA").addEventListener("click",()=>{if(state.status==="playing")return;state.fields.p1=Array(6).fill(false);render();});
  $("clearB").addEventListener("click",()=>{if(state.status==="playing")return;state.fields.p2=Array(6).fill(false);render();});
  $("resetAll").addEventListener("click",resetAll);
  $("startBattle").addEventListener("click",startBattle);
  $("stepBattle").addEventListener("click",stepBattle);
  $("autoBattle").addEventListener("click",autoBattle);
  $("stopBattle").addEventListener("click",()=>{stopAuto();render();});
  $("undoBattle").addEventListener("click",undoBattle);
  $("applyMagic").addEventListener("click",applyMagic);
  $("downloadNotes").addEventListener("click",downloadNotes);
  ["winTarget","linePoint","fistMultiplier","paperBonus","animationSpeed"].forEach(id=>$(id).addEventListener("change",getRules));
}
function init(){
  $("magicUnitRow")?.classList.add("hidden");
  renderLibrary();
  wire();
  getRules();
  render();
}
init();
})();