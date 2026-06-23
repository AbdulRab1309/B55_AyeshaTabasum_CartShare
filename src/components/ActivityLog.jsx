import React from 'react';
import { ScrollText, PlusCircle, MinusCircle, RefreshCw, Trash2, UserPlus, HelpCircle } from 'lucide-react';

/**
 * Maps an action string to its visual representation (icon and color classes).
 */
function getActionSpecs(action) {
  const normAction = action.toLowerCase();
  if (normAction.includes('added') || normAction === 'add') {
    return {
      icon: <PlusCircle className="h-4 w-4" />,
      colorClass: 'text-blue-600 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400',
      badgeClass: 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
    };
  }
  if (normAction.includes('removed') || normAction === 'remove' || normAction === 'deleted') {
    return {
      icon: <MinusCircle className="h-4 w-4" />,
      colorClass: 'text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400',
      badgeClass: 'bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-300'
    };
  }
  if (normAction.includes('updated') || normAction.includes('edited') || normAction.includes('quantity')) {
    return {
      icon: <RefreshCw className="h-4 w-4" />,
      colorClass: 'text-amber-600 bg-amber-50 dark:bg-amber-950/30 dark:text-amber-400',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
    };
  }
  if (normAction.includes('cleared') || normAction.includes('empty')) {
    return {
      icon: <Trash2 className="h-4 w-4" />,
      colorClass: 'text-rose-600 bg-rose-50 dark:bg-rose-950/30 dark:text-rose-400',
      badgeClass: 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
    };
  }
  if (normAction.includes('joined') || normAction.includes('entered')) {
    return {
      icon: <UserPlus className="h-4 w-4" />,
      colorClass: 'text-green-600 bg-green-50 dark:bg-green-950/30 dark:text-green-400',
      badgeClass: 'bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300'
    };
  }
  return {
    icon: <HelpCircle className="h-4 w-4" />,
    colorClass: 'text-slate-600 bg-slate-50 dark:bg-slate-900 dark:text-slate-400',
    badgeClass: 'bg-slate-100 text-slate-800 dark:bg-slate-950 dark:text-slate-350'
  };
}

/**
 * Formats ISO date string into readable hh:mm:ss format for student project simplicity.
 */
function formatTime(isoString) {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch (err) {
    return '';
  }
}

/**
 * ActivityLog component showing what users did, when, and to what items.
 */
export default function ActivityLog({ logs = [] }) {
  return (
    <div className="flex flex-col h-full rounded-2xl border border-slate-100 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      
      {/* Header */}
      <div className="mb-4 flex items-center gap-2 text-slate-800 dark:text-slate-200">
        <ScrollText className="h-5 w-5 text-blue-600 dark:text-blue-400" />
        <h2 className="text-lg font-bold">Activity Log</h2>
      </div>

      {/* Log Feed */}
      <div className="flex-1 overflow-y-auto max-h-[320px] pr-1 scrollbar-thin scrollbar-thumb-slate-200 dark:scrollbar-thumb-slate-800">
        {logs.length === 0 ? (
          <div className="flex h-32 flex-col items-center justify-center text-center text-slate-400">
            <ScrollText className="mb-2 h-8 w-8 text-slate-400 dark:text-slate-600" />
            <p className="text-xs">No activity logged yet.</p>
          </div>
        ) : (
          <div className="relative border-l border-slate-150 pl-4 space-y-4 dark:border-slate-800">
            {logs.map((log) => {
              const { icon, colorClass } = getActionSpecs(log.action);
              return (
                <div key={log.id} className="relative group text-xs sm:text-sm">
                  {/* Timeline bullet icon */}
                  <span className={`absolute -left-[25px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ring-4 ring-white dark:ring-slate-900 ${colorClass}`}>
                    {icon}
                  </span>
                  
                  {/* Message and Timestamp */}
                  <div className="flex flex-col gap-0.5">
                    <div className="text-slate-600 dark:text-slate-350">
                      <span className="font-bold text-slate-800 dark:text-slate-150">
                        {log.userName}
                      </span>{' '}
                      <span className="italic">{log.action}</span>{' '}
                      <span className="font-semibold text-slate-850 dark:text-slate-100">
                        {log.itemName}
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-600 dark:text-slate-400 font-mono">
                      {formatTime(log.timestamp)}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      
    </div>
  );
}
