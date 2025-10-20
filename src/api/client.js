import axios from 'axios'


const apiClient = axios.create({
    baseURL: 'https://rulla.pro/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClient;