(function () {
  'use strict';
  var API = (window.SITE_CONFIG.APPS_SCRIPT_URL || '').trim();
  var $ = function (s) { return document.querySelector(s); };
  var KEY = '', ROWS = [], FILTER = 'all', WINNERS = [];
  try { KEY = sessionStorage.getItem('enn_admin') || ''; } catch (e) {}

  function toast(m) { var t = $('#toast'); t.textContent = m; t.classList.add('show'); setTimeout(function () { t.classList.remove('show'); }, 2000); }
  function call(body) {
    body.type = 'admin'; body.key = KEY;
    return fetch(API, { method: 'POST', body: JSON.stringify(body) }).then(function (r) { return r.json(); });
  }
  function td(text, cls) { var c = document.createElement('td'); if (cls) c.className = cls; c.textContent = text; return c; }
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function fmt(t) { var d = new Date(t); return (d.getMonth() + 1) + '/' + d.getDate() + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function grade(sid) { return sid.charAt(0); }

  function login(e) {
    if (e) e.preventDefault();
    if (!API) { $('#loginMsg').textContent = 'js/config.js에 APPS_SCRIPT_URL이 아직 없어요.'; return; }
    if (e) KEY = $('#key').value;
    $('#loginMsg').textContent = '확인 중…';
    call({ op: 'list' }).then(function (res) {
      if (!res.ok) { $('#loginMsg').textContent = res.error; return; }
      try { sessionStorage.setItem('enn_admin', KEY); } catch (er) {}
      $('#login').hidden = true; $('#app').hidden = false;
      $('#testWarn').hidden = !res.test;
      ROWS = res.rows; render();
    }).catch(function () { $('#loginMsg').textContent = '서버에 연결하지 못했어요. 웹 앱 주소를 확인해 주세요.'; });
  }
  $('#loginForm').addEventListener('submit', login);
  if (KEY) login();
  $('#reload').addEventListener('click', function () { login(); toast('새로 불러왔어요'); });

  function dupSet() {
    var c = {}; ROWS.forEach(function (r) { c[r.sid] = (c[r.sid] || 0) + 1; });
    return c;
  }
  function render() {
    var c = dupSet(), uniq = Object.keys(c);
    var byG = { 1: 0, 2: 0, 3: 0 }; uniq.forEach(function (s) { byG[grade(s)] = (byG[grade(s)] || 0) + 1; });
    var stats = [['전체 메시지', ROWS.length], ['참여 학생(학번 기준)', uniq.length], ['1학년', byG[1]], ['2학년', byG[2]], ['3학년', byG[3]],
      ['비공개', ROWS.filter(function (r) { return !r.vis; }).length]];
    var box = $('#stats'); box.innerHTML = '';
    stats.forEach(function (s) { var d = document.createElement('div'); d.className = 'stat'; var b = document.createElement('b'); b.textContent = s[1]; var sp = document.createElement('span'); sp.textContent = s[0]; d.appendChild(b); d.appendChild(sp); box.appendChild(d); });

    var q = $('#q').value.trim();
    var list = ROWS.slice().sort(function (a, b) { return b.t - a.t; }).filter(function (r) {
      if (FILTER === 'vis' && !r.vis) return false;
      if (FILTER === 'hid' && r.vis) return false;
      if (FILTER === 'dup' && c[r.sid] < 2) return false;
      if (q && (r.sid + r.name + r.msg).indexOf(q) < 0) return false;
      return true;
    });
    var tb = $('#tbody'); tb.innerHTML = '';
    list.forEach(function (r) {
      var tr = document.createElement('tr'); if (!r.vis) tr.className = 'off';
      tr.appendChild(td(fmt(r.t))); tr.appendChild(td(r.sid)); tr.appendChild(td(r.name)); tr.appendChild(td(r.msg, 'msg'));
      var nt = document.createElement('td');
      r.note.split(',').map(function (s) { return s.trim(); }).filter(Boolean).forEach(function (s) {
        var t = document.createElement('span'); t.className = 'tag' + (s.indexOf('비속어') > -1 ? ' bad' : (s.indexOf('중복') > -1 ? ' dup' : '')); t.textContent = s; nt.appendChild(t);
      });
      tr.appendChild(nt);
      var sc = document.createElement('td'), btn = document.createElement('button');
      btn.className = 'switch ' + (r.vis ? 'on' : 'off'); btn.textContent = r.vis ? '공개' : '비공개';
      btn.addEventListener('click', function () {
        btn.disabled = true;
        call({ op: 'setVisible', row: r.row, visible: !r.vis }).then(function (res) {
          if (res.ok) { r.vis = !r.vis; render(); toast(r.vis ? '축하 벽에 공개했어요' : '축하 벽에서 숨겼어요'); } else toast(res.error);
        }).catch(function () { toast('저장하지 못했어요'); btn.disabled = false; });
      });
      sc.appendChild(btn); tr.appendChild(sc); tb.appendChild(tr);
    });
    $('#pool').textContent = '추첨 대상 ' + pool().length + '명';
  }
  document.querySelectorAll('.bar .fchip').forEach(function (b) {
    b.addEventListener('click', function () {
      document.querySelectorAll('.bar .fchip').forEach(function (x) { x.classList.toggle('active', x === b); });
      FILTER = b.getAttribute('data-f'); render();
    });
  });
  $('#q').addEventListener('input', render);
  ['rUnique', 'rVisible', 'rNoTest'].forEach(function (id) { $('#' + id).addEventListener('change', render); });

  function pool() {
    var list = ROWS.filter(function (r) {
      if ($('#rVisible').checked && !r.vis) return false;
      if ($('#rNoTest').checked && r.note.indexOf('테스트') > -1) return false;
      return true;
    });
    if ($('#rUnique').checked) {
      var seen = {}; list = list.filter(function (r) { if (seen[r.sid]) return false; seen[r.sid] = 1; return true; });
    }
    return list;
  }
  function rand(n) {
    if (window.crypto && crypto.getRandomValues) { var a = new Uint32Array(1); crypto.getRandomValues(a); return a[0] % n; }
    return Math.floor(Math.random() * n);
  }
  $('#draw').addEventListener('click', function () {
    var p = pool(), n = Math.max(1, parseInt($('#rN').value, 10) || 1);
    if (!p.length) return toast('추첨할 응모가 없어요');
    n = Math.min(n, p.length);
    var arr = p.slice();
    for (var i = arr.length - 1; i > 0; i--) { var j = rand(i + 1), t = arr[i]; arr[i] = arr[j]; arr[j] = t; }
    WINNERS = arr.slice(0, n);
    var drum = $('#drum'), k = 0, w = $('#winners'); w.innerHTML = ''; $('#draw').disabled = true;
    var spin = setInterval(function () {
      var r = p[rand(p.length)]; drum.textContent = r.sid.slice(0, 1) + '학년 ' + r.name.charAt(0) + '○○';
      if (++k > 22) {
        clearInterval(spin); drum.textContent = '🎉 당첨 ' + n + '명!';
        WINNERS.forEach(function (r) {
          var d = document.createElement('div'); d.className = 'win';
          var b = document.createElement('b'); b.textContent = r.sid + ' ' + r.name;
          var pp = document.createElement('p'); pp.textContent = r.msg;
          d.appendChild(b); d.appendChild(pp); w.appendChild(d);
        });
        $('#copyWin').hidden = false; $('#draw').disabled = false;
      }
    }, 80);
  });
  $('#copyWin').addEventListener('click', function () {
    var txt = '으냉나리 생일주간 간식 당첨자\n' + WINNERS.map(function (r, i) { return (i + 1) + '. ' + r.sid + ' ' + r.name; }).join('\n');
    if (navigator.clipboard) navigator.clipboard.writeText(txt).then(function () { toast('복사했어요'); }); else toast('복사를 지원하지 않는 브라우저예요');
  });
  $('#csv').addEventListener('click', function () {
    var esc = function (s) { return '"' + String(s).replace(/"/g, '""') + '"'; };
    var lines = [['접수시각', '학번', '이름', '메시지', '공개', '비고'].join(',')].concat(ROWS.map(function (r) {
      return [esc(new Date(r.t).toLocaleString('ko-KR')), esc(r.sid), esc(r.name), esc(r.msg), r.vis ? 'Y' : 'N', esc(r.note)].join(',');
    }));
    var blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = '으냉나리_생일메시지.csv'; a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); }, 1000);
  });
})();
