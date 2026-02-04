// //============================================================================================
// // google gemini
// //============================================================================================



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // High-level animations
import { 
  Building2, Users, Globe, MapPin, Mail, Phone, 
  ChevronRight, LayoutDashboard, ShieldCheck, Zap, Trash2 
} from "lucide-react";
import toast, { Toaster } from 'react-hot-toast';
import { getStoredToken, getSessionToken } from '../../utils/authToken';

export default function Workspace() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const accessToken = getStoredToken() || getSessionToken();
      if (!accessToken) {
        toast.error('Authentication required. Please login again.');
        setLoading(false);
        return;
      }

      // Prepare workspace data according to CreateWorkspaceSerializer format
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
      toast.success('Your workspace is created!', { duration: 2000 });
      
      // No need to store in localStorage - dashboard will fetch from API
      
      setForm({
        name: "",
        info: { team_size: "", industry: "", description: "", website: "", location: "", contact_email: "", phone: "" },
      });

      // Navigate to workspace dashboard after 1 second
      setTimeout(() => {
        navigate('/auth/workspace-dashboard');
      }, 1000);

    } catch (error) {
      toast.error(error.message || 'Failed to create workspace');
    } finally {
      setLoading(false);
    }
  };

  const handleDiscard = () => {
    setForm({
      name: "",
      info: { team_size: "", industry: "", description: "", website: "", location: "", contact_email: "", phone: "" },
    });
    toast.error('Changes discarded');
  };

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.3 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 100 } }
  };

  return (
    <div className="h-screen w-full bg-white flex flex-col md:flex-row font-sans selection:bg-blue-100 overflow-hidden">
      <Toaster position="top-right" />
        <motion.aside 
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "circOut" }}
          className="md:w-[380px] bg-blue-700 p-12 text-white flex flex-col justify-between shrink-0 h-full relative overflow-hidden"
        >
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
          <motion.div 
              animate={{ scale: [1, 1.5, 1], rotate: [0, 90, 0] }}
              transition={{ duration: 15, repeat: Infinity }}
              className="absolute -top-24 -right-24 w-64 h-64 bg-white rounded-full blur-[80px]"
          />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-4 mb-10">
          <motion.div 
            whileHover={{ scale: 1.1, rotate: -5 }}
            className="w-16 h-16 bg-blue-700 border-2 border-white rounded-2xl flex items-center justify-center shadow-2xl font-black text-3xl text-white shrink-0"
          >
            P
          </motion.div>
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-3xl font-black tracking-tight leading-[1.1]"
          >
            Placfy Workspace
          </motion.h1>
            </div>
            <p className="text-blue-100 text-lg leading-relaxed opacity-80">
          Configure your organization's digital hub. Set team sizes, industries, and contact preferences.
            </p>
          </div>

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-blue-200 border-b border-blue-600/50 pb-2">System Status</div>
            <StatusItem icon={<ShieldCheck size={20}/>} text="End-to-End Encryption" />
            <StatusItem icon={<Zap size={20}/>} text="API Access Enabled" />
          </div>
        </motion.aside>

        {/* MAIN CONTENT AREA - Independent Scroll */}
      <div className="flex-1 bg-white h-full overflow-y-auto custom-scrollbar">
        <motion.form 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          onSubmit={handleSubmit} 
          className="max-w-5xl mx-auto p-8 md:p-20 space-y-16"
        >
          
          {/* Identity Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader icon={<Building2 size={24}/>} title="Workspace Identity" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <div className="md:col-span-2">
                <Input label="Workspace Name" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Acme Corporation" required />
              </div>
              
              <Select
                label="Industry"
                name="info.industry"
                value={form.info.industry}
                onChange={handleChange}
                options={[
                  { value: "technology", label: "Technology" },
                  { value: "healthcare", label: "Healthcare" },
                  { value: "finance", label: "Finance" },
                  { value: "education", label: "Education" },
                  { value: "retail", label: "Retail" },
                  { value: "other", label: "Other" },
                ]}
              />

              <Select
                label="Team Size"
                name="info.team_size"
                value={form.info.team_size}
                onChange={handleChange}
                options={[
                  { value: "1", label: "1 person" },
                  { value: "2-10", label: "2–10 people" },
                  { value: "11-50", label: "11–50 people" },
                  { value: "200+", label: "200+ people" },
                ]}
              />
            </div>
          </motion.section>

          {/* Presence Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader icon={<Globe size={24}/>} title="Global Presence" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Input label="Website" name="info.website" value={form.info.website} onChange={handleChange} placeholder="https://example.com" />
              <Input label="Location" name="info.location" value={form.info.location} onChange={handleChange} placeholder="City, Country" />
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-slate-800 mb-3 ml-1">Organization Description</label>
                <textarea
                  name="info.description"
                  rows="5"
                  value={form.info.description}
                  onChange={handleChange}
                  placeholder="Briefly describe what your organization does..."
                  className="w-full rounded-2xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-slate-900 font-medium focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/5 transition-all outline-none resize-none shadow-sm"
                />
              </div>
            </div>
          </motion.section>

          {/* Contact Section */}
          <motion.section variants={itemVariants}>
            <SectionHeader icon={<Mail size={24}/>} title="Contact Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <Input label="Contact Email" type="email" name="info.contact_email" value={form.info.contact_email} onChange={handleChange} placeholder="admin@company.com" />
              <Input label="Phone Number" name="info.phone" value={form.info.phone} onChange={handleChange} placeholder="+91 (000) 000-0000" />
            </div>
          </motion.section>

          {/* BUTTONS */}
          <motion.div variants={itemVariants} className="pt-12 pb-20 flex flex-col sm:flex-row justify-center items-center gap-6 border-t border-slate-100">
            <motion.button 
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDiscard}
              disabled={loading}
              className="w-full sm:w-auto px-10 py-4 rounded-xl border-2 border-slate-100 text-slate-400 font-bold text-sm hover:border-red-100 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Trash2 size={18} /> Discard Changes
            </motion.button>
            
            <motion.button 
              type="submit" 
              disabled={loading}
              whileHover={{ scale: 1.05, boxShadow: "0 20px 40px -12px rgba(29, 78, 216, 0.3)" }}
              whileTap={{ scale: 0.95 }}
              className="w-full sm:w-auto bg-blue-700 text-white px-12 py-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? (
                <>
                  <span className="inline-block animate-spin">⚙️</span> Creating...
                </>
              ) : (
                <>
                  Create Workspace <ChevronRight size={20} />
                </>
              )}
            </motion.button>
          </motion.div>
        </motion.form>
      </div>
    </div>
  );
}

