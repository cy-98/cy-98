const SOUND_KEY = 'cy98-lake-sound'

export function isLakeSoundEnabled(): boolean {
  return localStorage.getItem(SOUND_KEY) === '1'
}

export function setLakeSoundEnabled(enabled: boolean): void {
  localStorage.setItem(SOUND_KEY, enabled ? '1' : '0')
}

/** 程序化湖面环境音（极轻，需用户勾选） */
export class LakeAmbientSound {
  private ctx: AudioContext | null = null
  private gain: GainNode | null = null
  private nodes: AudioNode[] = []

  start(): void {
    if (this.ctx) return
    const Ctx = window.AudioContext ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
    if (!Ctx) return

    this.ctx = new Ctx()
    this.gain = this.ctx.createGain()
    this.gain.gain.value = 0
    this.gain.connect(this.ctx.destination)

    const bufferSize = 2 * this.ctx.sampleRate
    const noise = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate)
    const data = noise.getChannelData(0)
    let last = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      last = (last + 0.02 * white) / 1.02
      data[i] = last * 2.8
    }

    const source = this.ctx.createBufferSource()
    source.buffer = noise
    source.loop = true

    const low = this.ctx.createBiquadFilter()
    low.type = 'lowpass'
    low.frequency.value = 420
    low.Q.value = 0.6

    const high = this.ctx.createBiquadFilter()
    high.type = 'highpass'
    high.frequency.value = 80

    source.connect(high)
    high.connect(low)
    low.connect(this.gain)
    source.start(0)

    this.nodes = [source, high, low]
    void this.fadeTo(0.045)
  }

  async fadeTo(level: number): Promise<void> {
    if (!this.ctx || !this.gain) return
    if (this.ctx.state === 'suspended') await this.ctx.resume()
    const t = this.ctx.currentTime
    this.gain.gain.cancelScheduledValues(t)
    this.gain.gain.setValueAtTime(this.gain.gain.value, t)
    this.gain.gain.linearRampToValueAtTime(level, t + 1.2)
  }

  stop(): void {
    void this.fadeTo(0)
    window.setTimeout(() => this.dispose(), 1400)
  }

  dispose(): void {
    for (const n of this.nodes) {
      try {
        if ('stop' in n && typeof n.stop === 'function') n.stop()
      } catch {
        /* already stopped */
      }
      n.disconnect()
    }
    this.nodes = []
    void this.ctx?.close()
    this.ctx = null
    this.gain = null
  }
}
