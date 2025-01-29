import api from './api';

export interface Influencer {
  id: string;
  name: string;
  email: string;
  channelName: string;
  status: 'pending' | 'active' | 'paused' | 'terminated';
  metrics: {
    subscribers: number;
    averageViews: number;
    engagementRate: number;
  };
  content: Array<{
    id: string;
    title: string;
    status: string;
  }>;
}

export const influencerService = {
  getAll: async (page = 1, limit = 10) => {
    const response = await api.get(`/influencers?page=${page}&limit=${limit}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/influencers/${id}`);
    return response.data;
  },

  create: async (data: Partial<Influencer>) => {
    const response = await api.post('/influencers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Influencer>) => {
    const response = await api.put(`/influencers/${id}`, data);
    return response.data;
  },

  updateStatus: async (id: string, status: Influencer['status']) => {
    const response = await api.patch(`/influencers/${id}/status`, { status });
    return response.data;
  },

  getAnalytics: async (id: string) => {
    const response = await api.get(`/influencers/${id}/analytics`);
    return response.data;
  },

  searchInfluencers: async (query: string) => {
    const response = await api.get(`/influencers/search?q=${query}`);
    return response.data;
  }
};
