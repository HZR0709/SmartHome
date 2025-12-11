
import React, { useState } from 'react';
import { AnalysisLineChart, SmallSparkLine } from './Charts';
import { AnalysisDataPoint } from '../types';
import { Video, Droplets, Zap, Monitor } from 'lucide-react';

interface SmartAnalysisPageProps {
    onOpenAI: () => void;
}

// Data Sets
const ANALYSIS_DATA_SETS = {
    day: [
        { month: '00:00', bedroom: 10, workspace: 5, kitchen: 0, garage: 2 },
        { month: '04:00', bedroom: 8, workspace: 2, kitchen: 0, garage: 1 },
        { month: '08:00', bedroom: 20, workspace: 15, kitchen: 30, garage: 5 },
        { month: '12:00', bedroom: 5, workspace: 50, kitchen: 20, garage: 2 },
        { month: '16:00', bedroom: 15, workspace: 45, kitchen: 40, garage: 10 },
        { month: '20:00', bedroom: 60, workspace: 20, kitchen: 50, garage: 15 },
        { month: '23:59', bedroom: 40, workspace: 10, kitchen: 10, garage: 5 },
    ],
    week: [
        { month: 'Mon', bedroom: 120, workspace: 300, kitchen: 200, garage: 50 },
        { month: 'Tue', bedroom: 110, workspace: 320, kitchen: 180, garage: 60 },
        { month: 'Wed', bedroom: 130, workspace: 310, kitchen: 210, garage: 55 },
        { month: 'Thu', bedroom: 125, workspace: 305, kitchen: 220, garage: 50 },
        { month: 'Fri', bedroom: 140, workspace: 280, kitchen: 250, garage: 70 },
        { month: 'Sat', bedroom: 180, workspace: 100, kitchen: 300, garage: 120 },
        { month: 'Sun', bedroom: 190, workspace: 80, kitchen: 320, garage: 130 },
    ],
    month: [
        { month: 'Week 1', bedroom: 800, workspace: 2000, kitchen: 1500, garage: 400 },
        { month: 'Week 2', bedroom: 850, workspace: 2100, kitchen: 1450, garage: 420 },
        { month: 'Week 3', bedroom: 820, workspace: 1900, kitchen: 1600, garage: 380 },
        { month: 'Week 4', bedroom: 880, workspace: 2200, kitchen: 1550, garage: 450 },
    ],
    year: [
        { month: '1月', bedroom: 150, workspace: 100, kitchen: 300, garage: 200 },
        { month: '2月', bedroom: 270, workspace: 400, kitchen: 350, garage: 220 },
        { month: '3月', bedroom: 320, workspace: 430, kitchen: 520, garage: 250 },
        { month: '4月', bedroom: 305, workspace: 390, kitchen: 580, garage: 240 },
        { month: '5月', bedroom: 325, workspace: 420, kitchen: 520, garage: 350 },
        { month: '6月', bedroom: 280, workspace: 400, kitchen: 410, garage: 300 },
        { month: '7月', bedroom: 320, workspace: 450, kitchen: 420, garage: 280 },
        { month: '8月', bedroom: 320, workspace: 420, kitchen: 490, garage: 300 },
        { month: '9月', bedroom: 380, workspace: 450, kitchen: 360, garage: 350 },
        { month: '10月', bedroom: 300, workspace: 440, kitchen: 400, garage: 320 },
        { month: '11月', bedroom: 270, workspace: 340, kitchen: 390, garage: 310 },
        { month: '12月', bedroom: 290, workspace: 430, kitchen: 380, garage: 300 },
    ]
};

const DETAIL_STATS = {
    day: { cam: '3.2 Wh', water: '12 L', light: '1.2 kWh', plug: '2.5 kWh' },
    week: { cam: '24 Wh', water: '90 L', light: '8.5 kWh', plug: '18 kWh' },
    month: { cam: '120 Wh', water: '320 L', light: '35 kWh', plug: '78 kWh' },
    year: { cam: '1.4 kWh', water: '3.8 m³', light: '420 kWh', plug: '950 kWh' }
};

const DetailCard: React.FC<{ 
    title: string; 
    icon: any; 
    time: string; 
    usage: string; 
    percentage: number;
    color: string;
    periodLabel: string;
}> = ({ title, icon: Icon, time, usage, percentage, color, periodLabel }) => (
    <div className="bg-dark-800 rounded-2xl p-6 flex items-center justify-between border border-slate-800/50">
        <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative flex items-center justify-center">
                {/* Simple SVG Circle Progress */}
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="50%" cy="50%" r="28" stroke="#1e293b" strokeWidth="6" fill="none" />
                    <circle 
                        cx="50%" cy="50%" r="28" stroke={color} strokeWidth="6" fill="none" 
                        strokeDasharray={2 * Math.PI * 28}
                        strokeDashoffset={2 * Math.PI * 28 * (1 - percentage/100)}
                        strokeLinecap="round"
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                    <Icon size={20} className="text-white" />
                </div>
            </div>
            <div>
                <h3 className="text-slate-400 text-sm mb-1">{title}</h3>
                <div className="text-xs text-slate-500 space-y-1">
                    <p className="flex items-center gap-2">
                        <span className="text-slate-300">{time}</span>
                        <span className="text-slate-600">(-2%)</span>
                    </p>
                    <p className="flex items-center gap-2">
                        <span className="text-slate-300">{usage}</span>
                        <span className="text-slate-600">(-5%)</span>
                    </p>
                </div>
            </div>
        </div>
        <div className="text-right">
            <span className="text-xs px-2 py-1 bg-dark-900 rounded text-slate-500">{periodLabel}</span>
        </div>
    </div>
);

