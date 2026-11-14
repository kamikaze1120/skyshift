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
        className="rounded border border-starlight/30 px-3 py-1 text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
      >
        {isPlaying ? 'Pause' : 'Play'}
      </button>
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
        className="h-2 flex-1 cursor-pointer rounded-full bg-starlight/20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent-amber"
      >
        <div
          className="h-2 rounded-full bg-accent-amber"
          style={{ width: `${(currentIndex / Math.max(1, maxIndex)) * 100}%` }}
        />
      </div>
    </div>
  )
}

export default PlaybackScrubber
