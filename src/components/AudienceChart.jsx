import { motion, AnimatePresence } from 'framer-motion';

const LABELS = ['A', 'B', 'C', 'D'];
const BAR_COLORS = [
  { bar: '#2255cc', glow: 'rgba(34,85,204,0.5)' },
  { bar: '#cc2255', glow: 'rgba(204,34,85,0.5)' },
  { bar: '#22cc55', glow: 'rgba(34,204,85,0.5)' },
  { bar: '#cc8822', glow: 'rgba(204,136,34,0.5)' },
];

export default function AudienceChart({ results, options, onClose }) {
  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-panel px-8 py-8 w-full max-w-lg"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="text-center text-game-gold ladder-amount text-lg font-bold mb-1 tracking-wide">
            Ask the Audience
          </h3>
          <p className="text-center text-game-textDim text-xs mb-6">
            Studio audience results
          </p>

          {/* Bars */}
          <div className="flex items-end justify-around gap-4 h-44 mb-4">
            {results.map((pct, i) => (
              <div key={i} className="flex flex-col items-center gap-1 flex-1">
                {/* Percentage label */}
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="text-white font-bold text-sm"
                >
                  {pct}%
                </motion.span>

                {/* Bar */}
                <div className="w-full flex items-end" style={{ height: '120px' }}>
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: `${(pct / 100) * 120}px` }}
                    transition={{ delay: 0.5 + i * 0.12, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
                    className="w-full rounded-t-sm audience-bar"
                    style={{
                      background: `linear-gradient(to top, ${BAR_COLORS[i].bar}aa, ${BAR_COLORS[i].bar})`,
                      boxShadow: `0 0 12px 3px ${BAR_COLORS[i].glow}`,
                    }}
                  />
                </div>

                {/* Option label */}
                <span className="text-game-textDim text-xs font-semibold">{LABELS[i]}</span>
                <span className="text-game-textDim/60 text-[10px] text-center leading-tight max-w-[80px]">
                  {options[i]}
                </span>
              </div>
            ))}
          </div>

          <div className="text-center mt-4">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-game-border/30 hover:bg-game-border/50 border border-game-border/60 text-game-text text-sm rounded-lg transition-colors"
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
