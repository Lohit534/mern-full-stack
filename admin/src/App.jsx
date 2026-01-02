import React, { useEffect, useState } from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import { Route, Routes, Navigate } from 'react-router-dom'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './pages/Login/Login'
import { url } from './assets/assets'

const App = () => {

  const [token, setToken] = useState("");

  useEffect(() => {
    if (localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"))
    }
  }, [])

  return (
    <div className='app'>
      <ToastContainer />
      <Navbar setToken={setToken} />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={token ? <Add url={url} token={token} /> : <Login setToken={setToken} url={url} />} />
          <Route path="/list" element={token ? <List url={url} token={token} /> : <Login setToken={setToken} url={url} />} />
          <Route path="/orders" element={token ? <Orders url={url} token={token} /> : <Login setToken={setToken} url={url} />} />
          <Route path="/login" element={<Login setToken={setToken} url={url} />} />
          <Route path="*" element={token ? <Navigate to="/add" /> : <Login setToken={setToken} url={url} />} />
        </Routes>
      </div>
    </div>
  )
}

export default App