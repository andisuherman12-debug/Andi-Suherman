import { useState } from 'react';
import { CalendarClock, CheckCircle2, RotateCcw } from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface TimelinePuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function TimelinePuzzle({ challenge, isSolved, onSubmitAttempt }: TimelinePuzzleProps) {
  const data = challenge.timelineData!;

  const [slotMap, setSlotMap] = useState<Record<string, string>>(() => {
    if (isSolved) return { ...data.correctMapping };
    return {};
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const usedItemIds = Object.values(slotMap);
  const availableItems = data.items.filter((it) => !usedItemIds.includes(it.id));
  const allPlaced = Object.keys(slotMap).length === data.slots.length;

  const handleAssignSlot = (slotId: string) => {
    if (isSolved || !selectedItemId) return;
    soundFX.click();
    setSlotMap((prev) => ({ ...prev, [slotId]: selectedItemId }));
    setSelectedItemId(null);
  };

  const handleRemoveFromSlot = (slotId: string) => {
    if (isSolved) return;
    soundFX.click();
    setSlotMap((prev) => {
      const copy = { ...prev };
      delete copy[slotId];
      return copy;
    });
  };

  const handleReset = () => {
    if (isSolved) return;
    soundFX.click();
    setSlotMap({});
    setSelectedItemId(null);
  };

  const handleSubmit = () => {
    if (isSolved || !allPlaced) return;
    const isCorrect = data.slots.every(
      (slot) => slotMap[slot.id] === data.correctMapping[slot.id]
    );
    if (isCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Garis waktu sejarah terkalibrasi dengan presisi!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Penempatan tahun atau periode pada garis waktu masih ada yang tertukar. Coba periksa kembali urutan kronologinya.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>Pilih kartu peristiwa di atas, lalu klik slot garis waktu yang sesuai.</span>
        {!isSolved && Object.keys(slotMap).length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset garis waktu</span>
          </button>
        )}
      </div>

      {/* Available Event Cards */}
      {!isSolved && (
        <div className="grid gap-2.5 sm:grid-cols-2">
          {availableItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  soundFX.click();
                  setSelectedItemId((prev) => (prev === item.id ? null : item.id));
                }}
                className={`rounded-lg border p-3.5 text-left transition-colors ${
                  isSelected
                    ? 'border-[#38BDF8] bg-[#2563EB]/20 text-white'
                    : 'border-slate-700 bg-[#060D1A]/85 text-slate-200 hover:border-slate-500'
                }`}
              >
                <div className="flex items-center justify-between gap-2 text-xs text-slate-400">
                  <span>{item.periodLabel}</span>
                  <span className="font-mono-tabular text-[#D4AF37]">Pilih kartu</span>
                </div>
                <p className="mt-1.5 text-sm font-medium leading-snug">{item.eventTitle}</p>
              </button>
            );
          })}
        </div>
      )}

      {/* Horizontal / Vertical Connected Timeline */}
      <div className="relative space-y-3 border-t border-slate-800 pt-4">
        {data.slots.map((slot, index) => {
          const placedItemId = slotMap[slot.id];
          const placedItem = data.items.find((it) => it.id === placedItemId);

          return (
            <div key={slot.id} className="flex items-stretch gap-3">
              <div className="flex flex-col items-center">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border font-mono-tabular text-xs font-semibold ${
                    placedItem
                      ? 'border-[#D4AF37] bg-[#D4AF37]/15 text-[#FDE68A]'
                      : 'border-slate-700 bg-[#060D1A] text-slate-400'
                  }`}
                >
                  {index + 1}
                </div>
                {index < data.slots.length - 1 && (
                  <div className="my-1 w-px flex-1 bg-slate-700/80" />
                )}
              </div>

              <div
                onClick={() => {
                  if (!placedItem && selectedItemId) handleAssignSlot(slot.id);
                }}
                className={`mb-2 flex-1 rounded-lg border p-3.5 transition-colors ${
                  placedItem
                    ? isSolved
                      ? 'border-emerald-500/40 bg-emerald-950/20'
                      : 'border-[#D4AF37]/60 bg-[#12213D]'
                    : selectedItemId
                    ? 'border-[#38BDF8] bg-[#2563EB]/10 cursor-pointer hover:bg-[#2563EB]/20'
                    : 'border-slate-800 bg-[#060D1A]/60'
                }`}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-semibold text-[#38BDF8]">
                    <CalendarClock className="h-3.5 w-3.5" />
                    <span className="font-mono-tabular">{slot.label}</span>
                  </div>
                  {placedItem && !isSolved && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromSlot(slot.id);
                      }}
                      className="text-xs text-slate-400 hover:text-red-300"
                    >
                      Lepas
                    </button>
                  )}
                  {isSolved && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                </div>

                {placedItem ? (
                  <p className="mt-2 text-sm font-medium text-white">{placedItem.eventTitle}</p>
                ) : (
                  <p className="mt-2 text-xs text-slate-500">
                    {selectedItemId
                      ? 'Klik slot ini untuk menempatkan kartu terpilih'
                      : 'Slot garis waktu kosong'}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {!isSolved && (
        <div className="flex justify-end pt-2">
          <button
            type="button"
            disabled={!allPlaced}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Kalibrasi Garis Waktu ({Object.keys(slotMap).length}/{data.slots.length})
          </button>
        </div>
      )}
    </div>
  );
}
