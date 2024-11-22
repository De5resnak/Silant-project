from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import ReclamationViewSet, ReclamationByMachineView, ReclamationDetailView, ReferenceListView, ReclamationUpdateView

router = DefaultRouter()
router.register(r'reclamations', ReclamationViewSet)

urlpatterns = [
    path('', ReclamationByMachineView.as_view(), name='reclamations_by_machine'),
    path('<int:pk>/', ReclamationDetailView.as_view(), name='reclamation_detail'),
    path('reference/<str:entity_name>/', ReferenceListView.as_view(), name='reference-list'),
    path('<int:pk>/edit/', ReclamationUpdateView.as_view(), name='reclamation-edit'),
]