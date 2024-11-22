export const sortData = (data, field, order = "asc") => {
  return [...data].sort((a, b) => {
    // Получение значения поля, включая вложенные
    const getFieldValue = (item, fieldPath) => {
      return fieldPath.split('.').reduce((obj, key) => (obj ? obj[key] : null), item);
    };

    const valueA = getFieldValue(a, field);
    const valueB = getFieldValue(b, field);

    // Проверка для даты
    if (field === "shipment_date" || (valueA instanceof Date && valueB instanceof Date)) {
      const dateA = new Date(valueA);
      const dateB = new Date(valueB);
      return order === "asc" ? dateA - dateB : dateB - dateA;
    }

    // Проверка для числовых полей
    if (typeof valueA === "number" && typeof valueB === "number") {
      return order === "asc" ? valueA - valueB : valueB - valueA;
    }

    // Сортировка для строк
    if (typeof valueA === "string" && typeof valueB === "string") {
      return order === "asc"
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }

    // Для других типов данных
    return 0;
  });
};

export const handleSort = (currentField, setField, currentOrder, setOrder) => {
  const newOrder = currentOrder === "asc" ? "desc" : "asc";
  setField(currentField);
  setOrder(newOrder);
};

export const renderSortArrow = (field, sortField, sortOrder) => {
  if (sortField !== field) return null;
  return sortOrder === "asc" ? "↑" : "↓";
};