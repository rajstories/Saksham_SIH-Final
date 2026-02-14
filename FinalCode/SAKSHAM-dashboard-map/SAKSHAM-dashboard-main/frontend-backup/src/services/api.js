import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    console.log(`📤 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ Request Error:', error);
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.config.url}`, response.data);
    return response;
  },
  (error) => {
    console.error('❌ Response Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const trainingAPI = {
  getAllTrainings: async (filters = {}) => {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.type) params.append('type', filters.type);
      if (filters.startDate) params.append('startDate', filters.startDate);
      if (filters.endDate) params.append('endDate', filters.endDate);

      const response = await api.get(`/trainings?${params.toString()}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trainings');
    }
  },

  getTrainingById: async (id) => {
    try {
      const response = await api.get(`/trainings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch training');
    }
  },

  createTraining: async (trainingData) => {
    try {
      const response = await api.post('/trainings', trainingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to create training');
    }
  },

  updateTraining: async (id, trainingData) => {
    try {
      const response = await api.put(`/trainings/${id}`, trainingData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to update training');
    }
  },

  deleteTraining: async (id) => {
    try {
      const response = await api.delete(`/trainings/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to delete training');
    }
  },

  getNearbyTrainings: async (longitude, latitude, maxDistance = 50000) => {
    try {
      const response = await api.get('/trainings/nearby', {
        params: { longitude, latitude, maxDistance },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch nearby trainings');
    }
  },
};

export default api;