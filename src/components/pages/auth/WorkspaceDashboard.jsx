import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../utils/authToken";
import {
  Building2,
  LayoutDashboard,
  Users,
  Settings,
  ChevronRight,
} from "lucide-react";
import Spinner from "../../ui/Spinner";

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
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* ================= SIDEBAR ================= */}
      <aside className="w-64 bg-[#5a4fff] text-white flex flex-col">
        <div className="px-6 py-6 text-2xl font-bold tracking-tight">
          Placfy
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <SidebarItem
            icon={<LayoutDashboard size={18} />}
            label="Workspaces"
            active
          />
          <SidebarItem icon={<Users size={18} />} label="Members" />
          <SidebarItem icon={<Settings size={18} />} label="Settings" />
        </nav>

        <div className="p-4 text-sm text-white/70">
          © 2026 Placfy
        </div>
      </aside>

      {/* ================= MAIN ================= */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-8 py-12">
          {/* Header */}
          <div className="mb-10">
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

          {/* Workspace Cards */}
          {workspaces.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {workspaces.map((ws) => (
                <button
                  key={ws.id}
                  onClick={() => openWorkspace(ws)}
                  className="
                    group relative text-left bg-white rounded-xl
                    border border-slate-200
                    hover:border-[#5a4fff]
                    hover:shadow-lg
                    transition-all duration-200
                  "
                >
                  {/* Brand Accent */}
                  <div className="absolute inset-x-0 top-0 h-1 bg-[#5a4fff] rounded-t-xl" />

                  <div className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-[#5a4fff]/10 flex items-center justify-center">
                          <Building2 size={20} className="text-[#5a4fff]" />
                        </div>

                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 leading-tight">
                            {ws.name}
                          </h3>

                          {ws.info?.industry && (
                            <span className="mt-1 inline-block text-xs font-medium text-[#5a4fff] bg-[#5a4fff]/10 px-2 py-0.5 rounded">
                              {ws.info.industry}
                            </span>
                          )}
                        </div>
                      </div>

                      {active === ws.id && (
                        <div className="h-4 w-4 border-2 border-[#5a4fff] border-t-transparent rounded-full animate-spin" />
                      )}
                    </div>

                    {/* Description */}
                    {/* <p className="text-sm text-slate-600 line-clamp-2 min-h-[40px]">
                      {ws.info?.description || "No description provided"}
                    </p> */}

                    {/* Footer */}
                    <div className="mt-6 flex items-center justify-between">
                      <p className="text-xs text-slate-500 capitalize">
                        {ws.my_role || "member"} • {ws.member_count || 1} member
                      </p>

                      <div className="flex items-center gap-1 text-sm font-medium text-[#5a4fff] group-hover:translate-x-1 transition-transform">
                        Open
                        <ChevronRight size={16} />
                      </div>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="rounded-xl bg-white border border-slate-200 p-16 text-center">
              <Building2 size={48} className="mx-auto text-slate-400" />
              <h3 className="mt-4 text-lg font-semibold text-slate-900">
                No workspaces yet
              </h3>
              <p className="mt-1 text-slate-500">
                Create your first workspace to get started
              </p>

              <button
                onClick={() => navigate("/auth/workspace")}
                className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#5a4fff] px-5 py-2.5 text-sm font-medium text-white hover:bg-[#4a3fe0]"
              >
                Create workspace
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

/* ---------------- SIDEBAR ITEM ---------------- */

const SidebarItem = ({ icon, label, active }) => (
  <div
    className={`flex items-center gap-3 px-4 py-2 rounded-lg text-sm cursor-pointer
      ${active ? "bg-white/15" : "hover:bg-white/10"}
    `}
  >
    {icon}
    {label}
  </div>
);
