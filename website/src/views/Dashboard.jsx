import React, { useState } from 'react';
import { Search, Globe, Menu, X, ArrowLeft } from 'lucide-react';
import { CATEGORIES } from '../data/categories';
import { ARCHIVE_DATA } from '../data/archives';

/**
 * 档案列表页 - 主仪表盘
 */
export const Dashboard = ({ agentName, onOpenDetail, onOpenIdentity }) => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const getFilteredData = () => {
    return ARCHIVE_DATA.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      const matchSearch = item.title.includes(searchQuery) || 
                         item.summary.includes(searchQuery) || 
                         item.tags.some(t => t.includes(searchQuery));
      return matchCategory && matchSearch;
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col md:flex-row">
      {/* 移动端顶部栏 */}
      <div className="md:hidden bg-white border-b border-black p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="font-bold">MYSTERY ARCHIVE</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* 侧边栏 */}
      <div className={`fixed inset-0 z-30 bg-white md:static md:w-64 md:border-r md:border-black flex flex-col transition-transform duration-300 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="p-6 border-b border-black hidden md:block">
          <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
            <Globe size={20} /> 收录馆
          </h2>
        </div>
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              onClick={() => { setActiveCategory(cat.id); setIsMobileMenuOpen(false); }}
              className={`w-full text-left px-4 py-3 text-sm font-bold font-mono transition-colors border ${
                activeCategory === cat.id 
                  ? 'bg-black text-white border-black' 
                  : 'bg-white text-gray-500 border-transparent hover:border-gray-300 hover:bg-gray-100'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </nav>
        <div 
          className="p-4 border-t border-black bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors" 
          onClick={onOpenIdentity}
        >
          <div className="text-[10px] text-gray-500 uppercase mb-1">Current Agent</div>
          <div className="flex items-center gap-2 font-bold text-sm truncate">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
             {agentName}
          </div>
        </div>
      </div>

      {/* 主内容区 */}
      <div className="flex-1 flex flex-col min-h-screen">
        {/* 搜索栏 */}
        <div className="bg-white border-b border-black p-6 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Search className="text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索档案编号、关键词或内容..." 
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* 档案卡片网格 */}
        <div className="p-6 md:p-12 bg-gray-50 flex-1">
          <div className="max-w-5xl mx-auto">
            <div className="mb-6 flex justify-between items-end">
              <h2 className="text-3xl font-bold">
                {CATEGORIES.find(c => c.id === activeCategory)?.label.split(' // ')[0]}
              </h2>
              <span className="font-mono text-xs text-gray-400">
                {getFilteredData().length} RECORDS FOUND
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredData().map((item) => (
                <div 
                  key={item.id}
                  onClick={() => onOpenDetail(item)}
                  className="group bg-white border border-black p-6 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 relative"
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="font-mono text-xs bg-black text-white px-1 py-0.5">{item.id}</span>
                    <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                  <h3 className="text-xl font-bold mb-3 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 font-serif leading-relaxed">{item.summary}</p>
                  <div className="flex flex-wrap gap-2 mt-auto">
                    {item.tags.slice(0, 2).map(tag => (
                      <span key={tag} className="text-[10px] uppercase tracking-wider border border-gray-200 px-1 text-gray-500">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            {getFilteredData().length === 0 && (
              <div className="text-center py-20 text-gray-400 font-mono">NO RECORDS MATCHING QUERY.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
