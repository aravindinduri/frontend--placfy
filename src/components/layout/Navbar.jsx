import { useState, useRef } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { FiMenu, FiX, FiUserCheck, FiChevronDown } from 'react-icons/fi'
import { 
  FaClipboardList, 
  FaHandshake, 
  FaUsers, 
  FaBriefcase, 
  FaBullseye, 
  FaPlug, 
  FaMagic, 
  FaRobot,
  FaUserTie,
  FaBolt,
  FaLaptopCode,
  FaIndustry,
  FaShoppingBag,
  FaDna,
  FaNewspaper,
  FaCalendarAlt,
  FaCheckCircle,
  FaSyncAlt,
  FaLock,
  FaBook,
  FaChartBar,
  FaCode,
  FaQuestionCircle,
  FaFileAlt,
  FaInfoCircle,
  FaUserFriends,
  FaDollarSign,
  FaUserShield,
  FaPhone
} from 'react-icons/fa'
import RoleSelectModal from '../ui/RoleSelectModal.jsx'

const productItems = [
  {
    icon: FaClipboardList,
    title: 'Applicant Tracking System',
    description: 'Streamline job posting, screening, and interview scheduling with AI-powered automation.',
    to: '/product/ats'
  },
  {
    icon: FaHandshake,
    title: 'Customer Relation Management',
    description: 'Manage client interactions, sales pipelines, and business opportunities in one place.',
    to: '/product/crm'
  },
  {
    icon: FaUsers,
    title: 'Human Resource Management',
    description: 'Simplify employee onboarding, performance tracking, and workforce operations.',
    to: '/product/hrm'
  },
  {
    icon: FaBriefcase,
    title: 'Candidate Relationship',
    description: 'Nurture talent pools and engage candidates proactively with smart communication tools.',
    to: '/product/candidate-relationship'
  },
  {
    icon: FaBullseye,
    title: 'Talent Recruitment',
    description: 'Connect with recruiters, share jobs, and collaborate across a global hiring network.',
    to: '/product/talent-recruitment'
  },
  {
    icon: FaPlug,
    title: 'Marketplace Apps',
    description: 'Enhance your platform with plug-and-play integrations from job boards, tools, and services.',
    to: '/product/marketplace'
  },
  {
    icon: FaMagic,
    title: 'Generative AI',
    description: 'Leverage AI to auto-generate emails, job descriptions, and personalized outreach.',
    to: '/product/generative-ai'
  },
  {
    icon: FaRobot,
    title: 'Talent AI',
    description: 'Match the right candidates to the right roles using intelligent algorithms and insights.',
    to: '/product/talent-ai'
  }
]

const solutionItems = [
  {
    icon: FaUserTie,
    title: 'Staffing and Consulting',
    description: 'Accelerate placements and manage client-candidate relationships with AI-powered workflows.',
    to: '/solution/staffing'
  },
  {
    icon: FaBolt,
    title: 'Public Utilities',
    description: 'Streamline workforce hiring and compliance for critical infrastructure and government services.',
    to: '/solution/public-utilities'
  },
  {
    icon: FaLaptopCode,
    title: 'High Tech',
    description: 'Hire top technical talent faster with automation tailored for fast-paced innovation.',
    to: '/solution/high-tech'
  },
  {
    icon: FaIndustry,
    title: 'Manufacturing',
    description: 'Optimize blue- and white-collar hiring across plants, logistics, and engineering roles.',
    to: '/solution/manufacturing'
  },
  {
    icon: FaShoppingBag,
    title: 'Consumer Goods',
    description: 'Build agile teams for sales, marketing, and operations with data-driven recruitment.',
    to: '/solution/consumer-goods'
  },
  {
    icon: FaDna,
    title: 'Life Sciences',
    description: 'Source specialized talent for pharma, biotech, and healthcare with precision and compliance.',
    to: '/solution/life-sciences'
  }
]

const resourcesLearnItems = [
  {
    icon: FaNewspaper,
    title: 'Blog',
    description: 'Hiring tips and industry insights.',
    to: '/resources/blog'
  },
  {
    icon: FaCalendarAlt,
    title: 'Events & Webinars',
    description: 'Live and on-demand learning sessions.',
    to: '/resources/events'
  },
  {
    icon: FaCheckCircle,
    title: 'Case Studies',
    description: 'Success stories from real clients.',
    to: '/resources/case-studies'
  },
  {
    icon: FaSyncAlt,
    title: 'Product Updates',
    description: 'New features and improvements.',
    to: '/resources/updates'
  }
]

