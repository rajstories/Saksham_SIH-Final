import axios from 'axios';

// Change this line:
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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
      const params = new URLSearchParams(filters);
    const { data } = await api.get('/trainings?' + params.toString()); // NO /api prefix
    return data;  
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trainings');
    }
  },

  getTrainingById: async (id) => {
    try {
      const { data } = await api.get(`/trainings/${id}`);
      return data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to fetch training');
    }
  },

  createTraining: (trainingData) => api.post('/trainings', trainingData).then(r => r.data),
  updateTraining: (id, trainingData) => api.put(`/trainings/${id}`, trainingData).then(r => r.data),
  deleteTraining: (id) => api.delete(`/trainings/${id}`).then(r => r.data),

  getNearbyTrainings: (lng, lat, maxDistance = 50000) =>
    api.get('/trainings/nearby', { params: { longitude: lng, latitude: lat, maxDistance } })
       .then(r => r.data),
};

export default api;