import axios from 'axios'


const apiClient = axios.create({
    baseURL: 'http://5.129.250.160/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClient;