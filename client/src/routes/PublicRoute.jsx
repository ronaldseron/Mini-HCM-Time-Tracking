import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PublicRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  // If authenticated, redirect based on role
  if (isAuthenticated) {
    return <Navigate to={isAdmin ? '/admin/dashboard' : '/users/dashboard'} replace />;
  }

  return children;
};

export default PublicRoute;