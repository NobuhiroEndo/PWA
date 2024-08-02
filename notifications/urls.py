from rest_framework.routers import DefaultRouter
from .views.user_notification_views import UserNotificationViewSet
from .views.notifications_view import NotificationViewSet
from .views.get_vapid_public_key_view import VAPIDPublicKeyViewSet

router = DefaultRouter()
router.register(r'user_notifications', UserNotificationViewSet, basename='user_notifications')
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'get_vapid_public_key', VAPIDPublicKeyViewSet, basename='get_vapid_public_key')

urlpatterns = [
    # 他の URL パターン
] + router.urls
