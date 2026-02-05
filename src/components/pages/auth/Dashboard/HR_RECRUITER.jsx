
// import { useState } from "react";
// import {
//   Search, Users, Briefcase, Calendar, UserCheck,
//   LayoutDashboard, LogOut, Bell, ArrowRight, Settings,
//   ClipboardList, Plus, Filter, MoreHorizontal
// } from "lucide-react";

// export default function HRRecruiterDashboard() {
//   const [stats] = useState({
//     totalCandidates: "1,248",
//     openJobs: "18",
//     interviews: "64",
//   });

//   return (
//     // Fixed App Layout
//     <div className="h-screen w-full bg-[#EEF2FF] flex font-sans overflow-hidden p-4">
      
//       {/* SIDEBAR */}
//       <aside className="w-64 bg-indigo-600 rounded-[2.5rem] flex flex-col p-8 shrink-0 hidden lg:flex shadow-2xl">
//         <div className="flex items-center gap-2 mb-10">
//           <div className="bg-white p-1.5 rounded-xl">
//             <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
//           </div>
//           <span className="text-2xl font-black tracking-tight text-white uppercase italic">Placfy</span>
//         </div>

//         <nav className="space-y-1 flex-1">
//           <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Recruitment</p>
//           <SidebarLink icon={<LayoutDashboard size={20}/>} label="Overview" active />
//           <SidebarLink icon={<Users size={20}/>} label="Candidates" />
//           <SidebarLink icon={<Briefcase size={20}/>} label="Job Posts" />
//           <SidebarLink icon={<Calendar size={20}/>} label="Interviews" />
//           <SidebarLink icon={<ClipboardList size={20}/>} label="Assessments" />
//         </nav>

//         <div className="mt-auto pt-6 border-t border-indigo-400/30">
//           <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>
//           <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
//              <div className="flex flex-col overflow-hidden">
//                <span className="text-xs font-black truncate">HR Global Team</span>
//                <span className="text-[10px] text-indigo-200 font-bold opacity-70">Recruiter Pro</span>
//              </div>
//              <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
//           </div>
//           <button className="flex items-center gap-3 text-indigo-200 mt-6 font-bold text-sm hover:text-white transition-colors ml-4">
//             <LogOut size={18} /> Logout
//           </button>
//         </div>
//       </aside>

//       {/* MAIN CONTENT AREA */}
//       <main className="flex-1 flex flex-col h-full overflow-hidden px-8">
        
//         {/* HEADER */}
//         <header className="py-6 flex items-center justify-between shrink-0">
//           <h1 className="text-2xl font-black text-slate-800 tracking-tight">HR Recruiter </h1>
          
//           <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
//             <div className="relative group hidden md:block">
//               <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
//               <input type="text" placeholder="Search candidates..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-64 transition-all" />
//             </div>
            
//             <div className="flex items-center gap-3 px-4 border-l border-slate-200/60">
//               <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
//                 <Bell size={20} />
//                 <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
//               </button>
//               <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200/60">
//                 <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
//                     <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Recruiter" alt="user" />
//                 </div>
//               </div>
//             </div>
//           </div>
//         </header>

//         {/* INNER GRID */}
//         <div className="flex-1 flex gap-8 min-h-0 pb-6">
          
//           {/* LEFT: MAIN WORKFLOW */}
//           <div className="flex-[2.2] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
            
//             {/* HIRING BANNER */}
//             {/* <div className="relative bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden shrink-0"> */}
//               {/* <div className="relative z-10 max-w-md">
//                 <p className="text-indigo-400 font-bold text-[10px] uppercase tracking-widest mb-2">Hiring Sprint: Q1 2026</p>
//                 <h2 className="text-3xl font-black mb-2">Find your next star.</h2>
//                 <p className="text-slate-400 font-medium text-sm mb-6 leading-relaxed">
//                   You have <span className="text-white font-bold">18 open positions</span> across 4 departments. 12 candidates are awaiting your feedback.
//                 </p>
//                 <div className="flex gap-3">
//                     <button className="bg-indigo-600 text-white px-6 py-3 rounded-2xl font-black text-xs shadow-xl hover:bg-indigo-500 transition-all flex items-center gap-2">
//                       <Plus size={16} /> Create Job Post
//                     </button>
//                     <button className="bg-white/10 text-white px-6 py-3 rounded-2xl font-black text-xs backdrop-blur-md hover:bg-white/20 transition-colors">
//                       View Pipeline
//                     </button>
//                 </div>
//               </div> */}
//               <div className="absolute bottom-[-10%] right-[-5%] opacity-20">
//                  <Briefcase size={220} />
//               </div>
//             {/* </div> */}

//             {/* TOP STATS */}
//             <div className="grid grid-cols-3 gap-4 shrink-0">
//               <StatCard title="Total Candidates" value={stats.totalCandidates} change="+124 new" icon={<Users className="text-indigo-600" size={20}/>}/>
//               <StatCard title="Active Jobs" value={stats.openJobs} change="6 Urgency" icon={<Briefcase className="text-indigo-600" size={20}/>}/>
//               <StatCard title="Interviews" value={stats.interviews} change="This week" icon={<Calendar className="text-indigo-600" size={20}/>}/>
//             </div>

//             {/* RECENT ACTIVITY FEED */}
//             <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1">
//               <div className="flex items-center justify-between mb-8">
//                 <div>
//                     <h3 className="font-black text-slate-800 text-lg">Recruiter Activity</h3>
//                     <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Live Updates</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><Filter size={18} /></button>
//                     <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><MoreHorizontal size={18} /></button>
//                 </div>
//               </div>
              
