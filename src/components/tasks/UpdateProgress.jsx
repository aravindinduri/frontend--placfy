import { useState } from 'react';
import { updateProgress } from '../../api/tasks';

function UpdateProgress({ workspaceSlug, taskId, currentProgress, onUpdate }) {
  const [percentage, setPercentage] = useState(currentProgress);
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure percentage is an integer
      const finalPercentage = parseInt(percentage); 
      await updateProgress(workspaceSlug, taskId, finalPercentage, note);
      onUpdate(); // Signal parent to re-fetch task details
      setNote('');
    } catch (error) {
      console.error('Failed to update progress:', error);
      alert('Failed to update progress. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 pt-2">
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Progress: {percentage}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={percentage}
          onChange={(e) => setPercentage(parseInt(e.target.value))}
          className="h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer range-lg [&::-webkit-slider-thumb]:bg-green-600 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:rounded-full"
        />
      </div>
      <textarea
        value={note}
        onChange={(e) => setNote(e.target.value)}
        placeholder="Add a note about this progress update..."
        rows={2}
        className="w-full rounded-lg border border-slate-300 p-2 text-sm resize-none"
      />
      <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-green-700 disabled:opacity-50">
        {loading ? 'Updating...' : 'Update Progress'}
      </button>
    </form>
  );
}

export default UpdateProgress;