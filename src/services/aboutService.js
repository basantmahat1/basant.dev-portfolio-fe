import api from './api';

const LOCAL_KEY = 'portfolio_about_data';

export const fetchAbout = async () => {
  try {
    const { data } = await api.get('/about');
    if (data.data) {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data.data));
      return data.data;
    }
  } catch (err) {
    console.warn('Backend about fetch failed, checking localStorage fallback:', err);
  }

  const cached = localStorage.getItem(LOCAL_KEY);
  if (cached) {
    try {
      return JSON.parse(cached);
    } catch (e) {
      console.error('Failed to parse cached about data', e);
    }
  }

  return {};
};

export const updateAbout = async (payload) => {
  localStorage.setItem(LOCAL_KEY, JSON.stringify(payload));
  try {
    const { data } = await api.put('/admin/about', payload);
    return data.data;
  } catch (err) {
    console.warn('Backend about update failed, saved to local cache:', err);
    return payload;
  }
};
