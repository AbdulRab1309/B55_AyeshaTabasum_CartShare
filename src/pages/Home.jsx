import React, { useState, useEffect } from 'react';
import { ShoppingCart, LogIn, PlusCircle, ArrowRight } from 'lucide-react';
import { getRoom } from '../utils/storageUtils';

/**
 * Home component serving as the landing screen.
 * Allows users to register their username and either create a new room
 * or join an existing shared cart room via a room code.
 */
export default function Home({ onJoinRoom, onCreateRoom, presetRoomCode = '' }) {
  const [username, setUsername] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [error, setError] = useState('');
  const [isJoining, setIsJoining] = useState(false); // UI toggle for flow

  // Auto-fill room code if preset from shared link
  useEffect(() => {
    if (presetRoomCode) {
      setRoomCode(presetRoomCode.toUpperCase());
      setIsJoining(true);
    }
  }, [presetRoomCode]);

  const handleCreateRoom = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim()) {
      setError('Please enter a username first.');
      return;
    }
    onCreateRoom(username.trim());
  };

  const handleJoinRoom = (e) => {
    e.preventDefault();
    setError('');
    const cleanUsername = username.trim();
    const cleanRoomCode = roomCode.trim().toUpperCase();

    if (!cleanUsername) {
      setError('Please enter a username first.');
      return;
    }
    if (!cleanRoomCode) {
      setError('Please enter a 6-character room code.');
      return;
    }

    // Validate room exists in local storage
    const room = getRoom(cleanRoomCode);
    if (!room) {
      setError('Room not found! Double-check the room code or create a new room.');
      return;
    }

    onJoinRoom(cleanUsername, cleanRoomCode);
  };

  return (
    <div className="flex min-h-[85vh] items-center justify-center px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-slate-100 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-900 transition-all duration-200">
        
        {/* Top Graphic Accent */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-center text-white">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-white backdrop-blur-sm">
            <ShoppingCart className="h-7 w-7" />
          </div>
          <h2 className="text-2xl font-black tracking-tight">Welcome to CartShare</h2>
          <p className="mt-1.5 text-xs text-blue-100 uppercase tracking-widest font-semibold">
            Real-Time Shared Shopping List
          </p>
        </div>

        {/* Action Panel */}
        <div className="p-8">
          
          {/* Error Message */}
          {error && (
            <div className="mb-5 rounded-xl bg-red-50 p-3.5 text-xs font-semibold text-red-600 dark:bg-red-950/20 dark:text-red-400 animate-shake">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="space-y-6">
            {/* Step 1: Enter Username (Universal) */}
            <div>
              <label htmlFor="username" className="mb-2 block text-xs font-bold uppercase tracking-wider text-slate-400">
                1. Your Username
              </label>
              <input
                id="username"
                type="text"
                maxLength="20"
                placeholder="e.g., Ayesha, Rahul"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-850 dark:bg-slate-850 dark:text-white dark:focus:border-blue-500"
              />
            </div>

            {/* Selector between Create and Join */}
            <div className="border-t border-slate-100 dark:border-slate-850 pt-5">
              <label className="mb-3 block text-xs font-bold uppercase tracking-wider text-slate-400">
                2. Select Session Action
              </label>

              {/* Mode Switcher Buttons */}
              <div className="mb-5 grid grid-cols-2 gap-2 rounded-xl bg-slate-100/60 p-1 dark:bg-slate-850">
                <button
                  type="button"
                  onClick={() => setIsJoining(false)}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    !isJoining
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  Create New Room
                </button>
                <button
                  type="button"
                  onClick={() => setIsJoining(true)}
                  className={`rounded-lg py-2 text-xs font-bold transition-all ${
                    isJoining
                      ? 'bg-white text-blue-600 shadow-sm dark:bg-slate-900 dark:text-blue-400'
                      : 'text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300'
                  }`}
                >
                  Join Room
                </button>
              </div>

              {/* Dynamic Action Forms */}
              {!isJoining ? (
                /* Create Room Flow */
                <form onSubmit={handleCreateRoom}>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg dark:shadow-none transition-all duration-200"
                  >
                    <PlusCircle className="h-4 w-4" />
                    <span>Create Session Room</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                  <p className="mt-2.5 text-center text-[10px] text-slate-400">
                    A unique 6-character code will be generated for your friends to join.
                  </p>
                </form>
              ) : (
                /* Join Room Flow */
                <form onSubmit={handleJoinRoom} className="space-y-4">
                  <div>
                    <input
                      type="text"
                      maxLength="6"
                      placeholder="Enter 6-char Room Code (e.g. ABC123)"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      className="w-full text-center font-mono font-bold tracking-widest rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition-all focus:border-blue-500 focus:bg-white dark:border-slate-850 dark:bg-slate-850 dark:text-white dark:focus:border-blue-500"
                    />
                  </div>
                  <button
                    type="submit"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 text-sm font-bold text-white shadow-md shadow-blue-100 hover:bg-blue-700 hover:shadow-lg dark:shadow-none transition-all duration-200"
                  >
                    <LogIn className="h-4 w-4" />
                    <span>Join Shared Room</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </form>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
