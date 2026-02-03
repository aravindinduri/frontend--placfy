import { motion } from 'framer-motion'

const chips = [
  'Talent Intelligence',
  'Workflow Automation',
  'Lead Management',
  'Client Tracking',
  'Project Management',
  'Employee Management',
  'Digital Onboarding',
  'Timesheet Tracking',
  'Invoice Generation',
  'Bulk Messaging',
  'Team Collaboration',
  'Appointment Scheduling',
  'Task Management',
  'Real-time Dashboards',
]

function FeatureChips() {
  return (
    <section className="bg-gradient-to-b from-brand/5 to-transparent py-14 md:py-20">
      <div className="container-responsive text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-brand">Features</p>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-slate-900">Source, Manage, Sell – Your All‑in‑One Talent Solution</h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Streamline hiring, onboarding, workforce management, and revenue tracking in one unified platform.</p>
        <div className="relative mt-8 overflow-hidden">
          <motion.div
            className="flex gap-3"
            animate={{ x: ['0%', '-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...chips, ...chips].map((c, i) => (
              <span key={i} className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 shadow-sm">
                {c}
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default FeatureChips


