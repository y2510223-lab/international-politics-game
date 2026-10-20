import type {RoomView} from './game';
export type OutcomeCueData={id:string;kind:'policy'|'diplomacy'|'recovery'|'objective'|'build';title:string;detail:string};
// Only compare information already authorized for this player's view.
export function outcomeCue(old:RoomView|null,room:RoomView|null):OutcomeCueData|null{
 if(!old||!room||old.code!==room.code||old.status==='lobby'||room.status==='lobby')return null;
 const me=room.players.find(p=>p.isMe),prev=old.players.find(p=>p.isMe);if(!me||!prev)return null;
 const stamp=`${room.code}:${room.serverNow}`;
 if(me.objectiveDone&&!prev.objectiveDone)return {id:stamp,kind:'objective',title:'국가 목표 달성',detail:'선택들이 하나의 성과로 이어졌습니다'};
 if(room.arc?.status==='contained'&&old.arc?.status==='active')return {id:stamp,kind:'recovery',title:'공동 대응 성공',detail:'구호와 연구가 만나 위기의 악화를 막았습니다'};
 const completed=room.deals.find(d=>d.status==='completed'&&old.deals.some(x=>x.id===d.id&&['pending','active'].includes(x.status)));
 if(completed)return {id:completed.id,kind:'diplomacy',title:'협상 약속 이행',detail:'양국의 지원이 신뢰로 돌아왔습니다'};
 const agreed=room.deals.find(d=>d.status==='active'&&old.deals.some(x=>x.id===d.id&&x.status==='pending'));
 if(agreed)return {id:`${agreed.id}:agreed`,kind:'diplomacy',title:'조건부 거래 성사',detail:'선지원이 전달됐습니다 · 다음은 약속 이행'};
 const accepted=room.offers.find(o=>o.status==='accepted'&&o.kind!=='ultimatum'&&[o.from,o.to].includes(me.nation)&&old.offers.some(x=>x.id===o.id&&x.status==='pending'));
 if(accepted)return {id:accepted.id,kind:'diplomacy',title:accepted.kind==='backchannel'?'비공개 협력 성사':'협정 체결',detail:'공동 사업의 효과가 반영됐습니다'};
 const job=[...old.jobs].reverse().find(j=>!room.jobs.some(x=>x.id===j.id)&&room.serverNow>=j.end&&room.serverNow-j.end<10000&&['policy','crisis-response','economy','support','infrastructure'].includes(j.action));
 if(job)return {id:job.id,kind:job.action==='policy'?'policy':job.action==='crisis-response'?'recovery':'build',title:job.action==='policy'?'정책 시행 완료':job.action==='crisis-response'?'위기 대응 도착':'국내 사업 완료',detail:job.action==='policy'?job.policy?.label||'선택한 정책의 효과가 반영됐습니다':job.action==='crisis-response'?'공동 대응과 자국 의료 대비에 반영됐습니다':'국가 현황에서 달라진 지표를 확인하세요'};
 return null;
}
