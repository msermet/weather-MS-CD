import {deleteCity, getAllCities, getCityByZipCode, createCity} from "./cityService";
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

app.post('/cities', (request, response) => {
    logger.info({ method: request.method, url: request.url, body: request.body }, 'Route appelée: POST /cities');
    const {zipCode,name} = request.body;
    if (!zipCode || !name) {
        logger.error({ body: request.body }, 'Erreur: Champs zipCode ou name manquants');
        return response.status(400).json({error: "Les champs 'zipCode' et 'name' sont requis"});
    }



    const newCity = createCity(zipCode,name);
    logger.info({ city: newCity }, 'Ville créée avec succès');
    response.status(201).json({city: newCity});
})


app.use((request, response) => {
    response.status(404).json({ error: "Route non trouvée" });
});

export const server = app;