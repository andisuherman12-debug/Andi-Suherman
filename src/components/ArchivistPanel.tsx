import { useState } from 'react';
import { Lightbulb, ChevronRight } from 'lucide-react';
import { GAME_IMAGES } from '../data/assets';

interface ArchivistPanelProps {
  message: string;
  hints: [string, string, string];
  hintsUsed: number;
  maxHints?: number;
  onUseHint: () => void;
  unlockedHintsList: string[];
}

export function ArchivistPanel({
  message,
  hints,
  hintsUsed,
  maxHints = 3,
  onUseHint,
  unlockedHintsList,
}: ArchivistPanelProps) {
  const [imgErr, setImgErr] = useState(false);
  const remaining = Math.max(0, maxHints - hintsUsed);

  return (
    <aside className="rounded-xl border border-slate-700/70 bg-[#0B162C] p-5">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 shrink-0 overflow-hidden rounded-lg border border-[#D4AF37]/50 bg-[#060D1A]">
          {!imgErr ? (
            <img
              src={GAME_IMAGES.archivist}
              alt="Emblem AI ARCHIVIST"
              referrerPolicy="no-referrer"
              onError={() => setImgErr(true)}
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs font-semibold text-[#D4AF37]">
              AI
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="text-sm font-semibold tracking-wide text-[#D4AF37]">
              ARCHIVIST · Pemandu Arsip
            </h3>
            <span className="font-mono-tabular text-xs text-slate-400">
              Sisa petunjuk: {remaining} / {maxHints}
            </span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-slate-200">{message}</p>
        </div>
      </div>

      {unlockedHintsList.length > 0 && (
        <div className="mt-4 space-y-2 border-t border-slate-800 pt-4">
          {unlockedHintsList.map((hint, idx) => (
            <div
              key={idx}
              className="rounded-lg border border-[#38BDF8]/30 bg-[#060D1A]/80 px-3.5 py-2.5 text-xs leading-relaxed text-slate-200"
            >
              <span className="font-semibold text-[#38BDF8]">Petunjuk {idx + 1}: </span>
              {hint}
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-3">
        <span className="text-xs text-slate-400">
          {hintsUsed === 0
            ? 'Selesaikan tanpa petunjuk untuk bonus +25 poin per tantangan.'
            : `${hints.length - remaining} petunjuk telah dibuka pada level ini.`}
        </span>
        <button
          type="button"
          disabled={remaining === 0}
          onClick={onUseHint}
          className="inline-flex items-center gap-2 rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:bg-[#D4AF37]/20 disabled:cursor-not-allowed disabled:border-slate-700 disabled:bg-slate-800/40 disabled:text-slate-500 whitespace-nowrap shrink-0"
        >
          <Lightbulb className="h-3.5 w-3.5" />
          <span>{remaining > 0 ? `Minta Petunjuk (${remaining})` : 'Petunjuk Habis'}</span>
          <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </aside>
  );
}
