import { Routes, Route, Navigate, Outlet } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import KanjiDetailPage from './pages/KanjiDetailPage';
import StudyModePage from './pages/StudyModePage';
import PracticePage from './pages/PracticePage';
import ProfilePage from './pages/ProfilePage';
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
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="/lessons/:lessonId/study" element={<StudyModePage />} />
        <Route path="/kanji/:kanjiId" element={<KanjiDetailPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>

      {/* Rutas sin navegación */}
      <Route path="/quiz/:mode" element={<QuizPage />} />
      <Route path="/quiz/results" element={<QuizResultsPage />} />
    </Routes>
  );
}

export default App;