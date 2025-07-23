import React, { useState, useEffect } from 'react';
import {
  TextInput,
  Button,
  InlineNotification,
  Loading
} from '@carbon/react';
import { View, ViewOff, Login as LoginIcon } from '@carbon/icons-react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import loginIllustration from '../assets/login-illustration.png'; // Add an image in public or src/assets

const Login = () => {
  const [formData, setFormData] = useState({ phone: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setFadeIn(true); // For fade-in animation on load
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLogin = async () => {
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://127.0.0.1:5000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok) {
        setError(data.message || 'Login failed');
        return;
      }

     localStorage.setItem('isLoggedIn', true);
      localStorage.setItem('user', JSON.stringify(data.user));
      navigate('/dashboard');

    } catch (err) {
      setLoading(false);
      setError('Server error. Please try again.');
    }
  };

  return (
    <div className={`login-container ${fadeIn ? 'fade-in' : ''}`}>
      <div className="login-image">
        <img src={loginIllustration} alt="Login Illustration" />
      </div>

      <div className="login-form">
        <h2 style={{ color: '#0f62fe', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LoginIcon size={24} /> Welcome Back
        </h2>
        <p style={{ marginBottom: '2rem' }}>
          Log in to access your Vitamin Deficiency Dashboard.
        </p>

        <TextInput
          id="phone"
          labelText="Phone Number"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />

        <div className="password-wrapper">
          <TextInput
            id="password"
            labelText="Password"
            name="password"
            type={showPassword ? 'text' : 'password'}
            value={formData.password}
            onChange={handleChange}
            required
          />
          <button
            type="button"
            className="icon-button password-toggle"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <ViewOff size={20} /> : <View size={20} />}
          </button>
        </div>
        <Button
          kind="primary"
          size="lg"
          onClick={handleLogin}
          disabled={loading}
          style={{ marginTop: '1.5rem', position: 'relative' }}
        >
          {loading ? (
            <>
              <Loading
                small
                withOverlay={false}
                description="Logging in..."
                className="login-spinner"
              />
              <span style={{ marginLeft: '0.5rem' }}>Logging In...</span>
            </>
          ) : (
            'Log In'
          )}
        </Button>



        <div className="forgot-password">
          <a href="#" onClick={() => alert('Please contact support/Re-register with another number.')}>
            Forgot Password?
          </a>
        </div>

        {/* <Button kind="primary" size="lg" onClick={handleLogin} style={{ marginTop: '1rem' }}>
          {loading ? <Loading small description="Logging in..." withOverlay={false} /> : 'Log In'}
        </Button> */}

        {error && (
          <InlineNotification
            kind="error"
            title="Login Error"
            subtitle={error}
            lowContrast
            style={{ marginTop: '1.5rem' }}
          />
        )}
      </div>
    </div>
  );
};

export default Login;
