import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import MainPage from './pages/MainPage';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import OrderSuccess from './pages/OrderSuccess';
import { Route, Routes } from 'react-router';
import UserAccount from './pages/userAccount';
import Profile from './pages/ProfilePage';
import OrderHistory from './pages/OrderHistory';
import Wishlist from './pages/Wishlist';
import ProtectedRoute from './components/ProtectedRoute';
import QuickView from './pages/Quickview';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainPage />}>
        <Route index element={<Home />} />
        
        {/* Protected Checkout Route */}
        <Route 
          path="/checkout" 
          element={
            <ProtectedRoute>
              <Checkout />
            </ProtectedRoute>
          } 
        />
        
        <Route path="/product/:productId" element={<QuickView />}/>
        {/* Protected Account Routes */}
        <Route 
          path="/account" 
          element={
            <ProtectedRoute>
              <UserAccount />
            </ProtectedRoute>
          }
        >
          <Route index element={<Profile />} />
          <Route path="orders" element={<OrderHistory />} />
          <Route path="wishlist" element={<Wishlist />} />
        </Route>
        
        {/* Protected Order Success Route */}
        <Route path="/order-success/:orderId" element={<ProtectedRoute><OrderSuccess /></ProtectedRoute>} />
        
      </Route>
    </Routes>
  )
}

export default App;
