import api from './api';

export interface Content {
  id: string;
  influencerId: string;
  title: string;
  type: 'video' | 'post' | 'story';
  status: string;
  currentStage: 'concept' | 'script' | 'video';
  content: string;
  aiAnalysis?: {
    score: number;
    feedback: string;
    brandSafetyCheck: boolean;
  };
}

export const contentService = {
  getAll: async (filters: any = {}) => {
    const params = new URLSearchParams(filters);
    const response = await api.get(`/content?${params}`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/content/${id}`);
    return response.data;
  },

  submit: async (data: Partial<Content>) => {
    const response = await api.post('/content', data);
    return response.data;
  },

  review: async (id: string, reviewData: {
    stage: string;
    feedback: string;
    approved: boolean;
  }) => {
    const response = await api.patch(`/content/${id}/review`, reviewData);
    return response.data;
  },

  getAIAnalysis: async (content: string) => {
    const response = await api.post('/content/analyze', { content });
    return response.data;
  },

  uploadVideo: async (id: string, file: File) => {
    const formData = new FormData();
    formData.append('video', file);
    const response = await api.post(`/content/${id}/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
};
