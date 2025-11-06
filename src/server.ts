import {deleteCity, getAllCities, getCityByZipCode} from "./cityService";
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
    const zipCode = String(request.params.zipcode);
    const city = getCityByZipCode(zipCode);
    if (!city) {
        logger.error({ zipCode }, 'Erreur: Ville non trouvée');
        return response.status(404).json({error: "Ville non trouvée"});
    }
    response.json({city})
})

app.delete("/cities/:zipcode", (request, response) => {
    logger.info({ method: request.method, url: request.url, params: request.params }, 'Route appelée: DELETE /cities/:zipcode');
    const zipCode = String(request.params.zipcode);

    const deleted = deleteCity(zipCode);
    if (!deleted) {
        logger.error({ zipCode }, 'Erreur: Ville non trouvée pour suppression');
        return response.status(404).json({ error: "Ville non trouvée" });
    }

    logger.info({ zipCode }, 'Ville supprimée avec succès');
    response.json({ message: "Ville supprimée avec succès" });
});


app.use((request, response) => {
    response.status(404).json({ error: "Route non trouvée" });
});

export const server = app;