from rest_framework.routers import DefaultRouter
from django.urls import path, include
from .views import CustomUserViewSet, UserRoleView, LoginView, get_company

router = DefaultRouter()
router.register(r'users', CustomUserViewSet)

urlpatterns = [
    path('role/', UserRoleView.as_view(), name='user-role'),
    path('login/', LoginView.as_view(), name='login'),
    path('company/', get_company, name='get_company')
]