from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from ..utils.webpush import WebPushHelper

class UpdateUnreadCountViewSet(viewsets.ViewSet):
    # その他のアクション

    @action(detail=True, methods=['post'])
    def update_unread_count(self, request, pk=None):
        try:
            user_notification = UserNotification.objects.get(user_id=pk)
            increment = request.data.get('increment', 0)
            decrement = request.data.get('decrement', 0)

            if increment:
                user_notification.unread_notifications_count += int(increment)
            if decrement:
                user_notification.unread_notifications_count -= int(decrement)

            user_notification.save()

            # Webプッシュ通知を送信
            WebPushHelper.send_push(
                endpoint=user_notification.endpoint,
                encoded_user_public_key=user_notification.encoded_user_public_key,
                encoded_user_auth=user_notification.encoded_user_auth,
                payload={
                    'title': 'Notification Count Updated',
                    'body': f'You now have {user_notification.unread_notifications_count} unread notifications.',
                    'badge_count': user_notification.unread_notifications_count
                }
            )

            return Response({'status': 'count updated', 'unread_count': user_notification.unread_notifications_count})

        except UserNotification.DoesNotExist:
            return Response({'error': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)