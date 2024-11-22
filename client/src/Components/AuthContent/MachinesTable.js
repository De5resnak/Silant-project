import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Tables.css';
import { useNavigate } from 'react-router-dom';
import { sortData, handleSort, renderSortArrow } from './sortUtils';


const MachinesTable = () => {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortOrder, setSortOrder] = useState("desc");
  const [sortField, setSortField] = useState("shipment_date");
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMachines = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/machines/auth/', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`
          },
            withCredentials: true
        });
        setMachines(response.data);
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMachines();
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
    const sortedData = sortData(machines, field, newOrder);
    setMachines(sortedData);
  };

  const handleRowClick = (machineId) => {
    navigate(`/machines/${machineId}`);
  };

  return (
    <div className="table-container">
      <p className='table-label'>Таблица Машин</p>
      <table className="table">
        <thead>
        <tr>
          <th onClick={() => handleSortClick("serial_number")}>
            Зав. № машины {renderSortArrow("serial_number", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("equipment_model.name")}>
            Модель техники {renderSortArrow("equipment_model.name", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("engine_model.name")}>
            Модель двигателя {renderSortArrow("engine_model.name", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("engine_serial_number")}>
            Зав. № двигателя {renderSortArrow("engine_serial_number", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("transmission_model.name")}>
            Модель трансмиссии {renderSortArrow("transmission_model", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("transmission_serial_number")}>
            Зав. № трансмиссии {renderSortArrow("transmission_serial_number", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("driving_bridge_model.name")}>
            Модель ведущего моста {renderSortArrow("driving_bridge_model.name", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("driving_bridge_serial_number")}>
            Зав. № ведущего моста {renderSortArrow("driving_bridge_serial_number", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("controlled_bridge_model.name")}>
            Модель управляемого моста {renderSortArrow("controlled_bridge_model.name", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("controlled_bridge_serial_number")}>
            Зав. № управляемого моста {renderSortArrow("controlled_bridge_serial_number", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("contract_number_date")}>
            Номер договора {renderSortArrow("contract_number_date", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("shipment_date")}>
            Дата отгрузки {renderSortArrow("shipment_date", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("consignee")}>
            Грузополучатель {renderSortArrow("consignee", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("delivery_address")}>
            Адрес поставки {renderSortArrow("delivery_address", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("configuration")}>
            Комплектация {renderSortArrow("configuration", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("client")}>
            Клиент {renderSortArrow("client", sortField, sortOrder)}
          </th>
          <th onClick={() => handleSortClick("service_company.name")}>
            Сервисная компания {renderSortArrow("service_company.name", sortField, sortOrder)}
          </th>
        </tr>
        </thead>
        <tbody>
        {machines.length > 0 ? (
            machines.map((machine) => (
                <tr key={machine.serial_number} onClick={() => handleRowClick(machine.id)}
                    style={{cursor: 'pointer'}}>
                  <td>{machine.serial_number}</td>
                  <td>{machine.equipment_model?.name || 'N/A'}</td>
                  <td>{machine.engine_model?.name || 'N/A'}</td>
                  <td>{machine.engine_serial_number}</td>
                  <td>{machine.transmission_model?.name || 'N/A'}</td>
                  <td>{machine.transmission_serial_number}</td>
                  <td>{machine.driving_bridge_model?.name || 'N/A'}</td>
                  <td>{machine.driving_bridge_serial_number}</td>
                  <td>{machine.controlled_bridge_model?.name || 'N/A'}</td>
                  <td>{machine.controlled_bridge_serial_number}</td>
                  <td>{machine.contract_number_date}</td>
                  <td>{machine.shipment_date}</td>
                  <td>{machine.consignee}</td>
                  <td>{machine.delivery_address}</td>
                  <td>{machine.configuration}</td>
                  <td>{machine.client}</td>
                  <td>{machine.service_company.name}</td>
                </tr>
            ))
        ) : (
            <tr>
              <td colSpan="10">Данные о машинах не найдены</td>
            </tr>
        )}
        </tbody>
      </table>
    </div>
  );
};

export default MachinesTable;
