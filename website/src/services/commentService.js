import { supabase } from '../lib/supabase';

// 获取某个档案的所有评论
export async function getComments(archiveId) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('archive_id', archiveId)
    .is('parent_id', null)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching comments:', error);
    return [];
  }

  // 为每个主评论获取回复
  const commentsWithReplies = await Promise.all(
    data.map(async (comment) => {
      const { data: replies } = await supabase
        .from('comments')
        .select('*')
        .eq('parent_id', comment.id)
        .order('created_at', { ascending: true });

      return {
        id: comment.id,
        floorNumber: comment.floor_number,
        agent: comment.agent_name,
        time: new Date(comment.created_at).toISOString().split('T')[0],
        content: comment.content,
        replies: (replies || []).map(reply => ({
          id: reply.id,
          agent: reply.agent_name,
          repliedToAgent: reply.replied_to_agent,
          time: new Date(reply.created_at).toISOString().split('T')[0],
          content: reply.content
        }))
      };
    })
  );

  return commentsWithReplies;
}

// 获取某个探员收到的回复通知（排除自己回复自己）
export async function getAgentNotifications(agentName) {
  const { data, error } = await supabase
    .from('comments')
    .select('*')
    .eq('replied_to_agent', agentName)
    .neq('agent_name', agentName) // 排除自己回复自己
    .order('created_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('Error fetching notifications:', error);
    return [];
  }

  return data.map(reply => ({
    id: reply.id,
    archiveId: reply.archive_id,
    parentCommentId: reply.parent_id, // 父评论 ID，用于定位
    fromAgent: reply.agent_name,
    content: reply.content,
    time: new Date(reply.created_at).toISOString().split('T')[0],
    isRead: false
  }));
}

// 标记通知为已读（存储在 localStorage）
export function markNotificationAsRead(notificationId) {
  const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
  if (!readNotifications.includes(notificationId)) {
    readNotifications.push(notificationId);
    localStorage.setItem('read_notifications', JSON.stringify(readNotifications));
  }
}

// 获取未读通知
export async function getUnreadNotifications(agentName) {
  const allNotifications = await getAgentNotifications(agentName);
  const readNotifications = JSON.parse(localStorage.getItem('read_notifications') || '[]');
  return allNotifications.filter(notif => !readNotifications.includes(notif.id));
}

// 添加主评论
export async function addComment(archiveId, agentName, content) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        archive_id: archiveId,
        agent_name: agentName,
        content: content,
        parent_id: null
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding comment:', error);
    return null;
  }

  return {
    id: data.id,
    floorNumber: data.floor_number,
    agent: data.agent_name,
    time: new Date(data.created_at).toISOString().split('T')[0],
    content: data.content,
    replies: []
  };
}

// 添加回复（支持回复任意评论）
export async function addReply(parentId, agentName, content, archiveId, repliedToAgent) {
  const { data, error } = await supabase
    .from('comments')
    .insert([
      {
        archive_id: archiveId,
        agent_name: agentName,
        content: content,
        parent_id: parentId,
        replied_to_agent: repliedToAgent
      }
    ])
    .select()
    .single();

  if (error) {
    console.error('Error adding reply:', error);
    return null;
  }

  return {
    id: data.id,
    agent: data.agent_name,
    repliedToAgent: data.replied_to_agent,
    time: new Date(data.created_at).toISOString().split('T')[0],
    content: data.content
  };
}

// 订阅评论更新（实时）
export function subscribeToComments(archiveId, callback) {
  const subscription = supabase
    .channel(`comments:${archiveId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'comments',
        filter: `archive_id=eq.${archiveId}`
      },
      () => {
        // 当有新评论时，重新获取所有评论
        getComments(archiveId).then(callback);
      }
    )
    .subscribe();

  return subscription;
}
