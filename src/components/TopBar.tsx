import { GameScreen } from '../types/game';

interface TopBarProps {
  currentScreen: GameScreen;
  soundEnabled: boolean;
  isPaused: boolean;
  hasStarted: boolean;
  onNavigateHome: () => void;
  onNavigateMap: () => void;
  onOpenAchievements: () => void;
  onToggleSound: () => void;
  onTogglePause: () => void;
  onOpenTeacherMode: () => void;
  onRequestReset: () => void;
}

export function TopBar({
  currentScreen,
  soundEnabled,
  isPaused,
  hasStarted,
  onNavigateHome,
  onNavigateMap,
  onOpenAchievements,
  onToggleSound,
  onTogglePause,
  onOpenTeacherMode,
  onRequestReset,
}: TopBarProps) {
  const isTeacher = currentScreen === 'TEACHER_DASHBOARD';

  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/90 bg-[#060D1A]/95 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-8 px-4 sm:px-6">
        {/* Zone 1: Single-line Wordmark */}
        <button
          type="button"
          onClick={onNavigateHome}
          className="font-display text-sm font-bold tracking-wider text-[#F8FAFC] whitespace-nowrap shrink-0 cursor-pointer hover:text-[#D4AF37] transition-colors sm:text-base"
        >
          THE HISTORY ESCAPE
        </button>

        {/* Zone 2: Concise single-line navigation controls */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-300">
          {hasStarted && !isTeacher && (
            <button
              type="button"
              onClick={onNavigateMap}
              className={`whitespace-nowrap shrink-0 transition-colors hover:text-white ${
                currentScreen === 'MISSION_MAP' ? 'text-[#38BDF8] underline underline-offset-4' : ''
              }`}
            >
              Peta Misi
            </button>
          )}
          {hasStarted && !isTeacher && (
            <button
              type="button"
              onClick={onOpenAchievements}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              Lencana
            </button>
          )}
          <button
            type="button"
            onClick={onToggleSound}
            className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
          >
            {soundEnabled ? 'Suara Aktif' : 'Suara Mati'}
          </button>
          {hasStarted && !isTeacher && (currentScreen === 'GAMEPLAY' || currentScreen === 'MISSION_MAP') && (
            <button
              type="button"
              onClick={onTogglePause}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-white"
            >
              {isPaused ? 'Lanjutkan' : 'Jeda'}
            </button>
          )}
          {!isTeacher && (
            <button
              type="button"
              onClick={onOpenTeacherMode}
              className="whitespace-nowrap shrink-0 transition-colors hover:text-[#D4AF37]"
            >
              Mode Guru
            </button>
          )}
        </nav>

        {/* Zone 3: Single Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          {isTeacher ? (
            <button
              type="button"
              onClick={onNavigateHome}
              className="rounded-lg border border-slate-700 bg-[#0B162C] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#38BDF8]/60 hover:text-white whitespace-nowrap shrink-0"
            >
              Kembali ke Beranda
            </button>
          ) : hasStarted ? (
            <button
              type="button"
              onClick={onRequestReset}
              className="rounded-lg border border-slate-700 bg-[#0B162C] px-4 py-2 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37]/60 hover:text-white whitespace-nowrap shrink-0"
            >
              Ganti / Ulangi
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenTeacherMode}
              className="rounded-lg border border-[#D4AF37]/60 bg-[#0B162C] px-4 py-2 text-xs font-semibold text-[#FDE68A] transition-colors hover:bg-[#D4AF37]/15 whitespace-nowrap shrink-0"
            >
              Mode Guru
            </button>
          )}
        </div>
      </div>

      {/* Compact mobile nav bar */}
      {hasStarted && !isTeacher && (
        <div className="flex md:hidden items-center justify-around border-t border-slate-800/80 px-3 py-1.5 text-xs font-medium text-slate-300">
          <button
            type="button"
            onClick={onNavigateMap}
            className={`px-2 py-1 whitespace-nowrap shrink-0 ${
              currentScreen === 'MISSION_MAP' ? 'text-[#38BDF8]' : ''
            }`}
          >
            Peta Misi
          </button>
          <button
            type="button"
            onClick={onOpenAchievements}
            className="px-2 py-1 whitespace-nowrap shrink-0"
          >
            Lencana
          </button>
          <button
            type="button"
            onClick={onToggleSound}
            className="px-2 py-1 whitespace-nowrap shrink-0"
          >
            {soundEnabled ? 'Suara: On' : 'Suara: Off'}
          </button>
          <button
            type="button"
            onClick={onTogglePause}
            className="px-2 py-1 whitespace-nowrap shrink-0"
          >
            {isPaused ? 'Lanjut' : 'Jeda'}
          </button>
        </div>
      )}
    </header>
  );
}
