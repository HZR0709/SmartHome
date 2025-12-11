
import { Device, EnergyStat, DailyUsage, LogItem, UsageEvent, UserProfile } from '../types';
import { supabase } from '../lib/supabase';

// Helper to map DB snake_case to frontend camelCase
const mapDeviceFromDB = (d: any): Device => ({
  id: d.id,
  name: d.name,
  location: d.location,
  type: d.type,
  isOn: d.is_on,
  lastUsed: d.last_used,
  batteryLevel: d.battery_level,
  icon: d.icon
});

const mapEventFromDB = (e: any): UsageEvent => ({
    id: e.id,
    deviceId: e.device_id,
    deviceName: e.device_name,
    title: e.title,
    dayIndex: e.day_index,
    startHour: e.start_hour,
    duration: e.duration,
    type: e.type,
    colorClass: e.color_class
});

export const api = {
    /**
     * Get User Profile
     */
    getProfile: async (): Promise<UserProfile | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single();
        
        return data;
    },

    /**
     * Update User Profile
     */
    updateProfile: async (updates: Partial<UserProfile>): Promise<UserProfile | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', user.id)
            .select()
            .single();

        if (error) {
            console.error('Error updating profile:', error);
            return null;
        }
        return data;
    },

    /**
     * Fetch all devices from Supabase.
     */
    getDevices: async (): Promise<Device[]> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return [];

        let { data, error } = await supabase
            .from('devices')
            .select('*')
            .eq('user_id', user.id);

        if (error) {
            console.error('Error fetching devices:', error);
            return [];
        }

        // --- SEED DATA IF EMPTY (For Demo Purposes) ---
        if (!data || data.length === 0) {
            await seedUserData(user.id);
            const retry = await supabase.from('devices').select('*').eq('user_id', user.id);
            data = retry.data;
        }

        return (data || []).map(mapDeviceFromDB);
    },

    /**
     * Add a new device to Supabase
     */
    addDevice: async (device: Partial<Device>): Promise<Device | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const dbDevice = {
            user_id: user.id,
            name: device.name || 'New Device',
            location: device.location || 'Home',
            type: device.type || 'plug',
            is_on: false,
            last_used: new Date().toISOString(),
            battery_level: 'high',
            icon: device.type // simple mapping
        };

        const { data, error } = await supabase
            .from('devices')
            .insert(dbDevice)
            .select()
            .single();

        if (error) {
            console.error('Error adding device:', error);
            return null;
        }

        return mapDeviceFromDB(data);
    },

    /**
     * Toggle a device state in Supabase.
     */
    toggleDevice: async (id: string, currentState: boolean): Promise<boolean> => {
        const { error } = await supabase
            .from('devices')
            .update({ is_on: !currentState, last_used: new Date().toISOString() })
            .eq('id', id);

        if (error) {
            console.error('Error toggling device:', error);
            return currentState; // Revert if failed
        }
        return !currentState;
    },

    /**
     * Get dashboard stats (Mocked for now, or could be a table)
     */
    getDashboardStats: async (): Promise<{ energy: EnergyStat[], daily: DailyUsage[] }> => {
        // You can create 'energy_stats' table later. 
        // For now, we return static data to keep the demo simple but functional.
        return {
            energy: [
                { name: '客厅', value: 16, color: '#10b981' }, 
                { name: '工作室', value: 22, color: '#f59e0b' }, 
                { name: '卧室', value: 11, color: '#f97316' }, 
                { name: '车库', value: 39, color: '#3b82f6' }, 
                { name: '厨房', value: 12, color: '#8b5cf6' }, 
            ],
            daily: [
                { day: '一', value: 40 },
                { day: '二', value: 65 },
                { day: '三', value: 35 },
                { day: '四', value: 50 },
                { day: '五', value: 45 },
                { day: '六', value: 20 },
                { day: '日', value: 15 },
            ]
        };
    },

    /**
     * Get usage events from Supabase
     */
    getUsageEvents: async (): Promise<UsageEvent[]> => {
         const { data: { user } } = await supabase.auth.getUser();
         if (!user) return [];

         const { data, error } = await supabase
            .from('usage_events')
            .select('*')
            .eq('user_id', user.id);

         if (error) return [];
         return (data || []).map(mapEventFromDB);
    },

    /**
     * Add usage event
     */
    addUsageEvent: async (event: UsageEvent): Promise<UsageEvent | null> => {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return null;

        const dbEvent = {
            user_id: user.id,
            device_id: event.deviceId,
            device_name: event.deviceName,
            title: event.title,
            day_index: event.dayIndex,
            start_hour: event.startHour,
            duration: event.duration,
            type: event.type,
            color_class: event.colorClass
        };

        const { data, error } = await supabase
            .from('usage_events')
            .insert(dbEvent)
            .select()
            .single();

        if (error) {
            console.error(error);
            return null;
        }
        return mapEventFromDB(data);
    },

    getNotifications: async (): Promise<any[]> => {
        return [
            { id: 1, type: 'warning', text: '后院活动', sub: '刚刚', color: 'text-orange-500' },
            { id: 2, type: 'info', text: '系统存储 89%', sub: '1小时前', color: 'text-blue-500' },
            { id: 3, type: 'success', text: '备份完成', sub: '今天', color: 'text-emerald-500' },
        ];
    }
};

// --- SEEDER FUNCTION ---
// Automatically populates a new user's account with demo devices
async function seedUserData(userId: string) {
    // Check if profile exists, if not create one
    const { data: profile } = await supabase.from('profiles').select('id').eq('id', userId).single();
    if (!profile) {
        // Fallback if trigger didn't fire
        await supabase.from('profiles').insert({
            id: userId,
            home_name: '我的智能小窝',
            full_name: 'User'
        });
    }

    const devices = [
        { user_id: userId, name: '插座', location: '卧室', type: 'plug', is_on: true, last_used: '2022-02-16', battery_level: 'medium', icon: 'plug' },
        { user_id: userId, name: '摄像头', location: '客厅', type: 'camera', is_on: false, last_used: '2022-02-16', battery_level: 'high', icon: 'camera' },
        { user_id: userId, name: '台灯', location: '工作室', type: 'light', is_on: true, last_used: '2022-02-16', battery_level: 'high', icon: 'light' },
        { user_id: userId, name: 'Wifi', location: '走廊', type: 'wifi', is_on: true, last_used: '2022-02-16', icon: 'wifi' },
        { user_id: userId, name: '恒温器', location: '客厅', type: 'thermostat', is_on: true, last_used: '2022-02-16', battery_level: 'high', icon: 'thermometer' },
        { user_id: userId, name: '门锁', location: '大厅', type: 'lock', is_on: true, last_used: '2022-02-17', battery_level: 'high', icon: 'lock' },
    ];
    await supabase.from('devices').insert(devices);

    const events = [
         { user_id: userId, device_id: 't1', device_name: '恒温器', title: '保持室温 24°C', day_index: 0, start_hour: 6, duration: 1.5, type: 'thermostat', color_class: 'border-yellow-600/50 bg-yellow-600/20 text-yellow-500' },
         { user_id: userId, device_id: 'l1', device_name: '客厅大灯', title: '早间照明', day_index: 1, start_hour: 7, duration: 3, type: 'light', color_class: 'border-red-500/50 bg-red-500/20 text-red-400' },
    ];
    await supabase.from('usage_events').insert(events);
}
