
import React, { useState } from 'react';
import { 
  BarChart2, TrendingUp, PieChart, RefreshCw, MoreVertical, 
  AlertTriangle, Info, Settings, ChevronDown 
} from 'lucide-react';
import { HistoryBarChart, HistoryLineChart, ActivityGauge } from './Charts';
import { LogItem } from '../types';

// --- Mock Data ---

const HISTORY_DATA_SETS = {
    day: [
        { day: '6am', v1: 5, v2: 2, v3: 1 },
        { day: '9am', v1: 15, v2: 12, v3: 8 },
        { day: '12pm', v1: 10, v2: 15, v3: 12 },
        { day: '3pm', v1: 8, v2: 10, v3: 5 },
        { day: '6pm', v1: 20, v2: 25, v3: 15 },
        { day: '9pm', v1: 12, v2: 8, v3: 4 },
    ],
    week: [
        { day: '星期一', v1: 10, v2: 15, v3: 8 },
        { day: '星期二', v1: 7, v2: 18, v3: 25 },
        { day: '星期三', v1: 15, v2: 12, v3: 10 },
        { day: '星期四', v1: 20, v2: 22, v3: 15 },
        { day: '星期五', v1: 18, v2: 12, v3: 28 },
        { day: '星期六', v1: 5, v2: 28, v3: 8 },
        { day: '星期日', v1: 12, v2: 10, v3: 6 },
    ],
    month: [
        { day: 'Week 1', v1: 50, v2: 45, v3: 30 },
        { day: 'Week 2', v1: 60, v2: 55, v3: 40 },
        { day: 'Week 3', v1: 45, v2: 60, v3: 35 },
        { day: 'Week 4', v1: 70, v2: 50, v3: 45 },
    ],
    year: [
        { day: 'Jan', v1: 200, v2: 180, v3: 150 },
        { day: 'Mar', v1: 220, v2: 200, v3: 160 },
        { day: 'May', v1: 250, v2: 210, v3: 180 },
        { day: 'Jul', v1: 300, v2: 250, v3: 200 },
        { day: 'Sep', v1: 280, v2: 230, v3: 190 },
        { day: 'Nov', v1: 240, v2: 200, v3: 170 },
    ]
};

const LOGS: LogItem[] = [
    { id: '1', type: 'warning', date: '2022-02-17 11:37:56', message: '后院传感器检测到一些活动。' },
    { id: '2', type: 'info', date: '2022-02-17 11:37:56', message: '该系统的存储空间为89%。请升级您的计划以腾出一些空间。' },
    { id: '3', type: 'warning', date: '2022-02-17 11:37:56', message: '摄像头拍下了三张在后院发现的活动的照片。' },
    { id: '4', type: 'success', date: '2022-02-17 11:37:56', message: '每日系统备份已完成并上传至服务器。' },
    { id: '5', type: 'success', date: '2022-02-17 11:37:56', message: '付款选项已更改。' },
    { id: '6', type: 'info', date: '2022-02-17 11:37:56', message: '系统更新软件版本2.1.3现在可用。' },
];

