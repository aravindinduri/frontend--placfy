import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useNavigate } from 'react-router-dom'
import { FiEye, FiEyeOff, FiUser, FiLock } from 'react-icons/fi'
import toast from 'react-hot-toast'

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
      const response = await fetch('http://localhost:8000/api/v1/auth/login/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.detail || 'Login failed')
      }

      const tokens = await response.json()
      
      // Store tokens in localStorage
      localStorage.setItem('access_token', tokens.access)
      localStorage.setItem('refresh_token', tokens.refresh)
      
      toast.success('Login successful!')
      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      toast.error(error.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSignupClick = () => {
    navigate('/signup')
  }

  return (
    <div className="w-full">
      <h2 className="text-3xl font-bold mb-2 text-center text-slate-900">Welcome Back</h2>
      <p className="text-center text-slate-600 mb-6">Login to your account</p>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Username</label>
          <div className="relative">
            <FiUser className="absolute left-3 top-3 text-slate-400" />
            <input
              {...register('username')}
              type="text"
              className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="johndoe"
            />
          </div>
          {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
          <div className="relative">
            <FiLock className="absolute left-3 top-3 text-slate-400" />
            <input
              {...register('password')}
              type={showPassword ? 'text' : 'password'}
              className="w-full pl-10 pr-10 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              {showPassword ? <FiEyeOff /> : <FiEye />}
            </button>
          </div>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password.message}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:opacity-50 transition"
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p className="text-center mt-4 text-slate-600">
        Don't have an account?{' '}
        <button 
          onClick={handleSignupClick}
          className="text-blue-600 hover:underline font-medium"
        >
          Sign up
        </button>
      </p>
    </div>
  )
}