(function () {
  if (window.__DEMO_DIRECTOR__ || !window.DEMO_SCENARIOS) { return; }
  window.__DEMO_DIRECTOR__ = true;
  var KEY = 'ZL_DEMO_DIRECTOR_V1';
  var script = document.currentScript || (function () { var a = document.getElementsByTagName('script'); return a[a.length - 1]; })();
  var BASE = new URL('../', script.src).href;
  var IS_SCENARIOS = /\/scenarios\/(?:index\.html)?$/.test(location.pathname);
  var scs = window.DEMO_SCENARIOS || [];
  var state = null;
  try { state = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) {}
  function scById(id) { for (var i = 0; i < scs.length; i++) { if (scs[i].id === id) { return scs[i]; } } return null; }
  function hrefFor(step) {
    if (!step) { return BASE + 'scenarios/'; }
    return BASE + step.page + '/index.html' + (step.hash ? '#' + step.hash : '');
  }
  function save() {
    if (state) { localStorage.setItem(KEY, JSON.stringify(state)); } else { localStorage.removeItem(KEY); }
    if (state) {
      var sc = scById(state.scenario);
      if (sc) { try { sessionStorage.setItem('DEMO_CHAIN_BATCH', sc.batch); } catch (e) {} }
    }
  }
  function injectCss() {
    if (document.getElementById('dirCss')) { return; }
    var st = document.createElement('style');
    st.id = 'dirCss';
    st.textContent = [
      '#dirFab{position:fixed;left:16px;bottom:16px;z-index:78;display:inline-flex;align-items:center;gap:7px;border:1px solid #2A4D6E;background:#0B1B2E;color:#E8F1FA;border-radius:999px;padding:8px 12px;font:700 10px/1.2 -apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif;box-shadow:0 10px 28px rgba(3,15,32,.28);cursor:pointer}',
      '#dirFab i{width:6px;height:6px;border-radius:50%;background:#FBBF24;display:inline-block}',
      '#dirBar{position:fixed;left:16px;bottom:16px;z-index:80;width:min(760px,calc(100vw - 32px));background:linear-gradient(135deg,#08172A,#0D2B48);border:1px solid #2A4D6E;border-radius:13px;color:#E8F1FA;box-shadow:0 24px 60px rgba(2,10,24,.38);padding:11px 13px;display:none;font-family:-apple-system,BlinkMacSystemFont,"PingFang SC","Microsoft YaHei",sans-serif}',
      '#dirBar.show{display:block}',
      '.dir-top{display:flex;align-items:center;gap:7px;font-size:8.5px;color:#8FB7D8}.dir-top b{color:#FBBF24;font-size:8.5px;letter-spacing:.08em}.dir-top span{margin-left:auto;color:#9FB3C8}',
      '.dir-title{display:flex;justify-content:space-between;gap:8px;align-items:flex-start;margin-top:4px}.dir-title b{font-size:12px;color:#fff;line-height:1.45}.dir-title em{font-style:normal;font-size:8px;color:#93A9BF;white-space:nowrap}',
      '.dir-text{font-size:9px;line-height:1.65;color:#B9CCE0;margin:3px 0 6px}',
      '.dir-actions{display:flex;gap:5px;align-items:center;flex-wrap:wrap}.dir-actions button{border:1px solid #2A4D6E;background:#12314E;color:#D7E8F8;border-radius:6px;padding:5px 8px;font:inherit;font-size:8.5px;cursor:pointer}.dir-actions button.primary{background:#1466E8;border-color:#1466E8;color:#fff}.dir-actions button.ghost{background:transparent;color:#93A9BF}.dir-actions .dir-spacer{flex:1}',
      '.dir-progress{height:3px;background:#173653;border-radius:99px;overflow:hidden;margin:7px 0 6px}.dir-progress i{display:block;height:100%;background:#FBBF24;transition:.3s}',
      'body.dir-active{padding-bottom:112px}',
      '@media(max-width:520px){#dirFab{font-size:9px;padding:7px 10px}#dirBar{left:8px;right:8px;bottom:8px;width:auto;padding:9px}.dir-title b{font-size:11px}.dir-actions button{font-size:8px;padding:4px 6px}body.dir-active{padding-bottom:150px}}'
    ].join('');
    document.head.appendChild(st);
  }
  function ensure() {
    injectCss();
    if (!IS_SCENARIOS && !document.getElementById('dirFab')) {
      var fab = document.createElement('button');
      fab.id = 'dirFab';
      fab.type = 'button';
      fab.innerHTML = '<i></i><span>导演模式</span>';
      document.body.appendChild(fab);
      fab.onclick = function () {
        if (state) { renderBar(); } else { location.href = BASE + 'scenarios/'; }
      };
    }
    if (!document.getElementById('dirBar')) {
      var bar = document.createElement('div');
      bar.id = 'dirBar';
      document.body.appendChild(bar);
    }
  }
  function renderFab() {
    var fab = document.getElementById('dirFab');
    if (!fab) { return; }
    var sc = state && scById(state.scenario);
    fab.innerHTML = '<i></i><span>' + (sc ? '导演模式 · ' + (state.completed ? '已完成' : (state.step + 1) + '/' + sc.steps.length) : '场景演示') + '</span>';
    fab.style.display = (state && !state.closed) ? 'none' : 'inline-flex';
  }
  function renderBar() {
    ensure();
    var bar = document.getElementById('dirBar');
    var fab = document.getElementById('dirFab');
    if (!state) { bar.classList.remove('show'); document.body.classList.remove('dir-active'); renderFab(); return; }
    var sc = scById(state.scenario);
    if (!sc) { state = null; save(); renderBar(); return; }
    state.closed = false;
    var step = sc.steps[state.step] || null;
    var pct = state.completed ? 100 : Math.round((state.step + 1) / sc.steps.length * 100);
    var title = state.completed ? '演示完成：' + sc.title : (step ? step.title : sc.title);
    var text = state.completed ? '这条场景已走完。可以回到场景中心选择另一条，或重置演示状态。' : (step ? step.text : sc.subtitle);
    var role = step ? step.role : '';
    var sys = step ? step.system : '';
    bar.innerHTML = '<div class="dir-top"><b>DIRECTOR MODE / 导演模式</b><span>场景 ' + sc.no + ' / ' + scs.length + ' · ' + (state.step + 1) + ' / ' + sc.steps.length + '</span></div>' +
      '<div class="dir-title"><b>' + title + '</b><em>' + (sys ? sys + ' · ' : '') + (role || '演示') + '</em></div>' +
      '<div class="dir-progress"><i style="width:' + pct + '%"></i></div>' +
      '<div class="dir-text">' + text + '</div>' +
      '<div class="dir-actions"><button class="ghost" data-dir-prev>← 上一幕</button><button class="primary" data-dir-next>' + (state.completed ? '回到场景中心' : '下一幕 →') + '</button><button data-dir-sc>场景中心</button><div class="dir-spacer"></div><button class="ghost" data-dir-close>收起</button><button class="ghost" data-dir-reset>重置</button></div>';
    bar.classList.add('show');
    document.body.classList.add('dir-active');
    if (fab) { fab.style.display = 'none'; }
    bar.querySelector('[data-dir-close]').onclick = function () { state.closed = true; save(); bar.classList.remove('show'); document.body.classList.remove('dir-active'); renderFab(); };
    bar.querySelector('[data-dir-sc]').onclick = function () { location.href = BASE + 'scenarios/'; };
    bar.querySelector('[data-dir-reset]').onclick = function () { reset(); };
    var prev = bar.querySelector('[data-dir-prev]');
    var next = bar.querySelector('[data-dir-next]');
    prev.onclick = function () { if (state.step > 0) { state.step--; state.completed = false; state.closed = false; save(); location.href = hrefFor(sc.steps[state.step]); } };
    next.onclick = function () {
      if (state.completed) { location.href = BASE + 'scenarios/'; return; }
      if (state.step < sc.steps.length - 1) { state.step++; state.closed = false; save(); location.href = hrefFor(sc.steps[state.step]); }
      else { state.completed = true; save(); renderBar(); }
    };
    renderFab();
  }
  function start(id, step) {
    var sc = scById(id); if (!sc) { return; }
    state = { scenario: id, step: step || 0, closed: false, completed: false, startedAt: Date.now() };
    save(); location.href = hrefFor(sc.steps[state.step]);
  }
  function reset() {
    state = null; save();
    try { sessionStorage.removeItem('DEMO_CHAIN_BATCH'); } catch (e) {}
    location.href = BASE + 'scenarios/';
  }
  window.DirectorMode = { start: start, reset: reset, stop: reset, scenarios: scs, get: function () { return state; }, base: BASE, hrefFor: function (id, n) { var s = scById(id); return s ? hrefFor(s.steps[n || 0]) : BASE + 'scenarios/'; } };
  document.addEventListener('DOMContentLoaded', function () {
    ensure();
    renderBar();
    if (!state) { renderFab(); }
    document.addEventListener('keydown', function (e) {
      if (!state || e.target && /INPUT|TEXTAREA|SELECT/.test(e.target.tagName)) { return; }
      if (e.key === 'ArrowRight') { var b = document.querySelector('#dirBar [data-dir-next]'); if (b) { b.click(); } }
      if (e.key === 'ArrowLeft') { var p = document.querySelector('#dirBar [data-dir-prev]'); if (p) { p.click(); } }
    });
  });
})();
