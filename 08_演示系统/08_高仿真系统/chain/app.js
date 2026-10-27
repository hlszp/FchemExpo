(function () {
  var D = window.CHAIN_DEMO;
  var S = window.SimShell;
  var esc = S.esc;
  var state = { run: false };
  var EMBED = /(?:\?|&)embed=/.test(location.search);
  if (EMBED) { document.body.classList.add('embed-mode'); }

  function h(v) { return esc(v); }
  function nowShort() { return S.nowText().slice(-8); }
  function head(kicker, title, sub, actions) {
    return '<div class="page-head"><div><div class="eyebrow">' + h(kicker) + '</div><h1>' + h(title) + '</h1><p>' + h(sub) + '</p></div><div class="head-actions">' + (actions || '') + '</div></div>';
  }
  function kpi(label, value, unit, hint, color) {
    return '<div class="item"><span>' + h(label) + '</span><b style="color:' + color + '">' + h(value) + '<small style="font-size:10px;color:#94A3B8;margin-left:2px">' + h(unit) + '</small></b><em>' + h(hint) + '</em></div>';
  }
  function xLabels(n) {
    var a = []; var marks = { 0: '03-01', 30: '03-31', 60: '04-30', 89: '05-29' };
    for (var i = 0; i < n; i++) { a.push(marks[i] || ''); }
    return a;
  }
  function goSystem(slug, hash, batch) {
    try { sessionStorage.setItem('DEMO_CHAIN_BATCH', batch || D.batch); } catch (e) {}
    location.href = '/demo/app/' + slug + '/#' + hash;
  }
  function hero(title, subtitle, chips) {
    return '<div class="task-hero"><div class="k">FULL-CHAIN TASK / 全链路任务</div><h1>' + h(title) + '</h1><p>' + h(subtitle) + '</p><div class="task-chips">' + (chips || []).map(function (c) { return '<span class="task-chip ' + (c.warn ? 'warn' : '') + '"><i></i>' + h(c.text) + '</span>'; }).join('') + '<button class="btn ai" data-task-chat style="margin-left:auto;background:#123B5C;border-color:#24527C;color:#E8F2FF">AI 对话</button></div></div>';
  }
  function taskCard(title, hint, body) {
    return '<div class="task-card"><h3>' + h(title) + '<span class="hint">' + h(hint) + '</span></h3>' + body + '</div>';
  }
  function agents(list) {
    return '<div class="agent-list">' + list.map(function (a, i) {
      return '<div class="agent ' + (a.status || 'pending') + '"><div class="ico">' + (i + 1) + '</div><div><h5>' + h(a.name) + ' · ' + h(a.role) + '</h5><p>' + h(a.msg) + '</p></div><span class="state">' + ({ done: '完成', active: '进行中', pending: '待启动' }[a.status] || '待启动') + '</span></div>';
    }).join('') + '</div>';
  }
  function steps(list, animate) {
    return '<div class="task-flow">' + list.map(function (s, i) {
      var st = (animate && state.run) ? (i < 4 ? 'done' : 'active') : s.status;
      return '<div class="task-step ' + st + '"><div class="top"><span class="num">0' + (i + 1) + '</span><span class="src">' + h(s.src) + '</span></div><h4>' + h(s.title) + '</h4><p>' + h(s.detail) + '</p><div class="foot"><span class="time">' + h(s.time) + '</span><span class="state ' + st + '">' + ({ done: '已完成', active: '进行中', pending: '待处理' }[st] || st) + '</span></div><div class="foot"><span class="hint">' + h(s.evidence || '') + '</span><a class="jump" href="#" data-go="' + h(s.key) + '">进入 ' + h(s.src) + ' →</a></div></div>';
    }).join('') + '</div>';
  }
  function linkFor(key, hash) {
    var m = { ipae: 'ipae', iaas: 'iaas', iclpm: 'iclpm', imcs: 'imcs' };
    if (key === 'inwork') { location.href = 'https://agent.zlinsoft.cn:18799/workspace/'; return; }
    goSystem(m[key] || key, hash || 'dashboard');
  }

  function abnormalInsight() {
    return {
      time: nowShort(), basis: '全链路任务 · 异常工况',
      summary: '同一批号 <b>' + D.batch + '</b> 已走完 iPAE 发现、iAAS 报警、iCLPM 回路诊断，当前卡在 iMCS 批记录核对与 inWork 处置闭环。',
      findings: [
        'iPAE：OP30 升温 +14 min，越界率 12.6%；iAAS：A01-TIC-1203 连续 3 次；iCLPM：评分 18.4，振荡/黏滞。',
        'iMCS：eBR 收率 127.34%，需核对产量/投料口径；质量已放行，但批记录仍待审核。',
        '五个 Agent 中监测/报警已完成，诊断进行中，审核/处置待启动；SLA 2 h。'
      ],
      actions: [
        '先完成 iCLPM 回路诊断，确认阀门黏滞还是增益问题。',
        '在 iMCS 核对 127.34% 收率与投料口径，再审核 eBR。',
        '在 inWork 建处置任务并回填结果，形成一条可追溯证据链。'
      ],
      evidence: ['批次 ' + D.batch, '5 步链路', 'SLA 2 h', '5 个 Agent']
    };
  }
  function catalystInsight() {
    return {
      time: nowShort(), basis: '全链路任务 · 催化剂活性',
      summary: '基于 <b>2,160 个历史时间窗</b>估计催化剂活性指数 <b>82.4%</b>（R² 0.91、RMSE 1.8），按当前工况约 <b>18 天</b>后触达 80% 预警线。',
      findings: [
        '未新增仪表：只用现有温度、循环量、进料负荷、床层差压与收率数据。',
        '活性指数从 100% 衰减到 82.4%；反应温度贡献 38%、循环量 26%、负荷 21%、差压 15%。',
        '模型是慢变量软测量，能提前看到“活性衰减”而不是等化验结果。'
      ],
      actions: [
        '先提温 2℃、降负荷 3%，观察 48h 的活性指数与收率响应。',
        '若活性继续下降，锁定换剂窗口，避免非计划停车。',
        '把模型输出接入 iPAE 工艺洞察页，形成可追溯的趋势与建议。'
      ],
      evidence: ['活性 82.4%', 'R² 0.91', '预测 18 天', '2,160 窗']
    };
  }
  function hxInsight() {
    return {
      time: nowShort(), basis: '全链路任务 · 换热器性能',
      summary: '从历史温差/流量/热负荷反算总传热系数 <b>U=186 W/m²K</b>（清洁 240），污垢热阻升至 0.00195，按当前趋势约 <b>12 天</b>后达到清洗阈值。',
      findings: [
        'U 下降 22.5%，污垢热阻上升 55%，趋势显著（置信度 0.86）。',
        '热负荷贡献 42%、流量 31%、温差 18%、压降 9%；不是单一仪表问题。',
        '当前仍可运行，但高负荷窗口会放大结垢风险，建议提前安排清洗。'
      ],
      actions: [
        '避开 4 月高负荷窗口，安排 12 天内清洗/旁路。',
        '清洗前后用同一模型复算 U 与污垢热阻，验证收益。',
        '把换热器性能纳入 iPAE 慢变量监控，和催化剂活性一起看。'
      ],
      evidence: ['U 186', '清洁 240', '预测 12 天', '置信 0.86']
    };
  }

  function renderAbnormal() {
    var t = D.abnormal;
    var html = hero(t.title, t.subtitle, [
      { text: '批号 ' + D.batch }, { text: '装置 ' + D.area },
      { text: '状态 ' + t.status, warn: true }, { text: 'SLA ' + t.sla }, { text: '责任人 ' + t.owner }
    ]);
    html += '<div class="task-summary"><div class="item"><span>批次</span><b>' + h(D.batch) + '</b></div><div class="item"><span>产品 / 装置</span><b>' + h(D.product) + ' · ' + h(D.area) + '</b></div><div class="item"><span>任务状态</span><b style="color:#D97706">' + h(t.status) + '</b></div><div class="item"><span>当前卡点</span><b>iCLPM 回路诊断</b></div></div>';
    html += steps(t.steps, true);
    html += '<div class="task-lower">';
    html += taskCard('Agent 协作链', t.agents.filter(function (a) { return a.status === 'done'; }).length + ' / ' + t.agents.length + ' 完成', agents(t.agents) + '<div class="task-actions"><button class="btn ai" data-run-task>运行 Agent 协作</button><button class="btn" data-open-ai>让 AI 生成处置建议</button></div>');
    html += taskCard('这条链路带来什么', '演示口径', '<div class="impact-grid">' + t.impact.map(function (x) { return '<div class="impact"><b>' + h(x.value) + '</b><span>' + h(x.label) + '</span><div class="d">' + h(x.detail) + '</div></div>'; }).join('') + '</div><div class="task-note">不是五个系统各看一遍，而是围绕一个任务，把批次、报警、回路、批记录和处置串起来；AI/Agent 只做建议，最终由人确认。</div>');
    html += '</div>';
    html += '<div class="task-card"><h3>分系统证据入口<span class="hint">点开即带贯穿批号</span></h3><div class="task-actions">';
    [['iPAE 越界清单', 'ipae', 'outlier'], ['iAAS 实时报警', 'iaas', 'realtime'], ['iCLPM 回路列表', 'iclpm', 'loops'], ['iMCS 电子批记录', 'imcs', 'ebr']].forEach(function (x) {
      html += '<button class="btn" data-sys="' + x[1] + '" data-hash="' + x[2] + '">' + x[0] + ' →</button>';
    });
    html += '</div></div>';
    html += '<div class="ai-card" data-ai-open style="cursor:pointer;margin-top:12px"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>同一批号已走完 iPAE 发现、iAAS 报警、iCLPM 回路诊断；当前卡在 iMCS 批记录核对与 inWork 处置闭环。</p><div class="foot"><span class="ai-chip">5 步链路</span><span class="ai-chip">5 个 Agent</span><span class="ai-chip">SLA 2 h</span></div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
    return html;
  }
  function renderCatalyst() {
    var d = D.catalyst;
    var vals = [];
    for (var i = 0; i < 90; i++) { vals.push(100 - 17.6 * i / 89 + Math.sin(i / 4) * 0.7 + Math.sin(i / 9) * 0.35); }
    var html = hero(d.title, d.subtitle, [{ text: '不新增仪表' }, { text: '历史窗口 90 天' }, { text: '当前活性 82.4%', warn: true }, { text: '预测 18 天触线' }]);
    html += '<div class="task-kpi">';
    html += kpi('活性指数', '82.4', '%', '较初期 -17.6%', '#DC2626');
    html += kpi('模型 R²', '0.91', '', 'RMSE 1.8', '#0B9A78');
    html += kpi('历史窗口', '2,160', '个', '温度/流量/负荷/差压', '#1466E8');
    html += kpi('预计触线', '18', '天', '80% 预警线', '#D97706');
    html += '</div>';
    html += '<div class="task-lower"><div class="task-card"><h3>活性指数趋势（模型估计）<span class="hint">阈值 80%</span></h3><div class="chart">' + S.chart.line(vals, { labels: xLabels(90), target: 80, min: 78, max: 102, fixed: 1, color: '#DC2626' }) + '</div><div class="task-note">实线为慢变量模型估计；虚线为 80% 预警线。模型只用现有 DCS 历史数据，无需新增分析仪。</div></div>';
    html += taskCard('模型看到了什么', d.model, '<div class="task-data">' + d.factors.map(function (f) { return '<div class="row"><span>' + h(f.name) + '</span><b>' + f.value + '%</b></div><div class="progress" style="height:5px"><span style="width:' + f.value + '%;background:' + f.color + '"></span></div>'; }).join('') + '</div><div class="task-model"><h4>' + h(d.model) + '</h4><p>把温度、循环量、负荷、差压作为输入，估计一个不可直接测量的“活性指数”；再用它做趋势与剩余寿命预测。</p><div class="code">activity_t = f(T, recycle, load, dP, yield)<br>R² = 0.91 · RMSE = 1.8% · horizon = 30d</div></div>');
    html += '</div>';
    html += '<div class="task-card" style="margin-bottom:12px"><h3>从历史数据到操作建议<span class="hint">5 步</span></h3>' + steps(d.steps.map(function (s, i) { return { src: ['iPAE', 'iPAE', '模型', '模型', '工艺'][i], title: s.title, detail: s.detail, status: s.status, time: ['03-01', '04-01', '05-01', '05-01', '05-01'][i], evidence: 'iPAE 慢变量页' }; })) + '</div>';
    html += '<div class="task-lower"><div class="task-card"><h3>Agent 协作</h3>' + agents(d.agents) + '<div class="task-actions"><button class="btn" data-sys="ipae" data-hash="latent">进入 iPAE 工艺洞察 →</button></div></div><div class="task-card"><h3>为什么这是“工艺辅助”</h3><div class="task-note">不是替代工艺员，而是把“老师傅感觉催化剂在衰减”变成可解释的指数、趋势和预测窗口。模型输出带 R²、RMSE、贡献度，工艺员可以复核、可以否决。AI 只负责解释与建议，参数调整仍由人确认。</div><div class="task-model"><h4>AI / Agent 可介入的 3 个点</h4><p>1）数据准备与异常段剔除；2）模型解释（哪些变量在驱动活性）；3）把预测翻译成操作建议并跟踪结果。</p></div></div></div>';
    html += '<div class="ai-card" data-ai-open style="cursor:pointer;margin-bottom:12px"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>基于 2,160 个历史时间窗估计活性 82.4%（R² 0.91），约 18 天后触达 80% 预警线。</p><div class="foot"><span class="ai-chip">R² 0.91</span><span class="ai-chip">18 天</span><span class="ai-chip">不新增仪表</span></div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
    return html;
  }
  function renderHx() {
    var d = D.hx;
    var vals = [];
    for (var i = 0; i < 90; i++) { vals.push(240 - 54 * i / 89 + Math.sin(i / 5) * 1.2); }
    var html = hero(d.title, d.subtitle, [{ text: 'U 186 / 清洁 240' }, { text: '污垢热阻 +55%', warn: true }, { text: '预测 12 天清洗' }, { text: '置信 0.86' }]);
    html += '<div class="task-kpi">' + kpi('总传热系数', '186', 'W/m²K', '清洁 240', '#DC2626') + kpi('污垢热阻', '0.00195', '', '较初期 +55%', '#D97706') + kpi('预测清洗', '12', '天', '当前趋势', '#D97706') + kpi('置信度', '0.86', '', '历史窗口 1,440', '#0B9A78') + '</div>';
    html += '<div class="task-lower"><div class="task-card"><h3>总传热系数趋势<span class="hint">清洗阈值 190</span></h3><div class="chart">' + S.chart.line(vals, { labels: xLabels(90), target: 190, min: 180, max: 245, fixed: 0, color: '#D97706' }) + '</div><div class="task-note">从进出口温度、流量、热负荷反算 U；不是直接测污垢，而是从历史数据里“算”出慢变量。</div></div>' + taskCard('贡献度', d.model, '<div class="task-data">' + d.factors.map(function (f) { return '<div class="row"><span>' + h(f.name) + '</span><b>' + f.value + '%</b></div><div class="progress" style="height:5px"><span style="width:' + f.value + '%;background:' + f.color + '"></span></div>'; }).join('') + '</div><div class="task-model"><h4>传热反算</h4><p>Q = m·cp·ΔT；U = Q / (A·LMTD)；再结合流量与压降，分离负荷变化与结垢趋势。</p><div class="code">U = Q / (A × LMTD)<br>Rf = 1/U - 1/U_clean<br>R² = 0.88 · horizon = 30d</div></div>') + '</div>';
    html += '<div class="task-card" style="margin-bottom:12px"><h3>从数据到清洗窗口<span class="hint">5 步</span></h3>' + steps(d.steps.map(function (s, i) { return { src: ['iPAE', 'iPAE', '模型', '模型', '工艺'][i], title: s.title, detail: s.detail, status: s.status, time: ['03-01', '04-01', '05-01', '05-01', '05-01'][i], evidence: 'iPAE 慢变量页' }; })) + '</div>';
    html += '<div class="task-lower"><div class="task-card"><h3>Agent 协作</h3>' + agents(d.agents) + '<div class="task-actions"><button class="btn" data-sys="ipae" data-hash="latent">进入 iPAE 工艺洞察 →</button></div></div><div class="task-card"><h3>和催化剂一起看</h3><div class="task-note">换热器结垢和催化剂衰减都是慢变量；放在同一张“工艺健康”视图里，才能判断是负荷、原料还是设备问题。AI 负责解释趋势，工艺员决定清洗/换剂窗口。</div><div class="task-model"><h4>Agent 可介入</h4><p>1）自动对齐检修/清洗记录；2）区分负荷波动与真实结垢；3）在合适窗口生成清洗建议并跟踪验证。</p></div></div></div>';
    html += '<div class="ai-card" data-ai-open style="cursor:pointer;margin-bottom:12px"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>U 从 240 降到 186，污垢热阻 +55%；按当前趋势约 12 天后达到清洗阈值。</p><div class="foot"><span class="ai-chip">U 186</span><span class="ai-chip">12 天</span><span class="ai-chip">置信 0.86</span></div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
    return html;
  }
  function bindTask() {
    S.qsa('[data-task-chat]').forEach(function (b) { b.addEventListener('click', function () { S.openAI('chat'); }); });
    S.qsa('[data-run-task]').forEach(function (b) { b.addEventListener('click', function () { state.run = true; S.toast('<b>Agent 协作</b>：已模拟运行，诊断/审核/处置依次接手'); S.go('abnormal'); }); });
    S.qsa('[data-open-ai]').forEach(function (b) { b.addEventListener('click', function () { S.openAI(); }); });
    S.qsa('[data-sys]').forEach(function (b) {
      b.addEventListener('click', function () { var key = b.getAttribute('data-sys'); var hash = b.getAttribute('data-hash'); if (key === 'inwork') { location.href = 'https://agent.zlinsoft.cn:18799/workspace/'; } else { goSystem(key, hash); } });
    });
    S.qsa('[data-go]').forEach(function (a) { a.addEventListener('click', function (e) { e.preventDefault(); var key = a.getAttribute('data-go'); var map = { ipae: 'outlier', iaas: 'realtime', iclpm: 'loops', imcs: 'ebr', inwork: '' }; if (key === 'inwork') { location.href = 'https://agent.zlinsoft.cn:18799/workspace/'; } else { goSystem(key, map[key] || 'dashboard'); } }); });
  }

  S.boot({
    product: 'chain', code: 'iLINK', name: '全链路任务指挥台', brandName: '任务指挥台',
    subtitle: '围绕任务，不围绕产品', mark: 'L',
    workspace: '某精细化工 · 全链路演示', user: '张', date: '2026-10-28',
    defaultPage: 'abnormal', searchPlaceholder: '搜索任务 / 批次',
    nav: [
      { group: '任务', items: [{ id: 'abnormal', icon: 'dashboard', label: '异常工况处置' }, { id: 'catalyst', icon: 'quality', label: '催化剂活性' }, { id: 'hx', icon: 'plan', label: '换热器性能' }] }
    ],
    pages: {
      abnormal: { title: '异常工况处置', crumb: '异常工况处置', render: renderAbnormal, bind: bindTask, insight: abnormalInsight },
      catalyst: { title: '催化剂活性', crumb: '催化剂活性', render: renderCatalyst, bind: bindTask, insight: catalystInsight },
      hx: { title: '换热器性能', crumb: '换热器性能', render: renderHx, bind: bindTask, insight: hxInsight }
    }
  });
  if (EMBED) { setTimeout(function () { try { parent.postMessage({ type: 'ilink:ready', batch: D.batch, tasks: 3 }, '*'); } catch (e) {} }, 300); }
})();
