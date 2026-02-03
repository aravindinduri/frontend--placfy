import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FiUserCheck } from 'react-icons/fi'

const ANIMATION_CONFIG = {
  delayPer: 0.4,
  iconSwapInterval: 2200,
  orbitRotationSpeed: 0.3,
  orbitUpdateInterval: 50,
}

// Arranged in a radial pattern around center (50, 50) - 8 badges evenly distributed
const beforeBadges = [
  { label: 'Resume Matching', angle: -90 },      
  { label: 'Missed Follow-Ups', angle: -45 },    
  { label: 'CRM Automation', angle: 0 },         
  { label: 'Duplicate Entry', angle: 45 },       
  { label: 'Lost Context', angle: 90 },          
  { label: 'AI Sourcing', angle: 135 },          
  { label: 'Talent Analytics', angle: 180 },
  { label: 'Manual Reports', angle: -135 },     
]

const afterBadges = [
  { label: 'Resume Matching', angle: -45 },
  { label: 'Job Distribution', angle: -10 },
  { label: 'AI Sourcing', angle: 25 },
  { label: 'Talent Analytics', angle: 70 },
  { label: 'CRM Automation', angle: 115 },
  { label: 'Scheduling', angle: 160 },
  { label: 'Offer Letters', angle: 205 },
  { label: 'Smart Reports', angle: 250 },
]

const warningIconAngles = [30, 150, 270]

const orbitRadii = [30, 42, 54]

function calculateRadialPosition(angle, radius = 38, centerX = 50, centerY = 50) {
  const angleRad = (angle * Math.PI) / 180
  return {
    x: centerX + radius * Math.cos(angleRad),
    y: centerY + radius * Math.sin(angleRad),
  }
}

function calculateOrbitPosition(angle, rotation, radiusX = 42, radiusY = 42) {
  const currentAngle = (angle + rotation) % 360
  const angleRad = (currentAngle * Math.PI) / 180
  
  return {
    x: 50 + radiusX * Math.cos(angleRad),
    y: 50 + radiusY * Math.sin(angleRad),
  }
}

function Panel({ title, children, titleColor }) {
  return (
    <div className="rounded-3xl lg:rounded-[40px] bg-white/95 backdrop-blur-sm p-4 sm:p-6 lg:p-8 xl:p-10 shadow-xl">
      <h3 className={`mb-4 sm:mb-6 lg:mb-8 text-center text-lg sm:text-xl md:text-2xl lg:text-3xl xl:text-4xl font-bold ${titleColor}`}>
        {title}
      </h3>
      {children}
    </div>
  )
}

function WarningIcon({ angle, index, cycle }) {
  const pos = calculateRadialPosition(angle, 18)
  
  return (
    <motion.div
      key={`warning-${index}-${cycle}`}
      className="absolute z-10"
      style={{ 
        left: `${pos.x}%`, 
        top: `${pos.y}%`, 
        transform: 'translate(-50%, -50%)' 
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.4 + index * 0.2 }}
    >
      <div className="w-3 h-3 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 rounded-full bg-gradient-to-br from-[#ef4444] to-[#dc2626] flex items-center justify-center shadow-lg">
        <span className="text-white text-[8px] sm:text-[10px] md:text-xs font-bold">!</span>
      </div>
    </motion.div>
  )
}

function CenterAvatar({ cycle }) {
  return (
    <motion.div
      key={`center-${cycle}`}
      className="absolute left-1/2 top-1/2 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 lg:w-28 lg:h-28 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-2xl border-3 sm:border-4 md:border-5 lg:border-6 border-white/80 flex items-center justify-center overflow-hidden z-20"
      initial={{ scale: 0.6, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, ease: "backOut" }}
    >
      <div className="w-full h-full bg-gradient-to-br from-[#c7d2fe] to-[#ddd6fe] flex items-center justify-center">
        <svg className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#6366f1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      </div>
    </motion.div>
  )
}

