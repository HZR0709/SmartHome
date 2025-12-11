

import React, { useState } from 'react';
import { 
    Lock, CreditCard, Smartphone, ChevronRight, MoreVertical, 
    Bell, MessageSquare, Shield, RefreshCw, Cloud, Save, Share2, 
    FileText, Power, Globe, Clock, ChevronDown, Check
} from 'lucide-react';

interface SettingsPageProps {
    onOpenPayment: () => void;
    onOpenSecurity: () => void;
    onOpenDevices: () => void;
}

export const SettingsPage: React.FC<SettingsPageProps> = ({ onOpenPayment, onOpenSecurity, onOpenDevices }) => {
    const [toggles, setToggles] = useState({
        email: false,
        sms: true,
        encryption: true,
        autoUpdate: true,
        cloud: true,
        export: false,
        backup: true,
        share: false,
        shortcut: true
    });
    
    const [theme, setTheme] = useState<'dark' | 'light'>('dark');
    const [notification, setNotification] = useState<string | null>(null);

    const handleToggle = (key: keyof typeof toggles) => {
        setToggles(prev => {
            const newState = { ...prev, [key]: !prev[key] };
            // Simulate visual feedback/toast
            showNotification(`${String(key)} settings updated`);
            return newState;
        });
    };

    const showNotification = (msg: string) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 2000);
    };

    const Toggle: React.FC<{ active: boolean; onClick: () => void; labelOff?: string; labelOn?: string }> = ({ active, onClick, labelOff='不允许', labelOn='允许' }) => (
        <div className="flex items-center gap-3">
             <div 
                onClick={onClick}
                className={`w-10 h-5 rounded-full relative cursor-pointer transition-colors duration-200 ${active ? 'bg-blue-500' : 'bg-slate-700'}`}
             >
                 <div className={`absolute top-1 left-1 w-3 h-3 bg-white rounded-full transition-transform duration-200 ${active ? 'translate-x-5' : ''}`}></div>
             </div>
             <span className="text-xs text-slate-400 select-none">{active ? labelOn : labelOff}</span>
        </div>
    );

    return (
        <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
            
            {/* Simple Toast Notification */}
            {notification && (
                <div className="absolute top-8 right-8 bg-blue-600 text-white text-xs px-4 py-2 rounded-lg shadow-lg z-50 animate-in slide-in-from-top-2 fade-in">
                    {notification}
                </div>
            )}

            {/* Header */}
            <div className="mb-8">
                <h2 className="text-2xl font-medium text-slate-200">设置</h2>
            </div>

            {/* Top Cards Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                {/* Login & Security */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-slate-700/50 shadow-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-slate-300 font-medium">登录 & 安全</h3>
                        <MoreVertical size={16} className="text-slate-600 cursor-pointer hover:text-slate-400" />
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-blue-400">
                            <Lock size={24} />
                        </div>
                        <div className="flex-1">
                            <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                管理您的密码、登录首选项和安全检查。保护您的账户免受未经授权的访问。
                            </p>
                            <button 
                                onClick={onOpenSecurity}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                            >
                                查看更多 <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                    {/* Decorative bg element */}
                    <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl group-hover:bg-blue-500/10 transition-colors"></div>
                </div>

                {/* Payment Methods */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-slate-700/50 shadow-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-slate-300 font-medium">支付方式</h3>
                        <MoreVertical size={16} className="text-slate-600 cursor-pointer hover:text-slate-400" />
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-blue-400">
                            <CreditCard size={24} />
                        </div>
                        <div className="flex-1">
                             <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                管理您的支付方式、查看交易历史记录以及更新您的账单信息。
                            </p>
                            <button 
                                onClick={onOpenPayment}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                            >
                                查看更多 <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Your Devices */}
                <div className="bg-dark-800 rounded-2xl p-6 border border-slate-700/50 shadow-lg relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4 relative z-10">
                        <h3 className="text-slate-300 font-medium">你的设备</h3>
                        <MoreVertical size={16} className="text-slate-600 cursor-pointer hover:text-slate-400" />
                    </div>
                    <div className="flex gap-4 relative z-10">
                        <div className="w-12 h-12 rounded-xl bg-slate-700/50 flex items-center justify-center text-blue-400">
                            <Smartphone size={24} />
                        </div>
                        <div className="flex-1">
                             <p className="text-xs text-slate-400 leading-relaxed mb-4">
                                查看当前登录到您账户的所有设备。如果有不认识的设备，请立即注销。
                            </p>
                            <button 
                                onClick={onOpenDevices}
                                className="flex items-center gap-1 text-sm text-blue-500 hover:text-blue-400 font-medium transition-colors"
                            >
                                查看更多 <ChevronRight size={14} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Section */}
            <div className="bg-dark-800 rounded-2xl border border-slate-700/50 shadow-xl p-8">
                <div className="flex justify-between items-center mb-8">
                    <h3 className="text-slate-300 font-medium text-lg">详情</h3>
                    <MoreVertical size={18} className="text-slate-600" />
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-x-16 gap-y-10">
                    
                    {/* Left Column: Form Inputs */}
                    <div className="space-y-6">
                        <div className="group">
                            <label className="text-sm text-slate-300 font-medium mb-2 block">名称</label>
                            <input type="text" defaultValue="金金设计素材铺" className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm focus:border-blue-500 outline-none transition-colors" />
                        </div>

                        <div className="group">
                            <label className="text-sm text-slate-300 font-medium mb-2 block">Email</label>
                            <input type="email" defaultValue="jianansucai@hotmail.com" className="w-full bg-dark-900 border border-blue-500 rounded-lg px-4 py-3 text-blue-400 text-sm outline-none" />
                        </div>

                         <div className="group">
                            <label className="text-sm text-slate-300 font-medium mb-2 block">手机号</label>
                            <input type="text" defaultValue="15800000000" className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm focus:border-blue-500 outline-none transition-colors" />
                        </div>

                        <div className="group">
                            <label className="text-sm text-slate-300 font-medium mb-2 flex items-center gap-2"><Globe size={16}/> 语言</label>
                            <div className="relative">
                                <select className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm appearance-none outline-none focus:border-blue-500 transition-colors cursor-pointer">
                                    <option>汉语</option>
                                    <option>English</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={16} />
                            </div>
                        </div>

                         <div className="group">
                            <label className="text-sm text-slate-300 font-medium mb-2 flex items-center gap-2"><Clock size={16}/> 时区</label>
                            <div className="relative">
                                <select className="w-full bg-dark-900 border border-slate-700 rounded-lg px-4 py-3 text-slate-300 text-sm appearance-none outline-none focus:border-blue-500 transition-colors cursor-pointer">
                                    <option>北京</option>
                                    <option>London</option>
                                    <option>New York</option>
                                </select>
                                <ChevronDown className="absolute right-4 top-4 text-slate-500 pointer-events-none" size={16} />
                            </div>
                        </div>
                    </div>

                    {/* Right Column: Toggles Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12">
                        
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">邮箱通知</h4>
                                <Bell size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3">随时接收每日电子邮件通知。</p>
                            <Toggle active={toggles.email} onClick={() => handleToggle('email')} />
                        </div>

                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">主题模式</h4>
                                <div className="flex gap-2 text-[10px] ml-auto select-none">
                                    <span 
                                        onClick={() => setTheme('dark')}
                                        className={`${theme === 'dark' ? 'text-blue-400 font-bold' : 'text-slate-600 hover:text-slate-400'} flex items-center gap-1 transition-colors cursor-pointer`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${theme === 'dark' ? 'bg-blue-400' : 'bg-slate-600'}`}></div> 深色
                                    </span>
                                    <span 
                                        onClick={() => setTheme('light')}
                                        className={`${theme === 'light' ? 'text-blue-400 font-bold' : 'text-slate-600 hover:text-slate-400'} flex items-center gap-1 transition-colors cursor-pointer`}
                                    >
                                        <div className={`w-1.5 h-1.5 rounded-full ${theme === 'light' ? 'bg-blue-400' : 'bg-slate-600'}`}></div> 浅色
                                    </span>
                                </div>
                            </div>
                             {/* Theme Visual Preview */}
                             <div className="h-4 w-full bg-dark-900/50 rounded mt-1 overflow-hidden relative border border-slate-700/30 transition-colors duration-300">
                                 <div className={`absolute inset-0 transition-opacity duration-300 flex ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                                     <div className="w-1/3 bg-slate-800 h-full"></div>
                                     <div className="w-2/3 bg-slate-900 h-full"></div>
                                 </div>
                                 <div className={`absolute inset-0 transition-opacity duration-300 flex ${theme === 'light' ? 'opacity-100' : 'opacity-0'}`}>
                                     <div className="w-1/3 bg-slate-200 h-full"></div>
                                     <div className="w-2/3 bg-white h-full"></div>
                                 </div>
                             </div>
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">短信通知</h4>
                                <MessageSquare size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3">随时接收手机短信通知。</p>
                            <Toggle active={toggles.sms} onClick={() => handleToggle('sms')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">自动备份</h4>
                                <Save size={14} className="text-slate-500" />
                            </div>
                             <p className="text-[10px] text-slate-500 mb-3">定期将配置备份到服务器。</p>
                            <Toggle active={toggles.backup} onClick={() => handleToggle('backup')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">数据加密</h4>
                                <Shield size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3">加密与帐户关联的所有数据。</p>
                            <Toggle active={toggles.encryption} onClick={() => handleToggle('encryption')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">共享数据</h4>
                                <Share2 size={14} className="text-slate-500" />
                            </div>
                             <p className="text-[10px] text-slate-500 mb-3">允许与家庭成员共享数据。</p>
                            <Toggle active={toggles.share} onClick={() => handleToggle('share')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">自动更新</h4>
                                <RefreshCw size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3">自动安装最新更新。</p>
                            <Toggle active={toggles.autoUpdate} onClick={() => handleToggle('autoUpdate')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">快捷模式</h4>
                                <Power size={14} className="text-slate-500" />
                            </div>
                             <p className="text-[10px] text-slate-500 mb-3">启用简化的控制界面。</p>
                            <Toggle active={toggles.shortcut} onClick={() => handleToggle('shortcut')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">云同步</h4>
                                <Cloud size={14} className="text-slate-500" />
                            </div>
                            <p className="text-[10px] text-slate-500 mb-3">将所有信息保存在云服务上。</p>
                            <Toggle active={toggles.cloud} onClick={() => handleToggle('cloud')} />
                        </div>

                        <div>
                             <div className="flex items-center gap-2 mb-1">
                                <h4 className="text-slate-300 text-sm font-medium">导出数据</h4>
                                <FileText size={14} className="text-slate-500" />
                            </div>
                             <p className="text-[10px] text-slate-500 mb-3">下载您的所有历史数据副本。</p>
                            <Toggle active={toggles.export} onClick={() => handleToggle('export')} />
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};