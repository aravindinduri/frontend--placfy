import { FiMenu, FiLogOut } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function EmployeeNavbar({ onMenuClick }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white p-4 shadow-md flex items-center justify-between z-30">
      <div className="flex items-center gap-4">
        <button onClick={onMenuClick} className="lg:hidden p-2 rounded-lg hover:bg-gray-100">
          <FiMenu className="w-6 h-6 text-gray-700" />
        </button>
        <img src="/Logo3.png" alt="Placfy" className="w-8 h-8 rounded" />
        <span className="font-bold text-lg text-gray-800">Employee Portal</span>
      </div>
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-100 hover:text-red-600 transition-colors"
      >
        <FiLogOut className="w-5 h-5" />
        <span className="hidden md:block">Logout</span>
      </button>
    </nav>
  );
}
