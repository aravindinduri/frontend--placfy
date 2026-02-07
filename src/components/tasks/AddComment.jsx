import { useState } from 'react';
import { addComment } from '../../api/tasks';

function AddComment({ workspaceSlug, taskId, onCommentAdded }) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setLoading(true);
    try {
      const comment = await addComment(workspaceSlug, taskId, content);
      onCommentAdded(comment); // Propagate the new comment up
      setContent('');
    } catch (error) {
      console.error('Failed to add comment:', error);
      alert('Failed to post comment.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Add a comment..."
        rows={3}
        className="w-full rounded-lg border border-slate-300 p-2 text-sm resize-none"
      />
      <button 
        type="submit" 
        disabled={loading || !content.trim()}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
      >
        {loading ? 'Posting...' : 'Post Comment'}
      </button>
    </form>
  );
}

export default AddComment;