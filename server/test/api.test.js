const request = require('supertest');

// l'URL où ton serveur tourne
const API_URL = 'http://localhost:3000';

describe('Tests Intégration - API EasyBooking', () => {

    // Test de la route GET /api/salle
    test('GET /api/salle - Retourne la liste des salles (Status 200)', async () => {
        const response = await request(API_URL).get('/api/salle');
        
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
        const response = await request(API_URL).get('/api/nimportequoi');
        expect(response.status).toBe(404);
    });
});