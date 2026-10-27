window.ICLPM_DEMO = {
  meta: {
    plant: '某化工厂',
    loopsTotal: 961,
    window: '近 24h',
    date: '2026-10-27',
    engine: 'MVP_DIAG_V2_v1.0',
    version: 'RULES-20261027.3'
  },

  /* 评分档位：48–100 分制，实测综合 57.63 为“良好” */
  grades: [
    { name: '优良', min: 85, max: 100, count: 18, color: '#0B9A78' },
    { name: '良好', min: 55, max: 85, count: 96, color: '#0EA5E9' },
    { name: '合格', min: 40, max: 55, count: 52, color: '#1466E8' },
    { name: '警告', min: 25, max: 40, count: 16, color: '#D97706' },
    { name: '不合格', min: 0, max: 25, count: 6, color: '#DC2626' }
  ],

  kpi: {
    score: 57.63,
    grade: '良好',
    scoreDelta: '+8.35',
    autoRate: 82.20,
    autoDelta: '+14.66',
    loops: 961,
    applicable: 188,
    excluded: 773,
    badLoops: 75,
    badDelta: '-18.00',
    events: 352,
    unconfirmed: 282,
    onTime: 68,
    pending: 6
  },

  trend: [49.28, 50.12, 49.87, 50.63, 51.04, 50.71, 51.36, 52.04, 51.68, 52.37, 53.02, 52.84, 53.51, 54.12, 53.88, 54.63, 55.21, 54.97, 55.64, 56.18, 55.92, 56.71, 57.12, 57.63],

  applicability: [
    { key: '不可投用', value: 773, color: '#94A3B8', desc: '工艺/设备不具备自动控制条件，不参与自控率与绩效评分' },
    { key: '仅监控', value: 39, color: '#0EA5E9', desc: '只做数据监视与趋势分析，不纳入自动控制考核' },
    { key: '备用回路', value: 2, color: '#CBD5E1', desc: '备用或停用状态，暂不评价' },
    { key: '禁止自控', value: 69, color: '#D97706', desc: '存在安全/联锁约束，明确禁止投自动' },
    { key: '投用优先', value: 78, color: '#0B9A78', desc: '适合自动控制且提升空间大，优先整定与投用' }
  ],

  deviceScores: [
    { name: '生产装置', score: 57.94, loops: 899, detail: '2EH / BD / MTO / OPU', color: '#1466E8' },
    { name: '公用工程', score: 44.08, loops: 39, detail: 'UT / 公用工程系统', color: '#D97706' }
  ],

  unitSmooth: [
    { unit: '2EH', value: 89.60, loops: 203 },
    { unit: 'BD', value: 83.70, loops: 47 },
    { unit: 'UT', value: 79.60, loops: 30 },
    { unit: 'MTO', value: 71.80, loops: 102 },
    { unit: 'OPU', value: 53.60, loops: 194 }
  ],

  unitsTree: [
    { name: '生产装置', loops: 899, children: [ { name: '2EH', loops: 203 }, { name: 'BD', loops: 47 }, { name: 'MTO', loops: 102 }, { name: 'OPU', loops: 194 }, { name: '其他装置', loops: 353 } ] },
    { name: '公用工程', loops: 39, children: [ { name: 'UT', loops: 30 }, { name: '公用工程其他', loops: 9 } ] },
    { name: '特戊车间', loops: 23, children: [] }
  ],

  radar: {
    axes: ['自控率', '有效率', '准确率', '快速率', '振荡率', '平稳率'],
    plant: { name: '全厂均值', dims: [82.2, 74.6, 88.6, 69.5, 51.8, 73.3], score: 57.63 },
    tags: ['D4LC03501_PID', 'FIC-1201', 'TIC-4101', 'FIC-3405']
  },

  loops: [
    { tag: 'FIC-1201', name: '反应器进料流量', unit: '2EH', score: 41.82, status: '自动', grade: '合格', fit: '投用优先', osc: '有', stiction: '无', dims: [82, 58, 74, 44, 22, 61], note: '12.5 s 周期振荡，增益裕度仅 4.1 dB；建议降增益并加 2 s 滤波' },
    { tag: 'TIC-1203', name: '反应器出口温度', unit: '2EH', score: 63.40, status: '自动', grade: '良好', fit: '投用优先', osc: '有', stiction: '无', dims: [88, 72, 86, 55, 48, 70], note: '串级副回路响应慢，主回路跟踪尚可；已转处置验证' },
    { tag: 'PIC-1108', name: '反应器压力', unit: '2EH', score: 91.20, status: '自动', grade: '优良', fit: '投用优先', osc: '无', stiction: '无', dims: [96, 92, 98, 84, 90, 88], note: '六维均衡，可作为同类型回路整定基准' },
    { tag: 'LIC-3302', name: '回流罐液位', unit: 'BD', score: 38.60, status: '手动', grade: '警告', fit: '投用优先', osc: '无', stiction: '有', dims: [12, 46, 72, 51, 44, 28], note: '阀门回差 2.1%，长期手动；有整改：阀内件更换' },
    { tag: 'FIC-3405', name: '溶剂流量', unit: 'BD', score: 27.35, status: '手动', grade: '警告', fit: '仅监控', osc: '有', stiction: '有', dims: [8, 32, 54, 29, 36, 21], note: '数据覆盖仅 41%，先补采 72 h；暂不输出整定参数' },
    { tag: 'TIC-4101', name: '塔顶温度', unit: 'OPU', score: 33.52, status: '单端', grade: '警告', fit: '投用优先', osc: '无', stiction: '无', dims: [35, 41, 66, 38, 72, 29], note: '单端（仅 PV 有效），单回路 PID 覆盖串级工况，需重做阶跃测试' },
    { tag: 'FIC-2201', name: '甲醇进料流量', unit: 'MTO', score: 58.70, status: '自动', grade: '良好', fit: '投用优先', osc: '有', stiction: '无', dims: [84, 63, 80, 57, 40, 64], note: '进料压力周期扰动，整定后进入 72 h 验证' },
    { tag: 'PIC-2102', name: '再生器压力', unit: 'MTO', score: 76.90, status: '自动', grade: '良好', fit: '投用优先', osc: '无', stiction: '无', dims: [92, 80, 90, 72, 66, 78], note: '补数后诊断置信度 0.78，已关闭' },
    { tag: 'LIC-4203', name: '产品罐液位', unit: 'OPU', score: 22.80, status: '自动', grade: '不合格', fit: '不可投用', osc: '无', stiction: '有', dims: [55, 38, 60, 31, 48, 19], note: 'PV 长期贴 100%，疑似量程饱和；转设备巡检' },
    { tag: 'FIC-4302', name: '回流流量', unit: 'OPU', score: 31.60, status: '失控', grade: '警告', fit: '禁止自控', osc: '有', stiction: '无', dims: [0, 22, 46, 18, 30, 25], note: '输出卡死，已明确禁止自控；维持监控并转设备巡检' },
    { tag: 'TIC-6101', name: '锅炉出口温度', unit: 'UT', score: 87.20, status: '自动', grade: '优良', fit: '投用优先', osc: '无', stiction: '无', dims: [95, 88, 94, 82, 86, 90], note: '重做阶跃后跟踪偏差 −31%，已关闭' },
    { tag: 'PIC-5101', name: '火炬总管压力', unit: 'UT', score: 79.30, status: '自动', grade: '良好', fit: '投用优先', osc: '无', stiction: '无', dims: [90, 82, 88, 74, 72, 80], note: '性能稳定，建议保持当前参数' },
    { tag: 'FIC-3502', name: '塔底流量', unit: 'OPU', score: 47.10, status: '自动', grade: '合格', fit: '投用优先', osc: '无', stiction: '无', dims: [76, 61, 70, 58, 52, 49], note: '快速性偏低，可优化微分与滤波' },
    { tag: 'LIC-1201', name: '反应器液位', unit: '2EH', score: 95.60, status: '自动', grade: '优良', fit: '投用优先', osc: '无', stiction: '无', dims: [98, 94, 99, 90, 93, 95], note: '全厂标杆回路' },
    { tag: 'TIC-3305', name: '塔中温度', unit: 'BD', score: 52.40, status: '故障', grade: '合格', fit: '仅监控', osc: '无', stiction: '无', dims: [44, 52, 74, 46, 64, 42], note: '仪表故障待处理，输出已切手动保护' },
    { tag: 'FIC-7101', name: '特戊进料流量', unit: '特戊车间', score: 68.20, status: '自动', grade: '良好', fit: '投用优先', osc: '无', stiction: '无', dims: [86, 74, 82, 66, 61, 71], note: '运行平稳，可纳入下一批整定验证' },
    { tag: 'PIC-7102', name: '特戊反应压力', unit: '特戊车间', score: 44.80, status: '手动', grade: '合格', fit: '备用回路', osc: '无', stiction: '无', dims: [18, 49, 66, 52, 47, 38], note: '备用回路，不纳入自动投用率考核' },
    { tag: 'TIC-2208', name: '急冷水温度', unit: 'MTO', score: 71.15, status: '自动', grade: '良好', fit: '投用优先', osc: '无', stiction: '无', dims: [90, 76, 84, 68, 63, 73], note: '平稳率 73，仍有小幅周期扰动' },
    { tag: 'D4LC03501_PID', name: '塔顶回流罐液位', unit: 'OPU', score: 59.27, status: '自动', grade: '良好', fit: '投用优先', osc: '有', stiction: '有', dims: [61, 67, 100, 79, 84, 84], note: '实测样例：六维 61/67/100/79/84/84，综合 59.27；诊断疑似阀门粘滞 0.90' }
  ],

  oscillations: [
    { tag: 'FIC-1201', unit: '2EH', period: '12.5 s', amplitude: '±8.2%', severity: '高', cause: '增益偏高 + 控制阀振荡', status: '待诊断', confidence: 0.90 },
    { tag: 'D4LC03501_PID', unit: 'OPU', period: '38 s', amplitude: '±3.6%', severity: '高', cause: '阀门粘滞（回差 2.4%）', status: '诊断中', confidence: 0.90 },
    { tag: 'FIC-3405', unit: 'BD', period: '22 s', amplitude: '±11.4%', severity: '高', cause: '阀门粘滞 + 长期手动', status: '待诊断', confidence: 0.35 },
    { tag: 'FIC-2201', unit: 'MTO', period: '45 s', amplitude: '±5.6%', severity: '中', cause: '进料压力周期性扰动', status: '已确认', confidence: 0.78 },
    { tag: 'TIC-1203', unit: '2EH', period: '38 s', amplitude: '±3.1%', severity: '中', cause: '串级副回路响应慢', status: '诊断中', confidence: 0.64 },
    { tag: 'FIC-4302', unit: 'OPU', period: '18 s', amplitude: '±4.2%', severity: '低', cause: '输出卡死后手动调节', status: '已确认', confidence: 0.60 }
  ],

  suggestions: [
    { tag: 'FIC-1201', unit: '2EH', issue: '振荡 + 增益偏高', current: 'Kp 1.80 / Ti 45 s', target: 'Kp 1.44 / Ti 55 s + 2 s 滤波', priority: '高', confidence: 0.86, method: '阶跃模型 + 振荡频谱', expected: '振幅下降 50%', output: '参数建议', gate: '已通过数据检验' },
    { tag: 'D4LC03501_PID', unit: 'OPU', issue: '阀门粘滞', current: 'Kp 2.40 / Ti 30 s', target: '先检修阀内件，暂不降增益', priority: '高', confidence: 0.90, method: '阀门粘滞诊断', expected: '回差降至 1% 内', output: '工艺建议', gate: '待现场确认' },
    { tag: 'LIC-3302', unit: 'BD', issue: '阀门回差 + 手动', current: 'Kp 2.00 / Ti 40 s', target: '自适应死区 0.5%，Kp 1.70', priority: '高', confidence: 0.78, method: '回差识别 + 手动率分析', expected: '跟踪误差下降 35%', output: '参数建议', gate: '已通过数据检验' },
    { tag: 'TIC-1203', unit: '2EH', issue: '副回路响应慢', current: '副回路 Kp 1.20 / Ti 25 s', target: '副回路 Kp 1.38 / Ti 20 s', priority: '中', confidence: 0.64, method: '串级频域分析', expected: '响应时间缩短 20%', output: '参数建议', gate: '需现场复核' },
    { tag: 'FIC-3405', unit: 'BD', issue: '数据不充分', current: '—', target: '先补采 72 h 数据，再整定', priority: '中', confidence: 0.35, method: '数据覆盖检验', expected: '具备整定条件', output: '暂不输出', gate: '数据覆盖 41%' },
    { tag: 'TIC-4101', unit: 'OPU', issue: '单参数 PID + 模型失配', current: 'Kp 0.80 / Ti 60 s', target: '重做阶跃测试后再输出参数', priority: '中', confidence: 0.52, method: '模型失配检验', expected: '跟踪偏差下降 30%', output: '暂不输出', gate: '模型失配 3.8%' }
  ],

  tuning: {
    guardrails: [
      '平台不连接 DCS 写通道，不自动下发、不远程写参数。',
      '所有参数仅为建议值，由工艺/仪表授权人员在 DCS 侧手工实施并双人复核。',
      '每条建议留痕：模型版本、命中规则、置信度、确认人、实施时间。',
      '未通过数据检验或模型失配的回路，不输出参数建议。',
      '实施后 72 h 复测绩效，人工回写验证结果，形成闭环。'
    ],
    flow: [
      { n: 1, title: '选回路', desc: '从退化/振荡/诊断清单发起' },
      { n: 2, title: '数据检验', desc: '覆盖度、手动率、量程饱和' },
      { n: 3, title: '模型识别', desc: '阶跃测试 / 频域拟合' },
      { n: 4, title: '建议计算', desc: 'Kp/Ti/Td 与滤波建议' },
      { n: 5, title: '人工确认', desc: '工艺 + 仪表双人复核' },
      { n: 6, title: '现场实施', desc: 'DCS 手工下发（不写接口）' },
      { n: 7, title: '复测验证', desc: '72 h 绩效回写处置闭环' }
    ]
  },

  diagnosis: {
    summary: { count: 5, goodLoops: 72, systemIssues: 3, avgCost: 17.50, highConfidence: 3, confidenceAvg: 0.60 },
    engine: { name: 'MVP_DIAG_V2_v1.0', ruleLib: 'RULES-20261027.3', enabled: true, uptimeDays: 0, lastRun: '2026-10-27 23:18' },
    pareto: [
      { type: '阀门粘滞', count: 18 },
      { type: '振荡', count: 14 },
      { type: '单参数PID', count: 9 },
      { type: '假100%', count: 6 },
      { type: '数据不充分', count: 5 },
      { type: '模型失配', count: 3 }
    ],
    diagnoses: [
      { id: 'DG-20261027-001', tag: 'D4LC03501_PID', name: '塔顶回流罐液位', unit: 'OPU', fault: '阀门粘滞', confidence: 0.90, cost: 16.8, assertions: 14, rules: ['VALVE_STICTION_V3', 'OP_STEP_RATIO', 'PERIOD_CORRELATION'], decision: '疑似故障阀（粘滞）→ 转处置', root: '共享仪表 · LT-3501', priority: '高', status: '待复核', event: 'EV-20261027-014', reason: 'OP 与阀位相关性 0.92；大小阶跃比 0.68；回差 2.4%，超过 1.5% 阈值。' },
      { id: 'DG-20261027-002', tag: 'FIC-1201', name: '反应器进料流量', unit: '2EH', fault: '振荡', confidence: 0.90, cost: 18.2, assertions: 12, rules: ['OSC_FFT_V2', 'GAIN_MARGIN_LOW'], decision: '整定建议（降增益 + 滤波）', root: '生产装置 · 2EH 反应器', priority: '高', status: '待复核', event: 'EV-20261027-013', reason: '12.5 s 周期主峰；增益裕度 4.1 dB（阈值 6 dB）；阀动作频率与振荡同频。' },
      { id: 'DG-20261027-003', tag: 'TIC-4101', name: '塔顶温度', unit: 'OPU', fault: '单参数PID', confidence: 0.60, cost: 17.5, assertions: 9, rules: ['SINGLE_PID', 'MODEL_MISMATCH'], decision: '暂不输出参数 → 先做阶跃测试', root: '生产装置 · OPU 塔顶', priority: '中', status: '待复核', event: 'EV-20261027-012', reason: '单回路 PID 覆盖串级工况；模型失配，设定值跟踪偏差 3.8%。' },
      { id: 'DG-20261027-004', tag: 'FIC-3405', name: '溶剂流量', unit: 'BD', fault: '数据不充分', confidence: 0.35, cost: 19.6, assertions: 5, rules: ['DATA_COVERAGE_LOW'], decision: '仅监控 → 补采 72 h 数据', root: '生产装置 · BD 溶剂系统', priority: '中', status: '有整改', event: 'EV-20261027-010', reason: '72 h 有效数据覆盖 41%（阈值 80%），手动时段占比 58%。' },
      { id: 'DG-20261027-005', tag: 'LIC-4203', name: '产品罐液位', unit: 'OPU', fault: '假100%', confidence: 0.25, cost: 15.4, assertions: 4, rules: ['FALSE_100_CHECK'], decision: '仅监控 → 转设备巡检', root: '仪表 · LT-4203 量程偏小', priority: '低', status: '已转监控', event: 'EV-20261027-004', reason: 'PV 在 98.7–100% 区间停留 63% 时间，疑似量程饱和；无有效阶跃证据。' }
    ],
    suspectedValves: [
      { tag: 'D4LC03501_PID', unit: 'OPU', type: '阀门粘滞', confidence: 0.90, reason: 'OP-阀位相关 0.92；回差 2.4%；大小阶跃比 0.68', event: 'EV-20261027-014', priority: '高' },
      { tag: 'FIC-1201', unit: '2EH', type: '振荡', confidence: 0.90, reason: '12.5 s 主峰；增益裕度 4.1 dB；阀动作同频', event: 'EV-20261027-013', priority: '高' },
      { tag: 'TIC-4101', unit: 'OPU', type: '单参数PID', confidence: 0.60, reason: '单回路 PID；模型失配 3.8%；跟踪偏差大', event: 'EV-20261027-012', priority: '中' },
      { tag: 'FIC-3405', unit: 'BD', type: '数据不充分', confidence: 0.35, reason: '数据覆盖 41%；手动时段 58%；需补采', event: 'EV-20261027-010', priority: '中' }
    ],
    issues: [
      { id: 'SYS-20261027-01', title: 'OPU 液位/温度回路粘滞聚集', scope: 'OPU · 14 回路', cause: '共享仪表 / 阀内件磨损', owner: '仪表专业', due: '2026-11-03', status: '已入运维队列' },
      { id: 'SYS-20261027-02', title: '2EH 反应器进料/出口串级振荡', scope: '2EH · 6 回路', cause: '控制阀选型偏大 + 增益偏高', owner: '工艺 + 仪表', due: '2026-11-05', status: '已入运维队列' },
      { id: 'SYS-20261027-03', title: '全厂单参数 PID 遗留回路 32 条', scope: '全厂 · 32 回路', cause: '模型失配 + 未做阶跃测试', owner: '控制专业', due: '2026-11-15', status: '已入运维队列' }
    ],
    rootCause: [
      { label: '生产装置（OPU）', count: 2, share: 40 },
      { label: '共享仪表', count: 1, share: 20 },
      { label: '仪表 / 阀门', count: 1, share: 20 },
      { label: '数据不足（不可归因）', count: 1, share: 20 }
    ]
  },

  disposal: {
    flow: [
      { key: '待复核', desc: '确认诊断结论与影响范围', next: '转有整改' },
      { key: '有整改', desc: '安排检修/整定/补数，明确责任人', next: '提交验证' },
      { key: '验证中', desc: '实施后 72 h 复测绩效', next: '确认关闭' },
      { key: '已验证', desc: '复测达标，归档并回写结论', next: '' }
    ],
    events: [
      { id: 'EV-20261027-014', tag: 'D4LC03501_PID', unit: 'OPU', fault: '阀门粘滞', source: 'DG-20261027-001', owner: '张工', priority: '高', time: '2026-10-27 21:12', status: '待复核', action: '现场确认阀位与回差，确认后检修阀内件', event: '诊断命中 14 条断言，置信度 0.90' },
      { id: 'EV-20261027-013', tag: 'FIC-1201', unit: '2EH', fault: '振荡', source: 'DG-20261027-002', owner: '李工', priority: '高', time: '2026-10-27 21:05', status: '待复核', action: '确认扰动源后，由授权人员按建议手工整定', event: '诊断命中 12 条断言，置信度 0.90' },
      { id: 'EV-20261027-012', tag: 'TIC-4101', unit: 'OPU', fault: '单参数PID', source: 'DG-20261027-003', owner: '王工', priority: '中', time: '2026-10-27 20:48', status: '待复核', action: '安排阶跃测试，补齐模型后再整定', event: '诊断命中 9 条断言，置信度 0.60' },
      { id: 'EV-20261027-011', tag: 'LIC-3302', unit: 'BD', fault: '阀门粘滞', source: 'DG-20261026-018', owner: '李工', priority: '高', time: '2026-10-27 20:20', status: '有整改', action: '阀内件更换，11-02 前完成并复测回差', event: '整改单 RC-20261027-06 已建' },
      { id: 'EV-20261027-010', tag: 'FIC-3405', unit: 'BD', fault: '数据不充分', source: 'DG-20261027-004', owner: '赵工', priority: '中', time: '2026-10-27 19:56', status: '有整改', action: '补采 72 h 数据并核对手动时段', event: '补数任务 DA-20261027-03 已下发' },
      { id: 'EV-20261027-009', tag: 'FIC-2201', unit: 'MTO', fault: '振荡', source: 'DG-20261025-011', owner: '张工', priority: '中', time: '2026-10-27 19:30', status: '验证中', action: '整定后 72 h 复测（11-03 出结论）', event: '已实施：Kp 1.10 / Ti 50 s，待复测' },
      { id: 'EV-20261027-008', tag: 'TIC-1203', unit: '2EH', fault: '模型失配', source: 'DG-20261024-009', owner: '王工', priority: '低', time: '2026-10-27 18:40', status: '已验证', action: '复测达标，归档', event: '复测评分 63.40，振荡率 +18' },
      { id: 'EV-20261027-007', tag: 'PIC-2102', unit: 'MTO', fault: '数据不充分', source: 'DG-20261024-008', owner: '王工', priority: '低', time: '2026-10-27 17:55', status: '已验证', action: '补数后关闭', event: '补数后诊断置信度 0.78' },
      { id: 'EV-20261027-006', tag: 'TIC-6101', unit: 'UT', fault: '单参数PID', source: 'DG-20261023-006', owner: '李工', priority: '低', time: '2026-10-27 16:30', status: '已验证', action: '重做阶跃并整定', event: '跟踪偏差 −31%，评分 87.20' },
      { id: 'EV-20261027-005', tag: 'FIC-4302', unit: 'OPU', fault: '手动回路', source: 'DG-20261023-005', owner: '赵工', priority: '低', time: '2026-10-27 15:12', status: '已验证', action: '维持监控，转设备巡检', event: '输出卡死，禁止自控，归档' }
    ]
  }
};
