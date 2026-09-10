/**
 * Synthesizer Sound Engine for Umang Raj 3D Portfolio
 * Zero external audio assets - completely synthesized via Web Audio API.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.enabled = false;
  }

  init() {
    if (!this.ctx && (window.AudioContext || window.webkitAudioContext)) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggle() {
    this.enabled = !this.enabled;
    if (this.enabled) {
      this.init();
      this.play('enable');
    }
    return this.enabled;
  }

  play(type = 'hover') {
    if (!this.enabled) return;
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      if (type === 'hover') {
        // High, subtle blip
        osc.type = 'sine';
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(880, now + 0.05);

        gain.gain.setValueAtTime(0.02, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);

        osc.start(now);
        osc.stop(now + 0.06);
      } else if (type === 'click') {
        // Crisp dual-tone digital confirmation
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(440, now);
        osc.frequency.exponentialRampToValueAtTime(1100, now + 0.08);

        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);

        osc.start(now);
        osc.stop(now + 0.1);
      } else if (type === 'enable') {
        // Ascending power-up chord
        osc.type = 'sine';
        osc.frequency.setValueAtTime(260, now);
        osc.frequency.exponentialRampToValueAtTime(520, now + 0.12);
        osc.frequency.exponentialRampToValueAtTime(1040, now + 0.22);

        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);

        osc.start(now);
        osc.stop(now + 0.25);
      } else if (type === 'modal') {
        // Smooth atmospheric whoosh
        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(360, now + 0.15);

        gain.gain.setValueAtTime(0.035, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);

        osc.start(now);
        osc.stop(now + 0.2);
      }
    } catch (e) {
      // Ignore audio synthesis errors on strict autoplay policies
    }
  }
}

window.soundEngine = new SoundEngine();

