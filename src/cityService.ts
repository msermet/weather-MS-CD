import citiesData from "./cities.json";

export type City = { zipCode: bigint; name: string };

export const cities: City[] = citiesData;

export function getAllCities(): City[] {
    return cities;
}