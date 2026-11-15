import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BookOpenCheck,
  CheckCircle2,
  Clock,
  Compass,
  Lightbulb,
} from 'lucide-react';
import { LevelData, LevelProgress } from '../types/game';
import { soundFX } from '../utils/sound';

interface LevelEvaluationScreenProps {
  level: LevelData;
  levelProgress: LevelProgress;
  isLastLevel: boolean;
  nextLevelUnlockAt?: number;
  onContinueNext: () => void;
  onBackToMap: () => void;
}

export function LevelEvaluationScreen({
  level,
  levelProgress,
  isLastLevel,
  nextLevelUnlockAt,
  onContinueNext,
  onBackToMap,
}: LevelEvaluationScreenProps) {
  const allChallenges = [...level.challenges, level.bonusChallenge];

  const [cooldownSeconds, setCooldownSeconds] = useState<number>(() => {
    if (isLastLevel || !nextLevelUnlockAt) return 0;
    return Math.max(0, Math.ceil((nextLevelUnlockAt - Date.now()) / 1000));
  });

  useEffect(() => {
    if (isLastLevel || !nextLevelUnlockAt) {
      setCooldownSeconds(0);
      return;
    }

    const update = () => {
      const rem = Math.max(0, Math.ceil((nextLevelUnlockAt - Date.now()) / 1000));
      setCooldownSeconds(rem);
    };

    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, [isLastLevel, nextLevelUnlockAt]);

  const formattedCooldown = `00:${String(cooldownSeconds).padStart(2, '0')}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-xl border border-slate-700/80 bg-[#0B162C] p-6 sm:p-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#D4AF37]">
              <span>Checkpoint Evaluasi</span>
              <span aria-hidden="true">·</span>
              <span>{level.code}</span>
              <span aria-hidden="true">·</span>
              <span>{level.fragmentName}</span>
            </div>
            <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
              {level.title}
            </h1>
          </div>

          <div className="text-right">
            <p className="text-xs text-slate-400">Poin Diperoleh di Ruangan</p>
            <p className="font-mono-tabular text-2xl font-bold text-[#D4AF37]">
              +{levelProgress.scoreEarned} poin
            </p>
          </div>
        </div>

        {/* Checkpoint 1-Minute Rest Banner */}
        {!isLastLevel && (
          <div
            className={`mt-6 flex flex-col justify-between gap-4 rounded-xl border p-4 sm:flex-row sm:items-center ${
              cooldownSeconds > 0
                ? 'border-[#38BDF8]/50 bg-[#12213D]/70'
                : 'border-emerald-500/40 bg-emerald-950/20'
            }`}
          >
            <div className="flex items-start gap-3">
              <Clock
                className={`mt-0.5 h-5 w-5 shrink-0 ${
                  cooldownSeconds > 0 ? 'text-[#38BDF8]' : 'text-emerald-400'
                }`}
              />
              <div>
                <h2 className="text-sm font-semibold text-white">
                  {cooldownSeconds > 0
                    ? 'Waktu Istirahat Wajib Checkpoint (1 Menit)'
                    : 'Waktu Istirahat Checkpoint Selesai'}
                </h2>
                <p className="mt-1 text-xs leading-relaxed text-slate-300">
                  {cooldownSeconds > 0
                    ? 'Kamu diperbolehkan beristirahat, menutup jendela peramban, atau melakukan aktivitas lain tanpa terkena deteksi pelanggaran. Level berikutnya dapat diklik setelah hitungan mundur selesai.'
                    : 'Jeda istirahat telah berakhir. Kamu dapat melanjutkan investigasi ke ruangan berikutnya sekarang.'}
                </p>
              </div>
            </div>

            <div className="shrink-0 text-left sm:text-right">
              <p className="text-[11px] text-slate-400">Hitung Mundur</p>
              <p
                className={`font-mono-tabular text-xl font-bold ${
                  cooldownSeconds > 0 ? 'text-[#38BDF8]' : 'text-emerald-400'
                }`}
              >
                {formattedCooldown}
              </p>
            </div>
          </div>
        )}

        {/* 1. Ringkasan Materi */}
        <section className="mt-6">
          <div className="flex items-center gap-2 text-sm font-semibold text-[#38BDF8]">
            <BookOpenCheck className="h-4 w-4" />
            <h2>Ringkasan Materi: {level.topic}</h2>
          </div>
          <ul className="mt-3 space-y-2 rounded-lg border border-slate-800 bg-[#060D1A]/75 p-4 text-sm leading-relaxed text-slate-200">
            {level.materialSummary.map((point, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="font-mono-tabular mt-0.5 text-xs font-semibold text-[#D4AF37]">
                  0{idx + 1}.
                </span>
                <span>{point}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* 2. Kunci Jawaban & Pembahasan Setiap Tantangan */}
        <section className="mt-7">
          <h2 className="text-sm font-semibold text-white">
            Kunci Jawaban dan Pembahasan Tantangan
          </h2>
          <div className="mt-3 space-y-3">
            {allChallenges.map((ch, idx) => (
              <div
                key={ch.id}
                className="rounded-lg border border-slate-800 bg-[#060D1A]/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-400">
                  <span className="font-semibold text-[#D4AF37]">
                    {ch.isBonus ? 'Tantangan Bonus' : `Tantangan ${idx + 1}`} · {ch.mechanicLabel}
                  </span>
                  <span className="text-emerald-400">
                    {ch.isBonus
                      ? levelProgress.bonusCompleted
                        ? levelProgress.bonusCorrect
                          ? 'Benar (+50)'
                          : 'Dicoba (+0)'
                        : 'Dilewati'
                      : levelProgress.timedOutIds?.includes(ch.id)
                      ? 'Waktu Habis (+0)'
                      : 'Terselesaikan'}
                  </span>
                </div>
                <h3 className="mt-1 text-sm font-semibold text-white">{ch.title}</h3>
                <p className="mt-2 text-xs text-emerald-300">
                  <span className="font-semibold">Jawaban Tepat: </span>
                  {ch.correctSummary}
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-slate-300">
                  <span className="font-semibold text-slate-200">Pembahasan: </span>
                  {ch.explanation}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* 3. Kompetensi & Saran */}
        <section className="mt-7 grid gap-4 md:grid-cols-2">
          <div className="rounded-lg border border-slate-800 bg-[#060D1A]/75 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              <span>Kompetensi yang Berhasil Dikuasai</span>
            </div>
            <ul className="mt-3 space-y-2 text-xs leading-relaxed text-slate-200">
              {level.competencies.map((comp, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="text-emerald-400">•</span>
                  <span>{comp}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-lg border border-slate-800 bg-[#060D1A]/75 p-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-[#FDE68A]">
              <Lightbulb className="h-4 w-4" />
              <span>Saran Memperkuat Pemahaman</span>
            </div>
            <p className="mt-3 text-xs leading-relaxed text-slate-200">
              {level.improvementAdvice}
            </p>
          </div>
        </section>

        {/* Footer Actions */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
          <button
            type="button"
            onClick={() => {
              soundFX.click();
              onBackToMap();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 whitespace-nowrap"
          >
            <Compass className="h-4 w-4" />
            <span>Kembali ke Peta Misi</span>
          </button>

          <button
            type="button"
            disabled={!isLastLevel && cooldownSeconds > 0}
            onClick={() => {
              soundFX.click();
              onContinueNext();
            }}
            className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 whitespace-nowrap"
          >
            <span>
              {isLastLevel
                ? 'Satukan Keping Kode & Lihat Hasil Akhir'
                : cooldownSeconds > 0
                ? `Tunggu Istirahat (${formattedCooldown})`
                : `Masuk ke Ruang ${level.id + 1}`}
            </span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </main>
  );
}
