from rest_framework import serializers
from .models import Machine, Reference


class ReferenceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reference
        fields = ['id', 'entity_name', 'name', 'description']


class MachineSerializer(serializers.ModelSerializer):
    equipment_model = ReferenceSerializer(read_only=True)
    engine_model = ReferenceSerializer(read_only=True)
    transmission_model = ReferenceSerializer(read_only=True)
    driving_bridge_model = ReferenceSerializer(read_only=True)
    controlled_bridge_model = ReferenceSerializer(read_only=True)
    service_company = ReferenceSerializer(read_only=True)

    class Meta:
        model = Machine
        fields = [
            'id', 'serial_number', 'equipment_model', 'engine_model',
            'engine_serial_number', 'transmission_model', 'transmission_serial_number',
            'driving_bridge_model', 'driving_bridge_serial_number',
            'controlled_bridge_model', 'controlled_bridge_serial_number',
            'contract_number_date', 'shipment_date', 'consignee',
            'delivery_address', 'configuration', 'client', 'service_company'
        ]

class MachinePublicSerializer(serializers.ModelSerializer):
    equipment_model = serializers.CharField(source='equipment_model.name')
    engine_model = serializers.CharField(source='engine_model.name')
    transmission_model = serializers.CharField(source='transmission_model.name')
    driving_bridge_model = serializers.CharField(source='driving_bridge_model.name')
    controlled_bridge_model = serializers.CharField(source='controlled_bridge_model.name')

    class Meta:
        model = Machine
        fields = [
            'serial_number',
            'equipment_model',
            'engine_model',
            'engine_serial_number',
            'transmission_model',
            'transmission_serial_number',
            'driving_bridge_model',
            'driving_bridge_serial_number',
            'controlled_bridge_model',
            'controlled_bridge_serial_number'
        ]

class MachineDetailSerializer(serializers.ModelSerializer):
    equipment_model = ReferenceSerializer()
    engine_model = ReferenceSerializer()
    transmission_model = ReferenceSerializer()
    driving_bridge_model = ReferenceSerializer()
    controlled_bridge_model = ReferenceSerializer()
    service_company = ReferenceSerializer()

    class Meta:
        model = Machine
        fields = [
            'id', 'serial_number', 'equipment_model', 'engine_model',
            'engine_serial_number', 'transmission_model', 'transmission_serial_number',
            'driving_bridge_model', 'driving_bridge_serial_number', 'controlled_bridge_model',
            'controlled_bridge_serial_number', 'contract_number_date', 'shipment_date',
            'consignee', 'delivery_address', 'configuration', 'client', 'service_company'
        ]


from rest_framework import serializers
from .models import Machine, Reference

class MachineUpdateSerializer(serializers.ModelSerializer):
    # Мы получаем имена для моделей через связанные поля
    equipment_model_name = serializers.CharField(source='equipment_model.name', read_only=True)
    engine_model_name = serializers.CharField(source='engine_model.name', read_only=True)
    transmission_model_name = serializers.CharField(source='transmission_model.name', read_only=True)
    driving_bridge_model_name = serializers.CharField(source='driving_bridge_model.name', read_only=True)
    controlled_bridge_model_name = serializers.CharField(source='controlled_bridge_model.name', read_only=True)
    service_company_name = serializers.CharField(source='service_company.name', read_only=True)

    # Поля для обновления данных моделей, они будут принимать id
    equipment_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    engine_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    transmission_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    driving_bridge_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    controlled_bridge_model = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())
    service_company = serializers.PrimaryKeyRelatedField(queryset=Reference.objects.all())

    # Поля, которые мы будем обновлять напрямую
    serial_number = serializers.CharField(max_length=255)  # Зав. № машины
    engine_serial_number = serializers.CharField(max_length=255)  # Зав. № двигателя
    transmission_serial_number = serializers.CharField(max_length=255)  # Зав. № трансмиссии
    driving_bridge_serial_number = serializers.CharField(max_length=255)  # Зав. № ведущего моста
    controlled_bridge_serial_number = serializers.CharField(max_length=255)  # Зав. № управляемого моста
    contract_number_date = serializers.CharField(max_length=255)  # Договор поставки №, дата
    shipment_date = serializers.DateField()  # Дата отгрузки с завода
    consignee = serializers.CharField(max_length=255)  # Грузополучатель
    delivery_address = serializers.CharField(max_length=255)  # Адрес поставки
    configuration = serializers.CharField()  # Комплектация (доп. опции)
    client = serializers.CharField(max_length=255)  # Клиент

    class Meta:
        model = Machine
        fields = [
            'id', 'serial_number', 'equipment_model', 'equipment_model_name',
            'engine_model', 'engine_model_name', 'engine_serial_number',
            'transmission_model', 'transmission_model_name', 'transmission_serial_number',
            'driving_bridge_model', 'driving_bridge_model_name', 'driving_bridge_serial_number',
            'controlled_bridge_model', 'controlled_bridge_model_name', 'controlled_bridge_serial_number',
            'contract_number_date', 'shipment_date', 'consignee', 'delivery_address',
            'configuration', 'client', 'service_company', 'service_company_name'
        ]
        read_only_fields = ['equipment_model_name', 'engine_model_name', 'transmission_model_name',
                            'driving_bridge_model_name', 'controlled_bridge_model_name', 'service_company_name']

    def to_internal_value(self, data):
        """
        Обрабатывает входящие данные, чтобы поддерживать как id, так и словари.
        """
        if isinstance(data, dict):
            # Обработка поля для всех моделей (Reference)
            for field in ['equipment_model', 'engine_model', 'transmission_model', 'driving_bridge_model',
                          'controlled_bridge_model', 'service_company']:
                if field in data and isinstance(data[field], dict):
                    ref_data = data.pop(field)
                    if 'name' in ref_data:
                        # Использование filter() вместо get(), чтобы избежать ошибки MultipleObjectsReturned
                        reference_object = Reference.objects.filter(name=ref_data['name']).first()
                        if reference_object:
                            data[field] = reference_object.id
                        else:
                            raise serializers.ValidationError(f"Ссылка на {field} с именем {ref_data['name']} не найдена.")
        return super().to_internal_value(data)

    def update(self, instance, validated_data):
        # Обновление данных для каждой модели (Reference)
        for field in ['equipment_model', 'engine_model', 'transmission_model', 'driving_bridge_model',
                      'controlled_bridge_model', 'service_company']:
            field_data = validated_data.pop(field, None)
            if field_data:
                if isinstance(field_data, dict):
                    name = field_data.get('name')
                    if name:
                        # Использование filter() вместо get() для предотвращения MultipleObjectsReturned
                        reference_object = Reference.objects.filter(name=name).first()
                        if reference_object:
                            instance.__setattr__(field, reference_object)
                        else:
                            raise serializers.ValidationError(f"Ссылка на {field} с именем {name} не найдена.")
                else:
                    instance.__setattr__(field, field_data)

        # Обновление остальных полей
        for attr, value in validated_data.items():
            setattr(instance, attr, value)

        instance.save()
        return instance
