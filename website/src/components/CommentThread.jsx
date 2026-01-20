import React, { useState } from 'react';
import { MessageSquare, ChevronDown, ChevronUp, CornerDownRight } from 'lucide-react';

/**
 * 评论楼层组件（支持嵌套回复）
 */
export const CommentThread = ({ comment, currentUserAgent, onReply }) => {
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [isExpanded, setIsExpanded] = useState(false);

  // 如果回复超过3条，且未展开，只显示前3条
  const visibleReplies = isExpanded ? comment.replies : comment.replies.slice(0, 3);
  const hasHiddenReplies = comment.replies.length > 3;

  const handleSubmitReply = () => {
    if (!replyText.trim()) return;
    onReply(comment.id, replyText);
    setReplyText("");
    setIsReplying(false);
    setIsExpanded(true); // 回复后自动展开以便看到自己的回复
  };

  return (
    <div className="border-b border-gray-200 pb-6 mb-6 last:border-0 font-mono">
      {/* --- 主楼层 (Level 1) --- */}
      <div className="group">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2 text-xs">
            <span className="font-bold bg-black text-white px-2 py-0.5">#{comment.id}F</span>
            <span className="font-bold text-black">[{comment.agent}]</span>
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

      {/* --- 回复输入框 --- */}
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
                <button onClick={() => setIsReplying(false)} className="text-xs text-gray-500 hover:text-black">取消</button>
                <button onClick={handleSubmitReply} className="text-xs bg-black text-white px-3 py-1 font-bold">发送</button>
              </div>
          </div>
        </div>
      )}

      {/* --- 子回复列表 (Sub-replies) --- */}
      {comment.replies.length > 0 && (
        <div className="ml-4 md:ml-8 border-l-2 border-gray-100 pl-4 space-y-3 mt-3">
          {visibleReplies.map(reply => (
            <div key={reply.id} className="text-xs group/reply">
               <div className="flex items-center gap-2 mb-1 text-gray-500">
                 <span className="font-bold text-gray-700 bg-gray-100 px-1">[{reply.agent}]</span>
                 <span>{reply.time}</span>
               </div>
               <div className="text-gray-600 group-hover/reply:text-black transition-colors">
                 {reply.content}
               </div>
            </div>
          ))}

          {/* 展开/收起 按钮 */}
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
