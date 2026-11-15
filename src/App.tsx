import { useCallback, useEffect, useRef, useState } from 'react';
import { GameScreen, LevelData, PlayerProgress } from './types/game';
import {
  clearActiveSession,
  createInitialProgress,
  generateCompletionCode,
  loadEffectiveLevels,
  loadProgress,
  saveProgress,
} from './utils/storage';
import { soundFX } from './utils/sound';
import { TopBar } from './components/TopBar';
import { OpeningScreen } from './components/OpeningScreen';
import { StoryIntroScreen } from './components/StoryIntroScreen';
import { MissionMapScreen } from './components/MissionMapScreen';
import { GameplayScreen } from './components/GameplayScreen';
import { LevelEvaluationScreen } from './components/LevelEvaluationScreen';
import { FinalResultScreen } from './components/FinalResultScreen';
import { TeacherDashboardScreen } from './components/TeacherDashboardScreen';
import {
  AchievementsModal,
  ConfirmResetModal,
  PauseModal,
  TeacherAuthModal,
  ViolationWarningModal,
} from './components/Modals';

const LEVEL_ACHIEVEMENT_MAP: Record<number, string> = {
  1: 'junior_historian',
  2: 'evidence_hunter',
  3: 'master_researcher',
  4: 'dimension_navigator',
  5: 'time_traveler',
  6: 'history_storyteller',
  7: 'chronos_master',
};

