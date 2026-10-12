import assert from 'node:assert/strict';
import {createRoom,command,tick,view,policyChoices,generatePolicies,CLIMATE_TYPES,crisisMarkers,currentEventTitle,currentEventDescription,ACTIONS,price,jobName,CHOICES,policyOpinions,POLICY_BANK,NATIONS} from '../lib/game.ts';
const t=1000000;
function start(event=2,nations=[0,1,2,3],seed=42){const r=createRoom('CT2345','p0','host',t);r.seed=seed;r.nextEvent=event;for(let i=0;i<nations.length;i++){if(i)command(r,`p${i}`,{type:'join',name:'guest'},t);command(r,`p${i}`,{type:'select',nation:nations[i]},t);command(r,`p${i}`,{type:'ready'},t);}command(r,'p0',{type:'start'},t);return r;}
const health=start();
for(const p of health.players){assert.equal(p.policies.length,3);assert.equal(new Set(p.policies.map(c=>c.id)).size,3);assert.equal(p.policies.slice(0,2).filter(c=>['hospitals','quarantine','healthAid'].includes(c.id)).length,2);assert(p.policies.every(c=>c.image&&c.opinions.length===3));}
const fixed=JSON.stringify(health.players[0].policies);health.players[0].money=0;health.players[0].stats.economy=2;tick(health,t+45000);assert.equal(JSON.stringify(health.players[0].policies),fixed);assert.equal(JSON.stringify(view(health,'p0',health.clock).players[0].policies),fixed);
const low=generatePolicies(health,health.players[0]);assert(['bonds','tax'].includes(low[2].id));
const pending=start(2);const p=pending.players[0];p.money=500;const original=structuredClone(p.policies[0]);command(pending,p.id,{type:'choice',choice:0,round:1},t+89000);const job=pending.jobs[0];assert.deepEqual(job.policy,original);assert(jobName(job).includes(original.label));
pending.nextEvent=6;tick(pending,t+90000);assert.notDeepEqual(p.policies.map(c=>c.id),health.players[0].policies.map(c=>c.id));assert.equal(p.selectedPolicy,undefined);const before={...p.stats};assert.throws(()=>command(pending,p.id,{type:'choice',choice:0,round:1},t+90000),/턴이 바뀌/);tick(pending,t+113000);for(const stat of Object.keys(before))assert.equal(p.stats[stat],Math.max(0,Math.min(100,before[stat]+(original.effect[stat]||0))));assert(pending.logs.some(l=>l.text.includes(original.label+' 정책 시행')));
// Repeating a situation still rotates its options. Client reads do not reroll.
const repeat=start(2);const first=repeat.players.map(p=>p.policies.map(c=>c.id));repeat.nextEvent=2;tick(repeat,t+90000);repeat.players.forEach((p,i)=>assert.notDeepEqual(p.policies.map(c=>c.id),first[i]));assert.equal(repeat.pandemicAt,t+90000);assert(crisisMarkers(repeat).every(m=>m.at===t+90000));
// Climate disasters select only actual participants and region-compatible types.
const seen=new Set();for(let seed=1;seed<=64;seed++){
 const r=start(4,[0,1,2,3],Math.imul(seed,2654435761)>>>0),c=r.climate,definition=CLIMATE_TYPES[c.kind];seen.add(c.kind);assert(definition.nations.includes(c.nation));assert.equal(crisisMarkers(r).length,1);assert.equal(crisisMarkers(r)[0].nation,c.nation);assert(currentEventDescription(r).includes(NATIONS[c.nation].short));
 for(const player of r.players){if(player.nation===c.nation){assert(player.deaths>0);assert(player.eventLosses[definition.name]);assert(player.policies.slice(0,2).every(x=>x.context.includes('자국 피해')));}else{assert.deepEqual(player.stats,NATIONS[player.nation].stats);assert.equal(player.deaths||0,0);assert.equal(player.unemployed||0,0);assert(!player.policies.slice(0,2).some(x=>x.context.includes('자국 피해')));}}
 const action=ACTIONS.find(a=>a.id==='economy');assert.equal(price(r,action,c.nation),Math.ceil(action.cost*1.25));assert.equal(price(r,action,(c.nation+1)%4),action.cost);
 const paper=r.bulletins.find(x=>x.title===currentEventTitle(r));assert(paper);assert(paper.editions.every(ed=>ed.figures.eventTitle===definition.name));assert(paper.editions.find(ed=>ed.nation!==c.nation).figures.eventDeaths===0);
 r.nextEvent=1;tick(r,t+90000);assert.equal(r.climate,undefined);assert.equal(crisisMarkers(r).length,0);
}
assert.equal(seen.size,8);
for(const nations of [[0,2],[1,3]]){const r=start(4,nations);assert(nations.includes(r.climate.nation));assert(CLIMATE_TYPES[r.climate.kind].nations.includes(r.climate.nation));}
const pandemic=start(2,[3,1]);assert.equal(crisisMarkers(pandemic).length,2);assert.deepEqual(crisisMarkers(pandemic).map(c=>c.nation),[3,1]);assert(crisisMarkers(pandemic).every(c=>c.kind==='health'));pandemic.status='finished';assert.equal(crisisMarkers(pandemic).length,0);
// Old persisted rooms/jobs still retain their original fixed policy meanings.
const legacy=start(1);legacy.players[0].policies=undefined;assert.equal(policyChoices(legacy.players[0]),CHOICES[0]);legacy.jobs=[{id:'legacy',actor:0,target:-1,action:'policy',choice:0,start:t,end:t+24000,text:''}];const oldMilitary=legacy.players[0].stats.military;tick(legacy,t+24000);assert.equal(legacy.players[0].stats.military,Math.min(100,oldMilitary+16));
for(const c of Object.values(POLICY_BANK)){assert(policyOpinions(c,0,0).every(x=>x.length>45));assert(!/[+−]\d/.test(c.context||''));}
console.log('PASS: contextual policies/frozen choices, cross-turn policy snapshots, legacy jobs, all 8 regional climate types, targeted harm/cost/news, repeated pandemic and map markers');
