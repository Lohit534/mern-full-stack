import React, { useContext, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google';
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import axios from 'axios'
import { toast } from 'react-toastify'

const LoginPopup = ({ setShowLogin, showAuthNotification }) => {

    const { setToken, url, loadCartData } = useContext(StoreContext)
    const [currState, setCurrState] = useState("Sign Up");
    const [showPassword, setShowPassword] = useState(false);

    const [data, setData] = useState({
        name: "",
        email: "",
        password: ""
    })

    const onChangeHandler = (event) => {
        const name = event.target.name
        const value = event.target.value
        setData(data => ({ ...data, [name]: value }))
    }

    const onLogin = async (e) => {
        e.preventDefault()

        let new_url = url;
        if (currState === "Login") {
            new_url += "/api/user/login";
        }
        else {
            new_url += "/api/user/register"
        }
        try {
            const response = await axios.post(new_url, data);
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem("token", response.data.token)
                loadCartData({ token: response.data.token })
                setShowLogin(false)
                showAuthNotification(currState === "Login" ? "Successfully logged in!" : "Account created successfully!");
            }
            else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error("Network Error. Please check your connection.")
            console.error(error)
        }
    }

    return (
        <div className='login-popup'>
            <form onSubmit={onLogin} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>{currState}</h2> <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    {currState === "Sign Up" ? <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Your name' required /> : <></>}
                    <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='Your email' />
                    <div className="password-input-wrapper">
                        <input name='password' onChange={onChangeHandler} value={data.password} type={showPassword ? "text" : "password"} placeholder='Password' required />
                        <span className="password-toggle-icon" onClick={() => setShowPassword(!showPassword)}>
                            {showPassword ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 16 16">
                                    <path d="M10.5 8a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0z" />
                                    <path d="M0 8s3-5.5 8-5.5S16 8 16 8s-3 5.5-8 5.5S0 8 0 8zm8 3.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7z" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="gray" viewBox="0 0 16 16">
                                    <path d="m10.79 12.912-1.614-1.615a3.5 3.5 0 0 1-4.474-4.474l-2.06-2.06C.938 6.278 0 8 0 8s3 5.5 8 5.5a7.029 7.029 0 0 0 2.79-.588zM5.21 3.088A7.028 7.028 0 0 1 8 2.5c5 0 8 5.5 8 5.5s-.939 1.721-2.641 3.238l-2.062-2.062a3.5 3.5 0 0 0-4.474-4.474L5.21 3.089z" />
                                    <path d="M5.525 7.646a2.5 2.5 0 0 0 2.829 2.829l-2.829-2.829zm4.95.708-2.829-2.83a2.5 2.5 0 0 1 2.829 2.829zm3.171 6-12-12 .708-.708 12 12-.708.708z" />
                                </svg>
                            )}
                        </span>
                    </div>
                </div>
                <button>{currState === "Login" ? "Login" : "Create account"}</button>
                <div className="login-divider">
                    <span>or continue with</span>
                </div>
                <div className="google-login-wrapper">
                    <GoogleLogin
                        useOneTap={false}
                        text={currState === "Login" ? "signin_with" : "signup_with"}
                        onSuccess={async (credentialResponse) => {
                            try {
                                const response = await axios.post(`${url}/api/user/google-login`, {
                                    credential: credentialResponse.credential
                                });

                                if (response.data.success) {
                                    setToken(response.data.token);
                                    localStorage.setItem("token", response.data.token);
                                    loadCartData({ token: response.data.token });
                                    setShowLogin(false);
                                    showAuthNotification(`Welcome ${response.data.user.name}!`);
                                } else {
                                    toast.error(response.data.message);
                                }
                            } catch (error) {
                                console.error('Google login error:', error);
                                toast.error("Google authentication failed. Please try again.");
                            }
                        }}
                        onError={() => {
                            console.log('Login Failed');
                            toast.error("Google Login Failed");
                        }}
                    />
                </div>
                <div className="login-popup-condition">
                    <input type="checkbox" name="" id="" required />
                    <p>By continuing, i agree to the terms of use & privacy policy.</p>
                </div>
                {currState === "Login"
                    ? <p>Create a new account? <span onClick={() => setCurrState('Sign Up')}>Click here</span></p>
                    : <p>Already have an account? <span onClick={() => setCurrState('Login')}>Login here</span></p>
                }
            </form>
        </div>
    )
}

export default LoginPopup
