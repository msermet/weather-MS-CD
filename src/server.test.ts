import { describe, it, expect, beforeEach } from "vitest";
import request from "supertest";
import { server } from "./server";
import { cities } from "./cityService";

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

    describe.only("DELETE /cities/:zipcode", () => {
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

    describe("Routes générales", () => {
        it("retourne 404 pour une route inexistante", async () => {
            const response = await request(server).get("/route-inexistante");
            expect(response.status).toBe(404);
            expect(response.body.error).toBe("Route non trouvée");
        });
    });
});
