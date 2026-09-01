import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const loadingSteps = [
  'Initializing workspace...',
  'Loading projects & modules...',
  'Connecting cloud systems...',
  'Preparing experience...',
];

export default function Preloader({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [stepIndex, setStepIndex] = useState(0);
  const [isDone, setIsDone] = useState(false);
  const [avatar, setAvatar] = useState('');

  useEffect(() => {
    // Load avatar from localStorage cache immediately (no async wait)
    try {
      const cached = localStorage.getItem('portfolio_about_data');
      if (cached) {
        const data = JSON.parse(cached);
        setAvatar(data.avatar || data.heroImage || '');
      }
    } catch (e) {
      // ignore
    }
  }, []);

  useEffect(() => {
    // Progress counter animation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        const diff = Math.floor(Math.random() * 15) + 8;
        return Math.min(prev + diff, 100);
      });
    }, 120);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // Step text ticker
    if (progress < 25) setStepIndex(0);
    else if (progress < 55) setStepIndex(1);
    else if (progress < 85) setStepIndex(2);
    else setStepIndex(3);

    if (progress === 100) {
      const timeout = setTimeout(() => {
        setIsDone(true);
        if (onComplete) onComplete();
      }, 400);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  return (
    <AnimatePresence>
      {!isDone && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            y: -40,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[color:var(--background)] px-6 select-none"
        >
          {/* Subtle background glow effect */}
          <div className="absolute h-72 w-72 rounded-full bg-[var(--tertiary)] opacity-10 blur-[100px] pointer-events-none" />

          {/* Central Card Shell */}
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
            className="shell relative z-10 w-full max-w-sm rounded-3xl p-[2px] shadow-2xl"
          >
            <div className="glass flex flex-col items-center rounded-[22px] px-8 py-10 text-center">
              {/* Avatar / Monogram with Rotating Ring */}
              <div className="relative mb-6 flex h-20 w-20 items-center justify-center">
                {/* Glowing Outer Rotating Dashed Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-0 rounded-full border-2 border-dashed border-[var(--tertiary)] opacity-70"
                />

                {/* Profile Photo or Fallback "B" */}
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Basant"
                    className="h-14 w-14 rounded-full object-cover border-2 border-[var(--tertiary)] shadow-md"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center rounded-full border border-[var(--border)] bg-[rgba(214,112,73,0.12)] font-display text-2xl font-bold text-[color:var(--tertiary)] shadow-inner">
                    B
                  </div>
                )}
              </div>

              {/* Title & Brand */}
              <h2 className="font-display text-2xl font-bold tracking-tight text-[color:var(--text-primary)]">
                Basant<span className="text-[color:var(--tertiary)]">.dev</span>
              </h2>
              <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-[color:var(--text-secondary)]">
                Full-Stack &amp; SaaS Developer
              </p>


              {/* Progress Bar Container */}
              <div className="mt-7 w-full space-y-2">
                <div className="relative h-2 w-full overflow-hidden rounded-full border border-[var(--border)] bg-[rgba(0,0,0,0.06)] dark-mode:bg-[rgba(255,255,255,0.06)]">
                  <motion.div
                    className="h-full rounded-full bg-gradient-to-r from-[var(--secondary)] via-[var(--tertiary)] to-[var(--tertiary)] shadow-glow"
                    style={{ width: `${progress}%` }}
                    transition={{ ease: 'easeOut', duration: 0.2 }}
                  />
                </div>

                {/* Status Ticker & Percentage */}
                <div className="flex items-center justify-between text-xs font-mono font-medium text-[color:var(--text-secondary)] pt-1">
                  <motion.span
                    key={stepIndex}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="truncate max-w-[180px]"
                  >
                    {loadingSteps[stepIndex]}
                  </motion.span>
                  <span className="font-bold text-[color:var(--tertiary)]">{progress}%</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

