export const ROOM_AMBIENT_LABELS: Record<number, string> = {
  1: 'Bisikan Manuskrip & Angin Ruang Batu',
  2: 'Detak Arsip & Ruang Investigasi Sunyi',
  3: 'Dengung Instrumen Lab Forensik',
  4: 'Resonansi Ruang-Waktu Kosmik',
  5: 'Dengung Mekanis Chronos Engine',
  6: 'Gema Galeri Empat Perspektif',
  7: 'Harmoni Inti Brankas Chronos Core',
};

class SoundEngine {
  private ctx: AudioContext | null = null;
  private enabled = true;

  // Ambient nodes registry so we can cleanly fade & tear down
  private ambientNodes: AudioNode[] = [];
  private ambientTimers: number[] = [];
  private ambientGain: GainNode | null = null;
  private activeAmbientLevelId: number | null = null;

  // Violation alarm timer
  private alarmInterval: number | null = null;

  public startAlarm() {
    this.stopAlarm();
    if (typeof window === 'undefined') return;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    const ctx = this.ctx;
    if (!ctx) return;
    if (ctx.state === 'suspended') {
      ctx.resume().catch(() => {});
    }

    let high = true;
    const triggerBeep = () => {
      try {
        if (ctx.state === 'suspended') {
          ctx.resume().catch(() => {});
        }
        const now = ctx.currentTime;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'square';
        osc.frequency.setValueAtTime(high ? 880 : 620, now);
        high = !high;

        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(0.14, now + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.3);
      } catch {
        // Ignore audio errors
      }
    };

    triggerBeep();
    this.alarmInterval = window.setInterval(triggerBeep, 360);
  }

  public stopAlarm() {
    if (this.alarmInterval !== null) {
      window.clearInterval(this.alarmInterval);
      this.alarmInterval = null;
    }
  }

