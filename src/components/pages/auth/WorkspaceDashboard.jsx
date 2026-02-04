// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, Users, Settings, Plus, 
//   BarChart3, Box, Bell, Search, 
//   ArrowUpRight, Clock, ShieldCheck, Mail, Phone,
//   Globe, Zap, ChevronRight, Activity
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { getStoredToken, getSessionToken } from "../../utils/authToken";

// export default function WorkspaceDashboard() {
//   const navigate = useNavigate();
//   const [workspace, setWorkspace] = useState(null);
//   const [totalWorkspaces, setTotalWorkspaces] = useState(0);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     fetchWorkspace();
//   }, []);

//   const fetchWorkspace = async () => {
//     try {
//       const accessToken = getStoredToken() || getSessionToken();
//       if (!accessToken) {
//         toast.error('Authentication required.');
//         setTimeout(() => navigate('/login'), 500);
//         return;
//       }

//       const response = await fetch('/api/v1/workspaces/', {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${accessToken}`,
//         },
//       });

//       if (!response.ok) throw new Error('Failed to fetch workspace');

//       const data = await response.json();
//       const workspaceData = Array.isArray(data) ? data[0] : data;
//       const totalCount = Array.isArray(data) ? data.length : 1;

//       setWorkspace(workspaceData);
//       setTotalWorkspaces(totalCount);
//     } catch (err) {
//       toast.error(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const workspaceName = workspace?.name || "Workspace";

//   if (loading) return (
//     <div className="h-screen w-full flex items-center justify-center bg-[#0B0F1A] text-blue-500 font-black tracking-widest">
//       <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
//         SYNCHRONIZING SYSTEM...
//       </motion.div>
//     </div>
//   );

//   return (
//     <div className="h-screen w-full bg-[#0B0F1A] flex font-sans overflow-hidden text-slate-200">
//       <Toaster position="top-right" />
      
//       {/* SIDEBAR */}
//       <aside className="w-20 md:w-64 bg-[#0F172A] h-full flex flex-col p-6 border-r border-slate-800 shrink-0 z-20">
//         {/* LOGO - KEPT AS REQUESTED */}
//         <motion.div 
//           whileHover={{ scale: 1.1, rotate: -5 }}
//           className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] font-black text-3xl text-white mb-10 mx-auto md:mx-0"
//         >
//           P
//         </motion.div>

//         <nav className="flex-1 space-y-2">
//           <NavItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
//           <NavItem icon={<Users size={20}/>} label="Team Core" />
//           <NavItem icon={<Box size={20}/>} label="Resources" />
//           <NavItem icon={<BarChart3 size={20}/>} label="Analytics" />
//           <div className="pt-8 pb-4 px-4 hidden md:block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Management</div>
//           <NavItem icon={<Settings size={20}/>} label="Settings" />
//         </nav>

//         <div className="mt-auto p-4 bg-slate-800/40 rounded-2xl hidden md:flex items-center gap-3 border border-slate-700">
//           <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-xs font-black">JD</div>
//           <div className="text-[10px] overflow-hidden">
//             <p className="font-bold truncate text-white">Admin Access</p>
//             <p className="opacity-50 truncate">Workspace Owner</p>
//           </div>
//         </div>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col min-w-0 bg-[#0B0F1A] relative">
        
//         {/* TOP BAR */}
//         <header className="h-20 px-8 flex items-center justify-between border-b border-slate-800/60 bg-[#0B0F1A]/80 backdrop-blur-md sticky top-0 z-30">
//           <div>
//             <h1 className="text-xl font-black text-white uppercase tracking-tight flex items-center gap-3">
//               <Activity size={18} className="text-blue-500" />
//               {workspaceName}
//             </h1>
//           </div>

//           <div className="flex items-center gap-4">
//             <div className="hidden lg:flex items-center bg-slate-900 border border-slate-800 rounded-xl px-4 py-2 gap-3 text-slate-500 w-72 focus-within:border-blue-500 transition-all">
//               <Search size={16} />
//               <input type="text" placeholder="Global Search..." className="bg-transparent outline-none text-xs font-bold w-full text-slate-200" />
//             </div>
//             <button className="p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-blue-500 transition-all relative">
//               <Bell size={20} />
//               <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full border-2 border-[#0B0F1A]"></span>
//             </button>
//           </div>
//         </header>

