import api from './api';

// ---- Public ----
export const fetchProjects = async (params = {}) => {
  const { data } = await api.get('/projects', { params });
  return data; // { success, data: [...], meta: {...} }
};

export const fetchProjectBySlug = async (slug) => {
  const { data } = await api.get(`/projects/${slug}`);
  return data.data; // { project, prev, next, related }
};

// ---- Admin ----
export const fetchAdminProjects = async (params = {}) => {
  const { data } = await api.get('/admin/projects', { params });
  return data;
};

export const fetchAdminProjectById = async (id) => {
  const { data } = await api.get(`/admin/projects/${id}`);
  return data.data;
};

export const createProject = async (payload) => {
  const { data } = await api.post('/admin/projects', payload);
  return data.data;
};

export const updateProject = async (id, payload) => {
  const { data } = await api.put(`/admin/projects/${id}`, payload);
  return data.data;
};

export const deleteProject = async (id) => {
  const { data } = await api.delete(`/admin/projects/${id}`);
  return data;
};

export const togglePublish = async (id) => {
  const { data } = await api.patch(`/admin/projects/${id}/publish`);
  return data.data;
};

export const toggleFeatured = async (id) => {
  const { data } = await api.patch(`/admin/projects/${id}/featured`);
  return data.data;
};

export const reorderProjects = async (order) => {
  const { data } = await api.patch('/admin/projects/reorder', { order });
  return data;
};

const uploadMedia = async (id, type, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`/admin/projects/${id}/media/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const uploadHeroBanner = (id, file) => uploadMedia(id, 'hero', file);
export const uploadThumbnail = (id, file) => uploadMedia(id, 'thumbnail', file);
export const uploadLogo = (id, file) => uploadMedia(id, 'logo', file);

export const addScreenshots = async (id, files) => {
  const formData = new FormData();
  Array.from(files).forEach((file) => formData.append('images', file));
  const { data } = await api.post(`/admin/projects/${id}/screenshots`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data.data;
};

export const updateScreenshot = async (id, screenshotId, payload) => {
  const { data } = await api.patch(`/admin/projects/${id}/screenshots/${screenshotId}`, payload);
  return data.data;
};

export const deleteScreenshot = async (id, screenshotId) => {
  const { data } = await api.delete(`/admin/projects/${id}/screenshots/${screenshotId}`);
  return data.data;
};
