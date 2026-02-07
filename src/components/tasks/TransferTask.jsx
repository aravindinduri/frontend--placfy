import { useState } from 'react';
import { transferTask } from '../../api/tasks';
import AssigneeDropdown from './AssigneeDropdown'; // Reuse the dropdown component

function TransferTask({ workspaceSlug, taskId, onTransfer }) {
  const [newAssigneeId, setNewAssigneeId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleTransfer = async () => {
    if (!newAssigneeId) return;

    setLoading(true);
    try {
      await transferTask(workspaceSlug, taskId, parseInt(newAssigneeId));
      onTransfer(); // Signal parent to re-fetch task details
      setNewAssigneeId(''); // Clear selection
      alert('Task successfully transferred!');
    } catch (error) {
      console.error('Failed to transfer task:', error);
      alert('Failed to transfer task.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <AssigneeDropdown
        workspaceSlug={workspaceSlug}
        value={newAssigneeId}
        onChange={setNewAssigneeId}
      />
      <button 
        onClick={handleTransfer} 
        disabled={!newAssigneeId || loading}
        className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
      >
        {loading ? 'Transferring...' : 'Transfer Task'}
      </button>
    </div>
  );
}

export default TransferTask;