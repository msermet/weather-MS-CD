import citiesData from "./cities.json";

export type City = { zipCode: number; name: string };

export const cities: City[] = citiesData;

export function getAllCities(): City[] {
    return cities;
}

export function getCityByZipCode(zipCode: number): City | undefined {
    return cities.find(c => c.zipCode === zipCode);
}