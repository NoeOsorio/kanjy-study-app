import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getLessonKanji } from '../services/kanjiService';
import type { Kanji } from '../types';

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 pb-20">
      {/* Header */}
      <div className="bg-white shadow-sm px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate('/lessons')}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Fundamentos Básicos
              </h1>
              <p className="text-sm text-gray-600 mt-1">Nivel N5 • {kanjiList.length} kanji</p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="px-6 py-4">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">Progreso de la Lección</h2>
            <span className="text-sm text-gray-500">0/{kanjiList.length} completados</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-green-400 to-blue-500 h-3 rounded-full transition-all duration-500" style={{ width: '0%' }}></div>
          </div>
          <p className="text-sm text-gray-600 mt-3 mb-4">
            Haz clic en cada kanji para aprender más detalles
          </p>
          
          {/* Study Mode Button */}
          <button
            onClick={openStudyMode}
            className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 px-6 rounded-2xl font-bold text-lg transition-colors duration-200 shadow-lg"
          >
            <div className="flex items-center justify-center space-x-3">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
              <span>Modo Estudio con Tarjetas</span>
            </div>
          </button>
        </div>
      </div>

      {/* Kanji Grid */}
      <div className="px-6 py-4">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kanjiList.map((kanji) => (
            <div
              key={kanji.id}
              className="bg-gradient-to-br from-white to-gray-50 rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer text-center border border-gray-100 hover:border-blue-200 hover:scale-105"
              onClick={() => handleKanjiClick(kanji)}
            >
              {/* Kanji Character */}
              <div className="w-24 h-24 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border-2 border-blue-200 shadow-inner">
                <span className="text-5xl font-bold text-gray-800">{kanji.character}</span>
              </div>

              {/* Kanji Meaning */}
              <h3 className="text-lg font-bold text-gray-800 mb-3">{kanji.meaning}</h3>
              
              {/* Main Reading - Onyomi */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Lectura principal</p>
                <div className="bg-blue-100 rounded-xl p-2">
                  <span className="font-mono text-lg font-bold text-blue-700">
                    {kanji.readings.onyomi[0]}
                  </span>
                </div>
              </div>

              {/* Alternative Readings */}
              <div className="mb-3">
                <p className="text-xs text-gray-500 mb-2">Otras lecturas</p>
                <div className="flex flex-wrap gap-1 justify-center">
                  {kanji.readings.onyomi.slice(1).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-gray-100 px-2 py-1 rounded-lg text-gray-600 font-mono">
                      {reading}
                    </span>
                  ))}
                  {kanji.readings.kunyomi.slice(0, 2).map((reading, idx) => (
                    <span key={idx} className="text-xs bg-green-100 px-2 py-1 rounded-lg text-green-600 font-mono">
                      {reading}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stroke Count Badge */}
              <div className="inline-block bg-gradient-to-r from-purple-100 to-pink-100 px-3 py-1 rounded-full border border-purple-200">
                <span className="text-sm font-medium text-purple-700">{kanji.strokeCount} trazos</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
