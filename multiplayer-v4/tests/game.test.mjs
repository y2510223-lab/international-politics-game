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
