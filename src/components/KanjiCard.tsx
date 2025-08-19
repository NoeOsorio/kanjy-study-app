import { useState } from 'react';
import type { Kanji } from '../types';

interface KanjiCardProps {
  kanji: Kanji;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function KanjiCard({ kanji, onNext, onPrevious }: KanjiCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div 
      className="w-full max-w-md mx-auto"
      style={{ perspective: '1000px', height: '400px' }}
    >
      <div 
        className={`relative w-full h-full transition-transform duration-500 cursor-pointer`}
        style={{ 
          transformStyle: 'preserve-3d',
          transform: isFlipped ? 'rotateY(180deg)' : ''
        }}
        onClick={handleFlip}
      >
        {/* Front of card */}
        <div 
          className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6"
          style={{ backfaceVisibility: 'hidden' }}
        >
          <div className="flex flex-col items-center justify-center h-full">
            <span className="text-8xl mb-4">{kanji.character}</span>
            <p className="text-gray-500 text-sm">Toca para ver detalles</p>
          </div>
        </div>

        {/* Back of card */}
        <div 
          className="absolute w-full h-full bg-white rounded-xl shadow-lg p-6"
          style={{ 
            backfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)'
          }}
        >
          <div className="flex flex-col h-full">
            <div className="text-center mb-4">
              <h3 className="text-2xl font-bold mb-2">Significado</h3>
              <p className="text-xl">{kanji.meaning}</p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="text-center">
                <h4 className="font-semibold mb-1">Onyomi</h4>
                <p>{kanji.readings.onyomi.join(', ')}</p>
              </div>
              <div className="text-center">
                <h4 className="font-semibold mb-1">Kunyomi</h4>
                <p>{kanji.readings.kunyomi.join(', ')}</p>
              </div>
            </div>

            <div className="flex-grow">
              <h4 className="font-semibold mb-2">Ejemplos:</h4>
              <ul className="space-y-2">
                {kanji.examples.map((example, index) => (
                  <li key={index} className="text-sm">
                    <span className="font-medium">{example}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <button
          onClick={onPrevious}
          disabled={!onPrevious}
          className={`px-4 py-2 rounded-lg ${
            onPrevious
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Anterior
        </button>
        <button
          onClick={onNext}
          disabled={!onNext}
          className={`px-4 py-2 rounded-lg ${
            onNext
              ? 'bg-purple-600 text-white hover:bg-purple-700'
              : 'bg-gray-200 text-gray-400 cursor-not-allowed'
          }`}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
