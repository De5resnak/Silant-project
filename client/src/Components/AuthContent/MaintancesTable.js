import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tables.css';
import { sortData, handleSort, renderSortArrow } from './sortUtils';
import { useNavigate } from 'react-router-dom';

const MaintenancesTable = () => {
  const [maintenances, setMaintenances] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortField, setSortField] = useState("maintenance_date");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMaintenances = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/maintenance/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
          withCredentials: true
        });
        setMaintenances(response.data);
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenances();
  }, []);

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const handleSortClick = (field) => {
    const newOrder = sortField === field && sortOrder === "asc" ? "desc" : "asc";
    setSortField(field);
    setSortOrder(newOrder);
    const sortedData = sortData(maintenances, field, newOrder);
    setMaintenances(sortedData);
  };

  const handleRowClick = (id) => {
    // Редирект на страницу с полной информацией о ТО
    navigate(`/maintenance/${id}`);
  };

  return (
      <div className="table-container">
        <p className='table-label'>Таблица Технического обслуживания</p>
        <table className="table">
          <thead>
          <tr>
            <th onClick={() => handleSortClick("maintenance_type.name")}>
              Вид ТО {renderSortArrow("maintenance_type.name", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("maintenance_date")}>
              Дата проведения ТО {renderSortArrow("maintenance_date", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("operating_hours")}>
              Наработка, м/час {renderSortArrow("operating_hours", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("order_number")}>
              № заказ-наряда {renderSortArrow("order_number", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("order_date")}>
              Дата заказ-наряда {renderSortArrow("order_date", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("maintenance_organization.name")}>
              Организация ТО {renderSortArrow("maintenance_organization.name", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("machine.serial_number")}>
              Зав. № машины {renderSortArrow("machine.serial_number", sortField, sortOrder)}
            </th>
            <th onClick={() => handleSortClick("service_company.name")}>
              Сервисная компания {renderSortArrow("service_company.name", sortField, sortOrder)}
            </th>
          </tr>
          </thead>
          <tbody>
          {maintenances.length > 0 ? (
              maintenances.map((maintenance) => (
                  <tr key={maintenance.id} onClick={() => handleRowClick(maintenance.id)}>
                    <td>{maintenance.maintenance_type?.name || 'N/A'}</td>
                    <td>{maintenance.maintenance_date}</td>
                    <td>{maintenance.operating_hours}</td>
                    <td>{maintenance.order_number}</td>
                    <td>{maintenance.order_date}</td>
                    <td>{maintenance.maintenance_organization?.name || 'N/A'}</td>
                    <td>{maintenance.machine?.serial_number || 'N/A'}</td>
                    <td>{maintenance.service_company?.name || 'N/A'}</td>
                  </tr>
              ))
          ) : (
              <tr>
                <td colSpan="8">Данные о ТО не найдены</td>
              </tr>
          )}
          </tbody>
        </table>
      </div>
  );
};

export default MaintenancesTable;
