import assert from 'node:assert/strict';
import {createRoom,command,tick,view,EVENTS,relationLabel} from '../lib/game.ts';
const t=1000000;
function game(nations=[0,1,2,3],seed=42){const r=createRoom('NEWS23','p0','host',t);r.seed=seed;for(let i=0;i<nations.length;i++){if(i)command(r,`p${i}`,{type:'join',name:`guest${i}`},t);command(r,`p${i}`,{type:'select',nation:nations[i]},t);command(r,`p${i}`,{type:'ready'},t);}command(r,'p0',{type:'start'},t);for(const p of r.players){p.money=1000;command(r,p.id,{type:'choice',choice:1},t);}return r;}
for(const count of [2,3,4]){const r=game([0,1,2,3].slice(0,count));assert.equal(r.relations.length,count*(count-1)/2);for(const bulletin of r.bulletins){assert.equal(bulletin.editions.length,count);assert.equal(bulletin.impacts.length,0);for(const edition of bulletin.editions){assert(edition.articles.length<=4);for(const a of edition.articles){assert(!/[0-9%+−]/.test(a.body+a.headline));assert(a.body.length<=100);assert(a.image>=0&&a.image<6);}}}
 assert(r.bulletins.length>0);assert(r.reactions.some(x=>x.urgent));
 const next=r.nextEvent;tick(r,t+90000);assert.equal(r.event,next);
 tick(r,t+900000);assert.equal(r.news.length,5);assert.equal(r.status,'finished');assert.equal(view(r,'p0',t+900000).scores.length,count);
}
const r=game();command(r,'p0',{type:'action',action:'aid',target:1},t);tick(r,t+8000);const pair=r.relations.find(p=>p.a===0&&p.b===1);assert.equal(pair.label,'우호');
command(r,'p0',{type:'action',action:'treaty',target:1},t+8000);tick(r,t+13000);command(r,'p1',{type:'respond',offerId:r.offers[0].id,accept:true},t+13000);assert.equal(pair.label,'협력');
command(r,'p0',{type:'action',action:'war',target:1},t+14000);tick(r,t+34000);assert.equal(pair.label,'충돌');
const hidden=game();command(hidden,'p0',{type:'action',action:'message',target:1,text:'TOP_SECRET_NEWS'},t);command(hidden,'p0',{type:'action',action:'backchannel',target:1},t);tick(hidden,t+8000);hidden.players[0].stats.relations=86;const baseline=hidden.bulletins.length;
command(hidden,'p1',{type:'respond',offerId:hidden.offers[0].id,accept:true},t+8000);
assert.equal(hidden.bulletins.length,baseline);assert(!JSON.stringify(view(hidden,'p2',t+8000)).includes('TOP_SECRET_NEWS'));assert(!view(hidden,'p2',t+8000).reactions.some(x=>x.privateTo));assert(view(hidden,'p0',t+8000).reactions.some(x=>x.privateTo));assert(hidden.relations.every(x=>x.value===0));
const migrated=game([3,1]);delete migrated.relations;delete migrated.reactions;delete migrated.bulletins;delete migrated.pressCooldown;assert.doesNotThrow(()=>view(migrated,'p0',t));assert.equal(migrated.relations.length,1);
assert.deepEqual([-80,-20,0,20,50].map(relationLabel),['충돌','긴장','중립','우호','협력']);
let seed=0;while(Math.floor(((Math.imul(1664525,seed)+1013904223)>>>0)/4294967296*EVENTS.length)!==2)seed+=65537;
const pandemic=game([0,3],seed);assert.equal(pandemic.event,2);assert.equal(pandemic.pandemicAt,t);pandemic.nextEvent=2;tick(pandemic,t+90000);assert.equal(pandemic.pandemicAt,t);
console.log('PASS: 2–4 nation editions, no numeric news copy, event forecasts, spikes, public relationship updates, private diplomacy isolation, legacy state, first pandemic marker');
