import { useState, useEffect } from 'react';
import { getAssignableMembers } from '../../api/tasks'; // Adjust path as necessary

function AssigneeDropdown({ workspaceSlug, value, onChange }) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAssignableMembers(workspaceSlug);
        setMembers(data);
      } catch (error) {
        console.error('Failed to fetch members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
  }, [workspaceSlug]);

  if (loading) return <div className="text-sm text-slate-500">Loading members...</div>;

  return (
    <select 
      value={value} 
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
    >
      <option value="">-- Select Assignee --</option>
      {members.map((member) => (
        <option key={member.id} value={member.id}>
          {member.full_name || member.username} ({member.role})
        </option>
      ))}
    </select>
  );
}

export default AssigneeDropdown;