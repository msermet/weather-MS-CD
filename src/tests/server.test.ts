import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { server } from "../server";
import { cities } from "../services/cityService";

describe("API Cities", () => {
    const initialCities = [
        { zipCode: "70140", name: "Valay" },
        { zipCode: "25610", name: "Arc-Et-Senans" },
        { zipCode: "21000", name: "Dijon" },
        { zipCode: "25000", name: "Besançon" }
    ];
    beforeEach(() => {
        cities.length = 0;
        cities.push(...initialCities);
    });

    describe("GET /", () => {
        it("retourne Évaluation Météo : Maxime et Clément", async () => {
            const response = await request(server).get("/");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({ message: "Évaluation Météo : Maxime et Clément" });
        });
    });

    describe("GET /cities", () => {
        it("retourne toutes les villes", async () => {
            const res = await request(server).get("/cities");
            expect(res.status).toBe(200);
            expect(res.body.cities.length).toBeGreaterThan(0);
        });
    });

    describe("GET /cities/:zipcode", () => {
        it("retourne une ville existante", async () => {
            const response = await request(server).get("/cities/70140");
            expect(response.status).toBe(200);
            expect(response.body.city).toEqual({
                zipCode: 70140,
                name: "Valay"
            });
        });

        it("retourne 404 pour une ville inexistante", async () => {
            const response = await request(server).get("/cities/70544");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ville non trouvée");
        });
    });

    describe("POST /cities", () => {
        it("crée une nouvelle ville", async () => {
            const response = await request(server).post("/cities").send({zipCode: "75000", name: "Paris"});

            expect(response.status).toBe(201);
            expect(response.body.city).toMatchObject({
                zipCode: "75000",
                name: "Paris"
            });
        });

        it("retourne 400 si le zipCode est manquant", async () => {
            const response = await request(server).post("/cities").send({name: "Lyon"});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Les champs 'zipCode' et 'name' sont requis");
        });

        it("retourne 400 si le name est manquant", async () => {
            const response = await request(server).post("/cities").send({zipCode: "69000"});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Les champs 'zipCode' et 'name' sont requis");
        });

        it("autorise plusieurs villes avec le même code postal", async () => {
            const response = await request(server).post("/cities").send({ zipCode: "70140", name: "Chaumercenne" });

            expect(response.status).toBe(201);
            expect(response.body.city).toMatchObject({
                zipCode: "70140",
                name: "Chaumercenne"
            });
        });

        it("retourne 409 si le code postal existe déjà pour cette ville", async () => {
            const response = await request(server).post("/cities").send({zipCode: "70140", name: "Valay"});

            expect(response.status).toBe(409);
            expect(response.body.error).toBe("La ville est déjà associée à ce code postale");
        });
    });


    describe("DELETE /cities/:zipcode", () => {
        it("supprime une ville existante", async () => {
            const response = await request(server).delete("/cities/21000");
            expect(response.status).toBe(200);
            expect(response.body.message).toBe("Ville supprimée avec succès");
        });

        it("retourne 404 pour une ville inexistante", async () => {
            const response = await request(server).delete("/cities/999");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ville non trouvée");
        });
    });

    describe("PUT /cities/:zipcode", () => {
        it("met à jour une ville existante", async () => {
            const response = await request(server)
                .put("/cities/70140")
                .send({ name: "Nouveau Valay" });

            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                zipCode: "70140",
                name: "Nouveau Valay"
            });
        });

        it("retourne 404 pour une ville inexistante", async () => {
            const response = await request(server)
                .put("/cities/99999")
                .send({ name: "Test" });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ville non trouvée");
        });

        it("retourne 400 si le name est manquant", async () => {
            const response = await request(server)
                .put("/cities/70140")
                .send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Le champ 'name' est requis");
        });
    });

    describe("GET /cities/:zipcode/weather", () => {
        it("retourne la météo d'une ville existante", async () => {
            const response = await request(server).get("/cities/70140/weather");
            expect(response.status).toBe(200);
            expect(response.body).toEqual({
                zipCode: "70140",
                name: "Valay",
                weather: "pluie"
            });
        });

        it("retourne 404 pour une ville inexistante", async () => {
            const response = await request(server).get("/cities/99999/weather");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ville non trouvée");
        });
    });

    describe.only("POST /cities/:zipcode/weather", () => {
        it("crée un bulletin météo pour une ville existante", async () => {
            const response = await request(server).post("/cities/70140/weather").send({ weather: "neige" });

            expect(response.status).toBe(201);
            expect(response.body.id).toBeDefined();
            expect(typeof response.body.id).toBe("number");
        });

        it("retourne 404 pour une ville inexistante", async () => {
            const response = await request(server).post("/cities/99999/weather").send({ weather: "pluie" });

            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Ville non trouvée");
        });

        it("retourne 400 si le champ weather est manquant", async () => {
            const response = await request(server).post("/cities/70140/weather").send({});

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Le champ 'weather' est requis");
        });

        it("retourne 400 si la valeur de weather est invalide", async () => {
            const response = await request(server).post("/cities/70140/weather").send({ weather: "orage" });

            expect(response.status).toBe(400);
            expect(response.body.error).toBe("Le champ 'weather' doit être 'pluie', 'beau' ou 'neige'");
        });
    });

    describe("Routes générales", () => {
        it("retourne 404 pour une route inexistante", async () => {
            const response = await request(server).get("/route-inexistante");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Route non trouvée");
        });
    });
});
