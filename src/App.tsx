import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import HomePage from './pages/HomePage';
import LessonsPage from './pages/LessonsPage';
import LessonDetailPage from './pages/LessonDetailPage';
import KanjiDetailPage from './pages/KanjiDetailPage';
import StudyModePage from './pages/StudyModePage';
import PracticePage from './pages/PracticePage';
import ProfilePage from './pages/ProfilePage';

function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/lessons" element={<LessonsPage />} />
        <Route path="/lessons/:lessonId" element={<LessonDetailPage />} />
        <Route path="/lessons/:lessonId/study" element={<StudyModePage />} />
        <Route path="/kanji/:kanjiId" element={<KanjiDetailPage />} />
        <Route path="/practice" element={<PracticePage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
