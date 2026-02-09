import { useState } from "react";
import Navbar2 from "../../../layout/Navbar2";
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

export default function MemberDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('dashboard');
  return (
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
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Dashboard" active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Users size={20} />} label="Candidates" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Box size={20} />} label="Tasks" active={activeView === 'tasks'} onClick={() => setActiveView('tasks')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase size={20} />} label="Jobs" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Calendar size={20} />} label="Interviews" onClick={() => { }} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<MessageSquare size={20} />} label="Support" active={activeView === 'support'} onClick={() => setActiveView('support')} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Settings size={20} />} label="Settings" active={activeView === 'settings'} onClick={() => setActiveView('settings')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>}
          {sidebarOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-black truncate">Member Hub</span>
                <span className="text-[10px] text-indigo-200 font-bold opacity-70">Professional</span>
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

      <main className="flex-1 flex flex-col h-full overflow-hidden px-8 py-6 transition-all duration-300">

        {/* CONTENT */}
        {activeView === 'dashboard' ? (
          <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide space-y-8 pb-6">

            {/* GREETING */}
            <div className="bg-indigo-600 rounded-2xl p-6 text-white flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold">
                  Hello Member 👋
                </h2>
                <p className="text-white/80 mt-1 text-sm">
                  You have 9 new applications today
                </p>
              </div>

              <button className="bg-white text-indigo-600 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-slate-100">
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
              <div className="lg:col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <h3 className="font-black text-slate-800 text-lg mb-6">
                  Recruitment Progress
                </h3>

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

              {/* PROFILE CARD */}
              <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                <div className="text-center">
                  <div className="w-20 h-20 mx-auto rounded-full bg-indigo-600 mb-4" />
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
          <div className="flex-1 pb-6 overflow-hidden flex flex-col">
            <SettingsPage />
          </div>
        ) : null}
      </main>
      </div>
    </div>
  );
}

/* ================= UI PARTS ================= */

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
  <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden">
    <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center shrink-0">📊</div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
      <div className="flex items-end gap-2">
        <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
      </div>
    </div>
  </div>
);

const TableRow = ({ name, status }) => (
  <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
    <td className="py-4 px-4 font-medium text-slate-700">{name}</td>
    <td className="py-4 px-4"><span className="inline-block bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-xs font-bold uppercase">{status}</span></td>
    <td className="py-4 px-4 text-indigo-600 font-bold">In Progress</td>
  </tr>
);