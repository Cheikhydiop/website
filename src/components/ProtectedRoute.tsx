import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth(); // ✅ On retire isAdmin pour l'instant

  console.log('🛡️ ProtectedRoute check:', { user: user?.email, loading });

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <i className="fas fa-spinner fa-spin" style={{ fontSize: '48px', marginBottom: '20px' }}></i>
          <p style={{ fontSize: '18px' }}>Chargement...</p>
        </div>
      </div>
    );
  }

  // ✅ On vérifie seulement si l'utilisateur est connecté
  if (!user) {
    console.log('❌ Redirection vers login');
    return <Navigate to="/admin/login" replace />;
  }

  console.log('✅ Accès autorisé pour:', user.email);
  return <>{children}</>;
};

export default ProtectedRoute;