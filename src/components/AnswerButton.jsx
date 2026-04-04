import { motion } from 'framer-motion';

const LABELS = ['A', 'B', 'C', 'D'];

/**
 * answerState: 'default' | 'pending' | 'correct' | 'wrong' | 'reveal-correct' | 'eliminated'
 *
 * Button format matches the TV show: ♦ A: Answer text
 */
export default function AnswerButton({ index, text, answerState, onClick, disabled }) {
  const isClickable = answerState === 'default' && !disabled;

  const stateClass = {
    default:          'btn-default',
    pending:          'btn-pending',
    correct:          'btn-correct',
    wrong:            'btn-wrong',
    'reveal-correct': 'btn-reveal-correct',
    eliminated:       'btn-eliminated',
  }[answerState] ?? 'btn-default';

  // Colour of the ♦ letter prefix — matches the show's cyan label
  const labelColor =
    answerState === 'pending'                             ? 'text-game-orange' :
    answerState === 'correct' || answerState === 'reveal-correct' ? 'text-game-correct' :
    answerState === 'wrong'                               ? 'text-game-wrong'  :
    answerState === 'eliminated'                          ? 'text-transparent' :
    'text-game-cyan';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: index * 0.09, ease: 'easeOut' }}
      className={`answer-line-wrap ${stateClass} w-full`}
    >
      <motion.button
        onClick={isClickable ? onClick : undefined}
        disabled={!isClickable}
        whileHover={isClickable ? { scale: 1.03 } : {}}
        whileTap={isClickable  ? { scale: 0.97 } : {}}
        animate={answerState === 'wrong' ? { x: [0, -8, 8, -6, 6, 0] } : {}}
        transition={answerState === 'wrong' ? { duration: 0.45 } : {}}
        className="diamond-btn-wrap w-full focus:outline-none"
        style={{ cursor: isClickable ? 'pointer' : 'default' }}
      >
        {/* Fill layer — clipped to hexagon shape */}
        <div className="diamond-btn-clip relative z-10 px-8 py-2 flex items-center gap-2 min-h-[40px]">

          {/* ♦ A: label — matches TV show format */}
          <span className={`shrink-0 text-xs font-bold tracking-wide whitespace-nowrap ${labelColor}`}>
            ♦ {LABELS[index]}:
          </span>

          {/* Answer text */}
          <span
            className={[
              'flex-1 text-left text-xs font-medium leading-tight',
              answerState === 'eliminated' ? 'text-transparent' : 'text-white',
            ].join(' ')}
          >
            {text}
          </span>

          {/* State icon */}
          {(answerState === 'correct' || answerState === 'reveal-correct') ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="shrink-0 text-game-correct text-xl"
            >
              ✓
            </motion.span>
          ) : answerState === 'wrong' ? (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="shrink-0 text-game-wrong text-xl"
            >
              ✗
            </motion.span>
          ) : null}
        </div>
      </motion.button>
    </motion.div>
  );
}
