import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')!

app.innerHTML = `
  <header class="hero">
    <p class="eyebrow">Personal site</p>
    <h1>才越 <span class="handle">@cy-98</span></h1>
    <p class="lead">编程与摄影。本站将逐步加入 3D 与动效实验。</p>
    <nav class="links" aria-label="主要链接">
      <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
      <a href="https://docs.page/cy-98/cy-docs" target="_blank" rel="noreferrer">随笔</a>
      <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
    </nav>
  </header>
  <section class="panel" aria-labelledby="stack-heading">
    <h2 id="stack-heading">技术栈（规划中）</h2>
    <ul>
      <li>Vite + TypeScript</li>
      <li>GitHub Pages 部署</li>
      <li>Three.js / glTF（后续）</li>
    </ul>
  </section>
  <footer class="footer">
    <p>本地预览：<code>docker compose up</code> → <code>http://localhost:5173/</code></p>
    <p>线上地址：<a href="https://cy-98.github.io/cy-98/">cy-98.github.io/cy-98</a></p>
  </footer>
`
