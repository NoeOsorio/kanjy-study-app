import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { getLessonKanji } from '../services/kanjiService';
import type { Kanji } from '../types';
import { FiArrowLeft, FiBookOpen, FiGrid, FiLayers, FiAward } from 'react-icons/fi';

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
    <div className="min-h-screen bg-slate-100">
      {/* Header con degradado y patrón */}
      <div className="relative bg-gradient-to-br from-slate-800 to-slate-900 shadow-lg">
        {/* Patrón de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ 
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` 
          }}></div>
        </div>

        {/* Contenido del header */}
        <div className="relative">
          {/* Navegación superior */}
          <div className="border-b border-white/10">
            <div className="max-w-7xl mx-auto px-4">
              <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => navigate('/lessons')}
                    className="w-10 h-10 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors"
                    title="Volver a lecciones"
                  >
                    <FiArrowLeft className="w-5 h-5" />
                  </button>
                  <div>
                    <h1 className="text-lg sm:text-xl font-bold text-white">
                      Fundamentos Básicos
                    </h1>
                    <p className="text-sm text-white/80">
                      Nivel N5 • {kanjiList.length} kanji
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm font-medium text-white/80">
                    0/{kanjiList.length} completados
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Barra de progreso full-width */}
          <div className="h-1 w-full bg-white/10">
            <div 
              className="h-1 bg-gradient-to-r from-teal-400 to-teal-500 transition-all duration-300 ease-out"
              style={{ width: '0%' }}
            ></div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="relative">
        {/* Fondo con patrón sutil */}
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] opacity-50"></div>

        {/* Contenido */}
        <div className="relative max-w-7xl mx-auto px-4 py-8">
          {/* Sección de estudio */}
          <div className="mb-12">
            <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-3xl p-8 sm:p-10 shadow-xl relative overflow-hidden">
              {/* Decorative elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-teal-500/20 to-transparent rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-gradient-to-tr from-amber-500/20 to-transparent rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"></div>

              <div className="relative grid sm:grid-cols-2 gap-8">
                {/* Info y progreso */}
                <div className="space-y-6">
                  <div className="flex items-start gap-5">
                    <div className="w-14 h-14 bg-gradient-to-br from-teal-400 to-teal-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                      <FiLayers className="w-7 h-7 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white mb-2">Modo Estudio con Tarjetas</h2>
                      <p className="text-white/80">Practica cada kanji con tarjetas interactivas y refuerza tu aprendizaje</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm text-white/70">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <FiGrid className="w-4 h-4" />
                      </div>
                      <span>{kanjiList.length} kanji</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                        <FiAward className="w-4 h-4" />
                      </div>
                      <span>Nivel N5</span>
                    </div>
                  </div>
                </div>
                {/* Botón de inicio */}
                <div className="flex items-center sm:justify-end">
                  <button
                    onClick={openStudyMode}
                    className="w-full sm:w-auto bg-gradient-to-r from-teal-400 to-teal-500 hover:from-teal-500 hover:to-teal-600 text-white py-5 px-10 rounded-2xl font-semibold text-lg transition-all shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
                  >
                    <div className="flex items-center justify-center gap-3">
                      <FiBookOpen className="w-6 h-6" />
                      <span>Comenzar estudio</span>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Grid de kanji */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {kanjiList.map((kanji, idx) => (
              <motion.div
                key={kanji.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="relative bg-white rounded-3xl p-4 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100"
                onClick={() => handleKanjiClick(kanji)}
              >
                {/* Badge JLPT */}
                <div className="absolute top-3 right-3">
                  <span className="text-[10px] leading-none px-2 py-1 rounded-full bg-amber-50 text-amber-700 border border-amber-100 font-medium">
                    {kanji.jlptLevel}
                  </span>
                </div>

                {/* Kanji principal */}
                <div className="group relative aspect-square bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl flex items-center justify-center mb-4 transition-all">
                  <span className="text-6xl font-bold text-white">{kanji.character}</span>
                  {/* Decorative accent */}
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
                </div>

                {/* Significado */}
                <h3 className="text-xl font-bold text-slate-900 mb-2 text-center">
                  {kanji.meaning}
                </h3>

                {/* Lectura principal */}
                <div className="text-center mb-3">
                  <span className="font-mono text-lg text-slate-600">
                    {kanji.readings.onyomi[0]}
                  </span>
                </div>

                {/* Trazos */}
                <div className="text-center">
                  <span className="text-sm text-teal-600">
                    {kanji.strokeCount} trazos
                  </span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}