from django.shortcuts import render
from rest_framework import viewsets, status, generics
from .models import Maintenance
from machines.models import Machine, Reference
from .serializers import MaintenanceSerializer, MaintenanceUpdateSerializer, ReferenceSerializer
from django_filters.rest_framework import DjangoFilterBackend
from .filters import MaintenanceFilter
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated

class MaintenanceViewSet(viewsets.ModelViewSet):
    queryset = Maintenance.objects.all().order_by('maintenance_date')
    serializer_class = MaintenanceSerializer
    filter_backends = [DjangoFilterBackend]
    filterset_class = MaintenanceFilter

class MaintenanceTypeListAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        maintenance_types = Reference.objects.filter(entity_name="Вид ТО")
        print(f"Количество найденных записей: {maintenance_types.count()}")

        for ref in maintenance_types:
            print(f"ID: {ref.id}, Name: {ref.name}, Description: {ref.description}")

        serializer = ReferenceSerializer(maintenance_types, many=True)
        return Response(serializer.data)

class MaintenanceByMachineView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user

        if user.is_client():
            user_machines = Machine.objects.filter(client=user.company)

        elif user.is_service_company():
            user_machines = Machine.objects.filter(service_company__name=user.company)

        elif user.is_manager():
            user_machines = Machine.objects.all()

        else:
            return Response({"detail": "Нет доступа для данной роли"}, status=status.HTTP_403_FORBIDDEN)

        # Проверка наличия машин
        if not user_machines.exists():
            return Response({"detail": "У пользователя нет доступных машин."}, status=status.HTTP_404_NOT_FOUND)

        machine_ids = user_machines.values_list('id', flat=True)

        # Фильтрация записей ТО по идентификаторам машин
        maintenance_records = Maintenance.objects.filter(machine_id__in=machine_ids)

        serializer = MaintenanceSerializer(maintenance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class MaintenanceDetailView(generics.RetrieveAPIView):
    queryset = Maintenance.objects.select_related(
        'maintenance_type', 'maintenance_organization', 'machine', 'service_company'
    )
    serializer_class = MaintenanceSerializer

class MaintenanceUpdateView(generics.UpdateAPIView):
    queryset = Maintenance.objects.all()
    serializer_class = MaintenanceUpdateSerializer

    def get_permissions(self):
        if self.request.method == 'PUT':
            user_role = self.request.user.role
            if user_role not in ['client', 'service_company', 'manager']:
                self.permission_denied(
                    self.request,
                    message="У вас нет прав на изменение данных."
                )
        return super().get_permissions()
