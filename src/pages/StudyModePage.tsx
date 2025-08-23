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
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-2xl border border-white/50 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Lección no encontrada</h1>
          <p className="text-gray-600 mb-6">La lección que buscas no existe</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Volver
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Floating orbs */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-purple-200/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-indigo-200/40 to-pink-200/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-20 left-20 w-40 h-40 bg-gradient-to-br from-purple-200/30 to-blue-200/30 rounded-full blur-3xl animate-pulse delay-2000"></div>
        <div className="absolute bottom-40 right-10 w-28 h-28 bg-gradient-to-br from-pink-200/40 to-indigo-200/40 rounded-full blur-3xl animate-pulse delay-1500"></div>
      </div>

      {/* Header con botón de back */}
      <div className="relative z-10 bg-white/80 backdrop-blur-md shadow-lg border-b border-white/50">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => navigate(-1)}
                className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-full flex items-center justify-center text-white transition-all duration-200 shadow-lg hover:shadow-xl mr-4"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Modo Estudio con Tarjetas
                </h1>
                <p className="text-sm text-gray-600">
                  Kanji {currentKanjiIndex + 1} de {kanjiList.length}
                </p>
              </div>
            </div>
            
            {/* Progress indicator */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 border border-white/50 shadow-lg">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span className="text-sm font-medium text-gray-700">
                  {Math.round(((currentKanjiIndex + 1) / kanjiList.length) * 100)}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 py-6">
        <div className="flex justify-center">
          <div className="w-full">
            {/* Enhanced instructions */}
            <div className="text-center mb-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-6 shadow-xl border border-white/50 inline-block">
                <div className="flex items-center justify-center space-x-4 mb-3">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-600 text-white p-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="bg-gradient-to-r from-orange-500 to-red-600 text-white p-2 rounded-xl">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                </div>
                <p className="text-sm text-gray-700 font-medium">
                  Usa las flechas del teclado, desliza o haz clic para navegar
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Espacio para voltear la tarjeta • ESC para salir
                </p>
              </div>
            </div>
            
            <div className="relative flex items-center justify-center min-h-[400px]">
              {/* Left click area for previous - only show if there's a previous kanji */}
              {currentKanjiIndex > 0 && (
                <button
                  onClick={handlePreviousKanji}
                  className="absolute left-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-200 z-10 opacity-0 hover:opacity-100 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-2xl hover:shadow-3xl hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}

              {/* Right click area for next - only show if there's a next kanji */}
              {currentKanjiIndex < kanjiList.length - 1 && (
                <button
                  onClick={handleNextKanji}
                  className="absolute right-0 top-1/2 transform -translate-y-1/2 w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center rounded-full transition-all duration-200 z-10 opacity-0 hover:opacity-100 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white shadow-2xl hover:shadow-3xl hover:scale-110"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              )}

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentKanjiIndex}
                  initial={{ opacity: 0, x: 100, scale: 0.8 }}
                  animate={{ opacity: 1, x: 0, scale: 1 }}
                  exit={{ opacity: 0, x: -100, scale: 0.8 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="w-full flex justify-center"
                >
                  <KanjiCard
                    kanji={kanjiList[currentKanjiIndex]}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Enhanced navigation hints */}
            <div className="text-center mt-8">
              <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-4 shadow-lg border border-white/50 inline-block">
                <div className="flex items-center justify-center space-x-6 text-xs sm:text-sm text-gray-600">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>← Anterior</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                    <span>Siguiente →</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span>Espacio = Voltear</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
