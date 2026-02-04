import Reveal from '../../ui/Reveal.jsx'
import { useState } from 'react'
import { FiChevronDown } from 'react-icons/fi'

const defaultFaqs = [
  { question: 'What is Placfy?', answer: 'Placfy is a talent platform that unifies ATS, CRM, and HR management to streamline hiring and workforce operations.' },
  { question: 'Who is Placfy for?', answer: 'Recruitment teams, HR leaders, and staffing firms looking to run sourcing, onboarding, and reporting in one place.' },
  { question: 'Is it easy to set up and use?', answer: 'Yes. Teams can get started quickly with guided onboarding and clean, intuitive workflows.' },
  { question: 'Can I integrate with my existing tools?', answer: 'Yes. Placfy is built to integrate with common HR and hiring tools. API-ready.' },
]

function Item({ question, answer }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm">
      <button className="flex w-full items-center justify-between text-left" onClick={() => setOpen((v) => !v)}>
        <span className="text-base font-semibold text-slate-900">{question}</span>
        <FiChevronDown className={`transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="mt-3 text-slate-600">{answer}</p>}
    </div>
  )
}

function FAQ({ title = 'FAQs: Your Guide to Placfy', faqs = defaultFaqs }) {
  return (
    <section className="container-responsive py-16 md:py-20">
      <Reveal>
        <div className="mx-auto mb-8 max-w-3xl text-center">
          <div className="inline-block rounded-full border border-brand/20 bg-white px-3 py-1 text-xs text-brand">FAQ</div>
          <h1 className="mt-3 text-3xl font-bold text-gradient">{title}</h1>
          <p className="mt-2 text-slate-600">Find quick answers to pricing, support, onboarding, and more.</p>
        </div>
      </Reveal>
      <div className="mx-auto grid max-w-3xl gap-4">
        {faqs.map((f, i) => (
          <Reveal key={f.question} delay={i * 0.08}><Item question={f.question} answer={f.answer} /></Reveal>
        ))}
      </div>
    </section>
  )
}

export default FAQ
