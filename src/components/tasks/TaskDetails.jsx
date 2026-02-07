import { useState, useEffect } from 'react';
import { getTaskDetails, addComment, updateProgress, uploadAttachment, deleteTask, unassignTask, transferTask } from '../../api/tasks';
import UpdateProgress from './UpdateProgress'; // Assuming you create this based on guide
import AddComment from './AddComment'; // Assuming you create this based on guide
import TransferTask from './TransferTask'; // Assuming you create this based on guide

function TaskDetails({ workspaceSlug, taskId }) {
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshKey, setRefreshKey] = useState(0); // To force re-fetch after action

  const fetchTask = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getTaskDetails(workspaceSlug, taskId);
      setTask(data);
    } catch (error) {
      setError('Failed to load task details.');
      console.error('Fetch Task Error:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTask();
  }, [workspaceSlug, taskId, refreshKey]);

  const handleActionSuccess = () => {
    setRefreshKey(prev => prev + 1); // Re-fetch to update UI
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task? This action cannot be undone.')) {
      try {
        await deleteTask(workspaceSlug, taskId);
        alert('Task deleted successfully!');
        setTask(null); // Clear view
        handleActionSuccess(); // Signal parent to refresh list
      } catch (err) {
        console.error('Delete error:', err);
        alert('Failed to delete task.');
      }
    }
  };

  if (loading) return <div className="text-center py-10">Loading task details...</div>;
  if (error) return <div className="p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>;
  if (!task) return <div className="p-4 bg-yellow-100 text-yellow-700 rounded-lg">Task not found or has been deleted.</div>;

  const currentProgress = task.current_progress || 0;

  return (
    <div className="p-6 bg-white rounded-2xl shadow-lg border border-slate-100 space-y-6">
      <div className="flex justify-between items-start border-b pb-3">
        <h1 className="text-2xl font-bold text-slate-900">{task.title}</h1>
        <button 
          onClick={handleDelete} 
          className="text-red-500 hover:text-red-700 p-2 rounded-full hover:bg-red-50 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
        </button>
      </div>

      {/* Metadata */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm">
        <p><strong className="text-slate-600">Status:</strong> <span className={`font-bold capitalize ${task.status === 'completed' ? 'text-green-600' : 'text-blue-600'}`}>{task.status_display}</span></p>
        <p><strong className="text-slate-600">Priority:</strong> <span className={`font-bold capitalize bg-yellow-100 text-yellow-800 px-2 rounded-full`}>{task.priority_display}</span></p>
        <p><strong className="text-slate-600">Category:</strong> {task.category_display}</p>
        <p><strong className="text-slate-600">Assignee:</strong> {task.assigned_to_details?.full_name || 'Unassigned'}</p>
        <p><strong className="text-slate-600">Due:</strong> {task.due_date ? new Date(task.due_date).toLocaleString() : 'N/A'}</p>
        <p><strong className="text-slate-600">Created:</strong> {new Date(task.created_at).toLocaleDateString()}</p>
      </div>

      {/* Description */}
      <div>
        <h3 className="font-semibold text-lg mb-1">Description</h3>
        <p className="text-slate-600 bg-slate-50 p-3 rounded-lg">{task.description || 'No description provided.'}</p>
      </div>

      {/* Progress Control */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-lg mb-2">Progress ({currentProgress}%)</h3>
        <progress value={currentProgress} max="100" className="w-full h-2 rounded-full [&::-webkit-progress-bar]:bg-slate-200 [&::-webkit-progress-value]:bg-green-500" />
        <UpdateProgress 
          workspaceSlug={workspaceSlug} 
          taskId={taskId} 
          currentProgress={currentProgress} 
          onUpdate={handleActionSuccess}
        />
      </div>
      
      {/* Time Spent */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-lg mb-1">Time Spent</h3>
        <p className="text-slate-600">{task.total_time_spent?.display || '0 hours'}</p>
      </div>

      {/* Comment Section */}
      <div className="pt-4 border-t">
        <h3 className="font-semibold text-lg mb-2">Comments ({task.comments?.length || 0})</h3>
        <AddComment
            workspaceSlug={workspaceSlug}
            taskId={taskId}
            onCommentAdded={handleActionSuccess}
        />
        <div className="mt-3 space-y-3 max-h-60 overflow-y-auto">
          {task.comments?.length === 0 ? <p className="text-sm text-slate-500">No comments yet.</p> : 
            task.comments?.slice().reverse().map((comment) => (
              <div key={comment.id} className="bg-slate-50 p-3 rounded-lg border border-slate-100">
                <div className="flex justify-between text-xs mb-1">
                    <strong className="text-slate-700">{comment.author_name}</strong>
                    <span className="text-slate-400">{new Date(comment.created_at).toLocaleTimeString()}</span>
                </div>
                <p className="text-sm text-slate-600">{comment.content}</p>
              </div>
            ))}
        </div>
      </div>

      {/* Transfer / Unassign */}
      <div className="pt-4 border-t flex gap-4">
        <div className='flex-1'>
            <h3 className="font-semibold text-lg mb-2">Transfer Task</h3>
            <TransferTask 
                workspaceSlug={workspaceSlug} 
                taskId={taskId} 
                onTransfer={handleActionSuccess}
            />
        </div>
        <button
            onClick={() => unassignTask(workspaceSlug, taskId).then(handleActionSuccess)}
            className="mt-auto bg-red-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-600"
            disabled={loading}
        >
            Unassign
        </button>
      </div>

    </div>
  );
}

export default TaskDetails;