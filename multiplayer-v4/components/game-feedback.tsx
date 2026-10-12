'use client';
import {useEffect,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {AlertTriangle,Sparkles} from 'lucide-react';
import {RoomView,Stat,STAT_NAMES,changeDegree,Reaction,NATIONS,crisisMarkers} from '@/lib/game';
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
export function PandemicWarning({room}:{room:RoomView|null}){
 const me=room?.players.find(p=>p.isMe);
 const marker=room&&crisisMarkers(room).find(x=>x.nation===me?.nation);
 const [active,setActive]=useState<NonNullable<typeof marker>|null>(null);
 const key=marker?`${room?.code}:${marker.id}`:'';
 useEffect(()=>{
  if(!marker||!room){setActive(null);return;}
  const remaining=9000-(room.serverNow-marker.at);
  if(remaining<=0){setActive(null);return;}
  setActive(marker);const timer=setTimeout(()=>setActive(null),remaining);
  return()=>clearTimeout(timer);
 },[key]);
 return active?createPortal(<div className="crisis-warning" role="alert"><div className="crisis-warning-label"><AlertTriangle/><strong>{active.kind==='health'?'국제 팬데믹 경보':'자국 기후 재난 경보'}</strong><span>{active.label} · 국민과 기반 시설을 보호하세요</span></div></div>,document.body):null;
}

export function EdgeVoices({room}:{room:RoomView|null}){
 const seen=useRef(new Set<string>()),code=useRef(''),timer=useRef<ReturnType<typeof setTimeout>|null>(null),[visible,setVisible]=useState<Reaction[]>([]);
 useEffect(()=>{if(!room)return;if(code.current!==room.code){code.current=room.code;seen.current.clear();setVisible([]);}
  const fresh=room.reactions.filter(x=>!seen.current.has(x.id)&&room.serverNow-x.at<12000);for(const x of room.reactions)seen.current.add(x.id);
  if(room.status!=='playing'||!fresh.length)return;
  const me=room.players.find(x=>x.isMe)?.nation;
  const relevant=[...fresh.filter(x=>x.nation===me),...fresh.filter(x=>x.nation!==me)];const urgent=fresh.some(x=>x.urgent);setVisible(relevant.slice(0,urgent?5:3));
  if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setVisible([]),14000);
 },[room]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 return <div className="edge-voices" aria-live="polite">{visible.map((v,i)=><aside key={v.id} className={`edge-bubble edge-${i} ${v.urgent?'urgent':''}`}><button onClick={()=>setVisible(x=>x.filter(y=>y.id!==v.id))} aria-label="국민 반응 닫기">×</button><small>{NATIONS[v.nation].short} · 가상 시민</small><b>{v.speaker||'시민의 목소리'}</b><p>{v.text}</p></aside>)}</div>;
}
