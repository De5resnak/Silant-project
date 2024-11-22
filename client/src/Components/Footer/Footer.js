import React from 'react';
import './Footer.css';
import tg from "../../assets/icons/tg-icon.webp";  // Файл с CSS-стилями

const Footer = () => {
  return (
    <footer className="footer">
        <div className="footer-content">
            <div className='footer-contacts-container'>
                <p className='footer-contacts'>+7-8352-20-12-09</p>
                <a href='https://t.me/chzsa21'>
                    <img src={tg} className='tg-icon' alt=''></img>
                </a>
            </div>
            <p className='footer-title'>Мой Силант 2024</p>
        </div>
    </footer>
  );
};

export default Footer;