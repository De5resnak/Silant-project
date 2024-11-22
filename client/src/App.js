import './App.css';
import AuthProvider, { AuthContext } from './context/AuthContext';
import Header from "./Components/Header/Header";
import Footer from "./Components/Footer/Footer";
import GuestContent from "./Components/GuestContent/GuestContent";
import AuthContent from "./Components/AuthContent/AuthContent";
import React, { useEffect, useState, useContext } from 'react';
import ReclamationDetails from "./Components/AuthContent/ReclamationDetails";
import MachineDetails from "./Components/AuthContent/MachineDetails";
import MaintenceDetails from "./Components/AuthContent/MaintenceDetails";
import axios from 'axios';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';

const App = () => (
  <AuthProvider>
    <Router>
      <AppContent />
    </Router>
  </AuthProvider>
);

const AppContent = () => {
  const [role, setRole] = useState('guest'); // начальная роль — гость
  const [error, setError] = useState(null);
  const { isAuthenticated } = useContext(AuthContext); // Получаем состояние аутентификации

  useEffect(() => {
    // Запрашиваем роль пользователя при загрузке компонента
    const fetchUserRole = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/role/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setRole(response.data.role);
      } catch (error) {
        setError("Не удалось получить роль пользователя");
      }
    };

    // Выполняем запрос только если пользователь аутентифицирован
    if (isAuthenticated) {
      fetchUserRole();
    }
  }, [isAuthenticated]);

  return (
    <div className="App">
      <Header />

      <Routes>
        <Route path="/" element={role === 'guest' ? <GuestContent /> : <AuthContent role={role} />} />
        <Route path="/reclamations/:id" element={<ReclamationDetails />} />
        <Route path="/machines/:id" element={<MachineDetails />} />
        <Route path="/maintenance/:id" element={<MaintenceDetails />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>

      <Footer />
    </div>
  );
};

export default App;
