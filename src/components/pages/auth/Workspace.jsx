import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Users, Globe, Mail, Phone,
  ChevronRight, ArrowLeft, Save
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
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden">
      <Toaster position="top-right" />

      {/* Background Decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Blobs - More Visible */}
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-indigo-200 to-purple-200 rounded-full blur-3xl opacity-60 -translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-gradient-to-tl from-blue-200 to-cyan-200 rounded-full blur-3xl opacity-60 translate-x-1/3 -translate-y-1/3"></div>
        <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] bg-gradient-to-br from-purple-100 to-pink-100 rounded-full blur-3xl opacity-50 -translate-x-1/2 -translate-y-1/2"></div>

        {/* Stronger Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808018_1px,transparent_1px),linear-gradient(to_bottom,#80808018_1px,transparent_1px)] bg-[size:64px_64px]"></div>

        {/* More Prominent Floating Geometric Shapes */}
        <div className="absolute top-20 right-20 w-24 h-24 border-4 border-indigo-300/40 rounded-2xl rotate-12 animate-pulse"></div>
        <div className="absolute bottom-40 left-20 w-20 h-20 border-4 border-purple-300/40 rounded-full animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/3 right-1/4 w-16 h-16 border-4 border-blue-300/40 rounded-xl rotate-45 animate-pulse" style={{ animationDelay: '2s' }}></div>

        {/* Additional Accent Shapes */}
        <div className="absolute top-40 left-1/4 w-32 h-32 bg-gradient-to-br from-indigo-100/30 to-transparent rounded-3xl rotate-12"></div>
        <div className="absolute bottom-20 right-1/3 w-28 h-28 bg-gradient-to-tl from-purple-100/30 to-transparent rounded-full"></div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6 relative z-10">
        <div className="w-full max-w-5xl">

          {/* Header */}
          <header className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Create Workspace</h1>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Set up your organization workspace</p>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-slate-700 transition-colors"
            >
              <ArrowLeft size={16} /> Back
            </button>
          </header>

          {/* Main Card */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <form onSubmit={handleSubmit} className="max-w-3xl space-y-8">

              {/* Organization Identity */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg">Organization Identity</h2>
                    <p className="text-xs font-bold text-slate-400">Basic information about your company</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <InputGroup
                      label="Workspace Name"
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="e.g. Acme Inc."
                      required
                      error={errors.name}
                      disabled={loading}
                      icon={<Building2 size={16} />}
                      autoFocus
                    />
                  </div>

                  <SelectGroup
                    label="Industry"
                    name="info.industry"
                    value={form.info.industry}
                    onChange={handleChange}
                    disabled={loading}
                    icon={<Globe size={16} />}
                    options={[
                      { value: "technology", label: "Technology" },
                      { value: "healthcare", label: "Healthcare" },
                      { value: "finance", label: "Finance" },
                      { value: "education", label: "Education" },
                      { value: "retail", label: "Retail" },
                      { value: "other", label: "Other" },
                    ]}
                  />

                  <SelectGroup
                    label="Team Size"
                    name="info.team_size"
                    value={form.info.team_size}
                    onChange={handleChange}
                    disabled={loading}
                    icon={<Users size={16} />}
                    options={[
                      { value: "1", label: "Just me" },
                      { value: "2-10", label: "2–10 people" },
                      { value: "11-50", label: "11–50 people" },
                      { value: "50+", label: "50+ people" },
                    ]}
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-6">
                <div className="flex items-center gap-3 mb-6 pb-4 border-b border-slate-100">
                  <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <Phone size={20} />
                  </div>
                  <div>
                    <h2 className="font-black text-slate-800 text-lg">Contact Information</h2>
                    <p className="text-xs font-bold text-slate-400">How can we reach you?</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <InputGroup
                    label="Website"
                    name="info.website"
                    value={form.info.website}
                    onChange={handleChange}
                    placeholder="https://example.com"
                    error={errors["info.website"]}
                    disabled={loading}
                    icon={<Globe size={16} />}
                  />

                  <InputGroup
                    label="Email"
                    name="info.contact_email"
                    type="email"
                    value={form.info.contact_email}
                    onChange={handleChange}
                    placeholder="contact@company.com"
                    error={errors["info.contact_email"]}
                    disabled={loading}
                    icon={<Mail size={16} />}
                  />

                  <InputGroup
                    label="Phone Number"
                    name="info.phone"
                    value={form.info.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 000-0000"
                    disabled={loading}
                    icon={<Phone size={16} />}
                  />

                  <InputGroup
                    label="Location"
                    name="info.location"
                    value={form.info.location}
                    onChange={handleChange}
                    placeholder="City, Country"
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-end gap-4 pt-6 border-t border-slate-100">
                <button
                  type="submit"
                  disabled={loading || !form.name}
                  className="bg-indigo-600 text-white rounded-2xl py-3 px-8 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <Save size={18} />
                  )}
                  Create Workspace
                </button>
              </div>

            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

// Reusable Input Component (matching SettingsPage pattern)
function InputGroup({ label, name, value, onChange, type = "text", placeholder, icon, disabled = false, required = false, error, autoFocus }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none">
            {icon}
          </div>
        )}
        <input
          type={type}
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          placeholder={placeholder}
          autoFocus={autoFocus}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-slate-50 border ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500' : 'border-slate-200 focus:border-indigo-500 focus:ring-indigo-500'
            } rounded-xl focus:outline-none focus:ring-1 font-bold text-slate-700 transition-all placeholder:text-slate-300 ${disabled ? 'cursor-not-allowed bg-slate-100' : ''
            }`}
        />
      </div>
      {error && <p className="text-xs text-red-500 font-bold ml-1">{error}</p>}
    </div>
  );
}

// Reusable Select Component (matching SettingsPage pattern)
function SelectGroup({ label, name, value, onChange, options, icon, disabled = false }) {
  return (
    <div className="space-y-2">
      <label className="text-xs font-bold text-slate-400 uppercase tracking-wider ml-1">{label}</label>
      <div className={`relative flex items-center ${disabled ? 'opacity-60' : ''}`}>
        {icon && (
          <div className="absolute left-4 text-slate-400 pointer-events-none z-10">
            {icon}
          </div>
        )}
        <select
          name={name}
          value={value || ""}
          onChange={onChange}
          disabled={disabled}
          className={`w-full ${icon ? 'pl-12' : 'pl-4'} pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-bold text-slate-700 transition-all appearance-none ${disabled ? 'cursor-not-allowed bg-slate-100' : ''
            }`}
        >
          <option value="">Select...</option>
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      </div>
    </div>
  );
}