import { useState } from 'react';
import { CheckCircle2, LockKeyhole } from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface CodeBreakingPuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function CodeBreakingPuzzle({
  challenge,
  isSolved,
  onSubmitAttempt,
}: CodeBreakingPuzzleProps) {
  const data = challenge.codeBreakingData!;
  const [inputValue, setInputValue] = useState(isSolved ? data.displayAnswer : '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;
    const normalized = inputValue.trim().toUpperCase();
    if (!normalized) return;

    const correct = data.acceptedAnswers.includes(normalized);
    if (correct) {
      soundFX.success();
      onSubmitAttempt(true, undefined, `Sandi kunci "${data.displayAnswer}" terverifikasi!`);
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Kombinasi sandi belum cocok. Periksa kembali petunjuk pemecah kode di panel.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="grid gap-3 sm:grid-cols-3">
        {data.cipherClues.map((c, idx) => (
          <div
            key={idx}
            className="rounded-lg border border-slate-700/80 bg-[#060D1A]/85 p-3.5"
          >
            <div className="font-mono-tabular text-xs font-semibold tracking-wider text-[#D4AF37]">
              {c.symbol}
            </div>
            <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{c.clue}</p>
          </div>
        ))}
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-lg border border-slate-700/80 bg-[#0B162C] p-4"
      >
        <label htmlFor={`code-${challenge.id}`} className="block text-sm font-medium text-white">
          {data.question}
        </label>

        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <LockKeyhole className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#38BDF8]" />
            <input
              id={`code-${challenge.id}`}
              type="text"
              disabled={isSolved}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={data.placeholder}
              className="font-mono-tabular w-full rounded-lg border border-slate-700 bg-[#060D1A] py-2.5 pl-10 pr-4 text-sm font-semibold uppercase tracking-widest text-white placeholder:normal-case placeholder:tracking-normal placeholder:font-normal placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none disabled:opacity-80"
            />
          </div>

          {!isSolved ? (
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap shrink-0"
            >
              Buka Kunci Sandi
            </button>
          ) : (
            <div className="inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-xs font-semibold text-emerald-300 whitespace-nowrap">
              <CheckCircle2 className="h-4 w-4" />
              <span>Terbuka</span>
            </div>
          )}
        </div>
      </form>
    </div>
  );
}
