import { createPortal } from 'react-dom'

const roles = [
  { label: 'HR', value: 'hr' },
  { label: 'Recruiter', value: 'recruiter' },
  { label: 'HR-Recruiter', value: 'hr-recruiter' },
];

export default function RolePickerModal({ open, onClose, onSelect }) {
  if (!open) return null
  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-center text-xl font-semibold text-slate-900">Sign up as</h3>
        <div className="grid gap-3">
          {roles.map((r) => (
            <button
              key={r.value}
              onClick={() => onSelect(r.value)}
              className="w-full rounded-lg border border-slate-200 bg-white p-3 text-slate-700 shadow-sm transition hover:-translate-y-0.5 hover:border-brand hover:text-brand"
            >
              {r.label}
            </button>
          ))}
        </div>
        <button className="mt-4 w-full rounded-lg border border-slate-200 bg-slate-50 p-2 text-sm text-slate-600 hover:bg-slate-100" onClick={onClose}>Cancel</button>
      </div>
    </div>,
    document.body,
  )
}


