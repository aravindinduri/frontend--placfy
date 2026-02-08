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
  Box,
  MessageSquare,
} from "lucide-react";

import SettingsPage from "../../admin/SettingsPage";
import SupportPage from "../../admin/Support/SupportPage";
import HrTasksPage from "../../hr/tasks/HrTasksPage";

export default function HrDashboard() {
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
          <SidebarLink icon={<Users size={20} />} label="Team Members" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Box size={20} />} label="Tasks" active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase size={20} />} label="Jobs" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Calendar size={20} />} label="Calendar" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<MessageSquare size={20} />} label="Support" active={activeView === 'support'} onClick={() => setActiveView('support')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>}
          {sidebarOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate">HR Department</span>
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

      <div className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'}`}>

        {/* TOP BAR */}
        <header className="py-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">HR Dashboard</h1>

          <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-60 transition-all" />
            </div>

            <div className="flex items-center gap-3 px-4 border-l border-slate-200/60">
              <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200/60">
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
                  <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=HR" alt="user" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTENT */}
        <main className="flex-1 flex flex-col min-h-0 overflow-hidden px-8 pb-6">

          {activeView === 'dashboard' ? (
            <div className="flex-1 overflow-y-auto scrollbar-hide">
              {/* GREETING */}
              <div className="bg-[#5a4fff] rounded-2xl p-6 text-white flex justify-between items-center mb-6">
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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
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
            <SettingsPage />
          ) : null}
        </main>
      </div>
    </div>
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
  <tr className="border-t border-slate-200 hover:bg-slate-50 transition-colors">
    <td className="py-3 font-bold text-slate-700">{name}</td>
    <td className="text-xs font-bold uppercase text-slate-600">
      <span className="inline-block bg-yellow-50 text-yellow-700 px-3 py-1 rounded-full">
        {status}
      </span>
    </td>
    <td className="text-indigo-600 font-bold text-sm">In Progress</td>
  </tr>
);