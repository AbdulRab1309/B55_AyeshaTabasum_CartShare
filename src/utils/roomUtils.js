/**
 * Generates a unique 6-character alphanumeric room code.
 * This is used when a user clicks 'Create Room' to establish a new shared cart.
 */
export function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Returns initials from a username for avatar representation.
 * If the name contains multiple words, it takes the first letter of the first two words.
 * Otherwise, it takes the first two letters of the single name.
 */
export function getAvatarInitials(name) {
  if (!name) return '??';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return parts[0].slice(0, 2).toUpperCase();
}
