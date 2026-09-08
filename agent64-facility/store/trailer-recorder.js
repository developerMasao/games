/* ---------------------------------------------------------------------------
   Trailer recorder for AGENT 64 — FACILITY.

   Not part of the game or the itch.io build. It is injected into a running
   copy of the game to record dist/store/trailer.webm: 1280x720, VP9 + Opus,
   about 50 seconds, with title card, captions, cross fades and an end card
   drawn into the recorded frames.

   Video comes from the game's own renderer and the HUD canvas, audio from the
   WebAudio graph, so the trailer is the real thing rather than a mock up.

   HOW TO RUN
     1. serve the repo:            python3 -m http.server 8712
     2. run a receiver that saves what the page posts to
        http://127.0.0.1:8713/save?name=trailer.webm
     3. open agent64-facility/index.html, then in the console:
            const s = await (await fetch('/trailer-recorder.js')).text();
            (0, eval)(s);
            Snd.init(); startGame();
            TR.run(true);            // TR.run(false) previews without recording
        TR.status goes 'running' -> 'done'; TR.result names the saved size.

   NOTES
     - The recorder drives the game from a Worker timer instead of
       requestAnimationFrame, because a hidden tab throttles rAF to a crawl.
     - Each frame is composited in the same task as the render, since the
       WebGL context has no preserveDrawingBuffer and the buffer is cleared
       once the frame is composited.
     - Stealth shots scrub the alarm and guard awareness every frame: the
       camera teleports behind guards, which would otherwise be spotted.
   --------------------------------------------------------------------------- */
window.__toDest = window.__toDest || [];
if (!window.__acHooked) {
  window.__acHooked = true;
  const O = window.AudioContext || window.webkitAudioContext;
  const W = function (...a) { const c = new O(...a); window.__ac = c; return c; };
  W.prototype = O.prototype;
  window.AudioContext = W; window.webkitAudioContext = W;
  const oc = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function (t, ...r) {
    try { if (t instanceof AudioDestinationNode) window.__toDest.push(this); } catch (e) {}
    return oc.call(this, t, ...r);
  };
}
window.RAF = window.RAF || window.requestAnimationFrame.bind(window);

window.TR = {
  W: 1280, H: 720, status: 'idle', name: 'trailer.webm',
  comp: (function () { const c = document.createElement('canvas'); c.width = 1280; c.height = 720; return c; })(),
  shots: [
    { d:4.0, title:true,                                    from:[15,31,31,30], to:[16.6,31,31,30], pitch:-0.02, wpn:'pp7' },
    { d:6.5, cap:'配管を這って施設に入る',                    from:[4,17,2,14],   to:[3,15.6,2,14],   pitch:-0.05, wpn:'pp7' },
    { d:6.5, cap:'見つからないように背後を取る',              from:[23,6.6,23,4], to:[23,5.3,23,4],   pitch:-0.03, wpn:'pp7', guard:[23,4] },
    { d:6.5, cap:'警備兵は視界と音で探してくる',              from:[20,25.6,15,25], to:[19,25.2,15,25], pitch:-0.05, wpn:'pp7', guard:[15,25] },
    { d:6.0, cap:'資料は一番奥の保管庫にある',                from:[21,18,21,14], to:[21,16.8,21,14], pitch:-0.04, wpn:'pp7' },
    { d:7.5, cap:'奪った瞬間、施設が起きる',                  from:[21,19,21,16], to:[21,19,21,16],   pitch:0,     wpn:'pp7', alarm:true, bot:true, assault:true },
    { d:6.5, cap:'出口は二つ。南の門か、来た配管か',          from:[20,30.6,33,30], to:[21.4,30.6,33,30], pitch:-0.02, wpn:'kf7' },
    { d:5.5, end:true,                                      from:[15,31,31,30], to:[15.8,31,31,30], pitch:-0.02, wpn:'pp7' }
  ]
};
TR.total = TR.shots.reduce((a, s) => a + s.d, 0);

TR.ticker = (function () {
  const src = "let id=null; onmessage=e=>{ if(e.data&&e.data.go){ clearInterval(id); id=setInterval(()=>postMessage(1), e.data.ms); } else { clearInterval(id); id=null; } };";
  const w = new Worker(URL.createObjectURL(new Blob([src], { type: 'text/javascript' })));
  return { start(ms, cb) { w.onmessage = cb; w.postMessage({ go: true, ms: ms || 16 }); },
           stop() { w.postMessage({ go: false }); w.onmessage = null; } };
})();

