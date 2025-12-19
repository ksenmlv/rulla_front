export interface City {
  id: string;
  name: string;
  coords: { lat: number; lon: number };
  orderSort: number;
  districts: { id: string; name: string }[];
  metroStations: {
    id: string;
    name: string;
    lat: number;
    lon: number;
    lines: { id: number; name: string; color: string }[];
  }[];
}

export interface CitiesResponse {
  data: City[];  
}