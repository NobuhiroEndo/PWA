# notifications/models/user_notification.py
from django.db import models
from django.contrib.auth.models import User  # デフォルトのユーザーモデルをインポート

class UserNotification(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='notification')
    subscription_info = models.TextField()

    def __str__(self):
        return f"{self.user.username}'s notification settings"