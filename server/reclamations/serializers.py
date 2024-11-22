from rest_framework import serializers
from .models import Reclamation
from machines.models import Machine, Reference

class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = ['name', 'description']  # Поля справочников, которые необходимо отображать


class MachineSerializer(serializers.ModelSerializer):
    class Meta:
        model = Machine
        fields = ['serial_number']  # Основные поля для машины


class ReclamationSerializer(serializers.ModelSerializer):
    failure_node = ReferenceSerializer(read_only=True)
    recovery_method = ReferenceSerializer(read_only=True)
    service_company = ReferenceSerializer(read_only=True)
    machine = MachineSerializer(read_only=True)

    class Meta:
        model = Reclamation
        fields = [
            'id',
            'failure_node',
            'description',
            'recovery_method',
            'parts_used',
            'recovery_date',
            'downtime',
            'machine',
            'service_company',
            'operating_time',
            'failure_date',
        ]

class ReclamationDetailSerializer(serializers.ModelSerializer):
    failure_node = ReferenceSerializer()
    recovery_method = ReferenceSerializer()
    service_company = ReferenceSerializer()
    machine = serializers.StringRelatedField()

    class Meta:
        model = Reclamation
        fields = [
            'id', 'failure_node', 'description', 'recovery_method',
            'parts_used', 'recovery_date', 'downtime', 'machine',
            'service_company', 'operating_time', 'failure_date'
        ]

class ReclamationUpdateSerializer(serializers.ModelSerializer):
    node_name = serializers.CharField(source='failure_node.name', read_only=True)
    node_description = serializers.CharField(source='failure_node.description', read_only=True)
    restoration_method_name = serializers.CharField(source='recovery_method.name', read_only=True)
    restoration_method_description = serializers.CharField(source='recovery_method.description', read_only=True)
    available_nodes = serializers.SerializerMethodField()
    available_restoration_methods = serializers.SerializerMethodField()

    class Meta:
        model = Reclamation
        fields = [
            'id',
            'failure_date',
            'operating_time',
            'failure_node',
            'description',
            'recovery_method',
            'parts_used',
            'recovery_date',
            'downtime',
            'machine',
            'service_company',
            'node_name',
            'node_description',
            'restoration_method_name',
            'restoration_method_description',
            'available_nodes',
            'available_restoration_methods',
        ]
        read_only_fields = ['machine', 'service_company']

    def get_available_nodes(self, obj):
        """
        Возвращает список доступных узлов с описаниями.
        """
        return Reference.objects.filter(entity_name='node').values('id', 'name', 'description')

    def get_available_restoration_methods(self, obj):
        """
        Возвращает список доступных способов восстановления с описаниями.
        """
        return Reference.objects.filter(entity_name='restoration_method').values('id', 'name', 'description')

    def to_internal_value(self, data):
        """
        Обрабатывает входящие данные, чтобы поддерживать как id, так и словари.
        """
        if isinstance(data, dict):
            # Обработка поля failure_node
            if 'failure_node' in data and isinstance(data['failure_node'], dict):
                node_data = data.pop('failure_node')
                if 'name' in node_data:
                    data['failure_node'] = Reference.objects.get_or_create(name=node_data['name'])[0].id

            # Обработка поля recovery_method
            if 'recovery_method' in data and isinstance(data['recovery_method'], dict):
                method_data = data.pop('recovery_method')
                if 'name' in method_data:
                    data['recovery_method'] = Reference.objects.get_or_create(name=method_data['name'])[0].id

        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        # Обновление failure_node
        failure_node_data = validated_data.pop('failure_node', None)
        if failure_node_data:
            if isinstance(failure_node_data, dict):
                name = failure_node_data.get('name')
                if name:
                    instance.failure_node = Reference.objects.get(name=name)
            else:
                instance.failure_node = failure_node_data

        # Обновление recovery_method
        recovery_method_data = validated_data.pop('recovery_method', None)
        if recovery_method_data:
            if isinstance(recovery_method_data, dict):
                name = recovery_method_data.get('name')
                if name:
                    instance.recovery_method = Reference.objects.get(name=name)
            else:
                instance.recovery_method = recovery_method_data

        # Обновление остальных полей
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance

