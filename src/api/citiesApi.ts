import apiClient from './client'
import { CitiesResponse } from '../types/city'


export const citiesApi = {
    getCities: async(): Promise<CitiesResponse> => {
        const response = await apiClient.get<CitiesResponse>('/asset/cities')
        return response.data
    }
}
