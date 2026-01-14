const http = require('http');
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

function makeRequest(path) {
    return new Promise((resolve, reject) => {
        const start = Date.now();
        const req = http.get({ hostname: 'localhost', port, path, timeout: 5000 }, (res) => {
            res.on('data', () => {});
            res.on('end', () => {
                const latency = Date.now() - start;
                resolve({ status: res.statusCode, latency });
            });
        });
        req.on('error', (err) => reject(err));
        req.on('timeout', () => {
            req.destroy(new Error('timeout'));
        });
    });
}

async function run({ concurrency = 50, duration = 10, path = '/api/salle' } = {}) {
    await startServer();

    console.log(`Lancement du test basique: ${concurrency} connexions, ${duration}s, GET ${path}`);

    const endTime = Date.now() + duration * 1000;
    let totalRequests = 0;
    let successes = 0;
    let errors = 0;
    const latencies = [];

    async function worker() {
        while (Date.now() < endTime) {
            try {
                const res = await makeRequest(path);
                totalRequests++;
                if (res.status >= 200 && res.status < 300) successes++;
                latencies.push(res.latency);
            } catch (err) {
                totalRequests++;
                errors++;
            }
        }
    }

    // Lancer les workers
    const workers = Array.from({ length: concurrency }, () => worker());
    await Promise.all(workers);

    // Calcul des métriques
    const durationSec = duration;
    const rps = Math.round(totalRequests / durationSec);
    const avgLatency = latencies.length ? Math.round(latencies.reduce((a, b) => a + b, 0) / latencies.length) : 0;
    latencies.sort((a, b) => a - b);
    const p50 = latencies.length ? latencies[Math.floor(latencies.length * 0.5)] : 0;
    const p95 = latencies.length ? latencies[Math.floor(latencies.length * 0.95)] : 0;

    console.log('\n--- Résultats ---');
    console.log(`Requêtes totales : ${totalRequests}`);
    console.log(`Réussites (2xx) : ${successes}`);
    console.log(`Erreurs : ${errors}`);
    console.log(`RPS moyen : ${rps} req/s`);
    console.log(`Latency moyenne : ${avgLatency} ms`);
    console.log(`p50 : ${p50} ms, p95 : ${p95} ms`);

    await stopServer();
    console.log('Serveur arrêté.');
}

// Arguments env ou defaults
const concurrency = parseInt(process.env.PERF_CONCURRENCY || '50', 10);
const duration = parseInt(process.env.PERF_DURATION || '10', 10);
const path = process.env.PERF_PATH || '/api/salle';

run({ concurrency, duration, path }).catch((err) => {
    console.error('Erreur lors du test basique :', err);
    process.exit(1);
});
