import assert from 'node:assert/strict';
import {createRoom,command,tick,view,GameError,ACTIONS,NATIONS,score} from '../lib/game.ts';
const t=1000000;
function ready(){const r=createRoom('TEST23','p0','지도자0',t);for(let n=1;n<4;n++)command(r,`p${n}`,{type:'join',name:`지도자${n}`},t);for(let n=0;n<4;n++){command(r,`p${n}`,{type:'select',nation:n},t);command(r,`p${n}`,{type:'ready'},t);}command(r,'p0',{type:'start'},t);return r;}
const r=ready();assert.equal(r.status,'playing');assert.equal(r.round,1);
assert.throws(()=>command(r,'outsider',{type:'action',action:'aid',target:1},t),GameError);
assert.throws(()=>command(r,'p0',{type:'action',action:'economy'},t),/정책/);
for(let n=0;n<4;n++)command(r,`p${n}`,{type:'choice',choice:1,requestId:`c${n}`},t);
const initial=r.players[0].money;command(r,'p0',{type:'choice',choice:1,requestId:'c0'},t);assert.equal(r.players[0].money,initial);
command(r,'p0',{type:'action',action:'message',target:1,text:'SECRET_CHANNEL'},t);
assert(view(r,'p0',t).logs.some(l=>l.text.includes('SECRET_CHANNEL')));assert(view(r,'p1',t).logs.some(l=>l.text.includes('SECRET_CHANNEL')));assert(!view(r,'p2',t).logs.some(l=>l.text.includes('SECRET_CHANNEL')));
command(r,'p1',{type:'action',action:'treaty',target:3},t);
const before=r.players[1].stats.economy;tick(r,t+4999);assert.equal(r.offers.length,0);tick(r,t+5000);assert.equal(r.offers.length,1);
assert.throws(()=>command(r,'p2',{type:'respond',offerId:r.offers[0].id,accept:true},t+5000),/응답/);
command(r,'p3',{type:'respond',offerId:r.offers[0].id,accept:true},t+5000);assert.equal(r.players[1].stats.economy,Math.min(before+10,100));assert.equal(r.offers[0].status,'accepted');
assert.throws(()=>command(r,'p3',{type:'respond',offerId:r.offers[0].id,accept:true},t+5000),/응답/);
const oldMoney=r.players[0].money;tick(r,t+6000);assert(r.players[0].money>oldMoney);
assert.throws(()=>command(r,'p0',{type:'action',action:'war',target:1},t+89000),/시간/);
tick(r,t+180000);assert.equal(r.round,3);assert.equal(r.news.length,1);assert(!JSON.stringify(r.news).includes('SECRET_CHANNEL'));
tick(r,t+900000);assert.equal(r.status,'finished');assert.equal(r.news.length,5);assert.equal(view(r,'p0',t+900000).scores.length,4);
const final=JSON.stringify(r.players.map(p=>p.stats));tick(r,t+990000);assert.equal(JSON.stringify(r.players.map(p=>p.stats)),final);
for(const p of r.players){for(const v of Object.values(p.stats))assert(v>=0&&v<=100);assert(score(p).total>=0&&score(p).total<=100);}
const lobby=createRoom('TEST24','h','host',t);command(lobby,'x',{type:'join',name:'guest'},t);command(lobby,'h',{type:'select',nation:0},t);assert.throws(()=>command(lobby,'x',{type:'select',nation:0},t),/다른/);command(lobby,'h',{type:'leave'},t);assert.equal(lobby.host,'x');
for(const a of ACTIONS){const x=ready();for(let n=0;n<4;n++){x.players[n].money=1000;command(x,`p${n}`,{type:'choice',choice:0},t);}command(x,'p0',{type:'action',action:a.id,target:1,text:'확인'},t);tick(x,t+21000);assert(x.logs.some(l=>l.actor===0&&(l.kind===a.id||['treaty','backchannel','ultimatum'].includes(a.id)&&l.kind==='offer')));if(a.id!=='message')assert.throws(()=>command(x,'p0',{type:'action',action:a.id,target:1,text:'확인'},t+22000),/한 번/);}
console.log('PASS: 4 players, unique nations, readiness, host handoff, secret visibility, idempotency, delayed actions, response ownership, income, deadlines, 5 news editions, all 12 actions, 10-turn scoring');

