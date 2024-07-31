from rest_framework.routers import DefaultRouter
from .views.user_notification_views import UserNotificationViewSet
from .views.notifications_view import NotificationViewSet

router = DefaultRouter()
router.register(r'user_notifications', UserNotificationViewSet, basename='user_notifications')
router.register(r'notifications', NotificationViewSet, basename='notifications')

urlpatterns = [
    # 他の URL パターン
] + router.urls
