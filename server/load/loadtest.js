const autocannon = require('autocannon');

// Lancer le serveur en-process
const app = require('../index');

const port = process.env.PORT || 3001;
let server;

function startServer() {
    return new Promise((resolve) => {
        server = app.listen(port, () => {
            console.log(`Test server démarré sur http://localhost:${port}`);
            resolve();
        });
    });
}

function stopServer() {
    return new Promise((resolve, reject) => {
        if (!server) return resolve();
        server.close((err) => (err ? reject(err) : resolve()));
    });
}

async function run() {
    try {
        await startServer();

        console.log('Démarrage du test de charge (GET /api/salle) — 10s, 50 connexions concurrentes');

        const result = await new Promise((resolve, reject) => {
            autocannon(
                {
                    url: `http://localhost:${port}/api/salle`,
                    connections: 50,
                    duration: 10,
                    method: 'GET',
                    pipelining: 1,
                },
                (err, res) => {
                    if (err) return reject(err);
                    resolve(res);
                }
            );
        });

        console.log('--- Résumé du test ---');
        console.log(`RPS moyen: ${Math.round(result.requests.average)} req/s`);
        console.log(`Latency moyenne: ${result.latency.average} ms`);
        console.log(`Latency 50%: ${result.latency.p50} ms, 95%: ${result.latency.p95} ms`);
        console.log(`Erreurs: ${result.errors}`);
        console.log('Détails:', {
            duration: result.duration,
            requests: result.requests,
            latency: result.latency,
        });

    } catch (err) {
        console.error('Erreur durant le test de charge:', err);
    } finally {
        await stopServer();
        console.log('Serveur de test arrêté.');
        process.exit(0);
    }
}

run();