export default function App() {
  const [levels, setLevels] = useState<LevelData[]>(() => loadEffectiveLevels());
  const [savedSnapshot, setSavedSnapshot] = useState<PlayerProgress | null>(() => loadProgress());

  const [progress, setProgress] = useState<PlayerProgress>(() => {
    const existing = loadProgress();
    if (existing && existing.playerName && existing.playerClass) {
      soundFX.setEnabled(existing.soundEnabled);
      return existing;
    }
    return createInitialProgress();
  });

  const [isPaused, setIsPaused] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [showTeacherAuth, setShowTeacherAuth] = useState(false);
  const [screenBeforeTeacher, setScreenBeforeTeacher] = useState<GameScreen>('OPENING');
  const [isActivelySolving, setIsActivelySolving] = useState(false);
  const [violationModal, setViolationModal] = useState<{ open: boolean; reason: string }>({
    open: false,
    reason: '',
  });
  const lastViolationAtRef = useRef<number>(0);

  const isAnyModalBlocking =
    isPaused || showAchievements || showResetConfirm || showTeacherAuth || violationModal.open;

  // Ensure solving state resets whenever leaving GAMEPLAY
  useEffect(() => {
    if (progress.currentScreen !== 'GAMEPLAY') {
      setIsActivelySolving(false);
    }
  }, [progress.currentScreen]);

  const triggerViolation = useCallback((reason: string) => {
    const now = Date.now();
    if (now - lastViolationAtRef.current < 1000) return;
    lastViolationAtRef.current = now;

    setProgress((prev) => ({
      ...prev,
      violationCount: (prev.violationCount || 0) + 1,
      violationLogs: [
        ...(prev.violationLogs || []),
        {
          timestamp: new Date().toISOString(),
          reason,
          levelId: prev.activeLevelId,
        },
      ],
    }));
    setViolationModal({ open: true, reason });
  }, []);

  // Anti-cheat input blocking (Right-Click, Copy-Paste, DevTools shortcuts) in Student Mode
  useEffect(() => {
    const isTeacherArea = progress.currentScreen === 'TEACHER_DASHBOARD' || showTeacherAuth;
    if (isTeacherArea) return;

    const inActivePuzzle =
      progress.currentScreen === 'GAMEPLAY' && isActivelySolving && !isAnyModalBlocking;

    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      if (inActivePuzzle) {
        triggerViolation('Mengklik kanan (menu konteks diblokir)');
      }
    };

    const handleClipboard = (e: ClipboardEvent) => {
      e.preventDefault();
      if (inActivePuzzle) {
        triggerViolation('Mencoba menyalin atau menempel konten (Copy-Paste diblokir)');
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      const isF12 = e.key === 'F12' || e.keyCode === 123;
      const isDevToolsCombo =
        ((e.ctrlKey || e.metaKey) && e.shiftKey && (key === 'i' || key === 'j' || key === 'c')) ||
        (e.metaKey && e.altKey && (key === 'i' || key === 'j' || key === 'c')) ||
        ((e.ctrlKey || e.metaKey) && key === 'u');

      if (isF12 || isDevToolsCombo) {
        e.preventDefault();
        e.stopPropagation();
        if (inActivePuzzle) {
          triggerViolation('Mencoba membuka DevTools atau inspeksi kode (F12/Shortcut diblokir)');
        }
        return;
      }

      if (
        progress.currentScreen === 'GAMEPLAY' &&
        (e.ctrlKey || e.metaKey) &&
        (key === 'c' || key === 'v' || key === 'x')
      ) {
        e.preventDefault();
        if (inActivePuzzle) {
          triggerViolation('Mencoba menggunakan pintasan Copy/Cut/Paste saat mengerjakan soal');
        }
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('copy', handleClipboard);
    document.addEventListener('cut', handleClipboard);
    document.addEventListener('paste', handleClipboard);
    window.addEventListener('keydown', handleKeyDown, true);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('copy', handleClipboard);
      document.removeEventListener('cut', handleClipboard);
      document.removeEventListener('paste', handleClipboard);
      window.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [
    progress.currentScreen,
    showTeacherAuth,
    isActivelySolving,
    isAnyModalBlocking,
    triggerViolation,
  ]);

  // Tab / Window / App switch detection (only while actively solving a room puzzle; NOT during checkpoint rest)
  useEffect(() => {
    const canDetectSwitch =
      progress.currentScreen === 'GAMEPLAY' && isActivelySolving && !isAnyModalBlocking;
    if (!canDetectSwitch) return;

    let blurTimer: number | undefined;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        triggerViolation('Berpindah tab atau meminimalkan browser saat mengerjakan soal');
      }
    };

    const handleWindowBlur = () => {
      blurTimer = window.setTimeout(() => {
        if (!document.hasFocus() || document.hidden) {
          triggerViolation('Keluar dari jendela/aplikasi saat mengerjakan soal');
        }
      }, 80);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('blur', handleWindowBlur);

    return () => {
      if (blurTimer) window.clearTimeout(blurTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('blur', handleWindowBlur);
    };
  }, [progress.currentScreen, isActivelySolving, isAnyModalBlocking, triggerViolation]);

  // Persist active student progress + multi-student registry automatically
  useEffect(() => {
    if (
      progress.playerName &&
      progress.playerClass &&
      progress.currentScreen !== 'TEACHER_DASHBOARD'
    ) {
      saveProgress(progress);
      setSavedSnapshot(progress);
    }
  }, [progress]);

  // Sync Web Audio FX enablement
  useEffect(() => {
    soundFX.setEnabled(progress.soundEnabled);
  }, [progress.soundEnabled]);

  // Manage per-room ambient soundscape
  useEffect(() => {
    const shouldPlayAmbient =
      progress.currentScreen === 'GAMEPLAY' && progress.soundEnabled && !isAnyModalBlocking;

    if (shouldPlayAmbient) {
      soundFX.startAmbient(progress.activeLevelId);
    } else {
      soundFX.stopAmbient();
    }

    return () => {
      soundFX.stopAmbient();
    };
  }, [progress.currentScreen, progress.activeLevelId, progress.soundEnabled, isAnyModalBlocking]);

  // Active gameplay timer
  useEffect(() => {
    if (progress.currentScreen !== 'GAMEPLAY' || isAnyModalBlocking) {
      return;
    }
    const timer = window.setInterval(() => {
      setProgress((prev) => ({
        ...prev,
        elapsedSeconds: prev.elapsedSeconds + 1,
      }));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [progress.currentScreen, isAnyModalBlocking]);

  const setScreen = (screen: GameScreen) => {
    setProgress((prev) => ({ ...prev, currentScreen: screen }));
  };

  const handleStartStudentNew = (name: string, studentClass: string) => {
    soundFX.click();
    const fresh = createInitialProgress(name, studentClass);
    fresh.soundEnabled = progress.soundEnabled;
    fresh.currentScreen = 'STORY_INTRO';
    saveProgress(fresh);
    setSavedSnapshot(fresh);
    setIsPaused(false);
    setProgress(fresh);
  };

  const handleResumeStudentRecord = (saved: PlayerProgress) => {
    soundFX.click();
    const resumed: PlayerProgress = {
      ...saved,
      soundEnabled: progress.soundEnabled,
      currentScreen:
        saved.currentScreen === 'OPENING' || saved.currentScreen === 'TEACHER_DASHBOARD'
          ? saved.storyIntroSeen
            ? 'MISSION_MAP'
            : 'STORY_INTRO'
          : saved.currentScreen,
    };
    setIsPaused(false);
    setProgress(resumed);
  };

  const handleCompleteStoryIntro = () => {
    setProgress((prev) => ({
      ...prev,
      storyIntroSeen: true,
      currentScreen: 'MISSION_MAP',
    }));
  };

  const handleEnterLevel = (levelId: number) => {
    setIsPaused(false);
    setProgress((prev) => ({
      ...prev,
      activeLevelId: levelId,
      currentScreen: 'GAMEPLAY',
    }));
  };

  const handleUseHint = (levelId: number) => {
    setProgress((prev) => {
      const lvl = prev.levels[levelId];
      if (!lvl || lvl.hintsUsed >= 3) return prev;
      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: {
            ...lvl,
            hintsUsed: lvl.hintsUsed + 1,
          },
        },
      };
    });
  };

  const handleChallengeTimeout = (levelId: number, challengeId: string) => {
    setProgress((prev) => {
      const lvl = prev.levels[levelId];
      if (!lvl) return prev;
      const timedOutIds = lvl.timedOutIds || [];
      if (timedOutIds.includes(challengeId)) return prev;
      const attemptedIds = lvl.attemptedIds.includes(challengeId)
        ? lvl.attemptedIds
        : [...lvl.attemptedIds, challengeId];
      return {
        ...prev,
        levels: {
          ...prev.levels,
          [levelId]: {
            ...lvl,
            attemptedIds,
            timedOutIds: [...timedOutIds, challengeId],
          },
        },
      };
    });
  };

  const handleChallengeAttempt = (
    levelId: number,
    challengeId: string,
    isBonus: boolean,
    isCorrect: boolean,
    customPoints?: number
  ) => {
    setProgress((prev) => {
      const lvl = prev.levels[levelId];
      if (!lvl) return prev;

      const isTimedOut = (lvl.timedOutIds || []).includes(challengeId);
      const alreadyAttempted = lvl.attemptedIds.includes(challengeId);
      const nextAttempted = alreadyAttempted
        ? lvl.attemptedIds
        : [...lvl.attemptedIds, challengeId];

      if (isBonus) {
        if (lvl.bonusCompleted) return prev;
        const pointsEarned = isCorrect && !isTimedOut ? 50 : 0;
        const nextFirstTry =
          isCorrect && !alreadyAttempted && !isTimedOut
            ? [...lvl.firstTryCorrectIds, challengeId]
            : lvl.firstTryCorrectIds;

        return {
          ...prev,
          totalScore: prev.totalScore + pointsEarned,
          levels: {
            ...prev.levels,
            [levelId]: {
              ...lvl,
              attemptedIds: nextAttempted,
              firstTryCorrectIds: nextFirstTry,
              bonusCompleted: true,
              bonusCorrect: isCorrect,
              scoreEarned: lvl.scoreEarned + pointsEarned,
            },
          },
        };
      }

      if (lvl.completedChallengeIds.includes(challengeId)) {
        return prev;
      }

      if (!isCorrect) {
        return {
          ...prev,
          levels: {
            ...prev.levels,
            [levelId]: {
              ...lvl,
              attemptedIds: nextAttempted,
            },
          },
        };
      }

      const basePoints = isTimedOut ? 0 : 100;
      const noHintBonus = !isTimedOut && lvl.hintsUsed === 0 ? 25 : 0;
      const earnedNow = basePoints + noHintBonus;
      const nextFirstTry =
        !alreadyAttempted && !isTimedOut
          ? [...lvl.firstTryCorrectIds, challengeId]
          : lvl.firstTryCorrectIds;

      return {
        ...prev,
        totalScore: prev.totalScore + earnedNow,
        levels: {
          ...prev.levels,
          [levelId]: {
            ...lvl,
            attemptedIds: nextAttempted,
            firstTryCorrectIds: nextFirstTry,
            completedChallengeIds: [...lvl.completedChallengeIds, challengeId],
            scoreEarned: lvl.scoreEarned + earnedNow,
            branchQualityScore: customPoints ?? lvl.branchQualityScore,
          },
        },
      };
    });
  };

  const handleCompleteLevel = (levelId: number) => {
    setIsActivelySolving(false);
    setProgress((prev) => {
      const lvl = prev.levels[levelId];
      if (!lvl) return prev;

      const isFirstCompletion = !lvl.completed;
      const levelBonus = isFirstCompletion ? 100 : 0;
      const updatedTotalScore = prev.totalScore + levelBonus;

      const nextLevels = {
        ...prev.levels,
        [levelId]: {
          ...lvl,
          completed: true,
          scoreEarned: lvl.scoreEarned + levelBonus,
        },
      };

      if (levelId < 7 && nextLevels[levelId + 1]) {
        nextLevels[levelId + 1] = {
          ...nextLevels[levelId + 1],
          unlocked: true,
        };
      }

      const badgeId = LEVEL_ACHIEVEMENT_MAP[levelId];
      const nextAchievements =
        badgeId && !prev.unlockedAchievementIds.includes(badgeId)
          ? [...prev.unlockedAchievementIds, badgeId]
          : prev.unlockedAchievementIds;

      const completionCode =
        levelId === 7
          ? prev.completionCode ||
            generateCompletionCode(prev.playerName, prev.playerClass, updatedTotalScore)
          : prev.completionCode;

      const completedAt =
        levelId === 7 ? prev.completedAt || new Date().toISOString() : prev.completedAt;

      // Checkpoint 1-minute (60s) rest cooldown before entering next level
      const nextLevelUnlockAt =
        levelId < 7 && isFirstCompletion ? Date.now() + 60_000 : prev.nextLevelUnlockAt;

      return {
        ...prev,
        totalScore: updatedTotalScore,
        completionCode,
        completedAt,
        nextLevelUnlockAt,
        levels: nextLevels,
        unlockedAchievementIds: nextAchievements,
        currentScreen: 'LEVEL_SUMMARY',
      };
    });
  };

  const handleContinueAfterSummary = () => {
    if (progress.activeLevelId < 7) {
      const nextId = progress.activeLevelId + 1;
      setProgress((prev) => ({
        ...prev,
        activeLevelId: nextId,
        currentScreen: 'GAMEPLAY',
      }));
    } else {
      setScreen('FINAL_RESULT');
    }
  };

  const handleConfirmReset = () => {
    soundFX.click();
    clearActiveSession();
    const fresh = createInitialProgress();
    fresh.soundEnabled = progress.soundEnabled;
    setSavedSnapshot(null);
    setProgress(fresh);
    setIsPaused(false);
    setShowResetConfirm(false);
  };

  const handleRequestTeacherMode = () => {
    soundFX.click();
    setShowTeacherAuth(true);
  };

  const handleTeacherAuthenticated = () => {
    soundFX.success();
    setShowTeacherAuth(false);
    if (progress.currentScreen !== 'TEACHER_DASHBOARD') {
      setScreenBeforeTeacher(progress.currentScreen);
    }
    setIsPaused(false);
    setScreen('TEACHER_DASHBOARD');
  };

  const activeLevel = levels.find((l) => l.id === progress.activeLevelId) || levels[0];
  const activeLevelProgress = progress.levels[activeLevel.id];
  const hasStarted =
    Boolean(progress.playerName) &&
    progress.currentScreen !== 'OPENING' &&
    progress.currentScreen !== 'TEACHER_DASHBOARD';

  return (
    <div className="min-h-screen bg-[#060D1A] text-[#F8FAFC] flex flex-col">
      <TopBar
        currentScreen={progress.currentScreen}
        soundEnabled={progress.soundEnabled}
        isPaused={isPaused}
        hasStarted={hasStarted}
        onNavigateHome={() => {
          soundFX.click();
          setIsPaused(false);
          setScreen('OPENING');
        }}
        onNavigateMap={() => {
          soundFX.click();
          setIsPaused(false);
          setScreen('MISSION_MAP');
        }}
        onOpenAchievements={() => {
          soundFX.click();
          setShowAchievements(true);
        }}
        onToggleSound={() => {
          const next = !progress.soundEnabled;
          soundFX.setEnabled(next);
          if (next) soundFX.click();
          setProgress((prev) => ({ ...prev, soundEnabled: next }));
        }}
        onTogglePause={() => {
          soundFX.click();
          setIsPaused((p) => !p);
        }}
        onOpenTeacherMode={handleRequestTeacherMode}
        onRequestReset={() => {
          soundFX.click();
          setShowResetConfirm(true);
        }}
      />

      <div className="flex-1">
        {progress.currentScreen === 'OPENING' && (
          <OpeningScreen
            lastSavedProgress={savedSnapshot}
            onStartStudentNew={handleStartStudentNew}
            onResumeStudentRecord={handleResumeStudentRecord}
            onOpenTeacherMode={handleRequestTeacherMode}
          />
        )}

        {progress.currentScreen === 'STORY_INTRO' && (
          <StoryIntroScreen
            playerName={progress.playerName}
            onCompleteIntro={handleCompleteStoryIntro}
          />
        )}

        {progress.currentScreen === 'MISSION_MAP' && (
          <MissionMapScreen
            levels={levels}
            progress={progress}
            onEnterLevel={handleEnterLevel}
            onOpenAchievements={() => {
              soundFX.click();
              setShowAchievements(true);
            }}
            onOpenFinalResult={() => {
              soundFX.click();
              setScreen('FINAL_RESULT');
            }}
          />
        )}

        {progress.currentScreen === 'GAMEPLAY' && activeLevelProgress && (
          <GameplayScreen
            level={activeLevel}
            levelProgress={activeLevelProgress}
            totalScore={progress.totalScore}
            elapsedSeconds={progress.elapsedSeconds}
            soundEnabled={progress.soundEnabled}
            isTimerFrozen={isAnyModalBlocking}
            violationCount={progress.violationCount}
            onUseHint={handleUseHint}
            onChallengeAttempt={handleChallengeAttempt}
            onChallengeTimeout={handleChallengeTimeout}
            onSolvingStateChange={setIsActivelySolving}
            onCompleteLevel={handleCompleteLevel}
            onBackToMap={() => {
              soundFX.click();
              setScreen('MISSION_MAP');
            }}
          />
        )}

        {progress.currentScreen === 'LEVEL_SUMMARY' && activeLevelProgress && (
          <LevelEvaluationScreen
            level={activeLevel}
            levelProgress={activeLevelProgress}
            isLastLevel={activeLevel.id === 7}
            nextLevelUnlockAt={progress.nextLevelUnlockAt}
            onContinueNext={handleContinueAfterSummary}
            onBackToMap={() => setScreen('MISSION_MAP')}
          />
        )}

        {progress.currentScreen === 'FINAL_RESULT' && (
          <FinalResultScreen
            levels={levels}
            progress={progress}
            onUpdatePhoto={(photoDataUrl) =>
              setProgress((prev) => ({
                ...prev,
                playerPhoto: photoDataUrl,
                completionCode:
                  prev.completionCode ||
                  generateCompletionCode(prev.playerName, prev.playerClass, prev.totalScore),
                completedAt: prev.completedAt || new Date().toISOString(),
              }))
            }
            onBackToMap={() => setScreen('MISSION_MAP')}
            onRequestReset={() => setShowResetConfirm(true)}
          />
        )}

        {progress.currentScreen === 'TEACHER_DASHBOARD' && (
          <TeacherDashboardScreen
            levels={levels}
            onUpdateLevels={(nextLevels) => setLevels(nextLevels)}
            onExitTeacherMode={() => setScreen(screenBeforeTeacher || 'OPENING')}
          />
        )}
      </div>

      <footer className="border-t border-slate-800/80 py-4 text-center text-xs text-slate-500">
        THE HISTORY ESCAPE: THE LOST TIMELINE · Sejarah SMA Kelas X · Chronos Historical Research Center
      </footer>

      <PauseModal
        isOpen={isPaused}
        playerName={
          progress.playerClass
            ? `${progress.playerName} (${progress.playerClass})`
            : progress.playerName
        }
        elapsedSeconds={progress.elapsedSeconds}
        totalScore={progress.totalScore}
        onResume={() => {
          soundFX.click();
          setIsPaused(false);
        }}
        onGoMap={() => {
          soundFX.click();
          setIsPaused(false);
          setScreen('MISSION_MAP');
        }}
      />

      <ConfirmResetModal
        isOpen={showResetConfirm}
        onCancel={() => {
          soundFX.click();
          setShowResetConfirm(false);
        }}
        onConfirmReset={handleConfirmReset}
      />

      <AchievementsModal
        isOpen={showAchievements}
        unlockedIds={progress.unlockedAchievementIds}
        onClose={() => {
          soundFX.click();
          setShowAchievements(false);
        }}
      />

      <TeacherAuthModal
        isOpen={showTeacherAuth}
        onCancel={() => {
          soundFX.click();
          setShowTeacherAuth(false);
        }}
        onAuthenticated={handleTeacherAuthenticated}
      />

      <ViolationWarningModal
        isOpen={violationModal.open}
        reason={violationModal.reason}
        violationCount={progress.violationCount}
        onAcknowledge={() => {
          soundFX.click();
          soundFX.stopAlarm();
          setViolationModal({ open: false, reason: '' });
        }}
      />
    </div>
  );
}
