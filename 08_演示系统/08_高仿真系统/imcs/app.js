(function () {
  var D = window.IMCS_DEMO;
  var EBR = window.IMCS_EBR;
  var MOD = window.IMCS_MODULES;
  var S = window.SimShell;
  var esc = S.esc;
  if (EBR && EBR.records) { D.ebrRecords = EBR.records; }
  var state = { line: '全部', status: '全部', q: '', quality: '全部', material: '全部', zoneQ: '', zoneStatus: '全部', zone: 'GQ1', ebrQ: '', ebrAudit: '全部', ebrBatch: '', ebrProduct: '', ebrFormula: '', ebrPage: 1, ebrDetail: null, ebrActive: 'SH-OP-1', ebrOpen: { 'SH-OP-1': true }, ebrSec: { quality: true }, ebrInterval: '1小时', recipeQ: '', recipeStatus: '全部', monitorTab: '关键工艺', labTab: '过程化验', labQ: '', whTab: '物料入库', whQ: '' };
  var RECIPES = [
    { code: 'BIT_01', name: 'BIT 粗品', product: 'BIT', version: 'V3.2', status: '已发布', steps: 11, checks: 8, line: 'A01', updated: '2026-10-20', owner: '李工', note: 'SH 缩合 / LV 氯化 / YL 压滤 / TS 脱色' },
    { code: 'BBIT_02', name: 'BBIT 粗品', product: 'BBIT', version: 'V2.6', status: '已发布', steps: 14, checks: 10, line: 'B01', updated: '2026-10-18', owner: '王工', note: '混料 / 离心 / 干燥 / 包装' },
    { code: 'MTBA_03', name: 'MTBA 成品', product: 'MTBA', version: 'V1.9', status: '已发布', steps: 9, checks: 6, line: 'B01', updated: '2026-10-12', owner: '李工', note: '酸化 / 萃取 / 脱色' },
    { code: 'BIT_04', name: 'BIT 精品', product: 'BIT', version: 'V4.1', status: '草稿', steps: 12, checks: 9, line: 'A01', updated: '2026-10-27', owner: '张平', note: '新增二次脱色与在线化验' },
    { code: 'BBIT_05', name: '低湿 BBIT', product: 'BBIT', version: 'V1.3', status: '草稿', steps: 10, checks: 7, line: 'B01', updated: '2026-10-26', owner: '王工', note: '干燥曲线优化' },
    { code: 'BIT_06', name: 'BIT 出口级', product: 'BIT', version: 'V2.0', status: '停用', steps: 11, checks: 8, line: 'A01', updated: '2026-09-30', owner: '李工', note: '由 BIT_01 V3.2 替代' }
  ];

  function h(v) { return esc(v); }
  function nowShort() { return S.nowText().slice(-8); }
  function tag(s) {
    var m = { '执行中': 'blue', '已完成': 'green', '待接单': 'amber', '异常': 'red', '合格': 'green', '不合格': 'red', '待检': 'gray', '中控合格': 'blue', '低库存': 'amber', '正常': 'green', '运行': 'green', '待机': 'gray', '启用': 'green', '高液位': 'red', '低液位': 'amber', '未审核': 'amber', '已通过': 'green', '已驳回': 'red', '放行': 'green', '已复审': 'green', '已发布': 'green', '草稿': 'amber', '停用': 'gray', '复核中': 'amber', '完成': 'green', '待复核': 'amber', '已出库': 'blue', '待处理': 'amber', '已盘平': 'green', '待检验': 'amber', '待复审': 'amber', '待执行': 'amber', '已执行': 'green', '已关闭': 'gray' };
    return '<span class="tag ' + (m[s] || 'gray') + '">' + h(s) + '</span>';
  }
  function pct(v) { return '<div class="progress"><span style="width:' + Math.max(0, Math.min(100, v)) + '%"></span></div>'; }
  function head(kicker, title, sub, actions) {
    return '<div class="page-head"><div><div class="eyebrow">' + h(kicker) + '</div><h1>' + h(title) + '</h1><p>' + h(sub) + '</p></div><div class="head-actions">' + (actions || '') + '</div></div>';
  }
  function kpi(label, value, unit, delta, cls, color, spark) {
    return '<div class="kpi" style="--kc:' + color + '"><div class="k"><span>' + h(label) + '</span>' + (spark || '') + '</div><div class="v">' + h(value) + (unit ? '<small>' + h(unit) + '</small>' : '') + '</div><div class="d">' + delta + '</div></div>';
  }
  function aiCard(text, chips) {
    return '<div class="ai-card" data-ai-open style="cursor:pointer"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>' + text + '</p><div class="foot">' + (chips || []).map(function (c) { return '<span class="ai-chip">' + h(c) + '</span>'; }).join('') + '</div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
  }
  function alertStrip() {
    return '<div class="alert-strip" style="margin-top:10px"><span class="dot"></span><span><b>异常提醒</b>：WO-2026-0303 温控点超限；催化剂 CA-003 低于安全库存；批次 B20261027-02 中控温度 96.2℃ 超过 95℃ 上限。</span></div>';
  }
  function detailGrid(items) {
    return '<div class="detail-grid">' + items.map(function (it) {
      return '<div class="detail-item"><span>' + h(it[0]) + '</span><b>' + it[1] + '</b></div>';
    }).join('') + '</div>';
  }
  function table(headers, rows) {
    return '<div class="table-wrap"><table><thead><tr>' + headers.map(function (x) { return '<th>' + h(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function lowMaterials() { return D.materials.filter(function (m) { return m.status === '低库存'; }); }

  function dashboardInsight() {
    return {
      time: nowShort(), basis: '驾驶舱 · 当前班次',
      summary: '今日计划达成 <b>73.3%</b>，低于 80% 的班次预警线；缺口集中在 <b>2 条异常工单</b>和 1 条待接单，产量端 7 日最低值出现在今天。',
      findings: [
        '<b>WO-2026-0303</b> 进度 38%，交期 10-27 18:00，批次 B20261027-02 中控温度 96.2℃ 超过 95℃ 上限。',
        '7 日产量 9,500 kg，较 12,000 kg 目标低 <b>20.8%</b>；3/27 峰值 13,300 kg 后连续回落。',
        '催化剂 CA-003 库存 12 kg，安全库存 20 kg，按当前消耗仅够 <b>0.8 天</b>；碱液 AL-007 同样低于安全线。'
      ],
      actions: [
        '优先处理 WO-2026-0303：确认 R-201 温控回路与批次 B20261027-02 的处置方案。',
        '今日 16:00 前完成 CA-003 调拨或采购，避免明日一车间停线。',
        '将 WO-2026-0305 从待接单转为待排，利用 R-101 在 10-28 上午的空档。'
      ],
      evidence: ['计划达成 73.3%', '异常工单 2', 'CA-003 12 kg', '今日产量 9,500 kg']
    };
  }

  function planInsight() {
    var list = filteredOrders();
    var abn = list.filter(function (o) { return o.status === '异常'; }).length;
    var late = list.filter(function (o) { return o.status !== '已完成' && o.progress < 50; }).length;
    return {
      time: nowShort(), basis: '计划排程 · ' + state.line + ' / ' + state.status,
      summary: '当前筛选 <b>' + list.length + ' 条</b>工单，其中 <b>' + abn + ' 条异常</b>、' + late + ' 条进度低于 50%。建议先处理异常与临期工单，再排待接单。',
      findings: [
        '异常工单：' + (list.filter(function (o) { return o.status === '异常'; }).map(function (o) { return '<b>' + h(o.id) + '</b>'; }).join('、') || '无') + '；均集中在二车间。',
        '临期风险：WO-2026-0303 交期 10-27 18:00，当前进度 38%；WO-2026-0310 交期 10-27 20:00，进度 22%。',
        '待接单 2 条（WO-2026-0305 / WO-2026-0311），均为一车间低优先级，可合并排产。'
      ],
      actions: [
        '将 WO-2026-0303 升级为班次重点，先确认温控与异常处置。',
        '把 WO-2026-0310 的剩余工序拆到 R-202 待机窗口，避免继续压单。',
        'WO-2026-0305 / 0311 合并到 10-28 下午一车间，减少换型。'
      ],
      evidence: ['筛选 ' + list.length + ' 条', '异常 ' + abn + ' 条', '进度<50% ' + late + ' 条']
    };
  }

  function executionInsight() {
    var list = filteredBatches();
    return {
      time: nowShort(), basis: '生产执行 · ' + state.line,
      summary: '当前 <b>' + list.length + ' 个批次</b>，其中 <b>' + list.filter(function (b) { return b.status === '异常'; }).length + ' 个异常</b>。B20261027-02 温控超限，B20261027-01 pH 偏低，建议先处置异常批次。',
      findings: [
        '<b>B20261027-02</b>（MTBA 粗品）中控温度 96.2℃，超过 95℃ 上限，关联工单 WO-2026-0303。',
        '<b>B20261027-01</b>（BIT 粗品）中控 pH 6.4，低于 6.5 下限；同工单进度 62%。',
        'B20261027-06 纯度 98.9%，低于 99.0% 内控线，需复检后再放行。'
      ],
      actions: [
        '先暂停 B20261027-02 的升温段，确认 R-201 温控阀与夹套冷却水。',
        'B20261027-01 补加碱液后复测 pH，记录到批记录。',
        'B20261027-06 隔离待复检，未放行前不进入包装。'
      ],
      evidence: ['批次 ' + list.length + ' 个', '异常 1 个', '中控不合格 2 项']
    };
  }

  function qualityInsight() {
    var list = filteredInspections();
    var bad = list.filter(function (q) { return q.result === '不合格'; }).length;
    return {
      time: nowShort(), basis: '质量检验 · ' + state.quality,
      summary: '近 7 日合格率 <b>98.2%</b>，低于 98% 目标 0.2 个百分点；当前筛选 <b>' + list.length + ' 条</b>检验，<b>' + bad + ' 条不合格</b>。',
      findings: [
        '最近一次合格率 98.2%，3/27 曾低至 97.8%；波动集中在 pH 与温度两个中控项。',
        '不合格记录：B20261027-02 温度 96.2℃、B20261027-01 pH 6.4、B20261027-06 纯度 98.9%。',
        '不合格项均发生在二车间或换型后首批，建议按“换型首批加严”处理。'
      ],
      actions: [
        '对 B20261027-02 / 01 开不合格处置单，先隔离再评审。',
        '把 pH、温度中控项加入换型后首批加密采样。',
        '复核二车间 R-201 温控与加碱计量，确认是否同源。'
      ],
      evidence: ['合格率 98.2%', '不合格 ' + bad + ' 条', '目标 98.0%']
    };
  }

  function materialInsight() {
    var list = filteredMaterials();
    var low = list.filter(function (m) { return m.status === '低库存'; }).length;
    return {
      time: nowShort(), basis: '物料库存 · ' + state.material,
      summary: '当前 <b>' + list.length + ' 种物料</b>，<b>' + low + ' 种低于安全库存</b>。CA-003 仅够 0.8 天，AL-007 仅够 1.1 天，是今明两天的主要断料风险。',
      findings: [
        '<b>催化剂 CA-003</b>：12 kg / 安全 20 kg，可用 0.8 天，直接影响一车间 BIT 粗品。',
        '<b>碱液 AL-007</b>：45 L / 安全 80 L，可用 1.1 天，影响 pH 调节与 B20261027-01 处置。',
        '溶剂 B SB-005：80 L / 安全 100 L，可用 2.1 天，暂不紧急但需在 10-29 前补。'
      ],
      actions: [
        'CA-003 今日 16:00 前调拨/采购，优先保一车间。',
        'AL-007 与 CA-003 合并下单，减少一次物流。',
        'SB-005 纳入 10-29 补货计划，避免与 CA-003 同时断料。'
      ],
      evidence: ['低库存 ' + low + ' 种', 'CA-003 0.8 天', 'AL-007 1.1 天']
    };
  }

  function filteredOrders() {
    return D.orders.filter(function (o) {
      if (state.line !== '全部' && o.line !== state.line) { return false; }
      if (state.status !== '全部' && o.status !== state.status) { return false; }
      if (state.q && (o.id + o.product + o.owner).toLowerCase().indexOf(state.q.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function filteredBatches() {
    return D.batches.filter(function (b) { return state.line === '全部' || b.line === state.line; });
  }
  function filteredInspections() {
    return D.inspections.filter(function (q) { return state.quality === '全部' || q.result === state.quality; });
  }
  function filteredMaterials() {
    return D.materials.filter(function (m) { return state.material === '全部' || m.status === state.material; });
  }

  function renderDashboard() {
    var k = D.kpi;
    var html = head('iMCS / 生产驾驶舱', '生产管理仪表盘', '2026-10-27 当班 · 数据截止 ' + nowShort() + ' · 演示合成数据', '<button class="btn" data-action="refresh">刷新</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('在执行工单', k.activeOrders + '/' + k.totalOrders, '', '<span class="up">53.3%</span> 进行中', 'blue', '#1466E8', S.chart.spark([6, 7, 7, 8, 9, 8, 8], '#1466E8'));
    html += kpi('今日完工', k.finishedToday, '单', '<span class="up">▲ +1</span> 较昨日', 'green', '#0B9A78', S.chart.spark([1, 2, 2, 3, 2, 3, 3], '#0B9A78'));
    html += kpi('今日产量', '12,500', 'kg', '<span class="up">▲ +800 kg</span> 较昨日', 'blue', '#0EA5E9', S.chart.spark([9800, 10200, 10800, 11500, 11700, 12100, 12500], '#0EA5E9'));
    html += kpi('计划达成率', '73.3', '%', '<span class="up">▲ +2.1%</span> 较昨日', 'amber', '#D97706', S.chart.spark([68, 70, 71, 70, 72, 71, 73], '#D97706'));
    html += kpi('设备运行', k.devicesRunning + '/' + k.devicesTotal, '台', '运行率 <span class="warn">75.0%</span>', 'green', '#008D9A', S.chart.spark([5, 6, 6, 7, 6, 6, 6], '#008D9A'));
    html += kpi('异常工单', k.abnormalOrders, '单', '<span class="down">▲ +1</span> 需处理', 'red', '#DC2626', S.chart.spark([0, 1, 1, 0, 1, 1, 2], '#DC2626'));
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>近 7 日产量趋势</h3><span>实际 / 计划 · kg</span></div><div class="chart">' + S.chart.bars(D.productionTrend, { target: 12000, height: 220 }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>实际产量</span><span><i style="background:#0EA5E9;opacity:.5"></i>计划产量</span><span><i style="background:#F59E0B"></i>目标 12,000 kg</span></div></div>';
    html += '<div class="card"><div class="card-h"><h3>工单状态分布</h3><span>共 15 单</span></div>' + S.chart.donut(D.orderStatus, '15', '工单总数') + '</div>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>质量合格率趋势</h3><span>近 7 日 · 目标 98%</span></div><div class="chart">' + S.chart.line(D.qualityTrend, { labels: D.qualityLabels, target: 98, min: 96, max: 100, fixed: 1, color: '#0B9A78' }) + '</div><div class="legend"><span><i style="background:#0B9A78"></i>合格率</span><span><i style="background:#F59E0B"></i>目标 98%</span></div></div>';
    var low = lowMaterials();
    html += '<div class="card"><div class="card-h"><h3>物料库存预警</h3><span>TOP 3</span></div>';
    low.forEach(function (m) {
      var w = Math.min(100, m.stock / (m.safety * 2) * 100);
      html += '<div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid #EEF2F7"><div style="min-width:112px"><b style="font-size:12px">' + h(m.name) + '</b><div class="sub">' + h(m.code) + '</div></div><div style="flex:1"><div class="progress" style="height:7px"><span style="width:' + w + '%;background:#D97706"></span></div></div><div style="min-width:86px;text-align:right"><b style="font-size:12px;color:#B45309">' + m.stock + ' ' + h(m.unit) + '</b><div class="sub">安全 ' + m.safety + ' · ' + m.days + ' 天</div></div></div>';
    });
    html += '<div style="margin-top:10px"><button class="btn small" data-nav-jump="materials">查看全部物料 →</button></div></div>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>设备运行状态</h3><span>6 / 8 台运行</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">' + D.devices.map(function (d) {
      return '<div style="border:1px solid #E2E8F0;border-radius:8px;padding:8px 10px;background:#FBFDFF"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:11.5px">' + h(d.name) + '</b>' + tag(d.status) + '</div><div class="sub" style="margin-top:2px">OEE ' + d.oee + '% · ' + d.temp + '℃</div></div>';
    }).join('') + '</div></div>';
    html += '<div class="card"><div class="card-h"><h3>当班告警</h3><span>3 条</span></div>' + alertStrip() + '<div style="margin-top:10px;display:grid;gap:6px"><div class="note" style="margin:0;padding:8px 10px">R-201 温控偏差 +1.2℃，持续 18 分钟</div><div class="note" style="margin:0;padding:8px 10px">B20261027-01 pH 6.4，低于下限 6.5</div><div class="note" style="margin:0;padding:8px 10px">CA-003 库存 12 kg，低于安全库存 20 kg</div></div></div>';
    html += '</div>';
    html += aiCard('今日计划达成 73.3%，低于 80% 的班次预警线；缺口集中在 2 条异常工单和 1 条待接单。建议先处理 WO-2026-0303 与催化剂补料。', ['计划达成 73.3%', '异常 2 条', 'CA-003 低库存']);
    return html;
  }

  function bindDashboard() {
    var r = document.querySelector('[data-action="refresh"]');
    if (r) { r.addEventListener('click', function () { S.toast('<b>数据刷新</b>：已拉取 18:33 演示快照'); }); }
    S.qsa('[data-nav-jump]').forEach(function (b) { b.addEventListener('click', function () { S.go(b.getAttribute('data-nav-jump')); }); });
  }

  function renderPlan() {
    var list = filteredOrders();
    var html = head('iMCS / 计划排程', '工单计划与排产', '按车间 / 状态筛选工单；点击行查看详情。演示合成数据，不写回生产系统。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters"><select id="lineFilter"><option>全部</option><option' + (state.line === '一车间' ? ' selected' : '') + '>一车间</option><option' + (state.line === '二车间' ? ' selected' : '') + '>二车间</option></select><select id="statusFilter"><option>全部</option><option' + (state.status === '执行中' ? ' selected' : '') + '>执行中</option><option' + (state.status === '已完成' ? ' selected' : '') + '>已完成</option><option' + (state.status === '待接单' ? ' selected' : '') + '>待接单</option><option' + (state.status === '异常' ? ' selected' : '') + '>异常</option></select><input id="orderSearch" placeholder="搜索工单 / 产品 / 责任人" value="' + h(state.q) + '" style="min-width:220px"><span class="count">共 ' + list.length + ' 条</span><span class="spacer"></span><button class="btn small" data-action="export">导出当前视图</button></div>';
    var rows = list.map(function (o) {
      return '<tr data-order="' + h(o.id) + '"><td class="mono">' + h(o.id) + '</td><td>' + h(o.product) + '</td><td>' + h(o.line) + '</td><td>' + o.qty.toLocaleString() + ' ' + h(o.unit) + '</td><td style="min-width:110px">' + pct(o.progress) + '<span class="sub">' + o.progress + '%</span></td><td>' + tag(o.status) + '</td><td>' + h(o.due) + '</td><td>' + h(o.owner) + '</td></tr>';
    }).join('');
    html += table(['工单号', '产品', '车间', '数量', '进度', '状态', '交期', '责任人'], rows);
    html += aiCard('当前筛选 ' + list.length + ' 条工单，异常 2 条、进度低于 50% 的 ' + list.filter(function (o) { return o.status !== '已完成' && o.progress < 50; }).length + ' 条。建议先处理 WO-2026-0303 / 0310，再排待接单。', ['异常 2 条', '临期 2 条', '待接单 2 条']);
    return html;
  }

  function bindPlan() {
    S.qs('#lineFilter').addEventListener('change', function (e) { state.line = e.target.value; S.go('plan'); });
    S.qs('#statusFilter').addEventListener('change', function (e) { state.status = e.target.value; S.go('plan'); });
    S.qs('#orderSearch').addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.q = e.target.value; S.go('plan'); } });
    var ex = S.qs('[data-action="export"]');
    if (ex) { ex.addEventListener('click', function () { S.toast('<b>导出</b>：已生成演示视图（不写文件）'); }); }
    S.qsa('tr[data-order]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var o = D.orders.filter(function (x) { return x.id === tr.getAttribute('data-order'); })[0];
        if (!o) { return; }
        var body = detailGrid([['工单号', h(o.id)], ['产品', h(o.product)], ['车间', h(o.line)], ['数量', o.qty.toLocaleString() + ' ' + h(o.unit)], ['进度', o.progress + '%'], ['状态', tag(o.status)], ['交期', h(o.due)], ['责任人', h(o.owner)]]) + '<div style="margin-top:12px"><div class="card-h"><h3>排产建议</h3><span>演示口径</span></div><div class="note" style="margin:0">建议把该工单与同车间低优先级待接单合并排产，减少换型；若为异常工单，先完成温控/质量处置再继续。</div></div>';
        S.detail('工单详情 · ' + o.id, o.product + ' · ' + o.line, body);
      });
    });
  }

  function renderExecution() {
    var list = filteredBatches();
    var html = head('iMCS / 生产执行', '批次执行监控', '按车间筛选批次；点击行查看批次时间线与处置建议。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>在制批次</h3><span>' + list.length + ' 个</span></div><div class="v" style="font-size:26px;font-weight:900">' + list.filter(function (b) { return b.status === '执行中'; }).length + '</div><div class="sub">执行中 / 异常 ' + list.filter(function (b) { return b.status === '异常'; }).length + '</div></div>';
    html += '<div class="card"><div class="card-h"><h3>平均进度</h3><span>当前筛选</span></div><div class="v" style="font-size:26px;font-weight:900">' + Math.round(list.reduce(function (a, b) { return a + b.progress; }, 0) / Math.max(1, list.length)) + '%</div><div class="sub">按批次进度均值</div></div>';
    html += '<div class="card"><div class="card-h"><h3>中控合格</h3><span>质量状态</span></div><div class="v" style="font-size:26px;font-weight:900">' + list.filter(function (b) { return b.quality === '中控合格' || b.quality === '合格'; }).length + '/' + list.length + '</div><div class="sub">待检 ' + list.filter(function (b) { return b.quality === '待检'; }).length + ' 个</div></div>';
    html += '</div>';
    html += '<div class="filters"><select id="batchLine"><option>全部</option><option' + (state.line === '一车间' ? ' selected' : '') + '>一车间</option><option' + (state.line === '二车间' ? ' selected' : '') + '>二车间</option></select><span class="count">共 ' + list.length + ' 个批次</span></div>';
    var rows = list.map(function (b) {
      return '<tr data-batch="' + h(b.id) + '"><td class="mono">' + h(b.id) + '</td><td>' + h(b.product) + '</td><td>' + h(b.line) + '</td><td>' + h(b.start) + '</td><td style="min-width:120px">' + pct(b.progress) + '<span class="sub">' + b.progress + '%</span></td><td>' + tag(b.status) + '</td><td>' + tag(b.quality) + '</td><td><button class="btn small" data-batch-action="report">报工</button> <button class="btn small" data-batch-action="pause">暂停</button></td></tr>';
    }).join('');
    html += table(['批次号', '产品', '车间', '开始时间', '进度', '状态', '质量', '操作'], rows);
    html += aiCard('当前 ' + list.length + ' 个批次，1 个异常。B20261027-02 温控超限、B20261027-01 pH 偏低；建议先暂停异常批次并复测，再继续后续工单。', ['异常 1 个', '待检 3 个', '中控不合格 2 项']);
    return html;
  }

  function bindExecution() {
    S.qs('#batchLine').addEventListener('change', function (e) { state.line = e.target.value; S.go('execution'); });
    S.qsa('tr[data-batch]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-batch-action]')) { return; }
        var b = D.batches.filter(function (x) { return x.id === tr.getAttribute('data-batch'); })[0];
        if (!b) { return; }
        var steps = ['投料', '升温', '保温', '降温', '离心', '干燥', '包装'];
        var active = Math.max(1, Math.round(b.progress / 100 * steps.length));
        var tl = '<div class="timeline">' + steps.map(function (s, i) {
          var cls = i < active - 1 ? 'done' : (i === active - 1 ? 'active' : '');
          var st = i < active - 1 ? '已完成' : (i === active - 1 ? '进行中' : '未开始');
          return '<div class="tl-item ' + cls + '"><span class="tl-dot"></span><div class="tl-body"><b>' + s + '</b><span>' + st + '</span></div></div>';
        }).join('') + '</div>';
        var body = detailGrid([['批次号', h(b.id)], ['工单', h(b.order)], ['产品', h(b.product)], ['车间', h(b.line)], ['开始', h(b.start)], ['进度', b.progress + '%'], ['状态', tag(b.status)], ['质量', tag(b.quality)]]) + '<div style="margin-top:12px"><div class="card-h"><h3>批次时间线</h3><span>演示口径</span></div>' + tl + '</div>';
        S.detail('批次详情 · ' + b.id, b.product + ' · ' + b.line, body);
      });
    });
    S.qsa('[data-batch-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var act = b.getAttribute('data-batch-action');
        S.toast('<b>' + (act === 'report' ? '报工' : '暂停') + '</b>：已模拟' + (act === 'report' ? '提交报工' : '暂停批次') + '（演示环境，不写回真实系统）');
      });
    });
  }

  function renderQuality() {
    var list = filteredInspections();
    var html = head('iMCS / 质量检验', '质量检验与趋势', '按结果筛选检验记录；点击行查看标准与批次关联。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>近 7 日合格率</h3><span>目标 98%</span></div><div class="v" style="font-size:28px;font-weight:900;color:#0B9A78">98.2%</div><div class="sub">低于目标 0.2 个百分点</div></div>';
    html += '<div class="card"><div class="card-h"><h3>不合格记录</h3><span>当前筛选</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">' + list.filter(function (q) { return q.result === '不合格'; }).length + '</div><div class="sub">共 ' + list.length + ' 条检验</div></div>';
    html += '<div class="card"><div class="card-h"><h3>检验批次</h3><span>覆盖</span></div><div class="v" style="font-size:28px;font-weight:900">' + list.length + '</div><div class="sub">含中控与成品</div></div>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>质量合格率趋势</h3><span>近 7 日</span></div><div class="chart">' + S.chart.line(D.qualityTrend, { labels: D.qualityLabels, target: 98, min: 96, max: 100, fixed: 1, color: '#0B9A78' }) + '</div></div><div class="card"><div class="card-h"><h3>不合格项分布</h3><span>按检验项</span></div><div class="chart">' + S.chart.bars([{ label: 'pH', value: 1 }, { label: '温度', value: 1 }, { label: '纯度', value: 1 }], { height: 210, color: '#DC2626' }) + '</div></div></div>';
    html += '<div class="filters"><select id="qualityFilter"><option>全部</option><option' + (state.quality === '合格' ? ' selected' : '') + '>合格</option><option' + (state.quality === '不合格' ? ' selected' : '') + '>不合格</option></select><span class="count">共 ' + list.length + ' 条</span></div>';
    var rows = list.map(function (q) {
      return '<tr data-qc="' + h(q.id) + '"><td class="mono">' + h(q.id) + '</td><td class="mono">' + h(q.batch) + '</td><td>' + h(q.item) + '</td><td><b>' + h(q.value) + '</b></td><td>' + h(q.standard) + '</td><td>' + tag(q.result) + '</td><td>' + h(q.time) + '</td></tr>';
    }).join('');
    html += table(['检验单', '批次', '检验项', '结果', '标准', '判定', '时间'], rows);
    html += aiCard('近 7 日合格率 98.2%，低于 98% 目标；pH、温度、纯度各 1 条不合格。建议对换型后首批加严采样，并先隔离 B20261027-02 / 01 / 06。', ['合格率 98.2%', '不合格 3 条', '目标 98.0%']);
    return html;
  }

  function bindQuality() {
    S.qs('#qualityFilter').addEventListener('change', function (e) { state.quality = e.target.value; S.go('quality'); });
    S.qsa('tr[data-qc]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var q = D.inspections.filter(function (x) { return x.id === tr.getAttribute('data-qc'); })[0];
        if (!q) { return; }
        var body = detailGrid([['检验单', h(q.id)], ['批次', h(q.batch)], ['检验项', h(q.item)], ['结果', '<b>' + h(q.value) + '</b>'], ['标准', h(q.standard)], ['判定', tag(q.result)], ['时间', h(q.time)]]) + '<div style="margin-top:12px"><div class="note" style="margin:0">' + (q.result === '不合格' ? '建议：开不合格处置单，隔离批次，复测后再评审放行。' : '建议：按正常放行流程处理；保留检验记录与批次关联。') + '</div></div>';
        S.detail('检验详情 · ' + q.id, q.batch + ' · ' + q.item, body);
      });
    });
  }

  function renderMaterials() {
    var list = filteredMaterials();
    var html = head('iMCS / 物料库存', '物料库存与预警', '按状态筛选物料；点击行查看库存与消耗建议。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>物料种类</h3><span>当前筛选</span></div><div class="v" style="font-size:28px;font-weight:900">' + list.length + '</div><div class="sub">含原料/催化剂/包装</div></div>';
    html += '<div class="card"><div class="card-h"><h3>低库存</h3><span>低于安全线</span></div><div class="v" style="font-size:28px;font-weight:900;color:#D97706">' + list.filter(function (m) { return m.status === '低库存'; }).length + '</div><div class="sub">需今日处理</div></div>';
    html += '<div class="card"><div class="card-h"><h3>最短可用</h3><span>按天</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">0.8</div><div class="sub">CA-003 · 催化剂</div></div>';
    html += '</div>';
    html += '<div class="filters"><select id="materialFilter"><option>全部</option><option' + (state.material === '低库存' ? ' selected' : '') + '>低库存</option><option' + (state.material === '正常' ? ' selected' : '') + '>正常</option></select><span class="count">共 ' + list.length + ' 种</span></div>';
    var rows = list.map(function (m) {
      var w = Math.min(100, m.stock / (m.safety * 2) * 100);
      return '<tr data-material="' + h(m.code) + '"><td><b>' + h(m.name) + '</b><div class="sub">' + h(m.code) + '</div></td><td>' + m.stock + ' ' + h(m.unit) + '</td><td>' + m.safety + ' ' + h(m.unit) + '</td><td style="min-width:130px"><div class="progress" style="height:7px"><span style="width:' + w + '%;background:' + (m.status === '低库存' ? '#D97706' : '#0B9A78') + '"></span></div></td><td>' + m.days + ' 天</td><td>' + tag(m.status) + '</td></tr>';
    }).join('');
    html += table(['物料', '当前库存', '安全库存', '库存水位', '预计可用', '状态'], rows);
    html += aiCard('3 种物料低于安全库存：CA-003 仅 0.8 天、AL-007 1.1 天、SB-005 2.1 天。建议今天先补 CA-003 与 AL-007，避免一车间停线。', ['低库存 3 种', 'CA-003 0.8 天', 'AL-007 1.1 天']);
    return html;
  }

  function bindMaterials() {
    S.qs('#materialFilter').addEventListener('change', function (e) { state.material = e.target.value; S.go('materials'); });
    S.qsa('tr[data-material]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var m = D.materials.filter(function (x) { return x.code === tr.getAttribute('data-material'); })[0];
        if (!m) { return; }
        var body = detailGrid([['物料', h(m.name)], ['编码', h(m.code)], ['当前库存', m.stock + ' ' + h(m.unit)], ['安全库存', m.safety + ' ' + h(m.unit)], ['预计可用', m.days + ' 天'], ['状态', tag(m.status)]]) + '<div style="margin-top:12px"><div class="note" style="margin:0">' + (m.status === '低库存' ? '建议：今日补货/调拨；补货前优先保障已排产批次，避免换型。' : '建议：按正常补货周期管理；关注消耗速率变化。') + '</div></div>';
        S.detail('物料详情 · ' + m.code, m.name, body);
      });
    });
  }

  function filteredZones() {
    return D.zones.filter(function (z) {
      if (state.zoneStatus !== '全部' && z.status !== state.zoneStatus) { return false; }
      if (state.zoneQ && (z.code + z.name + z.remark).toLowerCase().indexOf(state.zoneQ.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function zoneTanks() {
    return D.tanks.filter(function (t) { return t.zone === state.zone; });
  }
  function tankInsight() {
    var z = D.zones.filter(function (x) { return x.code === state.zone; })[0] || D.zones[0];
    var list = zoneTanks();
    var high = list.filter(function (t) { return t.status === '高液位'; });
    var low = list.filter(function (t) { return t.status === '低液位'; });
    var sorted = list.slice().sort(function (a, b) { return b.level - a.level; });
    var top = sorted[0] || null;
    var crossHi = D.tanks.filter(function (t) { return t.zone !== z.code && t.status === '高液位'; });
    var crossLow = D.tanks.filter(function (t) { return t.zone !== z.code && t.status === '低液位'; });
    var summary;
    if (high.length) {
      summary = '当前 <b>' + z.code + ' ' + z.name + '</b> 共 ' + list.length + ' 个储罐，<b>' + high.length + ' 个高液位</b>、' + low.length + ' 个低液位。' + (high[0] ? high[0].code + ' 液位 ' + high[0].level + '%，建议优先安排发料/转罐。' : '建议优先安排发料/转罐。');
    } else if (low.length) {
      summary = '当前 <b>' + z.code + ' ' + z.name + '</b> 共 ' + list.length + ' 个储罐，<b>' + low.length + ' 个低液位</b>。' + (low[0] ? low[0].code + ' 液位 ' + low[0].level + '%，建议今日补料。' : '建议今日补料。');
    } else {
      summary = '当前 <b>' + z.code + ' ' + z.name + '</b> 共 ' + list.length + ' 个储罐，液位均正常' + (top ? '；最高 ' + top.code + ' ' + top.level + '%' : '') + '。跨罐区 T-203 / T-201 仍接近高液位，需联动关注。';
    }
    var findings = sorted.slice(0, 3).map(function (t) {
      return '<b>' + t.code + '</b> ' + t.name + '：液位 ' + t.level + '%、温度 ' + t.temp + '℃、压力 ' + t.pressure + ' MPa，状态 ' + t.status + '。';
    });
    if (!high.length && crossHi.length) {
      findings.push('跨罐区高液位：' + crossHi.map(function (t) { return '<b>' + t.code + '</b> ' + t.level + '%'; }).join('、') + '，虽不在当前罐区，但罐区之间可转罐，建议一并关注。');
    }
    if (!low.length && crossLow.length) {
      findings.push('跨罐区低液位：' + crossLow.map(function (t) { return '<b>' + t.code + '</b> ' + t.level + '%'; }).join('、') + '，需确认补料计划。');
    }
    var actions = [];
    if (high.length) { actions.push('优先安排 ' + high[0].code + ' 发料/转罐，避免触发 90% 高液位联锁。'); }
    if (low.length) { actions.push(low[0].code + ' 今日补料，按可用天数安排，优先保障关联工序。'); }
    if (!high.length && crossHi.length) { actions.push('关注跨罐区 ' + crossHi[0].code + ' 液位，必要时通过转罐平衡。'); }
    if (!low.length && crossLow.length) { actions.push('确认跨罐区 ' + crossLow[0].code + ' 补料计划，避免与当前罐区同时断料。'); }
    actions.push('按罐区收料/发料作业单平衡库存，保持 25%–85% 安全区间。');
    return {
      time: nowShort(), basis: '罐区管理 · ' + z.code + ' ' + z.name,
      summary: summary,
      findings: findings,
      actions: actions,
      evidence: ['罐区 ' + z.code, '储罐 ' + list.length, '高液位 ' + high.length, '低液位 ' + low.length]
    };
  }
  function renderTanks() {
    var list = filteredZones();
    var sel = D.zones.filter(function (x) { return x.code === state.zone; })[0] || D.zones[0];
    var tanks = zoneTanks();
    var high = D.tanks.filter(function (t) { return t.status === '高液位'; }).length;
    var low = D.tanks.filter(function (t) { return t.status === '低液位'; }).length;
    var ti = tankInsight();
    var html = head('iMCS / 储罐管理', '罐区管理', '参考正式 iMCS 罐区管理：罐区编码/名称/状态筛选，罐区下储罐液位/温度/压力总览；演示合成数据。', '<button class="btn" data-action="add-zone">新增罐区</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4">';
    html += kpi('罐区数量', D.zones.length, '个', '全部启用', 'blue', '#1466E8', S.chart.spark([3, 4, 4, 5, 5, 5, 5], '#1466E8'));
    html += kpi('储罐数量', D.tanks.length, '个', '8 个在用', 'green', '#0B9A78', S.chart.spark([6, 7, 7, 8, 8, 8, 8], '#0B9A78'));
    html += kpi('高液位', high, '个', '<span class="down">T-201 / T-203</span>', 'red', '#DC2626', S.chart.spark([0, 1, 1, 1, 2, 2, 2], '#DC2626'));
    html += kpi('低液位', low, '个', '<span class="warn">T-204 碱液</span>', 'amber', '#D97706', S.chart.spark([0, 0, 1, 1, 1, 1, 1], '#D97706'));
    html += '</div>';
    html += '<div class="filters"><input id="zoneSearch" placeholder="罐区编码 / 名称" value="' + h(state.zoneQ) + '" style="min-width:200px"><select id="zoneStatus"><option>全部</option><option' + (state.zoneStatus === '启用' ? ' selected' : '') + '>启用</option><option' + (state.zoneStatus === '停用' ? ' selected' : '') + '>停用</option></select><button class="btn small" data-action="zone-search">搜索</button><button class="btn small" data-action="zone-reset">重置</button><span class="count">共 ' + list.length + ' 个罐区</span></div>';
    var rows = list.map(function (z) {
      var n = D.tanks.filter(function (t) { return t.zone === z.code; }).length;
      var active = z.code === state.zone;
      return '<tr data-zone="' + h(z.code) + '" style="' + (active ? 'background:#F0F7FF' : '') + '"><td class="mono">' + h(z.code) + '</td><td><b>' + h(z.name) + '</b></td><td>' + z.sort + '</td><td>' + tag(z.status) + '</td><td>' + n + ' 个</td><td class="sub">' + h(z.remark) + '</td><td class="sub">' + h(z.createdAt) + '</td><td><button class="btn small" data-zone-view="' + h(z.code) + '">查看</button></td></tr>';
    }).join('');
    html += table(['罐区编码', '罐区名称', '排序号', '状态', '储罐数', '备注', '创建时间', '操作'], rows);
    html += '<div class="grid grid-2" style="margin-top:12px">';
    html += '<div class="card"><div class="card-h"><h3>罐区总览 · ' + h(sel.code) + ' ' + h(sel.name) + '</h3><span>' + tanks.length + ' 个储罐</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">';
    tanks.forEach(function (t) {
      var w = Math.min(100, t.level);
      var color = t.status === '高液位' ? '#DC2626' : (t.status === '低液位' ? '#D97706' : '#0B9A78');
      html += '<div data-tank="' + h(t.code) + '" style="border:1px solid #E2E8F0;border-radius:9px;padding:10px 11px;background:#FBFDFF;cursor:pointer"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:12px">' + h(t.code) + ' ' + h(t.name) + '</b>' + tag(t.status) + '</div><div class="sub" style="margin-top:2px">' + h(t.material) + ' · ' + t.capacity + ' m³</div><div style="display:flex;align-items:center;gap:8px;margin-top:8px"><div class="progress" style="height:8px;flex:1"><span style="width:' + w + '%;background:' + color + '"></span></div><b style="font-size:12px;color:' + color + '">' + t.level + '%</b></div><div class="sub" style="margin-top:5px">温度 ' + t.temp + '℃ · 压力 ' + t.pressure + ' MPa</div></div>';
    });
    html += '</div></div>';
    html += '<div class="card"><div class="card-h"><h3>跨罐区告警与作业</h3><span>3 条</span></div><div style="display:grid;gap:7px"><div class="note" style="margin:0;padding:8px 10px"><b>T-203 高液位</b>：88%，接近 90% 联锁；建议发料/转罐。</div><div class="note" style="margin:0;padding:8px 10px"><b>T-201 高液位</b>：82%，一车间仍在产出 BIT 粗品。</div><div class="note" style="margin:0;padding:8px 10px"><b>T-204 低液位</b>：22%，碱液可用 1.1 天，影响 pH 调节。</div></div><div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-action="tank-receipt">储罐收料</button><button class="btn small" data-action="tank-issue">储罐发料</button><button class="btn small" data-nav-jump="materials">物料库存 →</button></div></div>';
    html += '</div>';
    html += aiCard(ti.summary, ti.evidence.slice(0, 3));
    return html;
  }
  function bindTanks() {
    var zs = S.qs('#zoneSearch');
    if (zs) {
      zs.addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.zoneQ = e.target.value; S.go('tanks'); } });
    }
    var zst = S.qs('#zoneStatus');
    if (zst) { zst.addEventListener('change', function (e) { state.zoneStatus = e.target.value; S.go('tanks'); }); }
    var search = S.qs('[data-action="zone-search"]');
    if (search) { search.addEventListener('click', function () { state.zoneQ = S.qs('#zoneSearch').value; S.go('tanks'); }); }
    var reset = S.qs('[data-action="zone-reset"]');
    if (reset) { reset.addEventListener('click', function () { state.zoneQ = ''; state.zoneStatus = '全部'; S.go('tanks'); }); }
    var add = S.qs('[data-action="add-zone"]');
    if (add) { add.addEventListener('click', function () { S.toast('<b>新增罐区</b>：已模拟打开新增表单（演示环境）'); }); }
    var rec = S.qs('[data-action="tank-receipt"]');
    if (rec) { rec.addEventListener('click', function () { S.toast('<b>储罐收料</b>：已模拟创建收料单'); }); }
    var iss = S.qs('[data-action="tank-issue"]');
    if (iss) { iss.addEventListener('click', function () { S.toast('<b>储罐发料</b>：已模拟创建发料单'); }); }
    S.qsa('[data-nav-jump]').forEach(function (b) { b.addEventListener('click', function () { S.go(b.getAttribute('data-nav-jump')); }); });
    S.qsa('tr[data-zone]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-zone-view]')) { return; }
        state.zone = tr.getAttribute('data-zone'); S.go('tanks');
      });
    });
    S.qsa('[data-zone-view]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); state.zone = b.getAttribute('data-zone-view'); S.go('tanks'); }); });
    S.qsa('[data-tank]').forEach(function (b) {
      b.addEventListener('click', function () {
        var t = D.tanks.filter(function (x) { return x.code === b.getAttribute('data-tank'); })[0];
        if (!t) { return; }
        var body = detailGrid([['储罐', h(t.code)], ['名称', h(t.name)], ['罐区', h(t.zone)], ['物料', h(t.material)], ['容积', t.capacity + ' m³'], ['液位', t.level + '%'], ['温度', t.temp + '℃'], ['压力', t.pressure + ' MPa']]) + '<div style="margin-top:12px"><div class="card-h"><h3>液位</h3><span>' + tag(t.status) + '</span></div><div class="progress" style="height:10px"><span style="width:' + t.level + '%;background:' + (t.status === '高液位' ? '#DC2626' : (t.status === '低液位' ? '#D97706' : '#0B9A78')) + '"></span></div></div>';
        S.detail('储罐详情 · ' + t.code, t.name + ' · ' + t.zone, body);
      });
    });
  }

  function filteredEbr() {
    return (EBR ? EBR.records : D.ebrRecords).filter(function (r) {
      if (state.ebrAudit !== '全部' && r.audit !== state.ebrAudit) { return false; }
      if (state.ebrBatch && r.batch.toLowerCase().indexOf(state.ebrBatch.toLowerCase()) < 0) { return false; }
      if (state.ebrProduct && r.product.toLowerCase().indexOf(state.ebrProduct.toLowerCase()) < 0) { return false; }
      if (state.ebrFormula && r.recipe.toLowerCase().indexOf(state.ebrFormula.toLowerCase()) < 0) { return false; }
      if (state.ebrQ && (r.batch + r.product + r.workOrder + r.recipe).toLowerCase().indexOf(state.ebrQ.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function ebrInsight() {
    if (state.ebrDetail) {
      var d = EBR.detail;
      var diff = 0;
      var units = d.units.map(function (u) {
        var s = parseInt(u.std, 10) || 0; var a = parseInt(u.act, 10) || 0;
        diff += (a - s);
        return u.name + ' ' + (a - s > 0 ? '+' : '') + (a - s) + 'M';
      });
      return {
        time: nowShort(), basis: '电子批记录 · ' + state.ebrDetail,
        summary: '本批 <b>' + state.ebrDetail + '</b> 共 <b>' + d.units.length + ' 个单元</b>、<b>' + d.units.reduce(function (n, u) { return n + u.ops.length; }, 0) + ' 个 OP</b>；实际总时长比标准多 <b>' + diff + ' min</b>，需重点看超时单元。',
        findings: [
          '批次产量 914.80、收率 127.34%，高于常规；需核对产量/投料口径，不能直接放行。',
          'SH 缩合单元实际 687M / 标准 546M，超 +141M；LV-1 氯化 1681M / 1450M，超 +231M。',
          '质量：已复审、放行；化验 4 项全部合格；审核状态未审核，审核人未分配。'
        ],
        actions: [
          '先核对 127.34% 收率的产量与投料口径，确认是否计量/转化率问题。',
          '重点看 SH 缩合与 LV-1 氯化超时：是工艺等待、设备瓶颈还是人工记录延迟。',
          '完成审核前补齐审核人/审核意见，避免批次放行延迟。'
        ],
        evidence: ['11 单元', '70+ OP', '超时 +' + diff + 'M', '收率 127.34%']
      };
    }
    var list = filteredEbr();
    var pending = list.filter(function (r) { return r.audit === '未审核'; }).length;
    var high = list.filter(function (r) { return r.yield > 110; }).length;
    var low = list.filter(function (r) { return r.yield < 95; }).length;
    return {
      time: nowShort(), basis: '电子批记录 · ' + state.ebrAudit,
      summary: '当前筛选 <b>' + list.length + ' 条</b>批记录，<b>' + pending + ' 条未审核</b>。高收率 ' + high + ' 条、低收率 ' + low + ' 条；先核对收率口径，再审核放行。',
      findings: [
        '高收率：LX-BIT-2610136A1 收率 <b>127.34%</b>、LX-BIT-2610137A1 <b>118.35%</b>，超出常规波动。',
        '低收率：LX-BIT-2610135B1 <b>91.70%</b>、LX-BBIT-2610133A2 <b>93.99%</b>，建议关联批次分析与质量记录。',
        '待审核 8 条，最早结束时间 10-27 14:46，审核人尚未分配，存在放行延迟风险。'
      ],
      actions: [
        '先打开 LX-BIT-2610136A1，按正式 eBR 结构核对工单导航、OP 参数、质量与化验。',
        '对 127.34% / 118.35% 高收率批次核对产量与投料口径。',
        '为 8 条未审核记录分配审核人，避免跨班次积压。'
      ],
      evidence: ['筛选 ' + list.length + ' 条', '未审核 ' + pending, '高收率 ' + high, '低收率 ' + low]
    };
  }

  function ebrCell(v) { return (v === undefined || v === null || v === '') ? '<span class="muted">-</span>' : h(v); }
  function ebrPager(total, page) {
    var pages = Math.max(1, Math.ceil(total / 10));
    var btns = '';
    for (var i = 1; i <= Math.min(pages, 5); i++) {
      btns += '<button class="' + (i === page ? 'on' : '') + '" data-ebr-page="' + i + '">' + i + '</button>';
    }
    return '<div class="ebr-pager"><span class="sub">共 ' + (EBR ? EBR.total.toLocaleString() : total) + ' 条 · 本页演示 ' + total + ' 条 · 10 条/页</span><div class="pages">' + btns + '</div></div>';
  }

  function renderEbr() {
    if (state.ebrDetail) { return renderEbrDetail(); }
    var all = EBR ? EBR.records : D.ebrRecords;
    if (!state.ebrChainOpened && typeof sessionStorage !== 'undefined') {
      var cb = sessionStorage.getItem('DEMO_CHAIN_BATCH');
      if (cb && all.some(function (x) { return x.batch === cb; })) { state.ebrChainOpened = true; state.ebrDetail = cb; return renderEbrDetail(); }
    }
    var list = filteredEbr();
    var pending = all.filter(function (r) { return r.audit === '未审核'; }).length;
    var passed = all.filter(function (r) { return r.audit === '已通过'; }).length;
    var avg = (all.reduce(function (s, r) { return s + r.yield; }, 0) / all.length).toFixed(1);
    var html = head('iMCS / 生产执行', '电子批记录', '按正式 iMCS 字段复刻：UP 批次/产品/工单/配方/产量/收率/审核状态；点“查看”进入批记录全文。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4">';
    html += kpi('批记录总数', EBR ? EBR.total.toLocaleString() : all.length, '条', '正式环境当前截取', 'blue', '#1466E8', S.chart.spark([2200, 2350, 2480, 2600, 2700, 2780, 2825], '#1466E8'));
    html += kpi('待审核', pending, '条', '<span class="warn">需分配审核人</span>', 'amber', '#D97706', S.chart.spark([2, 3, 4, 3, 5, 7, 8], '#D97706'));
    html += kpi('已通过', passed, '条', '本页演示记录', 'green', '#0B9A78', S.chart.spark([2, 3, 4, 5, 7, 9, 10], '#0B9A78'));
    html += kpi('平均收率', avg, '%', '高/低异常均需复核', 'green', '#008D9A', S.chart.spark([98, 99, 100, 99, 101, 100, 101.4], '#008D9A'));
    html += '</div>';
    html += '<div class="filters"><input id="ebrBatch" placeholder="UP 批次编号" value="' + h(state.ebrBatch) + '"><input id="ebrProduct" placeholder="产品名称" value="' + h(state.ebrProduct) + '"><input id="ebrFormula" placeholder="配方编号" value="' + h(state.ebrFormula) + '"><select id="ebrAudit"><option>全部</option><option' + (state.ebrAudit === '未审核' ? ' selected' : '') + '>未审核</option><option' + (state.ebrAudit === '已通过' ? ' selected' : '') + '>已通过</option><option' + (state.ebrAudit === '已驳回' ? ' selected' : '') + '>已驳回</option></select><button class="btn small" data-action="ebr-search">查询</button><button class="btn small" data-action="ebr-reset">重置</button><span class="count">共 ' + list.length + ' 条</span></div>';
    var start = (state.ebrPage - 1) * 10;
    var view = list.slice(start, start + 10);
    var rows = view.map(function (r) {
      return '<tr data-ebr="' + h(r.batch) + '"><td class="mono" style="color:#1466E8;font-weight:600">' + h(r.batch) + '</td><td>' + h(r.product) + '</td><td class="mono">' + h(r.workOrder) + '</td><td class="mono">' + h(r.recipe) + '</td><td class="num">' + r.output.toFixed(2) + '</td><td><b style="color:' + (r.yield > 110 || r.yield < 95 ? '#DC2626' : '#0F172A') + '">' + r.yield.toFixed(2) + '%</b></td><td>' + tag(r.audit) + '</td><td>' + h(r.auditor) + '</td><td class="sub">' + h(r.auditTime) + '</td><td class="sub">' + h(r.endTime) + '</td><td><button class="btn small" data-ebr-view="' + h(r.batch) + '">查看</button></td></tr>';
    }).join('');
    html += table(['UP 批次编号', '产品名称', '工单号', '配方编号', '产量', '收率', '审核状态', '审核人', '审核时间', '实际结束时间', '操作'], rows || '<tr><td colspan="11" class="ebr-empty">无匹配记录</td></tr>');
    html += ebrPager(list.length, state.ebrPage);
    var ai = ebrInsight();
    html += aiCard(ai.summary, ai.evidence.slice(0, 3));
    return html;
  }

  function ebrParamTable(unit, op) {
    var p = unit.params;
    var times = state.ebrInterval === '30分钟' ? ['20:00', '20:30'] : ['20:00'];
    var rec = times.map(function (t, k) {
      var tds = p.base.map(function (v, i) { return '<td>' + (Number(v) + (k + i) * 0.01).toFixed(2) + '</td>'; }).join('');
      return '<tr><td>' + t + '</td>' + tds + '</tr>';
    }).join('');
    var mean = p.base.map(function (v) { return '<td>' + Number(v).toFixed(2) + '</td>'; }).join('');
    var min = p.base.map(function (v) { return '<td>' + (Number(v) - 0.02).toFixed(2) + '</td>'; }).join('');
    var max = p.base.map(function (v) { return '<td>' + (Number(v) + 0.03).toFixed(2) + '</td>'; }).join('');
    var head = '<tr><th>记录时间</th>' + p.columns.map(function (c, i) { return '<th>' + h(c) + '<small>' + h(p.positions[i]) + '</small></th>'; }).join('') + '</tr>';
    var body = rec + '<tr class="mean"><td>均值</td>' + mean + '</tr><tr><td>最小值</td>' + min + '</tr><tr><td>最大值</td>' + max + '</tr>';
    return '<div class="ebr-param"><div class="ebr-param-h"><b>' + h(op.code) + ' · 过程参数</b><span class="sub">位号 / 均值 / 极值</span><div class="seg"><button class="' + (state.ebrInterval === '30分钟' ? 'on' : '') + '" data-interval="30分钟">30 分钟</button><button class="' + (state.ebrInterval === '1小时' ? 'on' : '') + '" data-interval="1小时">1 小时</button></div></div><div class="scroll"><table>' + head + body + '</table></div></div>';
  }

  function ebrSec(key, title, body) {
    var open = !!state.ebrSec[key];
    return '<div class="ebr-sec"><div class="ebr-sec-h" data-sec="' + key + '">' + title + '<span>' + (open ? '收起' : '展开') + '</span></div>' + (open ? '<div class="ebr-sec-b">' + body + '</div>' : '') + '</div>';
  }

  function renderEbrDetail() {
    var r = (EBR ? EBR.records : D.ebrRecords).filter(function (x) { return x.batch === state.ebrDetail; })[0];
    if (!r) { state.ebrDetail = null; return renderEbr(); }
    var e = EBR.detail;
    var html = '<div class="ebr-top"><button class="btn small back" data-ebr-back>← 返回列表</button><span class="id">' + h(r.batch) + '</span><span class="prod">' + h(r.product) + '</span><span class="audit-state">审核状态 ' + tag(r.audit) + '</span><span class="spacer"></span><button class="btn small" data-chain-open>同批号贯穿</button><button class="btn small" data-ebr-pdf>PDF / 打印</button><button class="btn ai small" data-ebr-audit-open>审核</button></div>';
    html += '<div class="ebr-layout">';
    html += '<aside class="ebr-tree"><div class="ebr-work"><b>' + h(e.workOrder) + '</b><span>' + h(r.product) + ' · ' + h(e.recipe) + '</span></div><div class="ebr-tree-h">工单导航</div>';
    e.units.forEach(function (u) {
      html += '<div class="ebr-group"><b><i></i>' + h(u.name) + '</b>';
      u.ops.forEach(function (op) {
        html += '<button class="ebr-op ' + (state.ebrActive === op.code ? 'active' : '') + '" data-op="' + h(op.code) + '">' + h(op.code + ' ' + op.name) + '<span class="m">' + h(op.act) + '</span></button>';
      });
      html += '</div>';
    });
    html += '</aside>';
    html += '<main class="ebr-doc"><div class="ebr-doc-h"><h2>电子批生产记录</h2><p>Electronic Batch Production Record</p></div>';
    var meta = [
      ['批次号', r.batch], ['产品', r.product], ['状态', e.status], ['标准时长', e.standard], ['实际时长', e.actual],
      ['执行时间', e.execution], ['产量', r.output.toFixed(2)], ['收率', r.yield.toFixed(2) + '%'], ['总产量', r.output.toFixed(2)],
      ['审核状态', r.audit], ['审核人', r.auditor], ['审核时间', r.auditTime], ['审核备注', e.auditNote]
    ];
    html += '<div class="ebr-meta">' + meta.map(function (m) { return '<div class="m"><span>' + h(m[0]) + '</span><b>' + (m[0] === '审核状态' ? tag(m[1]) : ebrCell(m[1])) + '</b></div>'; }).join('') + '</div>';
    html += '<div class="note" style="margin:0 0 8px;padding:7px 9px;font-size:10.5px">按正式 iMCS eBR 结构复刻：批次头 + 工单导航 + 单元/OP + 过程参数 + 质量 + 投料 + 中间产品 + 化验 + UP 趋势。数据为演示合成。</div>';
    e.units.forEach(function (u) {
      html += '<div class="ebr-unit" id="unit-' + h(u.code) + '"><div class="ebr-unit-h">' + h(u.name) + '</div><div class="table-wrap"><table class="ebr-table"><thead><tr><th>名称</th><th>执行时间</th><th>标准时长</th><th>实际时长</th><th>操作</th></tr></thead><tbody>';
      html += '<tr><td class="opname">' + h(u.name) + '</td><td>' + h(u.start === '-' ? '-' : u.start + '--' + u.end) + '</td><td class="num">' + h(u.std) + '</td><td class="num ' + (parseInt(u.act, 10) > parseInt(u.std, 10) ? 'warn' : '') + '">' + h(u.act) + '</td><td class="muted">-</td></tr>';
      u.ops.forEach(function (op) {
        var open = !!state.ebrOpen[op.code];
        html += '<tr id="op-' + h(op.code) + '" class="' + (state.ebrActive === op.code ? 'op-active' : '') + '"><td class="opname">&nbsp;&nbsp;' + h(op.code + ' ' + op.name) + '</td><td>' + h(op.start === '-' ? '-' : op.start + '--' + op.end) + '</td><td class="num">' + h(op.std) + '</td><td class="num">' + h(op.act) + '</td><td><button class="ebr-expand" data-open-op="' + h(op.code) + '">' + (open ? '收起' : '展开') + '</button></td></tr>';
        if (open) {
          html += '<tr><td colspan="5" style="padding:0">' + ebrParamTable(u, op) + '</td></tr>';
        }
      });
      html += '</tbody></table></div></div>';
    });
    var yieldBody = '<table class="ebr-table"><thead><tr><th>产量</th><th>收率</th><th>总产量</th></tr></thead><tbody><tr><td class="num">' + r.output.toFixed(2) + '</td><td class="num">' + r.yield.toFixed(2) + '%</td><td class="num">' + r.output.toFixed(2) + '</td></tr></tbody></table>';
    var qBody = '<table class="ebr-table"><thead><tr><th>检验状态</th><th>判定结果</th><th>质量等级</th><th>检验人</th><th>检验时间</th><th>审核人</th><th>审核时间</th></tr></thead><tbody><tr><td>' + h(e.quality.status) + '</td><td>' + h(e.quality.result) + '</td><td>' + h(e.quality.grade) + '</td><td>' + h(e.quality.inspector) + '</td><td>' + h(e.quality.time) + '</td><td>' + h(e.quality.reviewer) + '</td><td>' + h(e.quality.reviewTime) + '</td></tr></tbody></table>';
    var feedBody = '<table class="ebr-table"><thead><tr><th>物料</th><th>计划量</th><th>实际量</th><th>单位</th><th>偏差</th></tr></thead><tbody>' + e.feeds.map(function (f) { return '<tr><td>' + h(f.name) + '</td><td class="num">' + f.plan.toFixed(2) + '</td><td class="num">' + f.actual.toFixed(2) + '</td><td>' + h(f.unit) + '</td><td class="' + (f.variance.indexOf('-') === 0 ? 'warn' : '') + '">' + h(f.variance) + '</td></tr>'; }).join('') + '</tbody></table>';
    var midBody = '<table class="ebr-table"><thead><tr><th>名称</th><th>批次</th><th>数量</th><th>单位</th><th>质量</th></tr></thead><tbody>' + e.intermediates.map(function (m) { return '<tr><td>' + h(m.name) + '</td><td class="mono">' + h(m.batch) + '</td><td class="num">' + m.quantity.toFixed(2) + '</td><td>' + h(m.unit) + '</td><td>' + tag(m.quality) + '</td></tr>'; }).join('') + '</tbody></table>';
    var labBody = '<div class="ebr-lab-meta"><span>化验项目 <b>' + h(e.lab.item) + '</b></span><span>取样时间 <b>' + h(e.lab.time) + '</b></span><span>化验结果 <b style="color:#0B9A78">' + h(e.lab.result) + '</b></span></div><table class="ebr-table"><thead><tr><th>指标名称</th><th>合格阈值</th><th>化验值</th><th>化验结果</th></tr></thead><tbody>' + e.lab.rows.map(function (row) { return '<tr><td>' + h(row[0]) + '</td><td>' + h(row[1]) + '</td><td>' + h(row[2]) + '</td><td>' + tag(row[3]) + '</td></tr>'; }).join('') + '</tbody></table>';
    var trend = [53.6, 54.2, 55.1, 56.4, 58.2, 60.1, 61.8, 62.4, 63.1, 63.8, 64.2, 64.0, 63.6, 63.1, 62.8, 62.4, 62.1, 61.8, 61.5, 61.2, 60.8, 60.4, 60.1, 59.8];
    var trendBody = '<div class="chart" style="height:150px;padding:0 4px">' + S.chart.line(trend, { labels: ['20:00', '21:00', '22:00', '23:00', '00:00', '01:00', '02:00', '03:00', '04:00', '05:00', '06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00'], target: 64, min: 50, max: 68, fixed: 1, color: '#1466E8' }) + '</div>';
    html += ebrSec('output', '产量', yieldBody);
    html += ebrSec('quality', '质量', qBody);
    html += ebrSec('feed', '投料量', feedBody);
    html += ebrSec('mid', '中间产品', midBody);
    html += '<div class="ebr-lab"><div class="ebr-lab-h">化验记录（最终一次）<span class="sub">' + h(e.lab.time) + '</span></div>' + labBody + '</div>';
    html += '<div class="ebr-trend"><div class="ebr-trend-h">UP 趋势图 · SH-OP-5 温度<span class="sub">全屏 / 展开（演示）</span></div>' + trendBody + '</div>';
    html += '<div class="note" style="margin-top:10px">电子批记录为演示复刻：本页聚焦批记录内容与字段，PDF 导出只含正文；不模拟电子签名/审计链，不写回真实 MES。</div>';
    html += '</main></div>';
    return html;
  }

  function openEbr(batch) {
    state.ebrChainOpened = true;
    state.ebrDetail = batch;
    state.ebrActive = (EBR.detail.units[0] && EBR.detail.units[0].ops[0]) ? EBR.detail.units[0].ops[0].code : '';
    state.ebrOpen = {}; if (state.ebrActive) { state.ebrOpen[state.ebrActive] = true; }
    S.go('ebr');
  }
  function openAudit(r) {
    var body = '<div class="ebr-audit-form"><div class="note" style="margin:0">审核 ' + h(r.batch) + '；通过/驳回会更新当前会话状态，不写回真实 MES。</div><label>审核结果<select id="auditResult"><option>通过</option><option>驳回</option></select></label><label>审核意见<textarea id="auditNote" rows="4" placeholder="请填写审核意见（演示）">按正式 eBR 复核：批次头、OP 参数、质量、投料、化验记录。</textarea></label><div class="row"><button class="btn ai" data-audit-submit>提交审核</button><button class="btn" data-close="detail">取消</button></div></div>';
    S.detail('审核电子批记录', r.batch + ' · ' + r.product, body);
    var btn = S.qs('[data-audit-submit]');
    if (btn) {
      btn.addEventListener('click', function () {
        var result = S.qs('#auditResult') ? S.qs('#auditResult').value : '通过';
        r.audit = result === '通过' ? '已通过' : '已驳回';
        r.auditor = '张平';
        r.auditTime = S.nowText();
        S.closeDetail();
        S.toast('<b>审核' + result + '</b>：' + h(r.batch) + ' 已更新（演示环境）');
        S.go('ebr');
      });
    }
  }

  function bindEbr() {
    if (state.ebrDetail) { return bindEbrDetail(); }
    var bs = S.qs('[data-action="ebr-search"]');
    if (bs) {
      bs.addEventListener('click', function () {
        state.ebrBatch = S.qs('#ebrBatch') ? S.qs('#ebrBatch').value : '';
        state.ebrProduct = S.qs('#ebrProduct') ? S.qs('#ebrProduct').value : '';
        state.ebrFormula = S.qs('#ebrFormula') ? S.qs('#ebrFormula').value : '';
        state.ebrAudit = S.qs('#ebrAudit') ? S.qs('#ebrAudit').value : '全部';
        state.ebrPage = 1;
        S.go('ebr');
      });
    }
    var br = S.qs('[data-action="ebr-reset"]');
    if (br) { br.addEventListener('click', function () { state.ebrBatch = ''; state.ebrProduct = ''; state.ebrFormula = ''; state.ebrAudit = '全部'; state.ebrPage = 1; S.go('ebr'); }); }
    S.qsa('[data-ebr-page]').forEach(function (b) { b.addEventListener('click', function () { state.ebrPage = Number(b.getAttribute('data-ebr-page')); S.go('ebr'); }); });
    S.qsa('tr[data-ebr]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-ebr-view]')) { return; }
        openEbr(tr.getAttribute('data-ebr'));
      });
    });
    S.qsa('[data-ebr-view]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); openEbr(b.getAttribute('data-ebr-view')); }); });
  }
  function bindEbrDetail() {
    var back = S.qs('[data-ebr-back]');
    if (back) { back.addEventListener('click', function () { state.ebrDetail = null; S.go('ebr'); }); }
    S.qsa('[data-op]').forEach(function (b) { b.addEventListener('click', function () { state.ebrActive = b.getAttribute('data-op'); state.ebrOpen[state.ebrActive] = true; S.go('ebr'); setTimeout(function () { var el = S.qs('#op-' + state.ebrActive); if (el) { el.scrollIntoView({ block: 'center', behavior: 'smooth' }); } }, 60); }); });
    S.qsa('[data-open-op]').forEach(function (b) { b.addEventListener('click', function () { var code = b.getAttribute('data-open-op'); state.ebrActive = code; state.ebrOpen[code] = !state.ebrOpen[code]; S.go('ebr'); }); });
    S.qsa('[data-interval]').forEach(function (b) { b.addEventListener('click', function () { state.ebrInterval = b.getAttribute('data-interval'); S.go('ebr'); }); });
    S.qsa('[data-sec]').forEach(function (b) { b.addEventListener('click', function () { var key = b.getAttribute('data-sec'); state.ebrSec[key] = !state.ebrSec[key]; S.go('ebr'); }); });
    var pdf = S.qs('[data-ebr-pdf]');
    if (pdf) { pdf.addEventListener('click', function () { state.ebrSec = { output: true, quality: true, feed: true, mid: true }; S.toast('<b>PDF / 打印</b>：已展开批记录正文，选择“另存为 PDF”即可导出。'); S.go('ebr'); setTimeout(function () { window.print(); }, 350); }); }
    var audit = S.qs('[data-ebr-audit-open]');
    if (audit) { audit.addEventListener('click', function () { var r = (EBR ? EBR.records : D.ebrRecords).filter(function (x) { return x.batch === state.ebrDetail; })[0]; if (r) { openAudit(r); } }); }
  }

  function filteredRecipes() {
    return RECIPES.filter(function (r) {
      if (state.recipeStatus !== '全部' && r.status !== state.recipeStatus) { return false; }
      if (state.recipeQ && (r.code + r.name + r.product + r.line).toLowerCase().indexOf(state.recipeQ.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function recipeInsight() {
    var list = filteredRecipes();
    var draft = list.filter(function (r) { return r.status === '草稿'; }).length;
    return {
      time: nowShort(), basis: '配方管理 · ' + state.recipeStatus,
      summary: '当前 <b>' + list.length + ' 个配方</b>，草稿 <b>' + draft + '</b> 个；已发布配方绑定产线、设备、批号规则与检查项，eBR 按配方版本执行。',
      findings: [
        'BIT_01 V3.2 已发布，覆盖 SH 缩合/LV 氯化/YL 压滤/TS 脱色 11 个单元步骤、8 个检查项；LX-BIT-2610136A1 即按此版本执行。',
        'BIT_04 V4.1 草稿：新增二次脱色与在线化验，尚未发布；发布后新批次才会引用。',
        'BBIT_05 V1.3 草稿：干燥曲线优化；停用的 BIT_06 由 BIT_01 V3.2 替代。'
      ],
      actions: [
        '先审核 BIT_04/BBIT_05 草稿，确认新增步骤与检查项。',
        '检查配方与设备连接配置是否匹配当前产线。',
        'eBR 审核时按配方版本核对步骤/检查项，避免版本错配。'
      ],
      evidence: ['配方 ' + list.length, '草稿 ' + draft, 'BIT_01 V3.2']
    };
  }
  function renderRecipe() {
    var list = filteredRecipes();
    var html = head('iMCS / 配方', '配方管理', '配方不是配方表：绑定产线、批号规则、检查项、设备连接；eBR 按版本执行。演示合成数据。', '<button class="btn" data-action="recipe-new">新建配方</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4">';
    html += kpi('配方总数', RECIPES.length, '个', '当前演示产物', 'blue', '#1466E8', S.chart.spark([4, 5, 5, 6, 6, 6, 6], '#1466E8'));
    html += kpi('已发布', RECIPES.filter(function (r) { return r.status === '已发布'; }).length, '个', '可被 eBR 引用', 'green', '#0B9A78', S.chart.spark([2, 2, 3, 3, 3, 3, 3], '#0B9A78'));
    html += kpi('草稿', RECIPES.filter(function (r) { return r.status === '草稿'; }).length, '个', '<span class="warn">待审核发布</span>', 'amber', '#D97706', S.chart.spark([1, 1, 1, 2, 2, 2, 2], '#D97706'));
    html += kpi('检查项', 48, '项', '跨配方合计', 'blue', '#0EA5E9', S.chart.spark([40, 42, 44, 45, 46, 47, 48], '#0EA5E9'));
    html += '</div>';
    html += '<div class="filters"><input id="recipeQ" placeholder="配方编号 / 名称 / 产品" value="' + h(state.recipeQ) + '"><select id="recipeStatus"><option>全部</option><option' + (state.recipeStatus === '已发布' ? ' selected' : '') + '>已发布</option><option' + (state.recipeStatus === '草稿' ? ' selected' : '') + '>草稿</option><option' + (state.recipeStatus === '停用' ? ' selected' : '') + '>停用</option></select><span class="count">共 ' + list.length + ' 个配方</span></div>';
    var rows = list.map(function (r) {
      return '<tr data-recipe="' + h(r.code) + '"><td class="mono" style="color:#1466E8;font-weight:600">' + h(r.code) + '</td><td>' + h(r.name) + '</td><td>' + h(r.product) + '</td><td>' + h(r.version) + '</td><td>' + r.steps + '</td><td>' + r.checks + '</td><td>' + tag(r.status) + '</td><td>' + h(r.line) + '</td><td class="sub">' + h(r.updated) + '</td></tr>';
    }).join('');
    html += table(['配方编号', '名称', '产品', '版本', '单元步骤', '检查项', '状态', '产线', '更新时间'], rows);
    var ai = recipeInsight();
    html += aiCard(ai.summary, ai.evidence.slice(0, 3));
    return html;
  }
  function bindRecipe() {
    var q = S.qs('#recipeQ');
    if (q) { q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.recipeQ = e.target.value; S.go('recipe'); } }); }
    var st = S.qs('#recipeStatus');
    if (st) { st.addEventListener('change', function (e) { state.recipeStatus = e.target.value; S.go('recipe'); }); }
    var nw = S.qs('[data-action="recipe-new"]');
    if (nw) { nw.addEventListener('click', function () { S.toast('<b>新建配方</b>：正式系统进入配方工作台；演示环境仅提示。'); }); }
    S.qsa('tr[data-recipe]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var r = RECIPES.filter(function (x) { return x.code === tr.getAttribute('data-recipe'); })[0];
        if (!r) { return; }
        var body = detailGrid([['配方编号', h(r.code)], ['名称', h(r.name)], ['产品', h(r.product)], ['版本', h(r.version)], ['状态', tag(r.status)], ['产线', h(r.line)], ['单元步骤', r.steps + ' 个'], ['检查项', r.checks + ' 项'], ['维护人', h(r.owner)], ['更新时间', h(r.updated)]]) + '<div style="margin-top:12px"><div class="card-h"><h3>版本与绑定</h3><span>正式 iMCS 口径</span></div><div class="note" style="margin:0">' + h(r.note) + '。配方绑定产线、批号规则、检查项、设备连接与二维码；发布后 eBR 按版本执行。</div></div>';
        S.detail('配方详情 · ' + r.code, r.name + ' · ' + r.version, body);
      });
    });
  }

  /* ================= 生产监视 / 化验分析 / 仓储管理 ================= */
  function monitorInsight() {
    var tab = state.monitorTab;
    var panels = (MOD.monitor.data[tab] || []);
    var tags = panels.map(function (p) { return p.tags[0]; });
    return {
      time: nowShort(), basis: '生产监视 · ' + tab,
      summary: '当前标签 <b>' + tab + '</b>，共 ' + panels.length + ' 组趋势；' + (tags[0] || '') + '，' + (tags[1] || '') + '。数据为演示合成，按实际大屏结构组织。',
      findings: [
        '关键工艺：氯甲烷流量 78.9 m³、气柜 A/B 3700/3682 mm、干燥床 A/B 22.36/24.9 kPa、罗茨风机 14.9 A。',
        '罐区：GQ1/CJ1 液位与温度同屏，收料/发料流量可对照；氯化釜通氯 3 台流量 42.5/39.8/44.1 m³/h。',
        '电表与 BBIT/MBIT 产量同屏，便于把公用工程能耗与产品产量放在一张图上。'
      ],
      actions: [
        '按 7 个标签巡检：公用工程 → 关键工艺 → 罐区 → 氯化釜通氯 → 岗位人员 → 电表 → BBIT/MBIT。',
        '对气柜高度、干燥床压力、罗茨风机电流做阈值对照，异常时联动报警。',
        '把 30s 自动刷新打开，作为展位实时演示。'
      ],
      evidence: [tab + ' · ' + panels.length + ' 组', tags[0] || '', tags[1] || '']
    };
  }
  function monitorLine(panel, idx) {
    var w = 360, h = 132, padL = 28, padR = 6, padT = 6, padB = 14;
    var ymin = -20, ymax = 100;
    function x(i) { return padL + (w - padL - padR) * i / 59; }
    function y(v) { return padT + (h - padT - padB) * (1 - (v - ymin) / (ymax - ymin)); }
    var svg = '<svg viewBox="0 0 ' + w + ' ' + h + '" preserveAspectRatio="none" role="img">';
    [-20, 0, 20, 40, 60, 80, 100].forEach(function (v) {
      var yy = y(v);
      svg += '<line x1="' + padL + '" y1="' + yy.toFixed(1) + '" x2="' + (w - padR) + '" y2="' + yy.toFixed(1) + '" stroke="#15324F" stroke-width="0.6"/>';
      svg += '<text x="' + (padL - 4) + '" y="' + (yy + 2.5).toFixed(1) + '" text-anchor="end" font-size="6" fill="#5F7D9D">' + v + '</text>';
    });
    [0, 30, 59].forEach(function (i) {
      var xx = x(i);
      svg += '<line x1="' + xx.toFixed(1) + '" y1="' + padT + '" x2="' + xx.toFixed(1) + '" y2="' + (h - padB) + '" stroke="#15324F" stroke-width="0.6"/>';
    });
    panel.series.forEach(function (s, si) {
      var pts = [];
      for (var i = 0; i < 60; i++) {
        var v = s.base + Math.sin(i / 6 + si * 1.7 + idx) * s.amp + Math.sin(i / 2.1 + si) * s.amp * 0.18;
        v = Math.max(ymin + 1, Math.min(ymax - 1, v));
        pts.push(x(i).toFixed(1) + ',' + y(v).toFixed(1));
      }
      svg += '<polyline points="' + pts.join(' ') + '" fill="none" stroke="' + s.color + '" stroke-width="1.5" stroke-linejoin="round" stroke-linecap="round" opacity="0.95"/>';
    });
    svg += '<text x="' + x(0) + '" y="' + (h - 2) + '" font-size="5.5" fill="#5F7D9D">20:05</text>';
    svg += '<text x="' + x(30) + '" y="' + (h - 2) + '" font-size="5.5" fill="#5F7D9D" text-anchor="middle">20:35</text>';
    svg += '<text x="' + (w - padR) + '" y="' + (h - 2) + '" font-size="5.5" fill="#5F7D9D" text-anchor="end">21:05</text>';
    svg += '</svg>';
    return svg;
  }
  function renderMonitor() {
    var m = MOD.monitor;
    var tab = state.monitorTab;
    var panels = m.data[tab] || [];
    var html = head('iMCS / 生产监视', '生产监视大屏', '按实际 iMCS 大屏结构：7 个标签、每组 6 块 60 分钟趋势；深色调度屏 + 统一壳层。', '<button class="btn" data-monitor-refresh>刷新</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="monitor-board"><div class="monitor-head"><div class="monitor-title"><i></i>' + h(m.title) + '</div><span class="monitor-clock">数据时间 20:05–21:05 · 演示合成</span><div class="monitor-tabs">' + m.tabs.map(function (t) { return '<button class="' + (t === tab ? 'on' : '') + '" data-monitor-tab="' + h(t) + '">' + h(t) + '</button>'; }).join('') + '</div></div>';
    html += '<div class="monitor-grid">';
    panels.forEach(function (p, pi) {
      html += '<div class="monitor-panel"><h4><i></i>' + h(p.title) + '</h4><div class="monitor-tags">' + p.tags.map(function (t, ti) { return '<span><i style="background:' + (p.series[ti % p.series.length].color) + '"></i>' + h(t) + '</span>'; }).join('') + '</div><div class="monitor-chart">' + monitorLine(p, pi) + '</div></div>';
    });
    html += '</div><div class="monitor-foot"><span>当前标签：' + h(tab) + ' · 60 分钟窗口 · 7 标签可切换</span><span><button class="btn small" data-monitor-auto>30s 自动刷新：' + (state.monitorAuto ? '开' : '关') + '</button></span></div></div>';
    html += '<div class="monitor-ai">' + aiCard('生产监视当前标签 <b>' + h(tab) + '</b>：' + (panels[0] ? panels[0].tags.join('、') : '') + '。建议按 7 个标签巡检，异常时联动报警/处置。', [tab, panels.length + ' 组趋势', '7 标签']) + '</div>';
    return html;
  }
  function bindMonitor() {
    S.qsa('[data-monitor-tab]').forEach(function (b) { b.addEventListener('click', function () { state.monitorTab = b.getAttribute('data-monitor-tab'); S.go('monitor'); }); });
    var r = S.qs('[data-monitor-refresh]'); if (r) { r.addEventListener('click', function () { S.toast('<b>刷新</b>：已拉取 21:05 大屏快照（演示环境）'); }); }
    var a = S.qs('[data-monitor-auto]'); if (a) { a.addEventListener('click', function () { state.monitorAuto = !state.monitorAuto; S.toast('<b>自动刷新</b>：' + (state.monitorAuto ? '已开启 30s 演示轮询' : '已关闭')); S.go('monitor'); }); }
  }

  function labInsight() {
    var tab = state.labTab;
    var count = {
      '过程化验': MOD.lab.process.length, '化验项目': MOD.lab.items.length, '来料检验': MOD.lab.incoming.length,
      '环保化验': MOD.lab.env.length, '操作建议': MOD.lab.advice.length, '操作记录': MOD.lab.records.length
    };
    return {
      time: nowShort(), basis: '化验分析 · ' + tab,
      summary: '当前标签 <b>' + tab + '</b>，' + '演示数据 ' + count[tab] + ' 条；化验总单 16,794、已复审 16,769、待复审 25，今日新增 42。',
      findings: [
        '过程化验 12 条样本中 2 条不合格（LX-BIT-2610138B1 脱色透光率 93.2%、LX-BBIT-2610133A2 成品含量偏低）。',
        '来料检验 1 条待检（氯苯 RM-261028-04），需在投料前完成放行。',
        '环保化验 6 项全部合格；RTO 非甲烷总烃 18.2 mg/m³、废水 COD 186 mg/L。'
      ],
      actions: [
        '先处理 2 条不合格过程化验，关联批次与返工/回配。',
        '催办氯苯来料检验，避免影响 B01 投料。',
        '把化验结果自动回写 eBR / 批次放行，减少人工转录。'
      ],
      evidence: ['总化验 16,794', '待复审 25', tab + ' ' + count[tab] + ' 条']
    };
  }
  function labTable(tab) {
    var q = state.labQ.toLowerCase();
    function hit(r) { return !q || JSON.stringify(r).toLowerCase().indexOf(q) >= 0; }
    if (tab === '过程化验') {
      var rows = MOD.lab.process.filter(hit).map(function (r) {
        return '<tr data-lab="process" data-row="' + h(r.no) + '"><td class="mono">' + h(r.no) + '</td><td class="mono">' + h(r.batch) + '</td><td>' + h(r.product) + '</td><td>' + h(r.item) + '</td><td>' + h(r.sample) + '</td><td>' + tag(r.result) + '</td><td>' + h(r.inspector) + '</td><td>' + tag(r.status) + '</td><td><button class="btn small" data-lab-view="process" data-row="' + h(r.no) + '">详情</button></td></tr>';
      }).join('');
      return table(['化验单号', '生产批号', '产品', '化验项目', '取样时间', '结果', '检验员', '审核状态', '操作'], rows);
    }
    if (tab === '化验项目') {
      var rows2 = MOD.lab.items.filter(hit).map(function (r) { return '<tr><td class="mono">' + h(r.code) + '</td><td>' + h(r.name) + '</td><td>' + h(r.target) + '</td><td>' + h(r.method) + '</td><td>' + h(r.unit) + '</td><td class="mono">' + h(r.point) + '</td><td>' + h(r.cycle) + '</td></tr>'; }).join('');
      return table(['项目编码', '项目名称', '指标/阈值', '方法', '单位', '取样点', '频次'], rows2);
    }
    if (tab === '来料检验') {
      var rows3 = MOD.lab.incoming.filter(hit).map(function (r) { return '<tr data-lab="incoming" data-row="' + h(r.no) + '"><td class="mono">' + h(r.no) + '</td><td>' + h(r.material) + '</td><td>' + h(r.supplier) + '</td><td class="mono">' + h(r.batch) + '</td><td>' + h(r.item) + '</td><td>' + tag(r.result) + '</td><td>' + h(r.inspector) + '</td><td>' + h(r.time) + '</td><td><button class="btn small" data-lab-view="incoming" data-row="' + h(r.no) + '">详情</button></td></tr>'; }).join('');
      return table(['检验单号', '物料', '供应商', '来料批次', '检验项目', '结果', '检验员', '时间', '操作'], rows3);
    }
    if (tab === '环保化验') {
      var rows4 = MOD.lab.env.filter(hit).map(function (r) { return '<tr data-lab="env" data-row="' + h(r.point + r.factor) + '"><td>' + h(r.point) + '</td><td>' + h(r.factor) + '</td><td>' + h(r.limit) + '</td><td class="num">' + h(r.value) + '</td><td>' + tag(r.result) + '</td><td>' + h(r.time) + '</td></tr>'; }).join('');
      return table(['排放点', '因子', '限值', '实测值', '结果', '时间'], rows4);
    }
    if (tab === '操作建议') {
      var rows5 = MOD.lab.advice.filter(hit).map(function (r) { return '<tr data-lab="advice" data-row="' + h(r.batch) + '"><td class="mono">' + h(r.batch) + '</td><td>' + h(r.item) + '</td><td>' + h(r.advice) + '</td><td>' + tag(r.priority) + '</td><td>' + tag(r.status) + '</td><td><button class="btn small" data-lab-view="advice" data-row="' + h(r.batch) + '">详情</button></td></tr>'; }).join('');
      return table(['批次', '化验项', '操作建议', '优先级', '状态', '操作'], rows5);
    }
    var rows6 = MOD.lab.records.filter(hit).map(function (r) { return '<tr><td class="mono">' + h(r.time) + '</td><td class="mono">' + h(r.batch) + '</td><td>' + h(r.item) + '</td><td>' + tag(r.result) + '</td><td>' + h(r.operator) + '</td><td class="sub">' + h(r.note) + '</td></tr>'; }).join('');
    return table(['时间', '批次', '化验项', '结果', '操作人', '备注'], rows6);
  }
  function renderLab() {
    var k = MOD.lab.kpi;
    var html = head('iMCS / 化验分析', '化验分析', '按实际 iMCS：过程化验 / 化验项目 / 来料检验 / 环保化验 / 操作建议 / 操作记录；演示合成数据。', '<button class="btn" data-lab-new>新增化验</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4 lab-kpi">';
    html += kpi('总化验单', k.total.toLocaleString(), '项', '正式口径截取', 'blue', '#1466E8', S.chart.spark([16000, 16200, 16400, 16500, 16600, 16700, 16794], '#1466E8'));
    html += kpi('已复审', k.reviewed.toLocaleString(), '项', '复审率 99.85%', 'green', '#0B9A78', S.chart.spark([15900, 16100, 16300, 16400, 16500, 16600, 16769], '#0B9A78'));
    html += kpi('待复审', k.pending, '项', '<span class="warn">需处理</span>', 'amber', '#D97706', S.chart.spark([40, 36, 34, 30, 28, 26, 25], '#D97706'));
    html += kpi('今日新增', k.today, '项', '当班 05:12', 'blue', '#0EA5E9', S.chart.spark([8, 14, 20, 26, 32, 38, 42], '#0EA5E9'));
    html += '</div>';
    html += '<div class="subtabs">' + MOD.lab.tabs.map(function (t) { return '<button class="' + (t === state.labTab ? 'on' : '') + '" data-lab-tab="' + h(t) + '">' + h(t) + '</button>'; }).join('') + '</div>';
    html += '<div class="filters"><input id="labQ" placeholder="搜索单据 / 批次 / 项目 / 物料" value="' + h(state.labQ) + '" style="min-width:260px"><button class="btn small" data-lab-search>查询</button><button class="btn small" data-lab-reset>重置</button><span class="count">当前：' + h(state.labTab) + '</span></div>';
    html += labTable(state.labTab);
    html += aiCard('化验总单 16,794、待复审 25；过程化验 2 条不合格，来料 1 条待检。建议先处理不合格与待检，再回写 eBR。', ['总化验 16,794', '待复审 25', '不合格 2']);
    return html;
  }
  function labDetail(kind, id) {
    var r, title, sub, body;
    if (kind === 'process') { r = MOD.lab.process.filter(function (x) { return x.no === id; })[0]; title = '过程化验 · ' + (r ? r.no : id); sub = r ? r.batch : ''; body = r ? detailGrid([['化验单号', h(r.no)], ['生产批号', h(r.batch)], ['产品', h(r.product)], ['化验项目', h(r.item)], ['取样时间', h(r.sample)], ['结果', tag(r.result)], ['检验员', h(r.inspector)], ['审核状态', tag(r.status)]]) : ''; }
    else if (kind === 'incoming') { r = MOD.lab.incoming.filter(function (x) { return x.no === id; })[0]; title = '来料检验 · ' + (r ? r.no : id); sub = r ? r.material : ''; body = r ? detailGrid([['检验单号', h(r.no)], ['物料', h(r.material)], ['供应商', h(r.supplier)], ['来料批次', h(r.batch)], ['检验项目', h(r.item)], ['结果', tag(r.result)], ['检验员', h(r.inspector)], ['时间', h(r.time)]]) : ''; }
    else if (kind === 'advice') { r = MOD.lab.advice.filter(function (x) { return x.batch === id; })[0]; title = '操作建议 · ' + (r ? r.batch : id); sub = r ? r.item : ''; body = r ? detailGrid([['批次', h(r.batch)], ['化验项', h(r.item)], ['优先级', tag(r.priority)], ['状态', tag(r.status)]]) + '<div style="margin-top:12px" class="note">' + h(r.advice) + '</div>' : ''; }
    else { r = MOD.lab.env.filter(function (x) { return x.point + x.factor === id; })[0]; title = '环保化验 · ' + (r ? r.point : id); sub = r ? r.factor : ''; body = r ? detailGrid([['排放点', h(r.point)], ['因子', h(r.factor)], ['限值', h(r.limit)], ['实测值', h(r.value)], ['结果', tag(r.result)], ['时间', h(r.time)]]) : ''; }
    S.detail(title, sub, body || '<div class="note">演示数据</div>');
  }
  function bindLab() {
    S.qsa('[data-lab-tab]').forEach(function (b) { b.addEventListener('click', function () { state.labTab = b.getAttribute('data-lab-tab'); state.labQ = ''; S.go('lab'); }); });
    var q = S.qs('#labQ'); if (q) { q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.labQ = e.target.value; S.go('lab'); } }); }
    var bs = S.qs('[data-lab-search]'); if (bs) { bs.addEventListener('click', function () { state.labQ = S.qs('#labQ').value; S.go('lab'); }); }
    var br = S.qs('[data-lab-reset]'); if (br) { br.addEventListener('click', function () { state.labQ = ''; S.go('lab'); }); }
    var bn = S.qs('[data-lab-new]'); if (bn) { bn.addEventListener('click', function () { S.toast('<b>新增化验</b>：正式系统打开化验单录入；演示环境仅提示。'); }); }
    S.qsa('[data-lab-view]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); labDetail(b.getAttribute('data-lab-view'), b.getAttribute('data-row')); }); });
    S.qsa('tr[data-lab]').forEach(function (tr) { tr.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-lab-view]')) { return; } labDetail(tr.getAttribute('data-lab'), tr.getAttribute('data-row')); }); });
  }

  function warehouseInsight() {
    var tab = state.whTab;
    return {
      time: nowShort(), basis: '仓储管理 · ' + tab,
      summary: '当前标签 <b>' + tab + '</b>；入库单 3,479、出库单 2,864、待复核 12；车间库存 932,192.96 kg / 1,684 批。',
      findings: [
        '物料入库最新 10 单：RK202610280006–RK202610270034，离心入库为主，6 单复核中、4 单完成。',
        '车间库存：BIT混料 932,192.96 kg / 1,684 批、BIT 44,906.4 kg / 80 批、BIT离心料 1,524,774.2 kg / 2,133 批。',
        '盘库 3 单存在差异：BIT 粗品 -100 kg、BIT 混料 -200 kg、液碱 +10 kg。'
      ],
      actions: [
        '先复核 12 张入库单，避免 eBR 放行时库存未入账。',
        '对 3 单盘库差异发起调账/复盘，确认计量与损耗。',
        '把车间库存与 iMCS 物料库存、储罐管理做同口径核对。'
      ],
      evidence: ['入库 3,479', '待复核 12', '库存 932,192.96 kg']
    };
  }
  function whTable(tab) {
    var q = state.whQ.toLowerCase();
    function hit(r) { return !q || JSON.stringify(r).toLowerCase().indexOf(q) >= 0; }
    if (tab === '物料入库') {
      var rows = MOD.warehouse.inbound.filter(hit).map(function (r) { return '<tr data-wh="inbound" data-row="' + h(r.no) + '"><td class="mono">' + h(r.no) + '</td><td class="mono">' + h(r.batch) + '</td><td>' + h(r.name) + '</td><td class="num">' + r.weight.toFixed(2) + '</td><td>' + r.bags + '</td><td>' + h(r.type) + '</td><td>' + tag(r.status) + '</td><td class="sub">' + h(r.time) + '</td><td><button class="btn small" data-wh-view="inbound" data-row="' + h(r.no) + '">查看</button>' + (r.status === '复核中' ? ' <button class="btn small" data-wh-review="' + h(r.no) + '">复核</button>' : '') + '</td></tr>'; }).join('');
      return table(['单据编号', '生产批号', '单据名称', '入库净重', '装袋数量', '业务类型', '单据状态', '创建时间', '操作'], rows);
    }
    if (tab === '物料出库') {
      var rows2 = MOD.warehouse.outbound.filter(hit).map(function (r) { return '<tr data-wh="outbound" data-row="' + h(r.no) + '"><td class="mono">' + h(r.no) + '</td><td class="mono">' + h(r.batch) + '</td><td>' + h(r.material) + '</td><td class="num">' + r.weight.toFixed(2) + '</td><td>' + h(r.type) + '</td><td>' + tag(r.status) + '</td><td>' + h(r.time) + '</td><td><button class="btn small" data-wh-view="outbound" data-row="' + h(r.no) + '">详情</button></td></tr>'; }).join('');
      return table(['单据编号', '生产批号', '物料', '出库净重', '业务类型', '状态', '时间', '操作'], rows2);
    }
    if (tab === '车间库存') {
      var rows3 = MOD.warehouse.stock.filter(hit).map(function (r) { return '<tr data-wh="stock" data-row="' + h(r.code) + '"><td class="mono">' + h(r.code) + '</td><td>' + h(r.name) + '</td><td class="num">' + r.stock.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + '</td><td>' + r.batches.toLocaleString() + '</td><td>' + h(r.unit) + '</td><td><button class="btn small" data-wh-view="stock" data-row="' + h(r.code) + '">明细</button></td></tr>'; }).join('');
      return table(['物料编码', '物料名称', '总库存', '批次数量', '单位', '操作'], rows3);
    }
    if (tab === '盘库管理') {
      var rows4 = MOD.warehouse.inventory.filter(hit).map(function (r) { return '<tr data-wh="inventory" data-row="' + h(r.no) + '"><td class="mono">' + h(r.no) + '</td><td>' + h(r.warehouse) + '</td><td>' + h(r.material) + '</td><td class="num">' + r.book.toFixed(2) + '</td><td class="num">' + r.actual.toFixed(2) + '</td><td class="num ' + (r.diff !== 0 ? 'warn' : '') + '">' + (r.diff > 0 ? '+' : '') + r.diff.toFixed(2) + '</td><td>' + tag(r.status) + '</td></tr>'; }).join('');
      return table(['盘库单号', '仓库', '物料', '账面', '实盘', '差异', '状态'], rows4);
    }
    if (tab === '库存流水') {
      var rows5 = MOD.warehouse.flow.filter(hit).map(function (r) { return '<tr><td class="mono">' + h(r.time) + '</td><td>' + h(r.material) + '</td><td>' + h(r.type) + '</td><td class="num ' + (r.qty.indexOf('-') === 0 ? 'warn' : '') + '">' + h(r.qty) + '</td><td class="mono">' + h(r.doc) + '</td><td>' + h(r.user) + '</td></tr>'; }).join('');
      return table(['时间', '物料', '业务类型', '数量(kg)', '单据', '操作人'], rows5);
    }
    var rows6 = MOD.warehouse.config.filter(hit).map(function (r) { return '<tr><td class="mono">' + h(r.code) + '</td><td>' + h(r.name) + '</td><td>' + h(r.type) + '</td><td>' + r.locations + '</td><td>' + h(r.keeper) + '</td><td>' + tag(r.status) + '</td></tr>'; }).join('');
    return table(['仓库编码', '仓库名称', '类型', '库位数', '保管人', '状态'], rows6);
  }
  function renderWarehouse() {
    var k = MOD.warehouse.kpi;
    var html = head('iMCS / 仓储管理', '仓储管理', '按实际 iMCS：物料入库/出库/车间库存/盘库/流水/仓储配置；演示合成数据。', '<button class="btn" data-wh-new>新增入库单</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4 wh-kpi">';
    html += kpi('入库单', k.inbound.toLocaleString(), '张', '正式口径截取', 'blue', '#1466E8', S.chart.spark([3000, 3100, 3200, 3300, 3380, 3440, 3479], '#1466E8'));
    html += kpi('出库单', k.outbound.toLocaleString(), '张', '含销售/领用/移库', 'blue', '#0EA5E9', S.chart.spark([2500, 2600, 2660, 2700, 2780, 2830, 2864], '#0EA5E9'));
    html += kpi('待复核', k.waitReview, '张', '<span class="warn">需处理</span>', 'amber', '#D97706', S.chart.spark([18, 16, 15, 14, 13, 13, 12], '#D97706'));
    html += kpi('车间库存', (k.stockKg / 10000).toFixed(1), '万 kg', '1,684 批', 'green', '#0B9A78', S.chart.spark([88, 89, 90, 91, 92, 92, 93.2], '#0B9A78'));
    html += '</div>';
    html += '<div class="subtabs">' + MOD.warehouse.tabs.map(function (t) { return '<button class="' + (t === state.whTab ? 'on' : '') + '" data-wh-tab="' + h(t) + '">' + h(t) + '</button>'; }).join('') + '</div>';
    html += '<div class="filters"><input id="whQ" placeholder="搜索单据 / 批次 / 物料 / 仓库" value="' + h(state.whQ) + '" style="min-width:260px"><button class="btn small" data-wh-search>查询</button><button class="btn small" data-wh-reset>重置</button><span class="count">当前：' + h(state.whTab) + '</span></div>';
    html += whTable(state.whTab);
    html += aiCard('入库 3,479、待复核 12；车间库存 932,192.96 kg。先复核入库单与 3 单盘库差异，再做库存与 eBR 对账。', ['待复核 12', '库存 93.2 万 kg', '盘差 3 单']);
    return html;
  }
  function whDetail(kind, id) {
    var r, title, sub, body;
    if (kind === 'inbound') { r = MOD.warehouse.inbound.filter(function (x) { return x.no === id; })[0]; title = '入库单 · ' + (r ? r.no : id); sub = r ? r.batch : ''; body = r ? detailGrid([['单据编号', h(r.no)], ['生产批号', h(r.batch)], ['单据名称', h(r.name)], ['入库净重', r.weight.toFixed(2) + ' kg'], ['装袋数量', r.bags], ['业务类型', h(r.type)], ['状态', tag(r.status)], ['创建时间', h(r.time)]]) : ''; }
    else if (kind === 'outbound') { r = MOD.warehouse.outbound.filter(function (x) { return x.no === id; })[0]; title = '出库单 · ' + (r ? r.no : id); sub = r ? r.material : ''; body = r ? detailGrid([['单据编号', h(r.no)], ['生产批号', h(r.batch)], ['物料', h(r.material)], ['出库净重', r.weight.toFixed(2) + ' kg'], ['业务类型', h(r.type)], ['状态', tag(r.status)], ['时间', h(r.time)]]) : ''; }
    else if (kind === 'stock') { r = MOD.warehouse.stock.filter(function (x) { return x.code === id; })[0]; title = '库存明细 · ' + (r ? r.name : id); sub = r ? r.code : ''; body = r ? detailGrid([['物料编码', h(r.code)], ['物料名称', h(r.name)], ['总库存', r.stock.toLocaleString() + ' kg'], ['批次数量', r.batches.toLocaleString()], ['单位', h(r.unit)]]) + '<div style="margin-top:12px" class="note">明细批次台账在正式系统按批次展开；演示环境展示总量口径。</div>' : ''; }
    else { r = MOD.warehouse.inventory.filter(function (x) { return x.no === id; })[0]; title = '盘库单 · ' + (r ? r.no : id); sub = r ? r.material : ''; body = r ? detailGrid([['盘库单号', h(r.no)], ['仓库', h(r.warehouse)], ['物料', h(r.material)], ['账面', r.book.toFixed(2)], ['实盘', r.actual.toFixed(2)], ['差异', r.diff.toFixed(2)], ['状态', tag(r.status)]]) : ''; }
    S.detail(title, sub, body || '<div class="note">演示数据</div>');
  }
  function bindWarehouse() {
    S.qsa('[data-wh-tab]').forEach(function (b) { b.addEventListener('click', function () { state.whTab = b.getAttribute('data-wh-tab'); state.whQ = ''; S.go('warehouse'); }); });
    var q = S.qs('#whQ'); if (q) { q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.whQ = e.target.value; S.go('warehouse'); } }); }
    var bs = S.qs('[data-wh-search]'); if (bs) { bs.addEventListener('click', function () { state.whQ = S.qs('#whQ').value; S.go('warehouse'); }); }
    var br = S.qs('[data-wh-reset]'); if (br) { br.addEventListener('click', function () { state.whQ = ''; S.go('warehouse'); }); }
    var bn = S.qs('[data-wh-new]'); if (bn) { bn.addEventListener('click', function () { S.toast('<b>新增入库单</b>：正式系统打开入库单录入；演示环境仅提示。'); }); }
    S.qsa('[data-wh-view]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); whDetail(b.getAttribute('data-wh-view'), b.getAttribute('data-wh-row') || b.getAttribute('data-row')); }); });
    S.qsa('[data-wh-review]').forEach(function (b) { b.addEventListener('click', function (e) { e.stopPropagation(); S.toast('<b>复核</b>：已模拟复核 ' + h(b.getAttribute('data-wh-review')) + '（演示环境，不写 WMS）'); }); });
    S.qsa('tr[data-wh]').forEach(function (tr) { tr.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('button')) { return; } whDetail(tr.getAttribute('data-wh'), tr.getAttribute('data-row')); }); });
  }

  S.boot({
    product: 'imcs', code: 'iMCS', name: '生产管控系统',
    subtitle: 'MES · 批次执行 · 质量与物料', mark: 'M',
    workspace: '某精细化工 · 演示环境', user: '张', date: '2026-10-27',
    defaultPage: 'dashboard', searchPlaceholder: '搜索工单 / 批次 / 物料',
    nav: [
      { group: '总览', items: [{ id: 'dashboard', icon: 'dashboard', label: '生产驾驶舱' }, { id: 'monitor', icon: 'dashboard', label: '生产监视' }] },
      { group: '计划', items: [{ id: 'plan', icon: 'plan', label: '计划排程' }] },
      { group: '配方', items: [{ id: 'recipe', icon: 'file', label: '配方管理' }] },
      { group: '生产', items: [{ id: 'execution', icon: 'play', label: '生产执行', badge: '2' }, { id: 'ebr', icon: 'file', label: '电子批记录', badge: '6' }] },
      { group: '罐区', items: [{ id: 'tanks', icon: 'material', label: '罐区管理' }] },
      { group: '质量', items: [{ id: 'quality', icon: 'quality', label: '质量检验' }, { id: 'lab', icon: 'file', label: '化验分析' }] },
      { group: '物料', items: [{ id: 'materials', icon: 'material', label: '物料库存' }, { id: 'warehouse', icon: 'material', label: '仓储管理' }] }
    ],
    pages: {
      dashboard: { title: '生产驾驶舱', crumb: '生产驾驶舱', render: renderDashboard, bind: bindDashboard, insight: dashboardInsight },
      monitor: { title: '生产监视', crumb: '生产监视', render: renderMonitor, bind: bindMonitor, insight: monitorInsight },
      plan: { title: '计划排程', crumb: '计划排程', render: renderPlan, bind: bindPlan, insight: planInsight },
      recipe: { title: '配方管理', crumb: '配方管理', render: renderRecipe, bind: bindRecipe, insight: recipeInsight },
      execution: { title: '生产执行', crumb: '生产执行', render: renderExecution, bind: bindExecution, insight: executionInsight },
      ebr: { title: '电子批记录', crumb: '电子批记录', render: renderEbr, bind: bindEbr, insight: ebrInsight },
      tanks: { title: '罐区管理', crumb: '罐区管理', render: renderTanks, bind: bindTanks, insight: tankInsight },
      quality: { title: '质量检验', crumb: '质量检验', render: renderQuality, bind: bindQuality, insight: qualityInsight },
      lab: { title: '化验分析', crumb: '化验分析', render: renderLab, bind: bindLab, insight: labInsight },
      materials: { title: '物料库存', crumb: '物料库存', render: renderMaterials, bind: bindMaterials, insight: materialInsight },
      warehouse: { title: '仓储管理', crumb: '仓储管理', render: renderWarehouse, bind: bindWarehouse, insight: warehouseInsight }
    }
  });
})();
