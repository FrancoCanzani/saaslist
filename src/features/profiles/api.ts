import { createClient } from '@/lib/supabase/server'
import { cache } from 'react'
import { Profile } from './types'

export const getProfile = cache(async (userId: string): Promise<Profile | null> => {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) {
    // If profile doesn't exist (PGRST116), return null instead of logging error
    if (error.code === 'PGRST116') {
      return null
    }
    console.error('Error fetching profile:', error)
    return null
  }

  return data
})

export const getCurrentUser = cache(async () => {
  const supabase = await createClient()
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError || !user) {
    return { user: null, profile: null }
  }

  const profile = await getProfile(user.id)
  
  return { user, profile }
})

export async function updateProfile(userId: string, updates: Partial<Omit<Profile, 'id' | 'created_at' | 'updated_at'>>): Promise<Profile | null> {
  const supabase = await createClient()
  
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single()

  if (error) {
    console.error('Error updating profile:', error)
    return null
  }

  return data
}
