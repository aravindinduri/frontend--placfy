import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiTarget, FiUsers, FiTrendingUp, FiAward, FiZap, FiShield, FiCheckCircle, FiHeart } from 'react-icons/fi'
import BookDemo from './BookDemo'
import { useGetPageContentQuery } from '../../utils/api'
import { defaultAboutContent } from '../admin/sidebar-pages/defaultContent.js';

const iconMap = {
    FiTarget, FiUsers, FiTrendingUp, FiAward, FiZap, FiShield, FiCheckCircle, FiHeart
}

function About() {
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState({})
  const [showBookDemo, setShowBookDemo] = useState(false)
  const { data, isLoading } = useGetPageContentQuery('about')

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible((prev) => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  if (isLoading || !data) {
    return <div>Loading...</div>
  }



  const aboutContentFromServer = data?.content?.about || {};

  const aboutContent = {
      hero: { ...defaultAboutContent.hero, ...aboutContentFromServer.hero },
      stats: aboutContentFromServer.stats || defaultAboutContent.stats,
      mission: { ...defaultAboutContent.mission, ...aboutContentFromServer.mission },
      values: aboutContentFromServer.values || defaultAboutContent.values,
      features: {
          ...defaultAboutContent.features,
          ...aboutContentFromServer.features,
          features: aboutContentFromServer.features?.features || defaultAboutContent.features.features,
      },
      cta: { ...defaultAboutContent.cta, ...aboutContentFromServer.cta },
  };

  const { hero, stats, mission, values, features, cta } = aboutContent;

  return (
    <div className="bg-gradient-to-b from-white to-slate-50">
      {/* Hero Section */}
      <section className="container-responsive py-16 md:py-24">
        <div
          id="hero"
          data-animate
          className={`mx-auto max-w-4xl text-center`}
        >
          <h1 className="mb-4 text-4xl font-bold text-gradient md:text-5xl lg:text-6xl">
            {hero.title}
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-slate-600 md:text-xl">
            {hero.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              type="button"
              onClick={() => navigate('/signup')}
              className="btn-primary group"
            >
              {hero.ctaPrimary}
              <FiZap className="transition-transform group-hover:scale-110" />
            </button>
            <button 
              type="button"
              onClick={() => setShowBookDemo(true)}
              className="rounded-lg border-2 border-brand px-6 py-3 font-semibold text-brand transition-all hover:bg-brand hover:text-white"
            >
              {hero.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="container-responsive py-12 md:py-16">
        <div
          id="stats"
          data-animate
          className={`grid gap-6 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {stats.map((stat, idx) => {
            const Icon = iconMap[stat.icon];
            return (
                <div
                key={idx}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                style={{ transitionDelay: `${idx * 100}ms` }}
                >
                <Icon className={`mb-3 h-10 w-10 ${stat.color} transition-transform group-hover:scale-110`} />
                <div className="mb-1 text-3xl font-bold text-slate-900">{stat.value}</div>
                <div className="text-sm text-slate-600">{stat.label}</div>
                </div>
            )
          })}
        </div>
      </section>

      {/* Mission Section */}
      <section className="container-responsive py-12 md:py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-2 lg:gap-12">
            <div
              id="mission"
              data-animate
              className={`flex flex-col justify-center`}
            >
              <h2 className="mb-4 text-3xl font-bold text-gradient md:text-4xl">{mission.title}</h2>
              <p className="mb-4 text-lg text-slate-600">
                {mission.p1}
              </p>
              <p className="text-lg text-slate-600">
                {mission.p2}
              </p>
            </div>
            <div
              id="mission-img"
              data-animate
              className={``}
            >
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-blue-50 to-purple-50 p-8 shadow-xl">
                <div className="grid grid-cols-2 gap-4">
                  {values.map((value, idx) => {
                    const Icon = iconMap[value.icon];
                    return (
                        <div
                        key={idx}
                        className="flex items-start gap-3 rounded-lg bg-white p-4 shadow-sm transition-all duration-300 hover:shadow-md"
                        >
                        <Icon className="mt-1 h-5 w-5 flex-shrink-0 text-brand" />
                        <span className="text-sm font-medium text-slate-700">{value.text}</span>
                        </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container-responsive py-12 md:py-20">
        <div
          id="features-header"
          data-animate
          className={`mb-12 text-center`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gradient md:text-4xl">{features.title}</h2>
          <p className="mx-auto max-w-2xl text-lg text-slate-600">
            {features.subtitle}
          </p>
        </div>
        <div
          id="features"
          data-animate
          className={`mx-auto grid max-w-6xl gap-6 sm:grid-cols-2 lg:grid-cols-4`}
        >
          {features.features.map((feature, idx) => {
            const Icon = iconMap[feature.icon];
            return (
                <div
                key={idx}
                className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
                style={{ transitionDelay: `${idx * 100}ms` }}
                >
                <div className="mb-4 inline-block rounded-xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 p-3 transition-all duration-300 group-hover:scale-110">
                    <Icon className="h-6 w-6 text-brand" />
                </div>
                <h3 className="mb-2 text-xl font-bold text-slate-900">{feature.title}</h3>
                <p className="text-slate-600">{feature.description}</p>
                </div>
            )
          })}
        </div>
      </section>

      {/* CTA Section */}
      <section className="container-responsive py-16 md:py-20">
        <div
          id="cta"
          data-animate
          className={`mx-auto max-w-4xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-2xl md:p-12`}
        >
          <h2 className="mb-4 text-3xl font-bold text-gradient md:text-4xl">
            {cta.title}
          </h2>
          <p className="mb-8 text-lg text-slate-600">
            {cta.subtitle}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button 
              type="button"
              onClick={() => navigate('/signup')}
              className="group rounded-lg bg-brand px-8 py-3 font-semibold text-white transition-all hover:scale-105 hover:shadow-xl"
            >
              {cta.ctaPrimary}
              <FiZap className="inline transition-transform group-hover:scale-110" />
            </button>
            <button 
              type="button"
              onClick={() => setShowBookDemo(true)}
              className="rounded-lg border-2 border-brand px-8 py-3 font-semibold text-brand transition-all hover:bg-brand hover:text-white"
            >
              {cta.ctaSecondary}
            </button>
          </div>
        </div>
      </section>

      {/* Book Demo Modal */}
      <BookDemo open={showBookDemo} onClose={() => setShowBookDemo(false)} />
    </div>
  )
}

export default About