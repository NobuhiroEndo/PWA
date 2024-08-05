from django.contrib import admin
from .models import UserNotification
# Register your models here.

@admin.register(UserNotification)
class UserNotificationAdmin(admin.ModelAdmin):
    list_display = ('user', 'endpoint', 'encoded_user_public_key', 'encoded_user_auth', 'unread_notifications_count')
    search_fields = ('user__username', 'endpoint')