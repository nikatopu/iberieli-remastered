# Iberieli Cellar - Setup Guide

## Complete Backend System Setup

Your website now has a complete backend system with database integration, authentication, and wine management capabilities. Here's how to set everything up:

### 1. Environment Configuration

Copy the environment file and configure it:

```bash
cp .env.example .env.local
```

Update `.env.local` with your actual values:

#### Database (Neon PostgreSQL)

1. Create a free account at [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string and update `DATABASE_URL`

#### Cloudinary (Image Uploads)

1. Create a free account at [cloudinary.com](https://cloudinary.com)
2. Get your cloud name, API key, and API secret from the dashboard
3. Update the Cloudinary variables in `.env.local`

#### Security

- Generate a strong JWT secret (minimum 32 characters)
- Set a secure admin password
- Generate a NextAuth secret

### 2. Install Dependencies

```bash
npm install
```

### 3. Database Setup

#### Push Database Schema

```bash
npx drizzle-kit push
```

#### Seed Database with Wine Data

```bash
npm run db:seed
```

This will populate your database with all 14 wines extracted from your old website.

### 4. Create Admin User

Run the application and visit `/admin/setup` to create your first admin user.

### 5. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see your website.

## Frontend Architecture

### Context Provider System

The website uses a comprehensive context provider system for managing wine data across all components:

#### Key Components:

- **ContextProviderWrapper** - Main provider that wraps the entire app
- **WineContext** - Manages wine data, loading states, and API integration
- **useWines** - Direct access to wine context
- **useContextProvider** - Enhanced hook with additional utility functions

#### Usage in Components:

```jsx
"use client";
import { useWines } from "@/contexts/AppContext";

export default function MyComponent() {
  const { wines, loading, error } = useWines();
  // Use wine data in your component
}
```

#### Features:

- Automatic API integration with `/api/wines`
- Loading and error state management
- Wine data caching and real-time updates
- Search and filtering capabilities
- Category-based wine organization
- TypeScript support with full type safety

See `CONTEXT_USAGE.md` for detailed usage examples and best practices.

## API Endpoints

### Public Endpoints

- `GET /api/wines` - Get all wines for public display
- `GET /api/wines/[id]` - Get specific wine details

### Admin Endpoints (Authentication Required)

- `POST /api/admin/auth` - Admin login
- `POST /api/admin/logout` - Admin logout
- `GET /api/admin/wines` - Get all wines (admin view)
- `PUT /api/admin/wines` - Update wine information
- `POST /api/admin/upload` - Upload wine images

### Authentication

- Uses JWT tokens stored in HTTP-only cookies
- Automatic session validation
- Secure password hashing with bcrypt

## Admin Panel Features

### Wine Management

- Update wine descriptions and tasting notes
- Upload and manage wine images
- View all wine data with admin controls
- Real-time updates with database synchronization

### Image Upload System

- Cloudinary integration for image storage
- Automatic image optimization and resizing
- CDN delivery for fast loading
- Support for multiple image formats

### Database Management

- PostgreSQL with Drizzle ORM
- Structured wine data with JSON fields for complex information
- Admin user management
- Session tracking and security

## Database Schema

### Wines Table

- Complete wine information including varieties, regions, tasting notes
- JSON fields for vinification and terroir details
- Image URLs and metadata
- Availability and award information

### Admin Users Table

- Secure user authentication
- Role-based access control
- Password hashing and security

### Admin Sessions Table

- JWT token management
- Session expiry and validation
- Security monitoring

## Wine Data Structure

Each wine includes:

- Basic information (name, variety, vintage, region)
- Detailed tasting notes and descriptions
- Vinification process details
- Terroir information
- Food pairing suggestions
- Awards and availability

All 14 wines from your original website have been extracted and structured:

1. Saperavi (Red)
2. Rkatsiteli (White)
3. Mtsvane (White)
4. Kisi (Amber)
5. Chkhaveri (Red)
6. Chkhaveri Amber
7. Rosé Chkhaveri
8. Pink Rkatsiteli
9. Khikhvi (Amber)
10. Ojaleshi (Red)
11. Kakhetian Mtsvivani (White)
12. Golden Blend (White)
13. Tetri Kamuri Tsolikauri (White)
14. Cecilia (Premium Red Blend)

## Development Tools

### Database Studio

```bash
npm run db:studio
```

Opens Drizzle Studio to view and manage your database.

### Useful Commands

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:seed` - Populate database with wine data

## Production Deployment

1. Set up your production environment variables
2. Run `npm run build` to create production build
3. Deploy to your hosting platform (Vercel, Netlify, etc.)
4. Run database migrations on production
5. Seed production database with wine data

## Security Features

- JWT authentication with HTTP-only cookies
- Password hashing with bcrypt
- CSRF protection
- Session validation and expiry
- Secure file upload with Cloudinary
- Environment variable protection

## Next Steps

1. Complete the environment setup
2. Run the database seeding
3. Create your admin account
4. Test the admin panel functionality
5. Customize the design and content as needed
6. Set up production deployment

Your modern Iberieli Cellar website is now ready with a complete backend system!
