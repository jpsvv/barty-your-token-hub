import { useCallback, useRef, useEffect } from "react";

// Sound frequencies for different notifications
const FREQUENCIES = {
  newOrder: [523.25, 659.25, 783.99], // C5, E5, G5 - pleasant chord
  ready: [783.99, 659.25], // G5, E5 - descending
  alert: [440, 550, 440], // A4, C#5, A4 - attention
};

export const useProductionSound = () => {
  const audioContextRef = useRef<AudioContext | null>(null);
  const isEnabledRef = useRef(true);

  useEffect(() => {
    // Initialize AudioContext on first user interaction
    const initAudio = () => {
      if (!audioContextRef.current) {
        audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      }
    };

    document.addEventListener("click", initAudio, { once: true });
    return () => document.removeEventListener("click", initAudio);
  }, []);

  const playTone = useCallback((frequency: number, duration: number, startTime: number) => {
    const ctx = audioContextRef.current;
    if (!ctx) return;

    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.3, startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }, []);

  const playSound = useCallback(
    (type: "newOrder" | "ready" | "alert") => {
      if (!isEnabledRef.current || !audioContextRef.current) return;

      const ctx = audioContextRef.current;
      const frequencies = FREQUENCIES[type];
      const now = ctx.currentTime;

      frequencies.forEach((freq, index) => {
        playTone(freq, 0.3, now + index * 0.15);
      });
    },
    [playTone]
  );

  const playNewOrderSound = useCallback(() => {
    playSound("newOrder");
  }, [playSound]);

  const playReadySound = useCallback(() => {
    playSound("ready");
  }, [playSound]);

  const playAlertSound = useCallback(() => {
    playSound("alert");
  }, [playSound]);

  const toggleSound = useCallback(() => {
    isEnabledRef.current = !isEnabledRef.current;
    return isEnabledRef.current;
  }, []);

  const isSoundEnabled = useCallback(() => {
    return isEnabledRef.current;
  }, []);

  return {
    playNewOrderSound,
    playReadySound,
    playAlertSound,
    toggleSound,
    isSoundEnabled,
  };
};

export default useProductionSound;
