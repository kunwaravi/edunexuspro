import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Anti-CSRF custom header validation (Issue #11)
  config.headers['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

/** Origin of the API server (used to resolve relative banner paths). */
export const API_ORIGIN = (() => {
  try {
    return new URL(api.defaults.baseURL || '').origin;
  } catch {
    return '';
  }
})();

/**
 * TASK 6: resolve a Course banner URL to an absolute address.
 * - absolute http(s) URLs pass through untouched (admins may use CDN links)
 * - relative paths (e.g. `/static/course-banners/ms-excel.svg`) are prefixed
 *   with the API origin — the same origin that serves /api and /static.
 */
export const resolveCourseBanner = (banner?: string | null): string | null => {
  if (!banner) return null;
  if (/^https?:\/\//i.test(banner)) return banner;
  if (banner.startsWith('/')) return `${API_ORIGIN}${banner}`;
  return banner;
};

export default api;
