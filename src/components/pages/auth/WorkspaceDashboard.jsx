// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { getStoredToken, getSessionToken } from '../../utils/authToken';
// import { ChevronRight, Building2 } from 'lucide-react';
// import Spinner from '../../ui/Spinner';

// const WorkspaceDashboard = () => {
//     const navigate = useNavigate();
//     const [workspaces, setWorkspaces] = useState([]);
//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);
//     const [selectedWorkspace, setSelectedWorkspace] = useState(null);

//     useEffect(() => {
//         fetchWorkspaces();
//     }, []);

//     const fetchWorkspaces = async () => {
//         try {
//             const accessToken = getStoredToken() || getSessionToken();
//             if (!accessToken) {
//                 throw new Error('Authentication required. Please login again.');
//             }

//             const response = await fetch('/api/v1/workspaces/', {
//                 method: 'GET',
//                 headers: {
//                     'Content-Type': 'application/json',
//                     'Authorization': `Bearer ${accessToken}`,
//                 },
//             });

//             if (!response.ok) {
//                 throw new Error('Failed to fetch workspaces');
//             }

//             const data = await response.json();
//             setWorkspaces(Array.isArray(data) ? data : []);
//             setError(null);
//         } catch (error) {
//             console.error('Error fetching workspaces:', error);
//             setError(error.message);
//             setWorkspaces([]);
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleWorkspaceClick = async (workspace) => {
//         try {
//             setSelectedWorkspace(workspace.id);

//             // Get the role from the workspace data (already provided by the API)
//             const userRole = workspace.my_role;

//             if (!userRole) {
//                 throw new Error('Unable to determine workspace role');
//             }

//             // Store current workspace in localStorage
//             localStorage.setItem('currentWorkspace', JSON.stringify({
//                 id: workspace.id,
//                 name: workspace.name,
//                 slug: workspace.slug,
//                 tenant_id: workspace.tenant_id,
//                 role: userRole
//             }));

//             // Redirect to appropriate dashboard based on role
//             const roleDashboardMap = {
//                 'admin': '/auth/admin-dashboard',
//                 'hr': '/auth/hr-dashboard',
//                 'recruiter': '/auth/recruiter-dashboard',
//                 'staff': '/auth/staff-dashboard',
//                 'member': '/auth/member-dashboard',
//                 'hr_recruiter': '/auth/hr-recruiter-dashboard'
//             };

//             const dashboardPath = roleDashboardMap[userRole] || '/auth/member-dashboard';
            
//             setTimeout(() => {
//                 navigate(dashboardPath);
//             }, 300);
//         } catch (error) {
//             console.error('Error opening workspace:', error);
//             setError(error.message);
//             setSelectedWorkspace(null);
//         }
//     };

//     if (loading) {
//         return (
//             <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
//                 <div className="text-center">
//                     <Spinner />
//                     <p className="mt-4 text-slate-300">Loading your workspaces...</p>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
//             <div className="max-w-4xl mx-auto px-6 py-12">
//                 {/* Header */}
//                 <div className="mb-12">
//                     <div className="flex items-center gap-3 mb-4">
//                         <div className="p-2 bg-indigo-500/20 rounded-lg">
//                             <Building2 className="text-indigo-400" size={28} />
//                         </div>
//                         <h1 className="text-4xl font-bold text-white">Workspaces</h1>
//                     </div>
//                     <p className="text-slate-400 text-lg">Select a workspace to get started</p>
//                 </div>

//                 {/* Error State */}
//                 {error && (
//                     <div className="mb-8 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400">
//                         <p className="font-medium">Error: {error}</p>
//                     </div>
//                 )}

//                 {/* Workspaces Grid */}
//                 {workspaces.length > 0 ? (
//                     <div className="space-y-3">
//                         {workspaces.map((workspace) => (
//                             <button
//                                 key={workspace.id}
//                                 onClick={() => handleWorkspaceClick(workspace)}
//                                 disabled={selectedWorkspace === workspace.id}
//                                 className="w-full group"
//                             >
//                                 <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:bg-slate-800/80 hover:border-indigo-500/50 transition-all duration-200 flex items-center justify-between disabled:opacity-50 disabled:cursor-not-allowed">
//                                     <div className="flex items-center gap-4 flex-1">
//                                         <div className="p-3 bg-indigo-500/20 rounded-lg group-hover:bg-indigo-500/30 transition-colors">
//                                             <Building2 className="text-indigo-400" size={24} />
//                                         </div>
//                                         <div className="text-left">
//                                             <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors">
//                                                 {workspace.name}
//                                             </h3>
//                                             <p className="text-sm text-slate-500 capitalize">
//                                                 Role: {workspace.my_role || 'member'} • {workspace.member_count || 1} member{workspace.member_count !== 1 ? 's' : ''}
//                                             </p>
//                                         </div>
//                                     </div>
//                                     <div className="flex items-center gap-2">
//                                         {selectedWorkspace === workspace.id && (
//                                             <div className="mr-2">
//                                                 <div className="w-4 h-4 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
//                                             </div>
//                                         )}
//                                         <ChevronRight className="text-slate-500 group-hover:text-indigo-400 group-hover:translate-x-1 transition-all" size={24} />
//                                     </div>
//                                 </div>
//                             </button>
//                         ))}
//                     </div>
//                 ) : (
//                     <div className="text-center py-16 bg-slate-800/30 border border-slate-700/50 rounded-lg">
//                         <Building2 className="mx-auto text-slate-600 mb-4" size={48} />
//                         <h3 className="text-xl font-semibold text-slate-300 mb-2">No workspaces yet</h3>
//                         <p className="text-slate-500 mb-6">Create your first workspace to get started</p>
//                         <button
//                             onClick={() => navigate('/auth/workspace')}
//                             className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition-colors"
//                         >
//                             <span>Create Workspace</span>
//                             <ChevronRight size={18} />
//                         </button>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default WorkspaceDashboard;








import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../utils/authToken";
import { Building2, ChevronRight } from "lucide-react";
import Spinner from "../../ui/Spinner";

const pastelGradients = [
  "from-blue-50 to-blue-100",
  "from-violet-50 to-violet-100",
  "from-emerald-50 to-emerald-100",
  "from-amber-50 to-amber-100",
  "from-rose-50 to-rose-100",
  "from-cyan-50 to-cyan-100",
];

export default function WorkspaceDashboard() {
  const navigate = useNavigate();
  const [workspaces, setWorkspaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [active, setActive] = useState(null);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f8fb]">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f7f8fb] to-[#eef1f7]">
      <div className="max-w-6xl mx-auto px-6 py-14">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl font-semibold text-slate-900">
            Your Workspaces
          </h1>
          <p className="mt-2 text-slate-500">
            Select a workspace to continue
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* Card Grid */}
        {workspaces.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {workspaces.map((ws, i) => (
              <button
                key={ws.id}
                onClick={() => openWorkspace(ws)}
                className={`
                  relative text-left rounded-2xl p-6
                  bg-gradient-to-br ${pastelGradients[i % pastelGradients.length]}
                  border border-white
                  hover:shadow-md hover:-translate-y-[1px]
                  transition-all
                `}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="h-10 w-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                    <Building2 size={20} className="text-slate-600" />
                  </div>

                  {active === ws.id && (
                    <div className="h-4 w-4 border-2 border-slate-500 border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

<h3 className="text-lg font-semibold text-slate-900">
  {ws.name}
</h3>

{/* Industry badge */}
{ws.info?.industry && (
  <span className="inline-block mt-2 rounded-full bg-white/70 px-3 py-1 text-xs font-medium text-slate-700">
    {ws.info.industry}
  </span>
)}

{/* Description */}
<p className="mt-3 text-sm text-slate-600 line-clamp-2">
  {ws.info?.description
    ? ws.info.description
    : "No description provided"}
</p>

{/* Meta */}
<p className="mt-3 text-xs text-slate-500 capitalize">
  {ws.my_role || "member"} • {ws.member_count || 1} member
</p>

                <div className="mt-6 flex items-center text-sm font-medium text-slate-700">
                  Open workspace
                  <ChevronRight size={16} className="ml-1" />
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl bg-white border border-slate-200 p-20 text-center">
            <Building2 size={48} className="mx-auto text-slate-400" />
            <h3 className="mt-4 text-lg font-semibold text-slate-900">
              No workspaces yet
            </h3>
            <p className="mt-1 text-slate-500">
              Create your first workspace to get started
            </p>

            <button
              onClick={() => navigate("/auth/workspace")}
              className="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
            >
              Create workspace
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
