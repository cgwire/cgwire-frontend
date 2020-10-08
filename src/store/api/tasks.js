import client from './client'

export default {
  getTask (taskId, callback) {
    client.get(`/api/data/tasks/${taskId}/full`, callback)
  },

  updateTask (taskId, data, callback) {
    return client.pput(`/api/data/tasks/${taskId}`, data, callback)
  },

  getTaskStatuses (callback) {
    client.get('/api/data/task-status', callback)
  },

  getTaskSubscribed (taskId, callback) {
    client.get(`/api/data/user/tasks/${taskId}/subscribed`, callback)
  },

  subscribeToTask (taskId, callback) {
    client.post(`/api/actions/user/tasks/${taskId}/subscribe`, {}, callback)
  },

  unsubscribeFromTask (taskId, callback) {
    client.del(`/api/actions/user/tasks/${taskId}/unsubscribe`, callback)
  },

  subscribeToSequence (sequenceId, taskTypeId, callback) {
    client.post(
      `/api/actions/user/sequences/${sequenceId}/task-types/` +
      `${taskTypeId}/subscribe`,
      {},
      callback
    )
  },

  unsubscribeFromSequence (sequenceId, taskTypeId, callback) {
    client.del(
      `/api/actions/user/sequences/${sequenceId}/task-types/` +
      `${taskTypeId}/unsubscribe`,
      callback
    )
  },

  getTaskComments (taskId, callback) {
    client.get(`/api/data/tasks/${taskId}/comments`, callback)
  },

  getTaskPreviews (taskId, callback) {
    client.get(`/api/data/tasks/${taskId}/previews`, callback)
  },

  commentTask (data) {
    let commentData = {
      task_status_id: data.taskStatusId,
      comment: data.comment,
      checklist: data.checklist || []
    }
    if (data.attachment && data.attachment.length > 0) {
      commentData = new FormData()
      let i = 0
      data.attachment.forEach(attachment => {
        commentData.append('file-' + i, attachment.get('file'))
        i++
      })
      commentData.set('task_status_id', data.taskStatusId)
      commentData.set('comment', data.comment)
      commentData.set('checklist', JSON.stringify(data.checklist || []))
    }
    return client.ppost(
      `/api/actions/tasks/${data.taskId}/comment`,
      commentData
    )
  },

  commentTasks (projectId, comments) {
    return client.ppost(
      `/api/actions/projects/${projectId}/tasks/comment-many`,
      comments
    )
  },

  getTaskComment (data, callback) {
    client.get(`/api/data/comments/${data.id}`, callback)
  },

  editTaskComment (comment, callback) {
    const commentData = {
      text: comment.text,
      task_status_id: comment.task_status_id,
      checklist: comment.checklist
    }
    client.put(`/api/data/comments/${comment.id}`, commentData, callback)
  },

  deleteTaskComment (taskId, commentId, callback) {
    client.del(`/api/data/tasks/${taskId}/comments/${commentId}`, callback)
  },

  createTasks (data) {
    const taskTypeId = data.task_type_id
    const type = data.type
    const projectId = data.project_id
    const entityIds = data.entityIds
    return client.ppost(
      `/api/actions/projects/${projectId}/task-types/${taskTypeId}/${type}/` +
      'create-tasks',
      entityIds
    )
  },

  createTask (data, callback) {
    const entityId = data.entity_id
    const taskTypeId = data.task_type_id
    const type = data.type
    const projectId = data.project_id
    client.post(
      `/api/actions/projects/${projectId}/task-types/${taskTypeId}/${type}/` +
      `create-tasks?id=${entityId}`,
      {},
      callback
    )
  },

  deleteTask (task, callback) {
    client.del(`/api/data/tasks/${task.id}?force=true`, callback)
  },

  deleteAllTasks (projectId, taskTypeId, taskIds) {
    if (taskIds.length > 0) {
      return client.ppost(
        `/api/actions/projects/${projectId}/delete-tasks`,
        taskIds
      )
    } else {
      return client.pdel(
        `/api/actions/projects/${projectId}/task-types/${taskTypeId}/delete-tasks`
      )
    }
  },

  addPreview (data) {
    const taskId = data.taskId
    const commentId = data.commentId
    return client.ppost(
      `/api/actions/tasks/${taskId}/comments/${commentId}/add-preview`,
      {}
    )
  },

  addExtraPreview (previewId, taskId, commentId) {
    return client.ppost(
      `/api/actions/tasks/${taskId}/comments/${commentId}/preview-files/` +
      `${previewId}`,
      {}
    )
  },

  deletePreview (taskId, commentId, previewId) {
    return client.pdel(
      `/api/actions/tasks/${taskId}/comments/${commentId}/preview-files/` +
      `${previewId}`
    )
  },

  setPreview (entityId, previewId, callback) {
    return client.pput(
      `/api/actions/entities/${entityId}/set-main-preview/${previewId}`,
      {}
    )
  },

  uploadPreview (previewId, formData) {
    return client.ppost(
      `/api/pictures/preview-files/${previewId}`,
      formData
    )
  },

  updatePreviewAnnotation (preview, annotations) {
    return new Promise((resolve, reject) => {
      client.put(
        `/api/data/preview-files/${preview.id}`,
        { annotations },
        (err, preview) => {
          if (err) reject(err)
          else resolve(preview)
        }
      )
    })
  },

  getPreviewFile (previewId) {
    return new Promise((resolve, reject) => {
      client.get(
        `/api/data/preview-files/${previewId}`,
        (err, preview) => {
          if (err) reject(err)
          else resolve(preview)
        }
      )
    })
  },

  assignTasks (personId, selectedTaskIds, callback) {
    client.put(
      `/api/actions/persons/${personId}/assign`,
      { task_ids: selectedTaskIds },
      callback
    )
  },

  unassignTasks (selectedTaskIds, callback) {
    client.put(
      '/api/actions/tasks/clear-assignation',
      { task_ids: selectedTaskIds },
      callback
    )
  },

  pinComment (comment) {
    return new Promise((resolve, reject) => {
      const data = {
        pinned: comment.pinned
      }
      client.put(
        `/api/data/comments/${comment.id}`,
        data,
        (err, comment) => {
          if (err) reject(err)
          else resolve(comment)
        }
      )
    })
  },

  ackComment (comment) {
    const path =
      `/api/data/tasks/${comment.object_id}/comments/${comment.id}/ack`
    return client.ppost(path, {})
  }
}
