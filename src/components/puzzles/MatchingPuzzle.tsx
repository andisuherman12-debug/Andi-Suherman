import { useMemo, useState } from 'react';
import { Check, Link2, RotateCcw } from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface MatchingPuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function MatchingPuzzle({ challenge, isSolved, onSubmitAttempt }: MatchingPuzzleProps) {
  const data = challenge.matchingData!;

  const shuffledRight = useMemo(() => {
    // Deterministic reorder based on pair lengths/ids so it's not aligned 1:1
    const copy = [...data.pairs];
    if (copy.length === 4) {
      return [copy[2], copy[0], copy[3], copy[1]];
    }
    return copy.reverse();
  }, [data.pairs]);

  const [selectedLeftId, setSelectedLeftId] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>(() => {
    if (isSolved) {
      const m: Record<string, string> = {};
      data.pairs.forEach((p) => {
        m[p.id] = p.id;
      });
      return m;
    }
    return {};
  });

  const allPaired = Object.keys(matches).length === data.pairs.length;

  const handleSelectLeft = (leftId: string) => {
    if (isSolved) return;
    soundFX.click();
    setSelectedLeftId((prev) => (prev === leftId ? null : leftId));
  };

  const handleSelectRight = (rightPairId: string) => {
    if (isSolved) return;
    if (!selectedLeftId) return;
    soundFX.click();

    setMatches((prev) => {
      const next = { ...prev };
      // Remove any existing link pointing to this rightPairId
      Object.keys(next).forEach((k) => {
        if (next[k] === rightPairId) {
          delete next[k];
        }
      });
      next[selectedLeftId] = rightPairId;
      return next;
    });
    setSelectedLeftId(null);
  };

  const handleClear = () => {
    if (isSolved) return;
    soundFX.click();
    setMatches({});
    setSelectedLeftId(null);
  };

  const handleSubmit = () => {
    if (isSolved || !allPaired) return;
    const isAllCorrect = data.pairs.every((p) => matches[p.id] === p.id);
    if (isAllCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Seluruh pasangan konsep sejarah cocok dengan tepat!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Masih ada pasangan yang tertukar. Periksa kembali hubungan kata dan definisinya.'
      );
    }
  };

  const getIndexLabel = (pairId: string) => {
    const idx = data.pairs.findIndex((p) => p.id === pairId);
    return idx >= 0 ? `0${idx + 1}` : '';
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          Cara bermain: Klik satu item di kolom kiri, lalu klik pasangannya di kolom kanan.
        </span>
        {!isSolved && Object.keys(matches).length > 0 && (
          <button
            type="button"
            onClick={handleClear}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Atur ulang pasangan</span>
          </button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Left Column */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
            {data.leftHeader}
          </div>
          {data.pairs.map((pair, idx) => {
            const isSelected = selectedLeftId === pair.id;
            const pairedRightId = matches[pair.id];
            const pairedRight = data.pairs.find((p) => p.id === pairedRightId);

            return (
              <button
                key={pair.id}
                type="button"
                disabled={isSolved}
                onClick={() => handleSelectLeft(pair.id)}
                className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'border-[#38BDF8] bg-[#2563EB]/20 text-white'
                    : pairedRight
                    ? 'border-[#D4AF37]/60 bg-[#12213D] text-slate-100'
                    : 'border-slate-700/80 bg-[#060D1A]/80 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono-tabular text-xs font-semibold text-[#38BDF8]">
                    0{idx + 1}
                  </span>
                  {pairedRight && (
                    <span className="inline-flex items-center gap-1 text-xs font-medium text-[#FDE68A]">
                      <Link2 className="h-3 w-3" />
                      Terhubung
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm font-medium leading-snug">{pair.left}</p>
              </button>
            );
          })}
        </div>

        {/* Right Column */}
        <div className="space-y-2.5">
          <div className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            {data.rightHeader}
          </div>
          {shuffledRight.map((pair) => {
            const linkedLeftId = Object.keys(matches).find((k) => matches[k] === pair.id);
            return (
              <button
                key={pair.id}
                type="button"
                disabled={isSolved || (!selectedLeftId && !linkedLeftId)}
                onClick={() => handleSelectRight(pair.id)}
                className={`w-full rounded-lg border p-3.5 text-left transition-colors ${
                  linkedLeftId
                    ? 'border-[#D4AF37]/60 bg-[#12213D] text-slate-100'
                    : selectedLeftId
                    ? 'border-[#38BDF8]/60 bg-[#0B162C] text-slate-100 hover:bg-[#2563EB]/15'
                    : 'border-slate-800 bg-[#060D1A]/60 text-slate-300'
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs text-slate-400">
                    {linkedLeftId
                      ? `Dipasangkan dengan item ${getIndexLabel(linkedLeftId)}`
                      : selectedLeftId
                      ? 'Klik untuk memasangkan'
                      : 'Pilih item kiri dulu'}
                  </span>
                  {isSolved && <Check className="h-4 w-4 text-emerald-400" />}
                </div>
                <p className="mt-1 text-sm leading-snug">{pair.right}</p>
              </button>
            );
          })}
        </div>
      </div>

      {!isSolved && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!allPaired}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Periksa Pasangan ({Object.keys(matches).length}/{data.pairs.length})
          </button>
        </div>
      )}
    </div>
  );
}
