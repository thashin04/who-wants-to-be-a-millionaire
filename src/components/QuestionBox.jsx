import { motion, AnimatePresence } from 'framer-motion';
import { MONEY_LADDER } from '../hooks/useGameState';

export default function QuestionBox({ question, questionIndex }) {
  if (!question) return null;

  const money = MONEY_LADDER[questionIndex]?.label ?? '';

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={question.id}
        initial={{ opacity: 0, y: 25, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.97 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="w-full px-2"
      >
        {/* Question number */}
        <div className="flex items-center justify-center gap-2 mb-3">
          <span className="text-game-textDim text-xs font-medium tracking-widest uppercase">
            Question {questionIndex + 1} of 10
          </span>
          <span className="text-game-textDim/40 text-xs">·</span>
          <span className="text-game-textDim/60 text-xs uppercase tracking-widest">
            {question.category}
          </span>
        </div>

        {/* Prize badge — prominent, centred, Cinzel font */}
        <div className="flex justify-center mb-4">
          <span
            className="px-6 py-1.5 rounded-lg ladder-amount font-bold text-sm text-game-gold tracking-widest"
            style={{
              background: 'linear-gradient(135deg, rgba(255,215,0,0.12) 0%, rgba(255,140,0,0.08) 100%)',
              border: '1px solid rgba(255,215,0,0.55)',
              boxShadow: '0 0 16px rgba(255,215,0,0.2)',
            }}
          >
            {money}
          </span>
        </div>

        {/* Question panel — octagonal, gold border */}
        <div className="question-panel-outer">
          <div className="question-panel px-14 py-7 text-center">
            <p className="text-white text-xl xl:text-2xl font-semibold leading-snug tracking-wide">
              {question.question}
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
