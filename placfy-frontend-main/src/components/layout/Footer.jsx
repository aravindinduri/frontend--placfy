import { Link } from 'react-router-dom'
import { FaLinkedin, FaTwitter, FaGithub } from 'react-icons/fa'

function Footer() {
  return (
    <footer className="border-t border-slate-100 bg-white">
      <div className="container-responsive grid gap-8 py-12 md:grid-cols-2 lg:grid-cols-5">
        <div className="md:col-span-2 lg:col-span-1">
          <div className="mb-3 flex items-center gap-3">
            <img src="/Logo3.png" alt="Placfy" className="h-9 w-9 rounded" />
            <p className="font-semibold text-slate-800">PLACFY</p>
          </div>
          <p className="text-sm text-slate-500 leading-relaxed">
            AI-powered talent acquisition and HR management platform. Empower your team to hire smarter and manage better.
          </p>
          <div className="mt-4 flex items-center gap-5 text-slate-500">
            <Link to="#" aria-label="LinkedIn" className="hover:text-brand transition-colors"><FaLinkedin size={18} /></Link>
            <Link to="#" aria-label="Twitter" className="hover:text-brand transition-colors"><FaTwitter size={18} /></Link>
            <Link to="#" aria-label="GitHub" className="hover:text-brand transition-colors"><FaGithub size={18} /></Link>
          </div>
        </div>
        
        <div>
          <p className="mb-3 text-sm font-semibold text-brand">Products</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/product/ats" className="hover:text-brand transition-colors">Applicant Tracking System</Link></li>
            <li><Link to="/product/crm" className="hover:text-brand transition-colors">CRM</Link></li>
            <li><Link to="/product/hrm" className="hover:text-brand transition-colors">HR Management</Link></li>
            <li><Link to="/product/candidate-relationship" className="hover:text-brand transition-colors">Candidate Relationship</Link></li>
            <li><Link to="/product/talent-recruitment" className="hover:text-brand transition-colors">Talent Recruitment</Link></li>
            <li><Link to="/product/marketplace" className="hover:text-brand transition-colors">Marketplace Apps</Link></li>
            <li><Link to="/product/generative-ai" className="hover:text-brand transition-colors">Generative AI</Link></li>
            <li><Link to="/product/talent-ai" className="hover:text-brand transition-colors">Talent AI</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-brand">Solutions</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/solution/staffing" className="hover:text-brand transition-colors">Staffing & Consulting</Link></li>
            <li><Link to="/solution/public-utilities" className="hover:text-brand transition-colors">Public Utilities</Link></li>
            <li><Link to="/solution/high-tech" className="hover:text-brand transition-colors">High Tech</Link></li>
            <li><Link to="/solution/manufacturing" className="hover:text-brand transition-colors">Manufacturing</Link></li>
            <li><Link to="/solution/consumer-goods" className="hover:text-brand transition-colors">Consumer Goods</Link></li>
            <li><Link to="/solution/life-sciences" className="hover:text-brand transition-colors">Life Sciences</Link></li>
          </ul>
        </div>
        
        <div>
          <p className="mb-3 text-sm font-semibold text-brand">Resources</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/resources/blog" className="hover:text-brand transition-colors">Blog</Link></li>
            <li><Link to="/resources/events" className="hover:text-brand transition-colors">Events & Webinars</Link></li>
            <li><Link to="/resources/case-studies" className="hover:text-brand transition-colors">Case Studies</Link></li>
            <li><Link to="/resources/knowledge-base" className="hover:text-brand transition-colors">Knowledge Base</Link></li>
            <li><Link to="/resources/help-center" className="hover:text-brand transition-colors">Help Center</Link></li>
            <li><Link to="/resources/api-docs" className="hover:text-brand transition-colors">API Docs</Link></li>
            <li><Link to="/resources/security" className="hover:text-brand transition-colors">Security</Link></li>
          </ul>
        </div>
        
        <div>
          <p className="mb-3 text-sm font-semibold text-brand">Company</p>
          <ul className="space-y-2 text-sm text-slate-600">
            <li><Link to="/about" className="hover:text-brand transition-colors">About Us</Link></li>
            <li><Link to="/company/careers" className="hover:text-brand transition-colors">Careers</Link></li>
            <li><Link to="/pricing" className="hover:text-brand transition-colors">Pricing</Link></li>
            <li><Link to="/company/team" className="hover:text-brand transition-colors">Team</Link></li>
            <li><Link to="/company/partners" className="hover:text-brand transition-colors">Become a Partner</Link></li>
            <li><Link to="/company/gdpr" className="hover:text-brand transition-colors">GDPR</Link></li>
            <li><Link to="/contact" className="hover:text-brand transition-colors">Contact Us</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="bg-slate-50 py-4">
        <div className="container-responsive flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} Placfy. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-brand transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-brand transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer


