(function () {
  var D = window.ICLPM_DEMO;
  var S = window.SimShell;
  var esc = S.esc;
  var seq = 0;
  var TAG = {
    '优良': 'green', '良好': 'green', '合格': 'blue', '警告': 'amber', '不合格': 'red',
    '自动': 'green', '单端': 'amber', '故障': 'red', '手动': 'amber', '失控': 'red',
    '投用优先': 'green', '仅监控': 'blue', '备用回路': 'gray', '禁止自控': 'amber', '不可投用': 'gray',
    '高': 'red', '中': 'amber', '低': 'blue',
    '待诊断': 'amber', '诊断中': 'blue', '已确认': 'green',
    '待复核': 'red', '有整改': 'amber', '验证中': 'blue', '已验证': 'green',
    '待处理': 'amber', '待补数': 'amber', '已转监控': 'blue', '已入运维队列': 'blue',
    '已启用': 'green', '有': 'amber'
  };
  var state = {
    unit: '全部', grade: '全部', status: '全部', severity: '全部', priority: '全部',
    output: '全部', disposal: '全部', dispPriority: '全部', radar: '全厂均值', adopted: 0,
    events: D.disposal.events.map(function (e) {
      return {
        id: e.id, tag: e.tag, unit: e.unit, fault: e.fault, source: e.source, owner: e.owner,
        priority: e.priority, time: e.time, status: e.status, action: e.action, event: e.event,
        history: [{ time: e.time, text: '处置单创建：' + e.event }]
      };
    })
  };

  function h(v) { return esc(v); }
  function nowShort() { return S.nowText().slice(-8); }
  function ts() { return D.meta.date + ' ' + nowShort().slice(0, 5); }
  function tag(s) { return '<span class="tag ' + (TAG[s] || 'gray') + '">' + h(s) + '</span>'; }
  function scoreColor(v) {
    if (v >= 85) { return '#0B9A78'; }
    if (v >= 55) { return '#0EA5E9'; }
    if (v >= 40) { return '#1466E8'; }
    if (v >= 25) { return '#D97706'; }
    return '#DC2626';
  }
  function gradeOf(score) {
    var g = D.grades[0];
    for (var i = 0; i < D.grades.length; i++) {
      if (score >= D.grades[i].min) { g = D.grades[i]; break; }
    }
    return g;
  }
  function pctOf(part, whole) { return Math.round(part / whole * 1000) / 10; }
  function head(kicker, title, sub, actions) {
    return '<div class="page-head"><div><div class="eyebrow">' + h(kicker) + '</div><h1>' + h(title) + '</h1><p>' + h(sub) + '</p></div><div class="head-actions">' + (actions || '') + '</div></div>';
  }
  function kpi(label, value, unit, delta, color, spark) {
    return '<div class="kpi" style="--kc:' + color + '"><div class="k"><span>' + h(label) + '</span>' + (spark || '') + '</div><div class="v">' + h(value) + (unit ? '<small>' + h(unit) + '</small>' : '') + '</div><div class="d">' + delta + '</div></div>';
  }
  function table(headers, rows) {
    return '<div class="table-wrap"><table><thead><tr>' + headers.map(function (x) { return '<th>' + h(x) + '</th>'; }).join('') + '</tr></thead><tbody>' + rows + '</tbody></table></div>';
  }
  function detailGrid(items) {
    return '<div class="detail-grid">' + items.map(function (it) {
      return '<div class="detail-item"><span>' + h(it[0]) + '</span><b>' + it[1] + '</b></div>';
    }).join('') + '</div>';
  }
  function aiCard(text, chips) {
    return '<div class="ai-card" data-ai-open style="cursor:pointer"><div class="ic">' + S.icon('spark') + '</div><div style="flex:1"><h3>AI 分析洞察</h3><p>' + text + '</p><div class="foot">' + (chips || []).map(function (c) { return '<span class="ai-chip">' + h(c) + '</span>'; }).join('') + '</div></div><div class="go"><button class="btn ai" data-ai-open>查看完整分析</button></div></div>';
  }
  function bindJumps() {
    S.qsa('[data-nav-jump]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.getAttribute('data-nav-jump')); });
    });
  }
  function loopByTag(t) { return D.loops.filter(function (l) { return l.tag === t; })[0]; }
  function eventById(id) { return state.events.filter(function (e) { return e.id === id; })[0]; }
  function unitTotals() {
    var m = {};
    D.unitsTree.forEach(function (g) {
      if (g.children && g.children.length) {
        g.children.forEach(function (c) {
          if (c.name !== '其他装置' && c.name !== '公用工程其他') { m[c.name] = c.loops; }
        });
      } else { m[g.name] = g.loops; }
    });
    return m;
  }
  function filteredLoops() {
    return D.loops.filter(function (l) {
      if (state.unit !== '全部' && l.unit !== state.unit) { return false; }
      if (state.grade !== '全部' && l.grade !== state.grade) { return false; }
      if (state.status !== '全部' && l.status !== state.status) { return false; }
      return true;
    });
  }
  function filteredOsc() {
    return D.oscillations.filter(function (o) { return state.severity === '全部' || o.severity === state.severity; });
  }
  function filteredSuggestions() {
    return D.suggestions.filter(function (s) {
      if (state.priority !== '全部' && s.priority !== state.priority) { return false; }
      if (state.output !== '全部' && s.output !== state.output) { return false; }
      return true;
    });
  }
  function filteredEvents() {
    return state.events.filter(function (e) {
      if (state.disposal !== '全部' && e.status !== state.disposal) { return false; }
      if (state.dispPriority !== '全部' && e.priority !== state.dispPriority) { return false; }
      return true;
    });
  }
  function disposalCounts() {
    var c = { '待复核': 0, '有整改': 0, '验证中': 0, '已验证': 0 };
    state.events.forEach(function (e) { if (c[e.status] != null) { c[e.status] += 1; } });
    c.pending = c['待复核']; c.fix = c['有整改']; c.verify = c['验证中']; c.done = c['已验证'];
    c.todo = c.pending + c.fix + c.verify;
    return c;
  }
  function oscSev(t) {
    var o = D.oscillations.filter(function (x) { return x.tag === t; })[0];
    return o ? o.severity : '有';
  }
  function nextLabel(st) {
    var m = { '待复核': '转有整改', '有整改': '提交验证', '验证中': '确认关闭' };
    return m[st] || '查看';
  }
  function avgConfidence(list) {
    if (list && !list.length) { return 0; }
    var arr = list || D.suggestions;
    var sum = arr.reduce(function (a, s) { return a + s.confidence; }, 0);
    return Math.round(sum / arr.length * 100) / 100;
  }
  function dimList(dims) {
    return D.radar.axes.map(function (ax, i) {
      var v = dims[i];
      return '<div style="display:flex;align-items:center;gap:8px;padding:5px 0;border-bottom:1px solid #EEF2F7"><span style="min-width:44px;font-size:11px;color:#64748B">' + h(ax) + '</span><div class="progress" style="flex:1;height:6px"><span style="width:' + v + '%;background:' + scoreColor(v) + '"></span></div><b style="min-width:36px;text-align:right;font-size:11.5px">' + v.toFixed(1) + '</b></div>';
    }).join('');
  }
  function radarData(key) {
    if (!key || key === '全厂均值') {
      return { name: '全厂均值', dims: D.radar.plant.dims, score: D.radar.plant.score };
    }
    var l = loopByTag(key);
    if (!l) { return { name: '全厂均值', dims: D.radar.plant.dims, score: D.radar.plant.score }; }
    return { name: l.tag + ' · ' + l.name, dims: l.dims, score: l.score };
  }
  function radarSvg(dims, labels, color) {
    var w = 340, h = 300, cx = 170, cy = 150, r = 96, n = dims.length;
    function angle(i) { return -Math.PI / 2 + i * 2 * Math.PI / n; }
    function pt(i, rad) { return (cx + Math.cos(angle(i)) * rad).toFixed(1) + ',' + (cy + Math.sin(angle(i)) * rad).toFixed(1); }
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" style="width:100%;height:auto" role="img" aria-label="六维绩效雷达">';
    [0.25, 0.5, 0.75, 1].forEach(function (k) {
      var pts = [];
      for (var i = 0; i < n; i++) { pts.push(pt(i, r * k)); }
      s += '<polygon points="' + pts.join(' ') + '" fill="none" stroke="#E2E8F0" stroke-width="1"/>';
    });
    for (var a = 0; a < n; a++) {
      s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + (cx + Math.cos(angle(a)) * r).toFixed(1) + '" y2="' + (cy + Math.sin(angle(a)) * r).toFixed(1) + '" stroke="#E2E8F0" stroke-width="1"/>';
    }
    var dataPts = dims.map(function (v, i) { return pt(i, r * Math.max(4, v) / 100); });
    s += '<polygon points="' + dataPts.join(' ') + '" fill="' + color + '" fill-opacity=".16" stroke="' + color + '" stroke-width="2" stroke-linejoin="round"/>';
    dims.forEach(function (v, i) {
      var x = cx + Math.cos(angle(i)) * r * Math.max(4, v) / 100;
      var y = cy + Math.sin(angle(i)) * r * Math.max(4, v) / 100;
      s += '<circle cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="3" fill="#fff" stroke="' + color + '" stroke-width="1.8"/>';
    });
    dims.forEach(function (v, i) {
      var ang = angle(i);
      var lx = cx + Math.cos(ang) * (r + 16);
      var ly = cy + Math.sin(ang) * (r + 16);
      var anchor = Math.cos(ang) > 0.35 ? 'start' : (Math.cos(ang) < -0.35 ? 'end' : 'middle');
      var dy = Math.sin(ang) < -0.5 ? -2 : (Math.sin(ang) > 0.5 ? 11 : 4);
      s += '<text x="' + lx.toFixed(1) + '" y="' + (ly + dy).toFixed(1) + '" text-anchor="' + anchor + '" font-size="10" fill="#64748B">' + esc(labels[i]) + '</text>';
    });
    s += '<text x="' + cx + '" y="' + (cy - r - 5) + '" text-anchor="middle" font-size="9" fill="#94A3B8">100</text>';
    s += '</svg>';
    return s;
  }
  function confCell(v) {
    var color = v >= 0.6 ? '#0B9A78' : '#D97706';
    return '<div style="display:flex;align-items:center;gap:6px"><b style="font-size:11px">' + v.toFixed(2) + '</b><div class="progress" style="width:52px;flex:0 0 52px;height:5px"><span style="width:' + (v * 100) + '%;background:' + color + '"></span></div></div>';
  }

  /* ---------- AI 洞察 ---------- */
  function dashboardInsight() {
    var k = D.kpi;
    var c = disposalCounts();
    var open = c.todo;
    var lowUnit = D.unitSmooth.slice().sort(function (a, b) { return a.value - b.value; })[0];
    var topUnit = D.unitSmooth.slice().sort(function (a, b) { return b.value - a.value; })[0];
    return {
      time: nowShort(), basis: '驾驶舱 · 当前快照',
      summary: '全厂 <b>961</b> 条回路中 <b>773</b> 条不可投用，实际参评 <b>188</b> 条；综合评分 <b>57.63（良好）</b>，自动投用率 <b>82.20%</b>，退化 <b>75</b> 条（占参评 39.9%）。',
      findings: [
        '适用性预筛把 773 条不可投用回路排除在评分外，避免用“低自控率”掩盖工艺适用性问题。',
        '六维中准确率 88.6 最高、振荡率 51.8 最低；单元平稳率 ' + lowUnit.unit + ' ' + lowUnit.value.toFixed(2) + ' 最低，' + topUnit.unit + ' ' + topUnit.value.toFixed(2) + ' 最高。',
        '处置队列：待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify + '；预警事件 352 条（未确认 282，按时率 68%）。'
      ],
      actions: [
        '先处理 OPU（平稳率 53.60）与 2EH 反应器进料回路振荡，优先 75 条退化回路中评分低于 40 分的部分。',
        '把 78 条投用优先回路中评分 40–55 的回路排入下一批整定，目标自动投用率 ≥85%。',
        '复核 773 条不可投用的判定依据，确认是否存在“一刀切”漏投。'
      ],
      evidence: ['评分 57.63', '自动 82.20%', '参评 188', '退化 75', '待办 ' + open]
    };
  }
  function loopsInsight() {
    var list = filteredLoops();
    var bad = list.filter(function (l) { return l.grade === '不合格' || l.grade === '警告'; }).length;
    var manual = list.filter(function (l) { return l.status === '手动' || l.status === '失控'; }).length;
    var lowest = list.slice().sort(function (a, b) { return a.score - b.score; });
    return {
      time: nowShort(), basis: '回路列表 · ' + state.unit + ' / ' + state.grade + ' / ' + state.status,
      summary: '当前筛选 <b>' + list.length + ' 个样本回路</b>（全厂 961，参评 188）；警告/不合格 <b>' + bad + '</b>，手动/失控 <b>' + manual + '</b>。',
      findings: lowest.length ? [
        '最低分：' + lowest[0].tag + '（' + lowest[0].unit + '，' + lowest[0].score.toFixed(2) + '，' + lowest[0].grade + '），' + lowest[0].note + '。',
        '六维对比：' + (lowest[1] ? lowest[1].tag + ' ' + lowest[1].score.toFixed(2) + '，' + lowest[1].note : '当前筛选样本不足') + '。',
        '全厂 961 条回路中仅 188 条进入评分，投用优先 78 条是下一批整定重点。'
      ] : ['当前筛选无回路，请放宽单元/等级/状态条件。'],
      actions: [
        '先看评分最低 3 条的六维构成，确认是自控率、振荡还是平稳率拖累。',
        '对“手动 + 振荡 + 阀门粘滞”组合的回路，先检修再谈整定。',
        '筛选“严禁自控/不可投用”回路时不做自控率考核，避免误判。'
      ],
      evidence: ['筛选 ' + list.length, '警告/不合格 ' + bad, '手动/失控 ' + manual, '全厂 961']
    };
  }
  function performanceInsight() {
    var p = D.radar.plant;
    var lowUnit = D.unitSmooth.slice().sort(function (a, b) { return a.value - b.value; })[0];
    return {
      time: nowShort(), basis: '性能总览 · 全厂 961 条',
      summary: '961 条回路预筛后 <b>188</b> 条参评，综合 <b>57.63（良好）</b>，自动投用率 <b>82.20%</b>，退化 <b>75</b> 条（占参评 39.9%）。',
      findings: [
        '适用性分布：不可投用 773 / 仅监控 39 / 备用 2 / 禁止自控 69 / 投用优先 78，合计 961。',
        '六维中准确率 88.6 最高、振荡率 51.8 最低；综合分按权重折算，非算术平均。',
        '单元平稳率 ' + lowUnit.unit + ' ' + lowUnit.value.toFixed(2) + ' 最低、2EH 89.60 最高；装置评分为生产装置 57.94、公用工程 44.08。'
      ],
      actions: [
        '优先治理 OPU 平稳率（53.60）和振荡率最低的回路，别只盯综合分。',
        '把 78 条投用优先回路按评分排序，先整定 40–55 分区间，收益最快。',
        '复核 773 条不可投用与 69 条禁止自控的判定依据，避免漏投或误排除。'
      ],
      evidence: ['961 回路', '参评 188', '评分 57.63', '退化 75', 'OPU 53.60']
    };
  }
  function diagnosisInsight() {
    var s = D.diagnosis.summary;
    var c = disposalCounts();
    var p = D.diagnosis.pareto;
    var top2 = p[0].count + p[1].count;
    var total = p.reduce(function (a, x) { return a + x.count; }, 0);
    return {
      time: nowShort(), basis: '诊断总览 · 引擎 ' + D.diagnosis.engine.name,
      summary: '本轮 <b>5 条诊断</b>、<b>72 个回路良好</b>、<b>3 个系统性问题</b>已入运维队列；平均耗时 <b>17.50 s</b>（达标），置信度均值 <b>0.60</b>（3 条高置信）。',
      findings: [
        '近 7 天 ' + total + ' 条诊断故障中，阀门粘滞 ' + p[0].count + ' + 振荡 ' + p[1].count + ' 占 ' + pctOf(top2, total) + '%，是主因。',
        '疑似故障阀 Top：D4LC03501_PID 阀门粘滞 0.90、FIC-1201 振荡 0.90；均需现场确认后再整改。',
        '处置队列：待复核 ' + c.pending + '、有整改 ' + c.fix + '、验证中 ' + c.verify + '；诊断结论均带命中规则、断言数与决策结果。'
      ],
      actions: [
        '先复核 3 条待复核诊断，确认影响范围后转有整改。',
        '对 OPU 共享仪表/阀内件做批量排查（SYS-20261027-01）。',
        'FIC-3405 补采 72 h 数据（当前覆盖 41%），再重跑诊断。'
      ],
      evidence: ['5 条诊断', '72 良好', '17.50 s', '置信度 0.60', 'Pareto ' + pctOf(top2, total) + '%']
    };
  }
  function oscInsight() {
    var list = filteredOsc();
    var high = list.filter(function (o) { return o.severity === '高'; }).length;
    var sorted = list.slice().sort(function (a, b) { return b.confidence - a.confidence; });
    return {
      time: nowShort(), basis: '振荡检测 · ' + state.severity,
      summary: '当前 <b>' + list.length + ' 个振荡案例</b>，高严重度 <b>' + high + '</b>；全厂六维“振荡率”51.8 为最低维度。',
      findings: sorted.length ? [
        sorted[0].tag + '（' + sorted[0].unit + '）周期 ' + sorted[0].period + '、振幅 ' + sorted[0].amplitude + '，' + sorted[0].cause + '，置信度 ' + sorted[0].confidence.toFixed(2) + '。',
        (sorted[1] ? sorted[1].tag + '（' + sorted[1].unit + '）' + sorted[1].period + ' / ' + sorted[1].amplitude + '，' + sorted[1].cause + '。' : '当前筛选案例不足。'),
        high ? '高严重度 ' + high + ' 个：' + list.filter(function (o) { return o.severity === '高'; }).map(function (o) { return o.tag; }).join('、') + '，均需先确认阀门/工艺扰动。' : '当前筛选无高严重度案例，可切换严重度复查。'
      ] : ['当前筛选无振荡案例，可切换严重度查看全部。'],
      actions: [
        sorted.length ? '先处理 ' + sorted[0].tag + '：' + sorted[0].cause + '；确认原因后再调整增益/滤波。' : '切换严重度查看全部案例。',
        sorted[1] ? '同步排查 ' + sorted[1].tag + '（' + sorted[1].period + ' / ' + sorted[1].amplitude + '），避免同类扰动扩散。' : '复测当前案例，确认是否为偶发扰动。',
        '手动状态与置信度低于 0.60 的案例先补数，不做参数结论。'
      ],
      evidence: ['案例 ' + list.length, '高 ' + high, '振荡率 51.8']
    };
  }
  function tuningInsight() {
    var list = filteredSuggestions();
    var high = list.filter(function (s) { return s.priority === '高'; }).length;
    var noParam = list.filter(function (s) { return s.output !== '参数建议'; }).length;
    var findings = list.length ? list.slice(0, 3).map(function (s) {
      return s.tag + '：' + s.target + '（' + s.output + '，置信度 ' + s.confidence.toFixed(2) + '，' + s.gate + '）。';
    }) : ['当前筛选无整定建议，可放宽优先级或输出类型。'];
    return {
      time: nowShort(), basis: '整定建议 · ' + state.priority + ' / ' + state.output,
      summary: '当前 <b>' + list.length + ' 条建议</b>，高优先级 <b>' + high + '</b>，平均置信度 ' + avgConfidence(list).toFixed(2) + '；平台只输出建议，不写 DCS。',
      findings: findings,
      actions: [
        high ? '按高优先级 ' + high + ' 条推进，参数由授权人员在 DCS 侧手工实施并双人复核。' : '当前筛选无高优先级建议，先处理待补数/待检修项，再评估参数。',
        '采纳后转处置，72 h 复测绩效再关闭，当前已转处置 ' + state.adopted + ' 条。',
        '持续回写建议留痕（模型版本、命中规则、确认人），严禁自动下发。'
      ],
      evidence: ['建议 ' + list.length, '高 ' + high, '不写 DCS', '已转处置 ' + state.adopted, '需补验证 ' + noParam]
    };
  }
  function disposalInsight() {
    var list = filteredEvents();
    var c = disposalCounts();
    var pendingTop = list.filter(function (e) { return e.status === '待复核'; })[0];
    var fixTop = list.filter(function (e) { return e.status === '有整改'; })[0];
    return {
      time: nowShort(), basis: '处置中心 · ' + state.disposal + ' / ' + state.dispPriority,
      summary: '当前筛选 <b>' + list.length + ' 条处置单</b>；待办 <b>' + c.todo + ' 条</b>（待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify + '），已验证 ' + c.done + ' 条。',
      findings: [
        pendingTop ? '待复核优先：' + pendingTop.id + '（' + pendingTop.tag + ' ' + pendingTop.fault + '），' + pendingTop.action + '。' : '当前无待复核处置单。',
        fixTop ? '有整改：' + fixTop.id + '（' + fixTop.tag + ' ' + fixTop.fault + '），' + fixTop.action + '。' : '当前无有整改处置单。',
        '验证中 ' + c.verify + ' 条：FIC-2201 已实施 Kp 1.10 / Ti 50 s，待 72 h 复测；参数改动仅在 DCS 侧人工执行。'
      ],
      actions: [
        '先处理待复核 ' + c.pending + ' 条，确认影响范围后转有整改。',
        '整改单明确责任人与完成时间，任何参数不通过平台写 DCS。',
        '验证满 72 h 后回写评分与结论，闭环归档。'
      ],
      evidence: ['筛选 ' + list.length, '待复核 ' + c.pending, '有整改 ' + c.fix, '验证中 ' + c.verify, '已验证 ' + c.done]
    };
  }

  /* ---------- 驾驶舱 ---------- */
  function renderDashboard() {
    var k = D.kpi;
    var c = disposalCounts();
    var open = c.todo;
    var lowUnit = D.unitSmooth.slice().sort(function (a, b) { return a.value - b.value; })[0];
    var focus = D.loops.slice().sort(function (a, b) { return a.score - b.score; }).slice(0, 4);
    var dims = D.radar.plant.dims.map(function (v, i) { return { label: D.radar.axes[i].replace('率', ''), value: v }; });
    var labels = D.trend.map(function (_, i) { return i % 4 === 3 ? (i + 1) + 'h' : ''; });
    var html = head('iCLPM / 总览', '控制回路绩效监控驾驶舱', '961 个回路 · 六维绩效 · 适用性预筛 · 当前快照（演示合成数据）', '<button class="btn" data-action="refresh">刷新</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('全厂综合评分', k.score, '分', '<span class="up">' + k.scoreDelta + '</span> 环比 · ' + k.grade, '#0B9A78', S.chart.spark([54.1, 54.8, 55.2, 56.1, 56.7, 57.1, 57.63], '#0B9A78'));
    html += kpi('自动投用率', k.autoRate.toFixed(2), '%', '<span class="up">' + k.autoDelta + '</span> 环比 · 目标 ≥85%', '#0EA5E9', S.chart.spark([70.2, 74.1, 76.4, 79.2, 80.6, 81.4, 82.2], '#0EA5E9'));
    html += kpi('回路总数', k.loops, '个', '生产 899 / 公用 39 / 特戊 23', '#1466E8', S.chart.spark([946, 948, 950, 953, 956, 959, 961], '#1466E8'));
    html += kpi('退化回路', k.badLoops, '个', '<span class="up">' + k.badDelta + '</span> 环比 · 占参评 ' + pctOf(k.badLoops, k.applicable) + '%', '#D97706', S.chart.spark([93, 89, 86, 82, 79, 77, 75], '#D97706'));
    html += kpi('预警事件', k.events, '个', '未确认 ' + k.unconfirmed + ' · 按时率 ' + k.onTime + '%', '#F59E0B', S.chart.spark([318, 326, 330, 338, 342, 348, 352], '#F59E0B'));
    html += kpi('处置待办', open, '个', '待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify, '#6D28D9', S.chart.spark([8, 7, 7, 6, 7, 6, open], '#6D28D9'));
    html += '</div>';
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span style="flex:1"><b>适用性预筛</b>：961 条中 773 条不可投用、39 条仅监控、69 条禁止自控、2 条备用、78 条投用优先；实际参评 188 条，综合 57.63（良好）。</span><button class="btn small" data-nav-jump="performance" style="flex:0 0 auto">查看性能 →</button></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>绩效趋势</h3><span>综合评分 · 近 24h</span></div><div class="chart">' + S.chart.line(D.trend, { labels: labels, target: 55, min: 48, max: 62, fixed: 1, color: '#1466E8' }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>综合评分</span><span><i style="background:#F59E0B"></i>良好线 55</span></div></div><div class="card"><div class="card-h"><h3>六维绩效</h3><span>全厂均值 · 综合 57.63</span></div><div class="chart">' + S.chart.bars(dims, { height: 240, color: '#0B9A78' }) + '</div><div class="sub" style="margin-top:6px">综合分按权重并对低分维度惩罚折算，非六维算术平均。</div></div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>单元平稳率</h3><span>5 个主要单元 · 576 条回路</span></div>';
    D.unitSmooth.forEach(function (u) {
      html += '<div style="display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid #EEF2F7"><span style="width:38px;font-size:11.5px">' + h(u.unit) + '</span><div class="progress" style="flex:1;height:7px"><span style="width:' + u.value + '%;background:' + scoreColor(u.value) + '"></span></div><b style="min-width:48px;text-align:right;font-size:11.5px;color:' + scoreColor(u.value) + '">' + u.value.toFixed(2) + '</b></div>';
    });
    html += '<div class="sub" style="margin-top:8px">' + lowUnit.unit + ' 最低（53.60），OPU 平稳率需优先治理。</div><div style="margin-top:10px"><button class="btn small" data-nav-jump="performance">性能总览 →</button></div></div><div class="card"><div class="card-h"><h3>重点回路</h3><span>低分 / 振荡</span></div>';
    focus.forEach(function (l) {
      html += '<div style="display:flex;align-items:center;gap:8px;padding:6px 0;border-bottom:1px solid #EEF2F7"><span class="mono" style="min-width:96px">' + h(l.tag) + '</span><span style="flex:1;font-size:11.5px">' + h(l.name) + '</span>' + tag(l.grade) + '<b style="font-size:11.5px;color:' + scoreColor(l.score) + ';min-width:44px;text-align:right">' + l.score.toFixed(2) + '</b></div>';
    });
    html += '<div style="margin-top:10px"><button class="btn small" data-nav-jump="loops">回路列表 →</button></div></div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>按装置综合评分</h3><span>生产装置 / 公用工程</span></div>';
    D.deviceScores.forEach(function (d) {
      var gd = gradeOf(d.score);
      html += '<div style="display:flex;align-items:center;gap:12px;padding:10px 12px;border:1px solid #EEF2F7;border-radius:9px;margin-bottom:8px"><div style="flex:1"><b style="font-size:12.5px">' + h(d.name) + '</b><div class="sub">' + h(d.detail) + ' · ' + d.loops + ' 条回路</div></div><div style="text-align:right"><div style="font-size:22px;font-weight:900;color:' + scoreColor(d.score) + ';line-height:1.1">' + d.score.toFixed(2) + '</div>' + tag(gd.name) + '</div></div>';
    });
    html += '<div class="sub">特戊车间 23 条回路处于试车阶段，暂不纳入装置评分。</div></div><div class="card"><div class="card-h"><h3>处置队列</h3><span>待办 ' + open + ' 条</span></div>';
    [['待复核', c.pending, '#DC2626'], ['有整改', c.fix, '#D97706'], ['验证中', c.verify, '#0EA5E9']].forEach(function (r) {
      html += '<div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid #EEF2F7"><span style="min-width:52px;font-size:11.5px">' + h(r[0]) + '</span><div class="progress" style="flex:1;height:7px"><span style="width:' + Math.min(100, r[1] * 20) + '%;background:' + r[2] + '"></span></div><b style="min-width:20px;text-align:right;font-size:11.5px">' + r[1] + '</b></div>';
    });
    html += '<div class="sub" style="margin-top:8px">状态流转需人工确认；整定参数只输出建议，不写 DCS。</div><div style="margin-top:10px"><button class="btn small" data-nav-jump="disposal">处置中心 →</button></div></div></div>';
    html += aiCard('全厂 961 条回路中 773 条不可投用，实际参评 188 条；综合 57.63（良好），自动投用率 82.20%，退化 75 条（占参评 39.9%）。六维中准确率 88.6 最高、振荡率 51.8 最低；' + lowUnit.unit + ' 平稳率 ' + lowUnit.value.toFixed(2) + ' 最低。', ['评分 57.63', '自动 82.20%', '退化 75', '待办 ' + open]);
    return html;
  }
  function bindDashboard() {
    var r = S.qs('[data-action="refresh"]');
    if (r) { r.addEventListener('click', function () { S.toast('<b>刷新</b>：已拉取 ' + nowShort() + ' 演示快照（961 条回路 / 参评 188）'); }); }
    bindJumps();
  }

  /* ---------- 回路列表 ---------- */
  function renderLoops() {
    var list = filteredLoops();
    var totals = unitTotals();
    var units = ['2EH', 'BD', 'MTO', 'OPU', 'UT', '特戊车间'];
    var html = head('iCLPM / 回路', '控制回路列表', '全厂 961 个回路，列表抽样 19 个代表回路；按单元 / 等级 / 状态筛选。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>961 条回路</b> · 适用性预筛后参评 188 条 · 退化 75 条 · 当前列表为 19 个代表回路抽样，完整清单由正式系统分页提供。</span></div>';
    html += '<div class="filters"><select id="lUnit"><option value="全部">全部单元</option>' + units.map(function (u) { return '<option value="' + h(u) + '"' + (state.unit === u ? ' selected' : '') + '>' + h(u) + '（' + (totals[u] || 0) + '）</option>'; }).join('') + '</select><select id="lGrade"><option value="全部">全部等级</option>' + D.grades.map(function (g) { return '<option value="' + h(g.name) + '"' + (state.grade === g.name ? ' selected' : '') + '>' + h(g.name) + '</option>'; }).join('') + '</select><select id="lStatus"><option value="全部">全部状态</option>' + ['自动', '单端', '故障', '手动', '失控'].map(function (s) { return '<option' + (state.status === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><span class="count">当前筛选 ' + list.length + ' 个 · 全厂 961 · 参评 188</span></div>';
    var rows = list.map(function (l) {
      return '<tr data-loop="' + h(l.tag) + '"><td class="mono">' + h(l.tag) + '</td><td>' + h(l.name) + '</td><td>' + h(l.unit) + '</td><td><b style="color:' + scoreColor(l.score) + '">' + l.score.toFixed(2) + '</b></td><td>' + tag(l.grade) + '</td><td>' + tag(l.status) + '</td><td>' + tag(l.fit) + '</td><td>' + (l.osc === '有' ? tag(oscSev(l.tag)) : '—') + '</td><td>' + (l.stiction === '有' ? tag('有') : '—') + '</td></tr>';
    }).join('');
    if (!rows) { rows = '<tr><td colspan="9" class="sub">当前筛选无回路，请放宽条件。</td></tr>'; }
    html += table(['位号', '名称', '单元', '绩效分', '等级', '状态', '适用性', '振荡', '黏滞'], rows);
    html += aiCard('当前筛选 ' + list.length + ' 个样本回路，警告/不合格 ' + list.filter(function (l) { return l.grade === '不合格' || l.grade === '警告'; }).length + ' 个、手动/失控 ' + list.filter(function (l) { return l.status === '手动' || l.status === '失控'; }).length + ' 个。先处理低分 + 手动 + 振荡组合。', ['筛选 ' + list.length, '全厂 961', '参评 188']);
    return html;
  }
  function bindLoops() {
    [['lUnit', 'unit'], ['lGrade', 'grade'], ['lStatus', 'status']].forEach(function (pair) {
      var el = S.qs('#' + pair[0]);
      if (el) { el.addEventListener('change', function (e) { state[pair[1]] = e.target.value; S.go('loops'); }); }
    });
    S.qsa('tr[data-loop]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var l = loopByTag(tr.getAttribute('data-loop'));
        if (!l) { return; }
        var gd = gradeOf(l.score);
        var body = detailGrid([['位号', h(l.tag)], ['名称', h(l.name)], ['单元', h(l.unit)], ['绩效分', '<b style="color:' + scoreColor(l.score) + '">' + l.score.toFixed(2) + '</b>'], ['等级', tag(gd.name)], ['运行状态', tag(l.status)], ['适用性', tag(l.fit)], ['振荡 / 黏滞', (l.osc === '有' ? tag(oscSev(l.tag)) : '无') + ' / ' + (l.stiction === '有' ? tag('有') : '无')]]);
        body += '<div style="margin-top:14px"><div class="card-h"><h3>六维绩效</h3><span>综合 ' + l.score.toFixed(2) + ' · ' + gd.name + '</span></div>' + radarSvg(l.dims, D.radar.axes, scoreColor(l.score)) + dimList(l.dims) + '<div class="sub" style="margin-top:8px">综合分按权重折算，非六维算术平均。</div></div>';
        body += '<div style="margin-top:12px"><div class="card-h"><h3>诊断说明</h3><span>演示口径</span></div><div class="sub" style="line-height:1.7">' + h(l.note) + '。建议结合振荡检测、诊断总览与整定建议页查看处理路径。</div></div>';
        S.detail('回路详情 · ' + l.tag, l.name + ' · ' + l.unit, body);
      });
    });
  }

  /* ---------- 性能 ---------- */
  function renderPerformance() {
    var k = D.kpi;
    var rd = radarData(state.radar);
    var gd = gradeOf(rd.score);
    var opts = '<option value="全厂均值"' + (state.radar === '全厂均值' ? ' selected' : '') + '>全厂均值</option>' + D.radar.tags.map(function (t) { var l = loopByTag(t); return '<option value="' + h(t) + '"' + (state.radar === t ? ' selected' : '') + '>' + h(t) + (l ? ' · ' + h(l.name) : '') + '</option>'; }).join('');
    var html = head('iCLPM / 性能', '全厂绩效评估', '961 个回路 · 五档评分 · 六维绩效 · 适用性预筛（演示合成数据）', '<button class="btn" data-action="criteria">评分口径</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('全厂综合评分', k.score, '分', '<span class="up">' + k.scoreDelta + '</span> 环比 · ' + k.grade, '#0B9A78', S.chart.spark([54.1, 54.8, 55.2, 56.1, 56.7, 57.1, 57.63], '#0B9A78'));
    html += kpi('自动投用率', k.autoRate.toFixed(2), '%', '<span class="up">' + k.autoDelta + '</span> 环比 · 目标 ≥85%', '#0EA5E9', S.chart.spark([70.2, 74.1, 76.4, 79.2, 80.6, 81.4, 82.2], '#0EA5E9'));
    html += kpi('回路总数', k.loops, '个', '生产 899 / 公用 39 / 特戊 23', '#1466E8', S.chart.spark([946, 948, 950, 953, 956, 959, 961], '#1466E8'));
    html += kpi('参评回路', k.applicable, '个', '预筛剔除 ' + k.excluded + ' · 参评率 ' + pctOf(k.applicable, k.loops) + '%', '#0EA5E9', S.chart.spark([172, 176, 179, 181, 184, 186, 188], '#0EA5E9'));
    html += kpi('退化回路', k.badLoops, '个', '<span class="up">' + k.badDelta + '</span> 环比 · 占参评 ' + pctOf(k.badLoops, k.applicable) + '%', '#D97706', S.chart.spark([93, 89, 86, 82, 79, 77, 75], '#D97706'));
    html += kpi('单元平稳率', 73.32, '%', '5 个主要单元加权 · OPU 最低', '#0B9A78', S.chart.spark([71.2, 71.6, 72.1, 72.6, 73.0, 73.2, 73.32], '#0B9A78'));
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>回路适用性预筛</h3><span>961 条全量</span></div>' + S.chart.donut(D.applicability.map(function (a) { return { label: a.key, value: a.value, color: a.color }; }), '961', '回路') + D.applicability.map(function (a) {
      return '<div style="display:flex;gap:8px;padding:6px 0;border-bottom:1px solid #EEF2F7"><span style="width:8px;height:8px;border-radius:2px;background:' + a.color + ';margin-top:6px;flex:0 0 8px"></span><div style="flex:1"><div style="display:flex;justify-content:space-between;gap:8px"><b style="font-size:11.5px">' + h(a.key) + '</b><span style="font-size:11.5px;color:#334155"><b>' + a.value + '</b> 条 · ' + pctOf(a.value, 961) + '%</span></div><div class="sub">' + h(a.desc) + '</div></div></div>';
    }).join('') + '<div class="sub" style="margin-top:8px;line-height:1.7">预筛逻辑：先判定“是否适合自动控制”，再评价剩余回路绩效；773 条不可投用不进入评分，避免用自控率掩盖适用性问题。</div></div>';
    html += '<div class="card"><div class="card-h"><h3>六维绩效雷达</h3><span>' + h(rd.name) + '</span></div><div class="filters" style="margin-bottom:8px"><select id="perfRadar">' + opts + '</select></div><div style="display:flex;gap:14px;align-items:flex-start;flex-wrap:wrap"><div style="flex:1 1 240px;min-width:230px">' + radarSvg(rd.dims, D.radar.axes, scoreColor(rd.score)) + '</div><div style="flex:1 1 170px;min-width:170px">' + dimList(rd.dims) + '<div style="margin-top:10px;padding:10px;border:1px solid #EEF2F7;border-radius:8px;background:#F8FAFC"><div class="sub">综合评分</div><div style="display:flex;align-items:center;gap:8px"><b style="font-size:24px;line-height:1.2">' + rd.score.toFixed(2) + '</b>' + tag(gd.name) + '</div></div></div></div><div class="sub" style="margin-top:8px;line-height:1.7">综合分不是六维算术平均（样例 D4LC03501_PID 六维均值 79.2、综合 59.27），平台按权重与低分惩罚折算。</div></div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>单元平稳率</h3><span>5 个主要单元 · 576 条回路</span></div><div class="chart">' + S.chart.bars(D.unitSmooth.map(function (u) { return { label: u.unit, value: u.value }; }), { height: 230, color: '#0B9A78', target: 80 }) + '</div><div class="legend"><span><i style="background:#0B9A78"></i>平稳率</span><span><i style="background:#F59E0B"></i>目标 80</span></div><div class="sub">覆盖 576 / 961 条回路（59.9%），加权均值 73.32%；OPU 53.60 最低。</div></div><div class="card"><div class="card-h"><h3>评分档位分布</h3><span>188 条参评回路</span></div>';
    D.grades.forEach(function (gg) {
      var pct = pctOf(gg.count, 188);
      html += '<div style="display:flex;align-items:center;gap:9px;padding:7px 0;border-bottom:1px solid #EEF2F7"><span style="min-width:44px">' + tag(gg.name) + '</span><span class="sub" style="min-width:62px">' + gg.min + '–' + gg.max + ' 分</span><div class="progress" style="flex:1;height:7px"><span style="width:' + pct + '%;background:' + gg.color + '"></span></div><b style="min-width:74px;text-align:right;font-size:11.5px">' + gg.count + ' 条 · ' + pct + '%</b></div>';
    });
    html += '<div class="sub" style="margin-top:8px;line-height:1.7">档位：优良 ≥85 / 良好 ≥55 / 合格 ≥40 / 警告 ≥25 / 不合格 &lt;25。</div></div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>按装置综合评分</h3><span>装置级汇总</span></div>';
    D.deviceScores.forEach(function (d) {
      var dg = gradeOf(d.score);
      html += '<div style="display:flex;align-items:center;gap:12px;padding:12px;border:1px solid #EEF2F7;border-radius:9px;margin-bottom:8px"><div style="flex:1"><b style="font-size:12.5px">' + h(d.name) + '</b><div class="sub">' + h(d.detail) + ' · ' + d.loops + ' 条回路</div></div><div style="text-align:right"><div style="font-size:26px;font-weight:900;color:' + scoreColor(d.score) + ';line-height:1.1">' + d.score.toFixed(2) + '</div>' + tag(dg.name) + '</div></div>';
    });
    html += '<div class="sub">特戊车间 23 条回路处于试车阶段，暂不纳入装置评分；生产装置含 2EH/BD/MTO/OPU。</div></div><div class="card"><div class="card-h"><h3>评分口径</h3><span>可追溯到每个回路</span></div><ul style="margin:0;padding-left:16px;display:grid;gap:7px;font-size:12px;color:#334155;line-height:1.65"><li>五档：优良 ≥85 / 良好 ≥55 / 合格 ≥40 / 警告 ≥25 / 不合格 &lt;25。</li><li>综合分不是六维算术平均，按维度权重并对低分维度惩罚折算。</li><li>退化回路：评分较上周期下降 ≥5 分，或连续 3 天低于良好线。</li><li>单元平稳率：单元内 PV 平稳时间占比加权均值，5 个主要单元覆盖 576 条回路（59.9%）。</li><li>自动投用率与适用性预筛分开统计，不可投用回路不进入自控率考核。</li></ul></div></div>';
    html += aiCard('961 条回路预筛后 188 条参评，综合 57.63（良好），自动投用率 82.20%，退化 75 条（占参评 39.9%）。不可投用 773 条被排除评分；六维中准确率 88.6 最高、振荡率 51.8 最低，OPU 平稳率 53.60 最低。', ['961 回路', '参评 188', '评分 57.63', '退化 75', 'OPU 53.60']);
    return html;
  }
  function bindPerformance() {
    var f = S.qs('#perfRadar');
    if (f) { f.addEventListener('change', function (e) { state.radar = e.target.value; S.go('performance'); }); }
    var c = S.qs('[data-action="criteria"]');
    if (c) {
      c.addEventListener('click', function () {
        var body = '<div class="sub" style="line-height:1.75">评分面向 188 条参评回路（961 条中剔除 773 条不可投用）。五档档位、六维与综合分的折算口径如下：</div>';
        body += '<div style="margin-top:12px">' + table(['档位', '分数区间', '回路数', '占比'], D.grades.map(function (g) { return '<tr><td>' + tag(g.name) + '</td><td>' + g.min + '–' + g.max + ' 分</td><td>' + g.count + ' 条</td><td>' + pctOf(g.count, 188) + '%</td></tr>'; }).join('')) + '</div>';
        body += '<div class="sub" style="margin-top:12px;line-height:1.8">六维：自控率 / 有效率 / 准确率 / 快速率 / 振荡率 / 平稳率。综合分按平台权重并对低分维度做惩罚折算（样例回路六维均值 79.2、综合 59.27），不是算术平均。自动投用率单独统计，适用性预筛后的不可投用回路不计入自控率考核。</div>';
        S.detail('评分口径 · iCLPM', '演示口径与实测一致', body);
      });
    }
    bindJumps();
  }

  /* ---------- 诊断 ---------- */
  function openDiagnosis(id) {
    var dg = D.diagnosis.diagnoses.filter(function (x) { return x.id === id; })[0];
    if (!dg) { return; }
    var steps = ['命中规则', '模型置信', '决策输出', '转处置 ' + dg.event];
    var doneCount = dg.status === '待复核' ? 3 : 4;
    var tl = '<div class="timeline">' + steps.map(function (s, i) {
      var cls = i < doneCount ? 'done' : (i === doneCount ? 'active' : '');
      var st = i < doneCount ? '已完成' : (i === doneCount ? '进行中' : '未开始');
      return '<div class="tl-item ' + cls + '"><span class="tl-dot"></span><div class="tl-body"><b>' + h(s) + '</b><span>' + st + '</span></div></div>';
    }).join('') + '</div>';
    var body = detailGrid([['诊断号', h(dg.id)], ['回路', '<span class="mono">' + h(dg.tag) + '</span>'], ['名称', h(dg.name)], ['单元', h(dg.unit)], ['故障类型', tag(dg.fault)], ['置信度', dg.confidence.toFixed(2)], ['耗时', dg.cost.toFixed(2) + ' s'], ['断言数', dg.assertions + ' 条'], ['根因归属', h(dg.root)], ['优先级', tag(dg.priority)], ['决策', h(dg.decision)], ['处置状态', tag(dg.status)]]);
    body += '<div style="margin-top:12px"><div class="card-h"><h3>判定理由</h3><span>可复核</span></div><div class="sub" style="line-height:1.75">' + h(dg.reason) + '</div></div>';
    body += '<div style="margin-top:12px"><div class="card-h"><h3>命中规则</h3><span>' + dg.assertions + ' 条断言</span></div><div class="ai-meta">' + dg.rules.map(function (r) { return '<span class="ai-chip">' + h(r) + '</span>'; }).join('') + '</div></div>';
    body += '<div style="margin-top:12px"><div class="card-h"><h3>诊断到处置</h3><span>' + h(dg.event) + '</span></div>' + tl + '</div>';
    S.detail('诊断详情 · ' + dg.id, dg.tag + ' · ' + dg.unit, body);
  }
  function renderDiagnosis() {
    var dg = D.diagnosis;
    var s = dg.summary;
    var c = disposalCounts();
    var p = dg.pareto;
    var total = p.reduce(function (a, x) { return a + x.count; }, 0);
    var top2 = p[0].count + p[1].count;
    var html = head('iCLPM / 诊断', '智能诊断总览', '规则 + 模型双引擎 · 置信度 / 命中规则 / 决策结果可追溯（引擎 ' + dg.engine.name + '）', '<button class="btn" data-action="rerun">重跑诊断</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('本轮诊断', s.count, '条', '规则库 ' + dg.engine.ruleLib, '#1466E8', S.chart.spark([3, 4, 4, 5, 4, 5, 5], '#1466E8'));
    html += kpi('回路良好', s.goodLoops, '个', '诊断后维持良好', '#0B9A78', S.chart.spark([66, 68, 69, 70, 71, 72, 72], '#0B9A78'));
    html += kpi('系统性问题', s.systemIssues, '个', '已入运维队列', '#D97706', S.chart.spark([1, 2, 2, 2, 3, 3, 3], '#D97706'));
    html += kpi('平均诊断耗时', s.avgCost.toFixed(2), 's', '<span class="up">达标</span> · 阈值 ≤20 s', '#0EA5E9', S.chart.spark([19.2, 18.8, 18.1, 17.9, 17.6, 17.5, 17.5], '#0EA5E9'));
    html += kpi('置信度均值', s.confidenceAvg.toFixed(2), '', '高置信 ' + s.highConfidence + ' 条（≥0.60）', '#6D28D9', S.chart.spark([0.48, 0.51, 0.54, 0.56, 0.58, 0.59, 0.6], '#6D28D9'));
    html += kpi('连续运行', dg.engine.uptimeDays, '天', dg.engine.name + ' 已启用', '#0B9A78', S.chart.spark([0, 0, 0, 0, 0, 0, 0], '#0B9A78'));
    html += '</div>';
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>诊断引擎 ' + h(dg.engine.name) + '</b> 已启用 · 连续运行 0 天 · 规则库 ' + h(dg.engine.ruleLib) + ' · 最近运行 ' + h(dg.engine.lastRun) + '。单条诊断可展开命中规则、断言数与决策结果，并关联处置单。</span></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>故障 Pareto</h3><span>近 7 天 · ' + total + ' 条诊断故障</span></div><div class="chart">' + S.chart.bars(p.map(function (x) { return { label: x.type, value: x.count }; }), { height: 230, color: '#D97706' }) + '</div><div class="sub" style="margin-top:6px">阀门粘滞 ' + p[0].count + ' + 振荡 ' + p[1].count + ' = ' + top2 + ' 条，占 ' + pctOf(top2, total) + '%；优先做阀门与回路增益治理。</div></div><div class="card"><div class="card-h"><h3>故障处置漏斗</h3><span>含历史 · 待办 ' + c.todo + ' 条</span></div>';
    [['待复核', c.pending, '#DC2626', '确认诊断结论与影响范围'], ['有整改', c.fix, '#D97706', '检修 / 整定 / 补数'], ['验证中', c.verify, '#0EA5E9', '实施后 72 h 复测'], ['已验证', c.done, '#0B9A78', '达标归档']].forEach(function (r) {
      html += '<div style="padding:7px 0;border-bottom:1px solid #EEF2F7"><div style="display:flex;align-items:center;gap:8px"><span style="min-width:52px;font-size:11.5px">' + h(r[0]) + '</span><div class="progress" style="flex:1;height:8px"><span style="width:' + Math.min(100, r[1] * 22) + '%;background:' + r[2] + '"></span></div><b style="min-width:20px;text-align:right;font-size:11.5px">' + r[1] + '</b></div><div class="sub" style="margin-left:60px">' + h(r[3]) + '</div></div>';
    });
    html += '<div class="sub" style="margin-top:8px">待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify + '；与处置中心状态同源。</div><div style="margin-top:10px"><button class="btn small" data-nav-jump="disposal">进入处置中心 →</button></div></div></div>';
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>疑似故障阀清单</h3><span>带置信度与判定理由</span></div>';
    var vrows = dg.suspectedValves.map(function (v) {
      return '<tr data-sv="' + h(v.tag) + '"><td class="mono">' + h(v.tag) + '</td><td>' + h(v.unit) + '</td><td>' + tag(v.type) + '</td><td>' + confCell(v.confidence) + '</td><td style="max-width:360px">' + h(v.reason) + '</td><td>' + tag(v.priority) + '</td><td class="mono">' + h(v.event) + '</td></tr>';
    }).join('');
    html += table(['位号', '单元', '故障类型', '置信度', '判定理由', '优先级', '处置单'], vrows);
    html += '<div class="sub" style="margin-top:8px">置信度 ≥0.60 为高置信；低于 0.60 的结论只进入监控/补数，不直接出整定参数。</div></div>';
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>本轮诊断明细</h3><span>点击行查看命中规则 / 断言 / 决策</span></div>';
    var drows = dg.diagnoses.map(function (d) {
      return '<tr data-dg="' + h(d.id) + '"><td class="mono">' + h(d.id) + '</td><td class="mono">' + h(d.tag) + '</td><td>' + h(d.unit) + '</td><td>' + tag(d.fault) + '</td><td>' + confCell(d.confidence) + '</td><td>' + d.cost.toFixed(2) + ' s</td><td>' + d.assertions + '</td><td>' + h(d.decision) + '</td><td>' + tag(d.status) + '</td></tr>';
    }).join('');
    html += table(['诊断号', '回路', '单元', '故障类型', '置信度', '耗时', '断言', '决策结果', '状态'], drows);
    html += '<div class="sub" style="margin-top:8px">平均耗时 ' + s.avgCost.toFixed(2) + ' s（达标）、置信度均值 ' + s.confidenceAvg.toFixed(2) + '（高置信 ' + s.highConfidence + ' 条）；诊断 5 条、回路良好 72 个。</div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>系统性问题</h3><span>3 条 · 已入运维队列</span></div>';
    dg.issues.forEach(function (it) {
      html += '<div style="padding:9px 0;border-bottom:1px solid #EEF2F7"><div style="display:flex;align-items:center;gap:8px;flex-wrap:wrap"><span class="mono" style="font-size:11px">' + h(it.id) + '</span>' + tag(it.status) + '<span class="sub">' + h(it.scope) + '</span></div><b style="display:block;font-size:12px;margin-top:3px">' + h(it.title) + '</b><div class="sub">' + h(it.cause) + ' · 责任：' + h(it.owner) + ' · 截止 ' + h(it.due) + '</div></div>';
    });
    html += '</div><div class="card"><div class="card-h"><h3>根因归属</h3><span>本轮 5 条诊断</span></div>';
    dg.rootCause.forEach(function (r) {
      html += '<div style="display:flex;align-items:center;gap:9px;padding:6px 0;border-bottom:1px solid #EEF2F7"><span style="min-width:112px;font-size:11.5px">' + h(r.label) + '</span><div class="progress" style="flex:1;height:7px"><span style="width:' + r.share + '%;background:#6D28D9"></span></div><b style="min-width:56px;text-align:right;font-size:11.5px">' + r.count + ' 条 · ' + r.share + '%</b></div>';
    });
    html += '<div class="sub" style="margin-top:8px">建议优先级：高 2 条 / 中 2 条 / 低 1 条；共享仪表与仪表阀门合计 2 条，需跨专业协同。</div></div></div>';
    html += aiCard('本轮 5 条诊断、72 个回路良好、3 个系统性问题已入运维队列；平均耗时 17.50 s（达标）、置信度均值 0.60（3 条高置信）。近 7 天 55 条故障中阀门粘滞 18 + 振荡 14 占 58.2%；疑似阀 Top：D4LC03501_PID 0.90、FIC-1201 0.90。', ['5 条诊断', '17.50 s', '置信度 0.60', '待复核 ' + c.pending]);
    return html;
  }
  function bindDiagnosis() {
    var rerun = S.qs('[data-action="rerun"]');
    if (rerun) { rerun.addEventListener('click', function () { S.toast('<b>重跑诊断</b>：已模拟执行 ' + D.diagnosis.engine.name + '，5 条诊断 / 耗时 17.50 s（演示环境）'); }); }
    S.qsa('tr[data-dg]').forEach(function (tr) {
      tr.addEventListener('click', function () { openDiagnosis(tr.getAttribute('data-dg')); });
    });
    S.qsa('tr[data-sv]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var matched = D.diagnosis.diagnoses.filter(function (d) { return d.tag === tr.getAttribute('data-sv'); })[0];
        if (matched) { openDiagnosis(matched.id); } else { S.toast('<b>疑似故障阀</b>：该回路暂无诊断明细'); }
      });
    });
    bindJumps();
  }

  /* ---------- 振荡检测 ---------- */
  function renderOsc() {
    var list = filteredOsc();
    var high = list.filter(function (o) { return o.severity === '高'; }).length;
    var html = head('iCLPM / 诊断 / 振荡检测', '振荡检测', '周期波动 · 阀门黏滞 · 手动回路；按严重度筛选，带诊断置信度。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>振荡率 51.8</b> 是全厂六维最低维度；高严重度案例优先核对阀门与工艺周期扰动，不要只改 PID 参数。</span></div>';
    html += '<div class="grid grid-3" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>振荡案例</h3><span>当前筛选</span></div><div class="v" style="font-size:28px;font-weight:900">' + list.length + '</div><div class="sub">全厂案例样本</div></div><div class="card"><div class="card-h"><h3>高严重度</h3><span>需优先处理</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">' + high + '</div><div class="sub">周期波动 / 阀门黏滞</div></div><div class="card"><div class="card-h"><h3>已确认</h3><span>进入处置</span></div><div class="v" style="font-size:28px;font-weight:900;color:#0B9A78">' + list.filter(function (o) { return o.status === '已确认'; }).length + '</div><div class="sub">待诊断 ' + list.filter(function (o) { return o.status === '待诊断'; }).length + ' 个</div></div></div>';
    html += '<div class="filters"><select id="oSeverity"><option value="全部">全部严重度</option><option' + (state.severity === '高' ? ' selected' : '') + '>高</option><option' + (state.severity === '中' ? ' selected' : '') + '>中</option><option' + (state.severity === '低' ? ' selected' : '') + '>低</option></select><span class="count">共 ' + list.length + ' 个案例</span></div>';
    var rows = list.map(function (o) {
      return '<tr data-osc="' + h(o.tag) + '"><td class="mono">' + h(o.tag) + '</td><td>' + h(o.unit) + '</td><td>' + h(o.period) + '</td><td>' + h(o.amplitude) + '</td><td>' + tag(o.severity) + '</td><td>' + confCell(o.confidence) + '</td><td>' + h(o.cause) + '</td><td>' + tag(o.status) + '</td></tr>';
    }).join('');
    if (!rows) { rows = '<tr><td colspan="8" class="sub">当前筛选无振荡案例。</td></tr>'; }
    html += table(['位号', '单元', '周期', '振幅', '严重度', '置信度', '疑似原因', '状态'], rows);
    var focus = high ? 'FIC-1201（12.5 s）与 D4LC03501_PID（阀门粘滞 0.90）优先。' : '当前筛选无高严重度案例，建议切换严重度复查。';
    html += aiCard('当前 ' + list.length + ' 个振荡案例，高严重度 ' + high + ' 个；' + focus + '全厂振荡率 51.8 为六维最低。', ['案例 ' + list.length, '高 ' + high, '振荡率 51.8']);
    return html;
  }
  function bindOsc() {
    var f = S.qs('#oSeverity');
    if (f) { f.addEventListener('change', function (e) { state.severity = e.target.value; S.go('osc'); }); }
    S.qsa('tr[data-osc]').forEach(function (tr) {
      tr.addEventListener('click', function () {
        var o = D.oscillations.filter(function (x) { return x.tag === tr.getAttribute('data-osc'); })[0];
        if (!o) { return; }
        S.detail('振荡详情 · ' + o.tag, o.unit + ' · ' + o.cause, detailGrid([['位号', h(o.tag)], ['单元', h(o.unit)], ['周期', h(o.period)], ['振幅', h(o.amplitude)], ['严重度', tag(o.severity)], ['置信度', o.confidence.toFixed(2)], ['原因', h(o.cause)], ['状态', tag(o.status)]]) + '<div style="margin-top:12px" class="sub" style="line-height:1.7">建议：先确认阀门/工艺周期性扰动，再调整增益或加滤波；手动状态下不做参数结论。置信度低于 0.60 的案例先补数。</div>');
      });
    });
  }

  /* ---------- 整定 ---------- */
  function adoptSuggestion(tagName) {
    var s = D.suggestions.filter(function (x) { return x.tag === tagName; })[0];
    if (!s) { return; }
    var exists = state.events.some(function (e) { return e.source === '整定建议 · ' + s.tag && e.tag === s.tag; });
    if (exists) {
      S.toast('<b>已在处置队列</b>：' + h(s.tag) + ' 的整定建议已生成处置待办');
      return;
    }
    seq += 1;
    var now = ts();
    state.events.unshift({
      id: 'EV-DEMO-' + seq, tag: s.tag, unit: s.unit, fault: s.issue, source: '整定建议 · ' + s.tag,
      owner: '待指派', priority: s.priority, time: now, status: '待复核',
      action: '人工确认建议参数后在 DCS 侧手工实施（平台不写接口）', event: '整定建议生成处置待办：' + s.target,
      history: [{ time: now, text: '由整定建议页生成处置待办：' + s.target }]
    });
    state.adopted += 1;
    S.toast('<b>已转处置</b>：' + h(s.tag) + ' 建议进入待复核（演示，不写 DCS）');
    S.go('tuning');
  }
  function renderTuning() {
    var list = filteredSuggestions();
    var high = list.filter(function (s) { return s.priority === '高'; }).length;
    var html = head('iCLPM / 整定', '整定建议', '只输出建议 · 不写 DCS · 参数由现场授权人员实施（演示合成数据）', '<button class="btn" data-action="boundary">输出边界</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>红线：只输出建议，不写 DCS。</b> 平台不连接 DCS 写通道；任何参数下发必须由授权人员在 DCS 侧手工执行并双人复核。</span></div>';
    html += '<div class="kpi-grid kpi-grid-4">';
    html += kpi('建议条数', list.length, '条', '全部 ' + D.suggestions.length + ' 条 · 覆盖 6 个代表回路', '#1466E8', S.chart.spark([4, 5, 5, 6, 6, 6, 6], '#1466E8'));
    html += kpi('高优先级', high, '条', state.priority === '全部' ? 'FIC-1201 / D4LC / LIC-3302' : '当前筛选', '#DC2626', S.chart.spark([2, 2, 3, 3, 3, 3, 3], '#DC2626'));
    html += kpi('平均置信度', avgConfidence(list).toFixed(2), '', '全量：参数建议 3 条 / 工艺建议 1 条 / 暂不输出 2 条', '#6D28D9', S.chart.spark([0.6, 0.62, 0.64, 0.66, 0.67, 0.68, 0.68], '#6D28D9'));
    html += kpi('已转处置', state.adopted, '条', '本次会话生成的待复核', '#0B9A78', S.chart.spark([0, 0, 0, 0, 0, 0, state.adopted], '#0B9A78'));
    html += '</div>';
    html += '<div class="filters"><select id="tPriority"><option value="全部">全部优先级</option><option' + (state.priority === '高' ? ' selected' : '') + '>高</option><option' + (state.priority === '中' ? ' selected' : '') + '>中</option></select><select id="tOutput"><option value="全部">全部输出类型</option><option' + (state.output === '参数建议' ? ' selected' : '') + '>参数建议</option><option' + (state.output === '工艺建议' ? ' selected' : '') + '>工艺建议</option><option' + (state.output === '暂不输出' ? ' selected' : '') + '>暂不输出</option></select><span class="count">当前 ' + list.length + ' 条建议 · 全部 ' + D.suggestions.length + ' 条</span></div>';
    var btnLabel = function (s) {
      if (s.output === '暂不输出') { return '转补数/测试'; }
      if (s.output === '工艺建议') { return '转检修处置'; }
      return '采纳并转处置';
    };
    var rows = list.map(function (s) {
      return '<tr data-suggest-row="' + h(s.tag) + '"><td class="mono">' + h(s.tag) + '</td><td>' + h(s.unit) + '</td><td>' + h(s.issue) + '</td><td class="mono">' + h(s.current) + '</td><td style="min-width:160px">' + h(s.target) + '<div class="sub">' + h(s.output) + ' · ' + h(s.gate) + '</div></td><td>' + tag(s.priority) + '</td><td>' + confCell(s.confidence) + '</td><td>' + h(s.expected) + '</td><td><button class="btn small" data-suggest="' + h(s.tag) + '">' + h(btnLabel(s)) + '</button></td></tr>';
    }).join('');
    if (!rows) { rows = '<tr><td colspan="9" class="sub">当前筛选无整定建议。</td></tr>'; }
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>建议清单</h3><span>参数建议均需人工确认</span></div>' + table(['位号', '单元', '问题', '当前参数', '建议参数 / 输出类型', '优先级', '置信度', '预期收益', '操作'], rows) + '<div class="sub" style="margin-top:8px">未通过数据检验或模型失配的回路不输出参数；置信度低于 0.60 的结论仅作为处置参考。</div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>整定流程</h3><span>人工确认后实施</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(108px,1fr));gap:8px">' + D.tuning.flow.map(function (f) {
      return '<div style="border:1px solid #EEF2F7;border-radius:8px;padding:9px;background:#FBFDFF"><span class="sub">步骤 ' + f.n + '</span><b style="display:block;font-size:12px;margin:2px 0">' + h(f.title) + '</b><span class="sub">' + h(f.desc) + '</span></div>';
    }).join('') + '</div></div><div class="card"><div class="card-h"><h3>输出边界与留痕</h3><span>只输出建议 · 不写 DCS</span></div><ul style="margin:0;padding-left:16px;display:grid;gap:6px;font-size:12px;color:#334155;line-height:1.65">' + D.tuning.guardrails.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul><div class="alert-strip" style="margin-top:10px"><span class="dot"></span><span><b>不写 DCS</b>：平台无写通道，参数下发由授权人员在 DCS 侧完成。</span></div></div></div>';
    var detail = (state.output === '全部' && state.priority === '全部') ? '；参数建议 3 条（FIC-1201 / LIC-3302 / TIC-1203），D4LC03501_PID 先检修，FIC-3405 与 TIC-4101 暂不输出' : '';
    html += aiCard('当前筛选 ' + list.length + ' 条建议（全部 ' + D.suggestions.length + ' 条），高优先级 ' + high + ' 条，平均置信度 ' + avgConfidence(list).toFixed(2) + detail + '。平台只输出建议，不写 DCS。', ['筛选 ' + list.length + ' / 全部 ' + D.suggestions.length, '高 ' + high, '不写 DCS', '已转处置 ' + state.adopted]);
    return html;
  }
  function bindTuning() {
    var p = S.qs('#tPriority');
    if (p) { p.addEventListener('change', function (e) { state.priority = e.target.value; S.go('tuning'); }); }
    var o = S.qs('#tOutput');
    if (o) { o.addEventListener('change', function (e) { state.output = e.target.value; S.go('tuning'); }); }
    var b = S.qs('[data-action="boundary"]');
    if (b) {
      b.addEventListener('click', function () {
        var body = '<div class="sub" style="line-height:1.8">平台只输出整定建议，不连接 DCS 写通道；所有参数由现场授权人员手工实施。以下为输出边界：</div><ul style="margin:12px 0 0;padding-left:16px;display:grid;gap:8px;font-size:12px;color:#334155;line-height:1.65">' + D.tuning.guardrails.map(function (x) { return '<li>' + h(x) + '</li>'; }).join('') + '</ul><div class="alert-strip" style="margin-top:12px"><span class="dot"></span><span><b>不写 DCS</b>：演示环境仅生成处置待办，不修改任何 DCS 参数。</span></div>';
        S.detail('输出边界 · 整定建议', '只输出建议 · 不写 DCS', body);
      });
    }
    S.qsa('[data-suggest]').forEach(function (x) {
      x.addEventListener('click', function () { adoptSuggestion(x.getAttribute('data-suggest')); });
    });
  }

  /* ---------- 处置 ---------- */
  function openEvent(id) {
    var e = eventById(id);
    if (!e) { return; }
    var stages = ['待复核', '有整改', '验证中', '已验证'];
    var idx = stages.indexOf(e.status);
    var tl = '<div class="timeline">' + stages.map(function (s, i) {
      var done = i < idx || (i === idx && e.status === '已验证');
      var active = i === idx && e.status !== '已验证';
      var cls = done ? 'done' : (active ? 'active' : '');
      var st = done ? '已完成' : (active ? '进行中' : '未开始');
      return '<div class="tl-item ' + cls + '"><span class="tl-dot"></span><div class="tl-body"><b>' + h(s) + '</b><span>' + st + '</span></div></div>';
    }).join('') + '</div>';
    var hist = '<div class="timeline">' + e.history.map(function (x) { return '<div class="tl-item done"><span class="tl-dot"></span><div class="tl-body"><b>' + h(x.text) + '</b><span>' + h(x.time) + '</span></div></div>'; }).join('') + '</div>';
    var body = detailGrid([['处置单号', h(e.id)], ['回路', '<span class="mono">' + h(e.tag) + '</span>'], ['单元', h(e.unit)], ['问题', h(e.fault)], ['来源', h(e.source)], ['状态', tag(e.status)], ['优先级', tag(e.priority)], ['负责人', h(e.owner)], ['更新时间', h(e.time)], ['处置动作', h(e.action)]]);
    body += '<div style="margin-top:14px"><div class="card-h"><h3>状态流转</h3><span>' + h(nextLabel(e.status)) + '</span></div>' + tl + '</div>';
    body += '<div style="margin-top:12px"><div class="card-h"><h3>操作记录</h3><span>' + e.history.length + ' 条</span></div>' + hist + '</div>';
    body += '<div class="sub" style="margin-top:10px;line-height:1.7">当前仅为演示会话状态；真实系统流转需权限校验与电子签名，参数改动在 DCS 侧执行。</div>';
    S.detail('处置详情 · ' + e.id, e.tag + ' · ' + e.unit, body);
  }
  function renderDisposal() {
    var c = disposalCounts();
    var list = filteredEvents();
    var html = head('iCLPM / 处置', '处置中心', '诊断 → 处置 → 整改 → 验证闭环；状态流转需人工确认，参数改动不写 DCS。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid kpi-grid-4">';
    html += kpi('待复核', c.pending, '条', '确认诊断结论与影响范围', '#DC2626', S.chart.spark([5, 5, 4, 4, 3, 3, c.pending], '#DC2626'));
    html += kpi('有整改', c.fix, '条', '检修 / 整定 / 补数', '#D97706', S.chart.spark([2, 3, 3, 3, 2, 2, c.fix], '#D97706'));
    html += kpi('验证中', c.verify, '条', '72 h 复测绩效', '#0EA5E9', S.chart.spark([1, 1, 2, 2, 1, 1, c.verify], '#0EA5E9'));
    html += kpi('已验证', c.done, '条', '达标归档', '#0B9A78', S.chart.spark([2, 2, 3, 3, 3, 4, c.done], '#0B9A78'));
    html += '</div>';
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>当前待办 ' + c.todo + ' 条</b>（待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify + '）· 已验证 ' + c.done + ' 条；所有整定参数仅输出建议，不在平台写 DCS。</span></div>';
    html += '<div class="filters"><select id="dStatus"><option value="全部">全部状态</option>' + ['待复核', '有整改', '验证中', '已验证'].map(function (s) { return '<option' + (state.disposal === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><select id="dPriority"><option value="全部">全部优先级</option>' + ['高', '中', '低'].map(function (s) { return '<option' + (state.dispPriority === s ? ' selected' : '') + '>' + s + '</option>'; }).join('') + '</select><span class="count">当前 ' + list.length + ' 条 · 全量 ' + state.events.length + ' 条</span></div>';
    var rows = list.map(function (e) {
      var btn = e.status === '已验证'
        ? '<button class="btn small" data-ev-view="' + h(e.id) + '">查看</button>'
        : '<button class="btn small" data-ev-next="' + h(e.id) + '">' + h(nextLabel(e.status)) + '</button>';
      return '<tr data-ev="' + h(e.id) + '"><td class="mono">' + h(e.id) + '</td><td class="mono">' + h(e.tag) + '</td><td>' + h(e.unit) + '</td><td>' + h(e.fault) + '</td><td>' + tag(e.status) + '</td><td>' + tag(e.priority) + '</td><td>' + h(e.owner) + '</td><td>' + h(e.time) + '</td><td>' + btn + '</td></tr>';
    }).join('');
    if (!rows) { rows = '<tr><td colspan="9" class="sub">当前筛选无处置单。</td></tr>'; }
    html += table(['处置单号', '回路', '单元', '问题', '状态', '优先级', '负责人', '更新时间', '操作'], rows);
    html += '<div class="grid grid-2" style="margin-top:12px;margin-bottom:12px"><div class="card"><div class="card-h"><h3>处置流程</h3><span>当前待办 ' + c.todo + ' 条</span></div><div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">' + D.disposal.flow.map(function (f) {
      var n = c[f.key] || 0;
      return '<div style="border:1px solid #EEF2F7;border-radius:8px;padding:10px;background:#FBFDFF"><div style="display:flex;align-items:center;justify-content:space-between;gap:8px"><b style="font-size:12.5px">' + h(f.key) + '</b><span style="font-size:20px;font-weight:900;color:#1466E8">' + n + '</span></div><div class="sub">' + h(f.desc) + '</div></div>';
    }).join('') + '</div></div><div class="card"><div class="card-h"><h3>闭环规则</h3><span>人工确认 · 不写 DCS</span></div><ul style="margin:0;padding-left:16px;display:grid;gap:7px;font-size:12px;color:#334155;line-height:1.65"><li>状态流转：待复核 → 有整改 → 验证中 → 已验证，每一步需责任人确认。</li><li>参数改动不在平台执行：整定建议只输出，DCS 侧由授权人员手工下发并双人复核。</li><li>验证窗口 72 h：复测评分与振荡率达标后才可关闭。</li><li>演示口径：状态流转只修改当前会话，不写回真实系统。</li><li>诊断结论、命中规则、断言数与处置记录全程留痕。</li></ul></div></div>';
    html += aiCard('当前筛选 ' + list.length + ' 条处置单；待办 ' + c.todo + ' 条（待复核 ' + c.pending + ' / 有整改 ' + c.fix + ' / 验证中 ' + c.verify + '），已验证 ' + c.done + ' 条。先确认待复核的影响范围，参数改动仅在 DCS 侧手工执行。', ['待办 ' + c.todo, '待复核 ' + c.pending, '有整改 ' + c.fix, '已验证 ' + c.done]);
    return html;
  }
  function bindDisposal() {
    var s = S.qs('#dStatus');
    if (s) { s.addEventListener('change', function (e) { state.disposal = e.target.value; S.go('disposal'); }); }
    var p = S.qs('#dPriority');
    if (p) { p.addEventListener('change', function (e) { state.dispPriority = e.target.value; S.go('disposal'); }); }
    S.qsa('tr[data-ev]').forEach(function (tr) {
      tr.addEventListener('click', function (e) {
        if (e.target.closest && e.target.closest('[data-ev-next]')) { return; }
        openEvent(tr.getAttribute('data-ev'));
      });
    });
    S.qsa('[data-ev-view]').forEach(function (b) {
      b.addEventListener('click', function (e) { e.stopPropagation(); openEvent(b.getAttribute('data-ev-view')); });
    });
    S.qsa('[data-ev-next]').forEach(function (b) {
      b.addEventListener('click', function (e) {
        e.stopPropagation();
        var ev = eventById(b.getAttribute('data-ev-next'));
        if (!ev) { return; }
        var map = { '待复核': '有整改', '有整改': '验证中', '验证中': '已验证' };
        var next = map[ev.status];
        if (!next) { openEvent(ev.id); return; }
        var from = ev.status;
        ev.status = next;
        ev.time = ts();
        ev.history.push({ time: ev.time, text: '状态流转：' + from + ' → ' + next + '（演示，人工确认）' });
        S.toast('<b>状态流转</b>：' + h(ev.tag) + ' ' + h(from) + ' → ' + h(next) + '（演示会话，未写真实系统）');
        S.go('disposal');
      });
    });
    bindJumps();
  }

  S.boot({
    product: 'iclpm', code: 'iCLPM', name: '控制回路性能优化管理系统', brandName: '回路性能',
    subtitle: '回路评估 · 诊断 · 整定 · 处置闭环', mark: 'C',
    workspace: '某化工厂 · 演示环境', user: '张', date: '2026-10-27',
    defaultPage: 'dashboard', searchPlaceholder: '搜索回路 / 位号 / 单元',
    nav: [
      { group: '总览', items: [{ id: 'dashboard', icon: 'dashboard', label: '绩效驾驶舱' }] },
      { group: '回路', items: [{ id: 'loops', icon: 'plan', label: '回路列表' }] },
      { group: '性能', items: [{ id: 'performance', icon: 'quality', label: '性能总览' }] },
      { group: '诊断', items: [{ id: 'diagnosis', icon: 'search', label: '诊断总览' }, { id: 'osc', icon: 'play', label: '振荡检测' }] },
      { group: '整定', items: [{ id: 'tuning', icon: 'settings', label: '整定建议' }] },
      { group: '处置', items: [{ id: 'disposal', icon: 'file', label: '处置中心' }] }
    ],
    pages: {
      dashboard: { title: '绩效驾驶舱', crumb: '绩效驾驶舱', render: renderDashboard, bind: bindDashboard, insight: dashboardInsight },
      loops: { title: '回路列表', crumb: '回路列表', render: renderLoops, bind: bindLoops, insight: loopsInsight },
      performance: { title: '性能总览', crumb: '性能总览', render: renderPerformance, bind: bindPerformance, insight: performanceInsight },
      diagnosis: { title: '智能诊断总览', crumb: '诊断总览', render: renderDiagnosis, bind: bindDiagnosis, insight: diagnosisInsight },
      osc: { title: '振荡检测', crumb: '振荡检测', render: renderOsc, bind: bindOsc, insight: oscInsight },
      tuning: { title: '整定建议', crumb: '整定建议', render: renderTuning, bind: bindTuning, insight: tuningInsight },
      disposal: { title: '处置中心', crumb: '处置中心', render: renderDisposal, bind: bindDisposal, insight: disposalInsight }
    }
  });
})();
