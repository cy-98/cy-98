export function mountOverlay(root: HTMLElement): void {
  root.replaceChildren()
  const inner = document.createElement('div')
  inner.className = 'ui-inner'
  inner.innerHTML = `
    <header class="hero glass">
      <p class="eyebrow">星夜湖 · 借火岩</p>
      <h1>才越 <span class="handle">@cy-98</span></h1>
      <p class="lead">主观视角行舟湖上，面前老君与青凝，借火岩在望。编程、摄影与 3D 实验。</p>
      <nav class="links" aria-label="主要链接">
        <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
        <a href="https://docs.page/cy-98/cy-docs" target="_blank" rel="noreferrer">随笔</a>
        <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
    <section class="panel glass" aria-labelledby="hint-heading">
      <h2 id="hint-heading">场景说明</h2>
      <p class="hint">滚轮可略加快行舟。插画分层可替换 <code>public/scene/*.webp</code>。</p>
      <label class="sound-toggle">
        <input type="checkbox" id="sound-toggle" disabled />
        <span>水声（即将推出，默认关闭）</span>
      </label>
    </section>
    <footer class="footer glass">
      <p>本地：<code>docker compose up</code></p>
      <p><a href="https://cy-98.github.io/cy-98/">cy-98.github.io/cy-98</a></p>
    </footer>
  `
  root.appendChild(inner)
}
