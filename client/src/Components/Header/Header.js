import React, { useState, useContext } from 'react';
import './Header.css';
import logo1 from '../../assets/images/logo.jpg';
import logo2 from '../../assets/images/logo2.svg';
import tg from '../../assets/icons/tg-icon.webp';
import AuthModal from '../AuthModal/AuthModal';
import { AuthContext } from '../../context/AuthContext';

const Header = () => {
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
    const { isAuthenticated, logout } = useContext(AuthContext);

    const handleAuthClick = () => {
        setIsAuthModalOpen(true);
    };

    const closeAuthModal = () => {
        setIsAuthModalOpen(false);
    };

    return (
        <header className='header'>
            <div className='header-layer1'>
                <div className='logos'>
                    <div className='logo-container'>
                        <img src={logo1} alt='Логотип' className='logo'></img>
                    </div>
                    <div className='logo-container'>
                        <img src={logo2} alt='Логотип' className='logo'></img>
                    </div>
                </div>
                <div className='header-contacts-container'>
                    <p className='header-contacts'>+7-8352-20-12-09</p>
                    <a href='https://t.me/chzsa21'>
                        <img src={tg} className='tg-icon'></img>
                    </a>
                </div>
                <div className='header-auth-container'>
                    {isAuthenticated ? ( // Условная отрисовка кнопок
                        <button className='header-auth' onClick={logout}>Выйти</button> // Кнопка выхода
                    ) : (
                        <button className='header-auth' onClick={handleAuthClick}>Авторизация</button> // Кнопка авторизации
                    )}
                </div>
            </div>
            <div className='header-text-container'>
                <h1 className='header-text'>Электронная сервисная книжка "Мой Силант"</h1>
            </div>
            <AuthModal isOpen={isAuthModalOpen} onClose={closeAuthModal} />
        </header>
    );
};

export default Header;
