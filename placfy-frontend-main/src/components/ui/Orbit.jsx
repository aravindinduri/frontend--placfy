import { motion } from 'framer-motion'

function Badge({ children, className = '' }) {
  return (
    <div className={`rounded-full bg-white/90 px-3 py-1 text-xs shadow ${className}`}>{children}</div>
  )
}

/*
  Orbit: radial orbit animation where labels stay readable.
  Props:
    items: array of strings for badges around the circle
    size: px size of the orbit container
    duration: rotation duration in seconds
    reverse: rotate opposite direction
*/
function Orbit({ items = [], size = 360, duration = 20, center = null, reverse = false }) {
  const radius = size / 2 - 24
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      <motion.div
        className="absolute inset-0"
        animate={{ rotate: reverse ? -360 : 360 }}
        transition={{ ease: 'linear', duration, repeat: Infinity }}
        style={{ borderRadius: '9999px' }}
      >
        {items.map((label, idx) => {
          const angle = (idx / items.length) * Math.PI * 2
          const x = Math.cos(angle) * radius + radius
          const y = Math.sin(angle) * radius + radius
          return (
            <motion.div
              key={label}
              className="absolute"
              style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
              animate={{ rotate: reverse ? 360 : -360 }}
              transition={{ ease: 'linear', duration, repeat: Infinity }}
            >
              <Badge>{label}</Badge>
            </motion.div>
          )
        })}
      </motion.div>
      <motion.div
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        animate={{ scale: [1, 1.04, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      >
        {center || <div className="h-24 w-24 rounded-full bg-gradient-to-br from-brand/30 to-accent/40 shadow-lg" />}
      </motion.div>
    </div>
  )
}

export default Orbit


