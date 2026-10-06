import {createRequire} from 'node:module';
import {readFileSync,readdirSync} from 'node:fs';
import assert from 'node:assert/strict';
const require=createRequire(import.meta.url);
const {Miniflare}=createRequire(require.resolve('wrangler/package.json'))('miniflare');
const mf=new Miniflare({modules:[{type:'ESModule',path:'dist/server/index.js'},...readdirSync('dist/server',{recursive:true}).filter(p=>/\.m?js$/.test(p)&&p!=='index.js').map(p=>({type:'ESModule',path:'dist/server/'+p}))],compatibilityDate:'2026-05-15',compatibilityFlags:['nodejs_compat'],d1Databases:{DB:'test-game'},assets:{directory:'dist/client',binding:'ASSETS',routerConfig:{has_user_worker:true,invoke_user_worker_ahead_of_assets:true}},log:undefined});
try {
const db=await mf.getD1Database('DB');await db.exec(readFileSync('drizzle/0000_living_skullbuster.sql','utf8').replaceAll('\n',' '));
const sessions=Array(5).fill('');
async function api(n,body){const res=await mf.dispatchFetch('https://game.test/api/game',{method:body?'POST':'GET',headers:{cookie:sessions[n],...(body?{'Content-Type':'application/json',origin:'https://game.test'}:{})},body:body?JSON.stringify(body):undefined});for(const c of res.headers.getSetCookie()){const pair=c.split(';')[0];const key=pair.split('=')[0];sessions[n]=sessions[n].split('; ').filter(x=>x&&!x.startsWith(key+'=')).concat(pair).join('; ');}const raw=await res.text();if(!raw)throw new Error(JSON.stringify({status:res.status,headers:Object.fromEntries(res.headers)}));let data;try{data=JSON.parse(raw);}catch{throw new Error(raw.slice(0,500));}return {status:res.status,...data};}
let out=await api(0,{type:'create',name:'host'});assert.equal(out.status,200,JSON.stringify(out));const code=out.room.code;
const joins=await Promise.all([1,2,3].map(n=>api(n,{type:'join',code,name:`guest${n}`})));for(const x of joins)assert.equal(x.status,200,JSON.stringify(x));
const full=await api(4,{type:'join',code,name:'extra'});assert.equal(full.status,400);
const selects=await Promise.all([0,1,2,3].map(n=>api(n,{type:'select',code,nation:n})));for(const x of selects)assert.equal(x.status,200,JSON.stringify(x));
await Promise.all([0,1,2,3].map(n=>api(n,{type:'ready',code})));
out=await api(0,{type:'start',code});assert.equal(out.room.status,'playing');assert.equal(out.room.players.length,4);
const decisions=await Promise.all([0,1,2,3].map(n=>api(n,{type:'choice',code,choice:1,requestId:`choice-${n}`})));for(const x of decisions)assert.equal(x.status,200,JSON.stringify(x));
const duplicate=await Promise.all([1,2,3,4].map(()=>api(0,{type:'action',code,action:'economy',requestId:'same-spend'})));for(const x of duplicate)assert.equal(x.status,200,JSON.stringify(x));out=await api(0);assert.equal(out.room.jobs.filter(x=>x.action==='economy').length,1);
await api(1,{type:'action',code,action:'message',target:2,text:'PRIVATE_TEST'});
assert((await api(1)).room.logs.some(l=>l.text.includes('PRIVATE_TEST')));assert((await api(2)).room.logs.some(l=>l.text.includes('PRIVATE_TEST')));assert(!(await api(0)).room.logs.some(l=>l.text.includes('PRIVATE_TEST')));assert(!(await api(3)).room.logs.some(l=>l.text.includes('PRIVATE_TEST')));
const unauth=await mf.dispatchFetch(`https://game.test/api/game?code=${code}`);assert.equal((await unauth.json()).room,null);
const wrongOrigin=await mf.dispatchFetch('https://game.test/api/game',{method:'POST',headers:{'Content-Type':'application/json',origin:'https://other.test',cookie:sessions[0]},body:JSON.stringify({type:'action',code,action:'support'})});assert.equal(wrongOrigin.status,403);
const row=await db.prepare('SELECT state FROM game_rooms WHERE code = ?').bind(code).first();const state=JSON.parse(row.state);state.clock-=901000;state.deadline-=901000;state.jobs=state.jobs.map(j=>({...j,start:j.start-901000,end:j.end-901000}));await db.prepare('UPDATE game_rooms SET state = ? WHERE code = ?').bind(JSON.stringify(state),code).run();out=await api(0);assert.equal(out.room.status,'finished');assert.equal(out.room.news.length,5);assert.equal(out.room.scores.length,4);
const page=await mf.dispatchFetch('https://game.test/');assert.equal(page.status,200);assert((await page.text()).includes('긴장의 시대'));
const art=await mf.dispatchFetch('https://game.test/nations.webp');assert.equal(art.status,200);assert(art.headers.get('content-type')?.includes('image/webp'));
console.log('PASS: real Worker + D1: concurrent joins/selects/choices, single-charge idempotency, server sessions and reconnect, private message isolation, forbidden origin, 10 rounds, SSR route');
}finally{await mf.dispose();}
