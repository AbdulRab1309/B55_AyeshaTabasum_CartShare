# CartShare - Collaborative Shopping Cart

**CartShare** is a fully frontend, collaborative shopping cart application designed for modern web applications. It allows multiple users to join a shared room via a unique code and manage a shopping cart together. 

This project is built using **React (JavaScript / JSX)**, **HTML5**, **CSS3**, and **Tailwind CSS**. It is designed to be a lightweight, simple, and self-contained frontend application, making it ideal for internship submissions, student project showcases, and vivas.

---

Key Features

1. **User Room Access**: Enter a username and instantly create a new room (generates a unique 6-character room code) or join an existing room.
2. **Real-Time Tab Sync (Backendless Collaboration)**: Simulates real-time multiplayer updates using HTML5 `storage` events. Edits in one tab immediately synchronize to other open tabs running the same room.
3. **Dynamic Shared Cart**: Add items with custom names, quantities, and prices. Edit or delete items, and search through items instantly.
4. **Live Activity Log**: Records and displays recent actions (e.g., *"Ayesha added Milk"*, *"Rahul updated quantity of Apples"*) with automatic timestamps.
5. **Participant Avatars**: Dynamic user listing that represents participants using initial-based avatars with deterministic background colors.
6. **Printable Receipts**: Generates a clean receipt invoice layout with print-optimized styles (`@media print`) and triggers the browser's PDF export/print dialog.
7. **Dark Mode Toggle**: Toggle between crisp light and dark slate UI themes, persisted in localStorage.
8. **Responsive Grid Design**: Responsive layout that scales from mobile phones to full desktop displays using Flexbox and Grid.

---

Project Structure

```text
cartshare/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx        # Navigation, room code, theme toggler, and leave action
│   │   ├── Cart.jsx          # Shopping list table, forms, search, and totals
│   │   ├── ActivityLog.jsx   # Live chronological event timeline feed
│   │   ├── Participants.jsx  # Active room participants with colorized initials avatars
│   │   └── Receipt.jsx       # Printable modal overlay summary
│   ├── pages/
│   │   ├── Home.jsx          # Landing screen for onboarding and room joining
│   │   └── Dashboard.jsx     # Active workspace coordinator & storage event listener
│   ├── utils/
│   │   ├── roomUtils.js      # Unique code generator and avatar initials helpers
│   │   └── storageUtils.js   # LocalStorage CRUD wrappers for rooms and sessions
│   ├── App.jsx               # Root router, dark mode manager, and session restorer
│   ├── main.jsx              # DOM react mount bootstrap
│   └── index.css             # Tailwind imports & custom print styles
├── index.html                # Entry HTML page
├── tailwind.config.js        # Tailwind utilities scan rules
├── postcss.config.js         # PostCSS plugins pipeline
├── vite.config.js            # Vite build parameters
└── package.json              # Project dependencies and running scripts
```

---

Installation and Running

Follow these steps to run the application locally on your machine:

1. **Navigate to the Project Directory**:
   ```bash
   cd C:/Users/Home/.gemini/antigravity/scratch/cartshare
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Start the Local Development Server**:
   ```bash
   npm run dev
   ```
   Open your browser and navigate to the printed URL (usually `http://localhost:5173`).
4. **Compile for Production Build**:
   ```bash
   npm run build
   ```

---

How It Works (Technical Explanations)

### 1. Room Code Generation
The unique room code is generated using basic JavaScript random math:
- It creates a random 6-character uppercase string using capital alphanumeric characters (`A-Z` and `0-9`).
- Refer to [roomUtils.js](src/utils/roomUtils.js) for code details.

### 2. localStorage Implementation
Data is serialized into JSON strings and stored in the browser's persistent key-value storage:
- **Room Key**: `cartshare_room_<ROOM_CODE>` contains the list of items, logs, and participants.
- **Session Key**: `cartshare_user_session` stores the current user's name and room code so that the session persists after page reloads.
- Refer to [storageUtils.js](src/utils/storageUtils.js) for CRUD functions.

### 3. Collaboration Simulation (Storage Events)
To simulate real-time synchronization across different browser windows/tabs without a backend database:
- The app binds a `window.addEventListener('storage', callback)` inside [Dashboard.jsx](src/pages/Dashboard.jsx).
- The `storage` event triggers automatically in all other tabs of the same browser when `localStorage.setItem()` is executed.
- When an update event is received, the app parses the new data, checks if the key matches the active room code, and calls the state-setter to trigger a UI re-render.

### 4. Receipt Isolation for Printing
The receipt is formatted into a clean receipt card:
- The receipt container utilizes the ID `#print-area`.
- In [index.css](src/index.css), a custom `@media print` query specifies that all elements except `#print-area` are hidden (`visibility: hidden`).
- When a user clicks **Print Receipt**, `window.print()` triggers the browser's PDF print output, printing only the invoice paper sheet.

---

Viva Q&A (Project Defence Prep)

**Q1: How does the application support real-time sync without a backend database?**  
**A:** We use the HTML5 `storage` event. When a tab modifies a value in `localStorage`, all other tabs/windows on the same browser receive a `storage` event. We filter this event by the active room key, read the new serialized JSON value, and update the React state.

**Q2: What happens if a user reloads the page? Does their cart disappear?**  
**A:** No. We save the user session (`username` and `roomCode`) in `localStorage` under `cartshare_user_session`. On mount, `App.jsx` checks for this session. If found, it fetches the room data from `localStorage` and routes the user back to the Dashboard.

**Q3: How did you implement room sharing via URL?**  
**A:** We bind our state router to `window.location.hash` (e.g., `#/room/ABCDEF`). When the URL hash changes, `App.jsx` parses it. If it contains a room code, it presets it on the `Home.jsx` screen, prompting the user to only enter their name to jump right in.

**Q4: How does dark mode persist across reloads?**  
**A:** Toggling dark mode appends/removes the `.dark` class on the root `<html>` element. The preference is stored as `'light'` or `'dark'` under `cartshare_theme` in `localStorage`. When the app loads, it queries this key and applies the correct layout styles.
