import axios from 'axios'


const apiClient = axios.create({
    // baseURL: 'https://rulla.pro/api/v1',
    // baseURL: '/',
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
})

apiClient.interceptors.request.use(
  (config) => {
    // Не добавляем токен к запросам авторизации
    const noAuthPaths = [
      '/customers/auth/phone/code',
      '/customers/auth/phone/verify',
    ];

    const isAuthRequest = noAuthPaths.some(path => 
      config.url.includes(path)
    );

    if (!isAuthRequest) {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// === ОПЦИОНАЛЬНО: интерсептор для обработки 401 (обновление токена или логаут) ===
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken')
      // window.location.href = '/enter' // если нужно
    }
    return Promise.reject(error)
  }
)

export default apiClient;