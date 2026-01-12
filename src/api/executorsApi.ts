import axios from 'axios';

const API_URL = '/api/v1/executors'; 

export const executorsApi = {
  getExecutors: async () => {
    return axios.get(API_URL);
  },
};