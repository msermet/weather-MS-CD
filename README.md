# Projet Évaluation Météo

**Auteurs :** Clément Da Silva et Maxime Sermet

---

## Présentation

API REST de gestion de villes et de bulletins météo développée en TypeScript avec Express. Cette application permet de gérer une base de données de villes françaises et leurs conditions météorologiques associées.

### Fonctionnalités principales

- **Gestion complète des villes** : Création, consultation, modification et suppression de villes avec leur code postal
- **Gestion des bulletins météo** : Création, consultation et suppression de bulletins météo (pluie, beau, neige)
- **Validation des données** : Vérification de l'existence des villes avant ajout de bulletins météo
- **Logging structuré** : Journalisation détaillée avec Pino pour faciliter le débogage. Stockage des logs dans un fichier app.log.
- **Tests automatisés** : Suite de tests complète avec Vitest et Supertest (24 tests)

### Technologies utilisées

- **Backend** : Node.js, Express 5, TypeScript
- **Stockage** : Fichiers JSON persistants
- **Logging** : Pino avec pino-pretty
- **Tests** : Vitest, Supertest

---

## Installation


### Étapes d'installation

1. **Initialiser le projet Node.js**
   ```bash
   npm init -y
   ```

2. **Installer TypeScript**
   ```bash
   npm install --save-dev typescript
   npx tsc --init
   ```

3. **Installer Express et ses types**
   ```bash
   npm install express
   npm install --save-dev @types/express @types/node
   ```

4. **Installer l'outil de développement**
   ```bash
   npm install --save-dev ts-node-dev
   ```

5. **Installer Vitest et Supertest pour les tests**
   ```bash
   npm install --save-dev vitest supertest @types/supertest
   ```

6. **Installer Pino pour les logs**
   ```bash
   npm install pino pino-pretty
   ```

### Installation rapide

```bash
npm install
```

---

## Commandes disponibles

### Développement

```bash
npm run dev
```
Lance le serveur en mode développement avec rechargement automatique sur **http://localhost:3000**

### Tests

```bash
npm test
```
Exécute la suite de tests avec Vitest et Supertest

---

## Fonctionnalités supplémentaires

### Route complet sur les villes

Nous avons ajouté la route POST /cities afin de rendre l'application 100% fonctionnelle pour le client. Il peut donc supprimer une ville, en modifier
et ainsi en ajouter.

- ✅ **POST /cities** : Création de nouvelles villes
- ✅ **PUT /cities/:zipcode** : Modification du nom d'une ville
- ✅ **DELETE /cities/:zipcode** : Suppression d'une ville

Cette fonctionnalité permet au client de gérer entièrement les villes de l'application sans intervention manuelle sur les fichiers de données.

---

## Limitations connues

### Fonctionnalités non implémentées

En raison de contraintes de temps, les fonctionnalités suivantes n'ont pas été finalisées :

#### 1. Liste globale des bulletins météo
- **Route :** `GET /weather`
- **Description :** Afficher tous les bulletins météo de toutes les villes
- **Implémentation prévue :**
    - Route Express dans `server.ts`
    - Tests unitaires dans `server.test.ts`
    - Requêtes de test dans `requests.http`

#### 2. Récupération d'un bulletin météo spécifique
- **Routes :**
    - `GET /cities/:zipcode/weather/:id`
    - `GET /weather/:id`
- **Description :** Récupérer le détail d'un bulletin météo par son identifiant
- **Implémentation prévue :**
    - Service `getWeatherById()` dans `weatherService.ts`
    - Routes Express correspondantes
    - Tests unitaires et d'intégration