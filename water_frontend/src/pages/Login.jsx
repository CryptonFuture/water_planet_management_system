
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Droplets, Mail, Lock, Eye, EyeOff, ShieldCheck } from 'lucide-react';
import '../css/Auth.css'

export default function Login() {
  const [email, setEmail] = useState('admin@waterplant.com');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Login failed. Check credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* Background decoration */}
      <div className="login-bg-orb login-bg-orb-1"></div>
      <div className="login-bg-orb login-bg-orb-2"></div>
      <div className="login-grid"></div>

      <div className="login-card">

        {/* Logo */}
        <div className="login-brand">
          <div className="login-logo">
            <Droplets size={30} strokeWidth={2.3} />
          </div>

          <div>
            <h1>WaterPlant</h1>
            <span>Management System</span>
          </div>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome back</h2>
          <p>
            Sign in to manage your water treatment
            facilities and operations.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="login-error">
            <span className="error-icon">!</span>
            <span>{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <div className="input-wrapper">
              <Mail className="input-icon" size={19} />

              <input
                id="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">
            <label htmlFor="password">Password</label>

            <div className="input-wrapper">
              <Lock className="input-icon" size={19} />

              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={
                  showPassword
                    ? 'Hide password'
                    : 'Show password'
                }
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="btn btn-primary login-submit"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="login-spinner"></span>
                Signing in...
              </>
            ) : (
              <>
                Sign In
                <span className="login-arrow">→</span>
              </>
            )}
          </button>
        </form>

        {/* Demo credentials */}
        <div className="demo-box">
          <div className="demo-header">
            <div className="demo-icon">
              <ShieldCheck size={17} />
            </div>

            <div>
              <strong>Demo Access</strong>
              <span>Use any account below to continue</span>
            </div>
          </div>

          <div className="demo-users">
            <button
              type="button"
              onClick={() => {
                setEmail('admin@waterplant.com');
                setPassword('admin123');
              }}
            >
              <span className="role-badge admin">A</span>
              <span>
                <strong>Admin</strong>
                <small>admin@waterplant.com</small>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('manager@waterplant.com');
                setPassword('manager123');
              }}
            >
              <span className="role-badge manager">M</span>
              <span>
                <strong>Manager</strong>
                <small>manager@waterplant.com</small>
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                setEmail('operator@waterplant.com');
                setPassword('operator123');
              }}
            >
              <span className="role-badge operator">O</span>
              <span>
                <strong>Operator</strong>
                <small>operator@waterplant.com</small>
              </span>
            </button>
          </div>
        </div>

        <div className="login-footer">
          <span>💧</span>
          Secure Water Plant Management
        </div>
      </div>
    </div>
  );
}



