import django_filters
from .models import Machine

class MachineFilter(django_filters.FilterSet):
    class Meta:
        model = Machine
        fields = ['equipment_model', 'engine_model', 'transmission_model', 'controlled_bridge_model', 'driving_bridge_model']