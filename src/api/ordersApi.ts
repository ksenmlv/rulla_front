import apiClient from './client'
import { OrdersResponse, Order, OrderResponse } from '../types/order'

export const ordersApi = {
  // список всех заказов (с фильтрами и пагинацией)
  getOrders: async (params?: {
    page?: number
    category?: string
    city?: string
    budget_min?: number
    budget_max?: string
    search?: string
  }): Promise<OrdersResponse> => {
    const response = await apiClient.get<OrdersResponse>('/orders.json', { params })

    // сортировка по новизне
    const sortedData = {
      ...response.data,
      data: response.data.data.sort((a, b) =>
        new Date(b.publishedDate || b.publishedAt).getTime() -
        new Date(a.publishedDate || a.publishedAt).getTime()
      )
    }

    return sortedData
  },

  // один заказ по ID
  getOrderById: async (id: number | string): Promise<Order> => {
    const response = await apiClient.get<OrderResponse>(`/orders/${id}`)
    return response.data.data
  },

  // создание заказа
  createOrder: async (orderData: Partial<Order>): Promise<Order> => {
    const response = await apiClient.post<OrderResponse>('/orders', orderData)
    return response.data.data
  },

  // удаление 
  deleteOrder: async (id: number) => {
    await apiClient.delete(`/orders/${id}`)
  }
}