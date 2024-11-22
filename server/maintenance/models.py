from django.db import models
from machines.models import Reference, Machine

class Maintenance(models.Model):
    maintenance_type = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='maintenance_types'
    )  # Вид ТО (справочник)
    maintenance_date = models.DateField()  # Дата проведения ТО
    operating_hours = models.PositiveIntegerField()  # Наработка, м/час
    order_number = models.CharField(max_length=255)  # № заказ-наряда
    order_date = models.DateField()  # Дата заказ-наряда
    maintenance_organization = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='maintenance_organizations'
    )  # Организация, проводившая ТО
    machine = models.ForeignKey(
        Machine,
        on_delete=models.CASCADE,
        related_name='maintenance_records'
    )  # Машина
    service_company = models.ForeignKey(
        Reference,
        on_delete=models.PROTECT,
        related_name='service_company_maintenance'
    )  # Сервисная компания

    def __str__(self):
        return f"ТО {self.machine.serial_number} на {self.maintenance_date}"