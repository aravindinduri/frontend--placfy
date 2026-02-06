import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Spinner from './components/ui/Spinner.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import NotFound from './components/ui/NotFound.jsx'
import AuthPage from './components/pages/auth/AuthPage.jsx'
import Workspace from './components/pages/auth/Workspace.jsx'
import AcceptInvitation from './components/pages/auth/Dashboard/AcceptInvitation.jsx';


const Home = lazy(() => import('./components/pages/home/Home.jsx'))
const Contact = lazy(() => import('./components/pages/home/Contact.jsx'))
const About = lazy(() => import('./components/pages/home/About.jsx'))
const AdminDashboard = lazy(() => import('./components/pages/auth/Dashboard/AdminDashboard.jsx'))
const HRRecruiterDashboard = lazy(() => import('./components/pages/auth/Dashboard/HR_RECRUITER.jsx'))
const HrDashboard = lazy(() => import('./components/pages/auth/Dashboard/HrDashboard.jsx'))
const MemberDashboard = lazy(() => import('./components/pages/auth/Dashboard/MEMBER.jsx'))
const RecruiterDashboard = lazy(() => import('./components/pages/auth/Dashboard/RECRUITER .jsx'))
const StaffDashboard = lazy(() => import('./components/pages/auth/Dashboard/STAFF.jsx'))
const WorkspaceDashboard = lazy(() => import('./components/pages/auth/WorkspaceDashboard.jsx'))
const ForgotPassword = lazy(() => import('./components/pages/auth/ForgotPassword.jsx'))
const Pricing = lazy(() => import('./components/pages/home/Pricing.jsx'))
const FAQ = lazy(() => import('./components/pages/home/FAQ.jsx'))
const LoginAsPage = lazy(() => import('./components/pages/auth/LoginAsPage.jsx'))
const EmployeeLayout = lazy(() => import('./components/pages/employee/EmployeeLayout.jsx'))

function AppRoutes() {
  const location = useLocation()
  const hideGlobalLayout = /^\/(employee|auth\/workspace|auth\/admin-dashboard|auth\/hr-recruiter-dashboard|auth\/hr-dashboard|auth\/member-dashboard|auth\/recruiter-dashboard|auth\/staff-dashboard|auth\/workspace-dashboard)\b/.test(location.pathname)

  return (
    <div className="flex min-h-screen flex-col">
      {!hideGlobalLayout && <Navbar />}
      <main className="flex-1">
        <Suspense fallback={<div className="py-20"><Spinner /></div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/about" element={<About /> } />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/signup" element={<AuthPage />} />
            <Route path="/auth/workspace" element={<Workspace />} />
            <Route path="/auth/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/auth/hr-recruiter-dashboard" element={<HRRecruiterDashboard />} />
            <Route path="/auth/hr-dashboard" element={<HrDashboard />} />
            <Route path="/auth/member-dashboard" element={<MemberDashboard />} />
            <Route path="/auth/recruiter-dashboard" element={<RecruiterDashboard />} />
            <Route path="/auth/staff-dashboard" element={<StaffDashboard />} />
            <Route path="/auth/workspace-dashboard" element={<WorkspaceDashboard />} />
            <Route path="/login-as/:token" element={<LoginAsPage />} />
            <Route path="/invitations/accept/:token" element={<AcceptInvitation />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />

            {/* Employee Portal */}
            <Route
              path="/employee/*"
              element={
                <ProtectedRoute roles={["employee"]}>
                  <EmployeeLayout />
                </ProtectedRoute>
              }
            />
            {/* Not Found Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </main>
      {!hideGlobalLayout && <Footer />}
    </div>
  )
}

function App() {
  return (
    <Routes>
      <Route path="*" element={<AppRoutes />} />
    </Routes>
  )
}

export default App
