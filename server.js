
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/track', async (req, res) => {
  const trackingNumber = req.query.tracking;

  if (!trackingNumber) {
    return res.status(400).json({ error: 'Tracking number is required' });
  }

  try {
    const response = await axios.get('https://api.trackingmore.com/v4/trackings/get', {
      headers: {
        'Tracking-Api-Key': 'TU_API_KEY_DE_TRACKINGMORE',
        'Content-Type': 'application/json'
      },
      params: {
        tracking_number: trackingNumber
      }
    });

    res.json(response.data);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).json({ error: 'Failed to fetch tracking info' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
