// import { useState } from "react";
// import {
//   Search,
//   Briefcase,
//   Users,
//   CalendarDays,
//   CheckCircle,
// } from "lucide-react";

// export default function RecruiterDashboard() {
//   const [stats] = useState({
//     openJobs: "12",
//     candidates: "248",
//     interviews: "18",
//     hired: "6",
//   });

//   return (
//     <div className="min-h-screen bg-slate-50 font-sans">

//       {/* HEADER */}
//       <header className="bg-white border-b border-slate-100 px-6 py-4 flex items-center justify-between">
//         <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
//           Recruiter Dashboard
//         </h1>

//         <div className="relative w-72">
//           <Search
//             size={18}
//             className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
//           />
//           <input
//             type="text"
//             placeholder="Search candidates or jobs..."
//             className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-indigo-500"
//           />
//         </div>
//       </header>

//       {/* MAIN CONTENT */}
//       <main className="max-w-7xl mx-auto px-6 py-8 space-y-8">

//         {/* STATS */}
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
//           <StatCard
//             title="Open Jobs"
//             value={stats.openJobs}
//             icon={<Briefcase size={20} className="text-indigo-600" />}
//           />
//           <StatCard
//             title="Total Candidates"
//             value={stats.candidates}
//             icon={<Users size={20} className="text-indigo-600" />}
//           />
//           <StatCard
//             title="Interviews Scheduled"
//             value={stats.interviews}
//             icon={<CalendarDays size={20} className="text-indigo-600" />}
//           />
//           <StatCard
//             title="Hires This Month"
//             value={stats.hired}
//             icon={<CheckCircle size={20} className="text-indigo-600" />}
//           />
//         </div>

//         {/* RECRUITMENT ACTIVITY */}
//         <div className="bg-white rounded-2xl p-6 border border-slate-100">
//           <h2 className="text-sm font-extrabold text-slate-700 uppercase tracking-wider mb-4">
//             Recruitment Activity
//           </h2>

//           <ul className="space-y-4">
//             <ActivityItem text="New candidate applied for Frontend Developer" />
//             <ActivityItem text="Interview scheduled for Backend Engineer" />
//             <ActivityItem text="Candidate moved to final round" />
//             <ActivityItem text="Offer letter sent to UI/UX Designer" />
//           </ul>
//         </div>

//       </main>
//     </div>
//   );
// }

// /* -------- UI COMPONENTS -------- */

// const StatCard = ({ title, value, icon }) => (
//   <div className="bg-white rounded-2xl p-6 border border-slate-100 flex items-center justify-between">
//     <div>
//       <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">
//         {title}
//       </p>
//       <p className="text-2xl font-black text-slate-900">
//         {value}
//       </p>
//     </div>
//     <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center">
//       {icon}
//     </div>
//   </div>
// );

// const ActivityItem = ({ text }) => (
//   <li className="flex items-center gap-3 text-sm text-slate-600 font-medium">
//     <span className="w-2 h-2 bg-indigo-500 rounded-full" />
//     {text}
//   </li>
// );

import { useState } from "react";
import {
<<<<<<< HEAD
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
                RECRUITER
              </span>
=======
  Search, Briefcase, Users, CalendarDays, CheckCircle,
  LayoutDashboard, LogOut, ArrowRight, Bell, Settings,
  Mail, UserPlus, TrendingUp, Filter
} from "lucide-react";

