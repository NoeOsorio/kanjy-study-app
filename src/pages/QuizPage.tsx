import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import type { QuizQuestion, QuizResult, QuizMode } from '../types';
import { getQuizModeTitle, generateQuizQuestions } from '../services/quizService';
import { FiX, FiCheck, FiX as FiXCircle } from 'react-icons/fi';

export default function QuizPage() {
  const navigate = useNavigate();
  const { mode = 'mixed' } = useParams<{ mode: QuizMode }>();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [startTime, setStartTime] = useState<number>(Date.now());
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    const generatedQuestions = generateQuizQuestions('1', mode as QuizMode);
    setQuestions(generatedQuestions);
  }, [mode]);

  useEffect(() => {
    setStartTime(Date.now());
  }, [currentQuestionIndex]);

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
      navigate('/quiz/results', { state: { results, mode } });
      return;
    }
    
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setIsAnswered(false);
  };

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
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-600 mr-3">
                  {String.fromCharCode(65 + index)}
                </div>
                <span className="text-lg">{option}</span>
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
                className="w-full bg-slate-800 text-white p-4 rounded-2xl font-semibold text-lg"
              >
                {isLastQuestion ? 'Ver Resultados' : 'Siguiente Pregunta'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}