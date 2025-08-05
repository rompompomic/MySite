# Overview

This is a minimalist portfolio landing page built for John Wayne, featuring a clean design with an integrated admin panel and Telegram integration. The application is designed for deployment on Netlify with a PostgreSQL database backend. The portfolio includes sections for personal information, video showcase, work portfolio, services, and contact forms, all manageable through a password-protected admin interface.

**Project Status**: Ready for deployment with comprehensive README.md documentation and Netlify configuration.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Styling**: Tailwind CSS for utility-first styling with custom Montserrat font integration
- **Routing**: Wouter for lightweight client-side routing between home and admin pages
- **State Management**: TanStack Query (React Query) for server state management and API data caching
- **UI Components**: Shadcn/ui component library built on Radix UI primitives for accessible, customizable components
- **Animations**: Framer Motion for smooth page transitions and interactions

## Backend Architecture
- **Runtime**: Node.js with Express.js for API server
- **Database ORM**: Drizzle ORM for type-safe database operations
- **API Design**: RESTful API with separate public and admin endpoints
- **Authentication**: Simple password-based admin authentication using environment variables
- **Build System**: Vite for frontend bundling and development server

## Database Schema
The application uses PostgreSQL with the following main entities:
- **Profile**: Stores personal information (firstName, lastName, description)
- **Portfolio Items**: Work showcase with title, description, images, and ordering
- **Services**: Service offerings with pricing, target audience, and work format details
- **Settings**: Key-value store for configurable elements like background video URL
- **Contacts**: Social media and contact information (Telegram, GitHub)

## Content Management
- **Admin Panel**: Protected interface for content management without requiring a full CMS
- **File Management**: Image URLs stored as text references (external hosting expected)
- **Video Management**: Background video configurable via URL through admin settings
- **Ordering System**: Portfolio items and services include order fields for custom arrangement

## Deployment & Documentation
- **README.md**: Comprehensive deployment guide with step-by-step Netlify setup instructions
- **Database Setup**: Multiple external PostgreSQL options (Neon, Supabase, Railway) with SQL initialization scripts
- **Environment Variables**: Clear documentation for all required secrets and configuration
- **Troubleshooting**: Common deployment issues and solutions documented

## Responsive Design
- **Mobile-First**: Tailwind CSS breakpoints ensure mobile compatibility
- **Navigation**: Collapsible mobile menu with smooth scrolling between sections
- **Typography**: Consistent font sizing system (50px, 30px, 24px, 16px, 15px) using Montserrat
- **Layout**: Full-screen hero sections with containerized content areas

# External Dependencies

## Database Services
- **Neon PostgreSQL**: Serverless PostgreSQL database for production deployment
- **Database Driver**: @neondatabase/serverless for connection pooling and serverless compatibility

## Communication Services
- **Telegram Bot API**: For sending contact form submissions to specified chat
- **Environment Variables**: BOT_TOKEN and TELEGRAM_CHAT_ID for Telegram integration

## Development Tools
- **Netlify**: Target deployment platform with environment variable support
- **Vite**: Build tool with hot module replacement for development
- **TypeScript**: Static type checking across the entire application stack

## UI Dependencies
- **Radix UI**: Headless UI components for accessibility and keyboard navigation
- **Lucide React**: Icon library for consistent iconography
- **React Hook Form**: Form validation and management with Zod schema validation
- **Date-fns**: Date manipulation and formatting utilities

## Authentication & Security
- **Password Protection**: Admin routes protected by environment variable password
- **CORS Configuration**: Properly configured for Netlify deployment
- **Input Validation**: Zod schemas for API request/response validation