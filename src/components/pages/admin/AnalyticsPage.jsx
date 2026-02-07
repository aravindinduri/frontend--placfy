import React from 'react';
import {
    Users, TrendingUp, TrendingDown, DollarSign,
    ShoppingCart, Globe, Activity, ArrowUpRight,
    ArrowDownRight, Filter, Calendar, Download
} from 'lucide-react';

const AnalyticsPage = () => {
    // Dummy Stats
    const stats = [
        { label: 'Total Revenue', value: '$128,430', change: '+12.5%', isUp: true, icon: <DollarSign size={20} />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: 'Active Users', value: '4,320', change: '+18.2%', isUp: true, icon: <Users size={20} />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
        { label: 'Total Orders', value: '1,840', change: '-3.1%', isUp: false, icon: <ShoppingCart size={20} />, color: 'text-orange-600', bg: 'bg-orange-50' },
        { label: 'Conversion Rate', value: '4.8%', change: '+0.5%', isUp: true, icon: <Activity size={20} />, color: 'text-sky-600', bg: 'bg-sky-50' },
    ];

    // Dummy Chart Data (Heights in percentage)
    const revenueData = [45, 60, 55, 80, 70, 90, 85, 95, 100, 80, 90, 85];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const topPerformers = [
        { name: 'Software Hub', sales: '840', growth: '+15%', color: 'bg-indigo-500' },
        { name: 'Creative Studio', sales: '620', growth: '+12%', color: 'bg-emerald-500' },
        { name: 'Marketing Pro', sales: '510', growth: '+8%', color: 'bg-sky-500' },
        { name: 'Analytics Tool', sales: '450', growth: '-2%', color: 'bg-orange-500' },
    ];

    return (
        <div className="flex flex-col h-full animate-in fade-in slide-in-from-bottom-4 duration-700 pb-8 overflow-y-auto pr-2 scrollbar-hide">
            {/* HEADER */}
            <header className="py-6 shrink-0 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-black text-slate-800 tracking-tight uppercase">Analytics Overview</h1>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">Real-time data and performance metrics</p>
                </div>
                <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 bg-white border border-slate-200 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
                        <Calendar size={14} />
                        Last 30 Days
                    </button>
                    <button className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all">
                        <Download size={14} />
                        Export Report
                    </button>
                </div>
            </header>

            {/* KPI GRID */}
            <div className="grid grid-cols-4 gap-6 mb-8">
                {stats.map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 hover:scale-[1.02] transition-transform cursor-pointer">
                        <div className="flex items-center justify-between mb-4">
                            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
                                {stat.icon}
                            </div>
                            <div className={`flex items-center gap-1 text-[10px] font-black uppercase ${stat.isUp ? 'text-emerald-500' : 'text-orange-500'}`}>
                                {stat.isUp ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change}
                            </div>
                        </div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-black text-slate-800 leading-none">{stat.value}</h3>
                    </div>
                ))}
            </div>

            {/* MAIN CHART SECTION */}
            <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                    <div className="flex items-center justify-between mb-10">
                        <div>
                            <h3 className="font-black text-slate-800 text-lg leading-tight">Revenue Stream</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Historical performance metrics</p>
                        </div>
                        <div className="flex gap-4">
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-indigo-500 rounded-full shadow-sm shadow-indigo-200"></span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Invoiced</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="w-3 h-3 bg-slate-200 rounded-full"></span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Pending</span>
                            </div>
                        </div>
                    </div>

                    {/* Chart Visualization */}
                    <div className="h-64 flex items-end justify-between gap-4 px-2 relative border-b border-slate-100 pb-4">
                        {/* Grid Lines */}
                        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
                            {[1, 2, 3, 4].map(line => (
                                <div key={line} className="w-full border-t border-slate-50 border-dashed"></div>
                            ))}
                        </div>

                        {revenueData.map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-4 group relative z-10">
                                <div
                                    style={{ height: `${height}%` }}
                                    className="w-full bg-indigo-500/10 rounded-t-2xl group-hover:bg-indigo-500/20 transition-all duration-500 relative flex flex-col justify-end overflow-hidden"
                                >
                                    <div
                                        style={{ height: `${height - 10}%` }}
                                        className="w-full bg-gradient-to-t from-indigo-600 to-indigo-500 rounded-t-2xl group-hover:from-indigo-500 group-hover:to-indigo-400 transition-all duration-300"
                                    ></div>
                                    {/* Tooltip */}
                                    <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[9px] font-black px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                        ${(height * 100).toLocaleString()}
                                    </div>
                                </div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{months[i]}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* SIDEBAR WIDGETS */}
                <div className="flex flex-col gap-8">
                    {/* TOP PERFORMERS */}
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100">
                        <h3 className="font-black text-slate-800 text-sm mb-6 uppercase tracking-wider">Top Workspaces</h3>
                        <div className="space-y-6">
                            {topPerformers.map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2.5 h-2.5 rounded-full ${item.color} shadow-sm ring-4 ring-slate-50`}></div>
                                        <span className="text-xs font-bold text-slate-700">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs font-black text-slate-800">{item.sales}</p>
                                        <p className={`text-[9px] font-black uppercase ${item.growth.startsWith('+') ? 'text-emerald-500' : 'text-orange-500'}`}>{item.growth}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button className="w-full mt-8 bg-slate-50 text-slate-400 font-black py-3 rounded-2xl text-[10px] uppercase tracking-widest hover:bg-indigo-50 hover:text-indigo-600 transition-all border border-transparent hover:border-indigo-100">
                            View All Assets
                        </button>
                    </div>

                    {/* LIVE ACTIVITY MINI */}
                    <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-2xl overflow-hidden relative group">
                        <div className="relative z-10">
                            <h4 className="text-lg font-black mb-2 flex items-center gap-2">
                                <Globe size={20} className="animate-pulse" />
                                Live Pulse
                            </h4>
                            <p className="text-indigo-100 text-xs font-bold opacity-80 leading-relaxed">
                                System is currently handling <span className="text-white">1.2k req/sec</span> with zero downtime.
                            </p>
                        </div>
                        <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform duration-700">
                            <TrendingUp size={120} />
                        </div>
                    </div>
                </div>
            </div>

            {/* SECONDARY TILES */}
            <div className="grid grid-cols-3 gap-8 mt-8">
                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 col-span-1">
                    <h3 className="font-black text-slate-800 text-sm mb-6 uppercase tracking-wider">Geographic Distribution</h3>
                    <div className="space-y-4">
                        <li className="flex justify-between items-center text-xs">
                            <span className="font-bold text-slate-500">United States</span>
                            <span className="font-black text-slate-800">42%</span>
                        </li>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-indigo-500 w-[42%]"></div>
                        </div>
                        <li className="flex justify-between items-center text-xs pt-2">
                            <span className="font-bold text-slate-500">United Kingdom</span>
                            <span className="font-black text-slate-800">18%</span>
                        </li>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-400 w-[18%]"></div>
                        </div>
                        <li className="flex justify-between items-center text-xs pt-2">
                            <span className="font-bold text-slate-500">Other Regions</span>
                            <span className="font-black text-slate-800">40%</span>
                        </li>
                        <div className="h-1.5 w-full bg-slate-50 rounded-full overflow-hidden">
                            <div className="h-full bg-slate-200 w-[40%]"></div>
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-[2.5rem] p-8 shadow-sm border border-slate-100 col-span-2 flex flex-col justify-center items-center text-center">
                    <div className="w-16 h-16 bg-indigo-50 rounded-3xl flex items-center justify-center text-indigo-600 mb-4 animate-bounce">
                        <ArrowUpRight size={32} />
                    </div>
                    <h4 className="text-xl font-black text-slate-800 mb-2">Record Growth Week!</h4>
                    <p className="text-slate-400 text-sm font-bold max-w-sm">
                        You've reached <span className="text-indigo-600 self-center">85% of your monthly goal</span>
                        in just 12 days. Keep pushing!
                    </p>
                    <button className="mt-8 bg-slate-900 text-white font-black px-8 py-3 rounded-2xl text-[10px] uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 active:scale-95 transition-all">
                        Deep Insights
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AnalyticsPage;
