import client, { clearCache, invalidateCache } from './client';

// Auth endpoints
export const authAPI = {
  login: (username, password, remember = true) =>
    client.post('/auth/login', { login: username, password, remember }),
  
  register: (username, email, password) =>
    client.post('/auth/register', { username, email, password }),
  
  logout: () => client.post('/auth/logout'),
  
  getProfile: () => client.get('/user/profile'),
  
  refreshToken: (refreshToken) => 
    client.post('/auth/refresh', { refresh_token: refreshToken }),
  
  validateToken: () => client.get('/auth/validate'),
};

// Bot endpoints
export const botAPI = {
  // Get available tasks with caching
  getTasks: (params = {}) => {
    const cacheKey = `/tasks:${JSON.stringify(params)}`;
    invalidateCache(cacheKey);
    return client.get('/tasks', { params });
  },
  
  // Like a post
  likePost: (taskId, postUrl) => 
    client.post('/tasks/like', { task_id: taskId, url: postUrl }),
  
  // Post a comment
  commentPost: (taskId, postUrl, comment) => 
    client.post('/tasks/comment', { task_id: taskId, url: postUrl, comment }),
  
  // Complete a task
  completeTask: (taskId) => 
    client.post(`/tasks/${taskId}/complete`),
  
  // Get user statistics with caching
  getStats: () => {
    invalidateCache('/user/stats');
    return client.get('/user/stats');
  },
  
  // Get user balance with caching
  getBalance: () => {
    invalidateCache('/user/balance');
    return client.get('/user/balance');
  },
  
  // Get campaign list
  getCampaigns: (params = {}) => {
    const cacheKey = `/campaigns:${JSON.stringify(params)}`;
    invalidateCache(cacheKey);
    return client.get('/campaigns', { params });
  },
  
  // Join a campaign
  joinCampaign: (campaignId) => 
    client.post(`/campaigns/${campaignId}/join`),
  
  // Search posts
  searchPosts: (query, platform = 'vk') => {
    const cacheKey = `/search:${query}:${platform}`;
    invalidateCache(cacheKey);
    return client.get('/search', { params: { q: query, platform } });
  },
};

// Campaigns endpoints
export const campaignsAPI = {
  getCampaigns: (params = {}) => {
    const cacheKey = `/campaigns:${JSON.stringify(params)}`;
    invalidateCache(cacheKey);
    return client.get('/campaigns', { params });
  },
  
  getCampaignById: (id) => {
    invalidateCache(`/campaigns/${id}`);
    return client.get(`/campaigns/${id}`);
  },
  
  createCampaign: (data) => client.post('/campaigns', data),
  
  updateCampaign: (id, data) => client.put(`/campaigns/${id}`, data),
  
  deleteCampaign: (id) => client.delete(`/campaigns/${id}`),
  
  getCampaignStats: (id) => {
    invalidateCache(`/campaigns/${id}/stats`);
    return client.get(`/campaigns/${id}/stats`);
  },
  
  joinCampaign: (id) => client.post(`/campaigns/${id}/join`),
};

// Posts endpoints
export const postsAPI = {
  getPosts: (params = {}) => {
    const cacheKey = `/posts:${JSON.stringify(params)}`;
    invalidateCache(cacheKey);
    return client.get('/posts', { params });
  },
  
  getPostById: (id) => {
    invalidateCache(`/posts/${id}`);
    return client.get(`/posts/${id}`);
  },
  
  createPost: (data) => client.post('/posts', data),
  
  likePost: (id) => client.post(`/posts/${id}/like`),
  
  unlikePost: (id) => client.post(`/posts/${id}/unlike`),
  
  commentOnPost: (id, comment) => client.post(`/posts/${id}/comment`, { comment }),
  
  sharePost: (id) => client.post(`/posts/${id}/share`),
};

// User endpoints
export const userAPI = {
  getProfile: () => {
    invalidateCache('/user/profile');
    return client.get('/user/profile');
  },
  
  updateProfile: (data) => client.put('/user/profile', data),
  
  getSettings: () => client.get('/user/settings'),
  
  updateSettings: (data) => client.put('/user/settings', data),
  
  getBalance: () => {
    invalidateCache('/user/balance');
    return client.get('/user/balance');
  },
  
  getNotifications: () => client.get('/user/notifications'),
};

// VK API endpoints
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
  
  getCities: (countryId) => {
    invalidateCache(`/util/cities/${countryId}`);
    return client.get(`/util/cities/${countryId}`);
  },
};

// Clear all caches
export const clearAllCaches = () => {
  clearCache();
};

export default {
  authAPI,
  botAPI,
  campaignsAPI,
  postsAPI,
  userAPI,
  vkAPI,
  utilAPI,
};
