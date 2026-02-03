function TestimonialsTeaser() {
  return (
    <section className="bg-slate-50 py-14 md:py-20">
      <div className="container-responsive text-center">
        <p className="mb-2 inline-block rounded-full border border-brand/20 bg-white px-3 py-1 text-xs font-medium text-brand">Testimonials</p>
        <h2 className="mx-auto max-w-3xl text-3xl font-bold text-slate-900">Used by Leading HR Teams <span className="bg-gradient-to-r from-brand to-accent bg-clip-text text-transparent">Worldwide</span></h2>
        <p className="mx-auto mt-3 max-w-2xl text-slate-600">Join teams transforming their recruitment process — one hire at a time.</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[1,2,3].map((i) => (
            <div key={i} className="rounded-2xl border border-slate-100 bg-white p-5 text-left shadow-sm">
              <p className="text-sm text-slate-700">“Clean UI and unified ATS + CRM helped us increase recruiter productivity and visibility across the funnel.”</p>
              <div className="mt-4 text-sm font-semibold text-slate-900">Senior Talent Acquisition Specialist</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsTeaser


