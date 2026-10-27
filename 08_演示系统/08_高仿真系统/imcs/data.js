window.IMCS_DEMO = {
  kpi: {
    activeOrders: 8, totalOrders: 15, finishedToday: 3, outputToday: 12500,
    planRate: 73.3, devicesRunning: 6, devicesTotal: 8, abnormalOrders: 2
  },
  productionTrend: [
    { label: '3/24', value: 12600, value2: 11200 },
    { label: '3/25', value: 12100, value2: 10800 },
    { label: '3/26', value: 10800, value2: 9800 },
    { label: '3/27', value: 13300, value2: 12100 },
    { label: '3/28', value: 11900, value2: 10900 },
    { label: '3/29', value: 12800, value2: 11700 },
    { label: '3/30', value: 9500, value2: 8600 }
  ],
  qualityTrend: [99.1, 98.5, 99.3, 97.8, 98.9, 99.5, 98.2],
  qualityLabels: ['3/24', '3/25', '3/26', '3/27', '3/28', '3/29', '3/30'],
  orderStatus: [
    { label: '执行中', value: 8, color: '#1466E8' },
    { label: '已完成', value: 3, color: '#0B9A78' },
    { label: '待接单', value: 2, color: '#D97706' },
    { label: '异常', value: 2, color: '#DC2626' }
  ],
  orders: [
    { id: 'WO-2026-0301', product: 'BIT 粗品', line: '一车间', qty: 2500, unit: 'kg', status: '执行中', progress: 62, due: '10-28 12:00', priority: '高', owner: '张工' },
    { id: 'WO-2026-0302', product: 'BIT 精品', line: '一车间', qty: 1800, unit: 'kg', status: '已完成', progress: 100, due: '10-27 16:00', priority: '中', owner: '李工' },
    { id: 'WO-2026-0303', product: 'MTBA 粗品', line: '二车间', qty: 3200, unit: 'kg', status: '异常', progress: 38, due: '10-27 18:00', priority: '高', owner: '王工' },
    { id: 'WO-2026-0304', product: 'BBIT 精品', line: '二车间', qty: 1200, unit: 'kg', status: '执行中', progress: 71, due: '10-28 10:00', priority: '中', owner: '赵工' },
    { id: 'WO-2026-0305', product: 'BIT 粗品', line: '一车间', qty: 2600, unit: 'kg', status: '待接单', progress: 0, due: '10-29 09:00', priority: '低', owner: '待分配' },
    { id: 'WO-2026-0306', product: '低湿品', line: '二车间', qty: 900, unit: 'kg', status: '执行中', progress: 44, due: '10-28 15:00', priority: '中', owner: '陈工' },
    { id: 'WO-2026-0307', product: 'BIT 精品', line: '一车间', qty: 1500, unit: 'kg', status: '已完成', progress: 100, due: '10-27 11:00', priority: '中', owner: '李工' },
    { id: 'WO-2026-0308', product: 'MTBA 精品', line: '二车间', qty: 2100, unit: 'kg', status: '执行中', progress: 56, due: '10-28 17:00', priority: '高', owner: '王工' },
    { id: 'WO-2026-0309', product: 'BBIT 粗品', line: '一车间', qty: 2800, unit: 'kg', status: '执行中', progress: 33, due: '10-29 12:00', priority: '中', owner: '赵工' },
    { id: 'WO-2026-0310', product: 'BIT 粗品', line: '二车间', qty: 2400, unit: 'kg', status: '异常', progress: 22, due: '10-27 20:00', priority: '高', owner: '张工' },
    { id: 'WO-2026-0311', product: '解析料', line: '一车间', qty: 900, unit: 'kg', status: '待接单', progress: 0, due: '10-30 09:00', priority: '低', owner: '待分配' },
    { id: 'WO-2026-0312', product: 'BIT 精品', line: '二车间', qty: 1700, unit: 'kg', status: '执行中', progress: 81, due: '10-28 09:00', priority: '中', owner: '陈工' },
    { id: 'WO-2026-0313', product: 'MTBA 粗品', line: '一车间', qty: 3000, unit: 'kg', status: '已完成', progress: 100, due: '10-26 18:00', priority: '中', owner: '李工' },
    { id: 'WO-2026-0314', product: '低湿品', line: '一车间', qty: 800, unit: 'kg', status: '执行中', progress: 49, due: '10-29 10:00', priority: '低', owner: '赵工' },
    { id: 'WO-2026-0315', product: 'BBIT 精品', line: '二车间', qty: 1300, unit: 'kg', status: '执行中', progress: 67, due: '10-28 14:00', priority: '中', owner: '王工' }
  ],
  batches: [
    { id: 'B20261027-01', order: 'WO-2026-0301', product: 'BIT 粗品', line: '一车间', start: '10-27 06:20', progress: 62, status: '执行中', quality: '待检' },
    { id: 'B20261027-02', order: 'WO-2026-0303', product: 'MTBA 粗品', line: '二车间', start: '10-27 05:40', progress: 38, status: '异常', quality: '待检' },
    { id: 'B20261027-03', order: 'WO-2026-0304', product: 'BBIT 精品', line: '二车间', start: '10-27 07:10', progress: 71, status: '执行中', quality: '中控合格' },
    { id: 'B20261027-04', order: 'WO-2026-0306', product: '低湿品', line: '二车间', start: '10-27 08:00', progress: 44, status: '执行中', quality: '待检' },
    { id: 'B20261026-08', order: 'WO-2026-0302', product: 'BIT 精品', line: '一车间', start: '10-26 14:00', progress: 100, status: '已完成', quality: '合格' },
    { id: 'B20261026-09', order: 'WO-2026-0307', product: 'BIT 精品', line: '一车间', start: '10-26 19:20', progress: 100, status: '已完成', quality: '合格' },
    { id: 'B20261027-05', order: 'WO-2026-0308', product: 'MTBA 精品', line: '二车间', start: '10-27 09:15', progress: 56, status: '执行中', quality: '待检' },
    { id: 'B20261027-06', order: 'WO-2026-0312', product: 'BIT 精品', line: '二车间', start: '10-27 04:30', progress: 81, status: '执行中', quality: '中控合格' }
  ],
  materials: [
    { name: '催化剂 CA-003', code: 'CA-003', stock: 12, safety: 20, unit: 'kg', status: '低库存', days: 0.8 },
    { name: '溶剂 B SB-005', code: 'SB-005', stock: 80, safety: 100, unit: 'L', status: '低库存', days: 2.1 },
    { name: '甲醇 MA-001', code: 'MA-001', stock: 800, safety: 300, unit: 'kg', status: '正常', days: 5.4 },
    { name: '去离子水 DW-001', code: 'DW-001', stock: 2000, safety: 500, unit: 'L', status: '正常', days: 8.2 },
    { name: '包装桶 PK-010', code: 'PK-010', stock: 120, safety: 50, unit: '个', status: '正常', days: 4.0 },
    { name: 'BIT 粗品 BP-002', code: 'BP-002', stock: 640, safety: 200, unit: 'kg', status: '正常', days: 3.2 },
    { name: '碱液 AL-007', code: 'AL-007', stock: 45, safety: 80, unit: 'L', status: '低库存', days: 1.1 },
    { name: '活性炭 AC-012', code: 'AC-012', stock: 260, safety: 120, unit: 'kg', status: '正常', days: 6.7 }
  ],
  inspections: [
    { id: 'QC-20261027-018', batch: 'B20261026-08', item: '纯度', value: '99.6%', standard: '≥99.0%', result: '合格', time: '10-27 08:12' },
    { id: 'QC-20261027-017', batch: 'B20261026-09', item: '水分', value: '0.18%', standard: '≤0.30%', result: '合格', time: '10-27 08:05' },
    { id: 'QC-20261027-016', batch: 'B20261027-03', item: '中控 pH', value: '6.8', standard: '6.5–7.2', result: '合格', time: '10-27 07:50' },
    { id: 'QC-20261027-015', batch: 'B20261027-02', item: '中控温度', value: '96.2℃', standard: '≤95.0℃', result: '不合格', time: '10-27 07:31' },
    { id: 'QC-20261027-014', batch: 'B20261027-01', item: '中控 pH', value: '6.4', standard: '6.5–7.2', result: '不合格', time: '10-27 07:12' },
    { id: 'QC-20261027-013', batch: 'B20261027-05', item: '中控黏度', value: '128 mPa·s', standard: '100–150', result: '合格', time: '10-27 06:58' },
    { id: 'QC-20261027-012', batch: 'B20261027-06', item: '纯度', value: '98.9%', standard: '≥99.0%', result: '不合格', time: '10-27 06:42' },
    { id: 'QC-20261027-011', batch: 'B20261027-04', item: '中控 pH', value: '6.9', standard: '6.5–7.2', result: '合格', time: '10-27 06:20' }
  ],
  devices: [
    { name: '反应釜 R-101', line: '一车间', status: '运行', oee: 86.2, temp: 92.4 },
    { name: '反应釜 R-102', line: '一车间', status: '运行', oee: 81.7, temp: 88.1 },
    { name: '反应釜 R-201', line: '二车间', status: '运行', oee: 78.5, temp: 90.6 },
    { name: '反应釜 R-202', line: '二车间', status: '待机', oee: 0, temp: 42.3 },
    { name: '离心机 C-101', line: '一车间', status: '运行', oee: 74.8, temp: 38.2 },
    { name: '干燥机 D-101', line: '一车间', status: '运行', oee: 69.4, temp: 105.7 },
    { name: '包装线 P-101', line: '二车间', status: '运行', oee: 72.1, temp: 31.5 },
    { name: '尾气处理 T-101', line: '公用', status: '运行', oee: 91.3, temp: 46.8 }
  ],
  zones: [
    { code: 'GQ1', name: '罐区', sort: 1, status: '启用', createdAt: '2026-09-17 10:36:26', remark: '甲醇 / 甲苯原料罐区' },
    { code: 'CJ1', name: '一车间', sort: 2, status: '启用', createdAt: '2026-09-17 10:36:42', remark: 'BIT 粗品 / 母液' },
    { code: 'CJ2', name: '二车间', sort: 3, status: '启用', createdAt: '2026-09-24 15:57:35', remark: '中间罐 / 碱液' },
    { code: 'CJ3', name: '三车间', sort: 4, status: '启用', createdAt: '2026-09-24 15:58:38', remark: '成品罐' },
    { code: 'CJ4', name: '三废车间', sort: 5, status: '启用', createdAt: '2026-09-24 15:59:13', remark: '废水 / 废液' }
  ],
  tanks: [
    { code: 'T-101', name: '甲醇原料罐', zone: 'GQ1', material: '甲醇', capacity: 200, level: 68, temp: 28.4, pressure: 0.12, status: '正常' },
    { code: 'T-102', name: '甲苯原料罐', zone: 'GQ1', material: '甲苯', capacity: 150, level: 45, temp: 26.8, pressure: 0.10, status: '正常' },
    { code: 'T-201', name: 'BIT 粗品罐', zone: 'CJ1', material: 'BIT 粗品', capacity: 120, level: 82, temp: 42.1, pressure: 0.08, status: '高液位' },
    { code: 'T-202', name: '母液罐', zone: 'CJ1', material: '母液', capacity: 100, level: 31, temp: 35.2, pressure: 0.06, status: '正常' },
    { code: 'T-203', name: '中间罐', zone: 'CJ2', material: 'BBIT 中间体', capacity: 80, level: 88, temp: 38.6, pressure: 0.09, status: '高液位' },
    { code: 'T-204', name: '碱液罐', zone: 'CJ2', material: '碱液', capacity: 60, level: 22, temp: 30.1, pressure: 0.07, status: '低液位' },
    { code: 'T-301', name: '成品罐', zone: 'CJ3', material: 'BIT 精品', capacity: 100, level: 56, temp: 32.4, pressure: 0.05, status: '正常' },
    { code: 'T-401', name: '废水罐', zone: 'CJ4', material: '工艺废水', capacity: 180, level: 74, temp: 29.8, pressure: 0.04, status: '正常' }
  ],
  ebrRecords: [
    { batch: 'LX-BIT-2610137A1', product: 'BIT', workOrder: 'BIT-2610137', recipe: 'BIT_01', output: 850.20, yield: 118.35, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 19:15' },
    { batch: 'LX-BIT-2610137A2', product: 'BIT', workOrder: 'BIT-2610137', recipe: 'BIT_01', output: 713.60, yield: 99.33, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 19:15' },
    { batch: 'LX-BIT-2610135B1', product: 'BIT', workOrder: 'BIT-2610135', recipe: 'BIT_01', output: 658.80, yield: 91.70, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 18:35' },
    { batch: 'LX-BIT-2610135B2', product: 'BIT', workOrder: 'BIT-2610135', recipe: 'BIT_01', output: 765.60, yield: 106.57, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 18:35' },
    { batch: 'LX-BIT-2610134A2', product: 'BIT', workOrder: 'BIT-2610134', recipe: 'BIT_01', output: 699.80, yield: 97.41, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 15:45' },
    { batch: 'LX-BIT-2610134A1', product: 'BIT', workOrder: 'BIT-2610134', recipe: 'BIT_01', output: 789.00, yield: 109.83, audit: '未审核', auditor: '-', auditTime: '-', endTime: '2026-10-27 15:45' },
    { batch: 'LX-BIT-2610135A2', product: 'BIT', workOrder: 'BIT-2610135', recipe: 'BIT_01', output: 700.00, yield: 97.44, audit: '已通过', auditor: '殷世如', auditTime: '2026-10-27 15:27', endTime: '2026-10-27 14:46' },
    { batch: 'LX-BIT-2610135A1', product: 'BIT', workOrder: 'BIT-2610135', recipe: 'BIT_01', output: 732.20, yield: 101.92, audit: '已通过', auditor: '殷世如', auditTime: '2026-10-27 15:28', endTime: '2026-10-27 14:46' },
    { batch: 'LX-BIT-2610133A1', product: 'BIT', workOrder: 'BIT-2610133', recipe: 'BIT_01', output: 718.20, yield: 99.97, audit: '已通过', auditor: '殷世如', auditTime: '2026-10-27 15:28', endTime: '2026-10-27 13:11' },
    { batch: 'LX-BIT-2610133A2', product: 'BIT', workOrder: 'BIT-2610133', recipe: 'BIT_01', output: 675.20, yield: 93.99, audit: '已通过', auditor: '殷世如', auditTime: '2026-10-27 15:28', endTime: '2026-10-27 13:10' },
    { batch: 'LX-BBTT-2610132A1', product: 'BBIT', workOrder: 'BBIT-2610132', recipe: 'BBIT_02', output: 512.40, yield: 96.85, audit: '已通过', auditor: '殷世如', auditTime: '2026-10-27 12:10', endTime: '2026-10-27 10:40' },
    { batch: 'LX-BBTT-2610132A2', product: 'BBIT', workOrder: 'BBIT-2610132', recipe: 'BBIT_02', output: 488.60, yield: 92.30, audit: '已驳回', auditor: '殷世如', auditTime: '2026-10-27 12:12', endTime: '2026-10-27 10:40' }
  ]
};