const resourcesSupportItems = [
  {
    icon: FaLock,
    title: 'Security',
    description: 'Your data is safe with us.',
    to: '/resources/security'
  },
  {
    icon: FaBook,
    title: 'Knowledge Base',
    description: 'How-to guides and help articles.',
    to: '/resources/knowledge-base'
  },
  {
    icon: FaChartBar,
    title: 'Status',
    description: 'Live platform status and uptime.',
    to: '/resources/status'
  },
  {
    icon: FaCode,
    title: 'API Docs',
    description: "Build with Oorwin's developer tools.",
    to: '/resources/api-docs'
  },
  {
    icon: FaQuestionCircle,
    title: 'Help Center',
    description: 'Get support or track your tickets.',
    to: '/resources/help-center'
  },
  {
    icon: FaFileAlt,
    title: 'Glossary',
    description: 'Key terms and platform definitions.',
    to: '/resources/glossary'
  }
]

const companyItems = [
  {
    icon: FaInfoCircle,
    title: 'About Us',
    description: 'Learn who we are and what drives us.',
    to: '/about'
  },
  {
    icon: FaBriefcase,
    title: 'Careers',
    description: 'Join our growing global team.',
    to: '/company/careers'
  },
  {
    icon: FaDollarSign,
    title: 'Pricing',
    description: 'Flexible plans for every business.',
    to: '/pricing'
  },
  {
    icon: FaUserFriends,
    title: 'Team',
    description: 'Meet the people behind Oorwin.',
    to: '/company/team'
  },
  {
    icon: FaHandshake,
    title: 'Become a Partner',
    description: 'Collaborate and grow with us.',
    to: '/company/partners'
  },
  {
    icon: FaUserShield,
    title: 'GDPR',
    description: 'Hiring tips and industry insights.',
    to: '/company/gdpr'
  },
  {
    icon: FaPhone,
    title: 'Contact us',
    description: 'Reach out for support or inquiries.',
    to: '/contact'
  }
]

