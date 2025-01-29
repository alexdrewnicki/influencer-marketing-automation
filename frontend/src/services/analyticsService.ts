import api from './api';

export interface AnalyticsData {
  influencerMetrics: {
    totalInfluencers: number;
    activeInfluencers: number;
    averageEngagementRate: number;
    influencerGrowth: {
      date: string;
      count: number;
    }[];
  };
  contentMetrics: {
    totalContent: number;
    pendingReviews: number;
    approvalRate: number;
    contentByType: {
      type: string;
      count: number;
    }[];
  };
  performanceMetrics: {
    totalViews: number;
    totalEngagements: number;
    averageViewsPerContent: number;
    viewsOverTime: {
      date: string;
      views: number;
    }[];
  };
}

export const analyticsService = {
  getDashboardMetrics: async (timeframe: string = '30d'): Promise<AnalyticsData> => {
    const response = await api.get(`/analytics/dashboard?timeframe=${timeframe}`);
    return response.data;
  },

  getInfluencerAnalytics: async (influencerId: string) => {
    const response = await api.get(`/analytics/influencers/${influencerId}`);
    return response.data;
  },

  getContentAnalytics: async (contentId: string) => {
    const response = await api.get(`/analytics/content/${contentId}`);
    return response.data;
  },

  generateReport: async (params: {
    startDate: string;
    endDate: string;
    metrics: string[];
  }) => {
    const response = await api.post('/analytics/report', params);
    return response.data;
  }
};
