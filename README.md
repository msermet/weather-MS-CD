# Projet Évaluation Météo
# Clément Da Silva et Maxime Sermet

## Installation

### 1. Initialiser le projet Node.js

```bash
npm init -y
```

### 2. Installer TypeScript

```bash
npm install --save-dev typescript
npx tsc --init
```

### 3. Installer Express et ses types

```bash
npm install express
npm install --save-dev @types/express @types/node
```

### 4. Installer l'outil de développement

```bash
npm install --save-dev ts-node-dev
```

### 5. Installer Vitest et Supertest pour les tests

```bash
npm install --save-dev vitest supertest @types/supertest
```

### 6. Installer Pino pour les logs

```bash
npm install pino pino-pretty
npm install --save-dev @types/pino
```

## Commandes disponibles

### Développement

```bash
npm run dev
```
Lance le serveur en mode développement avec rechargement automatique sur http://localhost:3000

### Tests

```bash
npm test
```
Lance la suite de tests avec Supertest