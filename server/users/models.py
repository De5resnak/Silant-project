from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_CHOICES = [
        ('client', 'Клиент'),
        ('service_company', 'Сервисная компания'),
        ('manager', 'Менеджер'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES)
    company = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=15, blank=True, null=True)


    def is_client(self):
        return self.role == 'client'

    def is_service_company(self):
        return self.role == 'service_company'

    def is_manager(self):
        return self.role == 'manager'

    def __str__(self):
        return self.username
