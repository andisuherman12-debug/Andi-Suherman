import { useState } from 'react';
import {
  CheckCircle2,
  Compass,
  FileText,
  FlaskConical,
  GitBranch,
  MapPin,
  Clock,
  Users,
  XCircle,
} from 'lucide-react';
import { ChallengeData } from '../../types/game';
import { soundFX } from '../../utils/sound';

interface SpecialPuzzleProps {
  challenge: ChallengeData;
  isSolved: boolean;
  onSubmitAttempt: (isCorrect: boolean, customScore?: number, feedback?: string) => void;
}

// 1. CASE_ANALYSIS
export function CaseAnalysisPuzzle({ challenge, isSolved, onSubmitAttempt }: SpecialPuzzleProps) {
  const data = challenge.caseData!;
  const correctOpt = data.options.find((o) => o.isCorrect);
  const [selectedId, setSelectedId] = useState<string | null>(
    isSolved && correctOpt ? correctOpt.id : null
  );

  const handleSubmit = () => {
    if (isSolved || !selectedId) return;
    const chosen = data.options.find((o) => o.id === selectedId);
    if (chosen?.isCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Analisis kasus tepat dan sesuai bukti sejarah!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Pilihan tersebut kurang tepat secara historis. Evaluasi ulang kaitan bukti dengan pertanyaannya.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-slate-700/80 bg-[#060D1A]/85 p-4">
        <h4 className="text-sm font-semibold text-[#D4AF37]">{data.caseTitle}</h4>
        {data.documents && data.documents.length > 0 && (
          <div className="mt-3 grid gap-3 md:grid-cols-2">
            {data.documents.map((doc, idx) => (
              <div
                key={idx}
                className="rounded-lg border border-slate-700/70 bg-[#0B162C] p-3.5"
              >
                <div className="flex items-start gap-2">
                  <FileText className="mt-0.5 h-4 w-4 shrink-0 text-[#38BDF8]" />
                  <div>
                    <p className="text-xs font-semibold text-white">{doc.title}</p>
                    <p className="mt-0.5 text-[11px] text-slate-400">{doc.meta}</p>
                  </div>
                </div>
                <p className="mt-2.5 text-xs leading-relaxed text-slate-200">{doc.content}</p>
              </div>
            ))}
          </div>
        )}
        <p className="mt-4 text-sm font-medium text-white">{data.question}</p>
      </div>

      <div className="space-y-2.5">
        {data.options.map((opt, idx) => {
          const isSelected = selectedId === opt.id;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={isSolved}
              onClick={() => {
                soundFX.click();
                setSelectedId(opt.id);
              }}
              className={`flex w-full items-start gap-3 rounded-lg border p-3.5 text-left text-sm transition-colors ${
                isSolved && opt.isCorrect
                  ? 'border-emerald-500/60 bg-emerald-950/25 text-emerald-100'
                  : isSelected
                  ? 'border-[#38BDF8] bg-[#2563EB]/20 text-white'
                  : 'border-slate-700/80 bg-[#060D1A]/80 text-slate-200 hover:border-slate-500'
              }`}
            >
              <span className="font-mono-tabular mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded border border-slate-600 text-xs font-semibold">
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="flex-1 leading-relaxed">{opt.label}</span>
              {isSolved && opt.isCorrect && (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
              )}
            </button>
          );
        })}
      </div>

      {!isSolved && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={!selectedId}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Konfirmasi Analisis
          </button>
        </div>
      )}
    </div>
  );
}

