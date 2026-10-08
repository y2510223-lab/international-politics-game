'use client';
import {Flag,Globe2} from 'lucide-react';
import {NATIONS,RoomView} from '@/lib/game';
const positions=[[43,24],[78,48],[57,77],[19,52]];

const territories=['M285 30 358 36 390 68 438 55 464 100 439 145 367 162 322 128 274 144 243 100Z','M495 132 564 102 619 130 667 120 705 171 672 216 705 248 624 283 572 250 514 262 487 205Z','M350 246 410 214 460 235 499 282 558 300 547 359 481 388 440 367 391 389 326 350 298 308Z','M55 160 107 127 160 151 219 139 257 182 238 215 278 254 221 281 188 317 136 296 107 254 55 240 32 196Z'];
const lineStyles:Record<string,{color:string;dash?:string;double?:boolean}>={'중립':{color:'#9aaabd',dash:'2 7'},'우호':{color:'#75c6ff'},'협력':{color:'#66e5b4',double:true},'긴장':{color:'#ffbf60',dash:'10 6'},'충돌':{color:'#ff6471',dash:'3 3'}};
export function WorldMap({room,target,onTarget}:{room?:RoomView|null;target:number;onTarget:(n:number)=>void}){
 const active=room?.status!=='lobby'&&!!room;
 return <div className="world-map living-map"><div className="map-heading"><span><Globe2 size={16}/> 아르덴 세계 지도</span><span>국가를 눌러 대상 선택</span></div>
 <div className="map-canvas"><svg viewBox="0 0 740 420" preserveAspectRatio="none" role="img" aria-label="참가 국가 사이의 공개 관계와 가상 영토"><defs><pattern id="grid" width="35" height="35" patternUnits="userSpaceOnUse"><path d="M35 0H0V35" fill="none" stroke="#9baabb" strokeOpacity=".07"/></pattern></defs><rect width="740" height="420" fill="url(#grid)"/>{territories.map((d,n)=><path key={n} d={d} fill={NATIONS[n].color} fillOpacity={active&&!room?.players.some(p=>p.nation===n)?.04:target===n?.25:.12} stroke={NATIONS[n].color} strokeOpacity={target===n?1:.4} strokeWidth={target===n?2:1}/>)}
 {active&&room.relations.map(pair=>{const start=positions[pair.a],end=positions[pair.b],style=lineStyles[pair.label]||lineStyles['중립'];const x1=start[0]*7.4,y1=start[1]*4.2,x2=end[0]*7.4,y2=end[1]*4.2;const d=`M${x1},${y1} Q${(x1+x2)/2+12},${(y1+y2)/2-18} ${x2},${y2}`;return <g key={`${pair.a}-${pair.b}`} className={pair.label==='충돌'?'relation-conflict':''}><title>{NATIONS[pair.a].short} · {NATIONS[pair.b].short}: {pair.label} — {pair.reason}</title><path d={d} fill="none" stroke={style.color} strokeWidth={style.double?7:pair.label==='충돌'?4:2.5} strokeDasharray={style.dash}/>{style.double&&<path d={d} fill="none" stroke="#17212b" strokeWidth="2.5"/>}</g>})}
 </svg>
 {NATIONS.map((n,i)=>{const p=room?.players.find(p=>p.nation===i);return <button key={i} className={`map-pin ${target===i?'chosen':''}`} style={{left:`${positions[i][0]}%`,top:`${positions[i][1]}%`,'--nation':n.color} as React.CSSProperties} disabled={active&&!p} onClick={()=>onTarget(i)}><Flag size={16}/><strong>{n.short}</strong><small>{p?p.name:active?'미참가':n.theory}{p?.isMe?' · 나':''}</small></button>})}

 </div>
 <div className="relation-legend" aria-label="관계선 범례">{Object.entries(lineStyles).map(([label])=><span key={label}><i className={`legend-${label}`}/>{label}</span>)}</div>
 {active&&<div className="relation-summary">{room.relations.map(p=><span key={`${p.a}-${p.b}`}>{NATIONS[p.a].short}·{NATIONS[p.b].short} <b>{p.label}</b></span>)}</div>}
 </div>;
}
