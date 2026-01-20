import React from 'react';
import { Shield, X, User } from 'lucide-react';
import { getAgentActivity } from '../services/commentService';

/**
 * 探员身份档案弹窗
 * 显示当前身份信息和活动记录
 */
export const IdentityModal = ({ isOpen, onClose, agentId, agentName }) => {
  if (!isOpen) return null;

  // 获取当前探员的活动记录
  const activity = getAgentActivity(agentName);
  const totalActivity = activity.mainComments.length + activity.replies.length;

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4" 
      onClick={onClose}
    >
      <div 
        className="bg-white border-2 border-black w-full max-w-md shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col max-h-[90vh]" 
        onClick={e => e.stopPropagation()}
      >
        <div className="bg-black text-white p-4 flex justify-between items-center">
          <h3 className="text-lg font-bold tracking-widest flex items-center gap-2">
            <Shield size={18} /> 探员档案 (CLASSIFIED)
          </h3>
          <button onClick={onClose}><X size={20} /></button>
        </div>
        
        <div className="p-6 space-y-6 font-mono overflow-y-auto">
          {/* 身份信息 */}
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

          {/* 活动记录 */}
          <div>
            <div className="text-xs font-bold border-b border-black mb-2 pb-1">
              最近动态 // RECENT ACTIVITY ({totalActivity})
            </div>
            
            {totalActivity === 0 ? (
              <div className="text-sm text-gray-500 py-4 text-center">
                暂无活动记录
              </div>
            ) : (
              <div className="space-y-3 max-h-[200px] overflow-y-auto">
                {/* 主评论 */}
                {activity.mainComments.map((item, index) => (
                  <div key={`main-${index}`} className="text-xs border-l-2 border-green-500 pl-2">
                    <div className="flex gap-2 items-start">
                      <span className="text-green-600 font-bold">●</span>
                      <div className="flex-1">
                        <div className="text-gray-500">{item.time} · 档案 {item.archiveId}</div>
                        <div className="text-gray-800 mt-1">发表评论: {item.content.substring(0, 50)}{item.content.length > 50 ? '...' : ''}</div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* 回复 */}
                {activity.replies.map((item, index) => (
                  <div key={`reply-${index}`} className="text-xs border-l-2 border-blue-500 pl-2">
                    <div className="flex gap-2 items-start">
                      <span className="text-blue-600 font-bold">●</span>
                      <div className="flex-1">
                        <div className="text-gray-500">{item.time} · 档案 {item.archiveId}</div>
                        <div className="text-gray-800 mt-1">回复评论: {item.content.substring(0, 50)}{item.content.length > 50 ? '...' : ''}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 安全警示 */}
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
