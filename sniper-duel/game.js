(function () {
  "use strict";
  var $ = function (id) { return document.getElementById(id); };
  var ui = {
    lobby:$("lobbyScreen"), game:$("gameScreen"), canvas:$("gameCanvas"),
    name:$("playerName"), role:$("hostRole"), create:$("createRoomBtn"), join:$("joinRoomBtn"),
    joinCode:$("joinCode"), roomPanel:$("roomPanel"), roomCode:$("roomCode"),
    roomStatus:$("roomStatus"), roomHelp:$("roomHelp"), start:$("startMatchBtn"),
    copy:$("copyCodeBtn"), status:$("lobbyStatus"), timer:$("timerText"),
    roleDot:$("roleDot"), roleText:$("roleText"), objective:$("objectiveText"),
    event:$("eventText"), crosshair:$("crosshair"), suppression:$("suppressionFX"),
    toast:$("toast"), stance:$("stanceBtn"), stanceText:$("stanceBtnText"),
    aim:$("aimBtn"), aimText:$("aimBtnText"), fire:$("fireBtn"), fireText:$("fireBtnText"),
    suppress:$("suppressBtn"), leave:$("leaveBtn"), result:$("resultOverlay"),
    resultTitle:$("resultTitle"), resultReason:$("resultReason"), resultRole:$("resultRole"),
    rematch:$("rematchBtn"), error:$("errorOverlay"), errorBack:$("errorBackBtn"),
    wordmark:$("gameWordmark")
  };
  var LABEL = { attacker:"공격자", defender:"수비자" };
  var OTHER = { attacker:"defender", defender:"attacker" };
  var ROUND = 90, SHOT_WAIT = 2800, SUPPRESS_WAIT = 7000, SUPPRESS_TIME = 1900, SCALE = 5.2;
  var peer = null, conn = null, isHost = false, localRole = null, remoteRole = null;
  var roomCode = "", localName = "플레이어", remoteName = "상대";
  var connected = false, remoteReady = false, gameStarted = false, matchEnded = false;
  var endsAt = 0, nextShotAt = { attacker:0, defender:0 }, nextSuppressAt = 0, suppressionUntil = 0;
  var lastSnapshot = 0, lastInputSend = 0, toastUntil = 0, lastEvent = "창가를 따라 이동하세요.";
  var scene = null, renderer = null, camera = null, raycaster = null, targetRing = null;
  var localAvatar = null, remoteAvatar = null, targetHitbox = null, lightFlash = null;
  var tracers = [], sparks = [], jitterX = 0, jitterY = 0, nextJitter = 0, clock = 0, lastFrame = 0;
  var blank = function () { return { pos:0, standing:false, aiming:false, aimX:0, aimY:0 }; };
  var localInput = blank(), remoteInput = blank();
  var states = { attacker:blank(), defender:blank() };

  function other(role) { return OTHER[role] || "defender"; }
  function cleanName(name) { return String(name || "").trim().replace(/[<>]/g, "").slice(0,16) || "플레이어"; }
  function roomCode6() {
    var chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789", out = "";
    for (var i=0;i<6;i++) out += chars[Math.floor(Math.random()*chars.length)];
    return out;
  }
  function status(message, error) {
    ui.status.textContent = message;
    ui.status.classList.toggle("is-error", !!error);
  }
  function roomStatus(message) { ui.roomStatus.textContent = message; ui.roomHelp.textContent = message; }
  function send(data) {
    try { if (conn && conn.open) conn.send(data); } catch (e) { console.warn("Send failed", e); }
  }
  function showToast(message, ms) {
    ui.toast.textContent = message; ui.toast.classList.add("visible");
    toastUntil = performance.now() + (ms || 1500);
  }
  function sanitize(input) {
    input = input || {};
    return {
      pos:Math.max(-1,Math.min(1,Number(input.pos)||0)),
      standing:!!input.standing, aiming:!!input.aiming && !!input.standing,
      aimX:Math.max(-.96,Math.min(.96,Number(input.aimX)||0)),
      aimY:Math.max(-.96,Math.min(.96,Number(input.aimY)||0))
    };
  }
  function setRole(role) {
    localRole = role; remoteRole = other(role);
    ui.roleText.textContent = LABEL[role];
    ui.roleDot.classList.toggle("attacker-mark", role === "attacker");
    ui.roleDot.classList.toggle("defender-mark", role === "defender");
    ui.objective.textContent = role === "attacker" ? "표적 또는 상대 명중" : "90초 버티기 또는 공격자 명중";
    ui.suppress.hidden = role !== "defender";
  }
  function sendInput(force) {
    var now = performance.now();
    if (!force && now-lastInputSend < 65) return;
    lastInputSend = now;
    if (conn && conn.open && gameStarted) send({type:"input",input:sanitize(localInput)});
  }
  function setInput(values, force) {
    localInput = sanitize(Object.assign({},localInput,values));
    if (localRole) states[localRole] = localInput;
    updateButtons(); placeCrosshair();
    if (force !== false) sendInput(true);
  }
  function updateButtons() {
    ui.stanceText.textContent = localInput.standing ? "몸 낮추기" : "창가에 서기";
    ui.aimText.textContent = localInput.aiming ? "조준 해제" : "조준하기";
    ui.aim.disabled = !localInput.standing || matchEnded;
    ui.fire.disabled = !localInput.standing || !localInput.aiming || matchEnded || !gameStarted;
    ui.crosshair.classList.toggle("active", !!(localInput.aiming && gameStarted && !matchEnded));
    ui.suppress.hidden = localRole !== "defender";
    document.body.classList.toggle("aiming-mode", !!localInput.aiming);
  }
  function placeCrosshair() {
    ui.crosshair.style.left = ((localInput.aimX+1)*50) + "%";
    ui.crosshair.style.top = ((1-localInput.aimY)*50) + "%";
  }
  function getStates() {
    if (localRole) states[localRole] = sanitize(localInput);
    if (isHost && remoteRole) states[remoteRole] = sanitize(remoteInput);
    return states;
  }

  function createRoom() {
    if (peer) return;
    isHost = true; localName = cleanName(ui.name.value);
    setRole(ui.role.value === "defender" ? "defender" : "attacker");
    ui.create.disabled = ui.join.disabled = true; status("온라인 연결을 준비하고 있습니다…");
    roomCode = roomCode6();
    try {
      peer = new Peer("wl-" + roomCode.toLowerCase(), {debug:0});
      peer.on("open", function () {
        ui.roomPanel.hidden = false; ui.roomCode.textContent = roomCode;
        ui.start.disabled = true; ui.start.textContent = "상대 접속 후 시작";
        roomStatus("상대 플레이어를 기다리는 중");
        status("방이 생성됐습니다. 코드를 친구에게 공유하세요.");
      });
      peer.on("connection", function (incoming) {
        if (conn && conn.open) { incoming.on("open",function(){incoming.send({type:"busy"});}); setTimeout(function(){incoming.close();},300); return; }
        attach(incoming,true);
      });
      peer.on("error", function (err) {
        console.warn(err);
        if (err.type === "unavailable-id") { status("방 코드가 겹쳤습니다. 방 만들기를 다시 눌러 주세요.",true); try { if (peer && !peer.destroyed) peer.destroy(); } catch(e) {} peer=null; isHost=false; ui.create.disabled=ui.join.disabled=false; return; }
        else if (err.type === "network" || err.type === "server-error") status("온라인 연결 서버에 접속할 수 없습니다. 잠시 후 다시 시도하세요.",true);
        else status("연결 오류: " + (err.message || err.type || "알 수 없는 오류"),true);
        if (!connected) { ui.create.disabled = ui.join.disabled = false; }
      });
      peer.on("disconnected", function () { if (peer && !peer.destroyed) { try { peer.reconnect(); } catch(e) {} } });
    } catch (err) {
      status(err.message || "온라인 연결을 시작하지 못했습니다.",true);
      cleanup(); isHost=false; ui.create.disabled=ui.join.disabled=false;
    }
  }
  function joinRoom() {
    if (peer) return;
    localName = cleanName(ui.name.value);
    roomCode = ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);
    if (roomCode.length !== 6) { status("6자리 방 코드를 입력하세요.",true); return; }
    isHost=false; ui.create.disabled=ui.join.disabled=true; status("방을 찾는 중입니다…");
    try {
      peer = new Peer({debug:0});
      peer.on("open", function () {
        conn = peer.connect("wl-" + roomCode.toLowerCase(), {reliable:true,serialization:"json"});
        attach(conn,false);
      });
      peer.on("error", function (err) {
        console.warn(err);
        if (err.type === "peer-unavailable") status("해당 방을 찾지 못했습니다. 코드를 확인해 주세요.",true);
        else status("연결 오류: " + (err.message || err.type),true);
        ui.create.disabled=ui.join.disabled=false;
      });
      peer.on("disconnected", function () { if (peer && !peer.destroyed) { try { peer.reconnect(); } catch(e) {} } });
    } catch (err) { status(err.message || "방에 참가하지 못했습니다.",true); cleanup(); ui.create.disabled=ui.join.disabled=false; }
  }
  function attach(connection, hosting) {
    conn = connection;
    conn.on("open", function () {
      connected = true;
      if (hosting) {
        roomStatus("상대 연결 완료 · 작전을 시작할 수 있습니다");
        ui.start.disabled = false; ui.start.textContent = "작전 시작";
        send({type:"welcome",role:localRole,hostName:localName,roomCode:roomCode});
      } else {
        status("방에 연결됐습니다. 상대의 준비를 확인하는 중…");
        send({type:"ready",name:localName});
      }
    });
    conn.on("data", function (data) { onMessage(data,hosting); });
    conn.on("close", function () {
      connected=false;
      if (gameStarted && !matchEnded) finish(localRole,"상대의 연결이 끊겨 작전이 종료되었습니다.",true);
      else { roomStatus("연결이 끊겼습니다. 새로고침 후 다시 시도해 주세요."); status("온라인 연결이 끊겼습니다.",true); ui.start.disabled=true; }
    });
    conn.on("error", function (err) { console.warn(err); status("상대와의 연결에 문제가 생겼습니다.",true); });
  }
  function onMessage(data, hosting) {
    if (!data || typeof data !== "object") return;
    if (data.type === "busy") { status("이 방에는 이미 플레이어가 있습니다.",true); return; }
    if (data.type === "welcome" && !hosting) {
      setRole(other(data.role)); remoteName=cleanName(data.hostName);
      ui.roomPanel.hidden=false; ui.roomCode.textContent=roomCode;
      roomStatus(remoteName + "의 방에 연결됨 · " + LABEL[localRole] + " 역할");
      status("연결 완료. 방장이 시작하면 대전이 시작됩니다."); return;
    }
    if (data.type === "ready" && hosting) {
      remoteName=cleanName(data.name); remoteReady=true; ui.start.disabled=false;
      ui.start.textContent="작전 시작"; roomStatus(remoteName+" 접속 완료 · 작전을 시작할 수 있습니다"); return;
    }
    if (data.type === "input" && hosting && data.input && remoteRole) {
      remoteInput=sanitize(data.input); states[remoteRole]=remoteInput; return;
    }
    if (data.type === "start" && !hosting) { startGuest(data); return; }
    if (data.type === "snapshot" && !hosting) { applySnapshot(data); return; }
    if (data.type === "shoot" && hosting && gameStarted && !matchEnded && remoteRole) {
      handleShot(remoteRole,Number(data.aimX)||0,Number(data.aimY)||0,Number(data.aspect)||0); return;
    }
    if (data.type === "suppress" && hosting && gameStarted && !matchEnded && remoteRole==="defender") { handleSuppress(remoteRole); return; }
    if (data.type === "event" && !hosting && typeof data.message==="string") { setEvent(data.message,false); return; }
    if (data.type === "end" && !hosting && !matchEnded) { finish(data.winner,data.reason,false); return; }
  }
  function startHost() {
    if (!isHost || !connected || !remoteReady || gameStarted) return;
    states={attacker:blank(),defender:blank()}; localInput=blank(); remoteInput=blank();
    states[localRole]=localInput; states[remoteRole]=remoteInput;
    nextShotAt={attacker:0,defender:0}; nextSuppressAt=0; suppressionUntil=0;
    endsAt=Date.now()+ROUND*1000; gameStarted=true; matchEnded=false;
    ui.lobby.hidden=true; ui.game.hidden=false; ui.result.hidden=true; ui.error.hidden=true;
    setupThree(); updateButtons(); setEvent("작전 시작. 창가를 따라 이동하세요.",false);
    send({type:"start",role:localRole,inputs:states,endsAt:endsAt,hostName:localName,guestName:remoteName});
    showToast("작전 개시 — 90초",2200); updateHud();
  }
  function startGuest(data) {
    if (gameStarted) return;
    if (!localRole) setRole(other(data.role || "attacker"));
    gameStarted=true; matchEnded=false; endsAt=Number(data.endsAt)||(Date.now()+ROUND*1000);
    states={attacker:sanitize(data.inputs && data.inputs.attacker),defender:sanitize(data.inputs && data.inputs.defender)};
    localInput=blank(); states[localRole]=localInput; remoteInput=sanitize(data.inputs && data.inputs[remoteRole]);
    remoteName=cleanName(data.hostName); ui.lobby.hidden=true; ui.game.hidden=false;
    ui.result.hidden=true; ui.error.hidden=true; setupThree(); updateButtons();
    showToast("작전 개시 — 90초",2200); sendInput(true); updateHud();
  }
  function applySnapshot(data) {
    if (!gameStarted || matchEnded) return;
    if (data.inputs && remoteRole) states[remoteRole]=sanitize(data.inputs[remoteRole]);
    if (data.shotAt) nextShotAt=Object.assign(nextShotAt,data.shotAt);
    if (Number.isFinite(data.suppressionUntil)) suppressionUntil=data.suppressionUntil;
    if (Number.isFinite(data.nextSuppressAt) && localRole==="defender") nextSuppressAt=data.nextSuppressAt;
    if (typeof data.event==="string" && data.event!==lastEvent) setEvent(data.event,false);
    if (data.winner && !matchEnded) finish(data.winner,data.reason||"작전 종료",false);
    updateHud(Number.isFinite(data.timeLeft)?data.timeLeft:undefined);
  }
  function updateHost(now) {
    if (!isHost || !gameStarted || matchEnded) return;
    if (now>=endsAt) { finish("defender","제한 시간 동안 공격자가 표적을 명중하지 못했습니다.",true); return; }
    if (now>=lastSnapshot && conn && conn.open) {
      lastSnapshot=now+85;
      send({type:"snapshot",inputs:getStates(),timeLeft:Math.max(0,Math.ceil((endsAt-now)/1000)),
        shotAt:nextShotAt,suppressionUntil:suppressionUntil,nextSuppressAt:nextSuppressAt,event:lastEvent});
    }
  }
  function handleShot(role, aimX, aimY, aspect) {
    if (!isHost || !gameStarted || matchEnded) return;
    var s=getStates()[role], now=Date.now();
    if (!s || !s.standing || !s.aiming) { if(role===localRole)showToast("창가에 서서 조준해야 발사할 수 있습니다."); return; }
    if (now<(nextShotAt[role]||0)) { if(role===localRole)showToast("사격 준비 중 · "+((nextShotAt[role]-now)/1000).toFixed(1)+"초"); return; }
    nextShotAt[role]=now+SHOT_WAIT;
    var hit=traceShot(role,aimX,aimY,aspect);
    if (hit==="opponent") {
      shotVisual(role,true,hit); if(role===localRole)showToast("명중! 상대를 맞혔습니다.",900);
      finish(role,LABEL[role]+"가 상대를 명중했습니다.",true); return;
    }
    if (hit==="target" && role==="attacker") {
      shotVisual(role,true,hit); if(role===localRole)showToast("표적 명중!",900);
      finish("attacker","공격자가 제한 시간 안에 중앙 표적을 명중했습니다.",true); return;
    }
    shotVisual(role,hit==="target",hit);
    var msg=hit==="target"?"표적에 탄흔이 남았습니다.":"빗나갔습니다. 다음 사격을 준비하세요.";
    setEvent(msg,true);
    if(role===localRole)showToast(hit==="target"?"표적 명중! 공격자의 목표로만 인정됩니다.":"빗나갔습니다. 위치를 다시 잡으세요.",1400);
  }
  function handleSuppress(role) {
    if (!isHost || !gameStarted || matchEnded || role!=="defender") return;
    var now=Date.now();
    if(now<nextSuppressAt) { if(role===localRole)showToast("견제 대기 · "+((nextSuppressAt-now)/1000).toFixed(1)+"초"); return; }
    nextSuppressAt=now+SUPPRESS_WAIT; suppressionUntil=now+SUPPRESS_TIME;
    setEvent("수비자의 견제 사격! 공격자의 조준이 흔들립니다.",true);
    if(role===localRole)showToast("견제 사격! 공격자의 조준을 흔듭니다.");
  }
  function finish(winner, reason, broadcast) {
    if(matchEnded)return;
    matchEnded=true; localInput.aiming=false; updateButtons();
    ui.result.hidden=false; ui.resultTitle.textContent=winner===localRole?"작전 성공":"작전 실패";
    ui.resultReason.textContent=reason||"작전이 종료되었습니다.";
    ui.resultRole.textContent="승리: "+(LABEL[winner]||"알 수 없음");
    if(broadcast && isHost)send({type:"end",winner:winner,reason:reason||"작전 종료"});
    setEvent(reason||"작전 종료",false); updateHud(0);
  }
  function setEvent(message, broadcast) {
    lastEvent=message; ui.event.textContent=message;
    if(broadcast && isHost && conn && conn.open && gameStarted)send({type:"event",message:message});
  }
  function updateHud(time) {
    if(!gameStarted)return;
    var left=Number.isFinite(time)?Math.max(0,time):Math.max(0,Math.ceil((endsAt-Date.now())/1000));
    ui.timer.textContent=String(Math.floor(left/60)).padStart(2,"0")+":"+String(left%60).padStart(2,"0");
    var s=(getStates()[localRole]||localInput), now=Date.now();
    if(!matchEnded) {
      if(!s.standing)ui.objective.textContent="창가를 따라 낮게 이동";
      else if(!s.aiming)ui.objective.textContent="조준 버튼으로 줌인";
      else if(now<(nextShotAt[localRole]||0))ui.objective.textContent="사격 준비 "+((nextShotAt[localRole]-now)/1000).toFixed(1)+"초";
      else ui.objective.textContent=localRole==="attacker"?"표적 또는 상대 명중":"공격자를 맞히거나 시간 버티기";
    }
    if(localRole==="defender") {
      var sup=nextSuppressAt-now;
      ui.suppress.disabled=!gameStarted||matchEnded||sup>0;
      ui.suppress.innerHTML='<span class="action-icon">≋</span><span>'+(sup>0?"견제 "+Math.ceil(sup/1000)+"초":"견제 사격")+'</span><kbd>Q</kbd>';
    }
    var shot=nextShotAt[localRole]-now;
    ui.fireText.textContent=shot>0?(shot/1000).toFixed(1)+"초 대기":"발사";
    ui.fire.disabled=!localInput.standing||!localInput.aiming||matchEnded||!gameStarted||shot>0;
    ui.suppression.hidden=!(localRole==="attacker" && now<suppressionUntil);
  }

  function mat(color, opts) {
    opts=opts||{};
    return new THREE.MeshStandardMaterial({color:color,roughness:opts.roughness === undefined ? .78 : opts.roughness,
      metalness:opts.metalness === undefined ? .08 : opts.metalness,emissive:opts.emissive||0,
      emissiveIntensity:opts.emissiveIntensity||0,transparent:!!opts.transparent,opacity:opts.opacity === undefined ? 1 : opts.opacity,
      side:opts.side===undefined?THREE.FrontSide:opts.side});
  }
  function addBox(parent,x,y,z,sx,sy,sz,m) {
    var o=new THREE.Mesh(new THREE.BoxGeometry(sx,sy,sz),m);o.position.set(x,y,z);parent.add(o);return o;
  }
  function buildRoom() {
    var g=new THREE.Group();scene.add(g);
    var floor=mat(0x202938), wall=mat(0x293448), trim=mat(0x536277,{metalness:.32,roughness:.55});
    addBox(g,0,-.18,3.2,15,.35,12,floor);addBox(g,0,5.35,3.2,15,.22,12,wall);
    addBox(g,-7.3,2.55,3.3,.3,5.4,12,wall);addBox(g,7.3,2.55,3.3,.3,5.4,12,wall);
    addBox(g,0,2.6,9.1,15,5.4,.3,wall);
    addBox(g,0,.63,-.04,13.4,1.12,.26,wall);addBox(g,0,4.75,-.04,13.4,.34,.26,wall);
    addBox(g,-6.72,2.7,-.04,.34,4.1,.26,wall);addBox(g,6.72,2.7,-.04,.34,4.1,.26,wall);
    addBox(g,0,4.55,-.18,13.1,.08,.08,trim);addBox(g,0,1.2,-.17,13.1,.055,.08,trim);
    addBox(g,-3.3,2.9,-.22,.08,3.25,.08,trim);addBox(g,3.3,2.9,-.22,.08,3.25,.08,trim);
    var glass=new THREE.Mesh(new THREE.PlaneGeometry(13.05,3.2),new THREE.MeshStandardMaterial({color:0x6f9eb7,transparent:true,opacity:.055,roughness:.12,side:THREE.DoubleSide}));
    glass.position.set(0,2.9,-.35);g.add(glass);
    addBox(g,-4.4,.13,2.2,4.6,.09,.09,trim);addBox(g,4.4,.13,2.2,4.6,.09,.09,trim);
    var lamp=mat(0xffc58e,{emissive:0xffab64,emissiveIntensity:2.4,roughness:.3});
    addBox(g,-4.9,5.16,3.5,1.5,.06,.2,lamp);
  }
  function buildCity() {
    var base=mat(0x202d40,{roughness:.86,metalness:.16}), dark=mat(0x0d1728,{roughness:.5,metalness:.2});
    var steel=mat(0x4e627b,{roughness:.44,metalness:.65}), dim=mat(0x18293a,{emissive:0x0d2239,emissiveIntensity:.38});
    var lit=mat(0x25465b,{emissive:0x1b708b,emissiveIntensity:.9}), tower=new THREE.Group();scene.add(tower);
    addBox(tower,0,12,-30,18.2,25,1.2,base);
    addBox(tower,-6.5,2.65,-29.25,5,5.2,.13,dark);addBox(tower,6.5,2.65,-29.25,5,5.2,.13,dark);
    addBox(tower,0,.55,-29.25,8.1,.48,.14,steel);addBox(tower,0,4.9,-29.25,8.1,.4,.14,steel);
    addBox(tower,-4.1,2.7,-29.26,.16,4,.15,steel);addBox(tower,4.1,2.7,-29.26,.16,4,.15,steel);
    for(var r=0;r<9;r++){
      var y=5.9+r*2.25;
      for(var c=-4;c<=4;c++){
        var x=c*1.85;if(Math.abs(x)<5.2&&y<5.2)continue;
        addBox(tower,x,y,-29.32,.88,1.05,.07,Math.random()>.32?dim:lit);
      }
      addBox(tower,0,y-.72,-29.33,17.7,.07,.09,steel);
    }
    var colors=[0x172438,0x1b263a,0x202d43,0x121e30];
    for(var i=0;i<15;i++){
      var side=i%2===0?-1:1, bx=side*(13+Math.random()*28), z=-12-Math.random()*45;
      var w=4+Math.random()*9,h=9+Math.random()*32,d=4+Math.random()*7;
      addBox(scene,bx,h/2-1,z,w,h,d,mat(colors[i%colors.length],{roughness:.94}));
      for(var row=0;row<Math.min(8,Math.floor(h/3));row++){
        for(var col=0;col<2;col++){
          var win=addBox(scene,bx+(col?w*.22:-w*.22),1.7+row*3,z+d/2+.03,.35,.8,.04,Math.random()>.65?lit:dim);
        }
      }
    }
    var skyline=new THREE.Mesh(new THREE.PlaneGeometry(95,28),new THREE.MeshBasicMaterial({color:0x112039,transparent:true,opacity:.23,side:THREE.DoubleSide}));
    skyline.position.set(0,13,-52);scene.add(skyline);
  }
  function buildTarget() {
    var group=new THREE.Group();group.position.set(0,2.35,-17.2);scene.add(group);
    var red=mat(0xd84c45,{emissive:0x8c171b,emissiveIntensity:1.1,metalness:.38,roughness:.36});
    var glow=mat(0xff8e6f,{emissive:0xff382e,emissiveIntensity:2.2,metalness:.25,roughness:.22});
    var disc=new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,.12,32),red);disc.rotation.x=Math.PI/2;group.add(disc);
    targetRing=new THREE.Mesh(new THREE.TorusGeometry(.72,.045,8,48),glow);group.add(targetRing);
    var dot=new THREE.Mesh(new THREE.SphereGeometry(.11,16,16),glow);dot.position.z=.1;group.add(dot);
    var pole=new THREE.Mesh(new THREE.CylinderGeometry(.035,.035,1.3,8),mat(0x8c9eae,{metalness:.65}));pole.position.y=-.95;group.add(pole);
    targetHitbox=new THREE.Mesh(new THREE.SphereGeometry(.67,16,12),new THREE.MeshBasicMaterial({visible:false}));
    targetHitbox.position.copy(group.position);scene.add(targetHitbox);
  }
  function avatar(primary, secondary) {
    var group=new THREE.Group(), body=mat(primary), dark=mat(secondary), skin=mat(0x8b9aad), visor=mat(0x121d2a,{metalness:.4,roughness:.22,emissive:primary,emissiveIntensity:.28});
    var torso=addBox(group,0,1.02,-.015,.52,.65,.27,body);
    var head=new THREE.Mesh(new THREE.SphereGeometry(.2,16,12),skin);head.position.set(0,1.52,-.015);group.add(head);
    var helmet=new THREE.Mesh(new THREE.SphereGeometry(.225,16,10,0,Math.PI*2,0,Math.PI/1.7),dark);helmet.position.set(0,1.57,-.015);group.add(helmet);
    var face=addBox(group,0,1.52,-.125,.32,.085,.23,visor);
    var armL=addBox(group,-.34,1.04,-.02,.16,.5,.18,dark),armR=addBox(group,.34,1.04,-.03,.16,.5,.18,dark);
    var legL=addBox(group,-.16,.33,.02,.19,.48,.2,dark),legR=addBox(group,.16,.33,.02,.19,.48,.2,dark);
    var rifle=new THREE.Group(), gun=mat(0x1a202a,{roughness:.48,metalness:.62});
    addBox(rifle,0,0,-.2,.12,.1,.52,gun);
    var barrel=new THREE.Mesh(new THREE.CylinderGeometry(.026,.026,1.12,8),gun);barrel.rotation.x=Math.PI/2;barrel.position.z=-.72;rifle.add(barrel);
    var scope=new THREE.Mesh(new THREE.CylinderGeometry(.075,.075,.25,10),body);scope.rotation.x=Math.PI/2;scope.position.set(0,.09,-.28);rifle.add(scope);
    rifle.position.set(.18,1.18,-.32);group.add(rifle);
    var marker=new THREE.Mesh(new THREE.SphereGeometry(.055,10,8),mat(primary,{emissive:primary,emissiveIntensity:.7}));marker.position.set(0,1.93,-.02);group.add(marker);
    return {group:group,torso:torso,head:head,helmet:helmet,face:face,armL:armL,armR:armR,legL:legL,legR:legR,rifle:rifle,marker:marker};
  }
  function initThree() {
    scene=new THREE.Scene();scene.background=new THREE.Color(0x080d18);scene.fog=new THREE.Fog(0x080d18,38,125);
    renderer=new THREE.WebGLRenderer({canvas:ui.canvas,antialias:true,alpha:false,powerPreference:"high-performance"});
    renderer.setPixelRatio(Math.min(window.devicePixelRatio||1,1.6));renderer.setSize(window.innerWidth,window.innerHeight);
    renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
    camera=new THREE.PerspectiveCamera(61,window.innerWidth/window.innerHeight,.1,180);camera.position.set(0,2.8,7.5);
    raycaster=new THREE.Raycaster();
    scene.add(new THREE.HemisphereLight(0x9dbbdf,0x1c2432,1.65));
    var sun=new THREE.DirectionalLight(0xa8d7ff,2);sun.position.set(-12,18,8);scene.add(sun);
    var warm=new THREE.PointLight(0xff9e64,7,20);warm.position.set(3.5,4.2,1.7);scene.add(warm);
    var city=new THREE.PointLight(0x397bba,18,75);city.position.set(0,14,-19);scene.add(city);
    buildRoom();buildCity();buildTarget();
    localAvatar=avatar(0x77edda,0x183942);remoteAvatar=avatar(0xffb36d,0x4b2924);
    scene.add(localAvatar.group);scene.add(remoteAvatar.group);
    var lightMat=mat(0x8fd9f3,{emissive:0x4ba7d9,emissiveIntensity:2.1});
    for(var i=0;i<26;i++){
      var light=new THREE.Mesh(new THREE.SphereGeometry(.055,6,6),lightMat);
      light.position.set((Math.random()-.5)*80,1+Math.random()*17,-8-Math.random()*66);scene.add(light);
    }
    lightFlash=new THREE.PointLight(0xffa66d,0,7);scene.add(lightFlash);
    resize();if(!window.__windowlineRAF) { window.__windowlineRAF=true; animate(); }
  }
  function setupThree() {
    if(renderer && scene){renderer.setSize(window.innerWidth,window.innerHeight);return;}
    try{initThree();}catch(err){console.error("3D initialization",err);ui.error.hidden=false;}
  }
  function resize() {
    if(!renderer||!camera)return;
    renderer.setSize(window.innerWidth,window.innerHeight);
    camera.aspect=window.innerWidth/window.innerHeight;camera.updateProjectionMatrix();
  }
  function updateAvatars(dt) {
    var s=getStates(), me=s[localRole]||localInput, enemy=s[remoteRole]||remoteInput;
    function update(a,state,sign,z,own) {
      var x=state.pos*SCALE*sign;
      a.group.position.x+=(x-a.group.position.x)*Math.min(1,dt*7);a.group.position.z=z;
      var low=!state.standing,y=low?.55:0;a.group.position.y+=(y-a.group.position.y)*Math.min(1,dt*8);
      a.torso.scale.y=low ? .72 : 1;a.torso.position.y=low ? .65 : 1.02;
      a.head.position.y=low?1.03:1.52;a.helmet.position.y=low?1.08:1.57;a.face.position.y=low?1.03:1.52;
      a.armL.position.y=low ? .7 : 1.04;a.armR.position.y=low?.7:1.04;
      a.legL.position.y=low ? .25 : .33;a.legR.position.y=low?.25:.33;
      a.rifle.position.y=low ? .77 : 1.18;a.marker.position.y=low ? 1.42 : 1.93;
      a.group.rotation.y=own?0:Math.PI;
    }
    update(localAvatar,me,1,2.0,true);update(remoteAvatar,enemy,-1,-28.45,false);
    if(targetRing){targetRing.rotation.z+=dt*.42;targetRing.material.emissiveIntensity=1.7+Math.sin(clock*3)*.5;}
  }
  function updateCamera(dt) {
    var x=localInput.pos*SCALE, aim=localInput.aiming&&localInput.standing;
    var pose=aim?{p:new THREE.Vector3(x,1.82,2.45),look:new THREE.Vector3(x+(localRole==="attacker"&&Date.now()<suppressionUntil?jitterX*1.55:0),1.94+(localRole==="attacker"&&Date.now()<suppressionUntil?jitterY*1.15:0),-20),fov:25}
      :{p:new THREE.Vector3(x-2.6,localInput.standing?3.3:2.55,7.3),look:new THREE.Vector3(x,2.05,-17.5),fov:61};
    camera.position.lerp(pose.p,Math.min(1,dt*(aim?8:4)));
    var temp=new THREE.Object3D();temp.position.copy(camera.position);temp.lookAt(pose.look);camera.quaternion.slerp(temp.quaternion,Math.min(1,dt*(aim?9:4)));
    camera.fov+=(pose.fov-camera.fov)*Math.min(1,dt*6);camera.updateProjectionMatrix();
  }
  function traceShot(role, ax, ay, aspect) {
    if(!scene)return "none";
    var statesNow=getStates(),own=statesNow[role]||blank(), enemy=statesNow[other(role)]||blank();
    if(role==="attacker"&&Date.now()<suppressionUntil){ax+=(Math.random()-.5)*.72;ay+=(Math.random()-.5)*.5;}
    var c=new THREE.PerspectiveCamera(25,aspect>0?aspect:window.innerWidth/window.innerHeight,.1,180);
    c.position.set(own.pos*SCALE,1.82,2.45);c.lookAt(own.pos*SCALE,1.94,-20);c.updateMatrixWorld(true);c.updateProjectionMatrix();
    raycaster.setFromCamera(new THREE.Vector2(Math.max(-1,Math.min(1,ax)),Math.max(-1,Math.min(1,ay))),c);
    var tg=new THREE.Mesh(new THREE.SphereGeometry(.67,12,8),new THREE.MeshBasicMaterial());
    tg.position.set(0,2.35,-17.2);tg.userData.kind="target";
    var en=new THREE.Mesh(new THREE.SphereGeometry(.83,12,8),new THREE.MeshBasicMaterial());
    en.position.set(-enemy.pos*SCALE,enemy.standing?1.25:.7,-28.05);en.userData.kind="opponent";
    var hits=raycaster.intersectObjects([tg,en],false),result=hits.length?hits[0].object.userData.kind:"none";
    tg.geometry.dispose();tg.material.dispose();en.geometry.dispose();en.material.dispose();return result;
  }
  function shotVisual(role,hit,kind) {
    if(!scene)return;
    var s=getStates(),own=s[role]||blank(),enemy=s[other(role)]||blank();
    var start=new THREE.Vector3(own.pos*SCALE,own.standing?1.7:1.15,role===localRole?1.65:-28.1);
    var end=kind==="target"?new THREE.Vector3(0,2.35,-17.2):new THREE.Vector3(-enemy.pos*SCALE,enemy.standing?1.2:.7,role===localRole?-28.1:1.8);
    var line=new THREE.Line(new THREE.BufferGeometry().setFromPoints([start,end]),new THREE.LineBasicMaterial({color:role==="attacker"?0x8ff4e0:0xffb778,transparent:true,opacity:hit ? .95 : .54}));
    scene.add(line);tracers.push({o:line,t:performance.now()+210});
    var geo=new THREE.SphereGeometry(hit ? .13 : .065,8,8),m=new THREE.MeshBasicMaterial({color:hit?0xff765f:0xffb778}),spark=new THREE.Mesh(geo,m);
    spark.position.copy(end);scene.add(spark);sparks.push({o:spark,t:performance.now()+430,g:geo,m:m});
    if(lightFlash){lightFlash.intensity=hit?17:8;lightFlash.position.copy(start);}
    ui.game.classList.remove("hit-flash");void ui.game.offsetWidth;if(hit)ui.game.classList.add("hit-flash");
    setTimeout(function(){ui.game.classList.remove("hit-flash");},200);
  }
  function updateTransient(now) {
    tracers=tracers.filter(function(v){if(now<v.t)return true;scene.remove(v.o);v.o.geometry.dispose();v.o.material.dispose();return false;});
    sparks=sparks.filter(function(v){if(now<v.t){v.o.scale.setScalar(Math.max(.05,(v.t-now)/430));return true;}scene.remove(v.o);v.g.dispose();v.m.dispose();return false;});
    if(lightFlash)lightFlash.intensity=Math.max(0,lightFlash.intensity-.9);
  }
  function animate() {
    requestAnimationFrame(animate);if(!renderer||!scene||!camera||ui.game.hidden)return;
    var now=performance.now(),dt=Math.min(.05,Math.max(0,(now-lastFrame)/1000||.016));lastFrame=now;clock+=dt;
    updateHost(Date.now());
    if(gameStarted){
      if(localRole)states[localRole]=localInput;if(isHost&&remoteRole)states[remoteRole]=remoteInput;
      if(!isHost)sendInput(false);
      if(now>=nextJitter){
        nextJitter=now+36+Math.random()*24;
        if(localRole==="attacker"&&Date.now()<suppressionUntil){jitterX=(Math.random()-.5)*.24;jitterY=(Math.random()-.5)*.16;}
        else{jitterX*=.78;jitterY*=.78;}
      }
      updateAvatars(dt);updateCamera(dt);updateHud();
      ui.suppression.hidden=!(localRole==="attacker"&&Date.now()<suppressionUntil);
    }
    if(toastUntil&&now>toastUntil){ui.toast.classList.remove("visible");toastUntil=0;}
    updateTransient(now);renderer.render(scene,camera);
  }
  function fire() {
    if(!gameStarted||matchEnded||!localInput.standing||!localInput.aiming){showToast("창가에 서서 줌인 조준해야 발사할 수 있습니다.");return;}
    if(Date.now()<(nextShotAt[localRole]||0)){showToast("사격 준비 중 · "+((nextShotAt[localRole]-Date.now())/1000).toFixed(1)+"초");return;}
    if(isHost)handleShot(localRole,localInput.aimX,localInput.aimY);
    else{send({type:"input",input:sanitize(localInput)});send({type:"shoot",aimX:localInput.aimX,aimY:localInput.aimY,aspect:window.innerWidth/window.innerHeight});showToast("발사 요청 전송",500);}
  }
  function suppress() {
    if(localRole!=="defender"||!gameStarted||matchEnded)return;
    if(isHost)handleSuppress(localRole);else send({type:"suppress"});
  }
  function cleanup() {
    try{if(conn)conn.close();}catch(e){}try{if(peer&&!peer.destroyed)peer.destroy();}catch(e){}
    conn=null;peer=null;
  }
  function toLobby() {
    if(isHost&&conn&&conn.open)send({type:"end",winner:other(localRole),reason:"플레이어가 작전실로 나갔습니다."});
    gameStarted=false;matchEnded=false;localInput=blank();remoteInput=blank();states={attacker:blank(),defender:blank()};
    ui.result.hidden=true;ui.error.hidden=true;ui.game.hidden=true;ui.lobby.hidden=false;
    ui.create.disabled=false;ui.join.disabled=false;ui.start.disabled=true;ui.start.textContent="상대 접속 후 시작";
    ui.roomPanel.hidden=true;ui.roomCode.textContent="------";connected=false;remoteReady=false;isHost=false;localRole=null;remoteRole=null;
    cleanup();updateButtons();status("대기실로 돌아왔습니다. 새 작전실을 만들거나 방 코드로 참가하세요.");
  }

  ui.create.addEventListener("click",createRoom);
  ui.join.addEventListener("click",joinRoom);
  ui.start.addEventListener("click",startHost);
  ui.copy.addEventListener("click",function(){
    if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(roomCode).then(function(){ui.copy.textContent="복사 완료 ✓";setTimeout(function(){ui.copy.textContent="코드 복사";},1400);}).catch(function(){status("친구에게 이 코드를 알려 주세요: "+roomCode);});
    else status("친구에게 이 코드를 알려 주세요: "+roomCode);
  });
  ui.joinCode.addEventListener("input",function(){ui.joinCode.value=ui.joinCode.value.toUpperCase().replace(/[^A-Z0-9]/g,"").slice(0,6);});
  ui.stance.addEventListener("click",function(){
    if(!gameStarted||matchEnded)return;
    var stand=!localInput.standing;setInput({standing:stand,aiming:false});
    showToast(stand?"창가에 섰습니다. 조준할 수 있습니다.":"몸을 낮췄습니다. 벽을 따라 이동하세요.",1200);
  });
  ui.aim.addEventListener("click",function(){
    if(!gameStarted||matchEnded)return;if(!localInput.standing){showToast("먼저 창가에 서야 합니다.");return;}
    setInput({aiming:!localInput.aiming,aimX:localInput.aiming?localInput.aimX:0,aimY:localInput.aiming?localInput.aimY:0});
    if(localInput.aiming)showToast("조준 확대 · 마우스를 움직여 조준하세요.",1300);
  });
  ui.fire.addEventListener("click",fire);ui.suppress.addEventListener("click",suppress);
  ui.leave.addEventListener("click",toLobby);ui.rematch.addEventListener("click",toLobby);ui.errorBack.addEventListener("click",toLobby);
  ui.wordmark.addEventListener("click",function(e){e.preventDefault();if(!matchEnded)showToast("나가려면 오른쪽 아래 버튼을 누르세요.");});
  window.addEventListener("keydown",function(e){
    if(!gameStarted||matchEnded||ui.game.hidden)return;
    if(["Space","ArrowLeft","ArrowRight","KeyA","KeyD","KeyQ"].indexOf(e.code)>=0)e.preventDefault();
    if(e.repeat&&["Space","KeyQ"].indexOf(e.code)>=0)return;
    if(e.code==="Space")setInput({standing:!localInput.standing,aiming:false});
    else if(e.code==="KeyA"||e.code==="ArrowLeft")setInput({pos:localInput.pos-.07,standing:false,aiming:false},false);
    else if(e.code==="KeyD"||e.code==="ArrowRight")setInput({pos:localInput.pos+.07,standing:false,aiming:false},false);
    else if(e.code==="KeyQ")suppress();
    else if(e.code==="Escape"&&localInput.aiming)setInput({aiming:false});
  });
  window.addEventListener("keyup",function(e){
    if(!gameStarted||matchEnded||ui.game.hidden)return;
    if(e.code==="KeyA"||e.code==="ArrowLeft")setInput({pos:localInput.pos+.035},false);
    if(e.code==="KeyD"||e.code==="ArrowRight")setInput({pos:localInput.pos-.035},false);
    sendInput(true);
  });
  ui.canvas.addEventListener("contextmenu",function(e){e.preventDefault();});
  ui.canvas.addEventListener("mousedown",function(e){
    if(!gameStarted||matchEnded)return;
    if(e.button===2&&localInput.standing)setInput({aiming:!localInput.aiming,aimX:localInput.aiming?localInput.aimX:0,aimY:localInput.aiming?localInput.aimY:0});
    else if(e.button===0&&localInput.aiming)fire();
  });
  window.addEventListener("mousemove",function(e){
    if(!localInput.aiming||!gameStarted||matchEnded)return;
    var r=ui.canvas.getBoundingClientRect(),x=((e.clientX-r.left)/r.width)*2-1,y=-(((e.clientY-r.top)/r.height)*2-1);
    setInput({aimX:x,aimY:y},false);
  });
  window.addEventListener("resize",resize);
  window.addEventListener("beforeunload",cleanup);
  updateButtons();
})();