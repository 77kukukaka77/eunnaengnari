/**
 * 으냉나리 생일 축하 메시지 저장소 (구글 앱스 스크립트)
 * - 구글 시트에 붙여 쓰는 스크립트입니다. 설치가이드를 따라 '웹 앱'으로 배포하세요.
 * - 공개 축하 벽에는 메시지만 내보내고, 학번·이름은 관리자 비밀번호로만 조회됩니다.
 *
 * [스크립트 속성] (프로젝트 설정 → 스크립트 속성)
 *   ADMIN_KEY : 선생님 관리 화면 비밀번호 (필수, 8자 이상 권장)
 *   TEST_MODE : on 으로 두면 접수 기간이 아니어도 테스트 접수가 됩니다. 테스트 후 반드시 off 로 바꾸세요.
 */

var CONFIG = {
  OPEN_AT: '2026-11-04T00:00:00+09:00',
  CLOSE_AT: '2026-11-11T00:00:00+09:00', // 11월 10일 23:59:59까지
  SHEET: '메시지',
  MSG_MAX: 150,
  WALL_LIMIT: 400
};

// 간단한 비속어 목록 — 걸리면 '비공개(N)'로 저장되고 관리 화면에서 확인 후 공개할 수 있습니다. 필요하면 추가하세요.
var BAD_WORDS = ['시발', '씨발', '씨빨', '시바', 'ㅅㅂ', 'ㅆㅂ', '병신', 'ㅂㅅ', '븅신', '개새', '새끼', 'ㅅㄲ', '좆', 'ㅈ같', '지랄', 'ㅈㄹ', '존나', 'ㅈㄴ', '졸라',
  '미친', '꺼져', '닥쳐', '엿먹', '느금', '니애미', '느그', '애미', '애비', '닥치', '죽어', '뒤져', 'fuck', 'shit'];

var HEAD = ['접수시각', '학번', '이름', '메시지', '공개', '비고'];

function sheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(CONFIG.SHEET);
  if (!sh) {
    sh = ss.insertSheet(CONFIG.SHEET);
    sh.appendRow(HEAD);
    sh.setFrozenRows(1);
    sh.getRange('A:A').setNumberFormat('yyyy-mm-dd hh:mm:ss');
    sh.getRange('B:B').setNumberFormat('@');
  }
  return sh;
}
function prop_(k) { return PropertiesService.getScriptProperties().getProperty(k); }
function testMode_() { return String(prop_('TEST_MODE') || '').toLowerCase() === 'on'; }
function isOpen_() {
  var now = Date.now();
  return now >= Date.parse(CONFIG.OPEN_AT) && now < Date.parse(CONFIG.CLOSE_AT);
}
function json_(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
function clean_(s) {
  s = String(s == null ? '' : s).replace(/[\u0000-\u0009\u000B-\u001F\u007F]/g, '').trim();
  if (/^[=+\-@]/.test(s)) s = String.fromCharCode(39) + s; // 시트 수식 실행 방지 (앞에 작은따옴표 붙이기)
  return s;
}
function hasBad_(s) {
  var t = String(s).toLowerCase().replace(/[\s\.\,\-_~!@#\$%\^&\*\(\)0-9]/g, '');
  for (var i = 0; i < BAD_WORDS.length; i++) if (t.indexOf(BAD_WORDS[i]) > -1) return true;
  return false;
}
function rows_() {
  var sh = sheet_(), n = sh.getLastRow();
  if (n < 2) return [];
  return sh.getRange(2, 1, n - 1, 6).getValues().map(function (r, i) {
    return { row: i + 2, t: r[0] instanceof Date ? r[0].getTime() : Date.parse(r[0]), sid: String(r[1]), name: String(r[2]), msg: String(r[3]).replace(/^\x27/, ''), vis: String(r[4]) === 'Y', note: String(r[5] || '') };
  });
}

/* ---------- 공개: 축하 벽 ---------- */
function doGet(e) {
  var action = (e && e.parameter && e.parameter.action) || 'wall';
  if (action !== 'wall') return json_({ ok: false, error: 'unknown action' });
  var list = rows_().filter(function (r) { return r.vis; })
    .sort(function (a, b) { return b.t - a.t; })
    .slice(0, CONFIG.WALL_LIMIT)
    .map(function (r) { return { m: r.msg, t: r.t }; }); // 학번·이름은 절대 내보내지 않음
  return json_({ ok: true, open: isOpen_(), messages: list });
}

/* ---------- 접수 / 관리 ---------- */
function doPost(e) {
  var body;
  try { body = JSON.parse(e.postData.contents); } catch (err) { return json_({ ok: false, error: '요청 형식이 올바르지 않아요.' }); }
  if (body.type === 'submit') return submit_(body);
  if (body.type === 'admin') return admin_(body);
  return json_({ ok: false, error: 'unknown type' });
}

function submit_(b) {
  if (b.hp) return json_({ ok: true, hidden: true }); // 자동 입력 봇
  var test = testMode_() && b.test === true;
  if (!isOpen_() && !test) return json_({ ok: false, error: '지금은 생일 메시지 접수 기간이 아니에요. (11월 4일 ~ 11월 10일)' });
  var sid = String(b.sid || '').trim(), name = String(b.name || '').replace(/\s+/g, ''), msg = String(b.msg || '').trim();
  if (!/^[1-3][0-9]{4}$/.test(sid)) return json_({ ok: false, error: '학번 5자리를 확인해 주세요.' });
  if (!/^[가-힣a-zA-Z]{2,10}$/.test(name)) return json_({ ok: false, error: '이름을 정확히 써 주세요.' });
  if (msg.length < 2) return json_({ ok: false, error: '축하 메시지를 써 주세요.' });
  if (msg.length > CONFIG.MSG_MAX) msg = msg.slice(0, CONFIG.MSG_MAX);

  var lock = LockService.getScriptLock();
  try { lock.waitLock(10000); } catch (err) { return json_({ ok: false, error: '접속이 많아요. 잠시 후 다시 보내 주세요.' }); }
  try {
    var prev = rows_().filter(function (r) { return r.sid === sid; }).length;
    var bad = hasBad_(msg) || hasBad_(name);
    var notes = [];
    if (test) notes.push('테스트');
    if (prev) notes.push('중복 ' + (prev + 1) + '회째');
    if (bad) notes.push('비속어 의심');
    sheet_().appendRow([new Date(), sid, clean_(name), clean_(msg), bad ? 'N' : 'Y', notes.join(', ')]);
    return json_({ ok: true, hidden: bad });
  } finally { lock.releaseLock(); }
}

function admin_(b) {
  var key = prop_('ADMIN_KEY');
  if (!key) return json_({ ok: false, error: '스크립트 속성에 ADMIN_KEY가 설정되지 않았어요.' });
  if (String(b.key || '') !== key) { Utilities.sleep(800); return json_({ ok: false, error: '비밀번호가 맞지 않아요.' }); }
  if (b.op === 'list') return json_({ ok: true, open: isOpen_(), test: testMode_(), rows: rows_() });
  if (b.op === 'setVisible') {
    var row = Number(b.row);
    var sh = sheet_();
    if (!(row >= 2 && row <= sh.getLastRow())) return json_({ ok: false, error: '없는 행이에요.' });
    sh.getRange(row, 5).setValue(b.visible ? 'Y' : 'N');
    return json_({ ok: true });
  }
  return json_({ ok: false, error: 'unknown op' });
}

/* 시트 메뉴에서 한 번 실행하면 시트와 머리글이 만들어집니다. */
function setup() { sheet_(); }
