/**
 * LocalStorage utility functions for managing CartShare state.
 * Since CartShare is a backendless app, we use localStorage to persist 
 * room details, participant lists, shopping items, and activity logs.
 */

// Keys prefix
const ROOM_KEY_PREFIX = 'cartshare_room_';
const USER_SESSION_KEY = 'cartshare_user_session';

/**
 * Fetches a room's data from localStorage.
 * Returns null if the room does not exist.
 */
export function getRoom(roomCode) {
  if (!roomCode) return null;
  const key = `${ROOM_KEY_PREFIX}${roomCode.toUpperCase()}`;
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : null;
}

/**
 * Saves a room's data to localStorage.
 * Triggers a storage event that other tabs can listen to.
 */
export function saveRoom(roomCode, roomData) {
  if (!roomCode || !roomData) return;
  const key = `${ROOM_KEY_PREFIX}${roomCode.toUpperCase()}`;
  localStorage.setItem(key, JSON.stringify(roomData));
}

/**
 * Initializes a new room structure in localStorage.
 */
export function createRoomInStorage(roomCode) {
  const newRoom = {
    roomCode: roomCode.toUpperCase(),
    participants: [],
    items: [],
    activityLog: []
  };
  saveRoom(roomCode, newRoom);
  return newRoom;
}

/**
 * Gets the currently logged-in user from localStorage.
 */
export function getCurrentUser() {
  const data = localStorage.getItem(USER_SESSION_KEY);
  return data ? JSON.parse(data) : null;
}

/**
 * Saves the current user session (username and current roomCode).
 */
export function saveCurrentUser(user) {
  localStorage.setItem(USER_SESSION_KEY, JSON.stringify(user));
}

/**
 * Clears the current user session (used when leaving the room).
 */
export function clearCurrentUser() {
  localStorage.removeItem(USER_SESSION_KEY);
}

/**
 * Helper to push an action to the activity log of a specific room.
 * Logs include unique id, username, action description, item name, and ISO timestamp.
 */
export function addLogEntry(roomCode, userName, action, itemName) {
  const room = getRoom(roomCode);
  if (!room) return;

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userName,
    action, // e.g., 'added', 'removed', 'updated quantity of', 'cleared the cart'
    itemName,
    timestamp: new Date().toISOString()
  };

  // Add to start of log so most recent is displayed first
  room.activityLog = [logEntry, ...room.activityLog];
  saveRoom(roomCode, room);
  return room;
}