function Navbar() {
  const [open, setOpen] = useState(false)
  const [productOpen, setProductOpen] = useState(false)
  const [solutionOpen, setSolutionOpen] = useState(false)
  const [resourcesOpen, setResourcesOpen] = useState(false)
  const [companyOpen, setCompanyOpen] = useState(false)
  const [resourcesTab, setResourcesTab] = useState('learn') // 'learn' or 'support'
  const [roleModal, setRoleModal] = useState(null)
  const navigate = useNavigate()
  
  const productTimeoutRef = useRef(null)
  const solutionTimeoutRef = useRef(null)
  const resourcesTimeoutRef = useRef(null)
  const companyTimeoutRef = useRef(null)

  const handleDropdownEnter = (setter, timeoutRef) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    setter(true)
  }

  const handleDropdownLeave = (setter, timeoutRef) => {
    timeoutRef.current = setTimeout(() => {
      setter(false)
    }, 200)
  }

  const handleRoleSelect = (role) => {
    const target = roleModal === 'signup' ? '/signup' : '/login'
    setRoleModal(null)
    setOpen(false)
    navigate(`${target}?role=${role}`)
  }

  return (
    <header className="sticky top-0 z-40 border-b border-slate-100 bg-white/80 backdrop-blur">
      <div className="container-responsive flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <img src="/Logo3.png" alt="Placfy" className="h-8 w-8 rounded" />
          <span className="text-xl font-bold tracking-wide text-brand">PLACFY</span>
        </Link>

        <nav className="hidden lg:flex items-center gap-6">
          {/* Home Link */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-brand ${isActive ? 'text-brand' : 'text-slate-600'}`
            }
          >
            Home
          </NavLink>

          {/* Product Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => handleDropdownEnter(setProductOpen, productTimeoutRef)} 
            onMouseLeave={() => handleDropdownLeave(setProductOpen, productTimeoutRef)}
          >
            <button 
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand transition-colors"
              onClick={() => setProductOpen(!productOpen)}
            >
              Product <FiChevronDown className={`transition-transform ${productOpen ? 'rotate-180' : ''}`} />
            </button>
            {productOpen && (
              <div className="absolute left-0 mt-2 w-[800px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-3">
                  {productItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink
                        key={idx}
                        to={item.to}
                        onClick={() => setProductOpen(false)}
                        className="flex gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <IconComponent className="text-2xl flex-shrink-0 text-brand" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Solution Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => handleDropdownEnter(setSolutionOpen, solutionTimeoutRef)} 
            onMouseLeave={() => handleDropdownLeave(setSolutionOpen, solutionTimeoutRef)}
          >
            <button 
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand transition-colors"
              onClick={() => setSolutionOpen(!solutionOpen)}
            >
              Solution <FiChevronDown className={`transition-transform ${solutionOpen ? 'rotate-180' : ''}`} />
            </button>
            {solutionOpen && (
              <div className="absolute left-0 mt-2 w-[800px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="grid grid-cols-2 gap-3">
                  {solutionItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink
                        key={idx}
                        to={item.to}
                        onClick={() => setSolutionOpen(false)}
                        className="flex gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <IconComponent className="text-2xl flex-shrink-0 text-brand" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                            {item.description}
                          </p>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Resources Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => handleDropdownEnter(setResourcesOpen, resourcesTimeoutRef)} 
            onMouseLeave={() => handleDropdownLeave(setResourcesOpen, resourcesTimeoutRef)}
          >
            <button 
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand transition-colors"
              onClick={() => setResourcesOpen(!resourcesOpen)}
            >
              Resources <FiChevronDown className={`transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
            </button>
            {resourcesOpen && (
              <div className="absolute left-0 mt-2 w-[480px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                {/* Tabs */}
                <div className="flex gap-2 mb-4">
                  <button
                    onClick={() => setResourcesTab('learn')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      resourcesTab === 'learn' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FaBook className="text-base" /> Learn
                  </button>
                  <button
                    onClick={() => setResourcesTab('support')}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      resourcesTab === 'support' ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <FaQuestionCircle className="text-base" /> Support
                  </button>
                </div>

                {/* Content */}
                <div className="space-y-2">
                  {resourcesTab === 'learn' ? (
                    <>
                      {resourcesLearnItems.map((item, idx) => {
                        const IconComponent = item.icon
                        return (
                          <NavLink
                            key={idx}
                            to={item.to}
                            onClick={() => setResourcesOpen(false)}
                            className="flex gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
                          >
                            <IconComponent className="text-xl flex-shrink-0 text-brand" />
                            <div className="flex-1">
                              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </NavLink>
                        )
                      })}
                    </>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      {resourcesSupportItems.map((item, idx) => {
                        const IconComponent = item.icon
                        return (
                          <NavLink
                            key={idx}
                            to={item.to}
                            onClick={() => setResourcesOpen(false)}
                            className="flex flex-col gap-2 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
                          >
                            <IconComponent className="text-xl text-brand" />
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                                {item.title}
                              </h3>
                              <p className="text-xs text-slate-600 mt-0.5">
                                {item.description}
                              </p>
                            </div>
                          </NavLink>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Pricing Link */}
          <NavLink
            to="/pricing"
            className={({ isActive }) =>
              `text-sm font-medium transition-colors hover:text-brand ${isActive ? 'text-brand' : 'text-slate-600'}`
            }
          >
            Pricing
          </NavLink>

          {/* Company Dropdown */}
          <div 
            className="relative" 
            onMouseEnter={() => handleDropdownEnter(setCompanyOpen, companyTimeoutRef)} 
            onMouseLeave={() => handleDropdownLeave(setCompanyOpen, companyTimeoutRef)}
          >
            <button 
              className="flex items-center gap-1 text-sm font-medium text-slate-700 hover:text-brand transition-colors"
              onClick={() => setCompanyOpen(!companyOpen)}
            >
              Company <FiChevronDown className={`transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
            </button>
            {companyOpen && (
              <div className="absolute left-0 mt-2 w-[420px] rounded-xl border border-slate-100 bg-white p-4 shadow-xl animate-in fade-in slide-in-from-top-2 duration-200">
                <div className="space-y-2">
                  {companyItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink
                        key={idx}
                        to={item.to}
                        onClick={() => setCompanyOpen(false)}
                        className="flex gap-3 rounded-lg p-3 hover:bg-slate-50 transition-colors group"
                      >
                        <IconComponent className="text-xl flex-shrink-0 text-brand" />
                        <div className="flex-1">
                          <h3 className="text-sm font-semibold text-slate-900 group-hover:text-brand transition-colors">
                            {item.title}
                          </h3>
                          <p className="text-xs text-slate-600 mt-0.5">
                            {item.description}
                          </p>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <button className="btn-outline text-sm" onClick={() => navigate('/signup')}>create workspace</button>
          {/* <button className="btn-primary text-sm" onClick={() => navigate('/signup')}>
            <FiUserCheck className="text-lg" /> Start for Free
          </button> */}
        </div>

        <button className="lg:hidden p-2" onClick={() => setOpen((v) => !v)} aria-label="Toggle menu">
          {open ? <FiX className="h-6 w-6" /> : <FiMenu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div className="lg:hidden border-t border-slate-100 bg-white">
          <div className="container-responsive py-3 space-y-2 max-h-[calc(100vh-4rem)] overflow-y-auto">
            {/* Home Link */}
            <NavLink
              to="/"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-700 hover:bg-slate-50'}`
              }
            >
              Home
            </NavLink>

            {/* Mobile Product Dropdown */}
            <div>
              <button
                onClick={() => setProductOpen(!productOpen)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Product</span>
                <FiChevronDown className={`transition-transform ${productOpen ? 'rotate-180' : ''}`} />
              </button>
              {productOpen && (
                <div className="ml-4 space-y-2 mt-2">
                  {productItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink 
                        key={idx}
                        to={item.to} 
                        onClick={() => { setProductOpen(false); setOpen(false); }} 
                        className="block rounded px-3 py-2 hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-2">
                          <IconComponent className="text-lg text-brand mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mobile Solution Dropdown */}
            <div>
              <button
                onClick={() => setSolutionOpen(!solutionOpen)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Solution</span>
                <FiChevronDown className={`transition-transform ${solutionOpen ? 'rotate-180' : ''}`} />
              </button>
              {solutionOpen && (
                <div className="ml-4 space-y-2 mt-2">
                  {solutionItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink 
                        key={idx}
                        to={item.to} 
                        onClick={() => { setSolutionOpen(false); setOpen(false); }} 
                        className="block rounded px-3 py-2 hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-2">
                          <IconComponent className="text-lg text-brand mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>

            {/* Mobile Resources Dropdown */}
            <div>
              <button
                onClick={() => setResourcesOpen(!resourcesOpen)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Resources</span>
                <FiChevronDown className={`transition-transform ${resourcesOpen ? 'rotate-180' : ''}`} />
              </button>
              {resourcesOpen && (
                <div className="ml-4 mt-2">
                  <div className="flex gap-2 mb-2">
                    <button
                      onClick={() => setResourcesTab('learn')}
                      className={`px-3 py-1.5 rounded text-xs font-medium ${
                        resourcesTab === 'learn' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      Learn
                    </button>
                    <button
                      onClick={() => setResourcesTab('support')}
                      className={`px-3 py-1.5 rounded text-xs font-medium ${
                        resourcesTab === 'support' ? 'bg-slate-100 text-slate-900' : 'text-slate-600'
                      }`}
                    >
                      Support
                    </button>
                  </div>
                  <div className="space-y-2">
                    {(resourcesTab === 'learn' ? resourcesLearnItems : resourcesSupportItems).map((item, idx) => {
                      const IconComponent = item.icon
                      return (
                        <NavLink 
                          key={idx}
                          to={item.to} 
                          onClick={() => { setResourcesOpen(false); setOpen(false); }} 
                          className="block rounded px-3 py-2 hover:bg-slate-50"
                        >
                          <div className="flex items-start gap-2">
                            <IconComponent className="text-lg text-brand mt-0.5" />
                            <div>
                              <div className="text-sm font-medium text-slate-900">{item.title}</div>
                              <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                            </div>
                          </div>
                        </NavLink>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Pricing Link */}
            <NavLink
              to="/pricing"
              onClick={() => setOpen(false)}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${isActive ? 'bg-brand/10 text-brand' : 'text-slate-700 hover:bg-slate-50'}`
              }
            >
              Pricing
            </NavLink>

            {/* Mobile Company Dropdown */}
            <div>
              <button
                onClick={() => setCompanyOpen(!companyOpen)}
                className="flex w-full items-center justify-between rounded px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
              >
                <span className="font-medium">Company</span>
                <FiChevronDown className={`transition-transform ${companyOpen ? 'rotate-180' : ''}`} />
              </button>
              {companyOpen && (
                <div className="ml-4 space-y-2 mt-2">
                  {companyItems.map((item, idx) => {
                    const IconComponent = item.icon
                    return (
                      <NavLink 
                        key={idx}
                        to={item.to} 
                        onClick={() => { setCompanyOpen(false); setOpen(false); }} 
                        className="block rounded px-3 py-2 hover:bg-slate-50"
                      >
                        <div className="flex items-start gap-2">
                          <IconComponent className="text-lg text-brand mt-0.5" />
                          <div>
                            <div className="text-sm font-medium text-slate-900">{item.title}</div>
                            <div className="text-xs text-slate-600 mt-0.5">{item.description}</div>
                          </div>
                        </div>
                      </NavLink>
                    )
                  })}
                </div>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <button className="btn-outline flex-1 text-sm" onClick={() => navigate('/signup')}>Login</button>
              <button className="btn-primary flex-1 text-sm" onClick={() => navigate('/signup')}>Sign Up</button>
            </div>
          </div>
        </div>
      )}
      {/* <RoleSelectModal open={!!roleModal} onClose={() => setRoleModal(null)} onSelect={handleRoleSelect} title={roleModal === 'signup' ? 'Sign up as' : 'Sign in aaaa'} /> */}
    </header>
  )
}

export default Navbar