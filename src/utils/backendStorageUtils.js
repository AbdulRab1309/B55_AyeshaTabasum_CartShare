/**
 * Minimal backend persistence wrappers for CartShare.
 * This file is intended to replace localStorage persistence with API calls.
 */

import { createRoomApi, getRoomApi, updateRoomApi } from './api';

export async function getRoom(roomCode) {
  if (!roomCode) return null;
  return await getRoomApi(roomCode.toUpperCase());
}

export async function createRoomInStorage(roomCode) {
  if (!roomCode) return null;
  return await createRoomApi(roomCode.toUpperCase());
}

export async function saveRoom(roomCode, roomData) {
  if (!roomCode || !roomData) return null;
  return await updateRoomApi(roomCode.toUpperCase(), roomData);
}

export async function addLogEntry(roomCode, userName, action, itemName) {
  if (!roomCode || !userName || !action) return null;

  const room = await getRoom(roomCode);
  if (!room) return null;

  const logEntry = {
    id: `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    userName,
    action,
    itemName,
    timestamp: new Date().toISOString()
  };

  const updatedRoom = {
    ...room,
    activityLog: [logEntry, ...(room.activityLog || [])]
  };

  await saveRoom(roomCode, updatedRoom);
  return updatedRoom;
}

export function getCurrentUser() {
  const data = localStorage.getItem('cartshare_user_session');
  return data ? JSON.parse(data) : null;
}

export function saveCurrentUser(user) {
  localStorage.setItem('cartshare_user_session', JSON.stringify(user));
}

export function clearCurrentUser() {
  localStorage.removeItem('cartshare_user_session');
}
