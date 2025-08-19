import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKanjiById, getKanjiExamples } from '../services/kanjiService';
import type { Kanji, KanjiExample } from '../types';

export default function KanjiDetailPage() {
  const navigate = useNavigate();
  const { kanjiId } = useParams<{ kanjiId: string }>();
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [examples, setExamples] = useState<KanjiExample[]>([]);

  useEffect(() => {
    if (kanjiId) {
      const kanjiData = getKanjiById(kanjiId);
      if (kanjiData) {
        setKanji(kanjiData);
        const kanjiExamples = getKanjiExamples(kanjiData.character);
        setExamples(kanjiExamples);
      }
    }
  }, [kanjiId]);

  if (!kanji) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Kanji no encontrado</h1>
          <p className="text-gray-600 mb-6">El kanji que buscas no existe</p>
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

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'intermediate':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'advanced':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getJLPTLevelColor = (level: string) => {
    switch (level) {
      case 'N5':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'N4':
        return 'bg-green-100 text-green-800 border-green-300';
      case 'N3':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'N2':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'N1':
        return 'bg-red-100 text-red-800 border-red-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header con botón de back */}
      <div className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center">
            <button
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center text-gray-600 hover:text-gray-800 transition-colors mr-4"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h1 className="text-xl font-bold text-gray-800">Detalles del Kanji</h1>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header del Kanji */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-3xl flex items-center justify-center border-2 border-blue-300 shadow-lg">
              <span className="text-5xl sm:text-6xl lg:text-7xl font-bold text-blue-700">{kanji.character}</span>
            </div>
            <div className="text-center sm:text-left">
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">{kanji.meaning}</h2>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(kanji.difficulty)}`}>
                  {kanji.difficulty === 'beginner' ? 'Principiante' : kanji.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getJLPTLevelColor(kanji.jlptLevel)}`}>
                  {kanji.jlptLevel}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Lecturas */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
              </svg>
            </span>
            Lecturas
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 border border-blue-200">
              <h4 className="font-bold text-blue-800 mb-3 flex items-center">
                <span className="mr-2">音</span>
                Onyomi
              </h4>
              <div className="space-y-3">
                {kanji.readings.onyomi.map((reading, idx) => (
                  <div key={idx} className="bg-white/80 px-4 py-3 rounded-xl border border-blue-200 shadow-sm">
                    <span className="font-mono text-xl font-bold text-blue-700">{reading}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
              <h4 className="font-bold text-green-800 mb-3 flex items-center">
                <span className="mr-2">訓</span>
                Kunyomi
              </h4>
              <div className="space-y-3">
                {kanji.readings.kunyomi.map((reading, idx) => (
                  <div key={idx} className="bg-white/80 px-4 py-3 rounded-xl border border-green-200 shadow-sm">
                    <span className="font-mono text-xl font-bold text-green-700">{reading}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Ejemplos */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </span>
            Ejemplos de Uso
          </h3>
          <div className="space-y-4">
            {examples.map((example, idx) => (
              <div key={idx} className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-5 border border-gray-200 shadow-sm">
                <div className="text-xl font-bold text-gray-800 mb-3 text-center">{example.japanese}</div>
                <div className="bg-white/80 rounded-xl p-3 mb-2">
                  <div className="text-sm text-gray-500 mb-1">Romaji:</div>
                  <div className="font-mono text-lg text-gray-700">{example.romaji}</div>
                </div>
                <div className="bg-white/80 rounded-xl p-3">
                  <div className="text-sm text-gray-500 mb-1">English:</div>
                  <div className="text-lg text-gray-800">{example.english}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Información Adicional */}
        <div className="bg-white rounded-3xl p-6 mb-6 shadow-sm border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-4 flex items-center">
            <span className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            Información Adicional
          </h3>
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-4 text-center border border-blue-200">
              <div className="text-3xl font-bold text-blue-700 mb-1">{kanji.strokeCount}</div>
              <div className="text-sm text-blue-600 font-medium">Trazos</div>
            </div>
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 text-center border border-green-200">
              <div className="text-3xl font-bold text-green-700 mb-1">{kanji.frequency}</div>
              <div className="text-sm text-green-600 font-medium">Frecuencia</div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 text-center border border-purple-200">
              <div className="text-3xl font-bold text-purple-700 mb-1">{kanji.grade}</div>
              <div className="text-sm text-purple-600 font-medium">Grado</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
