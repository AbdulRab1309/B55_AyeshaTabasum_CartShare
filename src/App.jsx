import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import { generateRoomCode } from './utils/roomUtils';
import {
  getCurrentUser,
  saveCurrentUser,
  clearCurrentUser,
  createRoomInStorage,
  getRoom
} from './utils/storageUtils';

/**
 * Root Application Controller.
 * Manages view routing, active user sessions, room onboarding logic, 
 * URL hash synchronization, and theme (dark mode) settings.
 */
export default function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [presetRoomCode, setPresetRoomCode] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Initial Load: Check for existing theme and session or sharing hash links
  useEffect(() => {
    // Theme setup
    const savedTheme = localStorage.getItem('cartshare_theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }

    // Session / Hash URL setup
    const handleHashAndSession = () => {
      const hash = window.location.hash;
      const hashMatch = hash.match(/^#\/room\/([A-Z0-9]{6})$/i);
      const hashRoomCode = hashMatch ? hashMatch[1].toUpperCase() : '';

      const session = getCurrentUser();

      if (hashRoomCode) {
        // If a hash exists, we prioritize it
        setPresetRoomCode(hashRoomCode);
        
        // If session matches hash, resume dashboard directly
        if (session && session.roomCode.toUpperCase() === hashRoomCode) {
          setCurrentUser(session);
        } else {
          // If session is for a different room, clear it to prevent conflict
          clearCurrentUser();
          setCurrentUser(null);
        }
      } else if (session) {
        // If no hash but session exists, load session and update hash
        setCurrentUser(session);
        window.location.hash = `#/room/${session.roomCode}`;
      } else {
        // Normal home state
        setCurrentUser(null);
        setPresetRoomCode('');
      }
    };

    handleHashAndSession();

    // Listen for hashchange events (e.g. user clicks back button)
    window.addEventListener('hashchange', handleHashAndSession);
    return () => window.removeEventListener('hashchange', handleHashAndSession);
  }, []);

  // 2. Dark mode toggler
  const toggleDarkMode = () => {
    const nextDark = !isDarkMode;
    setIsDarkMode(nextDark);
    if (nextDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cartshare_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cartshare_theme', 'light');
    }
  };

  // 3. Action: Create a Room
  const handleCreateRoom = (username) => {
    const code = generateRoomCode();
    // Initialize room structure in localStorage
    createRoomInStorage(code);
    
    // Save user session
    const session = { name: username, roomCode: code };
    saveCurrentUser(session);
    setCurrentUser(session);
    
    // Redirect via hash update
    window.location.hash = `#/room/${code}`;
  };

  // 4. Action: Join an Existing Room
  const handleJoinRoom = (username, roomCode) => {
    // Save user session
    const session = { name: username, roomCode: roomCode.toUpperCase() };
    saveCurrentUser(session);
    setCurrentUser(session);

    // Redirect via hash update
    window.location.hash = `#/room/${roomCode.toUpperCase()}`;
  };

  // 5. Action: Leave Session
  const handleLeaveRoom = () => {
    clearCurrentUser();
    setCurrentUser(null);
    setPresetRoomCode('');
    window.location.hash = '#/';
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 transition-colors duration-200 dark:bg-slate-950 dark:text-slate-100 font-sans">
      {currentUser ? (
        <Dashboard
          username={currentUser.name}
          roomCode={currentUser.roomCode}
          onLeaveRoom={handleLeaveRoom}
          isDarkMode={isDarkMode}
          toggleDarkMode={toggleDarkMode}
        />
      ) : (
        <Home
          onCreateRoom={handleCreateRoom}
          onJoinRoom={handleJoinRoom}
          presetRoomCode={presetRoomCode}
        />
      )}
    </div>
  );
}
