# Stripe Integration Setup Guide

## ✅ Implementation Complete

The Stripe integration has been fully implemented. Here's what you need to do to get it working:

## 1. Install Dependencies

```bash
npm install stripe @stripe/stripe-js
```

## 2. Set Up Stripe Account

1. Go to https://stripe.com and create an account
2. Complete business verification
3. Get your API keys from Dashboard → Developers → API keys

## 3. Environment Variables

Add these to your `.env.local` file:

```env
# Stripe Keys (use test keys for development)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...  # Get this after setting up webhook

# Your site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 4. Database Migration

Run the SQL migration in Supabase:

1. Go to Supabase Dashboard → SQL Editor
2. Copy and paste the contents of `supabase-subscriptions-migration.sql`
3. Execute the migration

## 5. Set Up Stripe Webhook

### For Local Development:

1. Install Stripe CLI: https://stripe.com/docs/stripe-cli
2. Login: `stripe login`
3. Forward webhooks to your local server:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```
4. Copy the webhook signing secret (starts with `whsec_`) and add it to `.env.local`

### For Production:

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.created`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `payment_intent.succeeded`
5. Copy the webhook signing secret and add it to your production environment variables

## 6. Create Stripe Products (Optional)

You can create products in Stripe Dashboard, but the checkout API creates them dynamically. If you want to use pre-created products:

1. Go to Stripe Dashboard → Products
2. Create products:
   - Daily Boost: $5.00 (one-time)
   - Growth Plan: $19.00/month (recurring)
   - Lifetime: $999.00 (one-time)

## 7. Test the Integration

### Test Cards (Test Mode Only):

- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

Use any future expiry date, any CVC, any ZIP code.

### Test Flow:

1. Go to `/advertise` page
2. Select a product (if you have multiple)
3. Choose a plan and click "Get started"
4. Complete checkout with test card
5. Check `/profile` to see subscription
6. Test cancellation

## Features Implemented

✅ **Checkout Flow**
- Product selection
- Plan selection (Daily/Monthly/Lifetime)
- Date range selection for daily plans
- Stripe Checkout Session creation

✅ **Webhook Handling**
- `checkout.session.completed` - Activates subscription
- `customer.subscription.created/updated` - Updates subscription status
- `customer.subscription.deleted` - Cancels subscription
- `payment_intent.succeeded` - Confirms one-time payments

✅ **Subscription Management**
- View active subscriptions on profile page
- View subscription history
- Cancel subscriptions (with Stripe API integration)
- Automatic featured status sync

✅ **Database Integration**
- Automatic profile featured status updates
- Automatic product featured status sync
- Subscription tracking

## Pricing

- **Daily Boost**: $5/day (custom date range)
- **Growth Plan**: $19/month (recurring)
- **Lifetime**: $999 (one-time)

## Important Notes

1. **Test Mode**: Always use test keys (`pk_test_...`, `sk_test_...`) during development
2. **Webhooks**: Required for reliable payment confirmation - don't skip this step
3. **Featured Status**: Automatically synced from profile to all products via database triggers
4. **Cancellation**: Monthly subscriptions are cancelled in Stripe, then database is updated

## Troubleshooting

### Webhook not receiving events?
- Check webhook endpoint URL is correct
- Verify webhook secret is set correctly
- Check Stripe Dashboard → Webhooks for delivery logs

### Subscription not activating?
- Check webhook is receiving `checkout.session.completed` event
- Verify database triggers are working
- Check server logs for errors

### Checkout not working?
- Verify Stripe keys are set correctly
- Check browser console for errors
- Verify user is authenticated

## Next Steps

1. Test thoroughly with Stripe test cards
2. Set up production webhook endpoint
3. Switch to live keys when ready
4. Monitor Stripe Dashboard for payments
5. Set up email notifications (optional)

