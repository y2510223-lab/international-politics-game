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
 [{label:'방위 체계 개편',detail:'군사 +16 · 지지 +5 · 국제 관계 −9 · 국고 −25',effect:{military:16,support:5,relations:-9,money:-25},tension:6},{label:'안보 대화 개시',detail:'국제 관계 +16 · 경제 +7 · 군사 −8',effect:{relations:16,economy:7,military:-8},tension:-5},{label:'군수품 수출',detail:'국고 +45 · 경제 +8 · 지지 −8 · 국제 관계 −12',effect:{money:24,economy:8,support:-8,relations:-12},tension:8}],
 [{label:'공동 시장 확대',detail:'경제 +16 · 국제 관계 +8 · 국고 −30',effect:{economy:16,relations:8,money:-30},tension:-3},{label:'긴급 보호 관세',detail:'국고 +40 · 경제 +6 · 국제 관계 −14 · 지지 −5',effect:{money:22,economy:6,relations:-14,support:-5},tension:5},{label:'사회 안전망 투자',detail:'지지 +18 · 인프라 +8 · 국고 −35',effect:{support:18,infrastructure:8,money:-35},tension:-2}],
 [{label:'자원 산업 국유화',detail:'국고 +45 · 지지 +12 · 국제 관계 −15 · 경제 −6',effect:{money:24,support:12,relations:-15,economy:-6},tension:5},{label:'자립 산업 육성',detail:'인프라 +20 · 경제 +10 · 국고 −40',effect:{infrastructure:20,economy:10,money:-40},tension:0},{label:'해외 자본 유치',detail:'국고 +35 · 경제 +15 · 지지 −14 · 인프라 −5',effect:{money:20,economy:15,support:-14,infrastructure:-5},tension:-2}],
 [{label:'평화 중재 회의',detail:'국제 관계 +18 · 지지 +8 · 국고 −25',effect:{relations:18,support:8,money:-25},tension:-8},{label:'국가 정체성 캠페인',detail:'지지 +18 · 국제 관계 +8 · 경제 −8',effect:{support:18,relations:8,economy:-8},tension:-2},{label:'방위 노선 전환',detail:'군사 +20 · 국고 +20 · 지지 −15 · 국제 관계 −12',effect:{military:20,money:12,support:-15,relations:-12},tension:7}]
];
export type WorldEvent={title:string;description:string;category:string;multiplier:number;effect:Effect;nation:number;local:Effect;tension:number;deaths?:number;unemployed?:number;crisis?:string};
export const EVENTS:WorldEvent[] = [
 {title:'해협의 긴장',description:'아르덴 해협에 군함이 집결했습니다. 군사 행동 비용이 25% 오릅니다. 해협을 끼고 있는 키레네의 인프라가 6 감소합니다.',category:'military',multiplier:1.25,effect:{relations:-4},nation:2,local:{infrastructure:-6},tension:8},
 {title:'세계 무역 회복',description:'해상 운송이 회복됩니다. 공개 행동 비용이 20% 내려가고 모든 국가의 경제가 7 증가합니다. 벨바르는 경제가 추가로 5 증가합니다.',category:'public',multiplier:.8,effect:{economy:7},nation:1,local:{economy:5},tension:-4},
 {title:'국제 팬데믹',description:'국경을 넘는 감염 확산. 모든 국가 경제 −9, 지지 −8, 인프라 −5. 국내 행동 비용 20% 상승. 도란은 국제 관계 +4.',category:'domestic',multiplier:1.2,effect:{economy:-9,support:-8,infrastructure:-5},nation:3,local:{relations:4},tension:9,deaths:85,unemployed:95,crisis:'health'},
 {title:'국제 평화 주간',description:'시민들이 대화를 요구합니다. 공개 행동 비용 25% 감소. 모든 국가 지지 +3, 도란 국제 관계 +8.',category:'public',multiplier:.75,effect:{support:3},nation:3,local:{relations:8},tension:-8},
 {title:'기후 변화와 자연재해',description:'거센 폭풍과 홍수가 항구를 덮칩니다. 모든 국가 인프라 −12, 경제 −5. 국내 행동 비용 25% 상승. 해안국 벨바르 인프라 추가 −5.',category:'domestic',multiplier:1.25,effect:{infrastructure:-12,economy:-5},nation:1,local:{infrastructure:-5},tension:6,deaths:60,unemployed:70,crisis:'disaster'},
 {title:'인구 구조의 변화',description:'고령화와 일손 부족이 사회를 흔듭니다. 모든 국가 경제 −6, 지지 −5. 국내 행동 비용 15% 상승. 키레네 인프라 추가 −4.',category:'domestic',multiplier:1.15,effect:{economy:-6,support:-5},nation:2,local:{infrastructure:-4},tension:2,unemployed:25},
 {title:'기술 혁명과 디지털 전환',description:'자동화와 디지털 산업이 확산됩니다. 모든 국가 인프라 +10, 경제 +7, 지지 −4. 국내 행동 비용 20% 감소. 벨바르 경제 추가 +5.',category:'domestic',multiplier:.8,effect:{infrastructure:10,economy:7,support:-4},nation:1,local:{economy:5},tension:-2,unemployed:24},
 {title:'세계 금융 위기',description:'은행의 대출 문이 닫히고 기업의 도산이 이어집니다.',category:'domestic',multiplier:1.3,effect:{economy:-15,support:-7},nation:1,local:{economy:-4},tension:8,unemployed:130,crisis:'finance'},
 {title:'식량 공급 붕괴',description:'흉작과 수출 제한으로 식탁이 위태로워집니다.',category:'domestic',multiplier:1.25,effect:{economy:-7,support:-12},nation:2,local:{support:-3},tension:9,deaths:22,unemployed:35,crisis:'food'},
 {title:'대규모 정전',description:'도시의 불이 꺼지고 공장의 생산이 멈췄습니다.',category:'domestic',multiplier:1.2,effect:{infrastructure:-14,economy:-8},nation:0,local:{infrastructure:-3},tension:6,deaths:14,unemployed:80,crisis:'disaster'},
 {title:'국제 사이버 공격',description:'금융망과 공공 서비스가 동시에 흔들립니다.',category:'secret',multiplier:1.4,effect:{economy:-9,relations:-8,infrastructure:-6},nation:1,local:{economy:-3},tension:12,unemployed:65,crisis:'cyber'},
 {title:'대지진과 물류 마비',description:'건물과 도로가 무너지고 구조대가 현장으로 향합니다.',category:'domestic',multiplier:1.3,effect:{infrastructure:-18,support:-9,economy:-6},nation:3,local:{infrastructure:-3},tension:8,deaths:110,unemployed:100,crisis:'disaster'},
 {title:'난민 이동과 주거 위기',description:'삶의 터전을 잃은 이들이 몰리며 주거와 구호 체계에 부담이 커집니다.',category:'public',multiplier:1.2,effect:{support:-9,infrastructure:-7},nation:2,local:{economy:-3},tension:7,deaths:16,unemployed:55,crisis:'disaster'}
];
export type Category = 'public'|'secret'|'military'|'domestic';
export type ActionDef = {id:string;name:string;category:Category;cost:number;seconds:number;target?:boolean;description:string};
export const ACTIONS: ActionDef[] = [
 {id:'statement',name:'평화 공식 성명',category:'public',cost:8,seconds:12,description:'국제 관계 +7 · 지지 +3 · 긴장 −3'},
 {id:'treaty',name:'협정 제안',category:'public',cost:20,seconds:20,target:true,description:'상대 수락 시 양국 경제 +10 · 관계 +8 · 긴장 −5'},
 {id:'aid',name:'경제 원조',category:'public',cost:35,seconds:28,target:true,description:'상대 국고 +25 · 경제 +7 / 나의 관계 +10 · 지지 −3'},
 {id:'sanction',name:'경제 제재',category:'public',cost:25,seconds:32,target:true,description:'상대 경제 −13 · 국고 −15 / 나의 경제 −4 · 관계 −5 · 긴장 +8'},
 {id:'message',name:'비밀 전문',category:'secret',cost:0,seconds:5,target:true,description:'두 국가에만 전달 · 턴당 6회 · 240자 이내'},
 {id:'backchannel',name:'비공개 협력 제안',category:'secret',cost:18,seconds:24,target:true,description:'상대 수락 시 양국 국고 +15 · 관계 +6. 제안·결과는 두 국가만 열람'},
 {id:'mobilize',name:'국경 병력 증강',category:'military',cost:28,seconds:35,description:'군사 +13 · 지지 +3 · 관계 −6 · 긴장 +7'},
 {id:'ultimatum',name:'최후통첩',category:'military',cost:18,seconds:24,target:true,description:'상대가 양보하면 국고 20 이전. 거부·기한 만료 시 상대 지지 +4 · 긴장 +6'},
 {id:'war',name:'전쟁 선포',category:'military',cost:55,seconds:55,target:true,description:'군사력 비교로 승패 결정. 양국 군사·경제·기반 시설 손실, 선전국 관계 −22 · 긴장 +22'},
 {id:'economy',name:'산업 투자',category:'domestic',cost:30,seconds:35,description:'경제 +13 · 인프라 +3'},
 {id:'support',name:'민생 지원',category:'domestic',cost:25,seconds:26,description:'국민 지지율 +15'},
 {id:'infrastructure',name:'기반 시설 건설',category:'domestic',cost:32,seconds:42,description:'인프라 +16 · 경제 +4'}
];
export type Player = {id:string;name:string;nation:number;ready:boolean;lastSeen:number;stats:Stats;money:number;choice:number|null;used:Record<string,number>;history:Record<string,number>;prepared?:Record<string,number>;deaths?:number;unemployed?:number;eventLosses?:Record<string,{deaths:number;unemployed:number}>};
export function canStart(players: Pick<Player, 'nation'|'ready'>[]) {
 return players.length>=2 && players.length<=4 && players.every(p=>p.ready&&Number.isInteger(p.nation)&&p.nation>=0&&p.nation<NATIONS.length) && new Set(players.map(p=>p.nation)).size===players.length;
}
export type Job = {id:string;actor:number;target:number;action:string;start:number;end:number;text:string;choice?:number;topic?:string};
export type Offer = {id:string;from:number;to:number;kind:string;expires:number;status:'pending'|'accepted'|'rejected'|'expired';topic?:string};
export type Log = {id:string;round:number;text:string;actor:number;kind:string;privateTo?:number[]};
export type Article = {headline:string;body:string;image:number;tag:string};
export type Edition = {nation:number;articles:Article[];figures?:{deaths:number;unemployed:number;worldDeaths:number;worldUnemployed:number;eventTitle:string;eventDeaths:number;worldEventDeaths:number}};
export type News = {id?:string;round:number;title:string;body:string;impacts:{nation:number;delta:number;reason:string}[];editions?:Edition[];breaking?:boolean;at?:number};
export type PairRelation = {a:number;b:number;value:number;label:string;reason:string};
export type Reaction = {id:string;nation:number;text:string;at:number;urgent:boolean;privateTo?:number[];speaker?:string;batch?:string};
export type Room = {code:string;host:string;status:'lobby'|'playing'|'finished';players:Player[];round:number;duration:number;deadline:number;clock:number;event:number;tension:number;jobs:Job[];offers:Offer[];logs:Log[];news:News[];seed:number;processed:string[];created:number;relations?:PairRelation[];reactions?:Reaction[];bulletins?:News[];nextEvent?:number;pandemicAt?:number;pressCooldown?:Record<string,number>;boycotts?:{from:number;target:number;until:number}[]};
export class GameError extends Error {}
const clamp=(n:number,min=0,max=100)=>Math.max(min,Math.min(max,n));
function assert(ok:unknown,text:string):asserts ok {if(!ok)throw new GameError(text);}
export function effect(p:Player,e:Effect){for(const key of Object.keys(STAT_NAMES) as Stat[])if(e[key])p.stats[key]=clamp(p.stats[key]+e[key]!);p.money=clamp(p.money+(e.money||0),0,9999);}
function random(r:Room){r.seed=(Math.imul(1664525,r.seed)+1013904223)>>>0;return r.seed/4294967296;}
const byNation=(r:Room,n:number)=>r.players.find(p=>p.nation===n)!;
function log(r:Room,text:string,actor=-1,kind='world',privateTo?:number[]){if(kind!=='message')text=qualitativeText(text);r.logs.push({id:crypto.randomUUID(),round:r.round,text,actor,kind,...(privateTo?{privateTo}: {})});}
const short=(n:number)=>NATIONS[n]?.short||'국가';
export function createRoom(code:string,id:string,name:string,now:number,duration=90):Room{return {code,host:id,status:'lobby',players:[newPlayer(id,name,now)],round:0,duration,deadline:0,clock:now,event:0,tension:30,jobs:[],offers:[],logs:[],news:[],seed:crypto.getRandomValues(new Uint32Array(1))[0],processed:[],created:now};}
function newPlayer(id:string,name:string,now:number):Player{return {id,name,nation:-1,ready:false,lastSeen:now,stats:{economy:0,support:0,military:0,infrastructure:0,relations:0},money:0,choice:null,used:{},history:{}};}
export function income(p:Player,r?:Room){const base=.055+p.stats.economy/1200+p.stats.infrastructure/2400+(p.nation===2?.015:0);return base*(r?.boycotts?.some(b=>b.target===p.nation&&b.until>r.clock)?.5:1);}
export function price(r:Room,a:ActionDef){const e=EVENTS[r.event];return Math.ceil(a.cost*(e.category===a.category?e.multiplier:1));}
function beginRound(r:Room){
 r.event=r.nextEvent??Math.floor(random(r)*EVENTS.length);r.nextEvent=Math.floor(random(r)*EVENTS.length);
 const before=snapshot(r),e=EVENTS[r.event];r.tension=clamp(r.tension+e.tension);
 for(const p of r.players){p.choice=null;p.used={};effect(p,e.effect);if(p.nation===e.nation)effect(p,e.local);}
 applyDisaster(r,e);
 log(r,`${e.title}: ${eventDescription(e)}`);
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

function resolveJob(r:Room,j:Job){const before=snapshot(r);const p=byNation(r,j.actor),t=byNation(r,j.target),a=ACTIONS.find(a=>a.id===j.action)!;const n=short(p.nation),target=short(j.target);
 if(j.action==='policy'){const c=CHOICES[p.nation][j.choice!];effect(p,{...c.effect,money:Math.max(0,c.effect.money||0)});r.tension=clamp(r.tension+c.tension);log(r,`${n}의 ${c.label} 정책 시행. ${describeEffect(c.effect)}`,p.nation,'choice');recordChanges(r,before,c.label);return;}
 p.history[j.action]=(p.history[j.action]||0)+1;switch(j.action){
 case 'statement':effect(p,{relations:7,support:3});r.tension-=3;log(r,`${n}이 평화 성명을 발표했습니다. 국제 관계 +7, 지지 +3.`,p.nation,j.action);break;
 case 'aid':effect(t,{money:25,economy:7});effect(p,{relations:10,support:-3});r.tension-=3;log(r,`${n}이 ${target}에 원조했습니다. 수원국 국고 +25, 경제 +7.`,p.nation,j.action);break;
 case 'sanction':effect(t,{economy:-13,money:-15});effect(p,{economy:-4,relations:-5});r.tension+=8;log(r,`${n}의 ${target} 제재가 발효됐습니다. 상대 경제 −13, 국고 −15; 자국 경제 −4.`,p.nation,j.action);break;
 case 'mobilize':effect(p,{military:13,support:3,relations:-6});r.tension+=7;log(r,`${n}이 국경 병력을 증강했습니다. 군사 +13, 국제 관계 −6.`,p.nation,j.action);break;
 case 'economy':effect(p,{economy:13,infrastructure:3});log(r,`${n}의 산업 투자가 완료됐습니다. 경제 +13, 인프라 +3.`,p.nation,j.action);break;
 case 'support':effect(p,{support:15});log(r,`${n}의 민생 지원으로 국민 지지가 15 상승했습니다.`,p.nation,j.action);break;
 case 'infrastructure':effect(p,{infrastructure:16,economy:4});log(r,`${n}이 기반 시설을 확충했습니다. 인프라 +16, 경제 +4.`,p.nation,j.action);break;
 case 'message':log(r,`${n} → ${target}: ${j.text}`,p.nation,'message',[p.nation,t.nation]);break;
 case 'treaty':case 'backchannel':case 'ultimatum':{r.offers.push({id:j.id,from:p.nation,to:t.nation,kind:j.action,topic:j.topic,expires:r.deadline+r.duration*1000,status:'pending'});if(j.action==='ultimatum'){r.tension+=5;effect(p,{relations:-4});}log(r,`${n}이 ${target}에 ${a.name}을 전달했습니다. 다음 턴 종료까지 응답할 수 있습니다.`,p.nation,'offer',j.action==='backchannel'?[p.nation,t.nation]:undefined);break;}
 case 'war':{const power=p.stats.military+p.stats.infrastructure*.15,defense=t.stats.military+t.stats.infrastructure*.2;const win=power>defense;effect(p,{military:win?-18:-28,economy:-12,infrastructure:-8,support:win?6:-15,relations:-22});effect(t,{military:win?-28:-16,economy:-10,infrastructure:-15,support:win?-12:8});if(win){const transfer=Math.min(25,t.money);t.money-=transfer;p.money+=transfer;}r.tension+=22;log(r,`${n}이 ${target}에 전쟁을 선포해 ${win?'공세에 성공':'공세에 실패'}했습니다. 양국에 군사·경제·기반 시설 피해가 발생했습니다. ${n} 군사 ${win?'−18':'−28'}, ${target} 군사 ${win?'−28':'−16'}.`,p.nation,j.action);break;}
 }r.tension=clamp(r.tension);
 if(['war','sanction','ultimatum'].includes(j.action))publicBacklash(r,j.actor,j.target,j.action);
 if(j.action==='war'){addLosses(p,'전쟁',Math.round(35+(100-p.stats.infrastructure)*.4),55);addLosses(t,'전쟁',Math.round(50+(100-t.stats.infrastructure)*.6),80);publishExtra(r,'전쟁 인명 피해',[{tag:'현장 집계',headline:'전장의 대가는 시민의 몫',body:'집으로 돌아오지 못한 이들이 늘어난다. 숫자 뒤에 남은 가족의 삶을 누가 책임질까.',image:5}]);}
 if(j.action==='economy')p.unemployed=Math.max(0,(p.unemployed||0)-24);
 if(j.action==='support')p.unemployed=Math.max(0,(p.unemployed||0)-12);
 if(j.action==='aid')solidarity(r,j.actor,j.target);
 if(j.action==='aid')changeRelation(r,j.actor,j.target,20,'경제 원조');
 if(j.action==='sanction')changeRelation(r,j.actor,j.target,-30,'경제 제재');
 if(j.action==='ultimatum')changeRelation(r,j.actor,j.target,-20,'최후통첩');
 if(j.action==='war')changeRelation(r,j.actor,j.target,-100,'무력 충돌');
 if(!['message','backchannel','treaty'].includes(j.action))recordChanges(r,before,a.name);
}
function resolveOffer(r:Room,o:Offer,accept:boolean,expired=false){const before=snapshot(r);const p=byNation(r,o.from),t=byNation(r,o.to);if(accept&&(o.kind==='treaty'||o.kind==='backchannel'))assert(t.money>=COOPERATION.find(x=>x.id===(o.topic||'trade'))!.contribution,'협력 분담 예산이 부족합니다.');o.status=expired?'expired':accept?'accepted':'rejected';if(accept){if(o.kind==='treaty'||o.kind==='backchannel'){
 const topic=COOPERATION.find(x=>x.id===(o.topic||'trade'))!;assert(t.money>=topic.contribution,'협력 분담 예산이 부족합니다.');t.money-=topic.contribution;
 for(const x of [p,t]){effect(x,topic.effect);x.prepared??={};if(topic.protection)x.prepared[topic.protection]=Math.min(60,(x.prepared[topic.protection]||0)+22);if(topic.id==='education')x.unemployed=Math.max(0,(x.unemployed||0)-40);}
 if(o.kind==='treaty'){r.tension=clamp(r.tension-4);p.history.treatyAccepted=(p.history.treatyAccepted||0)+1;t.history.treatyAccepted=(t.history.treatyAccepted||0)+1;
 publishExtra(r,'분야별 협력 체결',[{tag:'공동 대응',headline:`${short(o.from)}·${short(o.to)}, ${topic.name}`,body:topic.news,image:topic.image}]);}
 }else{const amount=Math.min(t.money,20);t.money-=amount;p.money+=amount;effect(t,{support:-7});effect(p,{support:5});}}else if(o.kind==='ultimatum'){effect(t,{support:4});r.tension=clamp(r.tension+6);}log(r,`${short(o.to)}: ${short(o.from)}의 ${ACTIONS.find(a=>a.id===o.kind)?.name} ${expired?'기한 만료':accept?'수락':'거절'}${accept&&(o.kind==='treaty'||o.kind==='backchannel')?' — '+COOPERATION.find(x=>x.id===(o.topic||'trade'))!.name:''}.`,o.to,accept&&o.kind==='treaty'?'treaty':'response',o.kind==='backchannel'?[o.from,o.to]:undefined);
 if(o.kind==='treaty'&&accept)changeRelation(r,o.from,o.to,40,'협정 체결');
 if(o.kind==='ultimatum'&&!accept)changeRelation(r,o.from,o.to,-10,'통첩 거부');
 recordChanges(r,before,accept?'외교 제안 수락':'외교 제안 거절',o.kind==='backchannel'?[o.from,o.to]:undefined);
}
export function tick(r:Room,now:number){ensureNarrative(r);if(r.status!=='playing')return;r.clock=Math.min(r.clock,now);let safety=0;while(r.clock<now&&r.status==='playing'&&safety++<500){const due=r.jobs.length?Math.min(...r.jobs.map(j=>j.end)):Infinity;const next=Math.min(now,r.deadline,due);const dt=Math.max(0,(next-r.clock)/1000);for(const p of r.players)p.money=clamp(p.money+income(p,r)*dt,0,9999);r.clock=next;const done=r.jobs.filter(j=>j.end<=next).sort((a,b)=>a.end-b.end||a.start-b.start||a.id.localeCompare(b.id));r.jobs=r.jobs.filter(j=>j.end>next);for(const j of done)resolveJob(r,j);if(next>=r.deadline){for(const p of r.players)if(p.choice===null){p.choice=-1;effect(p,{support:-3});log(r,`${short(p.nation)}이 정책을 자동 보류했습니다. 국민 지지가 소폭 하락합니다.`,p.nation,'choice');}for(const o of r.offers)if(o.status==='pending'&&o.expires<=next)resolveOffer(r,o,false,true);if(r.round%2===0)makeNews(r);if(r.round>=10){const remaining=[...r.jobs].sort((a,b)=>a.end-b.end);r.jobs=[];for(const j of remaining)resolveJob(r,j);for(const o of r.offers)if(o.status==='pending')resolveOffer(r,o,false,true);r.status='finished';log(r,'10턴이 종료되었습니다. 국가별 종합 평가를 확인하세요.');}else {r.round++;r.deadline+=r.duration*1000;beginRound(r);}}}}
export type Command = {type:string;requestId?:string;name?:string;nation?:number;duration?:number;round?:number;choice?:number;action?:string;target?:number;text?:string;offerId?:string;accept?:boolean;topic?:string};
export function command(r:Room,id:string,c:Command,now:number){tick(r,now);let p=r.players.find(p=>p.id===id);if(c.type==='join'){if(p){p.lastSeen=now;return;}assert(r.status==='lobby','게임이 이미 시작되었습니다.');assert(r.players.length<4,'이미 4명이 참가한 방입니다.');r.players.push(newPlayer(id,cleanName(c.name),now));return;}assert(p,'방에 먼저 참가해 주세요.');p.lastSeen=now;if(c.requestId&&r.processed.includes(`${id}:${c.requestId}`))return;
 if(['choice','action'].includes(c.type)&&c.round!==undefined)assert(c.round===r.round,'턴이 바뀌었습니다. 현재 정책과 사건을 확인한 뒤 다시 선택해 주세요.');
 if(c.type==='select'){assert(r.status==='lobby','대기실에서만 국가를 선택할 수 있습니다.');assert(Number.isInteger(c.nation)&&c.nation!>=0&&c.nation!<4,'국가를 선택해 주세요.');assert(!r.players.some(x=>x.id!==id&&x.nation===c.nation),'다른 플레이어가 선택한 국가입니다.');p.nation=c.nation!;p.ready=false;}
 else if(c.type==='ready'){assert(r.status==='lobby'&&p.nation>=0,'국가를 먼저 선택해 주세요.');p.ready=!p.ready;}
 else if(c.type==='duration'){assert(id===r.host&&r.status==='lobby','방장만 대기실에서 시간을 바꿀 수 있습니다.');assert([60,90,120].includes(c.duration!), '60, 90, 120초 중 선택해 주세요.');r.duration=c.duration!;}
 else if(c.type==='leave'){assert(r.status==='lobby','진행 중에는 재접속으로 복귀할 수 있습니다.');r.players=r.players.filter(x=>x.id!==id);if(r.host===id)r.host=r.players[0]?.id||'';}
 else if(c.type==='start'){assert(id===r.host,'방장만 시작할 수 있습니다.');assert(r.status==='lobby'&&canStart(r.players),'2~4명이 참가하고 모두 서로 다른 국가를 선택한 뒤 준비해야 합니다.');r.status='playing';r.round=1;r.clock=now;r.deadline=now+r.duration*1000;for(const x of r.players){x.stats={...NATIONS[x.nation].stats};x.money=NATIONS[x.nation].money;}beginRound(r);}
 else if(c.type==='choice'){
 assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice===null,'이미 이번 턴의 정책을 결정했습니다.');assert(Number.isInteger(c.choice)&&c.choice!>=-1&&c.choice!<3,'정책을 선택하거나 보류해 주세요.');
 if(c.choice===-1){p.choice=-1;log(r,`${short(p.nation)}이 이번 턴의 정책을 보류했습니다.`,p.nation,'choice');voice(r,p.nation,'정책 보류라니! 지켜보자는 사람도, 지금 움직이자는 사람도 있네요.');}
 else{const choice=CHOICES[p.nation][c.choice!];const cost=Math.max(0,-(choice.effect.money||0));assert(p.money>=cost,'정책 예산이 부족합니다. 보류할 수 있습니다.');p.money-=cost;p.choice=c.choice!;p.history[`choice${c.choice}`]=(p.history[`choice${c.choice}`]||0)+1;
 r.jobs.push({id:crypto.randomUUID(),actor:p.nation,target:-1,action:'policy',choice:c.choice!,start:now,end:now+POLICY_SECONDS*1000,text:''});
 log(r,`${short(p.nation)}이 ${choice.label} 정책을 채택했습니다. 시행 준비가 시작됩니다.`,p.nation,'choice');policyReaction(r,p.nation,c.choice!);}
 }
 else if(c.type==='action'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(p.choice!==null,'이번 턴의 정책을 먼저 선택해 주세요.');const a=ACTIONS.find(a=>a.id===c.action);assert(a,'알 수 없는 행동입니다.');const other=r.players.find(x=>x.nation===c.target&&x.id!==id);assert(!a.target||other,'대상 국가를 선택해 주세요.');assert(!r.jobs.some(j=>j.actor===p!.nation&&j.action===a.id),'같은 행동이 아직 진행 중입니다. 완료 후 다시 선택할 수 있습니다.');assert(r.jobs.filter(j=>j.actor===p!.nation&&j.action!=='policy').length<4,'동시에 진행할 수 있는 행동은 4개입니다.');assert(now+a.seconds*1000<=r.deadline+(10-r.round)*r.duration*1000,'게임 종료 전에 완료할 시간이 부족합니다.');assert(p.money>=price(r,a),'국고가 부족합니다.');const text=typeof c.text==='string'?c.text.trim():'';assert(a.id!=='message'||(text.length>0&&text.length<=240),'비밀 전문은 1~240자로 작성해 주세요.');if(['treaty','backchannel'].includes(a.id))assert(COOPERATION.some(x=>x.id===c.topic),'협력 분야를 선택해 주세요.');if(a.id==='war')assert(p.stats.military>=20,'전쟁을 시작하려면 군사력 20 이상이 필요합니다.');p.money-=price(r,a);p.used[a.id]=(p.used[a.id]||0)+1;const j={id:crypto.randomUUID(),actor:p.nation,target:c.target??-1,action:a.id,start:now,end:now+a.seconds*1000,text,topic:c.topic};if(a.seconds===0)resolveJob(r,j);else r.jobs.push(j);if(a.id!=='message')voice(r,p.nation,actionReaction(a.id,c.topic),false,a.category==='secret'?[p.nation,other!.nation]:undefined);}
 else if(c.type==='respond'){assert(r.status==='playing','진행 중인 게임이 아닙니다.');assert(typeof c.accept==='boolean','응답을 선택해 주세요.');const o=r.offers.find(o=>o.id===c.offerId);assert(o&&o.to===p.nation&&o.status==='pending','응답 가능한 제안이 없습니다.');resolveOffer(r,o,c.accept);}
 else if(c.type!=='heartbeat')throw new GameError('알 수 없는 요청입니다.');
 if(c.requestId){r.processed.push(`${id}:${c.requestId}`);r.processed=r.processed.slice(-180);}
}
export function cleanName(name:unknown){assert(typeof name==='string'&&name.trim().length>0&&name.trim().length<=16,'이름은 1~16자로 입력해 주세요.');return name.trim();}
export function score(p:Player){const s=p.stats;const prosperity=Math.round((s.economy+s.infrastructure)/2),stability=Math.round(s.support),security=Math.round(s.military),diplomacy=Math.round(s.relations),goal=Math.round(s[NATIONS[p.nation].goal]);return {prosperity,stability,security,diplomacy,goal,total:Math.round((prosperity+stability+security+diplomacy)*.2+goal*.2),style:(p.history.war||0)+(p.history.mobilize||0)>(p.history.treatyAccepted||0)+(p.history.statement||0)?'힘과 안보를 우선한 운영':'협력과 내정을 중시한 운영'};}
export function view(r:Room,id:string,now:number){ensureNarrative(r);const me=r.players.find(p=>p.id===id);assert(me,'방 참가자만 확인할 수 있습니다.');return {code:r.code,status:r.status,round:r.round,duration:r.duration,deadline:r.deadline,serverNow:now,event:r.event,tension:r.tension,isHost:r.host===id,players:r.players.map(p=>({...p,id:undefined,prepared:p.id===id?p.prepared:undefined,isMe:p.id===id,isHost:p.id===r.host,online:now-p.lastSeen<20000,money:Math.floor(p.money),income:income(p,r),used:p.id===id?p.used:{},history:p.id===id||r.status==='finished'?p.history:{}})),jobs:r.jobs.filter(j=>j.actor===me.nation),offers:r.offers.filter(o=>o.kind!=='backchannel'||o.from===me.nation||o.to===me.nation),logs:r.logs.filter(l=>!l.privateTo||l.privateTo.includes(me.nation)).slice(-160).map(l=>l.kind==='message'?l:{...l,text:qualitativeText(l.text)}),news:r.news,bulletins:r.bulletins||[],relations:r.relations||[],reactions:(r.reactions||[]).filter(x=>!x.privateTo||x.privateTo.includes(me.nation)),pandemicAt:r.pandemicAt,boycotts:r.boycotts||[],scores:r.status==='finished'?r.players.map(p=>({nation:p.nation,name:p.name,...score(p)})).sort((a,b)=>b.total-a.total):[]};}
export type RoomView=ReturnType<typeof view>;