  public setEnabled(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopAmbient();
    }
  }

  public isEnabled() {
    return this.enabled;
  }

  public getActiveAmbientLevelId() {
    return this.activeAmbientLevelId;
  }

  private getContext(): AudioContext | null {
    if (!this.enabled || typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  private playTone(
    freq: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume = 0.08,
    delay = 0
  ) {
    const ctx = this.getContext();
    if (!ctx) return;

    const startTime = ctx.currentTime + delay;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(freq, startTime);

    gain.gain.setValueAtTime(0.001, startTime);
    gain.gain.exponentialRampToValueAtTime(volume, startTime + 0.015);
    gain.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(startTime);
    osc.stop(startTime + duration + 0.02);
  }

  public click() {
    this.playTone(540, 0.06, 'triangle', 0.05);
  }

  public hint() {
    this.playTone(660, 0.14, 'sine', 0.07, 0);
    this.playTone(880, 0.18, 'sine', 0.06, 0.09);
  }

  public success() {
    this.playTone(523.25, 0.14, 'triangle', 0.08, 0);
    this.playTone(659.25, 0.14, 'triangle', 0.08, 0.09);
    this.playTone(783.99, 0.24, 'sine', 0.09, 0.18);
  }

  public error() {
    this.playTone(220, 0.16, 'sawtooth', 0.05, 0);
    this.playTone(175, 0.22, 'sawtooth', 0.05, 0.12);
  }

  public unlock() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.22, 'sine', 0.08, idx * 0.09);
    });
  }

  public victory() {
    const notes = [523.25, 659.25, 783.99, 1046.5];
    notes.forEach((n, idx) => {
      this.playTone(n, 0.35, 'triangle', 0.09, idx * 0.11);
    });
  }

  private createNoiseBuffer(ctx: AudioContext, seconds = 3): AudioBuffer {
    const sampleRate = ctx.sampleRate;
    const length = sampleRate * seconds;
    const buffer = ctx.createBuffer(1, length, sampleRate);
    const data = buffer.getChannelData(0);
    let lastOut = 0;
    for (let i = 0; i < length; i++) {
      const white = Math.random() * 2 - 1;
      // Soft pink/brownish noise smoothing for natural atmospheric texture
      data[i] = (lastOut + 0.04 * white) / 1.04;
      lastOut = data[i];
      data[i] *= 2.4;
    }
    return buffer;
  }

  public startAmbient(levelId: number) {
    if (!this.enabled) {
      this.stopAmbient();
      return;
    }
    if (this.activeAmbientLevelId === levelId && this.ambientGain) {
      return;
    }

    this.stopAmbient();
    const ctx = this.getContext();
    if (!ctx) return;

    this.activeAmbientLevelId = levelId;
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0001, ctx.currentTime);
    masterGain.gain.linearRampToValueAtTime(0.055, ctx.currentTime + 1.2);
    masterGain.connect(ctx.destination);
    this.ambientGain = masterGain;

    const registerNode = <T extends AudioNode>(node: T): T => {
      this.ambientNodes.push(node);
      return node;
    };

    const startNoiseLoop = (filterType: BiquadFilterType, freq: number, q: number, gainVal: number) => {
      const src = registerNode(ctx.createBufferSource());
      src.buffer = this.createNoiseBuffer(ctx, 4);
      src.loop = true;

      const filter = registerNode(ctx.createBiquadFilter());
      filter.type = filterType;
      filter.frequency.value = freq;
      filter.Q.value = q;

      const g = registerNode(ctx.createGain());
      g.gain.value = gainVal;

      src.connect(filter);
      filter.connect(g);
      g.connect(masterGain);
      src.start();
      return { src, filter, g };
    };

    const startOsc = (type: OscillatorType, freq: number, gainVal: number) => {
      const osc = registerNode(ctx.createOscillator());
      osc.type = type;
      osc.frequency.value = freq;
      const g = registerNode(ctx.createGain());
      g.gain.value = gainVal;
      osc.connect(g);
      g.connect(masterGain);
      osc.start();
      return { osc, g };
    };

    switch (levelId) {
      case 1: {
        // Level 1: Origin Chamber — eerie whispering air & stone echo
        const wind = startNoiseLoop('bandpass', 540, 3.2, 0.75);
        const lfo = registerNode(ctx.createOscillator());
        lfo.frequency.value = 0.22;
        const lfoGain = registerNode(ctx.createGain());
        lfoGain.gain.value = 260;
        lfo.connect(lfoGain);
        lfoGain.connect(wind.filter.frequency);
        lfo.start();

        // Subtle breathy whisper bursts every ~4.5s
        const timer = window.setInterval(() => {
          if (!this.enabled || !this.ambientGain || this.activeAmbientLevelId !== 1) return;
          const now = ctx.currentTime;
          const whisperNoise = ctx.createBufferSource();
          whisperNoise.buffer = this.createNoiseBuffer(ctx, 1.8);
          const bp = ctx.createBiquadFilter();
          bp.type = 'bandpass';
          bp.frequency.setValueAtTime(1100 + Math.random() * 500, now);
          bp.Q.value = 6;
          const wg = ctx.createGain();
          wg.gain.setValueAtTime(0.001, now);
          wg.gain.linearRampToValueAtTime(0.45, now + 0.55);
          wg.gain.exponentialRampToValueAtTime(0.001, now + 1.7);
          whisperNoise.connect(bp);
          bp.connect(wg);
          wg.connect(masterGain);
          whisperNoise.start(now);
          whisperNoise.stop(now + 1.8);
        }, 4600);
        this.ambientTimers.push(timer);

        startOsc('sine', 110, 0.18);
        break;
      }

      case 2: {
        // Level 2: Evidence Room — quiet room air + steady investigative clock tick
        startNoiseLoop('lowpass', 280, 1, 0.35);
        const timer = window.setInterval(() => {
          if (!this.enabled || !this.ambientGain || this.activeAmbientLevelId !== 2) return;
          const now = ctx.currentTime;
          const tick = ctx.createOscillator();
          tick.type = 'triangle';
          tick.frequency.setValueAtTime(980, now);
          tick.frequency.exponentialRampToValueAtTime(220, now + 0.03);
          const tg = ctx.createGain();
          tg.gain.setValueAtTime(0.18, now);
          tg.gain.exponentialRampToValueAtTime(0.001, now + 0.045);
          tick.connect(tg);
          tg.connect(masterGain);
          tick.start(now);
          tick.stop(now + 0.05);
        }, 1000);
        this.ambientTimers.push(timer);
        break;
      }

      case 3: {
        // Level 3: Historian's Lab — subtle laboratory equipment hum + soft glass resonance
        startOsc('sine', 98, 0.24);
        startOsc('triangle', 196, 0.09);
        startNoiseLoop('lowpass', 360, 1.2, 0.25);

        const timer = window.setInterval(() => {
          if (!this.enabled || !this.ambientGain || this.activeAmbientLevelId !== 3) return;
          const now = ctx.currentTime;
          const chime = ctx.createOscillator();
          chime.type = 'sine';
          const freqs = [587.33, 659.25, 783.99];
          chime.frequency.setValueAtTime(freqs[Math.floor(Math.random() * freqs.length)], now);
          const cg = ctx.createGain();
          cg.gain.setValueAtTime(0.001, now);
          cg.gain.linearRampToValueAtTime(0.12, now + 0.15);
          cg.gain.exponentialRampToValueAtTime(0.001, now + 1.6);
          chime.connect(cg);
          cg.connect(masterGain);
          chime.start(now);
          chime.stop(now + 1.7);
        }, 5200);
        this.ambientTimers.push(timer);
        break;
      }

      case 4: {
        // Level 4: Dimension Chamber — spatial cosmic fifths pad with slow sweep
        const pad1 = startOsc('sine', 130.81, 0.22);
        const pad2 = startOsc('sine', 196.0, 0.16);
        startOsc('sine', 261.63, 0.08);
        const lfo = registerNode(ctx.createOscillator());
        lfo.frequency.value = 0.14;
        const lfoG = registerNode(ctx.createGain());
        lfoG.gain.value = 0.08;
        lfo.connect(lfoG);
        lfoG.connect(pad1.g.gain);
        lfoG.connect(pad2.g.gain);
        lfo.start();
        break;
      }

      case 5: {
        // Level 5: Time Machine Paradox — mechanical humming & pulsing turbine thrum
        const saw = registerNode(ctx.createOscillator());
        saw.type = 'sawtooth';
        saw.frequency.value = 65.41;
        const lp = registerNode(ctx.createBiquadFilter());
        lp.type = 'lowpass';
        lp.frequency.value = 180;
        lp.Q.value = 3.5;
        const mg = registerNode(ctx.createGain());
        mg.gain.value = 0.35;
        saw.connect(lp);
        lp.connect(mg);
        mg.connect(masterGain);
        saw.start();

        const lfo = registerNode(ctx.createOscillator());
        lfo.frequency.value = 1.6;
        const lfoG = registerNode(ctx.createGain());
        lfoG.gain.value = 65;
        lfo.connect(lfoG);
        lfoG.connect(lp.frequency);
        lfo.start();

        startOsc('sine', 130.81, 0.22);
        startNoiseLoop('bandpass', 240, 2.2, 0.28);
        break;
      }

      case 6: {
        // Level 6: Four Faces of History — warm gallery chord resonance
        startOsc('sine', 146.83, 0.18);
        startOsc('sine', 220.0, 0.14);
        startOsc('triangle', 293.66, 0.06);
        startNoiseLoop('lowpass', 220, 0.8, 0.22);
        break;
      }

      case 7:
      default: {
        // Level 7: Final Archive — deep vault drone + Chronos Core harmonic shimmer
        startOsc('sine', 82.41, 0.28);
        startOsc('sine', 123.47, 0.18);
        startOsc('sine', 246.94, 0.09);
        const air = startNoiseLoop('bandpass', 420, 2.5, 0.35);
        const lfo = registerNode(ctx.createOscillator());
        lfo.frequency.value = 0.18;
        const lfoG = registerNode(ctx.createGain());
        lfoG.gain.value = 160;
        lfo.connect(lfoG);
        lfoG.connect(air.filter.frequency);
        lfo.start();
        break;
      }
    }
  }

  public stopAmbient() {
    this.ambientTimers.forEach((t) => window.clearInterval(t));
    this.ambientTimers = [];

    const nodes = this.ambientNodes;
    const gainNode = this.ambientGain;
    this.ambientNodes = [];
    this.ambientGain = null;
    this.activeAmbientLevelId = null;

    if (gainNode && this.ctx) {
      try {
        const now = this.ctx.currentTime;
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setValueAtTime(gainNode.gain.value, now);
        gainNode.gain.linearRampToValueAtTime(0.0001, now + 0.25);
      } catch {
        // ignore audio context teardown errors
      }
    }

    window.setTimeout(() => {
      nodes.forEach((n) => {
        try {
          if ('stop' in n && typeof (n as OscillatorNode).stop === 'function') {
            (n as OscillatorNode).stop();
          }
          n.disconnect();
        } catch {
          // ignore
        }
      });
      if (gainNode) {
        try {
          gainNode.disconnect();
        } catch {
          // ignore
        }
      }
    }, 280);
  }
}

export const soundFX = new SoundEngine();
