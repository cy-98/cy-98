const DEFAULT_DRIFT_URL = 'https://cy-98.github.io/drift/'

export interface DriftBackgroundHandle {
  dispose: () => void
}

/** 全屏 iframe 嵌入 Drift，作为个人站背景层。 */
export function mountDriftBackground(
  container: HTMLElement,
  url = import.meta.env.VITE_DRIFT_URL ?? DEFAULT_DRIFT_URL,
): DriftBackgroundHandle {
  const iframe = document.createElement('iframe')
  iframe.id = 'drift-bg'
  iframe.src = url
  iframe.title = 'Drift — 星际漫游'
  iframe.setAttribute('allow', 'fullscreen')
  iframe.loading = 'eager'
  iframe.tabIndex = -1
  container.replaceChildren(iframe)

  return {
    dispose() {
      iframe.remove()
    },
  }
}
