(function () {
  var D = window.IPAE_DEMO;
  var L = window.IPAE_LATENT;
  var S = window.SimShell;
  var esc = S.esc;
  var state = {
    batchA: D.batches[0].id, batchB: D.batches[1].id,
    goldenSelected: D.goldenBatches.map(function (b) { return b.selected; }),
    outlierSev: '全部', outlierStage: '全部',
    wizStep: 1, wizDevice: 'R401', wizWindow: '168h', wizApplied: false,
    wizMarks: D.wizard.candidates.map(function (c) { return c.mark; }),
    wizRules: { r01High: 35.0, r02MinSeg: 8, r03High: 7.0 },
    latentTab: '催化剂活性'
  };

  function h(v) { return esc(v); }
  function nowShort() { return S.nowText().slice(-8); }
  function tag(s) {
    var m = { '已登记': 'green', '未登记': 'amber', '合格': 'green', '待检': 'gray', '已发布': 'green', '草稿': 'amber' };
    return '<span class="tag ' + (m[s] || 'gray') + '">' + h(s) + '</span>';
  }
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
  function totalStages() {
    var t = 0; D.stages.forEach(function (s) { t += s.a; }); return t;
  }
  function totalDiff() {
    var t = 0; D.stages.forEach(function (s) { t += (s.a - s.b); }); return t;
  }

  function workbenchInsight() {
    return {
      time: nowShort(), basis: '工作台 · 当前数据末端',
      summary: '当前 <b>122 批</b>历史中 <b>58 批未登记</b>、16 个位号存在质量问题；参考集已发布 1 个（112 批），数据就绪度总体可用但批次覆盖只有 88%。',
      findings: [
        '最近 10 批中 3 批未登记，最近一批 408-R401-24031418-0132 OP 覆盖率仅 62.4%，存在大量未解释区间。',
        '位号主数据 153 个，Good 占比 98.7%；3 个位号缺单位、16 个存在跳变/重复。',
        '化验关联 91%，12 批样品未关联；批次覆盖 88%，28 批无 OP 覆盖。'
      ],
      actions: [
        '先处理最近 3 批未登记批次，补齐 OP 覆盖与登记结果。',
        '运行一次数据就绪度体检，定位 16 个问题位号。',
        '把已发布的 2 个参考集作为基线，但先确认样本支持数。'
      ],
      evidence: ['122 批', '未登记 58', '问题位号 16', 'Good 98.7%']
    };
  }

  function batchInsight() {
    var ta = totalStages(), tb = ta - totalDiff();
    var op30 = D.stages[1], op70 = D.stages[6];
    return {
      time: nowShort(), basis: '批次研究 · A/B 对比',
      summary: 'A 批总时长 <b>' + ta + ' min</b>，B 批 <b>' + tb + ' min</b>，A 比 B 多 <b>' + (ta - tb) + ' min</b>；差异集中在 OP30（+' + (op30.a - op30.b) + ' min）与 OP100（+' + (op70.a - op70.b) + ' min）。',
      findings: [
        'A 批 OP30 升温 ' + op30.a + ' min，B 批 ' + op30.b + ' min，差 <b>+' + (op30.a - op30.b) + ' min</b>；A 批升温段更长。',
        'A 批 OP100 末次压水与结束 ' + op70.a + ' min，B 批 ' + op70.b + ' min，差 +' + (op70.a - op70.b) + ' min；需确认分段完整性与末次压水条件。',
        'A/B 两批曲线在前 30% 基本重合，30% 后 A 批持续高于 B 批；偏差从 OP30 开始累积。'
      ],
      actions: [
        '先核对 A 批 OP30 的升温速率与蒸汽阀开度，确认是否工艺偏差。',
        '把 OP100 末次压水时长与分段完整性关联，判断是否同源。',
        '在批次详情中查看 OP30 / OP100 证据窗口，避免只看总时长。'
      ],
      evidence: ['A ' + ta + ' min', 'B ' + tb + ' min', 'Δ ' + (ta - tb) + ' min', 'OP30 +' + (op30.a - op30.b) + ' min']
    };
  }

  function goldenInsight() {
    var sel = state.goldenSelected.filter(Boolean).length;
    return {
      time: nowShort(), basis: '黄金批次 · 参考集 v1',
      summary: '当前参考集选中 <b>' + sel + ' 批</b>，支持数 ' + sel + '；P10–P90 区间已生成。建议保持 ≥3 个同条件批次，低于 3 批时不要输出参考带。',
      findings: [
        '入选批次：408-R401-24030109-0102、24030314-0108、24030521-0115、24030808-0121、24031103-0126，共 5 批；24031418-0132 未选中。',
        'P50 峰值出现在进度 35% 左右（约 116），P10–P90 区间宽度约 10–12；尾部 80% 后区间收窄。',
        '当前支持数 ' + sel + '，满足 ≥3 的最低要求；但仍属少量合成批，不能证明现场统计可靠性。'
      ],
      actions: [
        '保持 5 批入选；如剔除 1 批，先看 P10/P90 与支持数变化。',
        '发布参考集前，确认同设备/模板/装料条件一致。',
        '把 OP30 的包络与批次差异页联动，避免只看曲线不看工况。'
      ],
      evidence: ['入选 ' + sel + ' 批', '支持 ' + sel, 'P10–P90']
    };
  }

  function readinessInsight() {
    var avg = Math.round(D.readiness.reduce(function (a, b) { return a + b.value; }, 0) / D.readiness.length);
    return {
      time: nowShort(), basis: '数据就绪度 · 总体 ' + avg,
      summary: '总体就绪度 <b>' + avg + '</b>，可以开始分析但存在短板：批次覆盖 88%、化验关联 91%，最近批次 OP 覆盖仅 50%。',
      findings: [
        '位号主数据 98、时间戳质量 96，基础数据可用；问题位号 16 个。',
        '批次覆盖 88%：122 批中 28 批无 OP 覆盖；A 批最近一条覆盖率 62.4%。',
        '化验关联 91%：12 批样品未关联，影响批次对比与黄金参考。'
      ],
      actions: [
        '先补最近 28 批的 OP 覆盖，优先 408-R401。',
        '把 12 批未关联样品补录，避免黄金参考样本偏差。',
        '对 16 个问题位号做标签/单位/时间戳修复后再发布参考集。'
      ],
      evidence: ['总体 ' + avg, '批次覆盖 88%', '化验关联 91%', '问题位号 16']
    };
  }

  function mtoInsight() {
    var t2max = Math.max.apply(null, D.mto.t2);
    var spemax = Math.max.apply(null, D.mto.spe);
    return {
      time: nowShort(), basis: 'MTO 工况 · 当前班次',
      summary: 'MTO 综合收率 <b>48.5%</b>、单位能耗 <b>2.1 GJ/t</b>、P/E 比 1.05；T² 峰值 ' + t2max + '、SPE 峰值 ' + spemax + '，过程稳定性出现两次偏离。',
      findings: [
        '综合收率 48.5%，高于目标 48.0%；今日烯烃总产量 1,297 t，甲醇进料 160.8 t/h。',
        'T²/SPE 在 13–14 时出现峰值（T² ' + t2max + '、SPE ' + spemax + '），SPE 贡献度最高为反应器出口温度 42%。',
        '单位产品综合能耗 2.1 GJ/t，较平均高 3.5%；当前工况“稳定高负荷”已持续 4.50 小时。'
      ],
      actions: [
        '先核对反应器出口温度与 C4 流量，确认 SPE 峰值是否由进料波动引起。',
        '把 13–14 时峰值与报警/操作记录关联，判断是否需要调整蒸汽/进料。',
        '在收率与能耗之间做权衡：当前收率达标，但能耗偏高 3.5%。'
      ],
      evidence: ['收率 48.5%', '能耗 2.1 GJ/t', 'T² ' + t2max, 'SPE ' + spemax]
    };
  }

  function renderWorkbench() {
    var k = D.kpi;
    var html = head('iPAE / 工作台', '工作台', '数据末端 2024-05-01 · 408 车间 · 演示复刻数据', '<button class="btn" data-action="refresh">刷新</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('位号总数', k.tags, '个', 'Good 占比 ' + k.goodRate + '%', '#1466E8', S.chart.spark([148, 150, 151, 152, 153, 153, 153], '#1466E8'));
    html += kpi('批次数', k.batches, '批', '2024-03-01 — 05-01', '#0B9A78', S.chart.spark([100, 108, 112, 116, 119, 121, 122], '#0B9A78'));
    html += kpi('已登记', k.registered, '批', '占 52%', '#0EA5E9', S.chart.spark([90, 98, 104, 110, 115, 119, 122], '#0EA5E9'));
    html += kpi('未登记', k.unregistered, '批', '<span class="warn">需补登</span>', '#D97706', S.chart.spark([80, 75, 70, 66, 62, 60, 58], '#D97706'));
    html += kpi('参考集', k.refPublished + ' / ' + k.refDraft, '个', '已发布 / 草稿', '#0B9A78', S.chart.spark([1, 1, 1, 2, 2, 2, 2], '#0B9A78'));
    html += kpi('数据就绪度', 94.6, '分', '<span class="warn">批次覆盖 88%</span>', '#D97706', S.chart.spark([90, 91, 92, 93, 94, 94, 94.6], '#D97706'));
    html += '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>接入向导</h3><span>4 / 6 步</span></div><div style="display:grid;gap:7px">';
    [['导入时序数据', 'done'], ['补位号主数据', 'done'], ['建设备分组与参数映射', 'done'], ['建配方与规则并发布基线', 'active'], ['批次识别', 'todo'], ['登记结果并建参考集', 'todo']].forEach(function (s, i) {
      var cls = s[1] === 'done' ? 'tag green' : (s[1] === 'active' ? 'tag amber' : 'tag gray');
      html += '<div style="display:flex;align-items:center;gap:8px"><span style="width:18px;height:18px;border-radius:50%;background:' + (s[1] === 'done' ? '#0B9A78' : (s[1] === 'active' ? '#D97706' : '#E2E8F0')) + ';color:#fff;font-size:10px;display:flex;align-items:center;justify-content:center">' + (i + 1) + '</span><span style="flex:1;font-size:12px">' + s[0] + '</span><span class="' + cls + '">' + (s[1] === 'done' ? '完成' : (s[1] === 'active' ? '进行中' : '待办')) + '</span></div>';
    });
    html += '</div><div style="margin-top:10px"><button class="btn small" data-nav-jump="readiness">就绪度体检 →</button></div></div>';
    html += '<div class="card"><div class="card-h"><h3>待处理</h3><span>3 项</span></div><div style="display:grid;gap:8px"><div class="note" style="margin:0;padding:8px 10px"><b>数据质量需关注</b>：16 个位号存在重复/冲突/超量程，Good 占比 98.7%。</div><div class="note" style="margin:0;padding:8px 10px"><b>批次待评估</b>：近 14 天 58 批未登记，最近一批 OP 覆盖率 50%。</div><div class="note" style="margin:0;padding:8px 10px"><b>化验待关联</b>：12 批样品未关联，影响黄金参考。</div></div><div style="margin-top:10px;display:flex;gap:8px"><button class="btn small" data-nav-jump="readiness">去体检</button><button class="btn small" data-nav-jump="batch">去批次研究</button></div></div>';
    html += '</div>';
    var rows = D.batches.slice(0, 8).map(function (b) {
      return '<tr><td class="mono">' + h(b.id) + '</td><td>' + h(b.product) + '</td><td>' + h(b.line) + '</td><td>' + h(b.start) + '</td><td>' + h(b.duration) + '</td><td>' + b.opCoverage + '%</td><td>' + tag(b.status) + '</td><td>' + tag(b.quality) + '</td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>最近批次</h3><span>近 10 / 共 122 批</span></div>' + table(['批次', '产品', '产线', '开始', '时长', 'OP 覆盖率', '登记', '质量'], rows) + '</div>';
    html += aiCard('122 批历史中 58 批未登记、16 个位号有质量问题；最近一批 OP 覆盖率仅 62.4%。建议先补登与体检，再做基线。', ['122 批', '未登记 58', '问题位号 16']);
    return html;
  }
  function bindWorkbench() {
    var r = S.qs('[data-action="refresh"]');
    if (r) { r.addEventListener('click', function () { S.toast('<b>刷新</b>：已拉取 2024-05-01 数据末端快照'); }); }
    S.qsa('[data-nav-jump]').forEach(function (b) { b.addEventListener('click', function () { S.go(b.getAttribute('data-nav-jump')); }); });
  }

  function renderBatch() {
    var a = D.batches.filter(function (x) { return x.id === state.batchA; })[0] || D.batches[0];
    var b = D.batches.filter(function (x) { return x.id === state.batchB; })[0] || D.batches[1];
    var ta = totalStages(), tb = ta - totalDiff();
    var html = head('iPAE / 批次研究', '批次 A/B 对比', '选择两个批次，对比 OP 阶段耗时与轨迹；数据为演示合成数据。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="filters"><span class="count">批次 A</span><select id="batchA">' + D.batches.map(function (x) { return '<option' + (x.id === a.id ? ' selected' : '') + '>' + h(x.id) + '</option>'; }).join('') + '</select><span class="count">批次 B</span><select id="batchB">' + D.batches.map(function (x) { return '<option' + (x.id === b.id ? ' selected' : '') + '>' + h(x.id) + '</option>'; }).join('') + '</select><span class="count">A ' + ta + ' min · B ' + tb + ' min · Δ ' + (ta - tb) + ' min</span></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>OP 阶段耗时</h3><span>A / B · min</span></div><div class="chart">' + S.chart.bars(D.stages.map(function (s) { return { label: s.op, value: s.a, value2: s.b }; }), { height: 250, color: '#1466E8' }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>A 批</span><span><i style="background:#0EA5E9;opacity:.5"></i>B 批</span></div></div><div class="card"><div class="card-h"><h3>可比性条件</h3><span>A/B</span></div>' + detailGrid([['设备', 'R-101 / R-101'], ['产线', a.line + ' / ' + b.line], ['产品', a.product + ' / ' + b.product], ['开始', a.start + ' / ' + b.start], ['OP 覆盖', a.opCoverage + '% / ' + b.opCoverage + '%']]) + '<div class="note" style="margin-top:10px">两批同设备/同产品，但 OP 覆盖不同；A 批覆盖 50%，比较结论需标注证据范围。</div></div></div>';
    var rows = D.stages.map(function (s) {
      var d = s.a - s.b;
      return '<tr><td class="mono">' + s.op + '</td><td>' + h(s.name) + '</td><td>' + s.a + ' min</td><td>' + s.b + ' min</td><td><b style="color:' + (Math.abs(d) >= 10 ? '#DC2626' : '#334155') + '">' + (d > 0 ? '+' : '') + d + ' min</b></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>逐 OP 差异</h3><span>8 段</span></div>' + table(['OP', '阶段', 'A 批', 'B 批', 'Δ(A-B)'], rows) + '</div>';
    html += aiCard('A 批比 B 批多 ' + (ta - tb) + ' min，差异集中在 OP30（+' + (D.stages[1].a - D.stages[1].b) + ' min）与 OP100（+' + (D.stages[6].a - D.stages[6].b) + ' min）；先查升温与末次压水。', ['Δ ' + (ta - tb) + ' min', 'OP30 +' + (D.stages[1].a - D.stages[1].b), 'OP100 +' + (D.stages[6].a - D.stages[6].b)]);
    return html;
  }
  function bindBatch() {
    var a = S.qs('#batchA'), b = S.qs('#batchB');
    if (a) { a.addEventListener('change', function (e) { state.batchA = e.target.value; S.go('batch'); }); }
    if (b) { b.addEventListener('change', function (e) { state.batchB = e.target.value; S.go('batch'); }); }
  }

  function bandChart(p10, p50, p90) {
    var w = 640, h = 230, padL = 36, padR = 12, padT = 14, padB = 26;
    var max = Math.max.apply(null, p90), min = Math.min.apply(null, p10), span = (max - min) || 1;
    var iw = w - padL - padR, ih = h - padT - padB;
    function x(i) { return padL + iw / Math.max(1, p50.length - 1) * i; }
    function y(v) { return padT + ih - (v - min) / span * ih; }
    var top = p90.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); });
    var bottom = p10.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).reverse();
    var mid = p50.map(function (v, i) { return x(i).toFixed(1) + ',' + y(v).toFixed(1); }).join(' ');
    var s = '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img">';
    for (var g = 0; g <= 4; g++) {
      var gy = padT + ih - ih * g / 4;
      s += '<line x1="' + padL + '" y1="' + gy + '" x2="' + (w - padR) + '" y2="' + gy + '" stroke="#EEF2F7"/>';
      s += '<text x="' + (padL - 6) + '" y="' + (gy + 3) + '" text-anchor="end" font-size="9" fill="#94A3B8">' + (min + span * g / 4).toFixed(0) + '</text>';
    }
    s += '<polygon points="' + top.concat(bottom).join(' ') + '" fill="#1466E8" opacity=".10"/>';
    s += '<polyline points="' + mid + '" fill="none" stroke="#1466E8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>';
    s += '<text x="' + (w - padR) + '" y="12" text-anchor="end" font-size="9" fill="#64748B">P10–P90 区间 · 中位线</text>';
    s += '</svg>';
    return s;
  }

  function renderGolden() {
    var sel = state.goldenSelected.filter(Boolean).length;
    var html = head('iPAE / 黄金批次', '黄金批次参考集', 'P10 / P50 / P90 包络与支持数；勾选/取消批次可看支持数变化。演示合成数据。', '<button class="btn" data-action="publish">保存参考版本</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>P10–P90 包络</h3><span>支持数 ' + sel + '</span></div><div class="chart">' + bandChart(D.golden.p10, D.golden.p50, D.golden.p90) + '</div><div class="legend"><span><i style="background:#1466E8"></i>P50</span><span><i style="background:#1466E8;opacity:.2"></i>P10–P90</span></div></div><div class="card"><div class="card-h"><h3>入选批次</h3><span>' + sel + ' / 6</span></div>';
    D.goldenBatches.forEach(function (b, i) {
      html += '<label style="display:flex;align-items:center;gap:8px;padding:7px 0;border-bottom:1px solid #EEF2F7;font-size:12px;cursor:pointer"><input type="checkbox" data-golden="' + i + '"' + (state.goldenSelected[i] ? ' checked' : '') + '><span class="mono" style="flex:1">' + h(b.id) + '</span><span class="sub">支持 ' + b.support + '</span></label>';
    });
    html += '<div style="margin-top:10px"><div class="note" style="margin:0">支持数 <3 时不输出参考带；当前 ' + sel + ' 批，仍属少量合成样本，不能证明现场统计可靠性。</div></div></div></div>';
    html += aiCard('当前参考集选中 ' + sel + ' 批，P10–P90 已生成；若剔除 1 批，支持数变为 ' + Math.max(0, sel - 1) + '，注意 <3 时不输出参考带。', ['入选 ' + sel, '支持 ' + sel, 'P10–P90']);
    return html;
  }
  function bindGolden() {
    S.qsa('[data-golden]').forEach(function (cb) {
      cb.addEventListener('change', function () { state.goldenSelected[Number(cb.getAttribute('data-golden'))] = cb.checked; S.go('golden'); });
    });
    var p = S.qs('[data-action="publish"]');
    if (p) { p.addEventListener('click', function () { S.toast('<b>参考版本</b>：已模拟保存 v2（演示环境，不写回）'); }); }
  }

  function renderReadiness() {
    var avg = Math.round(D.readiness.reduce(function (a, b) { return a + b.value; }, 0) / D.readiness.length);
    var html = head('iPAE / 数据就绪度', '数据就绪度体检', '位号、时间戳、批次覆盖、化验关联、参考集五项体检；总分 ' + avg + '。', '<button class="btn" data-action="check">重新体检</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="grid grid-4" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>总体评分</h3><span>0–100</span></div><div class="v" style="font-size:32px;font-weight:900;color:' + (avg >= 90 ? '#0B9A78' : '#D97706') + '">' + avg + '</div><div class="sub">可以分析，但有短板</div></div><div class="card"><div class="card-h"><h3>问题位号</h3><span>个</span></div><div class="v" style="font-size:32px;font-weight:900;color:#DC2626">16</div><div class="sub">重复/冲突/超量程</div></div><div class="card"><div class="card-h"><h3>未登记批次</h3><span>批</span></div><div class="v" style="font-size:32px;font-weight:900;color:#D97706">58</div><div class="sub">近 14 天</div></div><div class="card"><div class="card-h"><h3>未关联化验</h3><span>批</span></div><div class="v" style="font-size:32px;font-weight:900;color:#D97706">12</div><div class="sub">影响黄金参考</div></div></div>';
    var rows = D.readiness.map(function (r) {
      return '<tr><td><b>' + h(r.name) + '</b></td><td style="min-width:180px"><div class="progress" style="height:8px"><span style="width:' + r.value + '%;background:' + (r.value >= 95 ? '#0B9A78' : (r.value >= 90 ? '#0EA5E9' : '#D97706')) + '"></span></div></td><td><b>' + r.value + '</b></td><td class="sub">' + h(r.detail) + '</td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>五项体检</h3><span>当前数据末端 2024-05-01</span></div>' + table(['指标', '水位', '得分', '说明'], rows) + '</div>';
    html += aiCard('总体就绪度 ' + avg + '，可以开始分析但批次覆盖 88%、化验关联 91% 是短板；建议先补最近 28 批 OP 覆盖和 12 批化验关联。', ['总体 ' + avg, '批次覆盖 88%', '化验关联 91%']);
    return html;
  }
  function bindReadiness() {
    var c = S.qs('[data-action="check"]');
    if (c) { c.addEventListener('click', function () { S.toast('<b>体检</b>：已重新跑 5 项规则（演示环境）'); }); }
  }

  function renderMto() {
    var m = D.mto;
    var html = head('iPAE / MTO 工况', 'MTO 智能分析驾驶舱', '引入 MTO 演示内容：综合收率、产量、能耗、P/E 比、T²/SPE 与贡献度；演示合成数据。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('综合收率', m.kpi.yield, '%', '<span class="up">高于目标 48.0%</span>', '#0B9A78', S.chart.spark([48.1, 48.2, 48.3, 48.2, 48.4, 48.5, 48.5], '#0B9A78'));
    html += kpi('今日烯烃产量', m.kpi.output.toLocaleString(), 't', '计划达成 103%', '#1466E8', S.chart.spark([1200, 1230, 1260, 1270, 1280, 1290, 1297], '#1466E8'));
    html += kpi('单位能耗', m.kpi.energy, 'GJ/t', '<span class="warn">+3.5% vs 平均</span>', '#D97706', S.chart.spark([2.14, 2.12, 2.10, 2.09, 2.11, 2.10, 2.10], '#D97706'));
    html += kpi('P / E 比', m.kpi.pe, '', '高丙烯操作模式', '#0EA5E9', S.chart.spark([1.02, 1.03, 1.04, 1.03, 1.04, 1.05, 1.05], '#0EA5E9'));
    html += kpi('当前工况', '稳定高负荷', '', '持续 ' + m.kpi.load + ' 小时', '#0B9A78', '');
    html += kpi('甲醇进料', m.kpi.feed, 't/h', '当前负荷 101%', '#7C3AED', S.chart.spark([158, 159, 160, 159, 160, 161, 160.8], '#7C3AED'));
    html += '</div>';
    var labels = D.mto.trendYield.map(function (_, i) { return i + '时'; });
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>24h 综合收率</h3><span>% · 目标 48.0</span></div><div class="chart">' + S.chart.line(D.mto.trendYield, { labels: labels, target: 48, min: 47.8, max: 48.9, fixed: 1, color: '#0B9A78' }) + '</div></div><div class="card"><div class="card-h"><h3>24h 单位能耗</h3><span>GJ/t</span></div><div class="chart">' + S.chart.line(D.mto.trendEnergy, { labels: labels, min: 2.04, max: 2.16, fixed: 2, color: '#D97706' }) + '</div></div></div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>T² / SPE 过程稳定性</h3><span>控制限 20 / 12</span></div><div class="chart">' + S.chart.line(D.mto.t2, { labels: labels, target: 20, min: 0, max: 26, fixed: 0, color: '#1466E8' }) + '</div><div class="legend"><span><i style="background:#1466E8"></i>T²（控制限 20）</span><span><i style="background:#F59E0B"></i>SPE（控制限 12）</span></div><div style="margin-top:8px"><div class="chart" style="height:70px">' + S.chart.line(D.mto.spe, { height: 90, target: 12, min: 0, max: 18, fixed: 0, color: '#D97706' }) + '</div></div></div><div class="card"><div class="card-h"><h3>SPE 贡献度</h3><span>TOP 5</span></div><div class="chart">' + S.chart.bars(D.mto.contributions, { height: 240, color: '#6D28D9' }) + '</div></div></div>';
    html += aiCard('MTO 收率 48.5%、能耗 2.1 GJ/t；T²/SPE 在 13–14 时出现峰值，贡献度最高为反应器出口温度 42%，建议核对进料与温控。', ['收率 48.5%', '能耗 +3.5%', 'SPE 峰值 16.4']);
    return html;
  }
  function bindMto() {}

  /* ===================== 设备维度 ===================== */
  function signedPct(v, digits) {
    var n = Number(v), d = digits == null ? 0 : digits;
    if (n > 0) { return '+' + n.toFixed(d) + '%'; }
    if (n < 0) { return '-' + Math.abs(n).toFixed(d) + '%'; }
    return '0.0%';
  }
  function reactorById(id) {
    var out = null;
    D.device.reactors.forEach(function (r) { if (r.id === id) { out = r; } });
    return out;
  }
  function covColor(v) {
    if (v >= 96) { return '#0B9A78'; }
    if (v >= 93) { return '#1466E8'; }
    return '#D97706';
  }
  function covTag(v) {
    var cls = v >= 96 ? 'green' : (v >= 93 ? 'blue' : 'amber');
    return '<span class="tag ' + cls + '">' + v.toFixed(1) + '%</span>';
  }
  function metricMini(k, v, color) {
    return '<div style="border:1px solid #EEF2F7;border-radius:7px;padding:6px 8px;background:#FBFDFF"><span class="sub" style="display:block">' + h(k) + '</span><b style="font-size:12px;color:' + (color || '#334155') + '">' + h(v) + '</b></div>';
  }
  function rangeChart(reactors) {
    var w = 560, hh = 210, padL = 54, padR = 46, padT = 22, padB = 30;
    var min = 20, max = 40;
    var iw = w - padL - padR, ih = hh - padT - padB;
    function x(v) { return padL + (v - min) / (max - min) * iw; }
    var s = '<svg viewBox="0 0 ' + w + ' ' + hh + '" role="img">';
    [20, 25, 30, 35, 40].forEach(function (t) {
      var gx = x(t);
      s += '<line x1="' + gx.toFixed(1) + '" y1="' + padT + '" x2="' + gx.toFixed(1) + '" y2="' + (padT + ih) + '" stroke="#EEF2F7"/>';
      s += '<text x="' + gx.toFixed(1) + '" y="' + (hh - 10) + '" text-anchor="middle" font-size="9" fill="#94A3B8">' + t + '</text>';
    });
    var rowH = ih / reactors.length;
    reactors.forEach(function (r, i) {
      var cy = padT + rowH * (i + 0.5);
      s += '<text x="' + (padL - 10) + '" y="' + (cy + 4) + '" text-anchor="end" font-size="11" font-weight="700" fill="#334155">' + esc(r.id) + '</text>';
      s += '<line x1="' + x(r.p10).toFixed(1) + '" y1="' + cy + '" x2="' + x(r.p90).toFixed(1) + '" y2="' + cy + '" stroke="#1466E8" stroke-width="2" opacity=".35"/>';
      s += '<rect x="' + x(r.p10).toFixed(1) + '" y="' + (cy - 7) + '" width="' + (x(r.p90) - x(r.p10)).toFixed(1) + '" height="14" rx="7" fill="#1466E8" opacity=".14"/>';
      s += '<line x1="' + x(r.median).toFixed(1) + '" y1="' + (cy - 9) + '" x2="' + x(r.median).toFixed(1) + '" y2="' + (cy + 9) + '" stroke="#1466E8" stroke-width="2.4"/>';
      s += '<circle cx="' + x(r.median).toFixed(1) + '" cy="' + cy + '" r="3" fill="#1466E8"/>';
      s += '<text x="' + (w - padR + 6) + '" y="' + (cy + 4) + '" font-size="9" fill="#64748B">' + r.median.toFixed(1) + ' h</text>';
    });
    s += '<text x="' + padL + '" y="' + (padT - 8) + '" font-size="9" fill="#94A3B8">P10–P90 区间 · 竖线为中位</text>';
    s += '</svg>';
    return s;
  }
  function reactorCard(r, avgCov) {
    var left = (r.p10 - 20) / 20 * 100;
    var width = (r.p90 - r.p10) / 20 * 100;
    var med = (r.median - 20) / 20 * 100;
    var s = '<div class="card">';
    s += '<div class="card-h"><h3>' + h(r.id) + ' <span class="tag blue" style="margin-left:3px">带水 UP</span></h3><span>' + r.batches + ' 批</span></div>';
    s += '<div style="display:flex;align-items:flex-end;gap:7px"><b style="font-size:29px;font-weight:900;line-height:1">' + r.median.toFixed(1) + '</b><span class="sub" style="padding-bottom:3px">h · 时长中位</span></div>';
    s += '<div class="sub" style="margin-top:3px">相对组内 ' + signedPct(r.rel, 1) + ' · P10–P90 ' + r.p10.toFixed(1) + '–' + r.p90.toFixed(1) + ' h</div>';
    s += '<div style="position:relative;height:8px;border-radius:999px;background:#EEF2F7;margin:11px 0 2px"><span style="position:absolute;left:' + left.toFixed(1) + '%;width:' + width.toFixed(1) + '%;top:0;bottom:0;border-radius:999px;background:#1466E8;opacity:.25"></span><span style="position:absolute;left:' + med.toFixed(1) + '%;top:-3px;width:2px;height:14px;background:#1466E8"></span></div>';
    s += '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-top:10px">';
    s += metricMini('CV', r.cv.toFixed(2), '#334155');
    s += metricMini('疑似并阶', r.parallel + ' 次', r.parallel > 1 ? '#D97706' : '#334155');
    s += metricMini('异常进出', r.flash.join(' / '), '#334155');
    s += metricMini('最长批次', r.longest + ' h', r.longest >= 80 ? '#D97706' : '#334155');
    s += '</div>';
    s += '<div style="margin-top:10px"><div class="sub">OP 覆盖率</div><div class="progress" style="height:7px;margin-top:4px"><span style="width:' + r.coverage.toFixed(1) + '%;background:' + covColor(r.coverage) + '"></span></div><div style="display:flex;justify-content:space-between;margin-top:4px"><span class="sub">' + r.coverage.toFixed(1) + '%</span><span class="sub">组均 ' + avgCov.toFixed(1) + '%</span></div></div>';
    s += '<div style="margin-top:10px"><button class="btn small" data-reactor-open="' + h(r.id) + '">查看设备档案 →</button></div>';
    s += '</div>';
    return s;
  }
  function deviceDetail(r) {
    var idx = 0;
    D.device.reactors.forEach(function (x, i) { if (x.id === r.id) { idx = i; } });
    var body = '<div class="ai-meta"><span class="tag blue">' + h(r.id) + '</span><span class="tag gray">408 车间 · 带水 UP</span><span class="tag gray">' + h(D.device.window) + '</span></div>';
    body += detailGrid([
      ['批次数', r.batches + ' 批'],
      ['时长中位', r.median.toFixed(1) + ' h'],
      ['P10–P90', r.p10.toFixed(1) + ' – ' + r.p90.toFixed(1) + ' h'],
      ['批次范围', h(r.range)],
      ['CV', r.cv.toFixed(2)],
      ['相对组内中位', signedPct(r.rel, 1)],
      ['OP 覆盖率', covTag(r.coverage)],
      ['疑似并阶', r.parallel + ' 次（最长 ' + r.longest + ' h）'],
      ['异常进出', r.flash.join(' / ')],
      ['设备组', h(D.device.group)]
    ]);
    body += '<div class="ai-block" style="margin-top:14px"><h4>阶段覆盖率</h4><div class="table-wrap"><table><thead><tr><th>OP</th><th>阶段</th><th>覆盖率</th></tr></thead><tbody>' + D.device.stages.map(function (s) {
      return '<tr><td class="mono">' + h(s.op) + '</td><td>' + h(s.name) + '</td><td>' + covTag(s.cover[idx]) + '</td></tr>';
    }).join('') + '</tbody></table></div></div>';
    var devs = D.device.deviations.filter(function (x) { return x.device === r.id; });
    if (devs.length) {
      body += '<div class="ai-block"><h4>该设备显著偏离</h4><div style="display:grid;gap:8px">' + devs.map(function (x) {
        return '<div class="action"><span class="n">!</span><span><b>' + h(x.op) + ' ' + h(x.name) + '</b> ' + signedPct(x.delta, 1) + '（' + h(x.nums) + '）<br>' + h(x.detail) + '<br><span class="sub">建议：' + h(x.action) + '</span></span></div>';
      }).join('') + '</div></div>';
    } else {
      body += '<div class="ai-block"><h4>该设备显著偏离</h4><div class="note" style="margin:0">未检出显著偏离阶段；仍建议结合阶段覆盖率与并阶批次抽查。</div></div>';
    }
    S.detail(r.id + ' · 设备档案', D.device.group + ' · ' + D.device.window, body);
  }
  function renderDevice() {
    var d = D.device;
    var total = 0, covSum = 0, par = 0;
    d.reactors.forEach(function (r) { total += r.batches; covSum += r.coverage; par += r.parallel; });
    var avgCov = covSum / d.reactors.length;
    var html = head('iPAE / 设备维度', '设备维度 · 同配方三釜并列', '历史回放 · 408 车间 · 带水 UP · 2024-03-01 — 2024-05-01 · R401 / R402 / R403 横向对比，自动筛出显著偏离阶段；演示合成数据。', '<button class="btn" data-action="device-export">导出对比</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="kpi-grid">';
    html += kpi('对比设备', 3, '台', 'R401 / R402 / R403', '#1466E8', '');
    html += kpi('总批次', total, '批', '2024-03-01 — 05-01', '#0B9A78', S.chart.spark([38, 39, 41], '#0B9A78'));
    html += kpi('时长中位', d.groupMedian, 'h', '组内 P10–P90 约 29–34 h', '#0EA5E9', S.chart.spark([32.2, 32.6, 32.5], '#0EA5E9'));
    html += kpi('OP 覆盖率', avgCov.toFixed(1), '%', 'R403 92.1% 最低', '#D97706', S.chart.spark([97.0, 95.2, 92.1], '#D97706'));
    html += kpi('显著偏离阶段', d.deviations.length, '个', 'OP10 R402 · OP60 R403', '#DC2626', '');
    html += kpi('疑似并阶', par, '次', '最长 87 h · 3 釜', '#7C3AED', '');
    html += '</div>';
    html += '<div class="grid grid-3" style="margin-bottom:12px">' + d.reactors.map(function (r) { return reactorCard(r, avgCov); }).join('') + '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>时长分布（P10–P90）</h3><span>h · 疑似并阶已剔除</span></div><div class="chart">' + rangeChart(d.reactors) + '</div><div class="legend"><span><i style="background:#1466E8;opacity:.3"></i>P10–P90</span><span><i style="background:#1466E8"></i>中位</span></div><div class="note" style="margin-top:8px;padding:8px 10px">R401/R402 各 1–2 批疑似并阶（最长 87 h），不计入 P10–P90；R403 最长 74 h。</div></div>';
    html += '<div class="card"><div class="card-h"><h3>显著偏离的阶段（' + d.deviations.length + '）</h3><span>同配方 · 组内对比</span></div><div style="display:grid;gap:8px">' + d.deviations.map(function (dv) {
      return '<div style="border:1px solid #FECACA;background:#FFFBFA;border-radius:9px;padding:11px 12px"><div style="display:flex;align-items:center;gap:7px;flex-wrap:wrap"><b class="mono" style="font-size:12px">' + h(dv.op) + '</b><span style="font-size:12px;color:#334155">' + h(dv.name) + '</span><span class="tag red">' + signedPct(dv.delta, 1) + '</span><span class="tag blue">' + h(dv.device) + '</span></div><div class="sub" style="margin-top:6px">' + h(dv.nums) + ' · ' + h(dv.detail) + '</div><div class="note" style="margin:8px 0 0;padding:7px 9px"><b>建议</b>：' + h(dv.action) + '</div></div>';
    }).join('') + '</div></div>';
    html += '</div>';
    var covRows = d.stages.map(function (s) {
      var hl = (s.op === 'OP10' || s.op === 'OP60') ? ' style="background:#FFFDF7"' : '';
      return '<tr' + hl + '><td class="mono">' + h(s.op) + '</td><td>' + h(s.name) + '</td><td>' + covTag(s.cover[0]) + '</td><td>' + covTag(s.cover[1]) + '</td><td>' + covTag(s.cover[2]) + '</td></tr>';
    }).join('');
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>阶段覆盖率矩阵</h3><span>8 段 × 3 釜 · 组均 ' + avgCov.toFixed(1) + '% · 可左右滑动</span></div>' + table(['OP', '阶段', 'R401', 'R402', 'R403'], covRows) + '<div class="note" style="margin-top:10px">覆盖率 = 阶段在批次内被识别出的比例；OP10、OP60 两行为显著偏离阶段 —— R402 OP10 仅 3 段（组内 13 段）、R403 OP60 加料仅 3.2 h（组内 6.2 h）。</div></div>';
    var ins = deviceInsight();
    html += aiCard(ins.summary, ins.evidence);
    return html;
  }
  function bindDevice() {
    var e = S.qs('[data-action="device-export"]');
    if (e) { e.addEventListener('click', function () { S.toast('<b>导出对比</b>：R401/R402/R403 阶段对比 CSV 已生成（演示环境，不写盘）'); }); }
    S.qsa('[data-reactor-open]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = reactorById(b.getAttribute('data-reactor-open'));
        if (r) { deviceDetail(r); }
      });
    });
  }
  function deviceInsight() {
    var d = D.device;
    var r401 = d.reactors[0], r402 = d.reactors[1], r403 = d.reactors[2];
    return {
      time: nowShort(), basis: '设备维度 · 408 车间带水 UP',
      summary: '三釜共 <b>118 批</b>，组内时长中位 <b>32.5 h</b>；OP 覆盖率 R401 97.0% / R402 95.2% / R403 92.1%，R403 最低且 CV 0.32 与 R402 并列最高。',
      findings: [
        'R401 38 批 / 中位 32.2 h / CV 0.28 / 覆盖 97.0%，相对组内 ' + signedPct(r401.rel, 1) + '，是三釜中最稳的一台。',
        'R402 39 批 / 中位 32.6 h / CV 0.32；OP10 只切出 3 段（组内 13 段），阶段时长 -71.9%，疑似真空置换段被合并。',
        'R403 41 批 / 覆盖 92.1% 最低；OP60 正常加料 3.2 h（组内 6.2 h，-48.2%），另有 1 次疑似并阶（最长 74 h）。'
      ],
      actions: [
        '先核对 R402 的 OP10 分段规则与真空置换位号，确认是分段缺失还是取数区间错误。',
        '对 R403 的 OP60 加料段做原始趋势复核，避免把缺段误判成工艺提速。',
        '补齐 R403 的 OP 覆盖（92.1%）后，再用 118 批建三釜基线并复核黄金带。'
      ],
      evidence: ['118 批', '中位 32.5 h', 'R402 OP10 -71.9%', 'R403 OP60 -48.2%']
    };
  }
  /* ===================== 越界清单 ===================== */
  function sevTag(s) {
    var m = { '高': 'red', '中': 'amber', '低': 'gray' };
    return '<span class="tag ' + (m[s] || 'gray') + '">' + h(s) + '严重</span>';
  }
  function outlierStageOptions() {
    var arr = ['全部'];
    D.outlier.stageNames.forEach(function (s) { arr.push(s.split(' ')[0]); });
    return arr;
  }
  function outlierFiltered() {
    return D.outlier.rows.filter(function (r) {
      if (state.outlierSev !== '全部' && r.sev !== state.outlierSev) { return false; }
      if (state.outlierStage !== '全部' && r.worstOp !== state.outlierStage) { return false; }
      return true;
    });
  }
  function outlierAvg(rows) {
    var sum = 0;
    rows.forEach(function (r) { sum += r.rate; });
    return rows.length ? sum / rows.length : 0;
  }
  function outlierStageCounts() {
    var order = outlierStageOptions().slice(1);
    var out = [];
    order.forEach(function (op) {
      var n = 0;
      D.outlier.rows.forEach(function (r) { if (r.worstOp === op) { n++; } });
      if (n > 0) { out.push({ label: op, value: n }); }
    });
    return out;
  }
  function outlierDetail(r) {
    var O = D.outlier;
    var dur = O.baseMedian * (1 + r.dev / 100);
    var unexp = Math.round(dur * (1 - r.coverage / 100) * 60);
    var worstIdx = 0;
    O.stageNames.forEach(function (n, i) { if (n.split(' ')[0] === r.worstOp) { worstIdx = i; } });
    var bars = r.stageRates.map(function (v, i) {
      var color = i === worstIdx ? '#DC2626' : '#1466E8';
      var pctW = Math.min(100, v / 30 * 100);
      return '<div><div style="display:flex;justify-content:space-between;gap:10px;font-size:11px"><span>' + h(O.stageNames[i]) + '</span><b style="color:' + (i === worstIdx ? '#DC2626' : '#334155') + '">' + v.toFixed(1) + '%</b></div><div class="progress" style="height:6px;margin-top:3px"><span style="width:' + pctW.toFixed(1) + '%;background:' + color + '"></span></div></div>';
    }).join('');
    var advice;
    if (r.gap !== '—') { advice = '先补「' + r.gap + '」对应阶段，再复判越界率，避免缺段被当作工艺偏移'; }
    else if (r.rate >= 10) { advice = '核对 ' + r.worstOp + ' 位号控制限与基线版本，确认是否基线漂移或仪表零点偏移'; }
    else { advice = '对照 ' + r.worstOp + ' 的原始趋势复核，暂列观察并补登结果'; }
    var body = '<div class="ai-meta">' + sevTag(r.sev) + '<span class="tag gray">' + h(O.baseline) + '</span><span class="tag amber">未登记结果</span></div>';
    body += '<div class="note" style="margin:0 0 12px;padding:9px 11px"><b>判定摘要</b>：相对 112 批基线，本批越界率 <b>' + r.rate.toFixed(1) + '%</b>，最重阶段 <b>' + h(r.worstOp) + ' ' + h(r.worstName) + ' ' + r.worstRate.toFixed(1) + '%</b>，时长 <b>' + dur.toFixed(1) + ' h</b>（' + signedPct(r.dev) + '），结构缺口 ' + (r.gap === '—' ? '无' : h(r.gap)) + '。</div>';
    body += detailGrid([
      ['批次', h(r.id)],
      ['设备实例', 'R404'],
      ['开始（现场时间）', h(r.start)],
      ['时长 / 偏差', dur.toFixed(1) + ' h / ' + signedPct(r.dev)],
      ['越界率', r.rate.toFixed(1) + '%'],
      ['最重阶段', h(r.worstOp) + ' ' + h(r.worstName) + ' ' + r.worstRate.toFixed(1) + '%'],
      ['结构缺口', r.gap === '—' ? '无' : h(r.gap)],
      ['OP 覆盖率', r.coverage.toFixed(1) + '%'],
      ['结果登记', '未登记'],
      ['判定基线', h(O.baseline)]
    ]);
    body += '<div class="ai-block" style="margin-top:14px"><h4>各阶段越界率</h4><div style="display:grid;gap:7px">' + bars + '</div></div>';
    body += '<div class="ai-block"><h4>证据与建议</h4><div class="note" style="margin:0">未解释区间约 <b>' + unexp + ' min</b>（覆盖率 ' + r.coverage.toFixed(1) + '%）。建议：' + h(advice) + '。</div></div>';
    S.detail('批次档案 · ' + r.id, '408 车间 · 带水 UP · ' + r.start + ' · ' + r.metric, body);
  }
  function renderOutlier() {
    var O = D.outlier;
    var rows = outlierFiltered();
    var avg = outlierAvg(O.rows);
    var gapCount = 0, highCount = 0, op10Count = 0;
    O.rows.forEach(function (r) { if (r.gap !== '—') { gapCount++; } if (r.sev === '高') { highCount++; } if (r.worstOp === 'OP10') { op10Count++; } });
    var top = O.rows.filter(function (r) { return r.top; });
    var sevCount = { '高': 0, '中': 0, '低': 0 };
    O.rows.forEach(function (r) { sevCount[r.sev] = (sevCount[r.sev] || 0) + 1; });
    var html = head('iPAE / 越界清单', '越界清单 · 先筛该看哪批', '历史回放 · 带水 UP 历史基线（R404）v1 · 112 批 · P2.5–P97.5 包络；近 14 天 27 批中 26 批超界，逐批定位到最重阶段。演示合成数据。', '<button class="btn" data-action="outlier-rescan">重新扫描</button><button class="btn" data-action="outlier-export">导出清单</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="alert-strip" style="margin-bottom:12px"><span class="dot"></span><span><b>参考基线</b> ' + h(O.baseline) + ' · <b>' + O.baselineBatches + ' 批</b> · 判定口径 P2.5–P97.5 · 窗口 ' + h(O.window) + '（数据末端 2024-04-29 08:00）</span></div>';
    html += '<div class="kpi-grid">';
    html += kpi('近 14 天批次', O.scanned, '批', '窗口 04-15 — 04-29', '#1466E8', '');
    html += kpi('超界批次', O.exceeded, '批', '96.3% · 1 批未超界', '#DC2626', S.chart.spark([8, 12, 15, 18, 22, 24, 26], '#DC2626'));
    html += kpi('未登记结果', O.unregistered, '批', '全部待登记', '#D97706', '');
    html += kpi('高严重度', highCount, '批', '越界率 7.1–20.0%', '#DC2626', '');
    html += kpi('结构缺口', gapCount, '批', '缺 1–2 段', '#D97706', '');
    html += kpi('平均越界率', avg.toFixed(1), '%', '26 批均值', '#0EA5E9', '');
    html += '</div>';
    html += '<div style="display:flex;align-items:baseline;justify-content:space-between;gap:10px;margin:2px 0 8px"><b style="font-size:13.5px">最要紧的 3 批</b><span class="sub">按越界率 / 结构缺口 / 时长偏差排序 · 点击打开档案</span></div>';
    html += '<div class="grid grid-3" style="margin-bottom:12px">' + top.map(function (r) {
      var dur = (D.outlier.baseMedian * (1 + r.dev / 100)).toFixed(1);
      return '<div class="card" data-outlier="' + h(r.id) + '" style="border-top:3px solid #DC2626;cursor:pointer"><div class="card-h"><h3 class="mono" style="font-size:11px">' + h(r.id) + '</h3>' + sevTag(r.sev) + '</div><div style="display:flex;align-items:baseline;gap:6px"><b style="font-size:25px;font-weight:900;color:#DC2626;line-height:1">' + r.rate.toFixed(1) + '%</b><span class="sub">' + h(r.metric) + '越界率</span></div><div class="sub" style="margin-top:4px">最重 ' + h(r.worstOp) + ' ' + h(r.worstName) + ' <b style="color:#B91C1C">' + r.worstRate.toFixed(1) + '%</b></div><div class="sub" style="margin-top:5px">时长 ' + dur + ' h（' + signedPct(r.dev) + '） · ' + h(r.start) + '</div><div style="margin-top:10px"><span class="btn small">打开档案 →</span></div></div>';
    }).join('') + '</div>';
    html += '<div class="grid grid-2" style="margin-bottom:12px">';
    html += '<div class="card"><div class="card-h"><h3>严重度分布</h3><span>' + O.rows.length + ' 批超界</span></div>' + S.chart.donut([{ label: '高严重', value: sevCount['高'], color: '#DC2626' }, { label: '中严重', value: sevCount['中'], color: '#D97706' }, { label: '低严重', value: sevCount['低'], color: '#94A3B8' }], O.rows.length, '超界批次') + '<div class="note" style="margin-top:10px">高严重度 ' + highCount + ' 批（越界率 7.1–20.0%）；低严重度 ' + sevCount['低'] + ' 批建议先观察。</div></div>';
    html += '<div class="card"><div class="card-h"><h3>最重阶段分布</h3><span>按批次计 · TOP ' + outlierStageCounts().length + '</span></div><div class="chart">' + S.chart.bars(outlierStageCounts(), { height: 240, color: '#DC2626' }) + '</div><div class="legend"><span><i style="background:#DC2626"></i>最重阶段命中批次数</span></div><div class="note" style="margin-top:8px">OP10 建立真空与首次压水在 ' + op10Count + ' 批中为最重阶段，是最普遍的缺口。</div></div>';
    html += '</div>';
    var sevOpts = ['全部', '高', '中', '低'].map(function (s) { return '<option' + (s === state.outlierSev ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    var stageOpts = outlierStageOptions().map(function (s) { return '<option' + (s === state.outlierStage ? ' selected' : '') + '>' + s + '</option>'; }).join('');
    html += '<div class="filters"><span class="count">严重度</span><select id="outlierSev">' + sevOpts + '</select><span class="count">最重阶段</span><select id="outlierStage">' + stageOpts + '</select><span class="spacer"></span><span class="count">命中 ' + rows.length + ' / ' + O.rows.length + ' 批</span></div>';
    var trs = rows.map(function (r) {
      var dur = (O.baseMedian * (1 + r.dev / 100)).toFixed(1);
      return '<tr data-outlier="' + h(r.id) + '"><td>' + sevTag(r.sev) + '</td><td class="mono" style="white-space:nowrap">' + h(r.id) + '</td><td>R404</td><td>' + h(r.start) + '</td><td>' + dur + ' h <span class="sub">(' + signedPct(r.dev) + ')</span></td><td><b style="color:' + (r.rate >= 10 ? '#DC2626' : (r.rate >= 5 ? '#D97706' : '#334155')) + '">' + r.rate.toFixed(1) + '%</b></td><td>' + h(r.worstOp) + ' ' + h(r.worstName) + ' <span class="sub">' + r.worstRate.toFixed(1) + '%</span></td><td>' + (r.gap === '—' ? '<span class="tag gray">无</span>' : '<span class="tag amber">' + h(r.gap) + '</span>') + '</td><td><span class="tag amber">未登记</span></td><td><button class="btn small">打开档案</button></td></tr>';
    }).join('');
    html += '<div class="card"><div class="card-h"><h3>越界明细</h3><span>' + rows.length + ' / ' + O.rows.length + ' 批 · 点击行查看阶段越界分布 · 可左右滑动</span></div>' + table(['严重度', '批次', '设备实例', '开始（现场时间）', '时长（偏差）', '越界率', '最重阶段', '结构缺口', '结果登记', '打开档案'], trs) + '<div class="note" style="margin-top:10px">另有 1 批 ' + h(O.excluded.id) + '（' + h(O.excluded.start) + '）越界率 ' + O.excluded.rate.toFixed(1) + '%，未超界已排除；近 14 天扫描的 27 批结果全部未登记。</div></div>';
    var ins = outlierInsight();
    html += '<div style="margin-top:12px">' + aiCard(ins.summary, ins.evidence) + '</div>';
    return html;
  }
  function bindOutlier() {
    var sev = S.qs('#outlierSev');
    if (sev) { sev.addEventListener('change', function (e) { state.outlierSev = e.target.value; S.go('outlier'); }); }
    var stage = S.qs('#outlierStage');
    if (stage) { stage.addEventListener('change', function (e) { state.outlierStage = e.target.value; S.go('outlier'); }); }
    var rescan = S.qs('[data-action="outlier-rescan"]');
    if (rescan) { rescan.addEventListener('click', function () { S.toast('<b>重新扫描</b>：已用基线 v1（112 批）重跑 27 批（演示环境）'); }); }
    var exp = S.qs('[data-action="outlier-export"]');
    if (exp) { exp.addEventListener('click', function () { S.toast('<b>导出清单</b>：26 批越界明细 CSV 已生成（演示环境，不写盘）'); }); }
    S.qsa('[data-outlier]').forEach(function (el) {
      el.addEventListener('click', function () {
        var id = el.getAttribute('data-outlier');
        var row = null;
        D.outlier.rows.forEach(function (r) { if (r.id === id) { row = r; } });
        if (row) { outlierDetail(row); }
      });
    });
  }
  function outlierInsight() {
    var O = D.outlier;
    var rows = outlierFiltered();
    var avg = outlierAvg(rows);
    var top = O.rows.filter(function (r) { return r.top; });
    var first = top[0];
    var op10 = 0, gaps = 0, highRate = 0;
    rows.forEach(function (r) {
      if (r.worstOp === 'OP10') { op10++; }
      if (r.gap !== '—') { gaps++; }
      if (r.rate >= 7) { highRate++; }
    });
    var filterText = (state.outlierSev === '全部' ? '全部严重度' : state.outlierSev + '严重度') + ' · ' + (state.outlierStage === '全部' ? '全部阶段' : state.outlierStage);
    return {
      time: nowShort(), basis: '越界清单 · ' + filterText,
      summary: '近 14 天扫描 <b>27 批</b>，<b>26 批超界</b>（96.3%），结果全部未登记；当前筛选（' + filterText + '）命中 <b>' + rows.length + ' 批</b>，平均越界率 <b>' + avg.toFixed(1) + '%</b>。',
      findings: [
        '最重一批 <b>' + first.id + '</b>：' + first.metric + '越界率 <b>20.0%</b>，最重阶段 OP10 置换真空 27.0%，时长 +9%。',
        '当前筛选下以 OP10 为最重阶段的有 <b>' + op10 + ' 批</b>，结构缺口 <b>' + gaps + ' 批</b>（缺 1–2 段），越界率 ≥7% 的 <b>' + highRate + ' 批</b>。',
        '27 批结果全部未登记，无法把越界与收率/质量关联；基线为 R404 v1（112 批），已按工序单元排除不可比批次。'
      ],
      actions: [
        '先处理 6 批高严重度，优先 408-R404-24041505-1608 与 408-R404-24042609-0604（时长 +43%）。',
        '逐批打开档案看阶段越界分布，优先补 ' + (gaps ? gaps + ' 批结构缺口' : 'OP10 置换真空段') + '，再做越界复判。',
        '补登 27 批结果后重算基线 v2，避免「越界但无法归因」。'
      ],
      evidence: ['超界 26 / 27', '高严重度 6', '平均越界率 ' + avg.toFixed(1) + '%', '结构缺口 ' + gaps]
    };
  }

  /* ===================== 批次工作台 · 5 步向导 ===================== */
  var WIZ_STEPS = ['设备与范围', '批次标注', '系统归纳', '规则精修', '批次识别'];
  function wizNormal() {
    var n = 0;
    state.wizMarks.forEach(function (m) { if (m === 'normal') { n++; } });
    return n;
  }
  function wizAbnormal() {
    var n = 0;
    state.wizMarks.forEach(function (m) { if (m === 'abnormal') { n++; } });
    return n;
  }
  function wizSuggestion(c) {
    if (c.parallel) { return '<span class="tag red">疑似并阶</span>'; }
    if (c.op10Seg < 8) { return '<span class="tag amber">OP10 缺段</span>'; }
    if (c.dur > 35) { return '<span class="tag amber">时长偏长</span>'; }
    if (c.op60 > 7.5) { return '<span class="tag amber">加料偏长</span>'; }
    return '<span class="tag green">符合基线</span>';
  }
  function markBtn(i, mark, label, cur) {
    var on = cur === mark;
    var style = '';
    if (on && mark === 'normal') { style = ' style="background:#0B9A78;border-color:#0B9A78;color:#fff"'; }
    if (on && mark === 'abnormal') { style = ' style="background:#DC2626;border-color:#DC2626;color:#fff"'; }
    if (on && mark === 'unknown') { style = ' style="background:#64748B;border-color:#64748B;color:#fff"'; }
    return '<button class="btn small" data-wiz-mark="' + i + ':' + mark + '"' + style + '>' + label + '</button>';
  }
  function wizRuleSupport(id) {
    var W = D.wizard;
    var n = 0;
    W.candidates.forEach(function (c, i) {
      var m = state.wizMarks[i];
      if (m === 'unknown') { return; }
      var ok = false;
      if (id === 'R-01') { ok = c.dur >= 28.0 && c.dur <= state.wizRules.r01High; }
      if (id === 'R-02') { ok = c.op10Seg >= state.wizRules.r02MinSeg; }
      if (id === 'R-03') { ok = c.op60 >= 5.0 && c.op60 <= state.wizRules.r03High; }
      if ((m === 'normal' && ok) || (m === 'abnormal' && !ok)) { n++; }
    });
    return n;
  }
  function wizConflicts(id) {
    var W = D.wizard;
    var n = 0;
    W.candidates.forEach(function (c, i) {
      if (state.wizMarks[i] !== 'normal') { return; }
      if (id === 'R-01' && !(c.dur >= 28.0 && c.dur <= state.wizRules.r01High)) { n++; }
      if (id === 'R-02' && c.op10Seg < state.wizRules.r02MinSeg) { n++; }
      if (id === 'R-03' && !(c.op60 >= 5.0 && c.op60 <= state.wizRules.r03High)) { n++; }
    });
    return n;
  }
  function wizConflictBatches() {
    var hit = {};
    D.wizard.candidates.forEach(function (c, i) {
      if (state.wizMarks[i] !== 'normal') { return; }
      if (!(c.dur >= 28.0 && c.dur <= state.wizRules.r01High)) { hit[i] = true; }
      if (c.op10Seg < state.wizRules.r02MinSeg) { hit[i] = true; }
      if (!(c.op60 >= 5.0 && c.op60 <= state.wizRules.r03High)) { hit[i] = true; }
    });
    return Object.keys(hit).length;
  }
  function wizHits() {
    return {
      r01: 42 + Math.round((state.wizRules.r01High - 35.0) * 8),
      r02: 36 - Math.round((state.wizRules.r02MinSeg - 8) * 6),
      r03: 31 + Math.round((state.wizRules.r03High - 7.0) * 10)
    };
  }
  function wizRecognition() {
    var hits = wizHits();
    var normal = 96 + Math.round((hits.r01 - 42) * 0.6 + (hits.r02 - 36) * 0.5 + (hits.r03 - 31) * 0.4) + (wizNormal() - 10);
    var suspect = 18 - Math.round((hits.r01 - 42) * 0.25 + (hits.r02 - 36) * 0.2);
    if (normal > 112) { normal = 112; }
    if (normal < 70) { normal = 70; }
    if (suspect > 30) { suspect = 30; }
    if (suspect < 4) { suspect = 4; }
    var unknown = 122 - normal - suspect;
    if (unknown < 0) { normal = normal + unknown; unknown = 0; }
    return { total: 122, normal: normal, suspect: suspect, unknown: unknown };
  }
  function wizardStyles() {
    return '<style>'
      + '.ip-steps{display:flex;flex-wrap:wrap;gap:6px;align-items:stretch}'
      + '.ip-step{flex:1 1 138px;min-width:0;border:1px solid var(--line);background:#F8FAFC;border-radius:9px;padding:8px 10px;cursor:pointer;transition:.15s}'
      + '.ip-step:hover{border-color:#B9CBE0}'
      + '.ip-step.on{background:#EEF2FF;border-color:#C7D2FE;box-shadow:0 6px 16px rgba(20,102,232,.10)}'
      + '.ip-step.done{background:#F0FDF9;border-color:#A7F3D0}'
      + '.ip-step .n{font-size:9.5px;font-weight:900;color:#94A3B8;letter-spacing:.10em}'
      + '.ip-step.on .n{color:#1D4ED8}'
      + '.ip-step .t{font-size:12px;font-weight:800;color:#0F172A;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '.ip-step .s{font-size:10px;color:#94A3B8;margin-top:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}'
      + '@media(max-width:700px){.ip-step{flex:1 1 calc(50% - 6px)}}'
      + '</style>';
  }
  function wizStepSub(n) {
    if (n === 1) { return state.wizDevice + ' · ' + state.wizWindow; }
    if (n === 2) { return '已标注 ' + (wizNormal() + wizAbnormal()) + ' / ' + D.wizard.candidates.length; }
    if (n === 3) { return D.wizard.rules.length + ' 条规则'; }
    if (n === 4) { return '阈值 v2 草稿'; }
    return '122 批 · ' + (state.wizApplied ? '已应用' : '待应用');
  }
  function wizStepStrip() {
    var s = '<div class="card" style="padding:11px 12px;margin-bottom:12px"><div class="ip-steps">';
    WIZ_STEPS.forEach(function (t, i) {
      var n = i + 1;
      s += '<div class="ip-step' + (state.wizStep === n ? ' on' : '') + (state.wizStep > n ? ' done' : '') + '" data-wiz-step="' + n + '"><div class="n">STEP ' + n + '</div><div class="t">' + h(t) + '</div><div class="s">' + h(wizStepSub(n)) + '</div></div>';
    });
    s += '<div class="ip-step' + (state.wizApplied ? ' done' : '') + '" data-wiz-apply="1" style="background:' + (state.wizApplied ? '#F0FDF9' : '#F5F3FF') + ';border-color:' + (state.wizApplied ? '#A7F3D0' : '#DDD6FE') + '"><div class="n">APPLY</div><div class="t">应用</div><div class="s">' + (state.wizApplied ? '已应用 v2' : '写规则集版本') + '</div></div>';
    s += '</div></div>';
    return s;
  }
  function miniStat(label, value, unit, sub, color) {
    return '<div class="card" style="padding:13px 14px"><div class="card-h" style="margin-bottom:4px"><h3 style="font-size:12px;color:#64748B">' + h(label) + '</h3><span>' + h(unit) + '</span></div><div style="font-size:26px;font-weight:900;color:' + color + ';line-height:1.1">' + value + '</div><div class="sub" style="margin-top:4px">' + sub + '</div></div>';
  }
  function wizStep1() {
    var W = D.wizard;
    var can = Math.max(0, Math.round(W.pool[state.wizDevice] * W.windowFactor[state.wizWindow]));
    var s = '<div class="card"><div class="card-h"><h3>① 设备与范围</h3><span>只圈定范围，不写入</span></div>';
    s += '<div class="filters" style="margin-bottom:4px"><span class="count">设备组</span><select id="wizGroup"><option>' + h(W.group) + '</option></select>';
    s += '<span class="count">时间窗口</span><select id="wizWindow">' + W.windows.map(function (w) { return '<option' + (w === state.wizWindow ? ' selected' : '') + '>' + w + '</option>'; }).join('') + '</select>';
    s += '<span class="count">标注模板</span><select id="wizTemplate"><option>' + h(W.template) + '</option></select></div>';
    s += '<div style="display:flex;gap:6px;align-items:center;flex-wrap:wrap;margin:10px 0 12px"><span class="count">设备实例</span>';
    D.device.reactors.forEach(function (r) {
      s += '<button class="btn small' + (r.id === state.wizDevice ? ' primary' : '') + '" data-wiz-device="' + r.id + '">' + r.id + '</button>';
    });
    s += '<span class="sub">（该设备历史 ' + W.pool[state.wizDevice] + ' 批）</span></div>';
    s += detailGrid([
      ['设备组', h(W.group)],
      ['设备实例', state.wizDevice],
      ['时间窗口', state.wizWindow],
      ['标注模板', h(W.template)],
      ['窗口内候选', can + ' 批'],
      ['历史池', W.pool[state.wizDevice] + ' 批'],
      ['工序阶段', '8 段（OP10–OP100）'],
      ['数据末端', '2024-05-01 08:00']
    ]);
    s += '<div class="note" style="margin-top:12px">第 1 步只决定标注范围；点击下方按钮载入历史会话「标注会话-R401-20240301」（12 个候选批次）进入第 2 步。设备/窗口切换只更新范围预估。</div>';
    s += '<div style="margin-top:12px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn primary" data-wiz-load>载入会话并继续标注（12 批）→</button><button class="btn" data-wiz-next>直接下一步</button></div>';
    s += '</div>';
    return s;
  }
  function wizStep2() {
    var W = D.wizard;
    var cands = W.candidates;
    var normal = wizNormal(), abnormal = wizAbnormal(), unknown = cands.length - normal - abnormal;
    var s = '<div class="card"><div class="card-h"><h3>② 批次标注</h3><span>会话 标注会话-R401-20240301 · R401 · 03/01 08:00–04/01 08:00</span></div>';
    s += '<div style="display:flex;gap:12px;flex-wrap:wrap;align-items:center;margin-bottom:10px"><span class="tag green">正常 ' + normal + '</span><span class="tag red">异常 ' + abnormal + '</span><span class="tag gray">未判定 ' + unknown + '</span><span class="sub">已标注 ' + (normal + abnormal) + ' / ' + cands.length + '</span><span style="flex:1;min-width:120px"><span class="progress" style="height:8px"><span style="width:' + Math.round((normal + abnormal) / cands.length * 100) + '%;background:#1466E8"></span></span></span></div>';
    var rows = cands.map(function (c, i) {
      var m = state.wizMarks[i];
      return '<tr><td class="mono">' + h(c.id) + '</td><td>' + h(c.start) + '</td><td>' + c.dur.toFixed(1) + ' h</td><td>' + c.coverage.toFixed(1) + '%</td><td>' + c.op10Seg + ' 段</td><td>' + c.op60.toFixed(1) + ' h</td><td>' + wizSuggestion(c) + '</td><td><div style="display:flex;gap:4px;flex-wrap:wrap">' + markBtn(i, 'normal', '正常', m) + markBtn(i, 'abnormal', '异常', m) + markBtn(i, 'unknown', '未判定', m) + '</div></td></tr>';
    }).join('');
    s += table(['批次', '开始', '时长', 'OP 覆盖', 'OP10 段数', 'OP60 加料', '系统建议', '人工判定'], rows);
    s += '<div class="note" style="margin-top:10px">点击判定按钮模拟人工认批（正常 / 异常 / 未判定）；第 3 步的规则支持数与第 5 步识别结果会随标注变化。</div>';
    s += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-wiz-reset>恢复初始标注</button><button class="btn small" data-wiz-next>进入系统归纳 →</button></div>';
    s += '</div>';
    return s;
  }
  function wizStep3() {
    var W = D.wizard;
    var s1 = wizRuleSupport('R-01'), s2 = wizRuleSupport('R-02'), s3 = wizRuleSupport('R-03');
    var rows = W.rules.map(function (r) {
      var sup = r.dynamic === 'r01' ? s1 : (r.dynamic === 'r02' ? s2 : (r.dynamic === 'r03' ? s3 : r.support));
      return '<tr><td class="mono">' + h(r.id) + '</td><td><b>' + h(r.name) + '</b></td><td>' + h(r.cond) + '</td><td>' + sup + ' / 12</td><td>' + Math.round(r.confidence * 100) + '%</td><td class="sub">' + h(r.stage) + '</td></tr>';
    }).join('');
    var conflicts = [];
    if (wizConflicts('R-01')) { conflicts.push('R-01 时长窗口冲突 ' + wizConflicts('R-01') + ' 批'); }
    if (wizConflicts('R-02')) { conflicts.push('R-02 OP10 分段冲突 ' + wizConflicts('R-02') + ' 批'); }
    if (wizConflicts('R-03')) { conflicts.push('R-03 OP60 加料冲突 ' + wizConflicts('R-03') + ' 批'); }
    var s = '<div class="card"><div class="card-h"><h3>③ 系统归纳</h3><span>从 12 个标注批次提炼规则</span></div>';
    s += '<div class="grid grid-4" style="margin-bottom:12px">';
    s += miniStat('标注批次', '12', '批', '正常 ' + wizNormal() + ' / 异常 ' + wizAbnormal(), '#1466E8');
    s += miniStat('可量化规则', '3', '条', '时长 / 分段 / 加料', '#0B9A78');
    s += miniStat('保护规则', '3', '条', '并阶 / 覆盖 / 登记', '#7C3AED');
    s += miniStat('规则冲突', String(conflicts.length), '处', conflicts.length ? '需在精修中处理' : '当前无冲突', conflicts.length ? '#DC2626' : '#0B9A78');
    s += '</div>';
    s += table(['规则', '名称', '判定条件', '支持批次', '置信度', '覆盖阶段'], rows);
    s += '<div class="note" style="margin-top:10px">' + (conflicts.length ? '与人工标注冲突：' + h(conflicts.join('；')) + '。可进入第 4 步调整阈值。' : '3 条可量化规则与 12 个标注批次全部一致；保护规则不参与正常判定，只做兜底。') + '</div>';
    s += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn" data-wiz-prev>← 返回标注</button><button class="btn primary" data-wiz-next>进入规则精修 →</button></div>';
    s += '</div>';
    return s;
  }
  function tuneCard(title, key, valueText, min, max, stepSize, hits, conflicts, ruleId) {
    return '<div class="card" style="padding:13px 14px;box-shadow:none;background:#FBFDFF">'
      + '<div class="card-h" style="margin-bottom:6px"><h3 style="font-size:12.5px">' + h(title) + '</h3><span>' + h(ruleId) + '</span></div>'
      + '<div style="display:flex;align-items:center;gap:8px"><button class="btn small" data-wiz-rule="' + key + '" data-wiz-dir="-1">−</button><b style="font-size:19px;min-width:72px;text-align:center">' + h(valueText) + '</b><button class="btn small" data-wiz-rule="' + key + '" data-wiz-dir="1">+</button></div>'
      + '<div style="display:flex;justify-content:space-between;margin-top:8px"><span class="sub">预计命中</span><b style="font-size:12px">' + hits + ' / 118 批</b></div>'
      + '<div style="display:flex;justify-content:space-between;margin-top:4px"><span class="sub">与标注冲突</span><b style="font-size:12px;color:' + (conflicts ? '#DC2626' : '#0B9A78') + '">' + conflicts + ' 批</b></div>'
      + '<div class="sub" style="margin-top:6px;font-size:10px">范围 ' + min + '–' + max + '，步长 ' + stepSize + '</div>'
      + '</div>';
  }
  function wizStep4() {
    var r = state.wizRules;
    var hits = wizHits();
    var rec = wizRecognition();
    var s = '<div class="card"><div class="card-h"><h3>④ 规则精修</h3><span>规则集 R401-UP-v2（草稿）</span></div>';
    s += '<div class="grid grid-4" style="margin-bottom:12px">';
    s += tuneCard('R-01 时长上限', 'r01High', r.r01High.toFixed(1) + ' h', '34.0', '36.0', '0.5 h', hits.r01, wizConflicts('R-01'), 'R-01');
    s += tuneCard('R-02 OP10 最小段数', 'r02MinSeg', r.r02MinSeg + ' 段', '7', '10', '1 段', hits.r02, wizConflicts('R-02'), 'R-02');
    s += tuneCard('R-03 OP60 上限', 'r03High', r.r03High.toFixed(1) + ' h', '6.5', '8.0', '0.5 h', hits.r03, wizConflicts('R-03'), 'R-03');
    s += '<div class="card" style="padding:13px 14px;border-color:#C7D2FE;background:#EEF2FF"><div class="card-h" style="margin-bottom:4px"><h3 style="font-size:12.5px;color:#3730A3">识别预估</h3><span>122 批</span></div><div style="display:grid;gap:5px;margin-top:6px"><div style="display:flex;justify-content:space-between"><span class="sub">正常</span><b style="color:#0B9A78">' + rec.normal + ' 批</b></div><div style="display:flex;justify-content:space-between"><span class="sub">疑似异常</span><b style="color:#D97706">' + rec.suspect + ' 批</b></div><div style="display:flex;justify-content:space-between"><span class="sub">未识别</span><b style="color:#64748B">' + rec.unknown + ' 批</b></div></div><div class="sub" style="margin-top:6px;font-size:10px">随阈值实时变化</div></div>';
    s += '</div>';
    s += '<div class="note" style="margin-top:10px">收紧阈值会增加与人工标注的冲突；建议保持冲突为 0 再发布。当前三条规则预计合计命中 ' + (hits.r01 + hits.r02 + hits.r03) + ' 批（含重叠）。</div>';
    s += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn small" data-wiz-reset-rules>恢复默认阈值</button><button class="btn small" data-wiz-publish>保存规则集 v2 草稿</button><button class="btn primary" data-wiz-next>进入批次识别 →</button></div>';
    s += '</div>';
    return s;
  }
  function wizVerdictTag(v) {
    if (v === '正常') { return '<span class="tag green">正常</span>'; }
    if (v === '疑似异常') { return '<span class="tag amber">疑似异常</span>'; }
    return '<span class="tag gray">未识别</span>';
  }
  function wizStep5() {
    var W = D.wizard;
    var rec = wizRecognition();
    var s = '<div class="card"><div class="card-h"><h3>⑤ 批次识别</h3><span>规则集 R401-UP-v2 · 122 批</span></div>';
    s += '<div class="grid grid-4" style="margin-bottom:12px">';
    s += miniStat('识别批次', '122', '批', 'R401–R403 历史池', '#1466E8');
    s += miniStat('正常', String(rec.normal), '批', '命中 R-01/R-02/R-03', '#0B9A78');
    s += miniStat('疑似异常', String(rec.suspect), '批', '命中 R-04 并阶保护', '#D97706');
    s += miniStat('未识别', String(rec.unknown), '批', '触发 R-05 覆盖率闸门', '#64748B');
    s += '</div>';
    if (state.wizApplied) {
      s += '<div class="alert-strip" style="margin-bottom:12px;background:#F0FDF9;border-color:#A7F3D0;color:#065F46"><span class="dot" style="background:#0B9A78"></span><span><b>已应用</b>：R401-UP-v2 已写入规则集并记录审计（演示环境不写回）；应用后识别 正常 ' + rec.normal + ' / 疑似 ' + rec.suspect + ' / 未识别 ' + rec.unknown + ' 批。</span></div>';
    }
    var rows = W.recognition.rows.map(function (x) {
      return '<tr><td class="mono">' + h(x.id) + '</td><td>' + h(x.start) + '</td><td>' + h(x.dur) + '</td><td>' + wizVerdictTag(x.verdict) + '</td><td>' + h(x.rule) + '</td><td>' + (x.conf ? Math.round(x.conf * 100) + '%' : '—') + '</td></tr>';
    }).join('');
    s += table(['批次', '开始', '时长', '判定', '命中规则', '置信度'], rows);
    s += '<div class="note" style="margin-top:10px">示例 8 条；2 条疑似并阶、1 条未识别。应用后规则集版本写为 v2，并记入审计日志。</div>';
    s += '<div style="margin-top:10px;display:flex;gap:8px;flex-wrap:wrap">';
    s += '<button class="btn primary" data-wiz-apply>' + (state.wizApplied ? '已应用' : '应用规则集并识别') + '</button>';
    s += '<button class="btn small" data-wiz-export>导出识别结果</button><button class="btn small" data-wiz-rerun>重新识别</button>';
    s += '</div></div>';
    return s;
  }
  function wizFooter() {
    var step = state.wizStep;
    var s = '<div class="card" style="display:flex;align-items:center;gap:8px;flex-wrap:wrap;padding:11px 14px;margin-top:12px">';
    s += '<button class="btn" data-wiz-prev' + (step === 1 ? ' disabled' : '') + '>← 上一步</button>';
    s += '<button class="btn' + (step < 5 ? ' primary' : '') + '" data-wiz-next' + (step === 5 ? ' disabled' : '') + '>下一步 →</button>';
    s += '<span class="sub">步骤 ' + step + ' / 5 · ' + h(WIZ_STEPS[step - 1]) + '</span><span style="flex:1"></span>';
    if (step === 5) {
      s += '<button class="btn primary" data-wiz-apply>' + (state.wizApplied ? '已应用' : '应用规则集并识别') + '</button>';
    } else {
      s += '<span class="sub">完成后进入识别与应用</span>';
    }
    s += '</div>';
    return s;
  }
  function wizSessions() {
    var W = D.wizard;
    var rows = W.sessions.map(function (x) {
      return '<tr data-wiz-session="' + h(x.id) + '"><td class="mono">' + h(x.id) + '</td><td>' + h(x.device) + '</td><td>' + h(x.from) + ' – ' + h(x.to) + '</td><td>' + x.count + ' 批</td><td>' + (x.status === '进行中' ? '<span class="tag amber">进行中</span>' : '<span class="tag green">已完成</span>') + '</td><td class="sub">' + h(x.updated) + '</td><td><button class="btn small">' + (x.editable ? '续做' : '查看') + '</button></td></tr>';
    }).join('');
    return '<div class="card" style="margin-top:12px"><div class="card-h"><h3>历史标注会话（10）</h3><span>合计 136 个标注批次 · 2 条进行中 · 可左右滑动</span></div>' + table(['会话', '设备', '标注窗口', '已标注批次', '状态', '更新时间', ''], rows) + '<div class="note" style="margin-top:10px">会话 1 为进行中，可继续标注；其余 9 条为只读归档，点击查看会话摘要。</div></div>';
  }
  function wizSessionDetail(id) {
    var x = null;
    D.wizard.sessions.forEach(function (s) { if (s.id === id) { x = s; } });
    if (!x) { return; }
    var body = '<div class="ai-meta"><span class="tag blue">' + h(x.device) + '</span>' + (x.status === '进行中' ? '<span class="tag amber">进行中</span>' : '<span class="tag green">已完成</span>') + '<span class="tag gray">' + h(D.wizard.group) + '</span></div>';
    body += detailGrid([
      ['会话', h(x.id)],
      ['设备实例', h(x.device)],
      ['标注窗口', h(x.from) + ' – ' + h(x.to)],
      ['已标注批次', x.count + ' 批'],
      ['状态', h(x.status)],
      ['更新时间', h(x.updated)],
      ['标注模板', h(D.wizard.template)],
      ['可编辑', x.editable ? '是' : '只读归档']
    ]);
    body += '<div class="ai-block"><h4>说明</h4><div class="note" style="margin:0">' + (x.editable ? '该会话已标注 12 个批次，可进入第 2 步继续调整判定；阈值与标注变化会同步到第 3–5 步。' : '该会话为只读归档，仅展示统计；如需重做请在设备维度复制新会话。') + '</div></div>';
    if (x.editable) { body += '<div style="margin-top:12px"><button class="btn primary" id="wizSessionGo">进入第 2 步继续标注 →</button></div>'; }
    S.detail('标注会话 · ' + x.id, D.wizard.group + ' · ' + x.device, body);
    var go = document.getElementById('wizSessionGo');
    if (go) { go.addEventListener('click', function () { state.wizStep = 2; S.closeDetail(); S.go('wizard'); }); }
  }
  function renderWizard() {
    var html = head('iPAE / 过程重建', '批次工作台 · 5 步标注向导', '历史回放 · 设备与范围 → 批次标注 → 系统归纳 → 规则精修 → 批次识别 → 应用；把老师傅的人工认批固化成可复用规则。演示合成数据，不写回。', '<button class="btn" data-wiz-save>保存会话</button><button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += wizardStyles();
    html += wizStepStrip();
    html += wizStepBody();
    html += wizFooter();
    html += wizSessions();
    var ins = wizardInsight();
    html += '<div style="margin-top:12px">' + aiCard(ins.summary, ins.evidence) + '</div>';
    return html;
  }
  function wizStepBody() {
    if (state.wizStep === 1) { return wizStep1(); }
    if (state.wizStep === 2) { return wizStep2(); }
    if (state.wizStep === 3) { return wizStep3(); }
    if (state.wizStep === 4) { return wizStep4(); }
    return wizStep5();
  }
  function wizardTune(key, dir) {
    var r = state.wizRules;
    if (key === 'r01High') { r.r01High = Math.min(36.0, Math.max(34.0, Math.round((r.r01High + dir * 0.5) * 10) / 10)); }
    if (key === 'r02MinSeg') { r.r02MinSeg = Math.min(10, Math.max(7, r.r02MinSeg + dir)); }
    if (key === 'r03High') { r.r03High = Math.min(8.0, Math.max(6.5, Math.round((r.r03High + dir * 0.5) * 10) / 10)); }
    S.go('wizard');
  }
  function wizardApply() {
    if (state.wizStep !== 5) { S.toast('<b>应用</b>：请先在第 5 步核对识别结果'); return; }
    if (state.wizApplied) { S.toast('<b>规则集</b>：R401-UP-v2 已应用，无需重复操作'); return; }
    state.wizApplied = true;
    S.go('wizard');
    S.toast('<b>已应用</b>：R401-UP-v2 写入规则集（演示环境，不写回）');
  }
  function bindWizard() {
    S.qsa('[data-wiz-step]').forEach(function (el) {
      el.addEventListener('click', function () { state.wizStep = Number(el.getAttribute('data-wiz-step')); S.go('wizard'); });
    });
    S.qsa('[data-wiz-apply]').forEach(function (el) {
      el.addEventListener('click', function () { wizardApply(); });
    });
    var wsel = S.qs('#wizWindow');
    if (wsel) { wsel.addEventListener('change', function (e) { state.wizWindow = e.target.value; S.go('wizard'); }); }
    S.qsa('[data-wiz-device]').forEach(function (b) {
      b.addEventListener('click', function () { state.wizDevice = b.getAttribute('data-wiz-device'); S.go('wizard'); });
    });
    S.qsa('[data-wiz-mark]').forEach(function (b) {
      b.addEventListener('click', function () {
        var v = b.getAttribute('data-wiz-mark').split(':');
        state.wizMarks[Number(v[0])] = v[1];
        S.go('wizard');
      });
    });
    var load = S.qs('[data-wiz-load]');
    if (load) { load.addEventListener('click', function () { state.wizStep = 2; S.go('wizard'); S.toast('<b>已载入</b>：标注会话-R401-20240301 · 12 个候选批次'); }); }
    var reset = S.qs('[data-wiz-reset]');
    if (reset) { reset.addEventListener('click', function () { state.wizMarks = D.wizard.candidates.map(function (c) { return c.mark; }); S.go('wizard'); S.toast('<b>已恢复</b>：初始 12 条人工标注'); }); }
    var resetRules = S.qs('[data-wiz-reset-rules]');
    if (resetRules) { resetRules.addEventListener('click', function () { state.wizRules = { r01High: 35.0, r02MinSeg: 8, r03High: 7.0 }; S.go('wizard'); S.toast('<b>规则阈值</b>：已恢复默认（35.0 h / 8 段 / 7.0 h）'); }); }
    var publish = S.qs('[data-wiz-publish]');
    if (publish) { publish.addEventListener('click', function () { S.toast('<b>规则集</b>：R401-UP-v2 草稿已保存（演示环境，不写回）'); }); }
    S.qsa('[data-wiz-rule]').forEach(function (b) {
      b.addEventListener('click', function () { wizardTune(b.getAttribute('data-wiz-rule'), Number(b.getAttribute('data-wiz-dir'))); });
    });
    S.qsa('[data-wiz-next]').forEach(function (b) { b.addEventListener('click', function () { if (state.wizStep < 5) { state.wizStep = state.wizStep + 1; S.go('wizard'); } }); });
    S.qsa('[data-wiz-prev]').forEach(function (b) { b.addEventListener('click', function () { if (state.wizStep > 1) { state.wizStep = state.wizStep - 1; S.go('wizard'); } }); });
    S.qsa('[data-wiz-session]').forEach(function (tr) { tr.addEventListener('click', function () { wizSessionDetail(tr.getAttribute('data-wiz-session')); }); });
    var save = S.qs('[data-wiz-save]');
    if (save) { save.addEventListener('click', function () { S.toast('<b>保存会话</b>：标注会话-R401-20240301 已保存（演示环境，不写回）'); }); }
    var exp = S.qs('[data-wiz-export]');
    if (exp) { exp.addEventListener('click', function () { S.toast('<b>导出</b>：122 批识别结果 CSV 已生成（演示环境，不写盘）'); }); }
    var rerun = S.qs('[data-wiz-rerun]');
    if (rerun) { rerun.addEventListener('click', function () { S.toast('<b>重新识别</b>：已用 R401-UP-v2 重跑 122 批（演示环境）'); }); }
  }
  function wizardInsight() {
    var W = D.wizard;
    var step = state.wizStep;
    var normal = wizNormal(), abnormal = wizAbnormal();
    var marked = normal + abnormal;
    var hits = wizHits();
    var rec = wizRecognition();
    var can = Math.max(0, Math.round(W.pool[state.wizDevice] * W.windowFactor[state.wizWindow]));
    var dev = reactorById(state.wizDevice);
    var basis = '批次工作台 · STEP ' + step + ' · ' + WIZ_STEPS[step - 1];
    var s1 = wizRuleSupport('R-01'), s2 = wizRuleSupport('R-02'), s3 = wizRuleSupport('R-03');
    var conflictSum = wizConflictBatches();
    var tight45 = 0;
    W.candidates.forEach(function (c, i) { if (state.wizMarks[i] === 'normal' && c.dur > 34.5) { tight45++; } });
    if (step === 1) {
      return {
        time: nowShort(), basis: basis,
        summary: '当前范围 <b>' + h(W.group) + ' / ' + h(state.wizDevice) + ' / ' + state.wizWindow + '</b>，窗口内候选 <b>' + can + ' 批</b>；该设备历史 <b>' + dev.batches + ' 批</b>、OP 覆盖 <b>' + dev.coverage.toFixed(1) + '%</b>。',
        findings: [
          '10 条历史标注会话合计标注 <b>136 个批次</b>（单条 8–36 批），其中 2 条仍在进行中。',
          '默认载入会话「标注会话-R401-20240301」：03/01 08:00–04/01 08:00，已标注 12 个批次。',
          'R401 OP 覆盖 97.0% 为三釜最高；R403 92.1% 最低，设备间覆盖差异会在阶段归纳时被放大。'
        ],
        actions: [
          '确认设备实例与时间窗口后，载入历史会话继续标注（12 批）。',
          '若换设备，先看设备维度里的阶段覆盖率，避免把缺段标成异常。',
          '标注模板保持 UP · 带水（8 段），与参考基线同一工序单元。'
        ],
        evidence: ['候选 ' + can + ' 批', '历史会话 10', '标注批次 136', state.wizDevice + ' ' + dev.batches + ' 批']
      };
    }
    if (step === 2) {
      return {
        time: nowShort(), basis: basis,
        summary: '当前会话已标注 <b>' + marked + ' / 12</b>（正常 <b>' + normal + '</b> / 异常 <b>' + abnormal + '</b>）；异常批集中在并阶与 OP10 缺段两类特征。',
        findings: [
          '03-14 批时长 51.6 h、覆盖率 62.4%、OP10 仅 3 段，命中并阶保护 R-04。',
          '03-20 批 OP10 仅 5 段、OP60 8.4 h、时长 36.8 h，命中 R-02 / R-03。',
          '其余 10 批时长 29.2–34.9 h、OP 覆盖 95.2–98.4%，系统建议均为「符合基线」。'
        ],
        actions: [
          '先确认 03-14 是否为并阶批次，若确认应标记为异常且不参与正常基线。',
          '对 03-20 核对 OP10 分段与加料结束条件，再决定是否标异常。',
          '标注完成后进入第 3 步，让系统归纳规则并检查冲突。'
        ],
        evidence: ['已标注 ' + marked + ' / 12', '正常 ' + normal, '异常 ' + abnormal, '候选 12 批']
      };
    }
    if (step === 3) {
      return {
        time: nowShort(), basis: basis,
        summary: '12 个标注批次归纳出 <b>6 条规则</b>，3 条可量化规则合计支持 <b>' + (s1 + s2 + s3) + ' / 36</b> 条标注证据，平均置信 <b>91%</b>；保护规则覆盖并阶、覆盖率与登记三类风险。',
        findings: [
          'R-01 时长窗口支持 ' + s1 + ' / 12，R-02 OP10 分段支持 ' + s2 + ' / 12，R-03 OP60 加料支持 ' + s3 + ' / 12。',
          conflictSum ? ('规则与人工标注存在 ' + conflictSum + ' 处冲突，需在第 4 步精修阈值。') : '3 条可量化规则当前与人工标注无冲突。',
          '规则覆盖 8 个工序阶段；R-04/R-05 只做兜底，不参与正常判定。'
        ],
        actions: [
          '先看 R-03 的 1 处冲突：03-08 批 OP60 7.1 h 被判正常但超出 5.0–7.0 h 窗口。',
          '进入第 4 步把 OP60 上限放宽到 7.5 h，或把该批改判为异常。',
          '规则发布前保持冲突为 0，避免把人工经验带偏。'
        ],
        evidence: ['规则 6 条', '支持 ' + (s1 + s2 + s3) + ' / 36', '冲突 ' + conflictSum, '置信 91%']
      };
    }
    if (step === 4) {
      return {
        time: nowShort(), basis: basis,
        summary: '当前阈值：时长 ≤ <b>' + state.wizRules.r01High.toFixed(1) + ' h</b>、OP10 ≥ <b>' + state.wizRules.r02MinSeg + ' 段</b>、OP60 ≤ <b>' + state.wizRules.r03High.toFixed(1) + ' h</b>；三釜 118 批历史池预计命中 <b>' + hits.r01 + ' / ' + hits.r02 + ' / ' + hits.r03 + ' 批</b>，与 12 个标注冲突 <b>' + conflictSum + '</b> 批。',
        findings: [
          '时长上限收到 34.5 h 会让 <b>' + tight45 + '</b> 个已标注正常批次落入异常；当前上限 ' + state.wizRules.r01High.toFixed(1) + ' h 的冲突为 ' + wizConflicts('R-01') + ' 批。',
          'OP10 最小段数设为 ' + state.wizRules.r02MinSeg + ' 段，冲突 ' + wizConflicts('R-02') + ' 批；OP60 上限 ' + state.wizRules.r03High.toFixed(1) + ' h，冲突 ' + wizConflicts('R-03') + ' 批。',
          '识别预估：正常 <b>' + rec.normal + '</b> / 疑似异常 <b>' + rec.suspect + '</b> / 未识别 <b>' + rec.unknown + '</b>（122 批）。'
        ],
        actions: [
          '保持冲突为 0 再发布；当前若冲突 > 0，优先放宽阈值而不是改人工标注。',
          '每次只调一个阈值，观察识别预估与冲突的联动变化。',
          '规则集 v2 保存后进入第 5 步，先抽查疑似并阶批次再应用。'
        ],
        evidence: ['命中 ' + (hits.r01 + hits.r02 + hits.r03) + ' 批', '冲突 ' + conflictSum, '正常 ' + rec.normal, '疑似 ' + rec.suspect]
      };
    }
    return {
      time: nowShort(), basis: basis,
      summary: '规则集 R401-UP-v2 对 <b>122 批</b>识别：正常 <b>' + rec.normal + '</b> / 疑似异常 <b>' + rec.suspect + '</b> / 未识别 <b>' + rec.unknown + '</b>；' + (state.wizApplied ? '已应用于 408 车间带水 UP（演示不写回）。' : '尚未应用，应用后写入规则集版本并记审计。'),
      findings: [
        '示例 8 条中 2 条疑似并阶（04-12 38.4 h、04-25 41.2 h），均命中 R-04 并阶保护。',
        '1 条未识别（04-29 32.4 h）因 OP 覆盖率低于 90% 被 R-05 拦截，不自动判定。',
        state.wizApplied ? '应用记录：R401-UP-v2 · 规则 6 条 · 冲突 ' + conflictSum + ' · 审计已写入（演示）。' : '应用前建议先抽查 2 条疑似并阶与 1 条未识别，确认规则没有误杀。'
      ],
      actions: [
        '先抽查 2 条疑似并阶批次的 OP10/OP100 分段与总时长。',
        '应用后回到越界清单，用新识别结果复核 26 批超界批次的判定一致性。',
        '每周重跑一次识别并对比规则集版本，记录人工改判。'
      ],
      evidence: ['识别 122 批', '正常 ' + rec.normal, '疑似 ' + rec.suspect, '未识别 ' + rec.unknown]
    };
  }

  /* ===== 工艺洞察：慢变量 / 软测量 / 隐含状态 ===== */
  function latentLabels(n) {
    var a = []; var marks = { 0: '03-01', 30: '03-31', 60: '04-30', 89: '05-29' };
    for (var i = 0; i < n; i++) { a.push(marks[i] || ''); }
    return a;
  }
  function latentSeries(kind) {
    var vals = [];
    for (var i = 0; i < 90; i++) {
      if (kind === 'catalyst') { vals.push(100 - 17.6 * i / 89 + Math.sin(i / 4) * 0.7 + Math.sin(i / 9) * 0.35); }
      else if (kind === 'hx') { vals.push(240 - 54 * i / 89 + Math.sin(i / 5) * 1.2); }
      else { vals.push(36 + 6 * Math.sin(i / 8) + i * 0.08); }
    }
    return vals;
  }
  function latentInsight() {
    var t = state.latentTab;
    if (t === '催化剂活性') {
      return {
        time: nowShort(), basis: '工艺洞察 · 催化剂活性',
        summary: '基于 <b>2,160 个历史时间窗</b>估计活性指数 <b>82.4%</b>（R² 0.91、RMSE 1.8）；按当前工况约 <b>18 天</b>后触达 80% 预警线。',
        findings: [
          '输入只用现有温度、循环量、进料负荷、床层差压与收率，不新增分析仪。',
          '活性从 100% 衰减到 82.4%；温度贡献 38%、循环量 26%、负荷 21%、差压 15%。',
          '这是“慢变量”而不是瞬时报警：等化验结果出来时，往往已经错过调整窗口。'
        ],
        actions: [
          '先提温 2℃、降负荷 3%，观察 48h 的活性指数与收率响应。',
          '若活性继续下降，锁定换剂窗口，避免非计划停车。',
          '把模型输出接入全链路任务，和报警/回路/批记录一起看。'
        ],
        evidence: ['活性 82.4%', 'R² 0.91', '预测 18 天', '2,160 窗']
      };
    }
    if (t === '换热器性能') {
      return {
        time: nowShort(), basis: '工艺洞察 · 换热器性能',
        summary: '从历史温差/流量/热负荷反算总传热系数 <b>U=186 W/m²K</b>（清洁 240），污垢热阻升至 0.00195；按当前趋势约 <b>12 天</b>后达到清洗阈值。',
        findings: [
          'U 下降 22.5%，污垢热阻上升 55%，趋势显著（置信度 0.86）。',
          '热负荷贡献 42%、流量 31%、温差 18%、压降 9%；不是单一仪表问题。',
          '当前仍可运行，但高负荷窗口会放大结垢风险，建议提前安排清洗。'
        ],
        actions: [
          '避开 4 月高负荷窗口，安排 12 天内清洗/旁路。',
          '清洗前后用同一模型复算 U 与污垢热阻，验证收益。',
          '把换热器性能与催化剂活性放在同一“工艺健康”视图里。'
        ],
        evidence: ['U 186', '清洁 240', '预测 12 天', '置信 0.86']
      };
    }
    return {
      time: nowShort(), basis: '工艺洞察 · 隐含状态',
      summary: '动态潜变量模型把历史数据分解为 <b>负荷因子 / 传热因子 / 反应强度</b> 三个慢变量；R² 0.87，可解释批次间的“隐性工况差异”。',
      findings: [
        '负荷因子 46%、传热因子 32%、反应强度 22%，三个因子覆盖主要波动。',
        '隐含状态不是仪表测点，而是从多变量历史数据中估计出来的“过程状态”。',
        '当负荷因子和传热因子同时偏离时，批次异常概率明显上升。'
      ],
      actions: [
        '用隐含状态做批次聚类，找出“看起来正常但实际偏离”的批次。',
        '把状态轨迹接入 iPAE 越界清单，提前预警而不是事后解释。',
        '让 Agent 解释“哪个慢变量在变”，工艺员决定是否调整。'
      ],
      evidence: ['3 个隐含状态', 'R² 0.87', '负荷 46%', '传热 32%']
    };
  }
  function latentModelBox(tab) {
    var m = L.models[tab === '催化剂活性' ? 'catalyst' : (tab === '换热器性能' ? 'hx' : 'latent')];
    return '<div class="lat-model"><h4>' + h(m.name) + '</h4><p>基于现有历史数据估计不可直接测量的状态；模型输出带拟合优度、误差与预测窗口，工艺员可复核。</p><div class="code">' + h(m.formula) + '<br>R² = ' + m.r2 + (m.rmse ? ' · RMSE = ' + m.rmse : '') + ' · horizon = ' + h(m.horizon) + '</div></div>';
  }
  function latentFactors(tab) {
    var key = tab === '催化剂活性' ? 'catalyst' : (tab === '换热器性能' ? 'hx' : 'latent');
    return '<div class="lat-factor">' + L.factors[key].map(function (f) {
      return '<div class="row"><span>' + h(f.name) + '</span><b>' + f.value + '%</b></div><div class="progress" style="height:5px"><span style="width:' + f.value + '%;background:' + f.color + '"></span></div>';
    }).join('') + '</div>';
  }
  function renderLatent() {
    var tab = state.latentTab;
    var html = head('iPAE / 工艺洞察', '慢变量与软测量', '基于现有历史数据，估计催化剂活性、换热器性能与隐含状态；不新增仪表。演示合成数据。', '<button class="btn ai" data-ai-open>' + S.icon('spark') + 'AI 分析</button>');
    html += '<div class="lat-tabs">' + L.tabs.map(function (t) { return '<button class="' + (t === tab ? 'on' : '') + '" data-latent-tab="' + h(t) + '">' + h(t) + '</button>'; }).join('') + '</div>';
    if (tab === '催化剂活性') {
      html += '<div class="grid grid-4" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>活性指数</h3><span>模型估计</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">82.4<small style="font-size:12px">%</small></div><div class="sub">较初期 -17.6%</div></div><div class="card"><div class="card-h"><h3>拟合优度</h3><span>R²</span></div><div class="v" style="font-size:28px;font-weight:900">0.91</div><div class="sub">RMSE 1.8%</div></div><div class="card"><div class="card-h"><h3>历史窗口</h3><span>个</span></div><div class="v" style="font-size:28px;font-weight:900">2,160</div><div class="sub">温度/流量/负荷/差压</div></div><div class="card"><div class="card-h"><h3>触线预测</h3><span>80% 预警</span></div><div class="v" style="font-size:28px;font-weight:900;color:#D97706">18<small style="font-size:12px">天</small></div><div class="sub">按当前工况</div></div></div>';
    } else if (tab === '换热器性能') {
      html += '<div class="grid grid-4" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>总传热系数</h3><span>W/m²K</span></div><div class="v" style="font-size:28px;font-weight:900;color:#D97706">186</div><div class="sub">清洁 240</div></div><div class="card"><div class="card-h"><h3>污垢热阻</h3><span>m²K/W</span></div><div class="v" style="font-size:28px;font-weight:900;color:#DC2626">0.00195</div><div class="sub">较初期 +55%</div></div><div class="card"><div class="card-h"><h3>清洗窗口</h3><span>预测</span></div><div class="v" style="font-size:28px;font-weight:900;color:#D97706">12<small style="font-size:12px">天</small></div><div class="sub">当前趋势</div></div><div class="card"><div class="card-h"><h3>置信度</h3><span>历史 1,440</span></div><div class="v" style="font-size:28px;font-weight:900;color:#0B9A78">0.86</div><div class="sub">趋势显著</div></div></div>';
    } else {
      html += '<div class="grid grid-3" style="margin-bottom:12px"><div class="card"><div class="card-h"><h3>负荷因子</h3><span>46%</span></div><div class="v" style="font-size:24px;font-weight:900">0.46</div><div class="sub">主要波动来源</div></div><div class="card"><div class="card-h"><h3>传热因子</h3><span>32%</span></div><div class="v" style="font-size:24px;font-weight:900;color:#D97706">0.32</div><div class="sub">换热性能相关</div></div><div class="card"><div class="card-h"><h3>反应强度</h3><span>22%</span></div><div class="v" style="font-size:24px;font-weight:900;color:#0B9A78">0.22</div><div class="sub">反应状态</div></div></div>';
    }
    var series = latentSeries(tab === '催化剂活性' ? 'catalyst' : (tab === '换热器性能' ? 'hx' : 'latent'));
    var target = tab === '催化剂活性' ? 80 : (tab === '换热器性能' ? 190 : null);
    var color = tab === '催化剂活性' ? '#DC2626' : (tab === '换热器性能' ? '#D97706' : '#1466E8');
    var min = tab === '催化剂活性' ? 78 : (tab === '换热器性能' ? 180 : 30);
    var max = tab === '催化剂活性' ? 102 : (tab === '换热器性能' ? 245 : 48);
    html += '<div class="lat-grid"><div class="lat-card"><h3>' + (tab === '催化剂活性' ? '活性指数趋势' : (tab === '换热器性能' ? '总传热系数趋势' : '隐含状态趋势')) + '<span class="hint">历史 90 天 · 模型估计</span></h3><div class="chart">' + S.chart.line(series, { labels: latentLabels(90), target: target, min: min, max: max, fixed: 1, color: color }) + '</div><div class="lat-note">虚线为预警/清洗阈值。趋势是慢变量模型输出，不是直接仪表测点。</div></div>';
    html += '<div class="lat-card"><h3>贡献度<span class="hint">模型解释</span></h3>' + latentFactors(tab) + latentModelBox(tab) + '<div class="lat-status" style="margin-top:9px">' + L.status.map(function (s) { return '<div class="item"><span>' + h(s.name) + '</span><b style="color:' + s.color + '">' + h(s.value) + '</b><em>' + h(s.trend) + ' · ' + h(s.status) + '</em></div>'; }).join('') + '</div></div></div>';
    html += '<div class="card" style="margin-bottom:12px"><div class="card-h"><h3>从历史数据到工艺建议</h3><span>可追溯到全链路任务</span></div><div class="grid grid-3"><div style="padding:8px 10px;border:1px solid #EEF2F7;border-radius:8px"><b style="font-size:11px">1. 历史数据</b><div class="sub" style="font-size:10px;line-height:1.6">温度 / 流量 / 负荷 / 差压 / 收率；不新增仪表</div></div><div style="padding:8px 10px;border:1px solid #EEF2F7;border-radius:8px"><b style="font-size:11px">2. 慢变量模型</b><div class="sub" style="font-size:10px;line-height:1.6">活性指数 / 污垢热阻 / 隐含状态；R²、RMSE 可复核</div></div><div style="padding:8px 10px;border:1px solid #EEF2F7;border-radius:8px"><b style="font-size:11px">3. 操作建议</b><div class="sub" style="font-size:10px;line-height:1.6">提温/降负荷/清洗窗口；Agent 解释，人确认</div></div></div><div style="margin-top:10px;display:flex;gap:6px;flex-wrap:wrap"><button class="btn" data-latent-chain="catalyst">交给全链路任务 · 催化剂活性 →</button><button class="btn" data-latent-chain="hx">交给全链路任务 · 换热器性能 →</button></div></div>';
    var ai = latentInsight();
    html += aiCard(ai.summary, ai.evidence.slice(0, 3));
    return html;
  }
  function bindLatent() {
    S.qsa('[data-latent-tab]').forEach(function (b) { b.addEventListener('click', function () { state.latentTab = b.getAttribute('data-latent-tab'); S.go('latent'); }); });
    S.qsa('[data-latent-chain]').forEach(function (b) {
      b.addEventListener('click', function () {
        try { sessionStorage.setItem('DEMO_CHAIN_BATCH', 'LX-BIT-2610136A1'); } catch (e) {}
        var to = b.getAttribute('data-latent-chain');
        location.href = '/demo/app/chain/#' + to;
      });
    });
  }

  S.boot({
    product: 'ipae', code: 'iPAE', name: '过程分析与探索系统', brandName: '过程分析',
    subtitle: '批次语义 · 分析 · 黄金参考 · MTO', mark: 'P',
    workspace: '某精细化工 · 演示环境', user: '张', date: '2026-10-27',
    defaultPage: 'workbench', searchPlaceholder: '搜索批次 / 位号 / 阶段',
    nav: [
      { group: '总览', items: [{ id: 'workbench', icon: 'dashboard', label: '工作台' }] },
      { group: '分析', items: [{ id: 'batch', icon: 'plan', label: '批次研究' }, { id: 'device', icon: 'material', label: '设备维度' }, { id: 'outlier', icon: 'bell', label: '越界清单' }, { id: 'golden', icon: 'quality', label: '黄金批次' }, { id: 'readiness', icon: 'file', label: '数据就绪度' }] },
      { group: '过程重建', items: [{ id: 'wizard', icon: 'settings', label: '批次工作台' }] },
      { group: '工艺洞察', items: [{ id: 'latent', icon: 'quality', label: '慢变量与软测量' }] },
      { group: '场景', items: [{ id: 'mto', icon: 'play', label: 'MTO 工况' }] }
    ],
    pages: {
      workbench: { title: '工作台', crumb: '工作台', render: renderWorkbench, bind: bindWorkbench, insight: workbenchInsight },
      batch: { title: '批次研究', crumb: '批次研究', render: renderBatch, bind: bindBatch, insight: batchInsight },
      device: { title: '设备维度', crumb: '设备维度', render: renderDevice, bind: bindDevice, insight: deviceInsight },
      outlier: { title: '越界清单', crumb: '越界清单', render: renderOutlier, bind: bindOutlier, insight: outlierInsight },
      wizard: { title: '批次工作台', crumb: '批次工作台', render: renderWizard, bind: bindWizard, insight: wizardInsight },
      golden: { title: '黄金批次', crumb: '黄金批次', render: renderGolden, bind: bindGolden, insight: goldenInsight },
      readiness: { title: '数据就绪度', crumb: '数据就绪度', render: renderReadiness, bind: bindReadiness, insight: readinessInsight },
      latent: { title: '慢变量与软测量', crumb: '工艺洞察', render: renderLatent, bind: bindLatent, insight: latentInsight },
      mto: { title: 'MTO 工况', crumb: 'MTO 工况', render: renderMto, bind: bindMto, insight: mtoInsight }
    }
  });
})();