import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import TaskDetail from './pages/TaskDetail';
import Notifications from './pages/Notifications';
import Analytics from './pages/Analytics';
import Navbar from './components/Navbar';
import NewProject from './pages/NewProject';

function App() {
  const { state } = useAuth();
  const PrivateRoute = ({ children }) => state.token ? children : <Navigate to="/login" />;

  return (
    <Router>
      <Navbar />
      <div className="p-3">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/" element={<PrivateRoute><Projects /></PrivateRoute>} />
            <Route path="/projects/new" element={<PrivateRoute><NewProject /></PrivateRoute>} /> {/* yeh naya */}
          <Route path="/projects/:id" element={<PrivateRoute><ProjectDetail /></PrivateRoute>} />
          <Route path="/tasks/:id" element={<PrivateRoute><TaskDetail /></PrivateRoute>} />
          <Route path="/notifications" element={<PrivateRoute><Notifications /></PrivateRoute>} />
          <Route path="/analytics" element={<PrivateRoute><Analytics /></PrivateRoute>} />
        </Routes>
      </div>
    </Router>
  )
}

export default App;
