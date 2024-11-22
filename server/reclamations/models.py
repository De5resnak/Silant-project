from django.db import models
from machines.models import Reference, Machine
from users.models import CustomUser  # Правильный импорт CustomUser

class Reclamation(models.Model):
    failure_node = models.ForeignKey(
        Reference,  # Изменено на правильную ссылку
        on_delete=models.PROTECT,
        related_name='failure_nodes'
    )  # Узел отказа
    description = models.TextField()  # Описание отказа
    recovery_method = models.ForeignKey(
        Reference,  # Изменено на правильную ссылку
        on_delete=models.PROTECT,
        related_name='recovery_methods'
    )  # Способ восстановления
    parts_used = models.TextField()  # Используемые запасные части
    recovery_date = models.DateField()  # Дата восстановления
    downtime = models.PositiveIntegerField()  # Время простоя техники (в часах)
    machine = models.ForeignKey(
        Machine,  # Изменено на правильную ссылку
        on_delete=models.CASCADE,
        related_name='reclamations'
    )  # Машина
    service_company = models.ForeignKey(
        Reference,  # Изменено на правильную ссылку
        on_delete=models.PROTECT,
        related_name='service_company_reclamations'
    )  # Сервисная компания
    operating_time = models.PositiveIntegerField(default=0)  # Наработка, м/час
    failure_date = models.DateField(null=True, blank=True, default='2024-01-01')   # Дата отказа

    def __str__(self):
        return f"Рекламация на {self.machine.serial_number} от {self.recovery_date}"
