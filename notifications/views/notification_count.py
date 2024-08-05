from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from logging import getLogger

User = get_user_model()
logger = getLogger('notifications')

class NotificationCountViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def notification_count(self, request):
        try:
            user = User.objects.get(username='nobuhiro')
            user_notification = UserNotification.objects.get(user=user)

            serializer = UserNotificationSerializer(user_notification)
            return Response(serializer.data, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserNotification.DoesNotExist:
            return Response({'error': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)