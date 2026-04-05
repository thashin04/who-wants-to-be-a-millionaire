import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import MoneyLadder from './components/MoneyLadder';
import { killAll, stopStartTheme } from './utils/soundManager';

// intro flow: 'warning' → click → 'video' → video ends → 'done' → click → game starts
const INTRO_WARNING = 'warning';
const INTRO_VIDEO   = 'video';
const INTRO_DONE    = 'done';

export default function App() {
  const [introState, setIntroState] = useState(INTRO_WARNING);
  const [showCrash, setShowCrash]   = useState(false);
  const [showThanks, setShowThanks] = useState(false);
  const introVideoRef = useRef(null);
  const crashVideoRef = useRef(null);
  const endingAudioRef = useRef(null);

  const {
    state,
    currentQuestion,
    getAnswerState,
    startGame: _startGame,
    selectAnswer: _selectAnswer,
    nextQuestion,
    walkAway,
    useFiftyFifty,
    usePhoneAFriend,
    useAskAudience,
    dismissLifeline,
    resetGame,
  } = useGameState();

  function handleIntroClick() {
    if (introState === INTRO_WARNING) {
      stopStartTheme();
      setIntroState(INTRO_VIDEO);
    } else if (introState === INTRO_VIDEO || introState === INTRO_DONE) {
      if (introVideoRef.current) introVideoRef.current.pause();
      _startGame();
    }
  }

  function handleIntroVideoEnd() {
    setIntroState(INTRO_DONE);
  }

  function handleEndScreenClick() {
    killAll();
    setShowThanks(true);
    if (endingAudioRef.current) {
      endingAudioRef.current.play();
    }
  }

  function selectAnswer(i) {
    if (state.currentIndex === 2) {
      killAll();
      setShowCrash(true);
      return;
    }
    _selectAnswer(i);
  }

  const { phase, currentIndex, wonAmount } = state;

  const isPlaying = phase !== 'start' && phase !== 'won' && phase !== 'wrong' && phase !== 'walkaway';
  const isEnded   = phase === 'won' || phase === 'wrong' || phase === 'walkaway';

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#010B2E' }}>

      {/* Preload ending audio */}
      <audio ref={endingAudioRef} src="/sounds/ending sound.mp3" preload="auto" />

      {/* ── Intro overlay (shown while phase === 'start') ────────────── */}
      {phase === 'start' && (
        <div
          className="absolute inset-0 z-30 cursor-pointer"
          onClick={handleIntroClick}
        >
          {introState === INTRO_WARNING && (
            <motion.div
              className="w-full h-full bg-black flex items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <img
                src="/image/epilepsy.png"
                alt="Epilepsy warning"
                className="w-full h-full object-contain select-none"
              />
            </motion.div>
          )}

          {(introState === INTRO_VIDEO || introState === INTRO_DONE) && (
            <video
              ref={introVideoRef}
              src="/image/Who Wants To Be A Millionaire Intro 2011.mp4"
              autoPlay
              preload="auto"
              onEnded={handleIntroVideoEnd}
              className="w-full h-full object-cover"
            />
          )}
        </div>
      )}

      {/* ── Game UI ─────────────────────────────────────────────────── */}
      <div className="game-bg game-content-layer h-screen flex overflow-hidden">

        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">

            {/* GAME SCREEN */}
            {isPlaying && (
              <motion.div
                key="game"
                className="flex-1 flex flex-col min-h-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <GameScreen
                  state={state}
                  currentQuestion={currentQuestion}
                  getAnswerState={getAnswerState}
                  selectAnswer={selectAnswer}
                  nextQuestion={nextQuestion}
                  walkAway={walkAway}
                  useFiftyFifty={useFiftyFifty}
                  usePhoneAFriend={usePhoneAFriend}
                  useAskAudience={useAskAudience}
                  dismissLifeline={dismissLifeline}
                />
              </motion.div>
            )}

            {/* END SCREEN */}
            {isEnded && (
              <motion.div
                key="end"
                className="flex-1 flex flex-col relative overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <EndScreen
                  phase={phase}
                  wonAmount={wonAmount}
                  onPlayAgain={resetGame}
                />
              </motion.div>
            )}

          </AnimatePresence>
        </div>

        {/* Money Ladder Sidebar */}
        {(isPlaying || isEnded) && (
          <MoneyLadder
            currentIndex={currentIndex}
            phase={phase}
            wonAmount={wonAmount}
          />
        )}

      </div>

      {/* ── Full-screen click overlay when game has ended ───────────── */}
      {isEnded && !showThanks && (
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={handleEndScreenClick}
        />
      )}

      {/* ── Thank You screen ─────────────────────────────────────────── */}
      {showThanks && (
        <div className="absolute inset-0 z-40 bg-black">
          <img
            src="/image/Thank you for watching! (1).png"
            alt="Thank you for watching"
            className="w-full h-full object-contain select-none"
          />
        </div>
      )}

      {/* ── Windows Crash Easter Egg ─────────────────────────────── */}
      {showCrash && !showThanks && (
        <div
          className="absolute inset-0 z-50 bg-black cursor-pointer"
          onClick={handleEndScreenClick}
        >
          <video
            ref={crashVideoRef}
            src="/image/windows_crash.mov"
            autoPlay
            preload="auto"
            className="w-full h-full object-cover pointer-events-none"
          />
        </div>
      )}
    </div>
  );
}
