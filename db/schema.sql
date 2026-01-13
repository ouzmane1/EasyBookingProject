-- Table Utilisateurs
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL, 
    nom VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table Salles
CREATE TABLE IF NOT EXISTS salle (
    id SERIAL PRIMARY KEY,
    nom VARCHAR(100) NOT NULL,
    capacite INT NOT NULL,
    observation TEXT,
    est_active BOOLEAN DEFAULT TRUE
);

-- Table Réservations
CREATE TABLE IF NOT EXISTS reservations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    salle_id INT NOT NULL,
    date_debut TIMESTAMP NOT NULL,
    date_fin TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT fk_user FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_salle FOREIGN KEY(salle_id) REFERENCES salle(id) ON DELETE CASCADE,

    CONSTRAINT verif_dates CHECK (date_fin > date_debut)
);

INSERT INTO salle (nom, capacite, observation) VALUES 
('Salle Vénus', 10, 'Salle de réunion avec projecteur'),
('Salle Mars', 4, 'Petit box pour entretien'),
('Salle Jupiter', 20, 'Grande salle de conférence');