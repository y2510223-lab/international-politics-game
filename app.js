import { initializeApp } from "https://www.gstatic.com/firebasejs/12.18.0/firebase-app.js";
import {
  getAuth, signInAnonymously, onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-auth.js";
import {
  getDatabase, ref, set, get, update, push, onValue, runTransaction, serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.18.0/firebase-database.js";
import { firebaseConfig } from "./firebase-config.js";

const NATIONS = {
  auroria: {
    name: "아우로리아 연방", role: "군사 강국",
    desc: "막강한 군사력을 지녔지만 주변국은 당신의 모든 움직임을 위협으로 해석합니다.",
    military: 85, economy: 58, influence: 62, trust: 38,
    objective: "안보를 확보하되 세계 긴장도 90을 넘기지 마십시오."
  },
  belvar: {
    name: "벨바르 공화국", role: "경제 강국",
    desc: "무역망과 금융 영향력을 무기로 사용합니다. 전쟁이 길어질수록 당신도 손해를 봅니다.",
    military: 48, economy: 88, influence: 72, trust: 63,
    objective: "세계 경제 붕괴를 막고 영향력 80 이상을 확보하십시오."
  },
  cyrene: {
    name: "키레네 왕국", role: "자원 강국",
    desc: "에너지와 해협 접근권을 쥐고 있습니다. 모든 강대국이 당신의 선택을 주시합니다.",
    military: 55, economy: 70, influence: 58, trust: 52,
    objective: "주권을 지키면서 경제력 85 이상을 달성하십시오."
  },
  doran: {
    name: "도란 중립연합", role: "외교 강국",
    desc: "군사력은 약하지만 국제기구와 협상력을 활용할 수 있습니다.",
    military: 36, economy: 61, influence: 84, trust: 82,
    objective: "최종 라운드까지 직접 전쟁에 들어가지 않고 세계 긴장도를 낮추십시오."
  }
};

const WORLD_EVENTS = [
  {
    title: "유조선 피격",
    body: "아르덴 해협에서 국적 불명의 공격으로 유조선이 피격되었습니다. 책임을 주장하는 국가는 없습니다.",
    tension: 10
  },
  {
    title: "정체불명 문서 유출",
    body: "한 국가가 비밀 군사협정을 준비했다는 문서가 온라인에 공개되었습니다. 진위는 확인되지 않았습니다.",
    tension: 7
  },
  {
    title: "국제시장 급락",
    body: "전쟁 우려로 에너지와 금융시장이 동시에 흔들리고 있습니다. 경제적 압박이 외교 선택에 영향을 줍니다.",
    tension: 4
  },
  {
    title: "국제기구 긴급회의",
    body: "중립국들이 공동 중재안을 제시했습니다. 그러나 강대국들은 구속력 있는 합의를 꺼리고 있습니다.",
    tension: -6
  },
  {
    title: "미사일 오인 경보",
    body: "조기경보망이 미사일 발사 징후를 포착했지만 몇 분 뒤 오인 가능성이 제기되었습니다.",
    tension: 12
  }
];

const $ = (id) => document.getElementById(id);
const screens = ["setupScreen","lobbyScreen","gameScreen"];
let app, auth, db, user;
let roomCode = null;
let roomUnsub = null;
let me = null;

function showScreen(id) {
  screens.forEach(s => $(s).classList.toggle("active", s === id));
}
function toast(msg) {
  $("toast").textContent = msg;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 1800);
}
function safeName() {
  return ($("playerName").value.trim() || "익명 외교관").slice(0,18);
}
function makeRoomCode() {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  return Array.from({length:6}, () => chars[Math.floor(Math.random()*chars.length)]).join("");
}
function getNation(id) { return NATIONS[id] || null; }

async function bootstrap() {
  try {
    app = initializeApp(firebaseConfig);
    auth = getAuth(app);
    db = getDatabase(app);
    $("authStatus").textContent = "Firebase 연결 중";
    onAuthStateChanged(auth, (u) => {
      if (u) {
        user = u;
        $("authStatus").textContent = "온라인";
      }
    });
    await signInAnonymously(auth);
  } catch (err) {
    console.error(err);
    $("authStatus").textContent = "Firebase 설정 필요";
    toast("firebase-config.js를 먼저 설정해주세요.");
  }
}

async function createRoom() {
  if (!user) return toast("Firebase 연결을 확인해주세요.");
  const name = safeName();
  let code;
  for (let i=0;i<5;i++) {
    code = makeRoomCode();
    const snap = await get(ref(db, `rooms/${code}`));
    if (!snap.exists()) break;
  }
  roomCode = code;
  const now = Date.now();
  await set(ref(db, `rooms/${code}`), {
    meta: {
      hostUid: user.uid,
      status: "lobby",
      createdAt: now,
      scenario: "strait_crisis"
    },
    world: {
      round: 1,
      tension: 25,
      latestEvent: null
    },
    players: {
      [user.uid]: {
        name, nationId: "", joinedAt: now
      }
    },
    feed: {
      system0: {
        type: "system",
        text: `${name} 님이 협상장을 열었습니다.`,
        at: now
      }
    }
  });
  enterRoom();
}

async function joinRoom() {
  if (!user) return toast("Firebase 연결을 확인해주세요.");
  const code = $("roomCodeInput").value.trim().toUpperCase();
  if (!code) return toast("방 코드를 입력해주세요.");
  const snap = await get(ref(db, `rooms/${code}/meta`));
  if (!snap.exists()) return toast("존재하지 않는 방입니다.");
  roomCode = code;
  await set(ref(db, `rooms/${code}/players/${user.uid}`), {
    name: safeName(), nationId: "", joinedAt: Date.now()
  });
  await push(ref(db, `rooms/${code}/feed`), {
    type:"system", text:`${safeName()} 님이 협상장에 들어왔습니다.`, at:Date.now()
  });
  enterRoom();
}

function enterRoom() {
  $("roomBadge").textContent = `ROOM ${roomCode}`;
  $("roomBadge").classList.remove("hidden");
  showScreen("lobbyScreen");
  if (roomUnsub) roomUnsub();
  roomUnsub = onValue(ref(db, `rooms/${roomCode}`), renderRoom);
}

function renderRoom(snapshot) {
  const room = snapshot.val();
  if (!room || !user) return;
  me = room.players?.[user.uid] || null;

  if (room.meta.status === "lobby") {
    showScreen("lobbyScreen");
    renderLobby(room);
  } else {
    showScreen("gameScreen");
    renderGame(room);
  }
}

function renderLobby(room) {
  const players = room.players || {};
  const taken = new Map();
  Object.entries(players).forEach(([uid,p]) => {
    if (p.nationId) taken.set(p.nationId, uid);
  });

  $("nationCards").innerHTML = Object.entries(NATIONS).map(([id,n]) => {
    const owner = taken.get(id);
    const isMine = owner === user.uid;
    const unavailable = owner && !isMine;
    return `
      <div class="nation ${isMine ? "selected":""} ${unavailable ? "taken":""}">
        <p class="eyebrow">${n.role}</p>
        <h3>${n.name}</h3>
        <p class="hint">${n.desc}</p>
        <div class="stats">
          <span>군사력 ${n.military}</span><span>경제력 ${n.economy}</span>
          <span>영향력 ${n.influence}</span><span>신뢰도 ${n.trust}</span>
        </div>
        <button ${unavailable ? "disabled":""} data-nation="${id}">
          ${isMine ? "선택됨" : unavailable ? "다른 플레이어가 선택" : "이 국가 선택"}
        </button>
      </div>
    `;
  }).join("");

  document.querySelectorAll("[data-nation]").forEach(btn => {
    btn.addEventListener("click", () => claimNation(btn.dataset.nation));
  });

  $("lobbyPlayers").innerHTML = Object.entries(players).map(([uid,p]) => `
    <div class="player-row">
      <strong>${escapeHtml(p.name)}</strong>
      <div class="hint">${p.nationId ? getNation(p.nationId)?.name : "국가 선택 중"} ${uid===room.meta.hostUid ? "· 방장":""}</div>
    </div>
  `).join("");

  const isHost = room.meta.hostUid === user.uid;
  $("startGameBtn").classList.toggle("hidden", !isHost);
  $("hostNotice").classList.toggle("hidden", isHost);

  const playerCount = Object.keys(players).length;
  const selectedCount = Object.values(players).filter(p => p.nationId).length;
  $("startGameBtn").disabled = selectedCount < 2 || selectedCount !== playerCount;
  $("startGameBtn").textContent = selectedCount < 2 ? "최소 2명 필요" : "게임 시작";
}

async function claimNation(nationId) {
  const roomRef = ref(db, `rooms/${roomCode}`);
  const result = await runTransaction(roomRef, room => {
    if (!room || room.meta.status !== "lobby") return room;
    room.players = room.players || {};
    const occupied = Object.entries(room.players).some(([uid,p]) => uid !== user.uid && p.nationId === nationId);
    if (occupied) return;
    room.players[user.uid].nationId = nationId;
    return room;
  });
  if (!result.committed) toast("이미 선택된 국가입니다.");
}

async function startGame() {
  const roomSnap = await get(ref(db, `rooms/${roomCode}`));
  const room = roomSnap.val();
  if (!room || room.meta.hostUid !== user.uid) return;
  const ps = Object.values(room.players || {});
  if (ps.length < 2 || ps.some(p => !p.nationId)) return toast("모든 플레이어가 국가를 선택해야 합니다.");

  const nationState = {};
  ps.forEach(p => {
    const n = getNation(p.nationId);
    nationState[p.nationId] = {
      military:n.military, economy:n.economy, influence:n.influence, trust:n.trust,
      atWarWith:{}
    };
  });

  await update(ref(db, `rooms/${roomCode}`), {
    "meta/status":"playing",
    "world/round":1,
    "world/tension":25,
    nationState
  });

  await push(ref(db, `rooms/${roomCode}/feed`), {
    type:"system",
    text:"아르덴 해협 위기가 시작되었습니다. 이제부터 각국의 행동이 역사를 만듭니다.",
    at:Date.now()
  });
}

function renderGame(room) {
  const players = room.players || {};
  const mine = players[user.uid];
  if (!mine?.nationId) return;

  const myN = getNation(mine.nationId);
  const myState = room.nationState?.[mine.nationId] || myN;
  $("roundValue").textContent = room.world?.round || 1;
  const tension = Math.max(0, Math.min(100, room.world?.tension ?? 25));
  $("tensionValue").textContent = tension;
  $("tensionBar").style.width = `${tension}%`;
  $("trustValue").textContent = myState.trust ?? myN.trust;
  $("influenceValue").textContent = myState.influence ?? myN.influence;
  $("militaryValue").textContent = myState.military ?? myN.military;
  $("economyValue").textContent = myState.economy ?? myN.economy;

  $("myNationCard").innerHTML = `
    <p class="eyebrow">${myN.role}</p>
    <h2>${myN.name}</h2>
    <p class="hint">${myN.objective}</p>
  `;

  const options = Object.entries(players)
    .filter(([uid,p]) => uid !== user.uid && p.nationId)
    .map(([uid,p]) => `<option value="${p.nationId}">${getNation(p.nationId).name} — ${escapeHtml(p.name)}</option>`)
    .join("");
  ["publicTarget","privateTarget","militaryTarget"].forEach(id => $(id).innerHTML = options || `<option value="">대상 없음</option>`);

  const states = room.nationState || {};
  $("worldStates").innerHTML = Object.values(players).filter(p=>p.nationId).map(p => {
    const n = getNation(p.nationId);
    const s = states[p.nationId] || n;
    const wars = Object.keys(s.atWarWith || {}).filter(k => s.atWarWith[k]).map(k=>getNation(k)?.name).join(", ");
    return `
      <div class="world-state">
        <div class="state-head"><strong>${n.name}</strong><span>${escapeHtml(p.name)}</span></div>
        <div class="state-sub">군 ${s.military} · 경제 ${s.economy} · 영향 ${s.influence} · 신뢰 ${s.trust}</div>
        ${wars ? `<div class="state-sub">⚔ 전쟁 중: ${wars}</div>`:""}
      </div>
    `;
  }).join("");

  renderFeed(room.feed || {});
  renderPrivate(room.privateMessages || {}, mine.nationId);

  const ev = room.world?.latestEvent;
  $("latestEvent").classList.toggle("hidden", !ev);
  if (ev) $("latestEvent").innerHTML = `<strong>긴급 속보 · ${escapeHtml(ev.title)}</strong><br>${escapeHtml(ev.body)}`;

  const isHost = room.meta.hostUid === user.uid;
  $("hostControls").classList.toggle("hidden", !isHost);
}

function renderFeed(feedObj) {
  const arr = Object.values(feedObj).sort((a,b)=>(a.at||0)-(b.at||0));
  $("worldFeed").innerHTML = arr.slice(-80).map(item => {
    const cls = item.type === "war" || item.type === "sanction" ? "danger" : item.type === "aid" || item.type === "treaty" ? "good" : "";
    return `
      <div class="feed-item ${cls}">
        <div class="feed-meta">ROUND ${item.round || "-"} · ${escapeHtml(item.typeLabel || "SYSTEM")}</div>
        <div>${escapeHtml(item.text || "")}</div>
      </div>
    `;
  }).join("");
}

function renderPrivate(messages, myNationId) {
  const arr = Object.values(messages)
    .filter(m => m.from === myNationId || m.to === myNationId)
    .sort((a,b)=>(a.at||0)-(b.at||0));
  $("privateInbox").innerHTML = arr.slice(-30).map(m => `
    <div class="private-msg">
      <div class="feed-meta">${getNation(m.from)?.name} → ${getNation(m.to)?.name}</div>
      ${escapeHtml(m.text)}
    </div>
  `).join("");
}

async function doPublicAction(action) {
  const target = $("publicTarget").value;
  const text = $("publicMessage").value.trim();
  if (!target) return toast("대상 국가가 없습니다.");
  const roomSnap = await get(ref(db, `rooms/${roomCode}`));
  const room = roomSnap.val();
  const mine = room.players[user.uid];
  const from = mine.nationId;
  const fromName = getNation(from).name;
  const toName = getNation(target).name;
  const round = room.world.round || 1;

  let label, feedText, tensionDelta = 0;
  const updates = {};
  if (action === "statement") {
    label = "공식 성명";
    feedText = `${fromName}: “${text || "국제사회에 자제를 촉구한다."}”`;
  } else if (action === "treaty") {
    label = "협정 제안";
    feedText = `${fromName}이(가) ${toName}에 협정을 제안했다. ${text ? `조건: “${text}”` : ""}`;
    tensionDelta = -2;
    updates[`nationState/${from}/trust`] = Math.min(100,(room.nationState[from].trust||0)+2);
  } else if (action === "aid") {
    label = "경제 원조";
    feedText = `${fromName}이(가) ${toName}에 경제 원조를 제공했다. ${text || ""}`;
    updates[`nationState/${from}/economy`] = Math.max(0,(room.nationState[from].economy||0)-4);
    updates[`nationState/${target}/economy`] = Math.min(100,(room.nationState[target].economy||0)+5);
    updates[`nationState/${from}/influence`] = Math.min(100,(room.nationState[from].influence||0)+3);
    tensionDelta = -1;
  } else if (action === "sanction") {
    label = "제재";
    feedText = `${fromName}이(가) ${toName}에 경제 제재를 발표했다. ${text || ""}`;
    updates[`nationState/${target}/economy`] = Math.max(0,(room.nationState[target].economy||0)-5);
    updates[`nationState/${from}/trust`] = Math.max(0,(room.nationState[from].trust||0)-2);
    tensionDelta = 5;
  }

  if (tensionDelta) updates["world/tension"] = Math.max(0,Math.min(100,(room.world.tension||0)+tensionDelta));
  await update(ref(db, `rooms/${roomCode}`), updates);
  await push(ref(db, `rooms/${roomCode}/feed`), {
    type:action, typeLabel:label, text:feedText, round, at:Date.now()
  });
  $("publicMessage").value = "";
}

async function sendPrivate() {
  const target = $("privateTarget").value;
  const text = $("privateMessage").value.trim();
  if (!target || !text) return toast("대상과 메시지를 입력해주세요.");
  const roomSnap = await get(ref(db, `rooms/${roomCode}`));
  const mine = roomSnap.val().players[user.uid];
  await push(ref(db, `rooms/${roomCode}/privateMessages`), {
    from: mine.nationId, to: target, text, at:Date.now()
  });
  $("privateMessage").value = "";
  toast("암호 전문을 전송했습니다.");
}

async function doMilitary(action) {
  const target = $("militaryTarget").value;
  if (!target) return toast("대상 국가가 없습니다.");
  const snap = await get(ref(db, `rooms/${roomCode}`));
  const room = snap.val();
  const mine = room.players[user.uid];
  const from = mine.nationId;
  const fromName = getNation(from).name;
  const toName = getNation(target).name;
  const round = room.world.round || 1;
  const updates = {};
  let text, label, delta;

  if (action === "deploy") {
    label = "군사 배치";
    text = `${fromName}이(가) ${toName} 방향 국경에 병력을 증강 배치했다.`;
    delta = 7;
    updates[`nationState/${from}/military`] = Math.min(100,(room.nationState[from].military||0)+2);
    updates[`nationState/${from}/trust`] = Math.max(0,(room.nationState[from].trust||0)-3);
  } else if (action === "warning") {
    label = "최후통첩";
    text = `${fromName}이(가) ${toName}에 공개 최후통첩을 보냈다.`;
    delta = 9;
    updates[`nationState/${from}/influence`] = Math.min(100,(room.nationState[from].influence||0)+1);
    updates[`nationState/${from}/trust`] = Math.max(0,(room.nationState[from].trust||0)-5);
  } else {
    label = "전쟁 선포";
    text = `⚠ ${fromName}이(가) ${toName}에 전쟁을 선포했다. 이제 다른 국가들의 선택이 전쟁의 규모를 결정한다.`;
    delta = 20;
    updates[`nationState/${from}/atWarWith/${target}`] = true;
    updates[`nationState/${target}/atWarWith/${from}`] = true;
    updates[`nationState/${from}/trust`] = Math.max(0,(room.nationState[from].trust||0)-12);
  }
  updates["world/tension"] = Math.max(0,Math.min(100,(room.world.tension||0)+delta));
  await update(ref(db, `rooms/${roomCode}`), updates);
  await push(ref(db, `rooms/${roomCode}/feed`), {
    type:action === "war" ? "war" : "military", typeLabel:label, text, round, at:Date.now()
  });
}

async function nextRound() {
  const snap = await get(ref(db, `rooms/${roomCode}`));
  const room = snap.val();
  if (room.meta.hostUid !== user.uid) return;
  const next = (room.world.round || 1) + 1;
  await update(ref(db, `rooms/${roomCode}`), {
    "world/round": next,
    "world/latestEvent": null
  });
  await push(ref(db, `rooms/${roomCode}/feed`), {
    type:"system", typeLabel:"새 라운드",
    text:`ROUND ${next}. 이전 라운드의 약속과 위협은 여전히 유효합니다.`,
    round:next, at:Date.now()
  });
}

async function drawEvent() {
  const snap = await get(ref(db, `rooms/${roomCode}`));
  const room = snap.val();
  if (room.meta.hostUid !== user.uid) return;
  const event = WORLD_EVENTS[Math.floor(Math.random()*WORLD_EVENTS.length)];
  const tension = Math.max(0,Math.min(100,(room.world.tension||0)+event.tension));
  await update(ref(db, `rooms/${roomCode}`), {
    "world/tension":tension,
    "world/latestEvent":{...event, at:Date.now()}
  });
  await push(ref(db, `rooms/${roomCode}/feed`), {
    type:"event", typeLabel:"긴급 속보",
    text:`${event.title} — ${event.body}`,
    round:room.world.round||1, at:Date.now()
  });
}

function escapeHtml(value="") {
  return String(value)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

// UI events
$("createRoomBtn").addEventListener("click", createRoom);
$("joinRoomBtn").addEventListener("click", joinRoom);
$("startGameBtn").addEventListener("click", startGame);
$("copyCodeBtn").addEventListener("click", async () => {
  await navigator.clipboard.writeText(roomCode);
  toast(`방 코드 ${roomCode} 복사됨`);
});
$("sendPrivateBtn").addEventListener("click", sendPrivate);
$("nextRoundBtn").addEventListener("click", nextRound);
$("drawEventBtn").addEventListener("click", drawEvent);

document.querySelectorAll(".tab").forEach(btn => btn.addEventListener("click", () => {
  document.querySelectorAll(".tab").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  $(`${btn.dataset.tab}Tab`).classList.add("active");
}));

document.querySelectorAll("[data-action]").forEach(btn => btn.addEventListener("click", () => {
  const action = btn.dataset.action;
  if (["statement","treaty","aid","sanction"].includes(action)) doPublicAction(action);
  else doMilitary(action);
}));

bootstrap();
