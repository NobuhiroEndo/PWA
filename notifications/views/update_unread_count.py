from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from ..utils.utils import send_push_notification
from logging import getLogger

logger = getLogger('notifications')

class UpdateUnreadCountViewSet(viewsets.ViewSet):
    # その他のアクション

    @action(detail=True, methods=['post'])
    def update_unread_count(self, request, pk=None):
        try:
            user_notification = UserNotification.objects.get(user_id=pk)
            token = user_notification.endpoint
            
            if not token:
                return Response({'error': 'Incomplete subscription info.'}, status=status.HTTP_400_BAD_REQUEST)

            increment = request.data.get('increment', 0)
            decrement = request.data.get('decrement', 0)

            if increment:
                user_notification.unread_notifications_count += int(increment)
            if decrement:
                user_notification.unread_notifications_count -= int(decrement)

            user_notification.save()
            # Webプッシュ通知を送信
            title = 'test'
            body = 'HELLO!'
            badge_count = user_notification.unread_notifications_count
            response = send_push_notification(token, title, body, badge_count)
            logger.error(f'れすぽんす：{send_push_notification(token, title, body, badge_count)}')
            return Response({'message': 'Notification sent successfully', 'response': response}, status=status.HTTP_200_OK)

        except UserNotification.DoesNotExist:
            return Response({'error': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)