import citiesData from "../data/cities.json";
import fs from 'fs';
import path from 'path';

export type City = { zipCode: string; name: string };

export const cities: City[] = citiesData;

function saveContacts(): void {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') {
        return;
    }
    const filePath = path.join(__dirname, "cities.json");
    fs.writeFileSync(filePath, JSON.stringify(cities, null, 2), "utf-8");
}

export function getAllCities(): City[] {
    return cities;
}

export function getCityByZipCode(zipCode: string): City | undefined {
    return cities.find(c => c.zipCode === zipCode);
}

export function deleteCity(zipCode: string): boolean {
    const index = cities.findIndex(c => c.zipCode === zipCode);
    if (index === -1) {
        return false;
    }
    cities.splice(index, 1);
    saveContacts()
    return true;
}

export function createCity(zipCode: string, name: string): City | null {
    const existingCity = cities.find(c => c.zipCode === zipCode && c.name === name);
    if (existingCity) {
        return null;
    }

    const newCity: City = { zipCode: zipCode, name : name };
    cities.push(newCity);
    saveContacts()
    return newCity;
}

export function updateCity(zipCode: string, name: string): City | null {
    const city = cities.find(c => c.zipCode === zipCode);
    if (!city) {
        return null;
    }

    city.name = name;
    saveContacts();
    return city;
}