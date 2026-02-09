// import { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { getStoredToken, getSessionToken } from "../../utils/authToken";
// import {
//   Building2,
//   LayoutDashboard,
//   Users,
//   Settings,
//   ChevronRight,
//   ChevronsLeft,
//   ChevronsRight,
//   LogOut,
//   ArrowRight,
// } from "lucide-react";
// import Spinner from "../../ui/Spinner";

// export default function WorkspaceDashboard() {
//   const navigate = useNavigate();
//   const [workspaces, setWorkspaces] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [active, setActive] = useState(null);
//   const [sidebarOpen, setSidebarOpen] = useState(true);

//   useEffect(() => {
//     fetchWorkspaces();
//   }, []);

//   const fetchWorkspaces = async () => {
//     try {
//       const token = getStoredToken() || getSessionToken();
//       if (!token) throw new Error("Login required");

//       const res = await fetch("/api/v1/workspaces/", {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       if (!res.ok) throw new Error("Failed to load workspaces");

//       const data = await res.json();
//       setWorkspaces(Array.isArray(data) ? data : []);
//     } catch (err) {
//       setError(err.message);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const openWorkspace = (workspace) => {
//     setActive(workspace.id);

//     localStorage.setItem(
//       "currentWorkspace",
//       JSON.stringify({
//         id: workspace.id,
//         name: workspace.name,
//         slug: workspace.slug,
//         tenant_id: workspace.tenant_id,
//         role: workspace.my_role || "member",
//       })
//     );

//     const map = {
//       admin: "/auth/admin-dashboard",
//       hr: "/auth/hr-dashboard",
//       recruiter: "/auth/recruiter-dashboard",
//       staff: "/auth/staff-dashboard",
//       member: "/auth/member-dashboard",
//       hr_recruiter: "/auth/hr-recruiter-dashboard",
//     };

//     navigate(map[workspace.my_role] || "/auth/member-dashboard");
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center bg-slate-50">
//         <Spinner />
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen flex bg-slate-50">
//       {/* ================= SIDEBAR ================= */}
//       <aside className={`fixed left-0 top-0 h-screen bg-gradient-to-br from-[#5a4fff] via-[#5146f2] to-[#4338e0] text-white flex flex-col p-4 shrink-0 hidden lg:flex shadow-2xl overflow-hidden transition-all duration-300 z-50 ${sidebarOpen ? 'w-64' : 'w-24'}`}>
//         {/* Logo Section */}
//         <div className="flex flex-col items-center gap-4 mb-8">
//           <div className="flex items-center justify-center gap-2 w-full">
//             <div className="">
//               <img src="/Logo3.png" alt="Placfy" className="w-6 h-6 rounded-lg" />
//             </div>
//             {sidebarOpen && <span className="text-2xl font-black tracking-tight text-white uppercase italic flex-1">Placfy</span>}
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="p-2 text-white rounded-lg hover:bg-white/10 transition-colors"
//               title={sidebarOpen ? "Close Sidebar" : "Open Sidebar"}
//             >
//               {sidebarOpen ? <ChevronsLeft size={20} /> : <ChevronsRight size={20} />}
//             </button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <nav className="space-y-1 flex-1 overflow-y-auto scrollbar-hide">
//           {/* {sidebarOpen && <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest mb-4 ml-8">Workspace</p>} */}
//           <SidebarLink icon={<LayoutDashboard size={20} />} label="Workspaces" sidebarOpen={sidebarOpen} />
//           <SidebarLink icon={<Building2 size={20} />} label="Create New" sidebarOpen={sidebarOpen} />
//           <SidebarLink icon={<Users size={20} />} label="Team" sidebarOpen={sidebarOpen} />
//           <SidebarLink icon={<Settings size={20} />} label="Settings" sidebarOpen={sidebarOpen} />
//         </nav>

//         {/* Footer */}
//         <div className="mt-auto pt-6 border-t border-white/20">
//           {sidebarOpen && (
//             <button className="flex items-center gap-3 text-white/80 font-bold text-sm hover:text-white transition-colors w-full px-4 py-2">
//               <LogOut size={18} /> Logout
//             </button>
//           )}
//         </div>
//       </aside>

//       {/* ================= MAIN CONTENT ================= */}
//       <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'}`}>
//         <div className="max-w-7xl mx-auto px-8 py-12">
//           {/* Header */}
//           <div className="mb-10">
//             <h1 className="text-3xl font-semibold text-slate-900">
//               Your Workspaces
//             </h1>
//             <p className="mt-2 text-slate-500">
//               Select a workspace to continue
//             </p>
//           </div>

//           {error && (
//             <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
//               {error}
//             </div>
//           )}

