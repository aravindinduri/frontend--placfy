import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import {
  Search, ShoppingBag, Users, Box, LayoutDashboard,
  BarChart3, Megaphone, LogOut, Bell, ArrowRight,
  Plus, Filter, MoreHorizontal, TrendingUp, Package, CreditCard,
  UserPlus, Mail, ShieldCheck, Trash2, Edit
} from "lucide-react";
import InvitationModal from "./InvitationModal";


/* --- MANAGE MEMBER COMPONENT --- */
const ManageMember = () => {
  const [members, setMembers] = useState([]);
  const [invitations, setInvitations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [workspaceSlug, setWorkspaceSlug] = useState(null);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [editingRole, setEditingRole] = useState(null);

  useEffect(() => {
    fetchWorkspaceAndMembers();
  }, []);

  const fetchWorkspaceAndMembers = async () => {
    try {
      setLoading(true);
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();
      
      if (!token) {
        setMessage("✗ Please login first");
        setMessageType("error");
        return;
      }

      // Fetch workspace
      const workspaceResponse = await fetch(
        `http://localhost:8000/api/v1/workspaces/`,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!workspaceResponse.ok) throw new Error('Failed to fetch workspace');

      const workspaces = await workspaceResponse.json();
      if (workspaces && workspaces.length > 0) {
        const workspace = workspaces[0];
        setWorkspaceSlug(workspace.slug);

        // Fetch members
        await fetchMembers(workspace.slug, token);
        
        // Fetch invitations
        await fetchInvitations(workspace.slug, token);
      }
    } catch (error) {
      console.error('Error:', error);
      setMessage(`✗ ${error.message}`);
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const fetchMembers = async (slug, token) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/workspaces/${slug}/members/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setMembers(data);
    }
  };

  const fetchInvitations = async (slug, token) => {
    const response = await fetch(
      `http://localhost:8000/api/v1/workspaces/${slug}/invitations/`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      }
    );

    if (response.ok) {
      const data = await response.json();
      setInvitations(data.filter(inv => inv.status === 'pending'));
    }
  };

  const handleInviteSuccess = (newInvitation) => {
    setInvitations([newInvitation, ...invitations]);
    setMessage("✓ Invitation sent successfully!");
    setMessageType("success");
    setTimeout(() => setMessage(""), 3000);
  };

  const handleRemoveMember = async (memberId) => {
    if (!confirm('Are you sure you want to remove this member?')) return;

    try {
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();

      const response = await fetch(
        `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/members/${memberId}/`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        setMembers(members.filter(m => m.id !== memberId));
        setMessage("✓ Member removed successfully");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(`✗ Failed to remove member: ${error.message}`);
      setMessageType("error");
    }
  };

  const handleUpdateRole = async (memberId, newRole) => {
    try {
      const sessionToken = getSessionToken();
      const token = sessionToken || getStoredToken();

      const response = await fetch(
        `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/members/${memberId}/`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
          body: JSON.stringify({ role: newRole }),
        }
      );

      if (response.ok) {
        const updatedMember = await response.json();
        setMembers(members.map(m => m.id === memberId ? updatedMember : m));
        setEditingRole(null);
        setMessage("✓ Role updated successfully");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      setMessage(`✗ Failed to update role: ${error.message}`);
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading members...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full animate-in fade-in duration-500">
      <header className="py-6 shrink-0 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Manage Members</h1>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Team collaboration & access control</p>
        </div>
        <button
          onClick={() => setIsInviteModalOpen(true)}
          className="bg-indigo-600 text-white rounded-2xl py-3 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
        >
          <UserPlus size={18} />
          Invite Member
        </button>
      </header>

      {message && (
        <div className={`mb-4 p-4 rounded-xl font-bold text-sm animate-in fade-in duration-300 ${
          messageType === 'success' 
            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      {/* ACTIVE MEMBERS TABLE */}
      <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 mb-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
            <Users size={20} />
          </div>
          <h2 className="font-black text-slate-800 text-lg">Active Members ({members.length})</h2>
        </div>

        {members.length === 0 ? (
          <div className="text-center py-12">
            <Users size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">No members yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Member</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Joined</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr key={member.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full overflow-hidden">
                          <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${member.user_email}`} alt="" />
                        </div>
                        <span className="font-bold text-slate-700">{member.user_name || 'User'}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-medium text-slate-600">{member.user_email}</td>
                    <td className="py-4 px-4">
                      {editingRole === member.id ? (
                        <select
                          className="bg-slate-50 border border-slate-200 rounded-xl px-3 py-1 text-xs font-bold"
                          defaultValue={member.role}
                          onChange={(e) => handleUpdateRole(member.id, e.target.value)}
                          onBlur={() => setEditingRole(null)}
                          autoFocus
                        >
                          <option value="admin">Admin</option>
                          <option value="hr">HR</option>
                          <option value="hr_recruiter">HR Recruiter</option>
                          <option value="member">Member</option>
                          <option value="recruiter">Recruiter</option>
                          <option value="staff">Staff</option>
                        </select>
                      ) : (
                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                          {member.role_display || member.role}
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-slate-600 text-xs">
                      {new Date(member.joined_at).toLocaleDateString()}
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setEditingRole(member.id)}
                          className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group"
                          title="Change Role"
                        >
                          <Edit size={16} className="text-slate-400 group-hover:text-indigo-600" />
                        </button>
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                          title="Remove Member"
                        >
                          <Trash2 size={16} className="text-slate-400 group-hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* PENDING INVITATIONS */}
      {invitations.length > 0 && (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-yellow-50 rounded-xl flex items-center justify-center text-yellow-600">
              <Mail size={20} />
            </div>
            <h2 className="font-black text-slate-800 text-lg">Pending Invitations ({invitations.length})</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Email</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Role</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Sent</th>
                  <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Expires</th>
                </tr>
              </thead>
              <tbody>
                {invitations.map((inv) => (
                  <tr key={inv.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-4 font-medium text-slate-700">{inv.email}</td>
                    <td className="py-4 px-4">
                      <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                        {inv.role_display || inv.role}
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
        </div>
      )}

      <InvitationModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        workspaceSlug={workspaceSlug}
        onSuccess={handleInviteSuccess}
      />
    </div>
  );
};

/* --- MAIN DASHBOARD --- */
export default function AdminDashboard() {
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
    </div>
  );
}

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
