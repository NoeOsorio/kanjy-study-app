import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getKanjiById, getKanjiExamples } from '../services/kanjiService';
import type { Kanji, KanjiExample } from '../types';
import { FiArrowLeft, FiCopy, FiVolume2, FiPlay, FiBookmark } from 'react-icons/fi';
import KanjiCanvas from '../components/KanjiCanvas';

export default function KanjiDetailPage() {
  const navigate = useNavigate();
  const { kanjiId } = useParams<{ kanjiId: string }>();
  const [kanji, setKanji] = useState<Kanji | null>(null);
  const [examples, setExamples] = useState<KanjiExample[]>([]);
  const [activeReadingTab, setActiveReadingTab] = useState<'onyomi' | 'kunyomi'>('onyomi');

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
      <div className="min-h-screen bg-slate-100 flex items-center justify-center">
        <div className="text-center">
          <svg className="w-10 h-10 mx-auto mb-4 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Kanji no encontrado</h1>
          <p className="text-slate-600 mb-6">El kanji que buscas no existe</p>
          <button
            onClick={() => navigate(-1)}
            className="bg-teal-600 hover:bg-teal-700 text-white px-6 py-3 rounded-xl font-medium transition-colors"
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
    <div className="min-h-screen bg-slate-100">
      <PageHeader
        title="Detalle del Kanji"
        description={kanji.meaning}
        leftContent={
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100">
            <FiArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Contenido principal */}
      <div className="max-w-5xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          {/* Columna izquierda: Kanji + Canvas + Lecturas */}
          <div className="space-y-6">
            {/* Kanji hero */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-start gap-4">
                <div className="w-28 h-28 md:w-32 md:h-32 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-center">
                  <span className="text-6xl md:text-7xl font-semibold text-slate-900">{kanji.character}</span>
                </div>
                <div className="flex-1">
                  <h2 className="text-2xl md:text-3xl font-semibold text-slate-900">{kanji.meaning}</h2>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getDifficultyColor(kanji.difficulty)}`}>
                      {kanji.difficulty === 'beginner' ? 'Principiante' : kanji.difficulty === 'intermediate' ? 'Intermedio' : 'Avanzado'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getJLPTLevelColor(kanji.jlptLevel)}`}>
                      JLPT {kanji.jlptLevel}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Canvas de práctica de trazos */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-sm font-semibold text-slate-900 mb-3">Practica el trazo</h3>
              <KanjiCanvas character={kanji.character} size={320} />
            </div>

            {/* Lecturas con tabs */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center border-b border-slate-200 mb-4">
                {(['onyomi','kunyomi'] as const).map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveReadingTab(tab)}
                    className={`px-3 py-2 text-sm font-medium -mb-px border-b-2 ${
                      activeReadingTab === tab ? 'border-teal-600 text-slate-900' : 'border-transparent text-slate-500'
                    }`}
                  >
                    {tab === 'onyomi' ? 'Onyomi' : 'Kunyomi'}
                  </button>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {(activeReadingTab === 'onyomi' ? kanji.readings.onyomi : kanji.readings.kunyomi).map((r, idx) => (
                  <span key={idx} className={`px-3 py-1 rounded-xl font-mono text-sm ${activeReadingTab === 'onyomi' ? 'bg-teal-50 text-teal-700 border border-teal-200' : 'bg-slate-100 text-slate-700 border border-slate-200'}`}>
                    {r}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Columna derecha: Ejemplos + Info + Acciones */}
          <div className="space-y-6">
            {/* Ejemplos */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
              <h3 className="text-xl font-semibold text-slate-900 mb-4">Ejemplos</h3>
              <div className="space-y-3">
                {examples.map((ex, idx) => {
                  const parts = ex.japanese.split(kanji.character);
                  return (
                    <div key={idx} className="p-4 rounded-2xl border border-slate-200 bg-white">
                      <div className="text-lg font-semibold text-slate-900 mb-1 text-center">
                        {parts.map((p, i) => (
                          <span key={i}>
                            {p}
                            {i < parts.length - 1 && (<span className="bg-amber-50 px-1 rounded">{kanji.character}</span>)}
                          </span>
                        ))}
                      </div>
                      <div className="text-xs text-slate-500 text-center font-mono">{ex.romaji}</div>
                      <div className="text-sm text-slate-700 text-center mt-1">{ex.english}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Información Adicional */}
            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
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

            {/* Acciones de práctica */}
            <div className="flex gap-3">
              <button className="flex-1 bg-slate-700 hover:bg-slate-800 text-white py-3 rounded-2xl font-semibold flex items-center justify-center gap-2">
                <FiPlay /> Practicar este kanji
              </button>
              <button className="flex-1 bg-white hover:bg-slate-50 text-slate-800 py-3 rounded-2xl font-semibold border border-slate-200 flex items-center justify-center gap-2">
                <FiBookmark /> Añadir a repaso
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