function Badge({ label, angle, delay, cycle, isRadial = false }) {
  let style
  
  if (isRadial) {
    const pos = calculateRadialPosition(angle, 38)
    style = { 
      left: `${pos.x}%`, 
      top: `${pos.y}%`, 
      transform: 'translate(-50%, -50%)' 
    }
  }
  
  return (
    <motion.div
      key={`${label}-${cycle}`}
      className="absolute z-30"
      style={style}
      initial={{ scale: 0.5, opacity: 0, y: 10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, ease: "backOut" }}
    >
      <span className="inline-block rounded-full bg-gradient-to-r from-[#a5b4fc] to-[#c4b5fd] px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-semibold text-[#4338ca] shadow-lg whitespace-nowrap">
        {label}
      </span>
    </motion.div>
  )
}

function OrbitingBadge({ label, x, y, index }) {
  return (
    <motion.div
      key={label}
      className="absolute z-20"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 0.8 + index * 0.08, duration: 0.5, ease: "backOut" }}
    >
      <div className="rounded-full bg-gradient-to-r from-[#a5b4fc] to-[#c4b5fd] px-1.5 py-0.5 sm:px-2 sm:py-1 md:px-3 md:py-1.5 lg:px-4 lg:py-2 text-[8px] sm:text-[9px] md:text-xs lg:text-sm font-semibold text-[#4338ca] shadow-xl whitespace-nowrap border-2 border-white/70 backdrop-blur-sm">
        {label}
      </div>
    </motion.div>
  )
}

function CenterLogo() {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180, opacity: 0 }}
      animate={{ scale: 1, rotate: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "backOut" }}
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
    >
      <div className="relative w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 lg:w-40 lg:h-40">
        <div className="absolute inset-0 rounded-full bg-white shadow-2xl flex items-center justify-center p-1.5 sm:p-2">
          <div className="w-full h-full rounded-full overflow-hidden flex items-center justify-center bg-white">
            <img 
              src="/Logo3.png" 
              alt="Logo" 
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function BrandTile({ iconIdx }) {
  return (
    <div className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 z-30">
      <motion.div
        key={iconIdx}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.35 }}
        className="flex items-center gap-1.5 sm:gap-2 rounded-lg sm:rounded-xl bg-brand px-2 py-1.5 sm:px-3 sm:py-2 text-white shadow-xl"
      >
        {iconIdx === 0 ? (
          <img src="/Logo3.png" alt="Placfy" className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7 rounded" />
        ) : (
          <FiUserCheck className="h-5 w-5 sm:h-6 sm:w-6 md:h-7 md:w-7" />
        )}
        <span className="text-[10px] sm:text-xs font-semibold tracking-wide">PLACFY</span>
      </motion.div>
    </div>
  )
}

