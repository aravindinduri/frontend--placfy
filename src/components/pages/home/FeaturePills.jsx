import { motion } from 'framer-motion'
import Reveal from '../../ui/Reveal.jsx'

const pills = [
  'Talent Intelligence', 'Workflow Automation', 'Lead Management', 'Client Tracking', 'Sales Pipeline',
  'Project Management', 'Employee Management', 'Digital Onboarding', 'Timesheet Tracking', 'Invoice Generation',
  'Bulk Messaging', 'Team Collaboration', 'Appointment Scheduling', 'Task Management', 'Real-time Dashboards',
]

function Track({ reverse = false, speed = 28 }) {
  return (
    <div className="relative overflow-hidden py-2">
      <motion.div
        className="flex gap-2"
        animate={{ x: reverse ? ['-50%', '0%'] : ['0%', '-50%'] }}
        transition={{ duration: speed, repeat: Infinity, ease: 'linear' }}
      >
        {[...pills, ...pills].map((p, i) => (
          <span key={`${p}-${i}`} className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-sm whitespace-nowrap">{p}</span>
        ))}
      </motion.div>
    </div>
  )
}

function FeaturePills() {
  return (
    <section className="bg-gradient-to-b from-brand/5 to-white py-12">
      <div className="container-responsive text-center">
        <Reveal className="mx-auto max-w-3xl">
          <div className="inline-block rounded-full border border-brand/20 bg-white px-3 py-1 text-xs text-brand">Features</div>
          <h2 className="mt-3 text-3xl font-bold text-gradient">Source, Manage, Sell — your all‑in‑one talent solution</h2>
          <p className="mt-2 text-slate-600">Streamline hiring, onboarding, workforce management, and revenue tracking.</p>
        </Reveal>
        <div className="mt-8">
          <Track />
          <Track reverse speed={30} />
        </div>
      </div>
    </section>
  )
}

export default FeaturePills