// 2. TRUE_FALSE_BATCH
export function TrueFalseBatchPuzzle({
  challenge,
  isSolved,
  onSubmitAttempt,
}: SpecialPuzzleProps) {
  const data = challenge.trueFalseData!;
  const [answers, setAnswers] = useState<Record<string, boolean>>(() => {
    if (isSolved) {
      const m: Record<string, boolean> = {};
      data.statements.forEach((s) => {
        m[s.id] = s.isTrue;
      });
      return m;
    }
    return {};
  });

  const allAnswered = Object.keys(answers).length === data.statements.length;

  const handleSubmit = () => {
    if (isSolved || !allAnswered) return;
    const isCorrect = data.statements.every((s) => answers[s.id] === s.isTrue);
    if (isCorrect) {
      soundFX.success();
      onSubmitAttempt(true, undefined, 'Seluruh pernyataan dinilai tepat!');
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Masih ada penilaian Benar/Salah yang keliru. Cermati lagi kata kunci tiap pernyataan.'
      );
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-3">
        {data.statements.map((st, idx) => {
          const val = answers[st.id];
          return (
            <div
              key={st.id}
              className="rounded-lg border border-slate-700/80 bg-[#060D1A]/85 p-4"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <p className="text-sm leading-relaxed text-slate-100">
                  <span className="font-mono-tabular mr-2 text-xs font-semibold text-[#D4AF37]">
                    0{idx + 1}.
                  </span>
                  {st.statement}
                </p>

                <div className="flex shrink-0 items-center gap-2">
                  <button
                    type="button"
                    disabled={isSolved}
                    onClick={() => {
                      soundFX.click();
                      setAnswers((prev) => ({ ...prev, [st.id]: true }));
                    }}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      val === true
                        ? 'border-emerald-500 bg-emerald-600/25 text-emerald-200'
                        : 'border-slate-700 bg-[#0B162C] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Benar
                  </button>
                  <button
                    type="button"
                    disabled={isSolved}
                    onClick={() => {
                      soundFX.click();
                      setAnswers((prev) => ({ ...prev, [st.id]: false }));
                    }}
                    className={`rounded-lg border px-4 py-2 text-xs font-semibold transition-colors whitespace-nowrap ${
                      val === false
                        ? 'border-amber-500 bg-amber-600/25 text-amber-200'
                        : 'border-slate-700 bg-[#0B162C] text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    Salah
                  </button>
                </div>
              </div>

              {isSolved && (
                <p className="mt-2.5 border-t border-slate-800 pt-2 text-xs text-emerald-300">
                  {st.reason}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!isSolved && (
        <div className="flex justify-end pt-1">
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Periksa Audit ({Object.keys(answers).length}/{data.statements.length})
          </button>
        </div>
      )}
    </div>
  );
}

// 3. THREE_ELEMENTS
export function ThreeElementsPuzzle({
  challenge,
  isSolved,
  onSubmitAttempt,
}: SpecialPuzzleProps) {
  const data = challenge.threeElementsData!;
  const [answers, setAnswers] = useState<Record<string, number>>(() => {
    if (isSolved) {
      const m: Record<string, number> = {};
      data.questions.forEach((q) => {
        m[q.id] = q.correctIndex;
      });
      return m;
    }
    return {};
  });

  const allAnswered = Object.keys(answers).length === data.questions.length;

  const getIcon = (t: string) => {
    if (t === 'Manusia') return <Users className="h-4 w-4 text-[#38BDF8]" />;
    if (t === 'Ruang') return <MapPin className="h-4 w-4 text-[#D4AF37]" />;
    return <Clock className="h-4 w-4 text-emerald-400" />;
  };

  const handleSubmit = () => {
    if (isSolved || !allAnswered) return;
    const isCorrect = data.questions.every((q) => answers[q.id] === q.correctIndex);
    if (isCorrect) {
      soundFX.success();
      onSubmitAttempt(
        true,
        undefined,
        'Ketiga unsur sejarah (Manusia, Ruang, Waktu) berhasil dipetakan saling berkaitan!'
      );
    } else {
      soundFX.error();
      onSubmitAttempt(
        false,
        undefined,
        'Salah satu unsur (Siapa / Di mana / Kapan) masih keliru. Baca ulang narasi peristiwanya.'
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-700/80 bg-[#060D1A]/85 p-4">
        <h4 className="text-sm font-semibold text-[#D4AF37]">{data.eventTitle}</h4>
        <p className="mt-2 text-sm leading-relaxed text-slate-200">{data.eventNarrative}</p>
      </div>

      <div className="space-y-4">
        {data.questions.map((q) => (
          <div
            key={q.id}
            className="rounded-lg border border-slate-700/80 bg-[#0B162C] p-4 space-y-2.5"
          >
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {getIcon(q.elementType)}
              <span>{q.prompt}</span>
            </div>
            <div className="space-y-2">
              {q.options.map((opt, idx) => {
                const chosen = answers[q.id] === idx;
                return (
                  <button
                    key={idx}
                    type="button"
                    disabled={isSolved}
                    onClick={() => {
                      soundFX.click();
                      setAnswers((prev) => ({ ...prev, [q.id]: idx }));
                    }}
                    className={`w-full rounded-lg border p-3 text-left text-xs sm:text-sm transition-colors ${
                      isSolved && idx === q.correctIndex
                        ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-100'
                        : chosen
                        ? 'border-[#38BDF8] bg-[#2563EB]/20 text-white'
                        : 'border-slate-700/80 bg-[#060D1A]/80 text-slate-300 hover:border-slate-500'
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {!isSolved && (
        <div className="flex justify-end">
          <button
            type="button"
            disabled={!allAnswered}
            onClick={handleSubmit}
            className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] disabled:cursor-not-allowed disabled:bg-slate-800 disabled:text-slate-500 whitespace-nowrap"
          >
            Kunci Tiga Dimensi ({Object.keys(answers).length}/{data.questions.length})
          </button>
        </div>
      )}
    </div>
  );
}

// 4. WORKBENCH_SIM (Level 3: 4 Meja Kerja Laboratorium)
export function WorkbenchSimPuzzle({ challenge, isSolved, onSubmitAttempt }: SpecialPuzzleProps) {
  const data = challenge.workbenchData!;
  const [activeBenchIdx, setActiveBenchIdx] = useState(0);
  const [completedBenches, setCompletedBenches] = useState<Record<string, boolean>>(() => {
    if (isSolved) {
      const m: Record<string, boolean> = {};
      data.benches.forEach((b) => {
        m[b.id] = true;
      });
      return m;
    }
    return {};
  });
  const [benchFeedback, setBenchFeedback] = useState<{ ok: boolean; text: string } | null>(null);
  const [hadWrongAttempt, setHadWrongAttempt] = useState(false);

  const currentBench = data.benches[activeBenchIdx];
  const completedCount = Object.values(completedBenches).filter(Boolean).length;

  const handleSelectBenchOption = (optionId: string) => {
    if (isSolved || completedBenches[currentBench.id]) return;
    const opt = currentBench.options.find((o) => o.id === optionId);
    if (!opt) return;

    if (opt.isCorrect) {
      soundFX.success();
      setBenchFeedback({ ok: true, text: opt.feedback });
      const nextCompleted = { ...completedBenches, [currentBench.id]: true };
      setCompletedBenches(nextCompleted);

      const allDone = data.benches.every((b) => nextCompleted[b.id]);
      if (allDone) {
        onSubmitAttempt(
          !hadWrongAttempt,
          undefined,
          'Keempat meja kerja penelitian aktif! Mesin riset laboratorium kembali beroperasi.'
        );
      }
    } else {
      soundFX.error();
      setHadWrongAttempt(true);
      setBenchFeedback({ ok: false, text: opt.feedback });
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-slate-700/80 bg-[#060D1A]/85 p-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#D4AF37]">
          Simulasi Laboratorium · {completedCount} / {data.benches.length} Meja Aktif
        </p>
        <p className="mt-1.5 text-sm text-slate-200">{data.caseIntro}</p>
      </div>

      {/* 4 Workbenches Tabs */}
      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
        {data.benches.map((bench, idx) => {
          const done = Boolean(completedBenches[bench.id]);
          const active = idx === activeBenchIdx;
          return (
            <button
              key={bench.id}
              type="button"
              onClick={() => {
                soundFX.click();
                setActiveBenchIdx(idx);
                setBenchFeedback(null);
              }}
              className={`rounded-lg border p-3 text-left transition-colors ${
                active
                  ? 'border-[#38BDF8] bg-[#12213D]'
                  : done
                  ? 'border-emerald-500/50 bg-emerald-950/20'
                  : 'border-slate-700/80 bg-[#060D1A]/75 hover:border-slate-500'
              }`}
            >
              <div className="flex items-center justify-between gap-1">
                <FlaskConical
                  className={`h-4 w-4 ${done ? 'text-emerald-400' : 'text-[#D4AF37]'}`}
                />
                {done && <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
              <p className="mt-2 text-xs font-semibold text-white">{bench.benchName}</p>
              <p className="mt-0.5 text-[11px] text-slate-400">{bench.stageName}</p>
            </button>
          );
        })}
      </div>

      {/* Active Bench Workspace */}
      <div className="rounded-lg border border-slate-700 bg-[#0B162C] p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-800 pb-3">
          <div>
            <span className="text-xs font-medium text-[#38BDF8]">{currentBench.stageName}</span>
            <h4 className="text-base font-semibold text-white">{currentBench.benchName}</h4>
          </div>
          {completedBenches[currentBench.id] && (
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400">
              <CheckCircle2 className="h-4 w-4" />
              Meja Aktif
            </span>
          )}
        </div>

        <p className="text-sm leading-relaxed text-slate-200">{currentBench.scenario}</p>

        <div className="space-y-2.5">
          {currentBench.options.map((opt) => {
            const benchDone = Boolean(completedBenches[currentBench.id]);
            return (
              <button
                key={opt.id}
                type="button"
                disabled={benchDone || isSolved}
                onClick={() => handleSelectBenchOption(opt.id)}
                className={`w-full rounded-lg border p-3.5 text-left text-sm transition-colors ${
                  benchDone && opt.isCorrect
                    ? 'border-emerald-500/60 bg-emerald-950/30 text-emerald-100'
                    : 'border-slate-700 bg-[#060D1A]/85 text-slate-200 hover:border-[#38BDF8] hover:bg-[#12213D] disabled:opacity-60'
                }`}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {benchFeedback && (
          <div
            className={`flex items-start gap-2.5 rounded-lg border p-3 text-xs leading-relaxed ${
              benchFeedback.ok
                ? 'border-emerald-500/40 bg-emerald-950/25 text-emerald-200'
                : 'border-amber-500/40 bg-amber-950/25 text-amber-200'
            }`}
          >
            {benchFeedback.ok ? (
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            ) : (
              <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            )}
            <span>{benchFeedback.text}</span>
          </div>
        )}

        {completedBenches[currentBench.id] && activeBenchIdx < data.benches.length - 1 && (
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setActiveBenchIdx((i) => i + 1);
                setBenchFeedback(null);
              }}
              className="rounded-lg bg-[#2563EB] px-4 py-2 text-xs font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Pindah ke {data.benches[activeBenchIdx + 1].benchName}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// 5. BRANCHING_FINAL (Level 7: Investigasi Bercabang The Missing History)
export function BranchingFinalPuzzle({
  challenge,
  isSolved,
  onSubmitAttempt,
}: SpecialPuzzleProps) {
  const data = challenge.branchingData!;
  const [stepIdx, setStepIdx] = useState(0);
  const [chosenLog, setChosenLog] = useState<
    {
      stepTitle: string;
      chosenLabel: string;
      consequence: string;
      clue: string;
      score: number;
      isOptimal: boolean;
    }[]
  >([]);
  const [latestFeedback, setLatestFeedback] = useState<{
    consequence: string;
    clue: string;
    isOptimal: boolean;
  } | null>(null);

  const currentStep = data.steps[stepIdx];
  const finishedAllSteps = isSolved || chosenLog.length === data.steps.length;

  const handleChooseBranch = (optId: string) => {
    if (finishedAllSteps) return;
    const opt = currentStep.options.find((o) => o.id === optId);
    if (!opt) return;

    const optimal = Boolean(opt.isCorrect);
    if (optimal) soundFX.success();
    else soundFX.error();

    const entry = {
      stepTitle: currentStep.title,
      chosenLabel: opt.label,
      consequence: opt.consequence || '',
      clue: opt.unlockedClue || '',
      score: opt.branchScore ?? 0,
      isOptimal: optimal,
    };

    const nextLog = [...chosenLog, entry];
    setChosenLog(nextLog);
    setLatestFeedback({
      consequence: entry.consequence,
      clue: entry.clue,
      isOptimal: optimal,
    });

    if (nextLog.length === data.steps.length) {
      const optimalCount = nextLog.filter((l) => l.isOptimal).length;
      const qualityRatio = optimalCount / data.steps.length;
      onSubmitAttempt(
        qualityRatio >= 0.65,
        optimalCount * 20,
        `Investigasi bercabang selesai! Kamu menuntaskan ${optimalCount} dari ${data.steps.length} keputusan secara optimal berbasis bukti.`
      );
    }
  };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-[#D4AF37]/40 bg-[#060D1A]/90 p-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-[#D4AF37]">
            <GitBranch className="h-4 w-4" />
            <span>{data.caseTitle}</span>
          </div>
          <span className="font-mono-tabular text-xs text-slate-400">
            Tahap {Math.min(chosenLog.length + 1, data.steps.length)} / {data.steps.length}
          </span>
        </div>
        <p className="mt-2 text-xs leading-relaxed text-slate-300">{data.caseBrief}</p>
      </div>

      {/* Discovered Clues Notebook */}
      {chosenLog.length > 0 && (
        <div className="rounded-lg border border-slate-800 bg-[#060D1A]/70 p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#38BDF8]">
            Catatan Temuan Investigasi ({chosenLog.length})
          </p>
          <ul className="mt-2.5 space-y-2">
            {chosenLog.map((item, idx) => (
              <li key={idx} className="text-xs leading-relaxed text-slate-300">
                <span className={item.isOptimal ? 'text-emerald-400 font-semibold' : 'text-amber-400 font-semibold'}>
                  Tahap {idx + 1}:{' '}
                </span>
                {item.clue}
              </li>
            ))}
          </ul>
        </div>
      )}

      {!finishedAllSteps && !latestFeedback && (
        <div className="rounded-lg border border-slate-700 bg-[#0B162C] p-5 space-y-4">
          <div>
            <span className="text-xs font-medium text-[#38BDF8]">{currentStep.phaseLabel}</span>
            <h4 className="mt-1 text-base font-semibold text-white">{currentStep.title}</h4>
          </div>
          <p className="text-sm leading-relaxed text-slate-200">{currentStep.narrative}</p>
          <p className="text-sm font-semibold text-[#FDE68A]">{currentStep.question}</p>

          <div className="space-y-2.5">
            {currentStep.options.map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => handleChooseBranch(opt.id)}
                className="w-full rounded-lg border border-slate-700 bg-[#060D1A]/85 p-3.5 text-left text-sm leading-relaxed text-slate-200 transition-colors hover:border-[#38BDF8] hover:bg-[#12213D]"
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {latestFeedback && !finishedAllSteps && (
        <div className="rounded-lg border border-slate-700 bg-[#0B162C] p-5 space-y-4">
          <div className="flex items-start gap-3">
            <Compass
              className={`mt-0.5 h-5 w-5 shrink-0 ${
                latestFeedback.isOptimal ? 'text-emerald-400' : 'text-amber-400'
              }`}
            />
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-white">
                {latestFeedback.isOptimal
                  ? 'Keputusan Berbasis Bukti Tepat'
                  : 'Konsekuensi Jalur Alternatif'}
              </h4>
              <p className="text-sm leading-relaxed text-slate-200">
                {latestFeedback.consequence}
              </p>
              <div className="rounded-lg border border-[#38BDF8]/30 bg-[#060D1A] p-3 text-xs text-[#38BDF8]">
                {latestFeedback.clue}
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                setLatestFeedback(null);
                setStepIdx((i) => i + 1);
              }}
              className="rounded-lg bg-[#2563EB] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#1D4ED8]"
            >
              Lanjut ke Tahap {stepIdx + 2}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
