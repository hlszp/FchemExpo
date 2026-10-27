(function () {
  var BATCH = 'LX-BIT-2610136A1';
  var CHAIN = {
    batch: BATCH, product: 'BIT', area: 'A01', loop: 'A01-TIC-1203',
    title: '同批号贯穿演示',
    note: '跨系统演示映射：同一批号 LX-BIT-2610136A1 / 同一装置 A01 / 同一回路 A01-TIC-1203。各系统数据为演示合成，用于说明数据链，不写回真实系统。',
    nodes: [
      { key: 'ipae', name: 'iPAE', title: '批次异常', href: '/demo/app/ipae/#batch', detail: 'OP30 升温偏长 / 越界率 12.6%', color: '#0069AE' },
      { key: 'iaas', name: 'iAAS', title: '报警', href: '/demo/app/iaas/#realtime', detail: 'A01-TIC-1203 反应温度高 · 连续 3 次', color: '#0B9A78' },
      { key: 'iclpm', name: 'iCLPM', title: '回路', href: '/demo/app/iclpm/#loops', detail: 'A01-TIC-1203 评分 18.4 · 振荡/黏滞', color: '#0B9A78' },
      { key: 'imcs', name: 'iMCS', title: '电子批记录', href: '/demo/app/imcs/#ebr', detail: BATCH + ' · 收率 127.34%', color: '#D97706' }
    ]
  };
  window.DEMO_CHAIN = CHAIN;
  var STORE = 'DEMO_CHAIN_BATCH';

  function current() {
    var p = location.pathname;
    if (p.indexOf('/ipae/') >= 0) { return 'ipae'; }
    if (p.indexOf('/iaas/') >= 0) { return 'iaas'; }
    if (p.indexOf('/iclpm/') >= 0) { return 'iclpm'; }
    if (p.indexOf('/imcs/') >= 0) { return 'imcs'; }
    return '';
  }
  function esc(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function chainHref(href) { return location.protocol === 'file:' ? href.replace('/demo/app/', '../') : href; }
  function ensure() {
    if (document.getElementById('chainStyle')) { return; }
    var st = document.createElement('style');
    st.id = 'chainStyle';
    st.textContent = [
      '.chain-fab{position:fixed;right:18px;bottom:18px;z-index:900;border:1px solid #BFD2EA;background:#fff;color:#0B4EA2;border-radius:999px;padding:8px 12px;font:inherit;font-size:11px;font-weight:800;box-shadow:0 8px 24px rgba(15,23,42,.14);cursor:pointer;display:flex;align-items:center;gap:7px}',
      '.chain-fab i{width:7px;height:7px;border-radius:50%;background:#0B9A78;box-shadow:0 0 0 3px #DCFCE7;display:inline-block}',
      '.chain-fab:hover{background:#F3F8FF}',
      '.chain-context{display:flex;align-items:center;gap:8px;flex-wrap:wrap;background:#EEF6FF;border:1px solid #CFE0FB;border-radius:9px;padding:7px 10px;margin-bottom:10px;font-size:11px;color:#0B4EA2}',
      '.chain-context b{font-weight:800}.chain-context .sub{color:#64748B;font-size:10px}',
      '.chain-context button{margin-left:auto;border:1px solid #BFD2EA;background:#fff;border-radius:6px;padding:4px 8px;font-size:10px;color:#0B4EA2;cursor:pointer}',
      '.chain-overlay{position:fixed;inset:0;z-index:1200;display:none;align-items:center;justify-content:center;padding:18px;background:rgba(8,20,38,.55);backdrop-filter:blur(2px)}',
      '.chain-overlay.show{display:flex}',
      '.chain-card{width:min(860px,96vw);max-height:90vh;overflow:auto;background:#fff;border-radius:14px;box-shadow:0 24px 80px rgba(2,10,24,.35);border:1px solid #DCE6F2}',
      '.chain-head{display:flex;align-items:flex-start;gap:10px;padding:14px 16px;border-bottom:1px solid #EEF2F7;background:linear-gradient(135deg,#F8FBFF,#EEF5FF)}',
      '.chain-head h3{margin:0;font-size:15px;color:#0F172A}.chain-head p{margin:3px 0 0;font-size:10.5px;color:#64748B}',
      '.chain-close{margin-left:auto;border:0;background:#fff;border:1px solid #DCE6F2;border-radius:7px;width:28px;height:28px;font-size:16px;line-height:1;color:#64748B;cursor:pointer}',
      '.chain-body{padding:14px 16px 16px}',
      '.chain-step{display:grid;grid-template-columns:30px 1fr auto;gap:9px;align-items:center;border:1px solid #E6EDF5;border-radius:9px;padding:9px 10px;margin-bottom:7px;background:#fff}',
      '.chain-step.on{border-color:#9CC3F5;background:#F6FAFF}',
      '.chain-num{width:26px;height:26px;border-radius:50%;background:#EAF2FF;color:#0B4EA2;font-size:10px;font-weight:800;display:flex;align-items:center;justify-content:center}',
      '.chain-step.on .chain-num{background:#1466E8;color:#fff}',
      '.chain-step h4{margin:0;font-size:12px;color:#0F172A}.chain-step p{margin:3px 0 0;font-size:10.5px;color:#64748B}',
      '.chain-go{border:1px solid #BFD2EA;background:#fff;border-radius:6px;padding:5px 9px;font-size:10px;color:#0B4EA2;text-decoration:none;white-space:nowrap}',
      '.chain-step.on .chain-go{background:#1466E8;color:#fff;border-color:#1466E8}',
      '.chain-note{font-size:10px;color:#94A3B8;line-height:1.65;margin-top:8px}',
      '@media(max-width:600px){.chain-fab{right:10px;bottom:10px;font-size:10px;padding:7px 10px}.chain-step{grid-template-columns:26px 1fr}.chain-go{grid-column:2;justify-self:start}.chain-head{padding:12px}.chain-body{padding:10px}}'
    ].join('');
    document.head.appendChild(st);
  }
  function banner() {
    if (!sessionStorage.getItem(STORE)) { return; }
    var page = document.getElementById('page');
    if (!page || page.querySelector('.chain-context')) { return; }
    var cur = current();
    var label = cur ? (CHAIN.nodes.filter(function (n) { return n.key === cur; })[0] || {}).name : '';
    var d = document.createElement('div');
    d.className = 'chain-context';
    d.innerHTML = '<b>贯穿批次 ' + esc(BATCH) + '</b><span class="sub">当前系统 ' + esc(label || '演示') + ' · 同批号/同装置/同回路</span><button type="button" data-chain-open>打开链路 →</button>';
    page.insertBefore(d, page.firstChild);
  }
  function overlay() {
    if (!document.getElementById('chainOverlay')) {
      var cur = current();
      var steps = CHAIN.nodes.map(function (n, i) {
        return '<div class="chain-step ' + (n.key === cur ? 'on' : '') + '"><div class="chain-num">0' + (i + 1) + '</div><div><h4>' + esc(n.name) + ' · ' + esc(n.title) + '</h4><p>' + esc(n.detail) + '</p></div><a class="chain-go" href="' + chainHref(n.href) + '" data-chain-link="' + n.key + '">进入 ' + esc(n.name) + ' →</a></div>';
      }).join('');
      var o = document.createElement('div');
      o.id = 'chainOverlay';
      o.className = 'chain-overlay';
      o.innerHTML = '<div class="chain-card"><div class="chain-head"><div><h3>' + CHAIN.title + ' · ' + esc(BATCH) + '</h3><p>同一批号从批次异常走到报警、回路、电子批记录</p></div><button class="chain-close" type="button" data-chain-close>×</button></div><div class="chain-body">' + steps + '<div class="chain-note">' + esc(CHAIN.note) + '</div></div></div>';
      document.body.appendChild(o);
      o.addEventListener('click', function (e) { if (e.target === o || e.target.closest('[data-chain-close]')) { o.classList.remove('show'); } });
      o.querySelectorAll('[data-chain-link]').forEach(function (a) {
        a.addEventListener('click', function () { sessionStorage.setItem(STORE, BATCH); });
      });
    }
    document.getElementById('chainOverlay').classList.add('show');
  }
  function fab() {
    if (document.getElementById('chainFab')) { return; }
    var b = document.createElement('button');
    b.id = 'chainFab'; b.className = 'chain-fab'; b.type = 'button';
    b.innerHTML = '<i></i>同批号贯穿 · ' + esc(BATCH);
    b.addEventListener('click', overlay);
    document.body.appendChild(b);
  }
  function bind() {
    document.addEventListener('click', function (e) {
      if (e.target.closest('[data-chain-open]')) { e.preventDefault(); overlay(); }
    });
  }
  function tick() { ensure(); fab(); bind(); banner(); }
  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', tick); } else { tick(); }
  var mo = new MutationObserver(function () { banner(); });
  document.addEventListener('DOMContentLoaded', function () { var p = document.getElementById('page'); if (p) { mo.observe(p, { childList: true }); } });
  window.openChain = overlay;
})();
