import { Navigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { toggleModal } from '../redux/slices/modalReducer';

const ProtectedRoute = ({ children }) => {
  const auth = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    // If not authenticated, open login modal
    if (!auth?.uid) {
      dispatch(toggleModal('login'));
    }
  }, [auth, dispatch]);

  // Check if user is authenticated
  if (!auth?.uid) {
    // Redirect to home
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
