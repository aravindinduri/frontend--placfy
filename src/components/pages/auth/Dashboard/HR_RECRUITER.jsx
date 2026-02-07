import { useState } from "react";
import {
  LayoutDashboard,
  Users,
  Briefcase,
  Calendar,
  Settings,
  Search,
  Bell,
  ChevronsLeft,
  ChevronsRight,
  LogOut,
  ArrowRight,
} from "lucide-react";

import SettingsPage from "../../admin/SettingsPage";

export default function HRRecruiterDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');

  return (
    <div className="h-screen w-full bg-[#EEF2FF] flex font-sans overflow-hidden p-4">

      {/* SIDEBAR */}
      <aside className={`fixed left-0 top-0 h-screen bg-indigo-600 rounded-none flex flex-col p-4 shrink-0 hidden lg:flex shadow-2xl overflow-hidden transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-24'}`}>
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="flex items-center justify-center gap-2 w-full">
            <div className="bg-white p-1.5 rounded-xl">
              <div className="w-6 h-6 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-black text-xs">P</div>
            </div>
            {sidebarOpen && <span className="text-2xl font-black tracking-tight text-white uppercase italic flex-1">Placfy</span>}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 text-white rounded-lg"
              title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
            >
              {sidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
            </button>
          </div>
        </div>

        <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-8">Management</p>}
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Users size={20} />} label="Candidates" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase size={20} />} label="Jobs" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Calendar size={20} />} label="Interviews" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>}
          {sidebarOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate">HR Recruiter</span>
                <span className="text-[10px] text-indigo-200 font-bold opacity-70">Enterprise</span>
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

      <main className={`flex-1 flex flex-col h-full overflow-hidden px-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'}`}>

        {/* TOP BAR */}
        <header className="py-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">HR Recruiter Dashboard</h1>

          <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-60 transition-all" />
            </div>

            <Bell size={20} className="text-slate-500" />

            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-[#5a4fff]" />
              <span className="text-sm font-medium text-slate-700">
                HR
              </span>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        {activeView === 'dashboard' ? (
          <div className="flex-1 flex gap-8 min-h-0 pb-6 overflow-hidden">
            <div className="flex-1 flex flex-col gap-6 min-w-0 overflow-y-auto pr-2">

              {/* GREETING */}
              <div className="bg-[#5a4fff] rounded-2xl p-6 text-white flex justify-between items-center">
                <div>
                  <h2 className="text-xl font-bold">
                    Hello HR 👋
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

              <button className="bg-white text-indigo-600 px-6 py-2 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors">
                View Applications
              </button>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 shrink-0">
              <Stat title="Total Candidates" value="1,245" />
              <Stat title="Open Positions" value="42" />
              <Stat title="Interviews Today" value="18" />
            </div>

            {/* TABLE + PROFILE */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 min-h-0">

              {/* TABLE */}
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm flex flex-col min-h-0">
                <h3 className="text-lg font-black text-slate-800 mb-6 shrink-0">
                  Recruitment Progress
                </h3>

                <div className="overflow-x-auto flex-1">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-200">
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Candidate</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Status</th>
                        <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Stage</th>
                      </tr>
                    </thead>
                    <tbody>
                      <TableRow name="Riya Sharma" status="Interview" />
                      <TableRow name="Aman Verma" status="Review" />
                      <TableRow name="Neha Patel" status="Hired" />
                    </tbody>
                  </table>
                </div>
              </div>

              {/* PROFILE CARD */}
              <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm h-fit">
                <h3 className="text-lg font-black text-slate-800 mb-6">Profile</h3>
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-indigo-100 mb-4 overflow-hidden">
                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=HR" alt="profile" />
                  </div>
                  <h4 className="font-bold text-slate-800">
                    Admin User
                  </h4>
                  <p className="text-sm text-slate-600">
                    HR Manager
                  </p>
                </div>

                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex justify-between">
                    <span>Company</span>
                    <span className="font-bold text-slate-800">Placfy</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Jobs</span>
                    <span className="font-bold text-slate-800">12</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        ) : activeView === 'settings' ? (
          <SettingsPage />
        ) : null}
      </main >
    </div >
  );
}

/* --- REUSABLE ATOMS --- */
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

const Stat = ({ title, value }) => (
  <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:scale-[1.02] transition-transform">
    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">
      <span className="text-indigo-600 font-black">📊</span>
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{title}</p>
      <p className="text-xl font-black text-slate-800 mt-1">{value}</p>
    </div>
  </div>
);

const TableRow = ({ name, status }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
    <td className="py-4 px-4 font-bold text-slate-700">{name}</td>
    <td className="py-4 px-4">
      <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
        {status}
      </span>
    </td>
    <td className="py-4 px-4 text-indigo-600 font-bold text-sm">In Progress</td>
  </tr>
);