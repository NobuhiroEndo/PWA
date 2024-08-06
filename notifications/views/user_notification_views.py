from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.contrib.auth.models import User
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from logging import getLogger
import boto3
from botocore.exceptions import NoCredentialsError, PartialCredentialsError
import json
from django.conf import settings

logger = getLogger('notifications')

class UserNotificationViewSet(viewsets.ViewSet):
    authentication_classes = [TokenAuthentication]
    permission_classes = [IsAuthenticated]

    logger.error(f'りーじょん：{settings.AWS_DEFAULT_REGION}')
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        # Load AWS credentials and region from environment variables
        self.aws_access_key_id = settings.AWS_ACCESS_KEY_ID
        self.aws_secret_access_key = settings.AWS_SECRET_ACCESS_KEY
        self.aws_default_region = settings.AWS_DEFAULT_REGION

        if not all([self.aws_access_key_id, self.aws_secret_access_key, self.aws_default_region]):
            logger.error('AWS credentials or region not set in environment variables')
            raise ValueError('AWS credentials or region not set')

        # Initialize SNS client
        self.sns_client = boto3.client(
            'sns',
            region_name=self.aws_default_region,
            aws_access_key_id=self.aws_access_key_id,
            aws_secret_access_key=self.aws_secret_access_key
        )

    @action(detail=False, methods=['post'])
    def save_subscription_info(self, request):
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
            
            user_notification.endpoint = endpoint
            user_notification.expiration_time = expiration_time
            user_notification.encoded_user_public_key = keys['p256dh']
            user_notification.encoded_user_auth = keys['auth']
            user_notification.save()

            try:
                response = self.sns_client.subscribe(
                    TopicArn='arn:aws:sns:ap-northeast-1:917508996493:PWA_test.fifo',
                    Protocol='application',
                    Endpoint=endpoint,
                    Attributes={
                        'CustomUserData': json.dumps({
                            'user_id': user.id,
                            'public_key': keys['p256dh'],
                            'auth_key': keys['auth'],
                        })
                    }
                )
                logger.debug(f'SNSサブスクリプションのレスポンス: {response}')
            except Exception as e:
                logger.error(f'SNSサブスクリプションの作成中にエラーが発生しました: {str(e)}')
                return Response({'error': 'Failed to create SNS subscription'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            return Response({'status': 'subscription info saved'}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)