TR.setup = function (s) {
  radioLog.length = 0; hud.msgs.length = 0; hud.useHint = '';
  if (s.wpn) { player.reloading = 0; switchWeapon(s.wpn); }
  if (s.guard) {
    const tv = new THREE.Vector3(cx2w(s.guard[0]), 0, cx2w(s.guard[1]));
    const g = guards.filter(q => !q.dead).sort((a, b) => a.pos.distanceTo(tv) - b.pos.distanceTo(tv))[0];
    if (g) { g.route = []; g.state = 'patrol'; g.aware = 0; g.headYaw = 0; guards.forEach(q => q.__face = false); g.__face = true; }
  }
  if (s.alarm && !item.taken) { player.pos.set(cx2w(21), COURT_Y, cx2w(14)); player.y = COURT_Y; takeItem(); }
  if (s.assault) {
    // put the camera at the vault and bring the guards to it, so the climax has something in frame
    player.pos.set(cx2w(21), COURT_Y, cx2w(19)); player.y = COURT_Y; player.pos.y = COURT_Y;
    player.yaw = 0; player.pitch = 0;
    const at = [[18,18],[24,18],[20,16],[23,20],[18,20]];
    const live = guards.filter(g => !g.dead);
    for (let i = 0; i < at.length && i < live.length; i++) {
      const g = live[i];
      g.pos.set(cx2w(at[i][0]), 0, cx2w(at[i][1]));
      g.y = floorYAt(g.pos.x, g.pos.z); g.route = []; g.navPath = [];
      g.alertMe(player.pos.x, player.pos.z);
    }
  }
  if (s.bot) botToggle(true); else if (bot.on) botToggle(false);
  player.hp = 100; player.armor = 50;
};

TR.apply = function (s, u) {
  radioLog.length = 0;
  if (!s.alarm && !s.bot) {                      // the camera teleports behind guards; do not let that raise the alarm
    if (game.alarm > 0) { game.alarm = 0; Snd.alarmOff(); }
    game.escape = false; hud.msgs.length = 0;
    for (const g of guards) {
      if (g.dead) continue;
      g.aware = 0;
      if (g.state !== 'patrol' && g.state !== 'look') { g.state = 'patrol'; g.mark(null); }
    }
  }
  if (s.bot) return;
  const f = s.from, t = s.to;
  const px = f[0] + (t[0] - f[0]) * u, pz = f[1] + (t[1] - f[1]) * u;
  const tx = f[2] + (t[2] - f[2]) * u, tz = f[3] + (t[3] - f[3]) * u;
  const wx = cx2w(px), wz = cx2w(pz);
  player.pos.x = wx; player.pos.z = wz; player.y = floorYAt(wx, wz); player.pos.y = player.y;
  const dx = cx2w(tx) - wx, dz = cx2w(tz) - wz;
  player.yaw = Math.atan2(-dx, -dz); player.pitch = s.pitch || 0;
  player.vel.set(0, 0, 0);
  if (s.guard) { const g = guards.find(q => q.__face); if (g) g.yaw = player.yaw + Math.PI; }
};

TR.text = function (x, t, px, py, size, sp, color, glow) {
  x.font = size + 'px "Courier New", monospace'; x.textAlign = 'center'; x.fillStyle = color;
  if (glow) { x.shadowColor = glow; x.shadowBlur = 22; } else x.shadowBlur = 0;
  const adv = ch => (ch === ' ' ? x.measureText('M').width * 0.55 : x.measureText(ch).width) + sp;
  let tot = 0; for (const ch of t) tot += adv(ch);
  let lx = px - tot / 2;
  for (const ch of t) { const a = adv(ch); if (ch !== ' ') x.fillText(ch, lx + (a - sp) / 2, py); lx += a; }
  x.shadowBlur = 0;
};

