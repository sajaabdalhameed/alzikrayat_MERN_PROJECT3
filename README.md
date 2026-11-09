#Name : Saja abdalhameed _ IT _semster 7

# Alzikrayat — MERN Edition

Full-stack photo sharing app: React (Vite) + Express + MongoDB (Mongoose).

## Structure
- `server/` — Express REST API (models, routes, controllers, middleware, uploads)
- `client/` — React + Vite frontend (components, pages, React Router)

## Setup
1. Install MongoDB locally (or use MongoDB Atlas).
2. Server:
   ```
   cd server
   cp .env.example .env     # set MONGODB_URI and PORT
   npm install
   npm run dev
   ```
3. Client (in a second terminal):
   ```
   cd client
   npm install
   npm run dev
   ```
4. Open http://localhost:5173 (Vite proxies `/api` and `/uploads` to the Express server on port 5000).

## Environment variables (`server/.env`, never committed)
- `MONGODB_URI` — MongoDB connection string
- `PORT` — API port (default 5000)

## REST API
| Method | Route | Auth |
|---|---|---|
| POST | /api/auth/register | no |
| POST | /api/auth/login | no |
| GET | /api/photos (`?limit=`) | no |
| GET | /api/photos/:id | no |
| POST | /api/photos (multipart, field `photoFile`) | yes |
| DELETE | /api/photos/:id (owner only) | yes |
| POST | /api/photos/:id/comments | yes |
| GET | /api/stats | no |

## Features & Bonus Implementations
- Full MERN Stack (React, Express, Node, MongoDB).
- **JWT Authentication:** Secure login and register using JSON Web Tokens.
- **Likes System:** Users can like/unlike photos.
- **Real-time Comments:** Live comment updates using Socket.io.
- **Responsive UI:** Mobile-friendly design with Dark Mode toggle, and Copy/Download photo features.

## Authentication note
Per Project 3, only basic auth is implemented: passwords are hashed with bcrypt, the client keeps the logged-in
user in React state/localStorage and sends the user id in an `x-user-id` header, which the server verifies.
This is intentionally simpler than JWT (an optional Project 4 feature) and is not production-grade security.
