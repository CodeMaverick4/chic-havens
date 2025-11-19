import { useSelector } from 'react-redux';
import { useNavigate, Outlet, NavLink } from 'react-router';
import { useEffect } from 'react';
// import './UserAccount.css';

const UserAccount = () => {
  const navigate = useNavigate();
  const auth = useSelector(state => state.auth);

  useEffect(() => {
    if (!auth?.uid) {
      navigate('/login');
    }
  }, [auth]);

  const handleSignOut = () => {
    // Your logout logic here
    navigate('/');
  };

  return (
    <div className="user-account-container">
      <div className="account-wrapper">
        {/* Header */}
        <div className="account-header">
          <div className="user-info">
            <div className="user-avatar">
              <i className="bi bi-person-circle"></i>
            </div>
            <div>
              <h4 className="mb-0">{auth?.displayName || 'User'}</h4>
              <p className="text-muted mb-0">{auth?.email}</p>
            </div>
          </div>
          <button className="btn btn-outline-dark" onClick={handleSignOut}>
            SIGN OUT
          </button>
        </div>

        <div className="account-content">
          {/* Sidebar */}
          <div className="account-sidebar">
            <NavLink 
              to="/account"
              end 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-person"></i>
              <div>
                <h6 className="mb-0">My Profile</h6>
                <small>See your info here.</small>
              </div>
            </NavLink>

            <NavLink 
              to="/account/orders" 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-bag"></i>
              <div>
                <h6 className="mb-0">My Orders</h6>
                <small>Check your order status</small>
              </div>
            </NavLink>

            <NavLink 
              to="/account/wishlist" 
              className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
            >
              <i className="bi bi-heart"></i>
              <div>
                <h6 className="mb-0">My WishList</h6>
                <small>Check your wishlist</small>
              </div>
            </NavLink>
          </div>

          {/* Main Content - Outlet for nested routes */}
          <div className="account-main">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
