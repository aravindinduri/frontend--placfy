
import React, { useState, useEffect } from 'react';
import { X, Calendar, User, Tag, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

const CreateTaskModal = ({ isOpen, onClose, onTaskCreated, taskToEdit = null }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        assigned_to_id: '',
        priority: 'medium',
        category: 'general',
        due_date: '',
        tags: '' // Optional text field for tags
    });
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState(null);

    // Fetch members and task details when modal opens
    useEffect(() => {
        if (isOpen) {
            fetchMembers();
            if (taskToEdit) {
                fetchTaskDetails(taskToEdit.id);
            } else {
                // Reset form for create
                setFormData({
                    title: '',
                    description: '',
                    assigned_to_id: '',
                    priority: 'medium',
                    category: 'general',
                    due_date: '',
                    tags: ''
                });
            }
            setError(null);
        }
    }, [isOpen, taskToEdit]);

    const fetchTaskDetails = async (taskId) => {
        try {
            setLoading(true);
            const token = getSessionToken() || getStoredToken();
            const storedWs = localStorage.getItem('currentWorkspace');
            if (!storedWs) return;

            const { slug } = JSON.parse(storedWs);

            const response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/tasks/${taskId}/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const task = await response.json();
                setFormData({
                    title: task.title || '',
                    description: task.description || '',
                    assigned_to_id: task.assigned_to
                        ? (typeof task.assigned_to === 'object' ? task.assigned_to.id : task.assigned_to)
                        : '',
                    priority: task.priority || 'medium',
                    category: task.category || 'general',
                    due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
                    tags: task.tags || ''
                });
            }
        } catch (err) {
            console.error("Failed to fetch task details", err);
        } finally {
            setLoading(false);
        }
    };

    const fetchMembers = async () => {
        try {
            setLoading(true);
            const token = getSessionToken() || getStoredToken();
            const storedWs = localStorage.getItem('currentWorkspace');
            if (!storedWs) return;

            const { slug } = JSON.parse(storedWs);

            // Try fetching members from the task endpoint first (as per viewset)
            // Fallback to standard members endpoint if needed
            let response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/tasks/members/`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                // Fallback to standard members list
                response = await fetch(`http://localhost:8000/api/v1/workspaces/${slug}/members/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
            }

            if (response.ok) {
                const data = await response.json();
                setMembers(Array.isArray(data) ? data : data.results || []);
            }
        } catch (err) {
            console.error("Failed to fetch members", err);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError(null);

        try {
            const token = getSessionToken() || getStoredToken();
            const storedWs = localStorage.getItem('currentWorkspace');
            if (!storedWs) throw new Error("Workspace not found");

            const { slug } = JSON.parse(storedWs);

            const payload = { ...formData };
            if (payload.due_date) {
                payload.due_date = new Date(payload.due_date).toISOString();
            } else {
                delete payload.due_date;
            }

            // Remove empty optional fields
            if (!payload.assigned_to_id) delete payload.assigned_to_id;
            if (!payload.tags) delete payload.tags;

            const url = taskToEdit
                ? `http://localhost:8000/api/v1/workspaces/${slug}/tasks/${taskToEdit.id}/`
                : `http://localhost:8000/api/v1/workspaces/${slug}/tasks/`;

            const method = taskToEdit ? 'PATCH' : 'POST';

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(payload)
            });

            if (response.ok) {
                const resultTask = await response.json();
                onTaskCreated(resultTask); // Callback handles both add and update refresh
                onClose();
            } else {
                const errData = await response.json();
                console.error("Server Error:", errData);
                setError(errData.detail || "Failed to save task. Please check your inputs.");
            }
        } catch (err) {
            console.error("Submission Error:", err);
            setError(err.message || "An error occurred while saving the task.");
        } finally {
            setSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 flex flex-col max-h-[90vh]">
                <div className="flex items-center justify-between p-6 border-b border-slate-100 bg-slate-50/50">
                    <h2 className="text-xl font-black text-slate-800 tracking-tight">
                        {taskToEdit ? 'Edit Task' : 'Create New Task'}
                    </h2>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex-1 space-y-5">
                    {/* Title */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Task Title</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                            placeholder="e.g. Update user documentation"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 placeholder:text-slate-400"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">Description</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            rows="4"
                            placeholder="Add details about the task..."
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-medium text-slate-700 placeholder:text-slate-400 resize-none"
                        ></textarea>
                    </div>

                    <div className="grid grid-cols-2 gap-5">
                        {/* Assignee */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <User size={14} /> Assign To
                            </label>
                            <div className="relative">
                                <select
                                    name="assigned_to_id"
                                    value={formData.assigned_to_id}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="">Unassigned</option>
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

                        {/* Due Date */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Calendar size={14} /> Due Date
                            </label>
                            <input
                                type="datetime-local"
                                name="due_date"
                                value={formData.due_date}
                                onChange={handleChange}
                                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700"
                            />
                        </div>

                        {/* Priority */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <AlertCircle size={14} /> Priority
                            </label>
                            <div className="relative">
                                <select
                                    name="priority"
                                    value={formData.priority}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                    <option value="urgent">Urgent</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* Category */}
                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                                <Tag size={14} /> Category
                            </label>
                            <div className="relative">
                                <select
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all text-sm font-bold text-slate-700 appearance-none cursor-pointer"
                                >
                                    <option value="general">General</option>
                                    <option value="recruitment">Recruitment</option>
                                    <option value="onboarding">Onboarding</option>
                                    <option value="training">Training</option>
                                    <option value="review">Review</option>
                                    <option value="interview">Interview</option>
                                    <option value="documentation">Documentation</option>
                                    <option value="meeting">Meeting</option>
                                    <option value="other">Other</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
                                    <svg width="10" height="6" viewBox="0 0 10 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M1 1L5 5L9 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-red-50 text-red-600 rounded-xl icon-text text-sm font-bold flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
                            <AlertCircle size={16} />
                            {error}
                        </div>
                    )}
                </form>

                <div className="p-6 border-t border-slate-100 bg-slate-50/50 flex justify-end gap-3">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all"
                        disabled={submitting}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={submitting}
                        className="px-6 py-2.5 rounded-xl bg-indigo-600 text-white font-bold text-sm hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 transition-all active:scale-95"
                    >
                        {submitting ? <Loader2 size={16} className="animate-spin" /> : <CheckCircle size={16} />}
                        {submitting ? 'Saving...' : (taskToEdit ? 'Save Changes' : 'Create Task')}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CreateTaskModal;
