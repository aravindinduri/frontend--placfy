import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, Globe, Mail, Phone,
  ChevronRight, ArrowLeft, Zap, Check, AlertCircle, HelpCircle
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
      toast.success('Workspace created successfully!');

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

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col md:flex-row">
      <Toaster position="top-right" />

      {/* LEFT SIDEBAR - Informational */}
      <div className="w-full md:w-[400px] lg:w-[480px] bg-slate-900 text-slate-300 p-8 md:p-12 flex flex-col justify-between relative overflow-hidden flex-shrink-0">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-12">
            <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-900/50">P</div>
            <span className="text-xl font-bold text-white tracking-tight">Placfy</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-white mb-6 leading-tight">
            Let's set up your digital HQ.
          </h1>
          <p className="text-lg text-slate-400 mb-12 leading-relaxed">
            Create a workspace to organize your team, manage projects, and streamline communication in one central hub.
          </p>

          <div className="space-y-8">
            <BenefitItem
              icon={<Zap className="text-amber-400" />}
              title="Instant Collaboration"
              desc="Real-time chat, tasks, and file sharing."
            />
            <BenefitItem
              icon={<Building2 className="text-emerald-400" />}
              title="Scalable Infrastructure"
              desc="Grows with your team from 2 to 2000+."
            />
            <BenefitItem
              icon={<Globe className="text-sky-400" />}
              title="Global Access"
              desc="Work securely from anywhere in the world."
            />
          </div>
        </div>

        {/* Decorative background pattern */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-indigo-900/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* MAIN CONTENT - Form */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto p-6 md:p-12 lg:p-16">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-800 mb-8 transition-colors"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back
          </button>

          <div className="mb-10">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Create New Workspace</h2>
            <p className="text-slate-500">Enter your organization details to get started.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Identity Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                  <Building2 size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Organization Identity</h3>
                  <p className="text-sm text-slate-500">Basic information about your company</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <Input
                    label="Workspace Name"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="e.g. Acme Inc."
                    required
                    error={errors.name}
                    disabled={loading}
                    autoFocus
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
            </section>

            {/* Presence Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Digital Presence</h3>
                  <p className="text-sm text-slate-500">Where can people find you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Website URL"
                  name="info.website"
                  value={form.info.website}
                  onChange={handleChange}
                  placeholder="https://company.com"
                  error={errors["info.website"]}
                  disabled={loading}
                />
                <Input
                  label="Headquarters Location"
                  name="info.location"
                  value={form.info.location}
                  onChange={handleChange}
                  placeholder="City, Country"
                  disabled={loading}
                />
                <div className="md:col-span-2">
                  <Textarea
                    label="Description"
                    name="info.description"
                    value={form.info.description}
                    onChange={handleChange}
                    placeholder="Briefly describe what your organization does..."
                    rows={3}
                    disabled={loading}
                  />
                </div>
              </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white rounded-2xl p-6 md:p-8 shadow-sm border border-slate-200">
              <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
                <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                  <Mail size={20} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">Contact Info</h3>
                  <p className="text-sm text-slate-500">How should we reach you?</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Admin Email"
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
            </section>

            {/* Action Bar */}
            <div className="sticky bottom-6 z-10">
              <div className="bg-slate-900/95 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex items-center justify-between border border-slate-800">
                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 px-2">
                  <span className="text-sm font-medium text-slate-400">Ready to launch?</span>
                  {form.name && <span className="text-sm font-bold text-emerald-400 flex items-center gap-1"><Check size={14} /> {form.name}</span>}
                </div>
                <button
                  type="submit"
                  disabled={loading || !form.name}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2.5 rounded-lg font-bold text-sm transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>Create Workspace <ChevronRight size={16} /></>
                  )}
                </button>
              </div>
            </div>
          </form>

          <p className="mt-8 text-center text-xs text-slate-400">
            By creating a workspace, you agree to our <a href="#" className="underline hover:text-slate-600">Terms of Service</a>.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ========================================
   UI COMPONENTS
   ======================================== */

const Input = ({ label, error, required, disabled, ...props }) => (
  <div className="flex flex-col group">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <input
        {...props}
        disabled={disabled}
        className={`w-full bg-slate-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500/10' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500/10'
          } rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:ring-4 transition-all disabled:opacity-60 disabled:cursor-not-allowed`}
      />
      {error && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-red-500">
          <AlertCircle size={16} />
        </div>
      )}
    </div>
    {error && <p className="mt-1.5 text-xs text-red-500 font-medium">{error}</p>}
  </div>
);

const Select = ({ label, options, required, disabled, ...props }) => (
  <div className="flex flex-col group">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <div className="relative">
      <select
        {...props}
        disabled={disabled}
        className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <option value="" className="text-slate-400">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronRight
        size={16}
        className="absolute right-4 top-1/2 -translate-y-1/2 rotate-90 text-slate-400 pointer-events-none group-focus-within:text-indigo-500 transition-colors"
      />
    </div>
  </div>
);

const Textarea = ({ label, required, disabled, ...props }) => (
  <div className="flex flex-col group">
    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
      {label}
      {required && <span className="text-red-500">*</span>}
    </label>
    <textarea
      {...props}
      disabled={disabled}
      className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-900 placeholder:text-slate-400 outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all resize-none disabled:opacity-60 disabled:cursor-not-allowed"
    />
  </div>
);

const BenefitItem = ({ icon, title, desc }) => (
  <div className="flex items-start gap-4 group">
    <div className="p-2.5 bg-slate-800 rounded-lg group-hover:bg-slate-700 transition-colors border border-slate-700/50">
      {icon}
    </div>
    <div>
      <h3 className="font-bold text-white text-sm mb-1">{title}</h3>
      <p className="text-sm text-slate-400">{desc}</p>
    </div>
  </div>
);