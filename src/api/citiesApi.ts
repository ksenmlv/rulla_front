import apiClient from './client'
import { CitiesResponse } from '../types/city'

export const citiesApi = {
    getCities: async(): Promise<CitiesResponse> => {
        const response = await apiClient.get<CitiesResponse>('/asset/cities')
        
        // Сортируем cities по имени с учетом русской локали
        const sortedData = {
            ...response.data,
            data: response.data.data.sort((a, b) => a.name.localeCompare(b.name, 'ru'))
        }
        
        return sortedData
    }
}



// // без сортировки
// import apiClient from './client'
// import { CitiesResponse } from '../types/city'


// export const citiesApi = {
//     getCities: async(): Promise<CitiesResponse> => {
//         const response = await apiClient.get<CitiesResponse>('/asset/cities')
//         return response.data
//     }
// }
