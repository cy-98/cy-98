import { LORE } from '../scene/lore'
import { isLakeSoundEnabled, setLakeSoundEnabled } from '../scene/ambient-sound'

export interface OverlayOptions {
  displayMode: 'webgl' | 'static'
  simpleModeChecked: boolean
  simpleModeLocked: boolean
  reducedMotion: boolean
  soundAvailable: boolean
  onSimpleModeChange: (enabled: boolean) => void
  onSoundChange: (enabled: boolean) => void
}

export function mountOverlay(root: HTMLElement, options: OverlayOptions): void {
  const lockedHint = options.simpleModeLocked
    ? '<span class="mode-hint">（由系统减动效或低性能设备自动启用，取消时将询问是否强制动态场景）</span>'
    : ''

  const reducedHint = options.reducedMotion
    ? '<p class="mode-note">检测到「减少动态效果」偏好，动画已自动减弱。</p>'
    : ''

  const specsHref = `${import.meta.env.BASE_URL}specs/index.html`
  const soundChecked = isLakeSoundEnabled()
  const soundDisabled = !options.soundAvailable || options.displayMode !== 'webgl'
  const soundHint = soundDisabled
    ? options.displayMode !== 'webgl'
      ? '（动态模式下可用）'
      : '（当前环境不支持）'
    : '（很轻，建议戴耳机）'

  root.replaceChildren()
  const inner = document.createElement('div')
  inner.className = 'ui-inner'
  inner.innerHTML = `
    <header class="hero glass">
      <p class="eyebrow">${LORE.place}</p>
      <h1>才越 <span class="handle">@cy-98</span></h1>
      <p class="lead">${LORE.lead}</p>
      <nav class="links" aria-label="主要链接">
        <a href="https://cy-98.github.io/markdown-cv/" target="_blank" rel="noreferrer">简历</a>
        <a href="https://docs.page/cy-98/cy-docs" target="_blank" rel="noreferrer">随笔</a>
        <a href="https://github.com/cy-98" target="_blank" rel="noreferrer">GitHub</a>
      </nav>
    </header>
    <section class="panel glass" aria-labelledby="hint-heading">
      <h2 id="hint-heading">场景说明</h2>
      <p class="hint">${LORE.hint}</p>
      ${reducedHint}
      <label class="simple-mode-toggle">
        <input type="checkbox" id="simple-mode-toggle" ${options.simpleModeChecked ? 'checked' : ''} />
        <span>简洁模式（静态渐变背景，省资源）${lockedHint}</span>
      </label>
      <p class="mode-status">当前：${options.displayMode === 'webgl' ? '动态 WebGL（星空 + 湖面）' : '静态背景'}</p>
      <label class="sound-toggle${soundDisabled ? ' sound-toggle--disabled' : ''}">
        <input type="checkbox" id="sound-toggle" ${soundChecked ? 'checked' : ''} ${soundDisabled ? 'disabled' : ''} />
        <span>湖面环境音${soundHint}</span>
      </label>
    </section>
    <footer class="footer glass">
      <p>本地：<code>docker compose up</code></p>
      <p><a href="${specsHref}">开发 Spec</a> · <a href="https://cy-98.github.io/cy-98/">cy-98.github.io/cy-98</a></p>
    </footer>
  `

  root.appendChild(inner)

  const toggle = inner.querySelector<HTMLInputElement>('#simple-mode-toggle')
  toggle?.addEventListener('change', () => {
    options.onSimpleModeChange(toggle.checked)
  })

  const soundToggle = inner.querySelector<HTMLInputElement>('#sound-toggle')
  soundToggle?.addEventListener('change', () => {
    if (soundToggle.disabled) return
    setLakeSoundEnabled(soundToggle.checked)
    options.onSoundChange(soundToggle.checked)
  })

  let idleTimer = 0
  const onActivity = () => {
    inner.classList.remove('ui-inner--idle')
    window.clearTimeout(idleTimer)
    idleTimer = window.setTimeout(() => inner.classList.add('ui-inner--idle'), 4500)
  }
  window.addEventListener('pointermove', onActivity, { passive: true })
  window.addEventListener('keydown', onActivity)
  onActivity()
}