//           {/* Workspace Cards */}
//           {workspaces.length > 0 ? (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//               {workspaces.map((ws) => (
//                 <button
//                   key={ws.id}
//                   onClick={() => openWorkspace(ws)}
//                   className="
//                     group relative text-left bg-white rounded-xl
//                     border border-slate-200
//                     hover:border-[#5a4fff]
//                     hover:shadow-lg
//                     transition-all duration-200
//                   "
//                 >
//                   {/* Brand Accent */}
//                   <div className="absolute inset-x-0 top-0 h-1 bg-[#5a4fff] rounded-t-xl" />

//                   <div className="p-6">
//                     {/* Header */}
//                     <div className="flex items-start justify-between mb-4">
//                       <div className="flex items-center gap-3">
//                         <div className="h-10 w-10 rounded-lg bg-[#5a4fff]/10 flex items-center justify-center">
//                           <Building2 size={20} className="text-[#5a4fff]" />
//                         </div>

//                         <div>
//                           <h3 className="text-lg font-semibold text-slate-900 leading-tight">
//                             {ws.name}
//                           </h3>

//                           {ws.info?.industry && (
//                             <span className="mt-1 inline-block text-xs font-medium text-[#5a4fff] bg-[#5a4fff]/10 px-2 py-0.5 rounded">
//                               {ws.info.industry}
//                             </span>
//                           )}
//                         </div>
//                       </div>

//                       {active === ws.id && (
//                         <div className="h-4 w-4 border-2 border-[#5a4fff] border-t-transparent rounded-full animate-spin" />
//                       )}
//                     </div>

//                     {/* Description */}
//                     {/* <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
//                       {ws.info?.description || "No description provided"}
//                     </p> */}

//                     {/* Footer */}
//                     <div className="mt-6 flex items-center justify-between">
//                       <p className="text-xs text-slate-500 capitalize">
//                         {ws.my_role || "member"} • {ws.member_count || 1} member
//                       </p>

//                       <div className="flex items-center gap-1 text-sm font-medium text-[#5a4fff] group-hover:translate-x-1 transition-transform">
//                         Open
//                         <ChevronRight size={16} />
//                       </div>
//                     </div>
//                   </div>
//                 </button>
//               ))}
//             </div>
//           ) : (
//             <div className="rounded-xl bg-white border border-slate-200 p-16 text-center">
//               <Building2 size={48} className="mx-auto text-slate-400" />
//               <h3 className="mt-4 text-lg font-semibold text-slate-900">
//                 No workspaces yet
//               </h3>
//               <p className="mt-1 text-slate-500">
//                 Create your first workspace to get started
//               </p>

//               <button
//                 onClick={() => navigate("/auth/workspace")}
//                 className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5a4fff] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4a3fe0]"
//               >
//                 Create workspace
//                 <ChevronRight size={16} />
//               </button>
//             </div>
//           )}
//         </div>
//       </main>
//     </div>
//   );
// }

// /* ---------------- SIDEBAR LINK COMPONENT ---------------- */

// const SidebarLink = ({ icon, label, sidebarOpen }) => (
//   <div
//     className={`flex items-center gap-4 px-6 py-3.5 rounded-2xl cursor-pointer transition-all shrink-0 text-indigo-200 hover:bg-white/10`}
//   >
//     {icon}
//     {sidebarOpen && <span className="text-sm font-bold tracking-tight whitespace-nowrap">{label}</span>}
//   </div>
// );




import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../utils/authToken";
import {
  Building2,
  Users,
  ChevronRight,
  Plus,
  Briefcase,
  Crown,
  Shield,
  Clock,
  ArrowRight,
  LayoutDashboard,
  Settings,
  LogOut,
  ChevronsLeft,
  ChevronsRight,
  HelpCircle,
  User
} from "lucide-react";

