import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { FiUser, FiMail, FiBriefcase, FiMapPin } from 'react-icons/fi';

export default function EmployeeDashboard() {
  const { user } = useAuth(); // This 'user' object now contains employee data from loginEmployee

  if (!user) {
    return (
      <div className="p-8 text-center text-red-500">
        Please log in to view the employee dashboard.
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Welcome, {user.name}!</h1>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Profile</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
          <p className="flex items-center gap-2"><FiUser className="text-blue-500" /> <strong>Name:</strong> {user.name}</p>
          <p className="flex items-center gap-2"><FiMail className="text-blue-500" /> <strong>Email:</strong> {user.email}</p>
          {/* Add more employee-specific details here */}
          <p className="flex items-center gap-2"><FiBriefcase className="text-blue-500" /> <strong>Job Title:</strong> {user.jobTitle || 'N/A'}</p>
          <p className="flex items-center gap-2"><FiMapPin className="text-blue-500" /> <strong>Department:</strong> {user.department || 'N/A'}</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Access</h2>
        {user.operations && user.operations.length > 0 ? (
          <ul className="list-disc list-inside text-gray-700">
            {user.operations.map((op, index) => (
              <li key={index}>{op}</li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600">You currently have no specific module access defined.</p>
        )}
      </div>
    </div>
  );
}
