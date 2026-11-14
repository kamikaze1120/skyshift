import { motion } from 'framer-motion'

interface NarrativeOverlayProps {
  text: string
  reducedMotion: boolean
}

const MS_PER_CHAR = 35

function NarrativeOverlay({ text, reducedMotion }: NarrativeOverlayProps) {
  // The full text is always present in the DOM (accessible immediately,
  // readable by screen readers and findable by tests); only the visual
  // reveal is animated, via a clip-path inset rather than mutating text
  // content, so reduced-motion is a pure CSS/variant swap, not a rewrite.
  return (
    <motion.p
      key={reducedMotion ? 'reduced' : 'motion'}
      className="text-lg leading-relaxed text-starlight"
      initial={reducedMotion ? false : { clipPath: 'inset(0 100% 0 0)' }}
      animate={{ clipPath: 'inset(0 0% 0 0)' }}
      transition={reducedMotion ? { duration: 0 } : { duration: (text.length * MS_PER_CHAR) / 1000, ease: 'linear' }}
    >
      {text}
    </motion.p>
  )
}

export default NarrativeOverlay
