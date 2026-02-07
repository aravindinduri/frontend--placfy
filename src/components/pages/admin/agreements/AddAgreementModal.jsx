import { useState, useEffect } from "react";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import { X } from "lucide-react";

const AddAgreementModal = ({ isOpen, onClose, workspaceSlug, onSuccess, editingAgreement }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const isEditMode = !!editingAgreement;

    const [formData, setFormData] = useState({
        title: "",
        company_name: "",
        company_email: "",
        company_phone: "",
        agreement_type: "service",
        status: "draft",
        start_date: "",
        end_date: "",
        value: "",
        currency: "INR",
        payment_terms: "",
        renewal_terms: "",
        description: "",
        notes: "",
    });

    useEffect(() => {
        if (isEditMode && editingAgreement) {
            // Pre-fill form with agreement data for editing
            setFormData({
                title: editingAgreement.title || "",
                company_name: editingAgreement.company_name || "",
                company_email: editingAgreement.company_email || "",
                company_phone: editingAgreement.company_phone || "",
                agreement_type: editingAgreement.agreement_type || "service",
                status: editingAgreement.status || "draft",
                start_date: editingAgreement.start_date || "",
                end_date: editingAgreement.end_date || "",
                value: editingAgreement.value || "",
                currency: editingAgreement.currency || "INR",
                payment_terms: editingAgreement.payment_terms || "",
                renewal_terms: editingAgreement.renewal_terms || "",
                description: editingAgreement.description || "",
                notes: editingAgreement.notes || "",
            });
        }
    }, [isEditMode, editingAgreement, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        setError("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.title || !formData.company_name || !formData.start_date || !formData.description || !formData.value || !formData.end_date) {
            setError("Please fill in all required fields (Title, Company Name, Description, Value, Start Date, End Date)");
            return;
        }

        try {
            setLoading(true);
            const sessionToken = getSessionToken();
            const token = sessionToken || getStoredToken();

            const payload = {
                title: formData.title,
                company_name: formData.company_name,
                company_email: formData.company_email || null,
                company_phone: formData.company_phone || null,
                agreement_type: formData.agreement_type,
                status: formData.status,
                start_date: formData.start_date,
                end_date: formData.end_date || null,
                value: formData.value ? parseFloat(formData.value) : null,
                currency: formData.currency,
                payment_terms: formData.payment_terms || null,
                renewal_terms: formData.renewal_terms || null,
                description: formData.description || null,
                notes: formData.notes || null,
            };

            // Determine method and endpoint based on edit mode
            const method = isEditMode ? "PATCH" : "POST";
            const endpoint = isEditMode
                ? `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/agreements/${editingAgreement.id}/`
                : `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/agreements/`;

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
                    title: "",
                    company_name: "",
                    company_email: "",
                    company_phone: "",
                    agreement_type: "service",
                    status: "draft",
                    start_date: "",
                    end_date: "",
                    value: "",
                    currency: "INR",
                    payment_terms: "",
                    renewal_terms: "",
                    description: "",
                    notes: "",
                });
                onSuccess && onSuccess(result);
                onClose();
            } else {
                const errData = await response.json();
                setError(errData.detail || (isEditMode ? "Failed to update agreement" : "Failed to create agreement"));
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">{isEditMode ? "Edit Agreement" : "Add Agreement"}</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">{isEditMode ? "Update agreement details" : "Create a new agreement"}</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 font-bold text-sm">
                        {error}
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="text"
                                name="title"
                                placeholder="Agreement Title *"
                                value={formData.title}
                                onChange={handleChange}
                                className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                                required
                            />
                            <input
                                type="text"
                                name="company_name"
                                placeholder="Company Name *"
                                value={formData.company_name}
                                onChange={handleChange}
                                className="col-span-2 px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                                required
                            />
                            <input
                                type="email"
                                name="company_email"
                                placeholder="Company Contact Email"
                                value={formData.company_email}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                            />
                            <input
                                type="tel"
                                name="company_phone"
                                placeholder="Company Contact Phone"
                                value={formData.company_phone}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                            />
                            <select
                                name="agreement_type"
                                value={formData.agreement_type}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                            >
                                <option value="service">Service Agreement</option>
                                <option value="nda">NDA</option>
                                <option value="employment">Employment Contract</option>
                                <option value="vendor">Vendor Agreement</option>
                                <option value="partnership">Partnership Agreement</option>
                                <option value="lease">Lease Agreement</option>
                                <option value="licensing">Licensing Agreement</option>
                                <option value="other">Other</option>
                            </select>
                            <select
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                            >
                                <option value="draft">Draft</option>
                                <option value="active">Active</option>
                                <option value="pending">Pending</option>
                                <option value="expired">Expired</option>
                                <option value="terminated">Terminated</option>
                            </select>
                        </div>
                    </div>

                    {/* Dates & Financial */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800">Dates & Financial Details</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input
                                type="date"
                                name="start_date"
                                placeholder="Start Date *"
                                value={formData.start_date}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                                required
                            />
                            <input
                                type="date"
                                name="end_date"
                                placeholder="End Date *"
                                value={formData.end_date}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                                required
                            />
                            <input
                                type="number"
                                name="value"
                                placeholder="Agreement Value *"
                                value={formData.value}
                                onChange={handleChange}
                                className="px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600"
                                step="0.01"
                                required
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
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>

                    {/* Terms & Notes */}
                    <div className="space-y-4">
                        <h3 className="font-black text-slate-800">Terms & Notes</h3>
                        <div className="space-y-4">
                            <textarea
                                name="payment_terms"
                                placeholder="Payment Terms"
                                value={formData.payment_terms}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 min-h-[80px]"
                            />
                            <textarea
                                name="renewal_terms"
                                placeholder="Renewal Terms"
                                value={formData.renewal_terms}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 min-h-[80px]"
                            />
                            <textarea
                                name="description"
                                placeholder="Description *"
                                value={formData.description}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 min-h-[100px]"
                                required
                            />
                            <textarea
                                name="notes"
                                placeholder="Internal Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:border-indigo-600 min-h-[80px]"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-end gap-3 pt-8 border-t border-slate-200">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-6 py-2 rounded-lg font-bold text-sm uppercase text-slate-600 hover:bg-slate-100"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="bg-indigo-600 text-white rounded-lg px-8 py-2 font-bold text-sm uppercase hover:bg-indigo-700 disabled:opacity-50"
                        >
                            {loading ? (isEditMode ? "Updating..." : "Creating...") : (isEditMode ? "Update Agreement" : "Create Agreement")}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAgreementModal;
