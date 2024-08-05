from rest_framework import viewsets, status
from rest_framework.response import Response
from ..serializers.user_login_serializer import LoginSerializer
from logging import getLogger

logger = getLogger('notifications')

class UserLoginViewSet(viewsets.ViewSet):
    def create(self, request):
        serializer = LoginSerializer(data=request.data)
        
        if serializer.is_valid():
            
            # シリアライザーからユーザーとトークンを取得
            user = serializer.validated_data['user']
            token = serializer.validated_data['token']
            
            # ユーザー情報とトークンを含むレスポンスを返す
            user_data = {
                'username': user.username,
                'email': user.email,
                'token': token
            }
            return Response({'message': 'Login successful', 'user': user_data}, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)