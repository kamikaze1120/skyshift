export interface AmbientDrone {
  start: () => void
  stop: () => void
}

type AudioContextCtor = new () => AudioContext

function getAudioContextCtor(): AudioContextCtor | null {
  const w = window as unknown as { AudioContext?: AudioContextCtor; webkitAudioContext?: AudioContextCtor }
  return w.AudioContext ?? w.webkitAudioContext ?? null
}

// Two slightly detuned low sine tones — a soft, non-musical "space hum,"
// not a licensed audio asset, so there's nothing to source or clear rights for.
const DRONE_FREQUENCIES_HZ = [110, 111.5]
const FADE_IN_SECONDS = 2
const DRONE_GAIN = 0.04

export function createAmbientDrone(): AmbientDrone | null {
  const maybeCtor = getAudioContextCtor()
  if (!maybeCtor) return null
  const Ctor: AudioContextCtor = maybeCtor

  let context: AudioContext | null = null
  let oscillators: OscillatorNode[] = []

  function start() {
    if (context) return
    context = new Ctor()
    const gain = context.createGain()
    gain.gain.value = 0
    gain.connect(context.destination)
    oscillators = DRONE_FREQUENCIES_HZ.map(freq => {
      const osc = context!.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      osc.connect(gain)
      osc.start()
      return osc
    })
    gain.gain.linearRampToValueAtTime(DRONE_GAIN, context.currentTime + FADE_IN_SECONDS)
  }

  function stop() {
    if (!context) return
    oscillators.forEach(osc => osc.stop())
    context.close()
    context = null
    oscillators = []
  }

  return { start, stop }
}
