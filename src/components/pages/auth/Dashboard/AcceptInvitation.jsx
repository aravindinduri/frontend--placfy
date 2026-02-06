import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import { Mail, Building2, User, Calendar, CheckCircle, XCircle, AlertCircle } from "lucide-react";

export default function AcceptInvitation() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [invitation, setInvitation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetchInvitationDetails();
  }, [token]);

  const fetchInvitationDetails = async () => {
    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/invitations/${token}/`
      );

      if (!response.ok) {
        throw new Error('Invalid or expired invitation');
      }

      const data = await response.json();
      setInvitation(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async () => {
    const sessionToken = getSessionToken();
    const accessToken = sessionToken || getStoredToken();

    if (!accessToken) {
      // Redirect to login with return URL
      navigate(`/login?next=/invitations/${token}`);
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/invitations/${token}/accept/`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Success - show message and redirect to workspace
        setSuccessMessage("✓ Invitation accepted! Redirecting to workspace...");
        setTimeout(() => {
          // Navigate to the specific workspace using the slug from response
          navigate(`/workspaces/${data.workspace.slug}`);
        }, 2000);
      } else if (response.status === 400) {
        // Handle specific 400 errors
        if (data.requires_login) {
          navigate(`/login?next=/invitations/${token}`);
        } else if (data.detail) {
          setError(data.detail);
        } else if (data.error) {
          setError(data.error);
        } else {
          // Show all validation errors
          const errorMessages = Object.entries(data)
            .map(([key, value]) => {
              if (Array.isArray(value)) {
                return value.join(', ');
              }
              return value;
            })
            .join('. ');
          setError(errorMessages || 'Failed to accept invitation');
        }
        setProcessing(false);
      } else if (response.status === 401) {
        // Unauthorized - redirect to login
        navigate(`/login?next=/invitations/${token}`);
      } else {
        throw new Error(data.detail || data.error || 'Failed to accept invitation');
      }
    } catch (error) {
      console.error('Accept error:', error);
      setError(error.message);
      setProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm('Are you sure you want to decline this invitation?')) {
      return;
    }

    setProcessing(true);
    setError("");

    try {
      const response = await fetch(
        `http://localhost:8000/api/v1/invitations/${token}/decline/`,
        {
          method: 'POST',
        }
      );

      if (response.ok) {
        const data = await response.json();
        setSuccessMessage(`Invitation to ${data.workspace_name} declined. Redirecting...`);
        setTimeout(() => {
          // Redirect to home page
          navigate('/');
        }, 2000);
      } else {
        const data = await response.json();
        throw new Error(data.detail || data.error || 'Failed to decline invitation');
      }
    } catch (error) {
      console.error('Decline error:', error);
      setError(error.message);
      setProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-bold">Loading invitation...</p>
        </div>
      </div>
    );
  }

  if (error && !invitation) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-red-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Invalid Invitation</h2>
          <p className="text-slate-600 font-medium mb-6">{error}</p>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (invitation?.is_expired) {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Calendar size={32} className="text-orange-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Invitation Expired</h2>
          <p className="text-slate-600 font-medium mb-6">
            This invitation has expired. Please contact the workspace admin for a new invitation.
          </p>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  if (invitation?.status === 'accepted') {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Already Accepted</h2>
          <p className="text-slate-600 font-medium mb-6">You have already accepted this invitation.</p>
          <button
            onClick={() => navigate(`/workspaces/${invitation.workspace_slug}`)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Go to Workspace
          </button>
        </div>
      </div>
    );
  }

  if (invitation?.status === 'declined') {
    return (
      <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
        <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-xl text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle size={32} className="text-slate-600" />
          </div>
          <h2 className="text-2xl font-black text-slate-800 mb-2">Invitation Declined</h2>
          <p className="text-slate-600 font-medium mb-6">This invitation has been declined.</p>
          <button
            onClick={() => navigate('/')}
            className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-3 px-6 rounded-2xl transition-all"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#EEF2FF] flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-xl">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-indigo-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-indigo-600" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">You're Invited!</h1>
          <p className="text-slate-600 font-medium">Join the team at {invitation?.workspace_name}</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl font-bold text-sm bg-red-50 text-red-700 border border-red-200 flex items-start gap-3">
            <AlertCircle size={20} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 rounded-xl font-bold text-sm bg-green-50 text-green-700 border border-green-200 flex items-start gap-3">
            <CheckCircle size={20} className="shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        <div className="space-y-4 mb-8">
          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <Building2 size={20} className="text-slate-400" />
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Workspace</p>
              <p className="text-sm font-bold text-slate-700">{invitation?.workspace_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <User size={20} className="text-slate-400" />
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Invited By</p>
              <p className="text-sm font-bold text-slate-700">{invitation?.invited_by_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl">
            <Mail size={20} className="text-slate-400" />
            <div>
              <p className="text-xs font-black text-slate-400 uppercase">Role</p>
              <p className="text-sm font-bold text-slate-700">{invitation?.role_display}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-blue-50 rounded-2xl border border-blue-100">
            <AlertCircle size={20} className="text-blue-600" />
            <div>
              <p className="text-xs font-black text-blue-600 uppercase">Invited Email</p>
              <p className="text-sm font-bold text-slate-700">{invitation?.email}</p>
            </div>
          </div>

          {invitation?.message && (
            <div className="p-4 bg-indigo-50 rounded-2xl border border-indigo-100">
              <p className="text-xs font-black text-indigo-600 uppercase mb-1">Message</p>
              <p className="text-sm font-medium text-slate-700">{invitation.message}</p>
            </div>
          )}

          <div className="p-4 bg-yellow-50 rounded-2xl border border-yellow-200">
            <p className="text-xs font-bold text-yellow-800">
              ⚠️ Make sure you're logged in with the email address <strong>{invitation?.email}</strong> to accept this invitation.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <button
            onClick={handleDecline}
            disabled={processing}
            className="flex-1 bg-slate-100 text-slate-700 rounded-2xl py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <XCircle size={16} />
            Decline
          </button>
          <button
            onClick={handleAccept}
            disabled={processing}
            className="flex-1 bg-indigo-600 text-white rounded-2xl py-4 px-6 font-black text-xs uppercase tracking-widest hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-200 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2"
          >
            <CheckCircle size={16} />
            {processing ? 'Processing...' : 'Accept'}
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-xs text-slate-500">
            Not logged in with the correct account?{' '}
            <button
              onClick={() => navigate(`/login?next=/invitations/${token}`)}
              className="text-indigo-600 font-bold hover:underline"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}