//               <div className="space-y-6">
//                 <ActivityItem text="Interview scheduled with Aakash Verma" time="Today, 2:30 PM" status="Meeting" color="bg-indigo-400" />
//                 <ActivityItem text="New candidate applied for Backend Role" time="1 hour ago" status="New" color="bg-emerald-400" />
//                 <ActivityItem text="Candidate marked as 'Shortlisted' for UX" time="3 hours ago" status="Pipeline" color="bg-sky-400" />
//                 <ActivityItem text="Offer letter sent to Priya Singh" time="Yesterday" status="Offers" color="bg-orange-400" />
//               </div>
//             </div>
//           </div>

//           {/* RIGHT: SCHEDULER & PIPELINE */}
//           <div className="flex-1 flex flex-col gap-6 min-w-[320px]">
             
//              {/* PIPELINE HEALTH */}
//              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 shrink-0">
//                 <h4 className="font-black text-slate-800 text-sm mb-6">Pipeline Health</h4>
//                 <div className="space-y-5">
//                     <PipelineStep label="Sourcing" count="450" percent={85} color="bg-indigo-500" />
//                     <PipelineStep label="Interviews" count="64" percent={40} color="bg-sky-500" />
//                     <PipelineStep label="Offer Phase" count="12" percent={15} color="bg-emerald-500" />
//                 </div>
//              </div>

//              {/* INTERVIEW CALENDAR */}
//              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col overflow-hidden">
//                 <div className="flex items-center justify-between mb-4">
//                   <span className="font-black text-slate-800 text-sm">Upcoming Slots</span>
//                   <span className="text-[10px] font-bold text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">Today</span>
//                 </div>
//                 <div className="space-y-3 overflow-y-auto scrollbar-hide">
//                     <InterviewSlot time="10:00" name="Aakash Verma" role="SDE II" />
//                     <InterviewSlot time="12:30" name="Sarah Chen" role="Product" />
//                     <InterviewSlot time="15:00" name="Mike Ross" role="Design" />
//                     <InterviewSlot time="17:00" name="Jane Doe" role="Marketing" />
//                 </div>
//                 <button className="w-full mt-auto bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
//                   Go to Calendar <Calendar size={12} />
//                 </button>
//              </div>
//           </div>
//         </div>
//       </main>
//     </div>
//   );
// }

// /* --- REUSABLE COMPONENTS --- */

// function SidebarLink({ icon, label, active }) {
//   return (
//     <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all ${
//       active ? 'bg-white/15 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5'
//     }`}>
//       <span className={active ? "text-white" : "text-indigo-300"}>{icon}</span>
//       <span className="text-sm font-bold tracking-tight">{label}</span>
//     </div>
//   );
// }

// function StatCard({ title, value, change, icon }) {
//   return (
//     <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer">
//       <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
//         {icon}
//       </div>
//       <div>
//         <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
//         <div className="flex items-end gap-2">
//           <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
//           <span className="text-[9px] font-black text-indigo-500 mb-0.5">{change}</span>
//         </div>
//       </div>
//     </div>
//   );
// }

// function ActivityItem({ text, time, status, color }) {
//   return (
//     <div className="flex items-center justify-between group">
//       <div className="flex items-center gap-4">
//         <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-slate-50`} />
//         <div>
//           <p className="text-xs font-black text-slate-700">{text}</p>
//           <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tight italic">{time}</p>
//         </div>
//       </div>
//       <span className="text-[8px] font-black uppercase text-indigo-400 bg-indigo-50 px-2 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
//         {status}
//       </span>
//     </div>
//   );
// }

// function PipelineStep({ label, count, percent, color }) {
//   return (
//     <div className="space-y-1">
//         <div className="flex justify-between text-[10px] font-black uppercase">
//             <span className="text-slate-400">{label}</span>
//             <span className="text-slate-800">{count}</span>
//         </div>
//         <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
//             <div className={`h-full ${color}`} style={{width: `${percent}%`}} />
//         </div>
//     </div>
//   );
// }

// function InterviewSlot({ time, name, role }) {
//   return (
//     <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-2xl hover:bg-indigo-50 transition-colors cursor-pointer group">
//         <div className="bg-white px-2 py-1 rounded-lg text-[10px] font-black text-slate-800 shadow-sm">{time}</div>
//         <div className="flex-1">
//             <p className="text-xs font-black text-slate-800 group-hover:text-indigo-600">{name}</p>
//             <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider">{role}</p>
//         </div>
//         <UserCheck size={14} className="text-slate-200 group-hover:text-indigo-500" />
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
<<<<<<< HEAD
                HR_RECRUITER
=======
                HR
>>>>>>> bc20423 (invit)
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
<<<<<<< HEAD
                Hello HR_RECRUITER 👋
=======
                Hello HR 👋
>>>>>>> bc20423 (invit)
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
    </div>
  );
}

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
<<<<<<< HEAD
);

const TableRow = ({ name, status }) => (
  <tr className="border-t border-slate-200">
    <td className="py-3">{name}</td>
    <td>{status}</td>
    <td className="text-[#5a4fff] font-medium">In Progress</td>
  </tr>
=======
>>>>>>> bc20423 (invit)
);

const TableRow = ({ name, status }) => (
  <tr className="border-t border-slate-200">
    <td className="py-3">{name}</td>
    <td>{status}</td>
    <td className="text-[#5a4fff] font-medium">In Progress</td>
  </tr>
);