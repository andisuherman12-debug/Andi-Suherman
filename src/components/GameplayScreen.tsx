import { useEffect, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock,
  DoorOpen,
  ShieldAlert,
  Sparkles,
  Unlock,
  Volume2,
  VolumeX,
  XCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { ChallengeData, LevelData, LevelProgress } from '../types/game';
import { ArchivistPanel } from './ArchivistPanel';
import { SceneImage } from './SceneImage';
import { HiddenObjectPuzzle } from './puzzles/HiddenObjectPuzzle';
import { MatchingPuzzle } from './puzzles/MatchingPuzzle';
import { SequencePuzzle } from './puzzles/SequencePuzzle';
import { DragDropClassifyPuzzle } from './puzzles/DragDropClassifyPuzzle';
import { TimelinePuzzle } from './puzzles/TimelinePuzzle';
import { CodeBreakingPuzzle } from './puzzles/CodeBreakingPuzzle';
import {
  BranchingFinalPuzzle,
  CaseAnalysisPuzzle,
  ThreeElementsPuzzle,
  TrueFalseBatchPuzzle,
  WorkbenchSimPuzzle,
} from './puzzles/CaseAndSpecialPuzzles';
import { ROOM_AMBIENT_LABELS, soundFX } from '../utils/sound';

export function getQuestionTimeLimitSeconds(levelId: number, challenge: ChallengeData): number {
  if (challenge.type === 'BRANCHING_FINAL') return 240;
  if (challenge.type === 'WORKBENCH_SIM') return 180;
  if (challenge.type === 'THREE_ELEMENTS') return 150;
  if (challenge.type === 'DRAG_CLASSIFY' && levelId >= 6) return 165;
  if (challenge.type === 'HIDDEN_OBJECT') return 120;

  switch (levelId) {
    case 1:
      return 90;
    case 2:
      return challenge.type === 'DRAG_CLASSIFY' ? 135 : 105;
    case 3:
      return 120;
    case 4:
      return challenge.type === 'TIMELINE' ? 150 : 120;
    case 5:
      return challenge.type === 'TIMELINE' ? 150 : 135;
    case 6:
      return 150;
    case 7:
    default:
      return 150;
  }
}

interface GameplayScreenProps {
  level: LevelData;
  levelProgress: LevelProgress;
  totalScore: number;
  elapsedSeconds: number;
  soundEnabled: boolean;
  isTimerFrozen: boolean;
  violationCount: number;
  onUseHint: (levelId: number) => void;
  onChallengeAttempt: (
    levelId: number,
    challengeId: string,
    isBonus: boolean,
    isCorrect: boolean,
    customPoints?: number
  ) => void;
  onChallengeTimeout: (levelId: number, challengeId: string) => void;
  onSolvingStateChange: (isSolving: boolean) => void;
  onCompleteLevel: (levelId: number) => void;
  onBackToMap: () => void;
}

export function GameplayScreen({
  level,
  levelProgress,
  totalScore,
  elapsedSeconds,
  soundEnabled,
  isTimerFrozen,
  violationCount,
  onUseHint,
  onChallengeAttempt,
  onChallengeTimeout,
  onSolvingStateChange,
  onCompleteLevel,
  onBackToMap,
}: GameplayScreenProps) {
  const allChallenges = [...level.challenges, level.bonusChallenge];

  const [showCutscene, setShowCutscene] = useState(
    levelProgress.completedChallengeIds.length === 0 && !levelProgress.completed
  );

  const [activeIdx, setActiveIdx] = useState<number>(() => {
    const firstUnsolved = level.challenges.findIndex(
      (c) => !levelProgress.completedChallengeIds.includes(c.id)
    );
    return firstUnsolved >= 0 ? firstUnsolved : 0;
  });

  const [feedback, setFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [showUnlockModal, setShowUnlockModal] = useState(false);

  // Per-question remaining seconds map keyed by challengeId
  const [questionTimers, setQuestionTimers] = useState<Record<string, number>>(() => {
    const map: Record<string, number> = {};
    allChallenges.forEach((ch) => {
      map[ch.id] = getQuestionTimeLimitSeconds(level.id, ch);
    });
    return map;
  });

  // Reset local cutscene/feedback/timers when switching levels
  useEffect(() => {
    setShowCutscene(
      levelProgress.completedChallengeIds.length === 0 && !levelProgress.completed
    );
    const firstUnsolved = level.challenges.findIndex(
      (c) => !levelProgress.completedChallengeIds.includes(c.id)
    );
    setActiveIdx(firstUnsolved >= 0 ? firstUnsolved : 0);
    setFeedback(null);
    setShowUnlockModal(false);

    const freshTimers: Record<string, number> = {};
    [...level.challenges, level.bonusChallenge].forEach((ch) => {
      freshTimers[ch.id] = getQuestionTimeLimitSeconds(level.id, ch);
    });
    setQuestionTimers(freshTimers);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level.id]);

  // Report whether student is actively solving inside chamber (for anti-cheat visibility detection)
  useEffect(() => {
    onSolvingStateChange(!showCutscene && !showUnlockModal);
    return () => onSolvingStateChange(false);
  }, [showCutscene, showUnlockModal, onSolvingStateChange]);

  const currentChallenge: ChallengeData = allChallenges[activeIdx];
  const isMainSolvedCount = level.challenges.filter((c) =>
    levelProgress.completedChallengeIds.includes(c.id)
  ).length;
  const allMainSolved = isMainSolvedCount === level.challenges.length;

  const isCurrentSolved = currentChallenge.isBonus
    ? levelProgress.bonusCompleted
    : levelProgress.completedChallengeIds.includes(currentChallenge.id);

  const isCurrentTimedOut = levelProgress.timedOutIds?.includes(currentChallenge.id) ?? false;
  const maxQuestionSeconds = getQuestionTimeLimitSeconds(level.id, currentChallenge);
  const currentSecondsLeft = isCurrentTimedOut
    ? 0
    : questionTimers[currentChallenge.id] ?? maxQuestionSeconds;

  // Per-question countdown interval
  useEffect(() => {
    if (
      showCutscene ||
      showUnlockModal ||
      isTimerFrozen ||
      isCurrentSolved ||
      isCurrentTimedOut
    ) {
      return;
    }

    const interval = window.setInterval(() => {
      setQuestionTimers((prev) => {
        const cur = prev[currentChallenge.id] ?? maxQuestionSeconds;
        if (cur <= 1) {
          window.clearInterval(interval);
          soundFX.error();
          onChallengeTimeout(level.id, currentChallenge.id);
          return { ...prev, [currentChallenge.id]: 0 };
        }
        return { ...prev, [currentChallenge.id]: cur - 1 };
      });
    }, 1000);

    return () => window.clearInterval(interval);
  }, [
    showCutscene,
    showUnlockModal,
    isTimerFrozen,
    isCurrentSolved,
    isCurrentTimedOut,
    currentChallenge.id,
    maxQuestionSeconds,
    level.id,
    onChallengeTimeout,
  ]);

  const unlockedHints = level.hints.slice(0, levelProgress.hintsUsed);

  const mins = Math.floor(elapsedSeconds / 60);
  const secs = elapsedSeconds % 60;
  const formattedTime = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const qMins = Math.floor(currentSecondsLeft / 60);
  const qSecs = currentSecondsLeft % 60;
  const formattedQuestionTime = `${String(qMins).padStart(2, '0')}:${String(qSecs).padStart(2, '0')}`;
  const questionTimePct = Math.max(
    0,
    Math.min(100, Math.round((currentSecondsLeft / maxQuestionSeconds) * 100))
  );

  const handlePuzzleAttempt = (
    isCorrect: boolean,
    customScore?: number,
    feedbackText?: string
  ) => {
    onChallengeAttempt(
      level.id,
      currentChallenge.id,
      Boolean(currentChallenge.isBonus),
      isCorrect,
      customScore
    );

    if (isCorrect) {
      setFeedback({
        ok: true,
        text: isCurrentTimedOut
          ? 'Kunci tantangan terbuka! (Waktu soal telah habis sebelumnya = +0 poin)'
          : feedbackText || 'Tepat! Tantangan berhasil diselesaikan.',
      });
    } else if (currentChallenge.isBonus) {
      setFeedback({
        ok: false,
        text: 'Jawaban bonus belum tepat (+0 poin). Pelajari penjelasannya di bawah, lalu lanjutkan membuka pintu ruangan.',
      });
    } else {
      setFeedback({
        ok: false,
        text:
          feedbackText ||
          'Jawaban belum tepat (+0 poin pada percobaan ini). Periksa kembali data atau gunakan petunjuk ARCHIVIST.',
      });
    }
  };

  const handleTriggerDoorUnlock = () => {
    soundFX.unlock();
    setShowUnlockModal(true);
  };

  const renderPuzzle = (challenge: ChallengeData) => {
    switch (challenge.type) {
      case 'HIDDEN_OBJECT':
        return (
          <HiddenObjectPuzzle
            key={challenge.id}
            challenge={challenge}
            roomImage={level.imagePath}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'MATCHING':
        return (
          <MatchingPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'SEQUENCE':
        return (
          <SequencePuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'DRAG_CLASSIFY':
        return (
          <DragDropClassifyPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'TIMELINE':
        return (
          <TimelinePuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'CODE_BREAKING':
        return (
          <CodeBreakingPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'CASE_ANALYSIS':
        return (
          <CaseAnalysisPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'TRUE_FALSE_BATCH':
        return (
          <TrueFalseBatchPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'THREE_ELEMENTS':
        return (
          <ThreeElementsPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'WORKBENCH_SIM':
        return (
          <WorkbenchSimPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      case 'BRANCHING_FINAL':
        return (
          <BranchingFinalPuzzle
            key={challenge.id}
            challenge={challenge}
            isSolved={isCurrentSolved}
            onSubmitAttempt={handlePuzzleAttempt}
          />
        );
      default:
        return null;
    }
  };

  if (showCutscene) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.28 }}
          className="overflow-hidden rounded-xl border border-slate-700/80 bg-[#0B162C]"
        >
          <SceneImage
            src={level.imagePath}
            alt={level.title}
            className="rounded-none border-0 border-b border-slate-800"
            scrimClassName="bg-gradient-to-t from-[#0B162C] via-[#060D1A]/35 to-transparent"
          >
            <div className="absolute bottom-4 left-5 right-5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                {level.code} · {level.topic}
              </span>
              <span className="text-slate-300">Hadiah: {level.fragmentName}</span>
            </div>
          </SceneImage>

          <div className="p-6 sm:p-8">
            <h1 className="font-display text-2xl font-bold text-white sm:text-3xl">
              {level.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#38BDF8]">{level.subtitle}</p>

            <div className="mt-5 space-y-3 rounded-lg border border-slate-800 bg-[#060D1A]/80 p-4">
              <p className="text-xs font-semibold text-[#D4AF37]">
                {level.openingCutscene.speaker}
              </p>
              {level.openingCutscene.lines.map((line, i) => (
                <p key={i} className="text-sm leading-relaxed text-slate-200">
                  {line}
                </p>
              ))}
            </div>

            <div className="mt-5 rounded-lg border border-slate-800/80 bg-[#060D1A]/50 p-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Misi & Aturan Integritas Ruangan
              </p>
              <p className="mt-1 text-sm leading-relaxed text-slate-200">{level.missionBrief}</p>
              <p className="mt-2 text-xs text-amber-300">
                Catatan: Setiap soal memiliki batas waktu sesuai tingkat kesulitan ({level.difficulty}).
                Selama mengerjakan soal, dilarang berpindah tab/aplikasi, klik kanan, atau
                copy-paste. Waktu istirahat 1 menit tersedia di Checkpoint setelah level selesai.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={onBackToMap}
                className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-sm font-medium text-slate-300 hover:border-slate-500 hover:text-white whitespace-nowrap"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Peta Misi</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  soundFX.click();
                  setShowCutscene(false);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
              >
                <span>Mulai Investigasi Ruangan</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </motion.div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl select-none px-4 py-6 sm:px-6">
      {/* Compact Gameplay HUD */}
      <section className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-800 bg-[#0B162C] px-5 py-3.5">
        <div className="flex flex-wrap items-center gap-2 text-xs text-slate-300">
          <button
            type="button"
            onClick={onBackToMap}
            className="inline-flex items-center gap-1 font-medium text-[#38BDF8] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Peta Misi</span>
          </button>
          <span aria-hidden="true">·</span>
          <span className="font-mono-tabular font-semibold text-[#D4AF37]">{level.code}</span>
          <span aria-hidden="true">·</span>
          <span className="font-semibold text-white">{level.title}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          <span className="text-slate-300">
            Tantangan:{' '}
            <strong className="font-mono-tabular text-white">
              {isMainSolvedCount}/{level.challenges.length}
            </strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="text-slate-300">
            Skor: <strong className="font-mono-tabular text-[#D4AF37]">{totalScore} poin</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span className="text-slate-300">
            Total Waktu: <strong className="font-mono-tabular text-[#38BDF8]">{formattedTime}</strong>
          </span>
          <span aria-hidden="true" className="text-slate-600">
            ·
          </span>
          <span
            className={`inline-flex items-center gap-1 font-mono-tabular font-semibold ${
              violationCount > 0 ? 'text-red-400' : 'text-emerald-400'
            }`}
          >
            <ShieldAlert className="h-3.5 w-3.5" />
            <span>Pelanggaran: {violationCount}</span>
          </span>
        </div>
      </section>

      <div className="grid items-start gap-6 lg:grid-cols-12">
        {/* Main Puzzle Column */}
        <div className="space-y-5 lg:col-span-8">
          {/* Challenge Stepper Navigation */}
          <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#0B162C] p-2">
            {allChallenges.map((ch, idx) => {
              const solved = ch.isBonus
                ? levelProgress.bonusCompleted
                : levelProgress.completedChallengeIds.includes(ch.id);
              const isActive = idx === activeIdx;

              return (
                <button
                  key={ch.id}
                  type="button"
                  onClick={() => {
                    soundFX.click();
                    setActiveIdx(idx);
                    setFeedback(null);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-[#2563EB] text-white'
                      : solved
                      ? 'bg-emerald-950/40 text-emerald-300 hover:bg-emerald-900/40'
                      : 'text-slate-300 hover:bg-[#12213D]'
                  }`}
                >
                  {solved && <CheckCircle2 className="h-3.5 w-3.5" />}
                  <span>{ch.isBonus ? 'Bonus (+50)' : `Tantangan ${idx + 1}`}</span>
                </button>
              );
            })}
          </div>

          {/* Active Challenge Card */}
          <motion.section
            key={currentChallenge.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
            className="rounded-xl border border-slate-700/80 bg-[#0B162C] p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-800 pb-4">
              <div>
                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                  <span className="font-medium text-[#38BDF8]">
                    {currentChallenge.mechanicLabel}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span>Kesulitan: {level.difficulty}</span>
                  <span aria-hidden="true">·</span>
                  <span>
                    {currentChallenge.isBonus
                      ? 'Tantangan Bonus (+50 poin)'
                      : 'Tantangan Utama (+100 poin)'}
                  </span>
                </div>
                <h2 className="font-display mt-1 text-xl font-bold text-white">
                  {currentChallenge.title}
                </h2>
              </div>

              {/* Per-Question Difficulty Countdown */}
              <div className="flex items-center gap-3">
                {!isCurrentSolved && (
                  <div
                    className={`rounded-lg border px-3 py-1.5 text-right ${
                      isCurrentTimedOut || currentSecondsLeft <= 10
                        ? 'border-red-500/60 bg-red-950/30 text-red-300'
                        : currentSecondsLeft <= 25
                        ? 'border-amber-500/60 bg-amber-950/30 text-amber-300'
                        : 'border-slate-700 bg-[#060D1A] text-[#38BDF8]'
                    }`}
                  >
                    <div className="flex items-center gap-1.5 text-[11px] font-medium">
                      <Clock className="h-3 w-3" />
                      <span>Waktu Soal</span>
                    </div>
                    <p className="font-mono-tabular text-sm font-bold">
                      {isCurrentTimedOut ? '00:00' : formattedQuestionTime}
                    </p>
                  </div>
                )}

                {isCurrentSolved && (
                  <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span>Selesai</span>
                  </span>
                )}
              </div>
            </div>

            {/* Thin Question Timer Bar */}
            {!isCurrentSolved && (
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-[#060D1A]">
                <div
                  className={`h-full transition-all duration-500 ${
                    isCurrentTimedOut || currentSecondsLeft <= 10
                      ? 'bg-red-500'
                      : currentSecondsLeft <= 25
                      ? 'bg-amber-400'
                      : 'bg-[#38BDF8]'
                  }`}
                  style={{ width: `${questionTimePct}%` }}
                />
              </div>
            )}

            {isCurrentTimedOut && !isCurrentSolved && (
              <div className="mt-4 flex items-start gap-2.5 rounded-lg border border-amber-500/50 bg-amber-950/30 p-3 text-xs text-amber-200">
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
                <span>
                  Batas waktu pengerjaan soal ini telah habis (+0 poin). Selesaikan kunci tantangan
                  berikut agar tetap dapat membuka pintu ruangan.
                </span>
              </div>
            )}

            <p className="mt-4 text-sm leading-relaxed text-slate-200">
              {currentChallenge.instruction}
            </p>

            <div className="mt-5">{renderPuzzle(currentChallenge)}</div>

            {feedback && (
              <div
                className={`mt-5 flex items-start gap-3 rounded-lg border p-4 text-sm leading-relaxed ${
                  feedback.ok
                    ? 'border-emerald-500/50 bg-emerald-950/30 text-emerald-100'
                    : 'border-amber-500/50 bg-amber-950/30 text-amber-100'
                }`}
              >
                {feedback.ok ? (
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
                ) : (
                  <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
                )}
                <div className="space-y-1.5">
                  <p className="font-medium">{feedback.text}</p>
                  {isCurrentSolved && (
                    <p className="text-xs text-slate-300">{currentChallenge.explanation}</p>
                  )}
                </div>
              </div>
            )}

            <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-4">
              <div className="text-xs text-slate-400">
                {allMainSolved
                  ? 'Semua kunci utama ruangan telah terbuka!'
                  : `Selesaikan ${level.challenges.length - isMainSolvedCount} tantangan utama lagi untuk membuka pintu ruangan.`}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                {isCurrentSolved && activeIdx < allChallenges.length - 1 && (
                  <button
                    type="button"
                    onClick={() => {
                      soundFX.click();
                      setActiveIdx((i) => i + 1);
                      setFeedback(null);
                    }}
                    className="inline-flex items-center gap-2 rounded-lg border border-[#38BDF8]/60 bg-[#2563EB]/20 px-4 py-2 text-xs font-semibold text-white hover:bg-[#2563EB]/30 whitespace-nowrap"
                  >
                    <span>
                      {activeIdx === level.challenges.length - 1
                        ? 'Coba Tantangan Bonus (+50)'
                        : `Lanjut ke Tantangan ${activeIdx + 2}`}
                    </span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}

                {allMainSolved && (
                  <button
                    type="button"
                    onClick={handleTriggerDoorUnlock}
                    className="inline-flex items-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-2.5 text-xs font-bold text-[#060D1A] transition-colors hover:bg-[#F59E0B] whitespace-nowrap"
                  >
                    <Unlock className="h-4 w-4" />
                    <span>
                      {levelProgress.completed
                        ? 'Lihat Evaluasi Ruangan'
                        : `Klaim ${level.fragmentName} & Buka Pintu`}
                    </span>
                  </button>
                )}
              </div>
            </div>
          </motion.section>
        </div>

        {/* Side Column: ARCHIVIST + Room Visual Reference */}
        <div className="space-y-5 lg:col-span-4">
          <ArchivistPanel
            message={level.missionBrief}
            hints={level.hints}
            hintsUsed={levelProgress.hintsUsed}
            onUseHint={() => {
              soundFX.hint();
              onUseHint(level.id);
            }}
            unlockedHintsList={unlockedHints}
          />

          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B162C]">
            <SceneImage
              src={level.imagePath}
              alt={level.title}
              className="rounded-none border-0"
              scrimClassName="bg-gradient-to-t from-[#0B162C] via-transparent to-transparent"
            >
              <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-xs">
                <span className="font-medium text-white">{level.title}</span>
                <span className="font-mono-tabular text-[#D4AF37]">{level.fragmentSymbol}</span>
              </div>
            </SceneImage>
            <div className="space-y-2 p-4 text-xs leading-relaxed text-slate-300">
              <div>
                <span className="font-semibold text-white">Target Keping Kode: </span>
                {level.fragmentName}
              </div>
              <div className="flex items-center gap-2 border-t border-slate-800/80 pt-2 text-slate-400">
                {soundEnabled ? (
                  <Volume2 className="h-3.5 w-3.5 shrink-0 text-[#38BDF8]" />
                ) : (
                  <VolumeX className="h-3.5 w-3.5 shrink-0 text-slate-500" />
                )}
                <span>
                  Atmosfer Suara:{' '}
                  <span className={soundEnabled ? 'text-slate-200' : 'text-slate-500'}>
                    {soundEnabled
                      ? ROOM_AMBIENT_LABELS[level.id] || 'Suara Ruangan Aktif'
                      : 'Suara Dimatikan'}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Door Unlock Celebration Modal */}
      {showUnlockModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#060D1A]/90 p-4 backdrop-blur-md">
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="w-full max-w-lg rounded-xl border border-[#D4AF37]/60 bg-[#0B162C] p-6 text-center shadow-2xl sm:p-8"
          >
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-[#D4AF37]/60 bg-[#D4AF37]/15 text-[#FDE68A]">
              <DoorOpen className="h-8 w-8" />
            </div>

            <p className="mt-4 font-mono-tabular text-xs font-semibold uppercase tracking-widest text-[#38BDF8]">
              Pintu {level.code} Terbuka
            </p>
            <h2 className="font-display mt-2 text-2xl font-bold text-white sm:text-3xl">
              {level.fragmentName} Diperoleh!
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-slate-300">{level.unlockQuote}</p>

            {!levelProgress.completed && (
              <div className="mt-5 inline-flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-2 text-xs font-semibold text-emerald-300">
                <Sparkles className="h-4 w-4" />
                <span>Bonus Penyelesaian Level: +100 poin</span>
              </div>
            )}

            <div className="mt-7 flex justify-center">
              <button
                type="button"
                onClick={() => {
                  soundFX.click();
                  setShowUnlockModal(false);
                  onCompleteLevel(level.id);
                }}
                className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
              >
                <span>Buka Checkpoint & Evaluasi Level</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </main>
  );
}
