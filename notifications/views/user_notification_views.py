from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from ..models import UserNotification
from ..serializers import UserNotificationSerializer
from logging import getLogger

logger = getLogger('notifications')

class UserNotificationViewSet(viewsets.ViewSet):
    @action(detail=False, methods=['post'])
    def save_subscription_info(self, request):
        username = 'nobuhiro'  # テストユーザー名
        
        user = User.objects.get(username=username)
        logger.debug(f'ゆーざー：{user}')
        logger.debug(f'リクエストデータ！: {request.data}')
        subscription_info = request.data.get('subscription_info')
        logger.debug(f'取得したでーた：{subscription_info}')
        
        try:
            user = User.objects.get(username=username)
            user_notification, created = UserNotification.objects.get_or_create(user=user)
            
            # リクエストデータから subscription_info を取得
            subscription_info = request.data.get('subscription_info')
            logger.debug(f'取得したでーた：{subscription_info}')
            
            # subscription_info が null でないことを確認
            if subscription_info is None:
                return Response({'error': 'Subscription info is missing'}, status=status.HTTP_400_BAD_REQUEST)
            
            # subscription_info をモデルに保存
            user_notification.subscription_info = subscription_info
            user_notification.save()
            
            return Response({'status': 'subscription info saved'}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)