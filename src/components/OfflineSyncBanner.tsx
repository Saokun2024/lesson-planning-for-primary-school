import React, { useState } from 'react';
import { Language } from '../types';
import { useTranslation } from '../data/translations';
import { Wifi, WifiOff, Cloud, RefreshCw, CheckCircle2 } from 'lucide-react';

interface OfflineSyncBannerProps {
  isOnline: boolean;
  pendingSyncCount: number;
  onTriggerSync: () => Promise<void>;
  lang: Language;
}

export const OfflineSyncBanner: React.FC<OfflineSyncBannerProps> = ({
  isOnline,
  pendingSyncCount,
  onTriggerSync,
  lang,
}) => {
  const t = useTranslation(lang);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  const handleSyncClick = async () => {
    setIsSyncing(true);
    await onTriggerSync();
    setIsSyncing(false);
    setSyncDone(true);
    setTimeout(() => setSyncDone(false), 2500);
  };

  if (isOnline && pendingSyncCount === 0 && !syncDone) {
    return null; // Keep screen clean when perfectly in sync
  }

  return (
    <div className="bg-slate-900 text-white text-xs px-4 py-2 border-b border-slate-800 no-print">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          {!isOnline ? (
            <>
              <WifiOff className="w-4 h-4 text-amber-400" />
              <span className="font-medium text-amber-200">
                {lang === 'km' 
                  ? 'ដំណើរការដោយគ្មានអ៊ីនធឺណិត (Offline Mode) — រាល់ការកែប្រែទាំងអស់ត្រូវបានរក្សាទុកដោយសុវត្ថិភាពក្នុងម៉ាស៊ីន' 
                  : 'Offline Mode Active — All edits are safely saved in local offline storage.'}
              </span>
            </>
          ) : pendingSyncCount > 0 ? (
            <>
              <Cloud className="w-4 h-4 text-blue-400" />
              <span>
                {lang === 'km' 
                  ? `មានកិច្ចតែងការចំនួន ${pendingSyncCount} កំពុងរង់ចាំធ្វើសមកាលកម្មទៅពពក` 
                  : `${pendingSyncCount} lesson plan(s) ready to sync with cloud storage.`}
              </span>
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'km' ? 'ទិន្នន័យទាំងអស់បានធ្វើសមកាលកម្មរួចរាល់' : 'All lesson data synced with cloud storage.'}</span>
            </>
          )}
        </div>

        {isOnline && (
          <button
            onClick={handleSyncClick}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors text-[11px]"
          >
            <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? (lang === 'km' ? 'កំពុង Sync...' : 'Syncing...') : t.syncNow}</span>
          </button>
        )}
      </div>
    </div>
  );
};
