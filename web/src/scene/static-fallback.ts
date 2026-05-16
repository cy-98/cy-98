export interface StaticFallbackHandle {
  dispose: () => void
}

export function mountStaticFallback(
  container: HTMLElement,
  reason: 'preference' | 'simple' | 'webgl-failed',
): StaticFallbackHandle {
  const el = document.createElement('div')
  el.id = 'static-fallback'
  el.className = 'static-fallback static-fallback--css'
  el.setAttribute('role', 'img')
  el.setAttribute('aria-label', '星夜湖静态背景：夜空繁星与深色湖面')

  const badge = document.createElement('p')
  badge.className = 'static-fallback__badge'
  const reasonText =
    reason === 'webgl-failed'
      ? 'WebGL 不可用，已切换静态背景'
      : reason === 'simple'
        ? '简洁模式：静态背景'
        : '已根据系统偏好或设备性能使用静态背景'
  badge.textContent = reasonText

  el.append(badge)
  container.insertBefore(el, container.firstChild)

  return {
    dispose() {
      el.remove()
    },
  }
}
