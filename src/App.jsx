import { lazy, Suspense } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Navbar from './components/layout/Navbar.jsx'
import Footer from './components/layout/Footer.jsx'
import Spinner from './components/ui/Spinner.jsx'
import ProtectedRoute from './components/auth/ProtectedRoute.jsx'
import NotFound from './components/ui/NotFound.jsx'
import AuthPage from './components/pages/auth/AuthPage.jsx'
import Workspace from './components/pages/auth/Workspace.jsx'
import WorkspaceDashboard from './components/pages/auth/WorkspaceDashboard.jsx'

const Home = lazy(() => import('./components/pages/home/Home.jsx'))
const Contact = lazy(() => import('./components/pages/home/Contact.jsx'))
const About = lazy(() => import('./components/pages/home/About.jsx'))
const ForgotPassword = lazy(() => import('./components/pages/auth/ForgotPassword.jsx'))
const Pricing = lazy(() => import('./components/pages/home/Pricing.jsx'))
const FAQ = lazy(() => import('./components/pages/home/FAQ.jsx'))
const LoginAsPage = lazy(() => import('./components/pages/auth/LoginAsPage.jsx'))
const EmployeeLayout = lazy(() => import('./components/pages/employee/EmployeeLayout.jsx'))

function AppRoutes() {
  const location = useLocation()
  const hideGlobalLayout = /^\/(employee|auth\/workspace|auth\/workspace-dashboard)\b/.test(location.pathname)

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
            <Route path="/auth/workspace-dashboard" element={<WorkspaceDashboard />} />
            <Route path="/login-as/:token" element={<LoginAsPage />} />
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
