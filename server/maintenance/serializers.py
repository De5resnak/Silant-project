from rest_framework import serializers
from .models import Maintenance
from machines.models import Machine, Reference

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = ['id','name', 'description']  # Поля, которые нужно показать для справочников


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['serial_number']  # Поля, которые нужно показать для машины


class MaintenanceSerializer(serializers.ModelSerializer):
    maintenance_type = ReferenceSerializer()  # Сериализатор для вывода данных о TO
    maintenance_organization = ReferenceSerializer()  # Сериализатор для вывода данных об организации ТО
    machine = MachineSerializer()  # Сериализатор для отображения данных машины
    service_company = ReferenceSerializer()  # Сериализатор для вывода данных о сервисной компании

    class Meta:
        model = Maintenance
        fields = [
            'id', 'maintenance_type', 'maintenance_date', 'operating_hours',
            'order_number', 'order_date', 'maintenance_organization',
            'machine', 'service_company'
        ]
        read_only_fields = ['maintenance_organization', 'service_company']

class MaintenanceUpdateSerializer(serializers.ModelSerializer):
    maintenance_type_name = serializers.CharField(source='maintenance_type.name', read_only=True)
    maintenance_type = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    machine = serializers.PrimaryKeyRelatedField(queryset=Machine.objects.all())
    available_maintenance_types = serializers.SerializerMethodField()  # Поле для передачи списка доступных типов ТО
    description = serializers.CharField(allow_blank=True, required=False)

    def get_available_maintenance_types(self, obj):
        return Reference.objects.filter(entity_name='maintenance_type').values('id', 'name')

    def to_internal_value(self, data):
        """
        Обрабатывает входящие данные, чтобы поддерживать как id, так и словари.
        """
        if isinstance(data, dict):
            # Обработка поля maintenance_type
            if 'maintenance_type' in data and isinstance(data['maintenance_type'], dict):
                maintenance_type_data = data.pop('maintenance_type')
                if 'name' in maintenance_type_data:
                    data['maintenance_type'] = Reference.objects.get_or_create(name=maintenance_type_data['name'])[0].id


            if 'machine' in data and isinstance(data['machine'], dict):
                machine_data = data.pop('machine')
                if 'serial_number' in machine_data:
                    data['machine'] = Machine.objects.get(serial_number=machine_data['serial_number']).id
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        maintenance_type_data = validated_data.pop('maintenance_type', None)
        if maintenance_type_data:
            if isinstance(maintenance_type_data, dict):
                name = maintenance_type_data.get('name')
                if name:
                    instance.maintenance_type = Reference.objects.get(name=name)
            else:
                instance.maintenance_type = maintenance_type_data

        description = validated_data.get('description', None)
        if description is not None and instance.maintenance_type:
            # Обновляем описание в связанной модели Reference
            instance.maintenance_type.description = description
            instance.maintenance_type.save()

        # Обновление остальных полей
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

    class Meta:
        model = Maintenance
        fields = [
            'id', 'maintenance_type', 'maintenance_type_name', 'maintenance_date', 'operating_hours',
            'order_number', 'order_date', 'maintenance_organization', 'machine', 'service_company',
            'available_maintenance_types', 'description',
        ]
        read_only_fields = ['maintenance_organization', 'service_company']


