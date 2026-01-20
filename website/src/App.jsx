import React, { useState, useEffect } from 'react';
import { FileText, Eye, Shield, Hash, ArrowLeft, Send, Search, Menu, X, Globe, User, MessageSquare, ChevronDown, ChevronUp, CornerDownRight } from 'lucide-react';

// 导入真实档案数据
import ARCHIVE_DATA from '../../archives/registry.js';

// 导入评论服务
import { getComments, addComment, addReply, subscribeToComments } from './services/commentService.js';

// --- 1. 分类定义 ---
const CATEGORIES = [
  { id: 'all', label: '全部档案 // ALL' },
  { id: 'creature', label: '未知生物 // CREATURES' },
  { id: 'location', label: '禁忌地带 // LOCATIONS' },
  { id: 'artifact', label: '诡秘物品 // ARTIFACTS' },
  { id: 'event', label: '未解事件 // EVENTS' }
];

// --- 2. 评论组件 ---
const CommentThread = ({ comment, currentUserAgent, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  const visibleReplies = isExpanded ? comment.replies : comment.replies.slice(0, 3);
  const hasHiddenReplies = comment.replies.length > 3;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
    setIsExpanded(true);
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-0 font-mono">
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold bg-black text-white px-2 py-0.5">#{comment.id}F</span>
            <span className="font-bold text-black">
              [{comment.agent}]
              {comment.agent === currentUserAgent && <span className="text-blue-600 ml-1">(我)</span>}
            </span>
            <span className="text-gray-400">{comment.time}</span>
          </div>
          <button 
            onClick={() => setIsReplying(!isReplying)}
            className="text-xs flex items-center gap-1 text-gray-400 hover:text-black transition-colors"
          >
            <MessageSquare size={12} /> 回复
          </button>
        </div>
        <div className="pl-0 text-sm text-gray-800 leading-relaxed mb-3">
          {comment.content}
        </div>
      </div>

      {isReplying && (
        <div className="ml-4 mb-4 flex gap-2 animate-fade-in-down">
          <CornerDownRight size={16} className="text-gray-300 mt-2 shrink-0" />
          <div className="flex-1">
            <textarea 
              autoFocus
              className="w-full bg-gray-50 border border-black p-2 text-xs focus:outline-none min-h-[60px]"
              placeholder={`回复 ${comment.agent}...`}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
            />
            <div className="flex justify-end mt-1 gap-2">
              <button onClick={() => setIsReplying(false)} className="text-xs text-gray-500 hover:text-black">
                取消
              </button>
              <button onClick={handleSubmitReply} className="text-xs bg-black text-white px-3 py-1 font-bold">
                发送
              </button>
            </div>
          </div>
        </div>
      )}

      {comment.replies.length > 0 && (
        <div className="ml-4 md:ml-8 border-l-2 border-gray-100 pl-4 space-y-3 mt-3">
          {visibleReplies.map(reply => (
            <div key={reply.id} className="text-xs group/reply">
              <div className="flex items-center gap-2 mb-1 text-gray-500">
                <span className="font-bold text-gray-700 bg-gray-100 px-1">
                  [{reply.agent}]
                  {reply.agent === currentUserAgent && <span className="text-blue-600 ml-1">(我)</span>}
                </span>
                <span>{reply.time}</span>
              </div>
              <div className="text-gray-600 group-hover/reply:text-black transition-colors">
                {reply.content}
              </div>
            </div>
          ))}
          {hasHiddenReplies && (
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-xs text-blue-600 hover:underline flex items-center gap-1 mt-2 font-bold"
            >
              {isExpanded ? (
                <><ChevronUp size={12} /> 收起回复</>
              ) : (
                <><ChevronDown size={12} /> 展开剩余 {comment.replies.length - 3} 条回复</>
              )}
            </button>
          )}
        </div>
      )}
    </div>
  );
};

