import './drift/drift-base.css'
import { createDriftShell } from './drift/shell'
import { bootDriftEmbed, type SiteBootstrapHandle } from './drift/site-bootstrap'

export interface DriftBackgroundHandle {
  dispose: () => void
}

/** 在个人站背景层直接启动 Drift（引用 web/drift 子模块源码）。 */
export async function mountDriftBackground(container: HTMLElement): Promise<DriftBackgroundHandle> {
  const shell = createDriftShell()
  container.replaceChildren(shell)

  let boot: SiteBootstrapHandle | null = null
  try {
    boot = await bootDriftEmbed(shell)
  } catch (err) {
    console.error('[site] Drift background failed', err)
    shell.querySelector('.drift-webgl-error')?.classList.add('show')
  }

  return {
    dispose() {
      boot?.dispose()
      shell.remove()
    },
  }
}
