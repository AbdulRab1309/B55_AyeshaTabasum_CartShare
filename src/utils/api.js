const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';

async function request(path, options = {}) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
    body: options.body ? JSON.stringify(options.body) : undefined
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({}));
    throw new Error(payload.error || `Request failed with status ${res.status}`);
  }

  return res.status === 204 ? null : res.json();
}

export function createRoomApi(roomCode) {
  return request('/api/rooms', {
    method: 'POST',
    body: { roomCode }
  });
}

export function getRoomApi(roomCode) {
  return request(`/api/rooms/${roomCode}`);
}

export function updateRoomApi(roomCode, roomData) {
  return request(`/api/rooms/${roomCode}`, {
    method: 'PUT',
    body: roomData
  });
}

export function deleteRoomApi(roomCode) {
  return request(`/api/rooms/${roomCode}`, {
    method: 'DELETE'
  });
}
