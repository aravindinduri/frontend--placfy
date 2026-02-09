import React, { useState, useEffect, useRef } from 'react';
import {
    Clock, MessageSquare, Paperclip, CheckCircle,
    AlertCircle, User, ArrowLeft, Send, Download,
    Play, Pause, Calendar, BarChart3, MoreHorizontal
} from 'lucide-react';
import { getStoredToken, getSessionToken } from "../../../utils/authToken";

const HrTaskTrackingPage = ({ taskId, onBack, workspaceSlug }) => {
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('comments');
    const [comment, setComment] = useState("");
    const [files, setFiles] = useState([]);
    const [submitting, setSubmitting] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [runningTimer, setRunningTimer] = useState(null);
    const [timerLoading, setTimerLoading] = useState(false);
    const [progressValue, setProgressValue] = useState(0);
    const [updatingProgress, setUpdatingProgress] = useState(false);

    const fileInputRef = useRef(null);
    const commentsEndRef = useRef(null);

    useEffect(() => {
        if (taskId && workspaceSlug) {
            fetchTaskDetails();
            fetchCurrentUser();
        }
    }, [taskId, workspaceSlug]);

    useEffect(() => {
        if (task) {
            scrollToBottom();
            setProgressValue(task.current_progress || 0);
            // Check for running timer
            const activeTimer = task.time_entries?.find(entry => !entry.end_time);
            setRunningTimer(activeTimer || null);
        }
    }, [task?.comments, task?.conversations, activeTab, task?.current_progress, task?.time_entries]);

    const scrollToBottom = () => {
        commentsEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const fetchCurrentUser = async () => {
        try {
            const token = getSessionToken() || getStoredToken();
            if (!token) return;
            const response = await fetch("http://localhost:8000/api/v1/profile/account_settings/", {
                headers: { "Authorization": `Bearer ${token}` }
            });
            if (response.ok) {
                const data = await response.json();
                setCurrentUser(data);
            }
        } catch (error) {
            console.error('Error fetching user:', error);
        }
    };

    const fetchTaskDetails = async () => {
        try {
            setLoading(true);
            const token = getSessionToken() || getStoredToken();
            if (!workspaceSlug) return;

            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/`,
                { headers: { 'Authorization': `Bearer ${token}` } }
            );

            if (response.ok) {
                const data = await response.json();
                setTask(data);
            }
        } catch (error) {
            console.error('Error fetching task:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!comment.trim() && files.length === 0) return;

        try {
            setSubmitting(true);
            const token = getSessionToken() || getStoredToken();
            let endpoint = '';
            let payload = {};

            if (activeTab === 'comments') {
                endpoint = `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/comments/`;
                payload = { content: comment };
            } else {
                endpoint = `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/conversations/`;
                const receiverId = task.created_by;

                if (!receiverId) {
                    alert("Cannot send private message.");
                    return;
                }
                payload = {
                    message: comment,
                    receiver_id: typeof receiverId === 'object' ? receiverId.id : receiverId
                };
            }

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            if (response.ok) {
                if (activeTab === 'comments' && files.length > 0) {
                    await Promise.all(Array.from(files).map(async (file) => {
                        const formData = new FormData();
                        formData.append('file', file);

                        await fetch(
                            `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/attachments/`,
                            {
                                method: 'POST',
                                headers: { 'Authorization': `Bearer ${token}` },
                                body: formData,
                            }
                        );
                    }));
                }

                setComment("");
                setFiles([]);
                fetchTaskDetails();
            }
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleStatusUpdate = async (newStatus) => {
        try {
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/update-status/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ status: newStatus }),
                }
            );

            if (response.ok) {
                fetchTaskDetails();
            }
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleStartTimer = async () => {
        try {
            setTimerLoading(true);
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/time-entries/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        start_time: new Date().toISOString(),
                        description: ''
                    }),
                }
            );

            if (response.ok) {
                fetchTaskDetails();
            }
        } catch (error) {
            console.error('Error starting timer:', error);
        } finally {
            setTimerLoading(false);
        }
    };

    const handleStopTimer = async () => {
        if (!runningTimer) return;
        try {
            setTimerLoading(true);
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/time-entries/${runningTimer.id}/stop/`,
                {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                }
            );

            if (response.ok) {
                setRunningTimer(null);
                fetchTaskDetails();
            }
        } catch (error) {
            console.error('Error stopping timer:', error);
        } finally {
            setTimerLoading(false);
        }
    };

    const handleProgressUpdate = async () => {
        try {
            setUpdatingProgress(true);
            const token = getSessionToken() || getStoredToken();
            const response = await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/my-tasks/${taskId}/progress/`,
                {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        percentage: progressValue,  // Changed from progress_percentage
                        note: `Progress updated to ${progressValue}%`  // Changed from notes
                    }),
                }
            );

            if (response.ok) {
                fetchTaskDetails();
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        } finally {
            setUpdatingProgress(false);
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center h-full">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
        </div>
    );

    if (!task) return <div className="p-8 text-center text-red-500">Task not found</div>;

    // Group messages by consecutive author and time proximity
    const groupMessages = (messages, type) => {
        if (!messages || messages.length === 0) return [];

        const groups = [];
        let currentGroup = {
            author: null,
            isMe: false,
            messages: []
        };

        messages.forEach((msg, index) => {
            const authorId = type === 'comment' ? msg.author : msg.sender;
            const isMe = currentUser && (authorId === currentUser.id);
            const msgTime = new Date(type === 'comment' ? msg.created_at : msg.sent_at);

            // Check if this message belongs to current group
            const isSameAuthor = currentGroup.author === authorId;
            let withinTimeThreshold = false;

            if (currentGroup.messages.length > 0) {
                const lastMsg = currentGroup.messages[currentGroup.messages.length - 1];
                const lastMsgTime = new Date(type === 'comment' ? lastMsg.created_at : lastMsg.sent_at);
                const timeDiffMinutes = (msgTime - lastMsgTime) / (1000 * 60);
                withinTimeThreshold = timeDiffMinutes <= 5; // 5 minute threshold
            }

            if (isSameAuthor && withinTimeThreshold && currentGroup.messages.length > 0) {
                // Add to current group
                currentGroup.messages.push(msg);
            } else {
                // Save previous group if exists
                if (currentGroup.messages.length > 0) {
                    groups.push({ ...currentGroup });
                }
                // Start new group
                currentGroup = {
                    author: authorId,
                    isMe,
                    messages: [msg]
                };
            }
        });

        // Push last group
        if (currentGroup.messages.length > 0) {
            groups.push(currentGroup);
        }

        return groups;
    };

    const MessageGroup = ({ group, type }) => {
        const firstMsg = group.messages[0];
        const authorName = type === 'comment'
            ? (firstMsg.author_name || 'Unknown')
            : (firstMsg.sender_name || 'Unknown');

        const lastMsg = group.messages[group.messages.length - 1];

        return (
            <div className={`flex gap-3 ${group.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {/* Avatar - aligned to bottom */}
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white self-end mb-1 ${group.isMe
                        ? 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                        : 'bg-gradient-to-br from-slate-400 to-slate-500'
                    }`}>
                    {authorName.charAt(0).toUpperCase()}
                </div>

                <div className={`flex flex-col max-w-[70%] ${group.isMe ? 'items-end' : 'items-start'}`}>
                    {/* Header: Name + Time */}
                    <div className={`flex items-center gap-2 mb-1 px-1 ${group.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                        <span className="text-xs font-bold text-slate-700">{authorName}</span>
                        <span className="text-[10px] text-slate-400">
                            {new Date(type === 'comment' ? firstMsg.created_at : firstMsg.sent_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    </div>

                    {/* Tightly stacked messages */}
                    <div className={`flex flex-col w-full ${group.isMe ? 'items-end' : 'items-start'}`}>
                        {group.messages.map((msg, idx) => {
                            const content = type === 'comment' ? msg.content : msg.message;
                            const isFirst = idx === 0;
                            const isLast = idx === group.messages.length - 1;
                            const isSingle = group.messages.length === 1;

                            // Border radius logic for "merged" look
                            let roundedClass = 'rounded-2xl';
                            if (!isSingle) {
                                if (group.isMe) {
                                    if (isFirst) roundedClass = 'rounded-2xl rounded-br-sm';
                                    else if (isLast) roundedClass = 'rounded-2xl rounded-tr-sm';
                                    else roundedClass = 'rounded-2xl rounded-tr-sm rounded-br-sm';
                                } else {
                                    if (isFirst) roundedClass = 'rounded-2xl rounded-bl-sm';
                                    else if (isLast) roundedClass = 'rounded-2xl rounded-tl-sm';
                                    else roundedClass = 'rounded-2xl rounded-tl-sm rounded-bl-sm';
                                }
                            }

                            return (
                                <div
                                    key={msg.id}
                                    className={`px-4 py-2 text-sm break-words mb-0.5 max-w-full ${group.isMe
                                            ? 'bg-indigo-600 text-white'
                                            : 'bg-white border border-slate-200 text-slate-700'
                                        } ${roundedClass}`}
                                >
                                    {content}
                                </div>
                            );
                        })}
                    </div>

                    {/* Footer: Time of last message if multiple */}
                    {group.messages.length > 1 && (
                        <span className={`text-[9px] text-slate-400 mt-0.5 px-1 ${group.isMe ? 'text-right' : 'text-left'}`}>
                            {new Date(type === 'comment' ? lastMsg.created_at : lastMsg.sent_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </span>
                    )}
                </div>
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full relative px-6 pb-6">
            <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 h-full flex flex-col overflow-hidden">
                {/* HEADER */}
                <div className="px-8 py-5 border-b border-slate-100 flex items-center justify-between shrink-0 bg-white/50 backdrop-blur-sm">
                    <div className="flex items-center gap-4">
                        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
                            <ArrowLeft size={20} className="text-slate-600" />
                        </button>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${task.priority === 'urgent' ? 'bg-red-100 text-red-700' :
                                    task.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                    {task.priority}
                                </span>
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${task.status === 'completed' ? 'bg-emerald-100 text-emerald-700' :
                                    task.status === 'in_progress' ? 'bg-indigo-100 text-indigo-700' :
                                        'bg-slate-100 text-slate-700'
                                    }`}>
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800">{task.title}</h2>
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        {/* STATUS UPDATE DROPDOWN */}
                        <select
                            value={task.status}
                            onChange={(e) => handleStatusUpdate(e.target.value)}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider border-2 outline-none cursor-pointer transition-all bg-white border-slate-200 text-slate-700 hover:border-indigo-300"
                        >
                            <option value="in_progress">In Progress</option>
                            <option value="completed">Completed</option>
                        </select>

                        <div className="flex items-center gap-2 px-4 py-2 bg-indigo-50 rounded-xl border border-indigo-100">
                            <Clock size={16} className="text-indigo-600" />
                            <div className="flex flex-col">
                                <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-wider leading-none">Total Time</span>
                                <span className="text-sm font-black text-indigo-700 leading-none mt-1">
                                    {task.total_time_spent?.display || '0m'}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 flex overflow-hidden">
                    {/* MAIN CHAT AREA */}
                    <div className="flex-1 flex flex-col min-w-0">
                        {/* TABS */}
                        <div className="flex border-b border-slate-100 bg-slate-50/30">
                            <button
                                onClick={() => setActiveTab('comments')}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'comments'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                <MessageSquare size={14} /> Comments ({task.comments?.length || 0})
                            </button>
                            <button
                                onClick={() => setActiveTab('messages')}
                                className={`flex-1 py-3 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all ${activeTab === 'messages'
                                    ? 'text-indigo-600 border-b-2 border-indigo-600 bg-white'
                                    : 'text-slate-400 hover:text-slate-600 hover:bg-white/50'
                                    }`}
                            >
                                <User size={14} /> Messages with Admin ({task.conversations?.length || 0})
                            </button>
                        </div>

                        {/* MESSAGES AREA */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-6">
                            <div className="relative flex py-4 items-center">
                                <div className="flex-grow border-t border-slate-200"></div>
                                <span className="flex-shrink-0 mx-4 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Conversation Started</span>
                                <div className="flex-grow border-t border-slate-200"></div>
                            </div>

                            <div className="flex flex-col gap-6">
                                {activeTab === 'comments' ? (
                                    task.comments?.length > 0 ? (
                                        groupMessages(task.comments, 'comment').map((group, idx) => (
                                            <MessageGroup key={idx} group={group} type="comment" />
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400 text-sm font-medium">No comments yet. Start the conversation!</div>
                                    )
                                ) : (
                                    task.conversations?.length > 0 ? (
                                        groupMessages(task.conversations, 'conversation').map((group, idx) => (
                                            <MessageGroup key={idx} group={group} type="conversation" />
                                        ))
                                    ) : (
                                        <div className="text-center py-10 text-slate-400 text-sm font-medium">No messages yet.</div>
                                    )
                                )}
                            </div>
                            <div ref={commentsEndRef} />
                        </div>

                        {/* REPLY INPUT */}
                        <div className="p-4 bg-white border-t border-slate-200">
                            <form onSubmit={handleSendMessage} className="max-w-4xl mx-auto">
                                <div className="relative rounded-[2rem] border border-indigo-200 bg-white focus-within:border-indigo-400 focus-within:ring-4 focus-within:ring-indigo-50 transition-all">
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        placeholder={`Type a ${activeTab === 'comments' ? 'comment' : 'message'}...`}
                                        className="w-full bg-transparent p-4 min-h-[100px] outline-none text-sm text-slate-700 placeholder:text-slate-400 resize-y rounded-[2rem]"
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
                                            className="flex items-center gap-2 px-6 py-2 rounded-lg font-black text-xs uppercase tracking-widest bg-gradient-to-r from-indigo-600 to-indigo-700 text-white hover:from-indigo-700 hover:to-indigo-800 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {submitting ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send size={16} />}
                                            {submitting ? 'Sending...' : 'Send'}
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>

                    {/* RIGHT SIDEBAR - INFO */}
                    <div className="w-80 bg-slate-50 border-l border-slate-200 overflow-y-auto p-6 space-y-6">
                        {/* ASSIGNED BY CARD */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Assigned By</h3>
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-indigo-600 font-bold overflow-hidden border-2 border-white shadow-sm">
                                    {task.created_by_details?.full_name ? (
                                        <img src={`https://api.dicebear.com/7.x/initials/svg?seed=${task.created_by_details.full_name}`} className="w-full h-full object-cover" alt="avatar" />
                                    ) : <User size={20} />}
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-slate-800">{task.created_by_details?.full_name || 'Unknown'}</p>
                                    <p className="text-xs text-slate-500">{task.created_by_details?.email}</p>
                                </div>
                            </div>
                        </div>

                        {/* PROGRESS CONTROL */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center justify-between">
                                Update Progress
                                <span className="text-indigo-600 font-black text-lg">{progressValue}%</span>
                            </h3>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={progressValue}
                                onChange={(e) => setProgressValue(parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-full appearance-none cursor-pointer mb-4"
                                style={{
                                    background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${progressValue}%, #e2e8f0 ${progressValue}%, #e2e8f0 100%)`
                                }}
                            />
                            <button
                                onClick={handleProgressUpdate}
                                disabled={updatingProgress || progressValue === task.current_progress}
                                className="w-full py-2 px-4 bg-gradient-to-r from-indigo-600 to-indigo-700 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:from-indigo-700 hover:to-indigo-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {updatingProgress ? 'Updating...' : 'Update Progress'}
                            </button>
                        </div>

                        {/* TIME TRACKING CONTROL */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Clock size={12} /> Time Tracking
                            </h3>
                            {runningTimer ? (
                                <div className="space-y-3">
                                    <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-100">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-xs font-bold text-emerald-700">Timer Running</span>
                                            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
                                        </div>
                                        <p className="text-[10px] text-emerald-600">
                                            Started: {new Date(runningTimer.start_time).toLocaleTimeString()}
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleStopTimer}
                                        disabled={timerLoading}
                                        className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-red-600 to-red-700 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:from-red-700 hover:to-red-800 transition-all disabled:opacity-50"
                                    >
                                        <Pause size={14} />
                                        {timerLoading ? 'Stopping...' : 'Stop Timer'}
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={handleStartTimer}
                                    disabled={timerLoading}
                                    className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-gradient-to-r from-emerald-600 to-emerald-700 text-white text-xs font-black uppercase tracking-wider rounded-lg hover:from-emerald-700 hover:to-emerald-800 transition-all disabled:opacity-50"
                                >
                                    <Play size={14} />
                                    {timerLoading ? 'Starting...' : 'Start Timer'}
                                </button>
                            )}
                        </div>

                        {/* TIME ENTRIES */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Clock size={12} /> Recent Time Entries
                            </h3>
                            <div className="space-y-2">
                                {task.time_entries?.length > 0 ? (
                                    task.time_entries.slice(0, 5).map(entry => (
                                        <div key={entry.id} className="bg-slate-50 p-3 rounded-xl text-xs border border-slate-100">
                                            <div className="flex justify-between font-bold text-slate-700 mb-1">
                                                <span>{entry.user_name}</span>
                                                <span className="text-indigo-600">{entry.duration_display}</span>
                                            </div>
                                            <div className="text-slate-400 text-[10px]">
                                                {new Date(entry.start_time).toLocaleDateString()}
                                            </div>
                                            {entry.description && (
                                                <p className="mt-1 text-slate-500 italic border-l-2 border-indigo-200 pl-2">"{entry.description}"</p>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No time recorded yet.</p>
                                )}
                            </div>
                        </div>

                        {/* ATTACHMENTS */}
                        <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                                <Paperclip size={12} /> Attachments
                            </h3>
                            <div className="space-y-2">
                                {task.attachments?.length > 0 ? (
                                    task.attachments.map(att => (
                                        <a
                                            key={att.id}
                                            href={att.file_url || att.file}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-100 rounded-xl hover:border-indigo-200 hover:shadow-sm transition-all group"
                                        >
                                            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                <Download size={14} />
                                            </div>
                                            <div className="overflow-hidden">
                                                <p className="text-xs font-bold text-slate-700 truncate">{att.filename}</p>
                                                <p className="text-[10px] text-slate-400">{new Date(att.uploaded_at).toLocaleDateString()}</p>
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <p className="text-xs text-slate-400 italic">No attachments.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HrTaskTrackingPage;
