import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function PhoneFriend({ hint, onClose }) {
  const [typedText, setTypedText] = useState('');
  const [done, setDone] = useState(false);

  // Typewriter effect
  useEffect(() => {
    if (!hint) return;
    setTypedText('');
    setDone(false);
    let i = 0;
    const interval = setInterval(() => {
      i++;
      setTypedText(hint.slice(0, i));
      if (i >= hint.length) {
        clearInterval(interval);
        setDone(true);
      }
    }, 28);
    return () => clearInterval(interval);
  }, [hint]);

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={done ? onClose : undefined}
      >
        <motion.div
          className="modal-panel px-8 py-8 w-full max-w-md"
          initial={{ scale: 0.85, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.85, opacity: 0, y: 40 }}
          transition={{ type: 'spring', stiffness: 260, damping: 22 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400/10 border border-yellow-400/40 flex items-center justify-center text-2xl">
              📞
            </div>
            <div>
              <h3 className="text-game-gold ladder-amount font-bold text-base">Phone a Friend</h3>
              <p className="text-game-textDim text-xs">30 seconds on the clock...</p>
            </div>
          </div>

          {/* Phone-line visual */}
          <PhoneWaveform />

          {/* Typed hint */}
          <div className="mt-4 p-4 bg-game-panelLight/50 rounded-lg border border-game-border/30 min-h-[80px]">
            <p className="text-game-text text-sm leading-relaxed">
              {typedText}
              {!done && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.5, repeat: Infinity }}
                  className="inline-block w-0.5 h-4 bg-game-cyan ml-0.5 align-middle"
                />
              )}
            </p>
          </div>

          {done && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mt-5"
            >
              <button
                onClick={onClose}
                className="px-6 py-2 bg-game-border/30 hover:bg-game-border/50 border border-game-border/60 text-game-text text-sm rounded-lg transition-colors"
              >
                Thanks!
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

function PhoneWaveform() {
  return (
    <div className="flex items-center justify-center gap-1 h-8">
      {Array.from({ length: 24 }).map((_, i) => (
        <motion.div
          key={i}
          animate={{
            scaleY: [0.2, 1, 0.2],
            opacity: [0.3, 1, 0.3],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
          className="w-1 bg-game-cyan rounded-full"
          style={{ height: `${8 + Math.sin(i * 0.8) * 8}px` }}
        />
      ))}
    </div>
  );
}
