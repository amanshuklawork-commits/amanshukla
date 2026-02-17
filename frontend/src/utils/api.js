const BASE = process.env.REACT_APP_API_URL || 'https://amanshukla.onrender.com';

export const getMedicines = () =>
  fetch(BASE + '/api/medicines').then(r => r.json()).then(data => ({ data }));

export const addMedicine = (medicine) =>
  fetch(BASE + '/api/medicines', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(medicine)
  }).then(r => r.json());

export const deleteMedicine = (id) =>
  fetch(BASE + '/api/medicines/' + id, { method: 'DELETE' }).then(r => r.json());

export const getHealthTip = (medicine) =>
  fetch(BASE + '/api/ai/health-tip', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ medicine })
  }).then(r => r.json()).then(data => ({ data }));