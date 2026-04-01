import { motion, AnimatePresence } from 'framer-motion';
import { MONEY_LADDER } from '../hooks/useGameState';

const LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O'];

export default function MoneyLadder({ currentIndex, phase, wonAmount }) {
  // Reverse so highest is at top
  const reversed = [...MONEY_LADDER].map((item, i) => ({ ...item, index: i })).reverse();

  const getItemStatus = (index) => {
    if (phase === 'won' || phase === 'walkaway') {
      // highlight won amount
      const won = MONEY_LADDER.findIndex(m => m.value === wonAmount);
      if (index === won) return 'won';
      if (index < (phase === 'won' ? currentIndex : currentIndex)) return 'passed';
      return 'future';
    }
    if (index === currentIndex) return 'current';
    if (index < currentIndex)   return 'passed';
    return 'future';
  };

  return (
    <aside className="flex flex-col h-full w-64 xl:w-72 border-l border-game-border/50 bg-game-panel/80 backdrop-blur-sm select-none">
      {/* Header */}
      <div className="px-4 py-3 border-b border-game-border/40 text-center">
        <p className="ladder-amount text-game-gold text-xs font-semibold tracking-widest uppercase">
          Prize Ladder
        </p>
      </div>

      {/* Ladder items */}
      <div className="flex-1 overflow-y-auto py-1">
        {reversed.map(({ label, value, isSafetyNet, index }) => {
          const status = getItemStatus(index);
          const questionNum = index + 1;

          return (
            <AnimatePresence key={index} mode="wait">
              <motion.div
                layout
                className={[
                  'relative flex items-center justify-between px-4 py-[6px] transition-all duration-300',
                  status === 'current'
                    ? 'ladder-item-current'
                    : '',
                  isSafetyNet && status !== 'future'
                    ? 'bg-game-gold/5'
                    : '',
                ].join(' ')}
              >
                {/* Safety-net marker */}
                {isSafetyNet && (
                  <span className="absolute left-1 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-game-gold shadow-[0_0_6px_2px_rgba(255,215,0,0.8)]" />
                )}

                {/* Question number */}
                <span
                  className={[
                    'text-xs font-medium w-6 text-right mr-2 shrink-0',
                    status === 'current' ? 'text-game-gold' :
                    status === 'passed'  ? 'text-game-correct/70' :
                    isSafetyNet         ? 'text-game-gold/60' :
                    'text-game-textDim/50',
                  ].join(' ')}
                >
                  {questionNum}
                </span>

                {/* Amount */}
                <span
                  className={[
                    'ladder-amount flex-1 text-right',
                    status === 'current'
                      ? 'text-game-gold font-bold text-sm'
                      : status === 'passed'
                        ? 'text-game-correct/80 text-xs font-semibold'
                        : isSafetyNet
                          ? 'text-game-gold/70 text-xs font-semibold'
                          : 'text-game-textDim/50 text-xs',
                  ].join(' ')}
                >
                  {label}
                </span>

                {/* Current indicator arrow */}
                {status === 'current' && (
                  <motion.span
                    initial={{ opacity: 0, x: -4 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="ml-2 text-game-gold text-xs"
                  >
                    ◀
                  </motion.span>
                )}

                {/* Passed checkmark */}
                {status === 'passed' && (
                  <span className="ml-2 text-game-correct/60 text-xs">✓</span>
                )}
              </motion.div>
            </AnimatePresence>
          );
        })}
      </div>

      {/* Bottom: safety net reminder */}
      <div className="px-4 py-3 border-t border-game-border/40">
        <p className="text-[10px] text-game-gold/60 ladder-amount text-center leading-tight">
          ● Safety Nets: $1,000 &amp; $32,000
        </p>
      </div>
    </aside>
  );
}
