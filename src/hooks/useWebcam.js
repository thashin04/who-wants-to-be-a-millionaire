import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * Manages a webcam MediaStream attached to a <video> element.
 *
 * Status flow:  idle → requesting → active
 *                              ↓         ↓
 *                           denied     stopped
 *                           error
 */
export function useWebcam() {
  const videoRef  = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState('idle');
  const [error,  setError]  = useState(null);

  const startCamera = useCallback(async () => {
    if (status === 'active') return;
    setStatus('requesting');
    setError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: { ideal: 640 }, height: { ideal: 480 }, facingMode: 'user' },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
      setStatus('active');
    } catch (err) {
      setError(err.message ?? 'Camera unavailable');
      setStatus(err.name === 'NotAllowedError' ? 'denied' : 'error');
    }
  }, [status]);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) videoRef.current.srcObject = null;
    setStatus('stopped');
  }, []);

  // Cleanup on unmount
  useEffect(() => () => { stopCamera(); }, []); // eslint-disable-line

  return { videoRef, status, error, startCamera, stopCamera };
}
