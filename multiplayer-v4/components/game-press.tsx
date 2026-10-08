'use client';
import {useEffect,useState} from 'react';
import {Newspaper,Radio} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription,DialogClose} from '@/components/ui/dialog';
import {NATIONS,News,RoomView,Article} from '@/lib/game';
export const PRESS=[{name:'아우로리아 국민일보',strap:'질서 · 안보 · 조국',theme:'mono'},{name:'BELVAR NOW',strap:'시장의 내일을 먼저 읽다',theme:'digital'},{name:'키레네 민중신문',strap:'우리 땅, 우리 목소리',theme:'paper'},{name:'도란 평화저널',strap:'서로의 목소리가 세계를 바꾼다',theme:'journal'}];
const artLabels=['팬데믹 속 의료진','홍수와 폭풍 피해','자동화와 디지털 산업','세대와 인구 변화','국가 간 외교 협력','국경의 군사적 긴장'];
function Illustration({index}:{index:number}){return <div role="img" aria-label={artLabels[index]||'국제 정세 삽화'} className="press-art" style={{backgroundImage:`url(/press-${index}.webp)`}}/>;}
const identity=(n:News)=>n.id||`regular-${n.round}`;
export function PressDesk({room,nation}:{room:RoomView;nation:number}){
 const issues=[...room.news,...room.bulletins].sort((a,b)=>(b.at??b.round*room.duration*1000)-(a.at??a.round*room.duration*1000));
 const [selected,setSelected]=useState<News|null>(null),[read,setRead]=useState<string[]>([]);
 useEffect(()=>{setSelected(null);setRead([]);},[room.code]);
 useEffect(()=>{if(room.players.find(p=>p.isMe)?.choice===null)setSelected(null);},[room.round]);
 const paper=PRESS[nation],unread=issues.filter(n=>!read.includes(identity(n))).length;
 const figures=selected?.editions?.find(e=>e.nation===nation)?.figures;
 const articles:Article[]=selected?.editions?.find(e=>e.nation===nation)?.articles||[{tag:'지난 기록',headline:'선택의 흔적이 세계에 남았다',body:'이전 판의 기사는 외교·행동 기록에서 확인할 수 있습니다.',image:4}];
 function open(n:News){setSelected(n);setRead(x=>[...x,identity(n)]);}
 return <><section className={`panel press-desk press-${paper.theme}`}><div className="section-heading"><h2><Newspaper size={20}/> 국가 신문</h2><span>{unread?`새 소식 ${unread}건`:'모두 읽음'}</span></div><div className="press-masthead">{paper.name}<small>{paper.strap}</small></div>
 {issues.length?<><button className={`newspaper-button ${unread?'unread':''}`} onClick={()=>open(issues[0])}><span className="newspaper-cover"><span className="cover-top">국제 신문 · {issues[0].breaking?'호외':'정기판'}</span><span className="cover-name">{paper.name}</span><span className="cover-lead"><Illustration index={issues[0].editions?.find(e=>e.nation===nation)?.articles[0]?.image||0}/><strong>{issues[0].editions?.find(e=>e.nation===nation)?.articles[0]?.headline||issues[0].title}</strong></span><span className="cover-bottom"><Newspaper size={22}/> 눌러서 신문 펼치기</span></span></button><div className="press-archive">{issues.slice(1).map(n=><button key={identity(n)} onClick={()=>open(n)}><span>{n.round}턴 · {n.breaking?'호외':'정기판'}</span><b>{n.title}</b>{!read.includes(identity(n))&&<small>NEW</small>}</button>)}</div></>:<div className="newspaper-empty"><Radio/><p>정세가 움직이면 신문이 도착합니다.</p></div>}
 <p className="press-note">국가마다 다른 시선으로 전하는 사설과 현장 소식</p></section>
 {issues.length>0&&room.status==='playing'&&<button className="floating-press" onClick={()=>open(issues[0])} aria-label="최신 국제 신문 펼치기"><Newspaper size={27}/><span><b>국제 신문</b><small>{unread?'새 신문 도착':'신문 펼치기'}</small></span></button>}
 <Dialog open={!!selected} onOpenChange={open=>{if(!open)setSelected(null);}}><DialogContent className={`press-sheet press-${paper.theme}`} showCloseButton={false}><header className="sheet-header"><span>{selected?.breaking?'긴급 호외':'국제 정세 정기판'}</span><DialogClose className="paper-close">접기 ×</DialogClose></header><DialogTitle className="sheet-title">{paper.name}</DialogTitle><DialogDescription className="sheet-subtitle">{paper.strap} · {selected?.round}턴 발행</DialogDescription>{figures&&<section className="crisis-ledger"><h3>피해 현황 <small>이 게임의 가상 집계 · 발행 시점</small></h3><div><p><b>{NATIONS[nation].short}</b><span>누적 사망 <strong>{figures.deaths}명</strong></span><span>현재 실업 <strong>{figures.unemployed}명</strong></span></p><p><b>국제 · 참가국 합계</b><span>누적 사망 <strong>{figures.worldDeaths}명</strong></span><span>현재 실업 <strong>{figures.worldUnemployed}명</strong></span></p></div>{figures.worldEventDeaths>0&&<p className="event-losses">{figures.eventTitle} 누적 사망: 국내 {figures.eventDeaths}명 · 국제 {figures.worldEventDeaths}명</p>}</section>}<div className="sheet-stories">{articles.map((a,i)=><article key={i} className={i===0?'lead-story':''}><Illustration index={a.image}/><div className="story-copy"><span>{a.tag}</span><h3>{a.headline}</h3><p>{a.body}</p></div></article>)}</div><footer className="sheet-footer">이 신문은 우리 국가의 시각을 담은 논평입니다.</footer></DialogContent></Dialog>
 </>;
}
