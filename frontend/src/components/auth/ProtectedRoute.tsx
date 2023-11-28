import { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppDispatch, useAuthStore } from '../../hooks/useAuthStore';
import { AuthStatus, onLogout } from '../../store/auth/authSlice';
import LoadingPage from '../common/LoadingPage';

const ProtectedRoute = ({ children }: PropsWithChildren) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { status, checkAuthToken } = useAuthStore();

  useEffect(() => {
    checkAuthToken();
  }, []);

  useEffect(() => {
    if (status === AuthStatus.notAuthenticated) {
      dispatch(onLogout());
      navigate('/login');
    }
  }, [status]);

  if (status === AuthStatus.loading) return <LoadingPage />;

  if (status === AuthStatus.authenticated) return children;
};

export default ProtectedRoute;