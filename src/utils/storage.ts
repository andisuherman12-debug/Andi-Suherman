import { LEVELS } from '../data/levels';
import { LevelData, LevelProgress, PlayerProgress, StudentRecord } from '../types/game';

const STORAGE_KEY = 'history_escape_lost_timeline_v1';
const STUDENTS_REGISTRY_KEY = 'history_escape_students_registry_v1';
const QUESTION_BANK_KEY = 'history_escape_question_bank_v1';

const memoryFallbackStorage: Record<string, string> = {};

function safeGetItem(key: string): string | null {
  try {
    return window.localStorage.getItem(key) ?? memoryFallbackStorage[key] ?? null;
  } catch {
    return memoryFallbackStorage[key] ?? null;
  }
}

function safeSetItem(key: string, value: string): void {
  memoryFallbackStorage[key] = value;
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Fallback already stored in memoryFallbackStorage for sandboxed iframes
  }
}

function safeRemoveItem(key: string): void {
  delete memoryFallbackStorage[key];
  try {
    window.localStorage.removeItem(key);
  } catch {
    // Ignore
  }
}

export function makeStudentKey(name: string, playerClass: string): string {
  const normName = name.trim().toLowerCase().replace(/\s+/g, ' ');
  const normClass = playerClass.trim().toLowerCase().replace(/\s+/g, ' ');
  return `${normName}::${normClass}`;
}

export function createInitialLevelsState(): Record<number, LevelProgress> {
  const levels: Record<number, LevelProgress> = {};
  for (let i = 1; i <= 7; i++) {
    levels[i] = {
      unlocked: i === 1,
      completed: false,
      scoreEarned: 0,
      hintsUsed: 0,
      completedChallengeIds: [],
      firstTryCorrectIds: [],
      attemptedIds: [],
      timedOutIds: [],
      bonusCompleted: false,
      bonusCorrect: false,
    };
  }
  return levels;
}

export function createInitialProgress(playerName = '', playerClass = ''): PlayerProgress {
  return {
    playerName,
    playerClass,
    currentScreen: 'OPENING',
    activeLevelId: 1,
    totalScore: 0,
    elapsedSeconds: 0,
    soundEnabled: true,
    storyIntroSeen: false,
    violationCount: 0,
    violationLogs: [],
    levels: createInitialLevelsState(),
    unlockedAchievementIds: [],
  };
}

function normalizeProgress(raw: PlayerProgress): PlayerProgress {
  const levels: Record<number, LevelProgress> = { ...createInitialLevelsState() };
  for (let i = 1; i <= 7; i++) {
    if (raw.levels?.[i]) {
      levels[i] = {
        ...levels[i],
        ...raw.levels[i],
        timedOutIds: raw.levels[i].timedOutIds || [],
      };
    }
  }
  return {
    ...raw,
    playerClass: raw.playerClass || '',
    violationCount: raw.violationCount ?? 0,
    violationLogs: Array.isArray(raw.violationLogs) ? raw.violationLogs : [],
    levels,
  };
}

export function computeStudentMetrics(progress: PlayerProgress): {
  accuracyPct: number;
  completedLevelsCount: number;
  highestLevel: number;
} {
  let completedLevelsCount = 0;
  let highestLevel = 1;
  let totalFirstTry = 0;
  let totalAttempts = 0;

  for (let i = 1; i <= 7; i++) {
    const st = progress.levels[i];
    if (!st) continue;
    if (st.unlocked && i > highestLevel) highestLevel = i;
    if (st.completed) {
      completedLevelsCount += 1;
      if (i > highestLevel) highestLevel = i;
    }
    totalFirstTry += st.firstTryCorrectIds.length;
    totalAttempts += Math.max(st.attemptedIds.length, st.completedChallengeIds.length);
  }

  const accuracyPct =
    totalAttempts > 0 ? Math.min(100, Math.round((totalFirstTry / totalAttempts) * 100)) : 0;

  return { accuracyPct, completedLevelsCount, highestLevel };
}

export function loadProgress(): PlayerProgress | null {
  try {
    const raw = safeGetItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as PlayerProgress;
    if (!parsed || !parsed.levels || !parsed.levels[1]) return null;
    return normalizeProgress(parsed);
  } catch {
    return null;
  }
}

export function saveProgress(progress: PlayerProgress): void {
  try {
    safeSetItem(STORAGE_KEY, JSON.stringify(progress));
    if (progress.playerName.trim() && progress.playerClass.trim()) {
      upsertStudentRecord(progress);
    }
  } catch {
    // Ignore storage quota errors safely
  }
}

export function clearActiveSession(): void {
  safeRemoveItem(STORAGE_KEY);
}

// ============================================================================
// STUDENT REGISTRY (Multi-Student Resume + Teacher Progress Monitoring)
// ============================================================================