function BeforeAfter({ title, subtitle }) {
  // State
  const [cycle, setCycle] = useState(0)
  const [orbitRotation, setOrbitRotation] = useState(0)
  const [iconIdx, setIconIdx] = useState(0)
  
  // Calculated values
  const totalDuration = 0.6 + beforeBadges.length * ANIMATION_CONFIG.delayPer + 1.2

  // Effects
  useEffect(() => {
    const id = setTimeout(() => setCycle((c) => c + 1), totalDuration * 1000)
    return () => clearTimeout(id)
  }, [cycle, totalDuration])

  useEffect(() => {
    const interval = setInterval(() => {
      setOrbitRotation(prev => (prev + ANIMATION_CONFIG.orbitRotationSpeed) % 360)
    }, ANIMATION_CONFIG.orbitUpdateInterval)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const id = setInterval(() => {
      setIconIdx((i) => (i === 0 ? 1 : 0))
    }, ANIMATION_CONFIG.iconSwapInterval)
    return () => clearInterval(id)
  }, [])

  return (
    <section className="w-full min-h-screen px-3 sm:px-4 md:px-6 lg:px-8 py-6 sm:py-8 md:py-12 lg:py-20 bg-gradient-to-br from-[#6366f1] via-[#7c3aed] to-[#8b5cf6]">
      <div className="max-w-[1600px] mx-auto">
        <div className="grid gap-4 sm:gap-5 md:gap-6 lg:gap-8 xl:gap-10 grid-cols-1 lg:grid-cols-2">
          
          {/* BEFORE PANEL */}
          <Panel title={title} titleColor="text-[#6366f1]">
            <div className="relative mx-auto w-full aspect-square max-w-[650px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#ddd6fe]/60 via-[#e0e7ff]/60 to-[#f5f3ff]/60 overflow-hidden p-3 sm:p-4 md:p-5 lg:p-6">
              
              {/* Connection Lines */}
              <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid meet">
                {/* Orbital circle */}
                <circle
                  cx="50"
                  cy="50"
                  r="38"
                  fill="none"
                  stroke="currentColor"
                  className="text-[#a5b4fc]/30"
                  strokeWidth="0.2"
                  strokeDasharray="2 2"
                />
                
                {/* Radial lines */}
                {beforeBadges.map((badge, i) => {
                  const innerPos = calculateRadialPosition(badge.angle, 12)
                  const outerPos = calculateRadialPosition(badge.angle, 38)
                  
                  return (
                    <motion.line
                      key={`${i}-${cycle}`}
                      x1={innerPos.x}
                      y1={innerPos.y}
                      x2={outerPos.x}
                      y2={outerPos.y}
                      stroke="currentColor"
                      className="text-[#a5b4fc]/70"
                      strokeWidth="0.4"
                      strokeDasharray="1.5 1.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.8 }}
                      transition={{ 
                        duration: 0.6, 
                        delay: 0.6 + i * ANIMATION_CONFIG.delayPer, 
                        ease: "easeOut" 
                      }}
                    />
                  )
                })}
              </svg>
              
              {/* Warning Icons */}
              {warningIconAngles.map((angle, i) => (
                <WarningIcon 
                  key={i} 
                  angle={angle}
                  index={i} 
                  cycle={cycle} 
                />
              ))}
              
              {/* Center Avatar */}
              <CenterAvatar cycle={cycle} />
              
              {/* Problem Badges */}
              {beforeBadges.map((b, i) => (
                <Badge
                  key={b.label}
                  label={b.label}
                  angle={b.angle}
                  delay={0.6 + i * ANIMATION_CONFIG.delayPer}
                  cycle={cycle}
                  isRadial={true}
                />
              ))}
            </div>
          </Panel>

          {/* AFTER PANEL */}
          <Panel title={subtitle} titleColor="text-[#6366f1]">
            <div className="relative mx-auto w-full aspect-square max-w-[650px] rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#ddd6fe]/60 via-[#e0e7ff]/60 to-[#f5f3ff]/60 overflow-hidden flex items-center justify-center p-3 sm:p-4 md:p-5 lg:p-6">
              
              <div className="relative w-full h-full">
                {/* Center Logo */}
                <CenterLogo />

                {/* Orbital Circles */}
                <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                  {orbitRadii.map((radius, i) => (
                    <motion.circle
                      key={i}
                      cx="50"
                      cy="50"
                      r={radius}
                      fill="none"
                      stroke="url(#gradient)"
                      strokeWidth="0.15"
                      strokeDasharray="1 2"
                      opacity="0.5"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 0.5 }}
                      transition={{ duration: 1.5, delay: 0.5 + i * 0.2 }}
                    />
                  ))}
                  <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="50%" stopColor="#8b5cf6" />
                      <stop offset="100%" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Orbiting Badges */}
                {afterBadges.map((item, i) => {
                  const pos = calculateOrbitPosition(item.angle, orbitRotation, 42, 42)
                  return (
                    <OrbitingBadge
                      key={item.label}
                      label={item.label}
                      x={pos.x}
                      y={pos.y}
                      index={i}
                    />
                  )
                })}
              </div>

              {/* Brand Tile */}
              <BrandTile iconIdx={iconIdx} />
            </div>
          </Panel>
        </div>
      </div>
    </section>
  )
}

export default BeforeAfter