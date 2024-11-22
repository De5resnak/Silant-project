import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import './Details.css'

const MaintenanceDetail = () => {
  const { id } = useParams(); // id - это pk
  const [maintenance, setMaintenance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMaintenance, setUpdatedMaintenance] = useState({});
  const [maintenanceTypes, setMaintenanceTypes] = useState([]); // Для списка типов ТО
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');

  // Загружаем детали ТО и список типов ТО
  useEffect(() => {
    const fetchMaintenanceDetail = async () => {
      try {
        const [maintenanceResponse, typesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/maintenance/${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }),
          axios.get(`http://localhost:8000/api/maintenance/maintenance-types/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }),
        ]);
        setMaintenance(maintenanceResponse.data);
        setUpdatedMaintenance(maintenanceResponse.data);
        setMaintenanceTypes(typesResponse.data); // Сохраняем список типов ТО
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMaintenanceDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMaintenance((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...updatedMaintenance,
        maintenance_type: updatedMaintenance.maintenance_type?.id || updatedMaintenance.maintenance_type, // Передаем ID типа ТО
        machine: updatedMaintenance.machine?.id || updatedMaintenance.machine, // Передаем ID машины
      };

      await axios.put(
        `http://localhost:8000/api/maintenance/${id}/edit/`, // Путь для редактирования
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      setMaintenance(updatedData); // Обновляем локальное состояние
      setIsEditing(false); // Заканчиваем редактирование
    } catch (error) {
      setError('Ошибка при сохранении данных: ' + error.message);
    }
  };

  if (loading) {
    return <div>Загрузка данных...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="details-container">
      <h2>Детали ТО</h2>

      {/* Вид ТО */}
      <p>
        <strong>Вид ТО:</strong>{' '}
        {isEditing ? (
          <select
            name="maintenance_type"
            value={updatedMaintenance.maintenance_type?.id || ''}
            onChange={(e) =>
              setUpdatedMaintenance((prev) => ({
                ...prev,
                maintenance_type: maintenanceTypes.find(
                  (type) => type.id === parseInt(e.target.value, 10)
                ),
              }))
            }
          >
            <option value="">Выберите тип ТО</option>
            {maintenanceTypes.map((type) => (
              <option key={type.id} value={type.id}>
                {type.name}
              </option>
            ))}
          </select>
        ) : (
          maintenance.maintenance_type?.name
        )}
      </p>

      {/* Описание ТО */}
      <p>
        <strong>Описание ТО:</strong>{' '}
        {isEditing ? (
          <textarea
            name="description"
            value={updatedMaintenance.description || ''}
            onChange={handleChange}
            rows="4"
            cols="50"
          />
        ) : (
          maintenance.maintenance_type?.description
        )}
      </p>

      {/* Дата проведения ТО */}
      <p>
        <strong>Дата проведения ТО:</strong>{' '}
        {isEditing ? (
          <input
            type="date"
            name="maintenance_date"
            value={updatedMaintenance.maintenance_date || ''}
            onChange={handleChange}
          />
        ) : (
          maintenance.maintenance_date
        )}
      </p>

      {/* Наработка, м/час */}
      <p>
        <strong>Наработка, м/час:</strong>{' '}
        {isEditing ? (
          <input
            type="number"
            name="operating_hours"
            value={updatedMaintenance.operating_hours || ''}
            onChange={handleChange}
          />
        ) : (
          maintenance.operating_hours
        )}
      </p>

      {/* № заказ-наряда */}
      <p>
        <strong>№ заказ-наряда:</strong>{' '}
        {isEditing ? (
          <input
            type="text"
            name="order_number"
            value={updatedMaintenance.order_number || ''}
            onChange={handleChange}
          />
        ) : (
          maintenance.order_number
        )}
      </p>

      {/* Дата заказ-наряда */}
      <p>
        <strong>Дата заказ-наряда:</strong>{' '}
        {isEditing ? (
          <input
            type="date"
            name="order_date"
            value={updatedMaintenance.order_date || ''}
            onChange={handleChange}
          />
        ) : (
          maintenance.order_date
        )}
      </p>

      {/* Организация, проводившая ТО */}
      <p>
        <strong>Организация, проводившая ТО:</strong> {maintenance.maintenance_organization?.name}
      </p>

      {/* Описание организации, проводившей ТО */}
      <p>
        <strong>Описание организации, проводившей ТО:</strong> {maintenance.maintenance_organization?.description}
      </p>

      {/* Зав. № машины */}
      <p>
        <strong>Зав. № машины:</strong> {maintenance.machine?.serial_number}
      </p>

      {/* Сервисная компания */}
      <p>
        <strong>Сервисная компания:</strong> {maintenance.service_company?.name}
      </p>

      {/* Описание Сервисной компании */}
      <p>
        <strong>Описание Сервисной компании:</strong> {maintenance.service_company?.description}
      </p>

      {/* Кнопки для редактирования и сохранения */}
      {isEditing ? (
        <button onClick={handleSaveChanges} className="save-button">
          Сохранить изменения
        </button>
      ) : (
        (userRole === 'client' || userRole === 'service_company' || userRole === 'manager') && (
          <button onClick={() => setIsEditing(true)} className="edit-button">
            Редактировать
          </button>
        )
      )}

      <button onClick={() => navigate(-1)} className="edit-button">
        Назад
      </button>
    </div>
  );
};

export default MaintenanceDetail;
