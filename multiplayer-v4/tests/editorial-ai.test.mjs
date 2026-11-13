import assert from 'node:assert/strict';
import {createRoom,command,tick,view,statementReturns,aiTradeProposal,aiDealAssessment,AI_DIPLOMACY,POLICY_BANK} from '../lib/game.ts';
import {outcomeCue} from '../lib/outcome-cue.ts';
const t=1000000;
function game(event=1){const r=createRoom('ED2345','p0','host',t);r.seed=42;r.nextEvent=event;for(let n=0;n<4;n++){if(n)command(r,`p${n}`,{type:'join',name:'guest'},t);command(r,`p${n}`,{type:'select',nation:n},t);command(r,`p${n}`,{type:'ready'},t);}command(r,'p0',{type:'start'},t);for(const p of r.players){command(r,p.id,{type:'choice',choice:-1},t);p.money=1000;p.stats={economy:45,support:20,military:45,infrastructure:45,relations:20};}return r;}
// Actual repeated completions diminish, reset per completion turn and survive reload.
const repeated=game(),p=repeated.players[0];let at=t;
for(const expected of [[7,3],[3,1],[1,0],[0,0]]){const before={...p.stats};command(repeated,p.id,{type:'action',action:'statement'},at);at+=12000;tick(repeated,at);assert.equal(p.stats.relations-before.relations,expected[0]);assert.equal(p.stats.support-before.support,expected[1]);}
assert.deepEqual(statementReturns(structuredClone(p),1),{relations:0,support:0,tension:0});assert.deepEqual(statementReturns(p,2),{relations:7,support:3,tension:3});
// Quiet collection, one immutable paper per completed turn, no automatic extras.
assert.equal(repeated.news.length,0);assert.equal(repeated.bulletins.length,0);assert(repeated.pressQueue.length);
tick(repeated,t+90000);assert.equal(repeated.news.length,1);assert.equal(repeated.news[0].round,1);
const first=JSON.stringify(repeated.news[0]);tick(repeated,t+900000);assert.equal(repeated.news.length,10);assert.equal(new Set(repeated.news.map(x=>x.round)).size,10);assert.equal(repeated.bulletins.length,0);assert.equal(JSON.stringify(repeated.news[0]),first);
for(const n of repeated.news)for(const ed of n.editions){assert(ed.articles.length<=5);assert.equal(ed.articles.at(-1).tag,n.round===10?'마지막 국면':'다음 국면 예고');assert(ed.articles.some(a=>a.tag==='우리나라 결산'));assert(!/[+−]\s*\d/.test(JSON.stringify(ed.articles)));}
// Preview headlines differ by event and snapshots cannot leak next-turn losses.
const forecasts=new Set();for(let event=0;event<13;event++){const r=game();r.nextEvent=event;const deaths=r.players.map(p=>p.deaths||0);tick(r,t+90000);forecasts.add(r.news[0].editions[0].articles.at(-1).headline);r.news[0].editions.forEach((e,i)=>assert.equal(e.figures.deaths,deaths[i]));}assert.equal(forecasts.size,13);
// No private telegram or private cooperation becomes a public article.
const secret=game();command(secret,'p0',{type:'action',action:'message',target:1,text:'SECRET_NEVER_PRINT'},t);command(secret,'p0',{type:'action',action:'backchannel',target:1,topic:'research'},t);tick(secret,t+24000);command(secret,'p1',{type:'respond',offerId:secret.offers[0].id,accept:true},t+24000);tick(secret,t+90000);assert(!JSON.stringify(secret.news).includes('SECRET_NEVER_PRINT'));assert(!secret.news[0].editions.some(e=>e.articles.some(a=>a.tag==='공동 대응')));
// Last-turn policies enacted in the final settlement are in the final paper.
const final=game();tick(final,t+810000);const fp=final.players[0];fp.money=1000;fp.policies=[structuredClone(POLICY_BANK.repair),structuredClone(POLICY_BANK.relief),structuredClone(POLICY_BANK.defend)];command(final,'p0',{type:'choice',choice:0},t+899000);tick(final,t+900000);assert(final.news[9].editions[0].articles.some(a=>a.headline.includes(POLICY_BANK.repair.label)));
// Personalities change requested terms without changing the national-score goal.
const r=game();for(const x of r.players){x.money=100;x.stats={economy:45,support:45,military:45,infrastructure:45,relations:45};}
assert.equal(new Set(AI_DIPLOMACY.map(x=>x.name)).size,4);
const proposals=r.players.map((x,i)=>aiTradeProposal(r,x,r.players[(i+1)%4]));assert(proposals.every(Boolean));assert(new Set(proposals.map(x=>x.ask)).size>=3);
const visible=structuredClone(r),proposal=aiTradeProposal(r,r.players[0],r.players[1]);visible.jobs.push({id:'hidden',actor:1,action:'policy',target:-1,start:t,end:t+24000,text:'',policy:{label:'secret',effect:{economy:100,infrastructure:100,relations:100},tension:0}});assert.deepEqual(aiTradeProposal(visible,visible.players[0],visible.players[1]),proposal);
const friendly=aiDealAssessment(r,r.players[2],0,'funding','research');assert(friendly.accept);r.relations.find(x=>x.a===0&&x.b===2).value=-80;assert(!aiDealAssessment(r,r.players[2],0,'funding','research').accept);
// A weak incoming offer triggers a real counteroffer, with escrow and reasons.
const counter=game(),cp=counter.players[2];cp.isAI=true;cp.money=100;cp.stats={economy:50,support:100,military:50,infrastructure:10,relations:100};counter.nextAI=t+1000;
command(counter,'p0',{type:'deal_propose',target:2,give:'funding',ask:'research'},t);tick(counter,t+1000);const original=counter.deals[0];assert.equal(original.status,'rejected');assert(counter.deals.some(d=>d.counterOf===original.id));assert(counter.dispatches.some(d=>d.from===2&&d.to===0&&d.text.includes('자립 기반')));
// Effect triggers reflect actual own outcomes; no replay or outsider leakage.
const fx=game();fx.players[0].choice=null;command(fx,'p0',{type:'choice',choice:0},t);const before=view(fx,'p0',t);tick(fx,t+24000);const after=view(fx,'p0',t+24000);assert.equal(outcomeCue(before,after).kind,'policy');assert.equal(outcomeCue(after,after),null);assert.equal(outcomeCue(null,after),null);assert.equal(outcomeCue(before,{...after,code:'OTHER2'}),null);
const remoteBefore=view(secret,'p2',t+24000),remoteAfter=structuredClone(remoteBefore);remoteAfter.offers.push({id:'private',from:0,to:1,status:'accepted',kind:'backchannel',expires:t+90000});assert.equal(outcomeCue(remoteBefore,remoteAfter),null);
console.log('PASS: diminishing statements, turn digest/forecast/privacy/final settlement, national negotiation/counteroffers/reserves, public-state AI and own outcome cues');
