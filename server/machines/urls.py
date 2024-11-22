from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import MachineViewSet, MachinePublicListView, AuthMachinesView, MachineDetailView, MachineUpdateView, ReferenceListView

router = DefaultRouter()
router.register(r'machines', MachineViewSet, basename='machine')

urlpatterns = [
    path('public/', MachinePublicListView.as_view(), name='machine-public-list'),
    path('admin/', include(router.urls)),
    path('auth/', AuthMachinesView.as_view(), name='client_or_service_machines'),
    path('<int:pk>/', MachineDetailView.as_view(), name='machine_detail'),
    path('<int:pk>/edit/', MachineUpdateView.as_view(), name='machine_detail'),
    path('reference/<str:entity_name>/', ReferenceListView.as_view(), name='reference-list'),
]