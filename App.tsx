
import React, { useState, useEffect } from 'react';
import { 
  Home, Monitor, Activity, Database, Image as ImageIcon, Settings, 
  Menu, Bell, Search, ChevronDown, Clock, AlertTriangle, Info, CheckCircle, Loader2
} from 'lucide-react';
import { NavItem, NavPage, Device, EnergyStat, DailyUsage, ModalType, DashboardConfig, UsageEvent, UserProfile } from './types';
import { SmartAssistant } from './components/SmartAssistant';
import { Dashboard } from './components/Dashboard';
import { DeviceListPage } from './components/DeviceListPage';
import { SmartAnalysisPage } from './components/SmartAnalysisPage';
import { GalleryPage } from './components/GalleryPage';
import { UsagePage } from './components/UsagePage';
import { HistoryPage } from './components/HistoryPage';
import { SettingsPage } from './components/SettingsPage';
import { LoginPage } from './components/LoginPage';
import { 
    SettingsModal, AddDeviceModal, AddUsageModal, PaymentModal, 
    SecurityModal, LoginDevicesModal, DeviceDetailModal 
} from './components/Modals';
import { api } from './services/api';
import { supabase } from './lib/supabase';

// --- Static Nav Data ---
const NAV_ITEMS: NavItem[] = [
  { id: NavPage.HOME, label: '我的家', icon: Home },
  { id: NavPage.DEVICES, label: '设备', icon: Monitor },
  { id: NavPage.ANALYSIS, label: '智能分析', icon: Activity },
  { id: NavPage.USAGE, label: '使用频率', icon: Database },
  { id: NavPage.GALLERY, label: '图库', icon: ImageIcon },
  { id: NavPage.HISTORY, label: '历史数据', icon: Clock },
  { id: NavPage.SETTINGS, label: '设置', icon: Settings },
];

