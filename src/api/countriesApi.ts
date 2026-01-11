import apiClient from './client'

export const countriesApi = {
  // Получить все страны
  getAllCountries: async () => {
    try {
      const response = await apiClient.get('/geo/cities/countries');
      return response.data; // массив [{name_ru, iso_code2, flagUrl, ...}]
    } catch (error) {
      console.error('Ошибка загрузки стран:', error);
      throw error; 
    }
  },

  // Поиск страны по названию (если нужно в будущем)
  searchCountries: async (query: string) => {
    const response = await apiClient.get('/geo/cities/countries/search', {
      params: { q: query, minScore: 0.5 }
    });
    return response.data;
  },

  // Получить страну по ISO
  getCountryByIso: async (iso: string) => {
    const response = await apiClient.get(`/geo/cities/countries/${iso}`);
    return response.data;
  }
};