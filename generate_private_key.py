from cryptography.hazmat.primitives.asymmetric import ec

# P-256曲線を用いた楕円曲線暗号鍵を生成
private_key = ec.generate_private_key(ec.SECP256R1())

# int数値に変換する
private_value = private_key.private_numbers().private_value
print(private_value)