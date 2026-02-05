<<<<<<< HEAD
import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  Search,
  Bell,
=======

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import {
  Search, ShoppingBag, Users, Box, LayoutDashboard,
  BarChart3, Megaphone, LogOut, Bell, ArrowRight,
  Plus, Filter, MoreHorizontal, TrendingUp, Package, CreditCard,
  UserPlus, Mail, ShieldCheck
>>>>>>> bc20423 (invit)
} from "lucide-react";


/* --- MANAGE MEMBER COMPONENT --- */
const ManageMember = () => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("member");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // 'success' or 'error'
  const [sentInvitations, setSentInvitations] = useState([]);
  const [workspaceSlug, setWorkspaceSlug] = useState(null);
  const [workspaceId, setWorkspaceId] = useState(null);
  const [loadingWorkspace, setLoadingWorkspace] = useState(true);
  const [showAllInvitations, setShowAllInvitations] = useState(false);
  const [allInvitations, setAllInvitations] = useState([]);
  const [loadingAllInvitations, setLoadingAllInvitations] = useState(false);

  // Fetch workspace on mount
  useEffect(() => {
    fetchWorkspace();
  }, []);

  const fetchWorkspace = async () => {
    try {
      setLoadingWorkspace(true);
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      
      if (!token) {
        setMessage("✗ Please login first");
        setMessageType("error");
        setLoadingWorkspace(false);
        return;
      }

      // Fetch user's workspaces
      const response = await fetch(
        `http://localhost:8000/api/v1/workspaces/`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to fetch workspace (${response.status})`);
      }

      const workspaces = await response.json();
      console.log('Fetched workspaces:', workspaces);
      
      // Get the first workspace's slug and ID (or user can select from multiple)
      if (workspaces && workspaces.length > 0) {
        const workspace = workspaces[0];
        console.log('Using workspace:', workspace);
        setWorkspaceSlug(workspace.slug);
        setWorkspaceId(workspace.id);
        localStorage.setItem('workspace_slug', workspace.slug);
        localStorage.setItem('workspace_id', workspace.id);
      } else {
        setMessage("✗ No workspace found");
        setMessageType("error");
      }
    } catch (error) {
      console.error('Error fetching workspace:', error);
      setMessage(`✗ ${error.message}`);
      setMessageType("error");
    } finally {
      setLoadingWorkspace(false);
    }
  };

  const handleInvite = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setMessage("Please enter an email address");
      setMessageType("error");
      return;
    }

    if (!workspaceSlug) {
      setMessage("✗ Workspace not loaded");
      setMessageType("error");
      return;
    }

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      // Get token from storage
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      
      if (!token) {
        setMessage("✗ Please login first");
        setMessageType("error");
        setLoading(false);
        return;
      }

      // Send invitation API call
      const inviteUrl = `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/invitations/`;
      console.log('📧 Sending invitation to:', inviteUrl);
      console.log('   Email:', email.trim(), '| Role:', role);
      
      const response = await fetch(inviteUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          email: email.trim(),
          role: role,
        }),
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to send invitation';
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.email?.[0] || errorData.detail || errorMessage;
          } catch (e) {
            errorMessage = `Server error (${response.status})`;
          }
        } else {
          errorMessage = `Server error (${response.status}). Check that the workspace slug is correct.`;
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('✅ Invitation sent successfully:', data);
      
      // Success
      setMessage(`✓ Invitation sent to ${email}`);
      setMessageType("success");
      setSentInvitations([data, ...sentInvitations]);
      setEmail("");
      setRole("member");

      // Clear message after 3 seconds
      setTimeout(() => setMessage(""), 3000);
    } catch (error) {
      setMessage(`✗ ${error.message}`);
      setMessageType("error");
      console.error('❌ Invitation error:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllInvitations = async () => {
    try {
      setLoadingAllInvitations(true);
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      
      if (!token) {
        setMessage("✗ Please login first");
        setMessageType("error");
        return;
      }

      if (!workspaceSlug) {
        setMessage("✗ Workspace not loaded");
        setMessageType("error");
        return;
      }

      // Fetch all invitations for the workspace
      const allInvitationsUrl = `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/invitations/`;
      console.log('📋 Fetching all invitations from:', allInvitationsUrl);
      
      const response = await fetch(allInvitationsUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const contentType = response.headers.get('content-type');
        let errorMessage = 'Failed to fetch invitations';
        
        if (contentType && contentType.includes('application/json')) {
          try {
            const errorData = await response.json();
            errorMessage = errorData.detail || errorMessage;
          } catch (e) {
            errorMessage = `Server error (${response.status})`;
          }
        } else {
          errorMessage = `Server error (${response.status})`;
        }
        throw new Error(errorMessage);
      }

      const invitations = await response.json();
      console.log('✅ All invitations fetched:', invitations);
      setAllInvitations(invitations);
      setShowAllInvitations(true);
    } catch (error) {
      console.error('❌ Error fetching invitations:', error);
      setMessage(`✗ Failed to load invitations: ${error.message}`);
      setMessageType("error");
    } finally {
      setLoadingAllInvitations(false);
    }
  };

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="py-6 shrink-0">
        <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Manage Members</h1>
        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Add or invite new team members</p>
      </header>

      {loadingWorkspace ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-slate-600 font-bold">Loading workspace...</p>
          </div>
        </div>
      ) : (
        <>
          {/* MESSAGE ALERT */}
          {message && (
            <div className={`mb-4 p-4 rounded-xl font-bold text-sm animate-in fade-in duration-300 ${
              messageType === 'success' 
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {message}
            </div>
          )}

          {/* INVITE FORM CARD */}
          <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                <UserPlus size={20} />
              </div>
              <h2 className="font-black text-slate-800 text-lg">Invite Member</h2>
            </div>

            <form onSubmit={handleInvite} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* EMAIL INPUT */}
              <div className="relative group">
                <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <input 
                  type="email" 
                  required
                  placeholder="Email address"
                  disabled={loading}
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-medium outline-none focus:border-indigo-500 focus:bg-white transition-all disabled:opacity-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              {/* ROLE DROPDOWN */}
              <div className="relative group">
                <ShieldCheck size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                <select 
                  className="w-full bg-slate-50 border border-slate-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold text-slate-700 outline-none focus:border-indigo-500 focus:bg-white transition-all appearance-none disabled:opacity-50"
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

              {/* INVITE BUTTON */}
              <button 
                type="submit"
                disabled={loading}
                className="bg-indigo-600 text-white rounded-2xl py-4 px-8 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending...' : 'Send Invite'}
              </button>
            </form>
          </div>

          {/* VIEW ALL INVITATIONS BUTTON */}
          <div className="mt-6 flex justify-end">
            <button 
              onClick={fetchAllInvitations}
              disabled={loadingAllInvitations}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
            >
              <Mail size={18} />
              {loadingAllInvitations ? 'Loading...' : 'View All Invitations'}
            </button>
          </div>

          {/* ALL INVITATIONS MODAL/SECTION */}
          {showAllInvitations && (
            <div className="mt-8 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1 overflow-hidden flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                    <Mail size={20} />
                  </div>
                  <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">All Invitations</h3>
                </div>
                <button 
                  onClick={() => setShowAllInvitations(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {loadingAllInvitations ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-slate-600 font-bold">Loading invitations...</p>
                </div>
              ) : allInvitations.length === 0 ? (
                <div className="flex items-center justify-center py-8">
                  <p className="text-slate-500 font-bold">No invitations found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Email</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Role</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Sent</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Expires</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allInvitations.map((inv) => (
                        <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                          <td className="py-4 px-4 font-medium text-slate-700">{inv.email}</td>
                          <td className="py-4 px-4">
                            <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                              {inv.role_display || inv.role}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${
                              inv.status === 'pending' ? 'bg-yellow-50 text-yellow-700' :
                              inv.status === 'accepted' ? 'bg-green-50 text-green-700' :
                              inv.status === 'declined' ? 'bg-red-50 text-red-700' :
                              'bg-slate-50 text-slate-700'
                            }`}>
                              {inv.status_display || inv.status}
                            </span>
                          </td>
                          <td className="py-4 px-4 text-slate-600 text-xs">
                            {new Date(inv.sent_at).toLocaleDateString()}
                          </td>
                          <td className="py-4 px-4 text-slate-600 text-xs">
                            {new Date(inv.expires_at).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

        </>
      )}
    </div>
  );
};

/* --- MAIN DASHBOARD --- */
export default function AdminDashboard() {
<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-[#eef2ff] flex font-sans">
      
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#5a4fff] text-white flex flex-col">
        <div className="px-6 py-6 text-2xl font-extrabold tracking-tight">
          Placfy
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <SidebarItem icon={<Users size={18} />} label="Candidates" />
          <SidebarItem icon={<Briefcase size={18} />} label="Jobs" />
          <SidebarItem icon={<Calendar size={18} />} label="Interviews" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4">
          <div className="bg-white/15 rounded-xl p-4 text-sm">
            Upgrade to Premium
          </div>
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b border-slate-200">
          <h1 className="text-xl font-bold text-slate-800">
            Dashboard
          </h1>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                placeholder="Search"
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:border-[#5a4fff]"
              />
            </div>

            <Bell size={20} className="text-slate-500" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#5a4fff]" />
              <span className="text-sm font-medium text-slate-700">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8 space-y-8">
          
          {/* GREETING */}
          <div className="bg-[#5a4fff] rounded-2xl p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                Hello Admin 👋
              </h2>
              <p className="text-white/80 mt-1 text-sm">
                You have 9 new applications today
              </p>
            </div>

            <button className="bg-white text-[#5a4fff] px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100">
              View Applications
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat title="Total Candidates" value="1,245" />
            <Stat title="Open Positions" value="42" />
            <Stat title="Interviews Today" value="18" />
          </div>

          {/* TABLE + PROFILE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* TABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200">
              <h3 className="text-sm font-bold text-slate-700 mb-4">
                Recruitment Progress
              </h3>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-slate-400">
                    <th className="py-2">Candidate</th>
                    <th>Status</th>
                    <th>Stage</th>
                  </tr>
                </thead>
                <tbody className="text-slate-700">
                  <TableRow name="Riya Sharma" status="Interview" />
                  <TableRow name="Aman Verma" status="Review" />
                  <TableRow name="Neha Patel" status="Hired" />
                </tbody>
              </table>
            </div>

            {/* PROFILE CARD */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-[#5a4fff] mb-4" />
                <h4 className="font-semibold text-slate-800">
                  Admin User
                </h4>
                <p className="text-sm text-slate-500">
                  HR Manager
                </p>
              </div>

              <div className="mt-6 space-y-3 text-sm text-slate-600">
                <div className="flex justify-between">
                  <span>Company</span>
                  <span>Placfy</span>
                </div>
                <div className="flex justify-between">
                  <span>Active Jobs</span>
                  <span>12</span>
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
=======
  const navigate = useNavigate();
  const [activeView, setActiveView] = useState('dashboard');
  const [stats] = useState({
    sales: "263k",
    visitors: "35k",
    orders: "165k",
  });

  return (
    <div className="h-screen w-full bg-[#EEF2FF] flex font-sans overflow-hidden p-4">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-600 rounded-[2.5rem] flex flex-col p-8 shrink-0 hidden lg:flex shadow-2xl overflow-hidden">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-white p-1.5 rounded-xl">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white uppercase italic">Placfy</span>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-8">Management</p>
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
          <SidebarLink icon={<Users size={20}/>} label="manage members" active={activeView === 'manage-members'} onClick={() => setActiveView('manage-members')} />
          <SidebarLink icon={<Box size={20}/>} label="Products" />
          <SidebarLink icon={<BarChart3 size={20}/>} label="Analytics" />
          <SidebarLink icon={<Megaphone size={20}/>} label="Marketing" />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>
          <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
             <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-black truncate">Mytecsys Hub</span>
               <span className="text-[10px] text-indigo-200 font-bold opacity-70">Enterprise</span>
             </div>
             <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
          <button className="flex items-center gap-3 text-indigo-200 mt-6 font-bold text-sm hover:text-white transition-colors ml-4">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-full overflow-hidden px-8">
        
        {activeView === 'dashboard' ? (
          <>
            {/* HEADER */}
            <header className="py-6 flex items-center justify-between shrink-0">
              <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Admin Dashboard</h1>
              
              <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
                <div className="relative group hidden md:block">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input type="text" placeholder="Search orders..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-60 transition-all" />
                </div>
                
                <div className="flex items-center gap-3 px-4 border-l border-slate-200/60">
                  <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
                    <Bell size={20} />
                    <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
                  </button>
                  <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200/60">
                    <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
                        <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin" alt="user" />
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* DASHBOARD CONTENT */}
            <div className="flex-1 flex gap-8 min-h-0 pb-6 overflow-hidden">
              <div className="flex-[3] flex flex-col gap-6 min-w-0 overflow-y-auto pr-2 scrollbar-hide">
                <div className="grid grid-cols-3 gap-4 shrink-0">
                  <StatCard title="Total Sales" value={`$${stats.sales}`} change="+15.4%" icon={<CreditCard className="text-indigo-600" size={20}/>}/>
                  <StatCard title="Total Visitors" value={stats.visitors} change="+2.1k" icon={<Users className="text-indigo-600" size={20}/>}/>
                  <StatCard title="Total Orders" value={stats.orders} change="12 Pending" icon={<Package className="text-indigo-600" size={20}/>}/>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1 min-h-0 flex flex-col">
                  <div className="flex items-center justify-between mb-8 shrink-0">
                    <h3 className="font-black text-slate-800 text-lg">Live Transactions</h3>
                    <div className="flex gap-2">
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><Filter size={18} /></button>
                        <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><MoreHorizontal size={18} /></button>
                    </div>
                  </div>
                  <div className="space-y-6 overflow-y-auto scrollbar-hide pr-2">
                    <ActivityItem text="New order placed by Jane Cooper" time="2 mins ago" status="Success" color="bg-emerald-400" />
                    <ActivityItem text="New user registered: Alex M." time="15 mins ago" status="User" color="bg-indigo-400" />
                    <ActivityItem text="Product 'Wireless Hub' stock updated" time="1 hour ago" status="Inventory" color="bg-sky-400" />
                  </div>
                </div>
              </div>

              <div className="w-[340px] flex flex-col gap-6 shrink-0 overflow-hidden">
                 <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 shrink-0">
                    <h4 className="font-black text-slate-800 text-sm mb-6">Inventory Health</h4>
                    <div className="space-y-5">
                        <ProgressStep label="In Stock" count="1,420" percent={90} color="bg-indigo-500" />
                        <ProgressStep label="Low Stock" count="18" percent={15} color="bg-orange-500" />
                    </div>
                 </div>
              </div>
            </div>
          </>
        ) : (
          <ManageMember />
        )}
      </main>
>>>>>>> bc20423 (invit)
    </div>
  );
}

<<<<<<< HEAD
/* ================= UI PARTS ================= */

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
      ${active ? "bg-white/20" : "hover:bg-white/15"}
    `}
  >
    {icon}
    {label}
  </div>
);

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-2xl p-6 border border-slate-200">
    <p className="text-xs text-slate-400 font-bold uppercase mb-1">
      {title}
    </p>
    <p className="text-2xl font-extrabold text-slate-800">
      {value}
    </p>
  </div>
);

const TableRow = ({ name, status }) => (
  <tr className="border-t border-slate-200">
    <td className="py-3">{name}</td>
    <td>{status}</td>
    <td className="text-[#5a4fff] font-medium">In Progress</td>
  </tr>
);
=======
/* --- REUSABLE ATOMS --- */
function SidebarLink({ icon, label, active, onClick }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all shrink-0 ${active ? 'bg-white/15 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5'}`} onClick={onClick}>
      <span className={active ? "text-white" : "text-indigo-300"}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">{icon}</div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
          <span className="text-[9px] font-black text-emerald-500 mb-0.5 truncate">{change}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, status, color }) {
  return (
    <div className="flex items-center justify-between group py-1">
      <div className="flex items-center gap-4 min-w-0">
        <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-slate-50 shrink-0`} />
        <div className="min-w-0">
          <p className="text-xs font-black text-slate-700 truncate">{text}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">{time}</p>
        </div>
      </div>
      <span className="text-[8px] font-black uppercase text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors shrink-0 ml-2">{status}</span>
    </div>
  );
}

function ProgressStep({ label, count, percent, color }) {
  return (
    <div className="space-y-1">
        <div className="flex justify-between text-[10px] font-black uppercase">
            <span className="text-slate-400">{label}</span>
            <span className="text-slate-800">{count}</span>
        </div>
        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div className={`h-full ${color}`} style={{width: `${percent}%`}} />
        </div>
    </div>
  );
}
>>>>>>> bc20423 (invit)
