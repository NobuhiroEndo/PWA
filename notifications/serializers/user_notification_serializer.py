from rest_framework import serializers
from ..models.user_notification import UserNotification

class UserNotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserNotification
        fields = [
            'subscription_info',
            'endpoint',
            'encoded_user_public_key',
            'encoded_user_auth',
            'unread_notifications_count'
        ]