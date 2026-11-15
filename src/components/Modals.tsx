import { useEffect, useState } from 'react';
import {
  AlertTriangle,
  Award,
  BookOpen,
  Clock,
  Compass,
  Crown,
  Eye,
  EyeOff,
  FlaskConical,
  LockKeyhole,
  Play,
  RotateCcw,
  Search,
  Sparkles,
  Volume2,
  X,
} from 'lucide-react';
import { ACHIEVEMENTS } from '../data/achievements';
import { verifyTeacherPassword } from '../utils/storage';
import { soundFX } from '../utils/sound';

interface PauseModalProps {
  isOpen: boolean;
  playerName: string;
  elapsedSeconds: number;
  totalScore: number;
  onResume: () => void;
  onGoMap: () => void;
}

export function PauseModal({
  isOpen,
  playerName,
  elapsedSeconds,
  totalScore,
  onResume,
  onGoMap,
}: PauseModalProps) {
  if (!isOpen) return null;

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0B162C] p-6 shadow-2xl">
        <h2 className="font-display text-2xl font-bold text-white">Permainan Dijeda</h2>
        <p className="mt-2 text-sm text-slate-300">
          Penghitung waktu sementara dihentikan. Progres {playerName || 'Penjelajah'} tersimpan otomatis di peramban.
        </p>

        <div className="mt-5 grid grid-cols-2 gap-3 border-y border-slate-800 py-4 text-sm">
          <div>
            <p className="text-xs text-slate-400">Total Skor</p>
            <p className="font-mono-tabular mt-1 text-lg font-semibold text-[#D4AF37]">
              {totalScore} poin
            </p>
          </div>
          <div>
            <p className="text-xs text-slate-400">Waktu Aktif</p>
            <p className="font-mono-tabular mt-1 text-lg font-semibold text-[#38BDF8]">
              {formattedTime}
            </p>
          </div>
        </div>

        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={onResume}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
          >
            <Play className="h-4 w-4" />
            <span>Lanjutkan</span>
          </button>
          <button
            type="button"
            onClick={onGoMap}
            className="inline-flex flex-1 items-center justify-center rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 whitespace-nowrap"
          >
            Ke Peta Misi
          </button>
        </div>
      </div>
    </div>
  );
}

interface ConfirmResetModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirmReset: () => void;
}

export function ConfirmResetModal({ isOpen, onCancel, onConfirmReset }: ConfirmResetModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-slate-700 bg-[#0B162C] p-6 shadow-2xl">
        <h2 className="font-display text-xl font-bold text-white">Ulangi Permainan dari Awal?</h2>
        <p className="mt-2 text-sm leading-relaxed text-slate-300">
          Seluruh skor, keping kode sejarah yang telah terkumpul, dan progres level akan diatur ulang ke awal.
        </p>

        <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2 text-sm font-medium text-slate-200 transition-colors hover:border-slate-500 whitespace-nowrap"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirmReset}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700 whitespace-nowrap"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Ya, Ulangi Permainan</span>
          </button>
        </div>
      </div>
    </div>
  );
}

interface AchievementsModalProps {
  isOpen: boolean;
  unlockedIds: string[];
  onClose: () => void;
}

function renderBadgeIcon(key: string, unlocked: boolean) {
  const cls = `h-5 w-5 ${unlocked ? 'text-[#D4AF37]' : 'text-slate-500'}`;
  switch (key) {
    case 'compass':
      return <Compass className={cls} />;
    case 'search':
      return <Search className={cls} />;
    case 'flask':
      return <FlaskConical className={cls} />;
    case 'clock':
      return <Clock className={cls} />;
    case 'book':
      return <BookOpen className={cls} />;
    case 'crown':
      return <Crown className={cls} />;
    case 'spark':
      return <Sparkles className={cls} />;
    default:
      return <Award className={cls} />;
  }
}

