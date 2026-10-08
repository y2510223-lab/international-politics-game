'use client';
import {useEffect,useState} from 'react';
import {Clock3,MessageCircle,Pause,Coins} from 'lucide-react';
import {Dialog,DialogContent,DialogTitle,DialogDescription} from '@/components/ui/dialog';
import {CHOICES,NATIONS,RoomView,CITIZENS,POLICY_OPINIONS,POLICY_SECONDS,describeEffect,budgetDegree} from '@/lib/game';
export function PolicyScreen({room,busy,error,onChoose}:{room:RoomView|null;busy:boolean;error:string;onChoose:(n:number)=>void}){
 const me=room?.players.find(p=>p.isMe),[preview,setPreview]=useState(0);
 useEffect(()=>setPreview(0),[room?.round,room?.code]);
 if(!room||!me||me.nation<0)return null;
 const open=room.status==='playing'&&me.choice===null,nation=NATIONS[me.nation];
 return <Dialog open={open}><DialogContent className="policy-screen" showCloseButton={false} onEscapeKeyDown={e=>e.preventDefault()} onInteractOutside={e=>e.preventDefault()} style={{'--accent':nation.color} as React.CSSProperties}><header className="policy-screen-header"><div><span className="eyebrow">{room.round}턴 · {nation.name}</span><DialogTitle>이번 국면, 어떤 길을 택하겠습니까?</DialogTitle><DialogDescription>정책 위에 마우스를 올리거나 눌러 국민의 의견을 들어보세요. 선택하거나 보류하면 운영 화면으로 돌아갑니다.</DialogDescription></div><span className="policy-budget"><Coins size={18}/>현재 예산 {me.money} G</span></header>
 <div className="policy-cinema">{CHOICES[me.nation].map((c,i)=><article key={i} className={`policy-option ${preview===i?'previewed':''}`} onMouseEnter={()=>setPreview(i)} onFocusCapture={()=>setPreview(i)}><button className="policy-preview" aria-label={`${c.label} 국민 의견 보기`} onClick={()=>setPreview(i)}><img src={`/policy-${me.nation*3+i}.webp`} alt={`${c.label} 정책 삽화`}/><span className="policy-number">선택 {i+1}</span><h2>{c.label}</h2></button><div className="policy-option-body"><p>{describeEffect(c.effect)}</p><small>세계 긴장 {c.tension>0?'고조':c.tension<0?'완화':'큰 변화 없음'} · {budgetDegree(Math.max(0,-(c.effect.money||0)))}</small><button className="primary" disabled={busy||me.money<Math.max(0,-(c.effect.money||0))} onClick={()=>onChoose(i)}>{me.money<Math.max(0,-(c.effect.money||0))?'예산 부족':'이 정책 선택'}</button></div></article>)}</div>
 <section className="policy-debate" aria-label="정책에 대한 가상 국민 토론"><h3><MessageCircle size={18}/>{CHOICES[me.nation][preview].label} · 엇갈리는 목소리 <small>가상 인물의 의견</small></h3><div className="debate-bubbles" key={preview}>{POLICY_OPINIONS[me.nation][preview].map((line,i)=><blockquote key={i} className={i===1?'opposing':''}><b>{CITIZENS[i]}</b><p>{i>0&&<span className="reply-label">↳ 반론 </span>}{line}</p></blockquote>)}</div></section>
 {error&&<p className="policy-error" role="alert">{error}</p>}
 <footer className="policy-screen-footer"><p><Clock3 size={16}/>선택한 정책은 {POLICY_SECONDS}초 뒤 시행됩니다. 턴 시간은 계속 흐릅니다.</p><button className="hold-policy" disabled={busy} onClick={()=>onChoose(-1)}><Pause size={17}/>정책 보류 · 예산 유지</button></footer></DialogContent></Dialog>;
}