//         {/* CONTENT GRID - INSTANT FADE IN */}
//         <motion.div 
//           initial={{ opacity: 0, y: 10 }}
//           animate={{ opacity: 1, y: 0 }}
//           transition={{ duration: 0.4 }}
//           className="p-8 overflow-y-auto space-y-8"
//         >
//           {/* STATS ROW */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             <StatCard label="Total Workspaces" value={totalWorkspaces} icon={<Box />} color="text-blue-500" sub="Active Nodes" />
//             <StatCard label="Team Size" value={workspace?.info?.team_size || "—"} icon={<Users />} color="text-emerald-500" sub={workspace?.info?.industry || "Uncategorized"} />
//             <StatCard label="Active Members" value={workspace?.member_count || "0"} icon={<Activity />} color="text-purple-500" sub="Verified Users" />
//             <StatCard label="Industry" value={workspace?.info?.industry?.split(' ')[0] || "—"} icon={<Globe />} color="text-orange-500" sub="Organization" />
//           </div>

//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//             {/* MAIN PANEL */}
//             <div className="lg:col-span-2 space-y-6">
//               <div className="relative group overflow-hidden p-10 rounded-[32px] bg-gradient-to-br from-blue-600 to-blue-800 text-white shadow-2xl">
//                 <div className="relative z-10 space-y-4">
//                   <h2 className="text-4xl font-black tracking-tighter uppercase">Command Console</h2>
//                   <p className="text-blue-100 text-sm font-medium max-w-md opacity-80">
//                     System operational. All metrics for <b>{workspaceName}</b> are currently synchronized with the primary cloud cluster.
//                   </p>
//                   <div className="flex gap-4 pt-4">
//                     <button className="px-6 py-3 bg-white text-blue-700 rounded-xl font-black text-xs uppercase hover:scale-105 transition-transform">Launch Project</button>
//                     <button className="px-6 py-3 bg-blue-900/40 border border-blue-400/30 rounded-xl font-black text-xs uppercase hover:bg-blue-900/60 transition-all">Audit Logs</button>
//                   </div>
//                 </div>
//                 <Zap size={200} className="absolute -right-10 -bottom-10 text-white opacity-10 group-hover:scale-110 transition-transform duration-700" />
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <ActionCard title="Invite Team" desc="Onboard new members" icon={<Users className="text-blue-400"/>} />
//                 <ActionCard title="Security Check" desc="Permissions & Privacy" icon={<ShieldCheck className="text-emerald-400"/>} />
//                 <ActionCard title="System Logs" desc="Recent API Activity" icon={<Clock className="text-purple-400"/>} />
//                 <ActionCard title="New Initiative" desc="Start a fresh project" icon={<Plus className="text-orange-400"/>} />
//               </div>
//             </div>

//             {/* SIDE PANEL: INFO & CONTACT */}
//             <div className="space-y-6">
//               <div className="bg-[#0F172A] border border-slate-800 rounded-[32px] p-8 shadow-xl">
//                 <h3 className="font-black text-xs uppercase tracking-widest text-slate-500 mb-8 flex items-center gap-2">
//                   <Globe size={14} /> Workspace Identity
//                 </h3>
                
//                 <div className="space-y-6">
//                   <ContactRow icon={<Mail />} label="Contact Email" value={workspace?.info?.contact_email} />
//                   <ContactRow icon={<Phone />} label="Phone Line" value={workspace?.info?.phone} />
//                   <ContactRow icon={<Globe />} label="Official Website" value={workspace?.info?.website} />
                  