TR.draw = function (s, tin) {
  const W = TR.W, H = TR.H, x = TR.comp.getContext('2d');
  x.imageSmoothingEnabled = false;
  x.fillStyle = '#000'; x.fillRect(0, 0, W, H);
  const src = renderer.domElement;
  x.drawImage(src, 0, 0, src.width, src.height, 0, 0, W, H);
  if (!s.title && !s.end) x.drawImage(hudCanvas, 0, 0, W, H);
  const bar = 52; x.fillStyle = '#000'; x.fillRect(0, 0, W, bar); x.fillRect(0, H - bar, W, bar);
  if (s.title) {
    x.fillStyle = 'rgba(3,6,12,0.55)'; x.fillRect(0, 0, W, H);
    TR.text(x, 'AGENT 64', W / 2, H / 2 - 6, 84, 14, '#e8c766', 'rgba(232,199,102,0.6)');
    TR.text(x, 'FACILITY', W / 2, H / 2 + 40, 26, 11, '#8fb6e8');
  }
  if (s.end) {
    x.fillStyle = 'rgba(3,6,12,0.74)'; x.fillRect(0, 0, W, H);
    TR.text(x, 'AGENT 64', W / 2, H / 2 - 30, 78, 13, '#e8c766', 'rgba(232,199,102,0.6)');
    TR.text(x, 'FACILITY', W / 2, H / 2 + 12, 24, 10, '#8fb6e8');
    x.fillStyle = 'rgba(232,199,102,0.4)'; x.fillRect(W / 2 - 190, H / 2 + 40, 380, 1);
    TR.text(x, 'ブラウザで無料で遊べます', W / 2, H / 2 + 82, 22, 3, '#e6eeff');
    TR.text(x, 'itch.io', W / 2, H / 2 + 120, 20, 6, '#b9cdea');
  }
  if (s.cap) {
    const ca = Math.min(1, tin / 0.5) * Math.min(1, (s.d - tin) / 0.5);
    x.globalAlpha = Math.max(0, ca);
    TR.text(x, s.cap, W / 2, H - bar - 26, 25, 2, '#eaf2ff', 'rgba(0,0,0,0.9)');
    x.globalAlpha = 1;
  }
  let fade = 0;
  if (tin < 0.5) fade = 1 - tin / 0.5;
  else if (tin > s.d - 0.5) fade = 1 - (s.d - tin) / 0.5;
  if (fade > 0) { x.fillStyle = 'rgba(0,0,0,' + Math.min(1, fade) + ')'; x.fillRect(0, 0, W, H); }
};

TR.run = function (record) {
  TR.status = 'running'; TR.result = null; TR.err = null; TR.progress = 0;
  const origFT = hx.fillText.bind(hx);
  hx.fillText = function (t, a, b, c) { if (typeof t === 'string' && t.indexOf('FPS ') === 0) return; return origFT(t, a, b, c); };
  let rec = null; const chunks = [];
  if (record) {
    const sd = window.__ac.createMediaStreamDestination();
    for (const n of window.__toDest) { try { n.connect(sd); } catch (e) {} }
    const vs = TR.comp.captureStream(30);
    const ms = new MediaStream([...vs.getVideoTracks(), ...sd.stream.getAudioTracks()]);
    rec = new MediaRecorder(ms, { mimeType: 'video/webm;codecs=vp9,opus', videoBitsPerSecond: 8000000, audioBitsPerSecond: 128000 });
    rec.ondataavailable = e => { if (e.data.size) chunks.push(e.data); };
    rec.start(1000);
  }
  const RAF = window.RAF;
  window.requestAnimationFrame = () => 0;
  let si = 0, sT = 0, prev = performance.now(), frames = 0, ended = false;
  TR.setup(TR.shots[0]);
  async function finish() {
    if (ended) return; ended = true;
    TR.ticker.stop();
    window.requestAnimationFrame = RAF;
    hx.fillText = origFT;
    if (bot.on) botToggle(false);
    if (!rec) { TR.status = 'done'; TR.result = 'preview ' + frames + ' frames'; return; }
    await new Promise(r => { rec.onstop = r; rec.stop(); });
    const blob = new Blob(chunks, { type: 'video/webm' });
    const rr = await fetch('http://127.0.0.1:8713/save?name=' + TR.name, { method: 'POST', body: blob });
    TR.status = 'done'; TR.result = 'saved ' + blob.size + ' bytes / ' + frames + ' frames / http ' + rr.status;
  }
  TR.ticker.start(16, function () {
    if (ended) return;
    const now = performance.now();
    const dt = Math.min(0.05, (now - prev) / 1000); prev = now; sT += dt; frames++;
    let s = TR.shots[si];
    if (sT >= s.d) { sT -= s.d; si++; if (si >= TR.shots.length) { finish(); return; } s = TR.shots[si]; TR.setup(s); }
    TR.apply(s, Math.min(1, sT / s.d));
    try { frame(now); } catch (e) { TR.err = String(e); }
    try { TR.draw(s, sT); } catch (e) { TR.err = 'draw: ' + String(e); }
    TR.progress = +(si + sT / s.d).toFixed(2);
  });
  return 'started';
};
'TR loaded';
