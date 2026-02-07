import { X, FileText, Download } from "lucide-react";

const ViewAgreementModal = ({ isOpen, onClose, agreement }) => {
    if (!isOpen || !agreement) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-3xl p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h2 className="text-2xl font-black text-slate-800">Agreement Details</h2>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">View agreement information</p>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg">
                        <X size={24} className="text-slate-600" />
                    </button>
                </div>

                {/* Content */}
                <div className="space-y-6">
                    {/* Basic Information */}
                    <div className="space-y-3">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Basic Information</h3>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                            <InfoField label="Agreement Number" value={agreement.agreement_number || '-'} />
                            <InfoField label="Title" value={agreement.title} />
                            <InfoField label="Company Name" value={agreement.company_name} />
                            <InfoField label="Contact Email" value={agreement.company_email || '-'} />
                            <InfoField label="Contact Phone" value={agreement.company_phone || '-'} />
                            <InfoField label="Agreement Type" value={agreement.agreement_type_display} />
                            <InfoField label="Status" value={agreement.status_display} badge={agreement.status} />
                        </div>
                    </div>

                    {/* Dates & Financial */}
                    <div className="space-y-3">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Dates & Financial Details</h3>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                            <InfoField label="Start Date" value={agreement.start_date ? new Date(agreement.start_date).toLocaleDateString() : '-'} />
                            <InfoField label="End Date" value={agreement.end_date ? new Date(agreement.end_date).toLocaleDateString() : '-'} />
                            <InfoField label="Value" value={agreement.value ? `${parseFloat(agreement.value).toLocaleString()} ${agreement.currency}` : '-'} />
                            <InfoField label="Currency" value={agreement.currency} />
                        </div>
                    </div>

                    {/* Terms & Notes */}
                    <div className="space-y-3">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Terms & Notes</h3>
                        <div className="space-y-4">
                            {agreement.payment_terms && (
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Payment Terms</p>
                                    <p className="text-slate-700">{agreement.payment_terms}</p>
                                </div>
                            )}
                            {agreement.description && (
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Description</p>
                                    <p className="text-slate-700">{agreement.description}</p>
                                </div>
                            )}
                            {agreement.notes && (
                                <div className="bg-slate-50 p-4 rounded-2xl">
                                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Internal Notes</p>
                                    <p className="text-slate-700">{agreement.notes}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-3">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Metadata</h3>
                        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl">
                            <InfoField label="Created At" value={new Date(agreement.created_at).toLocaleString()} />
                            <InfoField label="Updated At" value={new Date(agreement.updated_at).toLocaleString()} />
                        </div>
                    </div>
                    {/* Files Section */}
                    <div className="space-y-3">
                        <h3 className="font-black text-slate-800 text-sm uppercase tracking-wider">Attached Documents</h3>
                        {agreement.files && agreement.files.length > 0 ? (
                            <div className="grid grid-cols-1 gap-2">
                                {agreement.files.map((file) => (
                                    <div key={file.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:border-indigo-200 transition-colors">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-600">
                                                <FileText size={20} />
                                            </div>
                                            <div>
                                                <p className="font-bold text-slate-700 text-sm">{file.file_name}</p>
                                                <p className="text-xs text-slate-500">{file.file_type_display || 'Document'} • {(file.file_size / 1024).toFixed(1)} KB</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="bg-slate-50 rounded-xl p-6 text-center border border-dashed border-slate-200">
                                <p className="text-slate-400 font-medium text-sm">No documents attached</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end pt-8 border-t border-slate-200 mt-8">
                    <button
                        onClick={onClose}
                        className="px-6 py-2 rounded-lg font-bold text-sm uppercase text-indigo-600 hover:bg-indigo-50"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

function InfoField({ label, value, badge }) {
    const badgeColors = {
        active: "bg-emerald-50 text-emerald-700",
        draft: "bg-slate-100 text-slate-600",
        expired: "bg-red-50 text-red-700",
        terminated: "bg-red-50 text-red-700",
        pending: "bg-orange-50 text-orange-700",
    };

    return (
        <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">{label}</p>
            {badge ? (
                <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${badgeColors[badge] || "bg-slate-100 text-slate-600"}`}>
                    {value}
                </span>
            ) : (
                <p className="text-slate-700 font-medium">{value}</p>
            )}
        </div>
    );
}

export default ViewAgreementModal;
