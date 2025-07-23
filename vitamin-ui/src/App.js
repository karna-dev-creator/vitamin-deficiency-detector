import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useLocation,
  Navigate // ✅ Important
} from 'react-router-dom';

import Register from './components/Register';
import Login from './components/Login';
import FeatureExtractor from './components/FeatureExtractor';
import Predict from './components/Predict';
import Landing from './components/Landing';
import About from './components/About';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import './App.css';
import VitaminInfo from './components/VitaminInfo';

// ✅ Navigation component
const Navigation = () => {
  const location = useLocation();
  const hideOnRoutes = ['/', '/login', '/register'];

  if (hideOnRoutes.includes(location.pathname)) return null;

  return (
    <div className="nav-bar">
      <h2 className="app-title">Vitamin Deficiency Detector</h2>
      <nav className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/predict">Predict</Link>
        <Link to="/extract">Extract Features</Link>
        <Link to="/about">About</Link>
        <Link to="/login">Logout</Link>
      </nav>
    </div>
  );
};

// ✅ Protected Route logic
const ProtectedRoute = ({ element }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
  return isLoggedIn ? element : <Navigate to="/login" replace />;
};

// ✅ App Component
function App() {
  return (
    <Router>
      <Navigation />
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* 🔐 Protected Routes */}
          <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
          <Route path="/predict" element={<ProtectedRoute element={<Predict />} />} />
          <Route path="/extract" element={<ProtectedRoute element={<FeatureExtractor />} />} />
          <Route path="/about" element={<ProtectedRoute element={<About />} />} />
          <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
          <Route path="/vitamin-info/:vitaminName"element={<ProtectedRoute element={<VitaminInfo />} />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
