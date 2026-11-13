import assert from 'node:assert/strict';
import {POLICY_BANK,POLICY_DIALOGUE,policyOpinions,policySpeaker,CHOICES,createRoom,command} from '../lib/game.ts';
assert.deepEqual(Object.keys(POLICY_DIALOGUE).sort(),Object.keys(POLICY_BANK).sort());
const lines=Object.values(POLICY_BANK).flatMap(c=>policyOpinions(c,0,0));
assert.equal(lines.length,81);assert.equal(new Set(lines).size,81);
// Reject reused complete sentences, including lines with just a new policy prefix.
const sentences=lines.flatMap(line=>line.split(/(?<=[.!?])\s+/).map(x=>x.trim()).filter(Boolean));
assert.equal(new Set(sentences).size,sentences.length);
const finance=['credit','bonds','tax'];
assert.equal(new Set(finance.flatMap(id=>policyOpinions(POLICY_BANK[id],0,0))).size,9);
assert.equal(new Set(finance.flatMap(id=>[0,1,2].map(i=>policySpeaker(POLICY_BANK[id],0,1,i)))).size,9);
assert(policyOpinions(POLICY_BANK.credit,0,0).join(' ').includes('상환 유예'));
assert(policyOpinions(POLICY_BANK.bonds,0,0).join(' ').includes('국채'));
assert(policyOpinions(POLICY_BANK.tax,0,0).join(' ').includes('종료 조건'));
// Existing rooms may contain the old duplicated dialogue snapshot.
const stale={...POLICY_BANK.credit,opinions:['OLD','OLD','OLD']};
assert.deepEqual(policyOpinions(stale,0,0),POLICY_DIALOGUE.credit);
const copy=policyOpinions(stale,0,0);copy[0]='changed';assert.notEqual(policyOpinions(stale,0,0)[0],'changed');
const t=1000000,r=createRoom('DL2345','p0','host',t);r.nextEvent=7;
command(r,'p1',{type:'join',name:'guest'},t);
for(let i=0;i<2;i++){command(r,`p${i}`,{type:'select',nation:i},t);command(r,`p${i}`,{type:'ready'},t);}
command(r,'p0',{type:'start'},t);r.players[0].policies=[stale,POLICY_BANK.bonds,POLICY_BANK.tax];r.players[0].money=1000;
command(r,'p0',{type:'choice',choice:0},t);
const replies=r.reactions.filter(x=>x.nation===0&&x.batch).slice(-2);
assert.deepEqual(replies.map(x=>x.text),POLICY_DIALOGUE.credit.slice(0,2));
assert.deepEqual(replies.map(x=>x.speaker),[0,1].map(i=>policySpeaker(stale,0,r.round,i)));
// Legacy fixed policies continue to have separate opinions too.
const legacy=CHOICES.flatMap((choices,n)=>choices.flatMap((c,i)=>policyOpinions(c,n,i)));
assert.equal(new Set(legacy).size,36);
console.log('PASS: 27 policy debates / 81 unique lines, no shared sentences, financial policy meanings and speakers, stale room replacement, chosen-policy replies and legacy choices');
