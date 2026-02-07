import { Eye, Edit, Trash2, FileText } from 'lucide-react';

export default function AgreementList({ agreements, onView, onEdit, onDelete }) {
    return (
        <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
            <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-600">
                    <FileText size={20} />
                </div>
                <h2 className="font-black text-slate-800 text-lg">All Agreements ({agreements.length})</h2>
            </div>

            {agreements.length === 0 ? (
                <div className="text-center py-12">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500 font-bold">No agreements found</p>
                </div>
            ) : (
                <div className="overflow-auto max-h-96">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-slate-200">
                                <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Title</th>
                                <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Company</th>
                                <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Type</th>
                                <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Status</th>
                                <th className="text-left py-3 px-4 font-black text-slate-700 uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {agreements.map((agreement) => (
                                <tr key={agreement.id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 px-4 font-medium text-slate-700">{agreement.title}</td>
                                    <td className="py-4 px-4 text-slate-600">{agreement.company_name}</td>
                                    <td className="py-4 px-4">
                                        <span className="inline-block bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase">
                                            {agreement.agreement_type_display}
                                        </span>
                                    </td>
                                    <td className="py-4 px-4">
                                        <StatusBadge status={agreement.status} label={agreement.status_display} />
                                    </td>
                                    <td className="py-4 px-4">
                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={() => onView && onView(agreement)}
                                                className="p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                                title="View"
                                            >
                                                <Eye size={16} className="text-slate-400 group-hover:text-blue-600" />
                                            </button>
                                            <button
                                                onClick={() => onEdit && onEdit(agreement)}
                                                className="p-2 hover:bg-indigo-50 rounded-lg transition-colors group"
                                                title="Edit"
                                            >
                                                <Edit size={16} className="text-slate-400 group-hover:text-indigo-600" />
                                            </button>
                                            <button
                                                onClick={() => onDelete && onDelete(agreement)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors group"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} className="text-slate-400 group-hover:text-red-600" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

function StatusBadge({ status, label }) {
    const colors = {
        active: "bg-emerald-50 text-emerald-700",
        draft: "bg-slate-100 text-slate-600",
        expired: "bg-red-50 text-red-700",
        terminated: "bg-red-50 text-red-700",
        pending: "bg-orange-50 text-orange-700",
    };

    return (
        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase ${colors[status] || "bg-slate-100 text-slate-600"}`}>
            {label || status}
        </span>
    );
}
