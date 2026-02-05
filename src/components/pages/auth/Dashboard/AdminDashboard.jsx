// import { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { useNavigate } from "react-router-dom";
// import { 
//   LayoutDashboard, ShoppingBag, Box, BarChart3, 
//   Megaphone, MessageSquare, LogOut, Search, 
//   Bell, ChevronDown, Download, Users, Activity,
//   Clock, ArrowRight
// } from "lucide-react";
// import toast, { Toaster } from "react-hot-toast";
// import { getStoredToken, getSessionToken } from "../../../utils/authToken";

// // UI COMPONENTS
// const SidebarItem = ({ icon, label, active, hasArrow }) => (
//   <div className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all ${active ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-500 hover:bg-slate-50'}`}>
//     <div className={`${active ? 'text-white' : 'text-slate-400'}`}>{icon}</div>
//     <span className="text-[13px] font-bold flex-1">{label}</span>
//     {hasArrow && <ChevronDown size={14} className="opacity-30" />}
//   </div>
// );

// const StatBox = ({ label, value, trend, negative, icon }) => (
//   <div className="bg-white rounded-[32px] p-8 shadow-xl flex items-center justify-between hover:scale-[1.02] transition-all cursor-default">
//     <div className="flex items-center gap-6">
//       <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">{label}</p>
//         <span className="text-3xl font-black text-slate-900 tracking-tighter">{value}</span>
//       </div>
//     </div>
//     <div className={`text-xs font-black px-3 py-1.5 rounded-xl ${negative ? 'bg-red-50 text-red-500' : 'bg-emerald-50 text-emerald-500'}`}>
//       {negative ? '↓' : '↑'} {trend}
//     </div>
//   </div>
// );

// const SummaryRow = ({ label, value }) => (
//   <div className="flex flex-col">
//     <span className="text-[10px] font-black uppercase opacity-40 mb-1">{label}</span>
//     <span className="text-xs font-bold truncate">{value || "Not Configured"}</span>
//   </div>
// );

// export default function AdminDashboard() {
//   const navigate = useNavigate();
//   const [workspace, setWorkspace] = useState(null);
//   const [loading, setLoading] = useState(true);

//   useEffect(() => { fetchWorkspace(); }, []);

//   const fetchWorkspace = async () => {
//     try {
//       const accessToken = getStoredToken() || getSessionToken();
//       if (!accessToken) { navigate('/login'); return; }

//       const response = await fetch('/api/v1/workspaces/', {
//         headers: { 'Authorization': `Bearer ${accessToken}` },
//       });
//       const data = await response.json();
      
