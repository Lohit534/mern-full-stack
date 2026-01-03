import React, { useState } from 'react'
import Home from './pages/Home/Home'
import Footer from './components/Footer/Footer'
import Navbar from './components/Navbar/Navbar'
import { Route, Routes } from 'react-router-dom'
import Cart from './pages/Cart/Cart'
import LoginPopup from './components/LoginPopup/LoginPopup'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import MyOrders from './pages/MyOrders/MyOrders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify/Verify'
import AuthNotification from './components/AuthNotification/AuthNotification'

const App = () => {

  const [showLogin, setShowLogin] = useState(true);
  const [authNotification, setAuthNotification] = useState(null);

  const showAuthNotification = (message, type = 'success') => {
    setAuthNotification({ message, type });
  };

  const closeAuthNotification = () => {
    setAuthNotification(null);
  };

  return (
    <>
      <ToastContainer position="top-right" />
      {authNotification && (
        <AuthNotification
          message={authNotification.message}
          type={authNotification.type}
          onClose={closeAuthNotification}
        />
      )}
      {showLogin ? <LoginPopup setShowLogin={setShowLogin} showAuthNotification={showAuthNotification} /> : <></>}
      <div className='app'>
        <Navbar setShowLogin={setShowLogin} showAuthNotification={showAuthNotification} />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/cart' element={<Cart />} />
          <Route path='/order' element={<PlaceOrder />} />
          <Route path='/myorders' element={<MyOrders />} />
          <Route path='/verify' element={<Verify />} />
        </Routes>
      </div>
      <Footer />
    </>
  )
}

export default App
