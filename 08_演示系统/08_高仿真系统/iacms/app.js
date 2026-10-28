(function () {
  var D = window.IACMS_DEMO;
  var S = window.SimShell;
  var esc = S.esc;
  var state = {
    agentComplete: false,
    agentRunning: false,
    chainGenerated: false,
    gateStatus: {},
    riskFilter: '全部',
    drillDone: false,
    drillReport: false,
    docs: D.docs.slice(),
    libraryGenerated: false
  };
  var CASES = D.caseDetails || [D.caseDetail];
  state.gateStatus = {};
  CASES.forEach(function (c) {
    var m = {};
    c.gates.forEach(function (g, i) { m[i] = g.status; });
    state.gateStatus[c.id] = m;
  });
  try {
    var savedGates = JSON.parse(localStorage.getItem('IACMS_GATES_V1') || '{}');
    Object.keys(savedGates).forEach(function (id) {
      if (state.gateStatus[id]) { Object.keys(savedGates[id]).forEach(function (k) { state.gateStatus[id][k] = savedGates[id][k]; }); }
    });
  } catch (e) {}
  function getCase() {
    var id = '';
    try { id = new URLSearchParams(location.search).get('case') || ''; } catch (e) {}
    if (!id) { try { id = sessionStorage.getItem('DEMO_CASE_ID') || ''; } catch (e) {} }
    for (var i = 0; i < CASES.length; i++) {
      if (CASES[i].scenarioId === id || CASES[i].id === id) {
        try {
          var cc = CASES[i];
          sessionStorage.setItem('DEMO_CASE_ID', cc.scenarioId || cc.id);
          sessionStorage.setItem('DEMO_CHAIN_BATCH', cc.batch);
          sessionStorage.setItem('DEMO_CHAIN_AREA', (cc.unit || '').split('·')[0].trim());
          sessionStorage.setItem('DEMO_CHAIN_LOOP', cc.loop || '');
          sessionStorage.setItem('DEMO_CHAIN_PRODUCT', 'BIT');
        } catch (e) {}
        return CASES[i];
      }
    }
    try {
      var c0 = CASES[0];
      sessionStorage.setItem('DEMO_CASE_ID', c0.scenarioId || c0.id);
      sessionStorage.setItem('DEMO_CHAIN_BATCH', c0.batch);
      sessionStorage.setItem('DEMO_CHAIN_AREA', (c0.unit || '').split('·')[0].trim());
      sessionStorage.setItem('DEMO_CHAIN_LOOP', c0.loop || '');
      sessionStorage.setItem('DEMO_CHAIN_PRODUCT', 'BIT');
    } catch (e) {}
    return CASES[0];
  }
  function gateMap(c) {
    if (!state.gateStatus[c.id]) {
      var m = {}; c.gates.forEach(function (g, i) { m[i] = g.status; }); state.gateStatus[c.id] = m;
    }
    return state.gateStatus[c.id];
  }
  function caseHref(c) { return '?case=' + encodeURIComponent(c.scenarioId || c.id) + '#case'; }

  function h(v) { return esc(v == null ? '' : String(v)); }
  function nowShort() { return S.nowText().slice(0, 5); }
  function sysHref(name, hash) {
    var map = { iAAS: 'iaas', iPAE: 'ipae', iCLPM: 'iclpm', iMCS: 'imcs', iLINK: 'chain' };
    var p = map[name];
    if (!p) { return '#'; }
    if (location.protocol === 'file:') { return '../' + p + '/index.html' + (hash ? '#' + hash : ''); }
    return '/demo/app/' + p + '/' + (hash ? '#' + hash : '');
  }
  function sysLink(name, hash, label) {
    if (name === 'iSafe') { return '<span class="iac-link" data-sys="iSafe">' + h(label || name) + '</span>'; }
    return '<a class="iac-link" href="' + sysHref(name, hash) + '">' + h(label || name) + ' →</a>';
  }
  function tag(text, tone) { return '<span class="iac-tag ' + (tone || '') + '">' + h(text) + '</span>'; }
  function head(kicker, title, sub, actions) {
    return '<div class="iac-head"><div><div class="iac-kicker">' + h(kicker) + '</div><h1>' + h(title) + '</h1><p>' + h(sub) + '</p></div><div class="iac-actions">' + (actions || '') + '</div></div>';
  }
  function kpi(label, value, unit, foot) {
    return '<div class="iac-kpi"><span>' + h(label) + '</span><b>' + h(value) + '<small>' + h(unit || '') + '</small></b><em>' + h(foot || '') + '</em></div>';
  }
  function phaseFlow(active) {
    var names = ['识别', '评估', '退守', '处置', '恢复', '复盘'];
    return '<div class="iac-phases">' + names.map(function (n, i) {
      var cls = n === active ? 'on' : (i < names.indexOf(active) ? 'done' : '');
      return '<div class="iac-phase ' + cls + '"><span>' + (i + 1) + '</span><b>' + n + '</b></div>';
    }).join('<i></i>') + '</div>';
  }
  function bindCommon() {
    document.querySelectorAll('[data-go]').forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); S.go(b.getAttribute('data-go')); };
    });
    document.querySelectorAll('[data-ai-chat]').forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); S.openAI('chat'); };
    });
    document.querySelectorAll('[data-ask]').forEach(function (b) {
      b.onclick = function (e) {
        e.preventDefault();
        var q = b.getAttribute('data-ask');
        if (S.askAI) { S.askAI(q); } else { S.openAI('chat'); }
      };
    });
    document.querySelectorAll('[data-sys]').forEach(function (b) {
      b.onclick = function (e) { e.preventDefault(); S.toast('<b>' + h(b.getAttribute('data-sys')) + '</b>：演示环境已接入该数据源（只读）'); };
    });
  }
  function catById(id) { for (var i = 0; i < D.categories.length; i++) { if (D.categories[i].id === id) { return D.categories[i]; } } return null; }
  function caseById(id) { for (var i = 0; i < D.cases.length; i++) { if (D.cases[i].id === id) { return D.cases[i]; } } return null; }
  function scenarioForCase(c) {
    var list = window.DEMO_SCENARIOS || [];
    for (var i = 0; i < list.length; i++) { if (list[i].id === c.scenarioId) { return list[i]; } }
    return null;
  }

  // ---------- dashboard ----------
  function renderDashboard() {
    var c = D.caseDetail;
    var html = head('iACMS / ABNORMAL CONDITION MANAGEMENT', '异常工况智能管理', '把准则、HAZOP、LOPA、SOP 和分系统数据变成可执行的处置任务链；AI 发现、Agent 协同、人做决策。', '<a class="btn" href="../scenarios/">场景导演</a><button class="btn" data-go="knowledge">上传文档</button><button class="btn" data-go="workbench">智能体工作台</button><button class="btn ai" data-ai-chat>AI 助手</button>');
    html += '<div class="iac-kpis">' + kpi('异常工况库', D.kpi.library, '类', '来自 12 份制度/报告') + kpi('接入系统', D.kpi.sources, '套', 'iAAS / iPAE / iCLPM / iMCS / iSafe') + kpi('活跃异常', D.kpi.cases, '起', '2 起处置中') + kpi('安全门禁', D.kpi.gates, '个', '未完成不允许闭环') + kpi('平均闭环', D.kpi.closure, 'min', '较人工缩短 35%') + kpi('合规确认率', D.kpi.compliance, '%', '本月处置任务') + '</div>';
    html += '<div class="iac-grid-2"><section class="iac-card iac-case-hero"><div class="iac-case-kicker">ACTIVE CASE / 正在处置</div><div class="iac-case-title"><div><h2>' + h(c.title) + '</h2><p>' + h(c.batch) + ' · ' + h(c.unit) + ' · 负责人 ' + h(c.owner) + '</p></div><span class="iac-risk high">高风险</span></div><div class="iac-case-meta"><span>触发：' + h(c.trigger) + '</span></div>' + phaseFlow(c.phase) + '<div class="iac-case-bot"><div><b>当前卡点</b><span>合规 Agent 正在检查：联锁旁路审批 / 能量隔离 / 现场人数</span></div><div class="iac-progress"><b>6<small>/9</small></b><span>安全门禁</span></div></div><div class="iac-actions"><button class="btn primary" data-go="case">进入处置 →</button><button class="btn" data-go="workbench">看 Agent 协作</button><a class="btn" href="' + sysHref('iLINK', 'abnormal') + '">iLINK 任务链</a></div></section>';
    html += '<section class="iac-card iac-agent-card"><div class="iac-card-head"><h3>AI 智能体</h3><span class="iac-live"><i></i> 5 个在线</span></div><div class="iac-agent-list">' + D.agents.slice(0, 5).map(function (a) {
      var st = a.status === 'done' ? '已完成' : a.status === 'active' ? '进行中' : '待启动';
      return '<div class="iac-agent-row"><div class="iac-agent-ico">' + h(a.name.slice(0, 1)) + '</div><div><b>' + h(a.name) + '</b><span>' + h(a.role) + '</span></div><em class="' + a.status + '">' + st + '</em></div>';
    }).join('') + '</div><button class="btn ai iac-full" data-go="workbench">打开智能体工作台 →</button></section></div>';
    html += '<div class="iac-grid-3"><section class="iac-card"><div class="iac-card-head"><h3>异常发现来源</h3><span class="iac-sub">统一接入</span></div>' + D.systems.map(function (s) {
      return '<div class="iac-source"><div><b>' + h(s.name) + '</b><span>' + h(s.role) + '</span></div><em>' + h(s.detail) + '</em><i class="on"></i></div>';
    }).join('') + '</section><section class="iac-card"><div class="iac-card-head"><h3>风险分布</h3><span class="iac-sub">异常工况库</span></div><div class="iac-donut-wrap"><div class="iac-donut"><div><b>42</b><span>类工况</span></div></div><div class="iac-legend"><p><i style="background:#DC2626"></i>高风险 <b>18</b></p><p><i style="background:#D97706"></i>中风险 <b>16</b></p><p><i style="background:#0B9A78"></i>低风险 <b>8</b></p></div></div></section><section class="iac-card"><div class="iac-card-head"><h3>知识资产</h3><span class="iac-sub">AI 抽取</span></div><div class="iac-know-stats"><div><b>12</b><span>份文档</span></div><div><b>186</b><span>个动作</span></div><div><b>68</b><span>个门禁</span></div></div><div class="iac-doc-mini">' + D.docs.slice(0, 3).map(function (d) { return '<div><span>' + h(d.type) + '</span><b>' + h(d.name) + '</b></div>'; }).join('') + '</div><button class="btn iac-full" data-go="knowledge">进入知识库 →</button></section></div>';
    html += '<div class="iac-ai-inline"><div class="iac-ai-mark">AI</div><div><b>AI 当前判断</b><p>R101 超温已具备“反应失控前兆”特征；在完成退守、人员管控和能量隔离前，不应进入 iCLPM 深度诊断。建议先执行停进料/停加热/紧急冷却，再由合规 Agent 核对联锁与隔离证据。</p></div><button class="btn ai" data-ask="现在最该先做什么？">追问 AI</button></div>';
    return html;
  }
  function dashboardInsight() {
    return { summary: 'iACMS 已接入 5 套系统，异常工况库 42 类；当前 3 起活跃异常，R101 超温处于退守阶段，9 个安全门禁完成 6 个，当前不能闭环。', findings: ['异常发现已经跨 iAAS/iPAE/iCLPM 三源交叉确认，不是单点报警。', '当前缺联锁旁路审批、能量隔离、现场人数三项证据。', '知识库已从准则、AQ 3062、HAZOP、LOPA、SOP 抽取 186 个动作、68 个门禁。'], actions: ['先完成停进料、停加热、紧急冷却，确认人员最少化。', '在没有评估审批前，不允许旁路联锁。', '退守完成后再进入回路深度诊断与 eBR 审核。'], evidence: ['iAAS 957 报警', 'iPAE OP30 +14min', 'iCLPM 评分 18.4', '应急厅〔2024〕17号'], basis: '当前活跃工况 + 知识库' };
  }

  // ---------- knowledge ----------
  function docStatus(s) {
    var tone = s === '已解析' ? 'ok' : s === '解析中' ? 'run' : 'gray';
    return tag(s, tone);
  }
  function renderKnowledge() {
    var html = head('KNOWLEDGE / 文档入库', '知识库与异常工况生成', '上传准则、AQ 标准、企业办法、HAZOP、LOPA、SOP、应急预案，由 AI 抽取异常分类、触发条件、处置动作、安全门禁。', '<button class="btn primary" data-upload-trigger>上传文档</button><button class="btn ai" data-generate-library>AI 生成异常工况库</button>');
    html += '<div class="iac-know-grid"><section class="iac-card iac-upload-card"><div class="iac-drop" data-upload-trigger><div class="iac-drop-ico">＋</div><b>拖拽文件到这里，或点击上传</b><p>支持 PDF / Word / Excel / PPT / TXT；演示环境用文件名校验，不做真实内容解析</p><div class="iac-file-types"><span>PDF</span><span>DOCX</span><span>XLSX</span><span>PPTX</span></div><input id="iacFile" type="file" multiple hidden></div><div class="iac-upload-note"><b>自动流水线</b><span>解析 → 分类 → 抽取 → 关联 → 审核</span></div></section><section class="iac-card iac-pipeline"><div class="iac-card-head"><h3>知识生成流水线</h3><span class="iac-sub">可追溯</span></div><div class="iac-pipe">' + ['文档解析', '要素抽取', '异常分类', '程序生成', '知识关联'].map(function (x, i) { return '<div class="iac-pipe-step"><span>' + (i + 1) + '</span><b>' + x + '</b><em>' + (i < 4 ? '完成' : '运行中') + '</em></div>'; }).join('') + '</div><div class="iac-extract-stats"><div><b>42</b><span>异常工况</span></div><div><b>186</b><span>处置动作</span></div><div><b>68</b><span>安全门禁</span></div><div><b>12</b><span>关联文档</span></div></div><div class="iac-ai-inline small"><div class="iac-ai-mark">AI</div><div><b>抽取结果</b><p>识别到「反应釜超温/反应失控」「冷却中断」「搅拌失效」等精细化工典型场景，关联 HAZOP 节点与 LOPA 场景；所有条目保留原文出处。</p></div></div></section></div>';
    html += '<section class="iac-card"><div class="iac-card-head"><h3>文档清单</h3><span class="iac-sub">' + state.docs.length + ' 份 · 已解析 ' + state.docs.filter(function (d) { return d.status === '已解析'; }).length + ' 份</span></div><div class="iac-table-wrap"><table class="iac-table"><thead><tr><th>文档</th><th>类型 / 编号</th><th>状态</th><th>异常工况</th><th>动作</th><th>门禁</th><th>更新</th></tr></thead><tbody>' + state.docs.map(function (d) {
      return '<tr><td><b>' + h(d.name) + '</b><span class="iac-dim">' + h(d.code) + ' · ' + h(d.pages) + ' 页</span>' + (d.preview ? '<span class="iac-doc-preview">文本已读取：' + h(d.preview) + '</span>' : d.note ? '<span class="iac-doc-preview warn">' + h(d.note) + '</span>' : '') + '</td><td>' + h(d.type) + '</td><td>' + docStatus(d.status) + '</td><td>' + h(d.scenarios) + '</td><td>' + h(d.steps) + '</td><td>' + h(d.gates) + '</td><td>' + h(d.updated) + '</td></tr>';
    }).join('') + '</tbody></table></div></section>';
    html += '<div class="iac-grid-3"><section class="iac-card"><div class="iac-card-head"><h3>原文依据</h3><span class="iac-sub">法规/标准</span></div><div class="iac-ref"><b>应急厅〔2024〕17号</b><span>《化工企业生产过程异常工况安全处置准则（试行）》</span><a href="https://www.gov.cn/zhengce/zhengceku/202405/content_6948790.htm" target="_blank" rel="noopener">查看原文 ↗</a></div><div class="iac-ref"><b>AQ 3062—2025</b><span>《精细化工企业安全管理规范》</span><a href="https://www.mem.gov.cn/xw/yjglbgzdt/202505/t20250523_538198.shtml" target="_blank" rel="noopener">查看发布信息 ↗</a></div></section><section class="iac-card"><div class="iac-card-head"><h3>AI 抽取示例</h3><span class="iac-sub">RC-01</span></div><div class="iac-quote"><b>触发条件</b><p>温度骤升、压力骤变、冷却/搅拌异常；反应釜飞温、爆聚、冲料。</p><b>关键动作</b><p>停进料、停加热、启动冷却、淬灭/转移、人员撤离。</p><b>安全门禁</b><p>紧急处置程序可用、联锁不得擅自旁路、能量隔离、现场人数。</p></div><button class="btn" data-go="library">查看异常工况库 →</button></section><section class="iac-card"><div class="iac-card-head"><h3>知识关联</h3><span class="iac-sub">文档 × 场景 × 系统</span></div><div class="iac-graph"><span>准则</span><i>→</i><span>RC-01</span><i>→</i><span>HAZOP</span><span>LOPA</span><span>SOP</span><i>→</i><span>任务链</span></div><p class="iac-dim">每条异常工况保留原文段落、HAZOP 节点、LOPA 场景与系统证据，处置时可直接回溯。</p></section></div>';
    return html;
  }
  function bindKnowledge() {
    bindCommon();
    var input = document.getElementById('iacFile');
    document.querySelectorAll('[data-upload-trigger]').forEach(function (b) { b.onclick = function () { if (input) { input.click(); } }; });
    if (input) {
      input.onchange = function () {
        var files = Array.prototype.slice.call(input.files || []);
        if (!files.length) { return; }
        files.forEach(function (f, i) {
          var textLike = /\.(txt|md|markdown|csv|json|html|htm)$/i.test(f.name);
          var doc = { name: f.name, type: textLike ? '文本文件' : '二进制文档', code: 'UPLOAD-' + (i + 1), status: textLike ? '解析中' : '待解析', pages: '—', scenarios: 0, steps: 0, gates: 0, updated: nowShort(), note: textLike ? '' : '需接入 PDF/Word OCR 解析服务' };
          state.docs.unshift(doc);
          if (textLike && window.FileReader) {
            var reader = new FileReader();
            reader.onload = function () {
              var text = String(reader.result || '').replace(/\s+/g, ' ').trim();
              doc.preview = text.slice(0, 90) + (text.length > 90 ? '…' : '');
              doc.status = '已解析'; doc.scenarios = 3; doc.steps = Math.min(12, Math.max(3, Math.ceil(text.length / 240))); doc.gates = 3;
              S.toast('<b>文本已读取</b>：' + f.name + '，已生成演示级抽取结果');
              if (location.hash === '#knowledge') { S.go('knowledge'); }
            };
            reader.readAsText(f, 'utf-8');
          }
        });
        S.toast('<b>文档已上传</b>：' + files.length + ' 份；文本文件本机读取，PDF/Word 需解析服务');
        S.go('knowledge');
        input.value = '';
      };
    }
    document.querySelectorAll('[data-generate-library]').forEach(function (b) {
      b.onclick = function () {
        if (state.libraryGenerated) { S.toast('<b>知识库</b>：异常工况库已是最新'); return; }
        state.libraryGenerated = true;
        S.toast('<b>AI Agent</b>：正在生成异常分类、处置程序和安全门禁…');
        setTimeout(function () { S.toast('<b>生成完成</b>：42 类异常工况 / 186 个动作 / 68 个门禁，已进入异常工况库'); S.go('library'); }, 1500);
      };
    });
  }
  function knowledgeInsight() {
    return { summary: '知识库已解析 12 份文档，生成 42 类异常工况、186 个处置动作、68 个安全门禁；关键来源是应急厅〔2024〕17号和 AQ 3062—2025。', findings: ['文档解析覆盖国家规范、强制性标准、企业制度、HAZOP、LOPA、SOP 与应急预案。', 'RC-01 反应釜超温已关联 HAZOP 节点与 LOPA 场景。', '仍有 1 份培训材料待解析。'], actions: ['把待解析材料纳入下一批处理。', '对“联锁旁路/人员最少化/能量隔离”做人工复核。', '对高风险场景补齐 LOPA 独立保护层证据。'], evidence: ['12 份文档', '42 类异常', '186 动作', '68 门禁'], basis: '文档清单与抽取结果' };
  }

  // ---------- library ----------
  function renderLibrary() {
    var list = D.categories.filter(function (c) { return state.riskFilter === '全部' || c.risk === state.riskFilter; });
    var html = head('LIBRARY / 异常工况库', '异常工况分类与处置程序', '按准则附录1、AQ 3062、HAZOP/LOPA 和企业 SOP 组织；每一类都有触发条件、退守动作、安全门禁和原文依据。', '<button class="btn" data-go="knowledge">从文档生成</button><button class="btn ai" data-ai-chat>AI 检索</button>');
    html += '<div class="iac-filter">' + ['全部', '高', '中', '低'].map(function (r) { return '<button class="' + (state.riskFilter === r ? 'on' : '') + '" data-risk="' + r + '">' + r + '风险</button>'; }).join('') + '<span>' + list.length + ' 类工况</span></div>';
    html += '<div class="iac-lib-grid">' + list.map(function (c) {
      return '<article class="iac-lib-card" data-cat="' + c.id + '"><div class="iac-lib-top"><span class="iac-code">' + h(c.id) + '</span><span class="iac-risk ' + (c.risk === '高' ? 'high' : c.risk === '中' ? 'mid' : 'low') + '">' + h(c.risk) + '风险</span></div><h3>' + h(c.name) + '</h3><p>' + h(c.note) + '</p><div class="iac-trigger">' + c.triggers.map(function (t) { return '<span>' + h(t) + '</span>'; }).join('') + '</div><div class="iac-lib-foot"><span>' + c.gates + ' 个门禁 · ' + c.docs + ' 份依据</span><button class="iac-link">查看处置程序 →</button></div></article>';
    }).join('') + '</div>';
    html += '<div class="iac-ai-inline"><div class="iac-ai-mark">AI</div><div><b>按准则自动归类</b><p>“反应釜超温 / 反应失控”按附录1-1/2 归入高危场景；“蒸馏/精馏不出料”按附录1-6 单独建类；所有场景均保留原文出处与企业 SOP 关联。</p></div><button class="btn ai" data-ask="按应急厅17号准则，RC-01 还缺哪些安全门禁？">问 AI</button></div>';
    return html;
  }
  function openCat(id) {
    var c = catById(id);
    if (!c) { return; }
    var d = document.getElementById('iacmsDrawer');
    if (!d) { return; }
    d.querySelector('.iac-drawer-body').innerHTML = '<div class="iac-drawer-kicker">' + h(c.id) + ' / ABNORMAL CONDITION</div><h2>' + h(c.name) + '</h2><div class="iac-drawer-tags">' + tag(c.risk + '风险', c.risk === '高' ? 'danger' : 'warn') + tag(c.source, 'gray') + tag(c.docs + ' 份依据', 'gray') + '</div><div class="iac-detail-sec"><h4>典型触发条件</h4><div class="iac-trigger">' + c.triggers.map(function (t) { return '<span>' + h(t) + '</span>'; }).join('') + '</div></div><div class="iac-detail-sec"><h4>退守/处置动作</h4><ol class="iac-steps">' + c.actions.map(function (a) { return '<li>' + h(a) + '</li>'; }).join('') + '</ol></div><div class="iac-detail-sec"><h4>安全门禁</h4><div class="iac-gate-inline">' + ['紧急处置程序', '退守安全状态', '人员最少化', '联锁不得旁路', '能量隔离', '统一指挥', '处置后复盘'].slice(0, c.gates > 7 ? 7 : c.gates).map(function (g) { return '<span>✓ ' + h(g) + '</span>'; }).join('') + '</div></div><div class="iac-detail-sec"><h4>原文依据</h4><p class="iac-dim">' + h(c.source) + '；关联企业 SOP、HAZOP 节点与 LOPA 场景。演示环境不替代法规原文与企业预案。</p></div><div class="iac-drawer-actions"><button class="btn primary" data-from-cat="' + c.id + '">生成处置任务 →</button><button class="btn" data-close-drawer>关闭</button></div>';
    d.classList.add('show');
    d.querySelectorAll('[data-close-drawer]').forEach(function (b) { b.onclick = closeDrawer; });
    d.querySelectorAll('[data-from-cat]').forEach(function (b) { b.onclick = function () { closeDrawer(); S.go('case'); }; });
    bindCommon();
  }
  function closeDrawer() { var d = document.getElementById('iacmsDrawer'); if (d) { d.classList.remove('show'); } }
  function bindLibrary() {
    bindCommon();
    document.querySelectorAll('[data-risk]').forEach(function (b) { b.onclick = function () { state.riskFilter = b.getAttribute('data-risk'); S.go('library'); }; });
    document.querySelectorAll('[data-cat]').forEach(function (b) { b.onclick = function () { openCat(b.getAttribute('data-cat')); }; });
    var d = document.getElementById('iacmsDrawer'); if (d) { d.querySelectorAll('[data-close-drawer]').forEach(function (b) { b.onclick = closeDrawer; }); var bg = d.querySelector('.iac-drawer-bg'); if (bg) { bg.onclick = closeDrawer; } }
  }
  function libraryInsight() {
    return { summary: '异常工况库现有 10 个重点场景展示，覆盖反应失控、冷却/搅拌失效、蒸馏不出料、尾气故障、物料互串、堵塞、公用工程中断、泄漏、开停车异常。', findings: ['RC-01 反应釜超温关联 4 份依据、9 个门禁，是当前最高风险场景。', 'RC-05 尾气/有毒气体故障关联 RTO 活跃异常。', '每类场景都保留准则条款、HAZOP/LOPA 与 SOP 关联。'], actions: ['优先复核高风险 18 类场景的联锁/隔离门禁。', '把 RC-01/RC-05 做成班组推演模板。', '对低风险场景建立简化处置卡。'], evidence: ['应急厅〔2024〕17号', 'AQ 3062—2025', 'HAZOP-A01-2026', 'SOP-R101-V4'], basis: '异常工况库' };
  }

  // ---------- workbench ----------
  function renderWorkbench() {
    var html = head('AGENT WORKBENCH / 智能体工作台', '异常工况 Agent 协作', '像工作台一样组织任务：左边是异常工况，中间是 Agent 链路与事件，右边是 AI 对话；人始终保留最终决策权。', '<button class="btn primary" data-run-agents>' + (state.agentRunning ? 'Agent 运行中…' : '运行 Agent 协作') + '</button><a class="btn" href="' + caseHref(getCase()) + '">进入处置</a><button class="btn ai" data-ai-chat>AI 助手</button>');
    html += '<div class="iac-workbench"><aside class="iac-wb-left"><div class="iac-wb-title">异常工况任务 <span>' + CASES.length + '</span></div>' + CASES.map(function (c) {
      var on = c.id === getCase().id ? 'on' : '';
      return '<a class="iac-wb-case ' + on + '" href="' + caseHref(c) + '"><div><b>' + h(c.title) + '</b><span>' + h(c.id) + ' · ' + h(c.unit) + '</span></div><div class="iac-wb-case-foot"><span class="iac-risk ' + (c.risk === '高' ? 'high' : c.risk === '中' ? 'mid' : 'low') + '">' + h(c.risk) + '</span><em>' + h(c.status) + '</em></div></a>';
    }).join('') + '<div class="iac-wb-note"><b>iLINK 已融合</b><span>任务链、步骤流、分系统证据入口作为 iACMS 的处置执行层。</span><a href="' + sysHref('iLINK', 'abnormal') + '">打开 iLINK 任务链 →</a></div></aside>';
    html += '<section class="iac-wb-main"><div class="iac-wb-title">Agent 协作链 <span>' + (state.agentComplete ? '全部完成' : state.agentRunning ? '运行中' : '可运行') + '</span></div><div class="iac-agent-pipeline">' + D.agents.map(function (a, i) {
      var st = state.agentComplete ? 'done' : state.agentRunning ? (i < 4 ? 'active' : 'pending') : a.status;
      var label = st === 'done' ? '已完成' : st === 'active' ? '进行中' : '待启动';
      return '<div class="iac-pipe-agent ' + st + '" data-agent="' + a.id + '"><div class="iac-pipe-num">' + (i + 1) + '</div><div><b>' + h(a.name) + '</b><span>' + h(a.role) + '</span><em>' + label + '</em></div></div>';
    }).join('<div class="iac-pipe-arrow">→</div>') + '</div><div class="iac-event-log"><div class="iac-event-head"><b>实时事件</b><span>演示数据 · ' + nowShort() + '</span></div>' + D.agents.map(function (a, i) { return '<div class="iac-event"><span class="iac-event-time">05:' + (2 + i * 2 < 10 ? '0' : '') + (2 + i * 2) + '</span><i class="' + (state.agentComplete || i < 3 ? 'on' : '') + '"></i><div><b>' + h(a.name) + '</b><p>' + h(a.msg) + '</p></div></div>'; }).join('') + '</div></section>';
    html += '<aside class="iac-wb-right"><div class="iac-wb-title">AI 对话 <span>DeepSeek</span></div><div class="iac-chat-card"><div class="iac-chat-msg ai"><b>AI</b><p>我已读取当前异常工况、处置程序与 ' + getCase().gates.length + ' 个安全门禁。你可以直接问：现在最该先做什么？哪些证据还不能闭环？</p></div><div class="iac-chat-msg user"><b>你</b><p>按应急厅17号，当前还缺什么？</p></div><div class="iac-chat-msg ai"><b>AI</b><p>缺 3 项证据：①联锁旁路审批；②能量隔离（盲板/泄压/吹扫）；③现场人数确认。另建议先完成退守，再进入回路深度诊断。</p></div><div class="iac-quick">' + ['现在最该先做什么？', '哪些门禁还不能闭环？', '给我一段交接班说明'].map(function (q) { return '<button data-ask="' + h(q) + '">' + h(q) + '</button>'; }).join('') + '</div><button class="btn ai iac-full" data-ai-chat>打开完整 AI 对话 →</button><p class="iac-dim">AI 只做识别、汇总、建议；安全决策与授权由人完成。</p></div></aside></div>';
    return html;
  }
  function openAgent(id) {
    var a = null;
    for (var i = 0; i < D.agents.length; i++) { if (D.agents[i].id === id) { a = D.agents[i]; } }
    if (!a) { return; }
    ensureAgentModal();
    var m = document.getElementById('iacAgentModal');
    var conf = Math.round((a.confidence || 0.8) * 100);
    m.querySelector('.iac-modal-panel').innerHTML = '<div class="iac-agent-modal-head"><div><div class="iac-drawer-kicker">AGENT TRACE / 可解释链路</div><h3>' + h(a.name) + '</h3><p>' + h(a.role) + '</p></div><button class="iac-modal-close" data-agent-close>×</button></div><div class="iac-agent-trace"><div class="iac-trace-block"><b>输入</b><p>' + h(a.input || '当前异常工况页面数据') + '</p></div><div class="iac-trace-block"><b>输出</b><p>' + h(a.msg) + '</p></div><div class="iac-trace-block"><b>证据/来源</b><p>' + h(a.evidence || '当前页面数据') + '</p></div><div class="iac-trace-block"><b>置信度</b><div class="iac-conf"><i style="width:' + conf + '%"></i></div><span>' + conf + '% · 仅作为建议</span></div></div><div class="iac-agent-warning">Agent 输出不是授权：涉及联锁、隔离、人员撤离、停车等动作，必须由授权人确认。</div><div class="iac-modal-actions"><button class="btn" data-agent-close>关闭</button><button class="btn" data-agent-confirm>人工确认已阅</button><button class="btn primary" data-agent-approve>确认建议</button></div>';
    m.classList.add('show');
    m.querySelectorAll('[data-agent-close]').forEach(function (b) { b.onclick = function () { m.classList.remove('show'); }; });
    m.querySelectorAll('[data-agent-confirm]').forEach(function (b) { b.onclick = function () { m.classList.remove('show'); S.toast('<b>' + h(a.name) + '</b>：已阅，未授权任何动作'); }; });
    m.querySelectorAll('[data-agent-approve]').forEach(function (b) { b.onclick = function () { m.classList.remove('show'); S.toast('<b>' + h(a.name) + '</b>：建议已确认，仍待授权人执行'); }; });
  }
  function ensureAgentModal() {
    if (document.getElementById('iacAgentModal')) { return; }
    var m = document.createElement('div');
    m.id = 'iacAgentModal'; m.className = 'iac-modal';
    m.innerHTML = '<div class="iac-modal-bg" data-agent-close></div><div class="iac-modal-panel"></div>';
    document.body.appendChild(m);
    m.querySelectorAll('[data-agent-close]').forEach(function (b) { b.onclick = function () { m.classList.remove('show'); }; });
  }
  function bindWorkbench() {
    bindCommon();
    document.querySelectorAll('[data-agent]').forEach(function (b) { b.onclick = function () { openAgent(b.getAttribute('data-agent')); }; });
    document.querySelectorAll('[data-run-agents]').forEach(function (b) {
      b.onclick = function () {
        if (state.agentRunning) { return; }
        state.agentRunning = true; state.agentComplete = false; S.go('workbench');
        setTimeout(function () {
          state.agentRunning = false; state.agentComplete = true;
          if (location.hash === '#workbench') { S.go('workbench'); }
          S.toast('<b>Agent 协作</b>：6 个 Agent 已完成本轮协同，生成 1 条处置任务链');
        }, 1600);
      };
    });
  }
  function workbenchInsight() {
    return { summary: '监测、分类、程序、合规、处置、复盘 6 个 Agent 已形成协作链；当前合规 Agent 正在检查 3 项缺失证据，处置 Agent 尚未派发任务。', findings: ['Agent 链路已把“发现”到“程序生成”跑通。', '合规 Agent 未通过前，处置 Agent 不应自动派发。', '所有 Agent 结论可回溯到页面数据与文档来源。'], actions: ['先人工确认高风险门禁，再允许处置 Agent 派发。', '把 AI 建议作为参考，不代替授权。', '运行结束后生成任务链并进入推演。'], evidence: ['6 个 Agent', '9 个门禁', '3 项缺失证据'], basis: '智能体工作台' };
  }

  // ---------- case ----------
  function renderCase() {
    var c = getCase();
    var gm = gateMap(c);
    var done = countDone(c);
    var html = head('CASE / 当前处置', c.title, c.batch + ' · ' + c.unit + ' · 触发：' + c.trigger, '<button class="btn" data-generate-chain>' + (state.chainGenerated ? '重新生成任务链' : 'AI 生成任务链') + '</button><button class="btn primary" data-go="drill">开始推演</button><a class="btn" href="' + sysHref('iLINK', 'abnormal') + '">iLINK 任务链</a>');
    var provenance = c.batch.indexOf('历史') >= 0 ? '历史批次 / 模型回测' : '当前演示批次 ' + c.batch + '（2026-10-28）';
    html += '<div class="iac-data-note"><b>数据口径</b>' + h(provenance) + '；iPAE 历史基线仅用于对比（2024-03–05，408 车间）；演示合成数据，不替代企业实时数据。</div>';
    html += '<div class="iac-case-top"><div class="iac-case-main"><div class="iac-drawer-tags">' + tag(c.category, 'danger') + tag(c.risk + '风险', c.risk === '高' ? 'danger' : 'warn') + tag(c.status, 'warn') + tag('SLA ' + c.sla, 'gray') + '</div><div class="iac-case-facts"><div><span>批号</span><b>' + h(c.batch) + '</b></div><div><span>装置</span><b>' + h(c.unit) + '</b></div><div><span>负责人/指挥</span><b>' + h(c.owner) + ' / ' + h(c.commander) + '</b></div><div><span>已用时间</span><b>' + h(c.elapsed) + '</b></div></div>' + phaseFlow(c.phase) + '<div class="iac-source-row">' + c.source.map(function (x) { return '<span>' + h(x) + '</span>'; }).join('') + '</div><div class="iac-brake"><b>处置边界</b><span>' + h(c.brake.mode) + ' · ' + h(c.brake.sis) + ' · 建议：' + h(c.brake.suggested) + '</span></div></div><div class="iac-case-side"><b>' + done + '<small>/' + c.gates.length + '</small></b><span>安全门禁完成</span><div class="iac-bar"><i style="width:' + Math.round(done / c.gates.length * 100) + '%"></i></div><em>' + (done < c.gates.length ? '未完成项：' + c.gates.filter(function (g, i) { return gm[i] !== 'done'; }).slice(0, 3).map(function (g) { return g.name; }).join(' / ') : '已全部确认') + '</em></div></div>';
    var sc = scenarioForCase(c);
    if (sc && window.DEMO_BOWTIE) {
      html += '<section class="iac-card iac-risk-section"><div class="iac-card-head"><h3>原因 / 独立保护层 / 后果</h3><span class="iac-sub">演示风险值 · 仅表示趋势</span></div>' + window.DEMO_BOWTIE(sc) + '</section>';
    }
    html += '<div class="iac-grid-2 iac-case-grid"><section class="iac-card"><div class="iac-card-head"><h3>处置门禁</h3><span class="iac-sub">未完成不允许闭环</span></div><div class="iac-gates">' + c.gates.map(function (g, i) {
      var st = gm[i] || g.status;
      var label = st === 'done' ? '已确认' : st === 'active' ? '进行中' : '待确认';
      return '<div class="iac-gate ' + st + '"><div class="iac-gate-dot">' + (st === 'done' ? '✓' : (i + 1)) + '</div><div><b>' + h(g.name) + '</b><span>' + h(g.action) + '</span><em>' + h(g.evidence) + '</em></div><button class="mini-btn" data-gate="' + i + '">' + (st === 'done' ? '查看' : '确认') + '</button></div>';
    }).join('') + '</div></section><section class="iac-card"><div class="iac-card-head"><h3>任务链</h3><span class="iac-sub">iLINK 执行层</span></div>' + (state.chainGenerated ? '<div class="iac-chain">' + c.taskChain.map(function (s, i) { return '<div class="iac-chain-row"><span>' + (i + 1) + '</span><div><b>' + h(s.role) + '</b><p>' + h(s.task) + '</p><em>' + h(s.source) + '</em></div><i class="' + s.status + '">' + (s.status === 'done' ? '完成' : s.status === 'active' ? '进行中' : '待启动') + '</i></div>'; }).join('') + '</div><button class="btn" data-go="workbench">在 Agent 工作台查看 →</button>' : '<div class="iac-empty"><b>尚未生成任务链</b><p>点击“AI 生成任务链”，由程序 Agent 按准则、SOP、HAZOP 生成可执行动作与责任人。</p><button class="btn ai" data-generate-chain>生成任务链</button></div>') + '</section></div>';
    html += '<div class="iac-grid-3"><section class="iac-card"><div class="iac-card-head"><h3>证据入口</h3><span class="iac-sub">分系统</span></div>' + c.source.map(function (s) { return '<div class="iac-evidence"><span>' + h(s) + '</span>' + sysLink(s.split(' ')[0], s.indexOf('iAAS') >= 0 ? 'realtime' : s.indexOf('iPAE') >= 0 ? 'batch' : s.indexOf('iCLPM') >= 0 ? 'loops' : 'ebr', '打开证据') + '</div>'; }).join('') + '</section><section class="iac-card"><div class="iac-card-head"><h3>合规提醒</h3><span class="iac-sub">2024/17号</span></div><div class="iac-warning"><b>禁止事项</b><p>未评估审批，不得摘除/旁路联锁；不得以关阀代替盲板；情况不明不得进入现场。</p></div><div class="iac-warning"><b>必须动作</b><p>及时退守、人员最少化、能量隔离、统一指挥、处置后复盘。</p></div></section><section class="iac-card"><div class="iac-card-head"><h3>AI 建议</h3><span class="iac-sub">不作为授权</span></div><div class="iac-quote"><p>先完成停进料、停加热、紧急冷却；确认现场人数与隔离证据；联锁旁路必须走审批。完成后再进入回路深度诊断。</p></div><button class="btn ai iac-full" data-ask="当前处置还缺哪些安全门禁？">问 AI</button></section></div>';
    return html;
  }
  function countDone(c) { var m = gateMap(c || getCase()); var n = 0; for (var k in m) { if (m[k] === 'done') { n++; } } return n; }
  function bindCase() {
    bindCommon();
    var c = getCase();
    var gm = gateMap(c);
    document.querySelectorAll('[data-gate]').forEach(function (b) {
      b.onclick = function () {
        var i = b.getAttribute('data-gate');
        if (gm[i] === 'done') { S.toast('<b>门禁</b>：已确认，证据已归档'); return; }
        gm[i] = 'done';
        try { localStorage.setItem('IACMS_GATES_V1', JSON.stringify(state.gateStatus)); } catch (e) {}
        S.toast('<b>门禁确认</b>：' + c.gates[i].name + ' 已记录，证据已归档');
        S.go('case');
      };
    });
    document.querySelectorAll('[data-generate-chain]').forEach(function (b) {
      b.onclick = function () {
        state.chainGenerated = true;
        S.toast('<b>程序 Agent</b>：已按准则/SOP/HAZOP 生成任务链');
        S.go('case');
      };
    });
  }
  function caseInsight() {
    var c = getCase(); var done = countDone(c); var miss = c.gates.length - done;
    return { summary: c.title + '处于' + c.phase + '阶段，' + c.gates.length + ' 个安全门禁完成 ' + done + ' 个；当前有 ' + miss + ' 项未完成，不能直接闭环。', findings: [c.source.join('；'), '批号 ' + c.batch + ' 与当前任务链一致。', '任务链尚未全部派发到 iMCS eBR 与 inWork。'], actions: ['先完成当前阶段的安全动作与人员/隔离证据。', '未完成门禁不得闭环，联锁旁路必须审批。', '处置结束后由复盘 Agent 回写知识库。'], evidence: [c.gates.length + ' 个门禁', miss + ' 项缺失', c.risk + '风险'], basis: c.title };
  }

  // ---------- drill ----------
  function renderDrill() {
    var html = head('DRILL / 推演与复盘', '处置推演与闭环复盘', '在真正处置前，用数字孪生任务链推演“发现→退守→处置→恢复”；推演完成后生成复盘报告，回写异常工况库与培训案例。', '<button class="btn primary" data-run-drill>' + (state.drillDone ? '重新推演' : '开始推演') + '</button><a class="btn" href="' + caseHref(getCase()) + '">返回处置</a>');
    html += '<div class="iac-grid-2"><section class="iac-card"><div class="iac-card-head"><h3>推演场景</h3><span class="iac-sub">精细化工</span></div>' + D.drills.map(function (d) { return '<div class="iac-drill-row"><div><b>' + h(d.name) + '</b><span>' + h(d.id) + ' · ' + h(d.steps) + ' 步 · ' + h(d.duration) + ' · 上次 ' + h(d.last) + '</span></div><span class="iac-risk ' + (d.risk === '高' ? 'high' : 'mid') + '">' + h(d.risk) + '</span><em class="' + (d.result === '通过' ? 'ok' : 'warn') + '">' + h(d.result) + '</em></div>'; }).join('') + '<div class="iac-warning" style="margin-top:10px"><b>推演原则</b><p>AI 只生成情景、提示缺项；指挥与处置动作由人确认。推演结果不替代法规要求和企业预案。</p></div></section><section class="iac-card"><div class="iac-card-head"><h3>推演进度</h3><span class="iac-sub">' + h(getCase().title) + '</span></div><div class="iac-drill-progress"><div class="iac-bar big"><i style="width:' + (state.drillDone ? 100 : 0) + '%"></i></div><b>' + (state.drillDone ? '100%' : '0%') + '</b></div><div class="iac-drill-steps">' + getCase().gates.map(function (g, i) {
      var done = state.drillDone || i < 3;
      return '<div class="iac-drill-step ' + (done ? 'done' : '') + '"><span>' + (i + 1) + '</span><b>' + h(g.name) + '</b><em>' + (done ? '通过' : '待推演') + '</em></div>';
    }).join('') + '</div></section></div>';
    html += '<section class="iac-card iac-review"><div class="iac-card-head"><h3>AI 复盘报告</h3><span class="iac-sub">' + (state.drillReport ? '已生成' : '待生成') + '</span></div>' + (state.drillReport ? '<div class="iac-review-grid"><div><b>结论</b><p>9 个安全门禁中 7 个按程序通过；联锁旁路审批与能量隔离确认超时，是本次推演的主要偏差。建议把“联锁审批”前置到退守动作之前。</p></div><div><b>知识回写</b><p>更新 RC-01 处置程序：新增“退守前联锁状态确认”步骤；将本次推演加入班组培训案例。</p></div><div><b>责任与时限</b><p>工艺 1 项、设备 1 项、安全 1 项；建议 3 个工作日内完成 SOP 修订。</p></div></div><div class="iac-actions"><button class="btn" data-go="case">回到任务链</button><button class="btn" data-go="library">更新异常工况库</button><button class="btn ai" data-ask="把这次推演的偏差整理成整改清单">AI 生成整改清单</button></div>' : '<div class="iac-empty"><b>尚未生成复盘</b><p>先完成一次推演，系统会按时间线、门禁证据、偏差与责任生成复盘报告。</p><button class="btn ai" data-run-drill>开始推演</button></div>') + '</section>';
    return html;
  }
  function bindDrill() {
    bindCommon();
    document.querySelectorAll('[data-run-drill]').forEach(function (b) {
      b.onclick = function () {
        if (state.drillDone) { state.drillDone = false; state.drillReport = false; S.go('drill'); return; }
        state.drillDone = true; state.drillReport = false;
        S.toast('<b>推演</b>：9 个步骤已完成，正在生成复盘…');
        setTimeout(function () {
          state.drillReport = true;
          if (location.hash === '#drill') { S.go('drill'); }
          S.toast('<b>复盘完成</b>：发现 2 项偏差，已生成整改建议');
        }, 1200);
        S.go('drill');
      };
    });
  }
  function drillInsight() {
    return { summary: 'R101 反应失控推演完成 9 个步骤，7 个门禁通过；联锁旁路审批和能量隔离确认出现超时，是主要偏差。', findings: ['推演暴露了“先诊断、后退守”的顺序风险。', '联锁审批证据链不完整。', '复盘可回写 RC-01 处置程序与培训案例。'], actions: ['把联锁状态确认前置到退守前。', '将能量隔离证据纳入任务链必填项。', '3 个工作日内完成 SOP 修订和班组复训。'], evidence: ['9 步推演', '2 项偏差', 'RC-01'], basis: '推演与复盘' };
  }

  S.askAI = S.askAI || function (text) { S.openAI('chat'); };

  S.boot({
    product: 'iacms', code: 'iACMS', name: '异常工况智能管理系统',
    subtitle: 'AI + Agent · 异常工况全生命周期', mark: 'AC',
    brandName: '异常工况', workspace: '某精细化工 · 演示环境', user: '张', date: '2026-10-28',
    defaultPage: 'dashboard', searchPlaceholder: '搜索异常工况 / 批号 / 文档',
    nav: [
      { group: '运行', items: [{ id: 'dashboard', icon: 'dashboard', label: '管理驾驶舱' }, { id: 'workbench', icon: 'spark', label: '智能体工作台' }] },
      { group: '知识', items: [{ id: 'knowledge', icon: 'file', label: '知识库 / 文档' }, { id: 'library', icon: 'quality', label: '异常工况库' }] },
      { group: '处置', items: [{ id: 'case', icon: 'play', label: '当前处置', badge: '3' }, { id: 'drill', icon: 'plan', label: '推演与复盘' }] }
    ],
    pages: {
      dashboard: { title: '管理驾驶舱', crumb: '管理驾驶舱', render: renderDashboard, bind: bindCommon, insight: dashboardInsight },
      knowledge: { title: '知识库 / 文档', crumb: '知识库 / 文档', render: renderKnowledge, bind: bindKnowledge, insight: knowledgeInsight },
      library: { title: '异常工况库', crumb: '异常工况库', render: renderLibrary, bind: bindLibrary, insight: libraryInsight },
      workbench: { title: '智能体工作台', crumb: '智能体工作台', render: renderWorkbench, bind: bindWorkbench, insight: workbenchInsight },
      case: { title: '当前处置', crumb: '当前处置', render: renderCase, bind: bindCase, insight: caseInsight },
      drill: { title: '推演与复盘', crumb: '推演与复盘', render: renderDrill, bind: bindDrill, insight: drillInsight }
    }
  });
  var drawer = document.createElement('div');
  drawer.className = 'iac-drawer';
  drawer.id = 'iacmsDrawer';
  drawer.innerHTML = '<div class="iac-drawer-bg" data-close-drawer></div><aside class="iac-drawer-panel"><button class="iac-close" data-close-drawer aria-label="关闭">×</button><div class="iac-drawer-body"></div></aside>';
  document.body.appendChild(drawer);
  drawer.querySelectorAll('[data-close-drawer]').forEach(function (b) { b.onclick = closeDrawer; });
  ensureAgentModal();
})();
