import { motion } from 'framer-motion';

export default function StartScreen({ onStart }) {

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-8 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* ── Circular rotating rings ──────────────────────────────────── */}
      <div className="relative mb-10">
        {[160, 220, 280].map((size, i) => (
          <motion.div
            key={size}
            animate={{ rotate: i % 2 === 0 ? 360 : -360, opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 12 + i * 4, repeat: Infinity, ease: 'linear' }}
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              borderColor: 'rgba(0,170,255,0.25)',
            }}
          />
        ))}

        {/* ── Official WWTBAM Logo ───────────────────────────────────── */}
        <div className="relative z-10 flex items-center justify-center">
          <img
            src="/image/WWTBAMUS2020Logo.png"
            alt="Who Wants to Be a Millionaire"
            style={{
              width: 260,
              height: 'auto',
              filter: 'drop-shadow(0 0 24px rgba(0,170,255,0.5)) drop-shadow(0 0 48px rgba(0,100,255,0.2))',
            }}
          />
        </div>
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
        className="text-game-textDim text-sm mb-1 max-w-xs"
      >
        10 questions · 3 lifelines · $1,000,000 prize
      </motion.p>


      {/* ── Play button ──────────────────────────────────────────────── */}
      <motion.button
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.1, type: 'spring', stiffness: 200 }}
        whileHover={{ scale: 1.07 }}
        whileTap={{ scale: 0.95 }}
        onClick={onStart}
        className="px-12 py-4 rounded-full mt-10 font-bold text-lg text-black tracking-wide mb-6"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          boxShadow: '0 0 30px rgba(255,215,0,0.5), 0 4px 20px rgba(255,140,0,0.4)',
        }}
      >
        Play Now
      </motion.button>
    </motion.div>
  );
}
