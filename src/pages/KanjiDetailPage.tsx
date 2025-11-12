import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getKanjiById, getKanjiExamples } from '../services/kanjiService';
import type { Kanji, KanjiExample } from '../types';
import { FiArrowLeft, FiPlay, FiBookmark, FiGrid, FiActivity, FiAward, FiEdit3, FiBook } from 'react-icons/fi';
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
          <FiActivity className="w-10 h-10 mx-auto mb-4 text-slate-600" />
          <h1 className="text-2xl font-semibold text-slate-900 mb-2">Kanji no encontrado</h1>
          <p className="text-slate-600 mb-6">El kanji que buscas no existe</p>
          <button
            onClick={() => navigate('/lessons')}
            className="bg-slate-700 hover:bg-slate-800 text-white px-6 py-3 rounded-xl font-medium transition-colors"
          >
            Volver a lecciones
          </button>
        </div>
      </div>
    );
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner':
        return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'intermediate':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header con kanji grande */}
      <div className="relative bg-slate-800">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>
        </div>

        {/* Contenido del header */}
        <div className="relative">
          <div className="max-w-7xl mx-auto px-4">
            {/* Navegación y badges */}
            <div className="pt-6">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => navigate(-1)}
                  className="w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                  title="Volver a la lección"
                >
                  <FiArrowLeft className="w-6 h-6" />
                </button>
                <div className="flex gap-3">
                  <span className="px-4 py-2 rounded-lg bg-white/10 text-white/90 text-sm font-medium">
                    JLPT {kanji.jlptLevel}
                  </span>
                  <span className="px-4 py-2 rounded-lg bg-white/10 text-white/90 text-sm font-medium">
                    {kanji.strokeCount} trazos
                  </span>
                </div>
              </div>
            </div>

            {/* Kanji y significado */}
            <div className="flex flex-col items-center py-20">
              <div className="mb-6">
                <div className="text-[160px] font-bold text-white leading-none">
                  {kanji.character}
                </div>
              </div>
              <div className="mb-4 px-4 py-2 rounded-lg bg-white/10 text-white/90 text-lg font-medium">
                {kanji.readings.onyomi[0]}
              </div>
              <h1 className="text-3xl font-bold text-white mb-12">
                {kanji.meaning}
              </h1>
              <div className="flex gap-4">
                <button className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-3 rounded-xl font-medium text-lg flex items-center gap-2 transition-colors">
                  <FiPlay className="w-5 h-5" />
                  <span>Practicar</span>
                </button>
                <button className="bg-white/10 hover:bg-white/20 text-white px-8 py-3 rounded-xl font-medium text-lg flex items-center gap-2 transition-colors">
                  <FiBookmark className="w-5 h-5" />
                  <span>Guardar</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Columna izquierda: Canvas y Lecturas */}
          <div className="space-y-6">
            {/* Canvas de práctica */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <FiEdit3 className="w-6 h-6 text-white" />
                    <h2 className="text-lg font-bold text-white">Práctica de escritura</h2>
                  </div>
                  <span className="px-3 py-1 rounded-lg bg-white/10 text-white text-sm">
                    {kanji.strokeCount} trazos
                  </span>
                </div>
              </div>
              <div className="p-6">
                <KanjiCanvas character={kanji.character} size={320} />
              </div>
            </div>

            {/* Lecturas */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiBook className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-bold text-white">Lecturas</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="flex border-b border-gray-200">
                  {(['onyomi', 'kunyomi'] as const).map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveReadingTab(tab)}
                      className={`flex-1 px-4 py-3 text-sm font-medium -mb-px border-b-2 transition-colors ${
                        activeReadingTab === tab 
                          ? 'border-teal-600 text-teal-600 bg-teal-50/50' 
                          : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                      }`}
                    >
                      <div className="text-base">
                        {tab === 'onyomi' ? 'Lectura china' : 'Lectura japonesa'}
                      </div>
                      <div className="text-xs text-slate-500 mt-1">
                        {tab === 'onyomi' 
                          ? 'Usada en compuestos' 
                          : 'Usada individualmente'}
                      </div>
                    </button>
                  ))}
                </div>
                <div className="mt-6">
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {(activeReadingTab === 'onyomi' ? kanji.readings.onyomi : kanji.readings.kunyomi).map((reading, idx) => (
                      <div key={idx} className="group">
                        <div className="p-4 rounded-xl bg-slate-50 border border-gray-200 text-center transition-colors group-hover:bg-slate-800 group-hover:border-slate-700">
                          <span className="text-lg font-bold text-slate-700 transition-colors group-hover:text-white">
                            {reading}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Columna derecha: Stats y Ejemplos */}
          <div className="space-y-6">
            {/* Stats */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiActivity className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-bold text-white">Información</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="group">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-center transition-colors group-hover:bg-slate-800 group-hover:border-slate-700">
                      <FiGrid className="w-6 h-6 text-slate-700 mb-2 mx-auto transition-colors group-hover:text-white" />
                      <div className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-white">
                        {kanji.strokeCount}
                      </div>
                      <div className="text-sm text-slate-600 transition-colors group-hover:text-white/80">Trazos</div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-center transition-colors group-hover:bg-teal-800 group-hover:border-teal-700">
                      <FiActivity className="w-6 h-6 text-slate-700 mb-2 mx-auto transition-colors group-hover:text-white" />
                      <div className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-white">
                        {kanji.frequency}
                      </div>
                      <div className="text-sm text-slate-600 transition-colors group-hover:text-white/80">Frecuencia</div>
                    </div>
                  </div>
                  <div className="group">
                    <div className="p-4 rounded-2xl bg-slate-50 border border-gray-200 text-center transition-colors group-hover:bg-amber-800 group-hover:border-amber-700">
                      <FiAward className="w-6 h-6 text-slate-700 mb-2 mx-auto transition-colors group-hover:text-white" />
                      <div className="text-2xl font-bold text-slate-900 transition-colors group-hover:text-white">
                        {kanji.grade}
                      </div>
                      <div className="text-sm text-slate-600 transition-colors group-hover:text-white/80">Grado</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Ejemplos */}
            <div className="bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="flex items-center gap-3">
                  <FiBook className="w-6 h-6 text-white" />
                  <h2 className="text-lg font-bold text-white">Ejemplos de uso</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {examples.map((ex, idx) => {
                    const parts = ex.japanese.split(kanji.character);
                    return (
                      <div key={idx} className="p-4 rounded-2xl bg-slate-50 border border-gray-200">
                        <div className="text-lg font-bold text-slate-900 mb-3 text-center">
                          {parts.map((p, i) => (
                            <span key={i}>
                              {p}
                              {i < parts.length - 1 && (
                                <span className="inline-block px-1 mx-0.5 bg-teal-50 text-teal-700 rounded">
                                  {kanji.character}
                                </span>
                              )}
                            </span>
                          ))}
                        </div>
                        <div className="text-center space-y-2">
                          <div className="text-sm font-mono text-slate-600">{ex.romaji}</div>
                          <div className="text-sm text-slate-700 font-medium">{ex.spanish}</div>
                        </div>
                        <div className="mt-3 flex justify-center">
                          <span className={`text-xs px-3 py-1 rounded-full border ${getDifficultyColor(ex.difficulty)}`}>
                            {ex.difficulty}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}