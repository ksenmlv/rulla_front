export type Order = {
  id: number
  title: string
  category: string
  subcategory?: string         
  budget: string                 // бюджет
  deadline: string               
  location: string              
  cityId?: number                // если нужно для фильтров
  views: number                  // колво просмотров
  responsesCount?: number        // количество откликов (можно добавить потом)
  publishedAt: string            // "2 сентября 2025г." 
  publishedDate?: string         // ISO для сортировки: "2025-09-02T10:00:00Z"
  customerId: number
  status: 'active' | 'in_progress' | 'completed' | 'archived'
  description?: string
  images?: string[]
}

export type OrdersResponse = {
  data: Order[]
  meta: {
    currentPage: number
    lastPage: number
    perPage: number
    total: number
  }
}

export type OrderResponse = {
  data: Order
}