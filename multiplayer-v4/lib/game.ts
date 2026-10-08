export type Stat = 'economy' | 'support' | 'military' | 'infrastructure' | 'relations';
export type Stats = Record<Stat, number>;
export const STAT_NAMES: Record<Stat,string> = {economy:'경제',support:'국민 지지율',military:'군사력',infrastructure:'인프라',relations:'국제 관계'};
export const NATIONS = [
 {name:'아우로리아 연방',short:'아우로리아',theory:'현실주의',color:'#f07878',motto:'안보가 있어야 국가도 있다',region:'북부 산악 지대',want:'군사력 65 이상',goal:'military' as Stat,stats:{economy:48,support:60,military:78,infrastructure:45,relations:35},money:110,description:'힘의 균형과 자국의 생존을 우선합니다. 군사력이 강하지만 외교적 신뢰를 쌓아야 합니다.'},
 {name:'벨바르 공화국',short:'벨바르',theory:'자유주의',color:'#78b6ff',motto:'교역과 협력으로 번영을',region:'동부 해안 무역권',want:'경제 70 이상',goal:'economy' as Stat,stats:{economy:76,support:55,military:35,infrastructure:60,relations:55},money:125,description:'제도와 무역, 상호 의존을 중시합니다. 협력에 유리하지만 군사적 압박에 취약합니다.'},
 {name:'키레네 왕국',short:'키레네',theory:'종속이론',color:'#edbd67',motto:'자원을 넘어 자립으로',region:'남부 자원·해협 지대',want:'인프라 60 이상',goal:'infrastructure' as Stat,stats:{economy:57,support:48,military:50,infrastructure:35,relations:45},money:140,description:'불평등한 경제 구조와 외부 의존을 경계합니다. 자원 수입을 산업과 기반 시설로 전환해야 합니다.'},
 {name:'도란 중립연합',short:'도란',theory:'구성주의',color:'#76d9bb',motto:'신뢰가 세계를 바꾼다',region:'서부 고원 중립권',want:'국제 관계 70 이상',goal:'relations' as Stat,stats:{economy:52,support:70,military:25,infrastructure:58,relations:80},money:105,description:'정체성, 규범, 인식의 변화를 중시합니다. 높은 신뢰를 바탕으로 평화와 협력을 이끌 수 있습니다.'}
];
export type Effect = Partial<Stats> & {money?:number};
export type Choice = {label:string;detail:string;effect:Effect;tension:number};
export const CHOICES: Choice[][] = [
 [{label:'방위 체계 개편',detail:'군사 +16 · 지지 +5 · 국제 관계 −9 · 국고 −25',effect:{military:16,support:5,relations:-9,money:-25},tension:6},{label:'안보 대화 개시',detail:'국제 관계 +16 · 경제 +7 · 군사 −8',effect:{relations:16,economy:7,military:-8},tension:-5},{label:'군수품 수출',detail:'국고 +45 · 경제 +8 · 지지 −8 · 국제 관계 −12',effect:{money:45,economy:8,support:-8,relations:-12},tension:8}],
 [{label:'공동 시장 확대',detail:'경제 +16 · 국제 관계 +8 · 국고 −30',effect:{economy:16,relations:8,money:-30},tension:-3},{label:'긴급 보호 관세',detail:'국고 +40 · 경제 +6 · 국제 관계 −14 · 지지 −5',effect:{money:40,economy:6,relations:-14,support:-5},tension:5},{label:'사회 안전망 투자',detail:'지지 +18 · 인프라 +8 · 국고 −35',effect:{support:18,infrastructure:8,money:-35},tension:-2}],
 [{label:'자원 산업 국유화',detail:'국고 +45 · 지지 +12 · 국제 관계 −15 · 경제 −6',effect:{money:45,support:12,relations:-15,economy:-6},tension:5},{label:'자립 산업 육성',detail:'인프라 +20 · 경제 +10 · 국고 −40',effect:{infrastructure:20,economy:10,money:-40},tension:0},{label:'해외 자본 유치',detail:'국고 +35 · 경제 +15 · 지지 −14 · 인프라 −5',effect:{money:35,economy:15,support:-14,infrastructure:-5},tension:-2}],
 [{label:'평화 중재 회의',detail:'국제 관계 +18 · 지지 +8 · 국고 −25',effect:{relations:18,support:8,money:-25},tension:-8},{label:'국가 정체성 캠페인',detail:'지지 +18 · 국제 관계 +8 · 경제 −8',effect:{support:18,relations:8,economy:-8},tension:-2},{label:'방위 노선 전환',detail:'군사 +20 · 국고 +20 · 지지 −15 · 국제 관계 −12',effect:{military:20,money:20,support:-15,relations:-12},tension:7}]
];
export const EVENTS = [
 {title:'해협의 긴장',description:'아르덴 해협에 군함이 집결했습니다. 군사 행동 비용이 25% 오릅니다. 해협을 끼고 있는 키레네의 인프라가 6 감소합니다.',category:'military',multiplier:1.25,effect:{relations:-4},nation:2,local:{infrastructure:-6},tension:8},
 {title:'세계 무역 회복',description:'해상 운송이 회복됩니다. 공개 행동 비용이 20% 내려가고 모든 국가의 경제가 7 증가합니다. 벨바르는 경제가 추가로 5 증가합니다.',category:'public',multiplier:.8,effect:{economy:7},nation:1,local:{economy:5},tension:-4},
 {title:'국제 팬데믹',description:'국경을 넘는 감염 확산. 모든 국가 경제 −9, 지지 −8, 인프라 −5. 국내 행동 비용 20% 상승. 도란은 국제 관계 +4.',category:'domestic',multiplier:1.2,effect:{economy:-9,support:-8,infrastructure:-5},nation:3,local:{relations:4},tension:9},
 {title:'국제 평화 주간',description:'시민들이 대화를 요구합니다. 공개 행동 비용 25% 감소. 모든 국가 지지 +3, 도란 국제 관계 +8.',category:'public',multiplier:.75,effect:{support:3},nation:3,local:{relations:8},tension:-8},
 {title:'기후 변화와 자연재해',description:'거센 폭풍과 홍수가 항구를 덮칩니다. 모든 국가 인프라 −12, 경제 −5. 국내 행동 비용 25% 상승. 해안국 벨바르 인프라 추가 −5.',category:'domestic',multiplier:1.25,effect:{infrastructure:-12,economy:-5},nation:1,local:{infrastructure:-5},tension:6},
 {title:'인구 구조의 변화',description:'고령화와 일손 부족이 사회를 흔듭니다. 모든 국가 경제 −6, 지지 −5. 국내 행동 비용 15% 상승. 키레네 인프라 추가 −4.',category:'domestic',multiplier:1.15,effect:{economy:-6,support:-5},nation:2,local:{infrastructure:-4},tension:2},
 {title:'기술 혁명과 디지털 전환',description:'자동화와 디지털 산업이 확산됩니다. 모든 국가 인프라 +10, 경제 +7, 지지 −4. 국내 행동 비용 20% 감소. 벨바르 경제 추가 +5.',category:'domestic',multiplier:.8,effect:{infrastructure:10,economy:7,support:-4},nation:1,local:{economy:5},tension:-2}
];
export type Category = 'public'|'secret'|'military'|'domestic';
export type ActionDef = {id:string;name:string;category:Category;cost:number;seconds:number;target?:boolean;description:string};
export const ACTIONS: ActionDef[] = [
 {id:'statement',name:'평화 공식 성명',category:'public',cost:8,seconds:3,description:'국제 관계 +7 · 지지 +3 · 긴장 −3'},
 {id:'treaty',name:'협정 제안',category:'public',cost:20,seconds:5,target:true,description:'상대 수락 시 양국 경제 +10 · 관계 +8 · 긴장 −5'},
 {id:'aid',name:'경제 원조',category:'public',cost:35,seconds:8,target:true,description:'상대 국고 +25 · 경제 +7 / 나의 관계 +10 · 지지 −3'},
 {id:'sanction',name:'경제 제재',category:'public',cost:25,seconds:10,target:true,description:'상대 경제 −13 · 국고 −15 / 나의 경제 −4 · 관계 −5 · 긴장 +8'},
 {id:'message',name:'비밀 전문',category:'secret',cost:0,seconds:0,target:true,description:'두 국가에만 전달 · 턴당 6회 · 240자 이내'},
 {id:'backchannel',name:'비공개 협력 제안',category:'secret',cost:18,seconds:8,target:true,description:'상대 수락 시 양국 국고 +15 · 관계 +6. 제안·결과는 두 국가만 열람'},
 {id:'mobilize',name:'국경 병력 증강',category:'military',cost:28,seconds:12,description:'군사 +13 · 지지 +3 · 관계 −6 · 긴장 +7'},
 {id:'ultimatum',name:'최후통첩',category:'military',cost:18,seconds:7,target:true,description:'상대가 양보하면 국고 20 이전. 거부·기한 만료 시 상대 지지 +4 · 긴장 +6'},
 {id:'war',name:'전쟁 선포',category:'military',cost:55,seconds:20,target:true,description:'군사력 비교로 승패 결정. 양국 군사·경제·기반 시설 손실, 선전국 관계 −22 · 긴장 +22'},
 {id:'economy',name:'산업 투자',category:'domestic',cost:30,seconds:12,description:'경제 +13 · 인프라 +3'},
 {id:'support',name:'민생 지원',category:'domestic',cost:25,seconds:8,description:'국민 지지율 +15'},
 {id:'infrastructure',name:'기반 시설 건설',category:'domestic',cost:32,seconds:15,description:'인프라 +16 · 경제 +4'}
];
export type Player = {id:string;name:string;nation:number;ready:boolean;lastSeen:number;stats:Stats;money:number;choice:number|null;used:Record<string,number>;history:Record<string,number>};
export function canStart(players: Pick<Player, 'nation'|'ready'>[]) {
 return players.length>=2 && players.length<=4 && players.every(p=>p.ready&&Number.isInteger(p.nation)&&p.nation>=0&&p.nation<NATIONS.length) && new Set(players.map(p=>p.nation)).size===players.length;
}
export type Job = {id:string;actor:number;target:number;action:string;start:number;end:number;text:string};
export type Offer = {id:string;from:number;to:number;kind:string;expires:number;status:'pending'|'accepted'|'rejected'|'expired'};
export type Log = {id:string;round:number;text:string;actor:number;kind:string;privateTo?:number[]};
export type Article = {headline:string;body:string;image:number;tag:string};
export type Edition = {nation:number;articles:Article[]};
export type News = {id?:string;round:number;title:string;body:string;impacts:{nation:number;delta:number;reason:string}[];editions?:Edition[];breaking?:boolean;at?:number};
export type PairRelation = {a:number;b:number;value:number;label:string;reason:string};
export type Reaction = {id:string;nation:number;text:string;at:number;urgent:boolean;privateTo?:number[]};
export type Room = {code:string;host:string;status:'lobby'|'playing'|'finished';players:Player[];round:number;duration:number;deadline:number;clock:number;event:number;tension:number;jobs:Job[];offers:Offer[];logs:Log[];news:News[];seed:number;processed:string[];created:number;relations?:PairRelation[];reactions?:Reaction[];bulletins?:News[];nextEvent?:number;pandemicAt?:number;pressCooldown?:Record<string,number>};
export class GameError extends Error {}
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
function assert(ok:unknown,text:string):asserts ok {if(!ok)throw new GameError(text);}
export function effect(p:Player,e:Effect){for(const key of Object.keys(STAT_NAMES) as Stat[])if(e[key])p.stats[key]=clamp(p.stats[key]+e[key]!);p.money=clamp(p.money+(e.money||0),0,9999);}
function random(r:Room){r.seed=(Math.imul(1664525,r.seed)+1013904223)>>>0;return r.seed/4294967296;}
const byNation=(r:Room,n:number)=>r.players.find(p=>p.nation===n)!;
function log(r:Room,text:string,actor=-1,kind='world',privateTo?:number[]){r.logs.push({id:crypto.randomUUID(),round:r.round,text,actor,kind,...(privateTo?{privateTo}: {})});}
const short=(n:number)=>NATIONS[n]?.short||'국가';
export function createRoom(code:string,id:string,name:string,now:number,duration=90):Room{return {code,host:id,status:'lobby',players:[newPlayer(id,name,now)],round:0,duration,deadline:0,clock:now,event:0,tension:30,jobs:[],offers:[],logs:[],news:[],seed:crypto.getRandomValues(new Uint32Array(1))[0],processed:[],created:now};}
function newPlayer(id:string,name:string,now:number):Player{return {id,name,nation:-1,ready:false,lastSeen:now,stats:{economy:0,support:0,military:0,infrastructure:0,relations:0},money:0,choice:null,used:{},history:{}};}
export function income(p:Player){return .28+p.stats.economy/150+p.stats.infrastructure/300+(p.nation===2?.1:0);}
export function price(r:Room,a:ActionDef){const e=EVENTS[r.event];return Math.ceil(a.cost*(e.category===a.category?e.multiplier:1));}
function beginRound(r:Room){
 r.event=r.nextEvent??Math.floor(random(r)*EVENTS.length);r.nextEvent=Math.floor(random(r)*EVENTS.length);
 const before=snapshot(r),e=EVENTS[r.event];r.tension=clamp(r.tension+e.tension);
 for(const p of r.players){p.choice=null;p.used={};effect(p,e.effect);if(p.nation===e.nation)effect(p,e.local);}
 log(r,`${e.title}: ${e.description}`);
 if(r.event===2&&r.pandemicAt===undefined)r.pandemicAt=r.clock;
 recordChanges(r,before,e.title);
 publishExtra(r,e.title,[eventArticle(r.event),forecastArticle(r)]);
}
function makeNews(r:Room){const before=snapshot(r);const recent=r.logs.filter(l=>l.round>r.round-2&&!l.privateTo);const wars=recent.filter(l=>l.kind==='war').length;const sanctions=recent.filter(l=>l.kind==='sanction').length;const cooperation=recent.filter(l=>['aid','treaty','statement'].includes(l.kind)).length;const title=wars?'전쟁의 대가, 흔들리는 세계 질서':sanctions>cooperation?'제재의 연쇄, 좁아지는 협상의 문':cooperation?'협력이 만든 변화, 긴장 완화의 실마리':'각국의 내정 선택, 다음 균형을 결정하다';const impacts=r.players.map(p=>{const own=recent.filter(l=>l.actor===p.nation);const aggressive=own.filter(l=>['war','sanction','mobilize'].includes(l.kind)).length;const peaceful=own.filter(l=>['aid','statement','treaty','infrastructure','support','economy'].includes(l.kind)).length;const goal=p.stats[NATIONS[p.nation].goal]>=(p.nation===0?65:p.nation===2?60:70);const delta=clamp(peaceful*2-aggressive*3+(goal?4:-4),-14,12);effect(p,{support:delta});return {nation:p.nation,delta,reason:`협력·내정 ${peaceful}건, 강경 행동 ${aggressive}건 · 국민 요구 ${goal?'충족':'미충족'}`};});const stories:Article[]=[];
 const pairs=(r.relations||[]).filter(p=>p.value!==0).sort((a,b)=>Math.abs(b.value)-Math.abs(a.value));
 if(pairs[0])stories.push(relationArticle(pairs[0]));
 stories.push(eventArticle(r.event),forecastArticle(r));
 r.news.push({id:crypto.randomUUID(),round:r.round,title,body:'',impacts,editions:editions(r,stories.slice(0,3)),at:r.clock});
 log(r,`${r.round}턴 국제 뉴스가 발행되었습니다. 국민 지지율에 여론 평가가 반영됩니다.`);recordChanges(r,before,'국제 여론 평가');
}

