

export interface Device {
  id: string;
  name: string;
  location: string;
  type: 'plug' | 'camera' | 'light' | 'wifi' | 'thermostat' | 'speaker' | 'sensor' | 'lock';
  isOn: boolean;
  lastUsed: string;
  batteryLevel?: 'high' | 'medium' | 'low';
  icon: string;
}

export interface EnergyStat {
  name: string;
  value: number;
  color: string;
  subText?: string;
}

export interface DailyUsage {
  day: string;
  value: number;
}

export interface AnalysisDataPoint {
  month: string;
  bedroom: number;
  workspace: number;
  kitchen: number;
  garage: number;
}

export enum NavPage {
  HOME = 'HOME',
  DEVICES = 'DEVICES',
  ANALYSIS = 'ANALYSIS',
  USAGE = 'USAGE',
  GALLERY = 'GALLERY',
  HISTORY = 'HISTORY',
  SETTINGS = 'SETTINGS'
}

export interface NavItem {
  id: NavPage;
  label: string;
  icon: any; 
}

export type ModalType = 'NONE' | 'SETTINGS' | 'ADD_DEVICE' | 'LAYOUT' | 'ADD_USAGE' | 'PAYMENT' | 'SECURITY' | 'LOGIN_DEVICES' | 'DEVICE_DETAIL';

export interface GalleryItem {
  id: string;
  url: string;
  name: string;
  date: string;
  size: string;
  month: string; // Grouping key
  dimensions?: string;
}

export interface GalleryFolder {
  id: string;
  name: string;
  count: number;
  size: string;
  lastOpened: string;
}

export interface UsageEvent {
  id: string;
  deviceId: string;
  deviceName: string;
  title: string; // "这里是规律描述说明"
  dayIndex: number; // 0 = Mon, 6 = Sun
  startHour: number; // 6.0 = 6am, 6.5 = 6:30am
  duration: number; // in hours
  type: 'thermostat' | 'light' | 'camera' | 'plug' | 'lock' | 'speaker' | 'sensor' | 'wifi';
  colorClass: string; // Tailwind class string for colors
}

export interface LogItem {
  id: string;
  type: 'warning' | 'info' | 'success' | 'settings';
  date: string;
  message: string;
}

export interface DashboardConfig {
    layoutId: number;
    homeName: string;
    tempUnit: 'C' | 'F';
    currency: string;
    options: {
        animations: boolean;
        sounds: boolean;
        showWeather: boolean;
        compactMode: boolean;
    }
}

export interface UserProfile {
    id: string;
    full_name: string;
    avatar_url?: string;
    home_name?: string;
}