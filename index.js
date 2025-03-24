require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cron = require('node-cron');
const { createClient } = require('@supabase/supabase-js');
const cors = require('cors');

const app = express();
app.use(cors());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

async function fetchTravelTime() {
  const response = await axios.post(
    'https://api.openrouteservice.org/v2/directions/driving-car',
    {
      coordinates: [
        [18.561207, 54.322681], // Migdałowa 59
        [18.605573, 54.352534]  // Kartuska 126A
      ]
    },
    { headers: { Authorization: process.env.ORS_API_KEY } }
  );

  return response.data.features[0].properties.summary.duration / 60;
}

cron.schedule('*/15 6-7 * * *', async () => {
  const duration = await fetchTravelTime();
  const timestamp = new Date();
  const weekday = timestamp.toLocaleString('pl-PL', { weekday: 'long' });

  await supabase
    .from('czasy_dojazdu')
    .insert([{ timestamp, weekday, duration_minutes: duration }]);

  console.log(`Zapisano czas przejazdu: ${duration} min o ${timestamp}`);
});

app.get('/', (req, res) => res.send('Serwer działa!'));

app.listen(3000, () => {
  console.log('Serwer działa na porcie 3000');
});
