import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getKanjiById, getKanjiExamples } from '../services/kanjiService';
import ExampleCard from '../components/ExampleCard';
import type { KanjiExample } from '../types';
import { FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

interface ExampleWithContext extends KanjiExample {
  kanjiCharacter: string;
  kanjiMeaning: string;
}

export default function KanjiPracticePage() {
  const navigate = useNavigate();
  const { kanjiId } = useParams<{ kanjiId: string }>();
  const [kanji, setKanji] = useState<{ character: string; meaning: string } | null>(null);
  const [examplesList, setExamplesList] = useState<ExampleWithContext[]>([]);
  const [currentExampleIndex, setCurrentExampleIndex] = useState(0);
  const prevIndexRef = useRef(0);

  useEffect(() => {
    if (kanjiId) {
      const kanjiData = getKanjiById(kanjiId);
      if (kanjiData) {
        setKanji({
          character: kanjiData.character,
          meaning: kanjiData.meaning
        });
        
        // Obtener todos los ejemplos de este kanji
        const examples = getKanjiExamples(kanjiData.character);
        const allExamples: ExampleWithContext[] = examples.map(example => ({
          ...example,
          kanjiCharacter: kanjiData.character,
          kanjiMeaning: kanjiData.meaning
        }));
        setExamplesList(allExamples);
      }
    }
  }, [kanjiId]);

  const handleNextExample = useCallback(() => {
    setCurrentExampleIndex((idx) => (idx < examplesList.length - 1 ? idx + 1 : idx));
  }, [examplesList.length]);

  const handlePreviousExample = useCallback(() => {
    setCurrentExampleIndex((idx) => (idx > 0 ? idx - 1 : idx));
  }, []);

  useEffect(() => {
    // Keyboard navigation
    const handleKeyDown = (event: KeyboardEvent) => {
      switch (event.key) {
        case 'ArrowLeft':
          event.preventDefault();
          handlePreviousExample();
          break;
        case 'ArrowRight':
          event.preventDefault();
          handleNextExample();
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
  }, [currentExampleIndex, examplesList.length, navigate, handleNextExample, handlePreviousExample]);

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
          handlePreviousExample();
        } else {
          // Swipe left - go to next
          handleNextExample();
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
  }, [currentExampleIndex, examplesList.length, handleNextExample, handlePreviousExample]);

  // Compute direction based on index change (captured per render)
  const direction: 1 | -1 = currentExampleIndex >= prevIndexRef.current ? 1 : -1;
  useEffect(() => {
    prevIndexRef.current = currentExampleIndex;
  }, [currentExampleIndex]);

  // Variants with direction
  const slideVariants = {
    enter: (dir: 1 | -1) => ({ opacity: 0, x: 100 * dir, scale: 0.96 }),
    center: { opacity: 1, x: 0, scale: 1 },
    exit: (dir: 1 | -1) => ({ opacity: 0, x: -100 * dir, scale: 0.96 })
  };

  if (!kanji || examplesList.length === 0) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="bg-white rounded-3xl p-8 shadow-lg border border-gray-100 text-center">
          <FiAlertCircle className="w-10 h-10 mx-auto mb-4 text-slate-600" />
          <h1 className="text-2xl font-bold text-slate-900 mb-2">No hay ejemplos disponibles</h1>
          <p className="text-slate-600 mb-6">Este kanji no tiene ejemplos para practicar</p>
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

  const percent = Math.round(((currentExampleIndex + 1) / examplesList.length) * 100);

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header con degradado y patrón */}
      <div className="relative bg-slate-800 shadow-lg">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>
        </div>

        {/* Contenido del header */}
        <div className="relative">
          {/* Navegación superior */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                    title="Volver al kanji"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      Practicar: {kanji.character}
                    </h1>
                    <p className="text-sm text-white/80">{kanji.meaning}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-white/80">
                    {currentExampleIndex + 1} / {examplesList.length}
                  </div>
                  <div className="w-px h-4 bg-white/20"></div>
                  <div className="text-sm font-medium text-white/80">
                    {percent}%
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso full-width */}
          <div className="h-1 w-full bg-white/10">
            <div 
              className="h-1 bg-teal-500 transition-all duration-300 ease-out"
              style={{ width: `${percent}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Área principal */}
      <div className="relative">
        {/* Fondo con patrón sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        {/* Contenido */}
        <div className="relative max-w-4xl mx-auto px-4 py-6 sm:py-8">
          <div className="relative flex items-center justify-center min-h-[520px] sm:min-h-[620px]">

            {/* Tarjeta de Ejemplo */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentExampleIndex}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                custom={direction}
                transition={{ duration: 0.25, ease: 'easeInOut' }}
                className="w-full flex justify-center"
              >
                <ExampleCard
                  example={examplesList[currentExampleIndex]}
                  kanjiCharacter={examplesList[currentExampleIndex].kanjiCharacter}
                  kanjiMeaning={examplesList[currentExampleIndex].kanjiMeaning}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controles inferiores */}
          <div className="mt-6 flex justify-center">
            <div className="bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-gray-100">
              <div className="px-4 py-3 flex items-center gap-6 text-xs sm:text-sm text-slate-600">
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono text-xs">←</kbd>
                  <span>Anterior</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono text-xs">→</kbd>
                  <span>Siguiente</span>
                </div>
                <div className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-slate-100 rounded-lg text-slate-700 font-mono text-xs">espacio</kbd>
                  <span>Ver traducción</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

