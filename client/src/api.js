import axios from 'axios';

const API_BASE_URL = import.meta.env.PROD 
  ? 'https://kodbank-app11-h3c89jmnu-muleyananya889-4465s-projects.vercel.app' 
  : 'http://localhost:5000';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default API_BASE_URL;
