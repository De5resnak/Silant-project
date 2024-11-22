from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/maintenance/', include('maintenance.urls')),
    path('api/reclamations/', include('reclamations.urls')),
    path('api/users/', include('users.urls')),
    path('api/machines/', include('machines.urls')),
]

