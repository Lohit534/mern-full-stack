import React, { useEffect } from 'react';
import './AuthNotification.css';

const AuthNotification = ({ message, type, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose();
        }, 2500);

        return () => clearTimeout(timer);
    }, [onClose]);

    return (
        <div className="auth-notification-overlay" onClick={onClose}>
            <div className="auth-notification-modal" onClick={(e) => e.stopPropagation()}>
                <div className={`auth-notification-content ${type}`}>
                    <div className="auth-notification-icon">
                        {type === 'success' ? (
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                                <polyline points="22 4 12 14.01 9 11.01"></polyline>
                            </svg>
                        ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <line x1="12" y1="8" x2="12" y2="12"></line>
                                <line x1="12" y1="16" x2="12.01" y2="16"></line>
                            </svg>
                        )}
                    </div>
                    <p className="auth-notification-message">{message}</p>
                </div>
            </div>
        </div>
    );
};

export default AuthNotification;
