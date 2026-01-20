// archives/registry.js
// 使用 Vite 的 import.meta.glob 自动导入所有档案文件

// 自动扫描当前目录下所有子文件夹里的 .js 文件
// { eager: true } 表示直接加载，不要异步懒加载
const modules = import.meta.glob('./**/*.js', { eager: true });

const archives = [];

for (const path in modules) {
  // 跳过 registry.js 自己
  if (path.includes('registry.js')) continue;
  
  const mod = modules[path];
  // 只要文件里有 export default，就把它加到列表里
  if (mod.default) {
    archives.push(mod.default);
  }
}

// 按 ID 排序
archives.sort((a, b) => a.id.localeCompare(b.id));

export default archives;
export const ARCHIVE_DATA = archives;
