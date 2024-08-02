from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from ..models import UserNotification
from ..utils.webpush import WebPushHelper
from logging import getLogger

logger = getLogger('notifications')

class NotificationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def send_notification(self, request):
        try:
            user = User.objects.get(username='nobuhiro')
            user_notification = UserNotification.objects.get(user=user)

            endpoint = user_notification.endpoint
            encoded_user_public_key = user_notification.encoded_user_public_key
            encoded_user_auth = user_notification.encoded_user_auth
            
            if not (endpoint and encoded_user_public_key and encoded_user_auth):
                return Response({'error': 'Incomplete subscription info.'}, status=status.HTTP_400_BAD_REQUEST)

            webpush_helper = WebPushHelper()
            
            # 通知を送信
            payload = {
                'title': 'Default Title',
                'body': 'Default Body',
            }
            response = webpush_helper.send_push(
                endpoint=endpoint,
                encoded_user_public_key=encoded_user_public_key,
                encoded_user_auth=encoded_user_auth,
                payload=payload
            )
            try:
                response_data = response.json()
            except ValueError as e:
                return Response({'error': 'Response is not in JSON format'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

            return Response({'message': 'Notification sent successfully', 'response': response.json()}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'errorゆーざー': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserNotification.DoesNotExist:
            return Response({'errorつうち': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            return Response({'errorよくわからん': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)