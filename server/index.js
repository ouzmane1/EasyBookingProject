const express = require('express');
const cors = require('cors');
const app = express();
const port = 5000;

// Middleware
app.use(cors()); // Autorise les requêtes depuis le frontend
app.use(express.json());

// Route de test
app.get('/api/message', (req, res) => {
    res.json({ message: "Bonjour depuis le serveur Node.js !" });
});

app.listen(port, () => {
    console.log(`Serveur démarré sur le port ${port}`);
});