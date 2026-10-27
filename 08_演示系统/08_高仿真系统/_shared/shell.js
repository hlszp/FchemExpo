/* 致联高仿真演示 · 统一壳层 · 2026-10-27 */
(function () {
  var S = {};
  var cfg = null;
  var active = null;
  var insight = null;
  var aiMode = 'analysis';
  var chatHistory = [];
  var chatBusy = false;
  var aiReturnMode = 'analysis';
  var pageEl, crumbEl, aiDrawer, detailDrawer, overlay, toastRoot;

  function qs(sel, root) { return (root || document).querySelector(sel); }
  function qsa(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  function esc(v) {
    return String(v == null ? '' : v).replace(/[&<>"']/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c];
    });
  }
  function pad(n) { return n < 10 ? '0' + n : '' + n; }
  function hm(d) { return pad(d.getHours()) + ':' + pad(d.getMinutes()); }
  function nowText(d) {
    d = d || new Date();
    var wk = ['日', '一', '二', '三', '四', '五', '六'][d.getDay()];
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' 星期' + wk + ' ' + hm(d) + ':' + pad(d.getSeconds());
  }
  function icon(name, cls) {
    var p = {
      dashboard: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      plan: '<rect x="3" y="4" width="18" height="17" rx="2"/><path d="M8 2v4M16 2v4M3 10h18M8 14h3M8 17h7"/>',
      play: '<circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4Z"/>',
      quality: '<path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
      material: '<path d="m21 8-9-5-9 5 9 5 9-5Z"/><path d="m3 8 9 5 9-5v8l-9 5-9-5V8Z"/><path d="M12 13v8"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h6"/>',
      settings: '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.6 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.6a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1Z"/>',
      spark: '<path d="M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8L19 15Z"/>',
      search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/>',
      close: '<path d="M6 6l12 12M18 6 6 18"/>',
      bell: '<path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9"/><path d="M10 21h4"/>',
      menu: '<path d="M4 6h16M4 12h16M4 18h16"/>',
      chevron: '<path d="m9 18 6-6-6-6"/>'
    }[name] || '';
    return '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" class="' + (cls || '') + '" aria-hidden="true">' + p + '</svg>';
  }

  /* ---------- charts ---------- */
  function bars(data, opts) {
    opts = opts || {};
    var w = 520, h = opts.height || 210, padL = 34, padR = 10, padT = 14, padB = 26;
    var max = Math.max.apply(null, data.map(function (d) { return Math.max(d.value, d.value2 || 0); })) || 1;
    max = Math.ceil(max * 1.15 / 10) * 10;
    var iw = w - padL - padR, ih = h - padT - padB;
    var bw = iw / data.length * 0.46;
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img">';
    for (var g = 0; g <= 4; g++) {
      var gy = padT + ih - ih * g / 4;
      s += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="#EEF2F7" stroke-width="1"/>';
      s += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" text-anchor="end" font-size="9" fill="#94A3B8">' + Math.round(max * g / 4) + '</text>';
    }
    data.forEach(function (d, i) {
      var cx = padL + (iw / data.length) * (i + 0.5);
      var bh = Math.max(2, d.value / max * ih);
      var y = padT + ih - bh;
      s += '<rect x="' + (cx - bw - 2) + '" y="' + y + '" width="' + bw + '" height="' + bh + '" rx="3" fill="' + (opts.color || '#1466E8') + '" opacity=".9"/>';
      if (d.value2 != null) {
        var bh2 = Math.max(2, d.value2 / max * ih);
        s += '<rect x="' + (cx + 2) + '" y="' + (padT + ih - bh2) + '" width="' + bw + '" height="' + bh2 + '" rx="3" fill="#0EA5E9" opacity=".42"/>';
      }
      s += '<text x="' + cx + '" y="' + (h - 8) + '" text-anchor="middle" font-size="9" fill="#94A3B8">' + esc(d.label) + '</text>';
    });
    if (opts.target) {
      var ty = padT + ih - (opts.target / max * ih);
      s += '<line x1="' + padL + '" y1="' + ty + '" x2="' + (w - padR) + '" y2="' + ty + '" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="4 4"/>';
      s += '<text x="' + (w - padR) + '" y="' + (ty - 4) + '" text-anchor="end" font-size="9" fill="#B45309">目标 ' + opts.target + '</text>';
    }
    s += '</svg>';
    return s;
  }

  function line(data, opts) {
    opts = opts || {};
    var w = 520, h = opts.height || 210, padL = 34, padR = 12, padT = 16, padB = 26;
    var min = Math.min.apply(null, data), max = Math.max.apply(null, data);
    if (opts.min != null) min = Math.min(min, opts.min);
    if (opts.max != null) max = Math.max(max, opts.max);
    var span = (max - min) || 1;
    var iw = w - padL - padR, ih = h - padT - padB;
    function x(i) { return padL + (iw / Math.max(1, data.length - 1)) * i; }
    function y(v) { return padT + ih - ((v - min) / span) * ih; }
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img">';
    for (var g = 0; g <= 4; g++) {
      var gy = padT + ih - ih * g / 4;
      s += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="#EEF2F7" stroke-width="1"/>';
      s += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" text-anchor="end" font-size="9" fill="#94A3B8">' + (min + span * g / 4).toFixed(opts.fixed == null ? 0 : opts.fixed) + '</text>';
    }
    var pts = data.map(function (v, i) { return x(i) + ',' + y(v); }).join(' ');
    s += '<polyline points="' + pts + '" fill="none" stroke="' + (opts.color || '#0B9A78') + '" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/>';
    s += '<polygon points="' + padL + ',' + (padT + ih) + ' ' + pts + ' ' + (w - padR) + ',' + (padT + ih) + '" fill="' + (opts.color || '#0B9A78') + '" opacity=".08"/>';
    data.forEach(function (v, i) {
      s += '<circle cx="' + x(i) + '" cy="' + y(v) + '" r="2.8" fill="#fff" stroke="' + (opts.color || '#0B9A78') + '" stroke-width="1.6"/>';
    });
    if (opts.labels) {
      opts.labels.forEach(function (l, i) {
        s += '<text x="' + x(i) + '" y="' + (h - 8) + '" text-anchor="middle" font-size="9" fill="#94A3B8">' + esc(l) + '</text>';
      });
    }
    if (opts.target != null) {
      var ty = y(opts.target);
      s += '<line x1="' + padL + '" y1="' + ty + '" x2="' + (w - padR) + '" y2="' + ty + '" stroke="#F59E0B" stroke-width="1.2" stroke-dasharray="4 4"/>';
    }
    s += '</svg>';
    return s;
  }

  function donut(data, centerTop, centerBottom) {
    var total = data.reduce(function (a, b) { return a + b.value; }, 0) || 1;
    var r = 42, c = 2 * Math.PI * r, off = 0;
    var s = '<div class="donut-wrap"><div style="position:relative;width:120px;height:120px;flex:0 0 120px">';
    s += '<svg viewBox="0 0 120 120" width="120" height="120">';
    s += '<circle cx="60" cy="60" r="42" fill="none" stroke="#EEF2F7" stroke-width="14"/>';
    data.forEach(function (d, i) {
      var len = d.value / total * c;
      s += '<circle cx="60" cy="60" r="42" fill="none" stroke="' + d.color + '" stroke-width="14" stroke-dasharray="' + len + ' ' + (c - len) + '" stroke-dashoffset="' + (-off) + '" transform="rotate(-90 60 60)" stroke-linecap="butt"/>';
      off += len;
    });
    s += '</svg>';
    s += '<div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><b style="font-size:23px;font-weight:900;line-height:1.1">' + esc(centerTop) + '</b><span style="font-size:10px;color:#64748B">' + esc(centerBottom || '') + '</span></div></div>';
    s += '<div class="legend" style="display:grid;gap:6px;margin:0">';
    data.forEach(function (d) {
      s += '<span style="display:flex;justify-content:space-between;gap:14px;min-width:120px"><span><i style="background:' + d.color + '"></i>' + esc(d.label) + '</span><b style="color:#334155">' + d.value + '</b></span>';
    });
    s += '</div></div>';
    return s;
  }

  function spark(values, color) {
    var max = Math.max.apply(null, values), min = Math.min.apply(null, values), span = (max - min) || 1;
    var pts = values.map(function (v, i) {
      var x = 2 + (76 / Math.max(1, values.length - 1)) * i;
      var y = 24 - ((v - min) / span) * 20;
      return x.toFixed(1) + ',' + y.toFixed(1);
    }).join(' ');
    return '<svg viewBox="0 0 80 28" width="80" height="28" aria-hidden="true"><polyline points="' + pts + '" fill="none" stroke="' + (color || '#1466E8') + '" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  }

  S.qs = qs; S.qsa = qsa; S.esc = esc; S.icon = icon; S.nowText = nowText;
  S.chart = { bars: bars, line: line, donut: donut, spark: spark };

  /* ---------- layout ---------- */
  function navHtml(nav) {
    return nav.map(function (group) {
      return '<div class="sb-group">' + esc(group.group) + '</div>' + group.items.map(function (it) {
        return '<a class="sb-item" href="#' + esc(it.id) + '" data-nav="' + esc(it.id) + '">' + icon(it.icon || 'dashboard') + '<span>' + esc(it.label) + '</span>' + (it.badge ? '<span class="badge">' + esc(it.badge) + '</span>' : '') + '</a>';
      }).join('');
    }).join('');
  }

  S.boot = function (config) {
    cfg = config;
    document.title = cfg.name + ' · 高仿真演示 · 致联信息';
    var layout = '';
    layout += '<div class="layout">';
    layout += '<aside class="sidebar" id="sidebar">';
    layout += '<div class="sb-brand"><div class="logo"><div class="mark">' + esc(cfg.mark || cfg.code.slice(0, 2)) + '</div><div><b>' + esc(cfg.code) + ' ' + esc(cfg.brandName || cfg.name) + '</b><span>' + esc(cfg.subtitle || '') + '</span></div></div></div>';
    layout += '<div class="sb-workspace"><span>' + esc(cfg.workspace || '演示环境') + '</span><em>高仿真</em></div>';
    layout += '<nav class="sb-nav">' + navHtml(cfg.nav) + '</nav>';
    layout += '<div class="sb-foot"><b>致联信息 · 高仿真演示</b><br>v1.0 · ' + esc(cfg.date || '2026-10-27') + '<br>数据为演示合成数据</div>';
    layout += '</aside>';
    layout += '<div class="main">';
    layout += '<header class="topbar"><button class="mobile-toggle" id="mobileToggle" aria-label="菜单">' + icon('menu') + '</button>';
    layout += '<div class="crumb" id="crumb"></div>';
    layout += '<div class="search">' + icon('search') + '<input id="globalSearch" placeholder="' + esc(cfg.searchPlaceholder || '搜索工单 / 批次 / 物料') + '" aria-label="搜索"></div>';
    layout += '<div class="top-clock" id="clock">' + nowText() + '</div>';
    layout += '<button class="ai-btn" id="btnAI" type="button">' + icon('spark', 'spark') + 'AI 助手</button>';
    layout += '<div class="avatar">' + esc(cfg.user || '张') + '</div>';
    layout += '</header>';
    layout += '<main class="page" id="page"></main>';
    layout += '</div></div>';
    layout += '<div class="overlay" id="overlay"></div>';
    layout += '<aside class="drawer ai-drawer" id="aiDrawer" aria-label="AI 分析洞察"><div class="drawer-h"><div><h3>AI 分析洞察</h3><p>基于当前页面数据 · 可对话</p></div><button class="close" data-close="ai" aria-label="关闭">×</button></div><div class="ai-tabs" id="aiTabs"><button type="button" data-ai-tab="analysis" class="on">分析洞察</button><button type="button" data-ai-tab="chat">自然语言对话</button></div><div class="drawer-b" id="aiBody"></div><div class="ai-chat" id="aiChat"><div class="ai-chat-head"><span>基于当前页面数据提问</span><button type="button" class="mini-btn" id="aiChatSettings">AI 设置</button><button type="button" class="mini-btn" id="aiChatClear">清空</button></div><div class="ai-chat-log" id="aiChatLog"></div><div class="ai-suggest" id="aiSuggest"></div><div class="ai-composer"><textarea id="aiChatInput" rows="2" placeholder="例如：这个批次为什么收率偏高？下一步该做什么？"></textarea><button class="btn ai" id="aiChatSend" type="button">发送</button></div></div><div class="drawer-f"><button class="btn" data-close="ai">关闭</button><button class="btn ai" id="btnRegenerate">' + icon('spark') + '重新生成</button></div></aside>';
    layout += '<aside class="drawer" id="detailDrawer" aria-label="详情"><div class="drawer-h"><div><h3 id="detailTitle">详情</h3><p id="detailSub"></p></div><button class="close" data-close="detail" aria-label="关闭">×</button></div><div class="drawer-b" id="detailBody"></div><div class="drawer-f"><button class="btn" data-close="detail">关闭</button></div></aside>';
    layout += '<div class="toast-root" id="toastRoot"></div>';
    document.body.innerHTML = layout;
    pageEl = qs('#page'); crumbEl = qs('#crumb'); aiDrawer = qs('#aiDrawer'); detailDrawer = qs('#detailDrawer'); overlay = qs('#overlay'); toastRoot = qs('#toastRoot');

    qsa('[data-nav]').forEach(function (a) {
      a.addEventListener('click', function (e) { e.preventDefault(); S.go(a.getAttribute('data-nav')); });
    });
    qs('#mobileToggle').addEventListener('click', function () { qs('#sidebar').classList.toggle('open'); });
    qs('#btnAI').addEventListener('click', function () { S.openAI('chat'); });
    qs('#btnRegenerate').addEventListener('click', function () { regenerateAI(); });
    bindAIChat();
    qsa('[data-close]').forEach(function (b) {
      b.addEventListener('click', function () {
        if (b.getAttribute('data-close') === 'ai') { closeAI(); } else { closeDetail(); }
      });
    });
    overlay.addEventListener('click', function () { closeAI(); closeDetail(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') { closeAI(); closeDetail(); } });
    document.addEventListener('click', function (e) {
      var t = e.target.closest ? e.target.closest('[data-ai-open]') : null;
      if (t) { S.openAI('analysis'); }
    });
    qs('#globalSearch').addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { S.toast('<b>演示搜索</b>：已模拟检索「' + esc(e.target.value || '全部') + '」'); }
    });
    setInterval(function () { var c = qs('#clock'); if (c) { c.textContent = nowText(); } }, 1000);
    window.addEventListener('hashchange', function () { var id = location.hash.replace('#', ''); if (id && cfg.pages[id] && id !== active) { S.go(id); } });
    var initial = location.hash.replace('#', '');
    if (!initial || !cfg.pages[initial]) { initial = cfg.defaultPage; }
    S.go(initial);
  };

  S.go = function (id) {
    if (!cfg || !cfg.pages[id]) { id = cfg.defaultPage; }
    active = id;
    var page = cfg.pages[id];
    if (location.hash !== '#' + id) { history.replaceState(null, '', '#' + id); }
    qsa('[data-nav]').forEach(function (a) { a.classList.toggle('active', a.getAttribute('data-nav') === id); });
    crumbEl.innerHTML = '<span>' + esc(cfg.code) + '</span><i>/</i><b>' + esc(page.crumb || page.title) + '</b>';
    pageEl.innerHTML = page.render();
    if (page.bind) { page.bind(); }
    insight = typeof page.insight === 'function' ? page.insight() : (page.insight || null);
    qs('#btnAI').style.display = insight ? '' : 'none';
    closeAI(); closeDetail();
    window.scrollTo(0, 0);
    qs('#sidebar').classList.remove('open');
  };

  S.rerender = function () { if (active) { S.go(active); } };
  S.current = function () { return active; };
  S.setInsight = function (obj) { insight = obj; };
  S.toast = function (html) {
    var el = document.createElement('div'); el.className = 'toast'; el.innerHTML = html;
    toastRoot.appendChild(el);
    setTimeout(function () { el.classList.add('show'); }, 10);
    setTimeout(function () { el.classList.remove('show'); setTimeout(function () { el.remove(); }, 250); }, 2600);
  };
  S.detail = function (title, sub, body) {
    qs('#detailTitle').textContent = title || '详情';
    qs('#detailSub').textContent = sub || '';
    qs('#detailBody').innerHTML = body || '';
    detailDrawer.classList.add('show'); overlay.classList.add('show');
  };
  function closeDetail() { detailDrawer.classList.remove('show'); if (!aiDrawer.classList.contains('show')) { overlay.classList.remove('show'); } }
  S.closeDetail = closeDetail;
  function closeAI() { aiDrawer.classList.remove('show'); if (!detailDrawer.classList.contains('show')) { overlay.classList.remove('show'); } }
  S.closeAI = closeAI;

  var AI_CFG_KEY = 'ZL_DEMO_AI_CONFIG';
  function readAIConfig() {
    var c = { endpoint: 'https://api.deepseek.com/chat/completions', model: 'deepseek-chat', key: '' };
    try {
      var raw = localStorage.getItem(AI_CFG_KEY);
      if (raw) { var o = JSON.parse(raw); c.endpoint = o.endpoint || c.endpoint; c.model = o.model || c.model; c.key = o.key || ''; }
    } catch (e) {}
    return c;
  }
  function saveAIConfig(c) { try { localStorage.setItem(AI_CFG_KEY, JSON.stringify(c)); } catch (e) {} }
  function stripHtml(v) { return String(v == null ? '' : v).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim(); }
  function currentPageName() { return active || (cfg && cfg.defaultPage) || '当前页面'; }
  function chainContext() {
    var c = window.DEMO_CHAIN;
    if (!c) { return ''; }
    return '贯穿批号：' + c.batch + '；装置：' + c.area + '；回路：' + c.loop + '。链路：' + c.nodes.map(function (n) { return n.name + '(' + n.title + ')'; }).join(' → ') + '。';
  }
  function aiPrompt() {
    var o = insight || {};
    return [
      '你是精细化工生产数字化演示系统的分析助手。请严格基于下列页面数据回答，不要编造未给出的数值。',
      '当前产品/页面：' + (cfg ? cfg.code + ' ' + cfg.name : '') + ' / ' + currentPageName(),
      '页面一句话结论：' + stripHtml(o.summary || ''),
      '关键发现：' + (o.findings || []).map(stripHtml).join('；'),
      '建议动作：' + (o.actions || []).map(stripHtml).join('；'),
      '依据：' + (o.evidence || []).join('；'),
      chainContext(),
      '请用中文输出四段：1）一句话判断；2）关键发现（2-3 条，带数字）；3）建议动作（2-3 条，按优先级）；4）依据与边界（注明演示数据）。不要使用 Markdown 表格，控制在 450 字以内。'
    ].join('\n');
  }
  function aiLoading(text) { qs('#aiBody').innerHTML = '<div class="ai-loading"><span class="spinner"></span>' + esc(text) + '</div>'; }
  function aiLiveHtml(text, model) {
    return '<div class="ai-meta"><span class="tag" style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0">DeepSeek · ' + esc(model) + '</span><span class="tag gray">真实 AI 生成</span></div><div class="ai-live-text">' + esc(text).replace(/\n/g, '<br>') + '</div><div class="ai-note">由 DeepSeek API 基于当前页面数据生成；Key 仅保存在本机浏览器 localStorage。直连失败时请检查 CORS / 网络 / Key。</div><div class="ai-meta" style="margin-top:10px"><button class="btn small" id="aiCfgBtn">AI 设置</button><button class="btn small" id="aiLocalBtn">回到演示规则</button></div>';
  }
  function bindAIButtons() {
    var c = qs('#aiCfgBtn'); if (c) { c.onclick = function () { aiSettings(); }; }
    var l = qs('#aiLiveBtn'); if (l) { l.onclick = function () { callLiveAI(); }; }
    var b = qs('#aiLocalBtn'); if (b) { b.onclick = function () { S.openAI(); }; }
  }
  function aiSettings() {
    aiReturnMode = aiMode;
    setAITab('analysis');
    var c = readAIConfig();
    qs('#aiBody').innerHTML = '<div class="ai-block"><h4>DeepSeek 接入设置</h4><div class="ai-note">API Key 仅保存到本机 localStorage，不写入源码/仓库。Base URL 可填 https://api.deepseek.com，也可填完整 .../chat/completions；浏览器直连可能受 CORS 限制，失败时可改用同域代理。</div><div class="ai-form"><label>API Key<input id="aiKey" type="password" autocomplete="off" value="' + esc(c.key) + '" placeholder="sk-..."></label><label>模型<input id="aiModel" value="' + esc(c.model) + '"></label><label>Base URL / 接口地址<input id="aiEndpoint" value="' + esc(c.endpoint) + '" placeholder="https://api.deepseek.com 或 .../chat/completions"></label><div class="ai-note">支持填 Base URL（如 https://api.deepseek.com）或完整 chat/completions 地址，程序会自动补齐。</div><button class="btn ai" id="aiSave">保存配置</button><button class="btn" id="aiCancel">返回演示分析</button></div></div>';
    var save = qs('#aiSave');
    if (save) { save.onclick = function () { var key = qs('#aiKey').value.trim(); saveAIConfig({ key: key, model: qs('#aiModel').value.trim() || 'deepseek-chat', endpoint: qs('#aiEndpoint').value.trim() || 'https://api.deepseek.com/chat/completions' }); S.toast(key ? '<b>DeepSeek</b>：配置已保存（仅本机）' : '<b>DeepSeek</b>：已清空 Key，使用演示规则'); S.openAI(aiReturnMode); }; }
    var cancel = qs('#aiCancel'); if (cancel) { cancel.onclick = function () { S.openAI(aiReturnMode); }; }
  }
  function callLiveAI() {
    var c = readAIConfig();
    if (!c.key) { aiSettings(); S.toast('<b>DeepSeek</b>：请先配置 API Key'); return; }
    aiLoading('正在调用 DeepSeek · ' + c.model + ' …');
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 25000) : null;
    fetch(chatEndpoint(c), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key },
      body: JSON.stringify({ model: c.model, messages: [{ role: 'system', content: '你是精细化工生产数据分析助手，回答必须基于给定数据，简洁、可执行。' }, { role: 'user', content: aiPrompt() }], temperature: 0.3, stream: false }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) { return res.text().then(function (t) { throw new Error('HTTP ' + res.status + '：' + t.slice(0, 220)); }); }
      return res.json();
    }).then(function (data) {
      if (timer) { clearTimeout(timer); }
      var txt = data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
      if (!txt) { throw new Error('返回为空'); }
      qs('#aiBody').innerHTML = aiLiveHtml(txt, c.model);
      bindAIButtons();
      S.toast('<b>DeepSeek</b>：真实 AI 已生成');
    }).catch(function (err) {
      if (timer) { clearTimeout(timer); }
      var msg = err && err.name === 'AbortError' ? '请求超时（25s）' : (err && err.message ? err.message : '网络错误');
      qs('#aiBody').innerHTML = insightHtml(insight) + '<div class="ai-note" style="color:#B91C1C">DeepSeek 调用失败：' + esc(msg) + '。已保留演示规则结果；请检查 Key / CORS / 网络，或改为同域代理。</div>';
      bindAIButtons();
    });
  }

  function chatEndpoint(c) {
    var u = String(c.endpoint || 'https://api.deepseek.com/chat/completions').trim().replace(/\/+$/, '');
    if (!u) { u = 'https://api.deepseek.com/chat/completions'; }
    if (!/\/chat\/completions$/.test(u)) { u += '/chat/completions'; }
    return u;
  }
  function chatDataText() {
    var el = qs('#page');
    var txt = el ? (el.innerText || '').replace(/\s+/g, ' ').trim() : '';
    return txt.length > 6500 ? txt.slice(0, 6500) + ' …（已截断）' : txt;
  }
  function chatSystemPrompt() {
    var o = insight || {};
    var chain = window.DEMO_CHAIN;
    var lines = [
      '你是致联信息精细化工演示系统的数据分析助手，正在和现场工程师对话。',
      '当前系统：' + (cfg ? cfg.code + ' ' + cfg.name : '高仿真演示') + '；当前页面：' + (active || (cfg && cfg.defaultPage) || '') + '。',
      '页面一句话结论：' + stripHtml(o.summary || '（无）'),
      '关键发现：' + (o.findings || []).map(stripHtml).join('；'),
      '建议动作：' + (o.actions || []).map(stripHtml).join('；'),
      '当前页面可见数据：' + chatDataText(),
      chain ? '跨系统任务链：批号 ' + chain.batch + '，装置 ' + chain.area + '，回路 ' + chain.loop + '；节点 ' + chain.nodes.map(function (n) { return n.name + '(' + n.title + ')'; }).join(' → ') + '。' : '',
      '回答规则：只依据以上页面数据和对话历史回答；引用具体数字；不确定就明确说不确定；不要编造系统里没有的数据；中文回答，先给结论，再给 2-3 条依据/建议；控制在 350 字以内；明确这是演示数据。'
    ];
    return lines.filter(Boolean).join('\n');
  }
  function chatWelcomeHtml() {
    return '<div class="ai-chat-welcome"><div class="ai-chat-avatar">AI</div><div><b>可以基于当前页面数据直接问</b><p>例如：这个批次为什么收率偏高？当前最该先处理什么？这些数据能支持什么结论？</p><div class="ai-chat-chips"><span>' + esc((cfg ? cfg.code : '') + ' · ' + (active || '')) + '</span><span>演示数据 + 页面上下文</span></div></div></div>';
  }
  function renderChat() {
    var log = qs('#aiChatLog');
    if (!log) { return; }
    var h = chatWelcomeHtml();
    chatHistory.forEach(function (m) {
      h += '<div class="ai-msg ' + (m.role === 'user' ? 'user' : 'assistant') + '"><div class="who">' + (m.role === 'user' ? '你' : 'AI') + '</div><div class="bubble">' + esc(m.content).replace(/\n/g, '<br>') + '</div></div>';
    });
    if (chatBusy) { h += '<div class="ai-msg assistant"><div class="who">AI</div><div class="bubble"><span class="ai-typing"><i></i><i></i><i></i></span> 正在基于当前页面数据思考…</div></div>'; }
    log.innerHTML = h;
    var c = readAIConfig();
    var sg = qs('#aiSuggest');
    if (sg) {
      var sugg = ['当前页面最关键的异常是什么？', '给我 3 条可执行的处置建议', '这些数据能支持什么结论？'];
      if (active === 'abnormal') { sugg = ['这条链路现在卡在哪一步？', '下一步应该先做什么？', '给我一段交接班说明']; }
      if (active === 'catalyst') { sugg = ['活性指数为什么在下降？', '现在应该提温还是降负荷？', '模型的可信度怎么样？']; }
      if (active === 'latent') { sugg = ['催化剂活性现在是什么状态？', '换热器什么时候该清洗？', '这个结论是怎么算出来的？']; }
      sg.innerHTML = sugg.map(function (s) { return '<button type="button" class="ai-suggest-btn" data-chat-suggest="' + esc(s) + '">' + esc(s) + '</button>'; }).join('') + (c.key ? '' : '<button type="button" class="ai-suggest-btn" id="chatSetup">先配置 DeepSeek Key</button>');
      sg.querySelectorAll('[data-chat-suggest]').forEach(function (b) { b.addEventListener('click', function () { sendChat(b.getAttribute('data-chat-suggest')); }); });
      var cs = qs('#chatSetup'); if (cs) { cs.addEventListener('click', aiSettings); }
    }
    log.scrollTop = log.scrollHeight;
  }
  function setAITab(mode) {
    aiMode = mode || 'analysis';
    var tabs = qsa('[data-ai-tab]');
    tabs.forEach(function (b) { b.classList.toggle('on', b.getAttribute('data-ai-tab') === aiMode); });
    var body = qs('#aiBody'), chat = qs('#aiChat');
    if (body) { body.style.display = aiMode === 'analysis' ? '' : 'none'; }
    if (chat) { chat.classList.toggle('show', aiMode === 'chat'); }
    if (aiMode === 'chat') { renderChat(); var input = qs('#aiChatInput'); if (input) { setTimeout(function () { input.focus(); }, 60); } }
  }
  function bindAIChat() {
    qsa('[data-ai-tab]').forEach(function (b) { b.addEventListener('click', function () { setAITab(b.getAttribute('data-ai-tab')); }); });
    var send = qs('#aiChatSend'); if (send) { send.addEventListener('click', function () { sendChat(qs('#aiChatInput') ? qs('#aiChatInput').value : ''); }); }
    var input = qs('#aiChatInput');
    if (input) {
      input.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendChat(input.value); }
      });
    }
    var cfgBtn = qs('#aiChatSettings'); if (cfgBtn) { cfgBtn.addEventListener('click', aiSettings); }
    var clear = qs('#aiChatClear'); if (clear) { clear.addEventListener('click', function () { chatHistory = []; renderChat(); S.toast('<b>对话</b>：已清空'); }); }
  }
  function sendChat(text) {
    var input = qs('#aiChatInput');
    var q = String(text == null ? (input ? input.value : '') : text).trim();
    if (!q) { return; }
    if (chatBusy) { return; }
    var c = readAIConfig();
    if (!c.key) { aiSettings(); S.toast('<b>DeepSeek</b>：请先配置 API Key'); return; }
    if (input) { input.value = ''; }
    chatHistory.push({ role: 'user', content: q });
    chatHistory = chatHistory.slice(-12);
    chatBusy = true;
    renderChat();
    var ctrl = window.AbortController ? new AbortController() : null;
    var timer = ctrl ? setTimeout(function () { ctrl.abort(); }, 30000) : null;
    var msgs = [{ role: 'system', content: chatSystemPrompt() }].concat(chatHistory);
    fetch(chatEndpoint(c), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + c.key },
      body: JSON.stringify({ model: c.model, messages: msgs, temperature: 0.25, stream: false }),
      signal: ctrl ? ctrl.signal : undefined
    }).then(function (res) {
      if (!res.ok) { return res.text().then(function (t) { throw new Error('HTTP ' + res.status + '：' + t.slice(0, 240)); }); }
      return res.json();
    }).then(function (data) {
      if (timer) { clearTimeout(timer); }
      var txt = data && data.choices && data.choices[0] && data.choices[0].message ? data.choices[0].message.content : '';
      if (!txt) { throw new Error('返回为空'); }
      chatHistory.push({ role: 'assistant', content: txt });
      chatHistory = chatHistory.slice(-12);
      chatBusy = false;
      renderChat();
    }).catch(function (err) {
      if (timer) { clearTimeout(timer); }
      var msg = err && err.name === 'AbortError' ? '请求超时（30s）' : (err && err.message ? err.message : '网络错误');
      chatHistory.push({ role: 'assistant', content: '调用 DeepSeek 失败：' + msg + '\n请检查 API Key / Base URL / CORS / 网络。也请确认 Base URL 可以填 https://api.deepseek.com 或 .../chat/completions。' });
      chatBusy = false;
      renderChat();
    });
  }

  function insightHtml(obj) {
    if (!obj) { return '<div class="ai-note">当前页面暂无 AI 分析。</div>'; }
    var ai = readAIConfig();
    var badge = ai.key ? '<span class="tag" style="background:#ECFDF5;color:#047857;border:1px solid #A7F3D0">DeepSeek 已配置</span>' : '<span class="tag" style="background:#EDE9FE;color:#5B21B6;border:1px solid #DDD6FE">演示模式</span>';
    var h = '<div class="ai-meta">' + badge + '<span class="tag gray">生成于 ' + esc(obj.time || hm(new Date())) + '</span><span class="tag gray">' + esc(obj.basis || '当前页面筛选') + '</span><button class="btn small" id="aiCfgBtn">AI 设置</button>' + (ai.key ? '<button class="btn small ai" id="aiLiveBtn">用 DeepSeek 生成</button>' : '') + '</div>';
    h += '<div class="ai-block"><h4>一句话结论</h4><p style="margin:0;font-size:13px;line-height:1.75;color:#1E293B">' + obj.summary + '</p></div>';
    h += '<div class="ai-block"><h4>关键发现</h4><ul>' + obj.findings.map(function (x) { return '<li>' + x + '</li>'; }).join('') + '</ul></div>';
    h += '<div class="ai-block"><h4>建议动作</h4><div style="display:grid;gap:6px">' + obj.actions.map(function (x, i) { return '<div class="action"><span class="n">' + (i + 1) + '</span><span>' + x + '</span></div>'; }).join('') + '</div></div>';
    if (obj.evidence && obj.evidence.length) { h += '<div class="ai-block"><h4>依据</h4><div class="ai-meta">' + obj.evidence.map(function (x) { return '<span class="ai-chip">' + x + '</span>'; }).join('') + '</div></div>'; }
    h += '<div class="ai-note">AI 结论基于演示数据与当前筛选条件生成，仅用于演示，不替代工艺/生产专业判断。</div>';
    return h;
  }

  S.openAI = function (mode) {
    if (!insight && mode !== 'chat') { S.toast('<b>AI 分析</b>：当前页面暂无分析'); return; }
    qs('#aiBody').innerHTML = insightHtml(insight);
    bindAIButtons();
    aiDrawer.classList.add('show'); overlay.classList.add('show');
    setAITab(mode || 'analysis');
  };
  S.askAI = function (text) {
    S.openAI('chat');
    setTimeout(function () {
      var input = qs('#aiChatInput');
      if (input) { input.value = text || ''; }
      if (text) { sendChat(text); }
    }, 260);
  };

  function regenerateAI() {
    var c = readAIConfig();
    if (c.key) { callLiveAI(); return; }
    var body = qs('#aiBody');
    body.innerHTML = '<div class="ai-loading"><span class="spinner"></span>正在基于当前页面数据生成分析…</div>';
    setTimeout(function () {
      if (insight) {
        insight.time = hm(new Date()) + ':' + pad(new Date().getSeconds());
        body.innerHTML = insightHtml(insight);
        bindAIButtons();
        S.toast('<b>AI 分析</b>：已基于当前页面重新生成');
      }
    }, 900);
  }

  window.SimShell = S;
})();
