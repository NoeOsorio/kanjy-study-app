import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import { getLessonKanji } from '../services/kanjiService';
import type { Kanji } from '../types';
import { FiArrowLeft, FiBookOpen } from 'react-icons/fi';

export default function LessonDetailPage() {
  const navigate = useNavigate();
  const { lessonId } = useParams<{ lessonId: string }>();
  const [kanjiList, setKanjiList] = useState<Kanji[]>([]);

  useEffect(() => {
    const loadLessonData = () => {
      const kanji = getLessonKanji(lessonId || '1');
      setKanjiList(kanji);
    };

    loadLessonData();
  }, [lessonId]);

  const handleKanjiClick = (kanji: Kanji) => {
    navigate(`/kanji/${kanji.id}`);
  };

  const openStudyMode = () => {
    navigate(`/lessons/${lessonId}/study`);
  };

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      {/* Header */}
      <PageHeader
        title="Fundamentos Básicos"
        description={`Nivel N5 • ${kanjiList.length} kanji`}
        leftContent={
          <button
            onClick={() => navigate(-1)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <FiArrowLeft className="w-5 h-5" />
          </button>
        }
      />

      {/* Main Content */}
      <div className="px-6 py-6 space-y-6">
        {/* Progress Bar */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Progreso de la lección</h2>
            <span className="text-sm text-slate-600">0/{kanjiList.length} completados</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-teal-600 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm text-slate-600 mt-3 mb-4">
            Toca un kanji para ver detalles y practicar sus lecturas
          </p>
          
          {/* Study Mode Button */}
          <button
            onClick={openStudyMode}
            className="w-full bg-slate-700 hover:bg-slate-800 text-white py-4 px-6 rounded-2xl font-semibold text-lg transition-colors"
          >
            <div className="flex items-center justify-center gap-3">
              <FiBookOpen className="w-5 h-5" />
              <span>Modo estudio con tarjetas</span>
            </div>
          </button>
        </div>

        {/* Kanji Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanjiList.map((kanji) => (
            <div
              key={kanji.id}
              className="bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-colors cursor-pointer text-center border border-gray-100 hover:border-slate-300"
              onClick={() => handleKanjiClick(kanji)}
            >
              {/* Kanji Character */}
              <div className="w-24 h-24 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-200">
                <span className="text-5xl font-semibold text-slate-900">{kanji.character}</span>
              </div>

              {/* Kanji Meaning */}
              <h3 className="text-lg font-semibold text-slate-900 mb-3">{kanji.meaning}</h3>
              
              {/* Main Reading - Onyomi */}
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-2">Lectura principal</p>
                <div className="bg-teal-50 rounded-xl p-2 border border-teal-200">
                  <span className="font-mono text-lg font-semibold text-teal-700">
                    {kanji.readings.onyomi[0]}
                  </span>
                </div>
              </div>

              {/* Alternative Readings */}
              <div className="mb-3">
                <p className="text-xs text-slate-500 mb-2">Otras lecturas</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {kanji.readings.onyomi.slice(1).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {reading}
                    </span>
                  ))}
                  {kanji.readings.kunyomi.slice(0, 2).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-slate-100 px-2 py-1 rounded-lg text-slate-700 font-mono">
                      {reading}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stroke Count Badge */}
              <div className="inline-block bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
                <span className="text-sm font-medium text-amber-700">{kanji.strokeCount} trazos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
