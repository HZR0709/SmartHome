
import React from 'react';
import { Plus, Search, MoreVertical, Battery, BatteryCharging, BatteryLow, Power, Monitor, Wifi, Thermometer, Mic, Lock, Box, Video } from 'lucide-react';
import { Device } from '../types';

interface DeviceListPageProps {
    devices: Device[];
    onToggle: (id: string) => void;
    onOpenAdd: () => void;
    onDeviceClick?: (device: Device) => void;
}

export const DeviceListPage: React.FC<DeviceListPageProps> = ({ devices, onToggle, onOpenAdd, onDeviceClick }) => {
    
    const getBatteryIcon = (level?: string) => {
        if (level === 'high') return <BatteryCharging className="text-green-500" size={16} />;
        if (level === 'medium') return <Battery className="text-yellow-500" size={16} />;
        return <BatteryLow className="text-red-500" size={16} />;
    };

    const getIcon = (type: string) => {
        switch(type) {
            case 'camera': return Video;
            case 'wifi': return Wifi;
            case 'thermostat': return Thermometer;
            case 'speaker': return Mic;
            case 'lock': return Lock;
            case 'sensor': return Box;
            case 'plug': return Power;
            case 'light': return Power; // Or a Lightbulb icon if available
            default: return Power;
        }
    };

    return (
        <div className="flex-1 p-8 overflow-y-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <h2 className="text-2xl font-medium text-slate-200">设备</h2>
                <button 
                    onClick={onOpenAdd}
                    className="bg-blue-600 hover:bg-blue-500 text-white w-10 h-10 rounded-full flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all"
                >
                    <Plus size={24} />
                </button>
            </div>

            {/* Device Table */}
            <div className="bg-dark-800 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="text-slate-500 text-xs border-b border-slate-700/50">
                            <th className="p-6 font-medium">设备</th>
                            <th className="p-6 font-medium">名称</th>
                            <th className="p-6 font-medium">位置</th>
                            <th className="p-6 font-medium">状态</th>
                            <th className="p-6 font-medium">电量</th>
                            <th className="p-6 font-medium">日期</th>
                            <th className="p-6 font-medium w-10"></th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/50 text-sm">
                        {devices.map((device) => {
                            const Icon = getIcon(device.type);
                            return (
                                <tr 
                                    key={device.id} 
                                    className="group hover:bg-slate-700/20 transition-colors cursor-pointer"
                                    onClick={() => onDeviceClick && onDeviceClick(device)}
                                >
                                    <td className="p-6">
                                        <div className="w-10 h-10 bg-slate-700/50 rounded-xl flex items-center justify-center text-slate-400 group-hover:text-blue-400 group-hover:bg-blue-500/10 transition-colors">
                                            <Icon size={20} />
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-200 font-medium">{device.name}</td>
                                    <td className="p-6 text-slate-400">{device.location}</td>
                                    <td className="p-6" onClick={(e) => e.stopPropagation()}>
                                        <button 
                                            onClick={() => onToggle(device.id)}
                                            className={`w-9 h-5 rounded-full relative transition-colors ${device.isOn ? 'bg-blue-500' : 'bg-slate-600'}`}
                                        >
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform ${device.isOn ? 'translate-x-4' : ''}`} />
                                        </button>
                                    </td>
                                    <td className="p-6">
                                        <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center">
                                            {getBatteryIcon(device.batteryLevel)}
                                        </div>
                                    </td>
                                    <td className="p-6 text-slate-400">{device.lastUsed.split(' ')[0]}</td>
                                    <td className="p-6">
                                        <button className="text-slate-600 hover:text-white transition-colors">
                                            <MoreVertical size={18} />
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};