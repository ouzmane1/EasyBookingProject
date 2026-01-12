const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: 'admin',           
    host: 'localhost',
    database: 'easybooking_db',
    password: 'monmotdepasse',
    port: 5432,
});

// Récupération les salles
app.get('/api/salle', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM salle');
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.listen(port, () => {
    console.log(`Serveur Back-end démarré sur http://localhost:${port}`);
});