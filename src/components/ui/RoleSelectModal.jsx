import { createPortal } from 'react-dom'
import { FiLogIn, FiUserPlus } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'

function AuthButton({ label, icon: Icon, onClick, variant = 'primary' }) {
  const baseStyle = "flex w-full items-center justify-center gap-2 rounded-lg p-4 text-base font-medium transition hover:-translate-y-0.5";
  const variantStyle = variant === 'primary' 
    ? "bg-brand text-white hover:bg-brand/90 border border-brand"
    : "border border-slate-200 bg-white text-slate-700 hover:border-brand hover:text-brand";
  
  return (
    <button onClick={onClick} className={`${baseStyle} ${variantStyle}`}>
      <Icon size={20} /> {label}
    </button>
  )
}

function RoleSelectModal({ open, onClose, onSelect }) {
  const navigate = useNavigate();

  if (!open) return null;

  const handleLogin = () => {
    onClose();
    navigate('/login');
  };

  const handleRegister = () => {
    onClose();
    navigate('/signup');
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-slate-900/40" onClick={onClose} />
      <div className="relative z-10 w-full max-w-md rounded-2xl bg-white p-8 shadow-xl">
        <h3 className="mb-2 text-center text-3xl font-bold text-slate-900">Welcome to Placfy</h3>
        <p className="mb-8 text-center text-slate-600">Join our recruitment management platform</p>
        
        <div className="grid gap-4">
          <AuthButton
            label="Sign Up"
            icon={FiUserPlus}
            onClick={handleRegister}
            variant="secondary"
          />
          <AuthButton
            label="Login"
            icon={FiLogIn}
            onClick={handleLogin}
            variant="primary"
          />
          
        </div>

        <button
          className="mt-6 w-full rounded-lg border border-slate-200 bg-slate-50 p-3 text-sm text-slate-600 hover:bg-slate-100 transition"
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>,
    document.body,
  );
}

export default RoleSelectModal


