import React, { useState, useEffect } from 'react';
import { X, User, ArrowRight, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

const TransferTaskModal = ({ isOpen, onClose, task, onTaskTransferred }) => {
    const [members, setMembers] = useState([]);
    const [selectedMemberId, setSelectedMemberId] = useState('');
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (isOpen && task) {
            fetchMembers();
            setSelectedMemberId('');
            setError(null);
        }
    }, [isOpen, task]);

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const token = getSessionToken() || getStoredToken();
            const storedWs = localStorage.getItem('currentWorkspace');
            if (!storedWs) return;

            const { slug } = JSON.parse(storedWs);

            let response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/tasks/members/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/members/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (response.ok) {
                const data = await response.json();
                let membersList = Array.isArray(data) ? data : data.results || [];
                // Filter out current assignee
                if (task && task.assigned_to) {
                    // Handle both object (if expanded) or ID
                    const currentAssigneeId = typeof task.assigned_to === 'object' ? task.assigned_to.id : task.assigned_to;
                    membersList = membersList.filter(m => m.id !== currentAssigneeId);
                }
                setMembers(membersList);
            }
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedMemberId) {
            setError("Please select a member to transfer the task to.");
            return;
        }

        setSubmitting(true);
        setError(null);

        try {
            const token = getSessionToken() || getStoredToken();
            const storedWs = localStorage.getItem('currentWorkspace');
            if (!storedWs) throw new Error("Workspace not found");

            const { slug } = JSON.parse(storedWs); // Removed duplicate declaration

            const response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/tasks/${task.id}/transfer/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ new_assignee_id: selectedMemberId })
            });

            if (response.ok) {
                onTaskTransferred();
                onClose();
            } else {
                const errData = await response.json();
                setError(errData.detail || "Failed to transfer task.");
            }
        } catch (err) {
            console.error("Transfer Error:", err);
            setError(err.message || "An error occurred during transfer.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen || !task) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 flex flex-col">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">Transfer Task</h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <p className="text-sm font-medium text-slate-600">
                        Transferring <span className="font-bold text-slate-800">"{task.title}"</span> to another team member.
                    </p>

                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                            <User size={14} /> New Assignee
                        </label>
                        <div className="relative">
                            <select
                                value={selectedMemberId}
                                onChange={(e) => setSelectedMemberId(e.target.value)}
                                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                            >
                                <option value="">Select a member</option>
                                {members.map(member => (
                                    <option key={member.id} value={member.id}>
                                        {member.full_name || member.username || member.email}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl icon-text text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                            disabled={submitting}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || !selectedMemberId}
                            className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                        >
                            {submitting ? <Loader2 size={16} className="animate-spin" /> : <ArrowRight size={16} />}
                            {submitting ? 'Transferring...' : 'Transfer Task'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TransferTaskModal;
