import { useState } from 'react';
import { motion } from 'framer-motion';
import type { Kanji } from '../types';

interface KanjiCardProps {
  kanji: Kanji;
}

export default function KanjiCard({ kanji }: KanjiCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <motion.div 
      className="w-full max-w-sm sm:max-w-md lg:max-w-lg mx-auto"
      style={{ perspective: '1000px', height: '420px', minHeight: '420px' }}
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.98 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <motion.div 
        className="relative w-full h-full cursor-pointer focus:outline-none"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        onClick={handleFlip}
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        tabIndex={0}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full bg-white rounded-3xl shadow-lg border border-gray-100 p-5"
          style={{ backfaceVisibility: 'hidden' }}
        >
          {/* Chips top-right */}
          <div className="absolute top-4 right-4 flex items-center gap-2">
            <span className="text-[10px] leading-none px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-gray-100 font-medium">
              {kanji.jlptLevel}
            </span>
            <span className="text-[10px] leading-none px-2 py-1 rounded-full bg-slate-100 text-slate-700 border border-gray-100 font-medium">
              {kanji.strokeCount} trazos
            </span>
          </div>

          <div className="flex flex-col items-center justify-center h-full">
            {/* Kanji Container */}
            <div className="w-36 h-36 sm:w-44 sm:h-44 lg:w-56 lg:h-56 bg-slate-700 rounded-3xl flex items-center justify-center mb-5 shadow-md">
              <span className="text-7xl sm:text-8xl lg:text-9xl font-bold text-white kanji-text">
                {kanji.character}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">Toca para ver detalles</p>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden"
          style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
        >
          {/* Top section with meaning and kanji */}
          <div className="relative h-1/3 bg-slate-700 flex items-center justify-center px-6 py-8">
            {/* Background kanji */}
            <div className="absolute inset-0 flex items-center justify-center opacity-10">
              <span className="text-[180px] text-white font-bold kanji-text">
                {kanji.character}
              </span>
            </div>
            {/* Meaning */}
            <div className="relative text-center">
              <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                {kanji.meaning}
              </h3>
              <span className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white/90 kanji-text">
                {kanji.character}
              </span>
            </div>
          </div>

          {/* Readings section */}
          <div className="h-2/3 p-6">
            <div className="grid grid-cols-2 h-full gap-4">
              {/* Onyomi */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-slate-800 kanji-text">音</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Onyomi</h4>
                    <p className="text-[10px] text-slate-400">Lectura china</p>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex flex-wrap gap-2 content-center justify-center h-full">
                    {kanji.readings.onyomi.map((reading, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute inset-0 bg-slate-700 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm text-base sm:text-lg font-bold text-slate-700 group-hover:text-white kanji-text transition-colors">
                          {reading}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Kunyomi */}
              <div className="flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-slate-800 kanji-text">訓</span>
                  <div>
                    <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Kunyomi</h4>
                    <p className="text-[10px] text-slate-400">Lectura japonesa</p>
                  </div>
                </div>
                <div className="flex-1 bg-slate-50 rounded-2xl p-4 border border-gray-100 shadow-sm">
                  <div className="flex flex-wrap gap-2 content-center justify-center h-full">
                    {kanji.readings.kunyomi.map((reading, idx) => (
                      <div key={idx} className="relative group">
                        <div className="absolute inset-0 bg-teal-600 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <span className="relative px-3 py-1.5 rounded-xl bg-white border border-gray-200 shadow-sm text-base sm:text-lg font-bold text-slate-700 group-hover:text-white kanji-text transition-colors">
                          {reading}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}