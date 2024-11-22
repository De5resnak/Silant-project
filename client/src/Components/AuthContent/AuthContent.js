import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AuthContent.css'
import './MachinesTable'
import MachinesTable from "./MachinesTable";
import MaintenancesTable from "./MaintancesTable";
import ReclamationsTable from "./ReclamationsTable";


const AuthContent = ({role}) => {
    const [companyName, setCompanyName] = useState(null);
    const [error, setError] = useState(null);
    const [activeTable, setActiveTable] = useState('machines');

     useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/users/company/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          }
        });
        setCompanyName(response.data.company_name); // Сохраняем название компании
      } catch (error) {
        setError("Не удалось получить название компании");
      }
    };

    if (role) {
            localStorage.setItem('userRole', role);
        }

    fetchCompanyName();
  }, []);

  if (error) {
    return <div>{error}</div>;
  }

  const handleTableChange = (table) => {
    setActiveTable(table);
  };


  return (
    <div className='AuthContent'>
        <div className='AuthContent-title-container'>
            <p className='AuthContent-role'>Ваша роль: {role}</p>
            {companyName && <p>Название компании: {companyName}</p>}
            <div className='AuthContent-info-container'>
                <p className='AuthContent-info-title'>Информация о комплектации и технических характеристиках Вашей
                техники</p>
            </div>
        </div>
        <div className='AuthContent-main-block'>
            <div className='AuthContent-button-container'>
                <button
                    className='AuthContent-selector-button'
                    onClick={() => handleTableChange('machines')}
                >
                    Машины
                </button>
                <button
                    className='AuthContent-selector-button'
                    onClick={() => handleTableChange('maintenance')}
                >
                    ТО
                </button>
                <button
                    className='AuthContent-selector-button'
                    onClick={() => handleTableChange('reclamations')}
                >
                    Рекламации
                </button>
            </div>
            {activeTable === 'machines' && <MachinesTable />}
            {activeTable === 'maintenance' && <MaintenancesTable />}
            {activeTable === 'reclamations' && <ReclamationsTable />}
        </div>
    </div>
  );
}

export default AuthContent;