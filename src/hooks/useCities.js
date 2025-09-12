// import { useState, useEffect } from "react";
// import { ApiService } from "../services/api";


// export const useCities = () => {
//     const [cities, setCities] = useState([])
//     const [loading, setLoading] = useState(true)
//     const [error, setError] = useState(null)

//     useEffect(() => {
//         const fetchCities = async () => {
//             try {
//                 setLoading(true)
//                 const citiesData = await ApiService.getTowns()
//                 setCities(citiesData)
//                 setError(null)
//             } catch (err) {
//                 setError(err.message)
//                 setCities([])
//             } finally {
//                 setLoading(false)
//             }
//         }

//         fetchCities()
//     }, [])

//     return { cities, loading, error }
// }

