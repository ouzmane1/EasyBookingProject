# EasyBooking - Gestion de Réservation de Salles

**EasyBooking** est une application web complète permettant aux collaborateurs de réserver des salles de réunion en temps réel, avec une gestion stricte des conflits de planning.

Ce projet a été conçu avec une approche **"Quality First"**, intégrant une couverture de tests (Unitaires, Intégration, Performance, Sécurité) et un pipeline d'Intégration Continue (CI/CD) automatisé.

---

##  Fonctionnalités Clés

### 1. Gestion Utilisateur
* **Inscription & Connexion :** Authentification sécurisée (Hashage *Bcrypt*).
* **Sécurité :** Protection contre les injections SQL et failles XSS.

### 2. Réservation & Salles
* **Catalogue :** Visualisation des salles et capacités.
* **Moteur de Réservation :**
    * Vérification des disponibilités en temps réel.
    * **Anti-Doublon :** Blocage automatique si le créneau est déjà pris.
    * Validation des contraintes temporelles (Pas de fin avant début).

### 3. Espace Personnel
* **Dashboard :** Vue synthétique des réservations.
* **Historique :** Consultation des réservations.

---

## Stack Technique

* **Frontend :** React.js.
* **Backend :** Node.js, Express.js.
* **Base de Données :** PostgreSQL (Hébergé via **Docker**).
* **Qualité & Tests :**
    *  **Jest & Supertest :** Tests Unitaires et d'Intégration API.
    *  **k6 :** Tests de charge et performance.
    *  **Sécurité :** Audit npm, Helmet (simulé), Validation des entrées.
    *  **GitHub Actions :** Pipeline CI automatisé.

---

##  Installation et Démarrage

### Prérequis
* Node.js
* Docker & Docker Compose

### 1. Cloner le projet

```bash
git clone "https://github.com/ouzmane1/EasyBookingProject.git"
cd EasyBooking
```

### 2. Démarrer la Base de Données (Docker)
Le projet utilise Docker Compose pour lancer PostgreSQL et importer automatiquement le schéma de la base de données.

```bash
docker-compose up -d
```