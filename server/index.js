const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const bcrypt = require('bcrypt');

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

app.post('/api/register', async (req, res) => {
    const { email, password, nom } = req.body;
    try {
        const userExist = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExist.rows.length > 0) {
            return res.status(400).json({ error: "Cet email est déjà utilisé." });
        }

        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        const newUser = await pool.query(
            'INSERT INTO users (email, password, nom) VALUES ($1, $2, $3) RETURNING id, email, nom',
            [email, hash, nom]
        );

        res.json(newUser.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: "Utilisateur introuvable." });
        }

        const user = userResult.rows[0];

        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(400).json({ error: "Mot de passe incorrect." });
        }

        res.json({ id: user.id, email: user.email, nom: user.nom });

    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur serveur');
    }
});

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