//                   <div className="pt-6 border-t border-slate-800">
//                     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">About Workspace</p>
//                     <p className="text-xs font-bold leading-relaxed text-slate-400 italic">
//                       "{workspace?.info?.description || "This workspace is configured for high-performance organization management and team collaboration."}"
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               {/* RECENT FEED */}
//               <div className="bg-slate-900/50 border border-slate-800/50 rounded-3xl p-6">
//                 <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-4">Pulse Feed</h4>
//                 <div className="space-y-4">
//                   <ActivityLine text="Server Synced" time="Just now" color="bg-blue-500" />
//                   <ActivityLine text="Metadata Updated" time="12m ago" color="bg-emerald-500" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </motion.div>
//       </main>
//     </div>
//   );
// }


// /* HIGH-LEVEL UI COMPONENTS */

// const NavItem = ({ icon, label, active = false }) => (
//   <div className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20 font-black' : 'text-slate-500 hover:bg-slate-800 hover:text-slate-200 font-bold'}`}>
//     {icon} <span className="text-sm hidden md:block">{label}</span>
//   </div>
// );

// const StatCard = ({ label, value, icon, color, sub }) => (
//   <div className="bg-[#0F172A] border border-slate-800 p-6 rounded-3xl shadow-sm hover:border-slate-600 transition-all group">
//     <div className="flex items-center justify-between mb-4">
//       <div className={`p-2.5 rounded-xl bg-slate-800 ${color} group-hover:scale-110 transition-transform`}>{icon}</div>
//       <ChevronRight size={14} className="text-slate-600" />
//     </div>
//     <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
//     <div className="text-2xl font-black text-white tracking-tight">{value}</div>
//     <p className={`text-[9px] font-bold mt-2 uppercase tracking-tighter ${color} opacity-80`}>{sub}</p>
//   </div>
// );

// const ActionCard = ({ title, desc, icon }) => (
//   <div className="flex items-center justify-between p-5 bg-[#0F172A] border border-slate-800 rounded-2xl hover:bg-slate-800 transition-all cursor-pointer group">
//     <div className="flex items-center gap-4">
//       <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 group-hover:border-blue-500 transition-colors">{icon}</div>
//       <div>
//         <h4 className="font-black text-xs uppercase tracking-tight text-white">{title}</h4>
//         <p className="text-[10px] font-bold text-slate-500">{desc}</p>
//       </div>
//     </div>
//     <ArrowUpRight size={16} className="text-slate-700 group-hover:text-blue-500 transition-colors" />
//   </div>
// );

// const ContactRow = ({ icon, label, value }) => (
//   <div className="flex items-center gap-4 group">
//     <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-blue-500 group-hover:bg-blue-600 group-hover:text-white transition-all shadow-inner border border-slate-700/50">
//       {icon}
//     </div>
//     <div className="overflow-hidden">
//       <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
//       <p className="text-xs font-bold text-slate-200 truncate">{value || "Not Configured"}</p>
//     </div>
//   </div>
// );

// const ActivityLine = ({ text, time, color }) => (
//   <div className="flex items-center gap-3">
//     <div className={`w-1.5 h-1.5 rounded-full ${color} shadow-[0_0_8px_${color}]`} />
//     <p className="text-[11px] font-bold text-slate-400">{text}</p>
//     <span className="text-[9px] font-black text-slate-600 ml-auto uppercase tracking-tighter">{time}</span>
//   </div>
// );













import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ShoppingBag, Box, BarChart3, 
  Megaphone, MessageSquare, LogOut, Search, 
  Bell, ChevronDown, Download, Users, Activity,
  Clock
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { getStoredToken, getSessionToken } from "../../utils/authToken";

