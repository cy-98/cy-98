/** 带精确指针的设备（典型 PC 鼠标）— 背景仅观赏，不接管操作。 */
export const DESKTOP_POINTER_MQ = '(hover: hover) and (pointer: fine)'

export function isDesktopPointer(): boolean {
  return window.matchMedia(DESKTOP_POINTER_MQ).matches
}

export function syncDesktopPassiveClass(): void {
  document.documentElement.classList.toggle('site-desktop-passive', isDesktopPointer())
}

export function onDesktopPointerChange(listener: () => void): () => void {
  const mq = window.matchMedia(DESKTOP_POINTER_MQ)
  mq.addEventListener('change', listener)
  return () => mq.removeEventListener('change', listener)
}
