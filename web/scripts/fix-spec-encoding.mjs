import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const dir = path.join(path.dirname(fileURLToPath(import.meta.url)), '../docs/specs')

const nav = (a) => {
  const c = (id) => (a === id ? 'is-active text-slate-200' : 'text-slate-300')
  return `<nav class="spec-nav shrink-0 border-b border-lake/20 bg-lake-dark/80 p-4 lg:w-56 lg:min-h-screen">
  <p class="mb-3 text-xs uppercase tracking-widest text-lake">Spec</p>
  <ul class="flex flex-col gap-1 text-sm">
    <li><a href="index.html" class="${c('index')}">\u7d22\u5f15</a></li>
    <li><a href="phase-0-spike.html" class="${c('p0')}">Phase 0</a></li>
    <li><a href="phase-1-mvp-layers.html" class="${c('p1')}">Phase 1</a></li>
    <li><a href="phase-2-motion.html" class="${c('p2')}">Phase 2</a></li>
    <li><a href="phase-3-polish.html" class="${c('p3')}">Phase 3</a></li>
  </ul>
</nav>`
}

const wrap = (title, active, body) => `<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <script>tailwind.config={theme:{extend:{colors:{lake:{DEFAULT:'#6eb8e8',dark:'#061428'}}}}}</script>
  <link rel="stylesheet" href="css/specs.css" />
</head>
<body class="spec-body antialiased">
<div class="flex min-h-screen flex-col lg:flex-row">
${nav(active)}
<main class="spec-content flex-1 px-5 py-8 max-w-3xl">
${body}
</main>
</div>
</body>
</html>`

const pb = (pct) =>
  `<div class="progress-bar mb-6"><div class="progress-bar__fill" style="width:${pct}%"></div></div>`

const item = (cls, title, tags, detail) => `
  <li class="${cls} spec-item">
    <span class="spec-item-title">${title}</span>
    <span class="spec-tags">${tags}</span>
    <p class="spec-detail">${detail}</p>
  </li>`

