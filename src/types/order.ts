export type Order = {
  id: number
  title: string
  category: string
  subcategory?: string
  budget: string
  deadline: string
  location: string
  cityId?: number
  views: number
  responsesCount?: number
  publishedAt: string
  publishedDate?: string
  customerId?: number
  status: 'active' | 'in_progress' | 'completed' | 'archived'
  description?: string
  images?: string[]
  customerName?: string          
  customerRating?: number       
  customerReviews?: number      
  requirements?: string[]       
  materials?: string            
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