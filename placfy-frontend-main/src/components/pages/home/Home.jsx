import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Link, useNavigate } from 'react-router-dom'
import { FaUserTie, FaUserShield, FaArrowRight, FaCheckCircle, FaUsers, FaUserCircle, FaPlug, FaTrophy, FaBriefcase, FaHandshake, FaChartLine, FaNetworkWired } from 'react-icons/fa'
import RoleSelectModal from '../../ui/RoleSelectModal.jsx'
import FeaturePills from './FeaturePills.jsx'
import BeforeAfter from './BeforeAfter.jsx'
import Testimonials from './Testimonials.jsx'
import PricingCards from '../../ui/PricingCards.jsx'
import FAQ from './FAQ.jsx'
import Reveal from '../../ui/Reveal.jsx'
import BookDemo from './BookDemo.jsx'
import { useGetPageContentQuery } from '../../utils/api.js'

const iconMap = {
  FaBriefcase,
  FaHandshake,
  FaChartLine,
  FaNetworkWired,
  FaUsers,
  FaUserCircle,
  FaPlug,
  FaTrophy,
};


function AnimatedStat({ value, label, suffix = '', icon, duration = 2000 }) {
  const [count, setCount] = useState(0)
  const [hasAnimated, setHasAnimated] = useState(false)
  const ref = useRef(null)
  const Icon = iconMap[icon];


      useEffect(() => {
      const currentRef = ref.current; // Capture ref.current here
  
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            const numericValue = parseInt(value.replace(/\D/g, ''))
            const startTime = Date.now()
            
            const animate = () => {
              const now = Date.now()
              const progress = Math.min((now - startTime) / duration, 1)
              
              // Easing function for smooth animation
              const easeOutQuart = 1 - Math.pow(1 - progress, 4)
              const current = Math.floor(easeOutQuart * numericValue)
              
              setCount(current)
              
              if (progress < 1) {
                requestAnimationFrame(animate)
              }
            }
            
            animate()
          }
        },
        { threshold: 0.3 }
      )
  
      if (currentRef) {
        observer.observe(currentRef)
      }
  
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef)
        }
      }
    }, [value, duration, hasAnimated])
  return (
    <div ref={ref} className="text-center">
      <Icon className="text-2xl text-brand mx-auto mb-2" style={{ color: '#5146f2' }} />
      <div className="text-2xl md:text-3xl font-bold text-slate-900">
        {count.toLocaleString()}{suffix}
      </div>
      <div className="text-xs uppercase tracking-wider text-slate-500 mt-1">{label}</div>
    </div>
  )
}

