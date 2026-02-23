import axios from 'axios';
import mockApi from './mockApi';

const API_BASE_URL = import.meta.env.PROD 
  ? null // Use mock API for production
  : 'http://localhost:5000';

export const api = import.meta.env.PROD 
  ? mockApi 
  : axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

export default API_BASE_URL;
