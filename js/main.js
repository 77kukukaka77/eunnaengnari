(function () {
  'use strict';
  var D = window.SITE_DATA, C = window.SITE_CONFIG;
  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  function el(tag, attrs, kids) {
    var e = document.createElement(tag);
    if (attrs) Object.keys(attrs).forEach(function (k) {
      if (k === 'text') e.textContent = attrs[k];
      else if (k === 'class') e.className = attrs[k];
      else e.setAttribute(k, attrs[k]);
    });
    (kids || []).forEach(function (c) { if (c) e.appendChild(c); });
    return e;
  }
  var DL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/></svg>';

  /* ---------- toast ---------- */
  var toastT;
  function toast(msg) {
    var t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toastT); toastT = setTimeout(function () { t.classList.remove('show'); }, 2200);
  }

  /* ---------- falling leaves (hero) ---------- */
  var LEAF_SVG = function (c) {
    return 'data:image/svg+xml;utf8,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 40 40"><path d="M20 36 L20 24 M20 24 C8 24 3 14 6 6 C12 10 16 8 20 4 C24 8 28 10 34 6 C37 14 32 24 20 24Z" fill="' + c + '" stroke="#C99200" stroke-width="1.2"/></svg>');
  };
  var leaves = $('.leaves');
  if (leaves && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var cols = ['#FFD139', '#FFE47A', '#FFC93C', '#FFB8B0'];
    for (var i = 0; i < 14; i++) {
      var im = el('img', { class: 'leaf', src: LEAF_SVG(cols[i % cols.length]), alt: '' });
      im.style.left = (Math.random() * 100) + '%';
      im.style.animationDuration = (9 + Math.random() * 9) + 's';
      im.style.animationDelay = (-Math.random() * 15) + 's';
      var s = 16 + Math.random() * 18; im.style.width = s + 'px'; im.style.height = s + 'px';
      leaves.appendChild(im);
    }
  }

  /* ---------- nav highlight ---------- */
  var navLinks = $$('.nav a');
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('on', a.getAttribute('href') === '#' + en.target.id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    $$('main section[id]').forEach(function (s) { io.observe(s); });
  }

  /* ---------- palette copy ---------- */
  $$('.chip').forEach(function (b) {
    b.addEventListener('click', function () {
      var hex = b.getAttribute('data-hex');
      var done = function () { toast(hex + ' 복사했어요!'); };
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(hex).then(done, function () { toast(hex); });
      else toast(hex);
    });
  });

  /* ---------- modal helpers ---------- */
  var lastFocus = null;
  function openModal(m) {
    lastFocus = document.activeElement; m.hidden = false; document.body.style.overflow = 'hidden';
    var f = m.querySelector('.modal-x'); if (f) f.focus();
  }
  function closeModal(m) {
    m.hidden = true; document.body.style.overflow = '';
    $$('video', m).forEach(function (v) { v.pause(); });
    if (lastFocus) lastFocus.focus();
  }
  $$('.modal').forEach(function (m) {
    m.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeModal(m); });
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') $$('.modal').forEach(function (m) { if (!m.hidden) closeModal(m); });
  });

  /* ---------- copyright gate ---------- */
  var cModal = $('#cModal'), cAgree = $('#cAgree'), cGo = $('#cGo'), pending = null, agreedOnce = false;
  function requestDownload(file, name) {
    $$('.modal').forEach(function (m) {
      if (m !== cModal && !m.hidden) { m.hidden = true; $$('video', m).forEach(function (v) { v.pause(); }); }
    });
    pending = { file: file, name: name };
    $('#cFile').textContent = '📁 ' + name;
    cAgree.checked = agreedOnce; cGo.disabled = !agreedOnce;
    openModal(cModal);
  }
  cAgree.addEventListener('change', function () { cGo.disabled = !cAgree.checked; });
  cGo.addEventListener('click', function () {
    if (!pending || !cAgree.checked) return;
    agreedOnce = true;
    var a = document.createElement('a'); a.href = pending.file; a.download = pending.name;
    document.body.appendChild(a); a.click(); a.remove();
    closeModal(cModal); toast('다운로드를 시작했어요 💛');
  });
  document.addEventListener('click', function (e) {
    var b = e.target.closest('[data-dl]');
    if (b) { e.preventDefault(); requestDownload(b.getAttribute('data-dl'), b.getAttribute('data-name')); }
  });

  /* ---------- friends ---------- */
  var vidById = {}; D.videos.forEach(function (v) { vidById[v.id] = v; });
  var fGrid = $('#friendGrid'), fModal = $('#fModal');
  var RINGS = { mint: '#7ED9A8', lav: '#B98CFF', sky: '#8CCBFF', peach: '#FFB38A', pink: '#FF9ECF' };
  D.friends.forEach(function (f) {
    var circle = el('div', { class: 'fcircle' }, [el('img', { src: f.circle, alt: f.name, loading: 'lazy' })]);
    var card = el('button', { class: 'fcard', type: 'button', 'aria-label': f.name + ' 자세히 보기' }, [
      circle,
      el('h3', { text: f.name }),
      el('p', { text: f.line }),
      f.videos.length ? el('span', { class: 'vbadge', text: 'VIDEO' }) : null
    ]);
    card.style.setProperty('--ring', RINGS[f.tape] || '#B98CFF');
    card.addEventListener('click', function () { showFriend(f); });
    fGrid.appendChild(card);
  });
  function showFriend(f) {
    var media = $('#fmMedia'); media.innerHTML = '';
    media.appendChild(el('img', { src: f.img, alt: f.name }));
    $('#fmNo').textContent = 'FRIEND ' + f.no; $('#fmName').textContent = f.name; $('#fmLine').textContent = f.line;
    var vb = $('#fmVids'); vb.innerHTML = '';
    vb.appendChild(el('button', { class: 'btn btn-gold btn-sm', type: 'button', 'data-dl': f.file, 'data-name': '친구_' + f.name.replace(/\s/g, '') + '.jpg', text: '그림 받기' }));
    if (f.videos.length) {
      var ib = el('button', { class: 'btn btn-ghost btn-sm', type: 'button', text: '그림 보기' });
      ib.addEventListener('click', function () { media.innerHTML = ''; media.appendChild(el('img', { src: f.img, alt: f.name })); });
      vb.appendChild(ib);
    }
    f.videos.forEach(function (id) {
      var v = vidById[id];
      var b = el('button', { class: 'btn btn-pink btn-sm', type: 'button', text: '▶ ' + v.title.replace(f.name + ' · ', '') });
      b.addEventListener('click', function () {
        media.innerHTML = '';
        media.appendChild(el('video', { src: v.src, poster: v.poster, controls: '', autoplay: '', playsinline: '', loop: '' }));
      });
      vb.appendChild(b);
    });
    openModal(fModal);
  }

  /* ---------- gallery: 기본 / 동작별 / 시즌별 / 계절별 ---------- */
  var CAT = { basic: '기본', action: '동작별', event: '시즌별', season: '계절별' };
  var sGrid = $('#singleGrid'), shGrid = $('#sheetGrid');
  function ext(n) { return n.split('.').pop().toUpperCase(); }
  function dlButton(file, name, label) {
    var b = el('button', { class: 'dl-btn', type: 'button', 'data-dl': file, 'data-name': name, 'aria-label': label + ' 다운로드' });
    b.innerHTML = DL_ICON; return b;
  }
  function renderGallery(cat) {
    sGrid.innerHTML = ''; shGrid.innerHTML = '';
    D.singles.filter(function (it) { return it.cat === cat; }).forEach(function (it) {
      sGrid.appendChild(el('div', { class: 'icard' }, [
        el('div', { class: 'ithumb' }, [el('img', { src: it.thumb, alt: '으냉나리 ' + it.title, loading: 'lazy' })]),
        el('div', { class: 'imeta' }, [
          el('div', null, [el('div', { class: 'ititle', text: it.title }), el('div', { class: 'itype', text: ext(it.file) })]),
          dlButton(it.file, it.name, it.title)
        ])
      ]));
    });
    var sheets = D.sheets.filter(function (it) { return it.cat === cat; });
    $('.sheet-title').hidden = !sheets.length;
    sheets.forEach(function (it) {
      var zoom = el('button', { class: 'sthumb', type: 'button', 'aria-label': it.title + ' 크게 보기' }, [el('img', { src: it.thumb, alt: it.title, loading: 'lazy' })]);
      zoom.addEventListener('click', function () {
        var media = $('#fmMedia'); media.innerHTML = ''; media.appendChild(el('img', { src: it.thumb, alt: it.title }));
        $('#fmNo').textContent = '모음 이미지'; $('#fmName').textContent = it.title; $('#fmLine').textContent = it.desc;
        var vb = $('#fmVids'); vb.innerHTML = '';
        vb.appendChild(el('button', { class: 'btn btn-gold btn-sm', type: 'button', 'data-dl': it.file, 'data-name': it.name, text: '원본 받기' }));
        openModal(fModal);
      });
      shGrid.appendChild(el('div', { class: 'scard' }, [
        zoom,
        el('div', { class: 'sbody' }, [el('div', null, [el('h3', { text: it.title }), el('p', { text: it.desc })]), dlButton(it.file, it.name, it.title)])
      ]));
    });
  }
  var tabs = $$('#galleryTabs .tab');
  tabs.forEach(function (t) {
    var c = t.getAttribute('data-cat');
    var n = D.singles.filter(function (it) { return it.cat === c; }).length + D.sheets.filter(function (it) { return it.cat === c; }).length;
    t.querySelector('small').textContent = '· ' + n;
    t.setAttribute('aria-label', CAT[c] + ' 이미지 ' + n + '개');
    t.addEventListener('click', function () {
      tabs.forEach(function (x) { x.setAttribute('aria-selected', x === t ? 'true' : 'false'); });
      renderGallery(c);
    });
  });
  renderGallery('basic');

  /* 세계관 영상: 화면에 보이면 소리 없이 재생, 벗어나면 멈춤 */
  var storyVid = $('#story video');
  if (storyVid && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        if (en.isIntersecting) { var pr = storyVid.play(); if (pr && pr.catch) pr.catch(function () {}); }
        else storyVid.pause();
      });
    }, { threshold: 0.4 }).observe(storyVid);
  }

  /* ---------- videos ---------- */
  var vGrid = $('#videoGrid');
  D.videos.forEach(function (v, i) {
    var dl = el('button', { class: 'dl-btn', type: 'button', 'data-dl': v.src, 'data-name': v.name, 'aria-label': v.title + ' 영상 다운로드' });
    dl.innerHTML = DL_ICON;
    vGrid.appendChild(el('div', { class: 'vcard' + (i === 0 ? ' wide' : '') }, [
      el('video', { src: v.src, poster: v.poster, controls: '', playsinline: '', preload: 'none', loop: '' }),
      el('div', { class: 'vmeta' }, [el('div', null, [el('b', { text: v.title }), el('small', { text: v.sound ? '소리 있음' : '무음 · 5~8초' })]), dl])
    ]));
  });

  /* ---------- birthday ---------- */
  var OPEN = Date.parse(C.OPEN_AT), CLOSE = Date.parse(C.CLOSE_AT);
  var TEST = /[?&]test=1/.test(location.search);
  var API = (C.APPS_SCRIPT_URL || '').trim();
  $('#fMax').textContent = C.MESSAGE_MAX;
  function phase() {
    if (TEST) return 'open';
    var n = Date.now(); return n < OPEN ? 'before' : (n < CLOSE ? 'open' : 'after');
  }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function renderPhase() {
    var p = phase();
    $('#bdayBefore').hidden = p !== 'before';
    $('#bdayForm').hidden = p !== 'open';
    $('#bdayAfter').hidden = p !== 'after';
    $('#bdaySetup').hidden = !!API;
    var rib = $('#bdayRibbon');
    if (p === 'before') {
      var ms = OPEN - Date.now(), d = Math.floor(ms / 864e5), h = Math.floor(ms / 36e5) % 24, m = Math.floor(ms / 6e4) % 60, s = Math.floor(ms / 1e3) % 60;
      $('#countdown').innerHTML = '<span>' + d + '<small>일</small></span><span>' + pad(h) + '<small>시간</small></span><span>' + pad(m) + '<small>분</small></span><span>' + pad(s) + '<small>초</small></span>';
      if (d <= 14) { rib.hidden = false; $('#ribbonText').textContent = '🎂 으냉나리 생일 D-' + (d + 1) + ' · 11월 4일부터 축하 메시지를 받아요'; }
    } else if (p === 'open') {
      rib.hidden = false; $('#ribbonText').textContent = TEST ? '🧪 테스트 모드 — 생일 메시지 접수 화면 미리보기' : '🎉 지금은 으냉나리 생일주간! (11.4.~11.10.) 축하 메시지를 남겨 주세요';
    } else rib.hidden = true;
    return p;
  }
  var lastPhase = renderPhase();
  setInterval(function () { var p = renderPhase(); if (p !== lastPhase) { lastPhase = p; loadWall(); } }, 1000);

  var msgEl = $('#fMsg'), cnt = $('#fCount');
  msgEl.addEventListener('input', function () {
    if (msgEl.value.length > C.MESSAGE_MAX) msgEl.value = msgEl.value.slice(0, C.MESSAGE_MAX);
    cnt.textContent = msgEl.value.length;
  });
  $('#fSid').addEventListener('input', function (e) { e.target.value = e.target.value.replace(/\D/g, '').slice(0, 5); });

  function formMsg(t, ok) { var f = $('#formMsg'); f.textContent = t; f.className = 'form-msg ' + (ok ? 'ok' : 'err'); }
  var sending = false;
  $('#bdayForm').addEventListener('submit', function (e) {
    e.preventDefault();
    if (sending) return;
    var sid = $('#fSid').value.trim(), name = $('#fName').value.trim().replace(/\s+/g, ''), msg = msgEl.value.trim();
    if (!/^[1-3][0-9]{4}$/.test(sid)) return formMsg('학번 5자리를 확인해 주세요. (예: 1학년 2반 3번 → 10203)');
    if (!/^[가-힣a-zA-Z]{2,10}$/.test(name)) return formMsg('이름을 정확히 써 주세요.');
    if (msg.length < 2) return formMsg('축하 메시지를 써 주세요.');
    if (!API) return formMsg('아직 메시지 저장소가 연결되지 않았어요. 선생님께 알려 주세요.');
    sending = true; $('#fSubmit').disabled = true; formMsg('보내는 중이에요…', true);
    fetch(API, { method: 'POST', body: JSON.stringify({ type: 'submit', sid: sid, name: name, msg: msg, hp: $('#fHp').value, test: TEST }) })
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (res.ok) {
          formMsg(res.hidden ? '보냈어요! 선생님 확인 후 축하 벽에 올라가요.' : '보냈어요! 축하 벽에 메시지가 붙었어요 🎉', true);
          msgEl.value = ''; cnt.textContent = '0'; confetti(); loadWall();
        } else formMsg(res.error || '보내지 못했어요. 잠시 후 다시 해 주세요.');
      })
      .catch(function () { formMsg('인터넷 연결을 확인하고 다시 보내 주세요.'); })
      .then(function () { sending = false; $('#fSubmit').disabled = false; });
  });

  function fmtTime(t) {
    var d = new Date(t); if (isNaN(d)) return '';
    return (d.getMonth() + 1) + '월 ' + d.getDate() + '일 ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function emptyWall(text) {
    var w = $('#wall'); w.innerHTML = '';
    w.appendChild(el('div', { class: 'wall-empty' }, [el('img', { src: 'assets/sprite.png', alt: '' }), el('p', { text: text })]));
  }
  function loadWall() {
    if (!API) { emptyWall('생일주간이 시작되면 친구들의 축하 메시지가 여기에 붙어요!'); $('#wallCount').textContent = ''; return; }
    fetch(API + (API.indexOf('?') > -1 ? '&' : '?') + 'action=wall&t=' + Date.now())
      .then(function (r) { return r.json(); })
      .then(function (res) {
        if (!res.ok) throw 0;
        var list = res.messages || [];
        $('#wallCount').textContent = list.length ? '💌 ' + list.length + '개' : '';
        if (!list.length) return emptyWall(phase() === 'before' ? '생일주간이 시작되면 친구들의 축하 메시지가 여기에 붙어요!' : '첫 번째 축하 메시지의 주인공이 되어 주세요!');
        var w = $('#wall'); w.innerHTML = '';
        list.forEach(function (m, i) {
          var n = el('div', { class: 'note n' + (i % 6) }, [document.createTextNode(m.m), el('time', { text: fmtTime(m.t) })]);
          n.style.transform = 'rotate(' + ((i * 37 % 7) - 3) * 0.6 + 'deg)';
          w.appendChild(n);
        });
      })
      .catch(function () { emptyWall('축하 벽을 불러오지 못했어요. 잠시 후 새로고침해 주세요.'); });
  }
  loadWall();
  var wallTimer = null;
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (ents) {
      ents.forEach(function (en) {
        clearInterval(wallTimer);
        if (en.isIntersecting && API && phase() === 'open') wallTimer = setInterval(loadWall, 30000);
      });
    }).observe($('#birthday'));
  }

  function confetti() {
    var layer = $('#confetti'), cols = ['#FFD139', '#F59B9F', '#FFC5AA', '#B9E4C9', '#CDB8F5', '#9ED0F5'];
    for (var i = 0; i < 60; i++) {
      var c = el('i', { class: 'cf' });
      c.style.left = Math.random() * 100 + '%'; c.style.background = cols[i % cols.length];
      c.style.animationDelay = Math.random() * 0.6 + 's'; c.style.animationDuration = 2 + Math.random() * 1.5 + 's';
      layer.appendChild(c);
      setTimeout(function (x) { x.remove(); }.bind(null, c), 4500);
    }
  }
})();
