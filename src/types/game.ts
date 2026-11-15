export type GameScreen =
  | 'OPENING'
  | 'REGISTRATION'
  | 'STORY_INTRO'
  | 'MISSION_MAP'
  | 'GAMEPLAY'
  | 'LEVEL_SUMMARY'
  | 'FINAL_RESULT'
  | 'TEACHER_DASHBOARD';

export type ChallengeType =
  | 'HIDDEN_OBJECT'
  | 'MATCHING'
  | 'SEQUENCE'
  | 'DRAG_CLASSIFY'
  | 'CODE_BREAKING'
  | 'CASE_ANALYSIS'
  | 'TRUE_FALSE_BATCH'
  | 'TIMELINE'
  | 'THREE_ELEMENTS'
  | 'WORKBENCH_SIM'
  | 'BRANCHING_FINAL';

export interface HotspotItem {
  id: string;
  label: string;
  xPercent: number;
  yPercent: number;
  clueTitle: string;
  clueText: string;
  codeLetter: string;
}

export interface MatchingPair {
  id: string;
  left: string;
  right: string;
}

export interface SequenceItem {
  id: string;
  label: string;
  detail?: string;
  yearOrOrder?: string;
}

export interface ClassifyCategory {
  id: string;
  title: string;
  subtitle?: string;
}

export interface ClassifyItem {
  id: string;
  text: string;
  correctCategoryId: string;
  note?: string;
}

export interface TimelineSlotItem {
  id: string;
  yearLabel: string;
  eventTitle: string;
  periodLabel: string;
}

export interface ThreeElementQuestion {
  id: string;
  elementType: 'Manusia' | 'Ruang' | 'Waktu' | 'Unsur Hilang';
  prompt: string;
  options: string[];
  correctIndex: number;
}

export interface TrueFalseStatement {
  id: string;
  statement: string;
  isTrue: boolean;
  reason: string;
}

export interface CaseOption {
  id: string;
  label: string;
  description?: string;
  isCorrect?: boolean;
  branchScore?: number;
  consequence?: string;
  unlockedClue?: string;
}

export interface WorkbenchTask {
  id: string;
  benchName: string;
  stageName: string;
  scenario: string;
  options: {
    id: string;
    label: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface BranchStep {
  id: string;
  stepNumber: number;
  title: string;
  phaseLabel: string;
  narrative: string;
  question: string;
  options: CaseOption[];
}

export interface ChallengeData {
  id: string;
  title: string;
  mechanicLabel: string;
  type: ChallengeType;
  instruction: string;
  isBonus?: boolean;
  isCustom?: boolean;
  contextText?: string;
  hiddenObjectData?: {
    sceneCaption: string;
    hotspots: HotspotItem[];
    secretPrompt: string;
    secretAnswer: string;
    acceptedAnswers: string[];
  };
  matchingData?: {
    leftHeader: string;
    rightHeader: string;
    pairs: MatchingPair[];
  };
  sequenceData?: {
    items: SequenceItem[];
    correctOrderIds: string[];
  };
  classifyData?: {
    categories: ClassifyCategory[];
    items: ClassifyItem[];
  };
  codeBreakingData?: {
    cipherClues: { symbol: string; clue: string }[];
    question: string;
    placeholder: string;
    acceptedAnswers: string[];
    displayAnswer: string;
  };
  caseData?: {
    caseTitle: string;
    documents?: { title: string; meta: string; content: string }[];
    question: string;
    options: CaseOption[];
  };
  trueFalseData?: {
    statements: TrueFalseStatement[];
  };
  timelineData?: {
    slots: { id: string; label: string }[];
    items: TimelineSlotItem[];
    correctMapping: Record<string, string>;
  };
  threeElementsData?: {
    eventTitle: string;
    eventNarrative: string;
    questions: ThreeElementQuestion[];
  };
  workbenchData?: {
    caseIntro: string;
    benches: WorkbenchTask[];
  };
  branchingData?: {
    caseTitle: string;
    caseBrief: string;
    steps: BranchStep[];
  };
  correctSummary: string;
  explanation: string;
}

export interface LevelData {
  id: number;
  code: string;
  title: string;
  subtitle: string;
  topic: string;
  difficulty: string;
  fragmentName: string;
  fragmentSymbol: string;
  imagePath: string;
  ambientLabel?: string;
  openingCutscene: {
    speaker: string;
    lines: string[];
  };
  missionBrief: string;
  hints: [string, string, string];
  challenges: ChallengeData[];
  bonusChallenge: ChallengeData;
  materialSummary: string[];
  competencies: string[];
  improvementAdvice: string;
  unlockQuote: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  conditionLabel: string;
  iconKey: 'compass' | 'search' | 'flask' | 'clock' | 'book' | 'crown' | 'spark';
}

export interface LevelProgress {
  unlocked: boolean;
  completed: boolean;
  scoreEarned: number;
  hintsUsed: number;
  completedChallengeIds: string[];
  firstTryCorrectIds: string[];
  attemptedIds: string[];
  timedOutIds: string[];
  bonusCompleted: boolean;
  bonusCorrect: boolean;
  branchQualityScore?: number;
}

export interface ViolationEvent {
  timestamp: string;
  reason: string;
  levelId: number;
}

export interface PlayerProgress {
  playerName: string;
  playerClass: string;
  playerPhoto?: string;
  completionCode?: string;
  completedAt?: string;
  currentScreen: GameScreen;
  activeLevelId: number;
  totalScore: number;
  elapsedSeconds: number;
  soundEnabled: boolean;
  storyIntroSeen: boolean;
  nextLevelUnlockAt?: number;
  violationCount: number;
  violationLogs: ViolationEvent[];
  levels: Record<number, LevelProgress>;
  unlockedAchievementIds: string[];
}

export interface StudentRecord {
  studentKey: string;
  playerName: string;
  playerClass: string;
  totalScore: number;
  accuracyPct: number;
  completedLevelsCount: number;
  highestLevel: number;
  elapsedSeconds: number;
  violationCount: number;
  lastUpdatedAt: string;
  progress: PlayerProgress;
}
