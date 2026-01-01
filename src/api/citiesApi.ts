import apiClient from './client';
import { City } from '../types/city'; 

// поиск по строке
export interface CitySearchResult {
  cityId: string;
  cityName: string;
  matchType: 'CITY';
  matchId: string;
  matchName: string;
  score: number;
}

// ответ от /nearest — один город, структура как в types/city.ts
export const citiesApi = {
  // получение всех города
  getAllCities: async (): Promise<City[]> => {
    const response = await apiClient.get<City[]>('/geo/cities')

    return response.data
  },

  // поиск по названию
  searchCities: async (query: string, minScore = 0.1): Promise<CitySearchResult[]> => {
    if (!query.trim()) return []

    const response = await apiClient.get<CitySearchResult[]>('/geo/cities/search', {
      params: { q: query.trim(), minScore },
    })
    return response.data; 
  },

  // ближайший город по координатам
  getNearestCity: async (lat: number, lon: number): Promise<City> => {
    const response = await apiClient.get<City>('/geo/cities/nearest', {
      params: { lat, lon },
    })
    return response.data
  },
};