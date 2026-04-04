import { Howl } from 'howler';

const _bg = new Howl({
  src: ['/sounds/bg_music.mp3'],
  loop: true,
  volume: 0.5,
  html5: true,
});

const _sfx = {
  selectAnswer: new Howl({ src: ['/sounds/final_answer.mp3'], volume: 0.8, html5: true }),
  win:          new Howl({ src: ['/sounds/correct.mp3'],      volume: 1.0, html5: true }),
  lose:         new Howl({ src: ['/sounds/wrong.mp3'],        volume: 1.0, html5: true }),
};

export function initSounds() {}

export function playBg() {
  if (!_bg.playing()) _bg.play();
}

export function stopBg() {
  _bg.stop();
}

export function playSfx(key) {
  // Stop background before win/lose stings so they don't overlap
  if (key === 'win' || key === 'lose') {
    _bg.stop();
  }
  const sound = _sfx[key];
  if (sound) {
    sound.stop();
    sound.play();
  }
}

// Keep these exports so useGameState.js doesn't break — they're now no-ops
export function playBg_unused() {}
export function bgForLevel() { return null; }
