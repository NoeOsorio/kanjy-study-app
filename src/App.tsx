import { Routes, Route } from 'react-router-dom';
import AppLayout from './components/AppLayout';
import LessonDetailPage from './pages/LessonDetailPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<AppLayout />} />
      <Route path="/lesson/:lessonId" element={<LessonDetailPage />} />
    </Routes>
  );
}

export default App;
