import { useForm } from 'react-hook-form'
import { FiMail, FiUser, FiMessageSquare, FiSend } from 'react-icons/fi'
import { useGetPageContentQuery } from '../../utils/api'

function Contact() {
  const { register, handleSubmit, reset } = useForm()
  const { data, isLoading } = useGetPageContentQuery('contact')
  const onSubmit = (data) => {
    console.log('contact', data)
    reset()
  }

  if (isLoading || !data) {
    return <div>Loading...</div>
  }

  const { title, subtitle } = data.content;

  return (
    <section className="container-responsive py-16 md:py-20">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-100 bg-white p-6 shadow-xl sm:p-8">
        <h2 className="mb-2 text-center text-2xl font-bold text-gradient">{title}</h2>
        <p className="mb-6 text-center text-sm text-slate-600">{subtitle}</p>
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium">Name</label>
            <div className="relative">
              <FiUser className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none ring-brand/30 focus:border-brand focus:ring" placeholder="Your name" {...register('name')} />
            </div>
          </div>
          <div className="sm:col-span-1">
            <label className="mb-1 block text-sm font-medium">Email</label>
            <div className="relative">
              <FiMail className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="email" className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none ring-brand/30 focus:border-brand focus:ring" placeholder="you@company.com" {...register('email')} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Message</label>
            <div className="relative">
              <FiMessageSquare className="pointer-events-none absolute left-3 top-3 text-slate-400" />
              <textarea rows="5" className="w-full rounded-md border border-slate-200 bg-white py-2.5 pl-10 pr-3 outline-none ring-brand/30 focus:border-brand focus:ring" placeholder="How can we help?" {...register('message')} />
            </div>
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary w-full sm:w-auto"><FiSend /> Send message</button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default Contact
