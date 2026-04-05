import { Howl } from 'howler';

const _startTheme = new Howl({
  src: ['/sounds/start_theme.mp3'],
  loop: true,
  volume: 0.25,
  html5: true,
});

const _bg = new Howl({
  src: ['/sounds/bg_music.mp3'],
  loop: true,
  volume: 0.25,
  html5: true,
});

const _sfx = {
  selectAnswer: new Howl({ src: ['/sounds/final_answer.mp3'], volume: 0.5, html5: true }),
  win:          new Howl({ src: ['/sounds/correct.mp3'],      volume: 1.0, html5: true }),
  lose:         new Howl({ src: ['/sounds/wrong.mp3'],        volume: 1.0, html5: true }),
};

export function initSounds() {}

// ── Start screen theme ────────────────────────────────────────────────────────

export function playStartTheme() {
  if (!_startTheme.playing()) _startTheme.play();
}

export function stopStartTheme() {
  _startTheme.stop();
}

// Start theme on first user interaction (browsers block autoplay before this)
function _onFirstInteraction() {
  playStartTheme();
  document.removeEventListener('click',      _onFirstInteraction);
  document.removeEventListener('keydown',    _onFirstInteraction);
  document.removeEventListener('touchstart', _onFirstInteraction);
}
document.addEventListener('click',      _onFirstInteraction);
document.addEventListener('keydown',    _onFirstInteraction);
document.addEventListener('touchstart', _onFirstInteraction);

// ── Game audio ────────────────────────────────────────────────────────────────

let _killed = false;

export function killAll() {
  _killed = true;
  _startTheme.mute(true);
  _startTheme.stop();
  _bg.mute(true);
  _bg.stop();
  Object.values(_sfx).forEach(s => { s.mute(true); s.stop(); });
}

export function playBgQuiet() {
  if (_killed) return;
  _bg.volume(0.1);
  if (!_bg.playing()) _bg.play();
}

export function playBg() {
  if (_killed) return;
  if (_bg.playing()) {
    _bg.fade(_bg.volume(), 0.25, 800);
  } else {
    _bg.volume(0.25);
    _bg.play();
  }
}

export function stopBg() {
  _bg.stop();
}

export function playSfx(key) {
  if (_killed) return;
  if (key === 'win' || key === 'lose') _bg.stop();
  const sound = _sfx[key];
  if (sound) { sound.stop(); sound.play(); }
}

export function playBg_unused() {}
export function bgForLevel() { return null; }

// Pause all audio when tab is hidden, resume when visible again
document.addEventListener('visibilitychange', () => {
  if (document.hidden) {
    _startTheme.pause();
    _bg.pause();
    Object.values(_sfx).forEach(s => s.pause());
  } else {
    if (!_killed) {
      if (_startTheme.seek() > 0) _startTheme.play();
      if (_bg.seek() > 0) _bg.play();
    }
  }
});
