import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading, configured } = useAuth();

  if (!configured) return <>{children}</>;
  if (loading) return <div className="loading">불러오는 중...</div>;
  if (!user) return <Navigate to="/login" replace />;

  return <>{children}</>;
}
