import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [message, setMessage] = useState('');
    const [type, setType] = useState('success');
    const [isVisible, setIsVisible] = useState(false);

    const showNotification = useCallback((msg, notificationType = 'success', duration = 3000) => {
        setMessage(msg);
        setType(notificationType);
        setIsVisible(true);

        const timer = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => clearTimeout(timer);
    }, []);

    const contextValue = {
        showNotification,
    };

    return (
        <NotificationContext.Provider value={contextValue}>
            {children}
            <ToastComponent message={message} type={type} isVisible={isVisible} />
        </NotificationContext.Provider>
    );
};

const ToastComponent = ({ message, type, isVisible }) => {
    if (!isVisible) return null;

    const style = {
        position: 'fixed',
        bottom: '20px',
        left: '50%',
        transform: 'translateX(-50%)',
        padding: '15px 25px',
        borderRadius: '8px',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1em',
        zIndex: 1000, 
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        backgroundColor: type === 'error' ? '#FF5733' : type === 'info' ? '#3498db' : '#27ae60',
        transition: 'opacity 0.3s ease-in-out',
        opacity: isVisible ? 1 : 0
    };

    return <div style={style}>{message}</div>;
};