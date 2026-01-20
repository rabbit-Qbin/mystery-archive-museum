import { CODENAMES } from '../data/agentCodenames';

const STORAGE_KEY_ID = 'mystery_agent_id';
const STORAGE_KEY_NAME = 'mystery_agent_name';

/**
 * 生成随机探员代号
 * 格式: 探员·[代号]·[三位数字]
 */
export const generateAgentIdentity = () => {
  const randomCodename = CODENAMES[Math.floor(Math.random() * CODENAMES.length)];
  const randomNumber = Math.floor(100 + Math.random() * 900);
  const agentName = `探员·${randomCodename}·${randomNumber}`;
  const agentId = Math.random().toString(36).substring(2, 15);
  
  return { agentId, agentName };
};

/**
 * 获取当前探员身份（如果不存在则创建新身份）
 */
export const getCurrentIdentity = () => {
  let agentId = localStorage.getItem(STORAGE_KEY_ID);
  let agentName = localStorage.getItem(STORAGE_KEY_NAME);

  if (!agentId || !agentName) {
    const newIdentity = generateAgentIdentity();
    agentId = newIdentity.agentId;
    agentName = newIdentity.agentName;
    
    localStorage.setItem(STORAGE_KEY_ID, agentId);
    localStorage.setItem(STORAGE_KEY_NAME, agentName);
  }

  return { agentId, agentName };
};

/**
 * 销毁当前身份（清除缓存）
 */
export const destroyIdentity = () => {
  localStorage.removeItem(STORAGE_KEY_ID);
  localStorage.removeItem(STORAGE_KEY_NAME);
};

/**
 * 检查是否为新访客（用于显示欢迎动画）
 */
export const isNewVisitor = () => {
  return !localStorage.getItem(STORAGE_KEY_ID);
};
