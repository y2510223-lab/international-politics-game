import assert from 'node:assert/strict';
import {createRoom,command,tick,view,canStart,NATIONS,CHOICES,POLICY_SECONDS,price,ACTIONS,score,income} from '../lib/game.ts';
const t=1000000;
function lobby(humans=1,bots=1,nations=[3,1,2,0]){
 const r=createRoom('AI2345','p0','host',t);r.seed=42;
 for(let i=0;i<humans;i++){if(i)command(r,`p${i}`,{type:'join',name:`guest${i}`},t);command(r,`p${i}`,{type:'select',nation:nations[i]},t);command(r,`p${i}`,{type:'ready'},t);}
 command(r,'p0',{type:'ai',aiCount:bots},t);return r;
}
function start(humans=1,bots=1,nations){const r=lobby(humans,bots,nations);command(r,'p0',{type:'start'},t);return r;}
const config=lobby(2,2);
assert.throws(()=>command(config,'p1',{type:'ai',aiCount:0},t),/방장/);
for(const count of [-1,3,1.5,'2',null])assert.throws(()=>command(config,'p0',{type:'ai',aiCount:count},t),/빈자리/);
command(config,'p2',{type:'join',name:'late'},t);assert.equal(config.aiCount,1);
command(config,'p0',{type:'leave'},t);assert.equal(config.host,'p1');command(config,'p1',{type:'ai',aiCount:2},t);assert.equal(config.aiCount,2);
const unready=lobby();command(unready,'p0',{type:'ready'},t);assert.throws(()=>command(unready,'p0',{type:'start'},t),/준비/);
assert(!canStart([{nation:0,ready:true}],0));assert(canStart([{nation:0,ready:true}],3));assert(!canStart([{nation:0,ready:true}],4));
for(const [humans,bots] of [[1,1],[1,2],[1,3],[2,1],[2,2],[3,1],[4,0]]){
 const r=start(humans,bots);assert.equal(r.players.length,humans+bots);assert.equal(new Set(r.players.map(p=>p.nation)).size,humans+bots);assert.equal(r.players.filter(p=>p.isAI).length,bots);
 assert.throws(()=>command(r,'p0',{type:'ai',aiCount:0},t),/대기실/);
 const before=structuredClone(r);tick(r,t+1000);
 assert(r.players.filter(p=>!p.isAI).every(p=>p.choice===null));
 for(const p of r.players.filter(p=>p.isAI)){
 assert(p.choice!==null);const old=before.players.find(x=>x.nation===p.nation);
 // Decisions reserve normal costs; no instantaneous policy or action stat gain.
 assert.deepEqual(p.stats,old.stats);
 const spent=r.jobs.filter(j=>j.actor===p.nation).reduce((sum,j)=>sum+(j.action==='policy'?Math.max(0,-(j.policy.effect.money||0)):price(r,ACTIONS.find(a=>a.id===j.action),p.nation)),0);
 assert(Math.abs(p.money-(old.money+income(old,before)-spent))<1e-8);
 assert(r.jobs.filter(j=>j.actor===p.nation).every(j=>j.end>r.clock));
 }
 tick(r,t+900000);assert.equal(r.status,'finished');assert.equal(r.news.length,10);assert.equal(view(r,'p0',r.clock).scores.length,humans+bots);
 for(const p of r.players.filter(p=>p.isAI)){assert(p.history.statement||p.history.economy||p.history.infrastructure||p.history.support||p.history.mobilize||p.history.treaty);assert(p.money>=0);assert(score(p).total>=0);assert(Object.values(p.stats).every(x=>x>=0&&x<=100));}
 const frozen=JSON.stringify(r);tick(r,t+1000000);assert.equal(JSON.stringify(r),frozen);
}
// Identical decisions after delayed polling / reconnect, with no client AI timer.
const fast=start(1,3),slow=structuredClone(fast);
for(let now=t+1700;now<t+900000;now+=1700)tick(fast,now);tick(fast,t+900000);tick(slow,t+900000);
for(let i=0;i<4;i++){assert.deepEqual(fast.players[i].stats,slow.players[i].stats);assert.deepEqual(fast.players[i].history,slow.players[i].history);assert(Math.abs(fast.players[i].money-slow.players[i].money)<1e-7);}
// Score weighting and cap-aware policy selection: military-goal AI protects its
// scarce military stat; when all stats are capped, spending is avoided.
const strategy=start();const ai=strategy.players.find(p=>p.isAI);ai.policies=structuredClone(CHOICES[ai.nation]);ai.stats={economy:100,support:100,military:30,infrastructure:100,relations:100};tick(strategy,t+1000);assert.equal(ai.choice,0);
const capped=start();const cap=capped.players.find(p=>p.isAI);cap.policies=structuredClone(CHOICES[cap.nation]);cap.stats={economy:100,support:100,military:100,infrastructure:100,relations:100};tick(capped,t+1000);assert.equal(cap.choice,-1);assert.equal(capped.jobs.filter(j=>j.actor===cap.nation).length,0);
// Beneficial offers are accepted; unaffordable or wasteful ones and ultimatums
// are rejected. Private cooperation remains private to its two participants.
for(const kind of ['treaty','backchannel','ultimatum']){
 const r=start(2,1,[3,1]);const p=r.players.find(p=>p.isAI);p.stats={economy:20,support:20,military:50,infrastructure:20,relations:20};r.offers.push({id:'offer',from:3,to:p.nation,kind,topic:'research',expires:t+90000,status:'pending'});tick(r,t+1000);assert.equal(r.offers[0].status,kind==='ultimatum'?'rejected':'accepted');
 if(kind==='backchannel')assert(!view(r,'p1',r.clock).logs.some(l=>l.kind==='response'));
}
const broke=start();const poor=broke.players.find(p=>p.isAI);poor.money=0;broke.offers.push({id:'poor',from:3,to:poor.nation,kind:'treaty',topic:'research',expires:t+90000,status:'pending'});tick(broke,t+1000);assert.equal(broke.offers[0].status,'rejected');
const safe=view(start(1,3),'p0',t+60000);assert(safe.players.filter(p=>p.isAI).every(p=>p.online&&!p.id));
console.log('PASS: host AI counts, solo/mixed matches, normal budgets and delays, goal/cap strategy, diplomacy/privacy, reconnect determinism and 10-turn scoring');
