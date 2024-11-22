import django_filters
from .models import Reclamation

class ReclamationFilter(django_filters.FilterSet):
    class Meta:
        model = Reclamation
        fields = ['failure_node', 'recovery_method', 'service_company']