import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './AllMachines.css'

const AllMachines = ({ apiUrl, machineData }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Функция для загрузки данных
    const fetchData = async () => {
      if (!machineData) {
        try {
          const response = await axios.get(apiUrl);
          setData(response.data);
          setError(null);
        } catch (error) {
          setError("Ошибка загрузки данных: " + error.message);
        } finally {
          setLoading(false);
        }
      } else {
        setData(machineData); // Устанавливаем данные поиска, если они переданы
        setLoading(false);
        setError(null);
      }
    };

    fetchData();
  }, [apiUrl, machineData]);

  // Заглушка на время загрузки данных
  if (loading) {
    return <div className='loading-message'>Загрузка данных...</div>;
  }

  // Сообщение об ошибке
  if (error) {
    return <div className='error-message'>Ошибка загрузки: {error}</div>;
  }

  // Рендер данных в табличном формате
  return (
  <div className="table-container">
    <table className="guest-table">
      <thead>
      <tr>
        <th>Зав. № машины</th>
        <th>Модель техники</th>
        <th>Модель двигателя</th>
        <th>Зав. № двигателя</th>
        <th>Модель трансмиссии</th>
        <th>Зав. № трансмиссии</th>
        <th>Модель ведущего моста</th>
        <th>Зав. № ведущего моста</th>
        <th>Модель управляемого моста</th>
        <th>Зав. № управляемого моста</th>
      </tr>
      </thead>
      <tbody>
      {data.length > 0 ? (
          data.map((machine) => (
              <tr key={machine.serial_number}>
                <td>{machine.serial_number}</td>
                <td>{machine.equipment_model}</td>
                <td>{machine.engine_model}</td>
                <td>{machine.engine_serial_number}</td>
                <td>{machine.transmission_model}</td>
                <td>{machine.transmission_serial_number}</td>
                <td>{machine.driving_bridge_model}</td>
                <td>{machine.driving_bridge_serial_number}</td>
                <td>{machine.controlled_bridge_model}</td>
                <td>{machine.controlled_bridge_serial_number}</td>
              </tr>
          ))
      ) : (
          <tr>
            <td colSpan="10" className="no-results-message">Машина с таким заводским номером не найдена</td>
          </tr>
      )}
      </tbody>
    </table>
  </div>
  );
};

export default AllMachines;
