import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonKanji } from '../services/kanjiService';
import KanjiCard from '../components/KanjiCard';
import type { Kanji } from '../types';
import { FiArrowLeft, FiAlertCircle, FiChevronLeft, FiChevronRight } from 'react-icons/fi';

export default function StudyModePage() {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (lessonId) {
      const kanji = getLessonKanji(lessonId);
      setKanjiList(kanji);
    }
  }, [lessonId]);

  const handleNextKanji = useCallback(() => {
    setCurrentKanjiIndex((idx) => (idx < kanjiList.length - 1 ? idx + 1 : idx));
  }, [kanjiList.length]);

  const handlePreviousKanji = useCallback(() => {
    setCurrentKanjiIndex((idx) => (idx > 0 ? idx - 1 : idx));
  }, []);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousKanji();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextKanji();
          break;
        case 'Escape':
          event.preventDefault();
          navigate(-1);
          break;
        case ' ': {
          event.preventDefault();
          // Trigger card flip by simulating a click on the card
          const card = document.querySelector('.cursor-pointer');
          if (card) {
            (card as HTMLElement).click();
          }
          break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [currentKanjiIndex, kanjiList.length, navigate, handleNextKanji, handlePreviousKanji]);

  // Touch/swipe navigation
  useEffect(() => {
    let startX = 0;
    let startY = 0;
    let isSwiping = false;

    const handleTouchStart = (event: TouchEvent) => {
      startX = event.touches[0].clientX;
      startY = event.touches[0].clientY;
      isSwiping = false;
    };

    const handleTouchMove = (event: TouchEvent) => {
      if (!isSwiping) {
        const deltaX = Math.abs(event.touches[0].clientX - startX);
        const deltaY = Math.abs(event.touches[0].clientY - startY);
        
        // Only start swiping if horizontal movement is greater than vertical
        if (deltaX > deltaY && deltaX > 10) {
          isSwiping = true;
        }
      }
    };

    const handleTouchEnd = (event: TouchEvent) => {
      if (!isSwiping) return;

      const endX = event.changedTouches[0].clientX;
      const deltaX = endX - startX;
      const minSwipeDistance = 50;

      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0) {
          // Swipe right - go to previous
          handlePreviousKanji();
        } else {
          // Swipe left - go to next
          handleNextKanji();
        }
      }
    };

    document.addEventListener('touchstart', handleTouchStart as EventListener);
    document.addEventListener('touchmove', handleTouchMove as EventListener);
    document.addEventListener('touchend', handleTouchEnd as EventListener);

    return () => {
      document.removeEventListener('touchstart', handleTouchStart as EventListener);
      document.removeEventListener('touchmove', handleTouchMove as EventListener);
      document.removeEventListener('touchend', handleTouchEnd as EventListener);
    };
  }, [currentKanjiIndex, kanjiList.length, handleNextKanji, handlePreviousKanji]);

  // Compute direction based on index change (captured per render)
  const direction: 1 | -1 = currentKanjiIndex >= prevIndexRef.current ? 1 : -1;
  useEffect(() => {
    prevIndexRef.current = currentKanjiIndex;
  }, [currentKanjiIndex]);

  // Variants with direction
  const slideVariants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, x: 100 * dir, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: -100 * dir, scale: 0.96 })
  };

  const percent = Math.round(((currentKanjiIndex + 1) / kanjiList.length) * 100);

  if (kanjiList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
          <FiAlertCircle className="w-10 h-10 mx-auto mb-4 text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Lección no encontrada</h1>
          <p className="text-slate-600 mb-6">La lección que buscas no existe</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center min-w-0 gap-3">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-slate-700 hover:bg-slate-800 rounded-full flex items-center justify-center text-white transition-colors flex-shrink-0"
                aria-label="Volver"
              >
                <FiArrowLeft className="w-5 h-5" />
              </button>
              <div className="min-w-0">
                <h1 className="text-base sm:text-xl font-bold text-slate-900 truncate">
                  Modo Estudio con Tarjetas
                </h1>
                <p className="text-xs sm:text-sm text-slate-600">
                  Kanji {currentKanjiIndex + 1} de {kanjiList.length}
                </p>
              </div>
            </div>
            {/* Progress group */}
            <div className="flex items-center gap-2">
              {/* Mobile: combined chip */}
              <div className="sm:hidden bg-slate-50 rounded-2xl px-3 py-2 border border-gray-100 text-slate-700 text-xs font-medium">
                {currentKanjiIndex + 1}/{kanjiList.length} • {percent}%
              </div>
              {/* Desktop: separate chips */}
              <div className="hidden sm:flex items-center gap-2">
                <div className="bg-slate-50 rounded-2xl px-3 py-2 border border-gray-100 text-slate-700 text-sm font-medium">
                  {currentKanjiIndex + 1} / {kanjiList.length}
                </div>
                <div className="bg-slate-50 rounded-2xl px-3 py-2 border border-gray-100 text-slate-700 text-sm font-medium">
                  {percent}%
                </div>
              </div>
            </div>
          </div>
          {/* Progress bar (desktop only) */}
          <div className="hidden sm:block mt-3 w-full h-2 bg-gray-200 rounded-full">
            <div
              className="h-2 bg-teal-600 rounded-full transition-all"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="relative flex items-center justify-center min-h-[460px]">
          {/* Left nav */}
          {currentKanjiIndex > 0 && (
            <button
              onClick={handlePreviousKanji}
              className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full z-10 bg-slate-700 hover:bg-slate-800 text-white shadow"
              aria-label="Anterior"
            >
              <FiChevronLeft className="w-5 h-5" />
            </button>
          )}

          {/* Right nav */}
          {currentKanjiIndex < kanjiList.length - 1 && (
            <button
              onClick={handleNextKanji}
              className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full z-10 bg-slate-700 hover:bg-slate-800 text-white shadow"
              aria-label="Siguiente"
            >
              <FiChevronRight className="w-5 h-5" />
            </button>
          )}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentKanjiIndex}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              custom={direction}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
              className="w-full flex justify-center"
            >
              <KanjiCard
                kanji={kanjiList[currentKanjiIndex]}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Bottom hints */}
        <div className="text-center mt-8">
          <div className="bg-white rounded-2xl p-4 shadow border border-gray-100 inline-block">
            <div className="flex items-center justify-center gap-6 text-xs sm:text-sm text-slate-600">
              <span>← Anterior</span>
              <span>Siguiente →</span>
              <span>Espacio = Voltear</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
