
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());

app.post('/track', async (req, res) => {
  const { trackingId, destinationCountry } = req.body;

  if (!trackingId) {
    return res.status(400).json({ error: 'Tracking ID es requerido.' });
  }

  const data = {
    shipments: [
      {
        trackingId,
        destinationCountry: destinationCountry || 'US'
      }
    ],
    language: 'en',
    apiKey: process.env.PARCEL_API_KEY  // Asegúrate de definir esta variable en Render
  };

  try {
    const response = await axios.post(
      'https://parcelsapp.com/api/v3/shipments/tracking',
      data,
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    res.json(response.data);
  } catch (error) {
    console.error('Error en solicitud Parcel:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al consultar el tracking.' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor Parcel escuchando en http://localhost:${PORT}`);
});
