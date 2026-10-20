import assert from 'node:assert/strict';
import {createRoom,command,tick,income,NATIONS} from '../lib/game.ts';
const t=1000000;
function game(duration=90){
 const r=createRoom('BUD234','p0','host',t,duration);r.seed=42;
 for(let n=0;n<2;n++){if(n)command(r,`p${n}`,{type:'join',name:'guest'},t);command(r,`p${n}`,{type:'select',nation:n},t);command(r,`p${n}`,{type:'ready'},t);}
 command(r,'p0',{type:'start'},t);return r;
}
for(const [nation,n] of NATIONS.entries()){
 const p={nation,stats:n.stats};const r=game();
 const early=income(p,r);r.round=4;assert(income(p,r)>early);const mid=income(p,r);r.round=7;assert(income(p,r)>mid);
 for(const round of [1,3,4,6,7,10]){
  r.round=round;r.duration=90;const budget=income(p,r)*90;
  for(const duration of [60,120]){r.duration=duration;assert(Math.abs(income(p,r)*duration-budget)<1e-9);}
 }
}
const ruined=game();ruined.round=7;ruined.players[0].stats={economy:0,support:0,military:0,infrastructure:0,relations:0};
assert(income(ruined.players[0],ruined)*90>=29); // Recovery remains possible.
const normal=income(ruined.players[0],ruined);ruined.boycotts=[{from:1,target:0,until:t+30000}];assert.equal(income(ruined.players[0],ruined),normal/2);
// Reconnect must not extend an expired boycott to the next poll/turn.
const fast=game(),slow=structuredClone(fast);
fast.boycotts=slow.boycotts=[{from:1,target:0,until:t+12500}];
const initial=fast.players[0].money,rate=income(fast.players[0]);
for(let now=t+500;now<=t+30000;now+=500)tick(fast,now);tick(slow,t+30000);
assert(Math.abs(slow.players[0].money-(initial+rate*(12.5/2+17.5)))<1e-8);
assert(Math.abs(fast.players[0].money-slow.players[0].money)<1e-8);
// Across turn and phase boundaries, frequent and delayed polling pay equally.
for(const duration of [60,90,120]){
 const a=game(duration),b=structuredClone(a);for(let now=t+1700;now<t+duration*10000;now+=1700)tick(a,now);tick(a,t+duration*10000);tick(b,t+duration*10000);
 assert.equal(b.status,'finished');for(let n=0;n<2;n++){assert(Math.abs(a.players[n].money-b.players[n].money)<1e-7);assert.deepEqual(a.players[n].stats,b.players[n].stats);}
}
console.log('PASS: staged income, equal per-turn revenue across speeds, recovery floor, boycott expiry and reconnect consistency');
