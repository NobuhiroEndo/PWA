from cryptography.hazmat.primitives.asymmetric import ec
from cryptography.hazmat.primitives.serialization import Encoding, PublicFormat
from rest_framework import viewsets
from rest_framework.response import Response
from ..utils.urlsafebase64 import PaddingLessUrlSafeBase64Helper
from django.conf import settings

class VAPIDPublicKeyViewSet(viewsets.ViewSet):
    def list(self, request):
        private_key = ec.derive_private_key(
            private_value=settings.VAPID_PRIVATE_KEY_NUMBER,
            curve=ec.SECP256R1(),
        )
        public_key = private_key.public_key()

        public_key_bytes = public_key.public_bytes(Encoding.X962, PublicFormat.UncompressedPoint)
        encoded_public_key = PaddingLessUrlSafeBase64Helper.encode(public_key_bytes)

        return Response({'public_key': encoded_public_key})