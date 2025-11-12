import { Routes, Route, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import KanjiDetailPage from './pages/KanjiDetailPage';
import KanjiPracticePage from './pages/KanjiPracticePage';
import StudyModePage from './pages/StudyModePage';
import PracticePage from './pages/PracticePage';
import QuizPage from './pages/QuizPage';
import QuizResultsPage from './pages/QuizResultsPage';

// Wrapper para AppLayout que usa Outlet
const AppLayoutWrapper = () => (
  <AppLayout>
    <Outlet />
  </AppLayout>
);

function App() {
  return (
    <Routes>
      {/* Rutas con navegación */}
      <Route element={<AppLayoutWrapper />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="/lessons/:lessonId/study" element={<StudyModePage />} />
        <Route path="/kanji/:kanjiId" element={<KanjiDetailPage />} />
        <Route path="/practice" element={<PracticePage />} />
      </Route>

      {/* Rutas sin navegación */}
      <Route path="/quiz/:mode" element={<QuizPage />} />
      <Route path="/quiz/results" element={<QuizResultsPage />} />
      <Route path="/kanji/:kanjiId/practice" element={<KanjiPracticePage />} />
    </Routes>
  );
}

export default App;