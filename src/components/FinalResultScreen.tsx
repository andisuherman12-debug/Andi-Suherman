import { useEffect, useRef, useState } from 'react';
import {
  Award,
  Camera,
  CheckCircle2,
  Compass,
  Crown,
  Download,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ACHIEVEMENTS } from '../data/achievements';
import { GAME_IMAGES } from '../data/assets';
import { LevelData, PlayerProgress } from '../types/game';
import { downloadCompletionPosterPNG } from '../utils/poster';
import { generateCompletionCode, resizeImageFileToDataUrl } from '../utils/storage';
import { SceneImage } from './SceneImage';
import { soundFX } from '../utils/sound';

interface FinalResultScreenProps {
  levels: LevelData[];
  progress: PlayerProgress;
  onUpdatePhoto: (photoDataUrl: string) => void;
  onBackToMap: () => void;
  onRequestReset: () => void;
}

export function FinalResultScreen({
  levels,
  progress,
  onUpdatePhoto,
  onBackToMap,
  onRequestReset,
}: FinalResultScreenProps) {
  const [photoError, setPhotoError] = useState('');
  const [isExporting, setIsExporting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const cameraInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    soundFX.victory();
  }, []);

  let totalMainSolved = 0;
  let totalFirstTry = 0;
  let totalAttempts = 0;
  let highestLevel = 1;

  levels.forEach((lvl) => {
    const st = progress.levels[lvl.id];
    if (!st) return;
    if (st.unlocked && lvl.id > highestLevel) highestLevel = lvl.id;
    if (st.completed && lvl.id > highestLevel) highestLevel = lvl.id;
    totalMainSolved += st.completedChallengeIds.length;
    if (st.bonusCompleted && st.bonusCorrect) totalMainSolved += 1;
    totalFirstTry += st.firstTryCorrectIds.length;
    totalAttempts += Math.max(st.attemptedIds.length, st.completedChallengeIds.length);
  });

  const accuracyPct =
    totalAttempts > 0 ? Math.min(100, Math.round((totalFirstTry / totalAttempts) * 100)) : 0;

  let tierTitle = 'Apprentice Historian';
  let tierEvaluation =
    'Kamu sudah menuntaskan misi pelarian dan mengenal dasar ilmu sejarah, namun masih perlu mengulas kembali pembedaan sumber sejarah, kritik eksternal-internal, serta keterkaitan unsur ruang dan waktu.';

  if (accuracyPct >= 90) {
    tierTitle = 'Master Historian';
    tierEvaluation =
      'Penguasaan luar biasa! Kamu mampu berpikir historis secara kritis, membedakan sumber dan metode penelitian dengan presisi tinggi, serta menyusun interpretasi sejarah berbasis bukti.';
  } else if (accuracyPct >= 80) {
    tierTitle = 'Advanced Historian';
    tierEvaluation =
      'Pemahaman sangat baik! Kamu menguasai hampir seluruh konsep pengantar ilmu sejarah dan penelitian sejarah dengan analisis yang kuat dan logis.';
  } else if (accuracyPct >= 70) {
    tierTitle = 'Junior Historian';
    tierEvaluation =
      'Pemahaman cukup baik! Kamu memahami konsep inti sejarah, dan dengan latihan analisis sumber serta kritik dokumen lebih lanjut kemampuanmu akan semakin tajam.';
  }

  const unlockedBadges = ACHIEVEMENTS.filter((a) =>
    progress.unlockedAchievementIds.includes(a.id)
  );

  const verificationCode =
    progress.completionCode ||
    generateCompletionCode(progress.playerName, progress.playerClass, progress.totalScore);

  const completedDateText = progress.completedAt
    ? new Date(progress.completedAt).toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : new Date().toLocaleDateString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });

  const handlePhotoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setPhotoError('Pilih file gambar (JPG/PNG) untuk foto autentifikasi.');
      return;
    }
    try {
      setPhotoError('');
      const dataUrl = await resizeImageFileToDataUrl(file, 360);
      soundFX.success();
      onUpdatePhoto(dataUrl);
    } catch {
      setPhotoError('Gagal memproses foto. Coba gunakan gambar lain.');
    }
  };

  const handleDownloadPoster = async () => {
    soundFX.click();
    setIsExporting(true);
    try {
      await downloadCompletionPosterPNG({
        playerName: progress.playerName,
        playerClass: progress.playerClass || '-',
        playerPhoto: progress.playerPhoto,
        tierTitle,
        totalScore: progress.totalScore,
        accuracyPct,
        elapsedSeconds: progress.elapsedSeconds,
        completionCode: verificationCode,
        completedAtText: completedDateText,
        fragmentNames: levels.map((l) => l.fragmentName),
      });
    } finally {
      setIsExporting(false);
    }
  };

  const mins = Math.floor(progress.elapsedSeconds / 60);
  const secs = progress.elapsedSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <motion.section
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="overflow-hidden rounded-xl border border-[#D4AF37]/60 bg-[#0B162C]"
      >
        <SceneImage
          src={GAME_IMAGES.level7}
          alt="Chronos Core aktif dan pintu keluar laboratorium terbuka"
          className="rounded-none border-0 border-b border-slate-800"
          scrimClassName="bg-gradient-to-t from-[#0B162C] via-[#060D1A]/35 to-transparent"
        >
          <div className="absolute bottom-5 left-6 right-6">
            <p className="font-mono-tabular text-xs font-semibold uppercase tracking-widest text-[#D4AF37]">
              Misi Selesai · Protokol Penguncian Terbuka
            </p>
            <h1 className="font-display mt-1 text-3xl font-bold text-white sm:text-4xl">
              Chronos Core Berhasil Diaktifkan!
            </h1>
          </div>
        </SceneImage>

        <div className="p-6 sm:p-8 space-y-8">
          {/* Answer to Core Story Conflict */}
          <div className="rounded-xl border border-[#38BDF8]/40 bg-[#060D1A]/90 p-5">
            <p className="text-xs font-semibold text-[#38BDF8]">
              ARCHIVIST · Jawaban Misteri Utama Laboratorium
            </p>
            <p className="mt-2 text-sm italic text-slate-300">
              "Jika masa lalu tidak dapat diulang, bagaimana manusia bisa mengetahui bahwa suatu
              peristiwa benar-benar pernah terjadi?"
            </p>
            <p className="mt-2.5 text-sm leading-relaxed text-white">
              Manusia tidak membutuhkan mesin waktu fiktif untuk mengulang masa lalu. Kebenaran
              peristiwa masa lalu diketahui melalui <strong>jejak dan sumber sejarah</strong> yang
              dikumpulkan secara sistematis, diuji keaslian dan kredibilitasnya lewat{' '}
              <strong>kritik eksternal dan internal</strong>, ditafsirkan dalam ikatan{' '}
              <strong>manusia, ruang, dan waktu</strong>, serta disajikan sebagai{' '}
              <strong>historiografi</strong> yang dapat dipertanggungjawabkan.
            </p>
          </div>

          {/* ================================================================= */}
          {/* POSTER AUTENTIKASI KELULUSAN (NAMA, KELAS, FOTO, KODE VERIFIKASI) */}
          {/* ================================================================= */}
          <section className="rounded-xl border border-[#D4AF37]/60 bg-[#060D1A]/90 p-5 sm:p-6">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-800 pb-4 sm:flex-row sm:items-center">
              <div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Bukti Autentikasi Penyelesaian</span>
                </div>
                <h2 className="font-display mt-1 text-xl font-bold text-white sm:text-2xl">
                  Poster Kelulusan Siswa
                </h2>
                <p className="mt-1 text-xs text-slate-300">
                  Unggah atau ambil fotomu, lalu unduh poster autentikasi sebagai bukti kepada guru
                  bahwa kamu telah menuntaskan seluruh 7 ruangan.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2.5">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoFile}
                  className="hidden"
                />
                <input
                  ref={cameraInputRef}
                  type="file"
                  accept="image/*"
                  capture="user"
                  onChange={handlePhotoFile}
                  className="hidden"
                />

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0B162C] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#38BDF8] whitespace-nowrap"
                >
                  <Upload className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>{progress.playerPhoto ? 'Ganti Foto' : 'Unggah Foto'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => cameraInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#0B162C] px-3.5 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37] whitespace-nowrap"
                >
                  <Camera className="h-3.5 w-3.5 text-[#D4AF37]" />
                  <span>Kamera</span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadPoster}
                  className="inline-flex items-center gap-1.5 rounded-lg bg-[#D4AF37] px-4 py-2 text-xs font-bold text-[#060D1A] transition-colors hover:bg-[#F59E0B] disabled:opacity-60 whitespace-nowrap"
                >
                  <Download className="h-3.5 w-3.5" />
                  <span>{isExporting ? 'Memproses...' : 'Unduh Poster (PNG)'}</span>
                </button>
              </div>
            </div>

            {photoError && <p className="mt-3 text-xs text-amber-400">{photoError}</p>}

            {/* Live Ornamental Poster Card Preview */}
            <div className="mt-6 mx-auto max-w-2xl rounded-xl border-2 border-[#D4AF37] bg-gradient-to-b from-[#081226] via-[#0B162C] to-[#060D1A] p-6 sm:p-8 text-center shadow-2xl">
              <div className="rounded-lg border border-[#D4AF37]/40 p-5 sm:p-7">
                <p className="text-[11px] font-semibold tracking-widest text-[#38BDF8]">
                  CHRONOS HISTORICAL RESEARCH CENTER · SEJARAH SMA KELAS X
                </p>
                <h3 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
                  THE HISTORY ESCAPE
                </h3>
                <p className="font-display text-sm font-semibold tracking-wider text-[#D4AF37]">
                  SERTIFIKAT PENYELESAIAN MISI
                </p>

                {/* Student Photo Badge */}
                <div className="mx-auto mt-6 h-32 w-32 overflow-hidden rounded-xl border-2 border-[#D4AF37] bg-[#12213D] shadow-lg">
                  {progress.playerPhoto ? (
                    <img
                      src={progress.playerPhoto}
                      alt={`Foto autentikasi ${progress.playerName}`}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full flex-col items-center justify-center p-2 text-center">
                      <Camera className="h-6 w-6 text-[#D4AF37]/80" />
                      <span className="mt-1.5 text-[11px] text-slate-300">
                        Unggah Foto Siswa
                      </span>
                    </div>
                  )}
                </div>

                <p className="mt-5 text-xs uppercase tracking-wider text-slate-400">
                  Diberikan kepada Penjelajah Arsip
                </p>
                <h4 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
                  {progress.playerName}
                </h4>
                <p className="mt-1 text-sm font-semibold text-[#38BDF8]">
                  Kelas {progress.playerClass || '-'}
                </p>

                <div className="mx-auto mt-4 inline-block rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/15 px-5 py-2">
                  <span className="font-display text-base font-bold text-[#FDE68A]">
                    {tierTitle}
                  </span>
                </div>

                {/* Poster Stats Strip */}
                <div className="mt-6 grid grid-cols-2 gap-3 rounded-lg border border-slate-800 bg-[#060D1A]/85 p-4 text-center sm:grid-cols-4">
                  <div>
                    <p className="text-[11px] text-slate-400">Total Skor</p>
                    <p className="font-mono-tabular mt-0.5 text-base font-bold text-[#D4AF37]">
                      {progress.totalScore}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Ketepatan</p>
                    <p className="font-mono-tabular mt-0.5 text-base font-bold text-emerald-400">
                      {accuracyPct}%
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Ruangan</p>
                    <p className="font-mono-tabular mt-0.5 text-base font-bold text-[#38BDF8]">
                      7 / 7
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-400">Waktu</p>
                    <p className="font-mono-tabular mt-0.5 text-base font-bold text-white">
                      {formattedTime}
                    </p>
                  </div>
                </div>

                {/* Authentication Footer */}
                <div className="mt-5 flex flex-col items-center justify-between gap-3 rounded-lg border border-[#38BDF8]/30 bg-[#12213D]/60 px-4 py-3 text-left sm:flex-row">
                  <div className="text-xs text-slate-300">
                    <p className="font-semibold text-[#38BDF8]">Autentikasi Penyelesaian</p>
                    <p className="mt-0.5">Tanggal Selesai: {completedDateText}</p>
                  </div>
                  <div className="text-center sm:text-right">
                    <p className="text-[11px] text-slate-400">Kode Verifikasi</p>
                    <p className="font-mono-tabular text-base font-bold text-[#FDE68A]">
                      {verificationCode}
                    </p>
                    <p className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-400">
                      <CheckCircle2 className="h-3 w-3" />
                      <span>Terverifikasi ARCHIVIST</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4-Metric Final Scorecard */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-[#060D1A]/75 p-5 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Total Skor</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-[#D4AF37]">
                {progress.totalScore}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Tantangan Selesai</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-white">
                {totalMainSolved}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Ketepatan Jawaban</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-emerald-400">
                {accuracyPct}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Level Tertinggi</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-[#38BDF8]">
                Level {highestLevel} / 7
              </p>
            </div>
          </div>

          {/* Tier & Learning Evaluation */}
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#12213D]/60 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#FDE68A]">
                  <Crown className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-300">
                    Kategori Pencapaian · {progress.playerName}
                    {progress.playerClass ? ` · Kelas ${progress.playerClass}` : ''}
                  </p>
                  <h2 className="font-display text-2xl font-bold text-[#FDE68A]">{tierTitle}</h2>
                </div>
              </div>
              <span className="font-mono-tabular text-xs text-slate-300">
                Skor Ketepatan: {accuracyPct} / 100
              </span>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-slate-200">{tierEvaluation}</p>
            <p className="mt-3 text-xs text-slate-400">
              Catatan: Kategori ini merupakan gamifikasi pencapaian belajar dalam permainan untuk
              memotivasi pemahaman konsep sejarah, bukan pengganti penilaian akademik resmi sekolah.
            </p>
          </div>

          {/* Collected Fragments & Achievements */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border border-slate-800 bg-[#060D1A]/75 p-5">
              <h3 className="text-sm font-semibold text-white">
                7 Keping Kode Sejarah yang Disatukan
              </h3>
              <ul className="mt-3 space-y-2 text-xs text-slate-300">
                {levels.map((lvl) => (
                  <li key={lvl.id} className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-2">
                      <Sparkles className="h-3.5 w-3.5 text-[#D4AF37]" />
                      <span className="font-medium text-white">{lvl.fragmentName}</span>
                    </span>
                    <span className="text-slate-400">{lvl.topic}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-slate-800 bg-[#060D1A]/75 p-5">
              <h3 className="text-sm font-semibold text-white">
                Achievement Diperoleh ({unlockedBadges.length}/{ACHIEVEMENTS.length})
              </h3>
              <div className="mt-3 space-y-2.5">
                {unlockedBadges.map((ach) => (
                  <div key={ach.id} className="flex items-start gap-2.5 text-xs">
                    <Award className="mt-0.5 h-4 w-4 shrink-0 text-[#D4AF37]" />
                    <div>
                      <p className="font-semibold text-white">{ach.title}</p>
                      <p className="text-slate-400">{ach.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                onBackToMap();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-sm font-medium text-slate-200 hover:border-slate-500 whitespace-nowrap"
            >
              <Compass className="h-4 w-4" />
              <span>Tinjau Peta & Ruangan</span>
            </button>

            <button
              type="button"
              onClick={() => {
                soundFX.click();
                onRequestReset();
              }}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Mainkan Lagi dari Awal</span>
            </button>
          </div>
        </div>
      </motion.section>
    </main>
  );
}
