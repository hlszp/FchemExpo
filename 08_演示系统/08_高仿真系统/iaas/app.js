(function () {
  var D = window.IAAS_DEMO;
  var S = window.SimShell;
  var esc = S.esc;
  var state = {
    unit: '全部', priority: '全部', status: '全部', q: '', analysisBy: '单元', disposal: '未闭环', auditAction: '全部',
    hRange: '近48小时', hDevice: '全部', hUnit: '全部', hPriority: '全部', hType: '全部', hAck: '全部', hTimeout: '全部', hq: '', hMode: '列表', hLimit: 80,
    tType: '全部', tDevice: '全部', tPriority: '全部', tState: '全部', tq: '', tLimit: 80,
    cScope: '近48小时',
    dStatus: '全部', dDevice: '全部', dPriority: '全部', dMethod: '全部', dq: '', dLimit: 80,
    iDevice: '全部', iType: '全部', iStatus: '全部', iLevel: '全部', iq: '',
    aDevice: '全部', aMode: '全部', aStatus: '全部', aq: '', aLimit: 80,
    pPeriod: '月', pDevice: '全部',
    fDevice: '全部', fEnable: '全部', fApprove: '全部', fq: ''
  };
  function rank(a) { return a.priority === '紧急' ? 0 : (a.priority === '重要' ? 1 : 2); }

  function h(v) { return esc(v); }
  function nowShort() { return S.nowText().slice(-8); }
  function tag(s) {
    var m = {
      '正常': 'green', '未确认': 'amber', '已确认': 'blue', '处置中': 'blue', '搁置': 'gray', '已处置': 'green',
      '紧急': 'red', '重要': 'amber', '一般': 'blue', '达标': 'green', '超标': 'red',
      '投运': 'green', '旁路': 'amber', '摘除': 'red', '未投': 'gray',
      '启用': 'green', '停用': 'gray', '已生效': 'blue', '待审批': 'amber', '已驳回': 'gray',
      '已闭环': 'green', '自动': 'green', '串级': 'blue', '手动': 'amber', '远程': 'gray',
      '优良': 'green', '合格': 'blue', '劣化': 'red', '待处理': 'amber', '已处理': 'green',
      '安全联锁': 'blue', '生产联锁': 'gray', 'SIS': 'red', 'ESD': 'amber', 'DCS': 'blue',
      '已恢复': 'green', '未恢复（超时）': 'red', '过程': 'blue', '设备': 'gray', '安全': 'amber',
      '部分搁置': 'amber', '部分停用': 'red', '正常': 'green',
      '当前报警': 'blue', '近48小时': 'blue', '近24小时': 'blue', '今日': 'blue'
    };
    return '<span class="tag ' + (m[s] || 'gray') + '">' + h(s) + '</span>';
  }
  function head(kicker, title, sub, actions) {
    return '<div class="page-head"><div><div class="eyebrow">' + h(kicker) + '</div><h1>' + h(title) + '</h1><p>' + h(sub) + '</p></div><div class="head-actions">' + (actions || '') + '</div></div>';
  }
  function kpi(label, value, unit, delta, color, spark) {
    return '<div class="kpi" style="--kc:' + color + '"><div class="k"><span>' + h(label) + '</span>' + (spark || '') + '</div><div class="v">' + h(value) + (unit ? '<small>' + h(unit) + '</small>' : '') + '</div><div class="d">' + delta + '</div></div>';
  }
  function table(headers, rows, minWidth) {
    return '<div class="table-wrap" style="max-width:100%"><table' + (minWidth ? ' style="min-width:' + minWidth + 'px"' : '') + '><thead><tr>' + headers.map(function (x) { return '<th>' + h(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function detailGrid(items) {
    return '<div class="detail-grid">' + items.map(function (it) {
      return '<div class="detail-item"><span>' + h(it[0]) + '</span><b>' + it[1] + '</b></div>';
    }).join('') + '</div>';
  }
  function aiCard(text, chips) {
    return '<div class="ai-card" data-ai-open style="cursor:pointer"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>' + text + '</p><div class="foot">' + (chips || []).map(function (c) { return '<span class="ai-chip">' + h(c) + '</span>'; }).join('') + '</div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
  }
  function filteredAlarms() {
    return D.alarms.filter(function (a) {
      if (state.unit !== '全部' && a.unit !== state.unit) { return false; }
      if (state.priority !== '全部' && a.priority !== state.priority) { return false; }
      if (state.status !== '全部' && a.status !== state.status) { return false; }
      if (state.q && (a.id + a.tag + a.desc + a.unit).toLowerCase().indexOf(state.q.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function alarmCounts(list) {
    return {
      unconfirmed: list.filter(function (a) { return a.status === '未确认'; }).length,
      emergency: list.filter(function (a) { return a.priority === '紧急' && a.status !== '已处置'; }).length,
      handling: list.filter(function (a) { return a.status === '处置中' || a.status === '已确认'; }).length
    };
  }

  function dashboardInsight() {
    return {
      time: nowShort(), basis: '驾驶舱 · 当前班次',
      summary: '当前报警 <b>957 条</b>，未确认 <b>277 条</b>；<b>2EH-GY</b> 447 条占 46.7%，TOP10 位号占 62.07%，报警密度仍然偏高。',
      findings: [
        '2EH-GY 447 条、MTO-GY 192 条、BD-GY 147 条，三个单元占 <b>82.1%</b>；其中 2EH-GY 连续 3 个班次排第一。',
        '紧急报警 357 条，未确认 277 条；确认及时率 99.77% 但处置及时率仅 <b>93.70%</b>。',
        '报警峰值在 12 时 <b>397 条/小时</b>，全天小时均值 <b>88 条</b>；夜间回落到 40–70 条。'
      ],
      actions: [
        '先治理 2EH-GY：拉出 2EH-TIC-1203 / 2EH-PIC-1108 的重复报警，做死区/延时。',
        '对 277 条未确认报警按“紧急→重要”清一遍，避免班末堆积。',
        '把 12 时 397 条峰值纳入报警泛滥分析，确认是否与交接班/进料波动相关。'
      ],
      evidence: ['报警 957', '未确认 277', '2EH-GY 447', '处置及时率 93.70%']
    };
  }
  function realtimeInsight() {
    var list = filteredAlarms();
    var c = alarmCounts(list);
    var ordered = list.slice().sort(function (a, b) { return rank(a) - rank(b); }).slice(0, 3);
    var findings = ordered.length ? ordered.map(function (a) {
      return '<b>' + a.tag + '</b>（' + a.desc + '）：' + a.unit + '，' + a.priority + '，' + a.status + '，持续 ' + a.duration + '。';
    }) : ['当前筛选无报警；可清空筛选或切换单元。'];
    var actions = ordered.length ? [
      '先确认 ' + ordered[0].tag + '（' + ordered[0].priority + '），记录现场处置动作。',
      '对同单元重复报警做死区/延时复核，避免同一工况反复触发。',
      '搁置报警设到期提醒，超时未恢复自动转待处置。'
    ] : ['当前筛选无报警；保持监控。', '切换单元/等级查看其他报警。', '关注 2EH-GY / MTO-GY 的重复报警。'];
    return {
      time: nowShort(), basis: '实时报警 · ' + state.unit + ' / ' + state.priority + ' / ' + state.status,
      summary: '当前筛选 <b>' + list.length + ' 条</b>报警，<b>' + c.unconfirmed + ' 条未确认</b>、' + c.emergency + ' 条紧急未闭环。建议先处理紧急未确认，再按单元清理重复报警。',
      findings: findings,
      actions: actions,
      evidence: ['筛选 ' + list.length + ' 条', '未确认 ' + c.unconfirmed, '紧急 ' + c.emergency]
    };
  }
  function analysisInsight() {
    var top = D.topTags[0];
    return {
      time: nowShort(), basis: '报警分析 · 按' + state.analysisBy,
      summary: '按' + state.analysisBy + '看，<b>' + (state.analysisBy === '单元' ? '2EH-GY' : (state.analysisBy === '位号' ? top.tag : '过程')) + '</b> 排名第一；TOP10 位号合计占报警量 <b>62.07%</b>，前 3 个位号占 <b>27.4%</b>。',
      findings: [
        '2EH-GY 447 条（46.7%），MTO-GY 192 条（20.1%），BD-GY 147 条（15.4%）；三个单元合计 82.1%。',
        'TOP1 位号 2EH-TIC-1203 100 条、TOP2 2EH-PIC-1108 88 条、TOP3 MTO-FIC-2201 74 条，重复报警特征明显。',
        '12 时出现 397 条/小时的峰值（全天均值 88 条），符合“报警泛滥”特征，建议做工况关联分析。'
      ],
      actions: [
        '先对 TOP3 位号做死区/延时/报警级别复核，预计可压降 20%–30%。',
        '对 2EH-GY 做一次报警合理化（Rationalization）评审，保留真报警。',
        '把 12–14 时峰值与交接班、进料变化做时间关联，确认根因。'
      ],
      evidence: ['TOP10 62.07%', '2EH-GY 46.7%', '峰值 397 条/时']
    };
  }
  function disposalInsight() {
    var list = D.alarms.filter(function (a) {
      if (state.disposal === '未闭环') { return a.status !== '已处置'; }
      if (state.disposal === '全部') { return true; }
      return a.status === state.disposal;
    });
    var un = list.filter(function (a) { return a.status === '未确认'; }).length;
    var ordered = list.slice().sort(function (a, b) { return rank(a) - rank(b); }).slice(0, 3);
    var findings = ordered.length ? ordered.map(function (a) {
      return '<b>' + a.tag + '</b>（' + a.desc + '）：' + a.unit + '，' + a.priority + '，' + a.status + '。';
    }) : ['当前筛选无报警。'];
    var actions = ordered.length ? [
      '按“紧急未确认 → 重要处置中 → 搁置到期”顺序清屏。',
      '先处理 ' + ordered[0].tag + '，记录确认/处置动作与恢复时间。',
      '对搁置报警设置自动到期提醒，避免长期屏蔽。'
    ] : ['切换筛选查看其他状态。', '保持监控。', '关注累计未处置 4,807 条。'];
    return {
      time: nowShort(), basis: '报警处置 · ' + state.disposal,
      summary: '当前筛选 <b>' + list.length + ' 条</b>，其中未确认 <b>' + un + ' 条</b>；4807 条未处置是累计口径，本页演示当前 20 条样本。',
      findings: findings,
      actions: actions,
      evidence: ['筛选 ' + list.length, '未确认 ' + un, '累计未处置 4807']
    };
  }
  function auditInsight() {
    return {
      time: nowShort(), basis: '报警审计 · 最近操作',
      summary: '最近 6 条审计记录中，<b>2 条确认</b>、1 条置处置中、1 条搁置、1 条配置修改、1 条停用；配置修改与停用需要审批留痕。',
      findings: [
        '赵工修改 MTO-PIC-2102 死区（0.02→0.03 MPa），状态为“待审批”，需确认审批链。',
        '陈工停用 OPU-FIC-4302（仪表检修 2 小时），需确认停用范围与到期恢复。',
        '张平确认 2EH-AIC-1301 尾气氧含量高，联锁已动作；建议补充处置结果。'
      ],
      actions: [
        '审批 MTO-PIC-2102 死区变更，确认是否影响报警灵敏度。',
        '跟踪 OPU-FIC-4302 停用到期，避免仪表检修后未恢复。',
        '对确认/处置记录补充闭环说明，满足审计追溯。'
      ],
      evidence: ['审计 6 条', '配置变更 1', '停用 1']
    };
  }

  function renderDashboard() {
    var k = D.kpi;
    var html = head('iAAS / 报警驾驶舱', '报警管理驾驶舱', '2026-10-27 当班 · 数据截止 ' + nowShort() + ' · 演示合成数据', '<button class="btn" data-action="refresh">刷新</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('监测数量', k.monitored.toLocaleString(), '点', '运行 ' + k.running.toLocaleString() + ' · 搁置 ' + k.shelved + ' · 停用 ' + k.disabled, '#1466E8', S.chart.spark([19000, 19200, 19400, 19500, 19600, 19700, 19733], '#1466E8'));
    html += kpi('报警监控', k.alarms, '条', '已确认 ' + k.confirmed + ' · 未确认 <span class="down">' + k.unconfirmed + '</span>', '#DC2626', S.chart.spark([900, 920, 940, 930, 950, 955, 957], '#DC2626'));
    html += kpi('报警处置', k.disposed.toLocaleString(), '条', '未处置 ' + k.unhandled + ' · 处置中 ' + k.handling, '#0B9A78', S.chart.spark([380000, 390000, 398000, 402000, 406000, 409000, 410925], '#0B9A78'));
    html += kpi('确认及时率', k.confirmRate.toFixed(2), '%', '目标 ≥95%', '#0EA5E9', S.chart.spark([99.5, 99.6, 99.6, 99.7, 99.6, 99.7, 99.77], '#0EA5E9'));
    html += kpi('处置及时率', k.disposeRate.toFixed(2), '%', '<span class="warn">低于 95% 目标</span>', '#D97706', S.chart.spark([92, 93, 92, 94, 93, 94, 93.70], '#D97706'));
    html += kpi('紧急报警', 357, '条', '未确认 277 · 重要 180', '#DC2626', S.chart.spark([320, 330, 340, 350, 355, 356, 357], '#DC2626'));
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    var trend = D.trend.map(function (v, i) { return { label: i % 2 === 0 ? i + '时' : '', value: v }; });
    html += '<div class="card"><div class="card-h"><h3>24 小时报警趋势</h3><span>小时报警数 · ISA 目标 ≤ 30</span></div><div class="chart">' + S.chart.bars(trend, { height: 230, color: '#1466E8', target: 30 }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>小时报警数</span><span><i style="background:#F59E0B"></i>目标 30</span></div></div>';
    html += '<div class="card"><div class="card-h"><h3>报警等级分布</h3><span>共 957 条</span></div>' + S.chart.donut(D.priority, '957', '报警总数') + '</div>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>单元报警排名</h3><span>TOP 8</span></div>';
    var max = D.units[0].value;
    D.units.slice(0, 8).forEach(function (u, i) {
      var w = u.value / max * 100;
      html += '<div style="display:flex;align-items:center;gap:9px;padding:5px 0;border-bottom:1px solid #EEF2F7"><span style="width:18px;color:#94A3B8;font-size:10px">' + (i + 1) + '</span><span style="min-width:96px;font-size:11.5px">' + h(u.name) + '</span><div class="progress" style="flex:1;height:7px"><span style="width:' + w + '%;background:' + (i === 0 ? '#DC2626' : '#1466E8') + '"></span></div><b style="min-width:38px;text-align:right;font-size:11.5px">' + u.value + '</b></div>';
    });
    html += '<div style="margin-top:10px"><button class="btn small" data-nav-jump="analysis">报警分析 →</button></div></div>';
    html += '<div class="card"><div class="card-h"><h3>快捷入口与待办</h3><span>当前班次</span></div><div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">';
    [['实时报警', 'realtime', '未确认 277'], ['报警分析', 'analysis', 'TOP10 62.07%'], ['报警处置', 'disposal', '待处置 4807'], ['审计追踪', 'audit', '最近 6 条']].forEach(function (x) {
      html += '<button class="btn" data-nav-jump="' + x[1] + '" style="justify-content:space-between"><span>' + x[0] + '</span><span class="sub">' + x[2] + '</span></button>';
    });
    html += '</div><div style="margin-top:10px;display:grid;gap:6px"><div class="note" style="margin:0;padding:8px 10px">2EH-GY 447 条，连续 3 个班次第一</div><div class="note" style="margin:0;padding:8px 10px">12 时峰值 397 条/小时</div><div class="note" style="margin:0;padding:8px 10px">紧急未确认：2EH-TIC-1203 / BD-LIC-3302</div></div></div>';
    html += '</div>';
    html += aiCard('当前报警 957 条、未确认 277 条；2EH-GY 447 条占 46.7%，TOP10 位号占 62.07%。建议先治理 2EH-GY，再清理紧急未确认。', ['957 条', '未确认 277', '2EH-GY 46.7%']);
    return html;
  }
  function bindDashboard() {
    var r = S.qs('[data-action="refresh"]');
    if (r) { r.addEventListener('click', function () { S.toast('<b>刷新</b>：已拉取 19:32 演示快照'); }); }
    S.qsa('[data-nav-jump]').forEach(function (b) { b.addEventListener('click', function () { S.go(b.getAttribute('data-nav-jump')); }); });
  }

  function renderRealtime() {
    var list = filteredAlarms();
    var c = alarmCounts(list);
    var html = head('iAAS / 报警监控', '实时报警', '按单元 / 等级 / 状态筛选；表格行可查看详情，操作按钮为演示动作。', '<button class="btn" data-action="new-alarm">模拟新报警</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters"><select id="aUnit"><option>全部</option><option' + (state.unit === '2EH-GY' ? ' selected' : '') + '>2EH-GY</option><option' + (state.unit === 'MTO-GY' ? ' selected' : '') + '>MTO-GY</option><option' + (state.unit === 'BD-GY' ? ' selected' : '') + '>BD-GY</option><option' + (state.unit === 'OPU-GY' ? ' selected' : '') + '>OPU-GY</option><option' + (state.unit === '火炬' ? ' selected' : '') + '>火炬</option></select><select id="aPriority"><option>全部</option><option' + (state.priority === '紧急' ? ' selected' : '') + '>紧急</option><option' + (state.priority === '重要' ? ' selected' : '') + '>重要</option><option' + (state.priority === '一般' ? ' selected' : '') + '>一般</option></select><select id="aStatus"><option>全部</option><option' + (state.status === '未确认' ? ' selected' : '') + '>未确认</option><option' + (state.status === '已确认' ? ' selected' : '') + '>已确认</option><option' + (state.status === '处置中' ? ' selected' : '') + '>处置中</option><option' + (state.status === '搁置' ? ' selected' : '') + '>搁置</option><option' + (state.status === '已处置' ? ' selected' : '') + '>已处置</option></select><input id="aSearch" placeholder="位号 / 描述" value="' + h(state.q) + '"><span class="count">共 ' + list.length + ' 条 · 未确认 ' + c.unconfirmed + ' · 紧急 ' + c.emergency + '</span></div>';
    var rows = list.map(function (a) {
      return '<tr data-alarm="' + h(a.id) + '"><td class="sub">' + h(a.time) + '</td><td><b>' + h(a.unit) + '</b></td><td class="mono">' + h(a.tag) + '</td><td>' + h(a.desc) + '</td><td>' + tag(a.priority) + '</td><td>' + tag(a.status) + '</td><td>' + h(a.type) + '</td><td>' + h(a.operator) + '</td><td><button class="btn small" data-alarm-action="ack">确认</button> <button class="btn small" data-alarm-action="handle">处置</button></td></tr>';
    }).join('');
    html += table(['报警时间', '单元', '位号', '描述', '优先级', '状态', '类型', '确认人', '操作'], rows);
    var ri = realtimeInsight();
    html += aiCard(ri.summary, ri.evidence.slice(0, 3));
    return html;
  }
  function bindRealtime() {
    ['aUnit', 'aPriority', 'aStatus'].forEach(function (id) {
      var el = S.qs('#' + id);
      if (!el) { return; }
      el.addEventListener('change', function (e) {
        if (id === 'aUnit') { state.unit = e.target.value; }
        if (id === 'aPriority') { state.priority = e.target.value; }
        if (id === 'aStatus') { state.status = e.target.value; }
        S.go('realtime');
      });
    });
    var q = S.qs('#aSearch');
    if (q) { q.addEventListener('keydown', function (e) { if (e.key === 'Enter') { state.q = e.target.value; S.go('realtime'); } }); }
    var na = S.qs('[data-action="new-alarm"]');
    if (na) { na.addEventListener('click', function () { S.toast('<b>模拟新报警</b>：AL-20261027-021 反应器出口温度高 · 2EH-GY'); }); }
    S.qsa('tr[data-alarm]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-alarm-action]')) { return; }
        showAlarm(tr.getAttribute('data-alarm'));
      });
    });
    S.qsa('[data-alarm-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-alarm') : '';
        var act = b.getAttribute('data-alarm-action');
        var a = D.alarms.filter(function (x) { return x.id === id; })[0];
        if (a) {
          a.status = act === 'ack' ? '已确认' : '处置中';
          a.operator = '张平';
          D.auditLogs.unshift({ time: '10-27 ' + nowShort(), user: '张平', action: act === 'ack' ? '确认报警' : '置为处置中', target: a.tag, detail: '演示操作：' + a.desc });
        }
        S.toast('<b>' + (act === 'ack' ? '确认' : '处置') + '</b>：已模拟更新 ' + h(id) + '（演示环境）');
        S.go('realtime');
      });
    });
  }
  function showAlarm(id) {
    var a = D.alarms.filter(function (x) { return x.id === id; })[0];
    if (!a) { return; }
    var body = detailGrid([['报警编号', h(a.id)], ['时间', h(a.time)], ['单元', h(a.unit)], ['位号', h(a.tag)], ['描述', h(a.desc)], ['优先级', tag(a.priority)], ['状态', tag(a.status)], ['类型', h(a.type)], ['确认人', h(a.operator)], ['持续', h(a.duration)]]) + '<div style="margin-top:12px"><div class="card-h"><h3>处置建议</h3><span>演示口径</span></div><div class="note" style="margin:0">' + (a.priority === '紧急' ? '立即确认并通知当班；必要时联锁/减负荷，记录处置动作与恢复时间。' : '按报警优先级确认；先核对现场与工艺参数，再决定处置/搁置。') + '</div></div>';
    S.detail('报警详情 · ' + a.id, a.unit + ' · ' + a.tag, body);
  }

  function renderAnalysis() {
    var by = state.analysisBy;
    var data;
    if (by === '单元') { data = D.units.slice(0, 8).map(function (u) { return { label: u.name, value: u.value }; }); }
    else if (by === '位号') { data = D.topTags.map(function (t) { return { label: t.tag, value: t.count }; }); }
    else { data = [{ label: '过程', value: 640 }, { label: '设备', value: 210 }, { label: '安全', value: 107 }]; }
    var html = head('iAAS / 报警分析', '报警分析与泛滥识别', '按单元 / 位号 / 类型切换分析维度；识别重复报警与报警泛滥。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>TOP10 占比</h3><span>按报警数</span></div><div class="v" style="font-size:28px;font-weight:900">62.07%</div><div class="sub">前 3 位号占 27.4%</div></div>';
    html += '<div class="card"><div class="card-h"><h3>2EH-GY 占比</h3><span>单元</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">46.7%</div><div class="sub">447 / 957 条</div></div>';
    html += '<div class="card"><div class="card-h"><h3>峰值小时</h3><span>12 时</span></div><div class="v" style="font-size:28px;font-weight:900;color:#D97706">397</div><div class="sub">条/小时 · 报警泛滥</div></div>';
    html += '</div>';
    html += '<div class="filters"><select id="analysisBy"><option' + (by === '单元' ? ' selected' : '') + '>单元</option><option' + (by === '位号' ? ' selected' : '') + '>位号</option><option' + (by === '类型' ? ' selected' : '') + '>类型</option></select><span class="count">当前维度：' + h(by) + '</span></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>报警排名 · 按' + h(by) + '</h3><span>Top 8</span></div><div class="chart">' + S.chart.bars(data, { height: 240, color: '#1466E8' }) + '</div></div><div class="card"><div class="card-h"><h3>报警泛滥 · 24h</h3><span>小时报警数</span></div><div class="chart">' + S.chart.bars(D.trend.map(function (v, i) { return { label: i % 2 === 0 ? i + '时' : '', value: v }; }), { height: 240, color: '#D97706', target: 30 }) + '</div></div></div>';
    var rows = D.topTags.map(function (t, i) {
      return '<tr><td>' + (i + 1) + '</td><td class="mono">' + h(t.tag) + '</td><td>' + h(t.desc) + '</td><td>' + h(t.unit) + '</td><td><b>' + t.count + '</b></td><td><button class="btn small" data-tag="' + h(t.tag) + '">查看</button></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>重复报警 TOP10 位号</h3><span>点击查看</span></div>' + table(['#', '位号', '描述', '单元', '报警数', '操作'], rows) + '</div>';
    var ai = analysisInsight();
    html += aiCard(ai.summary, ai.evidence.slice(0, 3));
    return html;
  }
  function bindAnalysis() {
    var sel = S.qs('#analysisBy');
    if (sel) { sel.addEventListener('change', function (e) { state.analysisBy = e.target.value; S.go('analysis'); }); }
    S.qsa('[data-tag]').forEach(function (b) {
      b.addEventListener('click', function () {
        var tag = b.getAttribute('data-tag');
        var t = D.topTags.filter(function (x) { return x.tag === tag; })[0];
        if (!t) { return; }
        S.detail('位号报警 · ' + t.tag, t.desc + ' · ' + t.unit, detailGrid([['位号', h(t.tag)], ['描述', h(t.desc)], ['单元', h(t.unit)], ['报警数', t.count + ' 条']]) + '<div style="margin-top:12px" class="note">建议：核对该位号的报警设置（死区/延时/级别），并检查工艺是否长期在报警边界运行。</div>');
      });
    });
  }

  function renderDisposal() {
    var list = D.alarms.filter(function (a) { return state.disposal === '全部' || (state.disposal === '未闭环' ? a.status !== '已处置' : a.status === state.disposal); });
    var html = head('iAAS / 报警处置', '报警处置与闭环', '按状态筛选待处置报警；确认/处置/搁置为演示动作，不写回真实系统。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters"><select id="disposalFilter"><option>全部</option><option' + (state.disposal === '未闭环' ? ' selected' : '') + '>未闭环</option><option' + (state.disposal === '未确认' ? ' selected' : '') + '>未确认</option><option' + (state.disposal === '已确认' ? ' selected' : '') + '>已确认</option><option' + (state.disposal === '处置中' ? ' selected' : '') + '>处置中</option><option' + (state.disposal === '搁置' ? ' selected' : '') + '>搁置</option></select><span class="count">共 ' + list.length + ' 条</span></div>';
    var rows = list.map(function (a) {
      return '<tr data-alarm="' + h(a.id) + '"><td class="sub">' + h(a.time) + '</td><td>' + h(a.unit) + '</td><td class="mono">' + h(a.tag) + '</td><td>' + h(a.desc) + '</td><td>' + tag(a.priority) + '</td><td>' + tag(a.status) + '</td><td>' + h(a.operator) + '</td><td><button class="btn small" data-alarm-action="ack">确认</button> <button class="btn small" data-alarm-action="handle">处置</button></td></tr>';
    }).join('');
    html += table(['时间', '单元', '位号', '描述', '优先级', '状态', '确认人', '操作'], rows);
    var di = disposalInsight();
    html += aiCard(di.summary, di.evidence.slice(0, 3));
    return html;
  }
  function bindDisposal() {
    var f = S.qs('#disposalFilter');
    if (f) { f.addEventListener('change', function (e) { state.disposal = e.target.value; S.go('disposal'); }); }
    S.qsa('tr[data-alarm]').forEach(function (tr) { tr.addEventListener('click', function (e) { if (e.target.closest && e.target.closest('[data-alarm-action]')) { return; } showAlarm(tr.getAttribute('data-alarm')); }); });
    S.qsa('[data-alarm-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr'); var id = tr ? tr.getAttribute('data-alarm') : '';
        var a = D.alarms.filter(function (x) { return x.id === id; })[0];
        if (a) { a.status = b.getAttribute('data-alarm-action') === 'ack' ? '已确认' : '处置中'; a.operator = '张平'; }
        S.toast('<b>处置</b>：已模拟更新 ' + h(id) + '（演示环境）');
        S.go('disposal');
      });
    });
  }

  function renderAudit() {
    var list = D.auditLogs.filter(function (l) { return state.auditAction === '全部' || l.action === state.auditAction; });
    var html = head('iAAS / 报警审计', '审计追踪', '确认、处置、搁置、配置变更与停用均留痕；支持按动作筛选。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters"><select id="auditFilter"><option>全部</option><option' + (state.auditAction === '确认报警' ? ' selected' : '') + '>确认报警</option><option' + (state.auditAction === '置为处置中' ? ' selected' : '') + '>置为处置中</option><option' + (state.auditAction === '搁置报警' ? ' selected' : '') + '>搁置报警</option><option' + (state.auditAction === '修改报警配置' ? ' selected' : '') + '>修改报警配置</option><option' + (state.auditAction === '报警停用' ? ' selected' : '') + '>报警停用</option></select><span class="count">共 ' + list.length + ' 条</span></div>';
    var rows = list.map(function (l) {
      return '<tr><td class="sub">' + h(l.time) + '</td><td>' + h(l.user) + '</td><td><b>' + h(l.action) + '</b></td><td class="mono">' + h(l.target) + '</td><td class="sub">' + h(l.detail) + '</td></tr>';
    }).join('');
    html += table(['时间', '操作人', '动作', '对象', '说明'], rows);
    html += aiCard('最近 6 条审计：2 条确认、1 条处置中、1 条搁置、1 条配置修改、1 条停用。配置修改与停用需审批留痕。', ['审计 6 条', '配置变更 1', '停用 1']);
    return html;
  }
  function bindAudit() {
    var f = S.qs('#auditFilter');
    if (f) { f.addEventListener('change', function (e) { state.auditAction = e.target.value; S.go('audit'); }); }
  }


  /* ================= 扩展数据与通用工具 ================= */
  var DEVICES = D.factory.devices;
  var UNIT_MAP = {};
  var DEVICE_MAP = {};
  DEVICES.forEach(function (dev) {
    DEVICE_MAP[dev.code] = dev;
    dev.units.forEach(function (u) {
      UNIT_MAP[u.code] = {
        code: u.code, name: u.name, device: dev.code, deviceName: dev.name,
        points: u.points, shelved: u.shelved, disabled: u.disabled,
        running: u.points - u.shelved - u.disabled
      };
    });
  });

  function fmt(n) {
    if (n === null || n === undefined || isNaN(n)) { return '—'; }
    return Number(n).toLocaleString('zh-CN');
  }
  function round(n, d) {
    var p = Math.pow(10, d == null ? 2 : d);
    return Math.round(Number(n) * p) / p;
  }
  function fixed(n, d) { return round(n, d).toFixed(d == null ? 2 : d); }
  function sumBy(list, fn) {
    return list.reduce(function (a, x) { return a + (Number(fn(x)) || 0); }, 0);
  }
  function countBy(list, fn) {
    var out = {};
    list.forEach(function (x) { var k = fn(x); out[k] = (out[k] || 0) + 1; });
    return out;
  }
  function groupBy(list, fn) {
    var out = {};
    list.forEach(function (x) {
      var k = fn(x);
      if (!out[k]) { out[k] = []; }
      out[k].push(x);
    });
    return out;
  }
  function deviceName(code) { return DEVICE_MAP[code] ? DEVICE_MAP[code].name : '全部装置'; }
  function priorityColor(p) { return p === '紧急' ? '#DC2626' : (p === '重要' ? '#D97706' : '#1466E8'); }
  function statusColor(s) {
    if (s === '未确认') { return '#D97706'; }
    if (s === '已确认') { return '#1466E8'; }
    if (s === '处置中') { return '#0EA5E9'; }
    if (s === '搁置') { return '#94A3B8'; }
    return '#0B9A78';
  }
  function deviceOpts() {
    var arr = [{ v: '全部', l: '全部装置' }];
    DEVICES.forEach(function (d) { arr.push({ v: d.code, l: d.name }); });
    return arr;
  }
  function unitOpts(devCode) {
    var arr = [{ v: '全部', l: '全部单元' }];
    DEVICES.forEach(function (d) {
      if (devCode !== '全部' && d.code !== devCode) { return; }
      d.units.forEach(function (u) { arr.push({ v: u.code, l: u.code + ' · ' + u.name }); });
    });
    return arr;
  }
  function sel(id, options, value) {
    return '<select id="' + id + '">' + options.map(function (o) {
      var v = typeof o === 'string' ? o : o.v;
      var l = typeof o === 'string' ? o : o.l;
      return '<option value="' + h(v) + '"' + (String(v) === String(value) ? ' selected' : '') + '>' + h(l) + '</option>';
    }).join('') + '</select>';
  }
  function onSelect(id, page, apply) {
    var el = S.qs('#' + id);
    if (!el) { return; }
    el.addEventListener('change', function (e) { apply(e.target.value); S.go(page); });
  }
  function onSearch(id, page, apply) {
    var el = S.qs('#' + id);
    if (!el) { return; }
    el.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') { apply(e.target.value); S.go(page); }
    });
  }
  function moreBar(shown, total, key) {
    return '<div class="filters" style="margin:10px 0 0"><span class="count">显示前 ' + fmt(shown) + ' 条 · 共 ' + fmt(total) + ' 条</span><span class="spacer"></span>' +
      (shown < total ? '<button class="btn small" data-more="' + key + '">加载更多 80 条</button>' : '<span class="count">已全部显示</span>') + '</div>';
  }
  function emptyRow(cols) {
    return '<tr><td colspan="' + cols + '" class="sub" style="text-align:center;padding:18px">当前筛选无数据，请调整筛选条件</td></tr>';
  }
  function barList(items, opts) {
    opts = opts || {};
    var max = Math.max.apply(null, items.map(function (x) { return x.value; }).concat([1]));
    return '<div style="display:grid;gap:7px">' + items.map(function (x) {
      var w = Math.max(2, x.value / max * 100);
      var color = x.color || opts.color || '#1466E8';
      return '<div style="display:grid;grid-template-columns:minmax(78px,132px) minmax(60px,1fr) minmax(42px,auto);align-items:center;gap:9px">' +
        '<span style="font-size:11.5px;color:#334155;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">' + h(x.label) + '</span>' +
        '<div class="progress" style="height:7px"><span style="width:' + w + '%;background:' + color + '"></span></div>' +
        '<b style="font-size:11.5px;text-align:right;font-variant-numeric:tabular-nums">' + h(x.text || fmt(x.value)) + '</b></div>';
    }).join('') + '</div>';
  }
  function kpiGrid(items) {
    return '<div class="kpi-grid">' + items.map(function (x) {
      return kpi(x[0], x[1], x[2], x[3], x[4] || '#1466E8', x[5] || '');
    }).join('') + '</div>';
  }
  function hourBuckets(list) {
    var out = [];
    for (var i = 0; i < 24; i++) { out.push({ label: i % 2 === 0 ? i + '时' : '', value: 0 }); }
    list.forEach(function (r) {
      var hr = new Date(r.alarmMs).getHours();
      out[hr].value++;
    });
    return out;
  }

  /* ---------- 历史报警筛选 ---------- */
  function historyFiltered() {
    var lo = D.meta.last24Cutoff;
    var today = D.meta.todayStart;
    return D.history.filter(function (r) {
      if (state.hRange === '今日' && r.alarmMs < today) { return false; }
      if (state.hRange === '近24小时' && r.alarmMs < lo) { return false; }
      if (state.hDevice !== '全部' && r.device !== state.hDevice) { return false; }
      if (state.hUnit !== '全部' && r.unit !== state.hUnit) { return false; }
      if (state.hPriority !== '全部' && r.priority !== state.hPriority) { return false; }
      if (state.hType !== '全部' && r.type !== state.hType) { return false; }
      if (state.hAck !== '全部' && r.ackStatus !== state.hAck) { return false; }
      if (state.hTimeout === '确认超时' && r.ackTimeout !== '是') { return false; }
      if (state.hTimeout === '恢复超时' && !r.recoverTimeout) { return false; }
      if (state.hTimeout === '无超时' && (r.ackTimeout === '是' || r.recoverTimeout)) { return false; }
      if (state.hq && (r.id + r.tag + r.name + r.unit + r.content).toLowerCase().indexOf(state.hq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function timeoutTypeOf(r) {
    if (r.ackTimeout === '是' && r.recoverTimeout) { return '确认超时 + 恢复超时'; }
    if (r.ackTimeout === '是') { return '确认超时'; }
    return '恢复超时';
  }
  function timeoutMinutes(r) {
    var a = r.ackTimeout === '是' ? Math.max(1, (r.delayMin || 0) - 5) : 0;
    var b = r.recoverTimeout ? (r.status === '已处置' ? (r.durationMin || 0) : (r.ageMin || 0)) : 0;
    return Math.max(a, b);
  }
  function timeoutFiltered() {
    return D.history.filter(function (r) {
      if (r.ackTimeout !== '是' && !r.recoverTimeout) { return false; }
      if (state.tType === '确认超时' && r.ackTimeout !== '是') { return false; }
      if (state.tType === '恢复超时' && !r.recoverTimeout) { return false; }
      if (state.tDevice !== '全部' && r.device !== state.tDevice) { return false; }
      if (state.tPriority !== '全部' && r.priority !== state.tPriority) { return false; }
      if (state.tState !== '全部' && r.timeoutState !== state.tState) { return false; }
      if (state.tq && (r.id + r.tag + r.name + r.unit).toLowerCase().indexOf(state.tq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function disposalFiltered() {
    return D.history.filter(function (r) {
      if (r.status !== '已处置' && r.status !== '处置中') { return false; }
      var ds = r.status === '已处置' ? '已闭环' : '处置中';
      if (state.dStatus !== '全部' && ds !== state.dStatus) { return false; }
      if (state.dDevice !== '全部' && r.device !== state.dDevice) { return false; }
      if (state.dPriority !== '全部' && r.priority !== state.dPriority) { return false; }
      if (state.dMethod !== '全部' && r.method !== state.dMethod) { return false; }
      if (state.dq && (r.workOrder + r.tag + r.name + r.id).toLowerCase().indexOf(state.dq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function interlockFiltered() {
    return D.interlocks.filter(function (x) {
      if (state.iDevice !== '全部' && x.device !== state.iDevice) { return false; }
      if (state.iType !== '全部' && x.type !== state.iType) { return false; }
      if (state.iStatus !== '全部' && x.status !== state.iStatus) { return false; }
      if (state.iLevel !== '全部' && x.level !== state.iLevel) { return false; }
      if (state.iq && (x.id + x.name + x.unit + x.deviceName).toLowerCase().indexOf(state.iq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }
  function loopFiltered() {
    return D.loops.filter(function (x) {
      if (state.aDevice !== '全部' && x.device !== state.aDevice) { return false; }
      if (state.aMode !== '全部' && x.mode !== state.aMode) { return false; }
      if (state.aStatus !== '全部' && x.status !== state.aStatus) { return false; }
      if (state.aq && (x.id + x.tag + x.name + x.unit).toLowerCase().indexOf(state.aq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }

  /* ---------- 分类报警统计 ---------- */
  function categoryData() {
    var orderP = ['紧急', '重要', '一般'];
    var orderS = ['未确认', '已确认', '处置中', '搁置', '已处置'];
    var combos = [];
    var priorities = [];
    var statusRows = [];
    var types = [];
    var devices = [];
    var total = 0;
    var unitCount = 0;
    var scope = state.cScope;
    if (scope === '当前报警') {
      total = D.kpi.alarms;
      combos = D.categoryCurrent.combos.map(function (x) { return { priority: x.priority, status: x.status, count: x.count }; });
      priorities = D.priority.map(function (x) { return { label: x.label, value: x.value, color: x.color }; });
      types = D.categoryCurrent.types.map(function (x) { return { label: x.label, value: x.value, color: x.color }; });
      orderS.forEach(function (s) {
        statusRows.push({ label: s, value: sumBy(combos.filter(function (x) { return x.status === s; }), function (x) { return x.count; }), color: statusColor(s) });
      });
      devices = D.devicePerf.map(function (d) { return { code: d.code, label: d.name, value: d.alarms, share: d.share }; });
      unitCount = D.units.filter(function (u) { return u.value > 0; }).length;
    } else {
      total = D.history.length;
      var pc = countBy(D.history, function (r) { return r.priority; });
      var sc = countBy(D.history, function (r) { return r.status; });
      var tc = countBy(D.history, function (r) { return r.type; });
      var dc = countBy(D.history, function (r) { return r.device; });
      var uc = countBy(D.history, function (r) { return r.unit; });
      var cross = {};
      D.history.forEach(function (r) { cross[r.priority + '|' + r.status] = (cross[r.priority + '|' + r.status] || 0) + 1; });
      orderP.forEach(function (p) {
        orderS.forEach(function (s) {
          combos.push({ priority: p, status: s, count: cross[p + '|' + s] || 0 });
        });
      });
      orderP.forEach(function (p) { priorities.push({ label: p, value: pc[p] || 0, color: priorityColor(p) }); });
      orderS.forEach(function (s) { statusRows.push({ label: s, value: sc[s] || 0, color: statusColor(s) }); });
      var typeColors = { '过程': '#1466E8', '设备': '#0EA5E9', '安全': '#D97706' };
      ['过程', '设备', '安全'].forEach(function (t) { types.push({ label: t, value: tc[t] || 0, color: typeColors[t] }); });
      devices = D.devicePerf.map(function (d) {
        var n = dc[d.code] || 0;
        return { code: d.code, label: d.name, value: n, share: round(n / total * 100, 1) };
      });
      unitCount = Object.keys(uc).length;
    }
    var unconfirmed = sumBy(combos.filter(function (x) { return x.status === '未确认'; }), function (x) { return x.count; });
    var emergency = sumBy(combos.filter(function (x) { return x.priority === '紧急'; }), function (x) { return x.count; });
    var highUnconfirmed = sumBy(combos.filter(function (x) { return (x.priority === '紧急' || x.priority === '重要') && x.status === '未确认'; }), function (x) { return x.count; });
    var closed = sumBy(combos.filter(function (x) { return x.status === '已处置'; }), function (x) { return x.count; });
    return {
      scope: scope, total: total, combos: combos, priorities: priorities, statusRows: statusRows,
      types: types, devices: devices, unitCount: unitCount, unconfirmed: unconfirmed,
      emergency: emergency, highUnconfirmed: highUnconfirmed, closed: closed,
      closeRate: total ? round(closed / total * 100, 2) : 0
    };
  }

  /* ---------- 绩效 KPI 计算 ---------- */
  function perfView() {
    var dev = state.pDevice === '全部' ? null : D.devicePerf.filter(function (x) { return x.code === state.pDevice; })[0];
    var pf = D.periods[state.pPeriod] || D.periods['月'];
    var rows = D.isaKpi.map(function (k) {
      var base = dev ? dev[k.key] : k.value;
      var v = k.cat === 'count' ? round(base * pf.count, 1) : round(base + (pf.delta[k.key] || 0), 2);
      var ok = k.ops === 'min' ? v >= k.target : v <= k.target;
      var gap = k.ops === 'min' ? k.target - v : v - k.target;
      var mul = k.target > 0 ? v / k.target : 0;
      return { key: k.key, label: k.label, cat: k.cat, unit: k.unit, dec: k.dec, value: v, target: k.target, ops: k.ops, ok: ok, gap: gap, mul: mul, note: k.note, delta: k.delta };
    });
    var rates = D.rates.map(function (r) {
      var base = dev ? dev[r.key] : r.value;
      var v = round(base + (pf.delta[r.key] || 0), 2);
      var ok = r.ops === 'min' ? v >= r.target : v <= r.target;
      return { key: r.key, label: r.label, value: v, target: r.target, ops: r.ops, ok: ok, note: r.note };
    });
    var perf8 = D.perf8.map(function (p, idx) {
      if (!dev) { return { label: p.label, value: p.value, target: p.target, ok: p.ok }; }
      var cfg = [
        { v: dev.hourAvg, target: 6, ops: 'max', text: dev.hourAvg + ' 次/时' },
        { v: dev.onTime, target: 95, ops: 'min', text: fixed(dev.onTime, 2) + '%' },
        { v: dev.recover, target: 98, ops: 'min', text: fixed(dev.recover, 2) + '%' },
        { v: dev.ticket, target: 90, ops: 'min', text: fixed(dev.ticket, 2) + '%' },
        { v: dev.safetyInterlock, target: 98, ops: 'min', text: fixed(dev.safetyInterlock, 2) + '%' },
        { v: dev.prodInterlock, target: 95, ops: 'min', text: fixed(dev.prodInterlock, 2) + '%' },
        { v: dev.stability, target: 90, ops: 'min', text: fixed(dev.stability, 2) + '%' },
        { v: dev.quality, target: 99, ops: 'min', text: fixed(dev.quality, 2) + '%' }
      ][idx];
      var ok = cfg.ops === 'min' ? cfg.v >= cfg.target : cfg.v <= cfg.target;
      var targetText = idx === 0 ? '≤6' : ('≥' + cfg.target + '%');
      return { label: p.label, value: cfg.text, target: targetText, ok: ok };
    });
    var worst = rows.slice().sort(function (a, b) { return b.mul - a.mul; }).slice(0, 5);
    var okCount = rows.filter(function (x) { return x.ok; }).length;
    return { dev: dev, period: state.pPeriod, rows: rows, rates: rates, perf8: perf8, worst: worst, okCount: okCount, failCount: rows.length - okCount };
  }
  function perfTrend() {
    var dev = state.pDevice === '全部' ? null : D.devicePerf.filter(function (x) { return x.code === state.pDevice; })[0];
    var scale = dev ? dev.hourAvg / 88 : 1;
    var labels = [];
    var values = [];
    var i;
    if (state.pPeriod === '日') {
      for (i = 0; i < 24; i++) { labels.push(i % 3 === 0 ? i + '时' : ''); values.push(D.trend[i]); }
    } else if (state.pPeriod === '周') {
      labels = ['10-21', '10-22', '10-23', '10-24', '10-25', '10-26', '10-27'];
      values = [92, 90, 91, 89, 90, 88, 88];
    } else if (state.pPeriod === '月') {
      labels = ['第1周', '第2周', '第3周', '第4周'];
      values = [96, 94, 91, 88];
    } else {
      labels = ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'];
      values = [98, 96, 95, 94, 93, 92, 91, 90, 89, 89, 88, 88];
    }
    return { labels: labels, values: values.map(function (v) { return round(v * scale, 0); }) };
  }

  /* ---------- 配置 / 工厂模型 ---------- */
  function unitRows() {
    var rows = [];
    DEVICES.forEach(function (dev) {
      if (state.fDevice !== '全部' && dev.code !== state.fDevice) { return; }
      dev.units.forEach(function (u) {
        var cfgs = D.alarmConfigs.filter(function (c) { return c.unit === u.code; });
        rows.push({
          code: u.code, name: u.name, device: dev.code, deviceName: dev.name,
          points: u.points, shelved: u.shelved, disabled: u.disabled,
          running: u.points - u.shelved - u.disabled, configs: cfgs.length
        });
      });
    });
    return rows;
  }
  function configFiltered() {
    return D.alarmConfigs.filter(function (c) {
      if (state.fDevice !== '全部' && c.device !== state.fDevice) { return false; }
      if (state.fEnable !== '全部' && c.enabled !== state.fEnable) { return false; }
      if (state.fApprove !== '全部' && c.approval !== state.fApprove) { return false; }
      if (state.fq && (c.tag + c.name + c.unit + c.id).toLowerCase().indexOf(state.fq.toLowerCase()) < 0) { return false; }
      return true;
    });
  }

  /* ================= 历史报警 ================= */
  function historyInsight() {
    var list = historyFiltered();
    var un = list.filter(function (r) { return r.ackStatus === '未确认'; }).length;
    var late = list.filter(function (r) { return r.ackTimeout === '是'; }).length;
    var rto = list.filter(function (r) { return r.recoverTimeout; }).length;
    var pending = list.filter(function (r) { return r.timeoutState === '待处理'; }).length;
    var em = list.filter(function (r) { return r.priority === '紧急'; }).length;
    var emUn = list.filter(function (r) { return r.priority === '紧急' && r.ackStatus === '未确认'; }).length;
    var pr = countBy(list, function (r) { return r.priority; });
    var devc = countBy(list, function (r) { return r.device; });
    var devKeys = Object.keys(devc).sort(function (a, b) { return devc[b] - devc[a]; });
    var unitc = countBy(list, function (r) { return r.unit; });
    var unitKeys = Object.keys(unitc).sort(function (a, b) { return unitc[b] - unitc[a]; });
    var tagc = countBy(list, function (r) { return r.tag; });
    var tagKeys = Object.keys(tagc).sort(function (a, b) { return tagc[b] - tagc[a]; });
    var topTag = tagKeys[0] || '—';
    var topTagN = tagc[topTag] || 0;
    var topTagPct = list.length ? topTagN / list.length * 100 : 0;
    var topUnit = unitKeys[0] || '—';
    var topUnitN = unitc[topUnit] || 0;
    var devText = devKeys.slice(0, 3).map(function (k) {
      return deviceName(k) + ' ' + fmt(devc[k]) + ' 条（' + fixed(devc[k] / list.length * 100, 1) + '%）';
    }).join('、');
    var basis = state.hRange + ' · ' + (state.hDevice === '全部' ? '全部装置' : deviceName(state.hDevice)) + ' · ' + state.hPriority + ' · ' + state.hType;
    var findings = list.length ? [
      '装置分布：' + (devText || '—') + '；覆盖 ' + Object.keys(unitc).length + ' 个单元。',
      '级别结构：紧急 ' + fmt(pr['紧急'] || 0) + ' 条、重要 ' + fmt(pr['重要'] || 0) + ' 条、一般 ' + fmt(pr['一般'] || 0) + ' 条；未确认 ' + fmt(un) + ' 条，其中紧急未确认 ' + fmt(emUn) + ' 条。',
      '超时结构：确认超时 ' + fmt(late) + ' 条、恢复超时 ' + fmt(rto) + ' 条，其中待处理 ' + fmt(pending) + ' 条；TOP1 位号 ' + topTag + ' 占 ' + fixed(topTagPct, 1) + '%。'
    ] : ['当前筛选无历史记录；可放宽时间范围或清空筛选。', '近 48 小时记录共 ' + fmt(D.meta.total) + ' 条，可切换“近48小时”。', '确认超时与恢复超时来自同一份报警记录，口径一致。'];
    var actions = list.length ? [
      '优先清理 ' + topUnit + ' 的 ' + fmt(un) + ' 条未确认报警，紧急报警先确认再处置。',
      '对 ' + fmt(rto) + ' 条恢复超时记录发起工单升级，重点核对仪表与工艺原因。',
      '锁定 TOP 位号 ' + topTag + '（' + fmt(topTagN) + ' 条），复核死区、延时与报警级别设置。'
    ] : ['放宽时间范围到近 48 小时。', '清空装置/级别/超时筛选后再看。', '到实时报警页查看当前未确认报警。'];
    return {
      time: nowShort(), basis: '历史报警 · ' + basis,
      summary: '当前筛选 <b>' + fmt(list.length) + ' 条</b>报警，未确认 <b>' + fmt(un) + '</b> 条、紧急 <b>' + fmt(em) + '</b> 条；确认超时 <b>' + fmt(late) + '</b> 条、恢复超时 <b>' + fmt(rto) + '</b> 条，TOP1 位号 <b>' + topTag + '</b> 占 <b>' + fixed(topTagPct, 1) + '%</b>。',
      findings: findings,
      actions: actions,
      evidence: ['筛选 ' + fmt(list.length) + ' 条', '未确认 ' + fmt(un), '确认超时 ' + fmt(late), '恢复超时 ' + fmt(rto)]
    };
  }

  function renderHistory() {
    var list = historyFiltered();
    var shown = list.slice(0, state.hLimit);
    var un = list.filter(function (r) { return r.ackStatus === '未确认'; }).length;
    var late = list.filter(function (r) { return r.ackTimeout === '是'; }).length;
    var rto = list.filter(function (r) { return r.recoverTimeout; }).length;
    var em = list.filter(function (r) { return r.priority === '紧急'; }).length;
    var recovered = list.filter(function (r) { return r.status === '已处置'; }).length;
    var recRate = list.length ? recovered / list.length * 100 : 0;
    var html = head('iAAS / 报警监控', '历史报警', '近 48 小时 ' + fmt(D.meta.total) + ' 条报警记录 · 13 个实时字段 · 支持时间/装置/单元/级别/类型/确认状态/确认超时多维筛选与列表-卡片双模式。', '<button class="btn" data-action="export-history">导出记录</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('历史记录', fmt(list.length), '条', '区间 ' + D.meta.rangeText, '#1466E8');
    html += kpi('未确认', fmt(un), '条', '确认状态=未确认', '#D97706');
    html += kpi('紧急报警', fmt(em), '条', '当前筛选口径', '#DC2626');
    html += kpi('确认超时', fmt(late), '条', '超过 5 分钟确认', '#D97706');
    html += kpi('恢复超时', fmt(rto), '条', '超过 120 分钟恢复', '#DC2626');
    html += kpi('已恢复', fmt(recovered), '条', '占筛选记录 ' + fixed(recRate, 2) + '%', '#0B9A78');
    html += '</div>';
    html += '<div class="filters">';
    html += sel('hRange', ['今日', '近24小时', '近48小时'], state.hRange);
    html += sel('hDevice', deviceOpts(), state.hDevice);
    html += sel('hUnit', unitOpts(state.hDevice), state.hUnit);
    html += sel('hPriority', ['全部', '紧急', '重要', '一般'], state.hPriority);
    html += sel('hType', ['全部', '过程', '设备', '安全'], state.hType);
    html += sel('hAck', ['全部', '未确认', '已确认'], state.hAck);
    html += sel('hTimeout', ['全部', '确认超时', '恢复超时', '无超时'], state.hTimeout);
    html += '<input id="hSearch" placeholder="位号 / 名称 / 编号" value="' + h(state.hq) + '">';
    html += '<span class="spacer"></span>';
    html += '<button class="btn small' + (state.hMode === '列表' ? ' primary' : '') + '" data-hview="列表">列表</button>';
    html += '<button class="btn small' + (state.hMode === '卡片' ? ' primary' : '') + '" data-hview="卡片">卡片</button>';
    html += '<span class="count">共 ' + fmt(list.length) + ' 条</span>';
    html += '</div>';
    var pRows = D.priority.map(function (x) {
      return { label: x.label, value: list.filter(function (r) { return r.priority === x.label; }).length, color: x.color };
    });
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>报警时段分布</h3><span>按小时 · 筛选累计</span></div><div class="chart">' + S.chart.bars(hourBuckets(list), { height: 220, color: '#1466E8', target: 30 }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>报警数</span><span><i style="background:#F59E0B"></i>目标 30</span></div></div>';
    html += '<div class="card"><div class="card-h"><h3>级别分布</h3><span>共 ' + fmt(list.length) + ' 条</span></div>' + S.chart.donut(pRows, fmt(list.length), '筛选结果') + '</div>';
    html += '</div>';
    if (state.hMode === '卡片') {
      html += '<div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:10px;margin-bottom:12px">';
      shown.forEach(function (r) {
        html += '<div class="card" data-history="' + h(r.id) + '" style="padding:13px;cursor:pointer;border-top:3px solid ' + priorityColor(r.priority) + ';min-width:0">';
        html += '<div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><span class="mono" style="font-weight:700">' + h(r.tag) + '</span>' + tag(r.priority) + '</div>';
        html += '<div style="font-size:12px;color:#334155;margin-top:4px">' + h(r.name) + ' · ' + h(r.unit) + '</div>';
        html += '<div style="display:flex;align-items:baseline;gap:6px;margin-top:7px;flex-wrap:wrap"><b style="font-size:18px;color:#DC2626">' + h(r.valueText) + '</b><span class="sub">' + h(r.uom) + ' · 阈值 ' + h(r.thresholdText) + ' ' + h(r.uom) + '</span></div>';
        html += '<div class="sub" style="margin-top:6px">' + h(r.timeText) + ' · ' + h(r.maxState) + ' · ' + h(r.type) + '</div>';
        html += '<div style="display:flex;align-items:center;gap:6px;margin-top:8px;flex-wrap:wrap">' + tag(r.ackStatus) + (r.ackTimeout === '是' ? '<span class="tag amber">确认超时</span>' : '') + (r.recoverTimeout ? '<span class="tag red">恢复超时</span>' : '') + '</div>';
        html += '</div>';
      });
      html += '</div>';
    } else {
      var rows = shown.map(function (r) {
        return '<tr data-history="' + h(r.id) + '"><td class="sub">' + h(r.timeText) + '</td><td><b>' + h(r.unit) + '</b></td><td class="mono">' + h(r.tag) + '</td><td>' + h(r.name) + '</td><td class="mono">' + h(r.thresholdText) + '</td><td><b style="color:#DC2626">' + h(r.valueText) + '</b></td><td>' + h(r.uom) + '</td><td>' + h(r.content) + '</td><td>' + h(r.maxState) + '</td><td>' + tag(r.priority) + '</td><td class="sub">' + h(r.ackTimeText) + '</td><td class="sub">' + h(r.recoverTimeText) + '</td><td>' + tag(r.ackStatus) + '</td><td>' + (r.ackTimeout === '是' ? '<span class="tag amber">是</span>' : '<span class="sub">否</span>') + '</td></tr>';
      }).join('');
      html += table(['报警时间', '单元', '位号', '名称', '阈值', '触发值', '单位', '报警内容', '最高状态', '级别', '确认时间', '恢复时间', '确认状态', '确认超时'], rows || emptyRow(14), 1180);
    }
    html += moreBar(shown.length, list.length, 'history');
    var ins = historyInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindHistory() {
    onSelect('hRange', 'history', function (v) { state.hRange = v; state.hLimit = 80; });
    onSelect('hDevice', 'history', function (v) { state.hDevice = v; state.hUnit = '全部'; state.hLimit = 80; });
    onSelect('hUnit', 'history', function (v) { state.hUnit = v; state.hLimit = 80; });
    onSelect('hPriority', 'history', function (v) { state.hPriority = v; state.hLimit = 80; });
    onSelect('hType', 'history', function (v) { state.hType = v; state.hLimit = 80; });
    onSelect('hAck', 'history', function (v) { state.hAck = v; state.hLimit = 80; });
    onSelect('hTimeout', 'history', function (v) { state.hTimeout = v; state.hLimit = 80; });
    onSearch('hSearch', 'history', function (v) { state.hq = v; state.hLimit = 80; });
    S.qsa('[data-hview]').forEach(function (b) {
      b.addEventListener('click', function () { state.hMode = b.getAttribute('data-hview'); S.go('history'); });
    });
    S.qsa('[data-history]').forEach(function (el) {
      el.addEventListener('click', function () { showHistoryDetail(el.getAttribute('data-history')); });
    });
    var more = S.qs('[data-more="history"]');
    if (more) { more.addEventListener('click', function () { state.hLimit += 80; S.go('history'); }); }
    var exp = S.qs('[data-action="export-history"]');
    if (exp) { exp.addEventListener('click', function () { S.toast('<b>导出</b>：已生成 ' + h(fmt(historyFiltered().length)) + ' 条历史报警 CSV（演示）'); }); }
  }
  function alarmTimeline(r) {
    var steps = [
      { t: r.timeText, b: '报警触发', s: r.content + ' · ' + r.valueText + ' ' + r.uom, done: true },
      { t: r.ackTimeText, b: r.ackStatus === '未确认' ? '等待确认' : '报警确认', s: r.ackStatus === '未确认' ? '尚未确认，确认时限 5 分钟' : r.confirmPerson + (r.ackTimeout === '是' ? ' · 确认超时' : ' · 及时确认'), done: r.ackStatus !== '未确认' },
      { t: r.disposeTimeText, b: r.method ? '处置执行' : '等待处置', s: r.method ? r.method + ' · ' + r.disposeBy : '尚未生成处置记录', done: !!r.method },
      { t: r.recoverTimeText, b: r.recoverTimeText === '—' ? '尚未恢复' : '报警恢复', s: r.recoverTimeText === '—' ? '持续 ' + fmt(r.ageMin) + ' 分钟' : (r.workOrder || '—'), done: r.recoverTimeText !== '—' }
    ];
    return '<div class="card-h" style="margin-top:14px"><h3>报警全生命周期</h3><span>' + h(r.unit) + '</span></div><div class="timeline">' + steps.map(function (x) {
      return '<div class="tl-item ' + (x.done ? 'done' : 'active') + '"><span class="tl-dot"></span><div class="tl-body"><b>' + h(x.b) + '</b><span>' + h(x.t) + ' · ' + h(x.s) + '</span></div></div>';
    }).join('') + '</div>';
  }
  function historySuggestion(r) {
    if (r.priority === '紧急' && r.ackStatus === '未确认') { return '紧急未确认：立即确认并通知当班，核对联锁与现场状态；超过 5 分钟自动计入确认超时。'; }
    if (r.recoverTimeout) { return '恢复超时：已超过 120 分钟恢复时限，建议升级工单并核实工艺、仪表或联锁原因，必要时申请临时处置授权。'; }
    if (r.ackTimeout === '是') { return '确认超时：该报警确认时间超过 5 分钟，建议复盘班组响应与推送链路。'; }
    return '按报警级别确认与处置；先核对现场和工艺参数，再决定处置、搁置或转工单。';
  }
  function showHistoryDetail(id) {
    var r = D.history.filter(function (x) { return x.id === id; })[0];
    if (!r) { return; }
    var body = detailGrid([
      ['报警编号', h(r.id)], ['位号', h(r.tag)], ['名称', h(r.name)], ['装置 / 单元', h(deviceName(r.device)) + ' / ' + h(r.unit)],
      ['报警类型', h(r.type)], ['级别', tag(r.priority)], ['阈值', h(r.thresholdText) + ' ' + h(r.uom)], ['触发值', '<b style="color:#DC2626">' + h(r.valueText) + ' ' + h(r.uom) + '</b>'],
      ['报警内容', h(r.content)], ['最高状态', h(r.maxState)], ['报警时间', h(r.timeText)], ['确认时间', h(r.ackTimeText)],
      ['恢复时间', h(r.recoverTimeText)], ['确认状态', tag(r.ackStatus)], ['确认超时', r.ackTimeout === '是' ? '<span class="tag amber">是</span>' : '<span class="sub">否</span>'], ['恢复超时', r.recoverTimeout ? '<span class="tag red">是</span>' : '<span class="sub">否</span>'],
      ['确认人', h(r.confirmPerson)], ['处置人 / 方式', h(r.disposeBy || '—') + ' / ' + h(r.method || '—')],
      ['工单 / 结果', h(r.workOrder || '—') + ' / ' + h(r.result || '—')], ['持续 / 超时', fmt(r.ageMin) + ' 分钟 / ' + (r.recoverTimeout || r.ackTimeout === '是' ? '超时' : '正常')]
    ]);
    body += alarmTimeline(r);
    body += '<div class="note" style="margin-top:12px">' + h(historySuggestion(r)) + '</div>';
    S.detail('历史报警 · ' + r.id, r.unit + ' · ' + r.tag, body);
  }

  /* ================= 超时报警 ================= */
  function timeoutBuckets(list) {
    var labels = ['≤30 min', '30–60 min', '1–2 h', '2–4 h', '>4 h'];
    var vals = [0, 0, 0, 0, 0];
    list.forEach(function (r) {
      var m = timeoutMinutes(r);
      if (m <= 30) { vals[0]++; }
      else if (m <= 60) { vals[1]++; }
      else if (m <= 120) { vals[2]++; }
      else if (m <= 240) { vals[3]++; }
      else { vals[4]++; }
    });
    return labels.map(function (l, i) { return { label: l, value: vals[i] }; });
  }
  function timeoutInsight() {
    var list = timeoutFiltered();
    var confirmN = list.filter(function (r) { return r.ackTimeout === '是'; }).length;
    var recoverN = list.filter(function (r) { return r.recoverTimeout; }).length;
    var bothN = list.filter(function (r) { return r.ackTimeout === '是' && r.recoverTimeout; }).length;
    var pending = list.filter(function (r) { return r.timeoutState === '待处理'; }).length;
    var mins = list.map(timeoutMinutes);
    var avg = mins.length ? sumBy(mins, function (x) { return x; }) / mins.length : 0;
    var max = mins.length ? Math.max.apply(null, mins) : 0;
    var devc = countBy(list, function (r) { return r.device; });
    var devKeys = Object.keys(devc).sort(function (a, b) { return devc[b] - devc[a]; });
    var topDev = devKeys[0] || '—';
    var topDevN = devc[topDev] || 0;
    var tagc = countBy(list, function (r) { return r.tag; });
    var tagKeys = Object.keys(tagc).sort(function (a, b) { return tagc[b] - tagc[a]; });
    var topTag = tagKeys[0] || '—';
    var basis = (state.tType === '全部' ? '全部超时' : state.tType) + ' · ' + (state.tDevice === '全部' ? '全部装置' : deviceName(state.tDevice)) + ' · ' + state.tState;
    var findings = list.length ? [
      '类型结构：确认超时 ' + fmt(confirmN) + ' 条、恢复超时 ' + fmt(recoverN) + ' 条，其中两者叠加 ' + fmt(bothN) + ' 条；确认时限 5 分钟、恢复时限 120 分钟。',
      '处理进度：待处理 ' + fmt(pending) + ' 条、已处理 ' + fmt(list.length - pending) + ' 条；' + deviceName(topDev) + ' 超时最多（' + fmt(topDevN) + ' 条）。',
      '时长分布：平均 ' + fmt(round(avg, 0)) + ' 分钟、最长 ' + fmt(max) + ' 分钟；TOP 位号 ' + topTag + ' 出现 ' + fmt(tagc[topTag] || 0) + ' 次。'
    ] : ['当前筛选无超时记录；可切换“全部”类型或放宽装置/级别。', '确认超时时限 5 分钟、恢复时限 120 分钟。', '可回到历史报警页按“确认超时/恢复超时”筛查。'];
    var actions = list.length ? [
      '先催办 ' + deviceName(topDev) + ' 的 ' + fmt(pending) + ' 条待处理超时记录，明确责任人与计划恢复时间。',
      '对确认超时 ' + fmt(confirmN) + ' 条复盘推送链路与班组响应，避免重复超时。',
      '对恢复超时 ' + fmt(recoverN) + ' 条核实工艺/仪表根因，确需长期处理的转工单管理。'
    ] : ['切换超时类型查看其他记录。', '放宽装置与级别筛选。', '检查是否已全部处理完毕。'];
    return {
      time: nowShort(), basis: '超时报警 · ' + basis,
      summary: '当前筛选 <b>' + fmt(list.length) + ' 条</b>超时记录：确认超时 <b>' + fmt(confirmN) + '</b> 条、恢复超时 <b>' + fmt(recoverN) + '</b> 条；待处理 <b>' + fmt(pending) + '</b> 条，平均超时 <b>' + fmt(round(avg, 0)) + ' 分钟</b>。',
      findings: findings,
      actions: actions,
      evidence: ['超时 ' + fmt(list.length), '确认超时 ' + fmt(confirmN), '恢复超时 ' + fmt(recoverN), '待处理 ' + fmt(pending)]
    };
  }
  function renderTimeout() {
    var list = timeoutFiltered();
    var shown = list.slice(0, state.tLimit);
    var confirmN = list.filter(function (r) { return r.ackTimeout === '是'; }).length;
    var recoverN = list.filter(function (r) { return r.recoverTimeout; }).length;
    var pending = list.filter(function (r) { return r.timeoutState === '待处理'; }).length;
    var mins = list.map(timeoutMinutes);
    var avg = mins.length ? sumBy(mins, function (x) { return x; }) / mins.length : 0;
    var max = mins.length ? Math.max.apply(null, mins) : 0;
    var devRows = [];
    DEVICES.forEach(function (d) {
      var n = list.filter(function (r) { return r.device === d.code; }).length;
      devRows.push({ label: d.name, value: n });
    });
    devRows.sort(function (a, b) { return b.value - a.value; });
    var html = head('iAAS / 报警监控', '超时报警', '确认超时（>5 分钟未确认）与恢复超时（>120 分钟未恢复）统一跟踪；支持按类型/装置/级别/处理状态筛选与催办。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('超时记录', fmt(list.length), '条', '占全部记录 ' + fixed(list.length / D.meta.total * 100, 2) + '%', '#DC2626');
    html += kpi('确认超时', fmt(confirmN), '条', '确认时限 5 分钟', '#D97706');
    html += kpi('恢复超时', fmt(recoverN), '条', '恢复时限 120 分钟', '#DC2626');
    html += kpi('待处理', fmt(pending), '条', '超时且未闭环', '#D97706');
    html += kpi('平均超时', fmt(round(avg, 0)), 'min', '当前筛选口径', '#1466E8');
    html += kpi('最长超时', fmt(max), 'min', 'TOP1 记录', '#6D28D9');
    html += '</div>';
    html += '<div class="filters">';
    html += sel('tType', ['全部', '确认超时', '恢复超时'], state.tType);
    html += sel('tDevice', deviceOpts(), state.tDevice);
    html += sel('tPriority', ['全部', '紧急', '重要', '一般'], state.tPriority);
    html += sel('tState', ['全部', '待处理', '已处理'], state.tState);
    html += '<input id="tSearch" placeholder="位号 / 名称 / 编号" value="' + h(state.tq) + '">';
    html += '<span class="spacer"></span><span class="count">共 ' + fmt(list.length) + ' 条 · 显示前 ' + fmt(shown.length) + ' 条</span>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>按装置超时分布</h3><span>当前筛选</span></div>' + barList(devRows, { color: '#DC2626' }) + '</div>';
    html += '<div class="card"><div class="card-h"><h3>超时时长分布</h3><span>分钟</span></div><div class="chart">' + S.chart.bars(timeoutBuckets(list), { height: 210, color: '#D97706' }) + '</div></div>';
    html += '</div>';
    var rows = shown.map(function (r) {
      var tmin = timeoutMinutes(r);
      return '<tr data-timeout="' + h(r.id) + '"><td class="sub">' + h(r.timeText) + '</td><td class="mono">' + h(r.tag) + '</td><td>' + h(r.name) + '</td><td><b>' + h(r.unit) + '</b></td><td>' + tag(r.priority) + '</td><td class="mono">' + h(r.thresholdText) + '</td><td><b style="color:#DC2626">' + h(r.valueText) + '</b></td><td>' + h(r.uom) + '</td><td><span class="tag ' + (r.ackTimeout === '是' ? 'amber' : 'red') + '">' + h(timeoutTypeOf(r)) + '</span></td><td><b>' + fmt(tmin) + ' min</b></td><td>' + tag(r.ackStatus) + '</td><td>' + tag(r.timeoutState) + '</td><td>' + (r.timeoutState === '待处理' ? '<button class="btn small" data-timeout-action="urge">催办</button> ' : '') + '<button class="btn small" data-timeout-action="detail">详情</button></td></tr>';
    }).join('');
    html += table(['报警时间', '位号', '名称', '单元', '级别', '阈值', '触发值', '单位', '超时类型', '超时时长', '确认状态', '处理状态', '操作'], rows || emptyRow(13), 1180);
    html += moreBar(shown.length, list.length, 'timeout');
    var ins = timeoutInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindTimeout() {
    onSelect('tType', 'timeout', function (v) { state.tType = v; state.tLimit = 80; });
    onSelect('tDevice', 'timeout', function (v) { state.tDevice = v; state.tLimit = 80; });
    onSelect('tPriority', 'timeout', function (v) { state.tPriority = v; state.tLimit = 80; });
    onSelect('tState', 'timeout', function (v) { state.tState = v; state.tLimit = 80; });
    onSearch('tSearch', 'timeout', function (v) { state.tq = v; state.tLimit = 80; });
    S.qsa('tr[data-timeout]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-timeout-action]')) { return; }
        showTimeoutDetail(tr.getAttribute('data-timeout'));
      });
    });
    S.qsa('[data-timeout-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-timeout') : '';
        if (b.getAttribute('data-timeout-action') === 'detail') { showTimeoutDetail(id); return; }
        var r = D.history.filter(function (x) { return x.id === id; })[0];
        S.toast('<b>催办</b>：已向 ' + h(r ? r.unit : '责任单元') + ' 发送超时催办（演示）');
      });
    });
    var more = S.qs('[data-more="timeout"]');
    if (more) { more.addEventListener('click', function () { state.tLimit += 80; S.go('timeout'); }); }
  }
  function showTimeoutDetail(id) {
    var r = D.history.filter(function (x) { return x.id === id; })[0];
    if (!r) { return; }
    var body = detailGrid([
      ['报警编号', h(r.id)], ['位号', h(r.tag)], ['名称', h(r.name)], ['装置 / 单元', h(deviceName(r.device)) + ' / ' + h(r.unit)],
      ['阈值', h(r.thresholdText) + ' ' + h(r.uom)], ['触发值', '<b style="color:#DC2626">' + h(r.valueText) + ' ' + h(r.uom) + '</b>'], ['报警内容', h(r.content)], ['最高状态', h(r.maxState)],
      ['级别', tag(r.priority)], ['报警时间', h(r.timeText)], ['确认时间', h(r.ackTimeText)], ['恢复时间', h(r.recoverTimeText)],
      ['确认状态', tag(r.ackStatus)], ['确认超时', r.ackTimeout === '是' ? '<span class="tag amber">是</span>' : '<span class="sub">否</span>'], ['超时类型', h(timeoutTypeOf(r))], ['超时时长', '<b>' + fmt(timeoutMinutes(r)) + ' 分钟</b>'],
      ['处理状态', tag(r.timeoutState)], ['责任单元', h(r.unit)], ['确认人', h(r.confirmPerson)], ['工单', h(r.workOrder || '—')]
    ]);
    body += alarmTimeline(r);
    var tip = r.timeoutState === '待处理' ? '该记录仍待处理：建议立即催办责任单元，明确恢复计划并记录处置动作；恢复后补录恢复时间。' : '该记录已处理：建议复盘超时原因，确认是否需要调整确认时限、推送策略或报警设置。';
    body += '<div class="note" style="margin-top:12px">' + h(tip) + '</div>';
    S.detail('超时报警 · ' + r.id, r.unit + ' · ' + r.tag + ' · ' + timeoutTypeOf(r), body);
  }

  /* ================= 分类报警 ================= */
  function categoryInsight() {
    var d = categoryData();
    var pr = d.priorities;
    var tr = d.types;
    var topType = tr.slice().sort(function (a, b) { return b.value - a.value; })[0] || { label: '—', value: 0 };
    var topDev = d.devices.slice().sort(function (a, b) { return b.value - a.value; })[0] || { label: '—', value: 0, share: 0 };
    var pct = function (n) { return d.total ? fixed(n / d.total * 100, 1) : '0.0'; };
    var basis = '统计范围 · ' + d.scope;
    var findings = d.total ? [
      '级别结构：紧急 ' + fmt(pr[0].value) + ' 条（' + pct(pr[0].value) + '%）、重要 ' + fmt(pr[1].value) + ' 条（' + pct(pr[1].value) + '%）、一般 ' + fmt(pr[2].value) + ' 条（' + pct(pr[2].value) + '%）。',
      '类型结构：' + tr.map(function (x) { return x.label + ' ' + fmt(x.value) + ' 条（' + pct(x.value) + '%）'; }).join('、') + '；状态上未确认 ' + fmt(d.unconfirmed) + ' 条、已处置 ' + fmt(d.closed) + ' 条。',
      '装置分布：' + topDev.label + ' ' + fmt(topDev.value) + ' 条（' + fixed(topDev.share, 1) + '%）最高；高优先未确认 ' + fmt(d.highUnconfirmed) + ' 条，需班内优先清零。'
    ] : ['当前统计口径无报警记录。', '切换到“当前报警”或“近48小时”查看。', '数据来自同一份历史报警记录。'];
    var actions = d.total ? [
      '先清理 ' + fmt(d.highUnconfirmed) + ' 条高优先未确认报警，紧急类优先升级。',
      '对 ' + topType.label + '类 ' + fmt(topType.value) + ' 条报警做分类治理，识别重复与无效报警。',
      '按装置拆分整治任务，' + topDev.label + ' 作为本轮报警合理化重点。'
    ] : ['切换统计范围。', '放宽筛选条件。', '检查数据是否加载。'];
    return {
      time: nowShort(), basis: '分类报警 · ' + basis,
      summary: d.scope + ' <b>' + fmt(d.total) + ' 条</b>报警：紧急 <b>' + fmt(pr[0].value) + '</b> 条、未确认 <b>' + fmt(d.unconfirmed) + '</b> 条、高优先未确认 <b>' + fmt(d.highUnconfirmed) + '</b> 条；已处置 <b>' + fmt(d.closed) + '</b> 条（' + fixed(d.closeRate, 2) + '%）。',
      findings: findings,
      actions: actions,
      evidence: [d.scope + ' ' + fmt(d.total), '紧急 ' + fmt(pr[0].value), '未确认 ' + fmt(d.unconfirmed), '闭环率 ' + fixed(d.closeRate, 2) + '%']
    };
  }
  function categoryMatrix(d) {
    var orderS = ['未确认', '已确认', '处置中', '搁置', '已处置'];
    var maxCell = 1;
    d.combos.forEach(function (x) { if (x.count > maxCell) { maxCell = x.count; } });
    function cell(p, s) {
      var n = 0;
      d.combos.forEach(function (x) { if (x.priority === p && x.status === s) { n = x.count; } });
      var alpha = n === 0 ? 0 : 0.06 + (n / maxCell) * 0.20;
      return '<td style="background:rgba(20,102,232,' + alpha.toFixed(2) + ');font-weight:' + (n === 0 ? '400' : '700') + '">' + fmt(n) + '</td>';
    }
    var rows = ['紧急', '重要', '一般'].map(function (p) {
      var total = sumBy(d.combos.filter(function (x) { return x.priority === p; }), function (x) { return x.count; });
      return '<tr><td><b>' + tag(p) + '</b></td>' + orderS.map(function (s) { return cell(p, s); }).join('') + '<td><b>' + fmt(total) + '</b></td></tr>';
    }).join('');
    var foot = '<tr><td><b>合计</b></td>' + orderS.map(function (s) {
      return '<td><b>' + fmt(sumBy(d.combos.filter(function (x) { return x.status === s; }), function (x) { return x.count; })) + '</b></td>';
    }).join('') + '<td><b>' + fmt(d.total) + '</b></td></tr>';
    return '<div class="table-wrap" style="max-width:100%"><table style="min-width:720px"><thead><tr><th>级别 \\ 状态</th>' + orderS.map(function (s) { return '<th>' + h(s) + '</th>'; }).join('') + '<th>合计</th></tr></thead><tbody>' + rows + foot + '</tbody></table></div>';
  }
  function categoryAction(p, s) {
    if (p === '紧急' && s === '未确认') { return '立即确认并升级'; }
    if (s === '未确认') { return '班内确认清零'; }
    if (s === '处置中') { return '跟踪处置闭环'; }
    if (s === '搁置') { return '复核搁置到期'; }
    if (s === '已处置') { return '抽检闭环质量'; }
    return '按优先级处置';
  }
  function renderCategory() {
    var d = categoryData();
    var p0 = d.priorities;
    var html = head('iAAS / 报警监控', '分类报警', '按级别 / 类型 / 状态分类统计，支持当前报警快照与近 48 小时历史两个口径；交叉矩阵与分类明细同源。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('报警总量', fmt(d.total), '条', d.scope + ' 口径', '#1466E8');
    html += kpi('紧急报警', fmt(p0[0].value), '条', '占比 ' + fixed(p0[0].value / d.total * 100, 1) + '%', '#DC2626');
    html += kpi('未确认', fmt(d.unconfirmed), '条', '占 ' + fixed(d.unconfirmed / d.total * 100, 1) + '%', '#D97706');
    html += kpi('高优先未确认', fmt(d.highUnconfirmed), '条', '紧急 + 重要', '#DC2626');
    html += kpi('已处置', fmt(d.closed), '条', '闭环率 ' + fixed(d.closeRate, 2) + '%', '#0B9A78');
    html += kpi('涉及单元', fmt(d.unitCount), '个', '有报警的单元', '#0EA5E9');
    html += '</div>';
    html += '<div class="filters">' + sel('cScope', ['近48小时', '当前报警'], state.cScope) + '<span class="count">统计范围：' + h(d.scope) + ' · 数据与历史报警同源</span></div>';
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>按级别</h3><span>共 ' + fmt(d.total) + ' 条</span></div>' + S.chart.donut(p0, fmt(d.total), '报警总量') + '</div>';
    html += '<div class="card"><div class="card-h"><h3>按类型</h3><span>过程 / 设备 / 安全</span></div>' + barList(d.types) + '</div>';
    html += '<div class="card"><div class="card-h"><h3>按状态</h3><span>确认 / 处置 / 恢复</span></div>' + barList(d.statusRows, { color: '#0B9A78' }) + '</div>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card" style="min-width:0"><div class="card-h"><h3>级别 × 状态交叉分类</h3><span>' + h(d.scope) + '</span></div>' + categoryMatrix(d) + '</div>';
    html += '<div class="card"><div class="card-h"><h3>按装置分布</h3><span>报警量 / 占比</span></div>' + barList(d.devices.map(function (x) { return { label: x.label, value: x.value, text: fmt(x.value) + ' · ' + fixed(x.share, 1) + '%' }; }), { color: '#0EA5E9' }) + '</div>';
    html += '</div>';
    var rows = d.combos.map(function (x) {
      var pctv = d.total ? x.count / d.total * 100 : 0;
      return '<tr><td>' + tag(x.priority) + '</td><td>' + tag(x.status) + '</td><td><b>' + fmt(x.count) + '</b></td><td style="min-width:120px"><div style="display:flex;align-items:center;gap:8px"><div class="progress" style="flex:1"><span style="width:' + Math.min(100, pctv) + '%;background:' + statusColor(x.status) + '"></span></div><span class="sub">' + fixed(pctv, 2) + '%</span></div></td><td class="sub">' + h(categoryAction(x.priority, x.status)) + '</td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>分类统计明细</h3><span>级别 / 状态 / 数量 / 占比 / 建议</span></div>' + table(['级别', '状态', '数量', '占比', '建议动作'], rows || emptyRow(5), 720) + '</div>';
    var ins = categoryInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindCategory() {
    onSelect('cScope', 'category', function (v) { state.cScope = v; });
  }

  /* ================= 联锁管理 ================= */
  function interlockInsight() {
    var list = interlockFiltered();
    var total = list.length;
    var on = list.filter(function (x) { return x.status === '投运'; }).length;
    var bypass = list.filter(function (x) { return x.status === '旁路'; }).length;
    var removed = list.filter(function (x) { return x.status === '摘除'; }).length;
    var notRun = list.filter(function (x) { return x.status === '未投'; }).length;
    var rate = total ? on / total * 100 : 0;
    var actions = sumBy(list, function (x) { return x.actionCount; });
    var devRows = DEVICES.map(function (d) {
      var sub = list.filter(function (x) { return x.device === d.code; });
      var son = sub.filter(function (x) { return x.status === '投运'; }).length;
      return { label: d.name, value: sub.length ? son / sub.length * 100 : 0, total: sub.length, on: son, text: sub.length ? fixed(son / sub.length * 100, 2) + '%' : '—' };
    }).filter(function (x) { return x.total > 0; }).sort(function (a, b) { return a.value - b.value; });
    var lowest = devRows[0] || { label: '—', on: 0, total: 0 };
    var byAction = list.slice().sort(function (a, b) { return b.actionCount - a.actionCount; }).slice(0, 3);
    var offList = list.filter(function (x) { return x.status !== '投运'; }).slice(0, 3);
    var basis = (state.iDevice === '全部' ? '全部装置' : deviceName(state.iDevice)) + ' · ' + state.iType + ' · ' + state.iStatus;
    var findings = total ? [
      '装置投运率：' + devRows.map(function (x) { return x.label + ' ' + x.text + '（' + x.on + '/' + x.total + '）'; }).join('、') + '。',
      '未投运：旁路 ' + fmt(bypass) + ' 套、摘除 ' + fmt(removed) + ' 套、未投 ' + fmt(notRun) + ' 套；' + (offList.length ? offList.map(function (x) { return x.id + ' ' + x.name; }).join('；') : '当前无异常联锁。'),
      '动作与试验：本月动作 ' + fmt(actions) + ' 次，' + (byAction.length ? byAction.map(function (x) { return x.id + '（' + x.actionCount + ' 次）'; }).join('、') : '—') + '；建议核对试验到期清单。'
    ] : ['当前筛选无联锁；可清空装置/类型/状态筛选。', '全厂联锁 188 套，投运 181 套，投运率 96.28%。', '旁路、摘除均需审批与到期提醒。'];
    var actionsTips = total ? [
      '旁路 ' + fmt(bypass) + ' 套全部核对到期时间，超期未恢复自动升级提醒。',
      '优先提升 ' + lowest.label + ' 的投运率（' + lowest.text + '），核对待恢复的检修联锁。',
      '对动作次数最高的 ' + (byAction[0] ? byAction[0].id : '联锁') + ' 复核动作原因与工艺扰动关联。'
    ] : ['切换筛选查看其他联锁。', '核对旁路/摘除审批单。', '关注试验到期联锁。'];
    return {
      time: nowShort(), basis: '联锁管理 · ' + basis,
      summary: '当前筛选 <b>' + fmt(total) + ' 套</b>联锁，投运 <b>' + fmt(on) + ' 套</b>，投运率 <b>' + fixed(rate, 2) + '%</b>；旁路 <b>' + fmt(bypass) + '</b>、摘除 <b>' + fmt(removed) + '</b>、未投 <b>' + fmt(notRun) + '</b>；本月动作 <b>' + fmt(actions) + '</b> 次。',
      findings: findings,
      actions: actionsTips,
      evidence: ['联锁 ' + fmt(total), '投运 ' + fixed(rate, 2) + '%', '旁路 ' + fmt(bypass), '动作 ' + fmt(actions)]
    };
  }
  function renderInterlock() {
    var list = interlockFiltered();
    var total = list.length;
    var on = list.filter(function (x) { return x.status === '投运'; }).length;
    var bypass = list.filter(function (x) { return x.status === '旁路'; }).length;
    var removed = list.filter(function (x) { return x.status === '摘除'; }).length;
    var notRun = list.filter(function (x) { return x.status === '未投'; }).length;
    var rate = total ? on / total * 100 : 0;
    var actions = sumBy(list, function (x) { return x.actionCount; });
    var devRows = [];
    DEVICES.forEach(function (d) {
      var sub = list.filter(function (x) { return x.device === d.code; });
      if (!sub.length) { return; }
      var son = sub.filter(function (x) { return x.status === '投运'; }).length;
      devRows.push({ label: d.name, value: son / sub.length * 100, text: fixed(son / sub.length * 100, 2) + '%' });
    });
    devRows.sort(function (a, b) { return b.value - a.value; });
    var statusRows = [
      { label: '投运', value: on, color: '#0B9A78' },
      { label: '旁路', value: bypass, color: '#D97706' },
      { label: '摘除', value: removed, color: '#DC2626' },
      { label: '未投', value: notRun, color: '#94A3B8' }
    ];
    var html = head('iAAS / 实时监控', '联锁管理', '全厂 188 套安全/生产联锁 · 投运率、旁路、摘除、试验与动作记录；投运率与绩效评估页生产联锁投运率同源。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('联锁投运率', fixed(rate, 2), '%', '目标 ≥95%', '#0B9A78');
    html += kpi('联锁总数', fmt(total), '套', '安全 / 生产联锁', '#1466E8');
    html += kpi('投运', fmt(on), '套', '当前筛选口径', '#0B9A78');
    html += kpi('旁路', fmt(bypass), '套', '限时旁路', '#D97706');
    html += kpi('摘除 / 未投', fmt(removed + notRun), '套', '检修隔离 / 待投', '#DC2626');
    html += kpi('本月动作', fmt(actions), '次', '联锁动作记录', '#6D28D9');
    html += '</div>';
    html += '<div class="filters">';
    html += sel('iDevice', deviceOpts(), state.iDevice);
    html += sel('iType', ['全部', '安全联锁', '生产联锁'], state.iType);
    html += sel('iLevel', ['全部', 'SIS', 'ESD', 'DCS'], state.iLevel);
    html += sel('iStatus', ['全部', '投运', '旁路', '摘除', '未投'], state.iStatus);
    html += '<input id="iSearch" placeholder="联锁编号 / 名称 / 单元" value="' + h(state.iq) + '">';
    html += '<span class="spacer"></span><span class="count">共 ' + fmt(total) + ' 套</span>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>按装置联锁投运率</h3><span>投运 / 总数</span></div>' + barList(devRows, { color: '#0B9A78' }) + '<div class="legend"><span>目标 ≥95%</span><span>旁路/摘除/未投不计入投运</span></div></div>';
    html += '<div class="card"><div class="card-h"><h3>联锁状态分布</h3><span>共 ' + fmt(total) + ' 套</span></div>' + S.chart.donut(statusRows, fmt(total), '联锁总数') + '</div>';
    html += '</div>';
    var rows = list.map(function (x) {
      return '<tr data-interlock="' + h(x.id) + '"><td class="mono">' + h(x.id) + '</td><td><b>' + h(x.name) + '</b></td><td>' + h(x.deviceName) + ' / ' + h(x.unit) + '</td><td>' + tag(x.type) + '</td><td><span class="tag gray">' + h(x.level) + '</span></td><td>' + tag(x.status) + '</td><td><b>' + fmt(x.actionCount) + '</b></td><td class="sub">' + h(x.testDate) + '</td><td>' + h(x.owner) + '</td><td class="sub">' + h(x.reason || '—') + '</td><td><button class="btn small" data-il-action="toggle">' + (x.status === '投运' ? '旁路' : '恢复') + '</button> <button class="btn small" data-il-action="detail">详情</button></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>联锁清单</h3><span>点击查看详情；操作仅演示</span></div>' + table(['联锁编号', '名称', '装置 / 单元', '类型', '等级', '投运状态', '本月动作', '上次试验', '负责人', '原因 / 期限', '操作'], rows || emptyRow(11), 1180) + '</div>';
    var ins = interlockInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindInterlock() {
    onSelect('iDevice', 'interlock', function (v) { state.iDevice = v; });
    onSelect('iType', 'interlock', function (v) { state.iType = v; });
    onSelect('iLevel', 'interlock', function (v) { state.iLevel = v; });
    onSelect('iStatus', 'interlock', function (v) { state.iStatus = v; });
    onSearch('iSearch', 'interlock', function (v) { state.iq = v; });
    S.qsa('tr[data-interlock]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-il-action]')) { return; }
        showInterlockDetail(tr.getAttribute('data-interlock'));
      });
    });
    S.qsa('[data-il-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-interlock') : '';
        if (b.getAttribute('data-il-action') === 'detail') { showInterlockDetail(id); return; }
        var x = D.interlocks.filter(function (y) { return y.id === id; })[0];
        S.toast('<b>演示</b>：联锁 ' + h(id) + ' 已提交' + (x && x.status === '投运' ? '旁路' : '恢复') + '申请，需值班长审批');
      });
    });
  }
  function showInterlockDetail(id) {
    var x = D.interlocks.filter(function (y) { return y.id === id; })[0];
    if (!x) { return; }
    var body = detailGrid([
      ['联锁编号', h(x.id)], ['名称', h(x.name)], ['装置', h(x.deviceName)], ['单元', h(x.unit)],
      ['类型', tag(x.type)], ['等级', '<span class="tag gray">' + h(x.level) + '</span>'], ['投运状态', tag(x.status)], ['本月动作', fmt(x.actionCount) + ' 次'],
      ['上次动作', h(x.lastAction)], ['上次试验', h(x.testDate)], ['负责人', h(x.owner)], ['原因 / 期限', h(x.reason || '—')]
    ]);
    var steps = [
      { b: '联锁投运', t: x.testDate, s: x.owner + ' 完成试验并投运', done: true },
      { b: '最近动作', t: x.lastAction, s: '动作 ' + x.actionCount + ' 次（本月累计）', done: x.actionCount > 0 },
      { b: '当前状态', t: x.status, s: x.reason || '正常投运', done: x.status === '投运' }
    ];
    body += '<div class="card-h" style="margin-top:14px"><h3>联锁履历</h3><span>' + h(x.deviceName) + '</span></div><div class="timeline">' + steps.map(function (s) {
      return '<div class="tl-item ' + (s.done ? 'done' : 'active') + '"><span class="tl-dot"></span><div class="tl-body"><b>' + h(s.b) + '</b><span>' + h(s.t) + ' · ' + h(s.s) + '</span></div></div>';
    }).join('') + '</div>';
    var tip = x.status === '旁路' ? '限时旁路必须明确原因、审批人与到期时间，到期未恢复自动升级提醒。' : (x.status === '摘除' ? '检修摘除需与检修计划绑定，恢复前完成回路试验与签字确认。' : (x.status === '未投' ? '新项目联锁待开车投运，投运前完成 SIF 回路测试。' : '保持投运，按季度完成联锁试验并留存记录。'));
    body += '<div class="note" style="margin-top:12px">' + h(tip) + '</div>';
    S.detail('联锁详情 · ' + x.id, x.name + ' · ' + x.status, body);
  }

  /* ================= 自控管理 ================= */
  function autoInsight() {
    var list = loopFiltered();
    var total = list.length;
    var auto = list.filter(function (x) { return x.mode === '自动'; }).length;
    var cascade = list.filter(function (x) { return x.mode === '串级'; }).length;
    var manual = list.filter(function (x) { return x.mode === '手动'; }).length;
    var remote = list.filter(function (x) { return x.mode === '远程'; }).length;
    var self = auto + cascade;
    var rate = total ? self / total * 100 : 0;
    var degraded = list.filter(function (x) { return x.status === '劣化'; }).length;
    var good = list.filter(function (x) { return x.status === '优良'; }).length;
    var avgScore = total ? sumBy(list, function (x) { return x.score; }) / total : 0;
    var devRows = DEVICES.map(function (d) {
      var sub = list.filter(function (x) { return x.device === d.code; });
      var sself = sub.filter(function (x) { return x.mode === '自动' || x.mode === '串级'; }).length;
      return { label: d.name, value: sub.length ? sself / sub.length * 100 : 0, total: sub.length, text: sub.length ? fixed(sself / sub.length * 100, 2) + '%' : '—' };
    }).filter(function (x) { return x.total > 0; }).sort(function (a, b) { return a.value - b.value; });
    var lowest = devRows[0] || { label: '—', text: '—' };
    var worst = list.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 3);
    var basis = (state.aDevice === '全部' ? '全部装置' : deviceName(state.aDevice)) + ' · ' + state.aMode + ' · ' + state.aStatus;
    var findings = total ? [
      '自控结构：自动 ' + fmt(auto) + ' 条、串级 ' + fmt(cascade) + ' 条、手动 ' + fmt(manual) + ' 条、远程 ' + fmt(remote) + ' 条；自控率 ' + fixed(rate, 2) + '%。',
      '装置对比：' + devRows.map(function (x) { return x.label + ' ' + x.text; }).join('、') + '；' + lowest.label + ' 最低。',
      '回路品质：优良 ' + fmt(good) + ' 条、劣化 ' + fmt(degraded) + ' 条，平均评分 ' + fixed(avgScore, 1) + '；最少评分：' + (worst.length ? worst.map(function (x) { return x.tag + '（' + x.score + '）'; }).join('、') : '—') + '。'
    ] : ['当前筛选无回路；可清空装置/模式/状态筛选。', '全厂回路 939 条，自控 320 条，自控率 34.08%。', '自控率与绩效评估页口径一致。'];
    var actions = total ? [
      '优先评估 ' + fmt(manual) + ' 条手动回路的投自动条件，先从 ' + lowest.label + ' 试点。',
      '对 ' + fmt(degraded) + ' 条劣化回路生成整定建议，优先 ' + (worst[0] ? worst[0].tag : '—') + '。',
      '按月跟踪自控率与回路评分，避免为追求投用率忽略控制品质。'
    ] : ['切换筛选查看其他回路。', '检查回路数据是否加载。', '关注劣化回路整定。'];
    return {
      time: nowShort(), basis: '自控管理 · ' + basis,
      summary: '当前筛选 <b>' + fmt(total) + ' 条</b>回路，自控 <b>' + fmt(self) + '</b> 条（自动 ' + fmt(auto) + ' + 串级 ' + fmt(cascade) + '），自控率 <b>' + fixed(rate, 2) + '%</b>；手动 <b>' + fmt(manual) + '</b> 条、劣化 <b>' + fmt(degraded) + '</b> 条。',
      findings: findings,
      actions: actions,
      evidence: ['回路 ' + fmt(total), '自控率 ' + fixed(rate, 2) + '%', '手动 ' + fmt(manual), '劣化 ' + fmt(degraded)]
    };
  }
  function renderAuto() {
    var list = loopFiltered();
    var shown = list.slice(0, state.aLimit);
    var total = list.length;
    var auto = list.filter(function (x) { return x.mode === '自动'; }).length;
    var cascade = list.filter(function (x) { return x.mode === '串级'; }).length;
    var manual = list.filter(function (x) { return x.mode === '手动'; }).length;
    var remote = list.filter(function (x) { return x.mode === '远程'; }).length;
    var self = auto + cascade;
    var rate = total ? self / total * 100 : 0;
    var degraded = list.filter(function (x) { return x.status === '劣化'; }).length;
    var devRows = [];
    DEVICES.forEach(function (d) {
      var sub = list.filter(function (x) { return x.device === d.code; });
      if (!sub.length) { return; }
      var sself = sub.filter(function (x) { return x.mode === '自动' || x.mode === '串级'; }).length;
      devRows.push({ label: d.name, value: sself / sub.length * 100, text: fixed(sself / sub.length * 100, 2) + '%' });
    });
    devRows.sort(function (a, b) { return b.value - a.value; });
    var modeRows = [
      { label: '自动', value: auto, color: '#0B9A78' },
      { label: '串级', value: cascade, color: '#1466E8' },
      { label: '手动', value: manual, color: '#D97706' },
      { label: '远程', value: remote, color: '#94A3B8' }
    ];
    var trend = [31.8, 32.1, 32.6, 32.9, 33.2, 33.5, 33.6, 33.8, 33.9, 34.0, 34.1, 34.08];
    var html = head('iAAS / 实时监控', '自控管理', '全厂 939 条控制回路 · 自控率、控制模式、回路品质与整定线索；自控率与绩效评估页口径一致。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('自控率', fixed(rate, 2), '%', '自动 + 串级', '#0B9A78');
    html += kpi('回路总数', fmt(total), '条', '当前筛选口径', '#1466E8');
    html += kpi('自动', fmt(auto), '条', 'PID 自动', '#0B9A78');
    html += kpi('串级', fmt(cascade), '条', '串级控制', '#1466E8');
    html += kpi('手动', fmt(manual), '条', '长期手动需评估', '#D97706');
    html += kpi('劣化回路', fmt(degraded), '条', '评分 <60', '#DC2626');
    html += '</div>';
    html += '<div class="filters">';
    html += sel('aDevice', deviceOpts(), state.aDevice);
    html += sel('aMode', ['全部', '自动', '串级', '手动', '远程'], state.aMode);
    html += sel('aStatus', ['全部', '优良', '合格', '劣化'], state.aStatus);
    html += '<input id="aSearch" placeholder="回路位号 / 名称 / 单元" value="' + h(state.aq) + '">';
    html += '<span class="spacer"></span><span class="count">共 ' + fmt(total) + ' 条 · 显示前 ' + fmt(shown.length) + ' 条</span>';
    html += '</div>';
    html += '<div class="grid grid-3" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>按装置自控率</h3><span>自动 + 串级</span></div>' + barList(devRows, { color: '#0B9A78' }) + '</div>';
    html += '<div class="card"><div class="card-h"><h3>控制模式分布</h3><span>共 ' + fmt(total) + ' 条</span></div>' + S.chart.donut(modeRows, fmt(total), '回路总数') + '</div>';
    html += '<div class="card"><div class="card-h"><h3>自控率趋势</h3><span>近 12 个月</span></div><div class="chart">' + S.chart.line(trend, { height: 200, color: '#0B9A78', fixed: 1, labels: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12'] }) + '</div><div class="legend"><span>当前 34.08%</span><span>目标：逐步提升</span></div></div>';
    html += '</div>';
    var rows = shown.map(function (x) {
      return '<tr data-loop="' + h(x.id) + '"><td class="mono">' + h(x.tag) + '</td><td><b>' + h(x.name) + '</b></td><td>' + h(x.deviceName) + ' / ' + h(x.unit) + '</td><td>' + tag(x.mode) + '</td><td>' + fixed(x.pv, 1) + '</td><td>' + fixed(x.sp, 1) + '</td><td>' + fixed(x.mv, 1) + '</td><td><b>' + x.score + '</b></td><td>' + tag(x.status) + '</td><td class="sub">' + h(x.lastChange) + '</td><td><button class="btn small" data-loop-action="tune">整定建议</button> <button class="btn small" data-loop-action="detail">详情</button></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>回路清单</h3><span>PV / SP / MV · 评分 0–100</span></div>' + table(['回路位号', '名称', '装置 / 单元', '控制模式', 'PV', 'SP', 'MV', '评分', '状态', '最近切换', '操作'], rows || emptyRow(11), 1180) + moreBar(shown.length, total, 'auto') + '</div>';
    var ins = autoInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindAuto() {
    onSelect('aDevice', 'auto', function (v) { state.aDevice = v; state.aLimit = 80; });
    onSelect('aMode', 'auto', function (v) { state.aMode = v; state.aLimit = 80; });
    onSelect('aStatus', 'auto', function (v) { state.aStatus = v; state.aLimit = 80; });
    onSearch('aSearch', 'auto', function (v) { state.aq = v; state.aLimit = 80; });
    S.qsa('tr[data-loop]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-loop-action]')) { return; }
        showLoopDetail(tr.getAttribute('data-loop'));
      });
    });
    S.qsa('[data-loop-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-loop') : '';
        if (b.getAttribute('data-loop-action') === 'detail') { showLoopDetail(id); return; }
        var x = D.loops.filter(function (y) { return y.id === id; })[0];
        S.toast('<b>整定建议</b>：' + h(x ? x.tag : id) + ' 已生成演示建议（不写回 DCS）');
      });
    });
    var more = S.qs('[data-more="auto"]');
    if (more) { more.addEventListener('click', function () { state.aLimit += 80; S.go('auto'); }); }
  }
  function showLoopDetail(id) {
    var x = D.loops.filter(function (y) { return y.id === id; })[0];
    if (!x) { return; }
    var body = detailGrid([
      ['回路编号', h(x.id)], ['位号', h(x.tag)], ['名称', h(x.name)], ['装置 / 单元', h(x.deviceName) + ' / ' + h(x.unit)],
      ['控制模式', tag(x.mode)], ['综合评分', '<b>' + x.score + '</b>'], ['回路状态', tag(x.status)], ['PV', fixed(x.pv, 1)],
      ['SP', fixed(x.sp, 1)], ['MV', fixed(x.mv, 1)], ['最近切换', h(x.lastChange)], ['负责人', h(x.owner)]
    ]);
    body += '<div class="card-h" style="margin-top:14px"><h3>整定建议</h3><span>演示输出 · 不写回 DCS</span></div><div class="note" style="margin:0">' + h(x.suggestion) + '。建议先做阶跃测试，确认过程增益与滞后后再调整 PID；整定前后记录 PV 波动与阀门动作频次。</div>';
    var steps = [
      { b: '回路投用', t: x.lastChange, s: x.mode + ' 模式 · 负责人 ' + x.owner, done: true },
      { b: '品质评估', t: '综合评分 ' + x.score, s: x.status + ' · 基于波动与偏差', done: x.status !== '劣化' },
      { b: '整定建议', t: '待确认', s: x.suggestion, done: false }
    ];
    body += '<div class="card-h" style="margin-top:14px"><h3>回路履历</h3><span>' + h(x.unit) + '</span></div><div class="timeline">' + steps.map(function (s) {
      return '<div class="tl-item ' + (s.done ? 'done' : 'active') + '"><span class="tl-dot"></span><div class="tl-body"><b>' + h(s.b) + '</b><span>' + h(s.t) + ' · ' + h(s.s) + '</span></div></div>';
    }).join('') + '</div>';
    S.detail('回路详情 · ' + x.tag, x.name + ' · ' + x.mode, body);
  }

  /* ================= 处置记录 ================= */
  function disposalDurationBuckets(list) {
    var labels = ['≤30 min', '30–60 min', '1–2 h', '2–4 h', '>4 h'];
    var vals = [0, 0, 0, 0, 0];
    list.forEach(function (r) {
      if (r.status !== '已处置' || !r.durationMin) { return; }
      var m = r.durationMin;
      if (m <= 30) { vals[0]++; }
      else if (m <= 60) { vals[1]++; }
      else if (m <= 120) { vals[2]++; }
      else if (m <= 240) { vals[3]++; }
      else { vals[4]++; }
    });
    return labels.map(function (l, i) { return { label: l, value: vals[i] }; });
  }
  function disposalLogInsight() {
    var list = disposalFiltered();
    var closed = list.filter(function (r) { return r.status === '已处置'; }).length;
    var processing = list.length - closed;
    var done = list.filter(function (r) { return r.status === '已处置' && r.durationMin; });
    var avg = done.length ? sumBy(done, function (r) { return r.durationMin; }) / done.length : 0;
    var max = done.length ? Math.max.apply(null, done.map(function (r) { return r.durationMin; })) : 0;
    var over2h = done.filter(function (r) { return r.durationMin > 120; }).length;
    var mc = countBy(list, function (r) { return r.method; });
    var mKeys = Object.keys(mc).sort(function (a, b) { return mc[b] - mc[a]; });
    var dc = countBy(list, function (r) { return r.device; });
    var dKeys = Object.keys(dc).sort(function (a, b) { return dc[b] - dc[a]; });
    var em = list.filter(function (r) { return r.priority === '紧急'; }).length;
    var basis = (state.dStatus === '全部' ? '全部状态' : state.dStatus) + ' · ' + (state.dDevice === '全部' ? '全部装置' : deviceName(state.dDevice)) + ' · ' + state.dMethod;
    var findings = list.length ? [
      '闭环进度：已闭环 ' + fmt(closed) + ' 条、处置中 ' + fmt(processing) + ' 条，闭环率 ' + fixed(closed / list.length * 100, 2) + '%；平均处置 ' + fmt(round(avg, 0)) + ' 分钟。',
      '时长结构：超过 2 小时 ' + fmt(over2h) + ' 条（占已闭环 ' + fixed(over2h / (done.length || 1) * 100, 1) + '%），最长 ' + fmt(max) + ' 分钟，建议核查长尾工单。',
      '方式结构：' + (mKeys.length ? mKeys.slice(0, 4).map(function (k) { return k + ' ' + fmt(mc[k]) + ' 条'; }).join('、') : '—') + '；' + deviceName(dKeys[0] || '—') + ' 处置量最高，紧急报警 ' + fmt(em) + ' 条。'
    ] : ['当前筛选无处置记录；可切换状态/装置/方式。', '处置记录来自历史报警中的已处置与处置中记录。', '可到实时报警页确认并处置当前报警。'];
    var actions = list.length ? [
      '优先闭环 ' + fmt(processing) + ' 条处置中记录，紧急报警优先。',
      '对超过 2 小时的 ' + fmt(over2h) + ' 条长尾记录复盘流程与备件/仪表校验环节。',
      '按处置方式分析耗时，优化 ' + (mKeys[0] || '工艺调整') + ' 的标准作业与响应时限。'
    ] : ['切换筛选查看其他记录。', '到报警处置页处理待处置报警。', '检查工单同步状态。'];
    return {
      time: nowShort(), basis: '处置记录 · ' + basis,
      summary: '当前筛选 <b>' + fmt(list.length) + ' 条</b>处置记录：已闭环 <b>' + fmt(closed) + '</b> 条、处置中 <b>' + fmt(processing) + '</b> 条；平均处置 <b>' + fmt(round(avg, 0)) + ' 分钟</b>，超 2 小时 <b>' + fmt(over2h) + '</b> 条。',
      findings: findings,
      actions: actions,
      evidence: ['处置 ' + fmt(list.length), '已闭环 ' + fmt(closed), '平均 ' + fmt(round(avg, 0)) + ' min', '超2h ' + fmt(over2h)]
    };
  }
  function renderDisposalLog() {
    var list = disposalFiltered();
    var shown = list.slice(0, state.dLimit);
    var closed = list.filter(function (r) { return r.status === '已处置'; }).length;
    var processing = list.length - closed;
    var done = list.filter(function (r) { return r.status === '已处置' && r.durationMin; });
    var avg = done.length ? sumBy(done, function (r) { return r.durationMin; }) / done.length : 0;
    var max = done.length ? Math.max.apply(null, done.map(function (r) { return r.durationMin; })) : 0;
    var over2h = done.filter(function (r) { return r.durationMin > 120; }).length;
    var methods = ['工艺调整', '参数复核', '清洗置换', '现场确认', '仪表校验', '设备检修', '联锁复位'];
    var methodRows = methods.map(function (m) { return { label: m, value: list.filter(function (r) { return r.method === m; }).length }; }).filter(function (x) { return x.value > 0; });
    var methodCount = methodRows.length;
    var html = head('iAAS / 报警处置', '处置记录', '报警处置全流程留痕：工单、处置人、处置方式、耗时、结果与闭环状态；与历史报警同一数据源。', '<button class="btn" data-action="export-disposal">导出工单</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('处置记录', fmt(list.length), '条', '当前筛选口径', '#1466E8');
    html += kpi('已闭环', fmt(closed), '条', '闭环率 ' + fixed(list.length ? closed / list.length * 100 : 0, 2) + '%', '#0B9A78');
    html += kpi('处置中', fmt(processing), '条', '待完成闭环', '#D97706');
    html += kpi('平均处置', fmt(round(avg, 0)), 'min', '已闭环记录', '#0EA5E9');
    html += kpi('超 2 小时', fmt(over2h), '条', '占已闭环 ' + fixed(over2h / (done.length || 1) * 100, 1) + '%', '#DC2626');
    html += kpi('最长处置', fmt(max), 'min', 'TOP1 工单', '#6D28D9');
    html += '</div>';
    html += '<div class="filters">';
    html += sel('dStatus', ['全部', '已闭环', '处置中'], state.dStatus);
    html += sel('dDevice', deviceOpts(), state.dDevice);
    html += sel('dPriority', ['全部', '紧急', '重要', '一般'], state.dPriority);
    html += sel('dMethod', ['全部'].concat(methods), state.dMethod);
    html += '<input id="dSearch" placeholder="工单号 / 位号 / 名称" value="' + h(state.dq) + '">';
    html += '<span class="spacer"></span><span class="count">共 ' + fmt(list.length) + ' 条 · ' + fmt(methodCount) + ' 种处置方式</span>';
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>处置方式分布</h3><span>当前筛选</span></div>' + (methodRows.length ? barList(methodRows, { color: '#0EA5E9' }) : '<div class="sub" style="padding:14px 0">暂无处置记录</div>') + '</div>';
    html += '<div class="card"><div class="card-h"><h3>处置时长分布</h3><span>仅已闭环</span></div><div class="chart">' + S.chart.bars(disposalDurationBuckets(list), { height: 210, color: '#1466E8' }) + '</div></div>';
    html += '</div>';
    var rows = shown.map(function (r) {
      var st = r.status === '已处置' ? '已闭环' : '处置中';
      return '<tr data-disposal="' + h(r.id) + '"><td class="sub">' + h(r.disposeTimeText) + '</td><td class="mono">' + h(r.workOrder) + '</td><td class="mono">' + h(r.tag) + '</td><td>' + h(r.name) + '</td><td><b>' + h(r.unit) + '</b></td><td>' + tag(r.priority) + '</td><td>' + h(r.method) + '</td><td>' + h(r.disposeBy) + '</td><td><b>' + (r.status === '已处置' ? (r.durationMin < 1 ? '<1 min' : fmt(r.durationMin) + ' min') : '进行中') + '</b></td><td>' + h(r.result) + '</td><td>' + tag(st) + '</td><td><button class="btn small" data-disposal-action="close">闭环</button> <button class="btn small" data-disposal-action="detail">详情</button></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>处置工单</h3><span>点击查看详情</span></div>' + table(['处置时间', '工单号', '位号', '名称', '单元', '级别', '处置方式', '处置人', '耗时', '结果', '状态', '操作'], rows || emptyRow(12), 1220) + moreBar(shown.length, list.length, 'disposalLog') + '</div>';
    var ins = disposalLogInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindDisposalLog() {
    onSelect('dStatus', 'disposalLog', function (v) { state.dStatus = v; state.dLimit = 80; });
    onSelect('dDevice', 'disposalLog', function (v) { state.dDevice = v; state.dLimit = 80; });
    onSelect('dPriority', 'disposalLog', function (v) { state.dPriority = v; state.dLimit = 80; });
    onSelect('dMethod', 'disposalLog', function (v) { state.dMethod = v; state.dLimit = 80; });
    onSearch('dSearch', 'disposalLog', function (v) { state.dq = v; state.dLimit = 80; });
    S.qsa('tr[data-disposal]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-disposal-action]')) { return; }
        showDisposalDetail(tr.getAttribute('data-disposal'));
      });
    });
    S.qsa('[data-disposal-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-disposal') : '';
        if (b.getAttribute('data-disposal-action') === 'detail') { showDisposalDetail(id); return; }
        S.toast('<b>闭环</b>：工单 ' + h(id) + ' 已模拟闭环（演示，不写回真实系统）');
      });
    });
    var more = S.qs('[data-more="disposalLog"]');
    if (more) { more.addEventListener('click', function () { state.dLimit += 80; S.go('disposalLog'); }); }
    var exp = S.qs('[data-action="export-disposal"]');
    if (exp) { exp.addEventListener('click', function () { S.toast('<b>导出</b>：已生成 ' + h(fmt(disposalFiltered().length)) + ' 条处置工单（演示）'); }); }
  }
  function showDisposalDetail(id) {
    var r = D.history.filter(function (x) { return x.id === id; })[0];
    if (!r) { return; }
    var st = r.status === '已处置' ? '已闭环' : '处置中';
    var body = detailGrid([
      ['工单号', h(r.workOrder)], ['报警编号', h(r.id)], ['位号', h(r.tag)], ['名称', h(r.name)],
      ['装置 / 单元', h(deviceName(r.device)) + ' / ' + h(r.unit)], ['级别', tag(r.priority)], ['报警时间', h(r.timeText)], ['确认时间', h(r.ackTimeText)],
      ['处置时间', h(r.disposeTimeText)], ['处置人', h(r.disposeBy)], ['处置方式', h(r.method)], ['处置结果', h(r.result)],
      ['耗时', r.status === '已处置' ? fmt(r.durationMin) + ' 分钟' : '进行中'], ['状态', tag(st)], ['恢复时间', h(r.recoverTimeText)], ['确认超时', r.ackTimeout === '是' ? '<span class="tag amber">是</span>' : '<span class="sub">否</span>']
    ]);
    body += alarmTimeline(r);
    var tip = r.status === '已处置' ? '该工单已闭环：建议抽检处置记录完整性，确认恢复时间、处置动作与结果一致。' : '该工单仍在处置中：建议明确责任人与计划完成时间，超过 2 小时升级班组关注。';
    body += '<div class="note" style="margin-top:12px">' + h(tip) + '</div>';
    S.detail('处置记录 · ' + r.workOrder, r.tag + ' · ' + st, body);
  }

  /* ================= 绩效指标 ================= */
  function perfRowByKey(rows, key) {
    return rows.filter(function (x) { return x.key === key; })[0] || { value: 0, target: 0, mul: 0, unit: '' };
  }
  function perfValueText(k) {
    if (k.cat === 'pct') { return fixed(k.value, 2) + '%'; }
    return fmt(round(k.value, k.dec)) + ' ' + k.unit;
  }
  function perfTargetText(k) {
    return (k.ops === 'min' ? '≥' : '≤') + k.target + (k.cat === 'pct' ? '%' : ' ' + k.unit);
  }
  function perfInsight() {
    var pv = perfView();
    var t = perfTrend();
    var hourAvg = perfRowByKey(pv.rows, 'hourAvg');
    var hourPeak = perfRowByKey(pv.rows, 'hourPeak');
    var tenAvg = perfRowByKey(pv.rows, 'tenAvg');
    var flood = perfRowByKey(pv.rows, 'flood');
    var top10 = perfRowByKey(pv.rows, 'top10');
    var chatter = perfRowByKey(pv.rows, 'chatter');
    var stale = perfRowByKey(pv.rows, 'stale');
    var rateMap = {};
    pv.rates.forEach(function (r) { rateMap[r.key] = r; });
    var devLabel = pv.dev ? pv.dev.name : '全厂';
    var failedRates = pv.rates.filter(function (r) { return !r.ok; }).map(function (r) { return r.label; });
    var findings = [
      '报警负荷：小时均值 ' + fmt(round(hourAvg.value, 0)) + ' 次（目标 ≤6，超 ' + fixed(hourAvg.mul, 1) + ' 倍）、峰值 ' + fmt(round(hourPeak.value, 0)) + ' 次；10 分钟均值 ' + fmt(round(tenAvg.value, 0)) + ' 次（目标 ≤1）。',
      '泛滥与坏点：泛滥 ' + fmt(round(flood.value, 0)) + ' 次、TOP10 占比 ' + fixed(top10.value, 2) + '%（目标 ≤1%）、抖动 ' + fmt(round(chatter.value, 0)) + ' 次、陈旧 ' + fmt(round(stale.value, 0)) + ' 次。',
      '六大率：确认 ' + fixed(rateMap.confirm.value, 2) + '%、处置 ' + fixed(rateMap.dispose.value, 2) + '%、恢复 ' + fixed(rateMap.recover.value, 2) + '%、工单处置 ' + fixed(rateMap.ticket.value, 2) + '%、干扰 ' + fixed(rateMap.interference.value, 2) + '%；' + (failedRates.length ? failedRates.join('、') + ' 未达参考目标。' : '全部达到参考目标。')
    ];
    var actions = [
      '按 TOP10 位号治理坏点报警（当前 ' + fixed(top10.value, 2) + '%，目标 ≤1%），先做死区/延时/级别复核。',
      '针对泛滥 ' + fmt(round(flood.value, 0)) + ' 次与 12 时峰值，建立报警泛滥时段与交接班/进料波动的关联分析。',
      '工单处置率 ' + fixed(rateMap.ticket.value, 2) + '%、干扰率 ' + fixed(rateMap.interference.value, 2) + '%，建议同步优化处置时限与重复报警抑制策略。'
    ];
    return {
      time: nowShort(), basis: '绩效指标 · ' + devLabel + ' · ' + state.pPeriod + '度 · ISA 18.2',
      summary: devLabel + ' · ' + state.pPeriod + '度：13 项 ISA 18.2 KPI 中 <b>' + pv.okCount + ' 项达标、' + pv.failCount + ' 项超标</b>；小时均值 <b>' + fmt(round(hourAvg.value, 0)) + '</b> 次（目标 ≤6），TOP10 占比 <b>' + fixed(top10.value, 2) + '%</b>（目标 ≤1%），干扰率 <b>' + fixed(rateMap.interference.value, 2) + '%</b>。',
      findings: findings,
      actions: actions,
      evidence: ['KPI 超标 ' + pv.failCount + '/13', '小时均值 ' + fmt(round(hourAvg.value, 0)), 'TOP10 ' + fixed(top10.value, 2) + '%', '干扰率 ' + fixed(rateMap.interference.value, 2) + '%']
    };
  }
  function renderPerformance() {
    var pv = perfView();
    var t = perfTrend();
    var devLabel = pv.dev ? pv.dev.name : '全厂';
    var worst = pv.worst;
    var rateColors = { confirm: '#0B9A78', onTime: '#0EA5E9', dispose: '#D97706', recover: '#0B9A78', ticket: '#DC2626', interference: '#6D28D9' };
    var html = head('iAAS / 绩效评估', '绩效指标', '内置 ISA 18.2 / EEMUA 191 的 13 项报警 KPI 与目标阈值；统计周期（日/周/月/年）× 装置可切换；六大率同屏。', '<button class="btn" data-action="export-perf">导出报表</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters">';
    html += sel('pPeriod', ['日', '周', '月', '年'], state.pPeriod);
    html += sel('pDevice', deviceOpts(), state.pDevice);
    html += '<span class="count">口径：' + h(devLabel) + ' · ' + h(state.pPeriod) + '度 · 指标随周期与装置切换；8 项绩效为装置月度口径</span>';
    html += '</div>';
    html += '<div class="kpi-grid">';
    pv.rates.forEach(function (r) {
      var dtext = '<span class="' + (r.ok ? 'up' : 'down') + '">' + (r.ok ? '达标' : '未达标') + '</span> · 目标 ' + (r.ops === 'min' ? '≥' : '≤') + r.target + '%';
      html += kpi(r.label, fixed(r.value, 2), '%', dtext, rateColors[r.key] || '#1466E8');
    });
    html += '</div>';
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><div><b>13 项 ISA 18.2 KPI：' + pv.okCount + ' 项达标 / ' + pv.failCount + ' 项超标</b> · ' + h(devLabel) + ' · ' + h(state.pPeriod) + '度口径；超标倍数最高为 <b>' + worst[0].label + ' ' + fixed(worst[0].mul, 1) + ' 倍</b>，建议纳入本月报警合理化专项。</div></div>';
    var krows = pv.rows.map(function (k) {
      return '<tr><td><b>' + h(k.label) + '</b></td><td><b>' + h(perfValueText(k)) + '</b></td><td class="sub">' + h(perfTargetText(k)) + '</td><td>' + (k.ok ? '<span class="sub">—</span>' : '<b style="color:#DC2626">' + fixed(k.mul, 1) + ' 倍</b>') + '</td><td>' + tag(k.ok ? '达标' : '超标') + '</td><td class="sub">' + h(k.delta) + '</td><td class="sub">' + h(k.note) + '</td></tr>';
    }).join('');
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>13 项报警 KPI · 目标阈值</h3><span>ISA 18.2 / EEMUA 191</span></div>' + table(['指标', '结果', '目标阈值', '超标倍数', '达成', '环比', '说明'], krows, 980) + '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>小时报警均值趋势</h3><span>' + h(devLabel) + ' · ' + h(state.pPeriod) + '度</span></div><div class="chart">' + S.chart.line(t.values, { height: 225, color: '#1466E8', fixed: 0, labels: t.labels }) + '</div><div class="legend"><span>小时报警均值</span><span>ISA 目标 ≤6</span></div></div>';
    html += '<div class="card"><div class="card-h"><h3>超标倍数 TOP5</h3><span>结果 / 目标</span></div>' + barList(worst.map(function (x) { return { label: x.label, value: x.mul, text: '×' + fixed(x.mul, 1) }; }), { color: '#DC2626' }) + '<div class="note" style="margin-top:10px">倍数越高，说明与 ISA 18.2 目标阈值差距越大；建议按倍数排序做报警合理化。</div></div>';
    html += '</div>';
    var drows = D.devicePerf.map(function (d) {
      var active = state.pDevice === d.code;
      return '<tr data-pdev="' + h(d.code) + '" style="' + (active ? 'background:#EAF2FF' : '') + '"><td><b>' + h(d.name) + '</b></td><td>' + fmt(d.alarms) + '</td><td>' + fixed(d.share, 1) + '%</td><td>' + fmt(d.hourAvg) + '</td><td>' + fmt(d.hourPeak) + '</td><td>' + fmt(d.flood) + '</td><td>' + fixed(d.top10, 2) + '%</td><td>' + fixed(d.confirm, 2) + '%</td><td>' + fixed(d.dispose, 2) + '%</td><td>' + fixed(d.ticket, 2) + '%</td></tr>';
    }).join('');
    drows += '<tr><td><b>合计 / 全厂</b></td><td><b>957</b></td><td>100.0%</td><td>88</td><td>397</td><td>11</td><td>62.07%</td><td>99.77%</td><td>93.70%</td><td>86.08%</td></tr>';
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>按装置分布</h3><span>点击行切换装置口径</span></div>' + table(['装置', '报警数', '占比', '小时均值', '峰值', '泛滥次数', 'TOP10 占比', '确认率', '处置率', '工单处置率'], drows, 1080) + '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    var prows = pv.perf8.map(function (p) {
      return '<tr><td><b>' + h(p.label) + '</b></td><td>' + h(p.value) + '</td><td class="sub">' + h(p.target) + '</td><td>' + tag(p.ok ? '达标' : '超标') + '</td></tr>';
    }).join('');
    html += '<div class="card" style="min-width:0"><div class="card-h"><h3>8 项绩效指标</h3><span>装置月度口径</span></div>' + table(['绩效指标', '结果', '参考目标', '达成'], prows, 620) + '</div>';
    html += '<div class="card"><div class="card-h"><h3>统计口径说明</h3><span>与正式系统一致</span></div><div class="detail-grid">' +
      '<div class="detail-item"><span>指标类型</span><b>报警负荷 / 泛滥 / 坏点报警 / 处置绩效</b></div>' +
      '<div class="detail-item"><span>工厂模型</span><b>1 工厂 / 5 装置 / 22 单元</b></div>' +
      '<div class="detail-item"><span>统计周期</span><b>日 / 周 / 月 / 年</b></div>' +
      '<div class="detail-item"><span>是否排除报警</span><b>按报警配置过滤停用/搁置点位</b></div>' +
      '</div><div class="note" style="margin-top:10px">13 项 KPI 目标阈值取自 ISA 18.2 / EEMUA 191；六大率目标为参考目标。数据为演示合成数据，指标与图表同源。</div></div>';
    html += '</div>';
    var ins = perfInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindPerformance() {
    onSelect('pPeriod', 'performance', function (v) { state.pPeriod = v; });
    onSelect('pDevice', 'performance', function (v) { state.pDevice = v; });
    S.qsa('[data-pdev]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var code = tr.getAttribute('data-pdev');
        state.pDevice = state.pDevice === code ? '全部' : code;
        S.go('performance');
      });
    });
    var exp = S.qs('[data-action="export-perf"]');
    if (exp) { exp.addEventListener('click', function () { S.toast('<b>导出</b>：绩效指标报表已生成（演示）'); }); }
  }

  /* ================= 工厂模型与报警配置 ================= */
  function factoryInsight() {
    var units = unitRows();
    var configs = configFiltered();
    var points = sumBy(units, function (x) { return x.points; });
    var running = sumBy(units, function (x) { return x.running; });
    var shelved = sumBy(units, function (x) { return x.shelved; });
    var disabled = sumBy(units, function (x) { return x.disabled; });
    var pending = configs.filter(function (c) { return c.approval === '待审批'; });
    var off = configs.filter(function (c) { return c.enabled === '停用'; });
    var shel = configs.filter(function (c) { return c.shelved === '是'; });
    var devPoints = DEVICES.map(function (d) {
      var sub = d.units;
      return { label: d.name, value: sumBy(sub, function (u) { return u.points; }), units: sub.length };
    }).sort(function (a, b) { return b.value - a.value; });
    var topDev = devPoints[0];
    var basis = (state.fDevice === '全部' ? '全部装置' : deviceName(state.fDevice)) + ' · ' + state.fEnable + ' · ' + state.fApprove;
    var findings = [
      '工厂模型：1 工厂 / ' + DEVICES.length + ' 装置 / 22 单元 / ' + fmt(D.factory.plant.points) + ' 报警点位；运行 ' + fmt(D.factory.plant.running) + '、搁置 ' + fmt(D.factory.plant.shelved) + '、停用 ' + D.factory.plant.disabled + '。',
      '点位分布：' + devPoints.slice(0, 3).map(function (x) { return x.label + ' ' + fmt(x.value) + ' 点（' + fixed(x.value / D.factory.plant.points * 100, 1) + '%）'; }).join('、') + '；' + topDev.label + ' 点位最多。',
      '配置风险：当前筛选 ' + fmt(configs.length) + ' 条配置，待审批 ' + fmt(pending.length) + ' 条、停用 ' + fmt(off.length) + ' 条、搁置 ' + fmt(shel.length) + ' 条；最近变更 ' + D.configChanges.length + ' 条。'
    ];
    var actions = pending.length ? [
      '审批 ' + pending.slice(0, 3).map(function (c) { return c.tag; }).join('、') + ' 等 ' + pending.length + ' 条待审批变更，确认不影响报警灵敏度。',
      '核查停用配置 ' + (off.length ? off.map(function (c) { return c.tag; }).join('、') : '—') + '，确认检修结束后恢复使能。',
      '按装置核对点位与单元映射，保持 ' + fmt(points) + ' 个点位口径一致。'
    ] : [
      '当前无待审批配置；保持变更台账完整。',
      '按季度复核死区/延时/阈值设置，避免报警泛滥。',
      '核对搁置与停用配置的到期恢复时间。'
    ];
    return {
      time: nowShort(), basis: '工厂模型 · ' + basis,
      summary: '工厂模型 <b>1 工厂 / 5 装置 / 22 单元 / ' + fmt(D.factory.plant.points) + ' 点位</b>；当前筛选 ' + fmt(units.length) + ' 个单元、' + fmt(points) + ' 点位（运行 ' + fmt(running) + '、搁置 ' + fmt(shelved) + '、停用 ' + fmt(disabled) + '）；配置 ' + fmt(configs.length) + ' 条、待审批 ' + fmt(pending.length) + ' 条。',
      findings: findings,
      actions: actions,
      evidence: ['22 单元', '19,733 点位', '配置 ' + fmt(configs.length), '待审批 ' + fmt(pending.length)]
    };
  }
  function renderFactory() {
    var units = unitRows();
    var configs = configFiltered();
    var allPoints = D.factory.plant.points;
    var html = head('iAAS / 工艺配置', '工厂模型与报警配置', '1 工厂 / 5 装置 / 22 单元 / 19,733 报警点位；装置卡片联动单元清单与报警配置，配置变更与审批留痕。', '<button class="btn" data-action="sync-model">同步工厂模型</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('工厂', '1', '个', D.factory.plant.name, '#1466E8');
    html += kpi('装置', '5', '套', '2EH / MTO / BD / OPU / UT', '#0EA5E9');
    html += kpi('单元', '22', '个', '三级工厂模型', '#1466E8');
    html += kpi('报警点位', fmt(allPoints), '点', '含未启用', '#6D28D9');
    html += kpi('运行点位', fmt(D.factory.plant.running), '点', '运行率 ' + fixed(D.factory.plant.running / allPoints * 100, 2) + '%', '#0B9A78');
    html += kpi('搁置 / 停用', fmt(D.factory.plant.shelved) + ' / ' + D.factory.plant.disabled, '点', '需跟踪恢复', '#D97706');
    html += '</div>';
    html += '<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(168px,1fr));gap:10px;margin-bottom:12px">';
    DEVICES.forEach(function (d) {
      var pts = sumBy(d.units, function (u) { return u.points; });
      var run = sumBy(d.units, function (u) { return u.points - u.shelved - u.disabled; });
      var active = state.fDevice === d.code;
      html += '<button class="card" data-f-device="' + h(d.code) + '" style="text-align:left;cursor:pointer;padding:12px;border-top:3px solid ' + (active ? '#1466E8' : '#CBD5E1') + ';' + (active ? 'background:#EAF2FF' : '') + '"><div style="display:flex;align-items:center;justify-content:space-between;gap:6px"><b style="font-size:13px">' + h(d.name) + '</b><span class="tag ' + (active ? 'blue' : 'gray') + '">' + h(d.code) + '</span></div><div style="font-size:22px;font-weight:900;margin-top:4px">' + fmt(pts) + '<small style="font-size:10px;color:#64748B;font-weight:600"> 点</small></div><div class="sub">' + d.units.length + ' 单元 · 运行 ' + fmt(run) + '</div></button>';
    });
    html += '</div>';
    var urows = units.map(function (u) {
      var st = u.disabled > 0 ? '部分停用' : (u.shelved > 0 ? '部分搁置' : '正常');
      return '<tr><td>' + h(u.deviceName) + '</td><td class="mono">' + h(u.code) + '</td><td>' + h(u.name) + '</td><td><b>' + fmt(u.points) + '</b></td><td>' + fmt(u.running) + '</td><td>' + fmt(u.shelved) + '</td><td>' + fmt(u.disabled) + '</td><td>' + fmt(u.configs) + '</td><td>' + tag(st) + '</td></tr>';
    }).join('');
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>单元清单</h3><span>当前 ' + fmt(units.length) + ' 个单元 · ' + fmt(sumBy(units, function (x) { return x.points; })) + ' 点位</span></div>' + table(['装置', '单元编码', '单元名称', '点位数', '运行', '搁置', '停用', '配置数', '点位状态'], urows || emptyRow(9), 900) + '<div class="filters" style="margin:10px 0 0"><button class="btn small" data-f-all>全部装置</button><span class="count">点击上方装置卡片筛选单元与报警配置</span></div></div>';
    var crows = configs.map(function (c) {
      var act = c.approval === '待审批' ? '<button class="btn small" data-config-action="approve">审批</button> ' : '';
      return '<tr data-config="' + h(c.id) + '"><td class="mono">' + h(c.tag) + '</td><td>' + h(c.name) + '</td><td>' + h(c.unit) + '</td><td>' + tag(c.priority) + '</td><td class="mono">' + h(c.threshold) + '</td><td>' + h(c.deadband) + '</td><td>' + h(c.delay) + '</td><td>' + tag(c.enabled) + '</td><td>' + (c.shelved === '是' ? '<span class="tag gray">是</span>' : '<span class="sub">否</span>') + '</td><td class="sub">' + h(c.changed) + '</td><td>' + tag(c.approval) + '</td><td>' + act + '<button class="btn small" data-config-action="detail">详情</button></td></tr>';
    }).join('');
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>报警配置</h3><span>阈值 / 死区 / 延时 / 使能 / 审批</span></div><div class="filters">' + sel('fEnable', ['全部', '启用', '停用'], state.fEnable) + sel('fApprove', ['全部', '已生效', '待审批'], state.fApprove) + '<input id="fSearch" placeholder="位号 / 名称 / 单元" value="' + h(state.fq) + '"><span class="spacer"></span><span class="count">共 ' + fmt(configs.length) + ' 条</span></div>' + table(['位号', '名称', '单元', '级别', '阈值', '死区', '延时', '使能', '搁置', '最近变更', '审批', '操作'], crows || emptyRow(12), 1260) + '</div>';
    var changes = D.configChanges.map(function (c) {
      return '<tr><td class="sub">' + h(c.time) + '</td><td>' + h(c.user) + '</td><td class="mono">' + h(c.target) + '</td><td><b>' + h(c.action) + '</b></td><td class="sub">' + h(c.detail) + '</td><td>' + tag(c.approval) + '</td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>近期配置变更</h3><span>含审批状态 · 按时间</span></div>' + table(['时间', '操作人', '对象', '变更', '内容', '审批'], changes || emptyRow(6), 820) + '</div>';
    var ins = factoryInsight();
    html += aiCard(ins.summary, ins.evidence.slice(0, 3));
    return html;
  }
  function bindFactory() {
    onSelect('fEnable', 'factory', function (v) { state.fEnable = v; });
    onSelect('fApprove', 'factory', function (v) { state.fApprove = v; });
    onSearch('fSearch', 'factory', function (v) { state.fq = v; });
    S.qsa('[data-f-device]').forEach(function (b) {
      b.addEventListener('click', function () {
        var code = b.getAttribute('data-f-device');
        state.fDevice = state.fDevice === code ? '全部' : code;
        S.go('factory');
      });
    });
    var all = S.qs('[data-f-all]');
    if (all) { all.addEventListener('click', function () { state.fDevice = '全部'; S.go('factory'); }); }
    S.qsa('tr[data-config]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-config-action]')) { return; }
        showConfigDetail(tr.getAttribute('data-config'));
      });
    });
    S.qsa('[data-config-action]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var tr = b.closest('tr');
        var id = tr ? tr.getAttribute('data-config') : '';
        if (b.getAttribute('data-config-action') === 'detail') { showConfigDetail(id); return; }
        S.toast('<b>审批</b>：配置 ' + h(id) + ' 已提交审批流（演示，不写回真实系统）');
      });
    });
    var sync = S.qs('[data-action="sync-model"]');
    if (sync) { sync.addEventListener('click', function () { S.toast('<b>同步</b>：已拉取工厂模型 1 工厂 / 5 装置 / 22 单元 / 19,733 点位（演示）'); }); }
  }
  function showConfigDetail(id) {
    var c = D.alarmConfigs.filter(function (x) { return x.id === id; })[0];
    if (!c) { return; }
    var body = detailGrid([
      ['配置编号', h(c.id)], ['位号', h(c.tag)], ['名称', h(c.name)], ['装置 / 单元', h(deviceName(c.device)) + ' / ' + h(c.unit)],
      ['级别', tag(c.priority)], ['阈值', h(c.threshold)], ['死区', h(c.deadband)], ['延时', h(c.delay)],
      ['使能', tag(c.enabled)], ['搁置', c.shelved === '是' ? '<span class="tag gray">是</span>' : '<span class="sub">否</span>'], ['最近变更', h(c.changed)], ['变更人', h(c.changer)],
      ['审批状态', tag(c.approval)], ['配置来源', 'DCS / 报警服务器同步']
    ]);
    var related = D.configChanges.filter(function (x) { return x.target === c.tag; });
    if (related.length) {
      body += '<div class="card-h" style="margin-top:14px"><h3>变更追溯</h3><span>' + related.length + ' 条</span></div><div class="timeline">' + related.map(function (x) {
        return '<div class="tl-item active"><span class="tl-dot"></span><div class="tl-body"><b>' + h(x.action) + ' · ' + h(x.approval) + '</b><span>' + h(x.time) + ' · ' + h(x.user) + ' · ' + h(x.detail) + '</span></div></div>';
      }).join('') + '</div>';
    } else {
      body += '<div class="note" style="margin-top:12px">暂无该配置的近期变更记录。</div>';
    }
    var tip = c.approval === '待审批' ? '该配置待审批：审批前保持原配置生效，审批后需复核报警灵敏度与死区是否合理。' : '该配置已生效：建议按季度复核阈值、死区、延时与使能状态，并保留变更追溯。';
    body += '<div class="note" style="margin-top:12px">' + h(tip) + '</div>';
    S.detail('报警配置 · ' + c.tag, c.name + ' · ' + c.unit, body);
  }

  S.boot({
    product: 'iaas', code: 'iAAS', name: '报警管理系统',
    subtitle: '报警治理 · 监控 · 处置 · 审计', mark: 'A',
    workspace: '某新材料 · 演示环境', user: '张', date: '2026-10-27',
    defaultPage: 'dashboard', searchPlaceholder: '搜索报警 / 位号 / 单元 / 工单',
    nav: [
      { group: '总览', items: [{ id: 'dashboard', icon: 'dashboard', label: '报警驾驶舱' }] },
      { group: '报警监控', items: [
        { id: 'realtime', icon: 'bell', label: '实时报警', badge: '277' },
        { id: 'timeout', icon: 'bell', label: '超时报警', badge: '689' },
        { id: 'history', icon: 'file', label: '历史报警' },
        { id: 'category', icon: 'quality', label: '分类报警' },
        { id: 'analysis', icon: 'quality', label: '报警分析' }
      ] },
      { group: '实时监控', items: [
        { id: 'interlock', icon: 'settings', label: '联锁管理' },
        { id: 'auto', icon: 'play', label: '自控管理' }
      ] },
      { group: '处置与审计', items: [
        { id: 'disposal', icon: 'play', label: '报警处置' },
        { id: 'disposalLog', icon: 'file', label: '处置记录' },
        { id: 'audit', icon: 'file', label: '审计追踪' }
      ] },
      { group: '统计', items: [
        { id: 'performance', icon: 'dashboard', label: '绩效指标' }
      ] }
    ],
    pages: {
      dashboard: { title: '报警驾驶舱', crumb: '报警驾驶舱', render: renderDashboard, bind: bindDashboard, insight: dashboardInsight },
      realtime: { title: '实时报警', crumb: '实时报警', render: renderRealtime, bind: bindRealtime, insight: realtimeInsight },
      timeout: { title: '超时报警', crumb: '超时报警', render: renderTimeout, bind: bindTimeout, insight: timeoutInsight },
      history: { title: '历史报警', crumb: '历史报警', render: renderHistory, bind: bindHistory, insight: historyInsight },
      category: { title: '分类报警', crumb: '分类报警', render: renderCategory, bind: bindCategory, insight: categoryInsight },
      analysis: { title: '报警分析', crumb: '报警分析', render: renderAnalysis, bind: bindAnalysis, insight: analysisInsight },
      interlock: { title: '联锁管理', crumb: '联锁管理', render: renderInterlock, bind: bindInterlock, insight: interlockInsight },
      auto: { title: '自控管理', crumb: '自控管理', render: renderAuto, bind: bindAuto, insight: autoInsight },
      disposal: { title: '报警处置', crumb: '报警处置', render: renderDisposal, bind: bindDisposal, insight: disposalInsight },
      disposalLog: { title: '处置记录', crumb: '处置记录', render: renderDisposalLog, bind: bindDisposalLog, insight: disposalLogInsight },
      audit: { title: '审计追踪', crumb: '审计追踪', render: renderAudit, bind: bindAudit, insight: auditInsight },
      performance: { title: '绩效指标', crumb: '绩效指标', render: renderPerformance, bind: bindPerformance, insight: perfInsight },
      factory: { title: '工厂模型与报警配置', crumb: '工厂模型与配置', render: renderFactory, bind: bindFactory, insight: factoryInsight }
    }
  });
})();