// --- 3. 主应用 ---
export default function MysteryArchive() {
  const [currentView, setCurrentView] = useState('landing');
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeItem, setActiveItem] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [agentName, setAgentName] = useState("");
  const [agentId, setAgentId] = useState("");
  const [showIdentityModal, setShowIdentityModal] = useState(false);

  const [scrollProgress, setScrollProgress] = useState(0);
  const [allComments, setAllComments] = useState({}); // 改为对象，key 是档案 ID
  const [newMainComment, setNewMainComment] = useState("");

  // 获取当前档案的评论
  const getCurrentComments = () => {
    if (!activeItem) return [];
    return allComments[activeItem.id] || [];
  };

  // 初始化身份
  useEffect(() => {
    const storedAgent = localStorage.getItem('mystery_agent_id');
    const storedName = localStorage.getItem('mystery_agent_name');
    
    if (storedAgent && storedName) {
      setAgentId(storedAgent);
      setAgentName(storedName);
    } else {
      const codeNames = ["夜枭", "苍狼", "幽灵", "蝰蛇", "渡鸦", "红隼"];
      const randomCode = Math.floor(100 + Math.random() * 900);
      const randomName = codeNames[Math.floor(Math.random() * codeNames.length)];
      const fullName = `探员·${randomName}·${randomCode}`;
      const fullId = Math.random().toString(36).substring(2, 15);
      
      localStorage.setItem('mystery_agent_id', fullId);
      localStorage.setItem('mystery_agent_name', fullName);
      setAgentId(fullId);
      setAgentName(fullName);
    }
  }, []);

  // 加载当前档案的评论
  useEffect(() => {
    if (!activeItem || currentView !== 'detail') return;
    
    // 加载评论
    getComments(activeItem.id).then(comments => {
      setAllComments(prev => ({
        ...prev,
        [activeItem.id]: comments
      }));
    });
    
    // 订阅实时更新
    const subscription = subscribeToComments(activeItem.id, (comments) => {
      setAllComments(prev => ({
        ...prev,
        [activeItem.id]: comments
      }));
    });
    
    return () => {
      subscription.unsubscribe();
    };
  }, [activeItem, currentView]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      if (currentView !== 'detail') return;
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentView]);

  const handleEnterSite = () => {
    setCurrentView('dashboard');
    window.scrollTo(0, 0);
  };

  const handleOpenDetail = (item) => {
    setActiveItem(item);
    setCurrentView('detail');
    window.scrollTo(0, 0);
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setActiveItem(null);
  };

  const handleSubmitMainComment = async () => {
    if (!newMainComment.trim() || !activeItem) return;
    
    const newComment = await addComment(activeItem.id, agentName, newMainComment);
    
    if (newComment) {
      const currentComments = getCurrentComments();
      setAllComments(prev => ({
        ...prev,
        [activeItem.id]: [newComment, ...currentComments]
      }));
      setNewMainComment("");
    }
  };

  const handleReplyToComment = async (parentId, content) => {
    if (!activeItem) return;
    
    const newReply = await addReply(parentId, agentName, content, activeItem.id);
    
    if (newReply) {
      const currentComments = getCurrentComments();
      const updatedComments = currentComments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...comment.replies, newReply]
          };
        }
        return comment;
      });
      
      setAllComments(prev => ({
        ...prev,
        [activeItem.id]: updatedComments
      }));
    }
  };

  const getFilteredData = () => {
    return ARCHIVE_DATA.filter(item => {
      const matchCategory = activeCategory === 'all' || item.category === activeCategory;
      
      if (!searchQuery.trim()) return matchCategory;
      
      const query = searchQuery.toLowerCase();
      const matchSearch = 
        item.title.toLowerCase().includes(query) || 
        item.summary.toLowerCase().includes(query) || 
        item.tags.some(t => t.toLowerCase().includes(query));
      
      return matchCategory && matchSearch;
    });
  };

  // 身份弹窗
  const IdentityModal = () => {
    if (!showIdentityModal) return null;
    
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
           onClick={() => setShowIdentityModal(false)}>
        <div className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col" 
             onClick={e => e.stopPropagation()}>
          <div className="bg-black text-white p-4 flex justify-between items-center">
            <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
              <Shield size={18} /> 探员档案 (CLASSIFIED)
            </h3>
            <button onClick={() => setShowIdentityModal(false)}>
              <X size={20} />
            </button>
          </div>
          <div className="p-6 space-y-6 font-mono">
            <div className="border border-black p-4 bg-gray-50 relative overflow-hidden">
              <div className="absolute top-2 right-2 text-6xl opacity-5 select-none">TOP SECRET</div>
              <div className="grid grid-cols-[80px_1fr] gap-4">
                <div className="w-20 h-20 bg-gray-200 border border-gray-400 flex items-center justify-center">
                  <User size={40} className="text-gray-400" />
                </div>
                <div>
                  <div className="text-xs text-gray-500">CODENAME</div>
                  <div className="text-xl font-bold">{agentName}</div>
                  <div className="text-xs text-gray-500 mt-2">SECURE HASH</div>
                  <div className="text-xs break-all font-bold">{agentId}</div>
                </div>
              </div>
            </div>
            <div className="bg-red-50 border border-red-200 p-3 text-xs text-red-800 flex gap-2 items-start">
              <Shield size={14} className="mt-0.5 shrink-0" />
              <p>
                <strong>安全警示：</strong> 为了保护探员的人身安全，所有访问记录与身份档案将在本地缓存清除后自动销毁。系统将为您重新分配新的代号。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // 落地页
  const renderLanding = () => (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 border border-dashed border-white rounded-full"></div>
      </div>
      
      <div className="z-10 max-w-2xl text-center space-y-8 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <Eye size={64} strokeWidth={1} />
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">
          神秘档案馆
        </h1>
        
        <p className="text-lg md:text-xl font-light text-gray-400 leading-relaxed max-w-lg mx-auto">
          我们收录世界上的未解之谜和奇闻异事。<br />
          在这里，好奇心不再是禁忌，而是通往真相的唯一钥匙。
        </p>
        
        <button 
          onClick={handleEnterSite}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:bg-gray-200"
        >
          <span>ENTER ARCHIVES // 进入档案馆</span>
          <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
        </button>
      </div>
      
      <div className="absolute bottom-6 text-xs text-gray-600 font-mono">
        EST. 2026 // AUTHORIZED PERSONNEL ONLY
      </div>
    </div>
  );

  // 主控台
  const renderDashboard = () => (
    <div className="min-h-screen bg-gray-50 text-black flex flex-col md:flex-row">
      <div className="md:hidden bg-white border-b border-black p-4 flex justify-between items-center sticky top-0 z-40">
        <div className="font-bold">MYSTERY ARCHIVE</div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      <div className={`fixed inset-0 z-30 bg-white md:static md:w-64 md:border-r md:border-black md:h-screen md:sticky md:top-0 flex flex-col transition-transform duration-300 ${
        isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}>
        <div className="p-6 border-b border-black hidden md:block">
          <button 
            onClick={() => setCurrentView('landing')}
            className="w-full text-left hover:opacity-70 transition-opacity"
          >
            <h2 className="text-2xl font-bold tracking-tighter flex items-center gap-2">
              <Globe size={20} /> 档案馆
            </h2>
          </button>
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
        
        <div className="p-4 border-t border-black bg-gray-100 cursor-pointer hover:bg-gray-200 transition-colors" 
             onClick={() => setShowIdentityModal(true)}>
          <div className="text-[10px] text-gray-500 uppercase mb-1">Current Agent</div>
          <div className="flex items-center gap-2 font-bold text-sm truncate">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            {agentName}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen">
        <div className="bg-white border-b border-black p-6 sticky top-0 z-20 shadow-sm">
          <div className="max-w-4xl mx-auto flex items-center gap-4">
            <Search className="text-gray-400" />
            <input 
              type="text" 
              placeholder="搜索关键词或内容..." 
              className="flex-1 bg-transparent text-lg outline-none placeholder:text-gray-300"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

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
                  onClick={() => handleOpenDetail(item)}
                  className="group bg-white border border-black p-6 cursor-pointer hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all duration-200 relative"
                >
                  <div className="flex justify-between items-start mb-8">
                    <span className="font-mono text-xs bg-black text-white px-1 py-0.5">
                      {item.id}
                    </span>
                    <ArrowLeft className="rotate-180 opacity-0 group-hover:opacity-100 transition-opacity" size={16} />
                  </div>
                  
                  <h3 className="text-xl font-bold mb-3 line-clamp-1">{item.title}</h3>
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4 font-serif leading-relaxed">
                    {item.summary}
                  </p>
                  
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
              <div className="text-center py-20 text-gray-400 font-mono">
                NO RECORDS MATCHING QUERY.
              </div>
            )}
          </div>
        </div>
      </div>

      <IdentityModal />
    </div>
  );

  // 详情页
  const renderDetailView = () => {
    if (!activeItem) return null;

    return (
      <div className="min-h-screen bg-white text-black">
        <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black h-12 flex items-center justify-between px-4 select-none">
          <div className="flex items-center gap-4">
            <button 
              onClick={handleBackToDashboard} 
              className="flex items-center gap-1 hover:underline font-bold text-xs tracking-widest"
            >
              <ArrowLeft size={12} /> 返回列表
            </button>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <button 
              onClick={() => setCurrentView('landing')} 
              className="flex items-center gap-1 hover:underline font-bold text-xs tracking-widest text-gray-500 hover:text-black"
            >
              返回首页
            </button>
            <div className="h-4 w-[1px] bg-gray-300"></div>
            <span className="font-mono text-xs text-gray-500">{activeItem.id}</span>
          </div>
          
          <div className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 transition-colors" 
               onClick={() => setShowIdentityModal(true)}>
            <span className="text-xs font-mono hidden md:inline">当前代号：{agentName}</span>
            <Shield size={14} />
          </div>

          <div 
            className="absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300" 
            style={{ width: `${scrollProgress}%`, opacity: scrollProgress > 5 ? 1 : 0 }} 
          />
        </div>

        <div className="pt-24 px-4 md:px-0 max-w-3xl mx-auto pb-20">
          <div className="text-center mb-12 animate-fade-in-up">
            <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
              {activeItem.title}
            </h1>
            <div className="flex flex-wrap justify-center gap-3">
              {activeItem.tags.map(tag => (
                <span key={tag} className="border border-black px-3 py-1 text-sm font-medium">
                  {tag}
                </span>
              ))}
            </div>
          </div>

          <div className="border-t border-b border-black py-12 my-8 relative">
            <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-1 font-mono">
              CONFIDENTIAL // READ ONLY
            </div>
            <div className="pl-6 border-l-4 border-black">
              <p className="text-lg md:text-xl leading-relaxed text-justify font-serif text-gray-900">
                {activeItem.summary}
              </p>
            </div>
          </div>

          {/* 评论区 */}
          <div className="mt-24">
            <div className="flex items-center gap-4 mb-8">
              <h3 className="text-xl font-bold whitespace-nowrap">探员日志 ({getCurrentComments().length})</h3>
              <div className="h-[1px] bg-black w-full"></div>
            </div>

            {/* 新增主评论 */}
            <div className="bg-gray-50 p-6 border border-black relative mb-12">
              <div className="absolute top-0 right-0 bg-black text-white text-[10px] px-2 py-0.5">
                NEW LOG ENTRY
              </div>
              <label className="block text-xs font-bold mb-2 uppercase">
                新增楼层记录 // New Case Log
              </label>
              <textarea 
                className="w-full bg-white border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/20 min-h-[80px] resize-y"
                placeholder="在此输入您的调查发现..."
                value={newMainComment}
                onChange={(e) => setNewMainComment(e.target.value)}
              />
              <div className="flex justify-between items-center mt-4">
                <span className="text-xs text-gray-400 font-mono hidden md:inline">
                  IDENTITY: {agentName}
                </span>
                <button 
                  onClick={handleSubmitMainComment}
                  className="bg-black text-white px-6 py-2 text-sm font-bold flex items-center gap-2 hover:bg-gray-800 transition-colors"
                >
                  [ 提交新记录 ] <Send size={14} />
                </button>
              </div>
            </div>

            {/* 评论列表 */}
            <div className="space-y-2">
              {getCurrentComments().map((comment) => (
                <CommentThread 
                  key={comment.id} 
                  comment={comment} 
                  currentUserAgent={agentName}
                  onReply={handleReplyToComment}
                />
              ))}
            </div>
          </div>
        </div>

        <IdentityModal />
      </div>
    );
  };

  return (
    <div>
      {currentView === 'landing' && renderLanding()}
      {currentView === 'dashboard' && renderDashboard()}
      {currentView === 'detail' && renderDetailView()}
    </div>
  );
}
