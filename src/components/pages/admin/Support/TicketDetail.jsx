import { useState, useEffect, useRef } from 'react';
import {
    ArrowLeft, Send, Paperclip, Clock, CheckCircle,
    AlertCircle, MessageSquare, User, FileText, Download
} from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

const TicketDetail = ({ ticketId, onBack, workspaceSlug }) => {
    const [ticket, setTicket] = useState(null);
    const [loading, setLoading] = useState(true);
    const [comment, setComment] = useState("");
    const [isInternal, setIsInternal] = useState(false);
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        fetchTicketDetails();
    }, [ticketId]);

    useEffect(() => {
        if (ticket) {
            scrollToBottom();
        }
    }, [ticket?.comments]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchTicketDetails = async () => {
        try {
            setLoading(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/help-desk/tickets/${ticketId}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if (response.ok) {
                const data = await response.json();
                setTicket(data);
            }
        } catch (error) {
            console.error('Error fetching ticket:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = async (newStatus) => {
        try {
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/help-desk/tickets/${ticketId}/`,
                {
                    method: 'PATCH',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                fetchTicketDetails();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSubmitComment = async (e) => {
        e.preventDefault();
        if (!comment.trim() && files.length === 0) return;

        try {
            setSubmitting(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            // 1. Create Comment
            const commentResponse = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/help-desk/tickets/${ticketId}/comments/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        content: comment,
                        is_internal: isInternal,
                        comment_type: isInternal ? 'internal_note' : 'comment'
                    }),
                }
            );

            if (commentResponse.ok) {
                const newComment = await commentResponse.json();

                // 2. Upload Attachments if any
                if (files.length > 0) {
                    await Promise.all(Array.from(files).map(async (file) => {
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('comment', newComment.id);

                        await fetch(
                            `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/help-desk/tickets/${ticketId}/attachments/`,
                            {
                                method: 'POST',
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                },
                                body: formData,
                            }
                        );
                    }));
                }

                setComment("");
                setFiles([]);
                setIsInternal(false);
                fetchTicketDetails();
            }
        } catch (error) {
            console.error('Error submitting comment:', error);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="p-8 text-center text-slate-500">Loading ticket details...</div>;
    if (!ticket) return <div className="p-8 text-center text-red-500">Ticket not found</div>;

    return (
        <div className="flex flex-col h-full bg-slate-50 relative">
            {/* HEADER */}
            <div className="bg-white px-6 py-4 border-b border-slate-200 flex items-center justify-between shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                        <ArrowLeft size={20} className="text-slate-600" />
                    </button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <span className="font-mono text-xs font-bold text-slate-400 bg-slate-100 px-2 py-1 rounded">
                                {ticket.ticket_number}
                            </span>
                            <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full tracking-wide ${ticket.priority === 'urgent' || ticket.priority === 'critical' ? 'bg-red-100 text-red-700' :
                                ticket.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                    'bg-blue-100 text-blue-700'
                                }`}>
                                {ticket.priority_display}
                            </span>
                        </div>
                        <h2 className="text-xl font-bold text-slate-800">{ticket.subject}</h2>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <select
                        value={ticket.status}
                        onChange={(e) => handleStatusChange(e.target.value)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider border-2 outline-none cursor-pointer ${ticket.status === 'resolved' || ticket.status === 'closed'
                            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                            : 'bg-white border-slate-200 text-slate-700 hover:border-indigo-300'
                            }`}
                    >
                        <option value="open">Open</option>
                        <option value="in_progress">In Progress</option>
                        <option value="waiting_for_customer">Waiting for Customer</option>
                        <option value="resolved">Resolved</option>
                        <option value="closed">Closed</option>
                    </select>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* MAIN CHAT AREA */}
                <div className="flex-1 flex flex-col min-w-0">
                    <div className="flex-1 overflow-y-auto p-6 space-y-6">
                        {/* ORIGINAL TICKET DESCRIPTION */}
                        <div className="flex gap-4">
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center shrink-0">
                                <User size={20} className="text-indigo-600" />
                            </div>
                            <div className="flex-1 max-w-3xl">
                                <div className="flex items-baseline gap-2 mb-1">
                                    <span className="font-bold text-slate-800">{ticket.created_by_details.username}</span>
                                    <span className="text-xs text-slate-400">reported this</span>
                                    <span className="text-xs text-slate-400">{new Date(ticket.created_at).toLocaleString()}</span>
                                </div>
                                <div className="bg-white p-5 rounded-2xl rounded-tl-none shadow-sm border border-slate-200 text-slate-700 leading-relaxed whitespace-pre-wrap">
                                    {ticket.description}
                                </div>

                                {/* TICKET ATTACHMENTS (NON-COMMENT) */}
                                {ticket.attachments && ticket.attachments.filter(a => !a.uploaded_by_details).length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {ticket.attachments.filter(a => !a.uploaded_by_details).map(file => (
                                            <a key={file.id} href={file.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                                <Paperclip size={14} />
                                                {file.file_name} ({file.file_size_mb} MB)
                                            </a>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* SEPARATOR */}
                        <div className="relative flex py-4 items-center">
                            <div className="flex-grow border-t border-slate-200"></div>
                            <span className="flex-shrink-0 mx-4 text-xs font-bold text-slate-300 uppercase tracking-widest">Conversation Started</span>
                            <div className="flex-grow border-t border-slate-200"></div>
                        </div>

                        {/* COMMENTS */}
                        {ticket.comments && ticket.comments.map((comment) => (
                            <div key={comment.id} className={`flex gap-4 ${comment.is_internal ? 'bg-yellow-50/50 -mx-6 px-6 py-4 border-y border-yellow-100' : ''}`}>
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${comment.created_by_details.id === ticket.created_by ? 'bg-indigo-100' : 'bg-emerald-100'
                                    }`}>
                                    <span className={`font-bold ${comment.created_by_details.id === ticket.created_by ? 'text-indigo-600' : 'text-emerald-600'
                                        }`}>
                                        {comment.created_by_details.email?.[0].toUpperCase()}
                                    </span>
                                </div>
                                <div className="flex-1 max-w-3xl">
                                    <div className="flex items-baseline gap-2 mb-1">
                                        <span className="font-bold text-slate-800">
                                            {comment.created_by_details.username || comment.created_by_details.email}
                                        </span>
                                        {comment.is_internal && <span className="bg-yellow-100 text-yellow-700 text-[10px] font-bold uppercase px-2 rounded-full">Internal Note</span>}
                                        <span className="text-xs text-slate-400">{new Date(comment.created_at).toLocaleString()}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-slate-700 leading-relaxed whitespace-pre-wrap shadow-sm border ${comment.is_internal
                                        ? 'bg-yellow-50 border-yellow-200'
                                        : (comment.created_by_details.id === ticket.created_by ? 'bg-white rounded-tl-none border-slate-200' : 'bg-emerald-50 rounded-tl-none border-emerald-100')
                                        }`}>
                                        {comment.content}
                                    </div>

                                    {comment.attachments && comment.attachments.length > 0 && (
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {comment.attachments.map(att => (
                                                <a key={att.id} href={att.file} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-white px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition-colors">
                                                    <Paperclip size={14} />
                                                    {att.file_name}
                                                </a>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                        <div ref={commentsEndRef} />
                    </div>

                    {/* REPLY INPUT */}
                    <div className="p-4 bg-white border-t border-slate-200">
                        <form onSubmit={handleSubmitComment} className="max-w-4xl mx-auto">
                            <div className="flex items-center gap-4 mb-3">
                                <div className="flex bg-slate-100 p-1 rounded-lg">
                                    <button
                                        type="button"
                                        onClick={() => setIsInternal(false)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${!isInternal ? 'bg-white shadow text-indigo-600' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Reply to Customer
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setIsInternal(true)}
                                        className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${isInternal ? 'bg-yellow-100 text-yellow-700 shadow' : 'text-slate-500 hover:text-slate-700'}`}
                                    >
                                        Internal Note
                                    </button>
                                </div>
                            </div>

                            <div className={`relative rounded-xl border transition-colors ${isInternal ? 'border-yellow-300 bg-yellow-50' : 'border-indigo-200 bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50'}`}>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder={isInternal ? "Add an internal note (visible only to team)..." : "Write a reply..."}
                                    className="w-full bg-transparent p-4 min-h-[100px] outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-y"
                                />
                                <div className="flex items-center justify-between p-2 border-t border-slate-200/50">
                                    <div className="flex items-center gap-2">
                                        <button
                                            type="button"
                                            onClick={() => fileInputRef.current?.click()}
                                            className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <Paperclip size={18} />
                                        </button>
                                        <input
                                            type="file"
                                            multiple
                                            className="hidden"
                                            ref={fileInputRef}
                                            onChange={(e) => setFiles(e.target.files)}
                                        />
                                        {files.length > 0 && <span className="text-xs font-bold text-indigo-600">{files.length} file(s)</span>}
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submitting || (!comment.trim() && files.length === 0)}
                                        className={`flex items-center gap-2 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest text-white transition-all ${isInternal
                                            ? 'bg-yellow-500 hover:bg-yellow-600 shadow-yellow-200'
                                            : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-200'
                                            } shadow-lg active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                                    >
                                        {submitting ? 'Sending...' : 'Send'}
                                        <Send size={14} />
                                    </button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                {/* RIGHT SIDEBAR - TICKET INFO */}
                <div className="w-80 bg-white border-l border-slate-200 p-6 overflow-y-auto hidden xl:block">
                    <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Ticket Details</h3>

                    <div className="space-y-6">
                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Requester</label>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-indigo-50 border border-indigo-100">
                                    <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${ticket.created_by_details.email}`} alt="" />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{ticket.created_by_details.username}</p>
                                    <p className="text-xs text-slate-400">{ticket.created_by_details.email}</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Category</label>
                            <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100">
                                {ticket.category_display}
                            </div>
                        </div>

                        <div>
                            <label className="text-xs font-bold text-slate-500 block mb-1">Assignee</label>
                            <div className="text-sm font-medium text-slate-700 bg-slate-50 px-3 py-2 rounded-lg border border-slate-100 flex items-center gap-2">
                                <div className="w-5 h-5 rounded-full bg-indigo-200"></div>
                                {ticket.assigned_to_details ? ticket.assigned_to_details.username : 'Unassigned'}
                            </div>
                        </div>

                        <div className="pt-6 border-t border-slate-100">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Created</span>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{new Date(ticket.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <span className="text-[10px] font-bold text-slate-400 uppercase">Last Activity</span>
                                    <p className="text-xs font-bold text-slate-700 mt-0.5">{new Date(ticket.updated_at).toLocaleDateString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TicketDetail;