export default function RecruiterDashboard() {
  const [recruiterName] = useState("Alex Rivers");
  const [stats] = useState({
    openJobs: "12",
    candidates: "248",
    interviews: "18",
    hired: "6",
  });

  return (
    // Main Container: h-screen prevents full-page scroll, providing an "App" feel
    <div className="h-screen w-full bg-[#EEF2FF] flex font-sans overflow-hidden p-4">
      
      {/* SIDEBAR */}
      <aside className="w-64 bg-indigo-600 rounded-[2.5rem] flex flex-col p-8 shrink-0 hidden lg:flex shadow-2xl">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-white p-1.5 rounded-xl">
            <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
          </div>
          <span className="text-2xl font-black tracking-tight text-white uppercase italic">Placfy</span>
        </div>

        <nav className="space-y-1 flex-1">
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Overview" active />
          <SidebarLink icon={<Briefcase size={20}/>} label="Job Pipelines" />
          <SidebarLink icon={<Users size={20}/>} label="Candidates" />
          <SidebarLink icon={<CalendarDays size={20}/>} label="Schedule" />
          <SidebarLink icon={<Mail size={20}/>} label="Communications" />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Recruiter Profile</p>
          <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
             <div className="flex flex-col overflow-hidden">
               <span className="text-xs font-black truncate">{recruiterName}</span>
               <span className="text-[10px] text-indigo-200 font-bold opacity-70">Talent Lead</span>
             </div>
             <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
          </div>
          <button className="flex items-center gap-3 text-indigo-200 mt-6 font-bold text-sm hover:text-white transition-colors ml-4">
            <LogOut size={18} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden px-8">
        
        {/* HEADER */}
        <header className="py-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Recruiter Dashboard</h1>
          
          <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Find candidates..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-64 transition-all" />
            </div>
            
            <div className="flex items-center gap-3 px-4 border-l border-slate-200/60">
              <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200/60">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Alex" alt="user" />
                </div>
              </div>
>>>>>>> bc20423 (invit)
            </div>
          </div>
        </header>

<<<<<<< HEAD
        {/* ================= CONTENT ================= */}
        <main className="flex-1 p-8 space-y-8">
          
          {/* GREETING */}
          <div className="bg-[#5a4fff] rounded-2xl p-6 text-white flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">
                Hello RECRUITER 👋
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
        {/* CONTENT GRID */}
        <div className="flex-1 flex gap-8 min-h-0 pb-6">
          
          {/* LEFT SCROLLABLE SECTION */}
          <div className="flex-[2.2] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
            
            {/* WELCOME BANNER */}
            {/* <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden shrink-0">
              <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-black mb-2">Welcome back, {recruiterName.split(' ')[0]}!</h2>
                <p className="text-indigo-100 font-medium text-sm mb-6 leading-relaxed">
                  You have <span className="text-white font-bold">{stats.interviews} interviews</span> on your calendar today. Your hiring velocity is <span className="text-white font-bold">up 12%</span>.
                </p>
                <div className="flex gap-3">
                    <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-transform flex items-center gap-2">
                      <UserPlus size={14} /> Add Candidate
                    </button>
                    <button className="bg-indigo-400/30 text-white px-6 py-3 rounded-2xl font-black text-xs backdrop-blur-md hover:bg-indigo-400/40 transition-colors">
                      Post New Job
                    </button>
                </div>
              </div> */}
              <div className="absolute bottom-[-10%] right-[5%] opacity-10">
                 <Briefcase size={180} />
              </div>
            {/* </div> */}

            {/* RECRUITMENT STATS */}
            <div className="grid grid-cols-4 gap-4 shrink-0">
              <StatCard title="Open Jobs" value={stats.openJobs} change="+1" icon={<Briefcase className="text-indigo-600" size={20}/>}/>
              <StatCard title="Candidates" value={stats.candidates} change="+24" icon={<Users className="text-indigo-600" size={20}/>}/>
              <StatCard title="Interviews" value={stats.interviews} change="Today" icon={<CalendarDays className="text-indigo-600" size={20}/>}/>
              <StatCard title="Monthly Hires" value={stats.hired} change="82%" icon={<CheckCircle className="text-indigo-600" size={20}/>}/>
            </div>

            {/* LIVE FEED */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-800 text-lg">Recruitment Activity</h3>
                <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><Filter size={16}/></button>
                    <button className="text-indigo-600 font-black text-[10px] uppercase px-3 py-1.5 bg-indigo-50 rounded-lg">Live Feed</button>
                </div>
              </div>
              <div className="space-y-6">
                <ActivityItem text="New application: Senior Frontend Dev" time="Just Now" status="Review" color="bg-indigo-400" />
                <ActivityItem text="Interview scheduled: Product Designer" time="2h ago" status="Confirmed" color="bg-emerald-400" />
                <ActivityItem text="Offer sent: Backend Engineer" time="4h ago" status="Pending" color="bg-orange-400" />
                <ActivityItem text="Candidate rejected: Sales Lead" time="Yesterday" status="Closed" color="bg-slate-300" />
              </div>
            </div>
          </div>

          {/* RIGHT FIXED WIDGETS */}
          <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
             
             {/* PERFORMANCE MINI CHART PLACEHOLDER */}
             <div className="bg-slate-900 rounded-[2.5rem] p-6 shadow-xl flex flex-col gap-4 text-white shrink-0">
                <div className="flex justify-between items-start">
                    <div>
                        <p className="text-[10px] font-black text-indigo-300 uppercase tracking-widest">Hiring Success</p>
                        <h4 className="text-2xl font-black">94.2%</h4>
                    </div>
                    <div className="p-2 bg-white/10 rounded-xl">
                        <TrendingUp size={20} className="text-emerald-400" />
                    </div>
                </div>
                <div className="h-12 flex items-end gap-1">
                    {[40, 70, 45, 90, 65, 80, 95].map((h, i) => (
                        <div key={i} style={{height: `${h}%`}} className="flex-1 bg-indigo-500/40 rounded-t-sm" />
                    ))}
                </div>
             </div>

             {/* CALENDAR */}
             <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-slate-800 text-sm">Oct, 2026</span>
                  <div className="flex gap-1">
                    <ArrowRight size={14} className="rotate-180 text-slate-300"/>
                    <ArrowRight size={14} className="text-slate-300"/>
                  </div>
                </div>
                <div className="grid grid-cols-7 text-center text-[9px] font-black text-slate-300 gap-y-3">
                  {['S','M','T','W','T','F','S'].map(d => <div key={d}>{d}</div>)}
                  {Array.from({length: 31}).map((_, i) => (
                    <div key={i} className={`py-1 text-[11px] font-bold ${i === 11 ? 'bg-indigo-600 text-white rounded-lg shadow-md' : 'text-slate-600'}`}>
                      {i+1}
                    </div>
                  ))}
                </div>
             </div>

             {/* QUICK ACTIONS */}
             <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col">
                <h4 className="font-black text-slate-800 mb-4 text-center">Pipeline Health</h4>
                <div className="space-y-4 flex-1">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400">Sourcing</span>
                            <span className="text-slate-800">75%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[75%]" />
                        </div>
                    </div>
                    <div className="space-y-1">
                        <div className="flex justify-between text-[10px] font-black uppercase">
                            <span className="text-slate-400">Interviewing</span>
                            <span className="text-slate-800">42%</span>
                        </div>
                        <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-[42%]" />
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 bg-slate-900 text-white font-black py-4 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  Generate Report
                </button>
             </div>
          </div>
        </div>
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
/* --- REUSABLE COMPONENTS --- */

function SidebarLink({ icon, label, active }) {
  return (
    <div className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all ${
      active ? 'bg-white/15 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5'
    }`}>
      <span className={active ? "text-white" : "text-indigo-300"}>{icon}</span>
      <span className="text-sm font-bold tracking-tight">{label}</span>
    </div>
  );
}

function StatCard({ title, value, change, icon }) {
  return (
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:translate-y-[-4px] transition-transform">
      <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center">
        {icon}
      </div>
      <div>
        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
        <div className="flex items-end gap-2">
          <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
          <span className="text-[9px] font-black text-indigo-500 mb-0.5">{change}</span>
        </div>
      </div>
    </div>
  );
}

function ActivityItem({ text, time, status, color }) {
  return (
    <div className="flex items-center justify-between group cursor-pointer hover:bg-slate-50 p-2 -mx-2 rounded-xl transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-slate-50`} />
        <div>
          <p className="text-xs font-black text-slate-700">{text}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">{time}</p>
        </div>
      </div>
      <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
        {status}
      </span>
    </div>
  );
}
>>>>>>> bc20423 (invit)
