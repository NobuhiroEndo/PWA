import os
from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives import serialization
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
from cryptography.hazmat.primitives import hashes
import http_ece
from urllib.parse import urlparse
from datetime import datetime, timedelta

import jwt
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    NoEncryption,
    PrivateFormat,
)
import requests
import json
from django.conf import settings
from .urlsafebase64 import PaddingLessUrlSafeBase64Helper
from cryptography.hazmat.primitives.serialization import (
    Encoding,
    PublicFormat,
)

import logging
logger = logging.getLogger(__name__)

class WebPushHelper:
    @classmethod
    def _encrypt_message(
        cls,
        msg: bytes,
        encoded_user_public_key: str,
        encoded_user_auth: str,
    ) -> str:
        salt = os.urandom(16)
        server_private_key = ec.derive_private_key(
            private_value=settings.WEB_PUSH_CONTENT_ENCRYPTION_PRIVATE_KEY_NUMBER,
            curve=ec.SECP256R1(),
        )
        user_public_key = ec.EllipticCurvePublicKey.from_encoded_point(
            ec.SECP256R1(),
            PaddingLessUrlSafeBase64Helper.decode(encoded_user_public_key),
        )
        user_auth = PaddingLessUrlSafeBase64Helper.decode(encoded_user_auth)
        return http_ece.encrypt(
            content=msg,
            salt=salt,
            private_key=server_private_key,
            dh=user_public_key,
            auth_secret=user_auth,
            version="aes128gcm",
        )

    @classmethod
    def _generate_jwt(cls, endpoint: str) -> str:
        o = urlparse(endpoint)
        return jwt.encode(
            {
                "aud": o.scheme + "://" + o.netloc,
                "exp": int((datetime.now() + timedelta(hours=9)).timestamp()),
                "sub": "mailto:example@google.com",
            },
            ec.derive_private_key(
               private_value=settings.VAPID_PRIVATE_KEY_NUMBER,
               curve=ec.SECP256R1()
	     ).private_bytes(
                Encoding.PEM, PrivateFormat.TraditionalOpenSSL, NoEncryption()
            ).decode(),
            algorithm="ES256",
        )
    
    @classmethod
    def send_push(
        cls,
        endpoint: str,
        encoded_user_public_key: str,
        encoded_user_auth: str,
        payload: dict,
    ) -> requests.Response:
        body = cls._encrypt_message(
            msg=json.dumps(payload).encode(),
            encoded_user_public_key=encoded_user_public_key,
            encoded_user_auth=encoded_user_auth,
        )

        token = cls._generate_jwt(endpoint=endpoint)
        encoded_vapid_public_key = PaddingLessUrlSafeBase64Helper.encode(
            ec.derive_private_key(
                private_value=settings.VAPID_PRIVATE_KEY_NUMBER,
                curve=ec.SECP256R1(),
            )
            .public_key()
            .public_bytes(
                Encoding.X962,
                PublicFormat.UncompressedPoint
            )
        )
        res = requests.post(
            endpoint,
            headers={
                "Authorization": f"vapid t={token}, k={encoded_vapid_public_key}",
                "Content-Encoding": "aes128gcm",
                "Content-Type": "application/octet-stream",
                "TTL": "86400",
                "Urgency": "normal",
            },
            data=body,
        )
        return res