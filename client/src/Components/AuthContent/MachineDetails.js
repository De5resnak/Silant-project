import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const MachineDetail = () => {
  const { id } = useParams(); // id - это pk машины
  const [machine, setMachine] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedMachine, setUpdatedMachine] = useState({});
  const [models, setModels] = useState({
    equipmentModels: [],
    engineModels: [],
    transmissionModels: [],
    drivingBridgeModels: [],
    controlledBridgeModels: [],
  });
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole'); // Получаем роль пользователя

  // Загружаем данные машины и модели
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [machineResponse, modelsResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/machines/${id}/`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
          }),
          axios.all([
            axios.get('http://localhost:8000/api/machines/reference/Модель техники/'),
            axios.get('http://localhost:8000/api/machines/reference/Модель двигателя/'),
            axios.get('http://localhost:8000/api/machines/reference/Модель трансмиссии/'),
            axios.get('http://localhost:8000/api/machines/reference/Модель ведущего моста/'),
            axios.get('http://localhost:8000/api/machines/reference/Модель управляемого моста/'),
          ])
        ]);

        setMachine(machineResponse.data);
        setUpdatedMachine(machineResponse.data); // Инициализируем данные для редактирования

        const [equipmentResponse, engineResponse, transmissionResponse, drivingBridgeResponse, controlledBridgeResponse] = modelsResponse;
        setModels({
          equipmentModels: equipmentResponse.data,
          engineModels: engineResponse.data,
          transmissionModels: transmissionResponse.data,
          drivingBridgeModels: drivingBridgeResponse.data,
          controlledBridgeModels: controlledBridgeResponse.data,
        });
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedMachine((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      await axios.put(
        `http://localhost:8000/api/machines/${id}/edit/`,
        updatedMachine,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      setMachine(updatedMachine); // Обновляем локальное состояние
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
          <h2>Детали Машины</h2>

          {/* Зав. № машины */}
          <p>
              <strong>Зав. № машины:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="serial_number"
                      value={updatedMachine.serial_number || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.serial_number
              )}
          </p>

          {/* Модель техники */}
          <p>
              <strong>Модель техники:</strong>
              {isEditing ? (
                  <select
                      name="equipment_model"
                      value={updatedMachine.equipment_model || ''}
                      onChange={handleChange}
                  >
                      {models.equipmentModels.map((model) => (
                          <option key={model.id} value={model.id}>
                              {model.name}
                          </option>
                      ))}
                  </select>
              ) : (
                  machine.equipment_model?.name
              )}
          </p>

          {/* Модель двигателя */}
          <p>
              <strong>Модель двигателя:</strong>
              {isEditing ? (
                  <select
                      name="engine_model"
                      value={updatedMachine.engine_model || ''}
                      onChange={handleChange}
                  >
                      {models.engineModels.map((model) => (
                          <option key={model.id} value={model.id}>
                              {model.name}
                          </option>
                      ))}
                  </select>
              ) : (
                  machine.engine_model?.name
              )}
          </p>

          {/* Зав. № двигателя */}
          <p>
              <strong>Зав. № двигателя:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="engine_serial_number"
                      value={updatedMachine.engine_serial_number || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.engine_serial_number
              )}
          </p>

          {/* Модель трансмиссии */}
          <p>
              <strong>Модель трансмиссии:</strong>
              {isEditing ? (
                  <select
                      name="transmission_model"
                      value={updatedMachine.transmission_model || ''}
                      onChange={handleChange}
                  >
                      {models.transmissionModels.map((model) => (
                          <option key={model.id} value={model.id}>
                              {model.name}
                          </option>
                      ))}
                  </select>
              ) : (
                  machine.transmission_model?.name
              )}
          </p>

          {/* Зав. № трансмиссии */}
          <p>
              <strong>Зав. № трансмиссии:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="transmission_serial_number"
                      value={updatedMachine.transmission_serial_number || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.transmission_serial_number
              )}
          </p>

          {/* Модель ведущего моста */}
          <p>
              <strong>Модель ведущего моста:</strong>
              {isEditing ? (
                  <select
                      name="driving_bridge_model"
                      value={updatedMachine.driving_bridge_model || ''}
                      onChange={handleChange}
                  >
                      {models.drivingBridgeModels.map((model) => (
                          <option key={model.id} value={model.id}>
                              {model.name}
                          </option>
                      ))}
                  </select>
              ) : (
                  machine.driving_bridge_model?.name
              )}
          </p>

          {/* Зав. № ведущего моста */}
          <p>
              <strong>Зав. № ведущего моста:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="driving_bridge_serial_number"
                      value={updatedMachine.driving_bridge_serial_number || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.driving_bridge_serial_number
              )}
          </p>

          {/* Модель управляемого моста */}
          <p>
              <strong>Модель управляемого моста:</strong>
              {isEditing ? (
                  <select
                      name="controlled_bridge_model"
                      value={updatedMachine.controlled_bridge_model || ''}
                      onChange={handleChange}
                  >
                      {models.controlledBridgeModels.map((model) => (
                          <option key={model.id} value={model.id}>
                              {model.name}
                          </option>
                      ))}
                  </select>
              ) : (
                  machine.controlled_bridge_model?.name
              )}
          </p>

          {/* Зав. № управляемого моста */}
          <p>
              <strong>Зав. № управляемого моста:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="controlled_bridge_serial_number"
                      value={updatedMachine.controlled_bridge_serial_number || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.controlled_bridge_serial_number
              )}
          </p>

          {/* Номер контракта */}
          <p>
              <strong>Номер контракта:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="contract_number"
                      value={updatedMachine.contract_number_date || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.contract_number_date
              )}
          </p>

          {/* Дата отгрузки */}
          <p>
              <strong>Дата отгрузки:</strong>
              {isEditing ? (
                  <input
                      type="date"
                      name="shipment_date"
                      value={updatedMachine.shipment_date || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.shipment_date
              )}
          </p>

          {/* Грузополучатель */}
          <p>
              <strong>Грузополучатель:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="recipient"
                      value={updatedMachine.consignee || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.consignee
              )}
          </p>

          {/* Адрес поставки */}
          <p>
              <strong>Адрес поставки:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="delivery_address"
                      value={updatedMachine.delivery_address || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.delivery_address
              )}
          </p>

          {/* Комплектация */}
          <p>
              <strong>Комплектация:</strong>
              {isEditing ? (
                  <input
                      type="text"
                      name="equipment"
                      value={updatedMachine.configuration || ''}
                      onChange={handleChange}
                  />
              ) : (
                  machine.configuration
              )}
          </p>

          {/* Кнопки для редактирования */}
          {userRole === 'manager' && (
              <>
                  {isEditing ? (
                      <button onClick={handleSaveChanges}>Сохранить изменения</button>
                  ) : (
                      <button onClick={() => setIsEditing(true)} className='edit-button'>Редактировать</button>
                  )}
              </>
          )}
          <button onClick={() => navigate(-1)} className="edit-button">
              Назад
          </button>
      </div>
  );
};

export default MachineDetail;
