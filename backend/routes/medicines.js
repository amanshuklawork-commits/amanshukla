const express = require('express');
const router = express.Router();

let medicines = [];

router.get('/', (req, res) => {
  res.json(medicines);
});

router.post('/', (req, res) => {
  const { name, dosage, time } = req.body;

  if (!name || !dosage || !time) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newMedicine = {
    id: Date.now(),
    name,
    dosage,
    time
  };

  medicines.push(newMedicine);
  res.status(201).json(newMedicine);
});

router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  medicines = medicines.filter(med => med.id !== id);
  res.json({ message: 'Medicine deleted' });
});

module.exports = router;
