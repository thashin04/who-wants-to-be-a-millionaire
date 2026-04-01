import { motion, AnimatePresence } from 'framer-motion';

/**
 * Decorative full-screen webcam background.
 * The camera feed sits at z-index 0; a blur+tint overlay at z-index 1 keeps
 * the game UI readable. The game content layer (z-index 2) renders on top.
 *
 * Props:
 *   videoRef      — React ref forwarded to <video> (from useWebcam)
 *   cameraStatus  — 'idle' | 'requesting' | 'active' | 'denied' | 'error' | 'stopped'
 *   onEnable      — () => void
 *   onDisable     — () => void
 */
export default function CameraBackground({ videoRef, cameraStatus, onEnable, onDisable }) {
  const isActive = cameraStatus === 'active';
  const isBusy   = cameraStatus === 'requesting';
  const hasError = cameraStatus === 'denied' || cameraStatus === 'error';

  return (
    <>
      {/* Video element — always mounted so ref is always valid */}
      <video
        ref={videoRef}
        className="camera-bg-video"
        autoPlay
        muted
        playsInline
        style={{ display: isActive ? 'block' : 'none' }}
        aria-hidden="true"
      />

      {/* Blur + tint overlay — only shown when camera is active */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            key="cam-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            className="camera-bg-overlay"
          />
        )}
      </AnimatePresence>

      {/* Camera toggle — fixed bottom-right, above game UI */}
      <div
        className="flex items-center gap-2"
        style={{ position: 'fixed', bottom: '1rem', right: '1rem', zIndex: 10 }}
      >
        {hasError && (
          <span className="text-xs bg-black/70 px-2 py-1 rounded"
            style={{ color: '#FF6680' }}>
            {cameraStatus === 'denied' ? 'Camera permission denied' : 'Camera unavailable'}
          </span>
        )}

        <motion.button
          whileHover={!hasError ? { scale: 1.08 } : {}}
          whileTap={!hasError ? { scale: 0.93 } : {}}
          onClick={isActive ? onDisable : onEnable}
          disabled={isBusy || hasError}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all"
          style={{
            background: isActive ? 'rgba(255,23,68,0.15)'   : 'rgba(0,170,255,0.12)',
            border:     isActive ? '1px solid rgba(255,23,68,0.5)' : '1px solid rgba(0,170,255,0.45)',
            color:      isActive ? '#FF6680' : '#00CCFF',
            opacity:    (isBusy || hasError) ? 0.4 : 1,
            cursor:     (isBusy || hasError) ? 'not-allowed' : 'pointer',
          }}
        >
          <span>{isActive ? '⏹' : '📷'}</span>
          <span>
            {isBusy    ? 'Starting…'
             : isActive ? 'Disable Camera'
             : 'Enable Camera'}
          </span>
        </motion.button>
      </div>
    </>
  );
}
