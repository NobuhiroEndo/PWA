from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import action

class HealthCheckView(viewsets.ViewSet):
    @action(detail=False, methods=['get'])
    def health(self, request):
        return Response({"status": "ok"}, status=status.HTTP_200_OK)