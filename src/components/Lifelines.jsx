import { motion } from 'framer-motion';

const LIFELINE_META = [
  {
    key: 'fiftyFifty',
    label: '50:50',
    icon: '½',
    description: 'Remove two wrong answers',
    action: 'useFiftyFifty',
    color: 'text-game-cyan',
    borderColor: 'border-game-cyan/50',
    glowColor: 'rgba(0,191,255,0.4)',
  },
  {
    key: 'phoneAFriend',
    label: 'Phone a Friend',
    icon: '📞',
    description: 'Get a hint from a friend',
    action: 'usePhoneAFriend',
    color: 'text-yellow-300',
    borderColor: 'border-yellow-400/50',
    glowColor: 'rgba(253,224,71,0.4)',
  },
  {
    key: 'askAudience',
    label: 'Ask the Audience',
    icon: '👥',
    description: 'See what the audience thinks',
    action: 'useAskAudience',
    color: 'text-purple-300',
    borderColor: 'border-purple-400/50',
    glowColor: 'rgba(192,132,252,0.4)',
  },
];

export default function Lifelines({
  lifelines,
  phase,
  useFiftyFifty,
  usePhoneAFriend,
  useAskAudience,
  walkAway,
}) {
  const isActive = phase === 'question';

  const handlers = { useFiftyFifty, usePhoneAFriend, useAskAudience };

  return (
    <motion.div
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="flex items-center justify-between w-full px-2 mb-4"
    >
      {/* Lifeline buttons */}
      <div className="flex items-center gap-3">
        {LIFELINE_META.map((ll) => {
          const used = lifelines[ll.key];
          return (
            <motion.button
              key={ll.key}
              onClick={() => !used && isActive && handlers[ll.action]?.()}
              disabled={used || !isActive}
              whileHover={!used && isActive ? { scale: 1.08 } : {}}
              whileTap={!used && isActive ? { scale: 0.94 } : {}}
              title={ll.description}
              className={[
                'lifeline-btn relative flex flex-col items-center justify-center',
                'w-20 h-16 xl:w-24 xl:h-18 rounded-lg px-2 py-2',
                'll.borderColor',
              ].join(' ')}
              style={{
                borderColor: used ? 'rgba(42,92,212,0.2)' : undefined,
              }}
            >
              {used && (
                <div className="absolute inset-0 rounded-lg bg-black/50 flex items-center justify-center z-10">
                  <span className="text-game-textDim/40 text-2xl font-bold">✗</span>
                </div>
              )}
              <span className="text-2xl leading-none mb-0.5">{ll.icon}</span>
              <span
                className={`text-[10px] font-semibold leading-tight text-center ${
                  used ? 'text-game-textDim/30' : ll.color
                }`}
              >
                {ll.label}
              </span>
            </motion.button>
          );
        })}
      </div>

      {/* Walk Away button */}
      {isActive && (
        <motion.button
          onClick={walkAway}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="lifeline-btn px-4 py-3 rounded-lg border border-red-800/50 text-red-400 text-sm font-semibold hover:border-red-500/70 hover:text-red-300 transition-colors"
        >
          Walk Away
        </motion.button>
      )}
    </motion.div>
  );
}
