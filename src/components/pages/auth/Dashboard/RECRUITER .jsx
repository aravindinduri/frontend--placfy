
import { useState } from "react";
import Navbar2 from "../../../layout/Navbar2";
import {
  Search, Briefcase, Users, CalendarDays, CheckCircle,
  LayoutDashboard, LogOut, ArrowRight, Bell, Settings,
  Mail, UserPlus, TrendingUp, Filter, ChevronsLeft, ChevronsRight, Box, MessageSquare
} from "lucide-react";

import SettingsPage from "../../admin/SettingsPage";
import SupportPage from "../../admin/Support/SupportPage";
import HrTasksPage from "../../hr/tasks/HrTasksPage";

export default function RecruiterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  const [recruiterName] = useState("Alex Rivers");
  const [stats] = useState({
    openJobs: "12",
    candidates: "248",
    interviews: "18",
    hired: "6",
  });

  return (
    // Main Container: h-screen prevents full-page scroll, providing an "App" feel
    <div className="h-screen w-full bg-[#EEF2FF] flex flex-col font-sans overflow-hidden">
      <style>{`
        ::-webkit-scrollbar {
          width: 6px;
        }
        ::-webkit-scrollbar-track {
          background: transparent;
        }
        ::-webkit-scrollbar-thumb {
          background: rgba(129, 98, 255, 0.5);
          border-radius: 10px;
          transition: background 0.3s ease;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: rgba(129, 98, 255, 0.8);
        }
      `}</style>
      {/* HEADER */}
      <Navbar2 />

      <div className="flex-1 flex overflow-hidden">

      {/* SIDEBAR */}
      <aside className={`bg-indigo-600 rounded-none flex flex-col p-4 shrink-0 hidden lg:flex shadow-2xl overflow-hidden transition-all duration-300 ${sidebarOpen ? 'w-64' : 'w-24'}`}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="bg-white p-1.5 rounded-xl">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
            </div>
            {sidebarOpen && <span className="text-2xl font-black tracking-tight text-white uppercase  flex-1">Placfy</span>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white rounded-lg"
              title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {sidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
            </button>
          </div>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-indigo-400 scrollbar-track-transparent hover:scrollbar-thumb-indigo-300">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-8">Management</p>}
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Overview" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase size={20} />} label="Job Pipelines" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Users size={20} />} label="Candidates" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Box size={20} />} label="Tasks" active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<CalendarDays size={20} />} label="Schedule" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Mail size={20} />} label="Communications" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<MessageSquare size={20} />} label="Support" active={activeView === 'support'} onClick={() => setActiveView('support')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>}
          {sidebarOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate">{recruiterName}</span>
                <span className="text-[10px] text-indigo-200 font-bold opacity-70">Talent Lead</span>
              </div>
              <ArrowRight size={16} className="shrink-0 group-hover:translate-x-1 transition-transform" />
            </div>
          )}
          {sidebarOpen && (
            <button className="flex items-center gap-3 text-indigo-200 mt-6 font-bold text-sm hover:text-white transition-colors ml-4">
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col h-full overflow-hidden px-8 py-6 transition-all duration-300">

        {/* CONTENT GRID */}
        {activeView === 'dashboard' ? (
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
                <StatCard title="Open Jobs" value={stats.openJobs} change="+1" icon={<Briefcase className="text-indigo-600" size={20} />} />
                <StatCard title="Candidates" value={stats.candidates} change="+24" icon={<Users className="text-indigo-600" size={20} />} />
                <StatCard title="Interviews" value={stats.interviews} change="Today" icon={<CalendarDays className="text-indigo-600" size={20} />} />
                <StatCard title="Monthly Hires" value={stats.hired} change="82%" icon={<CheckCircle className="text-indigo-600" size={20} />} />
              </div>

              {/* LIVE FEED */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-black text-slate-800 text-lg">Recruitment Activity</h3>
                  <div className="flex gap-2">
                    <button className="p-2 bg-slate-50 text-slate-400 rounded-xl hover:text-indigo-600 transition-colors"><Filter size={16} /></button>
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
                    <div key={i} style={{ height: `${h}%` }} className="flex-1 bg-indigo-500/40 rounded-t-sm" />
                  ))}
                </div>
              </div>

              {/* CALENDAR */}
              <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 shrink-0">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-black text-slate-800 text-sm">Oct, 2026</span>
                  <div className="flex gap-1">
                    <ArrowRight size={14} className="rotate-180 text-slate-300" />
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                </div>
                <div className="grid grid-cols-7 text-center text-[9px] font-black text-slate-300 gap-y-3">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map(d => <div key={d}>{d}</div>)}
                  {Array.from({ length: 31 }).map((_, i) => (
                    <div key={i} className={`py-1 text-[11px] font-bold ${i === 11 ? 'bg-indigo-600 text-white rounded-lg shadow-md' : 'text-slate-600'}`}>
                      {i + 1}
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
        ) : activeView === 'tasks' ? (
          <div className="flex-1 pb-6 overflow-hidden flex flex-col">
            <HrTasksPage />
          </div>
        ) : activeView === 'support' ? (
          <div className="flex-1 pb-6 overflow-hidden flex flex-col">
            <SupportPage />
          </div>
        ) : activeView === 'settings' ? (
          <div className="flex-1 pb-6 overflow-hidden flex flex-col">
            <SettingsPage />
          </div>
        ) : null}
      </main>
      </div>
    </div>
  );
}

/* --- REUSABLE COMPONENTS --- */

function SidebarLink({ icon, label, active, onClick, sidebarOpen }) {
  return (
    <div
      className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all shrink-0 ${sidebarOpen ? '' : 'justify-center px-3'} ${active ? 'bg-white/15 text-white shadow-inner' : 'text-indigo-200 hover:bg-white/5'}`}
      onClick={onClick}
      title={!sidebarOpen ? label : ''}
    >
      <span className={active ? "text-white" : "text-indigo-300"}>{icon}</span>
      {sidebarOpen && <span className="text-sm font-bold tracking-tight">{label}</span>}
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
