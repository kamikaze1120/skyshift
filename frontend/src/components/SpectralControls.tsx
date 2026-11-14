import { useMemo } from 'react'

export interface SpectralControlsProps {
  channel?: number
  onChannelChange?: (channel: number) => void
}

const BANDS = [
  { id: 1, start: 0.75, end: 1.09, channels: 18, color: '#c9b8ff' },
  { id: 2, start: 1.10, end: 1.62, channels: 18, color: '#9dd9ff' },
  { id: 3, start: 1.63, end: 2.41, channels: 17, color: '#8ee8d0' },
  { id: 4, start: 2.42, end: 3.82, channels: 17, color: '#f5d18b' },
  { id: 5, start: 3.83, end: 4.41, channels: 16, color: '#f1a878' },
  { id: 6, start: 4.42, end: 5.00, channels: 16, color: '#e98caa' },
]

function findBand(channel: number) {
  let count = 0
  for (const band of BANDS) {
    count += band.channels
    if (channel <= count) return band
  }
  return BANDS.at(-1)!
}

function firstChannelForBand(bandId: number) {
  return BANDS.slice(0, bandId - 1).reduce((total, band) => total + band.channels, 0) + 1
}

function SpectralControls({ channel = 51, onChannelChange }: SpectralControlsProps) {
  const activeBand = useMemo(() => findBand(channel), [channel])
  const channelPosition = ((channel - 1) / 101) * 100

  function updateChannel(value: number) {
    onChannelChange?.(value)
  }

  return (
    <section className="border-t border-starlight/10 px-4 py-4 sm:px-5" aria-labelledby="spectral-lens-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="micro-label text-moon/35">02 · Wavelength</p>
          <h2 id="spectral-lens-title" className="mt-1 text-sm text-starlight">Move through the infrared</h2>
        </div>
        <div className="text-right">
          <p className="micro-label text-moon/30">Selected</p>
          <p className="mt-1 text-xs tabular-nums" style={{ color: activeBand.color }}>CH {String(channel).padStart(3, '0')}</p>
        </div>
      </div>

      <div className="mt-3 rounded-2xl border border-starlight/10 bg-starlight/[.025] p-3">
        <div className="flex items-center justify-between gap-3 text-[9px]">
          <span className="text-moon/45">102 channels</span>
          <span className="tabular-nums" style={{ color: activeBand.color }}>
            Band {activeBand.id} · {activeBand.start.toFixed(2)}–{activeBand.end.toFixed(2)} µm
          </span>
        </div>

        <div className="relative mt-4 h-8" data-channel-count="102">
          <div className="absolute inset-x-0 top-1 flex h-5 overflow-hidden rounded-full border border-starlight/10 bg-black/25">
            {BANDS.map(band => (
              <div
                key={band.id}
                className="flex items-center justify-center text-[7px] font-medium uppercase tracking-[.12em] text-space-950/70"
                style={{ width: `${(band.channels / 102) * 100}%`, backgroundColor: band.color }}
              >
                B{band.id}
              </div>
            ))}
          </div>
          <span
            className="pointer-events-none absolute top-0 z-10 h-7 w-0.5 rounded-full bg-starlight shadow-[0_0_10px_rgba(255,255,255,.75)]"
            style={{ left: `calc(${channelPosition}% - 1px)` }}
            aria-hidden="true"
          />
          <input
            type="range"
            min="1"
            max="102"
            value={channel}
            onChange={event => updateChannel(Number(event.target.value))}
            role="presentation"
            aria-label="Spectral channel"
            className="absolute inset-x-0 top-0 h-7 w-full cursor-pointer opacity-0"
          />
        </div>

        <div className="flex justify-between text-[8px] tabular-nums text-moon/30">
          <span>CH 001 · 0.75 µm</span>
          <span>CH 102 · 5.00 µm</span>
        </div>
      </div>

      <div className="mt-3 grid grid-cols-3 gap-1.5">
        {BANDS.map(band => (
          <button
            key={band.id}
            type="button"
            onClick={() => updateChannel(firstChannelForBand(band.id))}
            className={`rounded-lg border px-2 py-2 text-left transition focus-visible:outline-1 focus-visible:outline-accent-ember ${activeBand.id === band.id ? 'border-starlight/25 bg-starlight/[.07]' : 'border-starlight/[.07] bg-starlight/[.02] hover:bg-starlight/[.05]'}`}
          >
            <span className="block text-[9px] text-moon/60">B{band.id}</span>
            <span className="mt-1 block text-[9px] tabular-nums text-moon/35">{band.start.toFixed(2)}–{band.end.toFixed(2)} µm</span>
          </button>
        ))}
      </div>
      <p className="mt-3 text-[9px] leading-relaxed text-moon/35">
        Drag the marker for a channel, or choose a band. Each step is one detector sample—not another epoch.
      </p>
    </section>
  )
}

export default SpectralControls
