import api from './client';

export const fetchAgreementAnalytics = async (workspaceSlug) => {
  const response = await api.get(`/workspaces/${workspaceSlug}/agreements/analytics/`);
  return response.data;
};

export const fetchAgreements = async (workspaceSlug, params = {}) => {
  const response = await api.get(`/workspaces/${workspaceSlug}/agreements/`, { params });
  return response.data;
};

export const fetchAgreementDetails = async (workspaceSlug, id) => {
  const response = await api.get(`/workspaces/${workspaceSlug}/agreements/${id}/`);
  return response.data;
};

export const createAgreement = async (workspaceSlug, data) => {
  const response = await api.post(`/workspaces/${workspaceSlug}/agreements/`, data);
  return response.data;
};

export const updateAgreement = async (workspaceSlug, id, data) => {
  const response = await api.patch(`/workspaces/${workspaceSlug}/agreements/${id}/`, data);
  return response.data;
};

export const deleteAgreement = async (workspaceSlug, id) => {
  const response = await api.delete(`/workspaces/${workspaceSlug}/agreements/${id}/`);
  return response.data;
};

export const renewAgreement = async (workspaceSlug, id, data) => {
  const response = await api.post(`/workspaces/${workspaceSlug}/agreements/${id}/renew/`, data);
  return response.data;
};

export const exportAgreements = async (workspaceSlug) => {
    const response = await api.get(`/workspaces/${workspaceSlug}/agreements/export/`, {
        responseType: 'blob',
    });
    return response.data;
};
