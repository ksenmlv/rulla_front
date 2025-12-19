import axios from 'axios'

const apiClientLocal = axios.create({
    baseURL: '/',
    headers: {
        'Content-Type': 'application/json',
    },
})

export default apiClientLocal
