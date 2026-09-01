import api from './api';

const LOCAL_KEY = 'portfolio_about_data';

export const fetchAbout = async () => {
  try {
    const { data } = await api.get('/about');
    if (data.data) {
      try {
        localStorage.setItem(LOCAL_KEY, JSON.stringify(data.data));
      } catch (e) {
        // Safe ignore localStorage quota errors
      }
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
  try {
    const { data } = await api.put('/admin/about', payload);
    const updated = data.data || payload;
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    } catch (e) {
      // Safe ignore localStorage quota errors
    }
    return updated;
  } catch (err) {
    console.error('Backend about update failed:', err);
    throw err;
  }
};

export const uploadAboutMedia = async (type, file) => {
  const formData = new FormData();
  formData.append('image', file);
  const { data } = await api.post(`/admin/about/media/${type}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  if (data.data) {
    try {
      localStorage.setItem(LOCAL_KEY, JSON.stringify(data.data));
    } catch (e) {}
  }
  return data.data;
};

