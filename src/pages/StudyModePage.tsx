import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getLessonKanji } from '../services/kanjiService';
import KanjiCard from '../components/KanjiCard';
import type { Kanji } from '../types';

export default function StudyModePage() {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);
  const [currentKanjiIndex, setCurrentKanjiIndex] = useState(0);

  useEffect(() => {
    if (lessonId) {
      const kanji = getLessonKanji(lessonId);
      setKanjiList(kanji);
    }
  }, [lessonId]);

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
  }, [currentKanjiIndex, kanjiList.length, navigate]);

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
  }, [currentKanjiIndex, kanjiList.length]);

  const handleNextKanji = () => {
    if (currentKanjiIndex < kanjiList.length - 1) {
      setCurrentKanjiIndex(currentKanjiIndex + 1);
    }
  };

  const handlePreviousKanji = () => {
    if (currentKanjiIndex > 0) {
      setCurrentKanjiIndex(currentKanjiIndex - 1);
    }
  };

  if (kanjiList.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lección no encontrada</h1>
          <p className="text-gray-600 mb-6">La lección que buscas no existe</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de back */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold text-gray-800">Modo Estudio con Tarjetas</h1>
                <p className="text-sm text-gray-600">
                  Kanji {currentKanjiIndex + 1} de {kanjiList.length}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="w-full">
            <div className="text-center mb-6">
              <p className="text-sm text-gray-500 mb-2">
                Usa las flechas del teclado o haz clic en los lados para navegar
              </p>
              <p className="text-sm text-gray-400">
                Espacio para voltear la tarjeta
              </p>
            </div>
            
            <div className="relative flex items-center justify-center min-h-[400px]">
              {/* Left click area for previous - only show if there's a previous kanji */}
              {currentKanjiIndex > 0 && (
                <button
                  onClick={handlePreviousKanji}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-200 z-10 opacity-0 hover:opacity-100 bg-white/80 hover:bg-white shadow-lg"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right click area for next - only show if there's a next kanji */}
              {currentKanjiIndex < kanjiList.length - 1 && (
                <button
                  onClick={handleNextKanji}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-200 z-10 opacity-0 hover:opacity-100 bg-white/80 hover:bg-white shadow-lg"
                >
                  <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentKanjiIndex}
                  initial={{ opacity: 0, x: 100 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                  className="w-full flex justify-center"
                >
                  <KanjiCard
                    kanji={kanjiList[currentKanjiIndex]}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Navigation hints */}
            <div className="text-center mt-6">
              <p className="text-xs sm:text-sm text-gray-400">
                ← Flecha izquierda • Flecha derecha → • ESC para cerrar
              </p>
              <p className="text-xs sm:text-sm text-gray-400 mt-1">
                Desliza ← → para navegar • Espacio para voltear la tarjeta
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
