import { useEffect, useState } from "react";
import { Plus, Filter } from "lucide-react";
import AgreementAnalytics from "./AgreementAnalytics";
import AgreementList from "./AgreementList";
import AddAgreementModal from "./AddAgreementModal";
import ViewAgreementModal from "./ViewAgreementModal";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

export default function AgreementsPage() {
    const [analytics, setAnalytics] = useState(null);
    const [agreements, setAgreements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [workspaceSlug, setWorkspaceSlug] = useState(null);
    const [error, setError] = useState("");
    const [showAddModal, setShowAddModal] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [selectedAgreement, setSelectedAgreement] = useState(null);
    const [editingAgreement, setEditingAgreement] = useState(null);

    useEffect(() => {
        fetchWorkspaceAndData();
    }, []);

    const fetchWorkspaceAndData = async () => {
        try {
            setLoading(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            if (!token) {
                setError("Please login first");
                return;
            }

            // Fetch workspace (following AdminDashboard pattern)
            const workspaceResponse = await fetch(
                `http://localhost:8000/api/v1/workspaces/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (!workspaceResponse.ok) throw new Error('Failed to fetch workspace');

            const workspaces = await workspaceResponse.json();
            if (workspaces && workspaces.length > 0) {
                const slug = workspaces[0].slug;
                setWorkspaceSlug(slug);

                // Fetch Analytics and Agreements
                await fetchAnalytics(slug, token);
                await fetchAgreementsList(slug, token);
            } else {
                setError("No workspace found");
            }

        } catch (err) {
            console.error("Error fetching agreement data:", err);
            setError("Failed to load agreement data");
        } finally {
            setLoading(false);
        }
    };

    const fetchAnalytics = async (slug, token) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/workspaces/${slug}/agreements/analytics/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            setAnalytics(data);
        }
    };

    const fetchAgreementsList = async (slug, token) => {
        const response = await fetch(
            `http://localhost:8000/api/v1/workspaces/${slug}/agreements/`,
            {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        if (response.ok) {
            const data = await response.json();
            setAgreements(Array.isArray(data) ? data : data.results || []);
        }
    };

    const handleAddSuccess = (newAgreement) => {
        // Refresh the agreements list
        if (workspaceSlug) {
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();
            fetchAnalytics(workspaceSlug, token);
            fetchAgreementsList(workspaceSlug, token);
        }
    };

    const handleView = (agreement) => {
        setSelectedAgreement(agreement);
        setShowViewModal(true);
    };

    const handleEdit = (agreement) => {
        setEditingAgreement(agreement);
        setShowAddModal(true);
    };

    const handleDelete = async (agreement) => {
        if (!window.confirm(`Are you sure you want to delete "${agreement.title}"?`)) {
            return;
        }

        try {
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/agreements/${agreement.id}/`,
                {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                // Refresh the list
                handleAddSuccess();
            } else {
                alert("Failed to delete agreement");
            }
        } catch (error) {
            console.error("Error deleting agreement:", error);
            alert("Error deleting agreement");
        }
    };

    const handleCloseAddModal = () => {
        setShowAddModal(false);
        setEditingAgreement(null);
    };

    if (loading) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-slate-600 font-bold">Loading agreements...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-red-600 font-bold">
                    <p>{error}</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <header className="py-6 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Agreements</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage contracts and documents</p>
                </div>
                <div className="flex gap-3">
                    <button className="bg-white text-slate-600 border border-slate-200 rounded-2xl py-3 px-4 font-black text-xs uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center gap-2">
                        <Filter size={18} />
                        Filter
                    </button>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="bg-indigo-600 text-white rounded-2xl py-3 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 flex items-center gap-2"
                    >
                        <Plus size={18} />
                        New Agreement
                    </button>
                </div>
            </header>

            {/* ANALYTICS */}
            <AgreementAnalytics analytics={analytics} />

            {/* AGREEMENTS LIST */}
            <div className="flex-1 min-h-0 pb-6">
                <AgreementList
                    agreements={agreements}
                    onView={handleView}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                />
            </div>

            {/* VIEW AGREEMENT MODAL */}
            <ViewAgreementModal
                isOpen={showViewModal}
                onClose={() => setShowViewModal(false)}
                agreement={selectedAgreement}
            />

            {/* ADD/EDIT AGREEMENT MODAL */}
            <AddAgreementModal
                isOpen={showAddModal}
                onClose={handleCloseAddModal}
                workspaceSlug={workspaceSlug}
                onSuccess={handleAddSuccess}
                editingAgreement={editingAgreement}
            />
        </div>
    );
}
