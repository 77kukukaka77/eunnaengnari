/* 작은 봄 모으기 — 30초 캐치 게임 */
(function () {
  'use strict';
  var cv = document.getElementById('gameCanvas'); if (!cv) return;
  if (cv.parentElement.clientWidth < 560) { cv.width = 480; cv.height = 640; }
  var ctx = cv.getContext('2d'), W = cv.width, H = cv.height;
  var overlay = document.getElementById('gameOverlay'), startBtn = document.getElementById('gStart');
  var sEl = document.getElementById('gScore'), tEl = document.getElementById('gTime'), bEl = document.getElementById('gBest');
  var sprite = new Image(); sprite.src = 'assets/sprite.png';
  var DUR = 30, PW = 92, PH = 113;
  var best = 0; try { best = +localStorage.getItem('enn_best') || 0; } catch (e) {}
  bEl.textContent = best;

  var st = null, keys = {}, raf = 0, last = 0, pointerX = null;

  function reset() {
    st = { x: W / 2, score: 0, time: DUR, items: [], spawn: 0, pops: [], shake: 0, running: true, hurt: 0 };
  }
  function spawn() {
    var r = Math.random(), elapsed = DUR - st.time;
    var type = r < 0.62 ? 'leaf' : (r < 0.8 ? 'flower' : 'cloud');
    var speed = 120 + elapsed * 6 + Math.random() * 60;
    st.items.push({ type: type, x: 30 + Math.random() * (W - 60), y: -30, vy: type === 'cloud' ? speed * 0.85 : speed, rot: Math.random() * 6, vr: (Math.random() - .5) * 3, sway: Math.random() * 6 });
  }

  function drawLeaf(x, y, rot, s) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    ctx.beginPath(); ctx.moveTo(0, 14); ctx.lineTo(0, 4);
    ctx.moveTo(0, 4); ctx.bezierCurveTo(-14, 4, -18, -8, -15, -16); ctx.bezierCurveTo(-8, -12, -4, -14, 0, -18);
    ctx.bezierCurveTo(4, -14, 8, -12, 15, -16); ctx.bezierCurveTo(18, -8, 14, 4, 0, 4);
    ctx.fillStyle = '#FFD139'; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#C99200'; ctx.stroke();
    ctx.restore();
  }
  function drawFlower(x, y, rot, s) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(s, s);
    for (var i = 0; i < 4; i++) {
      ctx.rotate(Math.PI / 2); ctx.beginPath(); ctx.ellipse(0, -9, 6, 10, 0, 0, Math.PI * 2);
      ctx.fillStyle = '#FFE14D'; ctx.fill(); ctx.lineWidth = 1.6; ctx.strokeStyle = '#E0A800'; ctx.stroke();
    }
    ctx.beginPath(); ctx.arc(0, 0, 4, 0, Math.PI * 2); ctx.fillStyle = '#86552F'; ctx.fill();
    ctx.restore();
  }
  function drawCloud(x, y, s) {
    ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
    ctx.fillStyle = '#8C93A8';
    [[-14, 2, 12], [0, -6, 15], [15, 2, 12], [0, 6, 13]].forEach(function (c) { ctx.beginPath(); ctx.arc(c[0], c[1], c[2], 0, Math.PI * 2); ctx.fill(); });
    ctx.fillStyle = '#fff'; ctx.beginPath(); ctx.arc(-6, -2, 2.4, 0, 7); ctx.arc(6, -2, 2.4, 0, 7); ctx.fill();
    ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.beginPath(); ctx.arc(0, 7, 4, Math.PI * 1.15, Math.PI * 1.85); ctx.stroke();
    ctx.strokeStyle = '#6FA8DC'; ctx.lineWidth = 2;
    [-10, 0, 10].forEach(function (dx) { ctx.beginPath(); ctx.moveTo(dx, 20); ctx.lineTo(dx - 3, 28); ctx.stroke(); });
    ctx.restore();
  }
  function drawBg(t) {
    ctx.clearRect(0, 0, W, H);
    var g = ctx.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#DCEEFB'); g.addColorStop(1, '#FFF6DA');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = 'rgba(255,255,255,.8)';
    [[120, 70, 1], [520, 50, .8], [650, 110, .6]].forEach(function (c) {
      var x = (c[0] + t * 8 * c[2]) % (W + 120) - 60;
      ctx.beginPath(); ctx.arc(x, c[1], 22 * c[2], 0, 7); ctx.arc(x + 24 * c[2], c[1] - 8, 26 * c[2], 0, 7); ctx.arc(x + 50 * c[2], c[1], 20 * c[2], 0, 7); ctx.fill();
    });
    ctx.fillStyle = '#CDEBC0'; ctx.beginPath(); ctx.ellipse(W / 2, H + 40, W * .75, 80, 0, 0, 7); ctx.fill();
    ctx.fillStyle = '#B5E0A5'; ctx.fillRect(0, H - 14, W, 14);
  }

  function step(dt) {
    var sp = 430;
    if (keys.ArrowLeft || keys.a) st.x -= sp * dt;
    if (keys.ArrowRight || keys.d) st.x += sp * dt;
    if (pointerX !== null) st.x += (pointerX - st.x) * Math.min(1, dt * 14);
    st.x = Math.max(PW / 2, Math.min(W - PW / 2, st.x));

    st.time -= dt; st.spawn -= dt;
    if (st.spawn <= 0) { spawn(); st.spawn = Math.max(0.28, 0.75 - (DUR - st.time) * 0.014); }
    var py = H - PH - 6;
    for (var i = st.items.length - 1; i >= 0; i--) {
      var it = st.items[i];
      it.y += it.vy * dt; it.rot += it.vr * dt; it.sway += dt * 2;
      var ix = it.x + Math.sin(it.sway) * (it.type === 'leaf' ? 18 : 6);
      if (it.y > py + 18 && it.y < py + PH * .7 && Math.abs(ix - st.x) < PW * .5) {
        var pts = it.type === 'leaf' ? 1 : (it.type === 'flower' ? 3 : -2);
        st.score = Math.max(0, st.score + pts);
        st.pops.push({ x: ix, y: it.y, txt: (pts > 0 ? '+' : '') + pts, c: pts > 0 ? '#E09A00' : '#6B7287', life: .8 });
        if (pts < 0) { st.shake = .3; st.hurt = .5; }
        st.items.splice(i, 1); continue;
      }
      if (it.y > H + 30) st.items.splice(i, 1);
    }
    st.pops.forEach(function (p) { p.life -= dt; p.y -= 50 * dt; });
    st.pops = st.pops.filter(function (p) { return p.life > 0; });
    st.shake = Math.max(0, st.shake - dt); st.hurt = Math.max(0, st.hurt - dt);
  }

  function draw(t) {
    ctx.save();
    if (st && st.shake > 0) ctx.translate((Math.random() - .5) * 8, (Math.random() - .5) * 6);
    drawBg(t);
    if (st) {
      st.items.forEach(function (it) {
        var ix = it.x + Math.sin(it.sway) * (it.type === 'leaf' ? 18 : 6);
        if (it.type === 'leaf') drawLeaf(ix, it.y, it.rot, 1.15);
        else if (it.type === 'flower') drawFlower(ix, it.y, it.rot, 1.2);
        else drawCloud(ix, it.y, 1.1);
      });
      var bob = Math.sin(t * 8) * 3, py = H - PH - 6 + bob;
      if (sprite.complete && sprite.naturalWidth) {
        ctx.globalAlpha = st.hurt > 0 && Math.floor(st.hurt * 20) % 2 ? .45 : 1;
        ctx.drawImage(sprite, st.x - PW / 2, py, PW, PH);
        ctx.globalAlpha = 1;
      }
      ctx.font = '28px Jua, sans-serif'; ctx.textAlign = 'center';
      st.pops.forEach(function (p) { ctx.globalAlpha = Math.min(1, p.life * 2); ctx.fillStyle = p.c; ctx.fillText(p.txt, p.x, p.y); });
      ctx.globalAlpha = 1;
    }
    ctx.restore();
  }

  function loop(now) {
    var dt = Math.min(0.05, (now - last) / 1000); last = now;
    if (st && st.running) {
      step(dt);
      sEl.textContent = st.score; tEl.textContent = Math.max(0, Math.ceil(st.time));
      if (st.time <= 0) return end();
    }
    draw(now / 1000);
    raf = requestAnimationFrame(loop);
  }

  function start() {
    reset(); overlay.hidden = true; last = performance.now();
    cancelAnimationFrame(raf); raf = requestAnimationFrame(loop);
    cv.focus && cv.focus();
  }
  function end() {
    st.running = false; draw(performance.now() / 1000);
    var sc = st.score, isBest = sc > best;
    if (isBest) { best = sc; bEl.textContent = best; try { localStorage.setItem('enn_best', best); } catch (e) {} }
    var title = sc >= 40 ? '봄의 마법사! 🌸' : (sc >= 20 ? '봄바람 수집가 🌼' : '작은 봄 발견! 🍂');
    overlay.querySelector('h3').textContent = title;
    var p = overlay.querySelector('p'); p.innerHTML = '';
    var big = document.createElement('span'); big.className = 'big-score'; big.textContent = sc + '점';
    p.appendChild(big);
    if (isBest) { var nb = document.createElement('span'); nb.className = 'legend'; nb.textContent = '🏆 최고 기록!'; p.appendChild(nb); }
    startBtn.textContent = '다시 하기';
    overlay.hidden = false; startBtn.focus();
  }

  startBtn.addEventListener('click', start);
  window.addEventListener('keydown', function (e) {
    if (!st || !st.running) return;
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') { keys[e.key] = true; e.preventDefault(); }
  });
  window.addEventListener('keyup', function (e) { keys[e.key] = false; });
  function toCanvasX(e) { var r = cv.getBoundingClientRect(); return (e.clientX - r.left) * (W / r.width); }
  cv.addEventListener('pointerdown', function (e) { pointerX = toCanvasX(e); cv.setPointerCapture && cv.setPointerCapture(e.pointerId); });
  cv.addEventListener('pointermove', function (e) { if (e.pointerType === 'mouse' || pointerX !== null) pointerX = toCanvasX(e); });
  cv.addEventListener('pointerup', function (e) { if (e.pointerType !== 'mouse') pointerX = null; });
  cv.addEventListener('pointerleave', function () { pointerX = null; });
  document.addEventListener('visibilitychange', function () {
    if (document.hidden && st && st.running) { st.running = false; overlay.querySelector('h3').textContent = '잠깐 멈췄어요'; startBtn.textContent = '처음부터 다시'; overlay.hidden = false; }
  });

  sprite.onload = function () { draw(0); };
  draw(0);
})();
