// src/services/soundService.js
/**
 * SoundService — génère des sons de notification via Web Audio API
 * Aucun fichier MP3 requis, tout est synthétisé en temps réel.
 */

class SoundService {
  constructor() {
    this.currentSound = localStorage.getItem('selectedSound') || 'chime'
    this._ctx = null
  }

  /** Crée / récupère l'AudioContext (lazy init pour respecter l'autoplay policy) */
  _getCtx() {
    if (!this._ctx || this._ctx.state === 'closed') {
      this._ctx = new (window.AudioContext || window.webkitAudioContext)()
    }
    if (this._ctx.state === 'suspended') {
      this._ctx.resume()
    }
    return this._ctx
  }

  /** Liste des sons disponibles */
  getAvailableSounds() {
    return [
      { id: 'chime',    name: '🔔 Chime — Cristallin',   desc: 'Ding doux, type iOS'         },
      { id: 'bell',     name: '🔕 Bell — Cloche',          desc: 'Cloche grave et ronde'        },
      { id: 'soft',     name: '🎵 Soft — Doux',            desc: 'Deux notes légères'           },
      { id: 'pulse',    name: '💫 Pulse — Moderne',        desc: 'Pulsation électronique'       },
      { id: 'alert',    name: '⚡ Alert — Vif',            desc: 'Bip court et précis'          },
      { id: 'marimba',  name: '🎶 Marimba — Chaleureux',   desc: 'Mélodie marimba 3 notes'     },
    ]
  }

  getCurrentSound() { return this.currentSound }

  setSound(soundId) {
    this.currentSound = soundId
    localStorage.setItem('selectedSound', soundId)
  }

  /**
   * Joue un son par son ID (utilise currentSound si non spécifié)
   * @param {string|null} soundId
   */
  playSound(soundId = null) {
    const id = soundId || this.currentSound
    try {
      const ctx = this._getCtx()
      switch (id) {
        case 'chime':   this._playChime(ctx);   break
        case 'bell':    this._playBell(ctx);    break
        case 'soft':    this._playSoft(ctx);    break
        case 'pulse':   this._playPulse(ctx);   break
        case 'alert':   this._playAlert(ctx);   break
        case 'marimba': this._playMarimba(ctx); break
        default:        this._playChime(ctx);   break
      }
    } catch (err) {
      console.warn('SoundService: cannot play sound', err)
    }
  }

  playSelectedSound() {
    this.playSound()
  }

  // ─── Sons synthétiques ────────────────────────────────────────────────────

  _note(ctx, freq, start, dur, type = 'sine', vol = 0.4) {
    const osc  = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.type      = type
    osc.frequency.setValueAtTime(freq, start)
    gain.gain.setValueAtTime(0, start)
    gain.gain.linearRampToValueAtTime(vol, start + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.001, start + dur)
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.start(start)
    osc.stop(start + dur + 0.05)
  }

  /** iOS-like chime : deux harmoniques décroissantes */
  _playChime(ctx) {
    const t = ctx.currentTime
    this._note(ctx, 1318.5, t,        0.6, 'sine', 0.35)  // E6
    this._note(ctx, 1760,   t,        0.4, 'sine', 0.20)  // A6
    this._note(ctx, 1046.5, t + 0.15, 0.8, 'sine', 0.25)  // C6
  }

  /** Cloche grave */
  _playBell(ctx) {
    const t = ctx.currentTime
    this._note(ctx, 523.25, t,        1.2, 'sine',   0.4)   // C5
    this._note(ctx, 659.25, t,        0.9, 'sine',   0.2)   // E5 harmonique
    this._note(ctx, 783.99, t + 0.05, 1.0, 'sine',   0.12)  // G5
  }

  /** Deux notes douces */
  _playSoft(ctx) {
    const t = ctx.currentTime
    this._note(ctx, 880, t,        0.4, 'sine', 0.30)  // A5
    this._note(ctx, 1108, t + 0.2, 0.5, 'sine', 0.25)  // C#6
  }

  /** Pulse électronique */
  _playPulse(ctx) {
    const t = ctx.currentTime
    this._note(ctx, 440, t,        0.12, 'square', 0.18)
    this._note(ctx, 880, t + 0.14, 0.12, 'square', 0.15)
    this._note(ctx, 660, t + 0.28, 0.18, 'square', 0.12)
  }

  /** Bip court */
  _playAlert(ctx) {
    const t = ctx.currentTime
    this._note(ctx, 1760, t,        0.08, 'square', 0.25)
    this._note(ctx, 1760, t + 0.12, 0.08, 'square', 0.20)
  }

  /** Marimba 3 notes : C5 - E5 - G5 */
  _playMarimba(ctx) {
    const t = ctx.currentTime
    const freqs = [523.25, 659.25, 783.99]
    freqs.forEach((f, i) => {
      this._note(ctx, f, t + i * 0.14, 0.55, 'sine', 0.32)
      // légère harmonique triangle pour timbre marimba
      this._note(ctx, f * 2, t + i * 0.14, 0.25, 'triangle', 0.08)
    })
  }
}

export const soundService = new SoundService()
export default soundService
