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
      <Routes>
        <Route path="/login" element={<Login setToken={setToken} url={url} />} />
        <Route path="/*" element={
          !token ? <Navigate to="/login" /> : (
            <>
              <Navbar setToken={setToken} />
              <hr />
              <div className="app-content">
                <Sidebar />
                <Routes>
                  <Route path="/add" element={<Add url={url} token={token} />} />
                  <Route path="/list" element={<List url={url} token={token} />} />
                  <Route path="/orders" element={<Orders url={url} token={token} />} />
                  <Route path="*" element={<Navigate to="/add" />} />
                </Routes>
              </div>
            </>
          )
        } />
      </Routes>
    </div>
  )
}

export default App