const files = {
  'index.html': wrap('\u661f\u591c\u6e56 Spec', 'index', `
  <h1 class="text-3xl font-bold text-white mb-2">\u661f\u591c\u6e56 Spec \u7d22\u5f15</h1>
  <p class="spec-intro">\u4e3b\u7ad9\u80cc\u666f\u662f\u300c\u661f\u591c\u6e56\u300d\uff1a\u591c\u7a7a\u4e0e\u6e56\u9762\u7531\u4ee3\u7801\u5b9e\u65f6\u7ed8\u5236\uff0c\u65e0\u5916\u94fe\u63d2\u753b\u3002\u4ee3\u7801\u5728 <code>web/src/scene/</code>\u3002</p>
  <p class="text-slate-400 mb-2">\u7ec6\u9879 25/26\uff08\u7ea6 96%\uff09</p>
  ${pb(96)}
  <div class="spec-phase-card mt-8">
    <h3><a class="text-lake hover:underline" href="phase-0-spike.html">Phase 0 \u00b7 \u6280\u672f\u9a8c\u8bc1</a> \u2014 7/7</h3>
    <p>Three.js \u5168\u5c4f + \u661f\u7a7a/\u6e56\u9762 + HTML \u53e0\u5c42\uff1bDocker \u4e0e GitHub Pages\u3002</p>
  </div>
  <div class="spec-phase-card">
    <h3><a class="text-lake hover:underline" href="phase-1-mvp-layers.html">Phase 1 \u00b7 \u661f\u591c\u6e56\u89c6\u89c9</a> \u2014 4/4</h3>
    <p>\u661f\u7a7a\u7c92\u5b50\u3001\u6e56\u9762 shader\u3001\u6df1\u84dd\u8272\u76f8\u4e0e\u8f7b\u96fe\uff0c\u7eaf\u4ee3\u7801\u65e0\u7d20\u6750\u6587\u4ef6\u3002</p>
  </div>
  <div class="spec-phase-card">
    <h3><a class="text-lake hover:underline" href="phase-2-motion.html">Phase 2 \u00b7 \u52a8\u753b</a> \u2014 7/7</h3>
    <p>\u6e56\u6ce2\u3001\u661f\u5149\u3001\u955c\u5934\u6f2b\u6e38\u3001Shift \u52a0\u901f\u3001\u51cf\u52a8\u6548\u964d\u7ea7\u3002</p>
  </div>
  <div class="spec-phase-card">
    <h3><a class="text-lake hover:underline" href="phase-3-polish.html">Phase 3 \u00b7 \u6253\u78e8</a> \u2014 7/8</h3>
    <p>\u7b80\u6d01\u6a21\u5f0f\u3001WebGL \u515c\u5e95\u3001\u6027\u80fd\u4e0e\u6253\u5305\u4f18\u5316\u3002</p>
  </div>`),

  'phase-0-spike.html': wrap('Phase 0', 'p0', `
  <h1 class="text-3xl font-bold text-white mb-2">Phase 0 \u6280\u672f\u9a8c\u8bc1</h1>
  <p class="spec-intro">\u76ee\u6807\uff1a\u8bc1\u660e\u300c\u661f\u591c\u6e56\u300dWebGL \u80cc\u666f\u4e0e\u53ef\u8bfb\u524d\u7f6e UI \u5728\u672c\u5730\u4e0e Pages \u7a33\u5b9a\u8fd0\u884c\u3002</p>
  <p class="text-slate-400 mb-4">7/7 \u00b7 100%</p>
  ${pb(100)}
  <h2 class="text-lg text-teal-300 mb-3 mt-6">\u5df2\u5b8c\u6210</h2>
  <ul class="spec-checklist text-slate-300 mb-6">
    ${item('check-done', '#scene-canvas \u5168\u5c4f\u5e95\u5c42', 'index.html \u00b7 style.css', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u5168\u5c4f canvas \u5e95\u5c42\uff0cUI \u6bdb\u73bb\u7483\u9762\u677f\u53e0\u5728\u4e0a\u65b9\u3002')}
    ${item('check-done', 'initScene / dispose / resize', 'scene/index.ts \u00b7 loop.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>rAF \u5faa\u73af\u3001\u7a97\u53e3\u9002\u914d\u3001\u8d44\u6e90\u91ca\u653e\u3002')}
    ${item('check-done', 'stars.ts \u661f\u7a7a', 'scene/stars.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>Points \u661f\u7c92\u5b50\uff0c\u684c\u9762/\u79fb\u52a8\u7aef\u6570\u91cf\u53ef\u914d\u3002')}
    ${item('check-done', 'lake.ts \u6e56\u9762', 'scene/lake.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>Shader \u6e56\u9762\u6df1\u84dd\u6e10\u53d8\u4e0e\u6a2a\u5411\u7eb9\u7406\u3002')}
    ${item('check-done', '\u955c\u5934\u6f2b\u6e38', 'config.ts \u00b7 index.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u7f13\u6162\u524d\u79fb\u5e76 Ping-Pong \u6298\u8fd4\uff0c\u6f2b\u89c8\u661f\u591c\u6e56\u3002')}
    ${item('check-done', '#ui-root \u53e0\u5c42', 'ui/overlay.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u4e2a\u4eba\u4ecb\u7ecd\u3001\u573a\u666f\u8bf4\u660e\u3001\u7b80\u6d01\u6a21\u5f0f\u5f00\u5173\u3002')}
    ${item('check-done', 'Docker + Pages', 'docker-compose.yml \u00b7 pages.yml', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u672c\u5730 <code>docker compose up</code>\uff1b\u63a8\u9001\u81ea\u52a8\u90e8\u7f72\u3002')}
  </ul>
  <h2 class="text-lg text-slate-400">\u672a\u5b8c\u6210</h2>
  <p class="text-sm text-slate-500">\u65e0</p>`),

  'phase-1-mvp-layers.html': wrap('Phase 1', 'p1', `
  <h1 class="text-3xl font-bold text-white mb-2">Phase 1 \u661f\u591c\u6e56\u89c6\u89c9</h1>
  <p class="spec-intro">\u76ee\u6807\uff1a\u7528\u7eaf\u4ee3\u7801\u5b9e\u73b0\u661f\u7a7a + \u6e56\u9762\uff0c\u8272\u8c03\u7edf\u4e00\u4e3a\u661f\u591c\u6e56\u591c\u666f\u3002</p>
  <p class="text-slate-400 mb-4">4/4 \u00b7 100%</p>
  ${pb(100)}
  <h2 class="text-lg text-teal-300 mb-3 mt-6">\u5df2\u5b8c\u6210</h2>
  <ul class="spec-checklist text-slate-300 mb-6">
    ${item('check-done', '\u661f\u7a7a\u7c92\u5b50\u5c42', 'stars.ts \u00b7 config.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u968f\u673a\u5206\u5e03\u661f\u70b9\uff0c\u51cf\u52a8\u6548\u65f6\u51cf\u5c11\u5e76\u5173\u95ea\u52a8\u753b\u3002')}
    ${item('check-done', '\u6e56\u9762 shader', 'lake.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u5927\u5e73\u9762 + \u81ea\u5b9a\u4e49\u6750\u8d28\uff0c\u6df1\u84dd\u6e56\u6c34\u4e0e\u5fae\u5149\u3002')}
    ${item('check-done', '\u591c\u666f\u8272\u76f8', '#030810 / #6eb8e8', 'renderer \u00b7 style.css', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u6e05\u6670\u8272 #030810\u3001\u6e56\u5149 #6eb8e8\u3001UI \u73bb\u7483\u9762\u677f\u53ef\u8bfb\u3002')}
    ${item('check-done', '\u8f7b\u96fe', 'index.ts scene.fog', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>Exp2 fog \u589e\u52a0\u8fdc\u666f\u6df1\u5ea6\uff0c\u6e56\u5929\u4e00\u4f53\u3002')}
  </ul>
  <h2 class="text-lg text-slate-400">\u672a\u5b8c\u6210</h2>
  <p class="text-sm text-slate-500">\u65e0\uff08\u672c\u9636\u6bb5\u4e0d\u4f7f\u7528\u5916\u94fe\u63d2\u753b\uff09</p>`),

  'phase-2-motion.html': wrap('Phase 2', 'p2', `
  <h1 class="text-3xl font-bold text-white mb-2">Phase 2 \u52a8\u753b</h1>
  <p class="spec-intro">\u76ee\u6807\uff1a\u8ba9\u661f\u591c\u6e56\u300c\u6d3b\u8d77\u6765\u300d\uff0c\u540c\u65f6\u517c\u987e\u51cf\u52a8\u6548\u4e0e\u4f4e\u6027\u80fd\u8bbe\u5907\u3002</p>
  <p class="text-slate-400 mb-4">7/7 \u00b7 100%</p>
  ${pb(100)}
  <h2 class="text-lg text-teal-300 mb-3 mt-6">\u5df2\u5b8c\u6210</h2>
  <ul class="spec-checklist text-slate-300 mb-6">
    ${item('check-done', '\u6e56\u9762 UV \u6ce2\u7eb9', 'lake.ts updateLake', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u65f6\u95f4\u4e0e\u6eda\u8f6e\u52a0\u901f\u8054\u52a8\u6c34\u6ce2\u3002')}
    ${item('check-done', '\u661f\u5149\u95ea\u70c1', 'stars.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u661f\u7c92\u5b50\u5fae\u5e45\u95ea\u70c1\u3002')}
    ${item('check-done', '\u955c\u5934\u5fae\u6447 + Ping-Pong', 'config.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u6781\u8f7b\u6447\u6446\u4e0e\u524d\u540e\u6298\u8fd4\u6f2b\u6e38\u3002')}
    ${item('check-done', 'Shift + \u6eda\u8f6e\u52a0\u901f', 'scrollBoostRequiresShift', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u6309\u4f4f Shift \u65f6\u6eda\u8f6e\u624d\u52a0\u5feb\u955c\u5934\u3002')}
    ${item('check-done', 'prefers-reduced-motion', 'runtime-mode.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u51cf\u52a8\u6548\u65f6\u51cf\u5c11\u661f\u7c92\u4e0e\u6e56\u6ce2\u52a8\u753b\u3002')}
    ${item('check-done', '\u540e\u53f0\u6682\u505c rAF', 'loop.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u6807\u7b7e\u9875\u9690\u85cf\u65f6\u505c\u6b62\u6e32\u67d3\u3002')}
    ${item('check-done', '\u6c1b\u56f4\u53c2\u6570\u521d\u8c03', 'config.ts \u00b7 lake.ts \u00b7 stars.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u661f\u5bc6\u5ea6\u3001\u6e56\u9762\u53cd\u5149\u4e0e\u955c\u5934\u901f\u5ea6\u5df2\u8c03\u4e3a\u8212\u7f13\u6f2b\u6e38\u3002')}
  </ul>
  <h2 class="text-lg text-slate-400">\u672a\u5b8c\u6210</h2>
  <p class="text-sm text-slate-500">\u65e0</p>`),

  'phase-3-polish.html': wrap('Phase 3', 'p3', `
  <h1 class="text-3xl font-bold text-white mb-2">Phase 3 \u6253\u78e8</h1>
  <p class="spec-intro">\u76ee\u6807\uff1a\u5bbd\u5bb9\u4f4e\u6027\u80fd\u3001\u65e0 WebGL \u73af\u5883\uff0c\u4ee5\u53ca\u4e0a\u7ebf\u8d28\u91cf\u3002</p>
  <p class="text-slate-400 mb-4">7/8 \u00b7 88%</p>
  ${pb(88)}
  <h2 class="text-lg text-teal-300 mb-3 mt-6">\u5df2\u5b8c\u6210</h2>
  <ul class="spec-checklist text-slate-300 mb-6">
    ${item('check-done', 'runtime-mode', 'runtime-mode.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u7b80\u6d01\u6a21\u5f0f\u3001\u51cf\u52a8\u6548\u3001\u4f4e\u6027\u80fd\u81ea\u52a8\u9759\u6001\u80cc\u666f\u3002')}
    ${item('check-done', '\u9759\u6001 CSS \u80cc\u666f', 'static-fallback.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u7b80\u6d01\u6a21\u5f0f\u7528\u6df1\u84dd\u6e10\u53d8\uff0c\u65e0\u5f3a\u4f9d\u8d56\u5916\u94fe\u56fe\u3002')}
    ${item('check-done', '\u7b80\u6d01\u6a21\u5f0f\u5f00\u5173', 'overlay.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>localStorage \u5207\u6362\u9759\u6001/\u52a8\u6001\u3002')}
    ${item('check-done', 'WebGL \u5931\u8d25\u515c\u5e95', 'main.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>init \u5931\u8d25\u65f6\u4ecd\u663e\u793a\u9759\u6001\u80cc\u666f\u4e0e UI\u3002')}
    ${item('check-done', 'maxDpr \u9650\u5236', 'config.maxDpr', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>\u9ad8\u5206\u5c4f\u4e0d\u8d85 2x \u6e32\u67d3\u3002')}
    ${item('check-done', 'three \u5206\u5305', 'vite.config.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>manualChunks \u5229\u7528\u7f13\u5b58\u3002')}
    ${item('check-done', '\u6e56\u9762\u73af\u5883\u97f3\uff08\u52fe\u9009\uff09', 'ambient-sound.ts \u00b7 overlay.ts', '<strong>\u505a\u4e86\u4ec0\u4e48\uff1a</strong>Web Audio \u7a0b\u5e8f\u5316\u73af\u5883\u97f3\uff0c\u9ed8\u8ba4\u5173\u95ed\uff0c\u52fe\u9009\u5f00\u542f\u3002')}
  </ul>
  <h2 class="text-lg text-amber-300 mb-3">\u672a\u5b8c\u6210</h2>
  <ul class="spec-checklist text-slate-300">
    ${item('check-todo', 'Lighthouse \u9a8c\u6536', 'Pages', '<strong>\u8fd8\u5dee\u4ec0\u4e48\uff1a</strong>\u8bb0\u5f55 LCP / CLS \u57fa\u7ebf\u3002')}
  </ul>`),
}

const sanitize = (html) =>
  html.replace(/<\/?motion-layout\b[^>]*>/g, (tag) => (tag.startsWith('</') ? '</div>' : '<div>'))

for (const [name, html] of Object.entries(files)) {
  fs.writeFileSync(path.join(dir, name), sanitize(html), 'utf8')
  console.log('ok', name)
}
