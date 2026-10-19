// Headless engine evaluation; this is not human or browser play evidence.
import {createRoom,command,tick,score} from '../lib/game.ts';
let actions={},holds=0,decisions=0,crisisFailed=0,balances=[],scores=[];
for(let seed=0;seed<24;seed++){
 const t=1000000,r=createRoom('BOT234','p0','host',t);r.seed=42+seed*7919;
 command(r,'p0',{type:'select',nation:0},t);command(r,'p0',{type:'ready'},t);command(r,'p0',{type:'ai',aiCount:3},t);command(r,'p0',{type:'start'},t);
 // The host is also controlled by the same AI only for this offline evaluation.
 r.players[0].isAI=true;
 for(let round=1;round<=10;round++){tick(r,t+(round-1)*90000+85000);for(const p of r.players)if(round>=7){holds+=+(p.choice===-1);decisions++;}}
 tick(r,t+900000);crisisFailed+=+(r.arc?.status==='failed');
 for(const p of r.players){balances.push(p.money);scores.push(score(p).total);for(const [k,v] of Object.entries(p.history))actions[k]=(actions[k]||0)+v;}
}
console.log(JSON.stringify({matches:24,lateHoldPct:100*holds/decisions,meanBalance:balances.reduce((a,b)=>a+b)/balances.length,meanScore:scores.reduce((a,b)=>a+b)/scores.length,crisisFailed,actions},null,2));
