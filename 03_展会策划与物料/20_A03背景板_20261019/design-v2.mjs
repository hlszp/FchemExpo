// Fine-chemical batch story. All text and QR stay above y=1200 mm.
// The lower 900 mm is deliberately free of content for the booth table.
export function fineChemDesign({ text, logo, qr }) {
  const cyan = '#38BDF8', white = '#F1F5F9', gray = '#B6C5D8';
  const t = (x,y,size,value,opts={}) => text(x,y,size,value,{fill:white,...opts});
  const molecularRing = (cx,cy,r,{opacity=.26,fluorine=false}={}) => {
    const points = Array.from({length:6},(_,i)=>{
      const a=(i*60-30)*Math.PI/180;
      return [cx+r*Math.cos(a),cy+r*Math.sin(a)];
    });
    const [x,y]=points[0];
    return `<g opacity="${opacity}" fill="none" stroke="${cyan}" stroke-width="2.5">
      <polygon points="${points.map(p=>p.join(',')).join(' ')}"/>
      <circle cx="${cx}" cy="${cy}" r="${r*.53}"/>
      ${fluorine ? `<path d="M${x} ${y} l58 -34"/>` : ''}
      </g>${fluorine?t(x+74,y-36,44,'F',{fill:cyan,weight:500}):''}`;
  };
  const traces = [
    'M0 160 C34 163 45 154 65 113 S102 36 143 32 L249 33 C292 35 302 127 340 156 L400 157',
    'M0 172 C35 171 52 149 74 99 S108 63 156 62 L270 59 C310 63 321 143 353 169 L400 169',
    'M0 151 C38 151 45 121 65 84 S104 41 136 45 L250 48 C294 47 308 129 338 151 L400 151',
    'M0 164 C45 169 65 154 88 111 S121 52 168 50 L292 52 C330 54 338 135 367 160 L400 161',
    'M0 176 C35 178 55 143 79 93 S110 28 158 29 L230 28 C265 27 289 142 325 175 L400 175',
    'M0 156 C26 155 34 132 56 91 S87 57 126 55 L238 56 C282 59 293 128 335 155 L400 154',
  ];
  const plot = (x,y,golden=false) => `<g transform="translate(${x} ${y})">
    <g stroke="#6A809B" stroke-opacity=".16" stroke-width="1">
      <path d="M0 40H400 M0 105H400 M0 175H400"/>
      <path d="M78 12V186 M225 12V186 M320 12V186"/>
    </g>
    ${golden?`<path d="M0 152 C35 152 47 116 69 75 S110 34 147 34 L250 35 C292 35 307 122 343 150 L400 151 L400 176 L343 175 C304 148 285 65 250 64 L147 65 C107 64 91 66 76 101 S44 178 0 178Z" fill="${cyan}" fill-opacity=".17"/>`:''}
    ${traces.map((d,i)=>`<path d="${d}" fill="none" stroke="${golden?cyan:'#94A3B8'}" stroke-width="${golden?1.2:1.7}" opacity="${golden?.25:.42+i*.05}"/>`).join('')}
    ${golden?`<path d="M0 165 C36 165 48 135 72 89 S110 49 147 49 L250 50 C291 50 307 137 343 163 L400 164" fill="none" stroke="${cyan}" stroke-width="4"/>
      <circle cx="225" cy="50" r="5" fill="${white}"/>`:''}
    ${[['投料',14],['反应',120],['保温',244],['出料',346]].map(([s,px])=>t(px,218,21,s,{fill:gray})).join('')}
  </g>`;
  const arrow = x => `<path d="M${x} 844h48m-13 -12 13 12-13 12" fill="none" stroke="${cyan}" stroke-width="2.4" opacity=".72"/>`;
  const benefits = [
    ['质量','批次一致性与过程稳定',757],
    ['效率','阶段耗时与生产节拍',842],
    ['成本','物料消耗与能源利用',927],
  ];
  const products=[['iIoTS','数据接入'],['iAAS','报警治理'],['iCLPM','回路诊断'],['iPAE','批次分析'],['inWork','任务协同'],['iMCS','生产管控']];
  const content = `
  <g id="chemical-identity">
    ${molecularRing(1620,395,112,{fluorine:true,opacity:.28})}
    ${molecularRing(1775,603,62,{fluorine:false,opacity:.12})}
    <path d="M1717 451l30 85" stroke="${cyan}" stroke-opacity=".15" stroke-width="2.5"/>
    <path d="M1500 522l-50 29m50-29 42 24" stroke="${cyan}" stroke-opacity=".12" stroke-width="2.5"/>
  </g>
  <g id="brand">
    <image href="${logo}" x="150" y="133" width="350" height="82.57"/>
    ${t(1850,165,31,'杭州致联信息工程有限公司',{anchor:'end',weight:500})}
    ${t(1850,200,16.5,'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.',{anchor:'end',fill:gray})}
  </g>
  <g id="promise">
    ${t(150,280,28,'精细化工数智化',{fill:gray,spacing:3})}
    ${t(144,388,96,'让装置数据',{weight:600})}
    ${t(144,502,96,'变成企业的生产力',{weight:600,fill:cyan})}
    ${t(150,565,28,'从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径',{fill:gray})}
  </g>
  <g id="golden-batch-story">
    <path d="M150 615H1850" stroke="${cyan}" stroke-opacity=".25"/>
    ${t(150,678,43,'从批次运行轨迹中，寻找「黄金批次」',{weight:500})}
    ${t(150,718,25,'以过程对比和评价，为质量、效率与成本改进提供依据',{fill:gray})}
    ${t(150,776,29,'多批次运行轨迹',{weight:500})}
    ${t(673,776,29,'黄金批次参考',{weight:500,fill:cyan})}
    ${t(1116,716,23,'iPAE · 过程分析与探索系统',{fill:cyan,anchor:'end'})}
    ${plot(150,785,false)}
    ${arrow(583)}
    ${plot(673,785,true)}
    ${arrow(1110)}
    ${t(150,1046,23,'按生产阶段对齐与比较',{fill:gray})}
    ${t(673,1046,23,'结合质量、节拍与消耗评价',{fill:gray})}
    ${t(1073,1080,19,'轨迹及阶段为示意',{fill:'#8295AC',anchor:'end'})}
    <g transform="translate(1200 51)">
      ${t(0,678,28,'辅助改善生产表现',{fill:gray})}
      ${benefits.map(([name,detail,y])=>`
        <path d="M0 ${y-42}h280" stroke="${cyan}" stroke-opacity=".16"/>
        ${t(0,y,35,name,{weight:500,fill:cyan})}
        ${t(0,y+37,23,detail,{fill:gray})}`).join('')}
    </g>
  </g>
  <g id="website-qr">
    <rect x="1630" y="842" width="230" height="230" rx="2" fill="white"/>
    <image href="${qr}" x="1648" y="860" width="194" height="194"/>
    ${t(1745,1110,23,'扫码访问官网',{anchor:'middle',fill:gray})}
  </g>
  <g id="product-support">
    <path d="M150 1100H1532" stroke="#94A3B8" stroke-opacity=".22"/>
    ${products.map(([name,role],i)=>{
      const x=150+i*237;
      return t(x,1150,32,name,{weight:500,fill:name==='iPAE'?cyan:white}) +
        t(x,1184,21,role,{fill:gray}) +
        (name==='inWork'?t(x+115,1148,16,'规划中',{fill:gray}):'');
    }).join('')}
  </g>
  <g id="contact">
    ${t(1850,1153,25,'www.zlinfot.com',{anchor:'end',weight:500})}
    ${t(1850,1184,19,'13516812241 · service@zlinfot.com',{anchor:'end',fill:gray})}
  </g>`;
  const required = ['让装置数据','变成企业的生产力','精细化工数智化','杭州致联信息工程有限公司',
    'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.','从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径',
    ...products.map(p=>p[0]),'规划中','www.zlinfot.com','13516812241','service@zlinfot.com',
    '黄金批次','质量','效率','成本','辅助改善','轨迹及阶段为示意'];
  return {content,required};
}
