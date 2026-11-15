import { LevelData } from '../types/game';
import { GAME_IMAGES } from './assets';

export const LEVELS: LevelData[] = [
  // ============================================================================
  // LEVEL 1 — THE ORIGIN CHAMBER (Etimologi Sejarah)
  // ============================================================================
  {
    id: 1,
    code: 'RUANG 01',
    title: 'The Origin Chamber',
    subtitle: 'Etimologi dan Pengertian Sejarah',
    topic: 'Etimologi Sejarah',
    difficulty: 'Dasar',
    fragmentName: 'Ancient Word Fragment',
    fragmentSymbol: 'FRAG-01',
    imagePath: GAME_IMAGES.level1,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Selamat datang di Ruang 01: The Origin Chamber. Di ruangan inilah catatan bahasa tertua di laboratorium tersimpan.',
        'Akibat kegagalan Chronos Engine, istilah-istilah akar kata sejarah tercerai-berai di antara manuskrip Arab, Yunani, dan Inggris.',
        'Untuk membuka kunci pintu pertama dan memperoleh Ancient Word Fragment, buktikan bahwa kamu memahami asal-usul kata "sejarah" dan makna hakikinya.',
      ],
    },
    missionBrief:
      'Inspeksi manuskrip tersembunyi di ruangan, cocokkan etimologi istilah sejarah lintas bahasa, susun definisi sejarah secara ilmiah, dan pecahkan sandi gerbang.',
    hints: [
      'Ingat akar kata dari bahasa Arab yang melambangkan silsilah keluarga yang bercabang seperti akar, batang, dan ranting.',
      'Dalam bahasa Yunani, "historia" bukan sekadar dongeng, melainkan pengetahuan yang diperoleh melalui penyelidikan atau penelitian.',
      'Pengertian sejarah yang utuh selalu memuat tiga hal: kajian tentang kehidupan manusia, terjadi pada masa lampau, dan didukung bukti.',
    ],
    challenges: [
      {
        id: 'l1_c1',
        title: 'Inspeksi Manuskrip Ruang Arsip',
        mechanicLabel: 'Hidden Object',
        type: 'HIDDEN_OBJECT',
        instruction:
          'Klik 4 titik manuskrip tersembunyi di dalam ilustrasi The Origin Chamber untuk mengumpulkan huruf sandi rahasia, lalu masukkan kata kuncinya.',
        hiddenObjectData: {
          sceneCaption:
            'Arahkan kursor dan klik penanda cahaya pada rak manuskrip, meja baca, lentera prasasti, dan tangga batu.',
          hotspots: [
            {
              id: 'hs_arab',
              label: 'Gulungan Arab Klasik',
              xPercent: 54,
              yPercent: 72,
              clueTitle: 'Manuskrip Arab: Syajaratun',
              clueText:
                'Dalam bahasa Arab, "syajaratun" berarti pohon—menggambarkan silsilah atau asal-usul keturunan yang terus tumbuh dan bercabang.',
              codeLetter: 'SYA',
            },
            {
              id: 'hs_yunani',
              label: 'Prasasti Dinding Yunani',
              xPercent: 18,
              yPercent: 25,
              clueTitle: 'Catatan Herodotus: Historia',
              clueText:
                'Bahasa Yunani "historia" bermakna penyelidikan atau pengetahuan yang diperoleh melalui penelitian sistematis.',
              codeLetter: 'JA',
            },
            {
              id: 'hs_inggris',
              label: 'Rak Arsip Barat',
              xPercent: 74,
              yPercent: 44,
              clueTitle: 'Leksikon Inggris: History',
              clueText:
                'Kata "history" dalam bahasa Inggris diserap dari bahasa Latin dan Yunani "historia" untuk menyebut kajian masa lampau manusia.',
              codeLetter: 'RA',
            },
            {
              id: 'hs_nusantara',
              label: 'Lentera Silsilah Nusantara',
              xPercent: 39,
              yPercent: 35,
              clueTitle: 'Perkembangan ke Bahasa Indonesia',
              clueText:
                'Dari "syajarah" (Melayu) menjadi "sejarah": kisah dan kajian tentang asal-usul, kejadian nyata, serta perkembangan manusia masa lampau.',
              codeLetter: 'TUN',
            },
          ],
          secretPrompt:
            'Gabungkan petunjuk dari manuskrip di atas! Ketik istilah bahasa Arab yang berarti "pohon" sebagai kata rahasia pembuka kunci:',
          secretAnswer: 'SYAJARATUN',
          acceptedAnswers: ['SYAJARATUN', 'SYAJARAH'],
        },
        correctSummary: 'SYAJARATUN',
        explanation:
          'Kata "sejarah" dalam bahasa Indonesia berasal dari bahasa Arab "syajaratun" (pohon), yang melambangkan silsilah, asal-usul, dan kesinambungan perkembangan kehidupan manusia dari akar hingga cabang-cabangnya.',
      },
      {
        id: 'l1_c2',
        title: 'Teka-Teki Akar Bahasa',
        mechanicLabel: 'Matching Puzzle',
        type: 'MATCHING',
        instruction:
          'Pasangkan setiap istilah di kolom kiri dengan bahasa asal dan maknanya yang tepat di kolom kanan.',
        matchingData: {
          leftHeader: 'Istilah Sejarah',
          rightHeader: 'Asal Bahasa & Makna',
          pairs: [
            {
              id: 'p_syajaratun',
              left: 'Syajaratun',
              right: 'Bahasa Arab — berarti "pohon", melambangkan silsilah atau asal-usul',
            },
            {
              id: 'p_historia',
              left: 'Historia',
              right: 'Bahasa Yunani — penyelidikan atau pengetahuan hasil penelitian',
            },
            {
              id: 'p_history',
              left: 'History',
              right: 'Bahasa Inggris — kajian peristiwa masa lampau yang diserap dari historia',
            },
            {
              id: 'p_geschiedenis',
              left: 'Geschiedenis',
              right: 'Bahasa Belanda — berasal dari kata "geschieden" yang berarti terjadi',
            },
          ],
        },
        correctSummary:
          'Syajaratun (Arab: pohon/silsilah), Historia (Yunani: penyelidikan), History (Inggris: serapan historia), Geschiedenis (Belanda: sesuatu yang terjadi).',
        explanation:
          'Memahami etimologi memperlihatkan bahwa sejarah mencakup dimensi asal-usul/silsilah (syajaratun), proses penyelidikan empiris (historia), serta peristiwa nyata yang benar-benar terjadi (geschiedenis).',
      },
      {
        id: 'l1_c3',
        title: 'Rekonstruksi Pengertian Sejarah',
        mechanicLabel: 'Sequence Puzzle',
        type: 'SEQUENCE',
        instruction:
          'Susun potongan manuskrip berikut dari atas ke bawah agar membentuk definisi ilmu sejarah yang utuh dan runtut.',
        sequenceData: {
          items: [
            {
              id: 'seg_4',
              label: 'berdasarkan bukti dan jejak peninggalan yang dapat diverifikasi.',
              detail: 'Bagian 4 — Landasan empiris',
            },
            {
              id: 'seg_2',
              label: 'peristiwa dan aktivitas kehidupan manusia',
              detail: 'Bagian 2 — Objek kajian',
            },
            {
              id: 'seg_1',
              label: 'Sejarah adalah kajian sistematis mengenai',
              detail: 'Bagian 1 — Subjek definisi',
            },
            {
              id: 'seg_3',
              label: 'yang benar-benar berlangsung pada masa lampau',
              detail: 'Bagian 3 — Dimensi waktu',
            },
          ],
          correctOrderIds: ['seg_1', 'seg_2', 'seg_3', 'seg_4'],
        },
        correctSummary:
          'Sejarah adalah kajian sistematis mengenai peristiwa dan aktivitas kehidupan manusia yang benar-benar berlangsung pada masa lampau berdasarkan bukti dan jejak peninggalan yang dapat diverifikasi.',
        explanation:
          'Sejarah bukan sekadar cerita bebas atau mitos, melainkan kajian sistematis tentang kehidupan manusia pada masa lampau yang didukung oleh bukti.',
      },
      {
        id: 'l1_c4',
        title: 'Sandi Gerbang Origin Chamber',
        mechanicLabel: 'Code Breaking',
        type: 'CODE_BREAKING',
        instruction:
          'Panel pintu keluar meminta sebuah kata kunci Yunani yang diperkenalkan Herodotus dan menjadi akar kata "history" dalam bahasa Inggris.',
        codeBreakingData: {
          cipherClues: [
            { symbol: 'H - I - S', clue: 'Tiga huruf awal berarti mencari atau bertanya.' },
            { symbol: 'T - O - R', clue: 'Merujuk pada orang yang mengetahui atau menyaksikan.' },
            { symbol: 'I - A', clue: 'Akhiran kata benda Yunani yang berarti hasil penyelidikan.' },
          ],
          question: 'Masukkan kata Yunani kuno (8 huruf) yang menjadi akar kata "history":',
          placeholder: 'Ketik jawaban...',
          acceptedAnswers: ['HISTORIA'],
          displayAnswer: 'HISTORIA',
        },
        correctSummary: 'HISTORIA',
        explanation:
          'Istilah Yunani "historia" (dipopulerkan oleh Herodotus pada abad ke-5 SM) berarti penyelidikan/pengetahuan yang diperoleh melalui penelitian, yang kemudian diserap ke bahasa Latin dan Inggris menjadi "history".',
      },
    ],
    bonusChallenge: {
      id: 'l1_bonus',
      title: 'Tantangan Bonus: Makna Filosofis Etimologi',
      mechanicLabel: 'Case Analysis',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Analisislah perbedaan penekanan makna antara "syajaratun" dan "historia" dalam memahami hakikat ilmu sejarah.',
      caseData: {
        caseTitle: 'Perbandingan Dua Akar Kata',
        question:
          'Mengapa metafora "syajaratun" (pohon) dan konsep "historia" (penyelidikan) saling melengkapi dalam definisi sejarah modern?',
        options: [
          {
            id: 'opt_a',
            label:
              'Syajaratun menekankan keterkaitan asal-usul dan perkembangan berkesinambungan, sedangkan historia menekankan cara memperoleh pengetahuan melalui penelitian bukti.',
            isCorrect: true,
          },
          {
            id: 'opt_b',
            label:
              'Syajaratun hanya membahas sejarah tumbuhan, sedangkan historia khusus membahas peperangan di Eropa kuno.',
            isCorrect: false,
          },
          {
            id: 'opt_c',
            label:
              'Keduanya sama-sama berarti legenda rakyat yang diwariskan secara lisan tanpa perlu pembuktian.',
            isCorrect: false,
          },
        ],
      },
      correctSummary:
        'Syajaratun menekankan asal-usul & kesinambungan, sementara historia menekankan metode penyelidikan berbasis bukti.',
      explanation:
        'Metafora pohon (akar, batang, cabang) menggambarkan pertumbuhan dan silsilah peristiwa manusia, sedangkan "historia" menegaskan bahwa pengetahuan masa lalu harus digali lewat penyelidikan kritis.',
    },
    materialSummary: [
      'Istilah "sejarah" berakar dari bahasa Arab "syajaratun" yang berarti pohon—melambangkan silsilah, asal-usul, dan keterkaitan perkembangan dari waktu ke waktu.',
      'Kata "history" dalam bahasa Inggris berasal dari bahasa Yunani "historia" yang berarti penyelidikan atau pengetahuan yang diperoleh melalui penelitian.',
      'Dalam bahasa Belanda dikenal "geschiedenis" (dari "geschieden" = terjadi), menekankan peristiwa nyata yang telah terjadi.',
      'Secara ilmiah, sejarah mengkaji peristiwa kehidupan manusia di masa lampau berdasarkan bukti dan peninggalan yang dapat dipertanggungjawabkan.',
    ],
    competencies: [
      'Menjelaskan etimologi kata sejarah dari bahasa Arab, Yunani, Inggris, dan Belanda.',
      'Menghubungkan metafora pohon (syajaratun) dengan konsep silsilah dan perkembangan sejarah.',
      'Merumuskan pengertian sejarah sebagai kajian masa lampau manusia berbasis bukti.',
    ],
    improvementAdvice:
      'Bedakan dengan tegas antara makna "silsilah/keturunan" (syajaratun) dengan "metode penyelidikan" (historia). Keduanya bersatu membentuk pemahaman sejarah modern.',
    unlockQuote:
      'Ancient Word Fragment terpasang! Pintu menuju The Evidence Room terbuka perlahan.',
  },

  // ============================================================================
  // LEVEL 2 — THE EVIDENCE ROOM (Sumber-Sumber Sejarah)
  // ============================================================================
  {
    id: 2,
    code: 'RUANG 02',
    title: 'The Evidence Room',
    subtitle: 'Klasifikasi dan Relevansi Sumber Sejarah',
    topic: 'Sumber-Sumber Sejarah',
    difficulty: 'Dasar–Menengah',
    fragmentName: 'Evidence Fragment',
    fragmentSymbol: 'FRAG-02',
    imagePath: GAME_IMAGES.level2,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Kita memasuki Ruang 02: The Evidence Room. Di sini tersimpan ribuan benda peninggalan, arsip foto, surat kabar, hingga ensiklopedia.',
        'Peringatan: Tidak semua benda di papan investigasi memiliki kedudukan yang sama sebagai sumber sejarah!',
        'Kelompokkan bukti secara tepat dan jangan tertipu oleh usia benda—sumber tertua belum tentu relevan untuk pertanyaan penelitianmu.',
      ],
    },
    missionBrief:
      'Klasifikasikan 6 bukti sejarah ke kategori primer, sekunder, dan tersier; pecahkan jebakan relevansi sumber; dan uji keaslian klaim bukti.',
    hints: [
      'Sumber primer dibuat oleh pelaku atau saksi langsung pada masa peristiwa berlangsung (misalnya prasasti, surat sezaman, naskah asli, foto asli peristiwa).',
      'Sumber sekunder adalah karya analisis atau penelitian yang disusun dari sumber primer; sedangkan sumber tersier (ensiklopedia, indeks, bibliografi) berfungsi sebagai penunjuk untuk menemukan sumber lain.',
      'Untuk tantangan relevansi: perhatikan pertanyaan penelitiannya terlebih dahulu! Sumber harus menjawab topik, lokasi, dan waktu yang ditanyakan.',
    ],
    challenges: [
      {
        id: 'l2_c1',
        title: 'Klasifikasi Papan Bukti',
        mechanicLabel: 'Drag and Drop',
        type: 'DRAG_CLASSIFY',
        instruction:
          'Tarik (atau klik untuk memilih lalu tempatkan) 6 peninggalan sejarah berikut ke kategori Sumber Primer, Sumber Sekunder, atau Sumber Tersier.',
        classifyData: {
          categories: [
            {
              id: 'primer',
              title: 'Sumber Primer',
              subtitle: 'Kesaksian langsung / dokumen asli sezaman peristiwa',
            },
            {
              id: 'sekunder',
              title: 'Sumber Sekunder',
              subtitle: 'Hasil kajian, analisis, atau penulisan ulang atas sumber primer',
            },
            {
              id: 'tersier',
              title: 'Sumber Tersier',
              subtitle: 'Kompilasi, indeks, ensiklopedia, atau katalog pencari sumber',
            },
          ],
          items: [
            {
              id: 'ev_1',
              text: 'Naskah asli Teks Proklamasi ketikan Sayuti Melik (17 Agustus 1945)',
              correctCategoryId: 'primer',
            },
            {
              id: 'ev_2',
              text: 'Surat pribadi R.A. Kartini kepada Ny. Abendanon tahun 1900',
              correctCategoryId: 'primer',
            },
            {
              id: 'ev_3',
              text: 'Buku "Sejarah Nasional Indonesia" hasil penelitian tim sejarawan',
              correctCategoryId: 'sekunder',
            },
            {
              id: 'ev_4',
              text: 'Artikel jurnal ilmiah tahun 2022 yang menganalisis struktur Candi Prambanan',
              correctCategoryId: 'sekunder',
            },
            {
              id: 'ev_5',
              text: 'Ensiklopedia Sejarah Indonesia & Indeks Katalog Arsip Nasional (ANRI)',
              correctCategoryId: 'tersier',
            },
            {
              id: 'ev_6',
              text: 'Bibliografi beranotasi tentang daftar buku dan arsip Pergerakan Nasional',
              correctCategoryId: 'tersier',
            },
          ],
        },
        correctSummary:
          'Primer: Naskah Proklamasi 1945 & Surat Kartini 1900. Sekunder: Buku Sejarah Nasional & Artikel jurnal 2022. Tersier: Ensiklopedia/Indeks ANRI & Bibliografi.',
        explanation:
          'Klasifikasi sumber ditentukan oleh hubungan kedekatannya dengan peristiwa dan proses pembuatannya. Sumber primer berasal langsung dari zamannya; sumber sekunder mengkaji sumber primer; sumber tersier membantu peneliti menelusuri sumber sekunder dan primer.',
      },
      {
        id: 'l2_c2',
        title: 'Jebakan Papan Investigasi: Mana yang Lebih Relevan?',
        mechanicLabel: 'Case Analysis',
        type: 'CASE_ANALYSIS',
        instruction:
          'Perhatikan pertanyaan penelitian dan dua bukti yang tersedia. Jangan terkecoh oleh tampilan usia dokumen!',
        caseData: {
          caseTitle: 'Pertanyaan Penelitian: "Bagaimana suasana dan reaksi warga Jakarta saat berita Proklamasi 17 Agustus 1945 disiarkan?"',
          documents: [
            {
              title: 'Bukti A — Prasasti Yupa Muara Kaman (Abad ke-5 M)',
              meta: 'Sumber Primer · Batu bertulis huruf Pallawa · Kutai',
              content:
                'Artefak batu asli tertua di Nusantara yang mencatat silsilah Raja Mulawarman dan persembahan 20.000 ekor sapi kepada kaum Brahmana. Kondisi fisik sangat otentik dan jauh lebih tua.',
            },
            {
              title: 'Bukti B — Surat Kabar "Tjahaja" (18 Agustus 1945) & Rekaman Kesaksian Saksi Mata',
              meta: 'Sumber Primer Sezaman · Terbitan 1 hari pasca-Proklamasi · Jakarta-Bandung',
              content:
                'Memuat laporan pers sezaman dan keterangan warga yang menyaksikan langsung pembacaan teks Proklamasi di Jalan Pegangsaan Timur 56 serta penyebarannya melalui radio.',
            },
          ],
          question:
            'Berdasarkan pertanyaan penelitian di atas, manakah keputusan pemilihan sumber yang paling tepat secara metodologis?',
          options: [
            {
              id: 'rel_a',
              label:
                'Memilih Bukti A karena usianya paling tua (Abad ke-5 M) sehingga pasti lebih bernilai tinggi dibanding koran tahun 1945.',
              isCorrect: false,
            },
            {
              id: 'rel_b',
              label:
                'Memilih Bukti B karena meskipun lebih muda usianya, bukti tersebut sezaman dan langsung relevan menjawab peristiwa serta ruang-waktu yang diteliti.',
              isCorrect: true,
            },
            {
              id: 'rel_c',
              label:
                'Menggabungkan Bukti A sebagai bukti suasana Jakarta tahun 1945 agar terlihat lebih kuno dan meyakinkan.',
              isCorrect: false,
            },
          ],
        },
        correctSummary:
          'Bukti B adalah sumber yang relevan untuk penelitian suasana Proklamasi 1945.',
        explanation:
          'Suatu artefak yang sangat tua memang bernilai tinggi sebagai sumber primer untuk zamannya sendiri (Kerajaan Kutai abad ke-5 M), tetapi tidak relevan jika pertanyaan penelitiannya tentang Jakarta tahun 1945. Penentuan sumber harus mempertimbangkan keterkaitan topik, ruang, waktu, dan proses pembuatannya.',
      },
      {
        id: 'l2_c3',
        title: 'Audit Forensik: Asli, Sekunder, atau Tidak Andal?',
        mechanicLabel: 'True or False',
        type: 'TRUE_FALSE_BATCH',
        instruction:
          'Periksa 4 pernyataan investigasi terkait keandalan dan kedudukan sumber sejarah berikut. Tentukan Benar atau Salah.',
        trueFalseData: {
          statements: [
            {
              id: 'tf_1',
              statement:
                'Sebuah prasasti asli peninggalan Kerajaan Tarumanegara yang memuat telapak kaki Raja Purnawarman termasuk sumber primer.',
              isTrue: true,
              reason:
                'Benar. Prasasti adalah peninggalan tertulis sezaman yang dibuat langsung pada masa peristiwa/kekuasaan tersebut berlangsung.',
            },
            {
              id: 'tf_2',
              statement:
                'Setiap benda yang berasal dari masa lalu otomatis dapat dipercaya isinya tanpa perlu memeriksa siapa pembuat dan tujuannya.',
              isTrue: false,
              reason:
                'Salah. Sekalipun sumber primer asli, sejarawan tetap harus memeriksa tujuan pembuatan, sudut pandang pembuat, dan keterkaitannya dengan peristiwa.',
            },
            {
              id: 'tf_3',
              statement:
                'Biografi tokoh nasional yang ditulis sejarawan pada tahun 2020 dengan mengutip arsip surat-surat sang tokoh termasuk sumber sekunder.',
              isTrue: true,
              reason:
                'Benar. Biografi tersebut merupakan hasil penulisan dan analisis kemudian berdasarkan sumber-sumber primer.',
            },
            {
              id: 'tf_4',
              statement:
                'Surat bertanggal "17 Agustus 1945" yang diketik menggunakan huruf komputer modern dan memakai istilah "internet" adalah sumber primer yang sah.',
              isTrue: false,
              reason:
                'Salah. Itu mengandung anakronisme (ketidaksesuaian zaman) pada media dan kosakata, sehingga terindikasi palsu/tidak otentik.',
            },
          ],
        },
        correctSummary: 'Pernyataan 1: Benar · 2: Salah · 3: Benar · 4: Salah.',
        explanation:
          'Keandalan sumber dinilai dari kesesuaian zaman (bebas anakronisme), proses pembuatan, serta hubungan langsung atau tidak langsung dengan peristiwa.',
      },
    ],
    bonusChallenge: {
      id: 'l2_bonus',
      title: 'Tantangan Bonus: Kedudukan Foto Arsip dalam Buku Pelajaran',
      mechanicLabel: 'Decision Making',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Pecahkan pertanyaan konseptual mengenai perubahan kedudukan suatu informasi ketika dikutip dalam karya lain.',
      caseData: {
        caseTitle: 'Foto Asli vs Kutipan dalam Buku',
        question:
          'Foto asli karya Frans Mendur saat pembacaan Proklamasi (1945) adalah sumber primer. Namun, jika seorang siswa membaca analisis penulis buku sejarah modern tentang foto tersebut tanpa memeriksa arsip aslinya, tulisan analisis sang penulis buku berkedudukan sebagai...',
        options: [
          {
            id: 'b2_a',
            label: 'Sumber sekunder, karena merupakan penafsiran dan penyajian ulang atas sumber primer oleh pihak kemudian.',
            isCorrect: true,
          },
          {
            id: 'b2_b',
            label: 'Sumber tersier, karena semua buku cetak otomatis masuk kategori tersier.',
            isCorrect: false,
          },
          {
            id: 'b2_c',
            label: 'Sumber primer mutlak, karena di dalamnya terdapat kata "1945".',
            isCorrect: false,
          },
        ],
      },
      correctSummary: 'Tulisan analisis penulis buku modern berkedudukan sebagai sumber sekunder.',
      explanation:
        'Membedakan sumber primer, sekunder, dan tersier tidak hanya melihat wujud bendanya, melainkan bagaimana dan kapan informasi tersebut dihasilkan serta kaitannya dengan peristiwa.',
    },
    materialSummary: [
      'Sumber primer: bukti langsung/sezaman dari pelaku atau saksi peristiwa (arsip asli, surat sezaman, foto asli peristiwa, prasasti, kesaksian langsung).',
      'Sumber sekunder: hasil kajian atau rekonstruksi oleh pihak yang tidak mengalami langsung berdasarkan sumber primer (buku penelitian sejarah, artikel ilmiah, biografi analitis).',
      'Sumber tersier: kompilasi atau alat bantu penelusuran sumber lain (ensiklopedia, indeks, bibliografi, katalog).',
      'Pemilihan sumber harus mempertimbangkan relevansi dengan pertanyaan penelitian dan proses pembuatannya, bukan sekadar usia tertua.',
    ],
    competencies: [
      'Mengklasifikasikan artefak dan dokumen ke dalam sumber primer, sekunder, dan tersier.',
      'Menilai relevansi sumber terhadap fokus pertanyaan penelitian sejarah.',
      'Mendeteksi kejanggalan atau anakronisme pada bukti sejarah.',
    ],
    improvementAdvice:
      'Selalu tanyakan dua hal saat menilai sumber: "Apakah dibuat pada zaman peristiwa berlangsung oleh saksi/pelaku?" dan "Apakah isinya menjawab pertanyaan penelitian?"',
    unlockQuote:
      'Evidence Fragment berhasil diekstrak! Jalur menuju The Historian\'s Laboratory telah aktif.',
  },

  // ============================================================================
  // LEVEL 3 — THE HISTORIAN'S LABORATORY (Metodologi Penelitian Sejarah)
  // ============================================================================
  {
    id: 3,
    code: 'RUANG 03',
    title: "The Historian's Laboratory",
    subtitle: 'Tahapan Metodologi Penelitian Sejarah',
    topic: 'Metodologi Penelitian Sejarah',
    difficulty: 'Menengah',
    fragmentName: 'Research Fragment',
    fragmentSymbol: 'FRAG-03',
    imagePath: GAME_IMAGES.level3,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Di Ruang 03 ini, seorang peneliti sebelumnya gagal menyelesaikan riset dan membuat mesin riset laboratorium mati total.',
        'Ia melompati tahapan verifikasi dan mencampuradukkan kritik eksternal dengan kritik internal.',
        'Aktifkan keempat meja kerja—Heuristik, Kritik, Interpretasi, dan Historiografi—untuk memulihkan Research Fragment.',
      ],
    },
    missionBrief:
      'Urutkan tahapan penelitian sejarah, pisahkan langkah kritik eksternal dan internal, selesaikan simulasi 4 meja kerja penelitian, dan temukan kesalahan prosedur peneliti sebelumnya.',
    hints: [
      'Urutan baku penelitian sejarah: mencari/mengumpulkan sumber (Heuristik) -> menguji keaslian & isi (Kritik) -> menafsirkan keterkaitan fakta (Interpretasi) -> menulis kisah sejarah (Historiografi).',
      'Kritik Eksternal menguji "wadah/fisik luar" sumber (kertas, tinta, usia, keaslian); Kritik Internal menguji "isi/kebenaran informasi" di dalam sumber.',
      'Dalam kasus "Broken Research", perhatikan apakah peneliti langsung menyimpulkan tanpa menguji keaslian dan membandingkan sumber pembanding.',
    ],
    challenges: [
      {
        id: 'l3_c1',
        title: 'Urutan Baku Metode Sejarah',
        mechanicLabel: 'Sequence Puzzle',
        type: 'SEQUENCE',
        instruction:
          'Susun 4 tahapan penelitian sejarah di bawah ini dari langkah pertama hingga langkah terakhir.',
        sequenceData: {
          items: [
            {
              id: 'm_3',
              label: '3. Interpretasi',
              detail: 'Menafsirkan fakta yang telah terverifikasi dan merangkai hubungannya.',
            },
            {
              id: 'm_1',
              label: '1. Heuristik',
              detail: 'Proses mencari, menemukan, dan mengumpulkan berbagai sumber sejarah.',
            },
            {
              id: 'm_4',
              label: '4. Historiografi',
              detail: 'Menuliskan hasil penelitian sejarah menjadi karya atau narasi sejarah.',
            },
            {
              id: 'm_2',
              label: '2. Kritik / Verifikasi',
              detail: 'Menguji keaslian fisik (eksternal) dan kredibilitas isi sumber (internal).',
            },
          ],
          correctOrderIds: ['m_1', 'm_2', 'm_3', 'm_4'],
        },
        correctSummary: 'Heuristik -> Kritik / Verifikasi -> Interpretasi -> Historiografi.',
        explanation:
          'Keempat tahap ini bersifat berurutan secara metodologis. Peneliti tidak dapat menafsirkan atau menulis sejarah sebelum mengumpulkan sumber dan memverifikasi keaslian serta kebenaran isinya.',
      },
      {
        id: 'l3_c2',
        title: 'Uji Lab: Kritik Eksternal vs Kritik Internal',
        mechanicLabel: 'Drag and Drop',
        type: 'DRAG_CLASSIFY',
        instruction:
          'Kamu sedang menguji dokumen "Surat Perintah Tahun 1948". Kelompokkan 4 prosedur pengujian ke kotak Kritik Eksternal atau Kritik Internal.',
        classifyData: {
          categories: [
            {
              id: 'eksternal',
              title: 'Kritik Eksternal',
              subtitle: 'Menguji keaslian (otentisitas) fisik & asal-usul luar dokumen',
            },
            {
              id: 'internal',
              title: 'Kritik Internal',
              subtitle: 'Menguji kredibilitas, konsistensi, & kebenaran isi dokumen',
            },
          ],
          items: [
            {
              id: 'kr_1',
              text: 'Memeriksa jenis kertas, usia tinta, dan cap stempel resmi surat tahun 1948',
              correctCategoryId: 'eksternal',
            },
            {
              id: 'kr_2',
              text: 'Mengecek kesesuaian ejaan Soewandi dan tanda tangan asli pengirim surat',
              correctCategoryId: 'eksternal',
            },
            {
              id: 'kr_3',
              text: 'Membandingkan isi pesan surat dengan catatan harian saksi lain pada hari yang sama',
              correctCategoryId: 'internal',
            },
            {
              id: 'kr_4',
              text: 'Menganalisis kemungkinan bias, motif politik, atau tekanan psikologis penulis surat',
              correctCategoryId: 'internal',
            },
          ],
        },
        correctSummary:
          'Eksternal: uji fisik kertas/tinta/stempel & keaslian tanda tangan/ejaan. Internal: membandingkan isi dengan sumber lain & menganalisis bias/motif penulis.',
        explanation:
          'Kritik eksternal menjawab pertanyaan "Apakah dokumen ini asli atau palsu?", sedangkan kritik internal menjawab "Apakah isi keterangan dalam dokumen ini dapat dipercaya?"',
      },
      {
        id: 'l3_c3',
        title: 'Simulasi 4 Meja Kerja Laboratorium',
        mechanicLabel: 'Research Simulation',
        type: 'WORKBENCH_SIM',
        instruction:
          'Kunjungi keempat meja kerja penelitian sejarah untuk menuntaskan kasus riset "Pertempuran Surabaya 1945" dan mengaktifkan mesin lab.',
        workbenchData: {
          caseIntro:
            'Topik Penelitian: Peran laskar rakyat dan arek-arek Suroboyo dalam mempertahankan kemerdekaan pada November 1945.',
          benches: [
            {
              id: 'wb_1',
              benchName: 'Meja 1: Pencarian Sumber',
              stageName: 'Tahap Heuristik',
              scenario:
                'Kamu membutuhkan jejak otentik dari November 1945 sebelum menyusun analisis.',
              options: [
                {
                  id: 'wb1_a',
                  label:
                    'Menelusuri arsip rekaman siaran radio, surat kabar sezaman 1945, dan catatan pelaku di Arsip Nasional & daerah.',
                  isCorrect: true,
                  feedback:
                    'Tepat! Pada tahap heuristik, sejarawan mengumpulkan sumber primer dan sekunder yang relevan dari arsip maupun saksi.',
                },
                {
                  id: 'wb1_b',
                  label:
                    'Langsung menulis bab kesimpulan berdasarkan ingatan pribadi tentang film perjuangan.',
                  isCorrect: false,
                  feedback:
                    'Keliru. Penulisan belum dapat dilakukan sebelum pengumpulan sumber (heuristik) dan verifikasi.',
                },
              ],
            },
            {
              id: 'wb2',
              benchName: 'Meja 2: Pengujian Dokumen',
              stageName: 'Tahap Kritik / Verifikasi',
              scenario:
                'Ditemukan sebuah selebaran berbahasa Indonesia dengan ejaan lama yang mengklaim instruksi perlawanan di Surabaya.',
              options: [
                {
                  id: 'wb2_a',
                  label:
                    'Langsung mengutip selebaran itu karena terlihat tua dan mendukung topik penelitian.',
                  isCorrect: false,
                  feedback:
                    'Berbahaya! Sumber yang terlihat tua tetap wajib melalui kritik eksternal dan internal.',
                },
                {
                  id: 'wb2_b',
                  label:
                    'Memeriksa kondisi fisik kertas/cetakan (kritik eksternal) lalu mencocokkan isinya dengan arsip komando lain (kritik internal).',
                  isCorrect: true,
                  feedback:
                    'Akurat! Verifikasi ganda memastikan dokumen tersebut otentik sekaligus kredibel isinya.',
                },
              ],
            },
            {
              id: 'wb3',
              benchName: 'Meja 3: Ruang Interpretasi',
              stageName: 'Tahap Interpretasi',
              scenario:
                'Fakta-fakta sudah terkumpul: kedatangan pasukan Sekutu, tewasnya Brigjen Mallaby, ultimatum 9 November, dan pertempuran 10 November.',
              options: [
                {
                  id: 'wb3_a',
                  label:
                    'Menganalisis hubungan sebab-akibat antarfakta secara logis (sintesis) untuk menjelaskan mengapa perlawanan besar meletus.',
                  isCorrect: true,
                  feedback:
                    'Benar! Interpretasi berarti menafsirkan dan merangkai fakta-fakta terpisah menjadi satu penjelasan yang bermakna.',
                },
                {
                  id: 'wb3_b',
                  label:
                    'Menyisipkan tokoh fiksi imajinatif agar ceritanya lebih dramatis meski tidak ada buktinya.',
                  isCorrect: false,
                  feedback:
                    'Salah. Interpretasi sejarah wajib berpijak pada fakta yang terverifikasi, bukan rekayasa fiksi.',
                },
              ],
            },
            {
              id: 'wb4',
              benchName: 'Meja 4: Penulisan Sejarah',
              stageName: 'Tahap Historiografi',
              scenario:
                'Seluruh fakta telah ditafsirkan secara kritis. Kini saatnya menyajikan hasil penelitian.',
              options: [
                {
                  id: 'wb4_a',
                  label:
                    'Menyajikan karya sejarah secara kronologis, sistematis, lengkap dengan catatan sumber rujukan agar dapat dipertanggungjawabkan.',
                  isCorrect: true,
                  feedback:
                    'Sempurna! Historiografi adalah puncak penelitian yang menuntut ketepatan kronologi, bahasa jelas, dan transparansi sumber.',
                },
                {
                  id: 'wb4_b',
                  label:
                    'Menyimpan seluruh catatan sebagai daftar angka tahun tanpa penjelasan hubungan peristiwa.',
                  isCorrect: false,
                  feedback:
                    'Kurang tepat. Historiografi bukan sekadar daftar kronik mentah, melainkan rekonstruksi tertulis yang utuh.',
                },
              ],
            },
          ],
        },
        correctSummary:
          'Heuristik (kumpulkan arsip 1945) -> Kritik (uji fisik & silang isi) -> Interpretasi (analisis sebab-akibat fakta) -> Historiografi (tulis karya kronologis berrujukan).',
        explanation:
          'Setiap meja kerja melambangkan fungsi disiplin ilmu sejarah: mengumpulkan jejak, menyaring keaslian dan kebenaran, merangkai makna secara logis, dan menyajikannya dalam bentuk tulisan ilmiah.',
      },
      {
        id: 'l3_c4',
        title: 'Audit Kasus: Broken Research',
        mechanicLabel: 'Case Analysis',
        type: 'CASE_ANALYSIS',
        instruction:
          'Temukan kesalahan metodologis paling fatal pada laporan peneliti sebelumnya di bawah ini.',
        caseData: {
          caseTitle: 'Catatan Peneliti Dr. Raka (Draf Gagal)',
          documents: [
            {
              title: 'Log Aktivitas Riset Dr. Raka',
              meta: 'Proyek: Sejarah Pelabuhan Kuno Abad ke-16',
              content:
                'Hari 1: Menemukan satu surat harian pelaut asing di internet tanpa memeriksa sumber aslinya. Hari 2: Langsung menulis kesimpulan buku bahwa pelabuhan itu hancur karena serangan naga laut, sesuai kisah rakyat setempat, dan menolak memeriksa catatan dagang pembanding.',
            },
          ],
          question: 'Kesalahan penelitian sejarah manakah yang paling fatal dilakukan Dr. Raka?',
          options: [
            {
              id: 'br_1',
              label:
                'Mengabaikan tahap kritik sumber (eksternal maupun internal), mencampuradukkan mitos dengan fakta tanpa verifikasi, dan mengabaikan sumber pembanding.',
              isCorrect: true,
            },
            {
              id: 'br_2',
              label:
                'Terlalu banyak mencari arsip pembanding sehingga jadwal penulisan historiografi menjadi mundur.',
              isCorrect: false,
            },
            {
              id: 'br_3',
              label:
                'Menggunakan bahasa Indonesia yang terlalu formal dalam menyusun laporan penelitiannya.',
              isCorrect: false,
            },
          ],
        },
        correctSummary:
          'Mengabaikan kritik sumber, menerima mitos tanpa verifikasi, dan tidak membandingkan sumber.',
        explanation:
          'Tanpa kritik sumber dan perbandingan antarsumber (koroborasi), penelitian sejarah akan jatuh menjadi legenda atau opini tak berdasar.',
      },
    ],
    bonusChallenge: {
      id: 'l3_bonus',
      title: 'Tantangan Bonus: Mengapa Interpretasi Bisa Berbeda?',
      mechanicLabel: 'Decision Making',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Pecahkan pertanyaan tingkat lanjut tentang sifat interpretasi dalam penelitian sejarah.',
      caseData: {
        caseTitle: 'Dua Sejarawan, Satu Arsip yang Sama',
        question:
          'Dua sejarawan meneliti arsip yang persis sama tentang kebijakan ekonomi masa kolonial, tetapi penekanannya sedikit berbeda (satu fokus pada dampak pajak bagi petani, satu fokus pada jaringan perdagangan pelabuhan). Mengapa hal ini sah dalam ilmu sejarah?',
        options: [
          {
            id: 'b3_a',
            label:
              'Karena pada tahap interpretasi terdapat sudut pandang dan kerangka analisis peneliti, selama seluruh argumen tetap berpijak pada fakta yang telah lolos kritik.',
            isCorrect: true,
          },
          {
            id: 'b3_b',
            label:
              'Karena sejarawan bebas mengarang fakta baru jika merasa bosan dengan arsip yang ada.',
            isCorrect: false,
          },
          {
            id: 'b3_c',
            label:
              'Karena ilmu sejarah tidak memiliki aturan kritik sumber sama sekali.',
            isCorrect: false,
          },
        ],
      },
      correctSummary:
        'Interpretasi memungkinkan perbedaan sudut pandang analisis selama tetap berlandaskan fakta yang terverifikasi.',
      explanation:
        'Dalam metodologi sejarah, interpretasi memadukan analisis dan sintesis. Perbedaan sudut pandang diperbolehkan dan memperkaya pemahaman sejarah asalkan tidak memanipulasi bukti.',
    },
    materialSummary: [
      'Heuristik: tahap mencari, menemukan, dan menghimpun sumber primer maupun sekunder.',
      'Kritik/Verifikasi: menguji keaslian fisik sumber (Kritik Eksternal) dan menguji kebenaran/kredibilitas isi serta motif pembuatnya (Kritik Internal).',
      'Interpretasi: menafsirkan fakta yang sudah diverifikasi dan merangkai keterkaitan sebab-akibatnya (analisis & sintesis).',
      'Historiografi: menuliskan dan menyajikan hasil rekonstruksi sejarah secara kronologis, objektif, dan sistematis.',
    ],
    competencies: [
      'Menyusun empat tahap metodologi penelitian sejarah secara berurutan.',
      'Membedakan secara tepat antara kritik eksternal dan kritik internal.',
      'Menerapkan prosedur metode sejarah untuk mendeteksi kesalahan riset.',
    ],
    improvementAdvice:
      'Ingat rumus cepat: "Eksternal = Wadah/Fisik Luar", "Internal = Isi/Kejujuran Informasi". Jangan pernah langsung melakukan interpretasi sebelum kritik tuntas.',
    unlockQuote:
      'Research Fragment aktif! Keempat meja laboratorium kembali bersinar. Gerbang The Dimension Chamber terbuka.',
  },

  // ============================================================================
  // LEVEL 4 — THE DIMENSION CHAMBER (Unsur-Unsur Sejarah)
  // ============================================================================
  {
    id: 4,
    code: 'RUANG 04',
    title: 'The Dimension Chamber',
    subtitle: 'Unsur Manusia, Ruang, dan Waktu',
    topic: 'Unsur-Unsur Sejarah',
    difficulty: 'Menengah',
    fragmentName: 'Dimension Fragment',
    fragmentSymbol: 'FRAG-04',
    imagePath: GAME_IMAGES.level4,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Hologram peta di Ruang 04 mengalami distorsi! Nama tokoh, lokasi kota, dan angka tahun saling tertukar di udara.',
        'Dalam ilmu sejarah, sebuah peristiwa tidak pernah mengambang di ruang hampa. Ia selalu bertumpu pada tiga unsur utama: Manusia, Ruang, dan Waktu.',
        'Satukan kembali tiga dimensi tersebut untuk memulihkan Dimension Fragment.',
      ],
    },
    missionBrief:
      'Urai satu peristiwa sejarah melalui tiga pertanyaan (Siapa, Di mana, Kapan), petakan koordinat ruang-waktu Nusantara, susun garis waktu, dan lengkapi unsur sejarah yang hilang.',
    hints: [
      'Manusia adalah pelaku atau pihak yang menggerakkan peristiwa; Ruang adalah tempat/lokasi geografis berlangsungnya peristiwa; Waktu menjawab kapan terjadinya serta urutan kronologisnya.',
      'Pada peristiwa Rengasdengklok: Soekarno-Hatta dan golongan muda adalah unsur Manusia; rumah Djiaw Kie Siong di Karawang adalah Ruang; 16 Agustus 1945 adalah Waktu.',
      'Jika salah satu dari tiga unsur hilang (misal hanya menyebut "tokoh dan tempat" tanpa tahu kapan), peristiwa tersebut tidak dapat ditempatkan secara historis.',
    ],
    challenges: [
      {
        id: 'l4_c1',
        title: 'Satu Peristiwa, Tiga Pertanyaan Dimensi',
        mechanicLabel: 'Case Analysis',
        type: 'THREE_ELEMENTS',
        instruction:
          'Bacalah satu peristiwa sejarah di bawah ini, lalu jawab ketiga pertanyaan berbeda untuk membuktikan keterkaitan unsur Manusia, Ruang, dan Waktu.',
        threeElementsData: {
          eventTitle: 'Kasus: Peristiwa Rengasdengklok Menjelang Proklamasi',
          eventNarrative:
            'Setelah mendengar berita kekalahan Jepang dari Sekutu melalui siaran radio rahasia, golongan muda seperti Soekarni, Wikana, dan Chaerul Saleh mengamankan Soekarno dan Mohammad Hatta keluar dari Jakarta menuju rumah keluarga Djiaw Kie Siong di Rengasdengklok, Kabupaten Karawang, Jawa Barat, pada tanggal 16 Agustus 1945 sejak dini hari hingga malam untuk mendesak proklamasi segera dilaksanakan tanpa campur tangan Jepang.',
          questions: [
            {
              id: 'q_manusia',
              elementType: 'Manusia',
              prompt: '1. Siapa unsur MANUSIA (pelaku/pihak terlibat) dalam peristiwa tersebut?',
              options: [
                'Golongan muda (Soekarni, Wikana, Chaerul Saleh) serta dwitunggal Soekarno dan Mohammad Hatta',
                'Para raja Sriwijaya dan utusan dagang dari Dinasti Tang',
                'Hanya pasukan Sekutu tanpa keterlibatan tokoh Indonesia',
              ],
              correctIndex: 0,
            },
            {
              id: 'q_ruang',
              elementType: 'Ruang',
              prompt: '2. Di mana unsur RUANG (tempat peristiwa berlangsung)?',
              options: [
                'Gedung Merdeka, Jalan Asia Afrika, Bandung',
                'Rumah Djiaw Kie Siong di Rengasdengklok, Kabupaten Karawang, Jawa Barat',
                'Istana Maimun, Medan, Sumatera Utara',
              ],
              correctIndex: 1,
            },
            {
              id: 'q_waktu',
              elementType: 'Waktu',
              prompt: '3. Kapan unsur WAKTU dan konteks kronologis peristiwa tersebut?',
              options: [
                '28 Oktober 1928, bertepatan dengan Kongres Pemuda II',
                '10 November 1945, pasca-ultimatum Sekutu',
                '16 Agustus 1945 (dini hari hingga malam), tepat satu hari sebelum Proklamasi Kemerdekaan',
              ],
              correctIndex: 2,
            },
          ],
        },
        correctSummary:
          'Manusia: Golongan muda & Soekarno-Hatta · Ruang: Rumah Djiaw Kie Siong, Rengasdengklok (Karawang) · Waktu: 16 Agustus 1945.',
        explanation:
          'Ketiga unsur ini saling mengikat satu sama lain: keputusan para pelaku (Manusia) dipengaruhi oleh kondisi geografis yang aman dari pengawasan tentara Jepang di Jakarta (Ruang) dan momentum kekosongan kekuasaan usai menyerahnya Jepang (Waktu).',
      },
      {
        id: 'l4_c2',
        title: 'Koordinat Ruang & Waktu Nusantara',
        mechanicLabel: 'Matching Puzzle',
        type: 'MATCHING',
        instruction:
          'Hubungkan peristiwa bersejarah di Indonesia dengan pasangan koordinat Ruang (lokasi) dan Waktu (periode) yang akurat.',
        matchingData: {
          leftHeader: 'Peristiwa & Pelaku',
          rightHeader: 'Koordinat Ruang & Waktu',
          pairs: [
            {
              id: 'coord_1',
              left: 'Kerajaan Maritim Sriwijaya (Balaputradewa)',
              right: 'Ruang: Palembang / Selat Malaka · Waktu: Abad VII–XIII M',
            },
            {
              id: 'coord_2',
              left: 'Kongres Pemuda II & Ikrar Sumpah Pemuda',
              right: 'Ruang: Batavia (Jakarta) · Waktu: 27–28 Oktober 1928',
            },
            {
              id: 'coord_3',
              left: 'Peristiwa Bandung Lautan Api (Mohammad Toha)',
              right: 'Ruang: Bandung Selatan · Waktu: 23–24 Maret 1946',
            },
            {
              id: 'coord_4',
              left: 'Konferensi Asia-Afrika (KAA)',
              right: 'Ruang: Gedung Merdeka, Bandung · Waktu: 18–24 April 1955',
            },
          ],
        },
        correctSummary:
          'Sriwijaya (Palembang/Abad VII–XIII M), Sumpah Pemuda (Batavia/27–28 Okt 1928), Bandung Lautan Api (Bandung/23–24 Mar 1946), KAA (Bandung/18–24 Apr 1955).',
        explanation:
          'Setiap peristiwa sejarah selalu mempunyai alamat ruang dan penanda waktu yang spesifik sehingga tidak tertukar satu sama lain.',
      },
      {
        id: 'l4_c3',
        title: 'Kalibrasi Garis Waktu Pergerakan hingga Kemerdekaan',
        mechanicLabel: 'Interactive Timeline',
        type: 'TIMELINE',
        instruction:
          'Tempatkan 4 kartu peristiwa ke slot tahun yang tepat pada garis waktu kronologis dari yang paling awal hingga paling akhir.',
        timelineData: {
          slots: [
            { id: 'slot_1908', label: 'Slot 1 — 20 Mei 1908' },
            { id: 'slot_1928', label: 'Slot 2 — 28 Oktober 1928' },
            { id: 'slot_1945a', label: 'Slot 3 — 17 Agustus 1945' },
            { id: 'slot_1945b', label: 'Slot 4 — 10 November 1945' },
          ],
          items: [
            {
              id: 'tl_prok',
              yearLabel: '1945',
              eventTitle: 'Proklamasi Kemerdekaan RI oleh Soekarno-Hatta di Jakarta',
              periodLabel: 'Awal Kemerdekaan',
            },
            {
              id: 'tl_bo',
              yearLabel: '1908',
              eventTitle: 'Berdirinya organisasi modern Budi Utomo oleh dr. Soetomo dkk.',
              periodLabel: 'Pergerakan Nasional',
            },
            {
              id: 'tl_sby',
              yearLabel: '1945',
              eventTitle: 'Pertempuran Heroik Arek-Arek Suroboyo melawan Sekutu',
              periodLabel: 'Revolusi Fisik',
            },
            {
              id: 'tl_sp',
              yearLabel: '1928',
              eventTitle: 'Ikrar Sumpah Pemuda: Satu Nusa, Satu Bangsa, Satu Bahasa',
              periodLabel: 'Pergerakan Nasional',
            },
          ],
          correctMapping: {
            slot_1908: 'tl_bo',
            slot_1928: 'tl_sp',
            slot_1945a: 'tl_prok',
            slot_1945b: 'tl_sby',
          },
        },
        correctSummary:
          '20 Mei 1908 (Budi Utomo) -> 28 Okt 1928 (Sumpah Pemuda) -> 17 Agu 1945 (Proklamasi) -> 10 Nov 1945 (Pertempuran Surabaya).',
        explanation:
          'Garis waktu menunjukkan kesinambungan dan perkembangan kesadaran kebangsaan dari organisasi pergerakan (1908), persatuan pemuda (1928), kemerdekaan (1945), hingga mempertahankannya (Nov 1945).',
      },
      {
        id: 'l4_c4',
        title: 'Deteksi Unsur yang Hilang',
        mechanicLabel: 'Case Analysis',
        type: 'CASE_ANALYSIS',
        instruction:
          'Fragmen laporan arsip di bawah ini mengalami kerusakan data. Identifikasi unsur sejarah apa yang hilang dan pilih pelengkap yang tepat.',
        caseData: {
          caseTitle: 'Fragmen Arsip Korup #404',
          documents: [
            {
              title: 'Catatan Fragmen Peristiwa',
              meta: 'Status: 1 Unsur Terhapus',
              content:
                '"Pada tanggal 1 Maret 1949, pasukan TNI di bawah komando Letkol Soeharto bersama Sri Sultan Hamengkubuwono IX melancarkan Serangan Umum selama enam jam untuk membuktikan kepada dunia internasional bahwa Republik Indonesia masih eksis."',
            },
          ],
          question:
            'Unsur sejarah apakah yang tidak disebut dalam fragmen di atas, dan informasi manakah yang melengkapinya secara akurat?',
          options: [
            {
              id: 'miss_a',
              label:
                'Unsur WAKTU hilang; seharusnya ditambahkan "tahun 1928 di Batavia".',
              isCorrect: false,
            },
            {
              id: 'miss_b',
              label:
                'Unsur RUANG hilang; seharusnya ditambahkan "di Kota Yogyakarta (yang saat itu menjadi ibu kota RI)".',
              isCorrect: true,
            },
            {
              id: 'miss_c',
              label:
                'Unsur MANUSIA hilang; seharusnya tidak perlu mencantumkan tokoh sama sekali.',
              isCorrect: false,
            },
          ],
        },
        correctSummary: 'Unsur RUANG hilang: Kota Yogyakarta.',
        explanation:
          'Tanggal 1 Maret 1949 (Waktu) dan Letkol Soeharto serta Sri Sultan HB IX (Manusia) sudah tercantum, tetapi lokasi berlangsungnya Serangan Umum (Ruang: Yogyakarta) hilang dari fragmen.',
      },
    ],
    bonusChallenge: {
      id: 'l4_bonus',
      title: 'Tantangan Bonus: Pengaruh Ruang terhadap Manusia',
      mechanicLabel: 'Decision Making',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Analisis bagaimana unsur ruang geografis memengaruhi aktivitas manusia dalam sejarah Nusantara.',
      caseData: {
        caseTitle: 'Poros Maritim Selat Malaka',
        question:
          'Mengapa letak geografis (unsur ruang) Kerajaan Sriwijaya dan Kesultanan Malaka di jalur Selat Malaka menentukan peran historis manusianya?',
        options: [
          {
            id: 'b4_a',
            label:
              'Karena posisi strategis sebagai jalur pelayaran antara India dan Tiongkok mendorong masyarakatnya berkembang menjadi kekuatan perdagangan maritim dan pusat pertemuan budaya.',
            isCorrect: true,
          },
          {
            id: 'b4_b',
            label:
              'Karena unsur ruang hanya berfungsi sebagai hiasan peta dan tidak memengaruhi mata pencaharian maupun politik manusia.',
            isCorrect: false,
          },
          {
            id: 'b4_c',
            label:
              'Karena letak laut membuat peristiwa di sana terjadi di luar dimensi waktu.',
            isCorrect: false,
          },
        ],
      },
      correctSummary:
        'Posisi strategis Selat Malaka membentuk peradaban maritim, jalur perdagangan internasional, dan pertukaran budaya.',
      explanation:
        'Ruang bukan sekadar lokasi pasif; kondisi geografis membentuk peluang ekonomi, jalur interaksi sosial, dan dinamika kekuasaan manusia pada zamannya.',
    },
    materialSummary: [
      'Manusia adalah subjek dan pelaku utama yang menggerakkan peristiwa sejarah.',
      'Ruang adalah tempat atau wilayah geografis terjadinya peristiwa sejarah.',
      'Waktu menandai kapan peristiwa berlangsung, durasinya, serta urutan kronologis sebelum dan sesudahnya.',
      'Ketiga unsur saling berkaitan erat: perubahan waktu dan kondisi ruang memengaruhi tindakan manusia, dan tindakan manusia mengubah ruang sejarah.',
    ],
    competencies: [
      'Mengidentifikasi unsur manusia, ruang, dan waktu dari narasi peristiwa sejarah.',
      'Memetakan peristiwa sejarah Indonesia ke koordinat lokasi dan kurun waktu yang tepat.',
      'Mendeteksi ketidaklengkapan unsur sejarah dalam suatu catatan arsip.',
    ],
    improvementAdvice:
      'Setiap membaca teks sejarah, biasakan langsung menandai 3 hal: Siapa (Manusia), Di mana (Ruang), dan Kapan (Waktu).',
    unlockQuote:
      'Dimension Fragment pulih! Peta holografik kembali sinkron dan portal menuju The Time Machine Paradox terbuka.',
  },

  // ============================================================================
  // LEVEL 5 — THE TIME MACHINE PARADOX (Teori Mesin Waktu & Konsep Waktu)
  // ============================================================================
  {
    id: 5,
    code: 'RUANG 05',
    title: 'The Time Machine Paradox',
    subtitle: 'Konsep Waktu & Analogi Mesin Waktu dalam Sejarah',
    topic: 'Konsep Waktu & Teori Mesin Waktu',
    difficulty: 'Menengah–Tinggi',
    fragmentName: 'Time Fragment',
    fragmentSymbol: 'FRAG-05',
    imagePath: GAME_IMAGES.level5,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Kita akhirnya tiba di ruang inti Chronos Engine! Namun perhatikan—portal mesin waktunya retak akibat paradoks data temporal.',
        'Sebagian pengunjung laboratorium mengira mesin waktu benar-benar bisa membawa manusia kembali ke masa lalu untuk melihat sejarah secara langsung.',
        'Selesaikan kalibrasi kronologi, periodisasi, dan sebab-akibat—lalu ungkap kebenaran tentang teori mesin waktu dalam kajian sejarah!',
      ],
    },
    missionBrief:
      'Kalibrasi kronologi dan periodisasi sejarah Indonesia, pecahkan sandi kausalitas & perubahan, selesaikan paradoks waktu, dan bedakan fakta sejarah dari fiksi mesin waktu.',
    hints: [
      'Periodisasi adalah pembabakan waktu dalam sejarah berdasarkan ciri khas zamannya (misalnya Praaksara, Hindu-Buddha, Islam, Kolonial, Kemerdekaan).',
      'Kausalitas berarti hubungan sebab-akibat: peristiwa sebelumnya memicu atau melatarbelakangi peristiwa berikutnya (bukan kebalikannya).',
      'Mesin waktu hanyalah perangkat fiksi atau analogi imajinatif! Dalam ilmu sejarah nyata, masa lalu tidak dapat diulang, melainkan dipahami lewat penelitian bukti.',
    ],
    challenges: [
      {
        id: 'l5_c1',
        title: 'Kalibrasi Periodisasi Sejarah Indonesia',
        mechanicLabel: 'Interactive Timeline',
        type: 'TIMELINE',
        instruction:
          'Tempatkan 4 ciri peristiwa berikut ke dalam pembabakan waktu (periodisasi) sejarah Indonesia yang tepat.',
        timelineData: {
          slots: [
            { id: 'per_1', label: '1. Masa Praaksara' },
            { id: 'per_2', label: '2. Masa Hindu-Buddha' },
            { id: 'per_3', label: '3. Masa Kerajaan Islam' },
            { id: 'per_4', label: '4. Masa Pergerakan Nasional' },
          ],
          items: [
            {
              id: 'it_islam',
              yearLabel: 'Abad XIII–XVII',
              eventTitle: 'Berkembangnya Kesultanan Samudra Pasai, Demak, dan Ternate-Tidore',
              periodLabel: 'Era Kesultanan Nusantara',
            },
            {
              id: 'it_pra',
              yearLabel: 'Sebelum Abad IV M',
              eventTitle: 'Kehidupan berburu-meramu hingga bercocok tanam sebelum mengenal tulisan',
              periodLabel: 'Pra-Tulisan',
            },
            {
              id: 'it_nas',
              yearLabel: '1908–1942',
              eventTitle: 'Perjuangan melalui organisasi modern, pers, dan kesadaran kebangsaan',
              periodLabel: 'Kebangkitan Nasional',
            },
            {
              id: 'it_hb',
              yearLabel: 'Abad IV–XV M',
              eventTitle: 'Berdirinya Kutai, Tarumanegara, Sriwijaya, dan Majapahit',
              periodLabel: 'Pengaruh India-Nusantara',
            },
          ],
          correctMapping: {
            per_1: 'it_pra',
            per_2: 'it_hb',
            per_3: 'it_islam',
            per_4: 'it_nas',
          },
        },
        correctSummary:
          'Praaksara -> Hindu-Buddha -> Kerajaan Islam -> Pergerakan Nasional.',
        explanation:
          'Periodisasi membantu sejarawan mengelompokkan rentang waktu panjang berdasarkan ciri khas sosial, budaya, dan politik tiap zaman, tanpa memutus kesinambungannya.',
      },
      {
        id: 'l5_c2',
        title: 'Sandi Portal: Sebab-Akibat & Perubahan',
        mechanicLabel: 'Code Breaking',
        type: 'CODE_BREAKING',
        instruction:
          'Gunakan konsep hubungan sebab-akibat (kausalitas) dan perubahan sejarah untuk membuka sandi portal Chronos Engine.',
        codeBreakingData: {
          cipherClues: [
            {
              symbol: 'SEBAB',
              clue: 'Penerapan Politik Etis (edukasi) awal abad ke-20 melahirkan kaum terpelajar bumiputera.',
            },
            {
              symbol: 'AKIBAT',
              clue: 'Kaum terpelajar ini mendirikan organisasi modern seperti Budi Utomo & Sarekat Islam.',
            },
            {
              symbol: 'KONSEP',
              clue: 'Hubungan antara peristiwa pendorong dan peristiwa yang ditimbulkannya dalam sejarah disebut hukum...',
            },
          ],
          question:
            'Ketik satu kata istilah konsep hubungan sebab-akibat dalam ilmu sejarah (10 huruf, berawalan K):',
          placeholder: 'Ketik istilah konsep...',
          acceptedAnswers: ['KAUSALITAS'],
          displayAnswer: 'KAUSALITAS',
        },
        correctSummary: 'KAUSALITAS',
        explanation:
          'Kausalitas adalah hubungan sebab-akibat dalam sejarah. Suatu perubahan besar (seperti lahirnya Pergerakan Nasional) berakar dari sebab-sebab sebelumnya serta mencerminkan kesinambungan dan perubahan.',
      },
      {
        id: 'l5_c3',
        title: 'Mengurai Paradoks Mesin Waktu',
        mechanicLabel: 'Case Analysis',
        type: 'CASE_ANALYSIS',
        instruction:
          'Log Chronos Engine menampilkan paradoks: sistem mencatat akibat muncul lebih dulu daripada sebabnya. Pecahkan persoalan kausalitas berikut.',
        caseData: {
          caseTitle: 'Anomali Logika Temporal #05',
          documents: [
            {
              title: 'Log Korup Chronos',
              meta: 'Error: Kronologi Terbalik',
              content:
                'Mesin mencoba menjelaskan: "Karena Konferensi Meja Bundar (KMB) ditandatangani pada 1949, maka rakyat Indonesia tergerak memproklamasikan kemerdekaan pada tahun 1945."',
            },
          ],
          question:
            'Mengapa pernyataan log mesin tersebut salah secara kronologis dan historis?',
          options: [
            {
              id: 'par_a',
              label:
                'Karena waktu dalam sejarah berjalan maju (kronologis): Proklamasi 1945 dan perjuangan mempertahankannya menjadi sebab/latar menuju pengakuan kedaulatan di KMB 1949, bukan sebaliknya.',
              isCorrect: true,
            },
            {
              id: 'par_b',
              label:
                'Karena Konferensi Meja Bundar tidak pernah terjadi dalam sejarah Indonesia.',
              isCorrect: false,
            },
            {
              id: 'par_c',
              label:
                'Karena dalam sejarah, peristiwa masa depan bisa mengubah sebab di masa lalu secara langsung.',
              isCorrect: false,
            },
          ],
        },
        correctSummary:
          'Sejarah berjalan kronologis: Proklamasi 1945 dan revolusi kemerdekaan mendorong terjadinya KMB 1949.',
        explanation:
          'Kronologi menjaga agar rangkaian sebab-akibat tetap logis. Anakronisme atau pembalikan urutan waktu merusak pemahaman kausalitas sejarah.',
      },
      {
        id: 'l5_c4',
        title: 'Fakta Sejarah atau Fiksi Perjalanan Waktu?',
        mechanicLabel: 'True or False',
        type: 'TRUE_FALSE_BATCH',
        instruction:
          'Ungkap kebenaran di balik Chronos Engine! Bedakan pernyataan ilmiah ilmu sejarah dengan fiksi perjalanan waktu.',
        trueFalseData: {
          statements: [
            {
              id: 'ff_1',
              statement:
                'Dalam ilmu sejarah yang sesungguhnya, sejarawan dapat memakai mesin waktu fisik untuk mengulang peristiwa masa lalu secara nyata.',
              isTrue: false,
              reason:
                'Salah. Masa lalu bersifat sekali terjadi dan tidak dapat diulang (einmalig). Mesin waktu hanyalah perangkat fiksi atau analogi imajinatif.',
            },
            {
              id: 'ff_2',
              statement:
                'Konsep "mesin waktu" dapat digunakan sebagai analogi imajinatif untuk menggambarkan bagaimana sejarawan "menjelajahi" masa lalu melalui arsip, bukti, kritik, dan interpretasi.',
              isTrue: true,
              reason:
                'Benar. Sebagai metafora/analogi belajar, penelitian sejarahlah yang menjadi "mesin waktu" intelektual kita untuk memahami masa lalu.',
            },
            {
              id: 'ff_3',
              statement:
                'Perubahan dalam sejarah selalu disertai unsur kesinambungan dari masa sebelumnya (masa lalu memengaruhi masa kini dan masa depan).',
              isTrue: true,
              reason:
                'Benar. Sejarah mengenal aspek kesinambungan (continuity) dan perubahan (change) secara bersamaan.',
            },
            {
              id: 'ff_4',
              statement:
                'Jika sebuah teknologi portal waktu aktif, sejarawan tidak lagi memerlukan tahap heuristik dan kritik sumber.',
              isTrue: false,
              reason:
                'Salah. Karena mesin waktu tidak ada di dunia nyata, satu-satunya cara mengetahui kebenaran masa lalu tetaplah melalui sumber dan metode penelitian sejarah.',
            },
          ],
        },
        correctSummary: '1: Salah · 2: Benar · 3: Benar · 4: Salah.',
        explanation:
          'Twist utama Ruang 05: Chronos Engine bukanlah pengganti ilmu sejarah. Untuk mengetahui masa lalu, manusia tetap harus mengandalkan sumber, kritik, interpretasi, dan penelitian sejarah!',
      },
    ],
    bonusChallenge: {
      id: 'l5_bonus',
      title: 'Tantangan Bonus: Diakronik vs Sinkronik',
      mechanicLabel: 'Decision Making',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Terapkan cara berpikir waktu (diakronik) dan ruang (sinkronik) dalam mengkaji suatu topik sejarah.',
      caseData: {
        caseTitle: 'Memilih Cara Pandang Kajian',
        question:
          'Seorang siswa meneliti "Perkembangan Sistem Transportasi Kereta Api di Jawa dari tahun 1867 hingga 1945" secara memanjang dalam waktu. Pendekatan berpikir sejarah yang paling dominan digunakannya adalah...',
        options: [
          {
            id: 'b5_a',
            label:
              'Berpikir diakronik (kronologis), karena mengkaji perubahan dan kesinambungan suatu fenomena melintasi rentang waktu yang panjang.',
            isCorrect: true,
          },
          {
            id: 'b5_b',
            label:
              'Berpikir sinkronik murni, karena membatasi kajian hanya pada satu detik tanpa melihat perkembangan tahun.',
            isCorrect: false,
          },
          {
            id: 'b5_c',
            label:
              'Berpikir fiktif, karena kereta api hanya ada di cerita perjalanan waktu.',
            isCorrect: false,
          },
        ],
      },
      correctSummary:
        'Berpikir diakronik (kronologis) mengkaji peristiwa memanjang dalam waktu.',
      explanation:
        'Diakronik berarti menelusuri peristiwa memanjang dalam waktu tetapi terbatas dalam ruang, sedangkan sinkronik mengkaji struktur kehidupan secara mendalam (melebar dalam ruang) pada kurun waktu tertentu.',
    },
    materialSummary: [
      'Masa lalu adalah objek kajian sejarah yang bersifat sekali terjadi (tidak dapat diulang secara fisik).',
      'Kronologi menyusun peristiwa secara urut berdasarkan waktu, sedangkan periodisasi membagi masa lampau ke dalam babak-babak berkarakter khas.',
      'Sejarah memuat hubungan sebab-akibat (kausalitas) serta dinamika kesinambungan dan perubahan.',
      'Teori "mesin waktu" dalam permainan ini adalah analogi imajinatif—di dunia nyata, penelitian berbasiskan bukti adalah satu-satunya jalan memahami masa lalu.',
    ],
    competencies: [
      'Menyusun kronologi dan periodisasi sejarah Indonesia dengan tepat.',
      'Menganalisis hubungan sebab-akibat serta kesinambungan dan perubahan.',
      'Membedakan fakta sejarah berbasis bukti dari fiksi perjalanan waktu.',
    ],
    improvementAdvice:
      'Ingat selalu: mesin waktu fisik hanya fiksi ilmiah; "mesin waktu" nyata milik sejarawan adalah arsip, kritik sumber, dan penalaran kronologis.',
    unlockQuote:
      'Time Fragment menyala terang! Paradoks temporal teratasi dan pintu menuju The Four Faces of History terbuka.',
  },

  // ============================================================================
  // LEVEL 6 — THE FOUR FACES OF HISTORY (Peristiwa, Kisah, Ilmu, Seni)
  // ============================================================================
  {
    id: 6,
    code: 'RUANG 06',
    title: 'The Four Faces of History',
    subtitle: 'Sejarah sebagai Peristiwa, Kisah, Ilmu, dan Seni',
    topic: 'Kedudukan Sejarah',
    difficulty: 'Tinggi',
    fragmentName: 'Perspective Fragment',
    fragmentSymbol: 'FRAG-06',
    imagePath: GAME_IMAGES.level6,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Ruang 06 terbagi menjadi empat relung yang memancarkan perspektif berbeda terhadap satu objek yang sama.',
        'Sebagian orang mengira sejarah hanya sekadar kejadian masa lalu. Padahal, sejarah memiliki empat kedudukan: sebagai Peristiwa, Kisah, Ilmu, dan Seni.',
        'Pahami batas tegas di antara keempatnya agar tidak mengacaukan fakta dengan imajinasi. Temukan Perspective Fragment!',
      ],
    },
    missionBrief:
      'Pasangkan contoh ke empat pintu kedudukan sejarah, analisis perspektif suatu kutipan, bedah satu peristiwa yang sama dalam 4 wajah, dan pilih pendekatan penulisan sejarawan.',
    hints: [
      'Peristiwa = kejadian nyatanya yang objektif & hanya terjadi sekali; Kisah = cerita/rekonstruksi hasil ingatan atau penulisan.',
      'Ilmu = metode penelitian sistematis (heuristik, kritik, interpretasi, historiografi); Seni = penggunaan gaya bahasa dan imajinasi yang bertanggung jawab agar narasi hidup tanpa mengubah fakta.',
      'Dalam seni sejarah, imajinasi dipakai untuk membayangkan suasana/konteks sesuai bukti—BUKAN untuk mengarang kejadian fiktif!',
    ],
    challenges: [
      {
        id: 'l6_c1',
        title: 'Empat Pintu Kedudukan Sejarah',
        mechanicLabel: 'Drag and Drop',
        type: 'DRAG_CLASSIFY',
        instruction:
          'Tempatkan 4 kartu contoh di bawah ini ke dalam pintu kedudukan sejarah yang tepat.',
        classifyData: {
          categories: [
            {
              id: 'peristiwa',
              title: 'Sejarah sebagai Peristiwa',
              subtitle: 'Kejadian nyata objektif di masa lalu (einmalig / sekali terjadi)',
            },
            {
              id: 'kisah',
              title: 'Sejarah sebagai Kisah',
              subtitle: 'Narasi atau tuturan rekonstruksi tentang masa lalu',
            },
            {
              id: 'ilmu',
              title: 'Sejarah sebagai Ilmu',
              subtitle: 'Kajian empiris berlandaskan metode penelitian & verifikasi',
            },
            {
              id: 'seni',
              title: 'Sejarah sebagai Seni',
              subtitle: 'Penyajian estetik dengan gaya bahasa hidup tanpa mengubah fakta',
            },
          ],
          items: [
            {
              id: 'ff_peristiwa',
              text: 'Momen nyata pembacaan teks Proklamasi oleh Soekarno pada 17 Agustus 1945 pukul 10.00 WIB',
              correctCategoryId: 'peristiwa',
            },
            {
              id: 'ff_kisah',
              text: 'Buku cerita biografi atau film dokumenter yang menuturkan kembali kisah Rengasdengklok',
              correctCategoryId: 'kisah',
            },
            {
              id: 'ff_ilmu',
              text: 'Riset akademis di universitas memakai metode heuristik, kritik sumber, dan analisis objektif',
              correctCategoryId: 'ilmu',
            },
            {
              id: 'ff_seni',
              text: 'Karya historiografi dengan pilihan diksi puitis, empati, dan imajinasi bertanggung jawab atas suasana zaman',
              correctCategoryId: 'seni',
            },
          ],
        },
        correctSummary:
          'Peristiwa: kejadian nyata 17 Agu 1945 · Kisah: buku/dokumenter tuturan · Ilmu: riset bermetode · Seni: gaya bahasa & imajinasi bertanggung jawab.',
        explanation:
          'Keempat wajah sejarah saling melengkapi: kejadian nyata (peristiwa) diteliti lewat metode ilmiah (ilmu), lalu dirangkai menjadi tuturan (kisah) yang menarik dibaca berkat sentuhan narasi (seni).',
      },
      {
        id: 'l6_c2',
        title: 'Satu Peristiwa, Empat Perspektif',
        mechanicLabel: 'Matching Puzzle',
        type: 'MATCHING',
        instruction:
          'Peristiwa "Pertempuran 10 November 1945 di Surabaya" ditampilkan dalam 4 bentuk berbeda. Pasangkan setiap kutipan dengan kedudukan sejarahnya.',
        matchingData: {
          leftHeader: 'Bentuk Representasi (10 Nov 1945)',
          rightHeader: 'Kedudukan Sejarah',
          pairs: [
            {
              id: 'op_1',
              left: 'Baku tembak nyata antara pejuang Surabaya dan pasukan Inggris pada 10 November 1945',
              right: 'Sejarah sebagai Peristiwa (realitas objektif sekali terjadi)',
            },
            {
              id: 'op_2',
              left: 'Tuturan memoar seorang veteran pejuang yang menceritakan pengalamannya di Surabaya',
              right: 'Sejarah sebagai Kisah (rekonstruksi naratif)',
            },
            {
              id: 'op_3',
              left: 'Disertasi sejarawan yang membandingkan arsip militer Inggris dengan arsip TNI secara kritis',
              right: 'Sejarah sebagai Ilmu (empiris, objektif, bermetode)',
            },
            {
              id: 'op_4',
              left: 'Penggambaran suasana tegang di Jembatan Merah dengan bahasa mengalir berdasarkan arsip foto & cuaca hari itu',
              right: 'Sejarah sebagai Seni (intuisi, gaya bahasa, tanpa ubah fakta)',
            },
          ],
        },
        correctSummary:
          'Kejadian nyata = Peristiwa · Memoar/tuturan = Kisah · Disertasi uji arsip = Ilmu · Gaya bahasa hidup sesuai bukti = Seni.',
        explanation:
          'Satu peristiwa yang sama dapat dipahami dari empat sudut: realitas kejadiannya, tuturan kisahnya, metodologi kajiannya, dan estetika penulisannya.',
      },
      {
        id: 'l6_c3',
        title: 'Analisis Ilustrasi Perspektif',
        mechanicLabel: 'Case Analysis',
        type: 'CASE_ANALYSIS',
        instruction:
          'Bacalah kutipan catatan seorang penulis sejarah berikut dan tentukan kedudukan sejarah mana yang tampak dominan.',
        caseData: {
          caseTitle: 'Kutipan Ruang Arsip Selatan',
          documents: [
            {
              title: 'Prinsip Kerja Penulis Sejarah (Sartono / Kuntowijoyo)',
              meta: 'Analisis Karakteristik Sejarah',
              content:
                '"Seorang sejarawan membutuhkan kemampuan menyusun kalimat yang hidup dan kemampuan membayangkan suasana batin pelaku sejarah secara bertanggung jawab agar pembaca dapat merasakan zamannya—namun tetap haram baginya menambahkan tokoh atau angka yang tidak ada di arsip."',
            },
          ],
          question: 'Kutipan di atas paling tepat menjelaskan kedudukan...',
          options: [
            {
              id: 'p6_a',
              label:
                'Sejarah sebagai Peristiwa, karena peristiwa tidak memerlukan penulisan.',
              isCorrect: false,
            },
            {
              id: 'p6_b',
              label:
                'Sejarah sebagai Seni, yaitu penggunaan intuisi, imajinasi historis, emosi, dan gaya bahasa tanpa mengorbankan kebenaran fakta.',
              isCorrect: true,
            },
            {
              id: 'p6_c',
              label:
                'Sejarah sebagai Fiksi Bebas, karena memakai kata "membayangkan".',
              isCorrect: false,
            },
          ],
        },
        correctSummary: 'Sejarah sebagai Seni.',
        explanation:
          'Unsur seni dalam sejarah bukan berarti bebas mengarang. Menurut Kuntowijoyo, sejarah sebagai seni memerlukan intuisi, imajinasi, emosi, dan gaya bahasa yang tetap tunduk pada fakta empiris.',
      },
      {
        id: 'l6_c4',
        title: 'Pilihan Sang Sejarawan',
        mechanicLabel: 'Decision Making',
        type: 'CASE_ANALYSIS',
        instruction:
          'Kamu diminta menyusun karya ilmiah sejarah SMA sekaligus mempresentasikannya agar menarik bagi pembaca muda. Keputusan manakah yang paling tepat?',
        caseData: {
          caseTitle: 'Dilema Penyajian Karya Sejarah',
          question:
            'Bagaimana cara menggabungkan kedudukan sejarah sebagai Ilmu dan Seni secara seimbang?',
          options: [
            {
              id: 'hc_a',
              label:
                'Memastikan seluruh data melewati heuristik dan kritik (Ilmu), lalu menyajikannya dengan alur narasi kronologis dan gaya bahasa komunikatif tanpa menambah fiksi (Seni).',
              isCorrect: true,
            },
            {
              id: 'hc_b',
              label:
                'Membuat kisah penuh dialog fiktif karangan sendiri agar pembaca terhibur meskipun tidak ada buktinya.',
              isCorrect: false,
            },
            {
              id: 'hc_c',
              label:
                'Hanya mencetak daftar tanggal dan nama arsip mentah tanpa narasi penghubung sama sekali.',
              isCorrect: false,
            },
          ],
        },
        correctSummary:
          'Menjaga ketepatan metode ilmiah (Ilmu) dan memadukannya dengan gaya bahasa komunikatif tanpa fiksi (Seni).',
        explanation:
          'Karya sejarah yang baik tidak mengorbankan kebenaran demi keindahan, dan tidak mengabaikan kejelasan bahasa demi kekakuan data.',
      },
    ],
    bonusChallenge: {
      id: 'l6_bonus',
      title: 'Tantangan Bonus: Batas Imajinasi dalam Sejarah',
      mechanicLabel: 'Case Analysis',
      type: 'CASE_ANALYSIS',
      isBonus: true,
      instruction:
        'Bedakan antara imajinasi historis yang sah sebagai seni dengan pelanggaran etika sejarah.',
      caseData: {
        caseTitle: 'Uji Batas Etika Penulisan',
        question:
          'Manakah tindakan penulis berikut yang MELANGGAR batas sejarah sebagai seni dan berubah menjadi fiksi?',
        options: [
          {
            id: 'b6_a',
            label:
              'Menggambarkan suasana pagi Jakarta 17 Agustus 1945 yang tegang berdasarkan kesaksian para saksi mata.',
            isCorrect: false,
          },
          {
            id: 'b6_b',
            label:
              'Mengubah tanggal kejadian atau menciptakan dialog rahasia antartokoh yang bertentangan dengan arsip demi memperindah cerita.',
            isCorrect: true,
          },
          {
            id: 'b6_c',
            label:
              'Memilih kosakata bahasa Indonesia yang mengalir agar pembaca mudah memahami proses diplomasi.',
            isCorrect: false,
          },
        ],
      },
      correctSummary:
        'Mengubah tanggal atau mengarang dialog fiktif yang bertentangan dengan bukti melanggar batas sejarah.',
      explanation:
        'Seni dalam sejarah hanya bekerja pada cara merangkai dan menghidupkan penyajian fakta, tidak pernah mengubah atau memalsukan fakta itu sendiri.',
    },
    materialSummary: [
      'Sejarah sebagai Peristiwa: kejadian nyata yang objektif, unik, dan hanya berlangsung satu kali (einmalig).',
      'Sejarah sebagai Kisah: hasil rekonstruksi atau tuturan cerita tentang peristiwa masa lalu berdasarkan ingatan, sumber, dan penafsiran.',
      'Sejarah sebagai Ilmu: disiplin pengetahuan yang empiris, memiliki objek manusia dalam waktu, teori, generalisasi, dan metode penelitian baku.',
      'Sejarah sebagai Seni: menekankan gaya bahasa, intuisi, emosi, dan imajinasi historis yang bertanggung jawab tanpa mengubah fakta.',
    ],
    competencies: [
      'Membedakan sejarah sebagai peristiwa, kisah, ilmu, dan seni beserta contohnya.',
      'Menganalisis satu peristiwa sejarah dari keempat perspektif kedudukan.',
      'Menerapkan keseimbangan antara ketelitian ilmiah dan estetika narasi.',
    ],
    improvementAdvice:
      'Jika ragu membedakan "Peristiwa" dan "Kisah", tanyakan: apakah itu kejadian nyatanya sendiri (Peristiwa), atau hasil cerita/tulisan tentang kejadian itu (Kisah)?',
    unlockQuote:
      'Perspective Fragment terkunci sempurna! Kini keenam fragmen siap membawamu ke ruang rahasia terakhir: The Final Archive.',
  },

  // ============================================================================
  // LEVEL 7 — THE FINAL ARCHIVE (Integrasi Seluruh Materi: THE MISSING HISTORY)
  // ============================================================================
  {
    id: 7,
    code: 'RUANG 07',
    title: 'The Final Archive',
    subtitle: 'Integrasi Seluruh Materi — Kasus: The Missing History',
    topic: 'Integrasi Konsep & Metode Sejarah',
    difficulty: 'Tinggi (Ujian Akhir)',
    fragmentName: 'Chronos Core',
    fragmentSymbol: 'CORE-07',
    imagePath: GAME_IMAGES.level7,
    openingCutscene: {
      speaker: 'ARCHIVIST',
      lines: [
        'Selamat, Penjelajah. Keenam keping kode sudah berada di tanganmu. Namun lihatlah pusat ruangan ini—Chronos Core masih terkunci oleh satu brankas rahasia.',
        'Semua materi dari Ruang 01 hingga Ruang 06 ternyata menyatu dalam satu kasus nyata di arsip laboratorium: THE MISSING HISTORY — Misteri Hilangnya Catatan Perjanjian Pelabuhan Karang Samudra (1824).',
        'Setiap keputusanmu akan menentukan bukti apa yang terungkap dan seberapa kuat rekonstruksi sejarahmu. Pecahkan kasus ini untuk menjawab pertanyaan utama laboratorium!',
      ],
    },
    missionBrief:
      'Tuntaskan investigasi bercabang 7 tahap (The Missing History), susun kronologi kasus secara utuh, dan pecahkan sandi pertanyaan utama Chronos Engine.',
    hints: [
      'Di investigasi bercabang: selalu pilih langkah yang berurutan sesuai metode sejarah—mulai dari indeks/arsip primer yang relevan, lalu uji keasliannya sebelum menafsirkan.',
      'Perhatikan tanggal, gaya ejaan, dan jenis media saat mengaudit dokumen Pelabuhan Karang Samudra tahun 1824—waspadai dokumen anakronistik!',
      'Untuk kunci terakhir Chronos Engine: masa lalu memang tak bisa diulang, tetapi dapat diketahui secara ilmiah melalui JEJAK/BUKTI dan METODE PENELITIAN SEJARAH.',
    ],
    challenges: [
      {
        id: 'l7_c1',
        title: 'Investigasi Bercabang: The Missing History (1824)',
        mechanicLabel: 'Branching Investigation',
        type: 'BRANCHING_FINAL',
        instruction:
          'Selesaikan 7 langkah investigasi bercabang untuk merekonstruksi hilangnya catatan Perjanjian Pelabuhan Karang Samudra tahun 1824. Keputusanmu memengaruhi petunjuk lanjutan dan kualitas rekonstruksi!',
        branchingData: {
          caseTitle: 'KASUS FINAL: HILANGNYA CATATAN PELABUHAN KARANG SAMUDRA (1824)',
          caseBrief:
            'Catatan resmi Perjanjian Dagang Pelabuhan Karang Samudra (wilayah pesisir utara Jawa) pada Mei 1824 mendadak hilang dari arsip utama laboratorium. Sebuah rumor beredar bahwa dokumen itu dicuri karena berisi persekongkolan dagang. Tugasmu: rekonstruksi peristiwa tersebut dengan seluruh ilmu sejarah yang telah kamu kuasai.',
          steps: [
            {
              id: 'st_1',
              stepNumber: 1,
              phaseLabel: 'Tahap 1 · Menentukan Informasi yang Dicari',
              title: 'Merumuskan Fokus Penelitian',
              narrative:
                'Arsip laboratorium penuh dengan ribuan berkas abad ke-19. Sebelum bergerak, kamu harus menentukan informasi inti yang paling dibutuhkan untuk melacak catatan perjanjian yang hilang.',
              question:
                'Fokus pertanyaan investigasi manakah yang paling tajam dan historis?',
              options: [
                {
                  id: 's1_opt1',
                  label:
                    'Menelusuri siapa pihak yang terlibat (Manusia), di mana perjanjian disahkan (Ruang), kapan naskah terakhir tercatat (Waktu: Mei 1824), serta penyebab hilangnya naskah.',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Fokus penelitianmu sangat tajam! ARCHIVIST membuka indeks katalog arsip abad ke-19.',
                  unlockedClue:
                    'Petunjuk Terbuka: Katalog ANRI menunjuk pada Rak Maritim 1824 berisi catatan Syahbandar & jurnal pelayaran.',
                },
                {
                  id: 's1_opt2',
                  label:
                    'Mencari seluruh legenda rakyat tentang hantu pelabuhan tanpa membatasi lokasi maupun tahun kejadian.',
                  branchScore: 5,
                  isCorrect: false,
                  consequence:
                    'Fokus terlalu kabur dan bercampur mitos! Kamu kehilangan waktu, namun ARCHIVIST tetap mengarahkanmu ke Rak Maritim 1824.',
                  unlockedClue:
                    'Petunjuk Darurat: Fokus harus dibatasi pada pelaku, ruang Karang Samudra, dan waktu Mei 1824.',
                },
              ],
            },
            {
              id: 'st_2',
              stepNumber: 2,
              phaseLabel: 'Tahap 2 · Heuristik & Klasifikasi Sumber',
              title: 'Memilih Sumber Primer, Sekunder, dan Tersier',
              narrative:
                'Di Rak Maritim 1824 kamu menemukan empat berkas. Pilih kombinasi sumber paling tepat sesuai kedudukannya untuk menjawab kasus!',
              question: 'Kombinasi sumber manakah yang paling tepat dikumpulkan pada tahap heuristik?',
              options: [
                {
                  id: 's2_opt1',
                  label:
                    'Indeks Katalog Pelabuhan (Tersier) untuk melacak lokasi, lalu mengumpulkan Surat Catatan Harian Syahbandar 1824 (Primer) dan Jurnal Sejarah Perdagangan Maritim Nusantara (Sekunder).',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Pilihan sumber lengkap! Kamu memakai sumber tersier sebagai pemandu untuk menemukan sumber primer dan sekunder yang relevan.',
                  unlockedClue:
                    'Petunjuk Terbuka: Di dalam Catatan Syahbandar 1824 terselip dua surat tambahan yang harus diuji keasliannya!',
                },
                {
                  id: 's2_opt2',
                  label:
                    'Hanya mengambil satu halaman Ensiklopedia Umum tanpa mencari arsip surat atau buku kajian ilmiah.',
                  branchScore: 8,
                  isCorrect: false,
                  consequence:
                    'Sumber tersier saja tidak cukup untuk penelitian mendalam! Kamu terpaksa menelusuri kembali berkas primer di laci cadangan.',
                  unlockedClue:
                    'Petunjuk Cadangan: Ditemukan 2 surat di laci cadangan—segera lakukan kritik sumber.',
                },
              ],
            },
            {
              id: 'st_3',
              stepNumber: 3,
              phaseLabel: 'Tahap 3 · Kritik Eksternal & Internal',
              title: 'Menguji Dua Surat Misterius',
              narrative:
                'Terdapat dua surat yang sama-sama mengklaim alasan hilangnya naskah perjanjian: [Dokumen X] bertinta ballpoint modern dengan ejaan EYD baru bertanggal "18 Mei 1824" yang menyalahkan monster laut; [Dokumen Y] berbahan kertas kapas tua bertinta iron-gall dengan stempel Syahbandar Karang Samudra bertanggal "19 Mei 1824" yang melaporkan pemindahan peti arsip ke gudang benteng sebelum banjir rob.',
              question: 'Hasil kritik eksternal dan internal manakah yang paling tepat?',
              options: [
                {
                  id: 's3_opt1',
                  label:
                    'Menolak Dokumen X karena gagal kritik eksternal (tinta ballpoint & ejaan EYD baru anakronistik dengan tahun 1824) serta gagal kritik internal (klaim tidak logis); menerima Dokumen Y untuk diuji silang dengan log kapal.',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Analisis forensik sempurna! Kamu terhindar dari jebakan dokumen palsu dan memperoleh isi asli Dokumen Y.',
                  unlockedClue:
                    'Bukti Terverifikasi: Peti arsip dipindahkan ke gudang benteng saat banjir rob melanda pelabuhan pada malam 18 Mei 1824.',
                },
                {
                  id: 's3_opt2',
                  label:
                    'Menerima Dokumen X karena ceritanya paling dramatis tanpa memeriksa jenis tinta, ejaan, maupun konsistensi isinya.',
                  branchScore: 0,
                  isCorrect: false,
                  consequence:
                    'Peringatan Kritik Sumber! Uji kimia ARCHIVIST mendeteksi tinta ballpoint abad ke-20 pada Dokumen X—dokumen itu palsu. Hanya Dokumen Y yang lolos uji.',
                  unlockedClue:
                    'Koreksi Sistem: Dokumen Y lolos verifikasi—peti arsip dipindahkan sebelum banjir rob 18 Mei 1824.',
                },
              ],
            },
            {
              id: 'st_4',
              stepNumber: 4,
              phaseLabel: 'Tahap 4 · Interpretasi Bukti',
              title: 'Menafsirkan Hubungan Fakta',
              narrative:
                'Kamu membandingkan Dokumen Y dengan buku jurnal pelayaran (sumber sekunder) yang mencatat terjadinya gelombang pasang besar di pesisir utara Jawa pada pertengahan Mei 1824, serta catatan gudang benteng mengenai peti berkode "K-1824" yang salah diberi label sebagai barang rampasan.',
              question: 'Interpretasi sejarah manakah yang paling logis berdasarkan bukti-bukti tersebut?',
              options: [
                {
                  id: 's4_opt1',
                  label:
                    'Naskah perjanjian sebenarnya tidak dicuri oleh bajak laut maupun hancur, melainkan diselamatkan dari banjir rob malam 18 Mei 1824 ke gudang benteng lalu tersimpan keliru akibat kesalahan pelabelan peti K-1824.',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Interpretasi brilian! Kamu menghubungkan fakta dokumen primer dan konteks geografis secara objektif.',
                  unlockedClue:
                    'Lokasi Peti K-1824 terdeteksi di arsip benteng lama!',
                },
                {
                  id: 's4_opt2',
                  label:
                    'Naskah pasti dibakar sengaja oleh Syahbandar karena ia ingin menyembunyikan harta karun pribadi.',
                  branchScore: 5,
                  isCorrect: false,
                  consequence:
                    'Interpretasi tersebut tidak didukung bukti pembakaran. Data gudang justru menunjukkan peti berkode K-1824 masih utuh dengan label yang salah.',
                  unlockedClue:
                    'Catatan Korektif: Peti K-1824 ditemukan utuh dengan kesalahan pelabelan setelah evakuasi banjir rob.',
                },
              ],
            },
            {
              id: 'st_5',
              stepNumber: 5,
              phaseLabel: 'Tahap 5 · Unsur Manusia, Ruang, dan Waktu',
              title: 'Mengunci Tiga Dimensi Kasus',
              narrative:
                'Untuk memasukkan temuan ke dalam matriks Chronos Core, tentukan ikatan tiga unsur utama sejarah dari kasus Karang Samudra.',
              question: 'Pasangan unsur Manusia, Ruang, dan Waktu manakah yang paling akurat?',
              options: [
                {
                  id: 's5_opt1',
                  label:
                    'Manusia: Syahbandar Pelabuhan & Utusan Dagang; Ruang: Pelabuhan Karang Samudra & Gudang Benteng Pesisir Utara Jawa; Waktu: 14–19 Mei 1824.',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Ketiga dimensi terkunci presisi di hologram!',
                  unlockedClue:
                    'Matriks 3 Dimensi lengkap.',
                },
                {
                  id: 's5_opt2',
                  label:
                    'Manusia: Rombongan Wisatawan Modern; Ruang: Laboratorium Chronos; Waktu: Tahun 2026.',
                  branchScore: 0,
                  isCorrect: false,
                  consequence:
                    'Itu adalah unsur ruang-waktu pemain saat ini, bukan peristiwa sejarah kasus Karang Samudra (1824)!',
                  unlockedClue:
                    'Koreksi Dimensi: Syahbandar & Utusan Dagang · Karang Samudra · 14–19 Mei 1824.',
                },
              ],
            },
            {
              id: 'st_6',
              stepNumber: 6,
              phaseLabel: 'Tahap 6 · Kedudukan Sejarah (Ilmu & Seni)',
              title: 'Memilih Pendekatan Narasi Akhir',
              narrative:
                'Seluruh fakta telah tersusun. Kamu harus menulis kesimpulan kasus untuk arsip Chronos Engine agar akurat secara ilmiah sekaligus mudah dipahami sebagai kisah sejarah.',
              question: 'Kalimat kesimpulan manakah yang mencerminkan perpaduan Sejarah sebagai Ilmu dan Seni secara bertanggung jawab?',
              options: [
                {
                  id: 's6_opt1',
                  label:
                    '"Pada 14–19 Mei 1824, di tengah ancaman gelombang pasang pesisir utara Jawa, Syahbandar Pelabuhan Karang Samudra memindahkan peti naskah perjanjian ke gudang benteng (18 Mei) demi menyelamatkan arsip dagang. Kesalahan pelabelan peti berkode K-1824 membuat catatan ini terlupakan selama dua abad hingga berhasil dilacak kembali melalui uji silang arsip primer dan sumber sekunder."',
                  branchScore: 20,
                  isCorrect: true,
                  consequence:
                    'Kesimpulan narasi sejarahmu luar biasa—padat bukti, kronologis, komunikatif, dan bebas rekayasa!',
                  unlockedClue:
                    'Arsip K-1824 resmi dipulihkan ke Chronos Core.',
                },
                {
                  id: 's6_opt2',
                  label:
                    '"Pada suatu malam yang entah kapan, kabarnya muncul badai misterius yang menelan surat tanpa ada bukti arsip yang perlu diperiksa."',
                  branchScore: 0,
                  isCorrect: false,
                  consequence:
                    'Kesimpulan ini mengabaikan unsur waktu, ruang, serta fakta bukti yang telah diverifikasi.',
                  unlockedClue:
                    'Narasi harus mencantumkan bukti, tanggal 14–19 Mei 1824, pelaku, dan lokasi yang jelas.',
                },
              ],
            },
          ],
        },
        correctSummary:
          'Investigasi lengkap mulai dari perumusan fokus -> heuristik primer/sekunder/tersier -> kritik menolak Dokumen X palsu & memakai Dokumen Y -> interpretasi evakuasi banjir rob & salah label K-1824 -> unsur Manusia-Ruang-Waktu -> penulisan narasi ilmiah & estetik.',
        explanation:
          'Investigasi bercabang ini membuktikan bahwa seluruh materi dari Level 1 hingga Level 6 adalah satu kesatuan kerja sejarawan.',
      },
      {
        id: 'l7_c2',
        title: 'Rekonstruksi Kronologi Karang Samudra',
        mechanicLabel: 'Sequence Puzzle',
        type: 'SEQUENCE',
        instruction:
          'Susun 4 kejadian hasil investigasimu dari urutan waktu paling awal hingga akhir untuk mengunci kalibrasi Chronos Core.',
        sequenceData: {
          items: [
            {
              id: 'ks_3',
              label: '18 Mei 1824 malam: Syahbandar memindahkan peti naskah ke gudang benteng sebelum banjir rob.',
              detail: 'Evakuasi Arsip',
            },
            {
              id: 'ks_1',
              label: '14 Mei 1824: Penandatanganan Perjanjian Dagang di Pelabuhan Karang Samudra.',
              detail: 'Peristiwa Awal',
            },
            {
              id: 'ks_4',
              label: '19 Mei 1824: Pencatatan laporan pemindahan (Dokumen Y), namun peti K-1824 keliru diberi label.',
              detail: 'Salah Pelabelan',
            },
            {
              id: 'ks_2',
              label: '17 Mei 1824: Gelombang pasang tinggi mulai mengancam dermaga dan kantor arsip pelabuhan.',
              detail: 'Pemicu Krisis',
            },
          ],
          correctOrderIds: ['ks_1', 'ks_2', 'ks_3', 'ks_4'],
        },
        correctSummary: '14 Mei 1824 -> 17 Mei 1824 -> 18 Mei 1824 -> 19 Mei 1824.',
        explanation:
          'Kronologi yang tepat memperlihatkan sebab-akibat yang jelas: perjanjian (14 Mei) -> ancaman gelombang pasang (17 Mei) -> evakuasi (18 Mei) -> pelaporan & salah label peti (19 Mei).',
      },
      {
        id: 'l7_c3',
        title: 'Kunci Utama Chronos Engine: Jawaban Konflik Inti',
        mechanicLabel: 'Decision Making',
        type: 'CASE_ANALYSIS',
        instruction:
          'Ketujuh soket Chronos Core kini meminta jawaban atas pertanyaan filosofis dan metodologis utama sejak awal petualanganmu!',
        caseData: {
          caseTitle: 'PERTANYAAN KUNCI REAKTOR CHRONOS',
          question:
            '"Jika masa lalu tidak dapat diulang, bagaimana manusia bisa mengetahui bahwa suatu peristiwa benar-benar pernah terjadi?"',
          options: [
            {
              id: 'fin_a',
              label:
                'Melalui jejak dan sumber sejarah (primer, sekunder, tersier) yang ditelusuri, diuji keaslian serta kebenarannya lewat kritik eksternal dan internal, ditafsirkan secara logis dalam dimensi manusia-ruang-waktu, dan ditulis dengan metode penelitian sejarah.',
              isCorrect: true,
            },
            {
              id: 'fin_b',
              label:
                'Dengan membangun mesin waktu fisik untuk kembali ke masa lalu secara langsung, karena arsip dan metode ilmiah tidak dapat dipercaya.',
              isCorrect: false,
            },
            {
              id: 'fin_c',
              label:
                'Cukup mempercayai semua cerita turun-temurun yang paling menarik tanpa perlu memeriksa bukti maupun kronologinya.',
              isCorrect: false,
            },
          ],
        },
        correctSummary:
          'Manusia mengetahui masa lalu melalui jejak/sumber sejarah yang diverifikasi dan ditafsirkan memakai metode penelitian sejarah.',
        explanation:
          'Inilah esensi seluruh pembelajaran Sejarah Kelas X: masa lalu tidak terulang, dan mesin waktu hanyalah fiksi. Namun jejak-jejak peninggalan masa lalu yang diuji dengan metode sejarah memungkinkan kita merekonstruksi kebenaran masa lalu secara ilmiah.',
      },
    ],
    bonusChallenge: {
      id: 'l7_bonus',
      title: 'Tantangan Bonus: Sandi Penyatuan 7 Fragmen',
      mechanicLabel: 'Code Breaking',
      type: 'CODE_BREAKING',
      isBonus: true,
      instruction:
        'Masukkan 1 kata kunci (12 huruf) nama tahap penulisan karya sejarah yang menjadi muara akhir seluruh metode penelitian sejarah.',
      codeBreakingData: {
        cipherClues: [
          { symbol: 'HISTO', clue: 'Merujuk pada penyelidikan sejarah.' },
          { symbol: 'GRAFI', clue: 'Dari bahasa Yunani "graphein" yang berarti menulis.' },
          { symbol: 'HASIL', clue: 'Tahap ke-4 setelah Heuristik, Kritik, dan Interpretasi.' },
        ],
        question: 'Ketik istilah tahap penulisan karya sejarah (12 huruf):',
        placeholder: 'Ketik istilah...',
        acceptedAnswers: ['HISTORIOGRAFI'],
        displayAnswer: 'HISTORIOGRAFI',
      },
      correctSummary: 'HISTORIOGRAFI',
      explanation:
        'Historiografi adalah puncak seluruh kerja penelitian sejarah—menghadirkan rekonstruksi tertulis masa lalu yang berlandaskan bukti dan bernilai edukatif.',
    },
    materialSummary: [
      'Seluruh materi pengantar ilmu sejarah saling terhubung: dari makna kata (etimologi), pemilihan sumber (primer/sekunder/tersier), hingga metode penelitian (heuristik, kritik, interpretasi, historiografi).',
      'Setiap peristiwa sejarah wajib diikat dalam tiga dimensi: Manusia, Ruang, dan Waktu (kronologi, periodisasi, kausalitas).',
      'Karya sejarah memadukan ketelitian ilmiah (Ilmu), narasi rekonstruktif (Kisah), realitas unik kejadiannya (Peristiwa), dan kekuatan penyajian bahasa tanpa fiksi (Seni).',
      'Meskipun masa lalu tidak dapat diulang oleh mesin waktu, manusia dapat membuktikannya melalui jejak sejarah yang diverifikasi secara metodologis.',
    ],
    competencies: [
      'Mengintegrasikan seluruh tahapan metode sejarah dalam memecahkan kasus investigasi.',
      'Menyusun rekonstruksi kronologis dan narasi sejarah berbasis bukti terverifikasi.',
      'Menjawab persoalan epistemologis: bagaimana kebenaran masa lalu diketahui secara ilmiah.',
    ],
    improvementAdvice:
      'Terus latih kebiasaan berpikir kritis terhadap setiap informasi sejarah atau berita di masa kini: cek sumber aslinya, uji keandalannya, dan periksa konteks ruang-waktunya.',
    unlockQuote:
      'CHRONOS CORE AKTIF! Seluruh tujuh keping kode sejarah bersatu—protokol penguncian laboratorium resmi dibuka!',
  },
];
