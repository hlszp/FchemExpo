import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fineChemDesign } from './design-v2.mjs';
import { architectureDesign } from './design-v3.mjs';

const root = path.dirname(fileURLToPath(import.meta.url));
// Use a normal local install, or an existing runtime without installing packages.
const sharp = createRequire(import.meta.url)(process.env.A03_SHARP_MODULE || 'sharp');
const read = name => fs.readFile(path.join(root, name));
const uri = (bytes, mime) => `data:${mime};base64,${bytes.toString('base64')}`;
const logo = uri(await read('assets/logo-dark.svg'), 'image/svg+xml');
const finechem = process.argv.includes('--finechem');
const architecture = process.argv.includes('--architecture');
const upperLayout = finechem || architecture;
const prefix = architecture ? 'A03-v3' : finechem ? 'A03-v2' : 'A03';
const qr = uri(await read(upperLayout ? 'assets/qr-website-http.png' : 'assets/qr-website.png'), 'image/png');
const ribbon = uri(await read('assets/data-ribbon.svg'), 'image/svg+xml');
const esc = value => String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;');
const font = "'PingFang SC','Heiti SC','Noto Sans CJK SC',sans-serif";
const colors = { background: '#0F172A', text: '#F1F5F9', muted: '#94A3B8', accent: '#38BDF8' };
const text = (x, y, size, value, {fill = colors.text, weight = 400, spacing = 0, anchor = 'start'} = {}) =>
  `<text x="${x}" y="${y}" font-family="${font}" font-size="${size}" font-weight="${weight}" fill="${fill}" letter-spacing="${spacing}" text-anchor="${anchor}">${esc(value)}</text>`;

const products = [
  ['iIoTS', '接入'], ['iAAS', '降噪'], ['iCLPM', '调回路'],
  ['iPAE', '语义'], ['inWork', '任务 · 规划中'], ['iMCS', '执行'],
];
// Coordinates are millimetres relative to the 2000 x 2100 mm finished board.
let content = `
  <g id="brand">
    <image href="${logo}" x="150" y="156" width="450" height="106.16"/>
    ${text(1850, 192, 34, '杭州致联信息工程有限公司', {anchor: 'end', weight: 500})}
    ${text(1850, 231, 16.5, 'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.', {anchor: 'end', fill: colors.muted, spacing: .3})}
  </g>
  <g id="statement">
    ${text(150, 402, 31, '精细化工数智化', {fill: colors.muted, spacing: 4})}
    ${text(142, 576, 126, '让装置数据', {weight: 600, spacing: -2})}
    ${text(142, 740, 126, '变成企业的生产力', {fill: colors.accent, weight: 600, spacing: -2})}
    ${text(150, 835, 34, '从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径', {fill: '#CED8E5'})}
  </g>
  <g id="visual">
    <image href="${ribbon}" x="150" y="924" width="1400" height="522.67"/>
  </g>
  <g id="conversion-qr">
    <rect x="1620" y="1030" width="230" height="230" rx="2" fill="white"/>
    <image href="${qr}" x="1625" y="1035" width="220" height="220"/>
    ${text(1735, 1302, 25, '扫码访问公司官网', {anchor: 'middle', fill: colors.muted})}
  </g>
  <g id="products">
    <path d="M150 1534H1850" stroke="#94A3B8" stroke-width="1" stroke-opacity=".35"/>
    ${products.map(([name, label], i) => {
      const x = 150 + i * 294;
      return text(x, 1632, 47, name, {weight: 500}) + text(x, 1696, 30, label, {fill: colors.muted});
    }).join('\n')}
  </g>
  <g id="conversion-contact">
    ${text(150, 1865, 45, 'www.zlinfot.com', {weight: 500})}
    ${text(150, 1933, 29, '电话 13516812241 ｜ 邮箱 service@zlinfot.com', {fill: colors.muted})}
    ${text(1848, 1800, 27, '展位', {anchor: 'end', fill: colors.muted})}
    ${text(1855, 1933, 116, 'A03', {anchor: 'end', weight: 500, spacing: -4})}
  </g>`;
const revised = architecture ? architectureDesign({text,logo,qr}) : finechem ? fineChemDesign({text,logo,qr}) : null;
if (revised) content = revised.content;

function svg({bleed = false} = {}) {
  const width = bleed ? 2060 : 2000;
  const height = bleed ? 2160 : 2100;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}mm" height="${height}mm" viewBox="0 0 ${width} ${height}">
