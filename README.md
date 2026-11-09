# Alzikrayat — MERN Edition

**Student:** Saja Abdalhameed — IT, Semester 7

A full-stack photo sharing app built with React (Vite), Express, Node.js and MongoDB (Mongoose).
Members can register, upload photos, browse a gallery (grid/list), view photo details, comment, and delete their own photos.

## Project structure

```
alzikrayat/
├── server/        Express REST API
│   ├── models/        User.js, Photo.js, Comment.js (Mongoose schemas)
│   ├── routes/        authRoutes.js, photoRoutes.js, commentRoutes.js
│   ├── controllers/   authController.js, photoController.js, commentController.js
│   ├── middleware/    validation.js (Joi), errorHandler.js, requireUser.js, upload.js (Multer)
│   ├── uploads/       stored image files
│   ├── .env           secrets (never committed)
│   └── server.js      Express app entry point
└── client/        React + Vite frontend
    ├── src/components/  Navbar, Footer, PhotoCard, Status
    ├── src/pages/       Home, Gallery, PhotoDetail, AddPhoto, LoginRegister
    ├── src/App.jsx      route configuration (React Router)
    └── vite.config.js   dev proxy to the Express API
```

## Requirements
- Node.js 18+
- A MongoDB database (local instance or MongoDB Atlas)

## Setup and run locally

### 1. Server
```bash
cd server
cp .env.example .env      # then edit .env and fill in the values below
npm install
npm run dev               # runs on http://localhost:5000
```

### 2. Client (in a second terminal)
```bash
cd client
npm install
npm run dev               # runs on http://localhost:5173
```

Open http://localhost:5173. Vite proxies `/api` and `/uploads` to the Express server on port 5000.

## Environment variables (`server/.env`, never committed)

| Variable | Description |
|---|---|
| `MONGODB_URI` | MongoDB connection string (local or Atlas) |
| `PORT` | API port (default `5000`) |
| `JWT_SECRET` | Secret key used to sign login tokens (use a long random string) |

`.env` is listed in `.gitignore`. A template is provided in `server/.env.example`.

## REST API

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | no | Validate with Joi, hash password with bcrypt, create user |
| POST | `/api/auth/login` | no | Compare bcrypt hash, return `{ token, user }` |
| GET | `/api/photos` (`?limit=`) | no | List photos, newest first |
| GET | `/api/photos/:id` | no | Photo details plus its comments |
| POST | `/api/photos` (multipart, field `photoFile`) | yes | Upload a photo (JPG/PNG/GIF, max 5 MB) |
| DELETE | `/api/photos/:id` | yes | Delete a photo — owner only (checked on the server) |
| POST | `/api/photos/:id/comments` | yes | Add a comment |
| PUT | `/api/photos/:id/like` | yes | Like / unlike a photo |
| GET | `/api/stats` | no | Member and photo counts for the home page |

Status codes used: `200`, `201`, `400` (bad upload), `401` (not logged in / wrong credentials), `403` (not the owner), `404`, `409` (email already registered), `422` (validation error), `500`.

## Security notes
- Passwords are hashed with bcrypt and are never stored or returned in plain text.
- Input is validated on the server with Joi.
- Secrets live in `.env`, which is excluded from Git.
- Photo deletion verifies ownership on the server before removing the record and the file.

## Additional features (beyond the Project 3 requirements)
These were added as extras on top of the required features:
- **JWT authentication** — login returns a signed token (valid 1 day) that the client sends in the `Authorization: Bearer` header; `requireUser` middleware protects write routes.
- **Likes** — users can like/unlike photos (`likes` array on the Photo schema).
- **Real-time comments** — new comments are pushed to open photo pages with Socket.io.
- **Dark mode** toggle, and **Copy link / Download** buttons on the photo page.

> Note: the client connects to Socket.io at `http://localhost:5000` (see `client/src/pages/PhotoDetail.jsx`), so change that address if the API is deployed elsewhere.
