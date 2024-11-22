from django.contrib import admin
from .models import Reclamation
from machines.models import Reference

@admin.register(Reclamation)
class ReclamationAdmin(admin.ModelAdmin):
    list_display = ('machine', 'failure_node', 'service_company', 'recovery_method')
    search_fields = ('machine__serial_number', 'failure_node__name')
    list_filter = ('failure_node', 'recovery_method')

    def formfield_for_foreignkey(self, db_field, request, **kwargs):
        if db_field.name == "failure_node":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Узел отказа")
        elif db_field.name == "recovery_method":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Способ восстановления")
        elif db_field.name == "service_company":
            kwargs["queryset"] = Reference.objects.filter(entity_name="Сервисная компания")

        return super().formfield_for_foreignkey(db_field, request, **kwargs)