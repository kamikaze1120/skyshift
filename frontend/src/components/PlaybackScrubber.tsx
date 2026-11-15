interface PlaybackScrubberProps {
  observationCount: number
  currentIndex: number
  isPlaying: boolean
  onIndexChange: (index: number) => void
  onPlayPauseToggle: () => void
  epochLabels?: string[]
}

function PlaybackScrubber({
  observationCount,
  currentIndex,
  isPlaying,
  onIndexChange,
  onPlayPauseToggle,
  epochLabels,
}: PlaybackScrubberProps) {
  const maxIndex = observationCount - 1
  const currentLabel = epochLabels?.[currentIndex]

  function handleKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight' || event.key === 'ArrowUp') {
      event.preventDefault()
      onIndexChange(Math.min(maxIndex, currentIndex + 1))
    } else if (event.key === 'ArrowLeft' || event.key === 'ArrowDown') {
      event.preventDefault()
      onIndexChange(Math.max(0, currentIndex - 1))
    } else if (event.key === 'Home') {
      event.preventDefault()
      onIndexChange(0)
    } else if (event.key === 'End') {
      event.preventDefault()
      onIndexChange(maxIndex)
    }
  }

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    const fraction = rect.width > 0 ? (event.clientX - rect.left) / rect.width : 0
    const index = Math.round(Math.min(1, Math.max(0, fraction)) * maxIndex)
    onIndexChange(index)
  }

  return (
    <div className="flex items-center gap-3">
      <button
        type="button"
        onClick={onPlayPauseToggle}
        className="grid size-10 shrink-0 place-items-center rounded-full border border-orbit/25 bg-orbit/10 text-orbit transition hover:scale-105 hover:bg-orbit/15 focus-visible:outline-2 focus-visible:outline-orbit"
        aria-label={isPlaying ? 'Pause sequence' : 'Play sequence'}
      >
        {isPlaying ? (
          <svg viewBox="0 0 20 20" className="size-4" aria-hidden="true"><path d="M7 6v8M13 6v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
        ) : (
          <svg viewBox="0 0 20 20" className="ml-0.5 size-4" aria-hidden="true"><path d="m7 5 8 5-8 5Z" fill="currentColor" /></svg>
        )}
      </button>
      <div className="min-w-0 flex-1">
        <div
          role="slider"
          tabIndex={0}
          aria-valuemin={0}
          aria-valuemax={maxIndex}
          aria-valuenow={currentIndex}
          aria-valuetext={currentLabel ? `Epoch ${currentIndex + 1} of ${observationCount}: ${currentLabel}` : undefined}
          aria-label="Observation epoch"
          onKeyDown={handleKeyDown}
          onPointerDown={handlePointerDown}
          className="group relative h-5 cursor-pointer focus-visible:outline-2 focus-visible:outline-orbit"
        >
          <div className="absolute inset-x-0 top-2 h-1 rounded-full bg-starlight/10">
            <div className="h-1 rounded-full bg-gradient-to-r from-lilac to-orbit" style={{ width: `${(currentIndex / Math.max(1, maxIndex)) * 100}%` }} />
          </div>
          {Array.from({ length: observationCount }, (_, index) => (
            <span
              key={index}
              className={`absolute top-[5px] size-2.5 -translate-x-1/2 rounded-full border transition ${index <= currentIndex ? 'border-orbit bg-orbit shadow-[0_0_8px_rgba(152,232,255,.6)]' : 'border-moon/20 bg-space-800'}`}
              style={{ left: `${(index / Math.max(1, maxIndex)) * 100}%` }}
            />
          ))}
        </div>
        <div className="mt-1 flex justify-between text-[9px] text-moon/35">
          <span>{epochLabels?.[0]?.slice(0, 10)}</span>
          <span>{epochLabels?.[maxIndex]?.slice(0, 10)}</span>
        </div>
      </div>
      <span className="hidden min-w-12 text-right text-[10px] tabular-nums text-moon/45 sm:block">{currentIndex + 1} / {observationCount}</span>
    </div>
  )
}

export default PlaybackScrubber