/* UI HELPERS */
const SectionHeader = ({ icon, title }) => (
  <div className="flex items-center gap-4 mb-10 border-l-4 border-blue-700 pl-6">
    <div className="text-blue-700">{icon}</div>
    <h2 className="text-2xl font-black text-slate-900 tracking-tight">{title}</h2>
  </div>
);

const Input = ({ label, ...props }) => (
  <div className="flex flex-col">
    <label className="text-sm font-bold text-slate-800 mb-3 ml-1">{label}</label>
    <motion.input
      whileFocus={{ scale: 1.01 }}
      {...props}
      className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-slate-900 font-medium focus:border-blue-700 focus:bg-white focus:ring-4 focus:ring-blue-700/5 transition-all outline-none shadow-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div className="flex flex-col relative group">
    <label className="text-sm font-bold text-slate-800 mb-3 ml-1">{label}</label>
    <div className="relative">
      <select
        {...props}
        className="w-full rounded-xl border-2 border-slate-50 bg-slate-50 px-6 py-4 text-slate-900 font-medium focus:border-blue-700 focus:bg-white transition-all outline-none appearance-none cursor-pointer shadow-sm"
      >
        <option value="">Select {label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronRight size={20} className="absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-slate-300 pointer-events-none" />
    </div>
  </div>
);

const StatusItem = ({ icon, text }) => (
  <div className="flex items-center gap-4 text-md font-semibold text-blue-100">
    <div className="p-3 bg-blue-800 rounded-xl text-white shadow-inner">{icon}</div>
    {text}
  </div>
);



// ===========================================================================================================================
