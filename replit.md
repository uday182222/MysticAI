# Overview

PalmRead AI is a web application that uses artificial intelligence to analyze palm images and provide personalized palmistry readings. The app allows users to upload or capture photos of their palms, which are then analyzed by OpenAI's GPT-4 Vision model to generate comprehensive insights about personality traits, relationships, career prospects, health, and future predictions.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Camera Integration**: Custom camera hook using Web APIs for palm image capture

## Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints with structured error handling and request logging
- **File Processing**: Multer middleware for handling image uploads with validation
- **AI Integration**: OpenAI GPT-4 Vision API for palm analysis with structured response validation
- **Data Validation**: Zod schemas for runtime type checking and API response validation

## Data Storage Solutions
- **Development Storage**: In-memory storage using Map data structures for rapid prototyping
- **Production Ready**: Drizzle ORM configured with PostgreSQL schema for persistent data storage
- **Schema Definition**: Shared schema between frontend and backend for type consistency

## Authentication and Authorization
- **Current Implementation**: No authentication system implemented
- **Session Management**: Basic session support configured via connect-pg-simple for future use
- **API Security**: File upload validation and size limits for security

## Build and Development
- **Build System**: Vite for fast development and optimized production builds
- **Development Environment**: Hot module replacement and error overlay for enhanced developer experience
- **TypeScript Configuration**: Strict type checking with path mapping for clean imports
- **Package Management**: NPM with lockfile for dependency consistency

# External Dependencies

## AI and Machine Learning
- **OpenAI API**: GPT-4 Vision model for palm image analysis and interpretation
- **Image Processing**: Base64 encoding for image transmission to AI service

## Database and Storage
- **Neon Database**: Serverless PostgreSQL database provider
- **Drizzle ORM**: Type-safe database operations with migration support
- **Database Migrations**: Automated schema management and versioning

## UI and Design System
- **Radix UI**: Headless, accessible component primitives
- **Shadcn/ui**: Pre-built component library for consistent design
- **Lucide React**: Icon library for modern, consistent iconography
- **Tailwind CSS**: Utility-first CSS framework with custom design tokens

## Development and Build Tools
- **Vite**: Fast build tool with optimized development server
- **TypeScript**: Static type checking and enhanced developer experience
- **ESBuild**: Fast JavaScript bundler for production builds
- **PostCSS**: CSS processing with Tailwind and Autoprefixer plugins

## Third-Party Services
- **Replit Integration**: Development environment optimizations and deployment tools
- **Font Loading**: Google Fonts integration for typography (Architects Daughter, DM Sans, Fira Code, Geist Mono)