export default function WorkspaceDashboard() {
  const navigate = useNavigate();
  const [workspace, setWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchWorkspace(); }, []);

  const fetchWorkspace = async () => {
    try {
      const accessToken = getStoredToken() || getSessionToken();
      if (!accessToken) { navigate('/login'); return; }

      const response = await fetch('/api/v1/workspaces/', {
        headers: { 'Authorization': `Bearer ${accessToken}` },
      });
      const data = await response.json();
      const workspaceData = Array.isArray(data) ? data[0] : data;
      setWorkspace(workspaceData);
    } catch (err) {
      toast.error("Failed to sync dashboard");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-[#5443ED] font-bold">
      Loading Dashboard...
    </div>
  );

  return (
    <div className="min-h-screen w-full bg-[#F3F4F9] flex font-sans p-4 md:p-6 text-slate-700">
      <Toaster position="top-right" />
      

        <aside className="w-64 bg-white rounded-[32px] flex flex-col p-8 shadow-sm shrink-0 hidden lg:flex border border-slate-100">
          <div className="flex items-center gap-2 mb-10">
            <img src="/Logo3.png" alt="Placfy Logo" className="w-10 h-10 rounded-xl " />
            <span className="text-2xl font-black tracking-tight text-[#1A1D1F]">Placfy</span>
          </div>

          <nav className="space-y-1">
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Menu</p>
            <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
            <SidebarItem icon={<ShoppingBag size={20}/>} label="Orders" hasArrow />
            <SidebarItem icon={<Box size={20}/>} label="Products" hasArrow />
            <SidebarItem icon={<BarChart3 size={20}/>} label="Analytics" />
            <SidebarItem icon={<Megaphone size={20}/>} label="Marketing" hasArrow />
            <SidebarItem icon={<MessageSquare size={20}/>} label="Messages" badge="25" />
            
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-8 mb-4 ml-4">Integrations</p>
            <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-blue-500" />} label="Jira" />
            <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-emerald-500" />} label="Slack" />
            <SidebarItem icon={<div className="w-2 h-2 rounded-full bg-orange-500" />} label="Intercom" />
          </nav>

          <div className="mt-auto pt-4 border-t border-slate-50">
            <SidebarItem icon={<LogOut size={20}/>} label="Logout" />
          </div>
        </aside>

        <main className="flex-1 flex flex-col min-w-0 ml-0 lg:ml-6">
          

          <header className="flex items-center justify-between mb-8 gap-4">
          <div className="flex-1 max-w-xl relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#5443ED] transition-colors" size={18} />
            <input 
            type="text" 
            placeholder="Search..." 
            className="w-full bg-white rounded-2xl py-3 pl-12 pr-4 outline-none border border-transparent focus:border-[#5443ED]/20 shadow-sm transition-all text-sm" 
            />
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <button className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm border border-slate-50 relative">
            <Bell size={20} />
            <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-10 w-[1px] bg-slate-200 mx-2" />
            <div className="flex items-center gap-3 bg-white p-1.5 pr-4 rounded-2xl shadow-sm border border-slate-50">
            <img src={`https://ui-avatars.com/api/?name=${workspace?.name}&background=random`} alt="user" className="w-8 h-8 rounded-xl object-cover" />
            <div className="text-right hidden sm:block">
              <p className="text-[10px] font-bold text-slate-400">Hi, {workspace?.name?.split(' ')[0] || "Admin"}</p>
              <p className="text-xs font-black text-[#1A1D1F]">Pro Account</p>
            </div>
            </div>
          </div>
          </header>

          <motion.div className="flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#5443ED] rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-100">
              <LayoutDashboard size={20} />
            </div>
            <h2 className="text-2xl font-semibold tracking-[-0.01em] text-[#1A1D1F]">
              Dashboard
            </h2>
            </div>
            <div className="flex items-center gap-3">
            <div className="bg-white px-4 py-2.5 rounded-xl border border-slate-100 shadow-sm flex items-center gap-4 text-xs font-bold cursor-pointer">
              <span className="text-slate-400 flex items-center gap-2"><Clock size={14}/> This Month</span>
              <ChevronDown size={14} />
            </div>
            <button className="bg-[#00B074] hover:bg-[#009663] text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg shadow-emerald-100 transition-all">
              <Download size={16} /> Download Report
            </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <StatBox label="Total Sales" value="263k" trend="+ 15.6%" icon={<ShoppingBag size={20} className="text-[#5443ED]"/>} />
            <StatBox label="Total Visitors" value="35k" trend="- 6.2%" negative icon={<Users size={20} className="text-[#5443ED]"/>} />
            <StatBox label="Total Orders" value="165k" trend="+ 3.5%" icon={<Box size={20} className="text-[#5443ED]"/>} />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* SESSIONS / ANALYTICS */}
            <div className="lg:col-span-8 bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-lg font-black text-[#1A1D1F]">Workspace Analytics</h3>
                <button className="text-xs font-bold text-slate-400 hover:text-[#5443ED] transition-colors">View Report</button>
              </div>
              <div className="flex items-center gap-10 mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center text-[#5443ED]"><Users size={20}/></div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active Members</p>
                    <p className="text-2xl font-black text-[#1A1D1F]">{workspace?.member_count || "0"}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-[#00B074] flex items-center gap-1">↑ 15.6%</p>
                  <p className="text-[11px] font-bold text-[#FF5B5B] flex items-center gap-1">↓ 1.6%</p>
                </div>
              </div>
              {/* Fake Graph Visual */}
              <div className="h-48 w-full bg-slate-50 rounded-3xl relative overflow-hidden flex items-end px-4 gap-2">
                 {[40, 70, 45, 90, 65, 80, 50, 95].map((h, i) => (
                   <motion.div 
                    initial={{ height: 0 }} 
                    animate={{ height: `${h}%` }} 
                    key={i} 
                    className="flex-1 bg-indigo-100 rounded-t-lg relative group cursor-pointer"
                   >
                     <div className="absolute top-0 left-0 w-full h-2 bg-[#5443ED] rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                   </motion.div>
                 ))}
              </div>
            </div>

            {/* UPGRADE & CONVERSION */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-[#5443ED] rounded-[32px] p-8 text-white relative overflow-hidden shadow-xl shadow-indigo-100">
                <div className="relative z-10">
                  <h3 className="text-xl font-black mb-2">Need More Stats?</h3>
                  <p className="text-indigo-100 text-xs font-medium mb-6 leading-relaxed">Upgrade to pro for added benefits and unlimited nodes.</p>
                  <button className="bg-[#00B074] text-white px-6 py-3 rounded-2xl font-black text-xs uppercase shadow-lg shadow-emerald-900/20">Go Pro Now</button>
                </div>
                <div className="absolute -right-4 -bottom-4 opacity-20">
                  <Activity size={120} />
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-slate-50 shadow-sm">
                 <h3 className="text-sm font-black text-[#1A1D1F] mb-6">Identity Summary</h3>
                 <div className="space-y-4">
                    <IdentityItem label="Contact" value={workspace?.info?.contact_email} />
                    <IdentityItem label="Industry" value={workspace?.info?.industry} />
                    <IdentityItem label="Status" value="Verified Hub" success />
                 </div>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

/* UI COMPONENTS BASED ON IMAGE */

const SidebarItem = ({ icon, label, active, hasArrow, badge }) => (
  <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-[#5443ED] text-white shadow-xl shadow-indigo-100' : 'text-slate-500 hover:bg-slate-50'}`}>
    <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
    <span className="text-[13px] font-bold flex-1">{label}</span>
    {badge && <span className="bg-[#00B074] text-white text-[10px] font-black px-2 py-0.5 rounded-lg">{badge}</span>}
    {hasArrow && <ChevronDown size={14} className="opacity-40" />}
  </div>
);

const StatBox = ({ label, value, trend, negative, icon }) => (
  <div className="bg-white rounded-[32px] p-6 border border-slate-50 shadow-sm flex items-center gap-6">
    <div className="w-14 h-14 bg-[#F3F4F9] rounded-2xl flex items-center justify-center">
      {icon}
    </div>
    <div>
      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <div className="flex items-center gap-3">
        <span className="text-2xl font-black text-[#1A1D1F]">{value}</span>
        <span className={`text-[11px] font-black ${negative ? 'text-[#FF5B5B]' : 'text-[#00B074]'}`}>
          {negative ? '↓' : '↑'} {trend}
        </span>
      </div>
    </div>
  </div>
);

const IdentityItem = ({ label, value, success }) => (
  <div className="flex items-center justify-between py-2">
    <span className="text-[11px] font-bold text-slate-400 uppercase">{label}</span>
    <span className={`text-xs font-black truncate max-w-[120px] ${success ? 'text-[#00B074]' : 'text-slate-700'}`}>{value || "—"}</span>
  </div>
);