export default function WorkspaceDashboard() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeView, setActiveView] = useState('workspaces');

  useEffect(() => {
    fetchWorkspaces();
  }, []);

  const fetchWorkspaces = async () => {
    try {
      const token = getStoredToken() || getSessionToken();
      if (!token) throw new Error("Login required");

      const res = await fetch("/api/v1/workspaces/", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to load workspaces");

      const data = await res.json();
      setWorkspaces(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openWorkspace = (workspace) => {
    setActive(workspace.id);

    localStorage.setItem(
      "currentWorkspace",
      JSON.stringify({
        id: workspace.id,
        name: workspace.name,
        slug: workspace.slug,
        tenant_id: workspace.tenant_id,
        role: workspace.my_role || "member",
      })
    );

    const map = {
      admin: "/auth/admin-dashboard",
      hr: "/auth/hr-dashboard",
      recruiter: "/auth/recruiter-dashboard",
      staff: "/auth/staff-dashboard",
      member: "/auth/member-dashboard",
      hr_recruiter: "/auth/hr-recruiter-dashboard",
    };

    navigate(map[workspace.my_role] || "/auth/member-dashboard");
  };

  const getRoleIcon = (role) => {
    const icons = {
      admin: <Crown size={14} />,
      hr: <Users size={14} />,
      recruiter: <Briefcase size={14} />,
      staff: <Shield size={14} />,
      member: <Users size={14} />,
      hr_recruiter: <Briefcase size={14} />,
    };
    return icons[role] || <Users size={14} />;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "text-purple-600 bg-purple-50 border-purple-200",
      hr: "text-blue-600 bg-blue-50 border-blue-200",
      recruiter: "text-emerald-600 bg-emerald-50 border-emerald-200",
      staff: "text-orange-600 bg-orange-50 border-orange-200",
      member: "text-slate-600 bg-slate-50 border-slate-200",
      hr_recruiter: "text-indigo-600 bg-indigo-50 border-indigo-200",
    };
    return colors[role] || colors.member;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
      </div>
    );
  }

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
          {sidebarOpen && <p className="text-[10px] font-bold text-indigo-200 uppercase tracking-widest mb-4 ml-8">Menu</p>}
          <SidebarLink icon={<LayoutDashboard size={20} />} label="Workspaces" active={activeView === 'workspaces'} onClick={() => setActiveView('workspaces')} sidebarOpen={sidebarOpen} />
        </nav>

        <div className="mt-auto pt-6 border-t border-indigo-400/30">
          {sidebarOpen && (
            <button className="flex items-center gap-3 text-indigo-200 mt-2 font-bold text-sm hover:text-white transition-colors ml-4">
              <LogOut size={18} /> Logout
            </button>
          )}
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className={`flex-1 flex flex-col h-full overflow-hidden transition-all duration-300 ${sidebarOpen ? 'lg:ml-64' : 'lg:ml-24'}`}>
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-7xl mx-auto">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
              <div>
                <h1 className="text-3xl font-black text-slate-800 tracking-tight uppercase">
                  Your Workspaces
                </h1>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Select a workspace to continue
                </p>
              </div>
              <button
                onClick={() => navigate("/auth/workspace")}
                className="bg-indigo-600 text-white rounded-2xl py-3 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
              >
                <Plus size={18} />
                Create Workspace
              </button>
            </div>

            {error && (
              <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm font-bold flex items-center gap-3">
                <span className="bg-red-100 p-1 rounded-md">⚠️</span>
                {error}
              </div>
            )}

            {/* Workspace Cards */}
            {workspaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {workspaces.map((ws) => (
                  <div
                    key={ws.id}
                    className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 transition-all duration-300 hover:shadow-xl hover:border-indigo-200 hover:-translate-y-1 cursor-pointer group relative overflow-hidden"
                    onClick={() => openWorkspace(ws)}
                  >
                    {/* Decorative gradient accent */}
                    <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100/50 to-purple-100/50 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                    {/* Content */}
                    <div className="relative z-10">
                      {/* Icon and Role Badge */}
                      <div className="flex items-start justify-between mb-3">
                        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600 group-hover:scale-110 group-hover:bg-indigo-100 transition-all duration-300">
                          <Building2 size={20} />
                        </div>

                        {ws.my_role && (
                          <div
                            className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] font-bold uppercase tracking-wider ${getRoleColor(
                              ws.my_role
                            )}`}
                          >
                            {getRoleIcon(ws.my_role)}
                            {ws.my_role.replace("_", " ")}
                          </div>
                        )}
                      </div>

                      {/* Workspace Name */}
                      <h3 className="text-base font-black text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors truncate">
                        {ws.name}
                      </h3>

                      {/* Industry Tag */}
                      {ws.info?.industry && (
                        <span className="inline-block text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded mb-3 capitalize">
                          {ws.info.industry}
                        </span>
                      )}

                      {/* Stats */}
                      <div className="flex items-center gap-3 pt-3 border-t border-slate-100 mt-2">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <Users size={12} />
                          {ws.member_count || 1} member{ws.member_count !== 1 ? "s" : ""}
                        </div>
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500">
                          <Clock size={12} />
                          Active
                        </div>
                      </div>

                      {/* Action */}
                      <div className="mt-3 flex items-center justify-end gap-1 text-xs font-black text-indigo-600 group-hover:gap-2 transition-all">
                        {active === ws.id ? (
                          <div className="w-3 h-3 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                          <>
                            Open
                            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-[2.5rem] p-16 shadow-sm border border-slate-100 text-center">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-6">
                  <Building2 size={40} className="text-slate-400" />
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-2">
                  No workspaces yet
                </h3>
                <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                  Create your first workspace to start managing your recruitment operations
                </p>
                <button
                  onClick={() => navigate("/auth/workspace")}
                  className="bg-indigo-600 text-white rounded-2xl py-3 px-8 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 inline-flex items-center gap-2"
                >
                  <Plus size={18} />
                  Create Your First Workspace
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

/* --- REUSABLE SIDEBAR LINK --- */
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