import { useState, useEffect } from "react";
import { getStoredToken, getSessionToken } from "../../../utils/authToken";
import { X, Upload, FileText } from "lucide-react";

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
        notes: "",
    });

    const [selectedFile, setSelectedFile] = useState(null);

    useEffect(() => {
        if (isEditMode && editingAgreement) {
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
                notes: editingAgreement.notes || "",
            });
            setSelectedFile(null);
        } else {
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
                notes: "",
            });
            setSelectedFile(null);
        }
    }, [isEditMode, editingAgreement, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
    };

    const uploadFile = async (agreementId) => {
        if (!selectedFile) return;

        const sessionToken = getSessionToken();
        const token = sessionToken || getStoredToken();

        const fileData = new FormData();
        fileData.append("file", selectedFile);
        fileData.append("file_type", "contract");
        fileData.append("file_name", selectedFile.name);
        fileData.append("description", "Agreement document");

        try {
            await fetch(
                `http://localhost:8000/api/v1/workspaces/${workspaceSlug}/agreements/${agreementId}/files/`,
                {
                    method: "POST",
                    headers: {
                        "Authorization": `Bearer ${token}`
                    },
                    body: fileData
                }
            );
        } catch (uploadError) {
            console.error("File upload failed", uploadError);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");

        // Basic Validation
        if (!formData.title || !formData.company_name || !formData.start_date || !formData.value || !formData.end_date) {
            setError("Please fill in all required fields marked with *");
            setLoading(false);
            return;
        }

        try {
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
                notes: formData.notes || null,
            };

            // Backend requires description, defaulting for creation
            if (!isEditMode) {
                payload.description = "No description provided";
            }

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

                // Handle File Upload if file selected
                if (selectedFile) {
                    await uploadFile(result.id);
                }

                onSuccess && onSuccess(result);
                onClose();
            } else {
                const errData = await response.json();
                setError(errData.detail || (isEditMode ? "Failed to update" : "Failed to create"));
            }
        } catch (error) {
            console.error("Error saving agreement:", error);
            setError("An error occurred. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between bg-white z-10">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">
                            {isEditMode ? "Edit Agreement" : "New Agreement"}
                        </h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                            {isEditMode ? "Update agreement details" : "Create a new agreement"}
                        </p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg transition-colors">
                        <X size={24} className="text-slate-400 hover:text-slate-600" />
                    </button>
                </div>

                {/* Form Content */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        {/* Section 1: Basic Info */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Basic Information
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <input
                                    type="text"
                                    name="title"
                                    placeholder="Agreement Title *"
                                    value={formData.title}
                                    onChange={handleChange}
                                    className="col-span-2 px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    required
                                />
                                <input
                                    type="text"
                                    name="company_name"
                                    placeholder="Company Name *"
                                    value={formData.company_name}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                    required
                                />
                                <select
                                    name="agreement_type"
                                    value={formData.agreement_type}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 bg-white"
                                >
                                    <option value="service">Service Agreement</option>
                                    <option value="nda">NDA</option>
                                    <option value="consulting">Consulting</option>
                                    <option value="partnership">Partnership</option>
                                    <option value="vendor">Vendor</option>
                                    <option value="employment">Employment</option>
                                </select>
                                <input
                                    type="email"
                                    name="company_email"
                                    placeholder="Contact Email"
                                    value={formData.company_email}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                />
                                <input
                                    type="tel"
                                    name="company_phone"
                                    placeholder="Contact Phone"
                                    value={formData.company_phone}
                                    onChange={handleChange}
                                    className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                />
                            </div>
                        </div>

                        {/* Section 2: Financial & Dates */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Financial & Dates
                            </h3>
                            <div className="grid grid-cols-2 gap-4">
                                <div className="col-span-2 grid grid-cols-3 gap-4">
                                    <div className="col-span-2">
                                        <input
                                            type="number"
                                            name="value"
                                            placeholder="Value *"
                                            value={formData.value}
                                            onChange={handleChange}
                                            className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400"
                                            required
                                            step="0.01"
                                        />
                                    </div>
                                    <select
                                        name="currency"
                                        value={formData.currency}
                                        onChange={handleChange}
                                        className="px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 bg-white"
                                    >
                                        <option value="INR">INR (₹)</option>
                                        <option value="USD">USD ($)</option>
                                        <option value="EUR">EUR (€)</option>
                                    </select>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 ml-1">Start Date *</label>
                                    <input
                                        type="date"
                                        name="start_date"
                                        value={formData.start_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700"
                                        required
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-slate-500 ml-1">End Date *</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={formData.end_date}
                                        onChange={handleChange}
                                        className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700"
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 3: Terms & File */}
                        <div className="space-y-4">
                            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                                Terms & Documents
                            </h3>

                            <textarea
                                name="payment_terms"
                                placeholder="Payment Terms"
                                value={formData.payment_terms}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400 min-h-[80px] resize-none"
                            />

                            <textarea
                                name="notes"
                                placeholder="Internal Notes"
                                value={formData.notes}
                                onChange={handleChange}
                                className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:outline-none focus:border-indigo-600 focus:ring-1 focus:ring-indigo-600 transition-all font-medium text-slate-700 placeholder:text-slate-400 min-h-[80px] resize-none"
                            />

                            {/* File Upload UI */}
                            <div className="border-2 border-dashed border-slate-200 rounded-xl p-6 transition-all hover:border-indigo-300 hover:bg-slate-50">
                                <div className="flex flex-col items-center justify-center text-center">
                                    <input
                                        type="file"
                                        id="agreement-file"
                                        className="hidden"
                                        onChange={handleFileChange}
                                        accept=".pdf,.doc,.docx,.jpg,.png"
                                    />

                                    {selectedFile ? (
                                        <div className="flex items-center gap-3 bg-indigo-50 px-4 py-3 rounded-lg border border-indigo-100 w-full">
                                            <FileText size={20} className="text-indigo-600 flex-shrink-0" />
                                            <div className="text-left flex-1 min-w-0">
                                                <p className="text-sm font-bold text-indigo-900 truncate">
                                                    {selectedFile.name}
                                                </p>
                                                <p className="text-xs text-indigo-500">
                                                    {(selectedFile.size / 1024).toFixed(1)} KB
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => setSelectedFile(null)}
                                                className="p-1.5 hover:bg-indigo-100 rounded-md text-indigo-400 hover:text-indigo-700"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label
                                            htmlFor="agreement-file"
                                            className="cursor-pointer flex flex-col items-center group w-full"
                                        >
                                            <div className="w-12 h-12 bg-indigo-50 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                                                <Upload size={20} className="text-indigo-600" />
                                            </div>
                                            <p className="text-sm font-bold text-slate-700">
                                                {isEditMode ? "Replace Agreement Document" : "Upload Agreement Document"}
                                            </p>
                                            <p className="text-xs text-slate-400 mt-1">
                                                PDF, DOC, DOCX up to 10MB
                                            </p>
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Footer Buttons */}
                        <div className="flex items-center gap-3 pt-4">
                            <button
                                type="button"
                                onClick={onClose}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 py-3 px-4 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Saving...
                                    </>
                                ) : (
                                    isEditMode ? "Update Agreement" : "Create Agreement"
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddAgreementModal;
