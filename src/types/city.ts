export interface City {
    id: string
    name: string
}

export interface CitiesResponse {
    success: boolean
    data: City[]
}