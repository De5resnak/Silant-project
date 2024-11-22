from django.shortcuts import render
from rest_framework import viewsets, status, generics
from .models import Reclamation
from machines.models import Machine, Reference
from .serializers import ReclamationSerializer, ReclamationDetailSerializer, ReclamationUpdateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import ReclamationFilter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView

class ReclamationViewSet(viewsets.ModelViewSet):
    queryset = Reclamation.objects.all().order_by('failure_date')
    serializer_class = ReclamationSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = ReclamationFilter

class ReclamationByMachineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.is_client():
            user_machines = Machine.objects.filter(client=user.company)

        # Если роль пользователя - сервисная компания
        elif user.is_service_company():
            user_machines = Machine.objects.filter(service_company__name=user.company)

        elif user.is_manager():
            reclamations = Reclamation.objects.all()
            serializer = ReclamationSerializer(reclamations, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        else:
            return Response({"detail": "Нет доступа для данной роли"}, status=403)

        # Если машин нет, возвращаем ошибку
        if not user_machines.exists():
            return Response({"detail": "У пользователя нет доступных машин."}, status=status.HTTP_404_NOT_FOUND)

        # Получаем рекламации, связанные с машинами пользователя
        machine_ids = user_machines.values_list('id', flat=True)
        reclamations = Reclamation.objects.filter(machine_id__in=machine_ids)

        serializer = ReclamationSerializer(reclamations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ReclamationDetailView(generics.RetrieveAPIView):
    queryset = Reclamation.objects.select_related(
        'failure_node', 'recovery_method', 'service_company', 'machine'
    )
    serializer_class = ReclamationDetailSerializer

class ReferenceListView(APIView):
    """
    Эндпоинт для получения значений справочника по названию сущности.
    """
    def get(self, request, entity_name):
        references = Reference.objects.filter(entity_name=entity_name).values('id', 'name', 'description')
        return Response(references)

class ReclamationUpdateView(generics.UpdateAPIView):
    """
    Представление для обновления рекламаций.
    """
    queryset = Reclamation.objects.all()
    serializer_class = ReclamationUpdateSerializer

    def get_permissions(self):
        """
        Проверяет роли пользователя при попытке обновления рекламации.
        """
        if self.request.method == 'PUT':
            user_role = self.request.user.role
            if user_role not in ['service_company', 'manager']:
                self.permission_denied(
                    self.request,
                    message="У вас нет прав на изменение данных."
                )
        return super().get_permissions()