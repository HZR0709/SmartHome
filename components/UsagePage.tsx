
import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { UsageEvent } from '../types';

// --- Mock Data ---
const EVENTS: UsageEvent[] = [
  { id: '1', deviceId: 't1', deviceName: '恒温器', title: '保持室温 24°C', dayIndex: 0, startHour: 6, duration: 1.5, type: 'thermostat', colorClass: 'border-yellow-600/50 bg-yellow-600/20 text-yellow-500' },
  { id: '2', deviceId: 'l1', deviceName: '客厅大灯', title: '早间照明', dayIndex: 1, startHour: 7, duration: 3, type: 'light', colorClass: 'border-red-500/50 bg-red-500/20 text-red-400' },
  { id: '3', deviceId: 'c1', deviceName: '摄像头', title: '安全监控', dayIndex: 1, startHour: 6, duration: 2, type: 'camera', colorClass: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' },
  { id: '4', deviceId: 'l2', deviceName: '门锁', title: '自动锁定', dayIndex: 1, startHour: 10, duration: 1.5, type: 'lock', colorClass: 'border-amber-700/50 bg-amber-700/20 text-amber-500' },
  { id: '5', deviceId: 'p1', deviceName: '插座', title: '咖啡机定时', dayIndex: 0, startHour: 11, duration: 3, type: 'plug', colorClass: 'border-purple-500/50 bg-purple-500/20 text-purple-400' },
  { id: '6', deviceId: 'l3', deviceName: '书房大灯', title: '阅读模式', dayIndex: 3, startHour: 6, duration: 3, type: 'light', colorClass: 'border-red-500/50 bg-red-500/20 text-red-400' },
  { id: '7', deviceId: 'c2', deviceName: '后院监控', title: '移动侦测开启', dayIndex: 3, startHour: 8.5, duration: 5, type: 'camera', colorClass: 'border-emerald-500/50 bg-emerald-500/20 text-emerald-400' },
  { id: '8', deviceId: 'p2', deviceName: '空气净化', title: '定时运行', dayIndex: 6, startHour: 7.5, duration: 5, type: 'plug', colorClass: 'border-purple-500/50 bg-purple-500/20 text-purple-400' },
  { id: '9', deviceId: 's1', deviceName: '音响', title: 'Morning News', dayIndex: 1, startHour: 13, duration: 2, type: 'speaker', colorClass: 'border-orange-400/50 bg-orange-400/20 text-orange-400' },
  { id: '10', deviceId: 't2', deviceName: '夜灯', title: '自动开启', dayIndex: 4, startHour: 22, duration: 2, type: 'light', colorClass: 'border-blue-500/50 bg-blue-500/20 text-blue-400' },
  
  // Overlapping Test Data for Day View (assuming current day is dayIndex 1 - Tuesday)
  { id: '11', deviceId: 'x1', deviceName: '测试设备A', title: '重叠测试', dayIndex: 1, startHour: 8, duration: 2, type: 'sensor', colorClass: 'border-pink-500/50 bg-pink-500/20 text-pink-400' },
];

const WEEK_DAYS_NAMES = ['星期一', '星期二', '星期三', '星期四', '星期五', '星期六', '星期日'];

// Full 24h range
const HOURS = Array.from({ length: 24 }, (_, i) => i); 
const ROW_HEIGHT = 80; // px per hour

interface UsagePageProps {
  onOpenAdd: () => void;
  events: UsageEvent[];
}

interface ProcessedEvent extends UsageEvent {
  leftPercent: number;
  widthPercent: number;
}

export const UsagePage: React.FC<UsagePageProps> = ({ onOpenAdd, events }) => {
  const [view, setView] = useState<'day' | 'week' | 'month' | 'year'>('week');
  const [currentDate, setCurrentDate] = useState(new Date('2022-02-15T00:00:00')); // Start on a Tuesday to show data

  // Use props events, fallback to mock data if empty (optional, but good for demo continuity)
  // Since App.tsx initializes with empty array, we merge or fallback. 
  // For strict correctness with App.tsx's state management, we should use `events`. 
  // However, to keep the UI populated as per the demo nature, I will combine them or fallback.
  // Let's assume passed events are supplementary or the source of truth. 
  // If `events` is empty, I'll use `EVENTS` to avoid a blank screen in this fix.
  const displayEvents = events.length > 0 ? events : EVENTS;

  // --- Navigation Logic ---
  const handlePrev = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(currentDate.getDate() - 1);
    if (view === 'week') newDate.setDate(currentDate.getDate() - 7);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() - 1);
    if (view === 'year') newDate.setFullYear(currentDate.getFullYear() - 1);
    setCurrentDate(newDate);
  };

  const handleNext = () => {
    const newDate = new Date(currentDate);
    if (view === 'day') newDate.setDate(currentDate.getDate() + 1);
    if (view === 'week') newDate.setDate(currentDate.getDate() + 7);
    if (view === 'month') newDate.setMonth(currentDate.getMonth() + 1);
    if (view === 'year') newDate.setFullYear(currentDate.getFullYear() + 1);
    setCurrentDate(newDate);
  };

  const formatDateLabel = () => {
    const y = currentDate.getFullYear();
    const m = currentDate.getMonth() + 1;
    const d = currentDate.getDate();
    const dayName = WEEK_DAYS_NAMES[(currentDate.getDay() + 6) % 7];

    if (view === 'day') return `${dayName}, ${m < 10 ? '0'+m : m}-${d < 10 ? '0'+d : d}`;
    if (view === 'week') {
       // Find Monday of this week
       const day = currentDate.getDay() || 7; 
       const startWeek = new Date(currentDate);
       if (day !== 1) startWeek.setDate(startWeek.getDate() - (day - 1));
       const endWeek = new Date(startWeek);
       endWeek.setDate(startWeek.getDate() + 6);
       return `${startWeek.getMonth()+1}月 ${startWeek.getDate()}日 - ${endWeek.getMonth()+1}月 ${endWeek.getDate()}日`;
    }
    if (view === 'month') return `${y}年 ${m}月`;
    if (view === 'year') return `${y}年`;
  };

  // Generate Week Headers
  const weekHeaders = useMemo(() => {
    const startOfWeek = new Date(currentDate);
    const day = startOfWeek.getDay() || 7;
    if (day !== 1) startOfWeek.setDate(startOfWeek.getDate() - (day - 1));

    return WEEK_DAYS_NAMES.map((name, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      const isToday = d.toDateString() === new Date().toDateString(); // Real today check
      return { name, date: d.getDate(), isToday, fullDate: d };
    });
  }, [currentDate]);

  // Layout Algorithm
  const getProcessedEvents = (): ProcessedEvent[] => {
      // 1. Filter relevant events
      let visibleEvents: UsageEvent[] = [];
      const currentDayIndex = (currentDate.getDay() + 6) % 7;

      if (view === 'week') {
          // In a real app, filter by week range. Here we assume EVENTS are recurrent weekly mock data
          visibleEvents = displayEvents; 
      } else if (view === 'day') {
          visibleEvents = displayEvents.filter(e => e.dayIndex === currentDayIndex);
      }

      // 2. Assign geometry
      if (view === 'week') {
          // Simple columns based on day index
          return visibleEvents.map(e => ({
              ...e,
              leftPercent: (e.dayIndex * 100) / 7,
              widthPercent: 100 / 7
          }));
      } else {
          // Day View: Overlap Logic
          // Sort by start time
          const sorted = [...visibleEvents].sort((a, b) => a.startHour - b.startHour);
          const columns: ProcessedEvent[][] = [];

          sorted.forEach(evt => {
              let placed = false;
              // Try to place in an existing column where it doesn't overlap with the last event
              for (const col of columns) {
                  const lastEvt = col[col.length - 1];
                  if (lastEvt.startHour + lastEvt.duration <= evt.startHour) {
                      col.push(evt as any); // placeholder
                      placed = true;
                      break;
                  }
              }
              // If collision in all columns, start new column
              if (!placed) {
                  columns.push([evt as any]);
              }
          });

          // Flatten and calculate percentages
          const result: ProcessedEvent[] = [];
          const totalCols = columns.length;
          
          // Re-process to actually assign the props (the loop above was just grouping)
          // We need a more robust approach for specific item assignment, 
          // but for this UI a simple column division is sufficient:
          // Items in col 0 get left=0, width=1/totalCols
          
          columns.forEach((col, colIdx) => {
              col.forEach(evt => {
                 result.push({
                     ...evt,
                     leftPercent: (colIdx * 100) / totalCols,
                     widthPercent: 100 / totalCols
                 });
              });
          });
          
          return result;
      }
  };

  const processedEvents = useMemo(getProcessedEvents, [view, currentDate, displayEvents]);

  const renderMonthGrid = () => (
      <div className="flex-1 grid grid-cols-7 grid-rows-5 gap-1 p-4 overflow-y-auto custom-scrollbar">
          {Array.from({length: 35}).map((_, i) => {
              const day = i - 2; 
              const isCurrentMonth = day > 0 && day <= 30;
              const hasEvent = isCurrentMonth && [8, 11, 15, 22, 25].includes(day);
              
              return (
                  <div key={i} className={`min-h-[80px] rounded-xl border ${isCurrentMonth ? 'border-slate-700/50 bg-dark-900/30' : 'border-transparent opacity-30'} p-2 relative group hover:bg-dark-900/80 transition-colors`}>
                      {isCurrentMonth && (
                        <>
                          <span className={`text-sm ${day === 11 ? 'text-blue-500 font-bold' : 'text-slate-400'}`}>{day}</span>
                          {hasEvent && (
                              <div className="mt-2 space-y-1">
                                  <div className="h-1.5 w-full rounded-full bg-blue-500/40"></div>
                                  <div className="h-1.5 w-2/3 rounded-full bg-emerald-500/40"></div>
                              </div>
                          )}
                        </>
                      )}
                  </div>
              )
          })}
      </div>
  );

  const renderYearGrid = () => (
      <div className="flex-1 grid grid-cols-4 gap-4 p-6 overflow-y-auto custom-scrollbar">
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((m) => (
              <div key={m} className="bg-dark-900/30 border border-slate-700/50 rounded-2xl p-4 hover:border-blue-500/30 transition-colors cursor-pointer group">
                  <h3 className="text-slate-400 font-medium mb-3 group-hover:text-white">{m}</h3>
                  <div className="grid grid-cols-7 gap-1 h-20 opacity-50">
                      {Array.from({length: 28}).map((_, d) => (
                          <div key={d} className={`rounded-sm ${Math.random() > 0.7 ? 'bg-blue-500/60' : 'bg-slate-700/30'}`}></div>
                      ))}
                  </div>
              </div>
          ))}
      </div>
  );

  return (
    <div className="flex-1 p-4 md:p-8 overflow-hidden flex flex-col h-full relative">
      {/* Header */}
      <div className="flex justify-between items-center mb-6 shrink-0 z-20 relative">
        <div className="flex items-center gap-6">
            <h2 className="text-2xl font-medium text-slate-200">使用频率</h2>
            <button 
                onClick={onOpenAdd}
                className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-500 text-white flex items-center justify-center shadow-lg shadow-blue-600/30 transition-all"
            >
                <Plus size={24} />
            </button>
        </div>

        <div className="flex items-center bg-dark-800 rounded-lg p-1 border border-slate-700/50 shadow-lg">
            <button 
                onClick={handlePrev}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="px-4 text-sm text-slate-300 font-medium min-w-[150px] text-center select-none tabular-nums">
                {formatDateLabel()}
            </span>
            <button 
                onClick={handleNext}
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors"
            >
                <ChevronRight size={16} />
            </button>
        </div>

        <div className="flex items-center gap-1 bg-dark-800 rounded-lg p-1 border border-slate-700/50 hidden sm:flex shadow-lg">
             {['日', '周', '月', '年'].map((v) => (
                 <button 
                    key={v}
                    onClick={() => setView(v === '周' ? 'week' : v === '日' ? 'day' : v === '月' ? 'month' : 'year')}
                    className={`
                        px-4 py-1.5 text-xs rounded-md transition-all 
                        ${(v === '周' && view === 'week') || (v === '日' && view === 'day') || (v === '月' && view === 'month') || (v === '年' && view === 'year')
                            ? 'bg-blue-600 text-white shadow' 
                            : 'text-slate-500 hover:text-slate-300'}
                    `}
                 >
                     {v}
                 </button>
             ))}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 bg-dark-800 rounded-3xl border border-slate-700/50 shadow-xl overflow-hidden flex flex-col relative h-0 min-h-0 z-10">
        
        {view === 'month' ? renderMonthGrid() : view === 'year' ? renderYearGrid() : (
         <>
            {/* Calendar Headers (Fixed Top) */}
            <div className="flex border-b border-slate-700/50 bg-dark-800 z-20 shrink-0">
                <div className="w-16 shrink-0 border-r border-slate-700/50 bg-dark-900/50"></div> 
                <div className="flex-1 grid grid-cols-7 divide-x divide-slate-700/50">
                    {view === 'week' ? (
                        weekHeaders.map((day, idx) => (
                            <div key={idx} className={`py-4 text-center transition-colors ${day.isToday ? 'bg-blue-500/10' : ''}`}>
                                <div className={`text-xs mb-1 ${day.isToday ? 'text-blue-400' : 'text-slate-500'}`}>{day.name}</div>
                                <div className={`text-2xl font-light ${day.isToday ? 'text-blue-500' : 'text-slate-300'}`}>{day.date}</div>
                            </div>
                        ))
                    ) : (
                        // Day view header
                        <div className="col-span-7 py-4 text-center bg-blue-500/10">
                            <div className="text-xs mb-1 text-blue-400">
                                {WEEK_DAYS_NAMES[(currentDate.getDay() + 6) % 7]}
                            </div>
                            <div className="text-2xl font-light text-blue-500">{currentDate.getDate()}</div>
                        </div>
                    )}
                </div>
            </div>

            {/* Scrollable Timeline */}
            <div className="flex-1 overflow-y-auto custom-scrollbar relative bg-dark-800/50">
                
                {/* Background Grid & Time Labels */}
                <div className="absolute top-0 left-0 right-0 min-h-full">
                    {HOURS.map((hour) => (
                        <div key={hour} className="flex border-b border-slate-700/30 relative" style={{ height: ROW_HEIGHT }}>
                            <div className="w-16 shrink-0 border-r border-slate-700/50 bg-dark-900/30 flex justify-center pt-2 text-xs text-slate-500 select-none font-medium">
                                {hour === 0 ? '12 AM' : hour < 12 ? `${hour} AM` : hour === 12 ? '12 PM' : `${hour-12} PM`}
                            </div>
                            <div className="flex-1 grid grid-cols-7 divide-x divide-slate-700/30 h-full">
                                {Array.from({length: 7}).map((_, i) => (
                                    <div key={i} className={`h-full ${i === 3 && view === 'week' ? 'bg-blue-500/5' : ''}`}></div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Events Layer (Absolute Positioning) */}
                <div className="absolute top-0 left-16 right-0 h-full">
                    {processedEvents.map((event) => {
                        const top = event.startHour * ROW_HEIGHT;
                        const height = event.duration * ROW_HEIGHT;
                        
                        return (
                            <div 
                                key={event.id}
                                style={{ 
                                    top: `${top}px`, 
                                    height: `${height}px`,
                                    left: `${event.leftPercent}%`,
                                    width: `${event.widthPercent}%`
                                }}
                                className="absolute px-1 z-10 transition-all duration-300"
                            >
                                <div className={`w-full h-full rounded-lg border-l-4 p-2 text-xs flex flex-col gap-1 shadow-lg backdrop-blur-sm hover:z-50 hover:scale-[1.02] cursor-pointer overflow-hidden ${event.colorClass}`}>
                                    <div className="font-medium truncate flex items-center gap-1">
                                        {event.deviceName}
                                        <span className="opacity-50 text-[10px] font-normal">
                                            {Math.floor(event.startHour)}:{(event.startHour % 1 * 60).toString().padStart(2, '0')}
                                        </span>
                                    </div>
                                    <div className="opacity-80 leading-tight line-clamp-2">{event.title}</div>
                                </div>
                            </div>
                        );
                    })}
                    
                    {/* Current Time Indicator Line (Static Mock) */}
                    {(view === 'week' || view === 'day') && (
                        <div 
                            className="absolute left-0 right-0 h-px bg-blue-500 z-30 flex items-center pointer-events-none"
                            style={{ top: `${9.72 * ROW_HEIGHT}px` }} // e.g. 09:43 AM
                        >
                            <div className="w-2 h-2 rounded-full bg-blue-500 -ml-1 shadow-[0_0_8px_rgba(59,130,246,1)]"></div>
                            <div className="w-full h-[1px] shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
                        </div>
                    )}
                </div>

            </div>
         </>
        )}
      </div>
    </div>
  );
};