// Narrative state is stored in the room JSON; old rooms receive safe defaults.
function ensureNarrative(r:Room){
 r.relations??=[];r.reactions??=[];r.bulletins??=[];r.pressCooldown??={};r.boycotts??=[];
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
function eventArticle(index:number):Article{return {...(EVENT_COPY[index]||{tag:'위기 속보',headline:EVENTS[index].title,body:EVENTS[index].description,image:index===7?3:index===10?2:1})};}
function forecastArticle(r:Room):Article{
 if(r.round>=10)return {tag:'마지막 국면',headline:'마지막 선택, 기록으로 남는다',body:'지도자들의 선택이 거리의 기억으로 남는다. 번영과 평화, 무엇을 지켜냈는가?',image:4};
 const hints=['해협에 군함이 모인다. 평온한 바다를 믿어도 될까?','항구에 주문이 몰린다. 다시 교역의 바람이 불 조짐이다.','낯선 감염 소식이 국경을 넘는다. 보건 당국은 긴장을 늦추지 말라!','거리마다 대화의 깃발이 오른다. 평화를 향한 큰 물결이 다가온다.','기상 관측소의 경고가 심상치 않다. 도시를 지킬 준비는 됐는가?','구인 공고가 늘어도 지원자는 뜸하다. 돌봄과 일터가 함께 흔들릴 조짐이다.','연구소와 공장에 새 바람이 분다. 거대한 산업 변화가 문을 두드린다.'];
 const i=r.nextEvent??r.event;return {tag:'다음 국면 예고',headline:'심상치 않은 전조',body:hints[i]||`${EVENTS[i].title}의 조짐이 짙어진다. 시민의 일상이 무너지기 전에 대응해야 한다!`,image:eventArticle(i).image};
}
function editions(r:Room,stories:Article[]):Edition[]{
 const frames=[['안보가 먼저다','경계 없는 낙관은 금물.'],['시장은 기다리지 않는다','새 판을 읽는 자가 기회를 잡는다.'],['우리 삶은 우리가 지킨다','바깥의 약속보다 우리 터전부터!'],['신뢰를 잃으면 모두가 진다','지금 필요한 건 서로의 목소리다.']];
 return r.players.map(p=>({nation:p.nation,figures:damageFigures(r,p),articles:stories.map((s,i)=>({...s,headline:i===0?`${frames[p.nation][0]} — ${s.headline}`:s.headline,body:s.body}))}));
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
 r.reactions!.push({id:crypto.randomUUID(),nation:p.nation,at:r.clock,urgent,speaker:CITIZENS[(p.nation+Math.abs(largest.delta))%CITIZENS.length],text:`${cause}! ${VOICES[largest.stat][largest.delta>0?0:1]}`,...(privateTo?{privateTo}:{})});
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

export const POLICY_SECONDS=24;
export function changeDegree(n:number){const x=Math.abs(n);return `${x>=15?'크게':x>=8?'상당히':'소폭'} ${n>=0?'상승':'하락'}`;}
export function budgetDegree(n:number){return n===0?'예산 소모 없음':n<=15?'적은 예산':n<=30?'중간 규모 예산':'많은 예산';}
export function describeEffect(e:Effect){return Object.entries(e).filter(([,v])=>v).map(([k,v])=>`${k==='money'?'예산':STAT_NAMES[k as Stat]} ${changeDegree(v!)}`).join(' · ');}
export function qualitativeText(text:string){return text.replace(/([+＋−-])\s*(\d+(?:\.\d+)?)/g,(_,sign,num)=>changeDegree(Number(num)*(sign==='+'||sign==='＋'?1:-1))).replace(/(\d+(?:\.\d+)?)\s*(%?)\s*(증가|상승|오릅니다|감소|하락|내려갑니다)/g,(_,num,_unit,verb)=>changeDegree(Number(num)*(/감소|하락|내려/.test(verb)?-1:1)));}
export function eventDescription(e:WorldEvent){const categories:Record<string,string>={domestic:'국내',public:'공개 외교',military:'군사',secret:'비밀 외교'};return `${eventArticle(EVENTS.indexOf(e)).body} ${describeEffect(e.effect)}. ${categories[e.category]} 행동 예산 부담 ${e.multiplier>1?'증가':'완화'}. ${NATIONS[e.nation].short} 추가 효과: ${describeEffect(e.local)}.`;}

export const COOPERATION=[
 {id:'trade',name:'무역·공급망 협력',contribution:12,effect:{economy:8,relations:6},protection:'finance',description:'양국 경제와 신뢰를 개선하고 금융 충격에 대비합니다.',news:'막혔던 거래의 길을 함께 연다. 상인들은 오래갈 약속이기를 바란다.',image:4},
 {id:'health',name:'보건·방역 협력',contribution:16,effect:{infrastructure:6,support:5,relations:5},protection:'health',description:'의료 기반을 보강하고 이후 팬데믹 인명 피해를 줄입니다.',news:'국경을 넘은 의료 협력! 병상을 기다리는 시민들에게 작은 희망이 생겼다.',image:0},
 {id:'research',name:'기술·디지털 공동 연구',contribution:18,effect:{infrastructure:10,economy:4,relations:4},protection:'cyber',description:'기술 기반과 경제를 개선하고 사이버 피해에 대비합니다.',news:'연구실의 벽을 허문 두 나라. 기술이 시민의 삶까지 바꿀 수 있을까?',image:2},
 {id:'disaster',name:'기후·재난 공동 대응',contribution:16,effect:{infrastructure:8,relations:6},protection:'disaster',description:'기반 시설을 보강하고 이후 자연재해 피해를 줄입니다.',news:'무너진 도로를 함께 세운다. 재난 앞에 국경은 잠시 낮아졌다.',image:1},
 {id:'education',name:'교육·일자리 교류',contribution:12,effect:{support:8,economy:3,relations:5},protection:'food',description:'재취업을 지원하고 민생과 경제를 개선합니다.',news:'다시 일할 기회를 나누다. 교실과 일터를 잇는 약속에 청년들이 주목한다.',image:3}
];
export const CITIZENS=['73세 김○수 · 은퇴 노동자','29세 박○진 · 취업 준비생','46세 이○호 · 소상공인','34세 정○은 · 간호사','61세 최○숙 · 시장 상인','22세 한○민 · 대학생'];
export const POLICY_OPINIONS:[string,string,string][][]=[
 [
  ['국경부터 든든해야 잠이라도 편히 자지!','그 예산으로 일자리부터 만들면 안 됩니까?','일자리도 나라가 안전해야 지키는 거요. 그래도 생활비는 챙겨 줘야지!'],
  ['맨날 으르렁대지 말고 이제 말로 좀 풉시다.','상대가 약속을 안 지키면 어쩌려고요?','의심만 하다간 평생 대화 한 번 못 해요!'],
  ['수출해서 나라 살림 좀 나아지면 좋겠네.','그 무기가 누군가의 집을 무너뜨릴 수도 있잖아요.','먹고사는 일도 중요하지만, 돈 되는 일이라고 다 해도 되는 건 아니지.']
 ],
 [
  ['시장 문이 열리면 우리 물건도 멀리 팔겠네요!','큰 회사만 웃고 작은 가게는 밀려나는 거 아녜요?','기회는 열되, 동네 가게 대책도 같이 내놔야지.'],
  ['우리 가게부터 살려야지, 관세가 필요해요!','수입품 비싸지면 장바구니는 누가 책임져요?','싼 물건만 찾다 우리 일터가 사라지는 것도 곤란하죠.'],
  ['아플 때 병원 갈 걱정부터 줄여 주는 게 정치죠.','좋은 건 알겠는데 나중에 예산은 감당돼요?','지금 무너지는 사람부터 살리고 방법을 찾읍시다!']
 ],
 [
  ['우리 땅 자원인데 왜 남 좋은 일만 합니까!','투자자 다 떠나면 일자리도 줄지 않나요?','주인 노릇을 하되 운영할 준비부터 제대로 해야지.'],
  ['남한테만 기대지 말고 우리 기술을 키워야지!','공장 완성될 때까지 당장 생활비는요?','멀리 보는 것도 좋지만 오늘의 살림도 놓치지 맙시다.'],
  ['밖에서 투자해 준다니 일자리가 생기겠죠?','결국 결정권까지 넘기는 건 아닌지 걱정돼요.','돈만 받지 말고 우리 노동자 조건도 걸어야죠!']
 ],
 [
  ['싸움 말리는 나라가 있어야 세계가 굴러가지.','남의 갈등에 끼었다 우리만 손해 보는 거 아니에요?','모른 척한다고 불똥이 안 튀는 건 아니잖아요.'],
  ['서로 다른 사람도 한 동네라는 마음은 필요해요.','구호만 외치면 먹고사는 게 해결됩니까?','행사로 끝내지 말고 실제로 서로 챙기자는 거죠.'],
  ['평화도 지킬 힘이 있어야 가능한 거요!','갑자기 군비를 늘리면 이웃은 배신으로 보겠죠.','안전과 신뢰, 둘 다 놓치지 않는 설명이 필요해요.']
 ]
];
function voice(r:Room,nation:number,text:string,urgent=false,privateTo?:number[],speaker?:string,batch?:string){r.reactions??=[];r.reactions.push({id:crypto.randomUUID(),nation,text,at:r.clock,urgent,speaker:speaker||CITIZENS[(r.reactions.length+nation)%CITIZENS.length],batch,...(privateTo?{privateTo}:{})});r.reactions=r.reactions.slice(-100);}
function policyReaction(r:Room,nation:number,choice:number){const batch=crypto.randomUUID();POLICY_OPINIONS[nation][choice].slice(0,2).forEach((text,i)=>voice(r,nation,text,false,undefined,CITIZENS[i],batch));}
function actionReaction(action:string,topic?:string){const lines:Record<string,string>={statement:'말만 평화 말고 이번에는 정말 약속을 지켜 주세요.',treaty:`${COOPERATION.find(x=>x.id===topic)?.name||'협력'}이라니, 서로 무엇을 해 줄지 끝까지 지켜봅시다.`,aid:'이웃을 돕는 건 좋지요. 우리 살림도 같이 챙겨 주세요.',sanction:'제재하면 상대만 아픈가요? 우리 가게도 걱정됩니다.',backchannel:'물밑 대화가 시작됐군요. 약속이 실제 생활을 바꾸면 좋겠어요.',mobilize:'병력이 움직이니 든든하면서도 마음이 불안하네요.',ultimatum:'저렇게 몰아붙이면 상대 국민도 가만있지 않을 텐데요.',war:'전쟁 결정이라니! 돌아오지 못할 사람들은 누가 책임집니까?',economy:'투자가 일자리로 이어져야 합니다. 발표만으로 끝내지 마세요!',support:'지원 소식에 숨통은 트이네요. 필요한 사람에게 먼저 닿기를.',infrastructure:'공사 끝나면 생활이 나아지겠죠? 그동안 불편은 감수해야겠네요.'};return lines[action]||'이번 선택이 우리 생활을 어떻게 바꿀지 지켜볼게요.';}
function addLosses(p:Player,title:string,deaths:number,unemployed:number){p.deaths=(p.deaths||0)+deaths;p.unemployed=(p.unemployed||0)+unemployed;p.eventLosses??={};const prev=p.eventLosses[title]||{deaths:0,unemployed:0};p.eventLosses[title]={deaths:prev.deaths+deaths,unemployed:prev.unemployed+unemployed};}
function applyDisaster(r:Room,e:WorldEvent){
 const batch=crypto.randomUUID();
 for(const p of r.players){const readiness=p.prepared?.[e.crisis||'']||0;const resilience=Math.max(.25,1-p.stats.infrastructure/180-readiness/100);
 const deaths=Math.round((e.deaths||0)*resilience),unemployed=Math.round((e.unemployed||0)*Math.max(.3,1-p.stats.economy/200-readiness/120));addLosses(p,e.title,deaths,unemployed);
 if(deaths||unemployed){voice(r,p.nation,`${e.title} 이후 우리나라 누적 사망 ${p.deaths}명, 현재 실업 ${p.unemployed}명이라니요. 숫자 하나하나가 사람의 삶입니다.`,true,undefined,'34세 정○은 · 간호사',batch);voice(r,p.nation,e.crisis==='health'?'팬데믹 때문에 먹고살기가 너무 힘듭니다. 가게 문을 열어도 손님이 없어요.':'일터가 멈추니 다음 달 생활비가 막막합니다. 대책이 현장까지 와야죠.',true,undefined,'46세 이○호 · 소상공인',batch);}
 }
 if(e.deaths){const safest=[...r.players].sort((a,b)=>(a.eventLosses?.[e.title]?.deaths||0)-(b.eventLosses?.[e.title]?.deaths||0))[0];for(const p of r.players)if((p.eventLosses?.[e.title]?.deaths||0)>(safest.eventLosses?.[e.title]?.deaths||0)+10)voice(r,p.nation,`${short(safest.nation)}는 피해를 더 줄였다는데, 우리도 의료와 기반 시설에 신경 써야 하는 것 아닌가요?`,true,undefined,'61세 최○숙 · 시장 상인',batch);}
}
function damageFigures(r:Room,p:Player){return {deaths:p.deaths||0,unemployed:p.unemployed||0,worldDeaths:r.players.reduce((n,x)=>n+(x.deaths||0),0),worldUnemployed:r.players.reduce((n,x)=>n+(x.unemployed||0),0),eventTitle:EVENTS[r.event].title,eventDeaths:p.eventLosses?.[EVENTS[r.event].title]?.deaths||0,worldEventDeaths:r.players.reduce((n,x)=>n+(x.eventLosses?.[EVENTS[r.event].title]?.deaths||0),0)};}
function publicBacklash(r:Room,actor:number,target:number,action:string){
 const pair=r.relations?.find(x=>x.a===Math.min(actor,target)&&x.b===Math.max(actor,target));const friendly=(pair?.value||0)>=15;
 if(!friendly&&!['war','ultimatum'].includes(action))return;
 const groups=r.players.filter(p=>p.nation===target||p.nation!==actor&&(r.relations||[]).some(x=>(x.a===p.nation&&x.b===target||x.b===p.nation&&x.a===target)&&x.value>=15));
 for(const citizenNation of groups){if(r.boycotts!.some(b=>b.from===citizenNation.nation&&b.target===actor&&b.until>r.clock))continue;
 r.boycotts!.push({from:citizenNation.nation,target:actor,until:r.clock+r.duration*2000});const aggressor=byNation(r,actor);effect(aggressor,{economy:-6,support:-3});effect(citizenNation,{support:3,economy:-2});
 voice(r,citizenNation.nation,`${short(actor)} 물건은 당분간 안 사겠습니다. ${friendly?'친하다더니 갑자기 이러는 게 말이 됩니까!':'우리 이웃을 몰아붙이는 걸 보고만 있을 순 없죠!'}`,true);
 voice(r,actor,`${short(citizenNation.nation)}에서 불매한다네요. 외교 갈등에 우리 수출 주문까지 끊겼습니다!`,true);
 publishExtra(r,'국경을 넘은 불매 운동',[{tag:'시민 행동',headline:`${short(citizenNation.nation)} 시민 “${short(actor)} 제품 안 산다”`,body:friendly?'믿었던 이웃의 강압에 배신감이 터졌다. 불매가 수출과 상점으로 번진다.':'강압 외교에 소비자들이 맞섰다. 국경 너머 갈등이 장바구니를 바꾸고 있다.',image:3}]);
 log(r,`${short(citizenNation.nation)} 시민의 ${short(actor)} 제품 불매 운동. 수출 수입이 한동안 크게 줄어듭니다.`,citizenNation.nation,'boycott');}
}
function solidarity(r:Room,actor:number,target:number){const pair=r.relations?.find(x=>x.a===Math.min(actor,target)&&x.b===Math.max(actor,target));if((pair?.value||0)<15)return;const key=`solidarity:${actor}:${target}`;if(r.pressCooldown![key]&&r.clock-r.pressCooldown![key]<r.duration*1000)return;r.pressCooldown![key]=r.clock;effect(byNation(r,target),{money:6,support:3});voice(r,target,`${short(actor)}의 원조에 시민들까지 모금에 나섰대요. 이런 이웃이라면 믿고 함께해야죠!`,true);publishExtra(r,'이웃을 위한 시민 모금',[{tag:'시민 연대',headline:`${short(actor)}·${short(target)}, 시민이 잇는 우정`,body:'정부의 원조가 자발적인 모금으로 이어졌다. 위기 속에서 오래갈 신뢰가 자란다.',image:4}]);}
export function jobName(j:Job){return j.action==='policy'?`${CHOICES[j.actor][j.choice!]?.label||'정책'} 시행`:ACTIONS.find(x=>x.id===j.action)?.name||'행동';}
export function actionDescription(id:string){const lines:Record<string,string>={statement:'국제 관계 개선 · 국민 신뢰 소폭 상승 · 세계 긴장 완화',treaty:'선택한 분야에서 공동 사업을 추진합니다. 상대의 동의와 예산 분담이 필요합니다.',aid:'상대 경제·예산 지원 · 자국 신뢰 개선 · 국내 지지 소폭 하락',sanction:'상대 경제에 큰 압박 · 자국 경제와 신뢰도 손상 · 시민 불매 위험',message:'두 국가에만 전달 · 전송 대기 후 재사용 가능 · 240자 이내',backchannel:'선택한 분야를 비공개로 협력합니다. 제안과 결과는 당사자만 열람합니다.',mobilize:'군사력 상당히 상승 · 지지 소폭 상승 · 국제 신뢰 하락',ultimatum:'양보 시 상대 예산 일부 이전 · 거부 시 긴장 고조 · 불매 운동 위험',war:'양국에 큰 군사·경제·인프라 피해와 인명 피해 · 외교 신뢰 급락',economy:'경제 상당히 상승 · 인프라 소폭 개선 · 실업 완화',support:'국민 지지 크게 상승 · 실업 소폭 완화',infrastructure:'인프라 크게 개선 · 경제 소폭 상승'};return lines[id]||'';}
