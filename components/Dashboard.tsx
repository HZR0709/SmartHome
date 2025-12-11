
import React, { useState } from 'react';
import { MoreVertical, Plus, Power, Video, Wifi, Thermometer, Mic, Lock, Box, Sun, CloudRain, Wind } from 'lucide-react';
import { Device, EnergyStat, DailyUsage, NavPage, DashboardConfig } from '../types';
import { EnergyDonut, DailyBarChart, DeviceLimitCircle } from './Charts';

interface DashboardProps {
    devices: Device[];
    onToggleDevice: (id: string) => void;
    energyData: EnergyStat[];
    dailyStats: DailyUsage[];
    onOpenAddDevice: () => void;
    onNavigate: (page: NavPage) => void;
    config?: DashboardConfig;
}

const StatCard: React.FC<{ title: string; value: string; unit: string; trend?: 'up' | 'down' }> = ({ title, value, unit, trend }) => (
  <div className="flex-1 flex flex-col items-center justify-center p-4 border-r border-slate-700/50 last:border-r-0 hover:bg-white/5 transition-colors cursor-default group">
    <span className="text-slate-500 text-xs mb-1 group-hover:text-slate-400">{title}</span>
    <div className="flex items-baseline gap-1">
      <span className="text-2xl lg:text-3xl font-light text-white">{value}</span>
      <span className="text-[10px] text-slate-500">{unit}</span>
    </div>
    <div className="mt-1">
        {trend === 'up' && <span className="text-emerald-500 text-xs">↑</span>}
        {trend === 'down' && <span className="text-rose-500 text-xs">↓</span>}
    </div>
  </div>
);

