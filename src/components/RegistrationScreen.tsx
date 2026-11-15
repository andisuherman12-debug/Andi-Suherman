import { useState } from 'react';
import { ArrowLeft, ArrowRight, UserCheck } from 'lucide-react';
import { GAME_IMAGES } from '../data/assets';

interface RegistrationScreenProps {
  initialName: string;
  onSubmitName: (name: string) => void;
  onBack: () => void;
}

export function RegistrationScreen({
  initialName,
  onSubmitName,
  onBack,
}: RegistrationScreenProps) {
  const [name, setName] = useState(initialName);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (trimmed.length < 2) {
      setError('Masukkan minimal 2 karakter nama untuk kartu akses laboratorium.');
      return;
    }
    onSubmitName(trimmed);
  };

  return (
    <main className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-2xl items-center px-4 py-10 sm:px-6">
      <div className="w-full rounded-xl border border-slate-700/80 bg-[#0B162C] p-6 sm:p-8">
        <div className="flex items-center gap-4 border-b border-slate-800 pb-5">
          <img
            src={GAME_IMAGES.archivist}
            alt="Emblem ARCHIVIST"
            referrerPolicy="no-referrer"
            className="h-14 w-14 rounded-lg border border-[#D4AF37]/50 object-cover"
          />
          <div>
            <p className="text-xs font-medium text-[#38BDF8]">Registrasi Penjelajah Arsip</p>
            <h1 className="font-display mt-0.5 text-2xl font-bold text-white sm:text-3xl">
              Identitas Peneliti Muda
            </h1>
          </div>
        </div>

        <p className="mt-5 text-sm leading-relaxed text-slate-300">
          Sebelum protokol darurat mengaktifkan ruang misi pertama, sistem keamanan Chronos
          Historical Research Center perlu mencatat namamu pada kartu akses arsip.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="player-name-input" className="block text-sm font-medium text-slate-200">
              Nama Lengkap atau Nama Panggilan
            </label>
            <div className="relative mt-2">
              <UserCheck className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="player-name-input"
                type="text"
                maxLength={40}
                autoFocus
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (error) setError('');
                }}
                placeholder="Contoh: Nadia Pratama"
                className="w-full rounded-lg border border-slate-700 bg-[#060D1A] py-3 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
              />
            </div>
            {error && <p className="mt-2 text-xs text-amber-400">{error}</p>}
          </div>

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-between">
            <button
              type="button"
              onClick={onBack}
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-sm font-medium text-slate-300 transition-colors hover:border-slate-500 hover:text-white whitespace-nowrap"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Kembali</span>
            </button>

            <button
              type="submit"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
            >
              <span>Masuk ke Laboratorium</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
