import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Building2, Users, Globe, Mail, Phone, 
  ChevronRight, ShieldCheck, Zap, Trash2, Check, AlertCircle
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { getStoredToken, getSessionToken } from '../../utils/authToken';

export default function Workspace() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [form, setForm] = useState({
    name: "",
    info: {
      team_size: "",
      industry: "",
      description: "",
      website: "",
      location: "",
      contact_email: "",
      phone: "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    
    if (name.startsWith("info.")) {
      const key = name.replace("info.", "");
      setForm((prev) => ({
        ...prev,
        info: { ...prev.info, [key]: value },
      }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.name.trim()) {
      newErrors.name = "Workspace name is required";
    }
    
    if (form.info.contact_email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.info.contact_email)) {
      newErrors["info.contact_email"] = "Invalid email format";
    }
    
    if (form.info.website && !/^https?:\/\/.+/.test(form.info.website)) {
      newErrors["info.website"] = "Website must start with http:// or https://";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }
    
    setLoading(true);
    
    try {
      const accessToken = getStoredToken() || getSessionToken();
      if (!accessToken) {
        toast.error('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      const workspaceData = {
        name: form.name,
        info: form.info
      };

      const response = await fetch('/api/v1/workspaces/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(workspaceData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to create workspace');
      }

      const responseData = await response.json();
      toast.success('Workspace created successfully!', { duration: 2000 });
      
      localStorage.setItem('currentWorkspace', JSON.stringify({
        id: responseData.id,
        name: responseData.name,
        slug: responseData.slug,
        tenant_id: responseData.tenant_id,
        info: responseData.info
      }));
      
      setForm({
        name: "",
        info: { 
          team_size: "", 
          industry: "", 
          description: "", 
          website: "", 
          location: "", 
          contact_email: "", 
          phone: "" 
        },
      });

      setTimeout(() => {
        navigate('/auth/workspace-dashboard');
      }, 1000);

    } catch (error) {
      console.error('Workspace creation error:', error);
      toast.error(error.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    const hasContent = form.name || 
                       Object.values(form.info).some(val => val !== "");
    
    if (!hasContent) {
      toast('Nothing to discard', { icon: 'ℹ️' });
      return;
    }
    
    setForm({
      name: "",
      info: { 
        team_size: "", 
        industry: "", 
        description: "", 
        website: "", 
        location: "", 
        contact_email: "", 
        phone: "" 
      },
    });
    setErrors({});
    toast.success('Changes discarded');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { type: "spring", stiffness: 120, damping: 14 } 
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 via-white to-blue-50 flex flex-col lg:flex-row font-sans antialiased">
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#1e293b',
            color: '#fff',
            borderRadius: '12px',
            padding: '16px',
            fontSize: '14px',
            fontWeight: '500',
          },
          success: {
            iconTheme: {
              primary: '#22c55e',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
      
      {/* SIDEBAR */}
      <motion.aside 
        initial={{ x: -60, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="lg:w-[420px] bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 lg:min-h-screen p-8 lg:p-12 text-white flex flex-col justify-between relative overflow-hidden"
      >
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-10">
          <motion.div 
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 90, 0],
              x: [0, 30, 0],
              y: [0, -20, 0]
            }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute -top-32 -right-32 w-80 h-80 bg-white rounded-full blur-3xl"
          />
          <motion.div 
            animate={{ 
              scale: [1, 1.3, 1],
              rotate: [0, -90, 0],
              x: [0, -30, 0],
              y: [0, 20, 0]
            }}
            transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
            className="absolute -bottom-32 -left-32 w-80 h-80 bg-indigo-300 rounded-full blur-3xl"
          />
        </div>

        {/* Header Section */}
        <div className="relative z-10 space-y-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="flex items-center gap-4"
          >
            <motion.div 
              whileHover={{ scale: 1.05, rotate: -3 }}
              whileTap={{ scale: 0.95 }}
              className="w-14 h-14 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-2xl flex items-center justify-center shadow-2xl font-black text-2xl text-white"
            >
              P
            </motion.div>
            <div>
              <h1 className="text-3xl font-black tracking-tight">
                Placfy Workspace
              </h1>
              <p className="text-blue-100/70 text-sm font-medium mt-1">
                Setup Center
              </p>
            </div>
          </motion.div>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-blue-50/90 text-base leading-relaxed"
          >
            Configure your organization's digital workspace with team sizes, industry details, and contact preferences.
          </motion.p>

          {/* Progress Indicator */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10"
          >
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-100">
                Setup Progress
              </span>
              <span className="text-xs font-bold text-white">
                {form.name ? '1/3' : '0/3'}
              </span>
            </div>
            <div className="space-y-2">
              <ProgressStep 
                completed={!!form.name} 
                label="Workspace Identity" 
              />
              <ProgressStep 
                completed={!!(form.info.website || form.info.location)} 
                label="Global Presence" 
              />
              <ProgressStep 
                completed={!!(form.info.contact_email || form.info.phone)} 
                label="Contact Details" 
              />
            </div>
          </motion.div>
        </div>

        {/* System Status */}
        <motion.div 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="relative z-10 space-y-4"
        >
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-blue-200/60 pb-3 border-b border-white/10">
            System Status
          </div>
          <StatusItem icon={<ShieldCheck size={18}/>} text="End-to-End Encryption" />
          <StatusItem icon={<Zap size={18}/>} text="Real-time Sync Enabled" />
        </motion.div>
      </motion.aside>

      {/* MAIN CONTENT */}
      <div className="flex-1 lg:overflow-y-auto">
        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="max-w-4xl mx-auto px-6 py-12 lg:px-12 lg:py-16 space-y-12"
        >
          {/* Page Header */}
          <motion.div variants={itemVariants} className="space-y-3">
            <h2 className="text-4xl font-black text-slate-900 tracking-tight">
              Create Workspace
            </h2>
            <p className="text-slate-600 text-lg">
              Fill in the details below to set up your new workspace
            </p>
          </motion.div>

          {/* Identity Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              icon={<Building2 size={22}/>} 
              title="Workspace Identity" 
              description="Define your workspace name and organizational details"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <Input 
                  label="Workspace Name" 
                  name="name" 
                  value={form.name} 
                  onChange={handleChange} 
                  placeholder="e.g. Acme Corporation" 
                  required 
                  error={errors.name}
                  disabled={loading}
                />
              </div>
              
              <Select
                label="Industry"
                name="info.industry"
                value={form.info.industry}
                onChange={handleChange}
                disabled={loading}
                options={[
                  { value: "technology", label: "Technology" },
                  { value: "healthcare", label: "Healthcare" },
                  { value: "finance", label: "Finance" },
                  { value: "education", label: "Education" },
                  { value: "retail", label: "Retail" },
                  { value: "manufacturing", label: "Manufacturing" },
                  { value: "consulting", label: "Consulting" },
                  { value: "other", label: "Other" },
                ]}
              />

              <Select
                label="Team Size"
                name="info.team_size"
                value={form.info.team_size}
                onChange={handleChange}
                disabled={loading}
                options={[
                  { value: "1", label: "Just me" },
                  { value: "2-10", label: "2–10 people" },
                  { value: "11-50", label: "11–50 people" },
                  { value: "51-200", label: "51–200 people" },
                  { value: "200+", label: "200+ people" },
                ]}
              />
            </div>
          </motion.section>

          {/* Presence Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              icon={<Globe size={22}/>} 
              title="Global Presence" 
              description="Add your organization's online and physical presence"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Website" 
                name="info.website" 
                value={form.info.website} 
                onChange={handleChange} 
                placeholder="https://example.com" 
                error={errors["info.website"]}
                disabled={loading}
              />
              <Input 
                label="Location" 
                name="info.location" 
                value={form.info.location} 
                onChange={handleChange} 
                placeholder="City, Country" 
                disabled={loading}
              />
              <div className="md:col-span-2">
                <Textarea
                  label="Organization Description"
                  name="info.description"
                  value={form.info.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what your organization does..."
                  rows={4}
                  disabled={loading}
                />
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader 
              icon={<Mail size={22}/>} 
              title="Contact Details" 
              description="Provide contact information for your workspace"
            />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input 
                label="Contact Email" 
                type="email" 
                name="info.contact_email" 
                value={form.info.contact_email} 
                onChange={handleChange} 
                placeholder="admin@company.com" 
                error={errors["info.contact_email"]}
                disabled={loading}
              />
              <Input 
                label="Phone Number" 
                name="info.phone" 
                value={form.info.phone} 
                onChange={handleChange} 
                placeholder="+1 (555) 000-0000" 
                disabled={loading}
              />
            </div>
          </motion.section>

          {/* Action Buttons */}
          <motion.div 
            variants={itemVariants} 
            className="pt-8 pb-4 flex flex-col sm:flex-row justify-end items-center gap-4 border-t border-slate-200"
          >
            <motion.button 
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDiscard}
              disabled={loading}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl border-2 border-slate-200 bg-white text-slate-700 font-semibold text-sm hover:border-red-200 hover:text-red-600 hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
            >
              <Trash2 size={16} /> Discard Changes
            </motion.button>
            
            <motion.button 
              type="submit" 
              disabled={loading || !form.name}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 text-white px-10 py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40"
            >
              {loading ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <Zap size={18} />
                  </motion.div>
                  Creating Workspace...
                </>
              ) : (
                <>
                  Create Workspace <ChevronRight size={18} />
                </>
              )}
            </motion.button>
          </motion.div>

          {/* Helper Text */}
          <motion.p 
            variants={itemVariants}
            className="text-center text-sm text-slate-500"
          >
            By creating a workspace, you agree to our Terms of Service and Privacy Policy
          </motion.p>
        </motion.form>
      </div>
    </div>
  );
}

/* ========================================
   UI COMPONENTS
   ======================================== */

const SectionHeader = ({ icon, title, description }) => (
  <div className="mb-8 pb-6 border-b-2 border-slate-100">
    <div className="flex items-center gap-3 mb-2">
      <div className="text-blue-600">{icon}</div>
      <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{title}</h3>
    </div>
    {description && (
      <p className="text-slate-600 text-sm ml-9">{description}</p>
    )}
  </div>
);

const Input = ({ label, error, required, disabled, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <motion.input
        whileFocus={{ scale: 1.005 }}
        {...props}
        disabled={disabled}
        className={`w-full rounded-xl border-2 ${
          error 
            ? 'border-red-300 bg-red-50 focus:border-red-500 focus:ring-red-500/10' 
            : 'border-slate-200 bg-white focus:border-blue-500 focus:ring-blue-500/10'
        } px-4 py-3 text-slate-900 font-medium focus:bg-white focus:ring-4 transition-all outline-none placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed`}
      />
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute -bottom-6 left-0 flex items-center gap-1 text-red-600 text-xs font-medium"
          >
            <AlertCircle size={12} />
            {error}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

const Textarea = ({ label, required, disabled, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      disabled={disabled}
      className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 font-medium focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 transition-all outline-none resize-none placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

const Select = ({ label, options, required, disabled, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-1.5">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        disabled={disabled}
        className="w-full rounded-xl border-2 border-slate-200 bg-white px-4 py-3 text-slate-900 font-medium focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="" className="text-slate-400">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronRight 
        size={18} 
        className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none" 
      />
    </div>
  </div>
);

const StatusItem = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-sm font-medium text-blue-50">
    <div className="p-2.5 bg-white/10 backdrop-blur-sm rounded-lg text-white border border-white/10">
      {icon}
    </div>
    <span>{text}</span>
  </div>
);

const ProgressStep = ({ completed, label }) => (
  <div className="flex items-center gap-3">
    <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
      completed 
        ? 'bg-green-400 text-white' 
        : 'bg-white/10 border-2 border-white/20'
    }`}>
      {completed && <Check size={12} strokeWidth={3} />}
    </div>
    <span className={`text-sm font-medium transition-all ${
      completed ? 'text-white' : 'text-blue-100/60'
    }`}>
      {label}
    </span>
  </div>
);