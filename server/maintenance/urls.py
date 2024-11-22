from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MaintenanceViewSet, MaintenanceByMachineView, MaintenanceDetailView, MaintenanceUpdateView, MaintenanceTypeListAPIView

router = DefaultRouter()
router.register(r'maintenance', MaintenanceViewSet)

urlpatterns = [
    path('', MaintenanceByMachineView.as_view(), name='maintenance-by-machine'),
    path('<int:pk>/', MaintenanceDetailView.as_view(), name='maintenance-detail'),
    path('<int:pk>/edit/', MaintenanceUpdateView.as_view(), name='maintenance-edit'),
    path('maintenance-types/', MaintenanceTypeListAPIView.as_view(), name='maintenance-types'),


]