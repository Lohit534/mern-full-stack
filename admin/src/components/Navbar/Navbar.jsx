import React from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'

const Navbar = ({ setToken }) => {

  const logout = () => {
    localStorage.removeItem("token");
    setToken("");
  }

  return (
    <div className='navbar'>
      <img className='logo' src={assets.logo} alt="" />
      <div className="navbar-profile">
        <img className='profile' src={assets.profile_image} alt="" />
        <ul className='navbar-profile-dropdown'>
          <li onClick={logout}> <img src={assets.parcel_icon} alt="" /> <p>Logout</p></li>
        </ul>
      </div>
    </div>
  )
}

export default Navbar
