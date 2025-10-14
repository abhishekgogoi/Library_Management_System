import { Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { loadUserRentals } from '../store/slices/rentalsSlice';
import { loadUserWishlist } from '../store/slices/wishlistSlice';
import { loadUserProfile } from '../store/slices/profileSlice';

export const ProtectedRoute = ({ children }) => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const rentalsLoaded = useSelector((state) => state.rentals.currentUserId);
  
  useEffect(() => {
    // Load user-specific data when component mounts if user is authenticated
    // and data hasn't been loaded yet
    if (isAuthenticated && user && rentalsLoaded !== user.id) {
      dispatch(loadUserRentals(user.id));
      dispatch(loadUserWishlist(user.id));
      dispatch(loadUserProfile(user.id));
    }
  }, [isAuthenticated, user, rentalsLoaded, dispatch]);
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};