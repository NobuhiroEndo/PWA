#!/bin/sh

# エラーがあったら（exit 0以外）シェルスクリプトをそこで打ち止めにする
set -e

# 引数を順に取得する
host="$1"
shift
user="$1"
shift
database="$1"

# データベースの準備が整うまで待つ
until mysql -h "$host" -u "$user" "$database" 2> /dev/null
do
        echo "[wait-for-it.sh] MySQL is unavailable - waiting..."
        sleep 1
done

echo "[wait-for-it.sh] MySQL is now available"