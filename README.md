# Gurukul Classes Full Stack Admin + CMS

This workspace now contains:

- the existing public React site in `Gurukul-classes-website`
- a new Express + MySQL backend in `backend`
- a complete admin panel mounted at `/admin`
- MySQL schema and seed exports in `backend/sql`

## Stack

- Frontend: React + Vite
- Admin UI: React inside the existing frontend app
- Backend: Node.js + Express.js
- Database: MySQL
- Uploads: `backend/uploads`
- Auth: JWT + bcrypt

## Project Structure

- `Gurukul-classes-website` - public website + admin panel
- `backend` - REST API, auth, uploads, database bootstrap
- `backend/sql/schema.sql` - schema export
- `backend/sql/seed.sql` - seed export of the migrated frontend content

## Environment

### Backend

Copy `backend/.env.example` to `backend/.env`.

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=root
DB_NAME=gurukul_classes
JWT_SECRET=gurukul_admin_secret
FRONTEND_URL=http://localhost:5173
```

### Frontend

Copy `Gurukul-classes-website/.env.example` to `Gurukul-classes-website/.env`.

```env
VITE_API_BASE_URL=http://localhost:5000
```

## Setup

Make sure MySQL is running locally and the `root` user can connect with password `root`.

```bash
npm install
npm --workspace ./backend run seed
npm run dev
```

`npm run dev` starts:

- backend on `http://localhost:5000`
- frontend on `http://localhost:5173`

## Admin Access

- URL: `http://localhost:5173/admin/login`
- Email: `admin@gurukulclasses.com`
- Password: `admin123`

## Available Features

### Public website

- dynamic home hero section
- dynamic results page
- dynamic gallery page
- dynamic press release page
- dynamic blog listing
- dynamic blog detail page by slug
- fallback to existing frontend data if API/database content is unavailable

### Admin panel

- dashboard summary cards
- recent updates feed
- hero banner CRUD
- result CRUD
- gallery CRUD with multi-image create support
- press release CRUD with image/PDF upload
- blog CRUD with slug and SEO fields
- active/inactive status management
- search and filtering
- delete confirmation dialogs
- responsive mobile layout
- toast messages and loading states

## API Overview

### Auth

- `POST /api/admin/login`
- `GET /api/admin/me`

### Dashboard

- `GET /api/admin/dashboard`

### Hero

- `GET /api/hero`
- `GET /api/admin/hero`
- `POST /api/admin/hero`
- `PUT /api/admin/hero/:id`
- `DELETE /api/admin/hero/:id`

### Results

- `GET /api/results`
- `GET /api/admin/results`
- `POST /api/admin/results`
- `PUT /api/admin/results/:id`
- `DELETE /api/admin/results/:id`

### Gallery

- `GET /api/gallery`
- `GET /api/admin/gallery`
- `POST /api/admin/gallery`
- `PUT /api/admin/gallery/:id`
- `DELETE /api/admin/gallery/:id`

### Press Releases

- `GET /api/press-releases`
- `GET /api/press-releases/:id`
- `GET /api/admin/press-releases`
- `POST /api/admin/press-releases`
- `PUT /api/admin/press-releases/:id`
- `DELETE /api/admin/press-releases/:id`

### Blogs

- `GET /api/blogs`
- `GET /api/blogs/:slug`
- `GET /api/admin/blogs`
- `POST /api/admin/blogs`
- `PUT /api/admin/blogs/:id`
- `DELETE /api/admin/blogs/:id`

## Database Notes

- The backend auto-creates the database and tables on startup when the configured MySQL user has permission.
- `backend/src/data/seedData.js` contains the migrated frontend seed content used by the runtime bootstrap.
- `backend/sql/seed.sql` mirrors that migrated content in SQL form.
- Seed inserts are table-empty safe, so existing content is not deleted.

## Uploads

- Uploaded files are stored in `backend/uploads`
- Seed images are stored in `backend/uploads/seed`
- The backend serves uploads from `http://localhost:5000/uploads/...`

For production, use persistent storage for the `uploads` directory.

## Verification Commands

```bash
npm run build
npm run lint
npm --workspace ./backend run seed
```

## Notes

- The frontend keeps rendering with existing fallback data if API calls fail or the database is empty.
- The admin panel lives inside the same React app, so no existing public routes were removed.
- The backend is designed for local development and can be deployed separately from the Vercel frontend by pointing `VITE_API_BASE_URL` to the production API.
