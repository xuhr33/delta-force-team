#!/usr/bin/env node
/* 站点自检。任何人改了内容后，这个脚本会检查有没有把站改坏。
   在 GitHub Actions 里自动跑，本地也能跑：node .github/check-site.js
   退出码非 0 就是有问题，CI 会拦住这次改动。 */
const fs = require('fs');
const path = require('path');

const problems = [];
const ok = [];
const root = path.resolve(__dirname, '..');

function fail(msg) { problems.push(msg); }
function pass(msg) { ok.push(msg); }
function read(rel) { return fs.readFileSync(path.join(root, rel), 'utf8'); }

/* ---------- 1. JS 语法 ---------- */
for (const f of ['js/main.js', 'js/data.js']) {
  try {
    new Function(read(f));   // 只解析不执行
    pass(`${f} 语法正确`);
  } catch (e) {
    fail(`${f} 语法错误：${e.message}`);
  }
}

/* ---------- 2. data.js 里的数组是否存在 ---------- */
let data = {};
try {
  const src = read('js/data.js');
  data = new Function(src + '\nreturn { STATS, ACHIEVEMENTS, MEMBERS, RECRUIT, STARS, THANKS, PILLARS };')();
  pass('data.js 能正常解析出数据');
} catch (e) {
  fail(`data.js 解析失败（多半是少写/多写了一个逗号）：${e.message}`);
}

/* ---------- 3. 关键数组不能是空的 ---------- */
if (data.MEMBERS && data.MEMBERS.length === 0) fail('MEMBERS 是空数组，队员名单会变成空白');
if (data.ACHIEVEMENTS && data.ACHIEVEMENTS.length === 0) fail('ACHIEVEMENTS 是空数组，战绩区会变成空白');
if (data.MEMBERS) {
  data.MEMBERS.forEach((m, i) => {
    if (!m.name && !m.gameId) fail(`MEMBERS 第 ${i + 1} 条既没有 name 也没有 gameId`);
  });
  pass(`队员 ${data.MEMBERS.length} 人、战绩 ${(data.ACHIEVEMENTS || []).length} 条`);
}

/* ---------- 4. index.html 里的引用是否都存在 ---------- */
const html = read('index.html');
const refs = new Set();
for (const m of html.matchAll(/(?:src|href)="([^"]+)"/g)) refs.add(m[1]);

let missing = 0;
for (const r of refs) {
  if (r.startsWith('#') || /^(https?:|mailto:|data:)/.test(r)) continue;
  if (!fs.existsSync(path.join(root, r))) { fail(`引用的文件不存在：${r}`); missing++; }
}
if (!missing) pass(`${refs.size} 个资源引用全部存在`);

/* ---------- 5. 锚点是否有对应元素 ---------- */
const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map(m => m[1]));
let badAnchor = 0;
for (const m of html.matchAll(/href="#([^"]+)"/g)) {
  if (!ids.has(m[1])) { fail(`导航锚点 #${m[1]} 找不到对应元素`); badAnchor++; }
}
if (!badAnchor) pass('所有导航锚点都能跳到对应板块');

/* ---------- 6. 头像文件是否齐全 ---------- */
if (data.MEMBERS) {
  const need = new Set();
  data.MEMBERS.forEach(m => {
    if (m.avatar) need.add(m.avatar);
  });
  let lack = 0;
  need.forEach(p => {
    if (!fs.existsSync(path.join(root, p))) { fail(`队员指定的头像不存在：${p}`); lack++; }
  });
  if (!lack && need.size) pass(`${need.size} 个自定义头像文件都在`);
}

/* ---------- 7. 主色变量没被改坏 ---------- */
const css = read('css/style.css');
for (const v of ['--accent:', '--bg:', '--text:']) {
  if (!css.includes(v)) fail(`css/style.css 里缺少变量 ${v}`);
}

/* ---------- 输出 ---------- */
console.log('\n通过：');
ok.forEach(s => console.log('  ✓ ' + s));

if (problems.length) {
  console.log('\n有问题：');
  problems.forEach(s => console.log('  ✗ ' + s));
  console.log(`\n共 ${problems.length} 个问题，这次改动会把站点改坏，已拦下。`);
  process.exit(1);
}
console.log('\n全部检查通过，可以上线。\n');
