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
                RECRUITER
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
);

const TableRow = ({ name, status }) => (
  <tr className="border-t border-slate-200">
    <td className="py-3">{name}</td>
    <td>{status}</td>
    <td className="text-[#5a4fff] font-medium">In Progress</td>
  </tr>
);
