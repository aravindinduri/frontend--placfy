const defaultTestimonials = [
  {
    name: 'Arvind K.',
    title: 'Senior Talent Acquisition Specialist',
    quote: 'Clean UI, unified ATS+CRM, and end‑to‑end visibility ideal for staffing teams.',
  },
  {
    name: 'Dhaval J.',
    title: 'Senior Staffing Manager',
    quote: 'Integrated features deliver fast, accurate results comparable to major portals.',
  },
  {
    name: 'Gajagouni S.',
    title: 'Research Analyst',
    quote: 'Unique reporting in a single dashboard helps leaders review results quickly.',
  },
]

import { motion } from 'framer-motion'

function Testimonials({ title = 'Used by leading HR teams worldwide', testimonials = defaultTestimonials }) {
  return (
    <section className="bg-slate-50 py-16">
      <div className="container-responsive">
        <div className="mx-auto mb-10 max-w-2xl text-center">
          <div className="inline-block rounded-full border border-brand/20 bg-white px-3 py-1 text-xs text-brand">Testimonials</div>
          <h2 className="mt-3 text-3xl font-bold text-gradient">{title}</h2>
        </div>
        {/* Desktop/tablet: three vertical lanes, continuous in one direction */}
        <div className="hidden gap-6 md:grid md:grid-cols-3">
          {[0,1,2].map((col) => (
            <div key={col} className="relative h-[420px] overflow-hidden rounded-2xl bg-gradient-to-b from-brand/10 to-accent/5 p-3">
              <motion.div
                className="flex h-max flex-col gap-4"
                animate={{ y: col === 1 ? ['-50%','0%'] : ['0%','-50%'] }}
                transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
              >
                {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                  <div key={`${t.name}-${col}-${i}`} className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                    <p className="text-slate-700">{t.quote}</p>
                    <div className="mt-4 text-sm">
                      <p className="font-semibold text-slate-900">{t.name}</p>
                      <p className="text-slate-500">{t.title}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            </div>
          ))}
        </div>

        {/* Mobile: single-card horizontal marquee */}
        <div className="md:hidden overflow-hidden rounded-2xl bg-gradient-to-b from-brand/10 to-accent/5 p-3">
          <motion.div
            className="flex w-max gap-4"
            animate={{ x: ['0%','-50%'] }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
              <div key={`${t.name}-m-${i}`} className="w-72 shrink-0 rounded-2xl border border-slate-100 bg-white p-6 shadow-sm">
                <p className="text-slate-700">{t.quote}</p>
                <div className="mt-4 text-sm">
                  <p className="font-semibold text-slate-900">{t.name}</p>
                  <p className="text-slate-500">{t.title}</p>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}

export default Testimonials
