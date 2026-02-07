import { useState, useEffect } from 'react';
import { sendMessage } from '../../api/tasks';
// You would also need an API function to fetch existing conversations, 
// which is implied by task.conversations in TaskDetails.jsx, but not explicitly in the guide.
// For now, we'll focus on sending the new message.

function TaskConversations({ workspaceSlug, taskId, initialConversations = [], onMessageSent }) {
  const [messages, setMessages] = useState(initialConversations);
  const [messageContent, setMessageContent] = useState('');
  const [receiverId, setReceiverId] = useState(null); // Assuming you know the receiver ID contextually
  const [loading, setLoading] = useState(false);

  // Effect to update messages when parent re-fetches task data
  useEffect(() => {
      // This part assumes initialConversations comes from the parent TaskDetails component
      // and is updated when the task is re-fetched.
      // If this component fetched data independently, we'd need a fetchConversations() call here.
  }, [initialConversations]);


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!messageContent.trim() || !receiverId) return;

    setLoading(true);
    try {
      const sentMessage = await sendMessage(workspaceSlug, taskId, receiverId, messageContent);
      setMessages((prev) => [...prev, sentMessage]); // Add new message to local state
      onMessageSent(sentMessage); // Signal parent to re-fetch task details
      setMessageContent('');
    } catch (error) {
      console.error('Failed to send message:', error);
      alert('Failed to send private message.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded-xl bg-slate-50">
      <h3 className="font-semibold mb-3">Private Messages ({messages.length})</h3>
      
      {/* Receiver Selector (Essential but depends on context outside the guide) */}
      {/* You MUST have context or a way to select the receiver. For now, receiverId must be set */}
      {/* <select value={receiverId} onChange={e => setReceiverId(e.target.value)}>...</select> */}
      
      {/* Conversation Display */}
      <div className="space-y-3 h-48 overflow-y-auto border p-2 bg-white rounded-lg mb-3">
        {messages.length === 0 ? (
            <p className="text-sm text-slate-500 text-center pt-10">No private conversations yet.</p>
        ) : (
            messages.map((msg) => (
                <div key={msg.id} className={`p-2 rounded-lg text-xs ${msg.is_read ? 'bg-slate-100' : 'bg-yellow-50 border border-yellow-200'}`}>
                    <strong>{msg.sender_name} → {msg.receiver_name}:</strong> {msg.message}
                    <span className="block text-[9px] text-slate-400 mt-0.5">Sent: {new Date(msg.sent_at).toLocaleTimeString()}</span>
                </div>
            ))
        )}
      </div>

      {/* Send Form */}
      <form onSubmit={handleSubmit} className="space-y-2">
        <textarea
          value={messageContent}
          onChange={(e) => setMessageContent(e.target.value)}
          placeholder={`Send a message to ${receiverId ? 'User ' + receiverId : 'a receiver'}...`}
          rows={2}
          disabled={loading || !receiverId}
          className="w-full rounded-lg border border-slate-300 p-2 text-sm resize-none"
        />
        <button 
          type="submit" 
          disabled={loading || !messageContent.trim() || !receiverId}
          className="bg-purple-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-purple-700 disabled:opacity-50"
        >
          {loading ? 'Sending...' : 'Send Message'}
        </button>
      </form>
    </div>
  );
}

export default TaskConversations;