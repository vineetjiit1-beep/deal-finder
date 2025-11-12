const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const router = require('./routes');
const { initDb } = require('./db');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Top-level health route (Render may probe /health)
app.get('/health', (req, res) => res.status(200).send('ok'));

initDb();
app.use('/api', router);

const PORT = process.env.PORT || 10000;
app.listen(PORT, '0.0.0.0', () => console.log(`Deal Finder API running on ${PORT}`));
