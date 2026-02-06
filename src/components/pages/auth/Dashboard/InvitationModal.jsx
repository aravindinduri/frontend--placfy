import { useState } from "react";
import { X, Mail, ShieldCheck, Send } from "lucide-react";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

export default function InvitationModal({ isOpen, onClose, workspaceSlug, onSuccess }) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter an email address");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      
      if (!token) {
        setError("Please login first");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/invitations/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({
            email: email.trim(),
            role: role,
            message: message.trim() || undefined,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.email?.[0] || errorData.detail || 'Failed to send invitation');
      }

      const data = await response.json();
      onSuccess?.(data);
      
      // Reset form
      setEmail("");
      setRole("member");
      setMessage("");
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl animate-in zoom-in duration-300">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
              <Send size={20} />
            </div>
            <h2 className="font-black text-slate-800 text-lg">Invite Member</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-slate-100 rounded-xl transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-4 rounded-xl font-bold text-sm bg-red-50 text-red-700 border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* EMAIL INPUT */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Email Address
            </label>
            <div className="relative group">
              <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <input
                type="email"
                required
                placeholder="colleague@company.com"
                disabled={loading}
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          {/* ROLE DROPDOWN */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Role
            </label>
            <div className="relative group">
              <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
              <select
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none disabled:opacity-50"
                value={role}
                disabled={loading}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="admin">Admin</option>
                <option value="hr">HR</option>
                <option value="hr_recruiter">HR Recruiter</option>
                <option value="member">Member</option>
                <option value="recruiter">Recruiter</option>
                <option value="staff">Staff</option>
              </select>
            </div>
          </div>

          {/* OPTIONAL MESSAGE */}
          <div>
            <label className="block text-xs font-black text-slate-600 uppercase tracking-wider mb-2">
              Welcome Message (Optional)
            </label>
            <textarea
              placeholder="Welcome to our team!"
              disabled={loading}
              className="w-full bg-slate-50 border border-slate-200 rounded-2xl py-4 px-4 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50 resize-none"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* BUTTONS */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-slate-100 text-slate-700 rounded-2xl py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-indigo-600 text-white rounded-2xl py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}