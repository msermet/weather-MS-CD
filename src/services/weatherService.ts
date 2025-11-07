import weatherData from "../data/weather.json";
import fs from 'fs';
import path from 'path';

export type WeatherType = "pluie" | "beau" | "neige";

export type Weather = {
    id: number;
    zipCode: string;
    weather: WeatherType;
};

export const weatherList: Weather[] = weatherData;

function saveWeather(): void {
    if (process.env.NODE_ENV === 'test' || process.env.VITEST === 'true') {
        return;
    }
    const filePath = path.join(__dirname, "../data/weather.json");
    fs.writeFileSync(filePath, JSON.stringify(weatherList, null, 2), "utf-8");
}

export function getWeatherByZipCode(zipCode: string): Weather | undefined {
    return weatherList.find(w => w.zipCode === zipCode);
}

export function createWeather(zipCode: string, weather: WeatherType): Weather {
    const maxId = weatherList.length > 0 ? Math.max(...weatherList.map(w => w.id)) : 0;
    const newWeather: Weather = {
        id: maxId + 1,
        zipCode: zipCode,
        weather: weather
    };
    weatherList.push(newWeather);
    saveWeather();
    return newWeather;
}

export function deleteWeather(id: number): boolean {
    const index = weatherList.findIndex(w => w.id === id);
    if (index === -1) {
        return false;
    }
    weatherList.splice(index, 1);
    saveWeather();
    return true;
}