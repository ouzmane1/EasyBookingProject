const request = require('supertest');
const { Pool } = require('pg');
const app = require('../index');

// Pool pour vérifier directement la DB dans les tests d'intégration
const pool = new Pool({
    user: 'admin',
    host: 'localhost',
    database: 'easybooking_db',
    password: 'monmotdepasse',
    port: 5432,
});

describe('Tests Intégration - API EasyBooking', () => {

    // Test de la route GET /api/salle
    test('GET /api/salle - Retourne la liste des salles (Status 200)', async () => {
        const response = await request(app).get('/api/salle');
        
        // VÉRIFICATIONS
        expect(response.status).toBe(200); // Le serveur répond OK
        expect(Array.isArray(response.body)).toBe(true); // On reçoit bien un tableau
        expect(response.body.length).toBeGreaterThan(0); // Il y a au moins une salle
        
        // Vérification qu'on a bien les champs attendus
        expect(response.body[0]).toHaveProperty('nom');
        expect(response.body[0]).toHaveProperty('capacite');
    });

    // Test d'une route qui n'existe pas (404)
    test('GET /api/inconnu - Doit retourner 404', async () => {
        const response = await request(app).get('/api/nimportequoi');
        expect(response.status).toBe(404);
    });

    // Test d'intégration API <-> Base de données
    test('POST /api/register - Insère un utilisateur en base', async () => {
        const unique = Date.now();
        const email = `testuser+${unique}@example.com`;
        const password = 'TestPass123!';
        const nom = 'Test User';

        // Appel API pour créer l'utilisateur
        const res = await request(app)
            .post('/api/register')
            .send({ email, password, nom });

        expect(res.status).toBe(200);
        expect(res.body).toHaveProperty('id');
        expect(res.body.email).toBe(email);

        // Vérification directe en base
        const dbRes = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        expect(dbRes.rows.length).toBe(1);
        expect(dbRes.rows[0].email).toBe(email);
        expect(dbRes.rows[0].nom).toBe(nom);

        // Nettoyage
        await pool.query('DELETE FROM users WHERE email = $1', [email]);
    }, 15000);
});

afterAll(async () => {
    await pool.end();
    if (app && app.pool) {
        await app.pool.end();
    }
});