'use client';
import {useEffect,useRef,useState} from 'react';
import {AlertTriangle,Sparkles} from 'lucide-react';
import {RoomView,Stat,STAT_NAMES,changeDegree,Reaction,NATIONS} from '@/lib/game';
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
 const [active,setActive]=useState(false);
 useEffect(()=>{if(!room?.pandemicAt)return;const key=`pandemic-seen:${room.code}:${room.pandemicAt}`;let seen=false;try{seen=!!sessionStorage.getItem(key);}catch{}
  if(seen||room.serverNow-room.pandemicAt>16000)return;
  try{sessionStorage.setItem(key,'1');}catch{}setActive(true);const timer=setTimeout(()=>setActive(false),7200);return()=>{clearTimeout(timer);setActive(false);};
 },[room?.code,room?.pandemicAt]);
 return active?<div className="pandemic-warning" role="alert"><div><AlertTriangle/><strong>국제 보건 경보</strong><span>팬데믹 발생 · 각국의 대응이 필요합니다</span></div></div>:null;
}

export function EdgeVoices({room}:{room:RoomView|null}){
 const seen=useRef(new Set<string>()),code=useRef(''),timer=useRef<ReturnType<typeof setTimeout>|null>(null),[visible,setVisible]=useState<Reaction[]>([]);
 useEffect(()=>{if(!room)return;if(code.current!==room.code){code.current=room.code;seen.current.clear();setVisible([]);}
  const fresh=room.reactions.filter(x=>!seen.current.has(x.id)&&room.serverNow-x.at<12000);for(const x of room.reactions)seen.current.add(x.id);
  if(room.status!=='playing'||!fresh.length)return;
  const me=room.players.find(x=>x.isMe)?.nation;
  const relevant=[...fresh.filter(x=>x.nation===me),...fresh.filter(x=>x.nation!==me)];const urgent=fresh.some(x=>x.urgent);setVisible(relevant.slice(0,urgent?5:3));
  if(timer.current)clearTimeout(timer.current);timer.current=setTimeout(()=>setVisible([]),10000);
 },[room]);
 useEffect(()=>()=>{if(timer.current)clearTimeout(timer.current);},[]);
 return <div className="edge-voices" aria-live="polite">{visible.map((v,i)=><aside key={v.id} className={`edge-bubble edge-${i} ${v.urgent?'urgent':''}`}><button onClick={()=>setVisible(x=>x.filter(y=>y.id!==v.id))} aria-label="국민 반응 닫기">×</button><small>{NATIONS[v.nation].short} · 가상 시민</small><b>{v.speaker||'시민의 목소리'}</b><p>{v.text}</p></aside>)}</div>;
}
