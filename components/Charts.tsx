
import React from 'react';
import { 
  PieChart, Pie, Cell, ResponsiveContainer, 
  BarChart, Bar, XAxis, Tooltip, YAxis, CartesianGrid, LineChart, Line, Legend
} from 'recharts';
import { EnergyStat, DailyUsage, AnalysisDataPoint } from '../types';

// --- Dashboard Charts ---

interface EnergyDonutProps {
  data: EnergyStat[];
}

export const EnergyDonut: React.FC<EnergyDonutProps> = ({ data }) => {
  const total = data.reduce((acc, curr) => acc + curr.value, 0);

  return (
    <div className="h-full w-full flex items-center justify-between">
      <div className="h-32 w-32 xl:h-40 xl:w-40 relative">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data as any[]}
              cx="50%"
              cy="50%"
              innerRadius="70%"
              outerRadius="90%"
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              cornerRadius={4}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-xl font-bold text-white">{total.toFixed(0)}</span>
          <span className="text-[10px] text-slate-400">Kw/h</span>
        </div>
      </div>
      
      <div className="flex flex-col gap-2 text-xs pr-2">
        {data.slice(0, 4).map((item, idx) => (
          <div key={idx} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
            <span className="text-slate-300 whitespace-nowrap">{item.name}</span>
            <span className="text-slate-500 ml-auto">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const DailyBarChart: React.FC<{ data: DailyUsage[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data as any[]} barSize={6}>
        <XAxis 
          dataKey="day" 
          axisLine={false} 
          tickLine={false} 
          tick={{ fill: '#64748b', fontSize: 10 }} 
          dy={5}
        />
        <Tooltip 
          cursor={{ fill: 'rgba(255,255,255,0.05)' }}
          contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', fontSize: '12px' }}
        />
        <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 4, 4]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export const DeviceLimitCircle: React.FC<{ used: number; total: number }> = ({ used, total }) => {
  const percentage = (used / total) * 100;
  const strokeDasharray = 2 * Math.PI * 40; 
  const strokeDashoffset = strokeDasharray - (percentage / 100) * strokeDasharray;

  return (
    <div className="relative w-full h-full flex items-center justify-center">
      <svg className="w-24 h-24 transform -rotate-90">
        <circle cx="50%" cy="50%" r="40" stroke="#1e293b" strokeWidth="8" fill="none" />
        <circle
          cx="50%"
          cy="50%"
          r="40"
          stroke="#3b82f6"
          strokeWidth="8"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-white">{used}</span>
        <div className="w-5 h-5 bg-blue-500 rounded-full text-[10px] flex items-center justify-center absolute bottom-0 right-0 text-white border-2 border-dark-800">
          {total - used}
        </div>
      </div>
    </div>
  );
};

// --- Analysis Page Charts ---

export const AnalysisLineChart: React.FC<{ data: AnalysisDataPoint[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data as any[]} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#334155" vertical={true} horizontal={true} opacity={0.2} />
        <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
        <Tooltip 
          contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
          itemStyle={{ fontSize: '12px' }}
        />
        <Line type="monotone" dataKey="bedroom" stroke="#10b981" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#10b981' }} />
        <Line type="monotone" dataKey="workspace" stroke="#f59e0b" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#f59e0b' }} />
        <Line type="monotone" dataKey="kitchen" stroke="#8b5cf6" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#8b5cf6' }} />
        <Line type="monotone" dataKey="garage" stroke="#ef4444" strokeWidth={2} dot={false} activeDot={{ r: 6, fill: '#ef4444' }} />
        
        {/* Highlight Line for July as seen in screenshot */}
        <line x1="58%" y1="10%" x2="58%" y2="90%" stroke="#3b82f6" strokeWidth={2} />
        <g transform="translate(680, 70)">
             <rect width="60" height="30" rx="4" fill="#3b82f6" />
             <text x="30" y="20" textAnchor="middle" fill="white" fontSize="12" fontWeight="bold">1,458</text>
        </g>
      </LineChart>
    </ResponsiveContainer>
  );
};

export const SmallSparkLine: React.FC<{ data: number[], color: string }> = ({ data, color }) => {
    const chartData = data.map((val, i) => ({ i, val }));
    return (
        <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData as any[]}>
                <Line type="monotone" dataKey="val" stroke={color} strokeWidth={2} dot={false} />
            </LineChart>
        </ResponsiveContainer>
    )
}

// --- History Page Charts ---

export const HistoryBarChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={data} barGap={4} barCategoryGap="20%">
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickCount={6} />
        <Tooltip cursor={{ fill: 'rgba(255,255,255,0.02)' }} contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
        <Bar dataKey="v1" fill="#3b82f6" radius={[2, 2, 0, 0]} maxBarSize={12} />
        <Bar dataKey="v2" fill="#f59e0b" radius={[2, 2, 0, 0]} maxBarSize={12} />
        <Bar dataKey="v3" fill="#10b981" radius={[2, 2, 0, 0]} maxBarSize={12} />
      </BarChart>
    </ResponsiveContainer>
  )
}

export const HistoryLineChart: React.FC<{ data: any[] }> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" vertical={true} horizontal={true} stroke="#334155" opacity={0.3} />
        <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} dy={10} />
        <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} tickCount={6} />
        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }} />
        <Line type="basis" dataKey="v1" stroke="#f59e0b" strokeWidth={3} dot={false} activeDot={{ r: 6, fill: '#f59e0b' }} />
        <Line type="basis" dataKey="v2" stroke="#10b981" strokeWidth={3} dot={false} />
        <Line type="basis" dataKey="v3" stroke="#3b82f6" strokeWidth={3} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}

export const ActivityGauge: React.FC<{ value: number }> = ({ value }) => {
    return (
        <div className="relative w-48 h-48 flex items-center justify-center">
            <PieChart width={192} height={192}>
                <Pie
                    data={[{ v: value }, { v: 100-value }]}
                    dataKey="v"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    startAngle={90}
                    endAngle={-270}
                    stroke="none"
                >
                    <Cell key="1" fill="#f59e0b" /> {/* Orange part */}
                    <Cell key="2" fill="#10b981" /> {/* Green part - simplified */}
                </Pie>
                 {/* This is a simplified static representation of the complex gauge in screenshot */}
                 <Pie
                    data={[{ v: 30 }, { v: 20 }, { v: 50 }]}
                    dataKey="v"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    stroke="none"
                 >
                     <Cell fill="#10b981" />
                     <Cell fill="#f59e0b" />
                     <Cell fill="#3b82f6" />
                 </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-light text-white">{value}</span>
                <span className="text-xs text-slate-400">活动</span>
            </div>
        </div>
    )
}
