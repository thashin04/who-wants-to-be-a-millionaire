/**
 * Sound Manager — powered by Howler.js
 *
 * SWAP IN YOUR OWN FILES: Replace the placeholder paths below with local .mp3
 * files placed in /public/sounds/. The shape of SOUND_CONFIG is the only thing
 * you need to change; the rest of the API stays the same.
 */

// ─── SOUND CONFIGURATION ────────────────────────────────────────────────────
// Set `enabled: false` on any entry to silence it without removing the hook.
const SOUND_CONFIG = {
  // Background tension loops — one per "tier" of questions
  bgEasy:    { src: ['/sounds/bg_easy.mp3'],    loop: true,  volume: 0.4, enabled: false },
  bgMedium:  { src: ['/sounds/bg_medium.mp3'],  loop: true,  volume: 0.45, enabled: false },
  bgHard:    { src: ['/sounds/bg_hard.mp3'],    loop: true,  volume: 0.5, enabled: false },
  bgFinal:   { src: ['/sounds/bg_final.mp3'],   loop: true,  volume: 0.55, enabled: false },

  // One-shot SFX
  questionAppear:  { src: ['/sounds/question_appear.mp3'],  loop: false, volume: 0.7, enabled: false },
  finalAnswer:     { src: ['/sounds/final_answer.mp3'],     loop: false, volume: 0.8, enabled: false },
  correct:         { src: ['/sounds/correct.mp3'],          loop: false, volume: 0.9, enabled: false },
  wrong:           { src: ['/sounds/wrong.mp3'],            loop: false, volume: 0.9, enabled: false },
  walkAway:        { src: ['/sounds/walk_away.mp3'],        loop: false, volume: 0.7, enabled: false },
  million:         { src: ['/sounds/million.mp3'],          loop: false, volume: 1.0, enabled: false },
  lifelineUsed:    { src: ['/sounds/lifeline.mp3'],         loop: false, volume: 0.7, enabled: false },
  audienceResult:  { src: ['/sounds/audience_result.mp3'],  loop: false, volume: 0.6, enabled: false },
  phonering:       { src: ['/sounds/phone_ring.mp3'],       loop: false, volume: 0.7, enabled: false },
};
// ────────────────────────────────────────────────────────────────────────────

let _sounds = {};
let _currentBgKey = null;
let _initialized = false;

function _tryLoad() {
  // Guard: only load when Howler is actually available and not yet loaded
  if (_initialized) return;
  if (typeof window === 'undefined') return;

  let Howl;
  try {
    ({ Howl } = require('howler'));
  } catch {
    // Howler not available (SSR / test env). Ops become no-ops.
    return;
  }

  Object.entries(SOUND_CONFIG).forEach(([key, cfg]) => {
    if (!cfg.enabled) return;
    _sounds[key] = new Howl({
      src: cfg.src,
      loop: cfg.loop ?? false,
      volume: cfg.volume ?? 0.5,
      html5: true,
      onloaderror: (_id, err) => {
        console.warn(`[SoundManager] Failed to load "${key}":`, err);
      },
    });
  });

  _initialized = true;
}

// ─── PUBLIC API ──────────────────────────────────────────────────────────────

/**
 * Call once on app mount.  Safe to call multiple times.
 */
export function initSounds() {
  _tryLoad();
}

/**
 * Play a background loop, fading out the previous one.
 * @param {'bgEasy'|'bgMedium'|'bgHard'|'bgFinal'} key
 */
export function playBg(key) {
  if (key === _currentBgKey) return;

  // Fade out existing bg
  if (_currentBgKey && _sounds[_currentBgKey]) {
    const prev = _sounds[_currentBgKey];
    prev.fade(prev.volume(), 0, 1500);
    setTimeout(() => prev.stop(), 1600);
  }

  _currentBgKey = key;

  if (_sounds[key]) {
    _sounds[key].play();
    _sounds[key].fade(0, SOUND_CONFIG[key].volume, 1500);
  }
}

/**
 * Stop all background music.
 */
export function stopBg() {
  if (_currentBgKey && _sounds[_currentBgKey]) {
    const bg = _sounds[_currentBgKey];
    bg.fade(bg.volume(), 0, 800);
    setTimeout(() => bg.stop(), 900);
  }
  _currentBgKey = null;
}

/**
 * Play a one-shot sound effect.
 * @param {keyof SOUND_CONFIG} key
 */
export function playSfx(key) {
  if (_sounds[key]) {
    _sounds[key].stop();
    _sounds[key].play();
  }
}

/**
 * Select the right background loop for a given question index (0-based).
 */
export function bgForLevel(questionIndex) {
  if (questionIndex >= 14) return 'bgFinal';
  if (questionIndex >= 10) return 'bgHard';
  if (questionIndex >= 5)  return 'bgMedium';
  return 'bgEasy';
}
