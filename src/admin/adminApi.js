const TOKEN_KEY = 'nocode_admin_token';

export const getAdminToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setAdminToken = (token) => localStorage.setItem(TOKEN_KEY, token);
export const clearAdminToken = () => localStorage.removeItem(TOKEN_KEY);

const request = async (path, options = {}, withAuth = true) => {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  };

  if (withAuth) {
    const token = getAdminToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(path, {
    ...options,
    headers
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok || !data?.success) {
    throw new Error(data?.message || '请求失败');
  }
  return data.data;
};

export const adminApi = {
  login: (email, password) => request('/api/admin/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  }, false),
  me: () => request('/api/admin/auth/me'),
  bootstrapNeeded: () => request('/api/admin/bootstrap-needed'),
  bootstrap: (modules, force = false) => request('/api/admin/bootstrap', {
    method: 'POST',
    body: JSON.stringify({ modules, force })
  }),
  getModules: () => request('/api/admin/modules'),
  listContent: (moduleKey, params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') query.set(k, `${v}`);
    });
    return request(`/api/admin/content/${moduleKey}?${query.toString()}`);
  },
  getContent: (moduleKey, id) => request(`/api/admin/content/${moduleKey}/${id}`),
  createContent: (moduleKey, payload) => request(`/api/admin/content/${moduleKey}`, {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  validateTopicVideoLink: (url) => request('/api/admin/content/topicVideos/validate-link', {
    method: 'POST',
    body: JSON.stringify({ url })
  }),
  updateContent: (moduleKey, id, payload) => request(`/api/admin/content/${moduleKey}/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload)
  }),
  deleteContent: (moduleKey, id) => request(`/api/admin/content/${moduleKey}/${id}`, { method: 'DELETE' }),
  publishContent: (moduleKey, id) => request(`/api/admin/content/${moduleKey}/${id}/publish`, { method: 'POST' }),
  unpublishContent: (moduleKey, id) => request(`/api/admin/content/${moduleKey}/${id}/unpublish`, { method: 'POST' }),
  listMedia: () => request('/api/admin/media'),
  uploadMedia: (fileName, dataUrl, size = 0, moduleKey = 'media-library') => request('/api/admin/media/upload', {
    method: 'POST',
    body: JSON.stringify({ fileName, dataUrl, size, moduleKey })
  }),
  replaceMedia: (fromUrl, toUrl) => request('/api/admin/media/replace', {
    method: 'POST',
    body: JSON.stringify({ fromUrl, toUrl })
  }),
  deleteMedia: (mediaId) => request(`/api/admin/media/${encodeURIComponent(mediaId)}`, { method: 'DELETE' }),
  mediaReferences: (mediaId) => request(`/api/admin/media/${encodeURIComponent(mediaId)}/references`),
  listLeads: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && `${v}` !== '') query.set(k, `${v}`);
    });
    return request(`/api/admin/leads?${query.toString()}`);
  },
  updateLead: (id, followStatus) => request(`/api/admin/leads/${encodeURIComponent(id)}`, {
    method: 'PUT',
    body: JSON.stringify({ followStatus })
  }),
  deleteLead: (id) => request(`/api/admin/leads/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  listLogs: () => request('/api/admin/logs')
};
