import React from 'react';
import { Eye } from 'lucide-react';

/**
 * 落地页 - 网站入口
 */
export const Landing = ({ onEnter }) => {
  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
        <div className="absolute top-[10%] left-[10%] w-32 h-32 border border-white rounded-full"></div>
        <div className="absolute bottom-[20%] right-[15%] w-64 h-64 border border-dashed border-white rounded-full"></div>
      </div>
      <div className="z-10 max-w-2xl text-center space-y-8 animate-fade-in-up">
        <div className="flex justify-center mb-6">
          <Eye size={64} strokeWidth={1} />
        </div>
        <h1 className="text-5xl md:text-7xl font-bold tracking-tighter mb-4">神秘档案馆</h1>
        <p className="text-lg md:text-xl font-light text-gray-400 leading-relaxed max-w-lg mx-auto">
          我们收录世界上最隐秘的异常生物、禁忌地带与未解事件。
          <br />
          在这里，好奇心不再是禁忌，而是通往真相的唯一钥匙。
        </p>
        <button 
          onClick={onEnter}
          className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-bold text-black transition-all duration-200 bg-white font-mono focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-white hover:bg-gray-200"
        >
          <span>ENTER ARCHIVES // 进入档案馆</span>
          <div className="absolute inset-0 border-2 border-white translate-x-1 translate-y-1 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform"></div>
        </button>
      </div>
      <div className="absolute bottom-6 text-xs text-gray-600 font-mono">EST. 2026 // AUTHORIZED PERSONNEL ONLY</div>
    </div>
  );
};