const DeviceCard: React.FC<{ device: Device; onToggle: (id: string) => void }> = ({ device, onToggle }) => {
  const getIcon = (type: string) => {
    switch(type) {
        case 'camera': return Video;
        case 'wifi': return Wifi;
        case 'thermostat': return Thermometer;
        case 'speaker': return Mic;
        case 'lock': return Lock;
        case 'sensor': return Box;
        default: return Power;
    }
  };
  const Icon = getIcon(device.type);

  return (
    <div className={`
      relative p-4 rounded-2xl transition-all duration-300 min-w-[150px]
      ${device.isOn 
        ? 'bg-gradient-to-br from-dark-800 to-dark-900 border border-blue-500/30 shadow-lg shadow-blue-900/10' 
        : 'bg-dark-800/50 border border-transparent hover:bg-dark-800'}
    `}>
      <div className="flex justify-between items-start mb-6">
        <div className={`p-2 rounded-xl ${device.isOn ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30' : 'bg-dark-900 border border-slate-700 text-slate-500'}`}>
          <Icon size={18} />
        </div>
        
        <button 
            onClick={() => onToggle(device.id)}
            className={`w-9 h-5 rounded-full relative transition-colors duration-300 ${device.isOn ? 'bg-blue-500' : 'bg-slate-700'}`}
        >
            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-300 ${device.isOn ? 'translate-x-4' : ''}`} />
        </button>
      </div>
      
      <div className="flex flex-col">
        <h3 className={`text-sm font-medium ${device.isOn ? 'text-white' : 'text-slate-400'}`}>{device.name}</h3>
        <p className="text-slate-600 text-[10px] mt-1">上次使用</p>
        <p className="text-blue-400 text-[10px]">{device.lastUsed}</p>
      </div>
      
      {device.isOn && <div className="absolute top-4 right-12 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse"></div>}
    </div>
  );
};

// Mock Cameras
const CAMERAS: Record<string, { name: string; url: string }> = {
    'C1': { name: '客厅', url: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    'C2': { name: '厨房', url: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    'C3': { name: '后院', url: 'https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    'C4': { name: '车库', url: 'https://images.unsplash.com/photo-1506015391300-4802dc74de2e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
    'C5': { name: '婴儿房', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80' },
};

export const Dashboard: React.FC<DashboardProps> = ({ devices, onToggleDevice, energyData, dailyStats, onOpenAddDevice, onNavigate, config }) => {
    const [activeCamera, setActiveCamera] = useState('C1');
    
    // Determine layout/styling based on config
    const isCompact = config?.options.compactMode;
    const showWeather = config?.options.showWeather;
    const layoutId = config?.layoutId || 1;
    
    // Layout Logic: Layouts 5-8 swap the main columns
    const isSwappedLayout = layoutId >= 5;

    const gapClass = isCompact ? 'gap-4' : 'gap-6';
    const paddingClass = isCompact ? 'p-3' : 'p-5';
    const cardHeight = isCompact ? 'h-[200px]' : 'h-[230px]';

    const CameraSection = (
        <div className={`lg:col-span-8 bg-dark-800 rounded-3xl ${paddingClass} flex flex-col h-[400px] lg:h-[480px] shadow-xl shadow-black/20 border border-slate-800/50`}>
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-slate-300 font-medium ml-1">摄像头 - {CAMERAS[activeCamera].name}</h3>
                <div className="flex items-center gap-2">
                    <div className="bg-dark-900 p-1 rounded-lg flex gap-1">
                        {['C1','C2','C3','C4','C5'].map((cam) => (
                            <button 
                                key={cam} 
                                onClick={() => setActiveCamera(cam)}
                                className={`px-3 py-1 text-xs rounded-md transition-all ${activeCamera === cam ? 'bg-blue-600 text-white shadow' : 'text-slate-500 hover:text-slate-300'}`}
                            >
                                {cam}
                            </button>
                        ))}
                    </div>
                    <button className="p-1.5 hover:bg-slate-700 rounded-lg text-slate-500 transition-colors">
                        <MoreVertical size={18} />
                    </button>
                </div>
            </div>
            
            <div className="flex-1 relative rounded-2xl overflow-hidden bg-black group">
                <img 
                    key={activeCamera}
                    src={CAMERAS[activeCamera].url} 
                    alt="Camera Feed" 
                    className="w-full h-full object-cover opacity-90 transition-transform duration-1000 group-hover:scale-105 animate-in fade-in duration-300"
                />
                <div className="absolute top-6 left-6 text-white text-2xl font-light tracking-wide drop-shadow-lg">
                    2022/02/16 09:43AM
                </div>
                <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full flex items-center gap-2 text-white text-xs font-medium shadow-lg">
                    <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                    <span>录像中</span>
                </div>
            </div>
        </div>
    );

    const StatsSection = (
        <div className={`lg:col-span-4 flex flex-col ${gapClass}`}>
            
            {/* Weather Widget (Conditional) */}
            {showWeather && (
                <div className={`bg-gradient-to-br from-blue-600 to-blue-400 rounded-3xl ${paddingClass} text-white relative overflow-hidden flex items-center justify-between shadow-lg`}>
                    <div>
                         <div className="text-3xl font-bold mb-1">21°{config?.tempUnit}</div>
                         <div className="text-sm opacity-90">Cloudy</div>
                         <div className="text-xs opacity-75 mt-2">Beijing, China</div>
                    </div>
                    <div className="text-right">
                         <CloudRain size={48} className="mb-2 opacity-90" />
                         <div className="flex items-center gap-1 text-xs opacity-75 justify-end">
                             <Wind size={12} /> 12km/h
                         </div>
                    </div>
                </div>
            )}

            {/* Energy Donut */}
            <div 
                onClick={() => onNavigate(NavPage.ANALYSIS)}
                className={`bg-dark-800 rounded-3xl ${paddingClass} border border-slate-800/50 flex flex-col ${cardHeight} cursor-pointer hover:border-blue-500/30 transition-colors group`}
            >
                <div className="flex justify-between items-start mb-2">
                    <h3 className="text-slate-400 text-sm font-medium ml-1 group-hover:text-white transition-colors">房间耗电量</h3>
                    <MoreVertical size={16} className="text-slate-600 cursor-pointer hover:text-slate-400" />
                </div>
                <EnergyDonut data={energyData} />
            </div>

            {/* Bottom Stats Split */}
            <div className={`flex-1 grid grid-cols-2 ${gapClass} ${isCompact ? 'min-h-[180px]' : 'h-[226px]'}`}>
                {/* Daily Stats */}
                <div className={`bg-dark-800 rounded-3xl ${paddingClass} border border-slate-800/50 flex flex-col`}>
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-slate-400 text-sm">按日统计</h3>
                        <MoreVertical size={16} className="text-slate-600" />
                    </div>
                    <div className="flex-1 min-h-0">
                        <DailyBarChart data={dailyStats} />
                    </div>
                    <div className="text-center mt-2">
                        <button 
                            onClick={() => onNavigate(NavPage.HISTORY)}
                            className="text-[10px] text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded transition-colors"
                        >
                            查看更多信息
                        </button>
                    </div>
                </div>

                {/* Device Limit */}
                <div className={`bg-dark-800 rounded-3xl ${paddingClass} border border-slate-800/50 flex flex-col relative overflow-hidden`}>
                    <div className="flex justify-between items-center mb-2 z-10">
                        <h3 className="text-slate-400 text-sm">设备限制</h3>
                        <MoreVertical size={16} className="text-slate-600" />
                    </div>
                    <div className="flex-1 flex items-center justify-center z-10">
                        <DeviceLimitCircle used={10} total={15} />
                    </div>
                    <div className="text-center mt-2 z-10">
                        <button 
                            onClick={() => onNavigate(NavPage.DEVICES)}
                            className="text-[10px] text-blue-400 bg-blue-500/10 hover:bg-blue-500/20 px-2.5 py-1 rounded transition-colors"
                        >
                            查看更多信息
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className={`flex-1 overflow-y-auto ${isCompact ? 'p-4 space-y-4' : 'p-4 md:p-8 space-y-6'} custom-scrollbar`}>
          
          {/* Top Row: Camera + Charts (Order based on layout) */}
          <div className={`grid grid-cols-1 lg:grid-cols-12 ${gapClass}`}>
            {isSwappedLayout ? (
                <>
                    {StatsSection}
                    {CameraSection}
                </>
            ) : (
                <>
                    {CameraSection}
                    {StatsSection}
                </>
            )}
          </div>
          
          {/* Middle Stats Bar */}
          <div className={`bg-dark-800 rounded-2xl ${isCompact ? 'p-4' : 'p-6'} flex flex-col lg:flex-row gap-6 lg:items-center shadow-lg shadow-black/10 border border-slate-800/50`}>
            <div className="min-w-[100px]">
                <h3 className="text-slate-400 text-sm font-medium">按类别统计</h3>
                <p className="text-slate-600 text-xs mt-1">实时数据更新</p>
            </div>
            <div className="flex-1 grid grid-cols-2 md:grid-cols-5 gap-4 divide-x-0 md:divide-x divide-slate-700/50">
                <StatCard title="客厅" value="745" unit="瓦" trend="up" />
                <StatCard title="室外" value="20.0" unit={`°${config?.tempUnit || 'C'}`} trend="up" />
                <StatCard title="室内" value="15.3" unit={`°${config?.tempUnit || 'C'}`} trend="down" />
                <StatCard title="水量" value="494" unit="m³" trend="up" />
                <StatCard title="网络" value="45.3" unit="Mbps" trend="down" />
            </div>
          </div>

          {/* Bottom Device Controls */}
          <div className={`flex gap-4 overflow-x-auto pb-4 custom-scrollbar`}>
            <button 
                onClick={onOpenAddDevice}
                className="min-w-[80px] w-20 bg-dark-800/50 rounded-2xl border border-dashed border-slate-600 hover:border-blue-500 hover:bg-dark-800 flex items-center justify-center text-blue-500 transition-all group"
            >
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                    <Plus size={24} />
                </div>
            </button>
            
            {devices.map(device => (
                <DeviceCard key={device.id} device={device} onToggle={onToggleDevice} />
            ))}
          </div>
        </div>
    );
};
