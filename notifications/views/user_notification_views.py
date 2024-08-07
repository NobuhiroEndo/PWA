from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from logging import getLogger
from django.middleware.csrf import get_token
import boto3
from decouple import config

logger = getLogger('notifications')

class UserNotificationViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    # permission_classes = [IsAuthenticated]

    @action(detail=False, methods=['post'])
    def save_subscription_info(self, request):
        aws_access_key_id = config('AWS_ACCESS_KEY_ID')
        aws_secret_access_key = config('AWS_SECRET_ACCESS_KEY')
        aws_region = config('AWS_REGION')

        sns_client = boto3.client(
            'sns',
            region_name=aws_region,
            aws_access_key_id=aws_access_key_id,
            aws_secret_access_key=aws_secret_access_key
        )
        logger.debug('開始！！！！！！！！')
        auth_header = request.headers.get('Authorization')
        logger.debug(f'受け取ったAuthorizationヘッダー: {auth_header}')

        user = request.user  # テストユーザー名
        logger.debug(f'ゆーざー：{request.user}')
        
        if not user.is_authenticated:
            return Response({'error': 'User not authenticated'}, status=status.HTTP_401_UNAUTHORIZED)

        try:
            endpoint = request.data.get('endpoint')
            expiration_time = request.data.get('expiration_time')
            keys = request.data.get('keys')
            
            if endpoint is None or keys is None or 'p256dh' not in keys or 'auth' not in keys:
                return Response({'error': 'Invalid subscription info'}, status=status.HTTP_400_BAD_REQUEST)
            
            user_notification, created = UserNotification.objects.get_or_create(user=user)

            response = sns_client.create_platform_endpoint(
                PlatformApplicationArn='arn:aws:sns:ap-northeast-1:917508996493:app/GCM/PWA_test',
                Token=endpoint
            )

            endpoint_arn = response['EndpointArn']

            user_notification.endpoint = endpoint_arn
            user_notification.expiration_time = expiration_time
            user_notification.encoded_user_public_key = keys['p256dh']
            user_notification.encoded_user_auth = keys['auth']
            user_notification.save()
            
            return Response({'status': 'subscription info saved'}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)