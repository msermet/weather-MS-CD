import citiesData from "./cities.json";
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

export function createCity(zipCode: string, name: string): City {
    const newCity: City = { zipCode: zipCode, name : name };
    cities.push(newCity);
    saveContacts()
    return newCity;
}