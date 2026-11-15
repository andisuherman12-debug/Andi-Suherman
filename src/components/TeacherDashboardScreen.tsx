import { useMemo, useState } from 'react';
import {
  AlertTriangle,
  ArrowLeft,
  BookOpen,
  Check,
  CheckCircle2,
  Code2,
  Copy,
  Download,
  Edit3,
  KeyRound,
  Plus,
  RotateCcw,
  Save,
  Search,
  Trash2,
  Users,
} from 'lucide-react';
import { ChallengeData, LevelData, StudentRecord } from '../types/game';
import {
  deleteStudentRecord,
  getAllStudentRecords,
  resetEffectiveLevels,
  saveEffectiveLevels,
  setTeacherPassword,
} from '../utils/storage';
import { soundFX } from '../utils/sound';

interface TeacherDashboardScreenProps {
  levels: LevelData[];
  onUpdateLevels: (nextLevels: LevelData[]) => void;
  onExitTeacherMode: () => void;
}

const DEFAULT_SHARED_APP_URL =
  'https://ais-pre-n4pvesw2swu42xapqkpu57-316376543524.asia-east1.run.app';

export function TeacherDashboardScreen({
  levels,
  onUpdateLevels,
  onExitTeacherMode,
}: TeacherDashboardScreenProps) {
  const [activeTab, setActiveTab] = useState<'students' | 'bank' | 'embed'>('students');
  const [embedUrl, setEmbedUrl] = useState<string>(DEFAULT_SHARED_APP_URL);
  const [embedHeight, setEmbedHeight] = useState<number>(840);
  const [copiedEmbed, setCopiedEmbed] = useState(false);

  const [newTeacherPw, setNewTeacherPw] = useState('');
  const [pwSavedMsg, setPwSavedMsg] = useState('');
  const [showPwPanel, setShowPwPanel] = useState(false);

  // Student Progress State
  const [students, setStudents] = useState<StudentRecord[]>(() => getAllStudentRecords());
  const [searchQuery, setSearchQuery] = useState('');
  const [classFilter, setClassFilter] = useState('ALL');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Question Bank State
  const [selectedLevelId, setSelectedLevelId] = useState<number>(1);
  const [editingChallengeId, setEditingChallengeId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<ChallengeData | null>(null);
  const [missionBriefDraft, setMissionBriefDraft] = useState<string>('');
  const [hintsDraft, setHintsDraft] = useState<[string, string, string]>(['', '', '']);
  const [bankNotice, setBankNotice] = useState<string>('');

  // Add New Custom Question State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newType, setNewType] = useState<'CASE_ANALYSIS' | 'TRUE_FALSE_BATCH' | 'CODE_BREAKING'>(
    'CASE_ANALYSIS'
  );
  const [newTitle, setNewTitle] = useState('');
  const [newInstruction, setNewInstruction] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [newOptA, setNewOptA] = useState('');
  const [newOptB, setNewOptB] = useState('');
  const [newOptC, setNewOptC] = useState('');
  const [newCorrectIdx, setNewCorrectIdx] = useState(0);
  const [newCodeAnswer, setNewCodeAnswer] = useState('');
  const [newExplanation, setNewExplanation] = useState('');

  // Derived student lists & KPIs
  const uniqueClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.playerClass) set.add(s.playerClass);
    });
    return Array.from(set).sort();
  }, [students]);

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return students.filter((s) => {
      const matchesClass = classFilter === 'ALL' || s.playerClass === classFilter;
      const matchesQuery =
        !q ||
        s.playerName.toLowerCase().includes(q) ||
        s.playerClass.toLowerCase().includes(q);
      return matchesClass && matchesQuery;
    });
  }, [students, searchQuery, classFilter]);

  const avgScore = useMemo(() => {
    if (students.length === 0) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.totalScore, 0) / students.length);
  }, [students]);

  const avgAccuracy = useMemo(() => {
    if (students.length === 0) return 0;
    return Math.round(students.reduce((acc, s) => acc + s.accuracyPct, 0) / students.length);
  }, [students]);

  const finishedCount = useMemo(
    () => students.filter((s) => s.completedLevelsCount === 7).length,
    [students]
  );

  const activeLevel = levels.find((l) => l.id === selectedLevelId) || levels[0];

  const handleSelectLevelForBank = (id: number) => {
    soundFX.click();
    const target = levels.find((l) => l.id === id);
    setSelectedLevelId(id);
    setEditingChallengeId(null);
    setEditDraft(null);
    setShowAddForm(false);
    setBankNotice('');
    if (target) {
      setMissionBriefDraft(target.missionBrief);
      setHintsDraft([...target.hints] as [string, string, string]);
    }
  };

  // Initialize missionBriefDraft on mount if empty
  useState(() => {
    setMissionBriefDraft(activeLevel.missionBrief);
    setHintsDraft([...activeLevel.hints] as [string, string, string]);
  });

  const handleStartEditChallenge = (ch: ChallengeData) => {
    soundFX.click();
    setEditingChallengeId(ch.id);
    setEditDraft(JSON.parse(JSON.stringify(ch)) as ChallengeData);
    setShowAddForm(false);
    setBankNotice('');
  };

  const handleSaveChallengeEdit = () => {
    if (!editDraft) return;
    soundFX.success();
    const updatedLevels = levels.map((lvl) => {
      if (lvl.id !== selectedLevelId) return lvl;
      if (lvl.bonusChallenge.id === editDraft.id) {
        return { ...lvl, bonusChallenge: editDraft };
      }
      return {
        ...lvl,
        challenges: lvl.challenges.map((c) => (c.id === editDraft.id ? editDraft : c)),
      };
    });
    saveEffectiveLevels(updatedLevels);
    onUpdateLevels(updatedLevels);
    setEditingChallengeId(null);
    setEditDraft(null);
    setBankNotice(`Soal "${editDraft.title}" berhasil disimpan ke Bank Soal.`);
  };

  const handleSaveLevelBriefAndHints = () => {
    soundFX.success();
    const updatedLevels = levels.map((lvl) => {
      if (lvl.id !== selectedLevelId) return lvl;
      return {
        ...lvl,
        missionBrief: missionBriefDraft.trim() || lvl.missionBrief,
        hints: [
          hintsDraft[0].trim() || lvl.hints[0],
          hintsDraft[1].trim() || lvl.hints[1],
          hintsDraft[2].trim() || lvl.hints[2],
        ] as [string, string, string],
      };
    });
    saveEffectiveLevels(updatedLevels);
    onUpdateLevels(updatedLevels);
    setBankNotice(`Misi & petunjuk ARCHIVIST untuk ${activeLevel.title} diperbarui.`);
  };

  const handleAddCustomChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newInstruction.trim() || !newQuestion.trim()) return;

    const id = `custom_${selectedLevelId}_${Date.now()}`;
    let created: ChallengeData;

    if (newType === 'CODE_BREAKING') {
      const cleanAns = newCodeAnswer.trim().toUpperCase() || 'SEJARAH';
      created = {
        id,
        title: newTitle.trim(),
        mechanicLabel: 'Code Breaking (Bank Soal)',
        type: 'CODE_BREAKING',
        isCustom: true,
        instruction: newInstruction.trim(),
        codeBreakingData: {
          cipherClues: [
            { symbol: 'PETUNJUK', clue: newQuestion.trim() },
            { symbol: 'PANJANG', clue: `Terdiri dari ${cleanAns.length} karakter.` },
            { symbol: 'SUMBER', clue: `Materi ${activeLevel.topic}.` },
          ],
          question: newQuestion.trim(),
          placeholder: 'Ketik kata kunci...',
          acceptedAnswers: [cleanAns],
          displayAnswer: cleanAns,
        },
        correctSummary: cleanAns,
        explanation: newExplanation.trim() || 'Soal tambahan dari Bank Soal Guru.',
      };
    } else if (newType === 'TRUE_FALSE_BATCH') {
      created = {
        id,
        title: newTitle.trim(),
        mechanicLabel: 'True or False (Bank Soal)',
        type: 'TRUE_FALSE_BATCH',
        isCustom: true,
        instruction: newInstruction.trim(),
        trueFalseData: {
          statements: [
            {
              id: `${id}_s1`,
              statement: newQuestion.trim(),
              isTrue: newCorrectIdx === 0,
              reason: newExplanation.trim() || 'Sesuai materi sejarah kelas X.',
            },
          ],
        },
        correctSummary: newCorrectIdx === 0 ? 'Benar' : 'Salah',
        explanation: newExplanation.trim() || 'Soal tambahan dari Bank Soal Guru.',
      };
    } else {
      const opts = [
        { id: `${id}_a`, label: newOptA.trim() || 'Pilihan A', isCorrect: newCorrectIdx === 0 },
        { id: `${id}_b`, label: newOptB.trim() || 'Pilihan B', isCorrect: newCorrectIdx === 1 },
        { id: `${id}_c`, label: newOptC.trim() || 'Pilihan C', isCorrect: newCorrectIdx === 2 },
      ];
      created = {
        id,
        title: newTitle.trim(),
        mechanicLabel: 'Case Analysis (Bank Soal)',
        type: 'CASE_ANALYSIS',
        isCustom: true,
        instruction: newInstruction.trim(),
        caseData: {
          caseTitle: newTitle.trim(),
          question: newQuestion.trim(),
          options: opts,
        },
        correctSummary: opts[newCorrectIdx].label,
        explanation: newExplanation.trim() || 'Soal tambahan dari Bank Soal Guru.',
      };
    }

    soundFX.success();
    const updatedLevels = levels.map((lvl) =>
      lvl.id === selectedLevelId
        ? { ...lvl, challenges: [...lvl.challenges, created] }
        : lvl
    );
    saveEffectiveLevels(updatedLevels);
    onUpdateLevels(updatedLevels);

    setShowAddForm(false);
    setNewTitle('');
    setNewInstruction('');
    setNewQuestion('');
    setNewOptA('');
    setNewOptB('');
    setNewOptC('');
    setNewCodeAnswer('');
    setNewExplanation('');
    setBankNotice(`Soal baru "${created.title}" ditambahkan ke ${activeLevel.title}.`);
  };

  const handleDeleteCustomChallenge = (challengeId: string) => {
    soundFX.click();
    const updatedLevels = levels.map((lvl) =>
      lvl.id === selectedLevelId
        ? { ...lvl, challenges: lvl.challenges.filter((c) => c.id !== challengeId) }
        : lvl
    );
    saveEffectiveLevels(updatedLevels);
    onUpdateLevels(updatedLevels);
    setBankNotice('Soal tambahan berhasil dihapus dari Bank Soal.');
  };

  const handleResetBankToDefault = () => {
    soundFX.click();
    const defaults = resetEffectiveLevels();
    onUpdateLevels(defaults);
    const target = defaults.find((l) => l.id === selectedLevelId) || defaults[0];
    setMissionBriefDraft(target.missionBrief);
    setHintsDraft([...target.hints] as [string, string, string]);
    setEditingChallengeId(null);
    setEditDraft(null);
    setBankNotice('Seluruh Bank Soal telah dikembalikan ke materi bawaan awal.');
  };

  const handleDeleteStudent = (studentKey: string) => {
    soundFX.click();
    deleteStudentRecord(studentKey);
    const refreshed = getAllStudentRecords();
    setStudents(refreshed);
    if (selectedStudent?.studentKey === studentKey) {
      setSelectedStudent(null);
    }
  };

  const handleExportCSV = () => {
    soundFX.click();
    const headers = [
      'Nama Siswa',
      'Kelas',
      'Total Skor',
      'Ketepatan (%)',
      'Level Selesai',
      'Level Tertinggi',
      'Waktu (Detik)',
      'Jumlah Pelanggaran',
      'Terakhir Aktif',
    ];
    const rows = filteredStudents.map((s) => [
      `"${s.playerName.replace(/"/g, '""')}"`,
      `"${s.playerClass.replace(/"/g, '""')}"`,
      s.totalScore,
      s.accuracyPct,
      `${s.completedLevelsCount}/7`,
      `Level ${s.highestLevel}`,
      s.elapsedSeconds,
      s.violationCount,
      new Date(s.lastUpdatedAt).toLocaleString('id-ID'),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'progres-siswa-history-escape.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      {/* Header */}
      <section className="flex flex-col justify-between gap-4 rounded-xl border border-slate-700/80 bg-[#0B162C] p-6 sm:flex-row sm:items-center">
        <div>
          <div className="flex items-center gap-2 text-xs font-medium text-[#D4AF37]">
            <span>Mode Guru</span>
            <span aria-hidden="true">·</span>
            <span>Sejarah SMA Kelas X</span>
          </div>
          <h1 className="font-display mt-1 text-2xl font-bold text-white sm:text-3xl">
            Panel Pengelolaan Bank Soal & Progres Siswa
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => {
              soundFX.click();
              setShowPwPanel((s) => !s);
              setPwSavedMsg('');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37] whitespace-nowrap"
          >
            <KeyRound className="h-3.5 w-3.5 text-[#D4AF37]" />
            <span>Ubah Sandi Guru</span>
          </button>

          <button
            type="button"
            onClick={() => {
              soundFX.click();
              onExitTeacherMode();
            }}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#38BDF8] hover:text-white whitespace-nowrap"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Keluar Mode Guru</span>
          </button>
        </div>
      </section>

      {showPwPanel && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (newTeacherPw.trim().length < 4) return;
            setTeacherPassword(newTeacherPw);
            soundFX.success();
            setNewTeacherPw('');
            setPwSavedMsg('Kata sandi Mode Guru berhasil diperbarui.');
          }}
          className="mt-4 flex flex-col gap-3 rounded-xl border border-[#D4AF37]/40 bg-[#0B162C] p-4 sm:flex-row sm:items-center"
        >
          <input
            type="password"
            minLength={4}
            required
            value={newTeacherPw}
            onChange={(e) => setNewTeacherPw(e.target.value)}
            placeholder="Kata sandi guru baru (minimal 4 karakter)..."
            className="flex-1 rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
          />
          <button
            type="submit"
            className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap"
          >
            Simpan Sandi Baru
          </button>
          {pwSavedMsg && <span className="text-xs font-medium text-emerald-400">{pwSavedMsg}</span>}
        </form>
      )}

      {/* Segmented Tabs */}
      <div className="mt-6 flex flex-wrap items-center gap-2 rounded-xl border border-slate-800 bg-[#0B162C] p-2">
        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setStudents(getAllStudentRecords());
            setActiveTab('students');
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'students'
              ? 'bg-[#2563EB] text-white'
              : 'text-slate-300 hover:bg-[#12213D]'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Progres & Pencarian Siswa ({students.length})</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setActiveTab('bank');
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'bank'
              ? 'bg-[#2563EB] text-white'
              : 'text-slate-300 hover:bg-[#12213D]'
          }`}
        >
          <BookOpen className="h-4 w-4" />
          <span>Bank Soal & Editor Level</span>
        </button>

        <button
          type="button"
          onClick={() => {
            soundFX.click();
            setActiveTab('embed');
          }}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors whitespace-nowrap ${
            activeTab === 'embed'
              ? 'bg-[#2563EB] text-white'
              : 'text-slate-300 hover:bg-[#12213D]'
          }`}
        >
          <Code2 className="h-4 w-4" />
          <span>Sematkan Google Sites (HTML)</span>
        </button>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: STUDENT PROGRESS LIST & SEARCH */}
      {/* ===================================================================== */}
      {activeTab === 'students' && (
        <section className="mt-6 space-y-6">
          {/* 4 KPI Summary */}
          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-800 bg-[#0B162C] p-5 sm:grid-cols-4">
            <div>
              <p className="text-xs text-slate-400">Siswa Terdaftar</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-white">
                {students.length}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Rata-Rata Skor</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-[#D4AF37]">
                {avgScore} poin
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Rata-Rata Ketepatan</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-[#38BDF8]">
                {avgAccuracy}%
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Menuntaskan 7 Level</p>
              <p className="font-mono-tabular mt-1 text-2xl font-bold text-emerald-400">
                {finishedCount} siswa
              </p>
            </div>
          </div>

          {/* Search & Class Filter Bar */}
          <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0B162C] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-1 flex-col gap-3 sm:flex-row">
              <div className="relative flex-1">
                <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Cari nama siswa atau kelas..."
                  className="w-full rounded-lg border border-slate-700 bg-[#060D1A] py-2.5 pl-10 pr-4 text-sm text-white placeholder:text-slate-500 focus:border-[#38BDF8] focus:outline-none"
                />
              </div>

              <select
                value={classFilter}
                onChange={(e) => setClassFilter(e.target.value)}
                aria-label="Filter kelas siswa"
                className="rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2.5 text-sm text-white focus:border-[#38BDF8] focus:outline-none"
              >
                <option value="ALL">Semua Kelas ({students.length})</option>
                {uniqueClasses.map((cls) => (
                  <option key={cls} value={cls}>
                    Kelas {cls}
                  </option>
                ))}
              </select>
            </div>

            {filteredStudents.length > 0 && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-700 bg-[#060D1A] px-4 py-2.5 text-xs font-semibold text-slate-200 transition-colors hover:border-[#D4AF37]/60 whitespace-nowrap"
              >
                <Download className="h-4 w-4 text-[#D4AF37]" />
                <span>Unduh CSV</span>
              </button>
            )}
          </div>

          {/* Student List Table */}
          <div className="overflow-hidden rounded-xl border border-slate-800 bg-[#0B162C]">
            {filteredStudents.length === 0 ? (
              <div className="p-10 text-center">
                <Users className="mx-auto h-8 w-8 text-slate-500" />
                <p className="mt-3 text-sm font-medium text-slate-200">
                  {students.length === 0
                    ? 'Belum ada data siswa yang mengerjakan di perangkat ini.'
                    : 'Tidak ada siswa yang cocok dengan kata kunci pencarian.'}
                </p>
                <p className="mt-1 text-xs text-slate-400">
                  Data progres akan otomatis tercatat di sini setiap siswa masuk dengan Nama dan
                  Kelas lalu mulai mengerjakan misi.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-slate-800 bg-[#060D1A] text-xs text-slate-400">
                    <tr>
                      <th className="px-4 py-3 font-semibold">Nama Siswa</th>
                      <th className="px-4 py-3 font-semibold">Kelas</th>
                      <th className="px-4 py-3 font-semibold">Progres Level</th>
                      <th className="px-4 py-3 font-semibold">Ketepatan</th>
                      <th className="px-4 py-3 font-semibold">Skor</th>
                      <th className="px-4 py-3 font-semibold">Pelanggaran</th>
                      <th className="px-4 py-3 font-semibold">Waktu</th>
                      <th className="px-4 py-3 font-semibold text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/80">
                    {filteredStudents.map((st) => (
                      <tr
                        key={st.studentKey}
                        className="transition-colors hover:bg-[#12213D]/60"
                      >
                        <td className="px-4 py-3.5 font-medium text-white">{st.playerName}</td>
                        <td className="px-4 py-3.5 text-slate-300">{st.playerClass}</td>
                        <td className="px-4 py-3.5">
                          <span className="font-mono-tabular text-xs font-semibold text-[#38BDF8]">
                            {st.completedLevelsCount}/7 Selesai
                          </span>
                          <span className="ml-2 text-xs text-slate-400">
                            (Aktif Lv.{st.highestLevel})
                          </span>
                        </td>
                        <td className="font-mono-tabular px-4 py-3.5 text-emerald-400">
                          {st.accuracyPct}%
                        </td>
                        <td className="font-mono-tabular px-4 py-3.5 font-semibold text-[#D4AF37]">
                          {st.totalScore}
                        </td>
                        <td className="font-mono-tabular px-4 py-3.5 text-xs">
                          <span
                            className={`font-semibold ${
                              st.violationCount > 0 ? 'text-red-400' : 'text-emerald-400'
                            }`}
                          >
                            {st.violationCount > 0 ? `${st.violationCount}x` : '0'}
                          </span>
                        </td>
                        <td className="font-mono-tabular px-4 py-3.5 text-xs text-slate-300">
                          {formatTime(st.elapsedSeconds)}
                        </td>
                        <td className="px-4 py-3.5 text-right">
                          <div className="inline-flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                soundFX.click();
                                setSelectedStudent(
                                  selectedStudent?.studentKey === st.studentKey ? null : st
                                );
                              }}
                              className="rounded-md border border-slate-700 bg-[#060D1A] px-3 py-1.5 text-xs font-medium text-slate-200 hover:border-[#38BDF8]"
                            >
                              {selectedStudent?.studentKey === st.studentKey ? 'Tutup' : 'Detail'}
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteStudent(st.studentKey)}
                              aria-label={`Hapus data ${st.playerName}`}
                              className="rounded-md border border-slate-800 p-1.5 text-slate-400 hover:border-red-500/50 hover:text-red-400"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Student Detail Breakdown */}
          {selectedStudent && (
            <div className="rounded-xl border border-[#38BDF8]/50 bg-[#0B162C] p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
                <div className="flex items-center gap-3.5">
                  {selectedStudent.progress.playerPhoto && (
                    <img
                      src={selectedStudent.progress.playerPhoto}
                      alt={`Foto ${selectedStudent.playerName}`}
                      className="h-14 w-14 rounded-lg border border-[#D4AF37]/60 object-cover"
                    />
                  )}
                  <div>
                    <h2 className="text-base font-bold text-white">
                      Rincian Progres: {selectedStudent.playerName} · Kelas{' '}
                      {selectedStudent.playerClass}
                    </h2>
                    <p className="text-xs text-slate-400">
                      Pembaruan terakhir:{' '}
                      {new Date(selectedStudent.lastUpdatedAt).toLocaleString('id-ID')}
                      {selectedStudent.progress.completionCode && (
                        <>
                          {' · '}
                          <span className="font-mono-tabular font-semibold text-emerald-400">
                            Kode Verifikasi: {selectedStudent.progress.completionCode}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1">
                  <span className="font-mono-tabular text-sm font-bold text-[#D4AF37]">
                    Total: {selectedStudent.totalScore} poin
                  </span>
                  <span
                    className={`font-mono-tabular text-xs font-semibold ${
                      selectedStudent.violationCount > 0 ? 'text-red-400' : 'text-emerald-400'
                    }`}
                  >
                    Pelanggaran Integritas: {selectedStudent.violationCount}x
                  </span>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {levels.map((lvl) => {
                  const lp = selectedStudent.progress.levels[lvl.id];
                  return (
                    <div
                      key={lvl.id}
                      className="rounded-lg border border-slate-800 bg-[#060D1A]/80 p-3 text-xs"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-mono-tabular font-semibold text-[#D4AF37]">
                          {lvl.code}
                        </span>
                        <span className={lp?.completed ? 'text-emerald-400' : 'text-slate-400'}>
                          {lp?.completed ? 'Selesai' : lp?.unlocked ? 'Berjalan' : 'Terkunci'}
                        </span>
                      </div>
                      <p className="mt-1 font-medium text-white">{lvl.title}</p>
                      <p className="font-mono-tabular mt-1.5 text-slate-300">
                        Tantangan: {lp?.completedChallengeIds.length || 0}/{lvl.challenges.length}{' '}
                        · Skor: +{lp?.scoreEarned || 0}
                      </p>
                      <p className="font-mono-tabular text-slate-400">
                        Petunjuk dipakai: {lp?.hintsUsed || 0}/3
                      </p>
                    </div>
                  );
                })}
              </div>

              {selectedStudent.progress.violationLogs &&
                selectedStudent.progress.violationLogs.length > 0 && (
                  <div className="rounded-lg border border-red-500/35 bg-red-950/20 p-4">
                    <div className="flex items-center gap-2 text-xs font-semibold text-red-300">
                      <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
                      <span>
                        Riwayat Pelanggaran ({selectedStudent.progress.violationLogs.length} catatan)
                      </span>
                    </div>
                    <ul className="mt-2.5 max-h-48 space-y-1.5 overflow-y-auto text-xs text-slate-200">
                      {selectedStudent.progress.violationLogs.map((log, i) => (
                        <li
                          key={`${log.timestamp}-${i}`}
                          className="flex flex-wrap items-center justify-between gap-2 rounded border border-red-500/20 bg-[#060D1A]/75 px-3 py-2"
                        >
                          <span>
                            <span className="font-mono-tabular font-semibold text-red-300">
                              Lv.{log.levelId}
                            </span>{' '}
                            <span aria-hidden="true">·</span> {log.reason}
                          </span>
                          <span className="font-mono-tabular text-[11px] text-slate-400">
                            {new Date(log.timestamp).toLocaleString('id-ID')}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
            </div>
          )}
        </section>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: QUESTION BANK EDITOR */}
      {/* ===================================================================== */}
      {activeTab === 'bank' && (
        <section className="mt-6 space-y-6">
          {/* Level Selector + Reset Bank */}
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-800 bg-[#0B162C] p-4">
            <div className="flex flex-wrap gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl.id}
                  type="button"
                  onClick={() => handleSelectLevelForBank(lvl.id)}
                  className={`rounded-lg px-3 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                    selectedLevelId === lvl.id
                      ? 'bg-[#2563EB] text-white'
                      : 'border border-slate-700 bg-[#060D1A] text-slate-300 hover:border-slate-500'
                  }`}
                >
                  {lvl.code}: {lvl.topic}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={handleResetBankToDefault}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2 text-xs font-medium text-slate-300 hover:border-amber-400/60 hover:text-white whitespace-nowrap"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset ke Soal Bawaan</span>
            </button>
          </div>

          {bankNotice && (
            <div className="flex items-center gap-2 rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-3 text-xs font-medium text-emerald-200">
              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-400" />
              <span>{bankNotice}</span>
            </div>
          )}

          {/* Edit Mission Brief & Hints */}
          <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-5 space-y-4">
            <div className="flex items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <p className="text-xs text-[#38BDF8]">{activeLevel.code}</p>
                <h2 className="font-display text-xl font-bold text-white">{activeLevel.title}</h2>
              </div>
              <button
                type="button"
                onClick={handleSaveLevelBriefAndHints}
                className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8] whitespace-nowrap"
              >
                <Save className="h-3.5 w-3.5" />
                <span>Simpan Misi & Petunjuk</span>
              </button>
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-300">
                Deskripsi Misi Ruangan
              </label>
              <textarea
                rows={2}
                value={missionBriefDraft}
                onChange={(e) => setMissionBriefDraft(e.target.value)}
                className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060D1A] p-3 text-sm text-white focus:border-[#38BDF8] focus:outline-none"
              />
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {[0, 1, 2].map((idx) => (
                <div key={idx}>
                  <label className="block text-xs font-medium text-slate-300">
                    Petunjuk ARCHIVIST #{idx + 1}
                  </label>
                  <textarea
                    rows={3}
                    value={hintsDraft[idx]}
                    onChange={(e) => {
                      const next = [...hintsDraft] as [string, string, string];
                      next[idx] = e.target.value;
                      setHintsDraft(next);
                    }}
                    className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060D1A] p-2.5 text-xs leading-relaxed text-white focus:border-[#38BDF8] focus:outline-none"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Challenges Bank List + Add Button */}
          <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-white">
                  Daftar Soal & Tantangan ({activeLevel.challenges.length + 1} item)
                </h3>
                <p className="text-xs text-slate-400">
                  Klik "Edit Soal" untuk menyunting pertanyaan, pilihan jawaban, sandi, atau
                  pembahasan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  soundFX.click();
                  setShowAddForm((s) => !s);
                  setEditingChallengeId(null);
                }}
                className="inline-flex items-center gap-1.5 rounded-lg border border-[#D4AF37]/60 bg-[#D4AF37]/15 px-4 py-2 text-xs font-semibold text-[#FDE68A] hover:bg-[#D4AF37]/25 whitespace-nowrap"
              >
                <Plus className="h-4 w-4" />
                <span>Tambah Soal Baru</span>
              </button>
            </div>

            {/* Add Custom Question Form */}
            {showAddForm && (
              <form
                onSubmit={handleAddCustomChallenge}
                className="rounded-lg border border-[#D4AF37]/50 bg-[#060D1A]/90 p-5 space-y-4"
              >
                <h4 className="text-sm font-semibold text-[#FDE68A]">
                  Tambah Soal Baru ke {activeLevel.title}
                </h4>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs text-slate-300">Jenis Mekanisme Soal</label>
                    <select
                      value={newType}
                      onChange={(e) =>
                        setNewType(
                          e.target.value as 'CASE_ANALYSIS' | 'TRUE_FALSE_BATCH' | 'CODE_BREAKING'
                        )
                      }
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm text-white"
                    >
                      <option value="CASE_ANALYSIS">Analisis Kasus / Pilihan Logika</option>
                      <option value="TRUE_FALSE_BATCH">Audit Benar / Salah</option>
                      <option value="CODE_BREAKING">Pemecahan Sandi (Isian Kata Kunci)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs text-slate-300">Judul Tantangan</label>
                    <input
                      type="text"
                      required
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      placeholder="Contoh: Uji Sumber Sejarah Lokal"
                      className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs text-slate-300">Instruksi untuk Siswa</label>
                  <input
                    type="text"
                    required
                    value={newInstruction}
                    onChange={(e) => setNewInstruction(e.target.value)}
                    placeholder="Contoh: Analisislah dokumen berikut lalu pilih kesimpulan paling tepat."
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm text-white"
                  />
                </div>

                <div>
                  <label className="block text-xs text-slate-300">
                    {newType === 'TRUE_FALSE_BATCH'
                      ? 'Pernyataan untuk Dinilai Benar/Salah'
                      : 'Pertanyaan / Kasus'}
                  </label>
                  <textarea
                    rows={2}
                    required
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                    placeholder="Tuliskan pokok soal di sini..."
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] p-3 text-sm text-white"
                  />
                </div>

                {newType === 'CASE_ANALYSIS' && (
                  <div className="space-y-2.5">
                    <p className="text-xs font-medium text-slate-300">
                      Pilihan Jawaban (pilih tombol radio untuk menandai kunci jawaban benar):
                    </p>
                    {[
                      { val: newOptA, set: setNewOptA, label: 'Pilihan A', idx: 0 },
                      { val: newOptB, set: setNewOptB, label: 'Pilihan B', idx: 1 },
                      { val: newOptC, set: setNewOptC, label: 'Pilihan C', idx: 2 },
                    ].map((o) => (
                      <div key={o.idx} className="flex items-center gap-2.5">
                        <input
                          type="radio"
                          name="new-correct-opt"
                          checked={newCorrectIdx === o.idx}
                          onChange={() => setNewCorrectIdx(o.idx)}
                          className="h-4 w-4 accent-[#38BDF8]"
                        />
                        <input
                          type="text"
                          required
                          value={o.val}
                          onChange={(e) => o.set(e.target.value)}
                          placeholder={o.label}
                          className="flex-1 rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm text-white"
                        />
                      </div>
                    ))}
                  </div>
                )}

                {newType === 'TRUE_FALSE_BATCH' && (
                  <div className="flex items-center gap-4 text-xs text-slate-200">
                    <span>Kunci Jawaban:</span>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={newCorrectIdx === 0}
                        onChange={() => setNewCorrectIdx(0)}
                      />
                      Benar
                    </label>
                    <label className="inline-flex items-center gap-1.5">
                      <input
                        type="radio"
                        checked={newCorrectIdx === 1}
                        onChange={() => setNewCorrectIdx(1)}
                      />
                      Salah
                    </label>
                  </div>
                )}

                {newType === 'CODE_BREAKING' && (
                  <div>
                    <label className="block text-xs text-slate-300">
                      Kata Kunci Jawaban (1 kata/kode)
                    </label>
                    <input
                      type="text"
                      required
                      value={newCodeAnswer}
                      onChange={(e) => setNewCodeAnswer(e.target.value)}
                      placeholder="Contoh: HEURISTIK"
                      className="font-mono-tabular mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm uppercase text-white"
                    />
                  </div>
                )}

                <div>
                  <label className="block text-xs text-slate-300">Pembahasan Jawaban</label>
                  <textarea
                    rows={2}
                    value={newExplanation}
                    onChange={(e) => setNewExplanation(e.target.value)}
                    placeholder="Jelaskan mengapa jawaban tersebut benar..."
                    className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] p-2.5 text-xs text-white"
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddForm(false)}
                    className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="rounded-lg bg-[#2563EB] px-5 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                  >
                    Simpan ke Bank Soal
                  </button>
                </div>
              </form>
            )}

            {/* List of Existing Challenges */}
            <div className="space-y-3">
              {[...activeLevel.challenges, activeLevel.bonusChallenge].map((ch, idx) => {
                const isEditing = editingChallengeId === ch.id && editDraft;

                return (
                  <div
                    key={ch.id}
                    className="rounded-lg border border-slate-800 bg-[#060D1A]/85 p-4"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <span className="text-xs font-medium text-[#38BDF8]">
                          {ch.isBonus ? 'Tantangan Bonus' : `Tantangan ${idx + 1}`} ·{' '}
                          {ch.mechanicLabel}
                        </span>
                        <h4 className="mt-0.5 text-sm font-semibold text-white">{ch.title}</h4>
                      </div>

                      <div className="flex items-center gap-2">
                        {ch.isCustom && (
                          <button
                            type="button"
                            onClick={() => handleDeleteCustomChallenge(ch.id)}
                            className="inline-flex items-center gap-1 rounded-md border border-red-500/40 px-2.5 py-1.5 text-xs text-red-300 hover:bg-red-950/30"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            <span>Hapus</span>
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() =>
                            isEditing
                              ? (setEditingChallengeId(null), setEditDraft(null))
                              : handleStartEditChallenge(ch)
                          }
                          className="inline-flex items-center gap-1.5 rounded-md border border-slate-700 bg-[#0B162C] px-3 py-1.5 text-xs font-semibold text-slate-200 hover:border-[#38BDF8]"
                        >
                          <Edit3 className="h-3.5 w-3.5" />
                          <span>{isEditing ? 'Tutup Editor' : 'Edit Soal'}</span>
                        </button>
                      </div>
                    </div>

                    {!isEditing ? (
                      <div className="mt-2 space-y-1 text-xs text-slate-300">
                        <p>{ch.instruction}</p>
                        <p className="text-emerald-400">Kunci: {ch.correctSummary}</p>
                      </div>
                    ) : (
                      <div className="mt-4 space-y-4 border-t border-slate-800 pt-4">
                        <div>
                          <label className="block text-xs text-slate-300">Judul Tantangan</label>
                          <input
                            type="text"
                            value={editDraft.title}
                            onChange={(e) =>
                              setEditDraft({ ...editDraft, title: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] px-3 py-2 text-sm text-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs text-slate-300">Instruksi Soal</label>
                          <textarea
                            rows={2}
                            value={editDraft.instruction}
                            onChange={(e) =>
                              setEditDraft({ ...editDraft, instruction: e.target.value })
                            }
                            className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] p-2.5 text-sm text-white"
                          />
                        </div>

                        {/* Specific editor fields for Case Analysis */}
                        {editDraft.caseData && (
                          <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0B162C] p-3.5">
                            <div>
                              <label className="block text-xs text-slate-300">
                                Pertanyaan Kasus
                              </label>
                              <textarea
                                rows={2}
                                value={editDraft.caseData.question}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    caseData: {
                                      ...editDraft.caseData!,
                                      question: e.target.value,
                                    },
                                  })
                                }
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#060D1A] p-2.5 text-sm text-white"
                              />
                            </div>
                            <div className="space-y-2">
                              <p className="text-xs text-slate-300">
                                Pilihan Jawaban (centang jawaban benar):
                              </p>
                              {editDraft.caseData.options.map((opt, optIdx) => (
                                <div key={opt.id} className="flex items-start gap-2.5">
                                  <input
                                    type="radio"
                                    name={`edit-correct-${editDraft.id}`}
                                    checked={Boolean(opt.isCorrect)}
                                    onChange={() => {
                                      const nextOpts = editDraft.caseData!.options.map((o, i) => ({
                                        ...o,
                                        isCorrect: i === optIdx,
                                      }));
                                      setEditDraft({
                                        ...editDraft,
                                        caseData: { ...editDraft.caseData!, options: nextOpts },
                                        correctSummary: nextOpts[optIdx].label,
                                      });
                                    }}
                                    className="mt-2.5 h-4 w-4 accent-[#38BDF8]"
                                  />
                                  <textarea
                                    rows={2}
                                    value={opt.label}
                                    onChange={(e) => {
                                      const nextOpts = editDraft.caseData!.options.map((o, i) =>
                                        i === optIdx ? { ...o, label: e.target.value } : o
                                      );
                                      setEditDraft({
                                        ...editDraft,
                                        caseData: { ...editDraft.caseData!, options: nextOpts },
                                      });
                                    }}
                                    className="flex-1 rounded-lg border border-slate-700 bg-[#060D1A] p-2 text-xs text-white"
                                  />
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Specific editor fields for Code Breaking */}
                        {editDraft.codeBreakingData && (
                          <div className="space-y-3 rounded-lg border border-slate-800 bg-[#0B162C] p-3.5">
                            <div>
                              <label className="block text-xs text-slate-300">Pertanyaan Sandi</label>
                              <input
                                type="text"
                                value={editDraft.codeBreakingData.question}
                                onChange={(e) =>
                                  setEditDraft({
                                    ...editDraft,
                                    codeBreakingData: {
                                      ...editDraft.codeBreakingData!,
                                      question: e.target.value,
                                    },
                                  })
                                }
                                className="mt-1 w-full rounded-lg border border-slate-700 bg-[#060D1A] px-3 py-2 text-sm text-white"
                              />
                            </div>
                            <div>
                              <label className="block text-xs text-slate-300">
                                Kata Kunci Jawaban (Huruf Kapital)
                              </label>
                              <input
                                type="text"
                                value={editDraft.codeBreakingData.displayAnswer}
                                onChange={(e) => {
                                  const upper = e.target.value.toUpperCase();
                                  setEditDraft({
                                    ...editDraft,
                                    codeBreakingData: {
                                      ...editDraft.codeBreakingData!,
                                      displayAnswer: upper,
                                      acceptedAnswers: [upper.trim()],
                                    },
                                    correctSummary: upper.trim(),
                                  });
                                }}
                                className="font-mono-tabular mt-1 w-full rounded-lg border border-slate-700 bg-[#060D1A] px-3 py-2 text-sm text-white"
                              />
                            </div>
                          </div>
                        )}

                        {/* Specific editor fields for True/False Batch */}
                        {editDraft.trueFalseData && (
                          <div className="space-y-2.5 rounded-lg border border-slate-800 bg-[#0B162C] p-3.5">
                            <p className="text-xs font-medium text-slate-300">
                              Daftar Pernyataan Benar/Salah:
                            </p>
                            {editDraft.trueFalseData.statements.map((st, sIdx) => (
                              <div key={st.id} className="space-y-2 border-b border-slate-800 pb-2.5 last:border-none">
                                <textarea
                                  rows={2}
                                  value={st.statement}
                                  onChange={(e) => {
                                    const nextSts = editDraft.trueFalseData!.statements.map((item, i) =>
                                      i === sIdx ? { ...item, statement: e.target.value } : item
                                    );
                                    setEditDraft({
                                      ...editDraft,
                                      trueFalseData: { statements: nextSts },
                                    });
                                  }}
                                  className="w-full rounded-lg border border-slate-700 bg-[#060D1A] p-2 text-xs text-white"
                                />
                                <div className="flex items-center gap-4 text-xs text-slate-300">
                                  <span>Kunci:</span>
                                  <label className="inline-flex items-center gap-1">
                                    <input
                                      type="radio"
                                      checked={st.isTrue}
                                      onChange={() => {
                                        const nextSts = editDraft.trueFalseData!.statements.map(
                                          (item, i) =>
                                            i === sIdx ? { ...item, isTrue: true } : item
                                        );
                                        setEditDraft({
                                          ...editDraft,
                                          trueFalseData: { statements: nextSts },
                                        });
                                      }}
                                    />
                                    Benar
                                  </label>
                                  <label className="inline-flex items-center gap-1">
                                    <input
                                      type="radio"
                                      checked={!st.isTrue}
                                      onChange={() => {
                                        const nextSts = editDraft.trueFalseData!.statements.map(
                                          (item, i) =>
                                            i === sIdx ? { ...item, isTrue: false } : item
                                        );
                                        setEditDraft({
                                          ...editDraft,
                                          trueFalseData: { statements: nextSts },
                                        });
                                      }}
                                    />
                                    Salah
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Ringkasan Jawaban & Pembahasan */}
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <label className="block text-xs text-slate-300">
                              Ringkasan Kunci Jawaban
                            </label>
                            <textarea
                              rows={2}
                              value={editDraft.correctSummary}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, correctSummary: e.target.value })
                              }
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] p-2.5 text-xs text-white"
                            />
                          </div>
                          <div>
                            <label className="block text-xs text-slate-300">
                              Pembahasan Materi
                            </label>
                            <textarea
                              rows={2}
                              value={editDraft.explanation}
                              onChange={(e) =>
                                setEditDraft({ ...editDraft, explanation: e.target.value })
                              }
                              className="mt-1 w-full rounded-lg border border-slate-700 bg-[#0B162C] p-2.5 text-xs text-white"
                            />
                          </div>
                        </div>

                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingChallengeId(null);
                              setEditDraft(null);
                            }}
                            className="rounded-lg border border-slate-700 px-4 py-2 text-xs text-slate-300"
                          >
                            Batal
                          </button>
                          <button
                            type="button"
                            onClick={handleSaveChallengeEdit}
                            className="inline-flex items-center gap-1.5 rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                          >
                            <Save className="h-3.5 w-3.5" />
                            <span>Simpan Perubahan</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: GOOGLE SITES HTML EMBED & STANDALONE HTML EXPORT */}
      {/* ===================================================================== */}
      {activeTab === 'embed' && (
        <section className="mt-6 space-y-6">
          {/* Option A: Google Sites Embed HTML Code */}
          <div className="rounded-xl border border-slate-800 bg-[#0B162C] p-6 space-y-5">
            <div className="border-b border-slate-800 pb-4">
              <p className="text-xs font-medium text-[#38BDF8]">
                Opsi 1 · Direkomendasikan untuk Google Sites
              </p>
              <h2 className="font-display mt-1 text-xl font-bold text-white">
                Kode HTML Semat (Sematkan Kode / Embed Code)
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
                Salin kode HTML berikut dan tempel ke menu{' '}
                <strong className="text-white">Sisipkan → Sematkan → Sematkan kode</strong> di
                Google Sites agar kamera, audio sirine, dan penyimpanan progres siswa berjalan penuh.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="sm:col-span-2">
                <label className="block text-xs font-medium text-slate-300">
                  URL Aplikasi Game (HTTPS)
                </label>
                <div className="mt-1.5 flex gap-2">
                  <input
                    type="url"
                    value={embedUrl}
                    onChange={(e) => setEmbedUrl(e.target.value)}
                    placeholder="https://..."
                    className="flex-1 rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2 text-xs text-white focus:border-[#38BDF8] focus:outline-none"
                  />
                  {typeof window !== 'undefined' &&
                    window.location.origin.startsWith('http') &&
                    window.location.origin !== embedUrl && (
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.click();
                          setEmbedUrl(window.location.origin);
                        }}
                        className="rounded-lg border border-slate-700 bg-[#060D1A] px-3 py-2 text-xs font-medium text-slate-200 hover:border-[#38BDF8] whitespace-nowrap"
                      >
                        Pakai URL Saat Ini
                      </button>
                    )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300">
                  Tinggi Bingkai (px)
                </label>
                <select
                  value={embedHeight}
                  onChange={(e) => setEmbedHeight(Number(e.target.value))}
                  className="mt-1.5 w-full rounded-lg border border-slate-700 bg-[#060D1A] px-3.5 py-2 text-xs text-white focus:border-[#38BDF8] focus:outline-none"
                >
                  <option value={760}>760 px (Kompak)</option>
                  <option value={840}>840 px (Standar Direkomendasikan)</option>
                  <option value={940}>940 px (Layar Penuh Lega)</option>
                </select>
              </div>
            </div>

            {(() => {
              const cleanUrl = (embedUrl.trim() || DEFAULT_SHARED_APP_URL).replace(/"/g, '&quot;');
              const htmlSnippet = `<div style="position:relative;width:100%;height:${embedHeight}px;background:#060D1A;border-radius:12px;overflow:hidden;border:1px solid #1E293B;">
  <iframe
    src="${cleanUrl}"
    title="The History Escape: The Lost Timeline"
    style="width:100%;height:100%;border:0;display:block;"
    allow="camera; autoplay; fullscreen; clipboard-write"
    allowfullscreen
    loading="lazy"
  ></iframe>
</div>`;
              return (
                <>
                  <div className="rounded-lg border border-slate-700 bg-[#060D1A] p-4">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="font-mono-tabular text-[11px] font-semibold text-[#D4AF37]">
                        HTML EMBED CODE
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          soundFX.click();
                          navigator.clipboard?.writeText(htmlSnippet).catch(() => {});
                          setCopiedEmbed(true);
                          window.setTimeout(() => setCopiedEmbed(false), 2500);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-md bg-[#2563EB] px-3 py-1.5 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
                      >
                        {copiedEmbed ? (
                          <>
                            <Check className="h-3.5 w-3.5 text-emerald-300" />
                            <span>Tersalin!</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3.5 w-3.5" />
                            <span>Salin Kode HTML</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre className="overflow-x-auto font-mono text-xs leading-relaxed text-sky-200">
                      <code>{htmlSnippet}</code>
                    </pre>
                  </div>

                  <ol className="grid gap-3 text-xs leading-relaxed text-slate-300 sm:grid-cols-3">
                    <li className="rounded-lg border border-slate-800 bg-[#060D1A]/70 p-3.5">
                      <span className="font-semibold text-[#D4AF37]">1. Buka Google Sites</span>
                      <p className="mt-1">
                        Pilih halaman pembelajaran Sejarah Kelas X, lalu klik panel kanan{' '}
                        <strong className="text-white">Sisipkan (Insert)</strong>.
                      </p>
                    </li>
                    <li className="rounded-lg border border-slate-800 bg-[#060D1A]/70 p-3.5">
                      <span className="font-semibold text-[#D4AF37]">2. Pilih Sematkan Kode</span>
                      <p className="mt-1">
                        Klik <strong className="text-white">Sematkan (Embed)</strong> → tab{' '}
                        <strong className="text-white">Sematkan kode (Embed code)</strong> → tempel
                        kode HTML di atas.
                      </p>
                    </li>
                    <li className="rounded-lg border border-slate-800 bg-[#060D1A]/70 p-3.5">
                      <span className="font-semibold text-[#D4AF37]">3. Publikasikan</span>
                      <p className="mt-1">
                        Tarik bingkai memenuhi lebar halaman agar tampilan nyaman, lalu klik{' '}
                        <strong className="text-white">Publikasikan</strong>.
                      </p>
                    </li>
                  </ol>
                </>
              );
            })()}
          </div>

          {/* Option B: Standalone Single-File HTML Download */}
          <div className="rounded-xl border border-[#D4AF37]/40 bg-[#0B162C] p-6">
            <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-medium text-[#D4AF37]">
                  Opsi 2 · File HTML Tunggal Mandiri (All-in-One)
                </p>
                <h3 className="font-display mt-1 text-lg font-bold text-white">
                  Unduh File HTML Lengkap (1 File Mandiri)
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-300 max-w-2xl">
                  Seluruh kode game, CSS, audio sirine, dan 9 ilustrasi ruangan sudah dibundel ke
                  dalam satu file HTML tunggal tanpa folder tambahan. File ini dapat dijalankan
                  langsung secara offline di browser siswa atau diunggah ke hosting sekolah/GitHub
                  Pages lalu disematkan ke Google Sites.
                </p>
              </div>

              {typeof window !== 'undefined' && window.location.protocol.startsWith('http') ? (
                <a
                  href="/the-history-escape-google-sites.html"
                  download="The-History-Escape-Google-Sites.html"
                  onClick={() => soundFX.click()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-[#D4AF37] px-5 py-3 text-xs font-bold text-[#060D1A] transition-colors hover:bg-[#FDE68A] whitespace-nowrap"
                >
                  <Download className="h-4 w-4" />
                  <span>Unduh File .HTML</span>
                </a>
              ) : (
                <span className="rounded-lg border border-emerald-500/40 bg-emerald-950/30 px-4 py-2.5 text-xs font-medium text-emerald-300">
                  Anda sedang membuka versi HTML tunggal mandiri
                </span>
              )}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
