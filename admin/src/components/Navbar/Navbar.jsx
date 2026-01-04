import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { googleLogout } from '@react-oauth/google'

const Navbar = ({ setToken, token }) => {

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
    googleLogout(); // Clear Google session
    window.location.reload(); // Ensure clean state
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      {token ? <div className="navbar-profile">
        <img className='profile' src={assets.profile_image} alt="" />
        <ul className='navbar-profile-dropdown'>
          <li onClick={logout}> <img src={assets.parcel_icon} alt="" /> <p>Logout</p></li>
        </ul>
      </div> : <></>}
    </div>
  )
}

export default Navbar
