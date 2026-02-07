import { useState, useEffect } from 'react';
import {
    Search, Filter, Plus, ArrowRight, MessageSquare,
    CheckCircle, AlertCircle, Clock, User
} from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import TicketDetail from './TicketDetail';
import CreateTicketModal from './CreateTicketModal';

const SupportPage = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeView, setActiveView] = useState('list'); // 'list' or 'detail'
    const [selectedTicketId, setSelectedTicketId] = useState(null);
    const [workspaceSlug, setWorkspaceSlug] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);

    useEffect(() => {
        fetchWorkspaceAndTickets();
    }, []);

    const fetchWorkspaceAndTickets = async () => {
        try {
            setLoading(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            // 1. Try to get workspace from localStorage first
            const storedWs = localStorage.getItem('currentWorkspace');
            let slug = null;

            if (storedWs) {
                try {
                    const wsData = JSON.parse(storedWs);
                    slug = wsData.slug;
                } catch (e) {
                    console.error("Failed to parse stored workspace", e);
                }
            }

            // 2. Fallback to API if not in localStorage or needs update
            if (!slug) {
                const workspaceResponse = await fetch(
                    `http://localhost:8000/api/v1/workspaces/`,
                    { headers: { 'Authorization': `Bearer ${token}` } }
                );

                if (workspaceResponse.ok) {
                    const workspaces = await workspaceResponse.json();
                    if (workspaces.length > 0) {
                        slug = workspaces[0].slug;
                    }
                }
            }

            if (slug) {
                setWorkspaceSlug(slug);
                await fetchTickets(slug, token);
            }
        } catch (error) {
            console.error('Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTickets = async (slug, token) => {
        try {
            let url = `http://localhost:8000/api/v1/workspaces/${slug}/help-desk/tickets/`;
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTickets(Array.isArray(data) ? data : data.results || []);
            }
        } catch (error) {
            console.error('Failed to fetch tickets', error);
        }
    };

    const handleTicketClick = (id) => {
        setSelectedTicketId(id);
        setActiveView('detail');
    };

    const handleTicketCreated = (newTicket) => {
        // Refresh tickets
        const sessionToken = getSessionToken();
        const token = sessionToken || getStoredToken();
        if (workspaceSlug) fetchTickets(workspaceSlug, token);
    };

    if (activeView === 'detail' && selectedTicketId) {
        return (
            <TicketDetail
                ticketId={selectedTicketId}
                onBack={() => {
                    setActiveView('list');
                    setSelectedTicketId(null);
                    // Refresh list on return
                    const sessionToken = getSessionToken();
                    const token = sessionToken || getStoredToken();
                    fetchTickets(workspaceSlug, token);
                }}
                workspaceSlug={workspaceSlug}
            />
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in duration-500">
            <CreateTicketModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onTicketCreated={handleTicketCreated}
                workspaceSlug={workspaceSlug}
            />

            {/* HEADER */}
            <header className="py-6 shrink-0 flex items-center justify-between px-6">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Support Tickets</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage customer inquiries and issues</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search tickets..."
                            className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 w-64"
                        />
                    </div>
                    <button
                        onClick={() => setShowCreateModal(true)}
                        className="bg-indigo-600 text-white p-2 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
                    >
                        <Plus size={20} />
                    </button>
                </div>
            </header>

            {/* FILTERS */}
            <div className="px-6 mb-6 flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                {['all', 'open', 'in_progress', 'resolved', 'closed'].map(status => (
                    <button
                        key={status}
                        onClick={() => {
                            setFilterStatus(status);
                            // Trigger refetch logic (simplified here, would separate effects in real app)
                            const sessionToken = getSessionToken();
                            const token = sessionToken || getStoredToken();
                            if (workspaceSlug) fetchTickets(workspaceSlug, token);
                        }}
                        className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all border ${filterStatus === status
                            ? 'bg-indigo-600 text-white border-indigo-600 shadow-md'
                            : 'bg-white text-slate-500 border-slate-200 hover:border-indigo-300'
                            }`}
                    >
                        {status.replace('_', ' ')}
                    </button>
                ))}
            </div>

            {/* TICKET LIST */}
            <div className="flex-1 px-6 pb-6 overflow-hidden">
                <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        </div>
                    ) : tickets.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
                            <MessageSquare size={48} className="mb-4 opacity-20" />
                            <p className="font-bold">No tickets found</p>
                        </div>
                    ) : (
                        <div className="flex-1 overflow-y-auto">
                            <table className="w-full text-left border-collapse">
                                <thead className="bg-slate-50 sticky top-0 z-10">
                                    <tr>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Ticket ID</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Subject</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Status</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Priority</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Requester</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400">Last Updated</th>
                                        <th className="py-4 px-6 text-[10px] font-black uppercase tracking-widest text-slate-400 text-right">Action</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {tickets.map((ticket) => (
                                        <tr
                                            key={ticket.id}
                                            className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                                            onClick={() => handleTicketClick(ticket.id)}
                                        >
                                            <td className="py-4 px-6">
                                                <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-1 rounded">
                                                    {ticket.ticket_number}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="max-w-[300px]">
                                                    <p className="font-bold text-slate-800 text-sm truncate">{ticket.subject}</p>
                                                    <p className="text-xs text-slate-400 truncate mt-0.5">{ticket.category_display}</p>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${ticket.status === 'open' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                                    ticket.status === 'in_progress' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' :
                                                        ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                                            'bg-orange-50 text-orange-700 border-orange-100'
                                                    }`}>
                                                    <div className={`w-1.5 h-1.5 rounded-full ${ticket.status === 'open' ? 'bg-blue-500' :
                                                        ticket.status === 'in_progress' ? 'bg-indigo-500' :
                                                            ticket.status === 'resolved' || ticket.status === 'closed' ? 'bg-emerald-500' :
                                                                'bg-orange-500'
                                                        }`} />
                                                    {ticket.status_display}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`text-[10px] font-bold uppercase ${ticket.priority === 'urgent' || ticket.priority === 'critical' ? 'text-red-500' :
                                                    ticket.priority === 'high' ? 'text-orange-500' :
                                                        'text-slate-500'
                                                    }`}>
                                                    {ticket.priority_display}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center text-[10px] font-bold">
                                                        {ticket.created_by_details?.email?.[0]?.toUpperCase() || 'U'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600">
                                                        {ticket.created_by_details?.username || ticket.created_by_details?.email || 'Unknown'}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="py-4 px-6 text-xs font-bold text-slate-400">
                                                {new Date(ticket.updated_at).toLocaleDateString()}
                                            </td>
                                            <td className="py-4 px-6 text-right">
                                                <button className="text-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-indigo-50 rounded-lg">
                                                    <ArrowRight size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SupportPage;
