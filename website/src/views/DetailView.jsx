import React, { useState, useEffect } from 'react';
import { ArrowLeft, Shield, Send } from 'lucide-react';
import { CommentThread } from '../components/CommentThread';
import { getComments, addMainComment, addReply } from '../services/commentService';

/**
 * 档案详情页
 */
export const DetailView = ({ item, agentName, onBack, onOpenIdentity }) => {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [comments, setComments] = useState([]);
  const [newMainComment, setNewMainComment] = useState("");

  // 加载评论
  useEffect(() => {
    if (item) {
      const loadedComments = getComments(item.id);
      setComments(loadedComments);
    }
  }, [item]);

  // 滚动监听
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = (window.scrollY / totalHeight) * 100;
      setScrollProgress(progress);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 提交主评论
  const handleSubmitMainComment = () => {
    if (!newMainComment.trim()) return;
    const updatedComments = addMainComment(item.id, newMainComment, agentName);
    setComments(updatedComments);
    setNewMainComment("");
  };

  // 提交回复
  const handleReplyToComment = (parentId, content) => {
    const updatedComments = addReply(item.id, parentId, content, agentName);
    setComments(updatedComments);
  };

  if (!item) return null;

  return (
    <div className="min-h-screen bg-white text-black">
      {/* 顶部导航栏 */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-black h-12 flex items-center justify-between px-4 select-none">
         <div className="flex items-center gap-4">
           <button onClick={onBack} className="flex items-center gap-1 hover:underline font-bold text-xs tracking-widest">
             <ArrowLeft size={12} /> 返回列表
           </button>
           <div className="h-4 w-[1px] bg-gray-300"></div>
           <span className="font-mono text-xs text-gray-500">{item.id}</span>
         </div>
         <div 
           className="flex items-center gap-2 cursor-pointer hover:bg-gray-100 px-2 py-1 transition-colors" 
           onClick={onOpenIdentity}
         >
           <span className="text-xs font-mono hidden md:inline">当前代号：{agentName}</span>
           <Shield size={14} />
         </div>
         <div 
           className="absolute bottom-0 left-0 h-[2px] bg-black transition-all duration-300" 
           style={{ width: `${scrollProgress}%`, opacity: scrollProgress > 5 ? 1 : 0 }} 
         />
      </div>

      {/* 主内容 */}
      <div className="pt-24 px-4 md:px-0 max-w-3xl mx-auto pb-20">
        {/* 标题区 */}
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">{item.title}</h1>
          <div className="flex flex-wrap justify-center gap-3">
            {item.tags.map(tag => (
              <span key={tag} className="border border-black px-3 py-1 text-sm font-medium">{tag}</span>
            ))}
          </div>
        </div>

        {/* 档案内容 */}
        <div className="border-t border-b border-black py-12 my-8 relative">
          <div className="absolute top-0 left-0 bg-black text-white text-[10px] px-1 font-mono">CONFIDENTIAL // READ ONLY</div>
          <div className="pl-6 border-l-4 border-black">
            <p className="text-lg md:text-xl leading-relaxed text-justify font-serif text-gray-900">{item.summary}</p>
            <p className="mt-6 text-lg md:text-xl leading-relaxed text-justify font-serif text-gray-900">
              （此处为模拟的长文本内容，用于展示排版效果）该收录物的发现改变了我们对物理法则的认知。
              探员在接触该物体后的72小时内，报告了不同程度的时间感知错乱。
              目前该物品被收容于Site-19的深层隔离区，任何实验均需经过O5议会的三名成员授权。
              警告：请勿长时间直视该物体的全息影像。
            </p>
          </div>
        </div>

        {/* 评论区 */}
        <div className="mt-24">
          <div className="flex items-center gap-4 mb-8">
            <h3 className="text-xl font-bold whitespace-nowrap">探员日志 ({comments.length})</h3>
            <div className="h-[1px] bg-black w-full"></div>
          </div>

          {/* 新增主评论输入框 */}
          <div className="bg-gray-50 p-6 border border-black relative mb-12">
            <div className="absolute top-0 right-0 bg-black text-white text-[10px] px-2 py-0.5">NEW LOG ENTRY</div>
            <label className="block text-xs font-bold mb-2 uppercase">新增楼层记录 // New Case Log</label>
            <textarea 
              className="w-full bg-white border border-black p-3 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-black/20 min-h-[80px] resize-y"
              placeholder="在此输入您的调查发现..."
              value={newMainComment}
              onChange={(e) => setNewMainComment(e.target.value)}
            />
            <div className="flex justify-between items-center mt-4">
              <span className="text-xs text-gray-400 font-mono hidden md:inline">IDENTITY: {agentName}</span>
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
            {comments.length === 0 ? (
              <div className="text-center py-12 text-gray-400 font-mono text-sm">
                暂无探员日志记录 // NO LOGS YET
              </div>
            ) : (
              comments.map((comment) => (
                <CommentThread 
                  key={comment.id} 
                  comment={comment} 
                  currentUserAgent={agentName}
                  onReply={handleReplyToComment}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
