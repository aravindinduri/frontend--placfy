import { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FiGrid, FiUsers, FiClock, FiFileText, FiLogOut, FiChevronRight, FiPackage, FiSettings, FiBriefcase } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const BASE_PATH = '/employee';

const buildPath = (slug) => {
  if (slug === 'dashboard') return `${BASE_PATH}/dashboard`;
  return `${BASE_PATH}/${slug}`;
};

const allSidebarItems = [
  { id: 'dashboard', label: 'Dashboard', icon: FiGrid, path: 'dashboard' },
  { id: 'employees', label: 'Employees', icon: FiUsers, path: 'employees', requiredOp: 'employees' },
  { id: 'timesheets', label: 'Timesheets', icon: FiClock, path: 'timesheets', requiredOp: 'timesheets' },
  { id: 'documents', label: 'Documents', icon: FiFileText, path: 'documents', requiredOp: 'documents' },
  { id: 'assignments', label: 'Assignments', icon: FiChevronRight, path: 'assignments', requiredOp: 'assignments' },
  { id: 'expenses', label: 'Expenses', icon: FiChevronRight, path: 'expenses', requiredOp: 'expenses' },
  { id: 'invoices', label: 'Invoices', icon: FiChevronRight, path: 'invoices', requiredOp: 'invoices' },
  { id: 'accountspayable', label: 'Accounts Payable', icon: FiChevronRight, path: 'accounts-payable', requiredOp: 'accountspayable' },
  { id: 'tasks', label: 'Tasks', icon: FiBriefcase, path: 'tasks', requiredOp: 'tasks' },
  { id: 'onboarding', label: 'Onboarding', icon: FiChevronRight, path: 'onboarding', requiredOp: 'onboarding' },
  { id: 'attendance', label: 'Attendance', icon: FiChevronRight, path: 'attendance', requiredOp: 'attendance' },
  { id: 'assets', label: 'Assets Management', icon: FiChevronRight, path: 'assets-management', requiredOp: 'assets' },
  { id: 'projects', label: 'Projects', icon: FiChevronRight, path: 'projects', requiredOp: 'projects' },
  { id: 'offboarding', label: 'Offboarding', icon: FiChevronRight, path: 'offboarding', requiredOp: 'offboarding' },
  { id: 'performance', label: 'Performance', icon: FiChevronRight, path: 'performance', requiredOp: 'performance' },
  { id: 'helpdesk', label: 'Help Desk', icon: FiChevronRight, path: 'help-desk', requiredOp: 'helpdesk' },
  { id: 'subscriptions', label: 'Subscriptions', icon: FiPackage, path: 'subscriptions', requiredOp: 'subscriptions' },
  { id: 'settings', label: 'Settings', icon: FiSettings, path: 'settings' },
];


export default function EmployeeSidebar({ onNavigate, isOpen, onClose }) {
  const location = useLocation();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const sidebarRef = useRef(null);

  const userOperations = new Set((user?.operations || []).map(op => op.toLowerCase()));

  const sidebarItems = allSidebarItems.filter(item => {
    if (item.id === 'dashboard' || item.id === 'settings') {
      return true;
    }
    return userOperations.has(item.id);
  });


  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setCollapsed(false);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleItemClick = () => {
    if (isMobile && onClose) {
      onClose();
    }
  };

  const isPathActive = (path) => {
    if (!path) return false;
    const current = location.pathname;
    const target = buildPath(path);
    if (path === 'dashboard') {
      return current === BASE_PATH || current === target;
    }
    return current === target || current.startsWith(`${target}/`);
  };

  return (
    <>
      <div
        ref={sidebarRef}
        className={`flex flex-col h-screen bg-[#1a1b2e] text-white transition-all duration-300 z-50 ${
          isMobile
            ? `fixed ${isOpen ? 'translate-x-0' : '-translate-x-full'} w-64`
            : `fixed lg:relative ${collapsed ? 'w-16' : 'w-64'}`
        } overflow-hidden`}
        style={{ left: isMobile ? 0 : undefined }}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#2a2b3e] flex-shrink-0">
          {!collapsed && (
            <div className="flex items-center gap-2">
              <img src="/Logo3.png" alt="Placfy" className="w-8 h-8 rounded" />
              <span className="font-bold text-lg text-white">PLACFY</span>
            </div>
          )}
          {collapsed && (
            <div className="mx-auto">
              <img src="/Logo3.png" alt="Placfy" className="w-8 h-8 rounded" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:block p-1 hover:bg-[#2a2b3e] rounded transition-colors"
            aria-label="Toggle sidebar"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {collapsed ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              )}
            </svg>
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-2 custom-scrollbar">
          <style jsx>{`
            .custom-scrollbar::-webkit-scrollbar { width: 6px; }
            .custom-scrollbar::-webkit-scrollbar-track { background: #1a1b2e; }
            .custom-scrollbar::-webkit-scrollbar-thumb { background: #2a2b3e; border-radius: 3px; }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3a3b4e; }
          `}</style>

          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const toPath = item.path;
            const isActive = isPathActive(toPath);

            return (
              <div key={item.id}>
                <Link
                  to={buildPath(toPath)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-3 rounded-lg mb-1 transition-all duration-200 ${
                    isActive
                      ? 'bg-gradient-to-r from-brand to-accent text-white shadow-lg'
                      : 'text-gray-300 hover:bg-[#2a2b3e] hover:text-white'
                  } ${!collapsed ? '' : 'justify-center'}`}
                  onClick={handleItemClick}
                  title={collapsed ? item.label : ''}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {Icon && <Icon className="w-5 h-5 flex-shrink-0" />}
                    {!collapsed && <span className="text-sm font-medium truncate">{item.label}</span>}
                  </div>
                </Link>
              </div>
            );
          })}
        </nav>

        <div className="p-2 border-t border-[#2a2b3e] flex-shrink-0">
          <button
            onClick={async () => { await logout(); navigate('/login'); }}
            className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg text-gray-300 hover:bg-red-600/20 hover:text-red-400 transition-all duration-200 ${!collapsed ? '' : 'justify-center'}`}
            title={collapsed ? 'Logout' : ''}
          >
            <FiLogOut className="w-5 h-5 flex-shrink-0" />
            {!collapsed && <span className="text-sm font-medium">Logout</span>}
          </button>
        </div>
      </div>
    </>
  );
}