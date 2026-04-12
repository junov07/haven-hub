
# Homestay Website — Phase 1: Homepage + Booking System

## Overview
Build a premium, mobile-first homestay website with earthy/nature color palette, Supabase-backed booking system, AI chatbot, and Nepali/English language toggle. React + Vite + Tailwind CSS + TypeScript.

## Design System
- **Colors**: Earthy palette — warm greens, terracotta, cream/beige backgrounds, dark charcoal text
- **Typography**: Inter (body), Plus Jakarta Sans (headings) — clean sans-serif hierarchy
- **Style**: Flat UI, card-based layouts, subtle hover transitions, no heavy shadows
- **Layout**: Mobile-first, sticky navbar, clean footer

## Database Schema (Supabase)
- **rooms** — id, name, type, description, price_per_night, capacity, amenities, images, is_available
- **services** — id, name, type (hall/tent/food), description, price, unit
- **bookings** — id, guest_name, guest_email, guest_phone, room_id, check_in, check_out, services (JSONB for add-ons), total_price, status (pending/confirmed/cancelled), created_at
- **availability** — id, room_id, date, is_available
- **contact_messages** — id, name, phone, message, created_at
- **user_roles** — for admin auth (following secure role pattern)

## Pages & Features

### 1. Homepage
- Hero with full-width image banner, tagline, and "Book Now" CTA
- Service highlights: Rooms, Hall, Food, Tent (card grid)
- Testimonials carousel (hardcoded realistic data)
- Gallery preview (6 images linking to full gallery)
- Contact section with embedded Google Map
- Language toggle (EN/NP) in navbar

### 2. Booking Page (Multi-step form)
- **Step 1**: Select service type (Room / Hall / Tent)
- **Step 2**: Choose dates (calendar picker), room type, or tent quantity
- **Step 3**: Add food services (breakfast/lunch checkboxes)
- **Step 4**: Guest details form (name, phone, email)
- **Step 5**: Booking summary with dynamic price calculation → Submit
- Confirmation page with booking reference
- Real-time availability check against Supabase

### 3. Admin Dashboard (Protected)
- Login page (email/password via Supabase Auth)
- Bookings table — view, approve/reject, filter by status
- Update room availability and pricing
- Manage services (CRUD)

### 4. Gallery Page
- Image grid with category filters (Rooms, Food, Events, Tents)
- Lightbox preview on click

### 5. About Page
- Homestay story, mission, team highlights with realistic sample content

### 6. Contact Page
- Contact form (name, phone, message) → saves to Supabase
- Embedded map + business info

## Additional Features
- **AI Chatbot**: Floating chat widget using Lovable AI for guest queries and booking assistance
- **Language Toggle**: English/Nepali using i18n context provider
- **Payment UI**: Payment section designed with Khalti/eSewa buttons (integration-ready, no live keys yet)
- **Low Bandwidth**: Lazy-loaded images, minimal JS, optimized assets
- **SEO**: Proper meta tags, semantic HTML
- **Loading states & error handling** throughout

## Seed Data
Realistic Nepali homestay content — room names, prices in NPR, Nepali location references, sample testimonials.