//       // Select the first workspace for display
//       const activeWorkspace = Array.isArray(data) ? data[0] : data;
//       setWorkspace(activeWorkspace);
//     } catch (err) {
//       toast.error("Failed to sync admin dashboard");
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) return (
//     <div className="h-screen w-full flex items-center justify-center bg-slate-50 text-blue-600 font-bold">
//       Initializing Admin Core...
//     </div>
//   );

//   return (
//     <div className="min-h-screen w-full bg-white flex font-sans overflow-hidden">
//       <Toaster position="top-right" />
      
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-white flex flex-col p-8 shrink-0 hidden lg:flex border-r border-slate-100">
//         <div className="flex items-center gap-2 mb-10">
//           <img src="/Logo3.png" alt="Placfy Logo" className="w-10 h-10 rounded-xl" />
//           <span className="text-2xl font-black tracking-tight text-[#1A1D1F]">Placfy</span>
//         </div>

//         <nav className="space-y-1 flex-1">
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4 ml-4">Main Menu</p>
//           <SidebarItem icon={<LayoutDashboard size={20}/>} label="Dashboard" active />
//           <SidebarItem icon={<ShoppingBag size={20}/>} label="Orders" hasArrow />
//           <SidebarItem icon={<Box size={20}/>} label="Products" hasArrow />
//           <SidebarItem icon={<BarChart3 size={20}/>} label="Analytics" />
          
//           <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest pt-8 mb-4 ml-4">Workspace Control</p>
//           {/* Requirement: Show workspace name and icon of -> Arrow */}
//           <div className="flex items-center justify-between px-4 py-3 bg-blue-50 rounded-2xl text-blue-700 border border-blue-100">
//              <span className="text-xs font-black truncate">{workspace?.name || "Global Admin"}</span>
//              <ArrowRight size={14} className="shrink-0" />
//           </div>
//         </nav>

//         <div className="mt-auto pt-4 border-t border-slate-50">
//           <SidebarItem icon={<LogOut size={20}/>} label="Logout" />
//         </div>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 overflow-y-auto">
//         {/* THE BLUE BACKGROUND DIV CONTAINER */}
//         <div className="min-h-full bg-blue-600 p-4 md:p-8">
          
//           {/* HEADER SECTION */}
//           <header className="flex items-center justify-between mb-10 gap-4">
//             <div className="flex-1 max-w-xl relative group">
//               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50" size={18} />
//               <input 
//                 type="text" 
//                 placeholder="Admin Search..." 
//                 className="w-full bg-white/10 rounded-2xl py-3 pl-12 pr-4 outline-none border border-white/10 text-white placeholder:text-white/50 backdrop-blur-md focus:bg-white/20 transition-all text-sm" 
//               />
//             </div>

//             <div className="flex items-center gap-4">
//               <button className="p-3 bg-white/10 rounded-2xl text-white border border-white/10 relative">
//                 <Bell size={20} />
//                 <span className="absolute top-3 right-3 w-2 h-2 bg-red-400 rounded-full border-2 border-blue-600"></span>
//               </button>
              
//               <div className="flex items-center gap-3 bg-white/10 p-1.5 pr-4 rounded-2xl border border-white/10 backdrop-blur-md">
//                 <img 
//                   src={`https://ui-avatars.com/api/?name=Mytecsys&background=random`} 
//                   alt="user" 
//                   className="w-9 h-9 rounded-xl object-cover" 
//                 />
//                 <div className="text-right hidden sm:block">
//                   <p className="text-[10px] font-bold text-white/70">Hi, Mytecsys</p>
//                   <p className="text-xs font-black text-white">Pro Account</p>
//                 </div>
//               </div>
//             </div>
//           </header>

//           {/* DASHBOARD BODY */}
//           <div className="space-y-6">
//             <div className="flex items-center justify-between mb-8">
//               <div className="flex items-center gap-3">
//                 <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-white">
//                   <LayoutDashboard size={20} />
//                 </div>
//                 <h2 className="text-2xl font-black text-white uppercase tracking-tight">
//                   Dashboard
//                 </h2>
//               </div>
//               <div className="flex items-center gap-3">
//                 <div className="bg-white/10 px-4 py-2.5 rounded-xl border border-white/10 text-white flex items-center gap-4 text-xs font-bold cursor-pointer backdrop-blur-sm">
//                   <span className="flex items-center gap-2"><Clock size={14}/> This Month</span>
//                   <ChevronDown size={14} />
//                 </div>
//                 <button className="bg-emerald-500 hover:bg-emerald-400 text-white px-5 py-2.5 rounded-xl text-xs font-black flex items-center gap-2 shadow-lg transition-all">
//                   <Download size={16} /> Download Report
//                 </button>
//               </div>
//             </div>

//             {/* STATS ROW (White Cards) */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//               <StatBox label="Total Sales" value="263k" trend="+ 15.6%" icon={<ShoppingBag size={20} className="text-blue-600"/>} />
//               <StatBox label="Total Visitors" value="35k" trend="- 6.2%" negative icon={<Users size={20} className="text-blue-600"/>} />
//               <StatBox label="Total Orders" value="165k" trend="+ 3.5%" icon={<Box size={20} className="text-blue-600"/>} />
//             </div>

//             {/* LOWER CONTENT PANEL */}
//             <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
//               <div className="lg:col-span-8 bg-white rounded-[40px] p-10 shadow-2xl">
//                 <div className="flex items-center justify-between mb-10">
//                    <h3 className="font-black text-slate-800 text-lg uppercase tracking-tight">Live Performance</h3>
//                    <div className="flex gap-4">
//                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full">Primary Node</span>
//                    </div>
//                 </div>
//                 <div className="h-60 flex items-end gap-3 px-2">
//                   {[45, 75, 55, 95, 65, 85, 40, 90, 70, 100].map((h, i) => (
//                     <motion.div 
//                       key={i} 
//                       initial={{ height: 0 }}
//                       animate={{ height: `${h}%` }}
//                       className="flex-1 bg-blue-50 hover:bg-blue-500 rounded-t-xl transition-colors cursor-pointer" 
//                     />
//                   ))}
//                 </div>
//               </div>

//               <div className="lg:col-span-4 bg-white/10 rounded-[40px] p-8 border border-white/10 backdrop-blur-xl text-white">
//                  <h3 className="text-sm font-black uppercase tracking-widest mb-6 opacity-60">Identity Summary</h3>
//                  <div className="space-y-6">
//                     <SummaryRow label="Contact" value={workspace?.info?.contact_email} />
//                     <SummaryRow label="Industry" value={workspace?.info?.industry} />
//                     <SummaryRow label="Status" value="Verified Admin" />
                    
//                     <div className="pt-6 border-t border-white/10">
//                       <p className="text-[10px] font-black uppercase opacity-40 mb-2">Description</p>
//                       <p className="text-xs font-bold leading-relaxed opacity-80">
//                         {workspace?.info?.description || "No description provided for this node."}
//                       </p>
//                     </div>
//                  </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }





import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  Search,
  Bell,
} from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-[#eaf2ff] flex font-sans">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-600 text-white flex flex-col">
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
          <div className="bg-indigo-500 rounded-xl p-4 text-sm">
            Upgrade to Premium
          </div>
        </div>
      </aside>

      {/* MAIN */}
      <div className="flex-1 flex flex-col">
        
        {/* TOP BAR */}
        <header className="bg-white px-8 py-4 flex items-center justify-between border-b">
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
                className="pl-9 pr-4 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none"
              />
            </div>

            <Bell size={20} className="text-slate-500" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-indigo-500" />
              <span className="text-sm font-medium text-slate-700">
                Admin
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 p-8 space-y-8">
          
          {/* GREETING */}
          <div className="bg-indigo-500 rounded-2xl p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                Hello Admin 👋
              </h2>
              <p className="text-indigo-100 mt-1 text-sm">
                You have 9 new applications today
              </p>
            </div>

            <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold">
              View Applications
            </button>
          </div>

          {/* STATS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Stat title="Total Candidates" value="1,245" />
            <Stat title="Open Positions" value="42" />
            <Stat title="Interviews Today" value="18" />
          </div>

          {/* TABLE + SIDE */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* TABLE */}
            <div className="lg:col-span-2 bg-white rounded-2xl p-6">
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
            <div className="bg-white rounded-2xl p-6">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full bg-indigo-500 mb-4" />
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
    </div>
  );
}

/* ----------------- UI PARTS ----------------- */

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer text-sm
      ${active ? "bg-indigo-500" : "hover:bg-indigo-500/40"}
    `}
  >
    {icon}
    {label}
  </div>
);

const Stat = ({ title, value }) => (
  <div className="bg-white rounded-2xl p-6">
    <p className="text-xs text-slate-400 font-bold uppercase mb-1">
      {title}
    </p>
    <p className="text-2xl font-extrabold text-slate-800">
      {value}
    </p>
  </div>
);

const TableRow = ({ name, status }) => (
  <tr className="border-t">
    <td className="py-3">{name}</td>
    <td>{status}</td>
    <td className="text-indigo-600 font-medium">In Progress</td>
  </tr>
);
