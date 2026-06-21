import client from './client';

// Auth endpoints
export const authAPI = {
  login: (username, password) =>
    client.post('/auth/login', { username, password }),
  register: (username, email, password) =>
    client.post('/auth/register', { username, email, password }),
  logout: () => client.post('/auth/logout'),
  getProfile: () => client.get('/auth/profile'),
};

// Campaigns endpoints
export const campaignsAPI = {
  getCampaigns: () => client.get('/campaigns'),
  getCampaignById: (id) => client.get(`/campaigns/${id}`),
  createCampaign: (data) => client.post('/campaigns', data),
  updateCampaign: (id, data) => client.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => client.delete(`/campaigns/${id}`),
  getCampaignStats: (id) => client.get(`/campaigns/${id}/stats`),
};

// Posts endpoints
export const postsAPI = {
  getPosts: (params) => client.get('/posts', { params }),
  getPostById: (id) => client.get(`/posts/${id}`),
  createPost: (data) => client.post('/posts', data),
  likePost: (id) => client.post(`/posts/${id}/like`),
  unlikePost: (id) => client.post(`/posts/${id}/unlike`),
  commentOnPost: (id, comment) => client.post(`/posts/${id}/comment`, { comment }),
  sharePost: (id) => client.post(`/posts/${id}/share`),
};

// User endpoints
export const userAPI = {
  getProfile: () => client.get('/user/profile'),
  updateProfile: (data) => client.put('/user/profile', data),
  getSettings: () => client.get('/user/settings'),
  updateSettings: (data) => client.put('/user/settings', data),
};
