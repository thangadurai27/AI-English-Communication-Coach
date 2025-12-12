import { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Loader from './components/ui/Loader';

// Lazy load pages for better performance
const Home = lazy(() => import('./pages/Home'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Practice = lazy(() => import('./pages/Practice'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Games = lazy(() => import('./pages/Games'));
const RapidFire = lazy(() => import('./pages/RapidFire'));
const WordBuilder = lazy(() => import('./pages/WordBuilder'));
const Lessons = lazy(() => import('./pages/Lessons'));
const Conversation = lazy(() => import('./pages/Conversation'));
const Profile = lazy(() => import('./pages/Profile'));

// Loading fallback component
const PageLoader = () => (
  <div className="min-h-screen bg-gray-50 dark:bg-background-dark flex items-center justify-center">
    <Loader size="lg" text="Loading..." />
  </div>
);

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Suspense fallback={<PageLoader />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/practice" element={<Practice />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/games" element={<Games />} />
            <Route path="/games/rapidfire" element={<RapidFire />} />
            <Route path="/games/wordbuilder" element={<WordBuilder />} />
            <Route path="/lessons" element={<Lessons />} />
            <Route path="/conversation" element={<Conversation />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </Suspense>
      </div>
    </Router>
  );
}

export default App;