function Home() {
  const [roleModal, setRoleModal] = useState(null) // 'login' | 'signup'
  const [showDemo, setShowDemo] = useState(false)
  const [isVisible, setIsVisible] = useState({})
  const navigate = useNavigate()
  const { data: content, isLoading } = useGetPageContentQuery('home');

  // Intersection Observer for scroll animations
  useEffect(() => {
    if (!content) return; // Guard against running before content is loaded

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

    const elementsToObserve = document.querySelectorAll('[data-animate]');
    elementsToObserve.forEach((el) => {
      observer.observe(el)
    })

    return () => {
      elementsToObserve.forEach((el) => {
        observer.unobserve(el);
      });
      observer.disconnect()
    }
  }, [content])

  const handleRoleSelect = (role) => {
    const target = roleModal === 'signup' ? '/signup' : '/login'
    setRoleModal(null)
    navigate(`${target}?role=${role}`)
  }
  
  if (isLoading || !content) {
    return <div>Loading...</div>;
  }
  
  const { hero, productSuite, stats, pricingTeaser, testimonials, pricing, faq, beforeAfter } = content.content.home;


  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand/5 via-white to-white">
        <div className="container-responsive grid items-center gap-12 py-16 md:grid-cols-2 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-brand/20 bg-white px-3 py-1 text-xs text-brand shadow-sm">
              <FaCheckCircle /> {hero.friendlyText}
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-gradient sm:text-5xl">
              {hero.title}
            </h1>
            <p className="max-w-prose text-slate-600">
              {hero.subtitle}
            </p>
            <div className="flex flex-wrap gap-3">
              <button onClick={() => setRoleModal('signup')} className="btn-primary">
                {hero.ctaPrimaryText} <FaArrowRight />
              </button>
              <button onClick={() => setShowDemo(true)} className="btn-outline">
                {hero.ctaSecondaryText}
              </button>
            </div>
            <div className="flex items-center gap-6 pt-2 text-sm text-slate-600">
              <div className="flex items-center gap-2"><FaUserShield className="text-brand" /> {hero.hrLoginText}</div>
              <div className="flex items-center gap-2"><FaUserTie className="text-brand" /> {hero.recruiterLoginText}</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative mx-auto w-full max-w-xl"
          >
            <div className="aspect-[4/3] sm:aspect-[4/3] rounded-2xl border border-slate-100 bg-white p-3 sm:p-4 shadow-xl">
              <div className="relative h-full w-full rounded-xl bg-gradient-to-br from-brand/15 via-accent/10 to-transparent flex flex-col items-center justify-center overflow-hidden">
                <motion.div
                initial={{ scale: 0.8, y: 0 }}
                animate={{
                  scale: [0.8, 1.1, 0.8],
                  y: [0, -10, 0]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="text-[8rem] sm:text-[12rem] md:text-[14rem] lg:text-[16rem] 
                          sm:translate-y-0 -translate-y-4"
                style={{ color: '#5146f2' }}
              >
                <FaUserTie />
              </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, 20]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatDelay: 0,
                    times: [0, 0.15, 0.75, 0.85],
                    ease: "easeInOut"
                  }}
                  className="absolute bottom-12 sm:bottom-10 md:bottom-8 text-xl sm:text-2xl font-bold"
                  style={{ color: '#5146f2' }}
                >
                  HR
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ 
                    opacity: [0, 1, 1, 0],
                    y: [20, 0, 0, 20]
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatDelay: 0,
                    times: [0, 0.15, 0.75, 0.85],
                    ease: "easeInOut",
                    delay: 3
                  }}
                  className="absolute bottom-12 sm:bottom-10 md:bottom-8 text-xl sm:text-2xl font-bold"
                  style={{ color: '#5146f2' }}
                >
                  Recruiter
                </motion.div>
                <div className="absolute bottom-3 sm:bottom-2 text-xs sm:text-sm font-medium text-slate-500">
                  Friendly
                </div>
              </div>
            </div>
            <img src={hero.heroImage} alt="Placfy" className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 h-12 w-12 sm:h-16 sm:w-16 rounded-lg shadow-lg" />
          </motion.div>
        </div>
      </section>

      {/* Product suite */}
      <section className="container-responsive py-14 md:py-20">
        <Reveal>
          <h2 className="mb-2 text-center text-2xl font-bold text-gradient">{productSuite.title}</h2>
          <p className="mx-auto mb-8 max-w-2xl text-center text-slate-600">{productSuite.subtitle}</p>
        </Reveal>
        <div
          id="platform-features"
          data-animate
          className={`grid gap-6 md:grid-cols-4 transition-all duration-1000 delay-200 ${
            isVisible['platform-features'] ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}
        >
          {productSuite.features.map((f, idx) => {
            const Icon = iconMap[f.icon];
            return (
            <div
              key={f.title}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-2 hover:shadow-xl"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="mb-4 inline-block rounded-xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 p-3 transition-all duration-300 group-hover:scale-110">
                <Icon className="h-6 w-6 text-brand" style={{ color: '#5146f2' }} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900">{f.title}</h3>
              <p className="text-slate-600">{f.desc}</p>
            </div>
          )})}
        </div>
        
        {/* Updated Stats Section with Icons */}
        <div className="mt-16">
          <h3 className="text-center text-base md:text-lg font-semibold text-slate-900 mb-8">
            {stats.title}
          </h3>
          <div className="grid gap-6 grid-cols-2 md:grid-cols-4 max-w-4xl mx-auto">
            {stats.stats.map((stat, index) => (
              <Reveal key={index} delay={0.12 * (index + 1)}>
                <AnimatedStat 
                  value={stat.value} 
                  label={stat.label} 
                  suffix={stat.suffix} 
                  icon={stat.icon}
                  duration={2000} 
                />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <FeaturePills />

      <BeforeAfter {...beforeAfter} />

      {/* Pricing teaser */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="container-responsive text-center">
          <Reveal>
            <h2 className="mb-4 text-2xl font-bold text-gradient">{pricingTeaser.title}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-slate-600">{pricingTeaser.subtitle}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <Link to="/pricing" className="btn-primary inline-flex">
              {pricingTeaser.buttonText} <FaArrowRight />
            </Link>
          </Reveal>
          <div className="mt-10">
            <Reveal>
              <PricingCards plans={pricing.plans} />
            </Reveal>
          </div>
        </div>
      </section>

      <FAQ {...faq} />
      <Testimonials {...testimonials} />

      {/* Modals */}
      <RoleSelectModal 
        open={!!roleModal} 
        onClose={() => setRoleModal(null)} 
        onSelect={handleRoleSelect} 
        title={roleModal === 'signup' ? 'Sign up as' : 'Sign in aaaa'} 
      />
      
      <BookDemo open={showDemo} onClose={() => setShowDemo(false)} />
    </div>
  )
}

export default Home