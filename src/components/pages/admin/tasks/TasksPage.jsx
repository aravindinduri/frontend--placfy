import React, { useState, useEffect } from 'react';
import {
    CheckSquare, Search, Filter, Plus, Clock,
    AlertCircle, CheckCircle, MoreHorizontal, Calendar,
    User, ArrowRight, Trash2, Edit, CornerUpRight, UserX,
    BarChart3, Loader2 as LucideLoader
} from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import CreateTaskModal from './CreateTaskModal';
import TransferTaskModal from './TransferTaskModal';
import TaskTrackingPage from './TaskTrackingPage';

const TasksPage = () => {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState('all');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [workspaceSlug, setWorkspaceSlug] = useState(null);

    const [taskToEdit, setTaskToEdit] = useState(null);
    const [taskToTransfer, setTaskToTransfer] = useState(null);
    const [trackingTaskId, setTrackingTaskId] = useState(null);
    const [activeMenuId, setActiveMenuId] = useState(null);

    // Close menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (activeMenuId && !event.target.closest('.task-menu-container')) {
                setActiveMenuId(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [activeMenuId]);

    useEffect(() => {
        fetchWorkspaceAndTasks();
    }, [filterStatus]);

    const fetchWorkspaceAndTasks = async () => {
        try {
            setLoading(true);
            const token = getSessionToken() || getStoredToken();

            // 1. Get Workspace
            let slug = workspaceSlug;
            if (!slug) {
                const storedWs = localStorage.getItem('currentWorkspace');
                if (storedWs) {
                    const wsData = JSON.parse(storedWs);
                    slug = wsData.slug;
                    setWorkspaceSlug(slug);
                } else {
                    // Fallback to fetch first workspace
                    const wsResponse = await fetch(`http://localhost:8000/api/v1/workspaces/`, {
                        headers: { 'Authorization': `Bearer ${token}` }
                    });
                    if (wsResponse.ok) {
                        const workspaces = await wsResponse.json();
                        if (workspaces.length > 0) slug = workspaces[0].slug;
                    }
                }
            }

            if (!slug) return;

            // 2. Fetch Tasks
            let url = `http://localhost:8000/api/v1/workspaces/${slug}/tasks/`;
            if (filterStatus !== 'all') {
                url += `?status=${filterStatus}`;
            }

            const response = await fetch(url, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(Array.isArray(data) ? data : data.results || []);
            }
        } catch (error) {
            console.error("Failed to fetch tasks", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTaskCreated = (newTask) => {
        // Optimistically add/update list
        setTasks(prev => {
            const index = prev.findIndex(t => t.id === newTask.id);
            if (index !== -1) {
                const updated = [...prev];
                updated[index] = newTask;
                return updated;
            }
            return [newTask, ...prev];
        });
        setShowCreateModal(false);
        setTaskToEdit(null);
        fetchWorkspaceAndTasks();
    };

    const handleDelete = async (taskId) => {
        if (!window.confirm("Are you sure you want to delete this task?")) return;

        try {
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(`http://localhost:8000/api/v1/workspaces/${workspaceSlug}/tasks/${taskId}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                setTasks(prev => prev.filter(t => t.id !== taskId));
            } else {
                alert("Failed to delete task.");
            }
        } catch (err) {
            console.error(err);
        }
        setActiveMenuId(null);
    };

    const handleUnassign = async (taskId) => {
        if (!window.confirm("Are you sure you want to un-assign this member?")) return;

        try {
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(`http://localhost:8000/api/v1/workspaces/${workspaceSlug}/tasks/${taskId}/unassign/`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
                body: JSON.stringify({})
            });

            if (response.ok) {
                fetchWorkspaceAndTasks();
            } else {
                alert("Failed to un-assign task.");
            }
        } catch (err) {
            console.error(err);
        }
        setActiveMenuId(null);
    };

    // Actions
    const openEdit = (task) => {
        setTaskToEdit(task);
        setShowCreateModal(true);
        setActiveMenuId(null);
    };

    const openTransfer = (task) => {
        setTaskToTransfer(task);
        setActiveMenuId(null);
    };

    const openTracking = (task) => {
        setTrackingTaskId(task.id);
        setActiveMenuId(null);
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'urgent': return 'text-red-600 bg-red-50 border-red-100';
            case 'high': return 'text-orange-600 bg-orange-50 border-orange-100';
            case 'medium': return 'text-amber-600 bg-amber-50 border-amber-100';
            case 'low': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
            default: return 'text-slate-600 bg-slate-50 border-slate-100';
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'completed': return 'text-emerald-600 bg-emerald-50';
            case 'in_progress': return 'text-indigo-600 bg-indigo-50';
            case 'pending': return 'text-amber-600 bg-amber-50';
            case 'cancelled': return 'text-slate-500 bg-slate-50';
            default: return 'text-slate-500 bg-slate-50';
        }
    };

    // Derived Stats
    const totalTasks = tasks.length;
    const pendingTasks = tasks.filter(t => t.status === 'pending').length;
    const completedTasks = tasks.filter(t => t.status === 'completed').length;
    const inProgressTasks = tasks.filter(t => t.status === 'in_progress').length;

    if (trackingTaskId) {
        return (
            <TaskTrackingPage
                taskId={trackingTaskId}
                onBack={() => setTrackingTaskId(null)}
                workspaceSlug={workspaceSlug}
            />
        );
    }

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* HEADER */}
            <div className="flex items-center justify-between py-6 shrink-0">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Task Board</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Manage and assign tasks to your team</p>
                </div>
                <button
                    onClick={() => { setTaskToEdit(null); setShowCreateModal(true); }}
                    className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg shadow-indigo-100 transition-all active:scale-95"
                >
                    <Plus size={18} />
                    New Task
                </button>
            </div>

            {/* STATS ROW */}
            <div className="grid grid-cols-4 gap-4 mb-8 shrink-0">
                <StatCard label="Total Tasks" value={totalTasks} icon={<CheckSquare size={18} />} color="text-indigo-600" bg="bg-indigo-50" />
                <StatCard label="Pending" value={pendingTasks} icon={<Clock size={18} />} color="text-amber-600" bg="bg-amber-50" />
                <StatCard label="In Progress" value={inProgressTasks} icon={<LucideLoader size={18} />} color="text-sky-600" bg="bg-sky-50" />
                <StatCard label="Completed" value={completedTasks} icon={<CheckCircle size={18} />} color="text-emerald-600" bg="bg-emerald-50" />
            </div>

            {/* FILTERS & SEARCH */}
            <div className="flex items-center justify-between mb-6 shrink-0">
                <div className="flex items-center bg-slate-100/50 p-1 rounded-xl">
                    {['all', 'pending', 'in_progress', 'completed'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${filterStatus === status
                                ? 'bg-white text-indigo-600 shadow-sm scale-105'
                                : 'text-slate-400 hover:text-slate-600'
                                }`}
                        >
                            {status.replace('_', ' ')}
                        </button>
                    ))}
                </div>
                <div className="relative group">
                    <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search tasks..."
                        className="pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 transition-all w-64"
                    />
                </div>
            </div>

            {/* TASK LIST - GRID LAYOUT */}
            {loading ? (
                <div className="flex-1 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                </div>
            ) : tasks.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-100 rounded-[2.5rem] bg-slate-50/50">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm mb-4">
                        <CheckSquare size={32} className="text-slate-300" />
                    </div>
                    <h3 className="text-lg font-black text-slate-800">No tasks found</h3>
                    <p className="text-slate-400 text-sm font-bold mt-1 max-w-xs text-center">
                        There are no tasks with this status. Create a new task to get started.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto pr-2 pb-6 scrollbar-hide">
                    {tasks.map(task => (
                        <div key={task.id} className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-all group flex flex-col relative">
                            <div className="flex justify-between items-start mb-4">
                                <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getPriorityColor(task.priority)}`}>
                                    {task.priority || 'Normal'}
                                </span>

                                <div className="relative task-menu-container">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); setActiveMenuId(activeMenuId === task.id ? null : task.id); }}
                                        className="text-slate-300 hover:text-indigo-600 transition-colors p-1 rounded-lg hover:bg-slate-50"
                                    >
                                        <MoreHorizontal size={18} />
                                    </button>

                                    {/* DROPDOWN MENU */}
                                    {activeMenuId === task.id && (
                                        <div className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-xl border border-slate-100 z-10 overflow-hidden animate-in fade-in slide-in-from-top-2">
                                            <button onClick={() => openTracking(task)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                                                <BarChart3 size={14} /> Track
                                            </button>
                                            <button onClick={() => openEdit(task)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                                                <Edit size={14} /> Edit
                                            </button>
                                            <button onClick={() => openTransfer(task)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 flex items-center gap-2 transition-colors">
                                                <CornerUpRight size={14} /> Transfer
                                            </button>
                                            <button onClick={() => handleUnassign(task.id)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-600 hover:bg-orange-50 hover:text-orange-600 flex items-center gap-2 transition-colors">
                                                <UserX size={14} /> Un-assign
                                            </button>
                                            <div className="h-px bg-slate-50 my-1"></div>
                                            <button onClick={() => handleDelete(task.id)} className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-500 hover:bg-red-50 flex items-center gap-2 transition-colors">
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <h3 className="font-bold text-slate-800 text-lg leading-tight mb-2 line-clamp-2" title={task.title}>
                                {task.title}
                            </h3>


                            <div className="mt-auto pt-4 border-t border-slate-50 flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-slate-100 border-2 border-white shadow-sm flex items-center justify-center text-slate-400 font-bold text-xs overflow-hidden">
                                        {task.assigned_to_name && task.assigned_to_name !== 'Unassigned' ? (
                                            <img
                                                src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.assigned_to_name}`}
                                                alt="avatar"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <User size={14} />
                                        )}
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">Assigned To</span>
                                        <span className="text-xs font-bold text-slate-700 truncate max-w-[100px]">
                                            {task.assigned_to_name || 'Unassigned'}
                                        </span>
                                    </div>
                                </div>

                                <div className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wide ${getStatusColor(task.status)}`}>
                                    {task.status?.replace('_', ' ')}
                                </div>
                            </div>

                            {task.due_date && (
                                <div className="mt-4 flex items-center gap-2 text-xs font-bold text-slate-400">
                                    <Calendar size={14} className="text-indigo-400" />
                                    {new Date(task.due_date).toLocaleDateString()}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* MODALS */}
            <CreateTaskModal
                isOpen={showCreateModal}
                onClose={() => setShowCreateModal(false)}
                onTaskCreated={handleTaskCreated}
                taskToEdit={taskToEdit}
            />

            {taskToTransfer && (
                <TransferTaskModal
                    isOpen={!!taskToTransfer}
                    onClose={() => setTaskToTransfer(null)}
                    task={taskToTransfer}
                    onTaskTransferred={() => { fetchWorkspaceAndTasks(); setTaskToTransfer(null); }}
                />
            )}
        </div>
    );
};

const StatCard = ({ label, value, icon, color, bg }) => (
    <div className="bg-white p-5 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${bg} ${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
            <p className="text-2xl font-black text-slate-800 leading-none mt-1">{value}</p>
        </div>
    </div>
);

export default TasksPage;
