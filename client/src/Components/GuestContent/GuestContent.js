import React, { useEffect, useState } from 'react';
import AllMachines from './AllMachines';
import './GuestContent.css';
import axios from 'axios';

const MACHINES_API_URL = 'http://localhost:8000/api/machines/public/';

const GuestContent = () => {
    const [serialNumber, setSerialNumber] = useState('');
    const [machineData, setMachineData] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllMachines = async () => {
            try {
                const response = await axios.get(MACHINES_API_URL);
                setMachineData(response.data);
                setError(null);
            } catch (error) {
                setError("Не удалось загрузить данные машин");
            }
        };
        fetchAllMachines();
    }, []);

    const handleSearch = async () => {
    try {
      const response = await axios.get(`${MACHINES_API_URL}?serial_number=${serialNumber}`);
      setMachineData(response.data); // обновляем данные таблицы для поиска
      setError(null);
    } catch (error) {
      setError("Не удалось найти машину с таким заводским номером");
      setMachineData(null); // сбрасываем данные таблицы, если произошла ошибка
    }
  };


  return (
      <div className='GuestContent'>
          <p className='Guest-title'>Проверьте комплектацию и технические характеристики техники Силант</p>
          <div className="search-container">
              <input
                  type="text"
                  value={serialNumber}
                  onChange={(e) => setSerialNumber(e.target.value)}
                  placeholder="Введите заводской номер"
                  className="search-input"
              />
              <button onClick={handleSearch} className="search-button">Поиск</button>
          </div>
          {error && <div className="error-message">{error}</div>}
          <AllMachines apiUrl={MACHINES_API_URL} machineData={machineData} />
      </div>
  );
};

export default GuestContent;
