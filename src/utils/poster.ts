export interface PosterExportPayload {
  playerName: string;
  playerClass: string;
  playerPhoto?: string;
  tierTitle: string;
  totalScore: number;
  accuracyPct: number;
  elapsedSeconds: number;
  completionCode: string;
  completedAtText: string;
  fragmentNames: string[];
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

export async function downloadCompletionPosterPNG(payload: PosterExportPayload): Promise<void> {
  const width = 1200;
  const height = 1600;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // 1. Deep Navy Background Gradient
  const bg = ctx.createLinearGradient(0, 0, width, height);
  bg.addColorStop(0, '#050B16');
  bg.addColorStop(0.5, '#0B162C');
  bg.addColorStop(1, '#060D1A');
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, width, height);

  // Subtle decorative astrolabe rings behind center
  ctx.save();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.12)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(width / 2, 540, 320, 0, Math.PI * 2);
  ctx.stroke();

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.16)';
  ctx.setLineDash([14, 10]);
  ctx.beginPath();
  ctx.arc(width / 2, 540, 275, 0, Math.PI * 2);
  ctx.stroke();
  ctx.restore();

  // 2. Antique Gold Double Frame
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, width - 84, height - 84);

  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.strokeRect(58, 58, width - 116, height - 116);

  // 3. Header Typography
  ctx.textAlign = 'center';
  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('CHRONOS HISTORICAL RESEARCH CENTER · SEJARAH SMA KELAS X', width / 2, 128);

  ctx.fillStyle = '#F8FAFC';
  ctx.font = '700 48px "Cinzel", Georgia, serif';
  ctx.fillText('THE HISTORY ESCAPE', width / 2, 198);

  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 28px "Cinzel", Georgia, serif';
  ctx.fillText('THE LOST TIMELINE — SERTIFIKAT PENYELESAIAN', width / 2, 246);

  // Divider line
  ctx.strokeStyle = 'rgba(212, 175, 55, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(220, 282);
  ctx.lineTo(width - 220, 282);
  ctx.stroke();

  // 4. Student Photo Frame
  const photoSize = 270;
  const photoX = (width - photoSize) / 2;
  const photoY = 330;

  ctx.save();
  drawRoundedRect(ctx, photoX - 8, photoY - 8, photoSize + 16, photoSize + 16, 24);
  ctx.fillStyle = '#060D1A';
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 3;
  ctx.stroke();

  drawRoundedRect(ctx, photoX, photoY, photoSize, photoSize, 18);
  ctx.clip();

  if (payload.playerPhoto) {
    try {
      const img = await loadImage(payload.playerPhoto);
      ctx.drawImage(img, photoX, photoY, photoSize, photoSize);
    } catch {
      ctx.fillStyle = '#12213D';
      ctx.fillRect(photoX, photoY, photoSize, photoSize);
    }
  } else {
    ctx.fillStyle = '#12213D';
    ctx.fillRect(photoX, photoY, photoSize, photoSize);
    ctx.fillStyle = '#D4AF37';
    ctx.font = '700 92px "Cinzel", Georgia, serif';
    const initials = payload.playerName
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0].toUpperCase())
      .join('');
    ctx.fillText(initials || 'HS', width / 2, photoY + 165);
  }
  ctx.restore();

  // 5. Student Name, Class & Achievement Tier
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('DIBERIKAN KEPADA PENJELAJAH ARSIP', width / 2, 668);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 46px "Cinzel", Georgia, serif';
  ctx.fillText(payload.playerName.toUpperCase(), width / 2, 728);

  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 28px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Kelas ${payload.playerClass}`, width / 2, 774);

  // Tier Banner
  drawRoundedRect(ctx, 320, 810, width - 640, 68, 12);
  ctx.fillStyle = 'rgba(212, 175, 55, 0.14)';
  ctx.fill();
  ctx.strokeStyle = '#D4AF37';
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 30px "Cinzel", Georgia, serif';
  ctx.fillText(payload.tierTitle.toUpperCase(), width / 2, 855);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '400 22px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(
    'Telah berhasil memecahkan seluruh misteri pada 7 ruangan dan mengaktifkan Chronos Core.',
    width / 2,
    928
  );

  // 6. Metrics Panel
  const panelX = 120;
  const panelY = 970;
  const panelW = width - 240;
  const panelH = 150;
  drawRoundedRect(ctx, panelX, panelY, panelW, panelH, 16);
  ctx.fillStyle = '#060D1A';
  ctx.fill();
  ctx.strokeStyle = '#1E293B';
  ctx.lineWidth = 2;
  ctx.stroke();

  const mins = Math.floor(payload.elapsedSeconds / 60);
  const secs = payload.elapsedSeconds % 60;
  const timeText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;

  const cols = [
    { label: 'TOTAL SKOR', val: `${payload.totalScore} POIN`, color: '#D4AF37' },
    { label: 'KETEPATAN', val: `${payload.accuracyPct}%`, color: '#34D399' },
    { label: 'RUANGAN SELESAI', val: '7 / 7', color: '#38BDF8' },
    { label: 'WAKTU MISI', val: timeText, color: '#F8FAFC' },
  ];

  cols.forEach((c, idx) => {
    const cx = panelX + (panelW / 4) * idx + panelW / 8;
    ctx.fillStyle = '#94A3B8';
    ctx.font = '600 17px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(c.label, cx, panelY + 52);

    ctx.fillStyle = c.color;
    ctx.font = '700 32px "IBM Plex Mono", monospace';
    ctx.fillText(c.val, cx, panelY + 106);
  });

  // 7. Seven Fragments Collected
  ctx.fillStyle = '#D4AF37';
  ctx.font = '600 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('TUJUH KEPING KODE SEJARAH YANG DIPULIHKAN', width / 2, 1184);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '500 20px "Plus Jakarta Sans", sans-serif';
  const row1 = payload.fragmentNames.slice(0, 4).join('  ·  ');
  const row2 = payload.fragmentNames.slice(4).join('  ·  ');
  ctx.fillText(row1, width / 2, 1226);
  ctx.fillText(row2, width / 2, 1262);

  // 8. Authentication Footer Box
  drawRoundedRect(ctx, 120, 1320, width - 240, 175, 16);
  ctx.fillStyle = 'rgba(18, 33, 61, 0.75)';
  ctx.fill();
  ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.textAlign = 'left';
  ctx.fillStyle = '#38BDF8';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('AUTENTIFIKASI PENYELESAIAN DIGITAL', 165, 1372);

  ctx.fillStyle = '#E2E8F0';
  ctx.font = '400 20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(`Tanggal Selesai: ${payload.completedAtText}`, 165, 1414);
  ctx.fillText('Diverifikasi oleh: Sistem Arsip ARCHIVIST', 165, 1450);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94A3B8';
  ctx.font = '500 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('KODE AUTENTIKASI', width - 165, 1372);

  ctx.fillStyle = '#FDE68A';
  ctx.font = '700 36px "IBM Plex Mono", monospace';
  ctx.fillText(payload.completionCode, width - 165, 1424);

  ctx.fillStyle = '#34D399';
  ctx.font = '600 18px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('STATUS: SAH & TERVERIFIKASI', width - 165, 1460);

  // Export download
  const safeName = payload.playerName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const safeClass = payload.playerClass.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const link = document.createElement('a');
  link.download = `poster-history-escape-${safeName}-${safeClass}.png`;
  link.href = canvas.toDataURL('image/png');
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
