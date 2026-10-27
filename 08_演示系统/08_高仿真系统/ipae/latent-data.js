window.IPAE_LATENT = {
  kpi: { tags: 153, points: 2160, r2: 0.91, rmse: 1.8, activity: 82.4, forecast: 18, u: 186, clean: 240 },
  tabs: ['催化剂活性', '换热器性能', '隐含状态'],
  models: {
    catalyst: { name: '动态慢变量模型 · 活性指数软测量', formula: 'activity_t = f(T, recycle, load, dP, yield)', r2: 0.91, rmse: 1.8, horizon: '30 d', features: ['反应温度', '循环量', '进料负荷', '床层差压'] },
    hx: { name: '传热反算模型 · 污垢热阻', formula: 'U = Q / (A × LMTD); Rf = 1/U - 1/U_clean', r2: 0.88, horizon: '30 d', features: ['热负荷', '流量', '温差', '压降'] },
    latent: { name: '动态潜变量模型 · 慢变量分解', formula: 'x_t = A x_{t-1} + B u_t + e_t', r2: 0.87, horizon: '60 d', features: ['负荷因子', '传热因子', '反应强度'] }
  },
  factors: {
    catalyst: [{ name: '反应温度', value: 38, color: '#1466E8' }, { name: '循环量', value: 26, color: '#0B9A78' }, { name: '进料负荷', value: 21, color: '#D97706' }, { name: '床层差压', value: 15, color: '#7C3AED' }],
    hx: [{ name: '热负荷', value: 42, color: '#1466E8' }, { name: '流量', value: 31, color: '#0B9A78' }, { name: '温差', value: 18, color: '#D97706' }, { name: '压降', value: 9, color: '#7C3AED' }],
    latent: [{ name: '负荷因子', value: 46, color: '#1466E8' }, { name: '传热因子', value: 32, color: '#0B9A78' }, { name: '反应强度', value: 22, color: '#7C3AED' }]
  },
  status: [
    { name: '催化剂活性', value: '82.4%', trend: '较初期 -17.6%', status: '预警', color: '#DC2626' },
    { name: '换热器 U', value: '186', trend: '清洁 240', status: '观察', color: '#D97706' },
    { name: '隐含状态', value: '3 个', trend: '负荷/传热/反应', status: '正常', color: '#0B9A78' }
  ]
};
