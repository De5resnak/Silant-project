from django.contrib import admin
from .models import Machine, Reference

@admin.register(Machine)
class MachineAdmin(admin.ModelAdmin):
    list_display = ('serial_number', 'equipment_model', 'client', 'service_company')
    search_fields = ('serial_number', 'client__username', 'service_company__username')
    list_filter = ('equipment_model',)

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        # Фильтрация для поля equipment_model (только Модель техники)
        if db_field.name == "equipment_model":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Модель техники")
        # Фильтрация для поля engine_model (только Модель двигателя)
        elif db_field.name == "engine_model":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Модель двигателя")
        # Фильтрация для поля transmission_model (только Модель трансмиссии)
        elif db_field.name == "transmission_model":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Модель трансмиссии")
        # Фильтрация для поля driving_bridge_model (только Модель ведущего моста)
        elif db_field.name == "driving_bridge_model":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Модель ведущего моста")
        # Фильтрация для поля controlled_bridge_model (только Модель управляемого моста)
        elif db_field.name == "controlled_bridge_model":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Модель управляемого моста")
        elif db_field.name == "service_company":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Сервисная компания")

        return super().formfield_for_foreignkey(db_field, request, **kwargs)

@admin.register(Reference)
class ReferenceAdmin(admin.ModelAdmin):
    list_display = ('entity_name', 'name', 'description')
    search_fields = ('name',)
