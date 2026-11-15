import { useState } from 'react';
import { ArrowRight, SkipForward } from 'lucide-react';
import { motion } from 'motion/react';
import { GAME_IMAGES } from '../data/assets';
import { SceneImage } from './SceneImage';
import { soundFX } from '../utils/sound';

interface StoryIntroScreenProps {
  playerName: string;
  onCompleteIntro: () => void;
}

export function StoryIntroScreen({ playerName, onCompleteIntro }: StoryIntroScreenProps) {
  const [sceneIdx, setSceneIdx] = useState(0);

  const scenes = [
    {
      kicker: 'Adegan 01 · Kunjungan Laboratorium',
      title: 'Chronos Historical Research Center',
      speaker: 'Narasi Pembuka',
      image: GAME_IMAGES.hero,
      text: `Hari itu, ${playerName} bersama rombongan siswa SMA mengikuti kunjungan edukasi ke Chronos Historical Research Center—sebuah laboratorium yang menyimpan perangkat eksperimen bernama Chronos Engine, teknologi yang dirancang untuk merekonstruksi peristiwa masa lalu melalui bukti sejarah.`,
    },
    {
      kicker: 'Adegan 02 · Insiden Penguncian Permanen',
      title: 'Kegagalan Sistem Chronos Engine',
      speaker: 'Peringatan Laboratorium',
      image: GAME_IMAGES.level5,
      text: 'Tiba-tiba, lonjakan energi mengacaukan ruang arsip. Seluruh dokumen sejarah tercerai-berai, tujuh pintu ruangan terkunci otomatis, dan sistem keamanan mengaktifkan protokol penguncian permanen. Kamu terpisah dan terjebak di dalam kompleks laboratorium!',
    },
    {
      kicker: 'Adegan 03 · Kemunculan Pemandu AI',
      title: 'ARCHIVIST Mengaktifkan Protokol Pemulihan',
      speaker: 'ARCHIVIST',
      image: GAME_IMAGES.level1,
      text: `"Selamat datang, ${playerName}. Saya ARCHIVIST, asisten pengelola arsip laboratorium. Satu-satunya cara membuka gerbang keluar adalah memulihkan tujuh keping kode sejarah di tujuh ruangan berbeda. Saya dapat memberi hingga 3 petunjuk tiap ruangan, tetapi kemampuan berpikirmulah yang harus memecahkan misterinya."`,
    },
    {
      kicker: 'Adegan 04 · Pertanyaan Kunci Ruang Waktu',
      title: 'Misi Utama Menanti',
      speaker: 'ARCHIVIST',
      image: GAME_IMAGES.level7,
      text: '"Sebelum memulai, simpan pertanyaan utama ini di benakmu: Jika masa lalu tidak dapat diulang, bagaimana manusia bisa mengetahui bahwa suatu peristiwa benar-benar pernah terjadi? Jawaban atas pertanyaan itulah yang kelak mengaktifkan kembali Chronos Core."',
    },
  ];

  const current = scenes[sceneIdx];
  const isLast = sceneIdx === scenes.length - 1;

  const handleNext = () => {
    soundFX.click();
    if (isLast) {
      onCompleteIntro();
    } else {
      setSceneIdx((i) => i + 1);
    }
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:py-12">
      <motion.div
        key={sceneIdx}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="overflow-hidden rounded-xl border border-slate-700/80 bg-[#0B162C]"
      >
        <SceneImage
          src={current.image}
          alt={current.title}
          className="rounded-none border-0 border-b border-slate-800"
          scrimClassName="bg-gradient-to-t from-[#0B162C] via-[#060D1A]/30 to-transparent"
        >
          <div className="absolute bottom-4 left-5 right-5 flex items-center justify-between gap-3">
            <span className="text-xs font-medium text-[#D4AF37]">{current.kicker}</span>
            <span className="font-mono-tabular text-xs text-slate-300">
              {sceneIdx + 1} / {scenes.length}
            </span>
          </div>
        </SceneImage>

        <div className="p-6 sm:p-8">
          <div className="flex items-center gap-3">
            <img
              src={GAME_IMAGES.archivist}
              alt="ARCHIVIST"
              referrerPolicy="no-referrer"
              className="h-10 w-10 rounded-lg border border-[#D4AF37]/40 object-cover"
            />
            <div>
              <p className="text-xs font-semibold text-[#38BDF8]">{current.speaker}</p>
              <h1 className="font-display text-xl font-bold text-white sm:text-2xl">
                {current.title}
              </h1>
            </div>
          </div>

          <p className="mt-5 text-base leading-relaxed text-slate-200">{current.text}</p>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-slate-800 pt-5">
            <button
              type="button"
              onClick={() => {
                soundFX.click();
                onCompleteIntro();
              }}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-400 transition-colors hover:text-white"
            >
              <SkipForward className="h-3.5 w-3.5" />
              <span>Lewati ke Peta Misi</span>
            </button>

            <button
              type="button"
              onClick={handleNext}
              className="inline-flex items-center gap-2 rounded-lg bg-[#2563EB] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#1D4ED8] whitespace-nowrap"
            >
              <span>{isLast ? 'Buka Peta Laboratorium' : 'Lanjutkan Cerita'}</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