const SparklineCard: React.FC<{ value: string; unit: string; label: string; data: number[]; color: string }> = ({ value, unit, label, data, color }) => (
    <div className="flex flex-col gap-2">
        <div className="flex items-baseline gap-1">
            <span className="text-2xl font-light text-white">{value}</span>
            <span className="text-[10px] text-slate-500 uppercase">{unit}</span>
        </div>
        <div className="text-xs text-slate-500">{label}</div>
        <div className="h-8 w-24">
            <SmallSparkLine data={data} color={color} />
        </div>
    </div>
);

export const SmartAnalysisPage: React.FC<SmartAnalysisPageProps> = ({ onOpenAI }) => {
    const [timeRange, setTimeRange] = useState<'day' | 'week' | 'month' | 'year'>('year');

    const getPeriodLabel = () => {
        switch(timeRange) {
            case 'day': return '今日';
            case 'week': return '本周';
            case 'month': return '本月';
            case 'year': return '今年';
        }
    };

    const stats = DETAIL_STATS[timeRange];

    return (
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-medium text-slate-200">智能分析</h2>
                <button 
                    onClick={onOpenAI}
                    className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 transition-all"
                >
                    <Zap size={16} />
                    AI 深度报告
                </button>
            </div>

            {/* Main Chart */}
            <div className="bg-dark-800 rounded-3xl p-6 mb-6 border border-slate-800/50 shadow-xl">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-slate-400 font-medium">能量消耗</h3>
                    <div className="flex gap-4">
                        {['日', '周', '月', '年'].map((period, i) => {
                             const rangeKey = period === '日' ? 'day' : period === '周' ? 'week' : period === '月' ? 'month' : 'year';
                             return (
                                <button 
                                    key={period} 
                                    onClick={() => setTimeRange(rangeKey as any)}
                                    className={`text-xs px-3 py-1 rounded transition-colors ${timeRange === rangeKey ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                                >
                                    {period}
                                </button>
                             );
                        })}
                    </div>
                </div>
                
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Legend / Totals */}
                    <div className="flex flex-col gap-4 min-w-[150px]">
                         {[
                             { name: '卧室', val: '12%', sub: '1034 KM', color: '#10b981' },
                             { name: '工作室', val: '16%', sub: '1034 KM', color: '#f59e0b' },
                             { name: '车库', val: '32%', sub: '1034 KM', color: '#ef4444' },
                             { name: '厨房', val: '18%', sub: '1034 KM', color: '#8b5cf6' },
                         ].map((item, idx) => (
                             <div key={idx} className="flex items-center gap-3">
                                 <div className="w-12 h-12 relative flex items-center justify-center">
                                     <svg className="w-full h-full transform -rotate-90">
                                        <circle cx="50%" cy="50%" r="20" stroke="#1e293b" strokeWidth="4" fill="none" />
                                        <circle cx="50%" cy="50%" r="20" stroke={item.color} strokeWidth="4" fill="none" strokeDasharray={125} strokeDashoffset={125 * (1 - parseInt(item.val)/100)} strokeLinecap="round" />
                                     </svg>
                                     <span className="absolute text-[10px] font-bold text-white">{item.val}</span>
                                 </div>
                                 <div className="flex flex-col">
                                     <span className="text-slate-300 text-xs font-medium">{item.name}</span>
                                     <span className="text-slate-600 text-[10px]">{item.sub}</span>
                                 </div>
                             </div>
                         ))}
                    </div>

                    {/* Line Chart */}
                    <div className="flex-1 h-[300px]">
                        <AnalysisLineChart data={ANALYSIS_DATA_SETS[timeRange]} />
                    </div>
                </div>
            </div>

            {/* Grid of details */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                <DetailCard title="摄像头" icon={Video} time="Active" usage={stats.cam} percentage={75} color="#3b82f6" periodLabel={getPeriodLabel()} />
                <DetailCard title="水量" icon={Droplets} time="Flow" usage={stats.water} percentage={60} color="#3b82f6" periodLabel={getPeriodLabel()} />
                <DetailCard title="大灯" icon={Zap} time="On time" usage={stats.light} percentage={80} color="#3b82f6" periodLabel={getPeriodLabel()} />
                <DetailCard title="插座" icon={Monitor} time="Load" usage={stats.plug} percentage={45} color="#3b82f6" periodLabel={getPeriodLabel()} />
            </div>

            {/* Bottom Sparklines */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 px-4">
                <SparklineCard value="174" unit="Kwh" label="客厅" color="#10b981" data={[10, 25, 15, 30, 12, 40, 20]} />
                <SparklineCard value="201" unit="Kwh" label="插座" color="#f59e0b" data={[15, 20, 10, 25, 18, 22, 30]} />
                <SparklineCard value="289" unit="Kwh" label="卧室" color="#ef4444" data={[30, 10, 25, 15, 40, 20, 35]} />
                <SparklineCard value="196" unit="Kwh" label="厨房" color="#8b5cf6" data={[20, 30, 15, 25, 10, 35, 20]} />
            </div>
        </div>
    );
};