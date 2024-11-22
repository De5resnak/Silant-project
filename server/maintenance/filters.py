import django_filters
from .models import Maintenance

class MaintenanceFilter(django_filters.FilterSet):
    class Meta:
        model = Maintenance
        fields = ['maintenance_type', 'machine__serial_number', 'service_company']