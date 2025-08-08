
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

app.get('/track', async (req, res) => {
  const tracking = req.query.tracking;
  if (!tracking) {
    return res.status(400).json({ error: 'Tracking requerido' });
  }

  const apiKey = '83qpxh3i-7q8w-mkw9-vt3o-0s4j5ntn0zxp';

  try {
    // 1. Detectar courier automáticamente
    const detectRes = await axios.post(
      'https://api.trackingmore.com/v4/couriers/detect',
      { tracking_number: tracking },
      {
        headers: {
          'Content-Type': 'application/json',
          'Tracking-Api-Key': '83qpxh3i-7q8w-mkw9-vt3o-0s4j5ntn0zxp'
        }
      }
    );

    const couriers = detectRes.data.data;
    if (!couriers || couriers.length === 0) {
      return res.status(404).json({ error: 'Courier no detectado' });
    }

    const courierCode = couriers[0].code;

    // 2. Consultar tracking info
    const trackRes = await axios.post(
      'https://api.trackingmore.com/v4/trackings/get',
      {
        tracking_number: tracking,
        courier_code: courierCode
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Tracking-Api-Key': '83qpxh3i-7q8w-mkw9-vt3o-0s4j5ntn0zxp'
        }
      }
    );

    res.json(trackRes.data);
  } catch (error) {
    console.error('❌ Error al rastrear:', error.response?.data || error.message);
    res.status(500).json({ error: 'Error al rastrear paquete' });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor de TrackingMore en http://localhost:${PORT}`);
});
