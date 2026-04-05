import { AnimatePresence, motion } from 'framer-motion';
import { useState, useRef } from 'react';
import { useGameState } from './hooks/useGameState';
import StartScreen from './components/StartScreen';
import GameScreen from './components/GameScreen';
import EndScreen from './components/EndScreen';
import MoneyLadder from './components/MoneyLadder';
import { killAll, stopStartTheme } from './utils/soundManager';

export default function App() {
  const [showCrash, setShowCrash] = useState(false);
  const crashVideoRef = useRef(null);

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

  function startGame() {
    stopStartTheme();
    _startGame();
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

      {/* ── Game UI ─────────────────────────────────────────────────── */}
      <div className="game-bg game-content-layer h-screen flex overflow-hidden">

        {/* Main content column */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">

            {/* START SCREEN */}
            {phase === 'start' && (
              <motion.div key="start" className="flex-1 flex flex-col" exit={{ opacity: 0 }}>
                <StartScreen onStart={startGame} />
              </motion.div>
            )}

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

      {/* ── Windows Crash Easter Egg ─────────────────────────────── */}
      {showCrash && (
        <div className="absolute inset-0 z-50 bg-black">
          <video
            ref={crashVideoRef}
            src="/image/windows_crash.mov"
            autoPlay
            preload="auto"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>
  );
}
