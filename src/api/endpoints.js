import client from './client';

// Auth endpoints - VKSerfing API
export const authAPI = {
  login: (username, password) =>
    client.post('/auth/login', { login: username, password, remember: true }),
  register: (username, email, password) =>
    client.post('/auth/register', { username, email, password }),
  logout: () => client.post('/auth/logout'),
  getProfile: () => client.get('/user/profile'),
  refreshToken: (refreshToken) => 
    client.post('/auth/refresh', { refresh_token: refreshToken }),
};

// Bot endpoints for VKSerfing
export const botAPI = {
  // Get available tasks
  getTasks: (params = {}) => client.get('/tasks', { params }),
  
  // Like a post
  likePost: (taskId, postUrl) => 
    client.post('/tasks/like', { task_id: taskId, url: postUrl }),
  
  // Post a comment
  commentPost: (taskId, postUrl, comment) => 
    client.post('/tasks/comment', { task_id: taskId, url: postUrl, comment }),
  
  // Complete a task
  completeTask: (taskId) => 
    client.post(`/tasks/${taskId}/complete`),
  
  // Get user statistics
  getStats: () => client.get('/user/stats'),
  
  // Get user balance
  getBalance: () => client.get('/user/balance'),
  
  // Get campaign list
  getCampaigns: (params = {}) => client.get('/campaigns', { params }),
  
  // Join a campaign
  joinCampaign: (campaignId) => 
    client.post(`/campaigns/${campaignId}/join`),
  
  // Search posts
  searchPosts: (query, platform = 'vk') => 
    client.get('/search', { params: { q: query, platform } }),
};

// Campaigns endpoints
export const campaignsAPI = {
  getCampaigns: () => client.get('/campaigns'),
  getCampaignById: (id) => client.get(`/campaigns/${id}`),
  createCampaign: (data) => client.post('/campaigns', data),
  updateCampaign: (id, data) => client.put(`/campaigns/${id}`, data),
  deleteCampaign: (id) => client.delete(`/campaigns/${id}`),
  getCampaignStats: (id) => client.get(`/campaigns/${id}/stats`),
  joinCampaign: (id) => client.post(`/campaigns/${id}/join`),
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
  getBalance: () => client.get('/user/balance'),
  getNotifications: () => client.get('/user/notifications'),
};

// VK API endpoints (for direct VK actions)
export const vkAPI = {
  like: (ownerId, itemId, type = 'post') => 
    client.post('/vk/like', { owner_id: ownerId, item_id: itemId, type }),
  comment: (ownerId, itemId, message) => 
    client.post('/vk/comment', { owner_id: ownerId, item_id: itemId, message }),
  repost: (ownerId, itemId) => 
    client.post('/vk/repost', { owner_id: ownerId, item_id: itemId }),
  follow: (userId) => 
    client.post('/vk/follow', { user_id: userId }),
};

// Utility endpoints
export const utilAPI = {
  getCountries: () => client.get('/util/countries'),
  getCities: (countryId) => client.get(`/util/cities/${countryId}`),
  validateToken: () => client.get('/auth/validate'),
};
