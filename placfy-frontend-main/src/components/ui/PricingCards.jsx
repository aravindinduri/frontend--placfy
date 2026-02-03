import { FiCheck } from 'react-icons/fi'

const defaultPlans = [
  {
    name: 'Starter',
    price: '₹0',
    period: '/mo',
    highlight: false,
    features: [
      'Up to 2 recruiters',
      'Basic ATS & HR features',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: '₹599',
    period: '/user/mo',
    highlight: true,
    features: [
      'Unlimited jobs',
      'CRM & Talent Community',
      'Automation & analytics',
      'Priority support',
    ],
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    highlight: false,
    features: [
      'SSO & advanced security',
      'Custom workflows',
      'Premium onboarding',
      'Dedicated success manager',
    ],
  },
]

function PricingCard({ plan }) {
  return (
    <div className={`flex flex-col rounded-2xl border p-6 shadow-sm ${plan.highlight ? 'border-brand bg-brand/5 shadow-md' : 'border-slate-100 bg-white'}`}>
      <div className="mb-4 flex items-end gap-2">
        <h3 className="text-xl font-semibold text-slate-900">{plan.name}</h3>
      </div>
      <div className="mb-4 text-3xl font-bold text-slate-900">{plan.price} <span className="text-base font-medium text-slate-500">{plan.period}</span></div>
      <ul className="mb-6 space-y-2 text-sm text-slate-700">
        {plan.features.map((f) => (
          <li key={f} className="flex items-start gap-2"><FiCheck className="mt-0.5 text-brand" /> {f}</li>
        ))}
      </ul>
      <button className={`mt-auto rounded-md px-4 py-2 text-sm ${plan.highlight ? 'bg-brand text-white hover:bg-brand-600' : 'border border-brand text-brand hover:bg-brand hover:text-white'}`}>Choose {plan.name}</button>
    </div>
  )
}

function PricingCards({ full = false, plans = defaultPlans }) {
  return (
    <div className={`grid gap-6 ${full ? 'md:grid-cols-3' : 'md:grid-cols-3'}`}>
      {plans.map((p) => (
        <PricingCard plan={p} key={p.name} />
      ))}
    </div>
  )
}

export default PricingCards
