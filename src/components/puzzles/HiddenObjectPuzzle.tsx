import { useState } from 'react';
import { CheckCircle2, Eye, KeyRound, Search } from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { SceneImage } from '../SceneImage';
import { soundFX } from '../../utils/sound';

interface HiddenObjectPuzzleProps {
  challenge: ChallengeData;
  roomImage: string;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

export function HiddenObjectPuzzle({
  challenge,
  roomImage,
  isSolved,
  onSubmitAttempt,
}: HiddenObjectPuzzleProps) {
  const data = challenge.hiddenObjectData!;
  const [foundIds, setFoundIds] = useState<string[]>(
    isSolved ? data.hotspots.map((h) => h.id) : []
  );
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [answerInput, setAnswerInput] = useState(isSolved ? data.secretAnswer : '');

  const allFound = foundIds.length === data.hotspots.length;
  const activeHotspot = data.hotspots.find((h) => h.id === activeHotspotId) || null;

  const handleInspectHotspot = (id: string) => {
    soundFX.click();
    setActiveHotspotId(id);
    if (!foundIds.includes(id)) {
      setFoundIds((prev) => [...prev, id]);
    }
  };

  const handleVerifyCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (isSolved) return;
    const normalized = answerInput.trim().toUpperCase();
    if (!normalized) return;

    const correct = data.acceptedAnswers.includes(normalized);
    if (correct) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Kata rahasia manuskrip berhasil dipecahkan!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Kata kunci belum tepat. Gabungkan suku kata dari keempat manuskrip yang ditemukan.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
        <span>{data.sceneCaption}</span>
        <span className="font-mono-tabular font-semibold text-[#D4AF37]">
          Artefak ditemukan: {foundIds.length} / {data.hotspots.length}
        </span>
      </div>

      {/* Interactive Room Scene with Hotspots */}
      <SceneImage
        src={roomImage}
        alt="Ilustrasi ruang arsip untuk inspeksi manuskrip tersembunyi"
        scrimClassName="bg-gradient-to-t from-[#060D1A]/80 via-transparent to-[#060D1A]/30"
      >
        {data.hotspots.map((hs) => {
          const isFound = foundIds.includes(hs.id);
          const isActive = activeHotspotId === hs.id;
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => handleInspectHotspot(hs.id)}
              style={{ left: `${hs.xPercent}%`, top: `${hs.yPercent}%` }}
              aria-label={`Periksa ${hs.label}`}
              className={`group absolute -translate-x-1/2 -translate-y-1/2 flex h-11 w-11 items-center justify-center rounded-full border-2 transition-transform duration-200 hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#38BDF8] ${
                isFound
                  ? isActive
                    ? 'border-[#38BDF8] bg-[#2563EB]/90 text-white shadow-lg shadow-[#2563EB]/40'
                    : 'border-emerald-400 bg-emerald-950/85 text-emerald-300'
                  : 'border-[#D4AF37] bg-[#060D1A]/80 text-[#FDE68A] hover:bg-[#D4AF37]/25'
              }`}
            >
              {isFound ? <CheckCircle2 className="h-5 w-5" /> : <Search className="h-4 w-4" />}
            </button>
          );
        })}
      </SceneImage>

      {/* Discovered Clues Tray */}
      <div className="grid gap-3 sm:grid-cols-2">
        {data.hotspots.map((hs) => {
          const isFound = foundIds.includes(hs.id);
          return (
            <button
              key={hs.id}
              type="button"
              onClick={() => isFound && setActiveHotspotId(hs.id)}
              className={`rounded-lg border p-3.5 text-left transition-colors ${
                isFound
                  ? activeHotspotId === hs.id
                    ? 'border-[#38BDF8] bg-[#12213D]'
                    : 'border-slate-700 bg-[#060D1A]/90 hover:border-slate-500'
                  : 'border-slate-800/80 bg-[#060D1A]/40 opacity-60 cursor-default'
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-slate-300">
                  {isFound ? hs.clueTitle : hs.label}
                </span>
                <span className="font-mono-tabular text-xs font-semibold text-[#D4AF37]">
                  {isFound ? `Sandi: ${hs.codeLetter}` : 'Belum diperiksa'}
                </span>
              </div>
              {isFound && (
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">{hs.clueText}</p>
              )}
            </button>
          );
        })}
      </div>

      {activeHotspot && (
        <div className="flex items-start gap-3 rounded-lg border border-[#38BDF8]/40 bg-[#0B162C] p-3.5 text-xs text-slate-200">
          <Eye className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
          <div>
            <span className="font-semibold text-white">{activeHotspot.clueTitle}: </span>
            {activeHotspot.clueText}
          </div>
        </div>
      )}

      {/* Secret Keyword Input */}
      <form
        onSubmit={handleVerifyCode}
        className="rounded-lg border border-slate-700/80 bg-[#060D1A]/90 p-4"
      >
        <label className="block text-sm font-medium text-slate-200" htmlFor="hidden-secret-input">
          {data.secretPrompt}
        </label>
        <div className="mt-3 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="hidden-secret-input"
              type="text"
              disabled={isSolved}
              value={answerInput}
              onChange={(e) => setAnswerInput(e.target.value)}
              placeholder={
                allFound
                  ? 'Ketik kata rahasia...'
                  : 'Periksa keempat titik cahaya di ruangan terlebih dahulu...'
              }
              className="font-mono-tabular w-full rounded-lg border border-slate-700 bg-[#0B162C] py-2.5 pl-10 pr-4 text-sm uppercase tracking-wider text-white placeholder:normal-case placeholder:tracking-normal placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none disabled:opacity-70"
            />
          </div>
          {!isSolved && (
            <button
              type="submit"
              disabled={!answerInput.trim()}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap shrink-0"
            >
              Verifikasi Sandi
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
