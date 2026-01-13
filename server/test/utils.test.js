// Fonction à tester (Normalement elle est dans un autre fichier, mais on la met ici pour l'exemple)
function isDateValid(start, end) {
    return new Date(start) < new Date(end);
}

// LE TEST UNITAIRE JEST
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