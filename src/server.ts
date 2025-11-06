import {getAllCities} from "./cityService";

const express = require('express')
const app = express()
app.use(express.json());

app.get('/', (request, response) => {
    response.json({message:'Évaluation Météo : Maxime et Clément'})
});

app.get('/cities', (request, response) => {
    response.json({cities: getAllCities()})
})

export const server = app;