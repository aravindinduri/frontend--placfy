import axios from 'axios';
import { getStoredToken, getSessionToken } from '../components/utils/authToken.js';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const taskClient = axios.create({
	baseURL: API_BASE_URL + '/api/v1',
	withCredentials: true,
	headers: { 'Content-Type': 'application/json' },
});

taskClient.interceptors.request.use((config) => {
  const token = getSessionToken() || getStoredToken(); 
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export const getAssignableMembers = async (workspaceSlug) => {
  const response = await taskClient.get(
    `/workspaces/${workspaceSlug}/tasks/members/`
  );
  return response.data;
};

export const createTask = async (workspaceSlug, taskData) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/`,
    taskData
  );
  return response.data;
};

export const listTasks = async (workspaceSlug, filters = {}) => {
  const params = new URLSearchParams();
  
  if (filters.status) params.append('status', filters.status);
  if (filters.priority) params.append('priority', filters.priority);
  if (filters.category) params.append('category', filters.category);
  if (filters.assigned_to) params.append('assigned_to', filters.assigned_to);
  if (filters.search) params.append('search', filters.search);
  if (filters.ordering) params.append('ordering', filters.ordering);

  const response = await taskClient.get(
    `/workspaces/${workspaceSlug}/tasks/?${params.toString()}`
  );
  return response.data;
};

export const getTaskDetails = async (workspaceSlug, taskId) => {
  const response = await taskClient.get(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/`
  );
  return response.data;
};

export const addComment = async (workspaceSlug, taskId, content) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/comments/`,
    { content }
  );
  return response.data;
};

export const updateProgress = async (workspaceSlug, taskId, percentage, note) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/progress/`,
    { percentage, note }
  );
  return response.data;
};

export const uploadAttachment = async (workspaceSlug, taskId, file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/attachments/`,
    formData,
    {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }
  );
  return response.data;
};

export const unassignTask = async (workspaceSlug, taskId) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/unassign/`
  );
  return response.data;
};

export const transferTask = async (workspaceSlug, taskId, newAssigneeId) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/transfer/`,
    { new_assignee_id: newAssigneeId }
  );
  return response.data;
};

export const deleteTask = async (workspaceSlug, taskId) => {
  await taskClient.delete(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/`
  );
};

export const sendMessage = async (workspaceSlug, taskId, receiverId, message) => {
  const response = await taskClient.post(
    `/workspaces/${workspaceSlug}/tasks/${taskId}/conversations/`,
    { receiver_id: receiverId, message }
  );
  return response.data;
};