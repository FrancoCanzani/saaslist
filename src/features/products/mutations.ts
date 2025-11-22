import { useMutation, useQueryClient } from '@tanstack/react-query'
import {  Product, ProductFormData } from './types'
import { uploadProductLogo, uploadProductImages, deleteUploadedAssets, updateProductAction } from './actions'
import { ApiResponse } from '@/utils/types'

const createProduct = async (data: ProductFormData): Promise<Product> => {
  let uploadedLogoPath: string | null = null;
  let logoUrl = data.logo_url;

  try {
    if (data.logo_file) {
      const { url, path } = await uploadProductLogo(data.logo_file);
      logoUrl = url;
      uploadedLogoPath = path;
    }

    const { logo_file, image_files, ...productData } = data;

    const response = await fetch('/api/products', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        ...productData,
        logo_url: logoUrl,
      }),
    });

    const result: ApiResponse<Product> = await response.json();

    if (!response.ok || !result.success) {
      if (uploadedLogoPath) {
        await deleteUploadedAssets([uploadedLogoPath], 'product-logos');
      }

      if (response.status === 401) {
        throw new Error('You must be logged in to submit a product');
      }
      
      if (response.status === 400) {
        const errorMessage = result.details || result.error || 'Validation error';
        throw new Error(`Validation error: ${errorMessage}`);
      }
      
      throw new Error(result.error || 'Failed to submit product');
    }

    if (!result.data) {
      throw new Error('No product data returned from server');
    }

    if (image_files && image_files.length > 0) {
      try {
        const imageUrls = await uploadProductImages(image_files, result.data.id);
        
        const updateResponse = await fetch(`/api/products/${result.data.id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            images: imageUrls,
          }),
        });

        if (updateResponse.ok) {
          result.data.images = imageUrls;
        } else {
          console.error('Failed to save image URLs to database');
        }
      } catch (error) {
        console.error('Failed to upload product images:', error);
      }
    }

    return result.data;
  } catch (error) {
    if (uploadedLogoPath) {
      await deleteUploadedAssets([uploadedLogoPath], 'product-logos');
    }
    throw error;
  }
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

const updateProduct = async (
  productId: string,
  data: ProductFormData & {
    imagesToDelete?: string[];
    removeLogo?: boolean;
  }
): Promise<Product> => {
  let uploadedLogoPath: string | null = null;
  let logoUrl = data.logo_url;

  try {
    if (data.logo_file) {
      const { url, path } = await uploadProductLogo(data.logo_file);
      logoUrl = url;
      uploadedLogoPath = path;
    }

    const { logo_file, image_files, ...productData } = data;

    const result = await updateProductAction(productId, {
      ...productData,
      logo_url: logoUrl,
      logo_file: data.logo_file || undefined,
      image_files: image_files || undefined,
      imagesToDelete: data.imagesToDelete || undefined,
      removeLogo: data.removeLogo || undefined,
    });

    if (!result.success || !result.data) {
      if (uploadedLogoPath) {
        await deleteUploadedAssets([uploadedLogoPath], 'product-logos');
      }
      throw new Error(result.error || 'Failed to update product');
    }

    return result.data;
  } catch (error) {
    if (uploadedLogoPath) {
      await deleteUploadedAssets([uploadedLogoPath], 'product-logos');
    }
    throw error;
  }
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ productId, data }: { productId: string; data: ProductFormData & { imagesToDelete?: string[]; removeLogo?: boolean } }) =>
      updateProduct(productId, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['products'] })
      queryClient.invalidateQueries({ queryKey: ['product', data.id] })
      queryClient.invalidateQueries({ queryKey: ['user-products'] })
    },
    onError: (error: Error) => {
      console.error('Product update failed:', error)
    },
  })
}