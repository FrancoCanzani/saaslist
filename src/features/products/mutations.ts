import { useMutation, useQueryClient } from '@tanstack/react-query'
import { productSchema } from './schemas'
import { ApiResponse, Product } from './types'
import { z } from 'zod'

type ProductFormData = z.infer<typeof productSchema>

const createProduct = async (data: ProductFormData): Promise<Product> => {
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  const result: ApiResponse<Product> = await response.json()

  if (!response.ok || !result.success) {
    if (response.status === 401) {
      throw new Error('You must be logged in to submit a product')
    }
    
    if (response.status === 400) {
      const errorMessage = result.details || result.error || 'Validation error'
      throw new Error(`Validation error: ${errorMessage}`)
    }
    
    throw new Error(result.error || 'Failed to submit product')
  }

  if (!result.data) {
    throw new Error('No product data returned from server')
  }

  return result.data
}

export const useCreateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: createProduct,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      
      queryClient.invalidateQueries({ queryKey: ['user-products'] })
    },
    onError: (error: Error) => {
      console.error('Product creation failed:', error)
    },
  })
}