import { useState } from 'react';
import type { KanjiExample } from '../types';

interface ExampleCardProps {
  example: KanjiExample;
  kanjiCharacter: string;
  kanjiMeaning: string;
}

export default function ExampleCard({ example, kanjiCharacter, kanjiMeaning }: ExampleCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const translation = example.spanish || example.english;

  return (
    <div 
      className="w-full max-w-2xl mx-auto cursor-pointer perspective-1000"
      onClick={handleFlip}
    >
      <div className={`relative w-full h-[500px] sm:h-[600px] transition-transform duration-700 transform-style-preserve-3d ${
        isFlipped ? 'rotate-y-180' : ''
      }`}>
        {/* Frente - Ejemplo en japonés */}
        <div className="absolute inset-0 w-full h-full backface-hidden">
          <div className="w-full h-full bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-center items-center text-center">
            {/* Kanji destacado */}
            <div className="mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <span className="text-3xl sm:text-4xl font-bold text-white">{kanjiCharacter}</span>
              </div>
              <p className="text-white/80 text-sm sm:text-base font-medium">{kanjiMeaning}</p>
            </div>
            
            {/* Frase en japonés */}
            <div className="mb-8 sm:mb-10 flex-1 flex flex-col justify-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 leading-relaxed px-2">
                {example.japanese}
              </p>
              <p className="text-white/70 text-base sm:text-lg md:text-xl font-mono">
                {example.romaji}
              </p>
            </div>

            {/* Indicador de dificultad */}
            <div className="flex items-center gap-2 mb-4">
              <div className={`w-2 h-2 rounded-full ${
                example.difficulty === 'beginner' ? 'bg-green-400' :
                example.difficulty === 'intermediate' ? 'bg-yellow-400' : 'bg-red-400'
              }`}></div>
              <span className="text-white/60 text-xs sm:text-sm capitalize">
                {example.difficulty === 'beginner' ? 'Principiante' : 
                 example.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
              </span>
            </div>

            {/* Instrucción */}
            <div className="text-white/50 text-xs sm:text-sm">
              Toca para ver la traducción
            </div>
          </div>
        </div>

        {/* Reverso - Traducción */}
        <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
          <div className="w-full h-full bg-gradient-to-br from-teal-600 to-teal-700 rounded-3xl p-6 sm:p-10 shadow-2xl flex flex-col justify-center items-center text-center">
            {/* Kanji y significado */}
            <div className="mb-8 sm:mb-10">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-2xl flex items-center justify-center mb-3 sm:mb-4 mx-auto">
                <span className="text-3xl sm:text-4xl font-bold text-white">{kanjiCharacter}</span>
              </div>
              <p className="text-white/90 text-base sm:text-lg font-semibold">{kanjiMeaning}</p>
            </div>
            
            {/* Traducción */}
            <div className="mb-8 sm:mb-10 flex-1 flex flex-col justify-center">
              <p className="text-xl sm:text-2xl md:text-3xl font-bold text-white mb-4 sm:mb-5 leading-relaxed px-2">
                {translation}
              </p>
              <p className="text-white/80 text-base sm:text-lg md:text-xl">
                "{example.japanese}"
              </p>
            </div>

            {/* Romaji */}
            <div className="bg-white/10 rounded-xl px-4 sm:px-6 py-2 sm:py-3 mb-4">
              <p className="text-white/90 font-mono text-base sm:text-lg md:text-xl">
                {example.romaji}
              </p>
            </div>

            {/* Instrucción */}
            <div className="text-white/50 text-xs sm:text-sm">
              Toca para volver al ejemplo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
