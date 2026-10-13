'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {AlertTriangle,Sparkles,Mail,Shield,Trophy} from 'lucide-react';
import {RoomView,Stat,STAT_NAMES,changeDegree,Reaction,NATIONS,Incident,Dispatch,formatPeople,prioritizeVoices} from '@/lib/game';
export type ChangeFlash={id:string;changes:{stat:Stat;delta:number}[];label:string};
export function useChangeFlash(room:RoomView|null){
 const previous=useRef<RoomView|null>(null),[flash,setFlash]=useState<ChangeFlash|null>(null),timer=useRef<ReturnType<typeof setTimeout>|null>(null);
 useEffect(()=>{const old=previous.current;previous.current=room;
  if(!room||room.status==='lobby'||old?.code!==room.code||old.status==='lobby')return;
  const me=room.players.find(p=>p.isMe),prev=old.players.find(p=>p.isMe);if(!me||!prev)return;
  const changes=(Object.keys(STAT_NAMES) as Stat[]).map(stat=>({stat,delta:me.stats[stat]-prev.stats[stat]})).filter(x=>x.delta!==0);
  if(!changes.length)return;
  const logs=room.logs.filter(l=>!old.logs.some(x=>x.id===l.id));const mine=[...logs].reverse().find(l=>l.actor===me.nation);
  const label=room.round!==old.round?'새 턴 · 세계 정세 반영':mine?.kind==='choice'?'정책 효과 적용':logs.some(l=>l.kind==='war')?'무력 충돌 결과':'국가 상황 변화';
  setFlash({id:crypto.randomUUID(),changes,label});if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setFlash(null),6000);
 },[room]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 return flash;
}
export function ChangeNotice({flash}:{flash:ChangeFlash|null}){return flash&&<div key={flash.id} className="change-notice" role="status"><strong><Sparkles size={18}/>{flash.label}</strong><div>{flash.changes.map(x=><span className={x.delta>0?'positive':'negative'} key={x.stat}>{STAT_NAMES[x.stat]} <b>{changeDegree(x.delta)}</b></span>)}</div></div>;}
export function IncidentCard({incident,compact=false}:{incident:Incident;compact?:boolean}){return <article className={`incident-card ${incident.kind==='battle'?'battle-card':''} ${compact?'compact':''}`}><header><AlertTriangle size={18}/><b>{incident.round}턴 · {incident.title}</b></header>{incident.winner!==undefined&&incident.loser!==undefined&&<div className="battle-verdict"><div className="victor" style={{borderColor:NATIONS[incident.winner].color}}><Trophy/><small>승리국</small><strong>{NATIONS[incident.winner].name}</strong></div><div className="defeated" style={{borderColor:NATIONS[incident.loser].color}}><Shield/><small>패배국</small><strong>{NATIONS[incident.loser].name}</strong></div></div>}<div className="incident-impacts">{incident.impacts.map(p=><section key={p.nation}><b style={{color:NATIONS[p.nation].color}}>{NATIONS[p.nation].short}</b><p>{p.changes.map(c=><span key={c.stat} className={c.delta<0?'negative':'positive'}>{STAT_NAMES[c.stat]} {changeDegree(c.delta)}</span>)}{Math.abs(p.money)>=1&&<span>국고 {changeDegree(p.money)}</span>}</p>{(p.deaths>0||p.unemployed>0)&&<strong className="harm-total">사망 {formatPeople(p.deaths)}명 · 신규 실업 {formatPeople(Math.max(0,p.unemployed))}명</strong>}{incident.kind==='war-declared'&&!p.changes.length&&p.deaths===0&&Math.abs(p.money)<1&&<small>전투 결과 대기 · 피해는 완료 시 집계</small>}</section>)}</div><small className="incident-note">능력치 변화는 규모로 표시 · 피해 인원은 이 사건의 가상 집계</small></article>;}
export function IncidentHistory({room}:{room:RoomView}){const incidents=[...room.incidents].reverse();const battle=incidents.find(x=>x.kind==='battle');const latest=incidents[0];const past=incidents.filter(x=>x.id!==latest?.id&&x.id!==battle?.id);return <section className="incident-history">{latest&&<IncidentCard incident={latest}/>} {battle&&battle.id!==latest?.id&&<IncidentCard incident={battle} compact/>}{past.length>0&&<details><summary>지난 위험 사건·전쟁 결과 {past.length}건</summary>{past.map(x=><IncidentCard key={x.id} incident={x} compact/>)}</details>}</section>;}
export function PandemicWarning({room}:{room:RoomView|null}){
 const incident=room?.incidents.at(-1),[active,setActive]=useState<Incident|null>(null);
 const key=incident?`${room?.code}:${incident.id}`:'';
 useEffect(()=>{if(!incident||!room){setActive(null);return;}const remaining=9000-(room.serverNow-incident.at);if(remaining<=0){setActive(null);return;}setActive(incident);const timer=setTimeout(()=>setActive(null),remaining);return()=>clearTimeout(timer);},[key]);
 return active?createPortal(<div className="crisis-warning danger-warning" role="alert"><div className="danger-summary"><button onClick={()=>setActive(null)} aria-label="경보 닫기">×</button><IncidentCard incident={active} compact/></div></div>,document.body):null;
}
export function IncomingDispatches({room}:{room:RoomView|null}){
 const seen=useRef(new Set<string>()),code=useRef(''),[queue,setQueue]=useState<Dispatch[]>([]);
 useEffect(()=>{if(!room){setQueue([]);return;}if(code.current!==room.code){code.current=room.code;seen.current.clear();setQueue([]);}const fresh=room.dispatches.filter(x=>!seen.current.has(x.id)&&room.serverNow-x.at<30000);room.dispatches.forEach(x=>seen.current.add(x.id));if(fresh.length)setQueue(q=>[...q,...fresh].slice(-12));},[room]);
 useEffect(()=>{if(!queue.length)return;const timer=setTimeout(()=>setQueue(q=>q.slice(1)),12000);return()=>clearTimeout(timer);},[queue[0]?.id]);
 return queue.length?createPortal(<aside className="incoming-dispatches" aria-live="polite">{queue.slice(0,3).map(d=><article key={d.id} style={{'--sender':NATIONS[d.from].color} as React.CSSProperties}><Mail/><div><small>{NATIONS[d.from].name} → 우리나라</small><b>{d.title}</b><details><summary>{d.kind==='message'?'비밀 전문 펼치기':'내용 보기'}</summary><p>{d.text}</p></details></div><button onClick={()=>setQueue(q=>q.filter(x=>x.id!==d.id))} aria-label="수신 알림 닫기">×</button></article>)}{queue.length>3&&<p>뒤이어 표시할 알림 {queue.length-3}건 · 외교 기록에도 보관됩니다</p>}</aside>,document.body):null;
}

