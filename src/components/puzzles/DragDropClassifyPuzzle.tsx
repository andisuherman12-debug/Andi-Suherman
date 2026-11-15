import { useState } from 'react';
import { CheckCircle2, FolderInput, RotateCcw } from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface DragDropClassifyPuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function DragDropClassifyPuzzle({
  challenge,
  isSolved,
  onSubmitAttempt,
}: DragDropClassifyPuzzleProps) {
  const data = challenge.classifyData!;

  const [assignments, setAssignments] = useState<Record<string, string>>(() => {
    if (isSolved) {
      const m: Record<string, string> = {};
      data.items.forEach((it) => {
        m[it.id] = it.correctCategoryId;
      });
      return m;
    }
    return {};
  });

  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const unassignedItems = data.items.filter((it) => !assignments[it.id]);
  const allAssigned = unassignedItems.length === 0;

  const assignToCategory = (itemId: string, categoryId: string) => {
    if (isSolved) return;
    soundFX.click();
    setAssignments((prev) => ({ ...prev, [itemId]: categoryId }));
    setSelectedItemId(null);
    setDraggingId(null);
  };

  const removeFromCategory = (itemId: string) => {
    if (isSolved) return;
    soundFX.click();
    setAssignments((prev) => {
      const copy = { ...prev };
      delete copy[itemId];
      return copy;
    });
  };

  const handleReset = () => {
    if (isSolved) return;
    soundFX.click();
    setAssignments({});
    setSelectedItemId(null);
  };

  const handleSubmit = () => {
    if (isSolved || !allAssigned) return;
    const isCorrect = data.items.every((it) => assignments[it.id] === it.correctCategoryId);
    if (isCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Klasifikasi seluruh bukti sejarah tepat!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Beberapa item masih berada di kategori yang kurang tepat. Klik item di dalam kotak untuk mengembalikannya, lalu susun ulang.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>
          Seret kartu bukti ke kotak kategori, atau klik kartu lalu klik kotak tujuan.
        </span>
        {!isSolved && Object.keys(assignments).length > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Kosongkan kotak</span>
          </button>
        )}
      </div>

      {/* Unassigned Pool */}
      {!isSolved && (
        <div className="rounded-lg border border-slate-700/70 bg-[#060D1A]/75 p-4">
          <div className="mb-3 flex items-center justify-between text-xs font-medium text-slate-300">
            <span>Kartu Bukti Belum Dikelompokkan</span>
            <span className="font-mono-tabular text-[#D4AF37]">
              Tersisa: {unassignedItems.length}
            </span>
          </div>
          {unassignedItems.length > 0 ? (
            <div className="grid gap-2.5 sm:grid-cols-2">
              {unassignedItems.map((item) => {
                const isSelected = selectedItemId === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    draggable
                    onDragStart={() => setDraggingId(item.id)}
                    onClick={() => {
                      soundFX.click();
                      setSelectedItemId((prev) => (prev === item.id ? null : item.id));
                    }}
                    className={`rounded-lg border p-3 text-left text-sm transition-colors ${
                      isSelected
                        ? 'border-[#38BDF8] bg-[#2563EB]/20 text-white'
                        : 'border-slate-700 bg-[#0B162C] text-slate-200 hover:border-slate-500 cursor-grab active:cursor-grabbing'
                    }`}
                  >
                    {item.text}
                  </button>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-emerald-400">
              Semua kartu telah ditempatkan. Tekan tombol "Periksa Klasifikasi" di bawah.
            </p>
          )}
        </div>
      )}

      {/* Category Drop Zones */}
      <div
        className={`grid gap-4 ${
          data.categories.length === 4
            ? 'sm:grid-cols-2'
            : data.categories.length === 3
            ? 'md:grid-cols-3'
            : 'md:grid-cols-2'
        }`}
      >
        {data.categories.map((cat) => {
          const itemsInCat = data.items.filter((it) => assignments[it.id] === cat.id);
          return (
            <div
              key={cat.id}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (draggingId) assignToCategory(draggingId, cat.id);
              }}
              onClick={() => {
                if (selectedItemId) assignToCategory(selectedItemId, cat.id);
              }}
              className={`flex min-h-[160px] flex-col rounded-lg border p-4 transition-colors ${
                selectedItemId
                  ? 'border-[#38BDF8]/70 bg-[#12213D] cursor-pointer hover:bg-[#2563EB]/15'
                  : 'border-slate-700/80 bg-[#0B162C]'
              }`}
            >
              <div className="border-b border-slate-800 pb-2.5">
                <div className="flex items-center justify-between gap-2">
                  <h4 className="text-sm font-semibold text-[#D4AF37]">{cat.title}</h4>
                  {selectedItemId && <FolderInput className="h-4 w-4 text-[#38BDF8]" />}
                </div>
                {cat.subtitle && <p className="mt-1 text-xs text-slate-400">{cat.subtitle}</p>}
              </div>

              <div className="mt-3 flex-1 space-y-2">
                {itemsInCat.length === 0 ? (
                  <p className="py-4 text-center text-xs text-slate-500">
                    {selectedItemId ? 'Klik di sini untuk meletakkan kartu' : 'Belum ada kartu'}
                  </p>
                ) : (
                  itemsInCat.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      disabled={isSolved}
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromCategory(item.id);
                      }}
                      title={isSolved ? undefined : 'Klik untuk keluarkan dari kategori'}
                      className={`flex w-full items-start justify-between gap-2 rounded-md border p-2.5 text-left text-xs leading-relaxed ${
                        isSolved
                          ? 'border-emerald-500/40 bg-emerald-950/25 text-emerald-100'
                          : 'border-slate-700 bg-[#060D1A] text-slate-200 hover:border-red-400/50'
                      }`}
                    >
                      <span>{item.text}</span>
                      {isSolved && <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-emerald-400" />}
                    </button>
                  ))
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
            disabled={!allAssigned}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Periksa Klasifikasi ({data.items.length - unassignedItems.length}/{data.items.length})
          </button>
        </div>
      )}
    </div>
  );
}
