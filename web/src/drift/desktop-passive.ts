/** 个人站嵌入 Drift — 各端背景均为被动观赏，不接管操作。 */
export function isEmbedPassive(): boolean {
  return true
}

export function syncEmbedPassiveClass(): void {
  document.documentElement.classList.add('site-embed-passive')
}
