window.IACMS_DEMO = {
  kpi: { cases: 3, library: 42, docs: 12, gates: 68, steps: 186, compliance: 96.4, closure: 18, sources: 5 },
  systems: [
    { name: 'iAAS', role: '报警发现', status: '在线', detail: '实时报警 957 / 未确认 277' },
    { name: 'iPAE', role: '趋势/批次异常', status: '在线', detail: '越界 26 / 慢变量 3' },
    { name: 'iCLPM', role: '回路/阀诊断', status: '在线', detail: '961 回路 / 退化 75' },
    { name: 'iMCS', role: '批次/电子批记录', status: '在线', detail: 'eBR 2,825 / 11 单元' },
    { name: 'iSafe', role: '人员/作业/隐患', status: '在线', detail: '现场人员 / 作业票' }
  ],
  docs: [
    { name: '化工企业生产过程异常工况安全处置准则（试行）', type: '国家规范', code: '应急厅〔2024〕17号', status: '已解析', pages: 24, scenarios: 12, steps: 46, gates: 18, updated: '2024-04-25' },
    { name: '精细化工企业安全管理规范', type: '强制性标准', code: 'AQ 3062-2025', status: '已解析', pages: 58, scenarios: 14, steps: 52, gates: 16, updated: '2025-05-23' },
    { name: '企业异常工况处置管理办法', type: '企业制度', code: 'ZD-YC-2026-03', status: '已解析', pages: 18, scenarios: 8, steps: 28, gates: 9, updated: '2026-03-12' },
    { name: 'A01 装置 HAZOP 分析报告', type: 'HAZOP', code: 'HAZOP-A01-2026', status: '已解析', pages: 86, scenarios: 21, steps: 0, gates: 12, updated: '2026-02-20' },
    { name: 'R101 反应釜 LOPA 分析', type: 'LOPA', code: 'LOPA-R101-2026', status: '解析中', pages: 32, scenarios: 6, steps: 0, gates: 5, updated: '2026-03-01' },
    { name: 'R101 反应釜操作规程', type: 'SOP', code: 'SOP-R101-V4', status: '已解析', pages: 42, scenarios: 9, steps: 31, gates: 8, updated: '2026-01-18' },
    { name: '反应失控专项应急预案', type: '应急预案', code: 'YJ-R101-2026', status: '已解析', pages: 16, scenarios: 3, steps: 18, gates: 6, updated: '2026-02-08' },
    { name: '精细化工典型异常工况培训案例', type: '培训材料', code: 'PX-2026-04', status: '待解析', pages: 36, scenarios: 0, steps: 0, gates: 0, updated: '2026-04-10' }
  ],
  categories: [
    { id: 'RC-01', name: '反应釜超温 / 反应失控', risk: '高', source: '准则附录1-1/2', triggers: ['温度骤升', '压力骤变', '冷却/搅拌异常'], actions: ['停进料', '停加热', '紧急冷却', '淬灭/转移'], gates: 9, docs: 4, cases: 2, note: '精细化工最典型；需联动冷却、搅拌、淬灭与人员撤离。' },
    { id: 'RC-02', name: '冷却中断', risk: '高', source: '准则 4.1 / 附录1-1', triggers: ['冷却水压力低', '冷冻水温度高', '夹套流量低'], actions: ['降负荷', '停加热', '备用冷却', '必要时停车'], gates: 7, docs: 3, cases: 1, note: '冷却失效是反应失控的前兆，必须优先确认。' },
    { id: 'RC-03', name: '搅拌失效', risk: '高', source: '准则 4.1 / 附录1-1', triggers: ['电流异常', '转速为零', '振动'], actions: ['停进料', '停加热', '启动备用', '转移物料'], gates: 8, docs: 3, cases: 0, note: '搅拌失效会导致局部过热、反应不均。' },
    { id: 'RC-04', name: '蒸馏 / 精馏不出料', risk: '中', source: '准则附录1-6', triggers: ['塔釜温度高', '回流异常', '采出为零'], actions: ['停加热', '查堵', '泄压', '隔离'], gates: 6, docs: 2, cases: 0, note: '严禁继续加热、干蒸。' },
    { id: 'RC-05', name: '尾气 / 有毒气体系统故障', risk: '高', source: '准则附录1-7', triggers: ['尾气含氯高', '风机故障', '吸收液失效'], actions: ['停进料', '联锁备用', '远程启动', '人员撤离'], gates: 8, docs: 3, cases: 1, note: '氯气、氟化氢、氨等剧毒气体必须联锁/远程备用。' },
    { id: 'RC-06', name: '物料互串', risk: '高', source: '准则 4.1', triggers: ['压差异常', '阀门内漏', '管线连通'], actions: ['隔离', '泄压', '吹扫', '确认盲板'], gates: 7, docs: 2, cases: 0, note: '优先物理隔离，严禁仅靠关阀。' },
    { id: 'RC-07', name: '管线 / 设备堵塞', risk: '中', source: '准则 4.3', triggers: ['流量为零', '压差高', '温度异常'], actions: ['停进料', '泄压', '按物料特性疏通'], gates: 6, docs: 2, cases: 0, note: '撞击敏感物料严禁敲击。' },
    { id: 'RC-08', name: '公用工程中断', risk: '高', source: '准则 4.1 / 4.5', triggers: ['水电气汽风中断', '仪表风低', '蒸汽压力低'], actions: ['降负荷/停车', '切换备用', '上下游平衡'], gates: 8, docs: 3, cases: 0, note: '要评估上下游装置与公用工程相互影响。' },
    { id: 'RC-09', name: '可燃 / 有毒介质泄漏', risk: '高', source: '准则 4.1 / 4.4', triggers: ['可燃气体报警', '有毒气体报警', '液位/压力异常'], actions: ['隔离', '泄压', '人员撤离', '消漏'], gates: 9, docs: 4, cases: 0, note: '严禁不分析原因、不到现场确认就消除报警。' },
    { id: 'RC-10', name: '开停车 / 带料开车异常', risk: '中', source: '准则 2 / 附录1-5', triggers: ['开车前未评估', '带料', '置换不合格'], actions: ['退料', '重新评估', '置换合格后开车'], gates: 7, docs: 3, cases: 0, note: '带料开车前必须完成风险评估和应急措施。' }
  ],
  cases: [
    { id: 'AC-20261028-001', title: 'R101 反应釜超温', category: 'RC-01', risk: '高', status: '处置中', phase: '退守', batch: 'LX-BIT-2610136A1', unit: 'A01 · R101', source: 'iAAS / iPAE / iCLPM', owner: '张平', time: '05:02', gates: '6 / 9', agent: '诊断 Agent 进行中' },
    { id: 'AC-20261028-002', title: 'RTO 尾气含氯偏高', category: 'RC-05', risk: '高', status: '识别中', phase: '识别', batch: 'LX-BIT-2610138A1', unit: 'A01 · RTO', source: 'iAAS', owner: '李工', time: '05:18', gates: '2 / 8', agent: '监测 Agent 已确认' },
    { id: 'AC-20261027-018', title: 'A01 冷却水压力低', category: 'RC-02', risk: '中', status: '已闭环', phase: '复盘', batch: 'LX-BIT-2610135B1', unit: 'A01 · 公用工程', source: 'iAAS / iCLPM', owner: '王工', time: '昨日 21:40', gates: '7 / 7', agent: '复盘 Agent 已完成' }
  ],
  agents: [
    { id: 'watch', name: '监测 Agent', role: '接入 iAAS/iPAE/iCLPM/iSafe，识别异常信号', status: 'done', msg: '05:02 捕获 A01-TIC-1203 连续 3 次超限，关联批号 LX-BIT-2610136A1。' },
    { id: 'classify', name: '分类 Agent', role: '匹配异常工况库与历史案例', status: 'done', msg: '匹配 RC-01 反应釜超温/反应失控，置信度 0.93；关联 HAZOP 节点 R101-04。' },
    { id: 'procedure', name: '程序 Agent', role: '从准则/SOP/HAZOP/LOPA 生成处置程序', status: 'done', msg: '生成 9 个安全门禁、18 个动作；引用应急厅〔2024〕17号 4.1/附录1。' },
    { id: 'compliance', name: '合规 Agent', role: '检查联锁、人员、隔离、审批证据', status: 'active', msg: '当前缺：联锁旁路审批、能量隔离确认、现场人数确认；建议先退守再诊断。' },
    { id: 'commander', name: '处置 Agent', role: '生成任务链、派发责任人、跟踪 SLA', status: 'pending', msg: '待合规门禁确认后，向 iMCS/inWork 派发停进料、冷却、eBR 记录任务。' },
    { id: 'review', name: '复盘 Agent', role: '处置后原因分析、SOP/预案更新', status: 'pending', msg: '待任务关闭后生成复盘报告，回写知识库与培训案例。' }
  ],
  caseDetail: {
    id: 'AC-20261028-001', title: 'R101 反应釜超温', category: 'RC-01', risk: '高', status: '处置中', phase: '退守',
    batch: 'LX-BIT-2610136A1', unit: 'A01 · R101', owner: '张平', commander: '李工', time: '05:02', elapsed: '26 min', sla: '2 h',
    trigger: 'TIC-1203 ≥ 118℃ 连续 3 次；升温速率 3.8℃/min；压力 0.46 MPa 上涨',
    brake: { mode: 'AI 指导 + 人工授权', sis: 'SIS/联锁独立执行', suggested: '停进料 · 停加热 · 紧急冷却' },
    source: ['iAAS 实时报警', 'iPAE OP30 趋势', 'iCLPM TIC-1203 回路评分 18.4'],
    phases: [
      { name: '识别', status: 'done', detail: '异常确认 · 分类 RC-01 · 风险高' },
      { name: '退守', status: 'active', detail: '停进料 / 停加热 / 冷却 / 人员管控' },
      { name: '恢复', status: 'pending', detail: '原因分析 / eBR / SOP 更新' }
    ],
    gates: [
      { name: '异常确认', status: 'done', evidence: 'iAAS 报警 3 次 / iPAE 趋势', action: '确认报警与趋势一致' },
      { name: '风险分级', status: 'done', evidence: 'RC-01 / HAZOP R101-04', action: '判定为高风险' },
      { name: '紧急处置程序', status: 'done', evidence: '应急厅〔2024〕17号 / SOP-R101', action: '调取处置程序' },
      { name: '退守安全状态', status: 'done', evidence: 'iMCS 批次 / DCS 趋势', action: '停进料、停加热、启动冷却' },
      { name: '现场人员最少化', status: 'done', evidence: 'iSafe 人员定位', action: '现场≤2 人侦查，禁止交叉作业' },
      { name: '联锁/旁路审批', status: 'pending', evidence: '联锁台帐 / 审批单', action: '严禁擅自旁路；如需旁路须评估审批' },
      { name: '能量隔离', status: 'pending', evidence: '盲板 / 泄压 / 吹扫记录', action: '确认隔离，禁止以关阀代替盲板' },
      { name: '统一指挥', status: 'done', evidence: '控制室 DCS / 上下游', action: '明确指挥人，盯守 DCS' },
      { name: '处置后复盘', status: 'pending', evidence: 'eBR / 复盘报告', action: '原因分析、SOP/预案更新' }
    ],
    taskChain: [
      { role: '监测 Agent', task: '确认异常信号并关联批次', source: 'iAAS/iPAE', status: 'done' },
      { role: '分类 Agent', task: '匹配 RC-01 与 HAZOP/LOPA', source: '知识库', status: 'done' },
      { role: '程序 Agent', task: '生成 9 门禁/18 动作处置程序', source: '准则/SOP', status: 'done' },
      { role: '合规 Agent', task: '检查人员/联锁/隔离证据', source: 'iSafe/iMCS', status: 'active' },
      { role: '处置 Agent', task: '派发退守/冷却/eBR 任务', source: 'inWork/iMCS', status: 'pending' },
      { role: '复盘 Agent', task: '生成复盘并回写知识库', source: 'iACMS', status: 'pending' }
    ]
  },
  drills: [
    { id: 'DR-01', name: 'R101 反应失控', risk: '高', duration: '8 min', steps: 9, last: '2026-10-20', result: '通过' },
    { id: 'DR-02', name: 'A01 冷却中断', risk: '高', duration: '6 min', steps: 7, last: '2026-10-18', result: '需改进' },
    { id: 'DR-03', name: 'RTO 尾气故障', risk: '中', duration: '5 min', steps: 6, last: '2026-10-12', result: '通过' }
  ]
};
