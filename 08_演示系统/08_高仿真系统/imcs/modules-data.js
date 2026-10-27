window.IMCS_MODULES = {
  monitor: {
    title: '某精细化工调度监控系统',
    tabs: ['公用工程', '关键工艺', '罐区', '氯化釜通氯', '岗位人员', '电表', 'BBIT/MBIT'],
    data: {
      '公用工程': [
        { title: '蒸汽进厂 / 减压 / 流量', tags: ['蒸汽进厂 0.92 MPa', '蒸汽减压 0.60 MPa', '蒸汽流量 12.6 t/h'], series: [{ name: '蒸汽进厂', color: '#22D3EE', base: 72, amp: 4 }, { name: '蒸汽减压', color: '#34D399', base: 52, amp: 3 }, { name: '蒸汽流量', color: '#FBBF24', base: 34, amp: 7 }] },
        { title: '自来水总管 / 上日累计', tags: ['自来水总管 0.30 MPa', '上日累计 1,284 t', '本月累计 28,460 t'], series: [{ name: '总管压力', color: '#22D3EE', base: 62, amp: 3 }, { name: '日累计', color: '#A78BFA', base: 40, amp: 5 }] },
        { title: '冷冻水 / 冰水', tags: ['冷冻水 -0.2 ℃', '冰水 2.6 ℃', '冷冻水压力 0.47 MPa'], series: [{ name: '冷冻水', color: '#22D3EE', base: 58, amp: 5 }, { name: '冰水', color: '#34D399', base: 42, amp: 4 }] },
        { title: '循环水 / 废水', tags: ['循环水 25.5 ℃', '废水 25.7 ℃', '循环水压力 0.50 MPa'], series: [{ name: '循环水', color: '#22D3EE', base: 64, amp: 3 }, { name: '废水', color: '#FBBF24', base: 48, amp: 4 }] },
        { title: '压缩空气 / 仪表空气 / 氮气', tags: ['压缩空气 0.68 MPa', '仪表空气 0.63 MPa', '氮气 0.45 MPa'], series: [{ name: '压缩空气', color: '#22D3EE', base: 70, amp: 2 }, { name: '仪表空气', color: '#34D399', base: 58, amp: 2 }, { name: '氮气', color: '#FBBF24', base: 46, amp: 3 }] },
        { title: '热水 / 精馏水', tags: ['热水 72.2 ℃', '精馏水 24.9 ℃', '热水压力 0.78 MPa'], series: [{ name: '热水', color: '#F87171', base: 76, amp: 4 }, { name: '精馏水', color: '#34D399', base: 52, amp: 3 }] }
      ],
      '关键工艺': [
        { title: '氯甲烷流量、含量', tags: ['氯甲烷产量流量 78.9 m³', '二车间尾气含氯 0.1%', '压缩机进气含氯 0.1%'], series: [{ name: '氯甲烷流量', color: '#3B82F6', base: 32, amp: 28 }, { name: '尾气含氯', color: '#FBBF24', base: 4, amp: 1 }, { name: '进气含氯', color: '#34D399', base: 6, amp: 1 }] },
        { title: '气柜高度', tags: ['气柜液位 A 3700 mm', '气柜液位 B 3682 mm', '气柜差压 0.42 kPa'], series: [{ name: '气柜 A', color: '#22D3EE', base: 54, amp: 2 }, { name: '气柜 B', color: '#34D399', base: 52, amp: 2 }] },
        { title: '干燥床', tags: ['干燥床压力 A 22.36 kPa', '干燥床压力 B 24.9 kPa', '循环泵 A 出口 0.85 MPa'], series: [{ name: '干燥床 A', color: '#3B82F6', base: 78, amp: 2 }, { name: '干燥床 B', color: '#22D3EE', base: 74, amp: 2 }, { name: '循环泵', color: '#FBBF24', base: 54, amp: 5 }] },
        { title: '变压吸附', tags: ['变压吸附进气流量 48.3 m³', '净化气流量 4.3 m³', '吸附周期 120 s'], series: [{ name: '进气', color: '#22D3EE', base: 82, amp: 3 }, { name: '净化气', color: '#34D399', base: 30, amp: 4 }] },
        { title: '压缩机', tags: ['氯甲烷压缩机变频 A 45 Hz', '氯甲烷压缩机变频 B 35.3 Hz', '出口压力 0.62 MPa'], series: [{ name: '压缩机 A', color: '#3B82F6', base: 84, amp: 2 }, { name: '压缩机 B', color: '#34D399', base: 66, amp: 2 }] },
        { title: '罗茨风机', tags: ['气柜后罗茨风机电流 0.7 A', '气柜后罗茨风机 B 8 A', '水洗罗茨风机 14.9 A'], series: [{ name: '风机 A', color: '#F87171', base: 62, amp: 5 }, { name: '风机 B', color: '#34D399', base: 36, amp: 2 }, { name: '水洗风机', color: '#FBBF24', base: 4, amp: 1 }] }
      ],
      '罐区': [
        { title: 'GQ1 罐区液位', tags: ['T-101 72%', 'T-102 64%', 'T-103 58%'], series: [{ name: 'T-101', color: '#22D3EE', base: 72, amp: 3 }, { name: 'T-102', color: '#34D399', base: 64, amp: 2 }, { name: 'T-103', color: '#FBBF24', base: 58, amp: 3 }] },
        { title: 'CJ1 罐区液位', tags: ['T-201 66%', 'T-202 54%', 'T-203 41%'], series: [{ name: 'T-201', color: '#22D3EE', base: 66, amp: 3 }, { name: 'T-202', color: '#34D399', base: 54, amp: 2 }, { name: 'T-203', color: '#FBBF24', base: 41, amp: 4 }] },
        { title: '罐区温度', tags: ['T-101 28.4 ℃', 'T-201 31.2 ℃', 'T-301 26.8 ℃'], series: [{ name: 'T-101', color: '#F87171', base: 48, amp: 2 }, { name: 'T-201', color: '#FBBF24', base: 56, amp: 3 }, { name: 'T-301', color: '#34D399', base: 42, amp: 2 }] },
        { title: '收料/发料流量', tags: ['今日收料 186 t', '今日发料 142 t', '作业中 2 单'], series: [{ name: '收料', color: '#22D3EE', base: 62, amp: 10 }, { name: '发料', color: '#FBBF24', base: 46, amp: 8 }] }
      ],
      '氯化釜通氯': [
        { title: '1# 氯化釜通氯', tags: ['1# 流量 42.5 m³/h', '压力 -0.30 kPa', '温度 65.8 ℃'], series: [{ name: '通氯流量', color: '#22D3EE', base: 58, amp: 4 }, { name: '釜温', color: '#F87171', base: 68, amp: 3 }] },
        { title: '2# 氯化釜通氯', tags: ['2# 流量 39.8 m³/h', '压力 -0.28 kPa', '温度 64.2 ℃'], series: [{ name: '通氯流量', color: '#22D3EE', base: 54, amp: 5 }, { name: '釜温', color: '#F87171', base: 64, amp: 3 }] },
        { title: '3# 氯化釜通氯', tags: ['3# 流量 44.1 m³/h', '压力 -0.32 kPa', '温度 66.4 ℃'], series: [{ name: '通氯流量', color: '#22D3EE', base: 60, amp: 4 }, { name: '釜温', color: '#F87171', base: 70, amp: 3 }] },
        { title: '尾气吸收', tags: ['尾气含氯 0.8 ppm', '碱液 pH 8.6', '吸收塔液位 62%'], series: [{ name: '尾气含氯', color: '#FBBF24', base: 20, amp: 3 }, { name: '碱液 pH', color: '#34D399', base: 58, amp: 2 }] }
      ],
      '岗位人员': [
        { title: '当班人员', tags: ['氯化 4 人', '精制 3 人', '罐区 2 人'], series: [{ name: '氯化', color: '#22D3EE', base: 48, amp: 2 }, { name: '精制', color: '#34D399', base: 36, amp: 1 }, { name: '罐区', color: '#FBBF24', base: 24, amp: 1 }] },
        { title: '定位在线', tags: ['在线 9 人', '离线 0 人', '越界 0 人'], series: [{ name: '在线', color: '#34D399', base: 72, amp: 2 }, { name: '离线', color: '#F87171', base: 4, amp: 1 }] },
        { title: '巡检完成率', tags: ['白班 100%', '夜班 92%', '待巡检 2 点'], series: [{ name: '白班', color: '#22D3EE', base: 84, amp: 2 }, { name: '夜班', color: '#FBBF24', base: 74, amp: 4 }] }
      ],
      '电表': [
        { title: '全厂用电', tags: ['今日 28,640 kWh', '本月 612,480 kWh', '负荷 1,260 kW'], series: [{ name: '今日负荷', color: '#22D3EE', base: 62, amp: 10 }, { name: '昨日同期', color: '#A78BFA', base: 56, amp: 8 }] },
        { title: '氯化车间用电', tags: ['今日 9,420 kWh', '占 32.9%', '峰段 11:00'], series: [{ name: '氯化', color: '#FBBF24', base: 54, amp: 8 }] },
        { title: '精制车间用电', tags: ['今日 7,680 kWh', '占 26.8%', '峰段 14:00'], series: [{ name: '精制', color: '#34D399', base: 46, amp: 7 }] }
      ],
      'BBIT/MBIT': [
        { title: 'BBIT 产量', tags: ['BBIT 今日 42.6 t', '计划 45 t', '达成 94.7%'], series: [{ name: 'BBIT', color: '#22D3EE', base: 64, amp: 5 }, { name: '计划', color: '#FBBF24', base: 72, amp: 1 }] },
        { title: 'MBIT 产量', tags: ['MBIT 今日 18.2 t', '计划 20 t', '达成 91.0%'], series: [{ name: 'MBIT', color: '#34D399', base: 48, amp: 4 }, { name: '计划', color: '#FBBF24', base: 56, amp: 1 }] },
        { title: 'BBIT/MBIT 质量', tags: ['BBIT 合格率 99.2%', 'MBIT 合格率 98.6%', '待检 2 批'], series: [{ name: 'BBIT', color: '#22D3EE', base: 78, amp: 2 }, { name: 'MBIT', color: '#34D399', base: 72, amp: 2 }] }
      ]
    }
  },
  lab: {
    kpi: { total: 16794, reviewed: 16769, pending: 25, today: 42, passRate: 98.6, env: 126 },
    tabs: ['过程化验', '化验项目', '来料检验', '环保化验', '操作建议', '操作记录'],
    process: [
      { no: 'HY202610280042', batch: 'LX-BIT-2610136A1', product: 'BIT', item: '缩合反应中控', sample: '05:12', result: '合格', inspector: '李工', status: '待复审' },
      { no: 'HY202610280041', batch: 'LX-BIT-2610138A1', product: 'BIT', item: '氯化反应中控', sample: '04:58', result: '合格', inspector: '王工', status: '已复审' },
      { no: 'HY202610280040', batch: 'LX-BIT-2610136B1', product: 'BIT', item: '离心料含水', sample: '04:42', result: '合格', inspector: '李工', status: '已复审' },
      { no: 'HY202610280039', batch: 'LX-BIT-2610138A2', product: 'BIT', item: '缩合反应中控', sample: '04:26', result: '待检', inspector: '-', status: '待检验' },
      { no: 'HY202610280038', batch: 'BIT混-26102806', product: 'BIT混料', item: '混料均匀度', sample: '04:10', result: '合格', inspector: '王工', status: '已复审' },
      { no: 'HY202610280037', batch: 'LX-BBIT-2610133A1', product: 'BBIT', item: '酸化液 pH', sample: '03:55', result: '合格', inspector: '李工', status: '已复审' },
      { no: 'HY202610280036', batch: 'LX-BIT-2610138B1', product: 'BIT', item: '脱色液透光率', sample: '03:40', result: '不合格', inspector: '王工', status: '待复审' },
      { no: 'HY202610280035', batch: 'LX-MTBA-2610131A1', product: 'MTBA', item: '成品含量', sample: '03:22', result: '合格', inspector: '李工', status: '已复审' },
      { no: 'HY202610280034', batch: 'LX-BIT-2610137A1', product: 'BIT', item: '水分', sample: '03:08', result: '合格', inspector: '王工', status: '已复审' },
      { no: 'HY202610280033', batch: 'LX-BIT-2610137B1', product: 'BIT', item: '离心料含水', sample: '02:52', result: '待检', inspector: '-', status: '待检验' },
      { no: 'HY202610280032', batch: 'LX-BBIT-2610133A2', product: 'BBIT', item: '成品含量', sample: '02:36', result: '不合格', inspector: '李工', status: '已复审' },
      { no: 'HY202610280031', batch: 'LX-BIT-2610136A2', product: 'BIT', item: '缩合物残留', sample: '02:18', result: '合格', inspector: '王工', status: '待复审' }
    ],
    items: [
      { code: 'LAB-001', name: '缩合反应中控', target: '邻氯苯腈 ≤ 1.00%', method: '气相色谱', unit: '%', point: 'SH-OP-6', cycle: '每批' },
      { code: 'LAB-002', name: '氯化反应中控', target: '缩合物 ≤ 20%', method: '液相色谱', unit: '%', point: 'LV-1-OP-5', cycle: '每批' },
      { code: 'LAB-003', name: '离心料含水', target: '水分 ≤ 13.50%', method: '快速水分仪', unit: '%', point: 'LX-1-OP-1', cycle: '每批' },
      { code: 'LAB-004', name: '成品含量', target: '含量 ≥ 98.50%', method: '液相色谱', unit: '%', point: '包装前', cycle: '每批' },
      { code: 'LAB-005', name: '脱色液透光率', target: '透光率 ≥ 95%', method: '分光光度', unit: '%', point: 'TS-1-OP-4', cycle: '每批' },
      { code: 'LAB-006', name: '酸化液 pH', target: 'pH 5.0–6.0', method: 'pH 计', unit: '-', point: 'SUH-1-OP-4', cycle: '每批' }
    ],
    incoming: [
      { no: 'IQ202610280018', material: '邻氯苯腈', supplier: '某化工供应商', batch: 'RM-261028-01', item: '含量', result: '合格', inspector: '李工', time: '05:02' },
      { no: 'IQ202610280017', material: '甲硫醇钠', supplier: '某化工供应商', batch: 'RM-261028-02', item: '含量', result: '合格', inspector: '王工', time: '04:40' },
      { no: 'IQ202610280016', material: '液碱', supplier: '某基础化工', batch: 'RM-261028-03', item: '浓度', result: '合格', inspector: '李工', time: '04:18' },
      { no: 'IQ202610280015', material: '氯苯', supplier: '某溶剂供应商', batch: 'RM-261028-04', item: '水分', result: '待检', inspector: '-', time: '03:52' },
      { no: 'IQ202610280014', material: '活性炭', supplier: '某碳材料', batch: 'RM-261028-05', item: '脱色力', result: '合格', inspector: '王工', time: '03:20' },
      { no: 'IQ202610280013', material: '催化剂', supplier: '某催化剂厂', batch: 'RM-261028-06', item: '活性', result: '合格', inspector: '李工', time: '02:48' }
    ],
    env: [
      { point: '废水总排口', factor: 'COD', limit: '≤ 500 mg/L', value: '186', result: '合格', time: '05:00' },
      { point: '废水总排口', factor: '氨氮', limit: '≤ 45 mg/L', value: '12.4', result: '合格', time: '05:00' },
      { point: '废水总排口', factor: 'pH', limit: '6–9', value: '7.6', result: '合格', time: '05:00' },
      { point: 'RTO 排气口', factor: '非甲烷总烃', limit: '≤ 60 mg/m³', value: '18.2', result: '合格', time: '04:00' },
      { point: 'RTO 排气口', factor: '颗粒物', limit: '≤ 20 mg/m³', value: '6.4', result: '合格', time: '04:00' },
      { point: '厂界噪声', factor: '昼间噪声', limit: '≤ 65 dB', value: '53.2', result: '合格', time: '02:00' }
    ],
    advice: [
      { batch: 'LX-BIT-2610138A1', item: '氯化反应中控', advice: '通氯后期升温速率偏快，建议将夹套蒸汽阀开度下调 5%，并延长保温 10 min。', priority: '高', status: '待执行' },
      { batch: 'LX-BIT-2610136B1', item: '离心料含水', advice: '含水率接近上限，建议延长离心 3 min 或提高洗涤温度。', priority: '中', status: '待执行' },
      { batch: 'LX-BBIT-2610133A2', item: '成品含量', advice: '成品含量偏低，建议复核二次压滤与脱色收率，必要时回配。', priority: '高', status: '已执行' },
      { batch: 'BIT混-26102806', item: '混料均匀度', advice: '混料 12 min 后取样合格，建议保持当前混料时间。', priority: '低', status: '已关闭' }
    ],
    records: [
      { time: '05:12', batch: 'LX-BIT-2610136A1', item: '缩合反应中控', result: '合格', operator: '李工', note: '邻氯苯腈 0.72%' },
      { time: '04:58', batch: 'LX-BIT-2610138A1', item: '氯化反应中控', result: '合格', operator: '王工', note: '缩合物 13.82%' },
      { time: '04:42', batch: 'LX-BIT-2610136B1', item: '离心料含水', result: '合格', operator: '李工', note: '水分 11.8%' },
      { time: '04:26', batch: 'LX-BIT-2610138A2', item: '缩合反应中控', result: '待检', operator: '-', note: '已取样，待上机' },
      { time: '03:55', batch: 'LX-BBIT-2610133A1', item: '酸化液 pH', result: '合格', operator: '李工', note: 'pH 5.35' },
      { time: '03:40', batch: 'LX-BIT-2610138B1', item: '脱色液透光率', result: '不合格', operator: '王工', note: '透光率 93.2%，低于 95%' }
    ]
  },
  warehouse: {
    kpi: { inbound: 3479, outbound: 2864, waitReview: 12, stockKg: 932192.96, batches: 1684, diff: 3 },
    tabs: ['物料入库', '物料出库', '车间库存', '盘库管理', '库存流水', '仓储配置'],
    inbound: [
      { no: 'RK202610280006', batch: 'LX-BIT-2610138A1', name: '离心入库单', weight: 776.00, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 05:06:21' },
      { no: 'RK202610280005', batch: 'LX-BIT-2610138A2', name: '离心入库单', weight: 829.00, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 05:06:15' },
      { no: 'RK202610280004', batch: 'LX-BIT-2610136B1', name: '离心入库单', weight: 762.00, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 02:46:50' },
      { no: 'RK202610280003', batch: 'LX-BIT-2610136B2', name: '离心入库单', weight: 807.80, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 02:46:46' },
      { no: 'RK202610280002', batch: 'LX-BIT-2610137B1', name: '离心入库单', weight: 689.40, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 02:46:42' },
      { no: 'RK202610280001', batch: 'LX-BIT-2610137B2', name: '离心入库单', weight: 692.60, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-28 02:46:38' },
      { no: 'RK202610270037', batch: 'LX-BIT-2610136A1', name: '离心入库单', weight: 914.80, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-27 22:31:22' },
      { no: 'RK202610270036', batch: 'LX-BIT-2610136A2', name: '离心入库单', weight: 792.60, bags: 1, type: '离心入库', status: '复核中', time: '2026-10-27 22:31:17' },
      { no: 'RK202610270035', batch: 'LX-BIT-2610137A1', name: '离心入库单', weight: 850.20, bags: 1, type: '离心入库', status: '完成', time: '2026-10-27 19:15:16' },
      { no: 'RK202610270034', batch: 'LX-BIT-2610137A2', name: '离心入库单', weight: 713.60, bags: 1, type: '离心入库', status: '完成', time: '2026-10-27 19:15:09' }
    ],
    outbound: [
      { no: 'CK202610280008', batch: 'LX-BIT-2610138A1', material: 'BIT 粗品', weight: 760.00, type: '销售出库', status: '待复核', time: '05:08' },
      { no: 'CK202610280007', batch: 'BIT混-26102806', material: 'BIT 混料', weight: 1500.00, type: '生产领用', status: '已出库', time: '04:52' },
      { no: 'CK202610280006', batch: 'LX-BBIT-2610133A1', material: 'BBIT 粗品', weight: 800.00, type: '销售出库', status: '已出库', time: '04:30' },
      { no: 'CK202610280005', batch: 'LX-BIT-2610136B1', material: 'BIT 粗品', weight: 1200.00, type: '移库出库', status: '待复核', time: '04:12' },
      { no: 'CK202610280004', batch: 'LX-MTBA-2610131A1', material: 'MTBA 成品', weight: 500.00, type: '销售出库', status: '已出库', time: '03:40' },
      { no: 'CK202610280003', batch: 'BHGL-26102801', material: '不合格料', weight: 300.00, type: '回用出库', status: '已出库', time: '03:05' }
    ],
    stock: [
      { code: 'BITHL', name: 'BIT混料', stock: 932192.96, batches: 1684, unit: 'kg' },
      { code: '801001', name: 'BIT', stock: 44906.4, batches: 80, unit: 'kg' },
      { code: 'BHGL', name: '不合格料', stock: 1500.6, batches: 3, unit: 'kg' },
      { code: '701001', name: 'BIT离心料', stock: 1524774.2, batches: 2133, unit: 'kg' }
    ],
    inventory: [
      { no: 'PK202610280003', warehouse: '成品库', material: 'BIT 粗品', book: 38292.4, actual: 38192.4, diff: -100.0, status: '待处理' },
      { no: 'PK202610280002', warehouse: '原料库', material: '邻氯苯腈', book: 12800.0, actual: 12800.0, diff: 0, status: '已盘平' },
      { no: 'PK202610280001', warehouse: '车间库', material: 'BIT 混料', book: 932192.96, actual: 931992.96, diff: -200.0, status: '待处理' },
      { no: 'PK202610270006', warehouse: '成品库', material: 'BBIT 粗品', book: 25600.0, actual: 25600.0, diff: 0, status: '已盘平' },
      { no: 'PK202610270005', warehouse: '原料库', material: '液碱', book: 4200.0, actual: 4210.0, diff: 10.0, status: '待处理' }
    ],
    flow: [
      { time: '05:06', material: 'BIT 粗品', type: '离心入库', qty: '+776.00', doc: 'RK202610280006', user: '张平' },
      { time: '04:58', material: 'BIT 混料', type: '生产领用', qty: '-1500.00', doc: 'CK202610280007', user: '李工' },
      { time: '04:42', material: '邻氯苯腈', type: '采购入库', qty: '+12000.00', doc: 'RK202610270033', user: '王工' },
      { time: '04:12', material: 'BIT 粗品', type: '移库出库', qty: '-1200.00', doc: 'CK202610280005', user: '张平' },
      { time: '03:40', material: 'MTBA 成品', type: '销售出库', qty: '-500.00', doc: 'CK202610280004', user: '李工' },
      { time: '03:05', material: '不合格料', type: '回用出库', qty: '-300.00', doc: 'CK202610280003', user: '王工' }
    ],
    config: [
      { code: 'WH-FG', name: '成品库', type: '成品库', locations: 24, keeper: '李工', status: '启用' },
      { code: 'WH-YL', name: '原料库', type: '原料库', locations: 18, keeper: '王工', status: '启用' },
      { code: 'WH-CJ', name: '车间库', type: '车间库', locations: 12, keeper: '张平', status: '启用' },
      { code: 'WH-WP', name: '危品库', type: '危化品库', locations: 8, keeper: '王工', status: '启用' },
      { code: 'WH-BH', name: '不合格品库', type: '不合格品库', locations: 4, keeper: '李工', status: '停用' }
    ]
  }
};
