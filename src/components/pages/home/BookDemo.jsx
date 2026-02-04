import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTimes, FaUser, FaBuilding, FaEnvelope, FaPhone } from 'react-icons/fa'

function BookDemo({ open, onClose }) {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    company: '',
    email: '',
    phone: '',
    countryCode: '+91'
  })

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step === 1) {
      // Validate step 1
      if (formData.name && formData.company && formData.email && formData.phone) {
        setStep(2)
      }
    }
  }

  const handleSubmit = () => {
    console.log('Demo booking submitted:', formData)
    // Here you would typically send the data to your backend
    onClose()
    setStep(1)
    setFormData({ name: '', company: '', email: '', phone: '', countryCode: '+91' })
  }

  if (!open) return null

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            className="relative w-full max-w-5xl overflow-hidden rounded-3xl bg-white shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 z-10 rounded-full p-2 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
            >
              <FaTimes className="text-xl" />
            </button>

            <div className="grid md:grid-cols-2">
              {/* Left side - Hero */}
              <div className="relative overflow-hidden bg-gradient-to-br from-indigo-50 via-purple-50 to-white p-8 md:p-12">
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div>
                    <motion.h2
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      className="mb-4 text-4xl font-bold leading-tight md:text-5xl"
                    >
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        Smarter Hiring
                      </span>
                      <br />
                      <span className="text-slate-900">Starts Here</span>
                    </motion.h2>

                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.4 }}
                      className="my-8 rounded-2xl bg-white p-6 shadow-lg"
                    >
                      <div className="aspect-video w-full rounded-lg bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center">
                        <div className="text-center">
                          <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-indigo-600 flex items-center justify-center">
                            <FaUser className="text-5xl text-white" />
                          </div>
                          <div className="text-2xl font-bold text-indigo-600">Book a Demo</div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 }}
                    className="text-lg text-slate-600"
                  >
                    Simplify your Hiring, Workforce, and Sales Operations with one seamless Platform.
                  </motion.p>
                </div>
              </div>

              {/* Right side - Form */}
              <div className="flex flex-col bg-slate-50 p-8 md:p-12">
                {/* Step indicator */}
                <div className="mb-8 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <motion.div
                      animate={{
                        scale: step === 1 ? 1 : 0.8,
                        opacity: step === 1 ? 1 : 0.5
                      }}
                      className="flex items-center gap-3"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                      } font-bold`}>
                        01
                      </div>
                      <span className={`text-sm font-medium ${
                        step === 1 ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        Details
                      </span>
                    </motion.div>

                    <div className="h-px w-8 bg-slate-300" />

                    <motion.div
                      animate={{
                        scale: step === 2 ? 1 : 0.8,
                        opacity: step === 2 ? 1 : 0.5
                      }}
                      className="flex items-center gap-3"
                    >
                      <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-400'
                      } font-bold`}>
                        02
                      </div>
                      <span className={`text-sm font-medium ${
                        step === 2 ? 'text-slate-900' : 'text-slate-400'
                      }`}>
                        Schedule
                      </span>
                    </motion.div>
                  </div>
                </div>

                {/* Form content */}
                <div className="flex-1">
                  <AnimatePresence mode="wait">
                    {step === 1 ? (
                      <motion.div
                        key="step1"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        {/* Name */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) => handleChange('name', e.target.value)}
                              placeholder="Full name"
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                            />
                            <FaUser className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        {/* Company */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Company name
                          </label>
                          <div className="relative">
                            <input
                              type="text"
                              value={formData.company}
                              onChange={(e) => handleChange('company', e.target.value)}
                              placeholder="Company name"
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                            />
                            <FaBuilding className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        {/* Email */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Business email
                          </label>
                          <div className="relative">
                            <input
                              type="email"
                              value={formData.email}
                              onChange={(e) => handleChange('email', e.target.value)}
                              placeholder="name@yourcompany.com"
                              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                            />
                            <FaEnvelope className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                          </div>
                        </div>

                        {/* Phone */}
                        <div>
                          <label className="mb-2 block text-sm font-medium text-slate-700">
                            Phone
                          </label>
                          <div className="flex gap-2">
                            <div className="relative flex items-center">
                              <span className="flex h-full items-center rounded-lg border border-slate-200 bg-white px-3 text-slate-700">
                                🇮🇳
                              </span>
                              <select
                                value={formData.countryCode}
                                onChange={(e) => handleChange('countryCode', e.target.value)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              >
                                <option value="+91">+91</option>
                                <option value="+1">+1</option>
                                <option value="+44">+44</option>
                              </select>
                              <span className="ml-2 text-sm text-slate-700">{formData.countryCode}</span>
                            </div>
                            <div className="relative flex-1">
                              <input
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleChange('phone', e.target.value)}
                                placeholder="Enter phone number"
                                className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 pr-10 text-slate-900 placeholder-slate-400 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-600/20"
                              />
                              <FaPhone className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div
                        key="step2"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="space-y-6"
                      >
                        <div className="rounded-xl bg-white p-6 text-center">
                          <div className="mb-4 text-5xl">📅</div>
                          <h3 className="mb-2 text-xl font-bold text-slate-900">
                            Choose Your Preferred Time
                          </h3>
                          <p className="mb-6 text-slate-600">
                            Our team will contact you shortly to schedule a personalized demo
                          </p>
                          
                          <div className="space-y-3">
                            {['Morning (9 AM - 12 PM)', 'Afternoon (12 PM - 4 PM)', 'Evening (4 PM - 7 PM)'].map((time) => (
                              <button
                                key={time}
                                className="w-full rounded-lg border-2 border-slate-200 bg-white px-4 py-3 text-left text-slate-700 transition-all hover:border-indigo-600 hover:bg-indigo-50"
                              >
                                {time}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="rounded-lg bg-gradient-to-r from-indigo-50 to-purple-50 p-4 text-sm text-slate-600">
                          <strong className="text-slate-900">Note:</strong> A member of our team will reach out within 24 hours to confirm your demo.
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Action buttons */}
                <div className="mt-8 flex items-center justify-between">
                  <div className="text-xs text-slate-500">
                    {new Date().toLocaleTimeString('en-US', { 
                      hour: '2-digit', 
                      minute: '2-digit',
                      hour12: true 
                    })} init
                  </div>
                  
                  <div className="flex gap-3">
                    {step === 2 && (
                      <button
                        onClick={() => setStep(1)}
                        className="rounded-lg border border-slate-300 bg-white px-6 py-3 font-medium text-slate-700 transition-colors hover:bg-slate-50"
                      >
                        Back
                      </button>
                    )}
                    <button
                      onClick={step === 1 ? handleNext : handleSubmit}
                      className="rounded-lg bg-indigo-600 px-8 py-3 font-medium text-white shadow-lg transition-all hover:bg-indigo-700 hover:shadow-xl"
                    >
                      {step === 1 ? 'Next' : 'Confirm Demo'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default BookDemo