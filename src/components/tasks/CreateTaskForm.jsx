import { useState } from 'react';
import { createTask } from '../../api/tasks';
import AssigneeDropdown from './AssigneeDropdown';

function CreateTaskForm({ workspaceSlug, onSuccess }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assigned_to_id: '',
    priority: 'medium',
    category: 'general',
    due_date: '',
    tags: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        assigned_to_id: formData.assigned_to_id 
          ? parseInt(formData.assigned_to_id) 
          : null,
      };

      const task = await createTask(workspaceSlug, payload);
      onSuccess(task);
      
      setFormData({
        title: '',
        description: '',
        assigned_to_id: '',
        priority: 'medium',
        category: 'general',
        due_date: '',
        tags: '',
      });
    } catch (err) {
      // Use a simple error display based on guide's pattern
      setError(err.response?.data || 'Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  const getErrorDisplay = (field) => {
    if (!error || typeof error !== 'object') return null;
    return error[field] ? error[field][0] : null; // Assuming backend returns arrays for errors
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded-xl bg-white shadow-md">
      {/* Simplified fields for brevity, matching guide */}
      <div>
        <label className="block text-sm font-medium">Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
          className="w-full rounded-lg border border-slate-300 p-2"
        />
        {getErrorDisplay('title') && <p className="text-red-500 text-xs mt-1">{getErrorDisplay('title')}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={3}
          className="w-full rounded-lg border border-slate-300 p-2"
        />
      </div>

      <div>
        <label className="block text-sm font-medium">Assign To</label>
        <AssigneeDropdown
          workspaceSlug={workspaceSlug}
          value={formData.assigned_to_id}
          onChange={(value) => setFormData({ ...formData, assigned_to_id: value })}
        />
      </div>
      
      {/* Remaining fields (Priority, Category, Due Date, Tags) follow similar pattern */}

      {error && !(typeof error === 'object') && (
        <div className="p-2 bg-red-100 text-red-700 rounded-lg text-sm">
          {JSON.stringify(error)}
        </div>
      )}

      <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded-lg disabled:opacity-50">
        {loading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
}

export default CreateTaskForm;