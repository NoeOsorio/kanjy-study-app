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
      className="w-full max-w-xs sm:max-w-sm lg:max-w-md mx-auto"
      style={{ perspective: '1000px', height: '320px', minHeight: '320px' }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <motion.div 
        className="relative w-full h-full cursor-pointer focus:outline-none"
        style={{ transformStyle: 'preserve-3d' }}
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ 
          duration: 0.6, 
          ease: [0.4, 0.0, 0.2, 1],
          type: "spring",
          stiffness: 100,
          damping: 15
        }}
        onClick={handleFlip}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        tabIndex={0}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-white via-blue-50 to-indigo-50 rounded-3xl shadow-2xl border-2 border-blue-200/50 p-4 sm:p-6 backdrop-blur-sm"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            {/* Kanji Container with enhanced design */}
            <div className="w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 bg-gradient-to-br from-blue-400 via-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-4 sm:mb-6 shadow-2xl border-4 border-white/90 relative overflow-hidden">
              {/* Subtle pattern overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl"></div>
              {/* Main kanji character */}
              <span className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white drop-shadow-lg relative z-10">
                {kanji.character}
              </span>
            </div>
            
            {/* Instruction text with better contrast */}
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 border border-blue-200/50 shadow-lg">
              <p className="text-xs sm:text-sm text-blue-800 font-medium text-center">
                Toca para ver detalles
              </p>
            </div>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-white via-purple-50 to-pink-50 rounded-3xl shadow-2xl border-2 border-purple-200/50 p-4 sm:p-6 overflow-y-auto backdrop-blur-sm"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col h-full">
            {/* Meaning section with enhanced design */}
            <div className="text-center mb-4 sm:mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-2xl shadow-lg mb-3">
                <h3 className="text-lg sm:text-xl lg:text-2xl font-bold drop-shadow-sm">
                  {kanji.meaning}
                </h3>
              </div>
            </div>
            
            {/* Readings grid with enhanced colors and shadows */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4 sm:mb-6">
              {/* Onyomi section */}
              <div className="bg-gradient-to-br from-blue-400 via-blue-500 to-blue-600 rounded-2xl p-3 sm:p-4 shadow-xl border-2 border-blue-300/50">
                <h4 className="font-bold text-white mb-2 sm:mb-3 text-center text-sm sm:text-base drop-shadow-sm">
                  Onyomi
                </h4>
                <div className="space-y-1 sm:space-y-2">
                  {kanji.readings.onyomi.map((reading, idx) => (
                    <div key={idx} className="bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-blue-200/50 text-center shadow-md">
                      <span className="font-mono text-sm sm:text-lg font-bold text-blue-800">
                        {reading}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Kunyomi section */}
              <div className="bg-gradient-to-br from-emerald-400 via-emerald-500 to-emerald-600 rounded-2xl p-3 sm:p-4 shadow-xl border-2 border-emerald-300/50">
                <h4 className="font-bold text-white mb-2 sm:mb-3 text-center text-sm sm:text-base drop-shadow-sm">
                  Kunyomi
                </h4>
                <div className="space-y-1 sm:space-y-2">
                  {kanji.readings.kunyomi.map((reading, idx) => (
                    <div key={idx} className="bg-white/95 backdrop-blur-sm px-2 sm:px-3 py-1 sm:py-2 rounded-xl border border-emerald-200/50 text-center shadow-md">
                      <span className="font-mono text-sm sm:text-lg font-bold text-emerald-800">
                        {reading}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