// Reduced lobbies must work with non-contiguous nation indices, not just 0..N-1.
function smaller(nations,seed){const room=createRoom('SMALL2','p0','host',t);if(seed!==undefined)room.seed=seed;for(let i=0;i<nations.length;i++){if(i)command(room,`p${i}`,{type:'join',name:`guest${i}`},t);command(room,`p${i}`,{type:'select',nation:nations[i]},t);command(room,`p${i}`,{type:'ready'},t);}return room;}
const solo=smaller([3]);assert.throws(()=>command(solo,'p0',{type:'start'},t),/2~4명/);
for(const nations of [[3,1],[2,0,3]]){
 const game=smaller(nations);command(game,'p1',{type:'ready'},t);assert.throws(()=>command(game,'p0',{type:'start'},t),/준비/);command(game,'p1',{type:'ready'},t);assert.throws(()=>command(game,'p1',{type:'start'},t),/방장/);command(game,'p0',{type:'start'},t);assert.equal(game.players.length,nations.length);assert.throws(()=>command(game,'late',{type:'join',name:'late'},t),/이미 시작/);
 for(const p of game.players)command(game,p.id,{type:'choice',choice:1},t);
 const missing=[0,1,2,3].find(n=>!nations.includes(n));const cash=game.players[0].money;assert.throws(()=>command(game,'p0',{type:'action',action:'aid',target:missing},t),/대상/);assert.equal(game.players[0].money,cash);
 command(game,'p0',{type:'action',action:'treaty',target:nations[1]},t);tick(game,t+5000);command(game,'p1',{type:'respond',offerId:game.offers[0].id,accept:true},t+5000);assert.equal(game.offers[0].status,'accepted');
 tick(game,t+900000);assert.equal(game.status,'finished');assert.equal(game.news.length,5);assert(game.news.every(n=>n.impacts.length===nations.length));assert.equal(view(game,'p0',t+900000).scores.length,nations.length);
}
const {EVENTS,CHOICES}=await import('../lib/game.ts');
assert.equal(ACTIONS.length,12);assert.equal(EVENTS.length,7);assert.deepEqual(CHOICES.map(c=>c.length),[3,3,3,3]);
for(let eventIndex=0;eventIndex<EVENTS.length;eventIndex++){
 let seed=0;while(Math.floor(((Math.imul(1664525,seed)+1013904223)>>>0)/4294967296*EVENTS.length)!==eventIndex)seed=(seed+65537)>>>0;
 for(const nations of [[3,1],[2,0,3]]){const game=smaller(nations,seed);command(game,'p0',{type:'start'},t);assert.equal(game.event,eventIndex);const event=EVENTS[eventIndex];for(const p of game.players){for(const stat of Object.keys(p.stats)){const expected=NATIONS[p.nation].stats[stat]+(event.effect[stat]||0)+(p.nation===event.nation?(event.local[stat]||0):0);assert.equal(p.stats[stat],Math.min(100,Math.max(0,expected)));}}tick(game,t+900000);assert.equal(game.status,'finished');}
}
for(const action of ACTIONS){const game=smaller([3,1]);command(game,'p0',{type:'start'},t);game.players[0].money=1000;command(game,'p0',{type:'choice',choice:0},t);command(game,'p0',{type:'action',action:action.id,target:1,text:'2인 전문'},t);tick(game,t+21000);assert(game.logs.some(l=>l.actor===3&&(l.kind===action.id||['treaty','backchannel','ultimatum'].includes(action.id)&&l.kind==='offer')));}
console.log('PASS: 1-player rejection; 2/3-player readiness and host gates; absent targets; all 7 events; all 12 actions in 2-player games; 10-turn results and news for actual participants');