function resolveJob(r:Room,j:Job){const before=snapshot(r);const p=byNation(r,j.actor),t=byNation(r,j.target),a=ACTIONS.find(a=>a.id===j.action)!;const n=short(p.nation),target=short(j.target);p.history[j.action]=(p.history[j.action]||0)+1;switch(j.action){
 case 'statement':effect(p,{relations:7,support:3});r.tension-=3;log(r,`${n}이 평화 성명을 발표했습니다. 국제 관계 +7, 지지 +3.`,p.nation,j.action);break;
 case 'aid':effect(t,{money:25,economy:7});effect(p,{relations:10,support:-3});r.tension-=3;log(r,`${n}이 ${target}에 원조했습니다. 수원국 국고 +25, 경제 +7.`,p.nation,j.action);break;
 case 'sanction':effect(t,{economy:-13,money:-15});effect(p,{economy:-4,relations:-5});r.tension+=8;log(r,`${n}의 ${target} 제재가 발효됐습니다. 상대 경제 −13, 국고 −15; 자국 경제 −4.`,p.nation,j.action);break;
 case 'mobilize':effect(p,{military:13,support:3,relations:-6});r.tension+=7;log(r,`${n}이 국경 병력을 증강했습니다. 군사 +13, 국제 관계 −6.`,p.nation,j.action);break;
 case 'economy':effect(p,{economy:13,infrastructure:3});log(r,`${n}의 산업 투자가 완료됐습니다. 경제 +13, 인프라 +3.`,p.nation,j.action);break;
 case 'support':effect(p,{support:15});log(r,`${n}의 민생 지원으로 국민 지지가 15 상승했습니다.`,p.nation,j.action);break;
 case 'infrastructure':effect(p,{infrastructure:16,economy:4});log(r,`${n}이 기반 시설을 확충했습니다. 인프라 +16, 경제 +4.`,p.nation,j.action);break;
 case 'message':log(r,`${n} → ${target}: ${j.text}`,p.nation,'message',[p.nation,t.nation]);break;
 case 'treaty':case 'backchannel':case 'ultimatum':{r.offers.push({id:j.id,from:p.nation,to:t.nation,kind:j.action,expires:r.deadline+r.duration*1000,status:'pending'});if(j.action==='ultimatum'){r.tension+=5;effect(p,{relations:-4});}log(r,`${n}이 ${target}에 ${a.name}을 전달했습니다. 다음 턴 종료까지 응답할 수 있습니다.`,p.nation,'offer',j.action==='backchannel'?[p.nation,t.nation]:undefined);break;}
 case 'war':{const power=p.stats.military+p.stats.infrastructure*.15,defense=t.stats.military+t.stats.infrastructure*.2;const win=power>defense;effect(p,{military:win?-18:-28,economy:-12,infrastructure:-8,support:win?6:-15,relations:-22});effect(t,{military:win?-28:-16,economy:-10,infrastructure:-15,support:win?-12:8});if(win){const transfer=Math.min(25,t.money);t.money-=transfer;p.money+=transfer;}r.tension+=22;log(r,`${n}이 ${target}에 전쟁을 선포해 ${win?'공세에 성공':'공세에 실패'}했습니다. 양국에 군사·경제·기반 시설 피해가 발생했습니다. ${n} 군사 ${win?'−18':'−28'}, ${target} 군사 ${win?'−28':'−16'}.`,p.nation,j.action);break;}
 }r.tension=clamp(r.tension);
 if(j.action==='aid')changeRelation(r,j.actor,j.target,20,'경제 원조');
 if(j.action==='sanction')changeRelation(r,j.actor,j.target,-30,'경제 제재');
 if(j.action==='ultimatum')changeRelation(r,j.actor,j.target,-20,'최후통첩');
 if(j.action==='war')changeRelation(r,j.actor,j.target,-100,'무력 충돌');
 if(!['message','backchannel','treaty'].includes(j.action))recordChanges(r,before,a.name);
}
function resolveOffer(r:Room,o:Offer,accept:boolean,expired=false){const before=snapshot(r);const p=byNation(r,o.from),t=byNation(r,o.to);o.status=expired?'expired':accept?'accepted':'rejected';if(accept){if(o.kind==='treaty'){effect(p,{economy:10,relations:8});effect(t,{economy:10,relations:8});r.tension=clamp(r.tension-5);p.history.treatyAccepted=(p.history.treatyAccepted||0)+1;t.history.treatyAccepted=(t.history.treatyAccepted||0)+1;}else if(o.kind==='backchannel'){effect(p,{money:15,relations:6});effect(t,{money:15,relations:6});}else{const amount=Math.min(t.money,20);t.money-=amount;p.money+=amount;effect(t,{support:-7});effect(p,{support:5});}}else if(o.kind==='ultimatum'){effect(t,{support:4});r.tension=clamp(r.tension+6);}log(r,`${short(o.to)}: ${short(o.from)}의 ${ACTIONS.find(a=>a.id===o.kind)?.name} ${expired?'기한 만료':accept?'수락':'거절'}${accept&&o.kind==='treaty'?' — 양국 경제 +10, 관계 +8':''}.`,o.to,accept&&o.kind==='treaty'?'treaty':'response',o.kind==='backchannel'?[o.from,o.to]:undefined);
 if(o.kind==='treaty'&&accept)changeRelation(r,o.from,o.to,40,'협정 체결');
 if(o.kind==='ultimatum'&&!accept)changeRelation(r,o.from,o.to,-10,'통첩 거부');
 recordChanges(r,before,accept?'외교 제안 수락':'외교 제안 거절',o.kind==='backchannel'?[o.from,o.to]:undefined);
}
export function tick(r:Room,now:number){ensureNarrative(r);if(r.status!=='playing')return;r.clock=Math.min(r.clock,now);let safety=0;while(r.clock<now&&r.status==='playing'&&safety++<500){const due=r.jobs.length?Math.min(...r.jobs.map(j=>j.end)):Infinity;const next=Math.min(now,r.deadline,due);const dt=Math.max(0,(next-r.clock)/1000);for(const p of r.players)p.money=clamp(p.money+income(p)*dt,0,9999);r.clock=next;const done=r.jobs.filter(j=>j.end<=next).sort((a,b)=>a.end-b.end||a.start-b.start||a.id.localeCompare(b.id));r.jobs=r.jobs.filter(j=>j.end>next);for(const j of done)resolveJob(r,j);if(next>=r.deadline){for(const p of r.players)if(p.choice===null){effect(p,{support:-6});log(r,`${short(p.nation)}의 정책 결정이 지연되어 지지가 6 감소했습니다.`,p.nation,'choice');}for(const o of r.offers)if(o.status==='pending'&&o.expires<=next)resolveOffer(r,o,false,true);if(r.round%2===0)makeNews(r);if(r.round>=10){for(const o of r.offers)if(o.status==='pending')resolveOffer(r,o,false,true);r.status='finished';log(r,'10턴이 종료되었습니다. 국가별 종합 평가를 확인하세요.');}else {r.round++;r.deadline+=r.duration*1000;beginRound(r);}}}}
export type Command = {type:string;requestId?:string;name?:string;nation?:number;duration?:number;round?:number;choice?:number;action?:string;target?:number;text?:string;offerId?:string;accept?:boolean};
export function command(r:Room,id:string,c:Command,now:number){tick(r,now);let p=r.players.find(p=>p.id===id);if(c.type==='join'){if(p){p.lastSeen=now;return;}assert(r.status==='lobby','게임이 이미 시작되었습니다.');assert(r.players.length<4,'이미 4명이 참가한 방입니다.');r.players.push(newPlayer(id,cleanName(c.name),now));return;}assert(p,'방에 먼저 참가해 주세요.');p.lastSeen=now;if(c.requestId&&r.processed.includes(`${id}:${c.requestId}`))return;
 if(['choice','action'].includes(c.type)&&c.round!==undefined)assert(c.round===r.round,'턴이 바뀌었습니다. 현재 정책과 사건을 확인한 뒤 다시 선택해 주세요.');
 if(c.type==='select'){assert(r.status==='lobby','대기실에서만 국가를 선택할 수 있습니다.');assert(Number.isInteger(c.nation)&&c.nation!>=0&&c.nation!<4,'국가를 선택해 주세요.');assert(!r.players.some(x=>x.id!==id&&x.nation===c.nation),'다른 플레이어가 선택한 국가입니다.');p.nation=c.nation!;p.ready=false;}
 else if(c.type==='ready'){assert(r.status==='lobby'&&p.nation>=0,'국가를 먼저 선택해 주세요.');p.ready=!p.ready;}
 else if(c.type==='duration'){assert(id===r.host&&r.status==='lobby','방장만 대기실에서 시간을 바꿀 수 있습니다.');assert([60,90,120].includes(c.duration!), '60, 90, 120초 중 선택해 주세요.');r.duration=c.duration!;}
 else if(c.type==='leave'){assert(r.status==='lobby','진행 중에는 재접속으로 복귀할 수 있습니다.');r.players=r.players.filter(x=>x.id!==id);if(r.host===id)r.host=r.players[0]?.id||'';}
 else if(c.type==='start'){assert(id===r.host,'방장만 시작할 수 있습니다.');assert(r.status==='lobby'&&canStart(r.players),'2~4명이 참가하고 모두 서로 다른 국가를 선택한 뒤 준비해야 합니다.');r.status='playing';r.round=1;r.clock=now;r.deadline=now+r.duration*1000;for(const x of r.players){x.stats={...NATIONS[x.nation].stats};x.money=NATIONS[x.nation].money;}beginRound(r);}
 else if(c.type==='choice'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice===null,'이미 이번 턴의 정책을 선택했습니다.');assert(Number.isInteger(c.choice)&&c.choice!>=0&&c.choice!<3,'정책을 선택해 주세요.');const before=snapshot(r);const choice=CHOICES[p.nation][c.choice!];assert(p.money+(choice.effect.money||0)>=0,'국고가 부족합니다.');effect(p,choice.effect);p.choice=c.choice!;r.tension=clamp(r.tension+choice.tension);p.history[`choice${c.choice}`]=(p.history[`choice${c.choice}`]||0)+1;log(r,`${short(p.nation)}이 ${choice.label} 정책을 채택했습니다. ${choice.detail}`,p.nation,'choice');recordChanges(r,before,choice.label);}
 else if(c.type==='action'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');const a=ACTIONS.find(a=>a.id===c.action);assert(a,'알 수 없는 행동입니다.');const other=r.players.find(x=>x.nation===c.target&&x.id!==id);assert(!a.target||other,'대상 국가를 선택해 주세요.');assert((p.used[a.id]||0)<(a.id==='message'?6:1),a.id==='message'?'전문은 턴당 6회 보낼 수 있습니다.':'같은 행동은 턴당 한 번 가능합니다.');assert(r.jobs.filter(j=>j.actor===p!.nation).length<4,'동시에 진행할 수 있는 행동은 4개입니다.');assert(now+a.seconds*1000<=r.deadline,'이번 턴 안에 완료할 시간이 부족합니다.');assert(p.money>=price(r,a),'국고가 부족합니다.');const text=typeof c.text==='string'?c.text.trim():'';assert(a.id!=='message'||(text.length>0&&text.length<=240),'비밀 전문은 1~240자로 작성해 주세요.');if(a.id==='war')assert(p.stats.military>=20,'전쟁을 시작하려면 군사력 20 이상이 필요합니다.');p.money-=price(r,a);p.used[a.id]=(p.used[a.id]||0)+1;const j={id:crypto.randomUUID(),actor:p.nation,target:c.target??-1,action:a.id,start:now,end:now+a.seconds*1000,text};if(a.seconds===0)resolveJob(r,j);else r.jobs.push(j);}
 else if(c.type==='respond'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(typeof c.accept==='boolean','응답을 선택해 주세요.');const o=r.offers.find(o=>o.id===c.offerId);assert(o&&o.to===p.nation&&o.status==='pending','응답 가능한 제안이 없습니다.');resolveOffer(r,o,c.accept);}
 else if(c.type!=='heartbeat')throw new GameError('알 수 없는 요청입니다.');
 if(c.requestId){r.processed.push(`${id}:${c.requestId}`);r.processed=r.processed.slice(-180);}
}
export function cleanName(name:unknown){assert(typeof name==='string'&&name.trim().length>0&&name.trim().length<=16,'이름은 1~16자로 입력해 주세요.');return name.trim();}
export function score(p:Player){const s=p.stats;const prosperity=Math.round((s.economy+s.infrastructure)/2),stability=Math.round(s.support),security=Math.round(s.military),diplomacy=Math.round(s.relations),goal=Math.round(s[NATIONS[p.nation].goal]);return {prosperity,stability,security,diplomacy,goal,total:Math.round((prosperity+stability+security+diplomacy)*.2+goal*.2),style:(p.history.war||0)+(p.history.mobilize||0)>(p.history.treatyAccepted||0)+(p.history.statement||0)?'힘과 안보를 우선한 운영':'협력과 내정을 중시한 운영'};}
export function view(r:Room,id:string,now:number){ensureNarrative(r);const me=r.players.find(p=>p.id===id);assert(me,'방 참가자만 확인할 수 있습니다.');return {code:r.code,status:r.status,round:r.round,duration:r.duration,deadline:r.deadline,serverNow:now,event:r.event,tension:r.tension,isHost:r.host===id,players:r.players.map(p=>({...p,id:undefined,isMe:p.id===id,isHost:p.id===r.host,online:now-p.lastSeen<20000,money:Math.floor(p.money),used:p.id===id?p.used:{},history:p.id===id||r.status==='finished'?p.history:{}})),jobs:r.jobs.filter(j=>j.actor===me.nation),offers:r.offers.filter(o=>o.kind!=='backchannel'||o.from===me.nation||o.to===me.nation),logs:r.logs.filter(l=>!l.privateTo||l.privateTo.includes(me.nation)).slice(-160),news:r.news,bulletins:r.bulletins||[],relations:r.relations||[],reactions:(r.reactions||[]).filter(x=>!x.privateTo||x.privateTo.includes(me.nation)),pandemicAt:r.pandemicAt,scores:r.status==='finished'?r.players.map(p=>({nation:p.nation,name:p.name,...score(p)})).sort((a,b)=>b.total-a.total):[]};}
export type RoomView=ReturnType<typeof view>;

