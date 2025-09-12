// const API_BASE = '/api';

// export class ApiService {
//   // метод для GET запросов
//   static async get(endpoint) {
//     try {
//       const response = await fetch(`${API_BASE}${endpoint}`);
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error(`Failed to fetch ${endpoint}:`, error);
//       throw error;
//     }
//   }

//   // метод для POST запросов
//   static async post(endpoint, data) {
//     try {
//       const response = await fetch(`${API_BASE}${endpoint}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(data),
//       });
      
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
      
//       return await response.json();
//     } catch (error) {
//       console.error(`Failed to post to ${endpoint}:`, error);
//       throw error;
//     }
//   }

//   // методы для определенных endpoints
//   static async getTowns() {
//     const cities = await this.get('/cities');
//     return cities.map(city => ({
//       value: city.id ? city.id.toString() : city.name,
//       label: city.name,
//       originalData: city
//     }));
//   }

// //   static async getUsers() {
// //     return await this.get('/users');
// //   }

  
// }