import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const ReclamationDetail = () => {
  const { id } = useParams(); // id - это pk
  const [reclamation, setReclamation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [updatedReclamation, setUpdatedReclamation] = useState({});
  const [failureNodes, setFailureNodes] = useState([]); // Для списка узлов отказа
  const navigate = useNavigate();

  const userRole = localStorage.getItem('userRole');

  // Загружаем детали рекламации и список узлов отказа
  useEffect(() => {
    const fetchReclamationDetail = async () => {
      try {
        const [reclamationResponse, nodesResponse] = await Promise.all([
          axios.get(`http://localhost:8000/api/reclamations/${id}/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }),
          axios.get(`http://localhost:8000/api/reclamations/reference/Узел отказа/`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('authToken')}`,
            },
          }),
        ]);
        setReclamation(reclamationResponse.data);
        setUpdatedReclamation(reclamationResponse.data);
        setFailureNodes(nodesResponse.data); // Сохраняем список узлов отказа
      } catch (error) {
        setError('Ошибка загрузки данных: ' + error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReclamationDetail();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedReclamation((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveChanges = async () => {
    try {
      const updatedData = {
        ...updatedReclamation,
        failure_node: updatedReclamation.failure_node?.id || updatedReclamation.failure_node, // Передаем ID узла отказа
        machine: updatedReclamation.machine?.id || updatedReclamation.machine, // Передаем ID машины
      };

      await axios.put(
        `http://localhost:8000/api/reclamations/${id}/edit/`, // Путь для редактирования
        updatedData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('authToken')}`,
          },
        }
      );

      setReclamation(updatedData); // Обновляем локальное состояние
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
      <h2>Детали рекламации</h2>

      {/* Узел отказа */}
      <p>
        <strong>Узел отказа:</strong>{' '}
        {isEditing ? (
          <select
            name="failure_node"
            value={updatedReclamation.failure_node?.id || ''}
            onChange={(e) =>
              setUpdatedReclamation((prev) => ({
                ...prev,
                failure_node: failureNodes.find(
                  (node) => node.id === parseInt(e.target.value, 10)
                ),
              }))
            }
          >
            <option value="">Выберите узел отказа</option>
            {failureNodes.map((node) => (
              <option key={node.id} value={node.id}>
                {node.name}
              </option>
            ))}
          </select>
        ) : (
          reclamation.failure_node?.name
        )}
      </p>

      {/* Описание отказа */}
      <p>
        <strong>Описание отказа:</strong>{' '}
        {isEditing ? (
          <textarea
            name="failure_description"
            value={updatedReclamation.failure_description || ''}
            onChange={handleChange}
            rows="4"
            cols="50"
          />
        ) : (
          reclamation.failure_description
        )}
      </p>

      {/* Дата отказа */}
      <p>
        <strong>Дата отказа:</strong>{' '}
        {isEditing ? (
          <input
            type="date"
            name="failure_date"
            value={updatedReclamation.failure_date || ''}
            onChange={handleChange}
          />
        ) : (
          reclamation.failure_date
        )}
      </p>

      {/* Способ восстановления */}
      <p>
        <strong>Способ восстановления:</strong> {reclamation.recovery_method?.name}
      </p>

      {/* Используемые запчасти */}
      <p>
        <strong>Используемые запасные части:</strong>{' '}
        {isEditing ? (
          <textarea
            name="used_parts"
            value={updatedReclamation.used_parts || ''}
            onChange={handleChange}
            rows="4"
            cols="50"
          />
        ) : (
          reclamation.used_parts
        )}
      </p>

      {/* Дата восстановления */}
      <p>
        <strong>Дата восстановления:</strong>{' '}
        {isEditing ? (
          <input
            type="date"
            name="recovery_date"
            value={updatedReclamation.recovery_date || ''}
            onChange={handleChange}
          />
        ) : (
          reclamation.recovery_date
        )}
      </p>

      {/* Время простоя техники */}
      <p>
        <strong>Время простоя техники (часы):</strong>{' '}
        {isEditing ? (
          <input
            type="number"
            name="downtime_hours"
            value={updatedReclamation.downtime || ''}
            onChange={handleChange}
          />
        ) : (
          reclamation.downtime
        )}
      </p>

      {/* Зав. № машины */}
      <p>
        <strong>Зав. № машины:</strong> {reclamation.machine}
      </p>

      {/* Сервисная компания */}
      <p>
        <strong>Сервисная компания:</strong> {reclamation.service_company?.name}
      </p>

      {/* Кнопки для редактирования и сохранения */}
      {isEditing ? (
  <button onClick={handleSaveChanges} className="save-button">
    Сохранить изменения
  </button>
    ) : (
  (userRole === 'service_company' || userRole === 'manager') && (
    <button onClick={() => setIsEditing(true)} className="edit-button">
      Редактировать
    </button>
  )
    )}

      <button onClick={() => navigate(-1)} className="details-back-button">
        Назад
      </button>
    </div>
  );
};

export default ReclamationDetail;
