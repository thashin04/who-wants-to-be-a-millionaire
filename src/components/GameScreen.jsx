import { motion, AnimatePresence } from 'framer-motion';
import AnswerButton from './AnswerButton';
import QuestionBox from './QuestionBox';
import Lifelines from './Lifelines';
import AudienceChart from './AudienceChart';
import PhoneFriend from './PhoneFriend';

export default function GameScreen({
  state,
  currentQuestion,
  getAnswerState,
  selectAnswer,
  nextQuestion,
  walkAway,
  useFiftyFifty,
  usePhoneAFriend,
  useAskAudience,
  dismissLifeline,
}) {
  const { phase, currentIndex, lifelines, audienceResults, phoneHint, activeLifeline } = state;

  // When the player can still interact with answers
  const answersLocked = phase === 'pending' || phase === 'correct' || phase === 'wrong' || phase === 'won';

  return (
    <div className="flex-1 flex flex-col min-h-0 px-6 py-4 overflow-hidden">
      {/* ── Lifelines + Walk Away ─────────────────────────── */}
      <Lifelines
        lifelines={lifelines}
        phase={phase}
        useFiftyFifty={useFiftyFifty}
        usePhoneAFriend={usePhoneAFriend}
        useAskAudience={useAskAudience}
        walkAway={walkAway}
      />

      {/* ── Question Box ──────────────────────────────────── */}
      <div className="flex-1 flex flex-col items-center justify-center min-h-0">
        {currentQuestion && (
          <QuestionBox question={currentQuestion} questionIndex={currentIndex} />
        )}

        {/* ── Answer Grid (2×2 diamond buttons) ─────────── */}
        <AnimatePresence mode="wait">
          {currentQuestion && (
            <motion.div
              key={currentQuestion.id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full max-w-2xl grid grid-cols-2 gap-3 xl:gap-4 px-2"
            >
              {currentQuestion.options.map((option, i) => (
                <AnswerButton
                  key={i}
                  index={i}
                  text={option}
                  answerState={getAnswerState(i)}
                  onClick={() => selectAnswer(i)}
                  disabled={answersLocked}
                />
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── "Continue" button after correct answer ────── */}
        <AnimatePresence>
          {phase === 'correct' && (
            <motion.button
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.3 }}
              onClick={nextQuestion}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="mt-6 px-10 py-3 rounded-full font-bold text-base text-black"
              style={{
                background: 'linear-gradient(135deg, #00E676 0%, #00C853 100%)',
                boxShadow: '0 0 24px rgba(0,230,118,0.5)',
              }}
            >
              Next Question →
            </motion.button>
          )}
        </AnimatePresence>

        {/* ── Pending dramatic pause message ────────────── */}
        <AnimatePresence>
          {phase === 'pending' && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="mt-4 text-game-orange text-sm font-semibold tracking-widest uppercase"
            >
              Final Answer...
            </motion.p>
          )}
        </AnimatePresence>
      </div>

      {/* ── Lifeline Modals ─────────────────────────────── */}
      <AnimatePresence>
        {activeLifeline === 'audience' && audienceResults && currentQuestion && (
          <AudienceChart
            results={audienceResults}
            options={currentQuestion.options}
            onClose={dismissLifeline}
          />
        )}
        {activeLifeline === 'phone' && phoneHint && (
          <PhoneFriend hint={phoneHint} onClose={dismissLifeline} />
        )}
      </AnimatePresence>
    </div>
  );
}
