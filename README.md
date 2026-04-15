# Iberieli - Modern Wine Website

A modern B2B wine website built with Next.js, TypeScript, and SCSS modules for Iberieli, a Georgian natural wine producer.

## Overview

This website is designed specifically for B2B wine distribution, targeting importers and distributors worldwide. It showcases Iberieli's collection of authentic Georgian natural wines made using traditional Kvevri methods.

## Features

### Public Website

- **Homepage**: Hero section with featured wines and company overview
- **Wines Catalog**: Complete wine collection organized by categories (red, white, pink, amber)
- **Individual Wine Pages**: Detailed wine specifications including:
  - Tasting notes and food recommendations
  - Climate and terroir information
  - Viticulture and vinification details
  - Traditional Kvevri winemaking process
- **About Page**: Company story, founder information, and business details
- **Contact Page**: Business contact information for orders and inquiries
- **Responsive Design**: Mobile-friendly across all devices

### Admin Panel

- **Simple Authentication**: Password-protected admin access
- **Wine Management**: Edit wine descriptions and tasting notes
- **Minimal Interface**: Limited to essential editing functions only

## Technical Implementation

### Technology Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript
- **Styling**: SCSS Modules
- **Components**: Atomic design (Atoms + Organisms only)
- **Animations**: Framer Motion ready (if needed)
- **Deployment**: Vercel-ready configuration

### Architecture

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── wines/             # Wine catalog and individual wine pages
│   ├── about/             # About page
│   ├── contact/           # Contact page
│   └── admin/             # Admin panel
├── components/
│   ├── atoms/             # Basic UI components (Button, Card)
│   └── organisms/         # Complex components (Header, Footer, WineCard)
├── data/                  # Data types and wine information
├── styles/                # Global SCSS styles
└── utils/                 # Utility functions
```

### Component Patterns

- Function declarations: `export default function ComponentName()`
- SCSS imports: `import style from './Component.module.scss'`
- No Next.js Image component (regular `<img>` tags)
- TypeScript interfaces with `I` prefix (IWine, IContact)

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Environment Setup

The website will run on `http://localhost:3000` in development mode.

## Admin Panel Access

### Login Credentials

- **URL**: `/admin`
- **Password**: `iberieli2024`

### Admin Features

- View all wines with current descriptions
- Edit wine short descriptions (for wine cards)
- Edit detailed tasting notes (for wine detail pages)
- Changes are saved locally (in production, would integrate with database)

**Note**: This is a simple client-side authentication for internal use. For production deployment with external access, implement proper server-side authentication.

## Wine Data Structure

Each wine contains comprehensive information:

- Basic details (name, location, grape varieties)
- Sustainability and certification info
- Detailed tasting notes and food pairings
- Climate and terroir specifications
- Complete vinification process details
- High-quality wine label images

## Content Management

### Adding New Wines

1. Add wine data to `src/data/wines.ts`
2. Add wine label image to `public/photos/Etiquettes/`
3. Follow the existing `IWine` interface structure

### Updating Company Information

- Edit `src/data/company.ts` for contact details and company story
- Update founder information and market listings

## Deployment

### Vercel Deployment

This project is optimized for Vercel hosting:

```bash
# Build and deploy
npm run build
```

The website is configured for:

- Automatic static generation for wine pages
- Optimized image loading
- SEO-friendly meta tags
- Mobile-responsive design

### Production Considerations

- Images are served from `/public/photos/`
- All wine images copied from original website
- Georgian wine authenticity maintained
- B2B focus with distributor contact information

## Design Philosophy

### B2B Focus

- Clean, professional design suitable for wine distributors
- Emphasis on product information over visual flair
- Clear contact information and business details
- International market presence highlighted

### Georgian Wine Heritage

- Traditional Kvevri winemaking emphasis
- Authentic Georgian grape varieties featured
- Regional terroir information included
- Family business story preserved

### Modern Web Standards

- TypeScript for type safety
- SCSS modules for maintainable styling
- Component-based architecture
- SEO optimization
- Performance optimized

## Content Sources

All content and images migrated from the original Iberieli website, including:

- Wine specifications and tasting notes
- Company history and founder information
- Vineyard and winemaking process photos
- Contact and business details
- Georgian wine authenticity and heritage

---

**Contact**: For technical questions about this implementation, refer to the admin panel or website content for wine-related inquiries.
