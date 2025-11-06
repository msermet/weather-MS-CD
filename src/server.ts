import {getAllCities} from "./cityService";
import {logger} from "./logger";

const express = require('express')
const app = express()
app.use(express.json());

app.get('/', (request, response) => {
    logger.info({ method: request.method, url: request.url }, 'Route appelée: GET /');
    response.json({ message:'Évaluation Météo : Maxime et Clément' })
});

app.get('/cities', (request, response) => {
    logger.info({ method: request.method, url: request.url }, 'Route appelée: GET /cities');
    response.json({cities: getAllCities()})
})

app.use((request, response) => {
    response.status(404).json({ error: "Route non trouvée" });
});

export const server = app;