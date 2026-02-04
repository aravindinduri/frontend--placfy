import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState, lazy, Suspense } from 'react';
import EmployeeNavbar from './EmployeeNavbar';
import EmployeeSidebar from './EmployeeSidebar';
import Spinner from '../../ui/Spinner';
import { useAuth } from '../../context/AuthContext';
import EmployeeDashboard from './EmployeeDashboard';

const Subscriptions = lazy(() => import('../hr/Subscriptions.jsx'));
const HelpDesk = lazy(() => import('../hr/HelpDesk.jsx'));
const TicketDetail = lazy(() => import('../hr/TicketDetail.jsx'));
const Placeholder = ({ label }) => (<div className="p-10 text-2xl text-gray-700 font-semibold">{label} (Coming Soon)</div>);
const HRTaskManagement = lazy(() => import('../hr/TaskManagement.jsx'));
const Employees = lazy(() => import('../hr/Employees.jsx'));


export default function EmployeeLayout() {
  const navigate = useNavigate();
  const { user, isAuthLoading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (isAuthLoading) return;

    const roles = new Set((user?.roles || []).map((r) => r.toLowerCase()));
    if (!roles.has('employee')) {
      navigate('/login');
    }
  }, [user, isAuthLoading, navigate]);

  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  const roles = new Set((user?.roles || []).map((r) => r.toLowerCase()));
  if (!roles.has('employee')) {
    return null; 
  }


  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}
      <div className="lg:translate-x-0 z-50 flex">
        <EmployeeSidebar
          onNavigate={() => setSidebarOpen(false)}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <EmployeeNavbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
        <div className="flex-1 overflow-y-auto bg-slate-50">
          <Suspense fallback={<div className="py-20"><Spinner /></div>}>
            <Routes>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<EmployeeDashboard />} />
              <Route path="subscriptions" element={<Subscriptions />} />
              <Route path="help-desk" element={<HelpDesk />} />
              <Route path="help-desk/:id" element={<TicketDetail />} />
              <Route path="employees" element={<Employees />} />
              <Route path="timesheets" element={<Placeholder label="Timesheets" />} />
              <Route path="documents" element={<Placeholder label="Documents" />} />
              <Route path="assignments" element={<Placeholder label="Assignments" />} />
              <Route path="expenses" element={<Placeholder label="Expenses" />} />
              <Route path="invoices" element={<Placeholder label="Invoices" />} />
              <Route path="accounts-payable" element={<Placeholder label="Accounts Payable" />} />
              <Route path="tasks" element={<HRTaskManagement />} />
              <Route path="onboarding" element={<Placeholder label="Onboarding" />} />
              <Route path="attendance" element={<Placeholder label="Attendance" />} />
              <Route path="assets-management" element={<Placeholder label="Assets Management" />} />
              <Route path="projects" element={<Placeholder label="Projects" />} />
              <Route path="offboarding" element={<Placeholder label="Offboarding" />} />
              <Route path="performance" element={<Placeholder label="Performance" />} />
              <Route path="*" element={<Navigate to="/employee/dashboard" replace />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  );
}
