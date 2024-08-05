from rest_framework import serializers
from django.contrib.auth import authenticate
from rest_framework.authtoken.models import Token
from logging import getLogger

logger = getLogger('notifications')

class LoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(username=data['username'], password=data['password'])
        if user is None:
            raise serializers.ValidationError("Invalid username or password")
        
        # トークンを取得または作成する
        token, created = Token.objects.get_or_create(user=user)
        
        # ユーザーとトークンを返す
        return {
            'user': user,
            'token': token.key
        }