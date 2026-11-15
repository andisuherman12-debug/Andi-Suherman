import { useState } from 'react';
import { ArrowDown, ArrowUp, CheckCircle2, GripVertical } from 'lucide-react';
import { ChallengeData, SequenceItem } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface SequencePuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function SequencePuzzle({ challenge, isSolved, onSubmitAttempt }: SequencePuzzleProps) {
  const data = challenge.sequenceData!;

  const [orderedItems, setOrderedItems] = useState<SequenceItem[]>(() => {
    if (isSolved) {
      return data.correctOrderIds
        .map((id) => data.items.find((it) => it.id === id))
        .filter((x): x is SequenceItem => Boolean(x));
    }
    return [...data.items];
  });

  const [dragIndex, setDragIndex] = useState<number | null>(null);

  const moveItem = (fromIdx: number, toIdx: number) => {
    if (isSolved || toIdx < 0 || toIdx >= orderedItems.length || fromIdx === toIdx) return;
    soundFX.click();
    setOrderedItems((prev) => {
      const copy = [...prev];
      const [removed] = copy.splice(fromIdx, 1);
      copy.splice(toIdx, 0, removed);
      return copy;
    });
  };

  const handleSubmit = () => {
    if (isSolved) return;
    const currentIds = orderedItems.map((i) => i.id);
    const isCorrect = currentIds.every((id, idx) => id === data.correctOrderIds[idx]);

    if (isCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Urutan fragmen tersusun tepat secara kronologis dan logis!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Urutan belum tepat. Gunakan tombol naik/turun atau geser kartu untuk memperbaiki susunan.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <p className="text-xs text-slate-400">
        Seret kartu atau gunakan tombol panah untuk mengurutkan dari nomor 1 (paling awal) ke bawah.
      </p>

      <div className="space-y-2.5">
        {orderedItems.map((item, idx) => (
          <div
            key={item.id}
            draggable={!isSolved}
            onDragStart={() => setDragIndex(idx)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={() => {
              if (dragIndex !== null) {
                moveItem(dragIndex, idx);
                setDragIndex(null);
              }
            }}
            className={`flex items-center justify-between gap-3 rounded-lg border p-3.5 transition-colors ${
              isSolved
                ? 'border-emerald-500/40 bg-emerald-950/20'
                : 'border-slate-700/80 bg-[#060D1A]/85 hover:border-slate-500 cursor-grab active:cursor-grabbing'
            }`}
          >
            <div className="flex min-w-0 items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-[#D4AF37]/40 bg-[#0B162C] font-mono-tabular text-xs font-semibold text-[#D4AF37]">
                {idx + 1}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium leading-snug text-slate-100">{item.label}</p>
                {item.detail && <p className="mt-1 text-xs text-slate-400">{item.detail}</p>}
              </div>
            </div>

            {!isSolved ? (
              <div className="flex shrink-0 items-center gap-1">
                <GripVertical className="mr-1 hidden h-4 w-4 text-slate-500 sm:block" />
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, idx - 1)}
                  aria-label="Geser ke atas"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#0B162C] text-slate-300 transition-colors hover:border-[#38BDF8] hover:text-white disabled:opacity-35"
                >
                  <ArrowUp className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  disabled={idx === orderedItems.length - 1}
                  onClick={() => moveItem(idx, idx + 1)}
                  aria-label="Geser ke bawah"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-700 bg-[#0B162C] text-slate-300 transition-colors hover:border-[#38BDF8] hover:text-white disabled:opacity-35"
                >
                  <ArrowDown className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
            )}
          </div>
        ))}
      </div>

      {!isSolved && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
          >
            Kunci Urutan
          </button>
        </div>
      )}
    </div>
  );
}
