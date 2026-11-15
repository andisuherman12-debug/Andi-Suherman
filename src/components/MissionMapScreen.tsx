import { useEffect, useState } from 'react';
import { Award, CheckCircle2, ChevronRight, Clock, Lock, Sparkles, Trophy } from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { LevelData, PlayerProgress } from '../types/game';
import { SceneImage } from './SceneImage';
import { soundFX } from '../utils/sound';

interface MissionMapScreenProps {
  levels: LevelData[];
  progress: PlayerProgress;
  onEnterLevel: (levelId: number) => void;
  onOpenAchievements: () => void;
  onOpenFinalResult: () => void;
}

export function MissionMapScreen({
  levels,
  progress,
  onEnterLevel,
  onOpenAchievements,
  onOpenFinalResult,
}: MissionMapScreenProps) {
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(() => {
    if (!progress.nextLevelUnlockAt) return 0;
    return Math.max(0, Math.ceil((progress.nextLevelUnlockAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (!progress.nextLevelUnlockAt) {
      setCooldownSeconds(0);
      return;
    }
    const update = () => {
      setCooldownSeconds(
        Math.max(0, Math.ceil(((progress.nextLevelUnlockAt || 0) - Date.now()) / 1000))
      );
    };
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [progress.nextLevelUnlockAt]);

  const completedCount = levels.filter((l) => progress.levels[l.id]?.completed).length;
  const completionPct = Math.round((completedCount / levels.length) * 100);
  const allCompleted = completedCount === levels.length;

  const mins = Math.floor(progress.elapsedSeconds / 60);
  const secs = progress.elapsedSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Top Mission Overview & Progress Strip */}
      <section className="rounded-xl border border-slate-700/80 bg-[#0B162C] p-6">
        <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
          <div>
            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
              <span>Penjelajah: {progress.playerName}</span>
              {progress.playerClass && (
                <>
                  <span aria-hidden="true">·</span>
                  <span>Kelas {progress.playerClass}</span>
                </>
              )}
              <span aria-hidden="true">·</span>
              <span>Chronos Historical Research Center</span>
            </div>
            <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
              Peta Misi Laboratorium Sejarah
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onOpenAchievements}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37]/60 whitespace-nowrap"
            >
              <Award className="h-4 w-4 text-[#D4AF37]" />
              <span>
                Lencana ({progress.unlockedAchievementIds.length}/{ACHIEVEMENTS.length})
              </span>
            </button>

            {allCompleted && (
              <button
                type="button"
                onClick={onOpenFinalResult}
                className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#060D1A] transition-colors hover:bg-[#F59E0B] whitespace-nowrap"
              >
                <Trophy className="h-4 w-4" />
                <span>Lihat Evaluasi Akhir</span>
              </button>
            )}
          </div>
        </div>

        {/* Clean 4-Metric Progress Summary */}
        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-800 pt-5 sm:grid-cols-4">
          <div>
            <p className="text-xs text-slate-400">Total Skor</p>
            <p className="font-mono-tabular mt-1 text-xl font-bold text-[#D4AF37]">
              {progress.totalScore} poin
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Keping Kode Terkumpul</p>
            <p className="font-mono-tabular mt-1 text-xl font-bold text-[#38BDF8]">
              {completedCount} / {levels.length}
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Penyelesaian Misi</p>
            <p className="font-mono-tabular mt-1 text-xl font-bold text-emerald-400">
              {completionPct}%
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Waktu Eksplorasi</p>
            <p className="font-mono-tabular mt-1 text-xl font-bold text-slate-200">
              {formattedTime}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="h-2 w-full overflow-hidden rounded-full bg-[#060D1A]">
            <div
              className="h-full rounded-full bg-gradient-to-r from-[#2563EB] via-[#38BDF8] to-[#D4AF37] transition-all duration-300"
              style={{ width: `${completionPct}%` }}
            />
          </div>
        </div>

        {/* Collected Fragments Strip */}
        <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-slate-800/80 pt-4 text-xs">
          <span className="font-semibold text-slate-300">Keping Kode Sejarah:</span>
          {levels.map((lvl) => {
            const done = progress.levels[lvl.id]?.completed;
            return (
              <span
                key={lvl.id}
                className={`font-mono-tabular inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1 ${
                  done
                    ? 'border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#FDE68A]'
                    : 'border-slate-800 bg-[#060D1A] text-slate-500'
                }`}
              >
                <Sparkles className="h-3 w-3" />
                <span>{done ? lvl.fragmentName : `${lvl.fragmentSymbol} (Terkunci)`}</span>
              </span>
            );
          })}
        </div>
      </section>

      {cooldownSeconds > 0 && !allCompleted && (
        <div className="mt-5 flex items-center justify-between gap-3 rounded-xl border border-[#38BDF8]/50 bg-[#0B162C] px-5 py-3.5 text-xs">
          <div className="flex items-center gap-2.5 text-slate-200">
            <Clock className="h-4 w-4 shrink-0 text-[#38BDF8]" />
            <span>
              <strong>Waktu Istirahat Checkpoint:</strong> Kamu bebas beristirahat atau menutup
              jendela. Level berikutnya dapat diklik setelah 1 menit selesai.
            </span>
          </div>
          <span className="font-mono-tabular text-sm font-bold text-[#38BDF8] whitespace-nowrap">
            00:{String(cooldownSeconds).padStart(2, '0')}
          </span>
        </div>
      )}

      {/* 7 Chambers Blueprint Grid */}
      <section className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {levels.map((lvl) => {
          const state = progress.levels[lvl.id];
          const isUnlocked = state?.unlocked;
          const isCompleted = state?.completed;
          const isWaitingCooldown = isUnlocked && !isCompleted && cooldownSeconds > 0;

          return (
            <article
              key={lvl.id}
              className={`flex flex-col overflow-hidden rounded-xl border transition-colors ${
                isCompleted
                  ? 'border-emerald-500/40 bg-[#0B162C]'
                  : isUnlocked
                  ? 'border-[#38BDF8]/50 bg-[#0B162C]'
                  : 'border-slate-800 bg-[#060D1A]/75 opacity-75'
              } ${lvl.id === 7 ? 'md:col-span-2 lg:col-span-3' : ''}`}
            >
              <div className={lvl.id === 7 ? 'grid lg:grid-cols-12' : 'flex flex-1 flex-col'}>
                <div className={lvl.id === 7 ? 'lg:col-span-5' : ''}>
                  <SceneImage
                    src={lvl.imagePath}
                    alt={`${lvl.title} — ${lvl.subtitle}`}
                    aspectClassName={lvl.id === 7 ? 'aspect-video lg:h-full' : 'aspect-video'}
                    className="rounded-none border-0 border-b border-slate-800 lg:border-b-0"
                    scrimClassName="bg-gradient-to-t from-[#0B162C] via-[#060D1A]/25 to-transparent"
                  >
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                        {lvl.code} · {lvl.difficulty}
                      </span>
                      <span
                        className={`inline-flex items-center gap-1 font-medium ${
                          isCompleted
                            ? 'text-emerald-400'
                            : isUnlocked
                            ? 'text-[#38BDF8]'
                            : 'text-slate-400'
                        }`}
                      >
                        {isCompleted ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            <span>Selesai</span>
                          </>
                        ) : isUnlocked ? (
                          <span>Terbuka</span>
                        ) : (
                          <>
                            <Lock className="h-3.5 w-3.5" />
                            <span>Terkunci</span>
                          </>
                        )}
                      </span>
                    </div>
                  </SceneImage>
                </div>

                <div
                  className={`flex flex-1 flex-col justify-between p-5 ${
                    lvl.id === 7 ? 'lg:col-span-7 lg:p-6' : ''
                  }`}
                >
                  <div>
                    <p className="text-xs font-medium text-slate-400">{lvl.topic}</p>
                    <h2 className="font-display mt-1 text-xl font-bold text-white">
                      {lvl.title}
                    </h2>
                    <p className="mt-1 text-xs font-medium text-[#38BDF8]">{lvl.subtitle}</p>
                    <p className="mt-3 text-sm leading-relaxed text-slate-300">
                      {lvl.missionBrief}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800/80 pt-4">
                    <span className="font-mono-tabular text-xs text-slate-400">
                      Hadiah: <span className="text-[#FDE68A]">{lvl.fragmentName}</span>
                    </span>

                    <button
                      type="button"
                      disabled={!isUnlocked || isWaitingCooldown}
                      onClick={() => {
                        soundFX.click();
                        onEnterLevel(lvl.id);
                      }}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                        isCompleted
                          ? 'border border-emerald-500/50 bg-emerald-950/30 text-emerald-200 hover:bg-emerald-900/40'
                          : isWaitingCooldown
                          ? 'cursor-not-allowed border border-slate-700 bg-slate-800/80 text-slate-300'
                          : isUnlocked
                          ? 'bg-[#2563EB] text-white hover:bg-[#1D4ED8]'
                          : 'cursor-not-allowed bg-slate-800 text-slate-500'
                      }`}
                    >
                      <span>
                        {isCompleted
                          ? 'Tinjau Ruangan'
                          : isWaitingCooldown
                          ? `Istirahat (00:${String(cooldownSeconds).padStart(2, '0')})`
                          : isUnlocked
                          ? 'Masuki Ruangan'
                          : 'Selesaikan Level Sebelumnya'}
                      </span>
                      {isUnlocked && !isWaitingCooldown && <ChevronRight className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </section>
    </main>
  );
}
