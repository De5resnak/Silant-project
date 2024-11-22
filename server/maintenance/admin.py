from django.contrib import admin
from .models import Maintenance
from machines.models import Reference

@admin.register(Maintenance)
class MaintenanceAdmin(admin.ModelAdmin):
    list_display = ('machine', 'maintenance_date', 'maintenance_type', 'service_company')
    search_fields = ('machine__serial_number', 'order_number')
    list_filter = ('maintenance_type',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Фильтрация для поля equipment_model (только Модель техники)
        if db_field.name == "maintenance_type":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Вид ТО")
        elif db_field.name == "service_company":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Сервисная компания")
        elif db_field.name == "maintenance_organization":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Организация, проводившая ТО")

        return super().formfield_for_foreignkey(db_field, request, **kwargs)
