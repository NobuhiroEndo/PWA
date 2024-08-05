from rest_framework import viewsets, status
from rest_framework.response import Response
from django.contrib.auth import logout

class UserLogoutViewSet(viewsets.ViewSet):
    def create(self, request):
        try:
            logout(request)
            return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)