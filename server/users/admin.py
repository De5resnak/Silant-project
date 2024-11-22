from django.contrib import admin
from .models import CustomUser

@admin.register(CustomUser)
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'company', 'phone_number')
    search_fields = ('username', 'email', 'role')
    list_filter = ('role',)
