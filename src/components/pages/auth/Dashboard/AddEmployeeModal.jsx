import { useEffect, useState } from "react";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

const AddEmployeeModal = ({ isOpen, onClose, workspaceSlug, onSuccess, editingEmployee }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEditMode = !!editingEmployee;
  
  const [formData, setFormData] = useState({
    // Personal Info
    employee_id: "",
    name: "",
    personal_email: "",
    work_email: "",
    phone_number: "",
    emergency_contact_name: "",
    emergency_contact_phone: "",
    date_of_birth: "",
    gender: "",
    address_line_1: "",
    address_line_2: "",
    city: "",
    state: "",
    postal_code: "",
    country: "India",
    department: "",
    
    // Employment Details
    job_title: "",
    employment_type: "full_time",
    employment_status: "active",
    joining_date: "",
    probation_end_date: "",
    work_hours_per_week: "40",
    employee_level: "junior",
    
    // Compensation
    base_salary: "",
    currency: "INR",
    pay_frequency: "monthly",
    bonus: "",
    allowances: "",
    effective_from: "",
    tax_id: "",
    
    // Bank Details
    bank_name: "",
    account_holder_name: "",
    account_number: "",
    ifsc_code: "",
    swift_code: "",
    branch_name: "",
  });

  useEffect(() => {
    if (isEditMode && editingEmployee) {
      // Pre-fill form with employee data for editing
      setFormData({
        employee_id: editingEmployee.employee_id || "",
        name: editingEmployee.name || "",
        personal_email: editingEmployee.personal_email || "",
        work_email: editingEmployee.work_email || "",
        phone_number: editingEmployee.phone_number || "",
        emergency_contact_name: editingEmployee.emergency_contact_name || "",
        emergency_contact_phone: editingEmployee.emergency_contact_phone || "",
        date_of_birth: editingEmployee.date_of_birth || "",
        gender: editingEmployee.gender || "",
        address_line_1: editingEmployee.address_line_1 || "",
        address_line_2: editingEmployee.address_line_2 || "",
        city: editingEmployee.city || "",
        state: editingEmployee.state || "",
        postal_code: editingEmployee.postal_code || "",
        country: editingEmployee.country || "India",
        department: editingEmployee.department || "",
        job_title: editingEmployee.job_title || "",
        employment_type: editingEmployee.employment_type || "full_time",
        employment_status: editingEmployee.employment_status || "active",
        joining_date: editingEmployee.joining_date || "",
        probation_end_date: editingEmployee.probation_end_date || "",
        work_hours_per_week: editingEmployee.work_hours_per_week || "40",
        employee_level: editingEmployee.employee_level || "junior",
        base_salary: editingEmployee.base_salary || "",
        currency: editingEmployee.currency || "INR",
        pay_frequency: editingEmployee.pay_frequency || "monthly",
        bonus: editingEmployee.bonus || "",
        allowances: editingEmployee.allowances || "",
        effective_from: editingEmployee.effective_from || "",
        tax_id: editingEmployee.tax_id || "",
        bank_name: editingEmployee.bank_name || "",
        account_holder_name: editingEmployee.account_holder_name || "",
        account_number: editingEmployee.account_number || "",
        ifsc_code: editingEmployee.ifsc_code || "",
        swift_code: editingEmployee.swift_code || "",
        branch_name: editingEmployee.branch_name || "",
      });
    }
  }, [isEditMode, editingEmployee, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError("");
  };

  const validateStep = () => {
    switch(currentStep) {
      case 1:
        if (!formData.employee_id || !formData.name || !formData.work_email || !formData.gender || !formData.department) {
          setError("Please fill in all required fields");
          return false;
        }
        break;
      case 2:
        if (!formData.job_title || !formData.joining_date) {
          setError("Please fill in all required fields");
          return false;
        }
        break;
      case 3:
        if (!formData.base_salary || !formData.effective_from) {
          setError("Please fill in all required fields");
          return false;
        }
        break;
      default:
        break;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (currentStep === 4) {
      try {
        setLoading(true);
        const sessionToken = getSessionToken();
        const token = sessionToken || getStoredToken();

        const payload = {
          employee_id: formData.employee_id,
          name: formData.name,
          personal_email: formData.personal_email,
          work_email: formData.work_email,
          phone_number: formData.phone_number,
          emergency_contact_name: formData.emergency_contact_name,
          emergency_contact_phone: formData.emergency_contact_phone,
          date_of_birth: formData.date_of_birth,
          gender: formData.gender,
          address_line_1: formData.address_line_1,
          address_line_2: formData.address_line_2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postal_code,
          country: formData.country,
          department: formData.department,
          employment_details: {
            job_title: formData.job_title,
            employment_type: formData.employment_type,
            employment_status: formData.employment_status,
            joining_date: formData.joining_date,
            probation_end_date: formData.probation_end_date,
            work_hours_per_week: parseInt(formData.work_hours_per_week),
            employee_level: formData.employee_level,
          },
          compensation: {
            base_salary: parseFloat(formData.base_salary),
            currency: formData.currency,
            pay_frequency: formData.pay_frequency,
            bonus: parseFloat(formData.bonus) || 0,
            allowances: parseFloat(formData.allowances) || 0,
            effective_from: formData.effective_from,
            tax_id: formData.tax_id,
          },
          bank_details: formData.bank_name ? {
            bank_name: formData.bank_name,
            account_holder_name: formData.account_holder_name,
            account_number: formData.account_number,
            ifsc_code: formData.ifsc_code,
            swift_code: formData.swift_code,
            branch_name: formData.branch_name,
          } : null,
        };

        // Determine method and endpoint based on edit mode
        const method = isEditMode ? "PATCH" : "POST";
        const endpoint = isEditMode 
          ? `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/employees/${editingEmployee.id}/`
          : `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/employees/`;

        const response = await fetch(endpoint, {
          method: method,
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        if (response.ok) {
          const result = await response.json();
          setFormData({
            employee_id: "",
            name: "",
            personal_email: "",
            work_email: "",
            phone_number: "",
            emergency_contact_name: "",
            emergency_contact_phone: "",
            date_of_birth: "",
            gender: "",
            address_line_1: "",
            address_line_2: "",
            city: "",
            state: "",
            postal_code: "",
            country: "India",
            department: "",
            job_title: "",
            employment_type: "full_time",
            employment_status: "active",
            joining_date: "",
            probation_end_date: "",
            work_hours_per_week: "40",
            employee_level: "junior",
            base_salary: "",
            currency: "INR",
            pay_frequency: "monthly",
            bonus: "",
            allowances: "",
            effective_from: "",
            tax_id: "",
            bank_name: "",
            account_holder_name: "",
            account_number: "",
            ifsc_code: "",
            swift_code: "",
            branch_name: "",
          });
          setCurrentStep(1);
          onSuccess && onSuccess(result);
          onClose();
        } else {
          const errData = await response.json();
          setError(errData.detail || (isEditMode ? "Failed to update employee" : "Failed to create employee"));
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-3xl p-8 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-black text-slate-800">
              {isEditMode ? "Edit Employee" : "Add Employee"}
            </h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Step {currentStep} of 4</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
            <X size={24} className="text-slate-600" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="flex gap-2 mb-8">
          {[1, 2, 3, 4].map(step => (
            <div key={step} className={`h-2 flex-1 rounded-full ${step <= currentStep ? 'bg-indigo-600' : 'bg-slate-200'}`} />
          ))}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm">
            {error}
          </div>
        )}

        {/* Content */}
        <div className="mb-8 min-h-[300px]">
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 mb-6">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="employee_id"
                  placeholder="Employee ID *"
                  value={formData.employee_id}
                  onChange={handleChange}
                  disabled={isEditMode}
                  className={`col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 ${isEditMode ? 'bg-slate-100 cursor-not-allowed' : ''}`}
                />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name *"
                  value={formData.name}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="email"
                  name="personal_email"
                  placeholder="Personal Email"
                  value={formData.personal_email}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="email"
                  name="work_email"
                  placeholder="Work Email *"
                  value={formData.work_email}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="tel"
                  name="phone_number"
                  placeholder="Phone Number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="">Select Gender *</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="">Select Department *</option>
                  <option value="it">IT</option>
                  <option value="hr">Human Resources</option>
                  <option value="finance">Finance</option>
                  <option value="sales">Sales</option>
                  <option value="marketing">Marketing</option>
                  <option value="operations">Operations</option>
                </select>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  name="address_line_1"
                  placeholder="Address Line 1"
                  value={formData.address_line_1}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 mb-6">Employment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  name="job_title"
                  placeholder="Job Title *"
                  value={formData.job_title}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <select
                  name="employment_type"
                  value={formData.employment_type}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="full_time">Full Time</option>
                  <option value="part_time">Part Time</option>
                  <option value="contract">Contract</option>
                  <option value="intern">Intern</option>
                </select>
                <select
                  name="employee_level"
                  value={formData.employee_level}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="junior">Junior</option>
                  <option value="mid">Mid-Level</option>
                  <option value="senior">Senior</option>
                  <option value="lead">Lead</option>
                  <option value="manager">Manager</option>
                </select>
                <input
                  type="date"
                  name="joining_date"
                  placeholder="Joining Date *"
                  value={formData.joining_date}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="date"
                  name="probation_end_date"
                  placeholder="Probation End Date"
                  value={formData.probation_end_date}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="number"
                  name="work_hours_per_week"
                  placeholder="Work Hours Per Week"
                  value={formData.work_hours_per_week}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 mb-6">Compensation Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="number"
                  name="base_salary"
                  placeholder="Base Salary *"
                  value={formData.base_salary}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <select
                  name="currency"
                  value={formData.currency}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
                <select
                  name="pay_frequency"
                  value={formData.pay_frequency}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="monthly">Monthly</option>
                  <option value="weekly">Weekly</option>
                  <option value="bi_weekly">Bi-weekly</option>
                  <option value="annually">Annually</option>
                </select>
                <input
                  type="number"
                  name="bonus"
                  placeholder="Bonus (Annual)"
                  value={formData.bonus}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="number"
                  name="allowances"
                  placeholder="Allowances (Monthly)"
                  value={formData.allowances}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="date"
                  name="effective_from"
                  placeholder="Effective From *"
                  value={formData.effective_from}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  name="tax_id"
                  placeholder="Tax ID"
                  value={formData.tax_id}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-4">
              <h3 className="font-black text-slate-800 mb-6">Bank Details (Optional)</h3>
              <div className="grid grid-cols-2 gap-4">
                <select
                  name="bank_name"
                  value={formData.bank_name}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                >
                  <option value="">Select Bank</option>
                  <option value="hdfc">HDFC Bank</option>
                  <option value="icici">ICICI Bank</option>
                  <option value="sbi">State Bank of India</option>
                  <option value="axis">Axis Bank</option>
                  <option value="kotak">Kotak Mahindra Bank</option>
                </select>
                <input
                  type="text"
                  name="account_holder_name"
                  placeholder="Account Holder Name"
                  value={formData.account_holder_name}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  name="account_number"
                  placeholder="Account Number"
                  value={formData.account_number}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  name="ifsc_code"
                  placeholder="IFSC Code"
                  value={formData.ifsc_code}
                  onChange={handleChange}
                  className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
                <input
                  type="text"
                  name="branch_name"
                  placeholder="Branch Name"
                  value={formData.branch_name}
                  onChange={handleChange}
                  className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-8 border-t border-slate-200">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`flex items-center gap-2 px-6 py-2 rounded-lg font-bold text-sm uppercase ${
              currentStep === 1
                ? 'text-slate-400 cursor-not-allowed'
                : 'text-indigo-600 hover:bg-indigo-50'
            }`}
          >
            <ChevronLeft size={18} /> Previous
          </button>

          {currentStep === 4 ? (
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="bg-indigo-600 text-white rounded-lg px-8 py-2 font-bold text-sm uppercase hover:bg-indigo-700 disabled:opacity-50"
            >
              {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Employee" : "Create Employee")}
            </button>
          ) : (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold text-sm uppercase hover:bg-indigo-700"
            >
              Next <ChevronRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default AddEmployeeModal;
