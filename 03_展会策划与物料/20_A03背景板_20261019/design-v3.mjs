// Product capability architecture and four-stage adoption method share one diagram.
// Coordinates use finished-board millimetres. Keep the lower 900 mm clear.
export function architectureDesign({ text, logo, qr }) {
  const cyan = '#48D8FF', white = '#F3F7FC', gray = '#B8CBE0';
  const t = (x,y,size,value,opts={}) => text(x,y,size,value,{fill:white,...opts});
  const stages = [
    {x:150,y:720,level:'L1',title:'装置体检',product:'iAAS + iCLPM',role:'报警治理 · 回路诊断',method:'把异常确诊',front:'#13304D',top:'#1B4367'},
    {x:575,y:655,level:'L2',title:'批次语义',product:'iPAE',role:'轨迹对比 · 批次分析',method:'把时序变语义',front:'#123B60',top:'#1B5984'},
    {x:1000,y:590,level:'L3',title:'任务协同',product:'inWork',role:'工业智能工作台',method:'把洞察变任务',front:'#12517D',top:'#176A9D',planned:true},
    {x:1425,y:525,level:'L4',title:'生产执行',product:'iMCS',role:'配方 · 物料 · 质量 · 追溯',method:'把结论变执行',front:'#086998',top:'#0F88BB'},
  ];
  const width=385, height=252, dx=28, dy=-18;
  const stage = s => `<g id="stage-${s.level}">
    <path d="M${s.x} ${s.y}l${dx} ${dy}h${width}l${-dx} ${-dy}Z" fill="${s.top}"/>
    <path d="M${s.x+width} ${s.y}l${dx} ${dy}v${height}l${-dx} ${-dy}Z" fill="#082B45"/>
    <rect x="${s.x}" y="${s.y}" width="${width}" height="${height}" fill="${s.front}"/>
    <path d="M${s.x} ${s.y}h${width}l${dx} ${dy}" fill="none" stroke="${cyan}" stroke-width="3"/>
    ${t(s.x+23,s.y+47,25,s.level,{fill:cyan,weight:500})}
    ${t(s.x+80,s.y+48,36,s.title,{weight:600})}
    <path d="M${s.x+23} ${s.y+70}h339" stroke="${cyan}" stroke-opacity=".28"/>
    ${t(s.x+23,s.y+126,s.level==='L1'?38:45,s.product,{weight:600})}
    ${s.planned ? `<rect x="${s.x+217}" y="${s.y+97}" width="120" height="32" fill="#0D3A5B" stroke="#79ACC8" stroke-opacity=".6"/>
      ${t(s.x+277,s.y+120,21,'规划中',{anchor:'middle',fill:'#D4E5F3'})}` : ''}
    ${t(s.x+23,s.y+169,s.level==='L4'?24:28,s.role,{fill:'#E2EDF6'})}
    ${t(s.x+23,s.y+224,25,s.method,{fill:cyan,weight:500})}
    <path d="M${s.x+331} ${s.y+213}h24m-8-8 8 8-8 8" fill="none" stroke="${cyan}" stroke-width="2"/>
  </g>`;

  const content=`
  <defs>
    <linearGradient id="architecture-atmosphere" x1="0" y1="0" x2="1" y2="1">
      <stop stop-color="#13699B" stop-opacity="0"/>
      <stop offset=".6" stop-color="#126895" stop-opacity=".18"/>
      <stop offset="1" stop-color="#249DCF" stop-opacity=".04"/>
    </linearGradient>
    <linearGradient id="data-foundation" x1="0" y1="0" x2="1" y2="0">
      <stop stop-color="#173A59"/><stop offset="1" stop-color="#0E2942"/>
    </linearGradient>
  </defs>
  <g id="industrial-structure">
    <path d="M110 695L1870 411V826L110 1108Z" fill="url(#architecture-atmosphere)"/>
    <path d="M120 1110L1880 827M120 1060L1880 777" stroke="#54BDDE" stroke-opacity=".06" fill="none"/>
  </g>
  <g id="brand">
    <image href="${logo}" x="150" y="133" width="350" height="82.57"/>
    ${t(1850,165,31,'杭州致联信息工程有限公司',{anchor:'end',weight:500})}
    ${t(1850,200,16.5,'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.',{anchor:'end',fill:gray})}
  </g>
  <g id="promise">
    ${t(150,280,28,'精细化工数智化',{fill:gray,spacing:3})}
    ${t(1850,280,26,'质量更稳定   ·   生产更高效   ·   成本更可控',{anchor:'end',fill:cyan})}
    ${t(144,389,100,'让装置数据，变成企业的生产力',{weight:600,spacing:-1})
      .replace('变成企业的生产力','<tspan fill="'+cyan+'">变成企业的生产力</tspan>')}
    ${t(150,453,29,'从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径',{fill:gray})}
  </g>
  <g id="product-architecture">
    ${t(150,555,35,'从数据基础，到生产执行',{weight:500})}
    ${t(150,599,25,'让过程可分析，让改进有依据',{fill:gray})}
    <path d="M150 660H535V595H960V530H1360" stroke="${cyan}" stroke-width="2" stroke-opacity=".35" fill="none"/>
    <path d="M1347 520l13 10-13 10" stroke="${cyan}" stroke-width="2" stroke-opacity=".5" fill="none"/>
    ${stages.map(s=>`<path d="M${s.x+192} ${s.y+height}V1011" stroke="#3995BE" stroke-width="2" stroke-dasharray="5 7" opacity=".6"/>`).join('')}
    <path d="M342 1011H1617M900 1011V1032" fill="none" stroke="#3995BE" stroke-width="2" stroke-opacity=".65"/>
    ${stages.map(stage).join('')}
    <g id="data-foundation">
      <path d="M150 1041l28-18h1402l-28 18Z" fill="#244E6A"/>
      <path d="M1552 1041l28-18v89l-28 18Z" fill="#0A2337"/>
      <rect x="150" y="1041" width="1402" height="89" fill="url(#data-foundation)"/>
      <path d="M150 1041H1552" stroke="${cyan}" stroke-width="2"/>
      ${t(174,1093,26,'L0',{fill:cyan,weight:500})}
      ${t(230,1094,30,'数据底座',{weight:500})}
      ${t(414,1098,43,'iIoTS',{weight:600})}
      <path d="M564 1063V1111" stroke="#5584A1"/>
      ${t(597,1078,26,'工业数据采集与集成',{weight:500})}
      ${t(597,1113,22,'DCS / PLC · 仪表 · 历史数据库',{fill:gray})}
      ${t(1515,1093,25,'把数据接上来',{fill:cyan,anchor:'end'})}
    </g>
  </g>
  <g id="website-qr">
    <rect x="1635" y="878" width="215" height="215" rx="1" fill="white"/>
    <image href="${qr}" x="1652" y="895" width="181" height="181"/>
    ${t(1742.5,1136,26,'www.zlinfot.com',{anchor:'middle',weight:500})}
    ${t(1742.5,1175,21,'扫码访问官网',{anchor:'middle',fill:gray})}
  </g>
  <g id="contact">
    ${t(150,1180,23,'13516812241   ·   service@zlinfot.com',{fill:gray})}
    ${t(1552,1180,23,'以数据支撑质量、效率与成本改进',{anchor:'end',fill:gray})}
  </g>`;
  const required=['让装置数据，','变成企业的生产力','精细化工数智化','杭州致联信息工程有限公司',
    'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.',
    '从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径',
    'iIoTS','iAAS + iCLPM','iPAE','inWork','iMCS','规划中','www.zlinfot.com','13516812241','service@zlinfot.com',
    'L0','L1','L2','L3','L4','装置体检','批次语义','任务协同','生产执行',
    '轨迹对比 · 批次分析','把数据接上来','把异常确诊','把时序变语义','把洞察变任务','把结论变执行',
    '以数据支撑质量、效率与成本改进'];
  return {content,required};
}