// Narrative state is stored in the room JSON; old rooms receive safe defaults.
function ensureNarrative(r:Room){
 r.relations??=[];r.reactions??=[];r.bulletins??=[];r.pressCooldown??={};
 if(r.status==='playing'&&r.nextEvent===undefined)r.nextEvent=Math.floor(random(r)*EVENTS.length);
 const active=r.players.filter(p=>p.nation>=0);
 for(let i=0;i<active.length;i++)for(let j=i+1;j<active.length;j++){
  const [a,b]=[active[i].nation,active[j].nation].sort((x,y)=>x-y);
  if(!r.relations.some(p=>p.a===a&&p.b===b))r.relations.push({a,b,value:0,label:'중립',reason:'공식 관계 수립'});
 }
 r.relations=r.relations.filter(x=>active.some(p=>p.nation===x.a)&&active.some(p=>p.nation===x.b));
}
export function relationLabel(value:number){return value<=-60?'충돌':value<=-15?'긴장':value>=35?'협력':value>=15?'우호':'중립';}
function changeRelation(r:Room,a:number,b:number,delta:number,reason:string){
 ensureNarrative(r);const pair=r.relations!.find(p=>p.a===Math.min(a,b)&&p.b===Math.max(a,b));if(!pair)return;
 const previous=pair.label;pair.value=reason==='무력 충돌'?-85:clamp(pair.value+delta,-100,100);pair.label=relationLabel(pair.value);pair.reason=reason;
 if(previous!==pair.label)publishExtra(r,'외교 기류 급변',[relationArticle(pair),forecastArticle(r)]);
}
function relationArticle(p:PairRelation):Article{
 const warm=p.value>0;
 return {tag:'외교 전선',headline:`${short(p.a)}·${short(p.b)}, ${p.label==='충돌'?'끝내 포성이 터졌다':warm?'손잡은 두 나라!':'얼어붙은 악수'}`,body:p.label==='충돌'?'포성이 대화를 삼켰다. 평범한 하루를 돌려달라는 목소리가 국경을 넘는다.':warm?'서로를 향한 문이 열렸다. 이 악수, 세계의 판을 뒤집을지도!':'차가운 말이 국경을 오간다. 대화의 문마저 닫히는 것 아닌가!',image:warm?4:5};
}
const EVENT_COPY:Article[]=[
 {tag:'해협',headline:'해협에 드리운 강철 그림자',body:'군함이 바다의 침묵을 깼다. 작은 오해가 거대한 불씨가 될 판이다!',image:5},
 {tag:'무역',headline:'잠들었던 항구가 깨어났다!',body:'뱃고동이 다시 울린다. 상인들은 벌써 황금빛 내일을 꿈꾼다.',image:4},
 {tag:'보건 경보',headline:'국경도 못 막은 공포',body:'빈 거리에 불안이 번진다. 병상과 연대가 필요한데, 정치는 어디에 있나!',image:0},
 {tag:'평화',headline:'광장을 메운 “대화하라!”',body:'시민들이 포성보다 악수를 원한다. 이제 지도자들이 답할 차례다.',image:4},
 {tag:'기후 위기',headline:'하늘이 뒤집혔다, 도시가 잠겼다',body:'폭풍이 평범한 하루를 삼켰다. 무너진 길 앞에서 시민들의 한숨이 깊다.',image:1},
 {tag:'사회',headline:'빈 일터, 늙어가는 거리',body:'일할 손은 줄고 돌봄의 짐은 커진다. 내일을 맡길 사람은 어디에 있나!',image:3},
 {tag:'기술',headline:'기계가 출근하는 시대!',body:'새 산업의 문이 활짝 열렸다. 환호 뒤에는 일자리를 걱정하는 목소리도 있다.',image:2}
];
function eventArticle(index:number):Article{return {...EVENT_COPY[index]};}
function forecastArticle(r:Room):Article{
 if(r.round>=10)return {tag:'마지막 국면',headline:'마지막 선택, 기록으로 남는다',body:'지도자들의 선택이 거리의 기억으로 남는다. 번영과 평화, 무엇을 지켜냈는가?',image:4};
 const hints=['해협에 군함이 모인다. 평온한 바다를 믿어도 될까?','항구에 주문이 몰린다. 다시 교역의 바람이 불 조짐이다.','낯선 감염 소식이 국경을 넘는다. 보건 당국은 긴장을 늦추지 말라!','거리마다 대화의 깃발이 오른다. 평화를 향한 큰 물결이 다가온다.','기상 관측소의 경고가 심상치 않다. 도시를 지킬 준비는 됐는가?','구인 공고가 늘어도 지원자는 뜸하다. 돌봄과 일터가 함께 흔들릴 조짐이다.','연구소와 공장에 새 바람이 분다. 거대한 산업 변화가 문을 두드린다.'];
 const i=r.nextEvent??r.event;return {tag:'다음 국면 예고',headline:'심상치 않은 전조',body:hints[i],image:EVENT_COPY[i].image};
}
function editions(r:Room,stories:Article[]):Edition[]{
 const frames=[['안보가 먼저다','경계 없는 낙관은 금물.'],['시장은 기다리지 않는다','새 판을 읽는 자가 기회를 잡는다.'],['우리 삶은 우리가 지킨다','바깥의 약속보다 우리 터전부터!'],['신뢰를 잃으면 모두가 진다','지금 필요한 건 서로의 목소리다.']];
 return r.players.map(p=>({nation:p.nation,articles:stories.map((s,i)=>({...s,headline:i===0?`${frames[p.nation][0]} — ${s.headline}`:s.headline,body:i===0?`${s.body.split(/(?<=[.!?])\s/)[0]} ${frames[p.nation][1]}`:s.body}))}));
}
function publishExtra(r:Room,title:string,stories:Article[]){
 r.bulletins??=[];r.bulletins.push({id:crypto.randomUUID(),round:r.round,title,body:'',impacts:[],editions:editions(r,stories),breaking:true,at:r.clock});r.bulletins=r.bulletins.slice(-32);
}
function snapshot(r:Room){return r.players.map(p=>({nation:p.nation,stats:{...p.stats}}));}
const VOICES:Record<Stat,[string,string]>={
 economy:['가게 문 열 맛 나네! 살림도 좀 펴지겠지?','장사는 안 되고 한숨만 나와요!'],
 support:['이번 선택, 마음에 쏙 드는구먼!','우리 목소리 좀 들어 줍시다!'],
 military:['든든하긴 한데, 평화도 지켜 주시오!','이러다 국경을 누가 지키나!'],
 infrastructure:['길이 뻥 뚫리니 속까지 시원하네!','길도 끊기고 생활이 멈췄잖여!'],
 relations:['저 나라랑 손잡는다니 반가운 소식이네!','이웃하고 척져서 어쩌려고 그래요!']
};
function recordChanges(r:Room,before:ReturnType<typeof snapshot>,cause:string,privateTo?:number[]){
 ensureNarrative(r);const alerts:Article[]=[];
 for(const p of r.players){const prev=before.find(x=>x.nation===p.nation);if(!prev)continue;
 const changes=(Object.keys(STAT_NAMES) as Stat[]).map(stat=>({stat,delta:p.stats[stat]-prev.stats[stat]})).sort((a,b)=>Math.abs(b.delta)-Math.abs(a.delta));
 const largest=changes[0];if(!largest||largest.delta===0)continue;
 const crossing=changes.find(x=>x.delta!==0&&((p.stats[x.stat]>=90&&prev.stats[x.stat]<90)||(p.stats[x.stat]<=10&&prev.stats[x.stat]>10)));
 const urgent=Math.abs(largest.delta)>=15||!!crossing;const subject=crossing||largest;
 r.reactions!.push({id:crypto.randomUUID(),nation:p.nation,at:r.clock,urgent,text:`${cause}! ${VOICES[largest.stat][largest.delta>0?0:1]}`,...(privateTo?{privateTo}:{})});
 const key=`${p.nation}:${subject.stat}`;
 if(urgent&&!privateTo&&(r.pressCooldown![key]===undefined||r.clock-r.pressCooldown![key]>=12000)){
  r.pressCooldown![key]=r.clock;
  const up=subject.delta>0;
  alerts.push({tag:'긴급 현장',headline:`${short(p.nation)}, ${STAT_NAMES[subject.stat]} ${up?'판도가 뒤집혔다!':'위태로운 급변!'}`,body:`${cause} 이후 거리의 공기가 달라졌다. ${VOICES[subject.stat][up?0:1]}`,image:subject.stat==='military'?5:subject.stat==='relations'?4:subject.stat==='infrastructure'?up?2:1:subject.stat==='support'?3:2});
 }
 }
 r.reactions=r.reactions!.slice(-48);
 if(alerts.length)publishExtra(r,'긴급 호외',[...alerts.slice(0,3),forecastArticle(r)].slice(0,4));
}