export default function App() {
  // Auth State
  const [session, setSession] = useState<any>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);
  
  // App Data State
  const [devices, setDevices] = useState<Device[]>([]);
  const [energyData, setEnergyData] = useState<EnergyStat[]>([]);
  const [dailyStats, setDailyStats] = useState<DailyUsage[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [usageEvents, setUsageEvents] = useState<UsageEvent[]>([]); 
  const [profile, setProfile] = useState<UserProfile | null>(null);
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState<NavPage>(NavPage.HOME);
  const [modal, setModal] = useState<ModalType>('NONE');
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null);
  const [isAiOpen, setIsAiOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Dashboard Settings State
  const [dashboardConfig, setDashboardConfig] = useState<DashboardConfig>({
      layoutId: 1,
      homeName: 'My Sweet Home',
      tempUnit: 'C',
      currency: 'CNY',
      options: {
          animations: true,
          sounds: false,
          showWeather: false,
          compactMode: false
      }
  });

  // 1. Check Supabase Session
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setIsAuthLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  // 2. Fetch Data when Session exists
  useEffect(() => {
    if (session) {
        const loadData = async () => {
            setIsLoading(true);
            try {
                // Fetch basic data
                const [fetchedDevices, stats, notifs, events, userProfile] = await Promise.all([
                    api.getDevices(),
                    api.getDashboardStats(),
                    api.getNotifications(),
                    api.getUsageEvents(),
                    api.getProfile()
                ]);
                
                setDevices(fetchedDevices);
                setEnergyData(stats.energy);
                setDailyStats(stats.daily);
                setNotifications(notifs);
                setUsageEvents(events);
                setProfile(userProfile);
                
                if (userProfile && userProfile.home_name) {
                    setDashboardConfig(prev => ({ ...prev, homeName: userProfile.home_name || 'My Sweet Home' }));
                }

                // Load cached config
                const savedConfig = localStorage.getItem('dashboardConfig');
                if (savedConfig) {
                    const parsed = JSON.parse(savedConfig);
                    setDashboardConfig(prev => ({ 
                        ...prev, 
                        ...parsed,
                        homeName: userProfile?.home_name || parsed.homeName 
                    }));
                }

            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setIsLoading(false);
            }
        };
        loadData();
    }
  }, [session]);

  const saveConfig = (newConfig: DashboardConfig) => {
      setDashboardConfig(newConfig);
      localStorage.setItem('dashboardConfig', JSON.stringify(newConfig));
  };

  const toggleDevice = async (id: string) => {
    // Optimistic UI update
    const device = devices.find(d => d.id === id);
    if (device) {
        const newState = !device.isOn;
        setDevices(prev => prev.map(d => d.id === id ? { ...d, isOn: newState } : d));
        
        // Call API
        await api.toggleDevice(id, device.isOn);
    }
  };

  const handleNavClick = (id: NavPage) => {
      setActivePage(id);
  };

  const openDeviceDetails = (device: Device) => {
      setSelectedDevice(device);
      setModal('DEVICE_DETAIL');
  };

  const handleAddUsageEvent = async (event: UsageEvent) => {
      // Optimistic
      setUsageEvents(prev => [...prev, event]);
      // Real DB Insert
      const savedEvent = await api.addUsageEvent(event);
      if (savedEvent) {
          // Update ID with real one from DB
          setUsageEvents(prev => prev.map(e => e.id === event.id ? savedEvent : e));
      }
  };

  const handleAddDevice = async (deviceData: Partial<Device>) => {
      const newDevice = await api.addDevice(deviceData);
      if (newDevice) {
          setDevices(prev => [...prev, newDevice]);
          setModal('NONE');
      }
  };

  const handleLogout = async () => {
      await supabase.auth.signOut();
      setDevices([]); // clear data
  };

  if (isAuthLoading) {
      return (
        <div className="flex h-screen w-full bg-dark-900 items-center justify-center">
             <Loader2 className="w-8 h-8 text-blue-500 animate-spin" />
        </div>
      );
  }

  // If not authenticated, show login page
  if (!session) {
      return <LoginPage onLogin={() => {}} />;
  }

  // Loading Data Screen
  if (isLoading && devices.length === 0) {
      return (
          <div className="flex h-screen w-full bg-dark-900 items-center justify-center flex-col gap-4 text-slate-400">
              <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
              <p className="animate-pulse">Syncing with Supabase...</p>
          </div>
      );
  }

  return (
    <div className="flex h-screen w-full bg-dark-900 text-slate-200 font-sans selection:bg-blue-500/30 animate-in fade-in duration-500">
      
      {/* Sidebar */}
      <aside className="w-64 bg-dark-900 border-r border-slate-800 flex flex-col p-6 hidden md:flex shrink-0">
        <div className="flex items-center gap-2 mb-10 pl-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-600/20">
              <Monitor size={18} className="text-white" />
          </div>
          <span className="text-xl font-bold text-white tracking-tight">SmartHome</span>
        </div>

        {/* Profile Snippet */}
        <div className="mb-8 flex flex-col items-center text-center group">
            <div className="w-20 h-20 rounded-full bg-slate-700 overflow-hidden mb-3 border-4 border-dark-800 shadow-xl group-hover:scale-105 transition-transform duration-300">
                <img src={profile?.avatar_url || "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80"} alt="User" className="w-full h-full object-cover" />
            </div>
            <div className="flex items-center gap-1 text-white font-medium hover:text-blue-400 cursor-pointer transition-colors">
                {profile?.full_name || session.user.email?.split('@')[0] || 'User'} <ChevronDown size={14} className="text-blue-500" />
            </div>
            <p className="text-[10px] text-slate-500 mt-1 max-w-[150px] leading-tight">{dashboardConfig.homeName}</p>
        </div>

        <nav className="flex-1 space-y-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`
                w-full flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
                ${activePage === item.id 
                  ? 'bg-gradient-to-r from-blue-600/10 to-transparent border-l-4 border-blue-500 text-blue-400' 
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border-l-4 border-transparent'}
              `}
            >
              <item.icon size={20} className={`transition-transform group-hover:scale-110 ${activePage === item.id ? 'text-blue-500' : ''}`} />
              <span className="text-sm font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
        
        {/* Logout Snippet */}
        <button 
            onClick={handleLogout}
            className="flex items-center gap-4 px-4 py-3 rounded-xl text-slate-500 hover:text-red-400 hover:bg-red-500/5 transition-all mt-4 group"
        >
            <Settings size={20} className="group-hover:rotate-90 transition-transform" />
            <span className="text-sm font-medium">退出登录</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden relative bg-gradient-to-br from-dark-900 via-dark-900 to-slate-900">
        {/* Top Header */}
        <header className="h-20 px-8 flex items-center justify-between z-10 shrink-0">
          <div className="md:hidden">
            <Menu className="text-slate-400" />
          </div>
          
          <div className="hidden md:block">
              <h1 className="text-xl font-medium text-slate-200 tracking-tight">{dashboardConfig.homeName}</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="bg-dark-800/50 rounded-full px-4 py-2 flex items-center gap-3 border border-slate-700/50 hidden sm:flex">
                <div className="w-32 h-1.5 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-2/3 bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]"></div>
                </div>
            </div>
            <div className="flex gap-4 text-slate-400 items-center relative">
                <button className="w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors">
                    <Search size={20} />
                </button>
                <div className="relative">
                    <button 
                        onClick={() => setShowNotifications(!showNotifications)}
                        className={`w-10 h-10 rounded-full hover:bg-white/5 flex items-center justify-center transition-colors relative ${showNotifications ? 'bg-white/10 text-white' : ''}`}
                    >
                        <Bell size={20} />
                        {notifications.length > 0 && <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border border-dark-900"></span>}
                    </button>

                    {/* Notification Dropdown */}
                    {showNotifications && (
                        <div className="absolute top-12 right-0 w-80 bg-dark-800 rounded-xl shadow-2xl border border-slate-700/50 z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                             <div className="divide-y divide-slate-700/50 max-h-[400px] overflow-y-auto">
                                 {notifications.map((notif) => (
                                     <div key={notif.id} className="p-4 flex items-start gap-3 hover:bg-slate-700/20 cursor-pointer transition-colors">
                                         {notif.type === 'warning' ? <AlertTriangle size={16} className={`mt-0.5 shrink-0 ${notif.color}`} /> : 
                                          notif.type === 'success' ? <CheckCircle size={16} className={`mt-0.5 shrink-0 ${notif.color}`} /> :
                                          <Info size={16} className={`mt-0.5 shrink-0 ${notif.color}`} />}
                                         <div>
                                             <p className="text-sm text-slate-200 font-medium leading-tight mb-1">{notif.text}</p>
                                             <p className="text-xs text-slate-500">{notif.sub}</p>
                                         </div>
                                     </div>
                                 ))}
                             </div>
                        </div>
                    )}
                </div>
                
                <div className="w-px h-6 bg-slate-700 mx-2 hidden sm:block"></div>
                <div 
                    onClick={() => setModal('SETTINGS')}
                    className="hidden sm:flex items-center gap-2 text-sm text-slate-300 cursor-pointer hover:text-white transition-colors"
                >
                    <span>{profile?.full_name || session.user.email?.split('@')[0]}</span>
                    <ChevronDown size={14} />
                </div>
            </div>
          </div>
        </header>

        {/* Dynamic Page Content */}
        {activePage === NavPage.HOME && (
            <Dashboard 
                devices={devices.slice(0, 5)} 
                onToggleDevice={toggleDevice}
                energyData={energyData}
                dailyStats={dailyStats}
                onOpenAddDevice={() => setModal('ADD_DEVICE')}
                onNavigate={handleNavClick}
                config={dashboardConfig}
            />
        )}

        {activePage === NavPage.DEVICES && (
            <DeviceListPage 
                devices={devices} 
                onToggle={toggleDevice} 
                onOpenAdd={() => setModal('ADD_DEVICE')}
                onDeviceClick={openDeviceDetails}
            />
        )}

        {activePage === NavPage.ANALYSIS && (
            <SmartAnalysisPage onOpenAI={() => setIsAiOpen(true)} />
        )}
        
        {activePage === NavPage.GALLERY && (
            <GalleryPage />
        )}
        
        {activePage === NavPage.USAGE && (
             <UsagePage 
                onOpenAdd={() => setModal('ADD_USAGE')} 
                events={usageEvents} // Pass dynamic events
             />
        )}

        {activePage === NavPage.HISTORY && (
             <HistoryPage />
        )}

        {activePage === NavPage.SETTINGS && (
             <SettingsPage 
                onOpenPayment={() => setModal('PAYMENT')}
                onOpenSecurity={() => setModal('SECURITY')}
                onOpenDevices={() => setModal('LOGIN_DEVICES')}
                profile={profile}
             />
        )}

        {/* Modals */}
        <SettingsModal 
            isOpen={modal === 'SETTINGS'} 
            onClose={() => setModal('NONE')} 
            config={dashboardConfig}
            onSave={saveConfig}
        />
        <AddDeviceModal 
            isOpen={modal === 'ADD_DEVICE'} 
            onClose={() => setModal('NONE')} 
            onAdd={handleAddDevice}
        />
        <AddUsageModal 
            isOpen={modal === 'ADD_USAGE'} 
            onClose={() => setModal('NONE')} 
            onAdd={handleAddUsageEvent}
        />
        <PaymentModal isOpen={modal === 'PAYMENT'} onClose={() => setModal('NONE')} />
        <SecurityModal isOpen={modal === 'SECURITY'} onClose={() => setModal('NONE')} />
        <LoginDevicesModal isOpen={modal === 'LOGIN_DEVICES'} onClose={() => setModal('NONE')} />
        
        {selectedDevice && (
            <DeviceDetailModal 
                isOpen={modal === 'DEVICE_DETAIL'} 
                onClose={() => setModal('NONE')} 
                device={selectedDevice}
                onToggle={toggleDevice}
            />
        )}

        {/* AI Assistant Overlay */}
        <SmartAssistant 
            isOpen={isAiOpen} 
            onClose={() => setIsAiOpen(false)} 
            dashboardState={{ devices, stats: energyData, daily: dailyStats }} 
        />
      </main>
    </div>
  );
}
