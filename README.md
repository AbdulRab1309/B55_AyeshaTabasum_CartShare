# CartShare - Collaborative Shopping Cart

**CartShare** is a React shopping cart collaboration app. It supports a frontend UI and a minimal Express backend for room persistence.

This project uses **React**, **Vite**, **Tailwind CSS**, and a small **Express** backend storing room data in `server/db.json`.

---

Key Features

1. **User Room Access**: Enter a username to create a new room or join an existing room using a 6-character code.
2. **Backend Room Persistence**: Room state is saved to a backend API instead of only localStorage.
3. **Shared Shopping Cart**: Add, edit, delete, and search items with quantity and price.
4. **Live Activity Log**: Tracks user actions with timestamps.
5. **Participant Avatars**: Displays user initials and deterministic color-coded avatars.
6. **Printable Receipt**: Generates a print-ready receipt modal.
7. **Dark Mode**: Theme preference persists across reloads.
8. **Responsive Layout**: Works on mobile and desktop.

---

Project Structure

```text
cartshare/
├── server/
│   ├── db.json            # JSON file used by the Express backend
│   ├── index.js           # Express backend routes and persistence logic
│   └── package.json       # Server dependencies and start script
├── src/
│   ├── components/
│   │   ├── ActivityLog.jsx
│   │   ├── Cart.jsx
│   │   ├── Navbar.jsx
│   │   ├── Participants.jsx
│   │   └── Receipt.jsx
│   ├── pages/
│   │   ├── Dashboard.jsx
│   │   └── Home.jsx
│   ├── utils/
│   │   ├── api.js
│   │   ├── backendStorageUtils.js
│   │   └── roomUtils.js
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   └── vite-env.d.ts
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
└── vite.config.js
```

---

Installation and Running

This project contains both frontend and backend components.

### 1. Install frontend dependencies

```bash
cd c:/Users/abdul/Downloads/ayesha_project/B55_AyeshaTabasum_CartShare
npm install
```

### 2. Install backend dependencies

```bash
cd server
npm install
```

### 3. Start the backend server

```bash
npm start
```

The backend runs on `http://localhost:4000` by default.

### 4. Start the frontend app

In another terminal:

```bash
cd c:/Users/abdul/Downloads/ayesha_project/B55_AyeshaTabasum_CartShare
npm run dev
```

Open the printed Vite URL (usually `http://localhost:5173`).

### 5. Production build

```bash
npm run build
```

---

## ⚙️ Backend Behavior

- The backend exposes a minimal REST API at `/api/rooms`.
- Room state is persisted in `server/db.json`.
- Available endpoints:
  - `POST /api/rooms` to create a room
  - `GET /api/rooms/:roomCode` to fetch room data
  - `PUT /api/rooms/:roomCode` to update room data
  - `DELETE /api/rooms/:roomCode` to delete a room

---

## 🧠 How the App Works
How It Works (Technical Explanations)

### Room persistence
- `src/utils/backendStorageUtils.js` now communicates with the backend API.
- The frontend still stores user session information in `localStorage`.

### Room creation
- Creating a room sends a backend request to save the initial room structure.
- After creation, the session is saved locally and the user is redirected to the room.

### Joining a room
- The app validates room existence through the backend before joining.
- If the room exists, the user is allowed into the dashboard.

### Dashboard updates
- Cart updates and activity log entries are saved through backend PUT requests.
- This keeps room state persistent across browser sessions.

---

## 🎯 Notes
Viva Q&A (Project Defence Prep)

- This backend is intentionally minimal and file-based for easy local demo use.
- It is suitable for local testing and demo purposes, not production.
- For production, replace `server/db.json` with a proper database such as PostgreSQL or MongoDB.

---

## 💡 Useful Commands

```bash
# frontend
npm run dev
npm run build

# backend
cd server
npm start
```
