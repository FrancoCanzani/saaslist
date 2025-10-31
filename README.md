# MicroSaaS - Product Hunt for Micro SaaS

A modern platform for discovering and sharing micro SaaS products, built with Next.js and Supabase.

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ or Bun
- A Supabase account ([sign up here](https://supabase.com))

### Setup

1. **Clone and install dependencies:**
   ```bash
   bun install
   ```

2. **Set up Supabase:**
   - Create a new project at [supabase.com](https://supabase.com)
   - Go to Project Settings > API
   - Copy your Project URL and anon/public key

3. **Configure environment variables:**
   ```bash
   cp .env.local.example .env.local
   ```
   
   Then edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Enable Google OAuth in Supabase:**
   - Go to Authentication > Providers in your Supabase dashboard
   - Enable Google provider
   - Add your OAuth credentials:
     - Client ID
     - Client Secret
   - Add authorized redirect URL: `http://localhost:3000/auth/callback`

5. **Run the development server:**
   ```bash
   bun dev
   ```

6. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔐 Authentication

Currently supports:
- ✅ Google Sign In/Up

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── auth/              # Auth callback routes
│   ├── login/             # Login page
│   ├── profile/           # User profile page
│   └── page.tsx           # Home page
├── components/            # React components
├── lib/
│   └── supabase/         # Supabase client utilities
│       ├── client.ts     # Browser client
│       ├── server.ts     # Server client
│       └── middleware.ts # Auth middleware
└── middleware.ts         # Next.js middleware
```

## 🛠️ Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Database & Auth:** Supabase
- **Styling:** Tailwind CSS
- **Language:** TypeScript

## 📝 Development Plan

See [plan.md](./plan.md) for the complete development roadmap.

## 🔒 Environment Variables

Required environment variables:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anon/public key
- `NEXT_PUBLIC_SITE_URL` - Your site URL (for production)

## 📄 License

MIT
