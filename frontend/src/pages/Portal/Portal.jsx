import React from 'react'
import './Portal.css'
import { assets } from '../../assets/assets'

import { useNavigate } from 'react-router-dom'

const Portal = () => {
    const navigate = useNavigate();
    return (
        <div className='portal'>
            <div className="portal-container">
                <h1>Select Your Role</h1>
                <div className="portal-options">
                    <div className="portal-card" onClick={() => navigate('/home')}>
                        <img src={assets.logo} alt="User" />
                        <h2>User</h2>
                        <p>Order delicious food</p>
                    </div>
                    <div className="portal-card" onClick={() => window.location.href = 'https://foodie-del-admin.onrender.com/'}>
                        <img src={assets.profile_icon} alt="Admin" style={{ width: '80px', height: '80px', objectFit: 'contain' }} />
                        <h2>Admin</h2>
                        <p>Manage restaurant & orders</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Portal
