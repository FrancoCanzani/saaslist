export interface TechItem {
  name: string;
  icon: string; // Simple Icons slug
  color: string; // Brand color
}

export interface TechCategory {
  name: string;
  items: TechItem[];
}

export const techStackCategories: TechCategory[] = [
  {
    name: "Frontend Frameworks",
    items: [
      { name: "React", icon: "react", color: "#61DAFB" },
      { name: "Next.js", icon: "nextdotjs", color: "#000000" },
      { name: "Vue", icon: "vuedotjs", color: "#4FC08D" },
      { name: "Nuxt", icon: "nuxtdotjs", color: "#00DC82" },
      { name: "Svelte", icon: "svelte", color: "#FF3E00" },
      { name: "SvelteKit", icon: "svelte", color: "#FF3E00" },
      { name: "Angular", icon: "angular", color: "#DD0031" },
      { name: "SolidJS", icon: "solid", color: "#2C4F7C" },
      { name: "Qwik", icon: "qwik", color: "#AC7EF4" },
      { name: "Remix", icon: "remix", color: "#000000" },
      { name: "Astro", icon: "astro", color: "#FF5D01" },
    ],
  },
  {
    name: "UI Libraries",
    items: [
      { name: "shadcn/ui", icon: "shadcnui", color: "#000000" },
      { name: "Radix UI", icon: "radixui", color: "#161618" },
      { name: "Chakra UI", icon: "chakraui", color: "#319795" },
      { name: "Mantine", icon: "mantine", color: "#339AF0" },
      { name: "Material UI", icon: "mui", color: "#007FFF" },
      { name: "Ant Design", icon: "antdesign", color: "#0170FE" },
      { name: "DaisyUI", icon: "daisyui", color: "#5A0EF8" },
      { name: "Headless UI", icon: "headlessui", color: "#66E3FF" },
      { name: "Bootstrap", icon: "bootstrap", color: "#7952B3" },
    ],
  },
  {
    name: "Styling / CSS",
    items: [
      { name: "Tailwind CSS", icon: "tailwindcss", color: "#06B6D4" },
      { name: "Styled Components", icon: "styledcomponents", color: "#DB7093" },
      { name: "Emotion", icon: "emotion", color: "#D36AC2" },
      { name: "PostCSS", icon: "postcss", color: "#DD3A0A" },
      { name: "Sass", icon: "sass", color: "#CC6699" },
      { name: "CSS Modules", icon: "cssmodules", color: "#000000" },
      { name: "UnoCSS", icon: "unocss", color: "#333333" },
    ],
  },
  {
    name: "Backend Frameworks",
    items: [
      { name: "Node.js", icon: "nodedotjs", color: "#339933" },
      { name: "Express", icon: "express", color: "#000000" },
      { name: "Fastify", icon: "fastify", color: "#000000" },
      { name: "NestJS", icon: "nestjs", color: "#E0234E" },
      { name: "Hono", icon: "hono", color: "#E36002" },
      { name: "tRPC", icon: "trpc", color: "#2596BE" },
      { name: "Django", icon: "django", color: "#092E20" },
      { name: "Flask", icon: "flask", color: "#000000" },
      { name: "FastAPI", icon: "fastapi", color: "#009688" },
      { name: "Laravel", icon: "laravel", color: "#FF2D20" },
      { name: "WordPress", icon: "wordpress", color: "#21759B" },
      { name: "Ruby on Rails", icon: "rubyonrails", color: "#CC0000" },
      { name: "Spring Boot", icon: "springboot", color: "#6DB33F" },
      { name: "Go", icon: "go", color: "#00ADD8" },
      { name: "Fiber", icon: "go", color: "#00ADD8" },
      { name: "Gin", icon: "go", color: "#00ADD8" },
      { name: "Rust", icon: "rust", color: "#000000" },
      { name: "Elixir", icon: "elixir", color: "#4B275F" },
      { name: "Phoenix", icon: "phoenixframework", color: "#FD4F00" },
    ],
  },
  {
    name: "Build Tools",
    items: [
      { name: "Vite", icon: "vite", color: "#646CFF" },
      { name: "Webpack", icon: "webpack", color: "#8DD6F9" },
      { name: "Turbopack", icon: "turbopack", color: "#000000" },
      { name: "esbuild", icon: "esbuild", color: "#FFCF00" },
      { name: "Rollup", icon: "rollupdotjs", color: "#EC4A3F" },
      { name: "SWC", icon: "swc", color: "#F8C457" },
      { name: "Babel", icon: "babel", color: "#F9DC3E" },
      { name: "Nx", icon: "nx", color: "#143055" },
      { name: "Turborepo", icon: "turborepo", color: "#EF4444" },
    ],
  },
  {
    name: "Databases",
    items: [
      { name: "PostgreSQL", icon: "postgresql", color: "#4169E1" },
      { name: "MySQL", icon: "mysql", color: "#4479A1" },
      { name: "SQLite", icon: "sqlite", color: "#003B57" },
      { name: "MongoDB", icon: "mongodb", color: "#47A248" },
      { name: "Redis", icon: "redis", color: "#DC382D" },
      { name: "Cassandra", icon: "apachecassandra", color: "#1287B1" },
      { name: "DynamoDB", icon: "amazondynamodb", color: "#4053D6" },
      { name: "SurrealDB", icon: "surrealdb", color: "#FF00A0" },
      { name: "Neon", icon: "neon", color: "#00E599" },
      { name: "PlanetScale", icon: "planetscale", color: "#000000" },
      { name: "Turso", icon: "turso", color: "#4FF8D2" },
      { name: "Upstash", icon: "upstash", color: "#00E9A3" },
    ],
  },
  {
    name: "ORMs / Database Tools",
    items: [
      { name: "Prisma", icon: "prisma", color: "#2D3748" },
      { name: "Drizzle", icon: "drizzle", color: "#C5F74F" },
      { name: "TypeORM", icon: "typeorm", color: "#FE0803" },
      { name: "Sequelize", icon: "sequelize", color: "#52B0E7" },
      { name: "Knex", icon: "knexdotjs", color: "#D26B38" },
      { name: "Mongoose", icon: "mongoose", color: "#880000" },
    ],
  },
  {
    name: "BaaS & Platforms",
    items: [
      { name: "Supabase", icon: "supabase", color: "#3FCF8E" },
      { name: "Firebase", icon: "firebase", color: "#FFCA28" },
      { name: "Appwrite", icon: "appwrite", color: "#FD366E" },
      { name: "PocketBase", icon: "pocketbase", color: "#B8DBE4" },
      { name: "Convex", icon: "convex", color: "#EE342F" },
      { name: "MongoDB Atlas", icon: "mongodb", color: "#47A248" },
    ],
  },
  {
    name: "Cloud & Hosting",
    items: [
      { name: "Vercel", icon: "vercel", color: "#000000" },
      { name: "Netlify", icon: "netlify", color: "#00C7B7" },
      { name: "Cloudflare Workers", icon: "cloudflareworkers", color: "#F38020" },
      { name: "Cloudflare Pages", icon: "cloudflarepages", color: "#F38020" },
      { name: "AWS", icon: "amazonwebservices", color: "#232F3E" },
      { name: "Google Cloud", icon: "googlecloud", color: "#4285F4" },
      { name: "Azure", icon: "microsoftazure", color: "#0078D4" },
      { name: "Fly.io", icon: "flydotio", color: "#7B3BE2" },
      { name: "Railway", icon: "railway", color: "#0B0D0E" },
      { name: "Render", icon: "render", color: "#46E3B7" },
      { name: "Heroku", icon: "heroku", color: "#430098" },
      { name: "DigitalOcean", icon: "digitalocean", color: "#0080FF" },
      { name: "Deno Deploy", icon: "deno", color: "#000000" },
    ],
  },
  {
    name: "Authentication",
    items: [
      { name: "Auth.js", icon: "auth0", color: "#EB5424" },
      { name: "NextAuth", icon: "nextdotjs", color: "#000000" },
      { name: "Clerk", icon: "clerk", color: "#6C47FF" },
      { name: "Supabase Auth", icon: "supabase", color: "#3FCF8E" },
      { name: "Firebase Auth", icon: "firebase", color: "#FFCA28" },
      { name: "Auth0", icon: "auth0", color: "#EB5424" },
      { name: "Stytch", icon: "stytch", color: "#19303D" },
      { name: "Lucia", icon: "lucia", color: "#5F57FF" },
      { name: "Passport.js", icon: "passport", color: "#34E27A" },
      { name: "Keycloak", icon: "keycloak", color: "#4D4D4D" },
    ],
  },
  {
    name: "APIs & Developer Tools",
    items: [
      { name: "GraphQL", icon: "graphql", color: "#E10098" },
      { name: "Apollo", icon: "apollographql", color: "#311C87" },
      { name: "REST", icon: "openapiinitiative", color: "#6BA539" },
      { name: "gRPC", icon: "grpc", color: "#244C5A" },
      { name: "Socket.io", icon: "socketdotio", color: "#010101" },
      { name: "Pusher", icon: "pusher", color: "#300D4F" },
      { name: "Ably", icon: "ably", color: "#FF5416" },
      { name: "Liveblocks", icon: "liveblocks", color: "#0E0D0C" },
    ],
  },
  {
    name: "AI & ML",
    items: [
      { name: "OpenAI", icon: "openai", color: "#412991" },
      { name: "Anthropic", icon: "anthropic", color: "#191919" },
      { name: "Hugging Face", icon: "huggingface", color: "#FFD21E" },
      { name: "Replicate", icon: "replicate", color: "#000000" },
      { name: "LangChain", icon: "langchain", color: "#1C3C3C" },
      { name: "Vercel AI SDK", icon: "vercel", color: "#000000" },
      { name: "Pinecone", icon: "pinecone", color: "#000000" },
      { name: "Weaviate", icon: "weaviate", color: "#00DB8B" },
      { name: "Chroma", icon: "chroma", color: "#000000" },
      { name: "TensorFlow", icon: "tensorflow", color: "#FF6F00" },
      { name: "PyTorch", icon: "pytorch", color: "#EE4C2C" },
    ],
  },
  {
    name: "State Management",
    items: [
      { name: "Redux", icon: "redux", color: "#764ABC" },
      { name: "Zustand", icon: "zustand", color: "#443E38" },
      { name: "Jotai", icon: "jotai", color: "#000000" },
      { name: "MobX", icon: "mobx", color: "#FF9955" },
      { name: "XState", icon: "xstate", color: "#2C3E50" },
      { name: "TanStack Query", icon: "reactquery", color: "#FF4154" },
      { name: "SWR", icon: "swr", color: "#000000" },
    ],
  },
  {
    name: "Analytics & Monitoring",
    items: [
      { name: "PostHog", icon: "posthog", color: "#1D4AFF" },
      { name: "Google Analytics", icon: "googleanalytics", color: "#E37400" },
      { name: "Plausible", icon: "plausibleanalytics", color: "#5850EC" },
      { name: "LogRocket", icon: "logrocket", color: "#764ABC" },
      { name: "Sentry", icon: "sentry", color: "#362D59" },
      { name: "Datadog", icon: "datadog", color: "#632CA6" },
      { name: "Grafana", icon: "grafana", color: "#F46800" },
      { name: "Hotjar", icon: "hotjar", color: "#FF3C00" },
      { name: "Mixpanel", icon: "mixpanel", color: "#7856FF" },
      { name: "Amplitude", icon: "amplitude", color: "#00BFFF" },
    ],
  },
  {
    name: "Email & Notifications",
    items: [
      { name: "Resend", icon: "resend", color: "#000000" },
      { name: "SendGrid", icon: "sendgrid", color: "#1A82E2" },
      { name: "Mailgun", icon: "mailgun", color: "#F06B66" },
      { name: "Postmark", icon: "postmark", color: "#FFDE00" },
      { name: "AWS SES", icon: "amazonsimpleemailservice", color: "#DD344C" },
      { name: "Twilio", icon: "twilio", color: "#F22F46" },
      { name: "OneSignal", icon: "onesignal", color: "#E54B4D" },
    ],
  },
  {
    name: "Payments",
    items: [
      { name: "Stripe", icon: "stripe", color: "#635BFF" },
      { name: "LemonSqueezy", icon: "lemonsqueezy", color: "#FFC233" },
      { name: "Paddle", icon: "paddle", color: "#FFCC00" },
      { name: "PayPal", icon: "paypal", color: "#003087" },
    ],
  },
  {
    name: "Testing",
    items: [
      { name: "Jest", icon: "jest", color: "#C21325" },
      { name: "Vitest", icon: "vitest", color: "#6E9F18" },
      { name: "Cypress", icon: "cypress", color: "#17202C" },
      { name: "Playwright", icon: "playwright", color: "#2EAD33" },
      { name: "Testing Library", icon: "testinglibrary", color: "#E33332" },
      { name: "Mocha", icon: "mocha", color: "#8D6748" },
      { name: "PyTest", icon: "pytest", color: "#0A9EDC" },
    ],
  },
  {
    name: "Documentation",
    items: [
      { name: "Storybook", icon: "storybook", color: "#FF4785" },
      { name: "Docusaurus", icon: "docusaurus", color: "#3ECC5F" },
      { name: "Mintlify", icon: "mintlify", color: "#0D9373" },
      { name: "GitBook", icon: "gitbook", color: "#3884FF" },
    ],
  },
  {
    name: "DevOps & Tooling",
    items: [
      { name: "Docker", icon: "docker", color: "#2496ED" },
      { name: "Kubernetes", icon: "kubernetes", color: "#326CE5" },
      { name: "GitHub Actions", icon: "githubactions", color: "#2088FF" },
      { name: "Terraform", icon: "terraform", color: "#7B42BC" },
      { name: "Bun", icon: "bun", color: "#000000" },
      { name: "pnpm", icon: "pnpm", color: "#F69220" },
      { name: "npm", icon: "npm", color: "#CB3837" },
      { name: "Yarn", icon: "yarn", color: "#2C8EBB" },
    ],
  },
  {
    name: "No-Code / Low-Code",
    items: [
      { name: "Webflow", icon: "webflow", color: "#4353FF" },
      { name: "Framer", icon: "framer", color: "#0055FF" },
      { name: "Bubble", icon: "bubble", color: "#0D0D0D" },
      { name: "Retool", icon: "retool", color: "#3D3D3D" },
      { name: "Zapier", icon: "zapier", color: "#FF4A00" },
      { name: "n8n", icon: "n8n", color: "#EA4B71" },
      { name: "Make", icon: "make", color: "#6D00CC" },
    ],
  },
  {
    name: "Mobile",
    items: [
      { name: "React Native", icon: "react", color: "#61DAFB" },
      { name: "Expo", icon: "expo", color: "#000020" },
      { name: "Flutter", icon: "flutter", color: "#02569B" },
      { name: "Swift", icon: "swift", color: "#F05138" },
      { name: "Kotlin", icon: "kotlin", color: "#7F52FF" },
      { name: "Capacitor", icon: "capacitor", color: "#119EFF" },
      { name: "Ionic", icon: "ionic", color: "#3880FF" },
    ],
  },
  {
    name: "Languages",
    items: [
      { name: "TypeScript", icon: "typescript", color: "#3178C6" },
      { name: "JavaScript", icon: "javascript", color: "#F7DF1E" },
      { name: "Python", icon: "python", color: "#3776AB" },
      { name: "Java", icon: "java", color: "#007396" },
      { name: "PHP", icon: "php", color: "#777BB4" },
      { name: "Ruby", icon: "ruby", color: "#CC342D" },
      { name: "C#", icon: "csharp", color: "#239120" },
      { name: ".NET", icon: "dotnet", color: "#512BD4" },
    ],
  },
];

// Flatten for easy lookup
export const allTechItems = techStackCategories.flatMap((cat) => cat.items);

export const getTechItem = (name: string): TechItem | undefined => {
  return allTechItems.find(
    (item) => item.name.toLowerCase() === name.toLowerCase()
  );
};

export const techStackOptions = allTechItems.map((item) => item.name);

