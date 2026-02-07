


import { useState } from "react";
import {
  Search, ClipboardList, Clock, CheckCircle, Bell,
  LayoutDashboard, LogOut, ArrowRight, Calendar,
  MessageSquare, Settings, Briefcase, Mail, User, ChevronsLeft, ChevronsRight
} from "lucide-react";

export default function StaffDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [staffName] = useState("Lay UX");
  const [stats] = useState({
    tasks: "14",
    completed: "9",
    hours: "7h 30m",
    notifications: "3",
  });

  return (
    // Fixed height: h-screen and overflow-hidden prevent the whole page from scrolling
    <div className="h-screen w-full bg-[#EEF2FF] flex font-sans overflow-hidden p-4">
      
      {/* SIDEBAR - Fixed height via h-full */}
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
          <SidebarLink icon={<LayoutDashboard size={20}/>} label="Dashboard" active={true} sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<ClipboardList size={20}/>} label="Assignments" sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Calendar size={20}/>} label="Schedule" sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<Briefcase size={20}/>} label="Projects" sidebarOpen={sidebarOpen} />
          <SidebarLink icon={<MessageSquare size={20}/>} label="Messages" sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-4">Workspace</p>}
          {sidebarOpen && (
            <div className="flex items-center justify-between px-4 py-3 bg-white/10 rounded-2xl text-white border border-white/10 cursor-pointer hover:bg-white/20 transition-all group">
               <div className="flex flex-col overflow-hidden">
                 <span className="text-xs font-black truncate">{staffName}</span>
                 <span className="text-[10px] text-indigo-200 font-bold opacity-70">Operations Team</span>
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

      {/* MAIN CONTENT AREA - Also fixed height */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden px-8 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'}`}>
        
        {/* HEADER - Sticky at top */}
        <header className="py-6 flex items-center justify-between shrink-0">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Staff Dashboard</h1>
          
          <div className="flex items-center gap-6 bg-white/60 p-1.5 rounded-[2rem] border border-white/80 shadow-sm backdrop-blur-md">
            <div className="relative group hidden md:block">
              <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search..." className="bg-transparent py-2.5 pl-12 pr-4 text-sm outline-none w-48 focus:w-64 transition-all" />
            </div>
            
            <div className="flex items-center gap-3 px-4 border-l border-slate-200/60">
              <button className="p-2 text-slate-500 hover:bg-indigo-50 rounded-full transition-colors relative">
                <Bell size={20} />
                <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white"></span>
              </button>
              <div className="flex items-center gap-3 ml-2 pl-4 border-l border-slate-200/60">
                <span className="text-sm font-black text-slate-700">{staffName}</span>
                <div className="w-10 h-10 bg-indigo-100 rounded-2xl border-2 border-white shadow-md overflow-hidden ring-4 ring-indigo-50">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lay" alt="user" />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* INNER CONTENT GRID - Only the middle parts scroll if needed */}
        <div className="flex-1 flex gap-8 min-h-0 pb-6">
          
          {/* LEFT SCROLLABLE SECTION (Banner + Stats) */}
          <div className="flex-[2.2] flex flex-col gap-6 overflow-y-auto pr-2 scrollbar-hide">
            
            {/* HERO BANNER - Sized to fit comfortably */}
            <div className="relative bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-[3rem] p-8 text-white shadow-2xl overflow-hidden shrink-0">
              <div className="relative z-10 max-w-md">
                <h2 className="text-3xl font-black mb-2">Hello {staffName}!</h2>
                <p className="text-indigo-100 font-medium text-sm mb-6 leading-relaxed">
                  You have <span className="text-white font-bold">{stats.completed} tasks</span> done today. Check your schedule.
                </p>
                <button className="bg-white text-indigo-600 px-6 py-3 rounded-2xl font-black text-xs shadow-xl hover:scale-105 transition-transform">
                  Daily Schedule
                </button>
              </div>
              <div className="absolute bottom-[-10%] right-[5%] opacity-10">
                 <User size={180} />
              </div>
            </div>

            {/* MINI STATS TILES */}
            <div className="grid grid-cols-3 gap-4 shrink-0">
              <StatCard title="Total Tasks" value={stats.tasks} change="+2" icon={<ClipboardList className="text-indigo-600" size={20}/>}/>
              <StatCard title="Clock Hours" value={stats.hours} change="On track" icon={<Clock className="text-indigo-600" size={20}/>}/>
              <StatCard title="Done" value={stats.completed} change="88%" icon={<CheckCircle className="text-indigo-600" size={20}/>}/>
            </div>

            {/* PROGRESS ACTIVITY - This will scroll if more items are added */}
            <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 flex-1">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-black text-slate-800 text-lg">Recent Progress</h3>
                <button className="text-indigo-600 font-black text-[10px] uppercase px-3 py-1.5 bg-indigo-50 rounded-lg">View All</button>
              </div>
              <div className="space-y-6">
                <ActivityItem text="Update client report" time="10:45 AM" type="Complete" color="bg-emerald-400" />
                <ActivityItem text="Review project files" time="09:15 AM" type="New" color="bg-orange-400" />
                {/* <ActivityItem text="System clock-in" time="09:00 AM" type="System" color="bg-indigo-400" /> */}
              </div>
            </div>
          </div>

          {/* RIGHT FIXED WIDGETS */}
          <div className="flex-1 flex flex-col gap-6 min-w-[300px]">
             
             {/* COMPACT CALENDAR */}
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
                    <div key={i} className={`py-1 text-[11px] font-bold ${i === 4 ? 'bg-indigo-600 text-white rounded-lg shadow-md' : 'text-slate-600'}`}>
                      {i+1}
                    </div>
                  ))}
                </div>
             </div>

             {/* PROFILE CARD - Fills remaining space */}
             <div className="bg-white rounded-[2.5rem] p-6 shadow-sm border border-slate-100 flex-1 flex flex-col items-center justify-center">
                <div className="w-20 h-20 bg-indigo-50 rounded-3xl mb-3 border-4 border-white shadow-xl overflow-hidden ring-4 ring-indigo-50">
                   <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Lay" alt="user" />
                </div>
                <h4 className="font-black text-slate-800">{staffName}</h4>
                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mb-4">Senior Designer</p>
                <div className="w-full pt-4 border-t border-slate-50 flex justify-between px-2">
                   <div className="text-center">
                      <p className="text-base font-black text-slate-800">14</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Projects</p>
                   </div>
                   <div className="text-center">
                      <p className="text-base font-black text-slate-800">4.9</p>
                      <p className="text-[9px] font-bold text-slate-400 uppercase">Rating</p>
                   </div>
                </div>
                {/* Submit Task Button */}
                <button className="w-full mt-6 bg-slate-900 text-white font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-colors">
                  Submit Timesheet
                </button>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- COMPONENTS --- */

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
    <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3">
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

function ActivityItem({ text, time, type, color }) {
  return (
    <div className="flex items-center justify-between group">
      <div className="flex items-center gap-4">
        <div className={`w-2.5 h-2.5 rounded-full ${color} ring-4 ring-slate-50`} />
        <div>
          <p className="text-xs font-black text-slate-700">{text}</p>
          <p className="text-[9px] font-bold text-slate-400 uppercase">{time}</p>
        </div>
      </div>
      <span className="text-[8px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded-lg">
        {type}
      </span>
    </div>
  );
}
