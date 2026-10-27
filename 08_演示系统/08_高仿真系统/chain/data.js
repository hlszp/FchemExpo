window.CHAIN_DEMO = {
  batch: 'LX-BIT-2610136A1',
  product: 'BIT',
  area: 'A01',
  abnormal: {
    title: '一次异常工况的处置',
    subtitle: '同一条数据链，从批次异常走到报警、回路、批记录与处置闭环',
    status: '处置中',
    sla: '2 h',
    owner: '张平',
    severity: '重要',
    steps: [
      { key: 'ipae', src: 'iPAE', title: '发现批次异常', detail: 'OP30 升温 +14 min；越界率 12.6%；参考基线 v1 · 112 批', status: 'done', time: '05:02', href: '/demo/app/ipae/#outlier', evidence: '越界清单 / 批次档案' },
      { key: 'iaas', src: 'iAAS', title: '报警确认', detail: 'A01-TIC-1203 反应温度高 · 连续 3 次；紧急；已确认 05:04', status: 'done', time: '05:04', href: '/demo/app/iaas/#realtime', evidence: '实时报警 / 确认记录' },
      { key: 'iclpm', src: 'iCLPM', title: '回路诊断', detail: 'A01-TIC-1203 评分 18.4；振荡 / 黏滞；置信度 0.82', status: 'active', time: '05:09', href: '/demo/app/iclpm/#loops', evidence: '回路详情 / 诊断依据' },
      { key: 'imcs', src: 'iMCS', title: '批记录核对', detail: 'LX-BIT-2610136A1 · 收率 127.34%；11 单元 / 72 OP；质量放行', status: 'pending', time: '待处理', href: '/demo/app/imcs/#ebr', evidence: '电子批记录 / 质量与投料' },
      { key: 'inwork', src: 'inWork', title: '处置闭环', detail: '异常处置工单；责任人张平；SLA 2 h；待回填处置结果', status: 'pending', time: '待处理', href: 'https://agent.zlinsoft.cn:18799/workspace/', evidence: '工单 / 处置记录' }
    ],
    agents: [
      { name: '监测 Agent', role: '发现异常', status: 'done', msg: 'iPAE 越界清单出现新批次；OP30 升温 +14 min，越界率 12.6%。' },
      { name: '报警 Agent', role: '确认报警', status: 'done', msg: 'A01-TIC-1203 连续 3 次；与批次时间窗重合，建议升级为重要。' },
      { name: '诊断 Agent', role: '回路归因', status: 'active', msg: '回路评分 18.4；疑似阀门黏滞 + 增益偏大；建议先查阀，再降增益。' },
      { name: '审核 Agent', role: '批记录核对', status: 'pending', msg: '待核对 127.34% 收率与投料口径，再决定是否放行。' },
      { name: '处置 Agent', role: '任务闭环', status: 'pending', msg: '生成处置任务并跟踪 SLA；处置结果回写 iMCS eBR。' }
    ],
    impact: [
      { value: '35%', label: '处置时间下降', detail: '同一数据链减少跨系统找数' },
      { value: '6 条', label: '证据自动串联', detail: '批次/报警/回路/批记录/质量/工单' },
      { value: '1 个', label: '任务责任人', detail: 'Agent 协同，人做最终决策' }
    ]
  },
  catalyst: {
    title: '催化剂活性：从历史数据里“算”出来',
    subtitle: '不加新仪表，用现有温度、流量、负荷、差压，估计活性指数并预测衰减',
    kpi: { activity: 82.4, decline: 17.6, forecast: 18, r2: 0.91, rmse: 1.8, points: 2160 },
    model: '动态慢变量模型 · 活性指数软测量',
    factors: [
      { name: '反应温度', value: 38, color: '#1466E8' },
      { name: '循环量', value: 26, color: '#0B9A78' },
      { name: '进料负荷', value: 21, color: '#D97706' },
      { name: '床层差压', value: 15, color: '#7C3AED' }
    ],
    steps: [
      { title: '历史数据', detail: '温度 / 流量 / 负荷 / 差压 / 收率', status: 'done' },
      { title: '特征与慢变量', detail: '去噪、对齐、构造反应强度与传热因子', status: 'done' },
      { title: '状态估计', detail: '活性指数 82.4%，R² 0.91，RMSE 1.8', status: 'active' },
      { title: '衰减预测', detail: '按当前工况，约 18 天后触达 80% 预警线', status: 'pending' },
      { title: '操作建议', detail: '提温 / 降负荷 / 换剂窗口', status: 'pending' }
    ],
    agents: [
      { name: '数据 Agent', role: '准备样本', status: 'done', msg: '2160 个时间窗；缺失率 1.2%；已对齐批次与化验。' },
      { name: '建模 Agent', role: '软测量', status: 'active', msg: '活性指数与反应温度、循环量强相关；R² 0.91。' },
      { name: '工艺 Agent', role: '建议', status: 'pending', msg: '建议先提温 2℃ / 降负荷 3%，观察 48h 再决定换剂。' }
    ]
  },
  hx: {
    title: '换热器性能：污垢热阻的慢演化',
    subtitle: '从历史温差、流量、热负荷反算总传热系数，识别结垢趋势与清洗窗口',
    kpi: { u: 186, clean: 240, fouling: 0.00195, forecast: 12, confidence: 0.86, points: 1440 },
    factors: [
      { name: '热负荷', value: 42, color: '#1466E8' },
      { name: '流量', value: 31, color: '#0B9A78' },
      { name: '温差', value: 18, color: '#D97706' },
      { name: '压降', value: 9, color: '#7C3AED' }
    ],
    steps: [
      { title: '历史数据', detail: '进出口温度 / 流量 / 热负荷', status: 'done' },
      { title: '传热反算', detail: '总传热系数 U 从 240 降到 186 W/m²K', status: 'done' },
      { title: '污垢趋势', detail: '污垢热阻 0.00126 → 0.00195；置信度 0.86', status: 'active' },
      { title: '清洗窗口', detail: '按当前趋势约 12 天后达到清洗阈值', status: 'pending' },
      { title: '操作建议', detail: '避开高负荷窗口，安排清洗/旁路', status: 'pending' }
    ],
    agents: [
      { name: '数据 Agent', role: '准备样本', status: 'done', msg: '1440 个时间窗；进出口温度与流量对齐。' },
      { name: '模型 Agent', role: '传热反算', status: 'active', msg: 'U 下降 22.5%；污垢热阻上升 55%；趋势显著。' },
      { name: '工艺 Agent', role: '建议', status: 'pending', msg: '建议 12 天内安排清洗，避开 4 月高负荷窗口。' }
    ]
  }
};
