import { motion } from 'framer-motion';

function formatMoney(n) {
  return '$' + n.toLocaleString('en-US');
}

export default function EndScreen({ phase, wonAmount, onPlayAgain }) {
  const isWinner  = phase === 'won';
  const isWalkAway = phase === 'walkaway';
  const isLost    = phase === 'wrong';

  return (
    <motion.div
      className="flex flex-col items-center justify-center h-full text-center px-8 select-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {isWinner && <Confetti />}

      {/* Icon */}
      <motion.div
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
        className="text-7xl xl:text-8xl mb-6"
      >
        {isWinner ? '🏆' : isWalkAway ? '💼' : '💔'}
      </motion.div>

      {/* Headline */}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className={`ladder-amount text-3xl xl:text-4xl font-black mb-2 ${
          isWinner ? 'million-glow text-game-gold' :
          isWalkAway ? 'text-yellow-300 title-glow' :
          'text-game-wrong'
        }`}
      >
        {isWinner
          ? 'YOU ARE A MILLIONAIRE!'
          : isWalkAway
            ? 'You Walked Away!'
            : 'Unlucky!'}
      </motion.h2>

      {/* Sub-headline */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7 }}
        className="text-game-textDim text-base mb-6"
      >
        {isWinner
          ? 'Congratulations — you answered all 15 questions correctly!'
          : isWalkAway
            ? "You've taken your winnings home."
            : "Don't worry — the safety net caught you!"}
      </motion.p>

      {/* Prize amount */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.9, type: 'spring', stiffness: 180 }}
        className="mb-10"
      >
        <p className="text-game-textDim text-sm mb-1 tracking-widest uppercase">You go home with</p>
        <p
          className={`ladder-amount font-black leading-none ${
            isWinner
              ? 'text-5xl xl:text-6xl million-glow text-game-gold'
              : 'text-4xl xl:text-5xl text-white'
          }`}
        >
          {formatMoney(wonAmount)}
        </p>
      </motion.div>

      <motion.button
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.95 }}
        onClick={onPlayAgain}
        className="px-10 py-3 rounded-full font-bold text-base text-black"
        style={{
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
          boxShadow: '0 0 24px rgba(255,215,0,0.4)',
        }}
      >
        Play Again
      </motion.button>
    </motion.div>
  );
}

/** Simple CSS-only confetti burst */
function Confetti() {
  const particles = Array.from({ length: 30 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((_, i) => (
        <motion.div
          key={i}
          initial={{
            x: '50vw',
            y: '50vh',
            scale: 0,
            opacity: 1,
          }}
          animate={{
            x: `${10 + Math.random() * 80}vw`,
            y: `${10 + Math.random() * 80}vh`,
            scale: Math.random() * 1.2 + 0.4,
            opacity: 0,
            rotate: Math.random() * 720 - 360,
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            delay: Math.random() * 0.8,
            ease: 'easeOut',
          }}
          className="absolute w-3 h-3 rounded-sm"
          style={{
            background: ['#FFD700', '#FF8C00', '#00E676', '#00BFFF', '#FF1744', '#C0A0FF'][i % 6],
          }}
        />
      ))}
    </div>
  );
}
