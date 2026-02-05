import React, { useState, useEffect } from 'react';
import './ManageMember.css';
import { api } from '../../../utils/api';
import { Mail, CheckCircle, Clock, X, AlertCircle } from 'lucide-react';

const ManageMember = () => {
    const [invitations, setInvitations] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const [formData, setFormData] = useState({
        email: '',
        role: 'member',
        message: ''
    });

    // Available roles
    const ROLES = ['admin', 'hr', 'member', 'recruiter', 'staff'];

    // Get workspace slug from localStorage or URL
    const workspaceSlug = localStorage.getItem('workspace_slug') || 'my-workspace';

    // Fetch invitations on component mount
    useEffect(() => {
        fetchInvitations();
    }, []);

    const fetchInvitations = async () => {
        try {
            setLoading(true);
            const response = await api.get(`/workspaces/${workspaceSlug}/invitations/`);
            setInvitations(response.data);
        } catch (err) {
            console.error('Failed to fetch invitations:', err);
            setError('Failed to load invitations');
        } finally {
            setLoading(false);
        }
    };

    const handleSendInvitation = async () => {
        try {
            setLoading(true);
            setError(null);
            setSuccess(null);

            // Validate
            if (!formData.email) {
                setError('Email is required');
                return;
            }

            if (!formData.role) {
                setError('Role is required');
                return;
            }

            // Send invitation
            const response = await api.post(`/workspaces/${workspaceSlug}/invitations/`, {
                email: formData.email,
                role: formData.role,
                message: formData.message || undefined
            });

            // Update invitations list
            setInvitations([response.data, ...invitations]);
            
            // Reset form
            setFormData({ email: '', role: 'member', message: '' });
            setShowForm(false);
            setSuccess(`Invitation sent to ${formData.email}`);

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to send invitation:', err);
            const errorMsg = err.response?.data?.email?.[0] || err.response?.data?.detail || 'Failed to send invitation';
            setError(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleCancelInvitation = async (invitationId) => {
        try {
            setLoading(true);
            await api.delete(`/workspaces/${workspaceSlug}/invitations/${invitationId}/`);
            setInvitations(invitations.filter(inv => inv.id !== invitationId));
            setSuccess('Invitation cancelled');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to cancel invitation:', err);
            setError('Failed to cancel invitation');
        } finally {
            setLoading(false);
        }
    };

    const handleResendInvitation = async (invitationId) => {
        try {
            setLoading(true);
            await api.post(`/workspaces/${workspaceSlug}/invitations/${invitationId}/resend/`);
            setSuccess('Invitation resent successfully');
            setTimeout(() => setSuccess(null), 3000);
        } catch (err) {
            console.error('Failed to resend invitation:', err);
            setError('Failed to resend invitation');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="manage-member-container">
            {/* Header */}
            <div className="manage-header">
                <div>
                    <h1>Manage Members</h1>
                    <p>Invite and manage workspace members</p>
                </div>
                <button 
                    className={`btn-add-member ${showForm ? 'active' : ''}`} 
                    onClick={() => setShowForm(!showForm)}
                    disabled={loading}
                >
                    {showForm ? '✕ Cancel' : '+ Invite Member'}
                </button>
            </div>

            {/* Messages */}
            {error && (
                <div className="alert alert-error">
                    <AlertCircle size={18} />
                    <span>{error}</span>
                    <button onClick={() => setError(null)}>×</button>
                </div>
            )}
            {success && (
                <div className="alert alert-success">
                    <CheckCircle size={18} />
                    <span>{success}</span>
                </div>
            )}

            {/* Invitation Form */}
            {showForm && (
                <div className="invitation-form-section">
                    <h2>Send Invitation</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleSendInvitation(); }}>
                        <div className="form-group">
                            <label htmlFor="email">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                placeholder="user@example.com"
                                value={formData.email}
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="role">Role *</label>
                            <select 
                                id="role"
                                name="role" 
                                value={formData.role} 
                                onChange={handleInputChange}
                                disabled={loading}
                                required
                            >
                                {ROLES.map(role => (
                                    <option key={role} value={role}>
                                        {role.charAt(0).toUpperCase() + role.slice(1)}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Message (Optional)</label>
                            <textarea
                                id="message"
                                name="message"
                                placeholder="Add a welcome message..."
                                value={formData.message}
                                onChange={handleInputChange}
                                disabled={loading}
                                rows="3"
                            />
                        </div>

                        <button 
                            type="submit" 
                            className="btn-send-invitation"
                            disabled={loading}
                        >
                            {loading ? 'Sending...' : 'Send Invitation'}
                        </button>
                    </form>
                </div>
            )}

            {/* Invitations List */}
            <div className="invitations-section">
                <h2>Pending Invitations</h2>
                {loading && !invitations.length ? (
                    <div className="loading">Loading invitations...</div>
                ) : invitations.length === 0 ? (
                    <div className="empty-state">
                        <Mail size={48} />
                        <p>No invitations sent yet</p>
                        <p className="text-muted">Click "Invite Member" to get started</p>
                    </div>
                ) : (
                    <div className="invitations-grid">
                        {invitations.map(invitation => (
                            <div key={invitation.id} className="invitation-card">
                                <div className="invitation-header">
                                    <div className="invitation-info">
                                        <h3>{invitation.email}</h3>
                                        <p className="role-badge">{invitation.role_display || invitation.role}</p>
                                    </div>
                                    <div className={`status-badge status-${invitation.status}`}>
                                        {invitation.status === 'pending' && <Clock size={16} />}
                                        {invitation.status === 'accepted' && <CheckCircle size={16} />}
                                        {invitation.status === 'declined' && <X size={16} />}
                                        <span>{invitation.status_display || invitation.status}</span>
                                    </div>
                                </div>

                                <div className="invitation-details">
                                    {invitation.invited_by_name && (
                                        <p><strong>Invited by:</strong> {invitation.invited_by_name}</p>
                                    )}
                                    {invitation.sent_at && (
                                        <p><strong>Sent:</strong> {new Date(invitation.sent_at).toLocaleDateString()}</p>
                                    )}
                                    {invitation.is_expired && (
                                        <p className="text-warning"><strong>⚠️ This invitation has expired</strong></p>
                                    )}
                                </div>

                                {invitation.status === 'pending' && (
                                    <div className="invitation-actions">
                                        <button
                                            className="btn-resend"
                                            onClick={() => handleResendInvitation(invitation.id)}
                                            disabled={loading || invitation.is_expired}
                                        >
                                            Resend
                                        </button>
                                        <button
                                            className="btn-cancel"
                                            onClick={() => handleCancelInvitation(invitation.id)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageMember;