from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from ..models import UserNotification
from ..utils.utils import send_push_notification
from logging import getLogger
import boto3
from decouple import config
import json

logger = getLogger('notifications')

class NotificationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def send_notification(self, request):
        aws_access_key_id = config('AWS_ACCESS_KEY_ID')
        aws_secret_access_key = config('AWS_SECRET_ACCESS_KEY')
        aws_region = config('AWS_REGION')

        sns_client = boto3.client(
            'sns',
            region_name=aws_region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )

        try:
            user = User.objects.get(username='admin')
            user_notification = UserNotification.objects.get(user=user)

            token = user_notification.endpoint

            if not token:
                return Response({'error': 'Incomplete subscription info.'}, status=status.HTTP_400_BAD_REQUEST)

            user_notification.unread_notifications_count += 1
            user_notification.save()

            title = 'test'
            body = 'HELLO!'
            badge_count = user_notification.unread_notifications_count

            message = {
                'default': body,
                'GCM': json.dumps({
                    'notification': {
                        'title': title,
                        'body': body,
                        'badge': badge_count
                    }
                })
            }

            response = sns_client.publish(
                TargetArn=token,
                MessageStructure='json',
                Message=json.dumps(message)
            )

            return Response({'message': 'Notification sent successfully', 'response': response}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)
        except UserNotification.DoesNotExist:
            return Response({'error': 'UserNotification not found'}, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            logger.debug('一番最後のエラー')
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)