# Flash Vitrine - Micro-SaaS MVP

## Overview

Flash Vitrine is a micro-SaaS application that enables users to create and share digital product showcases through unique links. The platform allows users to build professional-looking product galleries that can be easily shared with customers via WhatsApp or other channels.

## User Preferences

Preferred communication style: Simple, everyday language.
Primary brand color: #732472 (purple theme)

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript using Vite as the build tool
- **Routing**: Wouter for client-side routing (lightweight alternative to React Router)
- **Styling**: Tailwind CSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation for type-safe forms

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Design**: RESTful API endpoints under `/api` prefix
- **Middleware**: Custom logging and error handling middleware

### Database Layer
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon serverless)
- **Schema Management**: Drizzle migrations with schema definitions in TypeScript

## Key Components

### Core Entities
1. **Usuarios (Users)**: Basic user management (currently using in-memory storage)
2. **Vitrines (Showcases)**: Digital storefronts with unique slugs and cover images
3. **Produtos (Products)**: Individual products with prices, images, and availability status (max 5 per showcase in free tier)

### API Endpoints
- `POST /api/upload` - Upload images for showcases and products
- `POST /api/vitrines` - Create new showcase
- `GET /api/vitrine/:slug` - Retrieve showcase by unique slug
- `POST /api/produtos` - Add products to showcases with prices
- `DELETE /api/produtos/:id` - Remove products

### Frontend Pages
- **Home**: Landing page with marketing content and CTA
- **Create Vitrine**: Multi-step wizard for showcase creation
- **Vitrine Public**: Public showcase page accessible via slug
- **404**: Not found page

### UI Components
- File upload system with real image processing via multer
- Product management interface with pricing
- Responsive design optimized for mobile sharing
- WhatsApp integration for sharing showcases and product purchases
- Internal checkout system generating WhatsApp purchase links

## Data Flow

1. **Showcase Creation**: Users create showcases with name, description, and cover image (uploaded to server)
2. **Slug Generation**: Automatic slug generation from showcase name for SEO-friendly URLs
3. **Product Management**: Users add up to 5 products with images, descriptions, and prices
4. **Public Access**: Showcases are accessible via `/slug` URLs for public viewing
5. **Purchase System**: Customers click "Comprar" to generate WhatsApp messages with product details
6. **Social Sharing**: Built-in WhatsApp sharing functionality for showcases

## External Dependencies

### Production Dependencies
- **UI Framework**: Extensive Radix UI component collection for accessibility
- **Database**: Neon PostgreSQL serverless database
- **Styling**: Tailwind CSS with custom design tokens
- **Icons**: Lucide React for consistent iconography
- **Date Handling**: date-fns for date manipulation
- **Utilities**: clsx and class-variance-authority for conditional styling

### Development Tools
- **Build Tools**: Vite with React plugin and TypeScript support
- **Database Tools**: Drizzle Kit for migrations and schema management
- **Code Quality**: TypeScript for type safety across the entire stack

## Deployment Strategy

### Build Process
- Frontend builds to `dist/public` directory using Vite
- Backend bundles with esbuild for Node.js production deployment
- Single-command build process combining both frontend and backend

### Environment Configuration
- Database connection via `DATABASE_URL` environment variable
- Development mode detection for conditional plugin loading
- Replit-specific optimizations and error handling

### Storage Architecture
- **Current**: PostgreSQL database via Drizzle ORM (migrated from in-memory)
- **Database**: Neon PostgreSQL serverless with persistent data storage
- **File Uploads**: Local file system storage with real image processing

The application follows a monorepo structure with clear separation between client, server, and shared code, making it easy to scale and maintain as the product grows.