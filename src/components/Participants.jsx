import React from 'react';
import { Users } from 'lucide-react';
import { getAvatarInitials } from '../utils/roomUtils';

// Curated list of background colors for participant avatars
const AVATAR_COLORS = [
  'bg-blue-500 text-white',
  'bg-emerald-500 text-white',
  'bg-violet-500 text-white',
  'bg-amber-500 text-white',
  'bg-rose-500 text-white',
  'bg-indigo-500 text-white',
  'bg-cyan-500 text-white',
  'bg-pink-500 text-white'
];

/**
 * Returns a consistent avatar color class based on username hash.
 */
function getAvatarColor(name) {
  if (!name) return AVATAR_COLORS[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % AVATAR_COLORS.length;
  return AVATAR_COLORS[index];
}

/**
 * Participants component to display everyone sharing the current shopping room.
 */
export default function Participants({ participants = [], currentUsername }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <Users className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold">Participants ({participants.length})</h2>
      </div>

      {participants.length === 0 ? (
        <p className="text-sm text-slate-600 dark:text-slate-400">No participants found.</p>
      ) : (
        <div className="flex flex-wrap gap-3">
          {participants.map((participant) => {
            const isMe = participant.name === currentUsername;
            const avatarColor = getAvatarColor(participant.name);
            const initials = getAvatarInitials(participant.name);

            return (
              <div
                key={participant.id || participant.name}
                className="group relative flex items-center gap-2 rounded-xl border border-slate-100 bg-slate-50/50 p-2 pr-3 transition-all hover:bg-slate-100/80 dark:border-slate-800 dark:bg-slate-800/40 dark:hover:bg-slate-800"
              >
                {/* Initial Avatar */}
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-lg text-xs font-bold uppercase tracking-wider ${avatarColor}`}
                >
                  {initials}
                </div>

                {/* Name */}
                <div className="flex flex-col">
                  <span className="max-w-[100px] truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    {participant.name}
                  </span>
                  <span className="text-[10px] text-slate-600 dark:text-slate-400">
                    {isMe ? 'You' : 'Member'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
