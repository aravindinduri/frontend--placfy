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
  
  // Fallback content if API fails
  const defaultContent = {
    content: {
      home: {
        hero: {
          friendlyText: "🎯 AI-Powered Hiring",
          title: "Empower your team to hire smarter and manage better",
          subtitle: "AI-powered talent acquisition and HR management platform",
          ctaPrimaryText: "Get Started",
          ctaSecondaryText: "Book Demo",
          hrLoginText: "HR Login",
          recruiterLoginText: "Recruiter Login",
          heroImage: ""
        },
        productSuite: {
          title: "Our Products",
          subtitle: "Comprehensive solutions for talent acquisition and HR management",
          features: [
            { title: "Applicant Tracking", desc: "Manage candidates efficiently", icon: "FaBriefcase" },
            { title: "CRM", desc: "Build lasting candidate relationships", icon: "FaHandshake" },
            { title: "HR Management", desc: "Streamline HR operations", icon: "FaChartLine" },
            { title: "Recruitment", desc: "Find the best talent", icon: "FaNetworkWired" }
          ]
        },
        stats: {
          title: "Trusted by industry leaders",
          stats: [
            { value: "500+", label: "Companies", suffix: "", icon: "FaUsers" },
            { value: "50K+", label: "Placements", suffix: "", icon: "FaUserCircle" },
            { value: "100+", label: "Integrations", suffix: "", icon: "FaPlug" },
            { value: "99%", label: "Success Rate", suffix: "", icon: "FaTrophy" }
          ]
        },
        pricingTeaser: {
          title: "Simple, transparent pricing",
          subtitle: "Choose the plan that fits your needs",
          buttonText: "View Pricing"
        },
        pricing: {
          plans: []
        },
        testimonials: {
          title: "What our users say",
          testimonials: []
        },
        faq: {
          title: "Frequently Asked Questions",
          faqs: []
        },
        beforeAfter: {}
      }
    }
  };

  const contentData = content || defaultContent;
  const { hero, productSuite, stats, pricingTeaser, testimonials, pricing, faq, beforeAfter } = contentData.content.home;


  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-r from-blue-50 via-indigo-50 to-white">
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl"></div>
        </div>
        
        <div className="grid md:grid-cols-2 md:py-32 py-16 relative z-10 gap-0">
          <div className="container-responsive flex items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-white/80 backdrop-blur px-3 py-1 text-xs text-blue-600 shadow-sm">
                <FaCheckCircle /> {hero.friendlyText}
              </div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-900">
                {hero.title}
              </h1>
              <p className="max-w-prose text-slate-600 text-base">
                {hero.subtitle}
              </p>
              <div className="flex flex-wrap gap-3 pt-4">
                <motion.button
                  onClick={() => setRoleModal('signup')}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-primary group flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {hero.ctaPrimaryText}
                  <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                    <FaArrowRight />
                  </motion.span>
                </motion.button>
                <motion.button
                  onClick={() => setShowDemo(true)}
                  whileHover={{ scale: 1.05, borderColor: '#5146f2' }}
                  whileTap={{ scale: 0.98 }}
                  className="btn-outline transition-all duration-300"
                >
                  {hero.ctaSecondaryText}
                </motion.button>
              </div>
              <div className="flex items-center gap-8 pt-6 text-sm text-slate-600">
                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><FaUserShield className="text-blue-600" /> {hero.hrLoginText}</div>
                <div className="flex items-center gap-2 hover:text-slate-900 transition-colors"><FaUserTie className="text-blue-600" /> {hero.recruiterLoginText}</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1, y: [0, -20, 0] }}
            transition={{ 
              opacity: { duration: 0.6, delay: 0.1 },
              y: { duration: 4, repeat: Infinity, ease: "easeInOut" }
            }}
            className="relative w-full h-full min-h-[500px] flex items-center justify-center pr-4 md:pr-8"
          >
            <div className="relative w-full h-full rounded-2xl overflow-hidden shadow-2xl border-2 border-slate-200 p-1">
              <img 
                src="/landing.jpg" 
                alt="Placfy Dashboard" 
                className="w-full h-full object-cover rounded-xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent rounded-xl"></div>
            </div>
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
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group rounded-2xl border border-slate-100 bg-white p-6 shadow-lg transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:border-brand/30 cursor-pointer"
              style={{ transitionDelay: `${idx * 100}ms` }}
            >
              <div className="mb-4 inline-block rounded-xl bg-gradient-to-br from-brand/10 to-brand-secondary/10 p-3 transition-all duration-300 group-hover:scale-125 group-hover:from-brand/20 group-hover:to-brand-secondary/20">
                <Icon className="h-6 w-6 text-brand transition-all duration-300 group-hover:rotate-12" style={{ color: '#5146f2' }} />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-slate-900 transition-colors duration-300 group-hover:text-brand">{f.title}</h3>
              <p className="text-slate-600 transition-colors duration-300 group-hover:text-slate-700">{f.desc}</p>
            </motion.div>
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

      {/* Easy-to-use Recruitment Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4 transition-colors duration-300">
                  Easy-to-use Recruitment Software
                </h2>
                <p className="text-slate-600 mb-6 transition-colors duration-300">
                  Placify platform is simple yet powerful, accessible and relevant to all recruiters.
                </p>
                <ul className="space-y-4">
                  {[{title: 'Customizable pipeline', desc: 'Customize your recruitment pipeline based on your process'}, {title: 'Kanban board', desc: 'Get an overview of your recruitment progressions in one single board view'}].map((item, idx) => (
                    <motion.li
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 group cursor-pointer p-2 rounded-lg transition-all duration-300 hover:bg-brand/5"
                    >
                      <motion.div
                        className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1 transition-all duration-300 group-hover:bg-brand/20 group-hover:scale-110"
                        whileHover={{ rotate: 360 }}
                        transition={{ type: 'spring', stiffness: 200 }}
                      >
                        <FaCheckCircle className="text-brand transition-colors duration-300" style={{ color: '#5146f2' }} />
                      </motion.div>
                      <div>
                        <h4 className="font-semibold text-slate-900 transition-colors duration-300 group-hover:text-brand">{item.title}</h4>
                        <p className="text-sm text-slate-600 transition-colors duration-300 group-hover:text-slate-700">{item.desc}</p>
                      </div>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/RecruitmentDP.jpg" 
                    alt="Recruitment Dashboard Preview" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Job Posting Channels Section */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg">
                <div className="bg-white rounded-xl p-4 h-64 md:h-80 flex flex-wrap items-center justify-center gap-4">
                  <div className="text-2xl">🌐</div>
                  <div className="text-2xl">📱</div>
                  <div className="text-2xl">💼</div>
                  <div className="text-2xl">🔗</div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Post your jobs on 2,500+ Free & Premium Channels
                </h2>
                <p className="text-slate-600 mb-6">
                  Share your job openings on 2,500+ free and premium job boards, social platforms, and integrated natively.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    2,500+ job boards: Global, local and specialized free platforms
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    20+ social media platforms, including LinkedIn, Facebook, Twitter, GitHub, Medium
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    Native integration for Job boards built in
                  </li>
                </ul>
                <motion.button
                  className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try it For Free
                </motion.button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AI Screening Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  AI-Powered Screening & Interviews
                </h2>
                <p className="text-slate-600 mb-6">
                  Scale your screening by conducting unlimited candidate interviews with automated screening around the clock.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">24/7 Interview Availability</h4>
                      <p className="text-sm text-slate-600">Launch an intelligent agent to facilitate standardized, automated screening around the clock</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Instant Candidate Assessments</h4>
                      <p className="text-sm text-slate-600">Receive AI-powered evaluations directly in Placify to compare all applicants consistently</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/AIInterview.jpg" 
                    alt="AI Interview Interface" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Chat with Data Using AI Section */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/chatdashboard.jpg" 
                    alt="AI Chat Dashboard" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Chat with Your Data Using AI
                </h2>
                <p className="text-slate-600 mb-6">
                  Connect your Placify account to AI tools like ChatGPT, Claude, and Gemini. Use prompts to find insights, summarize candidates, and write emails using your recruitment data.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Supercharge Your AI</h4>
                      <p className="text-sm text-slate-600">Securely link Placify to your favorite AI to analyze candidates, write emails using your live data</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Get Instant Answers</h4>
                      <p className="text-sm text-slate-600">Ask specific questions about your talent pool, e.g., "Is John Doe a good fit for our Software Engineer role?" and get instant answers</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* AI Recommendations Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  AI-Powered Recommendations
                </h2>
                <p className="text-slate-600 mb-6">
                  Placify AI Engine simplifies the entire hiring process by identifying the best candidates for your job while automizing redundant tasks.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Matching recommendations</h4>
                      <p className="text-sm text-slate-600">Score candidates' profiles based on job requirements to facilitate the screening process</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Candidates' profiles enrichment</h4>
                      <p className="text-sm text-slate-600">Fetch candidate profiles with LinkedIn and other social media platforms for better matching recommendations</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/AIrecomondations.jpg" 
                    alt="AI Recommendations" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Candidate Profiles Enrichment Section */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/ProfilesEnrichment.jpg" 
                    alt="Enriched Candidate Profiles" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Candidates' Profiles Enrichment
                </h2>
                <p className="text-slate-600 mb-6">
                  Collect insights beyond resume. Placify AI Engine browses the web in search of data on 20+ social media and public platforms to automatically enrich candidates' profiles.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    Data enrichment done seamlessly during the candidate creation
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    20+ social and public platforms, including LinkedIn, Facebook, Twitter, GitHub, Medium and many more
                  </li>
                </ul>
                <motion.button
                  className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try it For Free
                </motion.button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Progressive Mobile Application */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Progressive Mobile Application
                </h2>
                <p className="text-slate-600 mb-6">
                  Access Placify from your computer, phone, or tablet to ensure you never miss any activity, wherever you are.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Recruit on the go</h4>
                      <p className="text-sm text-slate-600">Access Placify from any device to stay updated on recruitment progress</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Push Notifications</h4>
                      <p className="text-sm text-slate-600">Get notified for reminders, and specific events</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/WebApp2.jpg" 
                    alt="Mobile Application" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Branded Career Page */}
      <section className="py-14 md:py-20 bg-slate-50">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 relative">
                  <img 
                    src="/CareerPage.jpg" 
                    alt="Career Page Builder" 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
            <Reveal delay={0.1}>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Customize or Link your Branded Career Page
                </h2>
                <p className="text-slate-600 mb-6">
                  Build your unique branded career page to attract top talent and proudly communicate who you are to talent. Showcase your company culture and display your unique value proposition.
                </p>
                <ul className="space-y-3 mb-8">
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    No development required: Connect your custom domain and customize your page with zero-technical resources needed
                  </li>
                  <li className="flex items-center gap-2 text-slate-700">
                    <div className="w-2 h-2 rounded-full bg-brand" style={{ backgroundColor: '#5146f2' }}></div>
                    Fast setup and compatibility with all web platforms: WordPress, Wix, Squarespace, and others
                  </li>
                </ul>
                <motion.button
                  className="btn-primary shadow-lg hover:shadow-xl transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Try it For Free
                </motion.button>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Candidate Onboarding Section */}
      <section className="py-14 md:py-20 bg-white">
        <div className="container-responsive">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
            <Reveal>
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                  Candidate Onboarding & Placement Management
                </h2>
                <p className="text-slate-600 mb-6">
                  Track and manage every step of the employee experience, from beginning to end. Leverage the full potential of Placify's recruitment software and ATS to place the best candidates.
                </p>
                <ul className="space-y-4">
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Onboarding Management</h4>
                      <p className="text-sm text-slate-600">Streamline the onboarding process with document checklist, secure data sharing, and automated workflows</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-3">
                    <div className="rounded-full bg-brand/10 p-2 flex-shrink-0 mt-1">
                      <FaCheckCircle className="text-brand" style={{ color: '#5146f2' }} />
                    </div>
                    <div>
                      <h4 className="font-semibold text-slate-900">Placement Tracking</h4>
                      <p className="text-sm text-slate-600">Full visibility on candidate progression through every stage of the employment experience</p>
                    </div>
                  </li>
                </ul>
              </div>
            </Reveal>
            <Reveal delay={0.1}>
              <motion.div
                className="rounded-2xl border border-slate-100 bg-gradient-to-br from-brand/5 to-accent/5 p-6 shadow-lg transition-all duration-300 hover:shadow-2xl hover:border-brand/30 cursor-pointer group"
                whileHover={{ y: -10 }}
              >
                <div className="bg-white rounded-xl overflow-hidden h-64 md:h-80 flex items-center justify-center relative">
                  <img 
                    src="/employee-onboarding.jpg" 
                    alt="Onboarding Workflow" 
                    className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              </motion.div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Pricing teaser */}
      <section className="bg-slate-50 py-14 md:py-20">
        <div className="container-responsive text-center">
          <Reveal>
            <h2 className="mb-4 text-2xl font-bold text-gradient">{pricingTeaser.title}</h2>
            <p className="mx-auto mb-8 max-w-2xl text-slate-600">{pricingTeaser.subtitle}</p>
          </Reveal>
          <Reveal delay={0.1}>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link to="/pricing" className="btn-primary inline-flex gap-2 shadow-lg hover:shadow-xl transition-all duration-300">
                {pricingTeaser.buttonText}
                <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                  <FaArrowRight />
                </motion.span>
              </Link>
            </motion.div>
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