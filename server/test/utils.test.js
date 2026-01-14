const { isEmailValid } = require('../utils');

// Fonction à tester (Normalement elle est dans un autre fichier, mais on la met ici pour l'exemple)
function isDateValid(start, end) {
    return new Date(start) < new Date(end);
}

// TESTS UNITAIRES - DATES
describe('Tests Unitaires - Validation Dates', () => {
    
    test('Retourne TRUE si la fin est après le début', () => {
        const debut = '2026-01-01 10:00';
        const fin = '2026-01-01 12:00';
        expect(isDateValid(debut, fin)).toBe(true);
    });

    test('Retourne FALSE si la fin est avant le début', () => {
        const debut = '2026-01-01 12:00';
        const fin = '2026-01-01 10:00';
        expect(isDateValid(debut, fin)).toBe(false);
    });
});

// TESTS UNITAIRES - EMAIL
describe('Tests Unitaires - Validation Email', () => {
    const valides = [
        'user@example.com',
        'user.name+tag@sub.domain.co.uk',
        'prenom.nom@domain.fr'
    ];

    const invalides = [
        'user@',
        'userexample.com',
        'user@.com',
        '@domain.com',
        '',
        null,
        undefined,
        ' user@domain.com '
    ];

    test.each(valides)('Doit accepter l\'email valide: %s', (mail) => {
        expect(isEmailValid(mail)).toBe(true);
    });

    test.each(invalides)('Doit rejeter l\'email invalide: %s', (mail) => {
        expect(isEmailValid(mail)).toBe(false);
    });
});