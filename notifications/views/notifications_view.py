from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from ..models import UserNotification
from ..utils.utils import send_push_notification

class NotificationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def send_notification(self, request):
        try:
            # ユーザーの取得
            user = User.objects.get(username='nobuhiro')
            # ユーザーに関連付けられた UserNotification を取得
            user_notification = UserNotification.objects.get(user=user)
            
            # subscription_info からトークンを取得
            token = user_notification.subscription_info
            if not token:
                return Response({'error': 'Subscription info (token) not found.'}, status=status.HTTP_404_NOT_FOUND)

            # 通知を送信
            title = 'test'
            body = 'HELLO!'
            response = send_push_notification(token, title, body)
            return Response({'message': 'Notification sent successfully', 'response': response}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserNotification.DoesNotExist:
            return Response({'error': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)