export const HistoryPage: React.FC = () => {
    const [viewType, setViewType] = useState<'bar' | 'line' | 'overview'>('bar');
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('week');

    const renderLogIcon = (type: LogItem['type']) => {
        switch(type) {
            case 'warning': return <AlertTriangle size={16} className="text-orange-500" />;
            case 'info': return <Info size={16} className="text-blue-500" />;
            case 'success': return <Settings size={16} className="text-emerald-500" />; 
            case 'settings': return <Settings size={16} className="text-emerald-500" />;
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar flex flex-col h-full">
            
            {/* Header */}
            <div className="flex justify-between items-center mb-6 shrink-0">
                <div>
                    <h2 className="text-2xl font-medium text-slate-200">历史数据</h2>
                </div>
                
                <div className="flex items-center gap-4">
                    <div className="flex items-center text-sm text-slate-500">
                        排序: 
                        <span className="ml-2 text-slate-300 flex items-center cursor-pointer">分类 <ChevronDown size={14} className="ml-1"/></span>
                    </div>
                </div>
            </div>

            {/* Chart Container */}
            <div className="bg-dark-800 rounded-3xl p-6 border border-slate-700/50 shadow-xl mb-6">
                
                {/* Chart Header Controls */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                    <h3 className="text-slate-400 font-medium">活动历史</h3>
                    
                    <div className="flex items-center gap-4">
                        {/* View Switchers */}
                        <div className="flex gap-1 bg-dark-900 rounded-lg p-1">
                             <button onClick={() => setViewType('bar')} className={`p-1.5 rounded hover:bg-slate-700 ${viewType === 'bar' ? 'text-blue-400' : 'text-slate-500'}`}><BarChart2 size={18} /></button>
                             <button onClick={() => setViewType('line')} className={`p-1.5 rounded hover:bg-slate-700 ${viewType === 'line' ? 'text-blue-400' : 'text-slate-500'}`}><TrendingUp size={18} /></button>
                             <button onClick={() => setViewType('overview')} className={`p-1.5 rounded hover:bg-slate-700 ${viewType === 'overview' ? 'text-blue-400' : 'text-slate-500'}`}><PieChart size={18} /></button>
                             <button className="p-1.5 rounded hover:bg-slate-700 text-slate-500"><RefreshCw size={18} /></button>
                        </div>
                        
                        {/* Time Range Tabs */}
                        <div className="flex gap-1 bg-dark-900 rounded-lg p-1">
                            {['日', '周', '月', '年'].map(t => {
                                const rangeKey = t === '日' ? 'day' : t === '周' ? 'week' : t === '月' ? 'month' : 'year';
                                return (
                                    <button 
                                        key={t}
                                        onClick={() => setTimeRange(rangeKey as any)}
                                        className={`px-4 py-1.5 text-xs rounded-md transition-all ${timeRange === rangeKey ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                    >
                                        {t}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>

                {/* Main Visualization Area */}
                <div className="h-[350px] w-full">
                    {viewType === 'bar' && (
                        <HistoryBarChart data={HISTORY_DATA_SETS[timeRange]} />
                    )}
                    {viewType === 'line' && (
                        <HistoryLineChart data={HISTORY_DATA_SETS[timeRange]} />
                    )}
                    {viewType === 'overview' && (
                        <div className="flex h-full gap-8">
                             {/* Gauge / Donut Section */}
                             <div className="flex-1 flex flex-col items-center justify-center border-r border-slate-700/50 pr-8">
                                 <h4 className="text-slate-300 text-sm mb-8">按类别划分</h4>
                                 <div className="flex items-center gap-8">
                                     <ActivityGauge value={timeRange === 'week' ? 124 : 85} />
                                     <div className="flex flex-col gap-4 text-xs">
                                         <div className="flex items-center justify-between gap-8">
                                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500"></div><span className="text-slate-300">通知</span></div>
                                             <span className="text-slate-500">16%</span>
                                         </div>
                                         <div className="flex items-center justify-between gap-8">
                                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-orange-500"></div><span className="text-slate-300">系统警告</span></div>
                                             <span className="text-slate-500">22%</span>
                                         </div>
                                         <div className="flex items-center justify-between gap-8">
                                             <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-blue-500"></div><span className="text-slate-300">事件</span></div>
                                             <span className="text-slate-500">65%</span>
                                         </div>
                                     </div>
                                 </div>
                             </div>
                             
                             {/* Activity Time Bars */}
                             <div className="flex-1 flex flex-col items-center justify-center pl-8">
                                 <h4 className="text-slate-300 text-sm mb-6">活跃时间</h4>
                                 <div className="flex gap-4 items-end h-[200px]">
                                     {[10, 11, 12, 1, 2, 3].map((h, i) => (
                                         <div key={h} className="flex flex-col items-center gap-2">
                                             <div className="w-8 bg-dark-900 rounded-full h-[150px] flex flex-col justify-end p-1 overflow-hidden relative">
                                                 <div className="w-full bg-blue-500/20 rounded-full mb-1" style={{ height: '20%' }}></div>
                                                 <div className="w-full bg-blue-500/40 rounded-full mb-1" style={{ height: '30%' }}></div>
                                                 <div className="w-full bg-blue-500 rounded-full" style={{ height: `${Math.random() * 40 + 20}%` }}></div>
                                             </div>
                                             <span className="text-[10px] text-slate-500">{h}:00</span>
                                         </div>
                                     ))}
                                 </div>
                             </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Logs List */}
            <div className="bg-dark-800 rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden flex-1">
                 <div className="divide-y divide-slate-700/50">
                     {LOGS.map((log) => (
                         <div key={log.id} className="p-4 flex items-center hover:bg-slate-700/20 transition-colors group">
                             <div className="w-10 flex justify-center">
                                 {renderLogIcon(log.type)}
                             </div>
                             <div className="w-48 text-xs text-slate-500 font-mono pl-4">
                                 {log.date}
                             </div>
                             <div className="flex-1 text-sm text-slate-300">
                                 {log.message}
                             </div>
                             <div className="w-10 flex justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                 <button className="text-slate-500 hover:text-white"><MoreVertical size={16} /></button>
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </div>
    );
};