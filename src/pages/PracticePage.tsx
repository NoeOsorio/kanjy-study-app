import { useState } from 'react';
import QuizModeSelector from '../components/QuizModeSelector';
import Quiz from '../components/Quiz';
import QuizResults from '../components/QuizResults';
import type { QuizMode } from '../types';

export default function PracticePage() {
  const [selectedMode, setSelectedMode] = useState<QuizMode | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [quizResults, setQuizResults] = useState<any>(null);

  const handleModeSelect = (mode: QuizMode) => {
    setSelectedMode(mode);
    setShowResults(false);
  };

  const handleQuizComplete = (results: any) => {
    setQuizResults(results);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    setSelectedMode(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Práctica</h1>
        
        {!selectedMode && !showResults && (
          <QuizModeSelector onModeSelect={handleModeSelect} />
        )}

        {selectedMode && !showResults && (
          <Quiz
            mode={selectedMode}
            onComplete={handleQuizComplete}
          />
        )}

        {showResults && quizResults && (
          <QuizResults
            results={quizResults}
            onClose={handleCloseResults}
          />
        )}
      </div>
    </div>
  );
}
