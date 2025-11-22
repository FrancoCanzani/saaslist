import { useQuery } from '@tanstack/react-query'
import { Profile } from './types'
import { ApiResponse } from '@/utils/types'

const fetchProfile = async (id: string): Promise<Profile> => {
  const response = await fetch(`/api/profiles/${id}`)
  const result: ApiResponse<Profile> = await response.json()

  if (!response.ok || !result.success || !result.data) {
    throw new Error(result.error || 'Failed to fetch profile')
  }

  return result.data
}

export const useProfile = (id: string, enabled: boolean = true) => {
  return useQuery({
    queryKey: ['profile', id],
    queryFn: () => fetchProfile(id),
    enabled: !!id && enabled,
  })
}

