import api, { setAccessToken } from './api';

export const login = async (email, password) => {
  const { data } = await api.post('/auth/login', { email, password });
  setAccessToken(data.data.accessToken);
  return data.data.user;
};

export const logout = async () => {
  await api.post('/auth/logout');
  setAccessToken(null);
};

export const getMe = async () => {
  const { data } = await api.get('/auth/me');
  return data.data.user;
};

export const refreshSession = async () => {
  const { data } = await api.post('/auth/refresh');
  setAccessToken(data.data.accessToken);
  return data.data.accessToken;
};

export const changePassword = async (currentPassword, newPassword) => {
  const { data } = await api.patch('/auth/change-password', { currentPassword, newPassword });
  return data;
};