export function EdgeVoices({room}:{room:RoomView|null}){
 const seen=useRef(new Set<string>()),code=useRef(''),timer=useRef<ReturnType<typeof setTimeout>|null>(null),[visible,setVisible]=useState<Reaction[]>([]);
 useEffect(()=>{if(!room)return;if(code.current!==room.code){code.current=room.code;seen.current.clear();setVisible([]);}
  const fresh=room.reactions.filter(x=>!seen.current.has(x.id)&&room.serverNow-x.at<12000);for(const x of room.reactions)seen.current.add(x.id);
  if(room.status!=='playing'||!fresh.length)return;
  const me=room.players.find(x=>x.isMe)?.nation;
  const urgent=fresh.some(x=>x.nation===me&&x.urgent);const relevant=prioritizeVoices(fresh,me??-1,urgent?5:3);if(!relevant.length)return;setVisible(relevant);
  if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setVisible([]),14000);
 },[room]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 return <div className="edge-voices" aria-live="polite">{visible.map((v,i)=><aside key={v.id} className={`edge-bubble edge-${i} ${v.urgent?'urgent':''}`}><button onClick={()=>setVisible(x=>x.filter(y=>y.id!==v.id))} aria-label="국민 반응 닫기">×</button><small>{NATIONS[v.nation].short} · 가상 시민</small><b>{v.speaker||'시민의 목소리'}</b><p>{v.text}</p></aside>)}</div>;
}
