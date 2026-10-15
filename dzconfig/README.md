# Insight Hub

Create a modern, responsive web application for [اسم التطبيق أو الفكرة].



Key Features & Functional Requirements:

1. Dashboard / Home:

   - High-level overview cards displaying key metrics and stats.

   - Recent activity feed and quick action shortcuts.



2. Navigation & Layout:

   - Clean sidebar navigation with icons for Dashboard, Analytics, Data Views, and Settings.

   - Top navbar with user profile dropdown, notifications icon, and search bar.



3. Data Management & Tables:

   - Interactive data table with global search, column filters, sorting, and pagination.

   - Support for bulk actions and data export (CSV/Excel options).



4. Analytics & Visualizations:

   - Visual charts (Line charts for historical trends, Bar charts for metric comparisons).

   - Dynamic filter controls (Date range selector, status filter, categories).



5. User Management & Auth:

   - Authentication flow (Sign In / Sign Up screens).

   - Profile settings and user preference controls.



UI/UX & Design Guidelines:

- Sleek, modern, and high-performance user interface.

- Dark mode support with a refined dark palette (slate/dark gray) and vibrant accent colors.

- Fully responsive design optimized for mobile, tablet, and desktop viewing.

- Use polished UI components (Shadcn UI style) with smooth tra

nsitions and clean borders.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/45f5b24c-14e4-4704-9579-df15ba322333).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
```

Before starting the app, copy `.env.example` to `.env` and set the Supabase project URL and anon key from your Supabase project settings:

```dotenv
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

Restart the dev server after changing `.env`. Do not commit `.env`.

```sh
npm run dev
```
