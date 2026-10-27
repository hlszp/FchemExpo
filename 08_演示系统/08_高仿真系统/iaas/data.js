/* 致联高仿真演示 · iAAS 合成数据 · 2026-10-27
   扩展：历史报警 / 超时报警 / 分类报警 / 联锁 / 自控 / 绩效 / 工厂模型
   全部为演示合成数据，不含真实客户信息。 */
window.IAAS_DEMO = (function () {
  function pad(n) { return n < 10 ? '0' + n : '' + n; }

  var KPI = {
    monitored: 19733, running: 19571, shelved: 161, disabled: 1,
    alarms: 957, confirmed: 680, unconfirmed: 277, timeoutConfirm: 10, timeoutRecover: 679,
    disposed: 410925, unhandled: 4807, handling: 213, pendingVerify: 405905,
    confirmRate: 99.77, disposeRate: 93.70, recoverRate: 98.27,
    ticketRate: 86.08, interferenceRate: 42.52,
    interlockRate: 96.28, autoRate: 34.08
  };

  var PRIORITY = [
    { label: '紧急', value: 357, color: '#DC2626' },
    { label: '重要', value: 180, color: '#D97706' },
    { label: '一般', value: 420, color: '#1466E8' }
  ];

  var UNITS = [
    { name: '2EH-GY', value: 447 }, { name: 'MTO-GY', value: 192 }, { name: 'BD-GY', value: 147 },
    { name: 'OPU-GY', value: 125 }, { name: '火炬', value: 26 }, { name: '余热回收锅炉', value: 15 },
    { name: '其他', value: 3 }, { name: '循环水站', value: 1 }, { name: 'BD-GDS', value: 1 },
    { name: '空压站', value: 0 }, { name: '脱盐水站', value: 0 }, { name: '中水回用站', value: 0 }
  ];

  /* 24 小时报警数：合计 2112，小时均值 88，峰值 12 时 397 */
  var TREND = [35, 31, 30, 30, 29, 31, 37, 48, 59, 67, 81, 119, 397, 264, 179, 119, 95, 87, 82, 76, 70, 58, 48, 40];

  var ALARMS = [
    { id: 'AL-20261027-001', time: '10-27 19:32:18', unit: '2EH-GY', tag: '2EH-TIC-1203', desc: '反应器出口温度高', priority: '紧急', status: '未确认', type: '过程', operator: '—', duration: '2 分钟' },
    { id: 'AL-20261027-002', time: '10-27 19:31:42', unit: '2EH-GY', tag: '2EH-PIC-1108', desc: '反应器压力高', priority: '重要', status: '已确认', type: '过程', operator: '张平', duration: '3 分钟' },
    { id: 'AL-20261027-003', time: '10-27 19:30:05', unit: 'MTO-GY', tag: 'MTO-FIC-2201', desc: '甲醇进料流量低', priority: '重要', status: '处置中', type: '过程', operator: '李工', duration: '5 分钟' },
    { id: 'AL-20261027-004', time: '10-27 19:28:36', unit: 'BD-GY', tag: 'BD-LIC-3302', desc: '回流罐液位高', priority: '紧急', status: '未确认', type: '过程', operator: '—', duration: '7 分钟' },
    { id: 'AL-20261027-005', time: '10-27 19:27:11', unit: 'OPU-GY', tag: 'OPU-TIC-4101', desc: '塔顶温度低', priority: '一般', status: '已确认', type: '过程', operator: '王工', duration: '8 分钟' },
    { id: 'AL-20261027-006', time: '10-27 19:25:54', unit: '2EH-GY', tag: '2EH-AIC-1301', desc: '尾气氧含量高', priority: '紧急', status: '处置中', type: '安全', operator: '张平', duration: '10 分钟' },
    { id: 'AL-20261027-007', time: '10-27 19:24:20', unit: 'MTO-GY', tag: 'MTO-PIC-2102', desc: '再生器压力波动', priority: '重要', status: '已确认', type: '设备', operator: '赵工', duration: '12 分钟' },
    { id: 'AL-20261027-008', time: '10-27 19:22:47', unit: 'BD-GY', tag: 'BD-FIC-3405', desc: '溶剂流量偏差大', priority: '一般', status: '搁置', type: '过程', operator: '陈工', duration: '14 分钟' },
    { id: 'AL-20261027-009', time: '10-27 19:21:09', unit: 'OPU-GY', tag: 'OPU-LIC-4203', desc: '产品罐液位高', priority: '重要', status: '未确认', type: '过程', operator: '—', duration: '15 分钟' },
    { id: 'AL-20261027-010', time: '10-27 19:19:33', unit: '2EH-GY', tag: '2EH-FIC-1201', desc: '乙烯进料流量低', priority: '重要', status: '已确认', type: '过程', operator: '张平', duration: '17 分钟' },
    { id: 'AL-20261027-011', time: '10-27 19:17:58', unit: 'MTO-GY', tag: 'MTO-TIC-2204', desc: '反应温度高', priority: '紧急', status: '处置中', type: '过程', operator: '李工', duration: '18 分钟' },
    { id: 'AL-20261027-012', time: '10-27 19:16:12', unit: 'BD-GY', tag: 'BD-PIC-3501', desc: '塔压差高', priority: '一般', status: '已确认', type: '设备', operator: '王工', duration: '20 分钟' },
    { id: 'AL-20261027-013', time: '10-27 19:14:40', unit: '2EH-GY', tag: '2EH-LIC-1102', desc: '缓冲罐液位低', priority: '一般', status: '搁置', type: '过程', operator: '赵工', duration: '22 分钟' },
    { id: 'AL-20261027-014', time: '10-27 19:12:55', unit: 'OPU-GY', tag: 'OPU-FIC-4302', desc: '回流流量低', priority: '重要', status: '未确认', type: '过程', operator: '—', duration: '24 分钟' },
    { id: 'AL-20261027-015', time: '10-27 19:10:21', unit: '火炬', tag: 'FLR-PIC-5101', desc: '火炬总管压力高', priority: '紧急', status: '已确认', type: '安全', operator: '张平', duration: '26 分钟' },
    { id: 'AL-20261027-016', time: '10-27 19:08:47', unit: 'MTO-GY', tag: 'MTO-LIC-2303', desc: '水洗塔液位高', priority: '一般', status: '已确认', type: '过程', operator: '李工', duration: '28 分钟' },
    { id: 'AL-20261027-017', time: '10-27 19:06:30', unit: '2EH-GY', tag: '2EH-TIC-1402', desc: '换热器出口温度低', priority: '一般', status: '已处置', type: '设备', operator: '张平', duration: '30 分钟' },
    { id: 'AL-20261027-018', time: '10-27 19:04:12', unit: 'BD-GY', tag: 'BD-AIC-3601', desc: '尾气可燃气体高', priority: '紧急', status: '处置中', type: '安全', operator: '王工', duration: '32 分钟' },
    { id: 'AL-20261027-019', time: '10-27 19:02:45', unit: '余热回收锅炉', tag: 'HRSG-TIC-6101', desc: '锅炉出口温度高', priority: '重要', status: '已确认', type: '设备', operator: '赵工', duration: '34 分钟' },
    { id: 'AL-20261027-020', time: '10-27 19:00:18', unit: 'OPU-GY', tag: 'OPU-PIC-4401', desc: '塔顶压力低', priority: '一般', status: '已处置', type: '过程', operator: '陈工', duration: '36 分钟' }
  ];

  var TOP_TAGS = [
    { tag: '2EH-TIC-1203', desc: '反应器出口温度', count: 100, unit: '2EH-GY' },
    { tag: '2EH-PIC-1108', desc: '反应器压力', count: 88, unit: '2EH-GY' },
    { tag: 'MTO-FIC-2201', desc: '甲醇进料流量', count: 74, unit: 'MTO-GY' },
    { tag: 'BD-LIC-3302', desc: '回流罐液位', count: 66, unit: 'BD-GY' },
    { tag: 'OPU-TIC-4101', desc: '塔顶温度', count: 58, unit: 'OPU-GY' },
    { tag: '2EH-AIC-1301', desc: '尾气氧含量', count: 54, unit: '2EH-GY' },
    { tag: 'MTO-PIC-2102', desc: '再生器压力', count: 48, unit: 'MTO-GY' },
    { tag: 'BD-FIC-3405', desc: '溶剂流量', count: 42, unit: 'BD-GY' },
    { tag: 'OPU-LIC-4203', desc: '产品罐液位', count: 38, unit: 'OPU-GY' },
    { tag: 'FLR-PIC-5101', desc: '火炬总管压力', count: 26, unit: '火炬' }
  ];

  var AUDIT = [
    { time: '10-27 19:31:12', user: '张平', action: '确认报警', target: '2EH-PIC-1108', detail: '报警确认，备注“现场已确认压力波动”' },
    { time: '10-27 19:29:40', user: '李工', action: '置为处置中', target: 'MTO-FIC-2201', detail: '甲醇进料低，通知工艺调整' },
    { time: '10-27 19:27:58', user: '王工', action: '搁置报警', target: 'BD-FIC-3405', detail: '搁置 30 分钟，等待仪表校验' },
    { time: '10-27 19:25:33', user: '张平', action: '确认报警', target: '2EH-AIC-1301', detail: '尾气氧含量高，联锁已动作' },
    { time: '10-27 19:23:05', user: '赵工', action: '修改报警配置', target: 'MTO-PIC-2102', detail: '死区 0.02→0.03 MPa，待审批' },
    { time: '10-27 19:20:41', user: '陈工', action: '报警停用', target: 'OPU-FIC-4302', detail: '仪表检修，停用 2 小时' }
  ];

  var TAGS = [
    { tag: '2EH-TIC-1203', name: '反应器出口温度', unit: '2EH-GY', device: '2EH', threshold: 118.0, dec: 1, uom: '℃', type: '过程', dir: 'high' },
    { tag: '2EH-PIC-1108', name: '反应器压力', unit: '2EH-GY', device: '2EH', threshold: 3.20, dec: 2, uom: 'MPa', type: '过程', dir: 'high' },
    { tag: 'MTO-FIC-2201', name: '甲醇进料流量', unit: 'MTO-GY', device: 'MTO', threshold: 180.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: 'BD-LIC-3302', name: '回流罐液位', unit: 'BD-GY', device: 'BD', threshold: 55.0, dec: 1, uom: '%', type: '过程', dir: 'high' },
    { tag: 'OPU-TIC-4101', name: '塔顶温度', unit: 'OPU-GY', device: 'OPU', threshold: 78.0, dec: 1, uom: '℃', type: '过程', dir: 'low' },
    { tag: '2EH-AIC-1301', name: '尾气氧含量', unit: '2EH-GY', device: '2EH', threshold: 6.0, dec: 1, uom: '%', type: '安全', dir: 'high' },
    { tag: 'MTO-PIC-2102', name: '再生器压力', unit: 'MTO-GY', device: 'MTO', threshold: 0.28, dec: 2, uom: 'MPa', type: '过程', dir: 'high' },
    { tag: 'BD-FIC-3405', name: '溶剂流量', unit: 'BD-GY', device: 'BD', threshold: 28.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: 'OPU-LIC-4203', name: '产品罐液位', unit: 'OPU-GY', device: 'OPU', threshold: 80.0, dec: 1, uom: '%', type: '过程', dir: 'high' },
    { tag: 'FLR-PIC-5101', name: '火炬总管压力', unit: '火炬', device: 'UT', threshold: 0.05, dec: 3, uom: 'MPa', type: '安全', dir: 'high' },
    { tag: '2EH-FIC-1201', name: '乙烯进料流量', unit: '2EH-GY', device: '2EH', threshold: 42.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: '2EH-LIC-1102', name: '缓冲罐液位', unit: '2EH-GY', device: '2EH', threshold: 45.0, dec: 1, uom: '%', type: '过程', dir: 'low' },
    { tag: '2EH-TIC-1402', name: '换热器出口温度', unit: '2EH-GY', device: '2EH', threshold: 95.0, dec: 1, uom: '℃', type: '设备', dir: 'low' },
    { tag: 'MTO-TIC-2204', name: '反应温度', unit: 'MTO-GY', device: 'MTO', threshold: 485.0, dec: 1, uom: '℃', type: '过程', dir: 'high' },
    { tag: 'MTO-LIC-2303', name: '水洗塔液位', unit: 'MTO-GY', device: 'MTO', threshold: 62.0, dec: 1, uom: '%', type: '过程', dir: 'high' },
    { tag: 'BD-PIC-3501', name: '塔压差', unit: 'BD-GY', device: 'BD', threshold: 0.12, dec: 2, uom: 'MPa', type: '设备', dir: 'high' },
    { tag: 'BD-AIC-3601', name: '尾气可燃气体', unit: 'BD-GY', device: 'BD', threshold: 20.0, dec: 1, uom: '%LEL', type: '安全', dir: 'high' },
    { tag: 'OPU-FIC-4302', name: '回流流量', unit: 'OPU-GY', device: 'OPU', threshold: 56.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: 'OPU-PIC-4401', name: '塔顶压力', unit: 'OPU-GY', device: 'OPU', threshold: 0.16, dec: 2, uom: 'MPa', type: '过程', dir: 'low' },
    { tag: 'HRSG-TIC-6101', name: '锅炉出口温度', unit: '余热回收锅炉', device: 'UT', threshold: 245.0, dec: 1, uom: '℃', type: '设备', dir: 'high' },
    { tag: 'CWS-PIC-7101', name: '循环水供水压力', unit: '循环水站', device: 'UT', threshold: 0.42, dec: 2, uom: 'MPa', type: '设备', dir: 'low' },
    { tag: 'AIR-PIC-8101', name: '仪表风压力', unit: '空压站', device: 'UT', threshold: 0.70, dec: 2, uom: 'MPa', type: '过程', dir: 'low' },
    { tag: '2EH-JZ-FIC-1601', name: '精制进料流量', unit: '2EH-JZ', device: '2EH', threshold: 36.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: 'MTO-JH-TIC-2401', name: '精制塔温度', unit: 'MTO-JH', device: 'MTO', threshold: 132.0, dec: 1, uom: '℃', type: '过程', dir: 'high' },
    { tag: 'BD-GDS-LIC-3701', name: '罐区液位', unit: 'BD-GDS', device: 'BD', threshold: 72.0, dec: 1, uom: '%', type: '设备', dir: 'high' },
    { tag: 'OPU-HS-TIC-4501', name: '回收塔温度', unit: 'OPU-HS', device: 'OPU', threshold: 110.0, dec: 1, uom: '℃', type: '过程', dir: 'high' },
    { tag: 'UT-FIC-9102', name: '除盐水流量', unit: '脱盐水站', device: 'UT', threshold: 120.0, dec: 1, uom: 't/h', type: '过程', dir: 'low' },
    { tag: 'WWT-AIC-9101', name: '污水 COD', unit: '污水处理站', device: 'UT', threshold: 60.0, dec: 1, uom: 'mg/L', type: '过程', dir: 'high' }
  ];

  var FACTORY = {
    plant: { code: 'PLANT-01', name: '某新材料一体化基地', devices: 5, units: 22, points: 19733, running: 19571, shelved: 161, disabled: 1 },
    devices: [
      { code: '2EH', name: '2EH 装置', units: [
        { code: '2EH-GY', name: '反应单元', points: 2560, shelved: 22, disabled: 0 },
        { code: '2EH-FL', name: '分离单元', points: 1990, shelved: 15, disabled: 0 },
        { code: '2EH-JZ', name: '精制单元', points: 860, shelved: 8, disabled: 0 },
        { code: '2EH-CC', name: '储运单元', points: 330, shelved: 6, disabled: 1 }
      ] },
      { code: 'MTO', name: 'MTO 装置', units: [
        { code: 'MTO-GY', name: '反应再生单元', points: 2280, shelved: 18, disabled: 0 },
        { code: 'MTO-FX', name: '分离单元', points: 1620, shelved: 12, disabled: 0 },
        { code: 'MTO-JH', name: '精制单元', points: 980, shelved: 9, disabled: 0 }
      ] },
      { code: 'BD', name: 'BD 装置', units: [
        { code: 'BD-GY', name: '反应单元', points: 1880, shelved: 16, disabled: 0 },
        { code: 'BD-TQ', name: '提纯单元', points: 930, shelved: 10, disabled: 0 },
        { code: 'BD-GDS', name: '罐区单元', points: 610, shelved: 8, disabled: 0 }
      ] },
      { code: 'OPU', name: 'OPU 装置', units: [
        { code: 'OPU-GY', name: '反应单元', points: 1750, shelved: 14, disabled: 0 },
        { code: 'OPU-HS', name: '回收单元', points: 870, shelved: 9, disabled: 0 },
        { code: 'OPU-GH', name: '公用单元', points: 540, shelved: 5, disabled: 0 }
      ] },
      { code: 'UT', name: '公用工程', units: [
        { code: '火炬', name: '火炬系统', points: 320, shelved: 2, disabled: 0 },
        { code: '余热回收锅炉', name: '余热锅炉', points: 460, shelved: 2, disabled: 0 },
        { code: '循环水站', name: '循环水', points: 290, shelved: 2, disabled: 0 },
        { code: '空压站', name: '空压站', points: 240, shelved: 1, disabled: 0 },
        { code: '脱盐水站', name: '脱盐水', points: 210, shelved: 1, disabled: 0 },
        { code: '中水回用站', name: '中水回用', points: 180, shelved: 1, disabled: 0 },
        { code: '污水处理站', name: '污水处理', points: 260, shelved: 0, disabled: 0 },
        { code: '变配电所', name: '变配电', points: 300, shelved: 0, disabled: 0 },
        { code: '消防水站', name: '消防水', points: 273, shelved: 0, disabled: 0 }
      ] }
    ]
  };

  /* ISA 18.2 / EEMUA 191 13 项报警 KPI（目标阈值内嵌，与实测页一致） */
  var ISA_KPI = [
    { key: 'hourAvg', label: '小时报警均值', cat: 'count', unit: '次/时', value: 88, target: 6, ops: 'max', dec: 0, delta: '-2.2%', note: '全天 2112 条 / 24 小时' },
    { key: 'hourPeak', label: '小时报警峰值', cat: 'count', unit: '次/时', value: 397, target: 30, ops: 'max', dec: 0, delta: '+1.8%', note: '12 时峰值 397 条' },
    { key: 'tenAvg', label: '10 分钟报警均值', cat: 'count', unit: '次/10min', value: 15, target: 1, ops: 'max', dec: 0, delta: '-3.1%', note: '10 分钟窗口均值' },
    { key: 'tenPeak', label: '10 分钟报警峰值', cat: 'count', unit: '次/10min', value: 142, target: 10, ops: 'max', dec: 0, delta: '+0.6%', note: '最大 142 条 / 10 分钟' },
    { key: 'hourDisturb', label: '小时报警扰动率', cat: 'pct', unit: '%', value: 69.51, target: 1, ops: 'max', dec: 2, delta: '-1.2%', note: '有报警的小时占比' },
    { key: 'tenDisturb', label: '10 分钟报警扰动率', cat: 'pct', unit: '%', value: 35.58, target: 1, ops: 'max', dec: 2, delta: '+0.4%', note: '有报警的 10 分钟窗口占比' },
    { key: 'flood', label: '报警泛滥次数', cat: 'count', unit: '次', value: 11, target: 1, ops: 'max', dec: 0, delta: '-2 次', note: '10 分钟内 ≥10 条判泛滥' },
    { key: 'floodMin', label: '报警泛滥时长', cat: 'count', unit: 'min', value: 630, target: 10, ops: 'max', dec: 0, delta: '-30 min', note: '累计泛滥 630 分钟' },
    { key: 'floodRatio', label: '报警泛滥比例', cat: 'pct', unit: '%', value: 52.13, target: 1, ops: 'max', dec: 2, delta: '-1.1%', note: '泛滥时间占比' },
    { key: 'top10', label: 'TOP10 报警比例', cat: 'pct', unit: '%', value: 62.07, target: 1, ops: 'max', dec: 2, delta: '-0.3%', note: 'TOP10 位号占报警量' },
    { key: 'chatter', label: '抖动报警', cat: 'count', unit: '次', value: 714, target: 10, ops: 'max', dec: 0, delta: '-18', note: '重复抖动位号报警' },
    { key: 'transient', label: '瞬时报警', cat: 'count', unit: '次', value: 442, target: 1, ops: 'max', dec: 0, delta: '+7', note: '持续时间 <10 秒' },
    { key: 'stale', label: '陈旧报警', cat: 'count', unit: '次', value: 368, target: 5, ops: 'max', dec: 0, delta: '-6', note: '持续 >24 小时未恢复' }
  ];

  /* 六大率（目标为参考目标，非 ISA 18.2 原文阈值） */
  var RATES = [
    { key: 'confirm', label: '确认率', value: 99.77, target: 95, ops: 'min', unit: '%', note: '已确认 / 报警总数' },
    { key: 'onTime', label: '确认及时率', value: 99.77, target: 95, ops: 'min', unit: '%', note: '5 分钟内确认' },
    { key: 'dispose', label: '处置率', value: 93.70, target: 95, ops: 'min', unit: '%', note: '已处置 / 应处置' },
    { key: 'recover', label: '恢复率', value: 98.27, target: 98, ops: 'min', unit: '%', note: '已恢复 / 报警总数' },
    { key: 'ticket', label: '工单处置率', value: 86.08, target: 90, ops: 'min', unit: '%', note: '工单按时闭环率' },
    { key: 'interference', label: '干扰率', value: 42.52, target: 10, ops: 'max', unit: '%', note: '无效 / 重复报警占比' }
  ];

  var PERF8 = [
    { label: '岗位小时报警频率', value: '88 次/时', target: '≤6', ok: false },
    { label: '报警响应及时率', value: '99.77%', target: '≥95%', ok: true },
    { label: '报警及时恢复率', value: '98.27%', target: '≥98%', ok: true },
    { label: '闭环处置及时率', value: '86.08%', target: '≥90%', ok: false },
    { label: '安全联锁投运率', value: '98.42%', target: '≥98%', ok: true },
    { label: '生产联锁投运率', value: '96.28%', target: '≥95%', ok: true },
    { label: '工艺平稳率', value: '92.35%', target: '≥90%', ok: true },
    { label: '工艺合格率', value: '99.12%', target: '≥99%', ok: true }
  ];

  var DEVICE_PERF = [
    { code: '2EH', name: '2EH 装置', alarms: 447, share: 46.7, hourAvg: 41, hourPeak: 186, tenAvg: 7, tenPeak: 65, hourDisturb: 72.4, tenDisturb: 37.1, flood: 5, floodMin: 290, floodRatio: 55.2, top10: 68.4, chatter: 332, transient: 208, stale: 172, confirm: 99.62, onTime: 99.58, dispose: 92.4, recover: 98.1, ticket: 84.2, interference: 46.8, safetyInterlock: 98.6, prodInterlock: 96.15, stability: 90.8, quality: 98.9 },
    { code: 'MTO', name: 'MTO 装置', alarms: 192, share: 20.1, hourAvg: 18, hourPeak: 82, tenAvg: 3, tenPeak: 29, hourDisturb: 68.9, tenDisturb: 34.6, flood: 2, floodMin: 130, floodRatio: 48.6, top10: 60.2, chatter: 160, transient: 96, stale: 80, confirm: 99.88, onTime: 99.86, dispose: 94.6, recover: 98.6, ticket: 87.6, interference: 37.4, safetyInterlock: 98.2, prodInterlock: 95.65, stability: 93.2, quality: 99.3 },
    { code: 'BD', name: 'BD 装置', alarms: 148, share: 15.5, hourAvg: 14, hourPeak: 60, tenAvg: 2, tenPeak: 21, hourDisturb: 70.2, tenDisturb: 36.2, flood: 2, floodMin: 110, floodRatio: 51.3, top10: 57.5, chatter: 110, transient: 70, stale: 60, confirm: 99.81, onTime: 99.79, dispose: 93.1, recover: 98.3, ticket: 86.4, interference: 41.2, safetyInterlock: 98.1, prodInterlock: 97.06, stability: 92.1, quality: 99.1 },
    { code: 'OPU', name: 'OPU 装置', alarms: 125, share: 13.1, hourAvg: 11, hourPeak: 48, tenAvg: 2, tenPeak: 17, hourDisturb: 67.8, tenDisturb: 34.9, flood: 1, floodMin: 60, floodRatio: 49.8, top10: 55.1, chatter: 72, transient: 44, stale: 36, confirm: 99.90, onTime: 99.88, dispose: 94.2, recover: 98.5, ticket: 87.1, interference: 39.8, safetyInterlock: 98.5, prodInterlock: 96.67, stability: 92.6, quality: 99.2 },
    { code: 'UT', name: '公用工程', alarms: 45, share: 4.7, hourAvg: 4, hourPeak: 21, tenAvg: 1, tenPeak: 10, hourDisturb: 61.3, tenDisturb: 30.8, flood: 1, floodMin: 40, floodRatio: 38.4, top10: 41.6, chatter: 40, transient: 24, stale: 20, confirm: 99.74, onTime: 99.70, dispose: 95.1, recover: 98.7, ticket: 89.3, interference: 36.5, safetyInterlock: 98.9, prodInterlock: 96.15, stability: 94.3, quality: 99.4 }
  ];

  var PERIODS = {
    '日': { count: 0.92, delta: { hourDisturb: 3.2, tenDisturb: 1.8, floodRatio: 2.6, top10: 1.9, confirm: -0.05, onTime: -0.05, dispose: -0.7, recover: -0.12, ticket: -1.1, interference: 1.8 } },
    '周': { count: 0.99, delta: { hourDisturb: 0.7, tenDisturb: 0.4, floodRatio: 0.5, top10: 0.3, confirm: -0.01, onTime: -0.01, dispose: -0.15, recover: -0.03, ticket: -0.25, interference: 0.4 } },
    '月': { count: 1, delta: { hourDisturb: 0, tenDisturb: 0, floodRatio: 0, top10: 0, confirm: 0, onTime: 0, dispose: 0, recover: 0, ticket: 0, interference: 0 } },
    '年': { count: 0.97, delta: { hourDisturb: -1.6, tenDisturb: -0.9, floodRatio: -1.4, top10: -1.2, confirm: 0.02, onTime: 0.02, dispose: 0.1, recover: 0.04, ticket: 0.3, interference: -0.6 } }
  };

  /* 当前 957 条报警的级别 × 状态交叉分类（各维合计与驾驶舱一致） */
  var CURRENT_COMBOS = [
    { priority: '紧急', status: '未确认', count: 178 }, { priority: '紧急', status: '已确认', count: 120 }, { priority: '紧急', status: '处置中', count: 42 }, { priority: '紧急', status: '搁置', count: 10 }, { priority: '紧急', status: '已处置', count: 7 },
    { priority: '重要', status: '未确认', count: 63 }, { priority: '重要', status: '已确认', count: 70 }, { priority: '重要', status: '处置中', count: 32 }, { priority: '重要', status: '搁置', count: 10 }, { priority: '重要', status: '已处置', count: 5 },
    { priority: '一般', status: '未确认', count: 36 }, { priority: '一般', status: '已确认', count: 238 }, { priority: '一般', status: '处置中', count: 106 }, { priority: '一般', status: '搁置', count: 12 }, { priority: '一般', status: '已处置', count: 28 }
  ];

  var CURRENT_TYPES = [
    { label: '过程', value: 640, color: '#1466E8' },
    { label: '设备', value: 210, color: '#0EA5E9' },
    { label: '安全', value: 107, color: '#D97706' }
  ];

  var CONFIG_CHANGES = [
    { time: '10-27 19:23', user: '赵工', target: 'MTO-PIC-2102', action: '修改死区', detail: '0.02 → 0.03 MPa', approval: '待审批' },
    { time: '10-27 19:20', user: '陈工', target: 'OPU-FIC-4302', action: '报警停用', detail: '仪表检修停用 2 小时', approval: '已生效' },
    { time: '10-27 18:40', user: '赵工', target: 'MTO-FIC-2201', action: '修改死区', detail: '0.8 → 1.0 t/h', approval: '待审批' },
    { time: '10-27 15:10', user: '李工', target: '2EH-TIC-1203', action: '修改延时', detail: '3 s → 8 s', approval: '待审批' },
    { time: '10-27 11:42', user: '王工', target: 'BD-FIC-3405', action: '调整级别', detail: '重要 → 一般', approval: '待审批' },
    { time: '10-26 16:35', user: '张平', target: 'FLR-PIC-5101', action: '修改阈值', detail: '0.045 → 0.05 MPa', approval: '已生效' },
    { time: '10-26 09:18', user: '赵工', target: 'HRSG-TIC-6101', action: '恢复投用', detail: '检修结束恢复使能', approval: '已生效' },
    { time: '10-25 14:02', user: '陈工', target: 'CWS-PIC-7101', action: '搁置报警', detail: '循环水检修搁置 24 小时', approval: '已生效' }
  ];

  var CONFIGS = [
    { id: 'CFG-2EH-001', tag: '2EH-TIC-1203', name: '反应器出口温度', device: '2EH', unit: '2EH-GY', priority: '紧急', threshold: '≥118.0 ℃', deadband: '0.8 ℃', delay: '8 s', enabled: '启用', shelved: '否', changed: '10-27 15:10', changer: '李工', approval: '待审批' },
    { id: 'CFG-2EH-002', tag: '2EH-PIC-1108', name: '反应器压力', device: '2EH', unit: '2EH-GY', priority: '重要', threshold: '≥3.20 MPa', deadband: '0.02 MPa', delay: '3 s', enabled: '启用', shelved: '否', changed: '10-18 09:20', changer: '赵工', approval: '已生效' },
    { id: 'CFG-MTO-001', tag: 'MTO-FIC-2201', name: '甲醇进料流量', device: 'MTO', unit: 'MTO-GY', priority: '重要', threshold: '≤180.0 t/h', deadband: '1.0 t/h', delay: '5 s', enabled: '启用', shelved: '否', changed: '10-27 18:40', changer: '赵工', approval: '待审批' },
    { id: 'CFG-BD-001', tag: 'BD-LIC-3302', name: '回流罐液位', device: 'BD', unit: 'BD-GY', priority: '紧急', threshold: '≥55.0 %', deadband: '1.5 %', delay: '2 s', enabled: '启用', shelved: '否', changed: '10-12 14:05', changer: '王工', approval: '已生效' },
    { id: 'CFG-OPU-001', tag: 'OPU-TIC-4101', name: '塔顶温度', device: 'OPU', unit: 'OPU-GY', priority: '一般', threshold: '≤78.0 ℃', deadband: '1.0 ℃', delay: '5 s', enabled: '启用', shelved: '否', changed: '10-09 10:30', changer: '陈工', approval: '已生效' },
    { id: 'CFG-2EH-003', tag: '2EH-AIC-1301', name: '尾气氧含量', device: '2EH', unit: '2EH-GY', priority: '紧急', threshold: '≥6.0 %', deadband: '0.3 %', delay: '1 s', enabled: '启用', shelved: '否', changed: '09-28 16:12', changer: '张平', approval: '已生效' },
    { id: 'CFG-MTO-002', tag: 'MTO-PIC-2102', name: '再生器压力', device: 'MTO', unit: 'MTO-GY', priority: '重要', threshold: '≥0.28 MPa', deadband: '0.03 MPa', delay: '3 s', enabled: '启用', shelved: '否', changed: '10-27 19:23', changer: '赵工', approval: '待审批' },
    { id: 'CFG-BD-002', tag: 'BD-FIC-3405', name: '溶剂流量', device: 'BD', unit: 'BD-GY', priority: '一般', threshold: '≤28.0 t/h', deadband: '0.8 t/h', delay: '5 s', enabled: '启用', shelved: '否', changed: '10-27 11:42', changer: '王工', approval: '待审批' },
    { id: 'CFG-OPU-002', tag: 'OPU-LIC-4203', name: '产品罐液位', device: 'OPU', unit: 'OPU-GY', priority: '重要', threshold: '≥80.0 %', deadband: '1.2 %', delay: '3 s', enabled: '启用', shelved: '否', changed: '10-15 08:50', changer: '李工', approval: '已生效' },
    { id: 'CFG-UT-001', tag: 'FLR-PIC-5101', name: '火炬总管压力', device: 'UT', unit: '火炬', priority: '紧急', threshold: '≥0.050 MPa', deadband: '0.002 MPa', delay: '1 s', enabled: '启用', shelved: '否', changed: '10-26 16:35', changer: '张平', approval: '已生效' },
    { id: 'CFG-2EH-004', tag: '2EH-FIC-1201', name: '乙烯进料流量', device: '2EH', unit: '2EH-GY', priority: '重要', threshold: '≤42.0 t/h', deadband: '0.6 t/h', delay: '5 s', enabled: '启用', shelved: '否', changed: '10-11 13:22', changer: '李工', approval: '已生效' },
    { id: 'CFG-2EH-005', tag: '2EH-LIC-1102', name: '缓冲罐液位', device: '2EH', unit: '2EH-GY', priority: '一般', threshold: '≤45.0 %', deadband: '1.0 %', delay: '5 s', enabled: '启用', shelved: '否', changed: '10-06 09:15', changer: '赵工', approval: '已生效' },
    { id: 'CFG-2EH-006', tag: '2EH-TIC-1402', name: '换热器出口温度', device: '2EH', unit: '2EH-GY', priority: '一般', threshold: '≤95.0 ℃', deadband: '1.2 ℃', delay: '5 s', enabled: '启用', shelved: '否', changed: '09-30 17:40', changer: '张平', approval: '已生效' },
    { id: 'CFG-MTO-003', tag: 'MTO-TIC-2204', name: '反应温度', device: 'MTO', unit: 'MTO-GY', priority: '紧急', threshold: '≥485.0 ℃', deadband: '2.0 ℃', delay: '1 s', enabled: '启用', shelved: '否', changed: '10-02 11:08', changer: '李工', approval: '已生效' },
    { id: 'CFG-OPU-003', tag: 'OPU-FIC-4302', name: '回流流量', device: 'OPU', unit: 'OPU-GY', priority: '重要', threshold: '≤56.0 t/h', deadband: '1.0 t/h', delay: '3 s', enabled: '停用', shelved: '否', changed: '10-27 19:20', changer: '陈工', approval: '已生效' },
    { id: 'CFG-UT-002', tag: 'HRSG-TIC-6101', name: '锅炉出口温度', device: 'UT', unit: '余热回收锅炉', priority: '重要', threshold: '≥245.0 ℃', deadband: '1.5 ℃', delay: '3 s', enabled: '启用', shelved: '否', changed: '10-26 09:18', changer: '赵工', approval: '已生效' },
    { id: 'CFG-BD-003', tag: 'BD-AIC-3601', name: '尾气可燃气体', device: 'BD', unit: 'BD-GY', priority: '紧急', threshold: '≥20.0 %LEL', deadband: '1.0 %LEL', delay: '1 s', enabled: '启用', shelved: '否', changed: '10-04 15:26', changer: '王工', approval: '已生效' },
    { id: 'CFG-UT-003', tag: 'CWS-PIC-7101', name: '循环水供水压力', device: 'UT', unit: '循环水站', priority: '一般', threshold: '≤0.42 MPa', deadband: '0.01 MPa', delay: '5 s', enabled: '启用', shelved: '是', changed: '10-25 14:02', changer: '陈工', approval: '已生效' }
  ];

  /* ---------- 生成器：历史报警 / 联锁 / 自控 ---------- */
  var ANCHOR_MS = new Date(2026, 9, 27, 19, 32, 18).getTime();
  var TODAY_START = new Date(2026, 9, 27, 0, 0, 0).getTime();
  var seed = 20261027;
  function rnd() { seed = (seed * 1103515245 + 12345) % 2147483648; return seed / 2147483648; }
  function shuffle(a) {
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(rnd() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function repeatSeq(counts) {
    var out = [];
    for (var i = 0; i < counts.length; i++) {
      for (var k = 0; k < counts[i]; k++) { out.push(i); }
    }
    return shuffle(out);
  }
  function pad3(n) { return ('00' + n).slice(-3); }
  function pad4(n) { return ('0000' + n).slice(-4); }
  function fmtTime(ms) {
    var d = new Date(ms);
    return pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes());
  }
  function fmtFull(ms) {
    var d = new Date(ms);
    return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) + ' ' + pad(d.getHours()) + ':' + pad(d.getMinutes()) + ':' + pad(d.getSeconds());
  }
  function fmtDay(ms) {
    var d = new Date(ms);
    return pad(d.getMonth() + 1) + '-' + pad(d.getDate());
  }

  var PRIO_NAMES = ['紧急', '重要', '一般'];
  var STATUS_NAMES = ['未确认', '已确认', '处置中', '搁置', '已处置'];
  var PEOPLE = ['张平', '李工', '王工', '赵工', '陈工', '刘工', '周工'];

  var PREV_DAY = [90, 86, 84, 82, 80, 84, 92, 102, 112, 120, 128, 126, 140, 140, 130, 120, 118, 104, 96, 56];
  var BINS = [];
  var hh;
  for (hh = 0; hh < 20; hh++) { BINS.push({ day: -1, hour: hh, count: PREV_DAY[hh] }); }
  for (hh = 20; hh < 24; hh++) { BINS.push({ day: -1, hour: hh, count: TREND[hh] }); }
  for (hh = 0; hh < 20; hh++) { BINS.push({ day: 0, hour: hh, count: TREND[hh] }); }

  var TIMES = [];
  for (var bi = 0; bi < BINS.length; bi++) {
    var bin = BINS[bi];
    var dayStart = new Date(2026, 9, 27 + bin.day, 0, 0, 0).getTime();
    for (var bk = 0; bk < bin.count; bk++) {
      var tt;
      if (bin.day === 0 && bin.hour === 19) {
        tt = dayStart + 19 * 3600000 + Math.floor(rnd() * 32 * 60000) + Math.floor(rnd() * 60) * 1000;
      } else {
        tt = dayStart + bin.hour * 3600000 + Math.floor(rnd() * 3600000);
      }
      if (tt > ANCHOR_MS) { tt = ANCHOR_MS - Math.floor(rnd() * 120000); }
      TIMES.push(tt);
    }
  }
  TIMES.sort(function (a, b) { return b - a; });

  var TAG_COUNTS = [439, 386, 325, 290, 255, 237, 211, 184, 167, 114];
  var TAG_REST = 4202 - 2608;
  var TAG_REST_N = TAGS.length - 10;
  for (var tj = 10; tj < TAGS.length; tj++) {
    TAG_COUNTS[tj] = Math.floor(TAG_REST / TAG_REST_N) + ((tj - 10) < (TAG_REST % TAG_REST_N) ? 1 : 0);
  }
  var TAG_SEQ = repeatSeq(TAG_COUNTS);
  var PRIO_SEQ = repeatSeq([634, 1048, 2520]);
  var STATUS_SEQ = repeatSeq([277, 428, 180, 32, 3285]);

  var HISTORY = [];
  for (var ri = 0; ri < 4202; ri++) {
    var tg = TAGS[TAG_SEQ[ri]];
    var priority = PRIO_NAMES[PRIO_SEQ[ri]];
    var status = STATUS_NAMES[STATUS_SEQ[ri]];
    var alarmMs = TIMES[ri];
    var age = Math.round((ANCHOR_MS - alarmMs) / 60000);
    var high = tg.dir === 'high';
    var maxState = high ? (rnd() < 0.3 ? '高高报' : '高报') : (rnd() < 0.3 ? '低低报' : '低报');
    var ratio = 0.01 + rnd() * 0.12;
    var value = high ? tg.threshold * (1 + ratio) : tg.threshold * (1 - ratio);
    if (value < 0) { value = 0; }
    var ackStatus = status === '未确认' ? '未确认' : '已确认';
    var delay = null;
    var ackMs = null;
    if (ackStatus === '已确认') {
      delay = 1 + Math.floor(rnd() * 5);
      if (delay > age) { delay = Math.max(1, age - 1); }
      ackMs = alarmMs + delay * 60000;
      if (ackMs > ANCHOR_MS) { ackMs = ANCHOR_MS; }
    }
    var duration = null;
    var recoverMs = null;
    if (status === '已处置') {
      duration = 8 + Math.floor(rnd() * 105);
      if (duration > age) { duration = age; }
      recoverMs = alarmMs + duration * 60000;
      if (recoverMs > ANCHOR_MS) { recoverMs = ANCHOR_MS; }
    }
    var rec = {
      id: '', idDate: '2026' + fmtDay(alarmMs).replace('-', ''), date: fmtDay(alarmMs), device: tg.device, unit: tg.unit,
      tag: tg.tag, name: tg.name, threshold: tg.threshold, dec: tg.dec, uom: tg.uom,
      thresholdText: (high ? '≥' : '≤') + tg.threshold.toFixed(tg.dec),
      value: value, valueText: value.toFixed(tg.dec),
      content: tg.name + maxState, maxState: maxState,
      priority: priority, type: tg.type,
      alarmMs: alarmMs, timeText: fmtTime(alarmMs),
      ackMs: ackMs, ackTimeText: ackMs ? fmtTime(ackMs) : '—',
      recoverMs: recoverMs, recoverTimeText: recoverMs ? fmtTime(recoverMs) : '—',
      ackStatus: ackStatus, ackTimeout: '否', recoverTimeout: false,
      delayMin: delay, durationMin: duration, ageMin: age, status: status,
      confirmPerson: ackStatus === '已确认' ? PEOPLE[ri % PEOPLE.length] : '—',
      disposeBy: '', method: '', result: '', workOrder: '', disposeMs: null, disposeTimeText: '—',
      timeoutState: ''
    };
    HISTORY.push(rec);
  }

  var ORDER = [];
  for (var oi = 0; oi < HISTORY.length; oi++) { ORDER.push(oi); }
  shuffle(ORDER);

  var lateCount = 0;
  for (var li = 0; li < ORDER.length && lateCount < 10; li++) {
    var lrec = HISTORY[ORDER[li]];
    if (lrec.status === '未确认') { continue; }
    var lateDelay = 7 + Math.floor(rnd() * 12);
    if (lrec.ageMin < lateDelay + 2) { continue; }
    lrec.delayMin = lateDelay;
    lrec.ackMs = lrec.alarmMs + lateDelay * 60000;
    lrec.ackTimeText = fmtTime(lrec.ackMs);
    lrec.ackTimeout = '是';
    lateCount++;
  }

  var RORDER = ORDER.slice();
  shuffle(RORDER);
  var recoverTimeoutCount = 0;
  for (var rj = 0; rj < RORDER.length && recoverTimeoutCount < 679; rj++) {
    var rrec = HISTORY[RORDER[rj]];
    if (rrec.status === '未确认' || rrec.ackTimeout === '是' || rrec.recoverTimeout) { continue; }
    if (rrec.ageMin < 135) { continue; }
    var maxDur = Math.min(rrec.ageMin, 600);
    var dur2 = 130 + Math.floor(rnd() * (maxDur - 130 + 1));
    if (rrec.status === '已处置') {
      rrec.durationMin = dur2;
      rrec.recoverMs = rrec.alarmMs + dur2 * 60000;
      rrec.recoverTimeText = fmtTime(rrec.recoverMs);
    } else {
      rrec.durationMin = rrec.ageMin;
    }
    rrec.recoverTimeout = true;
    recoverTimeoutCount++;
  }

  var METHOD_POOL = {
    '过程': ['工艺调整', '参数复核', '清洗置换', '现场确认'],
    '设备': ['仪表校验', '设备检修', '参数复核', '现场确认'],
    '安全': ['联锁复位', '现场确认', '工艺调整']
  };
  for (var di = 0; di < HISTORY.length; di++) {
    var drec = HISTORY[di];
    if (drec.ackTimeout === '是' || drec.recoverTimeout) {
      drec.timeoutState = (drec.recoverTimeout && drec.status !== '已处置') ? '待处理' : '已处理';
    }
    if (drec.status !== '已处置' && drec.status !== '处置中') { continue; }
    var pool = METHOD_POOL[drec.type] || METHOD_POOL['过程'];
    drec.method = pool[di % pool.length];
    drec.disposeBy = PEOPLE[(di + 2) % PEOPLE.length];
    drec.workOrder = 'WO-' + drec.idDate + '-' + pad4(di + 1);
    if (drec.status === '已处置') {
      drec.disposeMs = drec.recoverMs;
      drec.result = '已恢复';
    } else {
      drec.disposeMs = drec.ackMs ? drec.ackMs + 30 * 60000 : null;
      if (drec.disposeMs && drec.disposeMs > ANCHOR_MS) { drec.disposeMs = ANCHOR_MS - 120000; }
      if (drec.disposeMs && drec.ackMs && drec.disposeMs < drec.ackMs) { drec.disposeMs = drec.ackMs; }
      drec.result = drec.recoverTimeout ? '未恢复（超时）' : '处置中';
    }
    drec.disposeTimeText = drec.disposeMs ? fmtTime(drec.disposeMs) : '—';
    if (drec.status === '已处置') { drec.timeoutState = drec.ackTimeout === '是' ? '已处理' : drec.timeoutState; }
  }

  for (var idi = 0; idi < HISTORY.length; idi++) {
    HISTORY[idi].id = 'AL-' + HISTORY[idi].idDate + '-' + pad4(idi + 1);
  }

  /* ---------- 联锁清单：188 套，投运 181 套 = 96.28% ---------- */
  var IL_TOTALS = { '2EH': 52, 'MTO': 46, 'BD': 34, 'OPU': 30, 'UT': 26 };
  var IL_OFF = { '2EH': ['旁路', '摘除'], 'MTO': ['旁路', '摘除'], 'BD': ['旁路'], 'OPU': ['旁路'], 'UT': ['未投'] };
  var IL_TEMPLATES = ['反应器超温联锁', '反应器超压联锁', '压缩机跳车联锁', '进料切断联锁', '火炬点火联锁', '锅炉汽包低液位联锁', '循环水泵停泵联锁', '仪表风低压联锁', '罐区高高液位联锁', '精制塔超压联锁', '再生器超温联锁', '污水外排切断联锁'];
  var INTERLOCKS = [];
  FACTORY.devices.forEach(function (dev, deviceIndex) {
    var total = IL_TOTALS[dev.code];
    var offs = IL_OFF[dev.code];
    for (var k = 0; k < total; k++) {
      var unit = dev.units[k % dev.units.length];
      var status = k < total - offs.length ? '投运' : offs[k - (total - offs.length)];
      var type = k % 3 === 0 ? '安全联锁' : '生产联锁';
      var level = type === '安全联锁' ? 'SIS' : (k % 2 === 0 ? 'ESD' : 'DCS');
      var il = {
        id: '', name: IL_TEMPLATES[(k + deviceIndex) % IL_TEMPLATES.length] + '（' + unit.code + '）',
        device: dev.code, deviceName: dev.name, unit: unit.code, unitName: unit.name,
        type: type, level: level, status: status,
        actionCount: (k * 3 + deviceIndex * 2) % 7,
        lastAction: '10-' + pad(1 + ((k * 5 + deviceIndex) % 27)) + ' ' + pad(6 + (k % 12)) + ':' + pad((k * 13) % 60),
        testDate: '2026-0' + (6 + (k % 4)) + '-' + pad(5 + (k % 20)),
        owner: PEOPLE[k % PEOPLE.length],
        reason: ''
      };
      if (status === '旁路') { il.reason = '仪表校验，限时旁路至 10-28 08:00'; }
      else if (status === '摘除') { il.reason = '检修隔离，计划 10-29 恢复'; }
      else if (status === '未投') { il.reason = '新项目联锁，待开车投运'; }
      INTERLOCKS.push(il);
    }
  });
  shuffle(INTERLOCKS);
  var IL_COUNTER = {};
  INTERLOCKS.forEach(function (il) {
    IL_COUNTER[il.device] = (IL_COUNTER[il.device] || 0) + 1;
    il.id = 'IL-' + il.device + '-' + pad3(IL_COUNTER[il.device]);
  });

  /* ---------- 自控回路：939 条，自控 320 条 = 34.08% ---------- */
  var LOOP_TOTALS = { '2EH': 268, 'MTO': 205, 'BD': 172, 'OPU': 152, 'UT': 142 };
  var LOOP_MODES = {
    '2EH': { '自动': 82, '串级': 10, '手动': 156, '远程': 20 },
    'MTO': { '自动': 64, '串级': 8, '手动': 120, '远程': 13 },
    'BD': { '自动': 48, '串级': 7, '手动': 108, '远程': 9 },
    'OPU': { '自动': 40, '串级': 7, '手动': 96, '远程': 9 },
    'UT': { '自动': 46, '串级': 8, '手动': 80, '远程': 8 }
  };
  var LOOP_NAMES = ['反应器出口温度控制', '反应器压力控制', '甲醇进料流量控制', '回流罐液位控制', '塔顶温度控制', '塔顶压力控制', '溶剂流量控制', '产品罐液位控制', '精制塔温度控制', '循环水压力控制', '仪表风压力控制', '污水 COD 控制'];
  var MODE_NAMES = ['自动', '串级', '手动', '远程'];
  var LOOPS = [];
  FACTORY.devices.forEach(function (dev, deviceIndex) {
    var total = LOOP_TOTALS[dev.code];
    var modeCounts = LOOP_MODES[dev.code];
    var modes = [];
    MODE_NAMES.forEach(function (mode) {
      for (var m = 0; m < modeCounts[mode]; m++) { modes.push(mode); }
    });
    shuffle(modes);
    for (var k = 0; k < total; k++) {
      var unit = dev.units[k % dev.units.length];
      var score = 45 + ((k * 7 + deviceIndex * 11) % 55);
      var loopStatus = score >= 80 ? '优良' : (score >= 60 ? '合格' : '劣化');
      var pv = 40 + ((k * 17) % 55) + (k % 10) / 10;
      var sp = pv + ((k % 7) - 3) * 0.4;
      var mv = 35 + ((k * 13) % 60) + (k % 5) / 10;
      LOOPS.push({
        id: 'LOOP-' + pad4(LOOPS.length + 1),
        tag: dev.code + '-' + ['TIC', 'PIC', 'FIC', 'LIC'][k % 4] + '-' + (1000 + deviceIndex * 200 + k),
        name: LOOP_NAMES[(k + deviceIndex) % LOOP_NAMES.length] + '（' + unit.code + '）',
        device: dev.code, deviceName: dev.name, unit: unit.code, unitName: unit.name,
        mode: modes[k], pv: pv, sp: sp, mv: mv, score: score, status: loopStatus,
        lastChange: '10-' + pad(1 + ((k * 3 + deviceIndex) % 27)) + ' ' + pad(7 + (k % 12)) + ':' + pad((k * 11) % 60),
        owner: PEOPLE[(k + 3) % PEOPLE.length],
        suggestion: loopStatus === '劣化' ? '振荡明显，建议重新整定 PID 参数' : (modes[k] === '手动' ? '长期手动，建议评估投自动条件' : '保持当前参数，按月复核')
      });
    }
  });
  shuffle(LOOPS);
  for (var lpi = 0; lpi < LOOPS.length; lpi++) { LOOPS[lpi].id = 'LOOP-' + pad4(lpi + 1); }

  return {
    kpi: KPI,
    priority: PRIORITY,
    units: UNITS,
    trend: TREND,
    alarms: ALARMS,
    topTags: TOP_TAGS,
    auditLogs: AUDIT,
    history: HISTORY,
    factory: FACTORY,
    tags: TAGS,
    isaKpi: ISA_KPI,
    rates: RATES,
    perf8: PERF8,
    devicePerf: DEVICE_PERF,
    periods: PERIODS,
    categoryCurrent: { combos: CURRENT_COMBOS, types: CURRENT_TYPES },
    interlocks: INTERLOCKS,
    loops: LOOPS,
    alarmConfigs: CONFIGS,
    configChanges: CONFIG_CHANGES,
    meta: {
      anchorMs: ANCHOR_MS,
      anchorTime: fmtTime(ANCHOR_MS),
      anchorFull: fmtFull(ANCHOR_MS),
      todayStart: TODAY_START,
      last24Cutoff: new Date(2026, 9, 26, 20, 0, 0).getTime(),
      rangeText: '10-26 00:00 ~ 10-27 19:32',
      total: HISTORY.length,
      lateAck: lateCount,
      recoverTimeout: recoverTimeoutCount
    }
  };
})();