<title>精细化工展位背景板 · ${architecture ? '产品架构与四级爬坡' : finechem ? '黄金批次与生产力' : '由散到聚'} · 效果审阅版</title>
<desc>2026-10-19. RGB visual proof. Trim 2000x2100 mm. Bleed 30 mm. Not a CMYK print release.</desc>
<rect width="${width}" height="${height}" fill="${colors.background}"/>
<g transform="translate(${bleed ? '30 30' : '0 0'})">${content}</g>
</svg>`.replace(/[ \t]+$/gm, '');
}

const flat = svg();
await fs.writeFile(path.join(root, `${prefix}-layout-editable.svg`), svg({bleed: true}));
await sharp(Buffer.from(flat), {density: 25.4}).resize({width: 1920}).jpeg({quality: 96, chromaSubsampling: '4:4:4'}).toFile(path.join(root, `${prefix}-effect-1920.jpg`));

// A deterministic placement proof; the board image is exactly the same artwork.
const boardImage = uri(await read(`${prefix}-effect-1920.jpg`), 'image/jpeg');
const scene = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="2200" viewBox="0 0 2400 2200">
<defs><linearGradient id="wall" x2="0" y2="1"><stop stop-color="#EEEDE9"/><stop offset="1" stop-color="#DAD9D4"/></linearGradient></defs>
<rect width="2400" height="2200" fill="url(#wall)"/>
<path d="M0 1950H2400V2200H0Z" fill="#C7C5BE"/>
<ellipse cx="1200" cy="2010" rx="880" ry="80" fill="#8B8981" opacity=".2"/>
<rect x="367" y="175" width="1666" height="1750" rx="3" fill="#9E9E99"/>
<image href="${boardImage}" x="380" y="185" width="1640" height="1722"/>
<rect x="350" y="185" width="20" height="1800" fill="#CFD0CB"/>
<rect x="2030" y="185" width="20" height="1800" fill="#B2B4B0"/>
<rect x="350" y="162" width="1700" height="23" fill="#D8DAD6"/>
${upperLayout ? `<path d="M462 1268H1938L1995 1310H405Z" fill="#E1E0DC"/>
<rect x="405" y="1310" width="1590" height="665" fill="#D3D2CD"/>
<path d="M462 1310V1975M1938 1310V1975" stroke="#BAB9B4" stroke-width="2"/>
<rect x="405" y="1308" width="1590" height="14" fill="#B9B9B4"/>` : ''}
</svg>`;
await sharp(Buffer.from(scene)).resize({width:1920}).jpeg({quality:94, chromaSubsampling:'4:4:4'}).toFile(path.join(root,`${prefix}-placement-review.jpg`));

const mustHave = revised?.required || ['让装置数据','变成企业的生产力','精细化工数智化','杭州致联信息工程有限公司',
  'HANGZHOU ZHILIAN INFORMATION ENGINEERING CO., LTD.','从批次管理入手 · 一条基于现有 DCS 数据的四级爬坡路径',
  ...products.map(p=>p[0]),'规划中','www.zlinfot.com','13516812241','service@zlinfot.com','A03'];
const forbidden = ['智联','Zillion','iSCADA','RMAS','iPES','iSPSM','iBATCH','自动整定','自动写 DCS','机器学习预测','可商业交付'];
for (const term of mustHave) if (!content.includes(term)) throw new Error(`Missing copy: ${term}`);
for (const term of forbidden) if (content.includes(term)) throw new Error(`Forbidden copy: ${term}`);
if (upperLayout && content.includes('A03')) throw new Error('Booth number must not appear on revised artwork');
if (architecture && /黄金批次|苯环|含氟|molecularRing|chemical-identity/.test(content)) throw new Error('Retired theme or molecular motif in architecture artwork');
if (upperLayout) {
  const lowText = [...content.matchAll(/<text[^>]*y="([\d.]+)"/g)].filter(m=>Number(m[1])>1190);
  if (lowText.length) throw new Error('Text enters the 900 mm table-clearance zone');
}
const meta = await sharp(path.join(root,`${prefix}-effect-1920.jpg`)).metadata();
if (meta.width !== 1920 || meta.height !== 2016) throw new Error('Unexpected preview dimensions');
console.log(`PASS: ${mustHave.length} required strings, ${forbidden.length} redlines, 1920x2016 preview; trim 2000x2100mm / bleed 30mm.`);
console.log('Review output only. CMYK profile, final outlining and print proof require a separate print release.');
