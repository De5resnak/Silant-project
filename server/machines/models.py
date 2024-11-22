from django.db import models
from users.models import CustomUser


class Reference(models.Model):
    entity_name = models.CharField(max_length=255)  # Название сущности (справочника)
    name = models.CharField(max_length=255)  # Название элемента справочника
    description = models.TextField(blank=True)  # Описание элемента справочника

    def __str__(self):
        return self.name

class Machine(models.Model):
    serial_number = models.CharField(max_length=255, unique=True)  # Зав. № машины
    equipment_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='equipment_models'
    )  # Модель техники (справочник)
    engine_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='engine_models'
    )  # Модель двигателя (справочник)
    engine_serial_number = models.CharField(max_length=255)  # Зав. № двигателя
    transmission_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='transmission_models'
    )  # Модель трансмиссии (справочник)
    transmission_serial_number = models.CharField(max_length=255)  # Зав. № трансмиссии
    driving_bridge_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='driving_bridge_models'
    )  # Модель ведущего моста (справочник)
    driving_bridge_serial_number = models.CharField(max_length=255)  # Зав. № ведущего моста
    controlled_bridge_model = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='controlled_bridge_models'
    )  # Модель управляемого моста (справочник)
    controlled_bridge_serial_number = models.CharField(max_length=255)  # Зав. № управляемого моста
    contract_number_date = models.CharField(max_length=255)  # Договор поставки №, дата
    shipment_date = models.DateField()  # Дата отгрузки с завода
    consignee = models.CharField(max_length=255)  # Грузополучатель
    delivery_address = models.CharField(max_length=255)  # Адрес поставки (эксплуатации)
    configuration = models.TextField()  # Комплектация (доп. опции)
    client = models.CharField(max_length=255)  # Клиент
    service_company = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='service_company_machines'
    )   # Сервисная компания (пользователь)

    def __str__(self):
        return self.serial_number
