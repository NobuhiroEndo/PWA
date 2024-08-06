from rest_framework.routers import DefaultRouter
from .views.user_notification_views import UserNotificationViewSet
from .views.notifications_view import NotificationViewSet
from .views.notification_count import NotificationCountViewSet
from .views.update_unread_count import UpdateUnreadCountViewSet
from .views.user_login import UserLoginViewSet
from .views.user_logout import UserLogoutViewSet
from .views.health import HealthCheckView

router = DefaultRouter()
router.register(r'user_notifications', UserNotificationViewSet, basename='user_notifications')
router.register(r'notifications', NotificationViewSet, basename='notifications')
router.register(r'notification_count', NotificationCountViewSet, basename='notification_count')
router.register(r'update_unread_count', UpdateUnreadCountViewSet, basename='update_unread_count')
router.register(r'user_login', UserLoginViewSet, basename='user_login')
router.register(r'user_logout', UserLogoutViewSet, basename='user_logout')
router.register(r'health', HealthCheckView, basename='health')

urlpatterns = [
    # 他の URL パターン
] + router.urls
