from django.shortcuts import render
from rest_framework import viewsets, generics
from .models import Machine, Reference
from .serializers import MachineSerializer, MachinePublicSerializer, MachineDetailSerializer, MachineUpdateSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import MachineFilter
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import PermissionDenied


class MachineViewSet(viewsets.ModelViewSet):
    queryset = Machine.objects.all().order_by('shipment_date')
    serializer_class = MachineSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MachineFilter

class MachinePublicListView(generics.ListAPIView):

    serializer_class = MachinePublicSerializer
    permission_classes = []

    def get_queryset(self):
        serial_number = self.request.query_params.get('serial_number')
        if serial_number:
            queryset = Machine.objects.filter(serial_number=serial_number)
            return queryset
        return Machine.objects.all()

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        if queryset.exists():  # Проверяем, есть ли результаты
            serializer = self.get_serializer(queryset, many=True)
            return Response(serializer.data, status=200)
        return Response([], status=200)


class AuthMachinesView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user

        # Если роль пользователя - клиент
        if user.is_client():
            machines = Machine.objects.filter(client=user.company)

        # Если роль пользователя - сервисная компания
        elif user.is_service_company():
            machines = Machine.objects.filter(service_company__name=user.company)

        elif user.is_manager():
            machines = Machine.objects.all()

        else:
            return Response({"detail": "Нет доступа для данной роли"}, status=403)

        serializer = MachineSerializer(machines, many=True)
        return Response(serializer.data)

class MachineDetailView(generics.RetrieveAPIView):
    queryset = Machine.objects.select_related(
        'equipment_model', 'engine_model', 'transmission_model',
        'driving_bridge_model', 'controlled_bridge_model', 'service_company'
    )
    serializer_class = MachineDetailSerializer

class MachineUpdateView(generics.UpdateAPIView):
    """
    Представление для обновления данных о машине.
    """
    queryset = Machine.objects.all()
    serializer_class = MachineUpdateSerializer

    def get_permissions(self):
        """
        Проверяет роль пользователя при попытке обновления данных о машине.
        """
        if self.request.method == 'PUT':
            user_role = self.request.user.role
            if user_role not in ['manager']:
                raise PermissionDenied("У вас нет прав на изменение данных.")
        return super().get_permissions()

class ReferenceListView(APIView):
    """
    Эндпоинт для получения значений справочника по названию сущности.
    """
    def get(self, request, entity_name):
        references = Reference.objects.filter(entity_name=entity_name).values('id', 'name', 'description')
        return Response(references)