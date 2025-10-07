import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // ✅ Ajoutez Link
import { useAuth } from '../contexts/AuthContext';
import './AdminLogin.css';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(email, password);
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-container">
      <div className="admin-login-card">
        <div className="admin-login-header">
          <img src="/assets/images/logo_inesic.png" alt="INESIC Logo" className="admin-logo" />
          <h1>Administration INESIC</h1>
          <p>Espace réservé aux administrateurs</p>
        </div>

        <form onSubmit={handleSubmit} className="admin-login-form">
          {error && (
            <div className="error-message">
              <i className="fas fa-exclamation-circle"></i>
              {error}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <i className="fas fa-envelope"></i>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="admin@inesic.com"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
              Mot de passe
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin"></i>
                Connexion en cours...
              </>
            ) : (
              <>
                <i className="fas fa-sign-in-alt"></i>
                Se connecter
              </>
            )}
          </button>
        </form>

        <div className="admin-login-footer">
          {/* ✅ Utilisez Link au lieu de <a> */}
          <Link to="/" className="back-home-link">
            <i className="fas fa-arrow-left"></i>
            Retour au site
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;