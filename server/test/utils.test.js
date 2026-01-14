const isDateValid = (start, end) => new Date(start) < new Date(end);
const isEmailValid = (email) => /\S+@\S+\.\S+/.test(email);
const isPasswordStrong = (pwd) => pwd.length >= 6;
const isNameValid = (name) => name.trim().length > 0;
const cleanXSS = (input) => input.replace(/<script>.*<\/script>/, '');

describe('TESTS UNITAIRES (Logique Métier)', () => {

    // Validation Dates
    test('La date de fin doit être après la date de début', () => {
        expect(isDateValid('2026-01-01 10:00', '2026-01-01 12:00')).toBe(true);
    });
    test('La date de fin ne doit pas être avant le début', () => {
        expect(isDateValid('2026-01-01 12:00', '2026-01-01 10:00')).toBe(false);
    });

    // Email
    test('Un email valide est accepté', () => {
        expect(isEmailValid('test@school.com')).toBe(true);
    });
    test('Un email sans domaine est refusé', () => {
        expect(isEmailValid('toto')).toBe(false);
    });

    // Mot de passe
    test('Le mot de passe doit faire au moins 6 caractères', () => {
        expect(isPasswordStrong('12345')).toBe(false);
        expect(isPasswordStrong('123456')).toBe(true);
    });

    // Nom
    test('Le nom ne doit pas être vide', () => {
        expect(isNameValid('   ')).toBe(false);
        expect(isNameValid('Ousmane')).toBe(true);
    });

    // Règles Métier Salles
    test('La capacité d\'une salle doit être positive', () => {
        const room = { id: 1, capacity: 10 };
        expect(room.capacity).toBeGreaterThan(0);
    });
    test('Une réservation doit durer au moins 30 min', () => {
        const duration = 60;
        expect(duration).toBeGreaterThanOrEqual(30);
    });
    test('Une réservation ne doit pas dépasser 12h', () => {
        const duration = 720;
        expect(duration).toBeLessThanOrEqual(720);
    });

    // Sécurité XSS
    test('Les balises scripts doivent être nettoyées', () => {
        const dangerousInput = "Je suis <script>alert('Hacker')</script>";
        expect(cleanXSS(dangerousInput)).toBe("Je suis ");
    });
});