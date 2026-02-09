import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'
import { storeToken } from '../../utils/authToken'

const loginSchema = yup.object().shape({
  username: yup.string().required('Username is required'),
  password: yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
})

export default function Login({ onSignupClick }) {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(loginSchema),
  })

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      console.log('Attempting login with:', { username: data.username })
      
      const response = await fetch('/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      })

      console.log('Login response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const tokens = await response.json()
      
      console.log('Tokens received:', { access: tokens.access ? 'present' : 'missing' })
      
      // Store tokens using the correct utility function
      if (tokens.access) {
        storeToken(tokens.access)
        console.log('Token stored successfully')
      }
      
      toast.success('Login successful!')
      
      // Check if user has existing workspaces
      try {
        const workspacesResponse = await fetch('/api/v1/workspaces/', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokens.access}`,
          },
        })

        if (workspacesResponse.ok) {
          const workspacesData = await workspacesResponse.json()
          const workspaces = Array.isArray(workspacesData) ? workspacesData : []
          
          console.log('Workspaces found:', workspaces.length)
          
          // If user has workspaces, redirect to workspace dashboard
          // Otherwise, redirect to create workspace page
          const redirectPath = workspaces.length > 0 ? '/auth/workspace-dashboard' : '/auth/workspace'
          
          setTimeout(() => {
            navigate(redirectPath)
          }, 1000)
        } else {
          // If unable to fetch workspaces, default to workspace page
          console.log('Unable to fetch workspaces, redirecting to workspace creation')
          setTimeout(() => {
            navigate('/auth/workspace')
          }, 1000)
        }
      } catch (workspaceError) {
        console.error('Error checking workspaces:', workspaceError)
        // Default to workspace page if error occurs
        setTimeout(() => {
          navigate('/auth/workspace')
        }, 1000)
      }
    } catch (error) {
      console.error('Login error details:', error)
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupClick = () => {
    navigate('/signup')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">

      {/* Main Card */}
      <div className="w-[1100px] h-[600px] bg-white rounded-3xl shadow-2xl flex overflow-hidden border border-slate-200">

        {/* LEFT SIDE - Brand Panel */}
        <div className="w-1/2 bg-gradient-to-br from-[#5a4fff] via-[#5146f2] to-[#4338e0] rounded-r-[80px] flex flex-col items-center justify-center p-12 relative overflow-hidden">
          
          {/* Decorative circles */}
          {/* <div className="absolute top-10 left-8 w-40 h-40 bg-white bg-opacity-15 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-0 w-56 h-56 bg-white bg-opacity-10 rounded-full blur-3xl"></div> */}
          
          {/* Logo and text */}
          <div className="relative z-10 text-center">
            {/* Logo */}
            <div className="mb-8">
              <img src="/Logo3.png" alt="Placfy" className="w-20 h-20 rounded-lg mx-auto shadow-lg" />
            </div>
            
            {/* Brand text */}
            <h1 className="text-white text-4xl font-bold mb-4">Placfy</h1>
            
            {/* Tagline */}
            <h2 className="text-white text-3xl font-bold leading-snug mb-8">
              Learn From World's Best Instructors Around The World.
            </h2>
            
            {/* Illustration with emojis */}
            {/* <div className="flex justify-center gap-8 text-6xl my-8">
              <span className="hover:scale-125 transition transform duration-300">🚀</span>
              <span className="hover:scale-125 transition transform duration-300">👨‍💻</span>
              <span className="hover:scale-125 transition transform duration-300">✉️</span>
            </div> */}
            
            {/* Description */}
            <p className="text-blue-100 text-sm leading-relaxed max-w-sm">
              Join thousands of students learning from world-class instructors and transform your skills
            </p>
          </div>
        </div>


        {/* RIGHT SIDE - Form */}
        <div className="w-1/2 flex flex-col justify-center px-14">

          {/* Language */}
          <div className="text-right text-sm text-slate-600 mb-8 font-medium">
            🌐 English (USA)
          </div>


          {/* Title */}
          <div className="mb-8 text-center">
            <h2 className="text-4xl font-bold text-slate-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-slate-600 text-sm">Login to your account</p>
          </div>


          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

            {/* Email/Username */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Email Address</label>
              <input
                {...register('username')}
                type="text"
                placeholder="your@email.com"
                className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors"
              />
              {errors.username && <p className="text-red-500 text-xs mt-2">{errors.username?.message}</p>}
            </div>


            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-2 uppercase tracking-wide">Password</label>
              <div className="relative">
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••"
                  className="w-full border-b border-slate-300 py-3 outline-none focus:border-[#5a4fff] text-slate-900 placeholder-slate-500 text-sm font-medium transition-colors pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-0 top-3 text-slate-400 hover:text-[#5a4fff] transition-colors"
                >
                  {showPassword ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-2">{errors.password?.message}</p>}
            </div>


            {/* Forgot Password */}
            <div className="text-right">
              <a href="/forgot-password" className="text-[#5a4fff] text-xs font-semibold hover:underline">
                Forgot your password?
              </a>
            </div>


            {/* Login Button */}
            <button
              disabled={loading}
              className="w-full mt-6 py-3 rounded-lg text-white font-bold bg-gradient-to-r from-[#5a4fff] to-[#4338e0] hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50"
            >
              {loading ? "Logging in..." : "Login"}
            </button>

          </form>


          {/* Sign Up */}
          <div className="text-center text-sm mt-8 text-slate-600">

            Don't have an account?

            <button
              onClick={handleSignupClick}
              className="text-[#5a4fff] ml-2 font-bold hover:underline"
            >
              Sign Up
            </button>

          </div>

        </div>

      </div>

    </div>

  )
}