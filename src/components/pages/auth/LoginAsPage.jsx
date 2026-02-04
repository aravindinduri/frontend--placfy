import { useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLoginWithTokenMutation } from '../../utils/api';
import Spinner from '../../ui/Spinner';
import { storeSessionToken, clearAuthCookie, storeSessionUser } from '../../utils/authToken';
import { useAuth } from '../../context/AuthContext';

// const getRedirectPath = (roles = []) => {
//   if (roles.includes('admin')) return '/adminpage';
//   if (roles.includes('hr-recruiter')) return '/hr-recruiter';
//   if (roles.includes('hr')) return '/hr';
//   if (roles.includes('recruiter')) return '/recruiter';
//   return '/';
// };

export default function LoginAsPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const { updateSessionUser } = useAuth();
  const [loginWithToken, { isLoading, isError, error }] = useLoginWithTokenMutation();
  const loggedInRef = useRef(false); // Ref to track if login has been attempted

  useEffect(() => {
    if (token && !loggedInRef.current) {
      loggedInRef.current = true; // Mark login attempt
      const performLogin = async () => {
        try {
          const { token: newJwt, user } = await loginWithToken(token).unwrap();
          clearAuthCookie(); // Clear the old http-only cookie from the new tab
          storeSessionToken(newJwt); // Store the new token in sessionStorage
          storeSessionUser(user); // Store the user in sessionStorage
          updateSessionUser(user); // Set the user in the auth context

          const redirectPath = getRedirectPath(user.roles);
          navigate(redirectPath, { replace: true });
        } catch (err) {
          // Error is handled by the isError and error states
        }
      };
      performLogin();
    }
  }, [token, loginWithToken, navigate, updateSessionUser]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      {isLoading && (
        <>
          <Spinner />
          <p className="mt-4 text-gray-600">Logging in as user...</p>
        </>
      )}
      {isError && (
        <div className="text-center">
          <p className="text-red-600 text-lg font-semibold">Login Failed</p>
          <p className="mt-2 text-gray-700">{error?.data?.message || 'Invalid or expired token.'}</p>
          <button onClick={() => navigate('/login', { replace: true })} className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md">
            Go to Login
          </button>
        </div>
      )}
    </div>
  );
}
