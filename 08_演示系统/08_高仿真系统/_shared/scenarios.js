window.DEMO_SCENARIOS = [
  {
    id: 'R101_OVERHEAT',
    no: '01',
    title: 'R101 反应釜超温',
    subtitle: '反应失控前兆 · 先退守，再诊断',
    risk: '高',
    batch: 'LX-BIT-2610136A1',
    unit: 'A01 · R101',
    loop: 'A01-TIC-1203',
    product: 'BIT',
    duration: '8 min',
    color: '#DC2626',
    pain: '反应釜飞温、压力骤升，操作员先看报警还是先停进料？',
    fineChemical: '精细化工间歇反应釜，放热反应，冷却/搅拌异常可能迅速转为反应失控。',
    systems: ['iAAS', 'iPAE', 'iCLPM', 'iACMS', 'iMCS', 'inWork'],
    gates: ['异常确认', '风险分级', '紧急处置程序', '退守安全状态', '人员最少化', '联锁/旁路', '能量隔离', '统一指挥', '处置后复盘'],
    outcome: '先退守、再诊断；9 个门禁逐项确认；处置后回写 SOP 与知识库。',
    steps: [
      { system: 'iAAS', page: 'iaas', hash: 'realtime', role: '操作员', title: '报警洪水里找到那一条', text: 'TIC-1203 连续 3 次超温，压力同步上涨；iAAS 把 957 条实时报警收敛为 1 个异常工况候选。' },
      { system: 'iPAE', page: 'ipae', hash: 'batch', role: '工艺工程师', title: '用历史批次解释“为什么这次不一样”', text: '历史批次 OP30 升温快 14 min，越界率 12.6%；不是单点仪表问题，而是反应路径偏离。' },
      { system: 'iCLPM', page: 'iclpm', hash: 'loops', role: '控制工程师', title: '回路评分 18.4：先别急着调 PID', text: 'TIC-1203 存在振荡/黏滞；但当前第一优先级是退守，不是深度整定。' },
      { system: 'iACMS', page: 'iacms', hash: 'case', caseId: 'R101_OVERHEAT', role: '值班长', title: '把它变成一张有门禁的处置任务', text: '分类 Agent 命中 RC-01；程序 Agent 生成 9 个安全门禁，合规 Agent 发现联锁、隔离、人数三项证据缺失。' },
      { system: 'iACMS', page: 'iacms', hash: 'workbench', role: '值班长', title: 'Agent 协作：AI 建议，人确认', text: '监测/分类/程序/合规/处置/复盘 6 个 Agent 协同；AI 只做发现、建议、缺项检查，不替代 SIS 和授权。' },
      { system: 'iMCS', page: 'imcs', hash: 'ebr', role: '质量工程师', title: 'eBR 里看批次影响与放行边界', text: '同一批号 LX-BIT-2610136A1：11 个单元、72 个 OP；先核对质量与收率，再判断是否允许继续/放行。' },
      { system: 'iACMS', page: 'iacms', hash: 'drill', role: '生产经理', title: '推演与复盘：把一次异常变成组织能力', text: '推演发现“联锁审批”应前置；复盘生成整改清单，回写 SOP、知识库和培训案例。' },
      { system: 'inWork', page: 'inwork', role: '生产经理', title: 'inWork 闭环：任务、责任人、留痕', text: '把异常处置任务派到 inWork，跟踪 SLA、证据和关闭；iLINK 作为任务链执行层。' }
    ]
  },
  {
    id: 'A01_COOLING',
    no: '02',
    title: 'A01 冷却水中断',
    subtitle: '冷却失效 · 搅拌与反应热的连锁风险',
    risk: '高',
    batch: 'LX-BIT-2610139B2',
    unit: 'A01 · 公用工程',
    loop: 'A01-PIC-1201',
    product: 'BIT',
    duration: '7 min',
    color: '#D97706',
    pain: '冷却水压力低只是公用工程报警，为什么可能演变成反应失控？',
    fineChemical: '放热反应对冷却高度敏感；冷却中断 + 搅拌异常时，局部热点可能在短时间内形成。',
    systems: ['iAAS', 'iCLPM', 'iACMS', 'iMCS'],
    gates: ['冷却确认', '搅拌状态', '降负荷/停加热', '备用冷却', '人员管控', '处置后复盘'],
    outcome: '冷却中断不直接等于停车，但必须按反应风险快速降负荷、切备用、评估是否退守。',
    steps: [
      { system: 'iAAS', page: 'iaas', hash: 'realtime', role: '操作员', title: '公用工程报警进入报警池', text: '冷却水压力低、夹套流量低同时出现；iAAS 将其与 R101 温度关联，提示“可能影响反应撤热”。' },
      { system: 'iCLPM', page: 'iclpm', hash: 'loops', role: '控制工程师', title: '先看夹套流量和阀门，不只看压力', text: 'PIC-1201 输出与阀位不匹配，怀疑调节阀黏滞；先确认实际冷却能力，再决定是否切备用。' },
      { system: 'iACMS', page: 'iacms', hash: 'case', caseId: 'A01_COOLING', role: '值班长', title: '冷却中断的 7 个门禁', text: 'RC-02 独立 case：冷却确认、搅拌状态、降负荷/停加热、备用冷却、人员管控、隔离、复盘。' },
      { system: 'iACMS', page: 'iacms', hash: 'workbench', role: '值班长', title: 'Agent 生成“冷却中断”任务链', text: '监测 Agent 确认冷却/搅拌状态，程序 Agent 生成 7 个门禁；AI 建议先切备用，不直接建议继续满负荷。' },
      { system: 'iMCS', page: 'imcs', hash: 'execution', role: '生产经理', title: '看批次影响：继续、降负荷还是停车', text: '关联当前批次与后续排产，评估降负荷对质量/收率的影响，形成生产决策。' },
      { system: 'iACMS', page: 'iacms', hash: 'drill', role: '生产经理', title: '复盘：冷却中断的 12 分钟窗口', text: '推演“切备用失败”分支，验证人员管控、停车条件和上下游平衡。' }
    ]
  },
  {
    id: 'DISTILLATION',
    no: '03',
    title: '蒸馏塔不出料',
    subtitle: '塔釜温度高 · 严禁继续加热、干蒸',
    risk: '中',
    batch: 'LX-BIT-2610141C1',
    unit: 'A01 · T201',
    loop: 'A01-FIC-2204',
    product: 'BIT',
    duration: '6 min',
    color: '#0B9A78',
    pain: '采出为零、塔釜温度高，继续加热会不会把塔蒸干？',
    fineChemical: '蒸馏/精馏是精细化工常见分离单元；不出料可能来自堵塞、真空、回流或仪表，继续加热有干蒸和分解风险。',
    systems: ['iAAS', 'iPAE', 'iCLPM', 'iACMS', 'iMCS'],
    gates: ['不出料确认', '停加热', '查堵/真空', '泄压隔离', '物料处置', '复盘'],
    outcome: '先停加热、查原因，再决定疏通/退料；严禁“再等等看”。',
    steps: [
      { system: 'iAAS', page: 'iaas', hash: 'realtime', role: '操作员', title: '采出流量为零，塔釜温度还在涨', text: 'FIC-2204 采出为零、TIC-2201 塔釜温度持续上升；iAAS 给出“蒸馏不出料”候选。' },
      { system: 'iPAE', page: 'ipae', hash: 'outlier', role: '工艺工程师', title: '历史批次里，不出料前有什么征兆', text: 'iPAE 对比历史批次：真空度先降、回流比异常，采出为零只是最后结果。' },
      { system: 'iCLPM', page: 'iclpm', hash: 'diagnosis', role: '控制工程师', title: '是阀卡、真空，还是仪表假值', text: 'FIC-2204 阀位与流量不匹配；先确认仪表与阀，不把“假零”当成“真堵”。' },
      { system: 'iACMS', page: 'iacms', hash: 'case', caseId: 'DISTILLATION', role: '值班长', title: '不出料的 6 个门禁', text: '独立 case：不出料确认、停加热、查堵/真空、泄压隔离、物料处置、复盘；停加热是前置门禁。' },
      { system: 'iACMS', page: 'iacms', hash: 'workbench', role: '值班长', title: '生成停加热/查堵任务链', text: 'Agent 将“停加热”设为前置门禁，未经确认不允许进入疏通步骤。' },
      { system: 'iMCS', page: 'imcs', hash: 'quality', role: '质量工程师', title: '记录异常，评估物料与批次', text: '把不出料时段、温度、真空、处置动作写进 eBR，支持后续质量判断。' }
    ]
  },
  {
    id: 'RTO_CHLORINE',
    no: '04',
    title: 'RTO 尾气含氯偏高',
    subtitle: '有毒气体系统故障 · 联锁与人员撤离',
    risk: '高',
    batch: 'LX-BIT-2610138A1',
    unit: 'A01 · RTO',
    loop: 'A01-AIC-3302',
    product: 'BIT',
    duration: '7 min',
    color: '#7C3AED',
    pain: '尾气含氯升高，先调风量还是先停进料？现场人员要不要撤？',
    fineChemical: '含氯尾气处理失效可能造成有毒气体外逸；准则要求尾气系统故障时能联锁启动或远程启动备用系统。',
    systems: ['iAAS', 'iCLPM', 'iACMS', 'iMCS', 'iSafe'],
    gates: ['尾气确认', '停进料', '备用系统', '人员撤离', '隔离', '复盘'],
    outcome: '先保护人员和环境，再查原因；不得用“加大风量”掩盖超标。',
    steps: [
      { system: 'iAAS', page: 'iaas', hash: 'realtime', role: '操作员', title: '尾气含氯高 + 风机电流异常', text: 'AIC-3302 含氯上升，风机电流下降；iAAS 将其升级为有毒气体系统异常。' },
      { system: 'iCLPM', page: 'iclpm', hash: 'diagnosis', role: '控制工程师', title: '风机/阀/仪表：先判断是否真失效', text: '风机阀位与电流不匹配，存在“假风量”风险；先确认备用系统可投用。' },
      { system: 'iACMS', page: 'iacms', hash: 'case', caseId: 'RTO_CHLORINE', role: '值班长', title: '尾气故障的 6 个门禁', text: '独立 case：尾气确认、停进料、备用系统、人员撤离、隔离、复盘；人员安全优先。' },
      { system: 'iACMS', page: 'iacms', hash: 'workbench', role: '值班长', title: 'Agent 协同：人员安全优先', text: '监测/分类/程序/合规 Agent 共同确认人员、联锁、备用系统证据；处置 Agent 才可派发。' },
      { system: 'iMCS', page: 'imcs', hash: 'quality', role: '质量工程师', title: '批次隔离与质量记录', text: '标记异常时段、隔离受影响物料，保留尾气数据供后续质量与环保判断。' },
      { system: 'iACMS', page: 'iacms', hash: 'drill', role: '生产经理', title: '复盘：为什么没有第一时间切备用', text: '推演“风机故障 + 备用未投用”分支，固化联锁测试和人员撤离路线。' }
    ]
  },
  {
    id: 'CATALYST_HX',
    no: '05',
    title: '催化剂活性下降 / 换热器结垢',
    subtitle: '历史数据里发现“看不见的慢变量”',
    risk: '中',
    batch: '408-R401 历史批次',
    unit: '408 · R401',
    loop: '408-TIC-1203',
    product: 'BIT',
    duration: '7 min',
    color: '#1466E8',
    pain: '没有新仪表，怎么提前 18 天知道催化剂在衰减、换热器在结垢？',
    fineChemical: '精细化工批次间差异大，催化剂活性和换热性能往往没有直接在线仪表，只能从历史数据中间接估计。',
    systems: ['iPAE', 'iCLPM', 'iACMS', 'iMCS'],
    gates: ['数据窗口', '模型可信度', '活性/污垢判断', '操作建议', '验证/回写'],
    outcome: '用历史数据建模，把“经验感觉”变成可解释的活性指数与污垢趋势。',
    steps: [
      { system: 'iPAE', page: 'ipae', hash: 'latent', role: '工艺工程师', title: '打开慢变量与软测量', text: '催化剂活性指数 82.4%、R² 0.91；换热器 U 从 240 降到 186，污垢热阻 +55%。' },
      { system: 'iPAE', page: 'ipae', hash: 'batch', role: '工艺工程师', title: '回到批次：这些指标不是凭空来的', text: '用历史批次窗口验证：活性下降与升温速率、选择性变化同步。' },
      { system: 'iCLPM', page: 'iclpm', hash: 'performance', role: '控制工程师', title: '控制回路能不能解释一部分波动', text: '排除回路振荡/阀黏滞后，剩余偏差更可能来自催化剂/换热器。' },
      { system: 'iACMS', page: 'iacms', hash: 'case', caseId: 'CATALYST_HX', role: '工艺工程师', title: '慢变量的 5 个门禁', text: '独立 case：数据窗口、模型可信度、活性/污垢判断、操作建议、验证回写；AI 建议不直接动作。' },
      { system: 'iACMS', page: 'iacms', hash: 'workbench', role: '生产经理', title: '生成“提前 18 天”的操作建议', text: 'Agent 生成提温/降负荷/清洗窗口建议，并标注模型可信度与验证动作。' },
      { system: 'iACMS', page: 'iacms', hash: 'drill', role: '生产经理', title: '回测与复盘：建议是否真的有效', text: '把建议执行后的批次表现回写模型，持续校准活性/污垢预测。' }
    ]
  }
];

