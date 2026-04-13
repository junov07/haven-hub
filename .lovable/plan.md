

# Full Dynamic Admin CMS for Himalay Homestay

## Overview
Transform the admin panel into a comprehensive content management system where every piece of website content (hero, about, contact, gallery, services, testimonials, rooms, site settings like logo) is stored in the database and editable from the admin dashboard. The admin remains accessible only via `/admin` URL (no nav link).

## Database Changes

### New table: `site_settings`
Key-value store for site-wide content (logo URL, site name, hero title, hero subtitle, hero image, about text, mission text, contact info, map embed URL, footer tagline, etc.).

| Column | Type | Purpose |
|--------|------|---------|
| id | uuid PK | |
| key | text UNIQUE | e.g. `hero_title`, `logo_url`, `about_story` |
| value | text | The content value |
| updated_at | timestamptz | Last modified |

RLS: Public SELECT, admin-only UPDATE/INSERT/DELETE.

### New table: `gallery_images`
| Column | Type |
|--------|------|
| id | uuid PK |
| url | text |
| alt | text |
| category | text (Rooms/Food/Events/Tents) |
| sort_order | int |
| created_at | timestamptz |

RLS: Public SELECT, admin-only INSERT/UPDATE/DELETE.

### New table: `testimonials`
| Column | Type |
|--------|------|
| id | uuid PK |
| name | text |
| location | text |
| text | text |
| rating | int |
| is_visible | boolean |
| created_at | timestamptz |

RLS: Public SELECT, admin-only INSERT/UPDATE/DELETE.

### Storage bucket: `site-assets`
For uploading logo, hero images, gallery photos, room images. Public bucket with admin-only upload policies.

### Seed `site_settings` with current hardcoded values
Insert all current content (hero title/subtitle, about text, contact details, etc.) as initial rows.

## Admin Dashboard Tabs

Expand the existing admin page with these management sections:

1. **Site Settings** -- Edit logo, site name, hero title/subtitle/CTA text, hero background image (upload)
2. **Rooms** -- CRUD rooms with image upload, pricing, capacity, amenities, availability toggle
3. **Services** -- Edit service name, description, price, availability
4. **Gallery** -- Add/remove images (upload or URL), assign category, reorder
5. **Testimonials** -- Add/edit/remove testimonials, toggle visibility
6. **About Page** -- Edit story text, mission text, highlight stats
7. **Contact Info** -- Edit address, phone, email, map embed URL
8. **Bookings** -- Existing booking management (already built)
9. **Contact Messages** -- View submitted contact form messages

Each section uses inline editing with save buttons and image upload via Supabase Storage.

## Frontend Changes

All public-facing components will fetch content from the database instead of using hardcoded values:

- **HeroSection** -- Fetch hero title, subtitle, CTA text, background image from `site_settings`
- **Navbar** -- Fetch logo URL and site name from `site_settings`
- **Footer** -- Fetch contact info and tagline from `site_settings`
- **ServicesSection** -- Fetch from `services` table (already exists, just needs to read from DB)
- **TestimonialsSection** -- Fetch from `testimonials` table
- **Gallery page** -- Fetch from `gallery_images` table
- **About page** -- Fetch story, mission, highlights from `site_settings`
- **Contact page** -- Fetch address, phone, email, map URL from `site_settings`

A shared hook `useSiteSettings()` will fetch and cache all site settings.

## Technical Details

- **Image uploads**: Use Supabase Storage bucket `site-assets` with admin-only upload policies. Generate public URLs for display.
- **Caching**: Use React Query to cache site settings and avoid redundant fetches.
- **Responsive admin**: All admin forms use responsive grid layouts, work on mobile.
- **No nav link to admin**: Admin stays accessible only via direct `/admin` URL.

## Implementation Order
1. Create database migration (site_settings, gallery_images, testimonials tables + storage bucket + seed data)
2. Build `useSiteSettings` hook and update all public components to be dynamic
3. Build admin sub-pages: Site Settings, Rooms CRUD, Gallery manager, Testimonials manager, About/Contact editors, Contact Messages viewer
4. Add image upload functionality via Storage
5. Test end-to-end

