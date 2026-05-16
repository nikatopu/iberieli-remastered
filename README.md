# Iberieli — Georgian Natural Wine Producer Website

A full-stack B2B website for **Iberieli LLC**, a family-owned Georgian winery producing authentic natural wines using traditional Kvevri methods. Built with Next.js 16 App Router, fully server-rendered for SEO, with a custom admin panel for wine catalogue management.

**Live site:** [iberieli.com](https://iberieli.com)

---

## Tech Stack

| Layer         | Technology                                     |
| ------------- | ---------------------------------------------- |
| Framework     | Next.js 16 (App Router)                        |
| Language      | TypeScript                                     |
| Styling       | SCSS Modules + CSS custom properties           |
| Database      | Neon (serverless PostgreSQL)                   |
| ORM           | Drizzle ORM                                    |
| Image hosting | Cloudinary                                     |
| Auth          | JWT + bcrypt (custom, no third-party provider) |
| Fonts         | Josefin Sans, Montserrat (Google Fonts)        |
| Deployment    | Vercel                                         |

---

## Features

### Public Site

- **Server-rendered pages** — home, wine catalogue, wine detail, about, contact all render on the server for full SEO visibility
- **Dynamic wine catalogue** — wines grouped by category (red, white, amber, pink) fetched directly from Postgres at request time
- **Per-wine detail pages** — full vinification specs, tasting notes, terroir, food pairing
- **SEO** — `metadataBase`, Open Graph and Twitter Card tags on every page, per-wine `generateMetadata`, JSON-LD structured data (Organization, WebSite, Product schemas), dynamic sitemap at `/sitemap.xml`, `robots.txt` blocking admin/API routes

### Admin Panel (`/admin`)

- JWT session auth with bcrypt password hashing
- Dashboard listing all wines (including hidden ones) with visible/hidden status
- **Add wine** — dedicated `/admin/new-wine` form with image upload to Cloudinary
- **Edit wine** — full inline edit form for all fields
- **Visibility toggle** — show/hide wines on the public site without deleting them
- **Delete wine** — confirmation modal before permanent deletion
- All mutations go through a REST API (`/api/admin/wines`) that validates the session token on every request

---

## Project Structure

```
src/
├── app/
│   ├── (public pages)  page.tsx, about/, wines/, contact/
│   ├── admin/          dashboard, new-wine, hooks, components, utils
│   ├── api/
│   │   ├── wines/      GET — public visible wines
│   │   └── admin/      wines CRUD, auth, logout, image upload
│   ├── sitemap.ts
│   └── robots.ts
├── components/
│   ├── atoms/          Button, Card
│   ├── molecules/      (shared composites)
│   └── organisms/      Header, Layout, WineCard
├── contexts/           WineContext (client-side state for admin)
├── data/               types.ts, company.ts (static content)
├── lib/
│   ├── db.ts           Drizzle + Neon connection
│   ├── schema.ts       wines, adminUsers, adminSessions tables
│   └── wineMapping.ts  DB row → IWine for server components
└── styles/             globals.scss, CSS variables
```

---

## Getting Started

### Prerequisites

- Node.js 18+
- A [Neon](https://neon.tech) PostgreSQL database
- A [Cloudinary](https://cloudinary.com) account

### Environment variables

Create a `.env.local` file:

```env
DATABASE_URL=postgresql://...

CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

JWT_SECRET=your-secret-key
```

### Install and run

```bash
npm install

# Push schema to Neon
npx drizzle-kit push

# Start dev server
npm run dev
```

### Database tools

```bash
npm run db:studio   # open Drizzle Studio (visual DB editor)
```

---

## Design

The site targets wine importers and distributors — a B2B audience. The visual direction is intentionally restrained and premium: a dark wine-red (`#722f37`) and gold (`#d4af37`) palette, uppercase tracked labels, no decorative shadows or hover animations on non-interactive elements. Typography uses Josefin Sans for headings and Montserrat for body text.
