from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from ..models import UserNotification
from ..utils.webpush import WebPushHelper
from logging import getLogger

User = get_user_model()
logger = getLogger('notifications')

class NotificationReadViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def notification_read(self, request):
        try:
            user = User.objects.get(username='nobuhiro')
            user_notification = UserNotification.objects.get(user=user)

            if user_notification.unread_notifications_count > 0:
                user_notification.unread_notifications_count = 0
                user_notification.save()
            return Response({'message': '未読通知数更新'}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'errorゆーざー': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)