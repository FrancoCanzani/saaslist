import { useQuery } from '@tanstack/react-query'
import {  Product } from './types'
import { ApiResponse } from '@/utils/types'

const fetchProduct = async (id: string): Promise<Product> => {
  const response = await fetch(`/api/products/${id}`)
  const result: ApiResponse<Product> = await response.json()

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch product')
  }

  return result.data
}

export const useProduct = (id: string) => {
  return useQuery({
    queryKey: ['product', id],
    queryFn: () => fetchProduct(id),
    enabled: !!id,
  })
}