export function getAllStudentRecords(): StudentRecord[] {
  try {
    const raw = safeGetItem(STUDENTS_REGISTRY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Record<string, StudentRecord>;
    return Object.values(parsed)
      .map((r) => ({
        ...r,
        violationCount: r.violationCount ?? r.progress?.violationCount ?? 0,
        progress: normalizeProgress(r.progress),
      }))
      .sort((a, b) => new Date(b.lastUpdatedAt).getTime() - new Date(a.lastUpdatedAt).getTime());
  } catch {
    return [];
  }
}

export function findStudentRecord(name: string, playerClass: string): StudentRecord | null {
  if (!name.trim() || !playerClass.trim()) return null;
  try {
    const raw = safeGetItem(STUDENTS_REGISTRY_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Record<string, StudentRecord>;
    const key = makeStudentKey(name, playerClass);
    const rec = parsed[key];
    if (!rec) return null;
    return {
      ...rec,
      violationCount: rec.violationCount ?? rec.progress?.violationCount ?? 0,
      progress: normalizeProgress(rec.progress),
    };
  } catch {
    return null;
  }
}

export function upsertStudentRecord(progress: PlayerProgress): void {
  if (!progress.playerName.trim() || !progress.playerClass.trim()) return;
  try {
    const raw = safeGetItem(STUDENTS_REGISTRY_KEY);
    const registry: Record<string, StudentRecord> = raw ? JSON.parse(raw) : {};
    const key = makeStudentKey(progress.playerName, progress.playerClass);
    const metrics = computeStudentMetrics(progress);

    registry[key] = {
      studentKey: key,
      playerName: progress.playerName.trim(),
      playerClass: progress.playerClass.trim(),
      totalScore: progress.totalScore,
      accuracyPct: metrics.accuracyPct,
      completedLevelsCount: metrics.completedLevelsCount,
      highestLevel: metrics.highestLevel,
      elapsedSeconds: progress.elapsedSeconds,
      violationCount: progress.violationCount ?? 0,
      lastUpdatedAt: new Date().toISOString(),
      progress,
    };

    safeSetItem(STUDENTS_REGISTRY_KEY, JSON.stringify(registry));
  } catch {
    // Ignore
  }
}

export function deleteStudentRecord(studentKey: string): void {
  try {
    const raw = safeGetItem(STUDENTS_REGISTRY_KEY);
    if (!raw) return;
    const registry: Record<string, StudentRecord> = JSON.parse(raw);
    delete registry[studentKey];
    safeSetItem(STUDENTS_REGISTRY_KEY, JSON.stringify(registry));
  } catch {
    // Ignore
  }
}

// ============================================================================
// QUESTION BANK (Teacher Mode Editing & Custom Questions)
// ============================================================================

export function loadEffectiveLevels(): LevelData[] {
  try {
    const raw = safeGetItem(QUESTION_BANK_KEY);
    if (!raw) return LEVELS;
    const overrides = JSON.parse(raw) as LevelData[];
    if (!Array.isArray(overrides) || overrides.length !== LEVELS.length) {
      return LEVELS;
    }
    return overrides;
  } catch {
    return LEVELS;
  }
}

export function saveEffectiveLevels(levels: LevelData[]): void {
  try {
    safeSetItem(QUESTION_BANK_KEY, JSON.stringify(levels));
  } catch {
    // Ignore
  }
}

export function resetEffectiveLevels(): LevelData[] {
  safeRemoveItem(QUESTION_BANK_KEY);
  return LEVELS;
}

// ============================================================================
// TEACHER PASSWORD & STUDENT AUTHENTICATION HELPERS
// ============================================================================

const TEACHER_PASSWORD_KEY = 'history_escape_teacher_pw_v1';
const DEFAULT_TEACHER_PASSWORD = 'GURU2026';

export function getTeacherPassword(): string {
  return safeGetItem(TEACHER_PASSWORD_KEY) || DEFAULT_TEACHER_PASSWORD;
}

export function setTeacherPassword(newPassword: string): void {
  const clean = newPassword.trim();
  if (clean.length >= 4) {
    safeSetItem(TEACHER_PASSWORD_KEY, clean);
  }
}

export function verifyTeacherPassword(input: string): boolean {
  return input.trim() === getTeacherPassword();
}

export function generateCompletionCode(
  name: string,
  playerClass: string,
  totalScore: number
): string {
  const seed = `${name.trim().toUpperCase()}|${playerClass.trim().toUpperCase()}|${totalScore}`;
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const hex = hash.toString(16).toUpperCase().padStart(6, '0').slice(0, 6);
  return `CHR-${hex}`;
}

export function resizeImageFileToDataUrl(file: File, maxSize = 360): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const size = Math.min(img.width, img.height);
        const sx = (img.width - size) / 2;
        const sy = (img.height - size) / 2;
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas context unavailable'));
          return;
        }
        ctx.drawImage(img, sx, sy, size, size, 0, 0, maxSize, maxSize);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => reject(new Error('Invalid image'));
      img.src = String(reader.result);
    };
    reader.onerror = () => reject(new Error('Failed reading file'));
    reader.readAsDataURL(file);
  });
}

