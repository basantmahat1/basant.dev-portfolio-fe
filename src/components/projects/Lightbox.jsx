import { useCallback, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { FaTimes, FaChevronLeft, FaChevronRight, FaSearchPlus, FaSearchMinus } from 'react-icons/fa';

export default function Lightbox({ screenshots, startIndex, onClose }) {
  const [index, setIndex] = useState(startIndex);
  const [zoomed, setZoomed] = useState(false);

  const goNext = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i + 1) % screenshots.length);
  }, [screenshots.length]);

  const goPrev = useCallback(() => {
    setZoomed(false);
    setIndex((i) => (i - 1 + screenshots.length) % screenshots.length);
  }, [screenshots.length]);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [goNext, goPrev, onClose]);

  const current = screenshots[index];

  return (
    <AnimatePresence>
      <motion.div
        className="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Close"
        >
          <FaTimes />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoomed((z) => !z);
          }}
          className="absolute left-6 top-6 z-10 grid h-10 w-10 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
          aria-label="Toggle zoom"
        >
          {zoomed ? <FaSearchMinus /> : <FaSearchPlus />}
        </button>

        {screenshots.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goPrev();
              }}
              className="absolute left-4 top-1/2 z-10 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Previous image"
            >
              <FaChevronLeft />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goNext();
              }}
              className="absolute right-4 top-1/2 z-10 -translate-y-1/2 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"
              aria-label="Next image"
            >
              <FaChevronRight />
            </button>
          </>
        )}

        <motion.div
          key={current._id || index}
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          transition={{ duration: 0.25 }}
          className="flex max-h-[85vh] max-w-[90vw] flex-col items-center"
          onClick={(e) => e.stopPropagation()}
        >
          <img
            src={typeof current.image === 'string' ? current.image : (current.image?.url || current.url || current.src || '')}
            alt={current.altText || current.title || 'Project screenshot'}
            className={`max-h-[75vh] rounded-lg object-contain transition-transform duration-300 ${
              zoomed ? 'scale-150 cursor-zoom-out' : 'cursor-zoom-in'
            }`}
            onClick={() => setZoomed((z) => !z)}
          />
          {(current.title || current.caption) && (
            <div className="mt-4 max-w-lg text-center text-white/90">
              {current.title && <div className="font-display text-lg">{current.title}</div>}
              {current.caption && <p className="mt-1 text-sm text-white/70">{current.caption}</p>}
            </div>
          )}
          <div className="mt-2 text-xs text-white/50">
            {index + 1} / {screenshots.length}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
