import api from './api';

export interface ContractTemplate {
  id: string;
  name: string;
  template: string;
  variables: string[];
}

export interface Contract {
  id: string;
  influencerId: string;
  status: 'draft' | 'sent' | 'signed' | 'expired';
  createdAt: string;
  signedAt?: string;
  expiresAt?: string;
  content: string;
  templateId: string;
  metadata: {
    paymentTerms: string;
    deliverables: string[];
    compensation: number;
    startDate: string;
    endDate: string;
  };
}

export const contractService = {
  generateContract: async (influencerId: string, templateId: string, variables: Record<string, any>) => {
    const response = await api.post('/contracts/generate', {
      influencerId,
      templateId,
      variables
    });
    return response.data;
  },

  sendContract: async (contractId: string) => {
    const response = await api.post(`/contracts/${contractId}/send`);
    return response.data;
  },

  getContractStatus: async (contractId: string) => {
    const response = await api.get(`/contracts/${contractId}/status`);
    return response.data;
  },

  getTemplates: async () => {
    const response = await api.get('/contracts/templates');
    return response.data;
  },

  createTemplate: async (template: Partial<ContractTemplate>) => {
    const response = await api.post('/contracts/templates', template);
    return response.data;
  },

  getInfluencerContracts: async (influencerId: string) => {
    const response = await api.get(`/contracts/influencer/${influencerId}`);
    return response.data;
  },

  trackSigningProgress: async (contractId: string) => {
    const response = await api.get(`/contracts/${contractId}/tracking`);
    return response.data;
  },

  // Bulk operations for efficiency
  bulkGenerateContracts: async (data: Array<{
    influencerId: string;
    templateId: string;
    variables: Record<string, any>;
  }>) => {
    const response = await api.post('/contracts/bulk-generate', { contracts: data });
    return response.data;
  }
};
