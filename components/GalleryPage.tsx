

import React, { useState, useMemo } from 'react';
import { 
  Grid, List, ChevronLeft, ChevronRight, X, Download, Printer, Share2, 
  MoreVertical, Folder, Calendar
} from 'lucide-react';
import { GalleryItem, GalleryFolder } from '../types';

// --- Mock Data ---

const GALLERY_FOLDERS: GalleryFolder[] = [
  { id: '1', name: '一月', count: 12, size: '32mb', lastOpened: '2022-02-17 11:22:56' },
  { id: '2', name: '二月', count: 8, size: '45mb', lastOpened: '2022-02-16 09:15:30' },
  { id: '3', name: '三月', count: 15, size: '128mb', lastOpened: '2022-02-17 11:22:56' },
  { id: '4', name: '四月', count: 5, size: '32mb', lastOpened: '2022-02-17 11:22:56' },
  { id: '5', name: '五月', count: 20, size: '32mb', lastOpened: '2022-02-17 11:22:56' },
];

const GALLERY_ITEMS: GalleryItem[] = [
  // January
  { id: '101', month: '一月', url: 'https://images.unsplash.com/photo-1558442074-3c19857bc1d7?auto=format&fit=crop&w=800&q=80', name: 'Garden-View-01', date: '2022-01-15 10:00:00', size: '2.4mb', dimensions: '1920x1080' },
  { id: '102', month: '一月', url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', name: 'Kitchen-Morning', date: '2022-01-16 08:30:00', size: '3.1mb', dimensions: '1920x1080' },
  { id: '103', month: '一月', url: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80', name: 'Living-Room-Wide', date: '2022-01-20 14:15:00', size: '4.5mb', dimensions: '1920x1080' },
  { id: '104', month: '一月', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=800&q=80', name: 'Sofa-Detail', date: '2022-01-22 16:20:00', size: '1.8mb', dimensions: '1920x1080' },
  
  // February
  { id: '201', month: '二月', url: 'https://images.unsplash.com/photo-1484154218962-a1c002085d2f?auto=format&fit=crop&w=800&q=80', name: 'Bedroom-Cozy', date: '2022-02-10 11:45:00', size: '2.9mb', dimensions: '1920x1080' },
  { id: '202', month: '二月', url: 'https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=800&q=80', name: 'Office-Setup', date: '2022-02-12 09:30:00', size: '3.2mb', dimensions: '1920x1080' },
  { id: '203', month: '二月', url: 'https://images.unsplash.com/photo-1522771753035-4a50c95b9d12?auto=format&fit=crop&w=800&q=80', name: 'TV-Console', date: '2022-02-14 19:00:00', size: '2.1mb', dimensions: '1920x1080' },
  { id: '204', month: '二月', url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', name: 'Plant-Corner', date: '2022-02-15 13:10:00', size: '1.5mb', dimensions: '1920x1080' },
  
  // March (Mocking items around Reference Date 2022-03-08)
  { id: '301', month: '三月', url: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=800&q=80', name: 'Cat-Portrait-01', date: '2022-03-01 10:00:00', size: '2.8mb', dimensions: '1920x1080' },
  { id: '302', month: '三月', url: 'https://images.unsplash.com/photo-1573865526739-10659fec78a5?auto=format&fit=crop&w=800&q=80', name: 'Coffee-Station', date: '2022-03-02 08:00:00', size: '3.5mb', dimensions: '1920x1080' },
  { id: '303', month: '三月', url: 'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=800&q=80', name: 'Exterior-Front', date: '2022-03-05 12:30:00', size: '4.2mb', dimensions: '1920x1080' },
  { id: '304', month: '三月', url: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80', name: 'Baby-Monitor', date: '2022-03-08 20:15:00', size: '1.9mb', dimensions: '1920x1080' },
  { id: '305', month: '三月', url: 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', name: 'Living-Room-Eve', date: '2022-03-08 18:30:00', size: '2.1mb', dimensions: '1920x1080' },
  { id: '306', month: '三月', url: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?auto=format&fit=crop&w=800&q=80', name: 'Kitchen-Night', date: '2022-03-07 21:00:00', size: '3.0mb', dimensions: '1920x1080' },
];

export const GalleryPage: React.FC = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedImage, setSelectedImage] = useState<GalleryItem | null>(null);
  const [activeFilter, setActiveFilter] = useState<'day'|'week'|'month'|'year'>('year');

  // Filter Logic
  // Reference Date set to March 8, 2022 to match the "today" context of the dashboard screenshots/mock data.
  const filteredItems = useMemo(() => {
    const REFERENCE_DATE = new Date('2022-03-08T23:59:59');
    
    return GALLERY_ITEMS.filter(item => {
        const itemDate = new Date(item.date);
        const diffTime = REFERENCE_DATE.getTime() - itemDate.getTime();
        const diffDays = diffTime / (1000 * 60 * 60 * 24);

        if (diffDays < 0) return false; // Future items (if any) excluded

        switch(activeFilter) {
            case 'day':
                // Within the last 24 hours relative to reference end of day
                return diffDays <= 1;
            case 'week':
                // Within the last 7 days
                return diffDays <= 7;
            case 'month':
                // Same Month and Year
                return itemDate.getMonth() === REFERENCE_DATE.getMonth() && itemDate.getFullYear() === REFERENCE_DATE.getFullYear();
            case 'year':
            default:
                return true;
        }
    });
  }, [activeFilter]);

  const groupedItems = useMemo(() => {
    return filteredItems.reduce((acc, item) => {
        if (!acc[item.month]) acc[item.month] = [];
        acc[item.month].push(item);
        return acc;
    }, {} as Record<string, GalleryItem[]>);
  }, [filteredItems]);

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedImage.id);
    if (currentIndex === -1) return;
    const nextIndex = (currentIndex + 1) % filteredItems.length;
    setSelectedImage(filteredItems[nextIndex]);
  };

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedImage) return;
    const currentIndex = filteredItems.findIndex(i => i.id === selectedImage.id);
    if (currentIndex === -1) return;
    const prevIndex = (currentIndex - 1 + filteredItems.length) % filteredItems.length;
    setSelectedImage(filteredItems[prevIndex]);
  };

  const handleDownload = () => {
      if (!selectedImage) return;
      const link = document.createElement('a');
      link.href = selectedImage.url;
      link.download = selectedImage.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  };

  const handlePrint = () => {
      window.print();
  };

  const handleShare = async () => {
      if (!selectedImage) return;
      if (navigator.share) {
          try {
              await navigator.share({
                  title: selectedImage.name,
                  text: 'Check out this photo from SmartHome Pro',
                  url: selectedImage.url,
              });
          } catch (error) {
              console.log('Error sharing:', error);
          }
      } else {
          alert('Share functionality is not supported in this browser.');
      }
  };

  return (
    <div className="flex-1 p-8 overflow-y-auto custom-scrollbar relative">
      
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-medium text-slate-200 mb-2">图库</h2>
          <div className="flex items-center gap-2 text-sm text-slate-500">
             <Folder size={16} className="text-blue-500" />
             <span className="text-slate-300">图库</span>
             <span>/</span>
             <span className="text-slate-200 font-medium">
                {activeFilter === 'year' ? '全部' : activeFilter === 'month' ? '本月' : activeFilter === 'week' ? '本周' : '今日'}
             </span>
          </div>
        </div>

        <div className="flex items-center gap-6">
            <div className="bg-dark-800 rounded-lg p-1 flex gap-1 border border-slate-700">
                <button 
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'grid' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <Grid size={18} />
                </button>
                <button 
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-md transition-all ${viewMode === 'list' ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                >
                    <List size={18} />
                </button>
            </div>

            <div className="bg-dark-800 rounded-lg p-1 flex gap-1 border border-slate-700 hidden sm:flex">
                {['日', '周', '月', '年'].map((f) => {
                    const filterKey = f === '年' ? 'year' : f === '月' ? 'month' : f === '周' ? 'week' : 'day';
                    const isActive = activeFilter === filterKey;
                    return (
                        <button 
                            key={f} 
                            onClick={() => setActiveFilter(filterKey as any)}
                            className={`px-4 py-1.5 text-xs rounded-md transition-all ${isActive ? 'bg-blue-600 text-white' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            {f}
                        </button>
                    )
                })}
            </div>
        </div>
      </div>

      {/* Content */}
      {viewMode === 'grid' ? (
        <div className="space-y-10 animate-in fade-in duration-500">
            {Object.keys(groupedItems).length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
                    <Calendar size={48} className="mb-4 opacity-30" />
                    <p>该时间段内没有照片</p>
                    <button 
                        onClick={() => setActiveFilter('year')}
                        className="mt-4 text-blue-400 hover:text-blue-300 text-sm"
                    >
                        查看所有照片
                    </button>
                </div>
            ) : (
                Object.entries(groupedItems).map(([month, items]) => (
                    <div key={month} className="animate-in slide-in-from-bottom-4 duration-500">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg text-slate-300 font-medium pl-3 border-l-4 border-blue-500 leading-none">{month}</h3>
                            <button className="text-xs text-blue-400 hover:text-blue-300 transition-colors">查看全部</button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                            {(items as GalleryItem[]).map(item => (
                                <div 
                                    key={item.id} 
                                    onClick={() => setSelectedImage(item)}
                                    className="group relative aspect-video bg-dark-800 rounded-xl overflow-hidden cursor-pointer border border-transparent hover:border-blue-500/50 transition-all shadow-lg hover:shadow-blue-900/10"
                                >
                                    <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                        <p className="text-white text-sm font-medium">{item.name}</p>
                                        <p className="text-slate-300 text-[10px]">{item.date.split(' ')[0]}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
      ) : (
        <div className="space-y-2 animate-in fade-in duration-500">
            {GALLERY_FOLDERS.map((folder, index) => (
                <div 
                    key={folder.id}
                    className="flex items-center p-4 bg-dark-800/50 hover:bg-dark-800 rounded-xl border border-transparent hover:border-slate-700 transition-all group cursor-pointer"
                    style={{ animationDelay: `${index * 50}ms` }}
                    onClick={() => setViewMode('grid')}
                >
                    <div className="w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center mr-6 group-hover:bg-blue-500/20 transition-colors">
                        <Folder className="text-blue-500" size={24} />
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h4 className="text-slate-200 font-medium truncate">{folder.name}</h4>
                        <p className="text-slate-500 text-xs sm:hidden">{folder.count} items • {folder.size}</p>
                    </div>

                    <div className="w-32 text-slate-400 text-sm hidden sm:block">
                        {folder.size}
                    </div>

                    <div className="flex-1 text-slate-500 text-sm hidden md:flex items-center gap-2">
                        <span>上次打开:</span>
                        <span className="font-mono text-slate-400">{folder.lastOpened}</span>
                    </div>

                    <div className="flex items-center gap-4">
                        <button 
                            className="text-blue-400 text-sm flex items-center gap-1 hover:gap-2 transition-all opacity-0 group-hover:opacity-100"
                        >
                            打开 <ChevronRight size={14} />
                        </button>
                        <button className="text-slate-600 hover:text-white transition-colors">
                            <MoreVertical size={18} />
                        </button>
                    </div>
                </div>
            ))}
        </div>
      )}

      {/* Lightbox / Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-900/95 backdrop-blur-md animate-in fade-in duration-200">
            {/* Toolbar */}
            <div className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-10">
                <div className="text-slate-400">
                    <span className="text-white font-medium mr-2">图库</span>
                    <span className="text-slate-600">/</span>
                    <span className="ml-2 text-sm">{selectedImage.month}</span>
                </div>
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-4 text-slate-400">
                        <button onClick={handlePrint} className="hover:text-white transition-colors" title="Print"><Printer size={20} /></button>
                        <button onClick={handleDownload} className="hover:text-white transition-colors" title="Download"><Download size={20} /></button>
                        <button onClick={handleShare} className="hover:text-white transition-colors" title="Share"><Share2 size={20} /></button>
                    </div>
                    <div className="w-px h-6 bg-slate-700"></div>
                    <button 
                        onClick={() => setSelectedImage(null)}
                        className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                </div>
            </div>

            {/* Nav Arrows */}
            <button 
                onClick={handlePrev}
                className="absolute left-6 w-12 h-12 rounded-full bg-black/20 hover:bg-blue-600/80 backdrop-blur text-white flex items-center justify-center transition-all z-10 group"
            >
                <ChevronLeft className="group-hover:-translate-x-1 transition-transform" />
            </button>
            <button 
                onClick={handleNext}
                className="absolute right-6 w-12 h-12 rounded-full bg-black/20 hover:bg-blue-600/80 backdrop-blur text-white flex items-center justify-center transition-all z-10 group"
            >
                <ChevronRight className="group-hover:translate-x-1 transition-transform" />
            </button>

            {/* Main Image */}
            <div className="w-full h-full p-20 flex items-center justify-center flex-col">
                <div className="relative max-w-5xl max-h-[70vh] w-full h-full shadow-2xl rounded-lg overflow-hidden">
                    <img 
                        src={selectedImage.url} 
                        alt={selectedImage.name} 
                        className="w-full h-full object-contain bg-black/50"
                    />
                </div>
                
                {/* Meta Panel */}
                <div className="mt-8 flex items-start gap-12 text-left w-full max-w-5xl">
                     <div>
                        <h2 className="text-2xl text-white font-medium mb-1">{selectedImage.name}</h2>
                        <div className="flex items-center gap-4 text-sm text-slate-400">
                            <span>{selectedImage.size}</span>
                            <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
                            <span>创建于 {selectedImage.date}</span>
                        </div>
                     </div>
                     <div className="h-10 w-px bg-slate-700"></div>
                     <div className="flex flex-col gap-1 text-xs text-slate-500">
                        <p>分辨率: {selectedImage.dimensions}</p>
                        <p>相机: Sony A7III</p>
                     </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};