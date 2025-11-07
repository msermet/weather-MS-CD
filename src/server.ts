import {deleteCity, getAllCities, getCityByZipCode, createCity, updateCity} from "./services/cityService";
import {getWeatherByZipCode} from "./services/weatherService";
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
    if (!newCity) {
        logger.error({ zipCode,name }, 'Erreur: La ville est déjà associée à ce code postale');
        return response.status(409).json({error: "La ville est déjà associée à ce code postale"});
    }

    logger.info({ city: newCity }, 'Ville créée avec succès');
    response.status(201).json({city: newCity});
})

app.put('/cities/:zipcode', (request, response) => {
    logger.info({ method: request.method, url: request.url, params: request.params, body: request.body }, 'Route appelée: PUT /cities/:zipcode');
    const zipCode = String(request.params.zipcode);
    const { name } = request.body;

    if (!name) {
        logger.error({ body: request.body }, 'Erreur: Champ name manquant');
        return response.status(400).json({ error: "Le champ 'name' est requis" });
    }

    const updatedCity = updateCity(zipCode, name);
    if (!updatedCity) {
        logger.error({ zipCode }, 'Erreur: Ville non trouvée pour mise à jour');
        return response.status(404).json({ error: "Ville non trouvée" });
    }

    logger.info({ city: updatedCity }, 'Ville mise à jour avec succès');
    response.json({ zipCode: updatedCity.zipCode, name: updatedCity.name });
});

app.get('/cities/:zipcode/weather', (request, response) => {
    logger.info({ method: request.method, url: request.url, params: request.params }, 'Route appelée: GET /cities/:zipcode/weather');
    const zipCode = String(request.params.zipcode);

    const city = getCityByZipCode(zipCode);
    if (!city) {
        logger.error({ zipCode }, 'Erreur: Ville non trouvée');
        return response.status(404).json({error: "Ville non trouvée"});
    }

    const weather = getWeatherByZipCode(zipCode);
    if (!weather) {
        logger.error({ zipCode }, 'Erreur: Données météo non disponibles pour cette ville');
        return response.status(404).json({error: "Données météo non disponibles pour cette ville"});
    }

    logger.info({ zipCode, weather: weather.weather }, 'Météo récupérée avec succès');
    response.json({
        zipCode: city.zipCode,
        name: city.name,
        weather: weather.weather
    });
})

app.use((request, response) => {
    response.status(404).json({ error: "Route non trouvée" });
});

export const server = app;