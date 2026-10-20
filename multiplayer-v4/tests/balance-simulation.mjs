// Deterministic engine simulation, not a browser or human playtest.
// Each country chooses its highest score-value affordable policy, contributes
// to an active crisis if affordable, then attempts one domestic action/turn.
import {pathToFileURL} from 'node:url';
const g=await import(process.argv[2]?pathToFileURL(process.argv[2]).href:'../lib/game.ts');
const {createRoom,command,tick,policyChoices,NATIONS,ACTIONS,price,responseCost,income}=g;
const t=1000000, seeds=Array.from({length:24},(_,i)=>42+i*7919);
const results=[];
for(const duration of [60,90,120]){
 const m={duration,matches:seeds.length,lateDecisions:0,latePreferredBlocked:0,lateAffordable:0,lateActionAttempts:0,lateActions:0,lateIncome:0,endMoney:0,endMax:0,crisisFailed:0};
 for(const seed of seeds){
  const r=createRoom('BAL234','p0','host',t,duration);r.seed=seed;
  for(let n=0;n<4;n++){if(n)command(r,`p${n}`,{type:'join',name:`player${n}`},t);command(r,`p${n}`,{type:'select',nation:n},t);command(r,`p${n}`,{type:'ready'},t);}
  command(r,'p0',{type:'start'},t);
  for(let round=1;round<=10;round++){
   const now=t+(round-1)*duration*1000;tick(r,now);
   for(const p of r.players){
    const policies=policyChoices(p).map((c,i)=>({c,i,cost:Math.max(0,-(c.effect.money||0)),value:Object.entries(c.effect).reduce((s,[k,v])=>s+(k==='money'?0:(Math.max(0,Math.min(100,p.stats[k]+v))-p.stats[k])*((k==='economy'||k==='infrastructure'?.1:.2)+(NATIONS[p.nation].goal===k?.2:0))),0)})).sort((a,b)=>b.value-a.value);
    if(round>=7){m.lateDecisions++;m.latePreferredBlocked+=+(policies[0].cost>p.money);m.lateAffordable+=policies.filter(x=>x.cost<=p.money).length;m.lateIncome+=income(p,r)*duration;}
    command(r,p.id,{type:'choice',choice:policies.find(x=>x.cost<=p.money&&x.value>0)?.i??-1},now);
    const response=['care','research','supplies','share'][p.nation];
    if(r.arc?.status==='active'&&p.money>=responseCost(p.nation,response))command(r,p.id,{type:'crisis_response',response},now);
   }
   const done=new Set();if(round>=7)m.lateActionAttempts+=4;
   for(let second=25;second<duration;second+=5){tick(r,now+second*1000);for(const p of r.players){
    if(done.has(p.nation))continue;
    const action=[['economy','economy'],['support','support'],['infrastructure','infrastructure']].sort((a,b)=>p.stats[a[1]]-p.stats[b[1]])[0][0];
    const a=ACTIONS.find(x=>x.id===action);
    if(!r.jobs.some(j=>j.actor===p.nation&&j.action===action)&&p.money>=price(r,a,p.nation)&&now+second*1000+a.seconds*1000<=t+10*duration*1000){command(r,p.id,{type:'action',action},now+second*1000);done.add(p.nation);if(round>=7)m.lateActions++;}
   }}
  }
  tick(r,t+10*duration*1000);if(r.status!=='finished')throw Error('match did not finish');
  m.crisisFailed+=+(r.arc?.status==='failed');
  for(const p of r.players){if(p.money<0)throw Error('negative treasury');m.endMoney+=p.money;m.endMax=Math.max(m.endMax,p.money);}
 }
 results.push({duration,matches:m.matches,latePreferredPolicyBlockedPct:+(100*m.latePreferredBlocked/m.lateDecisions).toFixed(1),lateAffordablePolicies:+(m.lateAffordable/m.lateDecisions).toFixed(2),lateDomesticActionSuccessPct:+(100*m.lateActions/m.lateActionAttempts).toFixed(1),lateIncomePerTurn:+(m.lateIncome/m.lateDecisions).toFixed(1),endMoneyMean:+(m.endMoney/(m.matches*4)).toFixed(1),endMoneyMax:+m.endMax.toFixed(1),crisisFailed:m.crisisFailed});
}
console.log(JSON.stringify(results,null,2));
