import { useState, useEffect } from 'react';
import { listTasks } from '../../api/tasks';

function TaskList({ workspaceSlug, onTaskSelect }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    priority: '',
    search: '',
    ordering: '-created_at',
  });

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const data = await listTasks(workspaceSlug, filters);
        setTasks(data);
      } catch (error) {
        console.error('Failed to fetch tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [workspaceSlug, filters]);

  if (loading) return <div className="text-center py-10">Loading tasks...</div>;

  return (
    <div>
      <div className="filters mb-4 p-3 bg-slate-50 rounded-xl flex gap-3 flex-wrap">
        <input
          type="text"
          placeholder="Search tasks..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="border p-2 rounded-lg flex-1 min-w-[150px]"
        />

        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="border p-2 rounded-lg text-sm"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
          <option value="cancelled">Cancelled</option>
        </select>

        <select
          value={filters.priority}
          onChange={(e) => setFilters({ ...filters, priority: e.target.value })}
          className="border p-2 rounded-lg text-sm"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>
      </div>

      <div className="task-list space-y-3">
        {tasks.length === 0 ? (
          <p className="text-center py-8 text-slate-500">No tasks found matching your criteria.</p>
        ) : (
          tasks.map((task) => (
            <div 
              key={task.id} 
              onClick={() => onTaskSelect(task.id)}
              className="task-card bg-white p-4 rounded-xl border border-slate-100 hover:shadow-md cursor-pointer transition-shadow"
            >
              <h3 className="font-bold text-slate-800">{task.title}</h3>
              <div className="flex flex-wrap gap-2 mt-1 text-xs">
                <span className={`px-2 py-0.5 rounded-full font-semibold capitalize 
                  ${task.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                  {task.status_display}
                </span>
                <span className={`px-2 py-0.5 rounded-full font-semibold capitalize bg-yellow-100 text-yellow-700`}>
                  {task.priority_display}
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-2">
                Assigned to: {task.assigned_to_name || 'Unassigned'}
              </p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default TaskList;