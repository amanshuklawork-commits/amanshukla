import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api'
});

export const getMedicines = () => API.get('/medicines');
export const addMedicine = (data) => API.post('/medicines', data);
export const deleteMedicine = (id) => API.delete(`/medicines/${id}`);
export const getHealthTip = (medicine) => API.post('/ai/health-tip', { medicine });