export function AchievementsModal({ isOpen, unlockedIds, onClose }: AchievementsModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/85 p-4 backdrop-blur-md">
      <div className="max-h-[85vh] w-full max-w-2xl overflow-y-auto rounded-xl border border-slate-700 bg-[#0B162C] p-6 shadow-2xl">
        <div className="flex items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="font-display text-2xl font-bold text-white">Lencana Pencapaian</h2>
            <p className="mt-1 text-xs text-slate-400">
              Terbuka {unlockedIds.length} dari {ACHIEVEMENTS.length} lencana sejarah
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup panel lencana"
            className="rounded-lg border border-slate-700 p-2 text-slate-300 transition-colors hover:border-slate-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {ACHIEVEMENTS.map((ach) => {
            const unlocked = unlockedIds.includes(ach.id);
            return (
              <div
                key={ach.id}
                className={`rounded-lg border p-4 transition-colors ${
                  unlocked
                    ? 'border-[#D4AF37]/50 bg-[#12213D]'
                    : 'border-slate-800 bg-[#060D1A]/60 opacity-75'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                      unlocked
                        ? 'border-[#D4AF37]/40 bg-[#D4AF37]/10'
                        : 'border-slate-800 bg-slate-900'
                    }`}
                  >
                    {renderBadgeIcon(ach.iconKey, unlocked)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{ach.conditionLabel}</span>
                      <span aria-hidden="true">·</span>
                      <span className={unlocked ? 'text-emerald-400 font-medium' : 'text-slate-500'}>
                        {unlocked ? 'Diperoleh' : 'Terkunci'}
                      </span>
                    </div>
                    <h3 className="mt-1 text-sm font-semibold text-white">{ach.title}</h3>
                    <p className="mt-1 text-xs leading-relaxed text-slate-300">{ach.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

interface TeacherAuthModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onAuthenticated: () => void;
}

export function TeacherAuthModal({
  isOpen,
  onCancel,
  onAuthenticated,
}: TeacherAuthModalProps) {
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (verifyTeacherPassword(password)) {
      setPassword('');
      setError('');
      onAuthenticated();
    } else {
      setError('Kata sandi Mode Guru tidak sesuai. Akses ditolak.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/90 p-4 backdrop-blur-md">
      <div className="w-full max-w-md rounded-xl border border-[#D4AF37]/50 bg-[#0B162C] p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-[#D4AF37]/50 bg-[#D4AF37]/15 text-[#FDE68A]">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-[#D4AF37]">Akses Terbatas</p>
              <h2 className="font-display text-xl font-bold text-white">Verifikasi Mode Guru</h2>
            </div>
          </div>

          <button
            type="button"
            onClick={() => {
              setPassword('');
              setError('');
              onCancel();
            }}
            aria-label="Tutup dialog kata sandi guru"
            className="rounded-lg border border-slate-700 p-1.5 text-slate-400 hover:border-slate-500 hover:text-white"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="mt-4 text-sm leading-relaxed text-slate-300">
          Masukkan kata sandi guru untuk membuka pengelolaan Bank Soal dan daftar progres siswa.
        </p>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4">
          <div>
            <label htmlFor="teacher-pw-input" className="block text-xs font-medium text-slate-300">
              Kata Sandi Mode Guru
            </label>
            <div className="relative mt-1.5">
              <input
                id="teacher-pw-input"
                type={showPw ? 'text' : 'password'}
                autoFocus
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Masukkan kata sandi..."
                className="w-full rounded-lg border border-slate-700 bg-[#060D1A] py-2.5 pl-3.5 pr-10 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPw((s) => !s)}
                aria-label={showPw ? 'Sembunyikan sandi' : 'Lihat sandi'}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-1 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => {
                setPassword('');
                setError('');
                onCancel();
              }}
              className="rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2 text-sm font-medium text-slate-300 hover:border-slate-500 whitespace-nowrap"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={!password.trim()}
              className="rounded-lg bg-[#2563EB] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
            >
              Masuk Mode Guru
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

interface ViolationWarningModalProps {
  isOpen: boolean;
  reason: string;
  violationCount: number;
  onAcknowledge: () => void;
}

export function ViolationWarningModal({
  isOpen,
  reason,
  violationCount,
  onAcknowledge,
}: ViolationWarningModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(10);

  useEffect(() => {
    if (!isOpen) {
      soundFX.stopAlarm();
      return;
    }

    setSecondsLeft(10);
    soundFX.startAlarm();

    const interval = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          window.clearInterval(interval);
          soundFX.stopAlarm();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      window.clearInterval(interval);
      soundFX.stopAlarm();
    };
  }, [isOpen, violationCount]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-red-950/85 p-4 backdrop-blur-md">
      <div className="w-full max-w-lg rounded-xl border-2 border-red-500 bg-[#0B162C] p-6 shadow-2xl sm:p-7">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/70 bg-red-500/20 text-red-400">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <div>
            <p className="font-mono-tabular text-xs font-bold uppercase tracking-wider text-red-400">
              Peringatan Keras · Pelanggaran Integritas ke-{violationCount}
            </p>
            <h2 className="font-display mt-1 text-xl font-bold text-white sm:text-2xl">
              Aktivitas Terlarang Terdeteksi!
            </h2>
          </div>
        </div>

        <div className="mt-5 rounded-lg border border-red-500/40 bg-[#060D1A] p-4 text-sm leading-relaxed text-slate-200">
          <p>
            <span className="font-semibold text-red-300">Jenis Pelanggaran: </span>
            {reason}
          </p>
          <p className="mt-2 text-xs text-slate-300">
            Selama mengerjakan tantangan di dalam ruangan, sistem melarang perpindahan tab/jendela,
            klik kanan, salin-tempel (copy-paste), serta pembukaan DevTools. Pelanggaran ini
            otomatis tercatat pada laporan hasil siswa di Mode Guru.
          </p>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-800 bg-[#060D1A]/80 px-4 py-3 text-xs">
          <span className="inline-flex items-center gap-2 text-amber-300">
            <Volume2 className="h-4 w-4" />
            <span>
              {secondsLeft > 0
                ? 'Alarm peringatan aktif — layar dikunci sementara'
                : 'Kunci sementara selesai — silakan lanjutkan'}
            </span>
          </span>
          <span className="font-mono-tabular text-base font-bold text-red-400">
            {String(secondsLeft).padStart(2, '0')} dtk
          </span>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="button"
            disabled={secondsLeft > 0}
            onClick={() => {
              soundFX.stopAlarm();
              soundFX.click();
              onAcknowledge();
            }}
            className="w-full rounded-lg bg-red-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-400 sm:w-auto whitespace-nowrap"
          >
            {secondsLeft > 0
              ? `Tunggu ${secondsLeft} detik untuk melanjutkan...`
              : 'Saya Mengerti & Lanjutkan Pengerjaan'}
          </button>
        </div>
      </div>
    </div>
  );
}

