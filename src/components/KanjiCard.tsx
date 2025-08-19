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
      className="w-full max-w-sm sm:max-w-md mx-auto"
      style={{ perspective: '1000px', height: '400px', minHeight: '400px' }}
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
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-blue-200 shadow-inner">
              <span className="text-7xl sm:text-8xl font-bold text-gray-800">{kanji.character}</span>
            </div>
            <p className="text-sm text-gray-500 text-center">Toca para ver detalles</p>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full bg-gradient-to-br from-white to-gray-50 rounded-3xl shadow-lg border border-gray-100 p-6 overflow-y-auto"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col h-full">
            <div className="text-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800 mb-3">{kanji.meaning}</h3>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
                <h4 className="font-bold text-blue-800 mb-3 text-center">Onyomi</h4>
                <div className="space-y-2">
                  {kanji.readings.onyomi.map((reading, idx) => (
                    <div key={idx} className="bg-white/80 px-3 py-2 rounded-xl border border-blue-200 text-center">
                      <span className="font-mono text-lg font-bold text-blue-700">{reading}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                <h4 className="font-bold text-green-800 mb-3 text-center">Kunyomi</h4>
                <div className="space-y-2">
                  {kanji.readings.kunyomi.map((reading, idx) => (
                    <div key={idx} className="bg-white/80 px-3 py-2 rounded-xl border border-green-200 text-center">
                      <span className="font-mono text-lg font-bold text-green-700">{reading}</span>
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
