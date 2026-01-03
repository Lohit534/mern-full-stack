import React, { useContext, useEffect, useState } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'
import { googleLogout } from '@react-oauth/google'

const Navbar = ({ setShowLogin, showAuthNotification }) => {

  const [menu, setMenu] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { getTotalCartAmount, token, setToken, search, setSearch, showSearch, setShowSearch } = useContext(StoreContext);
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    googleLogout(); // Clear Google session
    navigate('/')
    showAuthNotification("Successfully logged out!");
  }

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <a href='#explore-menu' onClick={() => setMenu("menu")} className={`${menu === "menu" ? "active" : ""}`}>Menu</a>
        <a href='#app-download' onClick={() => setMenu("mob-app")} className={`${menu === "mob-app" ? "active" : ""}`}>Mobile App</a>
        <a href='#footer' onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact Us</a>
      </ul>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="mobile-menu-overlay" onClick={() => setMobileMenuOpen(false)}>
          <div className="mobile-menu-content" onClick={(e) => e.stopPropagation()}>
            <div className="mobile-menu-header">
              <img className='logo' src={assets.logo} alt="" />
              <img src={assets.cross_icon} onClick={() => setMobileMenuOpen(false)} className="close-icon" alt="" />
            </div>
            <ul className="mobile-menu-list">
              <Link to="/" onClick={() => { setMenu("home"); setMobileMenuOpen(false) }} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
              <a href='#explore-menu' onClick={() => { setMenu("menu"); setMobileMenuOpen(false) }} className={`${menu === "menu" ? "active" : ""}`}>Menu</a>
              <a href='#app-download' onClick={() => { setMenu("mob-app"); setMobileMenuOpen(false) }} className={`${menu === "mob-app" ? "active" : ""}`}>Mobile App</a
              ><a href='#footer' onClick={() => { setMenu("contact"); setMobileMenuOpen(false) }} className={`${menu === "contact" ? "active" : ""}`}>Contact Us</a>
            </ul>
          </div>
        </div>
      )}

      <div className="navbar-right">
        <div className="navbar-search-container">
          <img onClick={() => setShowSearch(prev => !prev)} src={assets.search_icon} alt="" className="cursor" />
          {showSearch && (
            <div className="navbar-search-bar">
              <input
                type="text"
                placeholder="Search food..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                autoFocus
              />
              <img onClick={() => { setSearch(""); setShowSearch(false) }} src={assets.cross_icon} alt="" className="cursor" />
            </div>
          )}
        </div>
        <Link to='/cart' className='navbar-search-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {!token ? <button onClick={() => setShowLogin(true)}>sign in</button>
          : <div className='navbar-profile'>
            <img src={assets.profile_icon} alt="" />
            <ul className='navbar-profile-dropdown'>
              <li onClick={() => navigate('/myorders')}> <img src={assets.bag_icon} alt="" /> <p>Orders</p></li>
              <hr />
              <li onClick={logout}> <img src={assets.logout_icon} alt="" /> <p>Logout</p></li>
            </ul>
          </div>
        }
        <div className="navbar-hamburger" onClick={() => setMobileMenuOpen(true)}>
          <div className="bar"></div>
          <div className="bar"></div>
          <div className="bar"></div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
