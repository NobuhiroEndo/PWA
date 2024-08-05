# notifications/models/user_notification.py
from django.db import models
from django.contrib.auth.models import User  # デフォルトのユーザーモデルをインポート

class UserNotification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification')
    subscription_info = models.TextField()
    endpoint = models.CharField(max_length=255, null=True, blank=True)
    encoded_user_public_key = models.CharField(max_length=255, null=True, blank=True)
    encoded_user_auth = models.CharField(max_length=255, null=True, blank=True)
    unread_notifications_count = models.IntegerField(default=0, null=True, blank=True)

    def __str__(self):
        return f"{self.user.username}'s notification settings"