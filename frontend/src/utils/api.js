const BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const getMedicines = () => fetch(BASE_URL + '/api/medicines').then(r => r.json()).then(data => ({ data }));

export const addMedicine = (medicine) => fetch(BASE_URL + '/api/medicines', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(medicine)
}).then(r => r.json());

export const deleteMedicine = (id) => fetch(BASE_URL + '/api/medicines/' + id, {
  method: 'DELETE'
}).then(r => r.json());

export const getHealthTip = (medicine) => fetch(BASE_URL + '/api/ai/health-tip', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ medicine })
}).then(r => r.json());