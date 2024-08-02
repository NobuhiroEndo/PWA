import base64


class PaddingLessUrlSafeBase64Helper:
    @classmethod
    def __add_padding(cls, urlsafe_base64_encoded_str: str) -> str:
        return urlsafe_base64_encoded_str + (
            (-len(urlsafe_base64_encoded_str) % 4) * "="
        )

    @classmethod
    def encode(cls, data: bytes) -> str:
        return base64.urlsafe_b64encode(data).decode().replace("=", "")

    @classmethod
    def decode(cls, data: str) -> bytes:
        return base64.urlsafe_b64decode(cls.__add_padding(data))