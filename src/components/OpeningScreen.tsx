import { useMemo, useState } from 'react';
import {
  ArrowRight,
  BookOpen,
  Compass,
  GraduationCap,
  KeyRound,
  Play,
  RotateCcw,
  ShieldCheck,
  UserCheck,
} from 'lucide-react';
import { motion } from 'motion/react';
import { GAME_IMAGES } from '../data/assets';
import { PlayerProgress } from '../types/game';
import { findStudentRecord } from '../utils/storage';
import { SceneImage } from './SceneImage';

interface OpeningScreenProps {
  lastSavedProgress: PlayerProgress | null;
  onStartStudentNew: (name: string, studentClass: string) => void;
  onResumeStudentRecord: (saved: PlayerProgress) => void;
  onOpenTeacherMode: () => void;
}

export function OpeningScreen({
  lastSavedProgress,
  onStartStudentNew,
  onResumeStudentRecord,
  onOpenTeacherMode,
}: OpeningScreenProps) {
  const [name, setName] = useState(lastSavedProgress?.playerName || '');
  const [studentClass, setStudentClass] = useState(lastSavedProgress?.playerClass || '');
  const [error, setError] = useState('');

  // Automatically check if an existing saved record matches Name + Class
  const matchedRecord = useMemo(() => {
    if (name.trim().length < 2 || studentClass.trim().length < 1) return null;
    return findStudentRecord(name, studentClass);
  }, [name, studentClass]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = name.trim();
    const cleanClass = studentClass.trim();

    if (cleanName.length < 2) {
      setError('Masukkan nama lengkap atau panggilan minimal 2 karakter.');
      return;
    }
    if (cleanClass.length < 1) {
      setError('Masukkan kelas kamu (contoh: X-1, X IPA 1, atau X Merdeka 2).');
      return;
    }

    setError('');
    if (matchedRecord) {
      onResumeStudentRecord(matchedRecord.progress);
    } else {
      onStartStudentNew(cleanName, cleanClass);
    }
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
      {/* Hero Split */}
      <section className="grid items-stretch gap-8 lg:grid-cols-12">
        <div className="flex flex-col justify-center space-y-5 lg:col-span-6">
          <div className="flex flex-wrap items-center gap-2 text-xs font-medium text-[#D4AF37]">
            <span>Sejarah SMA Kelas X</span>
            <span aria-hidden="true">·</span>
            <span>Escape Room Investigasi</span>
            <span aria-hidden="true">·</span>
            <span>7 Ruangan Misteri</span>
          </div>

          <h1 className="font-display text-3xl font-bold leading-tight tracking-tight text-white [text-wrap:balance] sm:text-5xl">
            THE HISTORY ESCAPE: THE LOST TIMELINE
          </h1>

          <p className="text-base font-medium text-[#38BDF8] sm:text-lg">
            Pecahkan Misteri Ruang Waktu
          </p>

          <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
            Chronos Engine mengalami kerusakan di Chronos Historical Research Center. Masukkan
            identitas siswa untuk memulai petualangan baru atau melanjutkan progres tersimpan
            dengan menuliskan kembali nama dan kelas yang sama.
          </p>

          {/* Student Entry Form right on Beranda Awal */}
          <form
            onSubmit={handleSubmit}
            className="rounded-xl border border-slate-700/80 bg-[#0B162C] p-5 space-y-4"
          >
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-white">
                <UserCheck className="h-4 w-4 text-[#38BDF8]" />
                <span>Mode Siswa · Kartu Akses Laboratorium</span>
              </div>
              <span className="text-xs text-slate-400">Progres tersimpan otomatis</span>
            </div>

            <div className="grid gap-3 sm:grid-cols-12">
              <div className="sm:col-span-7">
                <label
                  htmlFor="home-student-name"
                  className="block text-xs font-medium text-slate-300"
                >
                  Nama Siswa
                </label>
                <input
                  id="home-student-name"
                  type="text"
                  maxLength={45}
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Contoh: Nadia Pratama"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <div className="sm:col-span-5">
                <label
                  htmlFor="home-student-class"
                  className="block text-xs font-medium text-slate-300"
                >
                  Kelas
                </label>
                <input
                  id="home-student-class"
                  type="text"
                  maxLength={20}
                  list="kelas-sma-options"
                  value={studentClass}
                  onChange={(e) => {
                    setStudentClass(e.target.value);
                    if (error) setError('');
                  }}
                  placeholder="Contoh: X-1 / X IPA 2"
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
                />
                <datalist id="kelas-sma-options">
                  <option value="X-1" />
                  <option value="X-2" />
                  <option value="X-3" />
                  <option value="X-4" />
                  <option value="X IPA 1" />
                  <option value="X IPA 2" />
                  <option value="X IPS 1" />
                  <option value="X IPS 2" />
                </datalist>
              </div>
            </div>

            {error && <p className="text-xs text-amber-400">{error}</p>}

            {/* Auto-Detected Saved Progress Banner */}
            {matchedRecord && (
              <div className="rounded-lg border border-emerald-500/40 bg-emerald-950/25 p-3.5 text-xs">
                <p className="font-semibold text-emerald-300">
                  Progres Tersimpan Ditemukan!
                </p>
                <p className="mt-1 text-slate-200">
                  {matchedRecord.playerName} · Kelas {matchedRecord.playerClass} · Level{' '}
                  {matchedRecord.highestLevel}/7 · Skor{' '}
                  <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                    {matchedRecord.totalScore} poin
                  </span>
                </p>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-3 pt-1">
              {matchedRecord ? (
                <>
                  <button
                    type="submit"
                    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
                  >
                    <Play className="h-4 w-4" />
                    <span>Lanjutkan Petualangan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onStartStudentNew(name.trim(), studentClass.trim())}
                    className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-3 text-xs font-semibold text-slate-300 transition-colors hover:border-amber-400/60 hover:text-white whitespace-nowrap"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    <span>Mulai Baru</span>
                  </button>
                </>
              ) : (
                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2.5 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold tracking-wide text-white shadow-lg shadow-[#2563EB]/25 transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
                >
                  <span>MULAI PETUALANGAN</span>
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </form>

          {/* Teacher Mode Entry */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0B162C]/70 px-4 py-3">
            <div className="flex items-center gap-2.5 text-xs text-slate-300">
              <GraduationCap className="h-4 w-4 text-[#D4AF37]" />
              <span>Pengajar Sejarah? Kelola bank soal & pantau progres siswa.</span>
            </div>
            <button
              type="button"
              onClick={onOpenTeacherMode}
              className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/10 px-4 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:bg-[#D4AF37]/20 whitespace-nowrap shrink-0"
            >
              <BookOpen className="h-3.5 w-3.5" />
              <span>Buka Mode Guru</span>
            </button>
          </div>
        </div>

        {/* Animated Chronos Engine Visual */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="relative lg:col-span-6"
        >
          <SceneImage
            src={GAME_IMAGES.hero}
            alt="Laboratorium Chronos Historical Research Center dan mesin waktu Chronos Engine"
            aspectClassName="aspect-video lg:aspect-auto lg:h-full lg:min-h-[420px]"
            scrimClassName="bg-gradient-to-t from-[#060D1A]/85 via-[#060D1A]/20 to-[#060D1A]/25"
          >
            {/* Subtle Animated Astrolabe Time Machine Rings Overlay */}
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <svg
                viewBox="0 0 240 240"
                className="h-48 w-48 opacity-65 sm:h-64 sm:w-64"
                aria-hidden="true"
              >
                <g className="origin-center animate-astrolabe-cw">
                  <circle
                    cx="120"
                    cy="120"
                    r="102"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.2"
                    strokeDasharray="10 6"
                  />
                  <circle
                    cx="120"
                    cy="120"
                    r="88"
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="0.9"
                    strokeDasharray="4 8"
                  />
                </g>
                <g className="origin-center animate-astrolabe-ccw">
                  <circle
                    cx="120"
                    cy="120"
                    r="68"
                    fill="none"
                    stroke="#D4AF37"
                    strokeWidth="1.5"
                    strokeDasharray="18 8 4 8"
                  />
                  <polygon points="120,38 124,48 116,48" fill="#D4AF37" />
                  <polygon points="120,202 124,192 116,192" fill="#38BDF8" />
                </g>
              </svg>
            </div>

            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between gap-4 border-t border-white/10 pt-3 text-xs text-slate-200">
              <span>Chronos Historical Research Center</span>
              <span className="font-mono-tabular text-[#D4AF37]">7 Keping Kode Sejarah</span>
            </div>
          </SceneImage>
        </motion.div>
      </section>

      {/* 3-Column Learning & Gameplay Pillars */}
      <section className="mt-10 grid gap-4 border-t border-slate-800/90 pt-8 md:grid-cols-3">
        <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-5">
          <Compass className="h-5 w-5 text-[#D4AF37]" />
          <h2 className="mt-3 text-base font-semibold text-white">7 Ruangan & Audio Ambience</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
            Setiap ruangan memiliki latar suara atmosferik unik—mulai dari bisikan ruang batu
            hingga dengung mekanis mesin waktu.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-5">
          <KeyRound className="h-5 w-5 text-[#38BDF8]" />
          <h2 className="mt-3 text-base font-semibold text-white">Simpan & Lanjutkan Kapan Saja</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
            Tutup halaman kapan pun dan lanjutkan kembali hanya dengan menuliskan nama dan kelas
            yang sama pada beranda awal.
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-5">
          <ShieldCheck className="h-5 w-5 text-emerald-400" />
          <h2 className="mt-3 text-base font-semibold text-white">Bank Soal & Pantauan Guru</h2>
          <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
            Guru dapat menyunting soal menjadi bank soal aktif serta memantau daftar progres dan
            pencarian siswa yang mengerjakan.
          </p>
        </div>
      </section>
    </main>
  );
}
