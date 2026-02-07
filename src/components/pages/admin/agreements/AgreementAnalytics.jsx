import { FileText, CheckCircle, Clock, AlertTriangle, XCircle, CreditCard } from 'lucide-react';

export default function AgreementAnalytics({ analytics }) {
    if (!analytics) return null;

    const stats = [
        {
            title: "Total Agreements",
            value: analytics.total_agreements,
            icon: <FileText className="text-indigo-600" size={20} />,
            color: "bg-indigo-50"
        },
        {
            title: "Active",
            value: analytics.active,
            icon: <CheckCircle className="text-emerald-600" size={20} />,
            color: "bg-emerald-50"
        },
        {
            title: "Pending",
            value: analytics.pending,
            icon: <Clock className="text-orange-600" size={20} />,
            color: "bg-orange-50"
        },
        {
            title: "Expiring Soon",
            value: analytics.expiring_soon,
            icon: <AlertTriangle className="text-yellow-600" size={20} />,
            color: "bg-yellow-50"
        },
        {
            title: "Expired",
            value: analytics.expired,
            icon: <XCircle className="text-red-600" size={20} />,
            color: "bg-red-50"
        },
        {
            title: "Total Value",
            value: analytics.total_value ? `$${parseFloat(analytics.total_value).toLocaleString()}` : '$0',
            icon: <CreditCard className="text-blue-600" size={20} />,
            color: "bg-blue-50"
        }
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
            {stats.map((stat, index) => (
                <StatCard key={index} {...stat} />
            ))}
        </div>
    );
}

function StatCard({ title, value, icon, color }) {
    return (
        <div className="bg-white p-5 rounded-[2rem] shadow-sm border border-slate-50 flex flex-col gap-3 hover:scale-[1.02] transition-transform cursor-pointer overflow-hidden">
            <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center shrink-0`}>
                {icon}
            </div>
            <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest truncate">{title}</p>
                <div className="flex items-end gap-2">
                    <span className="text-xl font-black text-slate-800 leading-none">{value}</span>
                </div>
            </div>
        </div>
    );
}
