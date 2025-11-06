import {getAllCities, getCityByZipCode} from "./cityService";
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

app.get('/cities/:zipcode', (request, response) => {
    logger.info({ method: request.method, url: request.url, params: request.params }, 'Route appelée: GET /cities/:zipcode');
    const zipCode = Number(request.params.zipcode);
    if (isNaN(zipCode)) {
        logger.error({ zipCode: request.params.zipcode }, 'Erreur: ZipCode invalide');
        return response.status(400).json({error: "ZipCode invalide"});
    }
    const city = getCityByZipCode(zipCode);
    if (!city) {
        logger.error({ zipCode }, 'Erreur: Ville non trouvée');
        return response.status(404).json({error: "Ville non trouvée"});
    }
    response.json({city})
})

app.use((request, response) => {
    response.status(404).json({ error: "Route non trouvée" });
});

export const server = app;