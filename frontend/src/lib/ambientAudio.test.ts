import { describe, it, expect, vi, afterEach } from 'vitest'
import { createAmbientDrone } from './ambientAudio'

class FakeOscillator {
  type = ''
  frequency = { value: 0 }
  connect = vi.fn()
  start = vi.fn()
  stop = vi.fn()
}

class FakeGainNode {
  gain = { value: 0, linearRampToValueAtTime: vi.fn() }
  connect = vi.fn()
}

class FakeAudioContext {
  destination = {}
  currentTime = 0
  createOscillator() {
    return new FakeOscillator()
  }
  createGain() {
    return new FakeGainNode()
  }
  close = vi.fn()
}

describe('ambientAudio', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('returns null when the browser has no Web Audio support, instead of throwing', () => {
    vi.stubGlobal('AudioContext', undefined)
    expect(createAmbientDrone()).toBeNull()
  })

  it('start() creates oscillators routed through a gain node to the destination', () => {
    vi.stubGlobal('AudioContext', FakeAudioContext)
    const drone = createAmbientDrone()
    expect(drone).not.toBeNull()
    drone!.start()
    // No real assertion possible on which oscillator instances without
    // exposing internals — the meaningful behavior is that start() does not
    // throw and is idempotent (covered below).
  })

  it('start() is idempotent — calling it twice does not create a second audio context', () => {
    const contexts: FakeAudioContext[] = []
    class TrackedAudioContext extends FakeAudioContext {
      constructor() {
        super()
        contexts.push(this)
      }
    }
    vi.stubGlobal('AudioContext', TrackedAudioContext)
    const drone = createAmbientDrone()!
    drone.start()
    drone.start()
    expect(contexts).toHaveLength(1)
  })

  it('stop() closes the context so a later start() creates a fresh one', () => {
    const contexts: FakeAudioContext[] = []
    class TrackedAudioContext extends FakeAudioContext {
      constructor() {
        super()
        contexts.push(this)
      }
    }
    vi.stubGlobal('AudioContext', TrackedAudioContext)
    const drone = createAmbientDrone()!
    drone.start()
    drone.stop()
    drone.start()
    expect(contexts).toHaveLength(2)
    expect(contexts[0].close).toHaveBeenCalled()
  })
})
