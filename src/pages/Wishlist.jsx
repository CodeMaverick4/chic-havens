import { useNavigate } from 'react-router';

const Wishlist = () => {
  const navigate = useNavigate();

  return (
    <div className="wishlist-content">
      <h3 className="mb-4">My Wishlist</h3>
      <div className="text-center py-5">
        <i className="bi bi-heart" style={{ fontSize: '60px', color: '#ccc' }}></i>
        <h5 className="mt-3">Your wishlist is empty</h5>
        <p className="text-muted">Save your favorite items here!</p>
        <button className="btn btn-dark mt-3" onClick={() => navigate('/')}>
          Browse Products
        </button>
      </div>
    </div>
  );
};

export default Wishlist;
