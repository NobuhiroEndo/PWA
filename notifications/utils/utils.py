import firebase_admin
from firebase_admin import credentials, messaging
from django.conf import settings

# Firebase Admin SDKを初期化
cred = credentials.Certificate(settings.FIREBASE_CREDENTIALS)
firebase_admin.initialize_app(cred)

def send_push_notification(token, title, body):
    # 通知のペイロードを準備
    message = messaging.Message(
        token=token,
        notification=messaging.Notification(
            title=title,
            body=body
        )
    )

    # 通知を送信
    response = messaging.send(message)
    return response