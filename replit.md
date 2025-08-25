# Overview

MysticRead AI is a comprehensive web application that uses artificial intelligence to provide personalized mystical insights through three main analysis types:

1. **Palmistry Analysis** - Upload or capture palm photos analyzed by AI to reveal personality traits, relationships, career prospects, health, and future predictions
2. **Astrology Chart Analysis** - Generate detailed astrological readings using birth date, time, and location for comprehensive life insights
3. **Vastu Analysis** - Analyze home and office layouts according to Vastu Shastra principles for optimal energy flow and prosperity

All analyses are powered by OpenAI's GPT-5 model for accurate and detailed insights.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript for type safety and modern development practices
- **UI Framework**: Shadcn/ui components built on Radix UI primitives for consistent, accessible design
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **State Management**: TanStack Query for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Navigation**: Tabbed interface for switching between palmistry, astrology, and Vastu analysis
- **Camera Integration**: Custom camera hook using Web APIs for palm image capture

## Backend Architecture
- **Server Framework**: Express.js with TypeScript running on Node.js
- **API Design**: RESTful endpoints with structured error handling and request logging
- **File Processing**: Multer middleware for handling image uploads with validation
- **AI Integration**: OpenAI GPT-5 API for multi-modal analysis including vision and text processing with structured response validation
- **Data Validation**: Zod schemas for runtime type checking and API response validation for all analysis types

## Data Storage Solutions
- **Development Storage**: In-memory storage using Map data structures for rapid prototyping
- **Production Ready**: Drizzle ORM configured with PostgreSQL schema for persistent data storage
- **Schema Definition**: Shared schema between frontend and backend for type consistency across all analysis types
- **Multi-Analysis Support**: Unified storage system handling palmistry, astrology, and Vastu analysis data

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
- **OpenAI API**: GPT-5 model for comprehensive analysis across palmistry, astrology, and Vastu
- **Vision Analysis**: Advanced image processing for palm reading and Vastu layout analysis
- **Text Analysis**: Sophisticated astrological chart interpretation using birth data
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

# Recent Changes

## August 2025 - Multi-Analysis Platform Launch
- **Expanded Analysis Types**: Added astrology chart analysis and Vastu layout analysis alongside palmistry
- **Enhanced AI Integration**: Upgraded to OpenAI GPT-5 model for improved accuracy across all analysis types
- **Tabbed Interface**: Implemented intuitive tab-based navigation between palmistry, astrology, and Vastu analysis
- **Comprehensive Schemas**: Developed detailed data schemas for all three analysis types with structured results
- **Advanced UI Components**: Created specialized interfaces for each analysis type with appropriate input methods
- **Results Management**: Built separate results components for displaying palmistry, astrology, and Vastu insights
- **Unified Storage**: Extended storage system to handle multiple analysis types with consistent data management
- **Brand Evolution**: Renamed from PalmRead AI to MysticRead AI to reflect expanded capabilities

## Initial Launch
- Initial setup of palmistry web application
- Integration of OpenAI Vision API for palm analysis
- Implementation of camera capture and image upload functionality
- Development of comprehensive UI components using Shadcn/ui
- Setup of backend API endpoints for palm image analysis