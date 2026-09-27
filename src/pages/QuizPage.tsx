import { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import type { QuizQuestion, QuizResult, QuizMode } from '../types';
import { getQuizModeTitle, generateQuizQuestions } from '../services/quizService';
import { FiX, FiCheck, FiX as FiXCircle } from 'react-icons/fi';

export default function QuizPage() {
  const navigate = useNavigate();
  const { mode = 'mixed' } = useParams<{ mode: QuizMode }>();
  const [searchParams] = useSearchParams();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [lessonIds, setLessonIds] = useState<string[]>([]);
  
  // Refs para evitar problemas de dependencias en useEffect
  const handleAnswerSelectRef = useRef<(answer: string) => void>();
  const handleNextQuestionRef = useRef<() => void>();
  const isAnsweredRef = useRef<boolean>(false);
  const currentQuestionRef = useRef<QuizQuestion | null>(null);
  const questionsRef = useRef<QuizQuestion[]>([]);
  const currentQuestionIndexRef = useRef<number>(0);
  const selectedAnswerRef = useRef<string | null>(null);
  const resultsRef = useRef<QuizResult[]>([]);
  const startTimeRef = useRef<number>(Date.now());
  const isLastQuestionRef = useRef<boolean>(false);
  const lessonIdsRef = useRef<string[]>([]);

  useEffect(() => {
    // Obtener las lecciones de los query params
    const lessonsParam = searchParams.get('lessons');
    const lessonIdsArray = lessonsParam ? lessonsParam.split(',') : [];
    
    // Si no hay lecciones seleccionadas, usar todas las disponibles como fallback
    const lessonIdsToUse = lessonIdsArray.length > 0 ? lessonIdsArray : ['1'];
    setLessonIds(lessonIdsToUse);
    
    const generatedQuestions = generateQuizQuestions(lessonIdsToUse, mode as QuizMode);
    setQuestions(generatedQuestions);
  }, [mode, searchParams]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

  // Actualizar refs con los valores actuales
  useEffect(() => {
    questionsRef.current = questions;
    currentQuestionIndexRef.current = currentQuestionIndex;
    isAnsweredRef.current = isAnswered;
    selectedAnswerRef.current = selectedAnswer;
    resultsRef.current = results;
    startTimeRef.current = startTime;
    lessonIdsRef.current = lessonIds;
    
    if (questions.length > 0 && currentQuestionIndex < questions.length) {
      currentQuestionRef.current = questions[currentQuestionIndex];
      isLastQuestionRef.current = currentQuestionIndex === questions.length - 1;
    }
  }, [questions, currentQuestionIndex, isAnswered, selectedAnswer, results, startTime, lessonIds]);

  // Navegación por teclado - debe estar antes de los early returns
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Esc para salir
      if (event.key === 'Escape') {
        event.preventDefault();
        navigate('/practice');
        return;
      }

      const currentIsAnswered = isAnsweredRef.current;
      const currentQ = currentQuestionRef.current;
      const handleAnswer = handleAnswerSelectRef.current;
      const handleNext = handleNextQuestionRef.current;

      // Si ya se respondió, solo permitir Espacio para continuar
      if (currentIsAnswered) {
        if (event.key === ' ') {
          event.preventDefault();
          handleNext?.();
        }
        return;
      }

      // Si no se ha respondido, permitir seleccionar opciones con 1, 2, 3, 4
      if (event.key >= '1' && event.key <= '4' && currentQ) {
        event.preventDefault();
        const optionIndex = parseInt(event.key) - 1;
        if (optionIndex >= 0 && optionIndex < currentQ.options.length) {
          handleAnswer?.(currentQ.options[optionIndex]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
        <div className="w-full max-w-lg bg-white rounded-2xl p-6 text-center">
          <FiX className="w-8 h-8 mx-auto mb-3 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900 mb-2">No hay preguntas disponibles</h2>
          <p className="text-slate-600 mb-4">No se pudieron generar preguntas para este modo de quiz.</p>
          <button
            onClick={() => navigate('/practice')}
            className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2.5 rounded-xl font-medium transition-colors"
          >
            Volver a práctica
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === questions.length - 1;

  if (!currentQuestion) return null;

  const handleAnswerSelect = (answer: string) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answer);
    setIsAnswered(true);
    
    const timeSpent = Date.now() - startTime;
    const isCorrect = answer === currentQuestion.correctAnswer;
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer: answer,
      isCorrect,
      timeSpent
    };
    
    setResults(prev => [...prev, result]);
  };

  const handleNextQuestion = () => {
    if (isLastQuestion) {
      navigate('/quiz/results', { state: { results, mode, lessonIds } });
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

  // Actualizar refs de funciones
  handleAnswerSelectRef.current = handleAnswerSelect;
  handleNextQuestionRef.current = handleNextQuestion;

  const getProgressPercentage = () => {
    return ((currentQuestionIndex + 1) / questions.length) * 100;
  };

  return (
    <div className="min-h-screen bg-slate-900 flex flex-col">
      {/* Header */}
      <div className="px-4 pt-4 pb-2">
        <div className="flex items-center justify-between mb-1">
          <div>
            <h2 className="text-xl font-bold text-white">
              {mode === 'mixed' ? 'Quiz Mixto' : getQuizModeTitle(mode as QuizMode)}
            </h2>
            <p className="text-sm text-slate-400">
              Pregunta {currentQuestionIndex + 1} de {questions.length}
            </p>
          </div>
          <button
            onClick={() => navigate('/practice')}
            className="w-10 h-10 bg-slate-800 rounded-xl flex items-center justify-center text-white hover:bg-slate-700 transition-colors"
            title="Volver a práctica"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>
        
        {/* Progress Bar */}
        <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-teal-500 transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col px-4 py-8">
        {/* Question Section */}
        <div className="mb-8 text-center">
          <div className="w-24 h-24 bg-slate-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <span className="text-5xl font-bold text-white">
              {currentQuestion.question}
            </span>
          </div>
          <p className="text-lg text-slate-300 font-medium">
            ¿Cuál es el significado?
          </p>
        </div>

        {/* Options and Feedback Section */}
        <div className="space-y-3">
          {/* Options */}
          {currentQuestion.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswerSelect(option)}
              disabled={isAnswered}
              className={`w-full p-4 rounded-2xl text-left transition-colors ${
                !isAnswered
                  ? 'bg-white hover:bg-slate-50'
                  : option === currentQuestion.correctAnswer
                  ? 'bg-teal-50 border-2 border-teal-500'
                  : option === selectedAnswer
                  ? 'bg-rose-50 border-2 border-rose-500'
                  : 'bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 mr-3">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-lg">{option}</span>
                </div>
                {!isAnswered && (
                  <kbd className="px-2 py-1 bg-slate-200 rounded text-xs font-mono text-slate-700">
                    {index + 1}
                  </kbd>
                )}
              </div>
            </button>
          ))}

          {/* Feedback & Next Button */}
          {isAnswered && (
            <div className="space-y-3 mt-4">
              <div className={`p-4 rounded-2xl flex items-center ${
                selectedAnswer === currentQuestion.correctAnswer 
                  ? 'bg-teal-50' 
                  : 'bg-rose-50'
              }`}>
                {selectedAnswer === currentQuestion.correctAnswer ? (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-teal-100 flex items-center justify-center mr-3">
                      <FiCheck className="w-5 h-5 text-teal-600" />
                    </div>
                    <span className="font-bold text-teal-800">¡Correcto!</span>
                  </>
                ) : (
                  <>
                    <div className="w-8 h-8 rounded-xl bg-rose-100 flex items-center justify-center mr-3">
                      <FiXCircle className="w-5 h-5 text-rose-600" />
                    </div>
                    <div>
                      <span className="font-bold text-rose-800">Incorrecto</span>
                      <p className="text-sm text-rose-700 mt-0.5">
                        La respuesta correcta es: <span className="font-bold">{currentQuestion.correctAnswer}</span>
                      </p>
                    </div>
                  </>
                )}
              </div>

              <button
                onClick={handleNextQuestion}
                className="w-full bg-slate-800 text-white p-4 rounded-2xl font-semibold text-lg flex items-center justify-center gap-2"
              >
                <span>{isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}</span>
                <kbd className="px-2 py-1 bg-slate-700 rounded text-xs font-mono">espacio</kbd>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Panel de ayuda con atajos de teclado */}
      <div className="px-4 pb-4">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700/50">
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400">
            {!isAnswered ? (
              <div className="flex items-center gap-2">
                {currentQuestion.options.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswerSelect(currentQuestion.options[index])}
                    className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
                    title={`Seleccionar opción ${index + 1}`}
                  >
                    {index + 1}
                  </button>
                ))}
                <span>Seleccionar respuesta</span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={handleNextQuestion}
                  className="px-2 py-1 bg-slate-700 rounded text-xs font-mono text-slate-300 hover:bg-slate-600 transition-colors cursor-pointer"
                  title="Continuar a la siguiente pregunta"
                >
                  espacio
                </button>
                <span>Continuar</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}