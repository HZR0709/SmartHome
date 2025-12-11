
import React, { useState, useEffect } from 'react';
import { 
    X, Check, Wifi, Type, Calendar as CalendarIcon, Clock, ChevronDown, 
    CreditCard, Trash2, Plus, Key, Shield, Smartphone, LogOut, Laptop, Monitor,
    Thermometer, Sun, Power, Zap, Battery, Activity, Volume2, Eye, Loader2,
    Video, Mic, Lock as LockIcon, Box
} from 'lucide-react';
import { Device, DashboardConfig, UsageEvent } from '../types';

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface SettingsModalProps extends ModalProps {
    config: DashboardConfig;
    onSave: (config: DashboardConfig) => void;
}

interface DeviceModalProps extends ModalProps {
    device: Device;
    onToggle: (id: string) => void;
}

interface AddUsageModalProps extends ModalProps {
    onAdd: (newEvent: UsageEvent) => void;
}

interface AddDeviceModalProps extends ModalProps {
    onAdd: (device: Partial<Device>) => Promise<void>;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, config, onSave }) => {
    const [activeTab, setActiveTab] = useState<'params' | 'layout' | 'options'>('layout');
    const [selectedLayout, setSelectedLayout] = useState(config.layoutId);
    const [isSaving, setIsSaving] = useState(false);
    
    // Params State
    const [homeName, setHomeName] = useState(config.homeName);
    const [tempUnit, setTempUnit] = useState(config.tempUnit);
    const [currency, setCurrency] = useState(config.currency);
    
    // Options State
    const [options, setOptions] = useState(config.options);

    // Reset state from config when opening
    useEffect(() => {
        if (isOpen) {
            setIsSaving(false);
            setSelectedLayout(config.layoutId);
            setHomeName(config.homeName);
            setTempUnit(config.tempUnit);
            setCurrency(config.currency);
            setOptions(config.options);
        }
    }, [isOpen, config]);

    if (!isOpen) return null;

    const toggleOption = (key: keyof typeof options) => {
        setOptions(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSave = () => {
        setIsSaving(true);
        // Simulate API call
        setTimeout(() => {
            const newConfig: DashboardConfig = {
                layoutId: selectedLayout,
                homeName,
                tempUnit,
                currency,
                options
            };
            onSave(newConfig);
            setIsSaving(false);
            onClose();
        }, 600);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                
                {/* Header */}
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50 shrink-0">
                    <h2 className="text-xl font-medium text-white">我的家-设置</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors">
                        <X size={20} />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mt-6 shrink-0">
                    <div className="bg-dark-900 rounded-lg p-1 flex">
                        <button onClick={() => setActiveTab('params')} className={`px-6 py-1.5 text-sm rounded-md transition-all ${activeTab === 'params' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>参数</button>
                        <button onClick={() => setActiveTab('layout')} className={`px-6 py-1.5 text-sm rounded-md transition-all ${activeTab === 'layout' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>布局</button>
                        <button onClick={() => setActiveTab('options')} className={`px-6 py-1.5 text-sm rounded-md transition-all ${activeTab === 'options' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white'}`}>选项</button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-8 min-h-[300px] overflow-y-auto custom-scrollbar flex-1">
                    
                    {activeTab === 'params' && (
                        <div className="space-y-6 max-w-sm mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-200">
                             <div>
                                <label className="text-xs text-slate-500 mb-1.5 block uppercase font-bold tracking-wider">家庭名称</label>
                                <input 
                                    type="text" 
                                    value={homeName} 
                                    onChange={(e) => setHomeName(e.target.value)}
                                    className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none focus:border-blue-500 transition-colors" 
                                />
                             </div>
                             
                             <div>
                                <label className="text-xs text-slate-500 mb-1.5 block uppercase font-bold tracking-wider">温度单位</label>
                                <div className="flex bg-dark-900 rounded-lg p-1 border border-slate-700">
                                    <button onClick={() => setTempUnit('C')} className={`flex-1 py-1.5 text-sm rounded transition-all ${tempUnit === 'C' ? 'bg-slate-700 text-white shadow ring-1 ring-slate-600' : 'text-slate-500 hover:text-slate-300'}`}>摄氏度 (°C)</button>
                                    <button onClick={() => setTempUnit('F')} className={`flex-1 py-1.5 text-sm rounded transition-all ${tempUnit === 'F' ? 'bg-slate-700 text-white shadow ring-1 ring-slate-600' : 'text-slate-500 hover:text-slate-300'}`}>华氏度 (°F)</button>
                                </div>
                             </div>

                             <div>
                                <label className="text-xs text-slate-500 mb-1.5 block uppercase font-bold tracking-wider">显示货币</label>
                                <div className="relative">
                                    <select 
                                        value={currency} 
                                        onChange={(e) => setCurrency(e.target.value)}
                                        className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none appearance-none focus:border-blue-500 transition-colors cursor-pointer"
                                    >
                                        <option value="CNY">人民币 (¥)</option>
                                        <option value="USD">美元 ($)</option>
                                        <option value="EUR">欧元 (€)</option>
                                    </select>
                                    <ChevronDown className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                                </div>
                             </div>
                        </div>
                    )}

                    {activeTab === 'layout' && (
                        <div className="flex flex-col items-center animate-in fade-in slide-in-from-right-4 duration-200">
                            <p className="text-slate-400 text-sm mb-6">自定义概览页面布局，选择最适合你需要的。</p>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                                    <div 
                                        key={i}
                                        onClick={() => setSelectedLayout(i)}
                                        className={`
                                            relative aspect-video rounded-xl border-2 cursor-pointer transition-all duration-200 overflow-hidden
                                            ${selectedLayout === i 
                                                ? 'border-blue-500 bg-blue-500/10 shadow-[0_0_15px_rgba(59,130,246,0.2)] scale-[1.02]' 
                                                : 'border-slate-700/50 hover:border-slate-500 bg-dark-900/50'}
                                        `}
                                    >
                                        {/* Mock Layout Shapes */}
                                        <div className="absolute inset-2 flex gap-1 opacity-50 pointer-events-none">
                                            {i <= 4 ? (
                                                // Layouts 1-4: Left large
                                                <>
                                                    <div className="bg-slate-600/50 rounded-sm w-2/3 h-full"></div>
                                                    <div className="flex-1 flex flex-col gap-1 h-full">
                                                         <div className="bg-slate-600/50 h-1/2 rounded-sm w-full"></div>
                                                         <div className="bg-slate-600/50 h-1/2 rounded-sm w-full"></div>
                                                    </div>
                                                </>
                                            ) : (
                                                // Layouts 5-8: Right large
                                                <>
                                                    <div className="flex-1 flex flex-col gap-1 h-full">
                                                         <div className="bg-slate-600/50 h-1/2 rounded-sm w-full"></div>
                                                         <div className="bg-slate-600/50 h-1/2 rounded-sm w-full"></div>
                                                    </div>
                                                    <div className="bg-slate-600/50 rounded-sm w-2/3 h-full"></div>
                                                </>
                                            )}
                                        </div>
                                        
                                        {selectedLayout === i && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-blue-500/20 backdrop-blur-[1px]">
                                                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white shadow-lg animate-in zoom-in duration-200">
                                                    <Check size={16} strokeWidth={3} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'options' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-200">
                             {[
                                 { key: 'animations', label: '界面动画', icon: Activity, desc: '启用平滑过渡效果' },
                                 { key: 'sounds', label: '交互音效', icon: Volume2, desc: '点击时的声音反馈' },
                                 { key: 'showWeather', label: '天气微件', icon: Sun, desc: '在首页显示天气' },
                                 { key: 'compactMode', label: '紧凑模式', icon: Eye, desc: '缩小间距以显示更多内容' },
                             ].map((opt) => (
                                 <div 
                                    key={opt.key} 
                                    onClick={() => toggleOption(opt.key as any)}
                                    className={`
                                        p-4 rounded-xl border cursor-pointer transition-all duration-200 flex flex-col gap-2 group
                                        ${options[opt.key as keyof typeof options] 
                                            ? 'bg-blue-500/10 border-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.1)]' 
                                            : 'bg-dark-900 border-slate-700 hover:border-slate-500'}
                                    `}
                                 >
                                     <div className="flex justify-between items-start">
                                         <opt.icon size={20} className={`transition-colors ${options[opt.key as keyof typeof options] ? 'text-blue-400' : 'text-slate-500 group-hover:text-slate-400'}`} />
                                         <div className={`w-10 h-5 rounded-full relative transition-colors duration-200 ${options[opt.key as keyof typeof options] ? 'bg-blue-500' : 'bg-slate-700'}`}>
                                            <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${options[opt.key as keyof typeof options] ? 'translate-x-5' : ''}`}></div>
                                         </div>
                                     </div>
                                     <div>
                                         <div className={`text-sm font-medium transition-colors ${options[opt.key as keyof typeof options] ? 'text-white' : 'text-slate-300'}`}>{opt.label}</div>
                                         <div className="text-[10px] text-slate-500">{opt.desc}</div>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    )}

                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3 bg-dark-900/50 shrink-0">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white text-sm transition-colors">取消</button>
                    <button 
                        onClick={handleSave} 
                        disabled={isSaving}
                        className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed w-24 justify-center"
                    >
                        {isSaving ? <Loader2 size={16} className="animate-spin" /> : '保存'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export const AddDeviceModal: React.FC<AddDeviceModalProps> = ({ isOpen, onClose, onAdd }) => {
    const [step, setStep] = useState(1);
    const [isLoading, setIsLoading] = useState(false);
    
    // Form State
    const [name, setName] = useState('');
    const [location, setLocation] = useState('客厅');
    const [type, setType] = useState<Device['type']>('light');

    // Device Types with Icons
    const deviceTypes: { id: Device['type']; label: string; icon: any }[] = [
        { id: 'light', label: '灯光', icon: Power },
        { id: 'plug', label: '插座', icon: Monitor },
        { id: 'camera', label: '摄像头', icon: Video },
        { id: 'wifi', label: 'Wi-Fi', icon: Wifi },
        { id: 'thermostat', label: '温控', icon: Thermometer },
        { id: 'speaker', label: '音箱', icon: Mic },
        { id: 'lock', label: '门锁', icon: LockIcon },
        { id: 'sensor', label: '传感器', icon: Box },
    ];

    const locations = ['客厅', '厨房', '卧室', '浴室', '工作室', '车库', '走廊', '室外'];

    useEffect(() => {
        if (isOpen) {
            setStep(1);
            setName('');
            setLocation('客厅');
            setType('light');
        }
    }, [isOpen]);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        if (!name.trim()) return; // Validation
        setIsLoading(true);
        await onAdd({
            name,
            location,
            type,
            isOn: false
        });
        setIsLoading(false);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
             <div className="bg-dark-800 w-full max-w-xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <h2 className="text-lg font-medium text-white">添加设备</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 min-h-[400px]">
                    {step === 1 ? (
                        <div className="flex flex-col gap-6 h-full justify-center">
                            <p className="text-slate-400 text-center mb-4">请选择添加设备的方式</p>
                            <div className="flex gap-6">
                                <button className="flex-1 aspect-square bg-dark-700/30 rounded-2xl border border-slate-600 hover:border-blue-500 hover:bg-dark-700/50 transition-all flex flex-col items-center justify-center gap-4 group">
                                    <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                        <Wifi size={32} className="text-slate-500 group-hover:text-blue-400 transition-colors animate-pulse" />
                                    </div>
                                    <span className="text-slate-300 font-medium group-hover:text-white">智能发现</span>
                                    <span className="text-xs text-slate-500">搜索局域网设备</span>
                                </button>
                                
                                <button 
                                    onClick={() => setStep(2)}
                                    className="flex-1 aspect-square bg-dark-700/30 rounded-2xl border border-blue-500/50 bg-blue-500/5 hover:bg-blue-500/10 transition-all flex flex-col items-center justify-center gap-4 group relative"
                                >
                                    <div className="w-16 h-16 rounded-full bg-blue-500/20 flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                                        <Type size={32} className="text-blue-400" />
                                    </div>
                                    <span className="text-white font-medium">手动添加</span>
                                    <span className="text-xs text-blue-400/70">输入设备信息</span>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-6 animate-in slide-in-from-right-4 duration-300">
                             <div className="space-y-5">
                                <div>
                                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold tracking-wider">设备名称</label>
                                    <input 
                                        type="text" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="例如：客厅大灯"
                                        className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm outline-none focus:border-blue-500 transition-colors" 
                                    />
                                </div>
                                
                                <div>
                                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold tracking-wider">设备类型</label>
                                    <div className="grid grid-cols-4 gap-3">
                                        {deviceTypes.map((t) => (
                                            <div 
                                                key={t.id}
                                                onClick={() => setType(t.id)}
                                                className={`
                                                    flex flex-col items-center justify-center p-3 rounded-xl border cursor-pointer transition-all gap-2
                                                    ${type === t.id 
                                                        ? 'bg-blue-500/20 border-blue-500 text-white shadow-[0_0_10px_rgba(59,130,246,0.2)]' 
                                                        : 'bg-dark-900 border-slate-700 text-slate-500 hover:border-slate-500 hover:text-slate-300'}
                                                `}
                                            >
                                                <t.icon size={20} />
                                                <span className="text-xs">{t.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs text-slate-500 mb-2 block uppercase font-bold tracking-wider">位置</label>
                                    <div className="relative">
                                        <select 
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-200 text-sm outline-none appearance-none focus:border-blue-500 transition-colors cursor-pointer"
                                        >
                                            {locations.map(loc => (
                                                <option key={loc} value={loc}>{loc}</option>
                                            ))}
                                        </select>
                                        <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={16} />
                                    </div>
                                </div>
                             </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3 bg-dark-900/50">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white text-sm transition-colors">取消</button>
                    {step === 2 && (
                        <button 
                            onClick={handleSubmit} 
                            disabled={isLoading || !name.trim()}
                            className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm shadow-lg shadow-blue-600/20 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? <Loader2 size={16} className="animate-spin" /> : '确认添加'}
                        </button>
                    )}
                </div>
             </div>
        </div>
    )
}

export const AddUsageModal: React.FC<AddUsageModalProps> = ({ isOpen, onClose, onAdd }) => {
    if (!isOpen) return null;

    const handleAdd = () => {
        // In a real app, this would come from form state
        const newEvent: UsageEvent = {
            id: Date.now().toString(),
            deviceId: 'l1',
            deviceName: '新设备频率',
            title: '手动添加的规则',
            dayIndex: 1, // Defaulting to Tuesday for demo
            startHour: 12,
            duration: 2,
            type: 'light',
            colorClass: 'border-blue-500/50 bg-blue-500/20 text-blue-400'
        };
        onAdd(newEvent);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
             <div className="bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                
                {/* Header */}
                <div className="flex justify-between items-start p-8 pb-4">
                    <h2 className="text-xl font-medium text-white">添加设备频率</h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                {/* Form Body */}
                <div className="px-8 pb-8 pt-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    
                    {/* Left Col */}
                    <div className="space-y-4">
                        <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">名称</label>
                            <input 
                                type="text" 
                                placeholder="把灯打开..." 
                                className="w-full bg-dark-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">选择设备</label>
                            <div className="relative">
                                <select className="w-full bg-dark-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none appearance-none transition-colors">
                                    <option>请选择</option>
                                    <option>卧室大灯</option>
                                    <option>客厅空调</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">选择时间</label>
                            <div className="relative">
                                <div className="w-full bg-dark-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm flex items-center justify-between cursor-pointer transition-colors">
                                    <span>10:30 AM - 4:00 PM</span>
                                    <Clock size={16} className="text-slate-500" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Col */}
                    <div className="space-y-4">
                         <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">从模板中选择</label>
                            <div className="relative">
                                <select className="w-full bg-dark-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm outline-none appearance-none transition-colors">
                                    <option>请选择</option>
                                    <option>节能模式</option>
                                    <option>离家模式</option>
                                </select>
                                <ChevronDown className="absolute right-3 top-3 text-slate-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                        <div>
                            <label className="text-xs text-slate-500 mb-1.5 block">选择日期</label>
                            <div className="relative">
                                <div className="w-full bg-dark-900 border border-slate-700 hover:border-blue-500 focus:border-blue-500 rounded-lg px-4 py-2.5 text-slate-200 text-sm flex items-center justify-between cursor-pointer transition-colors">
                                    <span>星期一</span>
                                    <CalendarIcon size={16} className="text-slate-500" />
                                </div>
                            </div>
                        </div>

                         <div className="pt-6 flex flex-col gap-3">
                             {['重复', '发送通知', '设置为默认'].map((opt, i) => (
                                 <label key={opt} className="flex items-center gap-3 cursor-pointer group">
                                     <div className={`w-4 h-4 rounded-full border border-slate-600 flex items-center justify-center ${i === 0 || i === 1 ? 'bg-blue-500 border-blue-500' : 'group-hover:border-blue-400'}`}>
                                         {(i === 0 || i === 1) && <div className="w-1.5 h-1.5 bg-white rounded-full"></div>}
                                     </div>
                                     <span className="text-sm text-slate-300">{opt}</span>
                                 </label>
                             ))}
                         </div>
                    </div>
                </div>
                
                <div className="px-8 pb-4">
                    <button className="text-xs text-slate-500 flex items-center gap-1 hover:text-blue-400 transition-colors">
                        <ChevronDown size={14} /> 高级选项
                    </button>
                </div>

                <div className="p-6 border-t border-slate-700/50 flex justify-end gap-3 bg-dark-900/50">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg text-slate-400 hover:text-white text-sm transition-colors">取消</button>
                    <button onClick={handleAdd} className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm shadow-lg shadow-blue-600/20 transition-colors">添加频率</button>
                </div>
             </div>
        </div>
    )
}

export const PaymentModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <CreditCard size={20} className="text-blue-500" /> 
                        支付方式
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Card List */}
                    <div className="mb-8">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-slate-300 text-sm font-medium">我的银行卡</h3>
                            <button className="text-xs text-blue-500 hover:text-blue-400 flex items-center gap-1">
                                <Plus size={14} /> 添加新卡
                            </button>
                        </div>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Card 1 */}
                            <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl p-5 text-white shadow-lg relative group overflow-hidden">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-white/70 hover:text-white"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-bold text-lg italic">VISA</span>
                                    <Wifi size={20} className="transform rotate-90 opacity-70" />
                                </div>
                                <div className="mb-4">
                                    <div className="text-xs opacity-70 mb-1">Card Number</div>
                                    <div className="font-mono tracking-wider text-lg">**** **** **** 4242</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] opacity-70">Card Holder</div>
                                        <div className="text-sm font-medium">JIANAN SUCAI</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] opacity-70">Expires</div>
                                        <div className="text-sm font-medium">12/24</div>
                                    </div>
                                </div>
                            </div>

                            {/* Card 2 */}
                            <div className="bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 rounded-xl p-5 text-slate-300 shadow-lg relative group">
                                <div className="absolute top-0 right-0 p-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-slate-400 hover:text-white"><Trash2 size={16} /></button>
                                </div>
                                <div className="flex justify-between items-start mb-6">
                                    <span className="font-bold text-lg flex gap-1">
                                        <div className="w-6 h-6 bg-red-500/80 rounded-full"></div>
                                        <div className="w-6 h-6 bg-yellow-500/80 rounded-full -ml-3"></div>
                                    </span>
                                </div>
                                <div className="mb-4">
                                    <div className="text-xs opacity-50 mb-1">Card Number</div>
                                    <div className="font-mono tracking-wider text-lg">**** **** **** 8888</div>
                                </div>
                                <div className="flex justify-between items-end">
                                    <div>
                                        <div className="text-[10px] opacity-50">Card Holder</div>
                                        <div className="text-sm font-medium">JIANAN SUCAI</div>
                                    </div>
                                    <div>
                                        <div className="text-[10px] opacity-50">Expires</div>
                                        <div className="text-sm font-medium">09/25</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Transaction History */}
                    <div>
                        <h3 className="text-slate-300 text-sm font-medium mb-4">交易记录</h3>
                        <div className="space-y-3">
                            {[
                                { name: 'SmartHome Pro 订阅 (月付)', date: '2022-02-17', amount: '-$12.00', status: '成功' },
                                { name: '云存储扩容 1TB', date: '2022-02-10', amount: '-$5.00', status: '成功' },
                                { name: '设备维护服务', date: '2022-01-28', amount: '-$45.00', status: '成功' },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-3 bg-dark-900/50 rounded-lg border border-slate-700/30">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-500">
                                            <CreditCard size={14} />
                                        </div>
                                        <div>
                                            <div className="text-sm text-slate-200">{item.name}</div>
                                            <div className="text-xs text-slate-500">{item.date}</div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-slate-200">{item.amount}</div>
                                        <div className="text-[10px] text-green-500">{item.status}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700/50 bg-dark-900/30 flex justify-end">
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors">关闭</button>
                </div>
            </div>
        </div>
    )
}

export const SecurityModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <Shield size={20} className="text-emerald-500" /> 
                        登录 & 安全
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                    
                    {/* Password Change */}
                    <div className="mb-8">
                        <h3 className="text-slate-300 text-sm font-medium mb-4 flex items-center gap-2">
                            <Key size={16} className="text-slate-500" /> 修改密码
                        </h3>
                        <div className="space-y-4 max-w-md">
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">当前密码</label>
                                <input type="password" placeholder="••••••••" className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                            <div>
                                <label className="text-xs text-slate-500 mb-1 block">新密码</label>
                                <input type="password" className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-2 text-slate-200 text-sm outline-none focus:border-emerald-500 transition-colors" />
                            </div>
                            <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm shadow-lg shadow-emerald-600/20 transition-all">更新密码</button>
                        </div>
                    </div>

                    <div className="h-px bg-slate-700/50 my-6"></div>

                    {/* Login History */}
                    <div>
                        <h3 className="text-slate-300 text-sm font-medium mb-4 flex items-center gap-2">
                            <Smartphone size={16} className="text-slate-500" /> 近期登录活动
                        </h3>
                        <div className="space-y-1">
                            {[
                                { device: 'MacBook Pro (此设备)', loc: '北京, 中国', time: '现在', active: true },
                                { device: 'iPhone 13 Pro', loc: '上海, 中国', time: '2小时前', active: false },
                                { device: 'Windows PC', loc: '广州, 中国', time: '昨天', active: false },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between p-4 hover:bg-slate-700/20 rounded-lg transition-colors border border-transparent hover:border-slate-700/50">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-2 h-2 rounded-full ${item.active ? 'bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-slate-600'}`}></div>
                                        <div>
                                            <div className="text-sm text-slate-200 font-medium">{item.device}</div>
                                            <div className="text-xs text-slate-500">{item.loc} • {item.time}</div>
                                        </div>
                                    </div>
                                    <button className="text-xs text-slate-500 hover:text-white underline decoration-slate-600 hover:decoration-white">详细信息</button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export const LoginDevicesModal: React.FC<ModalProps> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-dark-800 w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                
                <div className="flex justify-between items-center p-6 border-b border-slate-700/50">
                    <h2 className="text-lg font-medium text-white flex items-center gap-2">
                        <Smartphone size={20} className="text-blue-500" /> 
                        你的设备
                    </h2>
                    <button onClick={onClose} className="text-slate-500 hover:text-white">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8">
                     <p className="text-slate-400 text-sm mb-6">以下是目前已登录您账户的设备。如果您发现任何可疑设备，请立即注销。</p>
                     
                     <div className="space-y-4">
                        {/* Current Device */}
                        <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
                                    <Laptop size={20} />
                                </div>
                                <div>
                                    <h4 className="text-white text-sm font-medium flex items-center gap-2">
                                        MacBook Pro 
                                        <span className="text-[10px] bg-blue-500 text-white px-1.5 py-0.5 rounded-full">当前设备</span>
                                    </h4>
                                    <p className="text-xs text-slate-400 mt-1">北京, 中国 • Chrome on macOS</p>
                                </div>
                            </div>
                            <div className="text-emerald-500 text-xs font-medium flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div> 在线
                            </div>
                        </div>

                        {/* Other Devices */}
                        {[
                            { name: 'iPhone 13 Pro', icon: Smartphone, loc: '上海, 中国', time: '2小时前' },
                            { name: 'iPad Air', icon: Monitor, loc: '广州, 中国', time: '1天前' },
                        ].map((dev, i) => (
                             <div key={i} className="bg-dark-900 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:border-slate-600 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-slate-400">
                                        <dev.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-slate-200 text-sm font-medium">{dev.name}</h4>
                                        <p className="text-xs text-slate-500 mt-1">{dev.loc} • 上次活跃: {dev.time}</p>
                                    </div>
                                </div>
                                <button className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all" title="注销">
                                    <LogOut size={18} />
                                </button>
                            </div>
                        ))}
                     </div>
                </div>

                <div className="p-6 border-t border-slate-700/50 bg-dark-900/30 flex justify-between items-center">
                    <button className="text-red-400 text-sm hover:text-red-300 transition-colors">注销所有其他设备</button>
                    <button onClick={onClose} className="px-6 py-2 rounded-lg bg-slate-700 text-white text-sm hover:bg-slate-600 transition-colors">关闭</button>
                </div>
            </div>
        </div>
    )
}

export const DeviceDetailModal: React.FC<DeviceModalProps> = ({ isOpen, onClose, device, onToggle }) => {
    const [sliderVal, setSliderVal] = useState(70);
    
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
             <div className="bg-dark-800 w-full max-w-lg rounded-2xl shadow-2xl border border-slate-700 overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header with image/gradient based on device type */}
                <div className={`h-32 bg-gradient-to-r ${device.isOn ? 'from-blue-600 to-cyan-500' : 'from-slate-700 to-slate-800'} p-6 relative flex flex-col justify-between`}>
                    <button onClick={onClose} className="absolute top-6 right-6 text-white/80 hover:text-white">
                        <X size={24} />
                    </button>
                    <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white">
                             {/* Icon Logic would be better extracted but keeping it simple */}
                             <Power size={24} />
                         </div>
                         <div>
                             <h2 className="text-2xl font-bold text-white">{device.name}</h2>
                             <p className="text-white/80 text-sm">{device.location}</p>
                         </div>
                    </div>
                </div>

                <div className="p-8">
                    {/* Controls */}
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Status</span>
                            <span className={`text-lg font-medium ${device.isOn ? 'text-blue-400' : 'text-slate-400'}`}>
                                {device.isOn ? 'Active' : 'Offline'}
                            </span>
                        </div>
                        <button 
                            onClick={() => onToggle(device.id)}
                            className={`w-14 h-8 rounded-full relative transition-colors duration-300 ${device.isOn ? 'bg-blue-500' : 'bg-slate-700'}`}
                        >
                            <div className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform duration-300 ${device.isOn ? 'translate-x-6' : ''}`} />
                        </button>
                    </div>

                    {/* Specific Controls based on Type */}
                    {(device.type === 'light' || device.type === 'thermostat') && (
                        <div className="mb-8">
                             <div className="flex justify-between mb-2">
                                <span className="text-sm text-slate-300">
                                    {device.type === 'light' ? 'Brightness' : 'Temperature'}
                                </span>
                                <span className="text-sm text-blue-400">{sliderVal}{device.type === 'thermostat' ? '°C' : '%'}</span>
                             </div>
                             <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={sliderVal} 
                                onChange={(e) => setSliderVal(Number(e.target.value))}
                                className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                             />
                        </div>
                    )}

                    {device.type === 'light' && (
                        <div className="mb-8">
                            <span className="text-sm text-slate-300 block mb-3">Color</span>
                            <div className="flex gap-4">
                                {['#ffffff', '#f59e0b', '#3b82f6', '#ef4444', '#10b981', '#8b5cf6'].map(c => (
                                    <button 
                                        key={c}
                                        className="w-8 h-8 rounded-full border-2 border-slate-600 hover:scale-110 transition-transform"
                                        style={{ backgroundColor: c }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Stats / Info */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-dark-900 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Zap size={16} /> <span className="text-xs">Energy</span>
                            </div>
                            <div className="text-xl font-medium text-slate-200">2.4 kWh</div>
                        </div>
                         <div className="bg-dark-900 rounded-xl p-4 border border-slate-700/50">
                            <div className="flex items-center gap-2 mb-2 text-slate-400">
                                <Clock size={16} className="text-orange-400" /> <span className="text-xs">Runtime</span>
                            </div>
                            <div className="text-xl font-medium text-slate-200">5h 20m</div>
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-700/50 bg-dark-900/30 flex justify-between">
                     <button className="text-slate-500 hover:text-white text-sm">View History</button>
                     <button className="text-slate-500 hover:text-red-400 text-sm">Remove Device</button>
                </div>
             </div>
        </div>
    )
}
