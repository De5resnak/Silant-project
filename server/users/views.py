from django.shortcuts import render
from rest_framework import viewsets, status
from .models import CustomUser
from .serializers import CustomUserSerializer, LoginSerializer
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes

class CustomUserViewSet(viewsets.ModelViewSet):
    queryset = CustomUser.objects.all()
    serializer_class = CustomUserSerializer


class UserRoleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        role = ''

        if user.is_authenticated:
            print(f"Пользователь: {user.username}, Роль: {user.role}")

            if user.is_manager():
                role = 'manager'
            elif user.is_service_company():
                role = 'service_company'
            elif user.is_client():
                role = 'client'
            else:
                print("Роль не определена корректно.")

        return Response({"role": role})

class LoginView(APIView):
    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data['user']  # Доступ к пользователю из сериализатора

        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
            'user': CustomUserSerializer(user).data
        }, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_company(request):
    # Проверяем, является ли пользователь менеджером
    if request.user.is_manager():
        return Response({'message': 'Manager'})

    # Получаем компанию из модели CustomUser
    company_name = request.user.company if request.user.is_authenticated else None

    if company_name:
        return Response({'company_name': company_name})
    else:
        return Response({'error': 'Компания не указана'}, status=404)