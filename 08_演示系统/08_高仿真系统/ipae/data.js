window.IPAE_DEMO = {
  kpi: { tags: 153, batches: 122, registered: 64, unregistered: 58, refPublished: 1, refDraft: 0, goodRate: 98.7, issues: 16 },
  batches: [
    { id: '408-R401-24030109-0102', product: '带水 UP', line: 'R401', start: '03-01 09:02', duration: '31 h 48 m', opCoverage: 97.6, status: '已登记', quality: '合格' },
    { id: '408-R401-24031418-0132', product: '带水 UP', line: 'R401', start: '03-14 18:32', duration: '51 h 36 m', opCoverage: 62.4, status: '未登记', quality: '待检' },
    { id: '408-R401-24032006-0144', product: '带水 UP', line: 'R401', start: '03-20 06:44', duration: '36 h 48 m', opCoverage: 91.7, status: '未登记', quality: '待检' },
    { id: '408-R402-24031214-0098', product: '带水 UP', line: 'R402', start: '03-12 14:08', duration: '32 h 36 m', opCoverage: 95.2, status: '已登记', quality: '合格' },
    { id: '408-R402-24032011-0121', product: '带水 UP', line: 'R402', start: '03-20 11:21', duration: '33 h 24 m', opCoverage: 94.7, status: '已登记', quality: '合格' },
    { id: '408-R403-24031508-0087', product: '带水 UP', line: 'R403', start: '03-15 08:07', duration: '32 h 30 m', opCoverage: 92.1, status: '已登记', quality: '合格' },
    { id: '408-R403-24032816-0156', product: '带水 UP', line: 'R403', start: '03-28 16:42', duration: '34 h 12 m', opCoverage: 90.4, status: '未登记', quality: '待检' },
    { id: '408-R403-24042708-0210', product: '带水 UP', line: 'R403', start: '04-27 08:18', duration: '33 h 54 m', opCoverage: 92.8, status: '已登记', quality: '合格' }
  ],
  stages: [
    { op: 'OP10', name: '建立真空与首次压水', a: 32, b: 28 },
    { op: 'OP30', name: '升温', a: 96, b: 82 },
    { op: 'OP40', name: '切缓冲', a: 124, b: 118 },
    { op: 'OP50', name: '泄压前期', a: 42, b: 39 },
    { op: 'OP60', name: '正常加料', a: 48, b: 45 },
    { op: 'OP70', name: '取样', a: 66, b: 61 },
    { op: 'OP80', name: '降温与破空', a: 32, b: 30 },
    { op: 'OP100', name: '末次压水与结束', a: 40, b: 38 }
  ],
  profileA: [18, 22, 30, 48, 72, 96, 118, 124, 116, 100, 86, 72, 62, 56, 52, 50, 48, 46, 44, 42],
  profileB: [18, 21, 28, 43, 64, 88, 108, 116, 110, 96, 84, 72, 62, 56, 53, 51, 49, 47, 45, 43],
  goldenBatches: [
    { id: '408-R401-24030109-0102', support: 1, selected: true },
    { id: '408-R401-24030314-0108', support: 1, selected: true },
    { id: '408-R401-24030521-0115', support: 1, selected: true },
    { id: '408-R401-24030808-0121', support: 1, selected: true },
    { id: '408-R401-24031103-0126', support: 1, selected: true },
    { id: '408-R401-24031418-0132', support: 0, selected: false }
  ],
  golden: {
    p10: [18, 20, 25, 38, 58, 80, 98, 104, 96, 84, 72, 62, 54, 50, 48, 46, 44, 42, 40, 38],
    p50: [20, 22, 28, 44, 66, 90, 110, 116, 108, 94, 80, 68, 58, 53, 51, 49, 47, 45, 43, 41],
    p90: [24, 27, 34, 52, 76, 102, 122, 128, 120, 106, 92, 80, 68, 62, 58, 55, 52, 50, 48, 46]
  },
  readiness: [
    { name: '位号主数据', value: 98, detail: '153 个位号，3 个缺单位' },
    { name: '时间戳质量', value: 96, detail: '16 个跳变/重复' },
    { name: '批次覆盖', value: 88, detail: '122 批中 28 批无 OP 覆盖' },
    { name: '化验关联', value: 91, detail: '12 批样品未关联' },
    { name: '参考集', value: 100, detail: '1 个已发布参考集（112 批）' }
  ],
  mto: {
    kpi: { yield: 48.5, output: 1297, energy: 2.1, pe: 1.05, load: '4.50', feed: 160.8 },
    trendYield: [48.2, 48.3, 48.1, 48.4, 48.5, 48.4, 48.6, 48.5, 48.4, 48.6, 48.5, 48.7, 48.6, 48.5, 48.5, 48.4, 48.3, 48.4, 48.5, 48.5, 48.6, 48.5, 48.4, 48.5],
    trendEnergy: [2.12, 2.10, 2.14, 2.11, 2.09, 2.10, 2.08, 2.09, 2.11, 2.10, 2.12, 2.09, 2.08, 2.10, 2.11, 2.12, 2.14, 2.13, 2.11, 2.10, 2.09, 2.08, 2.10, 2.11],
    t2: [8.2, 9.1, 10.5, 12.2, 14.8, 16.2, 18.4, 12.8, 10.4, 9.8, 8.6, 7.9, 8.4, 9.2, 10.8, 12.6, 15.4, 19.8, 22.6, 18.4, 14.2, 11.8, 9.6, 8.8],
    spe: [4.2, 4.8, 5.1, 5.6, 6.4, 7.2, 8.1, 6.8, 5.9, 5.2, 4.8, 4.4, 4.9, 5.4, 6.2, 7.4, 9.6, 12.8, 16.4, 13.2, 9.8, 7.6, 6.2, 5.4],
    contributions: [
      { label: '反应器出口温度', value: 42 }, { label: '产品 C4 流量', value: 28 },
      { label: '催化剂循环量', value: 18 }, { label: '反应器压力', value: 9 }, { label: '进料蒸汽', value: 5 }
    ]
  },

  /* ===== 设备维度（408 车间 · 带水 UP · 真实系统实测口径） ===== */
  device: {
    group: '408 车间 · 带水 UP',
    window: '2024-03-01 08:00 — 2024-05-01 08:00',
    groupMedian: 32.5,
    groupCoverage: 94.8,
    reactors: [
      { id: 'R401', batches: 38, median: 32.2, p10: 29.4, p90: 33.8, cv: 0.28, rel: -0.9, coverage: 97.0, parallel: 1, longest: 87, flash: [0, 0, 39], range: '22.6 – 87.0 h' },
      { id: 'R402', batches: 39, median: 32.6, p10: 29.1, p90: 34.4, cv: 0.32, rel: 0.3, coverage: 95.2, parallel: 2, longest: 87, flash: [0, 0, 38], range: '23.4 – 87.0 h' },
      { id: 'R403', batches: 41, median: 32.5, p10: 28.7, p90: 34.9, cv: 0.32, rel: 0.0, coverage: 92.1, parallel: 1, longest: 74, flash: [0, 0, 41], range: '21.8 – 74.2 h' }
    ],
    stages: [
      { op: 'OP10', name: '建立真空与首次压水', cover: [98.4, 96.1, 94.7] },
      { op: 'OP30', name: '升温', cover: [97.2, 96.4, 95.0] },
      { op: 'OP40', name: '切缓冲', cover: [96.8, 95.6, 93.2] },
      { op: 'OP50', name: '泄压前期', cover: [95.9, 94.8, 91.7] },
      { op: 'OP60', name: '正常加料', cover: [98.1, 97.0, 89.4] },
      { op: 'OP70', name: '取样', cover: [94.6, 93.7, 90.8] },
      { op: 'OP80', name: '降温与破空', cover: [96.3, 95.4, 92.5] },
      { op: 'OP100', name: '末次压水与结束', cover: [97.5, 96.2, 93.9] }
    ],
    deviations: [
      { op: 'OP10', name: '建立真空与首次压水', device: 'R402', delta: -71.9, nums: 'R402 3 段 vs 组内 13 段', level: '高', detail: 'R402 的 OP10 只切出 3 段，组内 R401/R403 各 13 段；分段被合并后阶段时长 -71.9%，真空置换过程无法逐段对账。', action: '核对 OP10 分段规则与真空置换位号，确认是分段缺失还是取数区间错误' },
      { op: 'OP60', name: '正常加料', device: 'R403', delta: -48.2, nums: '3.2 h vs 6.2 h', level: '高', detail: 'R403 的 OP60 加料时长中位 3.2 h，组内 6.2 h；阶段越界率 5.2%，疑似加料提前结束或分段被截断。', action: '复核加料流量、称重记录与 OP60 结束条件' }
    ]
  },

  /* ===== 越界清单（带水 UP 历史基线 R404 v1 · 112 批 · 2024-04-15 — 2024-04-29） ===== */
  outlier: {
    baseline: '带水 UP 历史基线（R404）v1',
    baselineBatches: 112,
    window: '2024-04-15 08:00 — 2024-04-29 08:00',
    scanned: 27,
    exceeded: 26,
    unregistered: 27,
    baseMedian: 32.5,
    excluded: { id: '408-R404-24042902-0640', start: '04-29 06:40', rate: 0.6 },
    stageNames: ['OP10 建立真空与首次压水', 'OP30 升温', 'OP40 切缓冲', 'OP50 泄压前期', 'OP60 正常加料', 'OP70 取样', 'OP80 降温与破空', 'OP100 末次压水与结束'],
    rows: [
      { id: '408-R404-24041505-1608', start: '04-15 16:08', dev: 9, rate: 20.0, worstOp: 'OP10', worstName: '置换真空', worstRate: 27.0, gap: 'OP10 缺 1 段', metric: '脱泡趋势', sev: '高', top: true, coverage: 94.6, stageRates: [27.0, 6.4, 4.1, 2.2, 1.4, 0.8, 3.6, 1.9] },
      { id: '408-R404-24042220-1811', start: '04-22 18:11', dev: 4, rate: 12.6, worstOp: 'OP10', worstName: '置换真空', worstRate: 12.0, gap: '—', metric: '溶解时间', sev: '高', top: true, coverage: 97.2, stageRates: [12.0, 4.6, 3.2, 1.8, 1.2, 0.6, 2.4, 1.4] },
      { id: '408-R404-24042317-2400', start: '04-23 24:00', dev: 30, rate: 8.6, worstOp: 'OP50', worstName: '降温升压', worstRate: 5.2, gap: 'OP50 缺 1 段', metric: '升超', sev: '高', top: true, coverage: 93.1, stageRates: [3.9, 4.6, 2.8, 5.2, 2.4, 1.6, 2.1, 1.3] },
      { id: '408-R404-24041611-0912', start: '04-16 09:12', dev: 24, rate: 7.8, worstOp: 'OP60', worstName: '正常加料', worstRate: 9.4, gap: 'OP60 缺 1 段', metric: '加料流量', sev: '高', coverage: 92.8, stageRates: [4.2, 5.1, 3.8, 2.6, 9.4, 2.1, 3.4, 1.9] },
      { id: '408-R404-24041916-1430', start: '04-19 14:30', dev: -14, rate: 7.1, worstOp: 'OP30', worstName: '升温', worstRate: 8.2, gap: '—', metric: '升温速率', sev: '高', coverage: 96.4, stageRates: [4.6, 8.2, 3.1, 2.4, 5.2, 1.8, 3.6, 2.2] },
      { id: '408-R404-24042609-0604', start: '04-26 06:04', dev: 43, rate: 8.1, worstOp: 'OP80', worstName: '降温与破空', worstRate: 9.6, gap: 'OP80 缺 2 段', metric: '真空保持', sev: '高', coverage: 91.2, stageRates: [5.4, 6.2, 4.8, 3.2, 2.6, 1.9, 9.6, 2.8] },
      { id: '408-R404-24041713-1206', start: '04-17 12:06', dev: 18, rate: 6.9, worstOp: 'OP60', worstName: '正常加料', worstRate: 8.2, gap: 'OP60 缺 1 段', metric: '加料流量', sev: '中', coverage: 93.5, stageRates: [3.8, 4.4, 3.1, 2.2, 8.2, 1.7, 2.9, 1.6] },
      { id: '408-R404-24041820-1742', start: '04-18 17:42', dev: -6, rate: 6.4, worstOp: 'OP40', worstName: '切缓冲', worstRate: 7.6, gap: '—', metric: '压力波动', sev: '中', coverage: 96.8, stageRates: [3.2, 4.8, 7.6, 2.9, 4.1, 1.6, 2.7, 1.8] },
      { id: '408-R404-24042015-1104', start: '04-20 11:04', dev: 11, rate: 5.9, worstOp: 'OP10', worstName: '置换真空', worstRate: 7.1, gap: 'OP10 缺 1 段', metric: '脱泡趋势', sev: '中', coverage: 94.1, stageRates: [7.1, 3.6, 2.4, 1.7, 4.2, 1.2, 2.1, 1.4] },
      { id: '408-R404-24042110-0830', start: '04-21 08:30', dev: -3, rate: 5.6, worstOp: 'OP50', worstName: '泄压前期', worstRate: 6.8, gap: '—', metric: '升超', sev: '中', coverage: 97.5, stageRates: [3.1, 2.8, 2.2, 6.8, 3.4, 1.5, 2.4, 1.6] },
      { id: '408-R404-24042418-1521', start: '04-24 15:21', dev: 7, rate: 5.2, worstOp: 'OP70', worstName: '取样', worstRate: 6.3, gap: '—', metric: '取样间隔', sev: '中', coverage: 96.2, stageRates: [2.8, 3.4, 2.1, 1.8, 3.6, 6.3, 2.2, 1.5] },
      { id: '408-R404-24042522-1908', start: '04-25 19:08', dev: 13, rate: 4.9, worstOp: 'OP30', worstName: '升温', worstRate: 5.9, gap: 'OP30 缺 1 段', metric: '升温速率', sev: '中', coverage: 92.4, stageRates: [3.4, 5.9, 2.6, 1.9, 3.2, 1.3, 2.8, 1.7] },
      { id: '408-R404-24042708-0510', start: '04-27 05:10', dev: -9, rate: 4.7, worstOp: 'OP60', worstName: '正常加料', worstRate: 5.6, gap: '—', metric: '加料流量', sev: '中', coverage: 95.6, stageRates: [2.4, 3.1, 2.2, 1.6, 5.6, 1.2, 2.6, 1.4] },
      { id: '408-R404-24042814-1233', start: '04-28 12:33', dev: 6, rate: 4.4, worstOp: 'OP80', worstName: '降温与破空', worstRate: 5.3, gap: '—', metric: '真空保持', sev: '中', coverage: 96.8, stageRates: [2.1, 3.3, 2.4, 1.7, 3.5, 1.4, 5.3, 1.9] },
      { id: '408-R404-24041806-0436', start: '04-18 04:36', dev: 21, rate: 4.1, worstOp: 'OP100', worstName: '末次压水与结束', worstRate: 5.0, gap: 'OP100 缺 1 段', metric: '末次压水', sev: '中', coverage: 90.8, stageRates: [2.6, 3.2, 2.0, 1.5, 3.4, 1.2, 2.2, 5.0] },
      { id: '408-R404-24042002-2308', start: '04-20 23:08', dev: -5, rate: 3.8, worstOp: 'OP10', worstName: '置换真空', worstRate: 4.6, gap: '—', metric: '脱泡趋势', sev: '中', coverage: 97.1, stageRates: [4.6, 2.4, 1.7, 1.2, 2.8, 0.9, 1.8, 1.1] },
      { id: '408-R404-24042312-1002', start: '04-23 10:02', dev: 9, rate: 3.5, worstOp: 'OP40', worstName: '切缓冲', worstRate: 4.2, gap: '—', metric: '压力波动', sev: '中', coverage: 94.9, stageRates: [2.2, 2.9, 4.2, 1.6, 2.6, 1.1, 1.9, 1.3] },
      { id: '408-R404-24042617-1544', start: '04-26 15:44', dev: 15, rate: 3.1, worstOp: 'OP50', worstName: '泄压前期', worstRate: 3.8, gap: 'OP50 缺 1 段', metric: '升超', sev: '中', coverage: 91.7, stageRates: [1.9, 2.2, 1.6, 3.8, 2.4, 0.9, 1.7, 1.2] },
      { id: '408-R404-24041702-0130', start: '04-17 01:30', dev: -2, rate: 2.9, worstOp: 'OP70', worstName: '取样', worstRate: 3.5, gap: '—', metric: '取样间隔', sev: '低', coverage: 97.8, stageRates: [1.6, 2.0, 1.4, 1.1, 2.2, 3.5, 1.5, 0.9] },
      { id: '408-R404-24041922-2007', start: '04-19 20:07', dev: 4, rate: 2.6, worstOp: 'OP10', worstName: '置换真空', worstRate: 3.2, gap: '—', metric: '溶解时间', sev: '低', coverage: 96.4, stageRates: [3.2, 1.8, 1.2, 0.9, 2.0, 0.7, 1.4, 0.8] },
      { id: '408-R404-24042106-0311', start: '04-21 03:11', dev: -7, rate: 2.4, worstOp: 'OP30', worstName: '升温', worstRate: 2.9, gap: '—', metric: '升温速率', sev: '低', coverage: 98.1, stageRates: [1.5, 2.9, 1.3, 0.9, 1.9, 0.6, 1.4, 0.8] },
      { id: '408-R404-24042401-0128', start: '04-24 01:28', dev: 2, rate: 2.2, worstOp: 'OP80', worstName: '降温与破空', worstRate: 2.7, gap: '—', metric: '真空保持', sev: '低', coverage: 97.2, stageRates: [1.2, 1.7, 1.1, 0.8, 1.8, 0.6, 2.7, 0.9] },
      { id: '408-R404-24042512-0905', start: '04-25 09:05', dev: 8, rate: 2.0, worstOp: 'OP60', worstName: '正常加料', worstRate: 2.4, gap: '—', metric: '加料流量', sev: '低', coverage: 96.8, stageRates: [1.1, 1.6, 1.0, 0.7, 2.4, 0.5, 1.3, 0.8] },
      { id: '408-R404-24042720-1822', start: '04-27 18:22', dev: -4, rate: 1.8, worstOp: 'OP100', worstName: '末次压水与结束', worstRate: 2.2, gap: '—', metric: '末次压水', sev: '低', coverage: 95.3, stageRates: [1.0, 1.4, 0.9, 0.6, 1.5, 0.5, 1.1, 2.2] },
      { id: '408-R404-24042803-0056', start: '04-28 00:56', dev: 3, rate: 1.6, worstOp: 'OP40', worstName: '切缓冲', worstRate: 2.0, gap: '—', metric: '压力波动', sev: '低', coverage: 97.6, stageRates: [0.9, 1.2, 2.0, 0.7, 1.3, 0.4, 1.0, 0.6] },
      { id: '408-R404-24041618-1142', start: '04-16 11:42', dev: 1, rate: 1.4, worstOp: 'OP50', worstName: '泄压前期', worstRate: 1.7, gap: '—', metric: '升超', sev: '低', coverage: 98.2, stageRates: [0.8, 1.1, 0.7, 1.7, 1.2, 0.4, 0.9, 0.6] }
    ]
  },

  /* ===== 批次工作台 · 5 步标注向导（10 条历史会话 · 136 个标注批次） ===== */
  wizard: {
    group: '408 车间 · 带水 UP',
    template: 'UP · 带水（8 段）',
    pool: { R401: 38, R402: 39, R403: 41 },
    windows: ['4h', '8h', '12h', '24h', '72h', '168h'],
    windowFactor: { '4h': 0.01, '8h': 0.03, '12h': 0.04, '24h': 0.07, '72h': 0.16, '168h': 0.29 },
    sessionTotal: 136,
    sessions: [
      { id: '标注会话-R401-20240301', device: 'R401', from: '03/01 08:00', to: '04/01 08:00', count: 12, status: '进行中', updated: '04-01 09:12', editable: true },
      { id: '标注会话-R401-20240310', device: 'R401', from: '03/10 08:00', to: '03/15 08:00', count: 8, status: '已完成', updated: '03-15 10:05', editable: false },
      { id: '标注会话-R402-20240312', device: 'R402', from: '03/12 08:00', to: '03/18 08:00', count: 10, status: '已完成', updated: '03-18 11:20', editable: false },
      { id: '标注会话-R403-20240315', device: 'R403', from: '03/15 08:00', to: '03/22 08:00', count: 10, status: '已完成', updated: '03-22 09:48', editable: false },
      { id: '标注会话-R401-20240320', device: 'R401', from: '03/20 08:00', to: '03/27 08:00', count: 11, status: '已完成', updated: '03-27 10:32', editable: false },
      { id: '标注会话-R402-20240325', device: 'R402', from: '03/25 08:00', to: '04/02 08:00', count: 15, status: '已完成', updated: '04-02 09:05', editable: false },
      { id: '标注会话-R403-20240402', device: 'R403', from: '04/02 08:00', to: '04/10 08:00', count: 15, status: '进行中', updated: '04-10 08:40', editable: false },
      { id: '标注会话-R401-20240408', device: 'R401', from: '04/08 08:00', to: '04/14 08:00', count: 9, status: '已完成', updated: '04-14 10:18', editable: false },
      { id: '标注会话-R402-20240416', device: 'R402', from: '04/16 08:00', to: '04/22 08:00', count: 10, status: '已完成', updated: '04-22 09:36', editable: false },
      { id: '标注会话-R403-20240424', device: 'R403', from: '04/24 08:00', to: '05/01 08:00', count: 36, status: '已完成', updated: '05-01 08:12', editable: false }
    ],
    candidates: [
      { id: '408-R401-24030109-0102', start: '03-01 09:02', dur: 31.8, coverage: 97.6, op10Seg: 9, op60: 5.8, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24030314-0108', start: '03-03 14:08', dur: 33.1, coverage: 96.8, op10Seg: 9, op60: 6.2, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24030521-0115', start: '03-05 21:15', dur: 30.4, coverage: 98.1, op10Seg: 9, op60: 5.4, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24030808-0121', start: '03-08 08:21', dur: 34.9, coverage: 95.2, op10Seg: 8, op60: 7.1, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24031103-0126', start: '03-11 03:26', dur: 29.2, coverage: 98.4, op10Seg: 9, op60: 5.1, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24031418-0132', start: '03-14 18:32', dur: 51.6, coverage: 62.4, op10Seg: 3, op60: 3.2, parallel: true, result: '待检', mark: 'abnormal' },
      { id: '408-R401-24031711-0139', start: '03-17 11:39', dur: 32.4, coverage: 96.1, op10Seg: 9, op60: 5.9, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24032006-0144', start: '03-20 06:44', dur: 36.8, coverage: 91.7, op10Seg: 5, op60: 8.4, parallel: false, result: '待检', mark: 'abnormal' },
      { id: '408-R401-24032315-0151', start: '03-23 15:51', dur: 31.1, coverage: 97.3, op10Seg: 9, op60: 5.6, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24032622-0158', start: '03-26 22:58', dur: 33.6, coverage: 96.4, op10Seg: 9, op60: 6.4, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24032909-0164', start: '03-29 09:04', dur: 32.9, coverage: 97.9, op10Seg: 9, op60: 5.7, parallel: false, result: '合格', mark: 'normal' },
      { id: '408-R401-24033119-0171', start: '03-31 19:17', dur: 30.8, coverage: 98.2, op10Seg: 9, op60: 5.3, parallel: false, result: '合格', mark: 'normal' }
    ],
    rules: [
      { id: 'R-01', name: '时长窗口', cond: '28.0 h ≤ UP 时长 ≤ 35.0 h', support: 10, confidence: 0.94, stage: 'OP10–OP100', dynamic: 'r01' },
      { id: 'R-02', name: 'OP10 分段完整性', cond: 'OP10 段数 ≥ 8，覆盖真空置换与首次压水', support: 10, confidence: 0.91, stage: 'OP10', dynamic: 'r02' },
      { id: 'R-03', name: 'OP60 加料时长', cond: '5.0 h ≤ OP60 正常加料 ≤ 7.0 h', support: 9, confidence: 0.88, stage: 'OP60', dynamic: 'r03' },
      { id: 'R-04', name: '并阶保护', cond: '单批时长 > 40 h 或疑似并阶 → 判异常、不分批', support: 1, confidence: 0.97, stage: 'OP10 / OP100' },
      { id: 'R-05', name: '覆盖率闸门', cond: 'OP 覆盖率 < 90% → 未识别，不自动判定', support: 1, confidence: 0.99, stage: '全局' },
      { id: 'R-06', name: '结果登记联动', cond: '结果为「待检」的批次 → 转人工复核', support: 2, confidence: 0.76, stage: '结果登记' }
    ],
    recognition: {
      total: 122, normal: 96, suspect: 18, unknown: 8,
      rows: [
        { id: '408-R401-24040211-0204', start: '04-02 11:04', dur: '31.6 h', verdict: '正常', rule: 'R-01 / R-02', conf: 0.96 },
        { id: '408-R401-24040518-0211', start: '04-05 18:11', dur: '30.9 h', verdict: '正常', rule: 'R-01 / R-03', conf: 0.93 },
        { id: '408-R401-24040807-0218', start: '04-08 07:18', dur: '34.2 h', verdict: '正常', rule: 'R-01', conf: 0.91 },
        { id: '408-R401-24041215-0226', start: '04-12 15:26', dur: '38.4 h', verdict: '疑似异常', rule: 'R-04', conf: 0.87 },
        { id: '408-R401-24041622-0233', start: '04-16 22:33', dur: '33.1 h', verdict: '正常', rule: 'R-02 / R-03', conf: 0.94 },
        { id: '408-R401-24042109-0241', start: '04-21 09:04', dur: '29.8 h', verdict: '正常', rule: 'R-01 / R-02', conf: 0.95 },
        { id: '408-R401-24042513-0248', start: '04-25 13:40', dur: '41.2 h', verdict: '疑似异常', rule: 'R-04', conf: 0.89 },
        { id: '408-R401-24042902-0255', start: '04-29 02:55', dur: '32.4 h', verdict: '未识别', rule: 'R-05', conf: 0.0 }
      ]
    }
  }
};