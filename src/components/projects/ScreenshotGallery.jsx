import { useState } from 'react';
import { motion } from 'framer-motion';
import Lightbox from './Lightbox';

export default function ScreenshotGallery({ screenshots = [] }) {
  const [lightboxIndex, setLightboxIndex] = useState(null);

  if (!screenshots.length) return null;

  const sorted = [...screenshots].sort((a, b) => a.order - b.order);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4">
        {sorted.map((shot, i) => {
          const imageUrl = typeof shot.image === 'string' ? shot.image : (shot.image?.url || shot.url || shot.src || '');
          return (
            <motion.button
              key={shot._id || i}
              type="button"
              onClick={() => setLightboxIndex(i)}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.45, delay: (i % 6) * 0.05 }}
              className="group block w-full break-inside-avoid overflow-hidden rounded-lg border border-[var(--border)] shadow-card"
            >
              <img
                src={imageUrl}
                alt={shot.altText || shot.title || 'Screenshot'}
                loading="lazy"
                className="w-full transition-transform duration-500 group-hover:scale-105"
              />
              {(shot.title || shot.caption) && (
                <div className="bg-[rgba(249,238,217,0.85)] p-3 text-left">
                  {shot.title && <div className="text-sm font-semibold">{shot.title}</div>}
                  {shot.caption && <div className="text-xs text-text-secondary">{shot.caption}</div>}
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      {lightboxIndex !== null && (
        <Lightbox
          screenshots={sorted}
          startIndex={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
        />
      )}
    </>
  );
}