(function (S) {
  var R = {
    R101_OVERHEAT: {
      causes: ['冷却/搅拌能力下降', '进料配比或升温速率偏差', 'TIC-1203 回路黏滞、响应慢'],
      consequences: [
        { text: '反应失控 / 飞温', prob: '↑ 8×', detail: '超压、冲料' },
        { text: '设备超压 / 物料泄漏', prob: '↑ 5×', detail: '泄放负荷上升' },
        { text: '人员伤害 / 环境影响', prob: '↑ 3×', detail: '现场处置暴露' }
      ],
      protection: [
        { name: 'BPCS 温度控制', status: 'degraded', pfd: '1.2e-2', note: '回路振荡、黏滞' },
        { name: '操作员响应', status: 'degraded', pfd: '5.0e-2', note: '报警洪水中确认延迟' },
        { name: 'SIS 联锁', status: 'unconfirmed', pfd: '待确认', note: '联锁状态未验证' },
        { name: '紧急泄放', status: 'normal', pfd: '1.0e-3', note: '安全阀/泄放设施' },
        { name: '应急响应', status: 'normal', pfd: '—', note: '撤离/消防' }
      ],
      riskProfile: { before: '1.2e-4', current: '8.0e-3', target: '< 1e-4', increase: '约 8×', mode: '安全失效概率' }
    },
    A01_COOLING: {
      causes: ['冷却水泵/调节阀故障', '夹套流量不足', '公用工程压力波动'],
      consequences: [
        { text: '反应热累积 / 飞温', prob: '↑ 6×', detail: '冷却能力不足' },
        { text: '局部热点 / 物料分解', prob: '↑ 4×', detail: '搅拌不均' },
        { text: '紧急停车 / 物料损失', prob: '↑ 3×', detail: '批次中断' }
      ],
      protection: [
        { name: 'BPCS 冷却控制', status: 'degraded', pfd: '2.0e-2', note: '阀位/流量不匹配' },
        { name: '操作员响应', status: 'degraded', pfd: '4.0e-2', note: '切备用确认慢' },
        { name: 'SIS 联锁', status: 'unconfirmed', pfd: '待确认', note: '联锁状态未验证' },
        { name: '备用冷却', status: 'unconfirmed', pfd: '待确认', note: '未确认可投用' },
        { name: '应急响应', status: 'normal', pfd: '—', note: '降负荷/停车' }
      ],
      riskProfile: { before: '2.0e-4', current: '6.0e-3', target: '< 2e-4', increase: '约 6×', mode: '安全失效概率' }
    },
    DISTILLATION: {
      causes: ['塔釜/再沸器堵塞', '真空或回流异常', '采出阀/仪表假值'],
      consequences: [
        { text: '干蒸 / 塔釜超温', prob: '↑ 4×', detail: '继续加热风险' },
        { text: '物料分解 / 结焦', prob: '↑ 3×', detail: '质量与设备' },
        { text: '设备损坏 / 停产', prob: '↑ 2×', detail: '清理周期长' }
      ],
      protection: [
        { name: 'BPCS 温度控制', status: 'normal', pfd: '1.0e-2', note: '可维持控制' },
        { name: '操作员响应', status: 'degraded', pfd: '3.0e-2', note: '可能继续加热' },
        { name: '真空/回流联锁', status: 'unconfirmed', pfd: '待确认', note: '逻辑未验证' },
        { name: '泄压/隔离', status: 'normal', pfd: '1.0e-3', note: '按物料特性' },
        { name: '质量放行', status: 'normal', pfd: '—', note: 'eBR/检验' }
      ],
      riskProfile: { before: '3.0e-4', current: '2.4e-3', target: '< 3e-4', increase: '约 4×', mode: '安全失效概率' }
    },
    RTO_CHLORINE: {
      causes: ['风机/阀门故障', '吸收液/洗涤失效', '含氯物料负荷波动'],
      consequences: [
        { text: '有毒气体外逸', prob: '↑ 9×', detail: '人员/周边影响' },
        { text: '环保超标 / 停产', prob: '↑ 5×', detail: '排放风险' },
        { text: '人员暴露 / 撤离', prob: '↑ 4×', detail: '现场与周边' }
      ],
      protection: [
        { name: 'BPCS 风量控制', status: 'degraded', pfd: '2.0e-2', note: '风机电流下降' },
        { name: '操作员响应', status: 'degraded', pfd: '3.0e-2', note: '先调风量而非停料' },
        { name: '备用系统', status: 'unconfirmed', pfd: '待确认', note: '未确认投用' },
        { name: '气体检测/联锁', status: 'normal', pfd: '1.0e-3', note: 'AIC-3302 报警' },
        { name: '应急响应', status: 'normal', pfd: '—', note: '撤离/隔离' }
      ],
      riskProfile: { before: '1.0e-4', current: '9.0e-3', target: '< 1e-4', increase: '约 9×', mode: '安全失效概率' }
    },
    CATALYST_HX: {
      causes: ['催化剂活性衰减', '换热器结垢', '原料/工况漂移'],
      consequences: [
        { text: '批次质量波动', prob: '↑ 2.5×', detail: '选择性/杂质' },
        { text: '收率 / 产能下降', prob: '↑ 2×', detail: '经济影响' },
        { text: '能耗 / 清洗窗口缩短', prob: '↑ 1.8×', detail: '维护成本' }
      ],
      protection: [
        { name: '软测量模型', status: 'degraded', pfd: 'R² 0.91', note: '需持续校准' },
        { name: '操作员经验', status: 'normal', pfd: '—', note: '人工判断' },
        { name: '质量检验', status: 'normal', pfd: '—', note: '批次放行' },
        { name: '维护计划', status: 'degraded', pfd: '12 天窗口', note: '清洗/更换' },
        { name: '回测/复盘', status: 'unconfirmed', pfd: '待执行', note: '建议验证' }
      ],
      riskProfile: { before: '基线', current: '↑ 2.5×', target: '≤ 基线', increase: '约 2.5×', mode: '质量/经济风险' }
    }
  };
  S.forEach(function (s) { if (R[s.id]) { Object.assign(s, R[s.id]); } });

  function e(v) { return String(v == null ? '' : v).replace(/[&<>"]/g, function (c) { return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]; }); }
  function lines(text, len) {
    var t = String(text || ''), out = [];
    for (var i = 0; i < t.length && out.length < 2; i += len) { out.push(t.slice(i, i + len)); }
    return out;
  }
  function box(x, y, w, h, title, sub, cls) {
    var ls = lines(title, 13);
    var s = '<rect x="' + x + '" y="' + y + '" width="' + w + '" height="' + h + '" rx="7" fill="' + (cls === 'cause' ? '#FFFBEB' : '#FEF2F2') + '" stroke="' + (cls === 'cause' ? '#FDE3B0' : '#FECACA') + '"/>';
    s += ls.map(function (l, i) { return '<text x="' + (x + 10) + '" y="' + (y + 21 + i * 15) + '" font-size="11" fill="#334155" font-weight="600">' + e(l) + '</text>'; }).join('');
    if (sub) { s += '<text x="' + (x + 10) + '" y="' + (y + h - 10) + '" font-size="9" fill="#94A3B8">' + e(sub) + '</text>'; }
    return s;
  }
  function bowtie(s) {
    var causes = s.causes || [], cons = s.consequences || [], prot = s.protection || [], risk = s.riskProfile || {};
    var svg = '<svg viewBox="0 0 960 250" role="img" aria-label="' + e(s.title) + ' 原因后果与保护层示意图">';
    svg += '<defs><marker id="arr" markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d="M0,0 L7,3.5 L0,7 z" fill="#94A3B8"/></marker></defs>';
    svg += '<text x="10" y="14" font-size="9" fill="#B45309" font-weight="700">可能原因 / 触发</text>';
    svg += '<text x="350" y="14" font-size="9" fill="#B91C1C" font-weight="700">异常工况</text>';
    svg += '<text x="700" y="14" font-size="9" fill="#B91C1C" font-weight="700">可能后果 / 风险升级</text>';
    causes.slice(0, 3).forEach(function (c, i) { svg += box(10, 28 + i * 66, 245, 56, c, '', 'cause'); });
    cons.slice(0, 3).forEach(function (c, i) {
      var txt = typeof c === 'string' ? c : c.text;
      var prob = typeof c === 'object' ? c.prob : '';
      svg += box(700, 28 + i * 66, 245, 56, txt, prob, 'cons');
    });
    svg += '<line x1="260" y1="125" x2="343" y2="125" stroke="#94A3B8" stroke-width="1.4" marker-end="url(#arr)"/>';
    svg += '<line x1="610" y1="125" x2="693" y2="125" stroke="#94A3B8" stroke-width="1.4" marker-end="url(#arr)"/>';
    svg += '<rect x="350" y="82" width="260" height="88" rx="10" fill="#0B1B2E" stroke="#DC2626"/>';
    svg += lines(s.title, 13).map(function (l, i) { return '<text x="480" y="' + (112 + i * 18) + '" text-anchor="middle" font-size="13" fill="#fff" font-weight="700">' + e(l) + '</text>'; }).join('');
    svg += '<text x="480" y="151" text-anchor="middle" font-size="9" fill="#FCA5A5">' + e(risk.current || '') + ' · ' + e(risk.mode || '风险') + '</text>';
    svg += '</svg>';
    var chips = prot.map(function (p) {
      var cls = p.status === 'degraded' ? 'degraded' : p.status === 'unconfirmed' ? 'unconfirmed' : 'normal';
      var label = p.status === 'degraded' ? '降级' : p.status === 'unconfirmed' ? '待确认' : '正常';
      return '<span class="ipl ' + cls + '"><b>' + e(p.name) + '</b><em>' + label + '</em><small>PFD ' + e(p.pfd) + ' · ' + e(p.note) + '</small></span>';
    }).join('');
    return '<div class="bowtie">' +
      '<div class="bowtie-legend"><span class="lg-cause">原因</span><span class="lg-event">异常工况</span><span class="lg-con">后果</span><span class="lg-note">演示风险值，仅表示趋势</span></div>' +
      '<div class="bowtie-svg">' + svg + '</div>' +
      '<div class="ipl-row"><div class="ipl-label"><b>独立保护层</b><span>当前有效性</span></div><div class="ipl-chips">' + chips + '</div></div>' +
      '<div class="risk-delta"><div><span>初始 ' + e(risk.mode || '风险') + '</span><b>' + e(risk.before) + '</b></div><div class="rd-arrow">→</div><div><span>当前风险</span><b class="bad">' + e(risk.current) + '</b></div><div class="rd-arrow">↑</div><div><span>风险上升</span><b class="bad">' + e(risk.increase) + '</b></div><div class="rd-arrow">→</div><div><span>目标</span><b class="ok">' + e(risk.target) + '</b></div></div>' +
      '</div>';
  }
  window.DEMO_BOWTIE = bowtie;
})(window.DEMO_SCENARIOS);

