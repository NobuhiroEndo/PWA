import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings
from logging import getLogger

logger = getLogger('notifications')

# Firebase Admin SDKを初期化
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body, badge_count):
    # 通知のペイロードを準備
    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title=title,
            body=body
        ),
        data={
            'badge_count': str(badge_count)  # badge_count を文字列に変換してデータフィールドに追加
        }
    )

    # 通知を送信
    response = messaging.send(message)
    return response