import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tables.css';
import { sortData, handleSort, renderSortArrow } from './sortUtils';
import { useNavigate } from 'react-router-dom';

const ReclamationsTable = () => {
  const [reclamations, setReclamations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState('desc');
  const [sortField, setSortField] = useState('failure_date');
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Используем useNavigate вместо useHistory

  useEffect(() => {
    const fetchReclamations = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/reclamations/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
          withCredentials: true,
        });
        setReclamations(response.data);
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamations();
  }, []);

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSortClick = (field) => {
    const newOrder = sortField === field && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortField(field);
    setSortOrder(newOrder);
    const sortedData = sortData(reclamations, field, newOrder);
    setReclamations(sortedData);
  };

  const handleRowClick = (id) => {
    navigate(`/reclamations/${id}`); // Перенаправление с id
  };

  return (
    <div className="table-container">
      <p className='table-label'>Таблица Рекламаций</p>
      <table className="table">
        <thead>
          <tr>
            <th onClick={() => handleSortClick('failure_node.name')}>
              Узел отказа {renderSortArrow('failure_node.name', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('failure_date')}>
              Дата отказа {renderSortArrow('failure_date', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('description')}>
              Описание отказа {renderSortArrow('description', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('recovery_method')}>
              Способ восстановления {renderSortArrow('recovery_method', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('parts_used')}>
              Запасные части {renderSortArrow('parts_used', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('recovery_date')}>
              Дата восстановления {renderSortArrow('recovery_date', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('downtime')}>
              Время простоя (часы) {renderSortArrow('downtime', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('operating_time')}>
              Наработка (м/час) {renderSortArrow('operating_time', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('machine.serial_number')}>
              Зав. № машины {renderSortArrow('machine.serial_number', sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick('service_company.name')}>
              Сервисная компания {renderSortArrow('service_company.name', sortField, sortOrder)}
            </th>
          </tr>
        </thead>
        <tbody>
          {reclamations.length > 0 ? (
            reclamations.map((reclamation) => (
              <tr key={reclamation.id} onClick={() => handleRowClick(reclamation.id)}>
                <td>{reclamation.failure_node?.name || 'N/A'}</td>
                <td>{reclamation.failure_date}</td>
                <td>{reclamation.description}</td>
                <td>{reclamation.recovery_method?.name || 'N/A'}</td>
                <td>{reclamation.parts_used}</td>
                <td>{reclamation.recovery_date}</td>
                <td>{reclamation.downtime}</td>
                <td>{reclamation.operating_time}</td>
                <td>{reclamation.machine?.serial_number || 'N/A'}</td>
                <td>{reclamation.service_company?.name || 'N/A'}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="10">Данные о рекламациях не найдены</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ReclamationsTable;
