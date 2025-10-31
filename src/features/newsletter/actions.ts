'use server'

import { createClient } from '@/utils/supabase/server'
import { newsletterSubscriptionSchema } from './schemas'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { ActionResponse } from '@/utils/types'
import { NewsletterSubscription } from './types'

export async function subscribeToNewsletter(
  data: z.infer<typeof newsletterSubscriptionSchema>
): Promise<ActionResponse<NewsletterSubscription>> {
  try {
    const validatedData = newsletterSubscriptionSchema.parse(data)
    
    const supabase = await createClient()
    
    const { data: { user } } = await supabase.auth.getUser()
    
    const { data: existingSubscription, error: checkError } = await supabase
      .from('newsletter_subscriptions')
      .select('id, is_active')
      .eq('email', validatedData.email)
      .single()
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking subscription:', checkError)
      throw new Error('Failed to check subscription status')
    }
    
    if (existingSubscription) {
      if (existingSubscription.is_active) {
        throw new Error('This email is already subscribed to the newsletter')
      } else {
        const { data: reactivatedSubscription, error } = await supabase
          .from('newsletter_subscriptions')
          .update({
            is_active: true,
            name: validatedData.name,
            user_id: user?.id || null,
            subscribed_at: new Date().toISOString(),
            unsubscribed_at: null,
            updated_at: new Date().toISOString(),
          })
          .eq('id', existingSubscription.id)
          .select()
          .single()
        
        if (error) {
          console.error('Error reactivating subscription:', error)
          throw new Error('Failed to reactivate subscription')
        }
        
        revalidatePath('/newsletter')
        return {
          success: true,
          data: reactivatedSubscription,
          action: 'resubscribed'
        }
      }
    }
    
    const { data: newSubscription, error } = await supabase
      .from('newsletter_subscriptions')
      .insert({
        email: validatedData.email,
        name: validatedData.name,
        user_id: user?.id || null,
      })
      .select()
      .single()
    
    if (error) {
      console.error('Error creating subscription:', error)
      throw new Error('Failed to subscribe to newsletter')
    }
    
    revalidatePath('/newsletter')
    return {
      success: true,
      data: newSubscription,
      action: 'subscribed'
    }
    
  } catch (error) {
    console.error('Subscribe to newsletter error:', error)
    
    if (error instanceof Error) {
      throw error
    }
    
    throw new Error('An unexpected error occurred')
  }
}

