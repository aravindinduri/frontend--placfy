import { motion } from 'framer-motion'

const leftTags = [
  'Resume Matching',
  'Talent Analytics',
  'AI Sourcing',
  'Lost Context',
  'Duplicate Entry',
  'Missed Follow-Ups',
  'CRM Automation',
]

const rightTags = [
  'Scheduling',
  'CRM Automation',
  'Offer Letters',
  'Job Distribution',
  'Resume Matching',
  'AI Sourcing',
  'Talent Analytics',
]

function Tag({ children }) {
  return (
    <span className="rounded-full border border-slate-200 bg-white/90 px-3 py-1 text-xs text-slate-700 shadow-sm">
      {children}
    </span>
  )
}

function Orbit({ children, reverse = false, duration = 22 }) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={{ rotate: reverse ? -360 : 360 }}
      transition={{ repeat: Infinity, ease: 'linear', duration }}
      style={{ transformOrigin: '50% 50%' }}
    >
      {children}
    </motion.div>
  )
}

function OrbitShowcase() {
  return (
    <section className="py-14 md:py-20">
      <div className="container-responsive">
        <div className="grid gap-6 md:grid-cols-2">
          {/* Before */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-center text-xl font-semibold text-slate-900">Before Placfy</h3>
            <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100">
              <div className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-md" />
              <Orbit>
                <div className="absolute left-1/2 top-0 -translate-x-1/2"><Tag>{leftTags[0]}</Tag></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2"><Tag>{leftTags[1]}</Tag></div>
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2"><Tag>{leftTags[2]}</Tag></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2"><Tag>{leftTags[3]}</Tag></div>
              </Orbit>
              <Orbit reverse duration={28}>
                <div className="absolute left-[15%] top-[18%]"><Tag>{leftTags[4]}</Tag></div>
                <div className="absolute right-[18%] top-[22%]"><Tag>{leftTags[5]}</Tag></div>
                <div className="absolute right-[20%] bottom-[20%]"><Tag>{leftTags[6]}</Tag></div>
              </Orbit>
            </div>
          </div>

          {/* After */}
          <div className="rounded-3xl border border-slate-100 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-center text-xl font-semibold text-slate-900">After Placfy</h3>
            <div className="relative mx-auto aspect-square max-w-sm overflow-hidden rounded-2xl bg-gradient-to-br from-brand/10 via-accent/10 to-transparent">
              <div className="absolute left-1/2 top-1/2 z-10 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand shadow-lg" />
              <Orbit>
                <div className="absolute left-1/2 top-0 -translate-x-1/2"><Tag>{rightTags[0]}</Tag></div>
                <div className="absolute right-0 top-1/2 -translate-y-1/2"><Tag>{rightTags[1]}</Tag></div>
                <div className="absolute left-1/2 bottom-0 -translate-x-1/2"><Tag>{rightTags[2]}</Tag></div>
                <div className="absolute left-0 top-1/2 -translate-y-1/2"><Tag>{rightTags[3]}</Tag></div>
              </Orbit>
              <Orbit reverse duration={26}>
                <div className="absolute left-[15%] top:[18%]"><Tag>{rightTags[4]}</Tag></div>
                <div className="absolute right-[18%] top-[22%]"><Tag>{rightTags[5]}</Tag></div>
                <div className="absolute right-[20%] bottom-[20%]"><Tag>{rightTags[6]}</Tag></div>
              </Orbit>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default OrbitShowcase


