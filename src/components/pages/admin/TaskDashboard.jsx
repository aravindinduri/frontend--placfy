import { useState } from 'react';
import TaskList from '../../tasks/TaskList';
import CreateTaskForm from '../../tasks/CreateTaskForm';
import TaskDetails from '../../tasks/TaskDetails';
import AdminLayout from './Layout'; 
import { Outlet, Routes, Route } from 'react-router-dom';

const getWorkspaceSlug = () => {
    const ws = localStorage.getItem('currentWorkspace');
    try {
        return ws ? JSON.parse(ws).slug : 'default-slug'; 
    } catch {
        return 'default-slug';
    }
};

function TaskManagementLayout() {
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);
    const workspaceSlug = getWorkspaceSlug();

    const handleTaskCreated = (task) => {
        setShowCreateForm(false);
        setRefreshKey((prev) => prev + 1); 
        setSelectedTaskId(task.id); 
    };
    
    const handleTaskSelect = (id) => {
        setSelectedTaskId(id);
    }

    return (
        <AdminLayout> 
            <div className="p-8 bg-slate-100 min-h-full">
                <header className="mb-6 flex justify-between items-center">
                    <h1 className="text-3xl font-bold text-slate-800">Task Management</h1>
                    <button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-indigo-600 text-white px-6 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-colors shadow-md"
                    >
                        + New Task
                    </button>
                </header>

                {showCreateForm && (
                    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center">
                        <div className="bg-white p-6 rounded-2xl shadow-2xl max-w-lg w-full">
                            <h2 className="font-bold mb-4">Create New Task</h2>
                            <CreateTaskForm
                                workspaceSlug={workspaceSlug}
                                onSuccess={handleTaskCreated}
                            />
                            <button onClick={() => setShowCreateForm(false)} className="mt-4 text-sm text-slate-500">Cancel</button>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-1 bg-white p-6 rounded-2xl shadow-md lg:h-[calc(100vh-200px)] overflow-y-auto">
                        <h2 className="font-bold mb-4 border-b pb-2">Task List</h2>
                        <TaskList
                            key={refreshKey}
                            workspaceSlug={workspaceSlug}
                            onTaskSelect={handleTaskSelect}
                        />
                    </div>
                    <div className="lg:col-span-2">
                        {selectedTaskId ? (
                            <TaskDetails
                                workspaceSlug={workspaceSlug}
                                taskId={selectedTaskId}
                            />
                        ) : (
                            <div className="p-10 bg-white rounded-2xl shadow-md h-full flex items-center justify-center text-slate-500">
                                Select a task from the left or create a new one to see details.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}

export default function AdminTaskRouter() {
    return (
        <Routes>
            <Route path="/" element={<TaskManagementLayout />} />
        </Routes>
    )
}