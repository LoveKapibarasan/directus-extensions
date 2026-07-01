# Directus Transaction Export Extension

Directus 管理画面のサイドバーから日付範囲を選択してトランザクションデータを Excel (.xlsx) でダウンロードできるカスタム拡張です。

---

## 構成

```
/home/user/directus-extensions/
└── export-transactions/
    └── src/
        ├── api/index.js      # サーバーサイド: Transactions → XLSX 生成
        └── app/
            ├── ExportPage.vue # Directus 管理画面 UI (日付ピッカー + ボタン)
            └── index.js       # モジュール定義

/home/user/directus-extensions-deployed/   # ビルド済みファイル (永続化用)
├── export-transactions-api/
│   ├── api.js               # ビルド済みエンドポイント (ExcelJS バンドル済)
│   ├── package.json
│   └── src/index.js         # 元ソース
└── export-transactions-ui/
    ├── app.js               # ビルド済みモジュール (Vue コンポーネント)
    ├── package.json
    └── src/index.js
```

---

## Directus 管理画面での使い方

1. `http://directus.ai-charge.net` を開く
2. 左サイドバーの **Transaction Export** (↓アイコン) をクリック
3. **From Date** と **To Date** を選択
4. **Download Excel** ボタンをクリック → `.xlsx` ファイルがダウンロードされる

---

## コンテナへのデプロイ (手動更新時)

ビルド済みファイルをコンテナにコピーして再起動:

```bash
# コンテナへコピー
docker cp /home/user/directus-extensions-deployed/export-transactions-api ocpp-directus:/directus/extensions/
docker cp /home/user/directus-extensions-deployed/export-transactions-ui ocpp-directus:/directus/extensions/

# Directus 再起動
docker restart ocpp-directus
```

---

## 永続化 (コンテナ再作成時に自動復元)

現在の docker run コマンドに `extensions` ボリュームマウントを追加してコンテナを作り直す。

### 現在の起動コマンド（概要）

```bash
docker run -d \
  --name ocpp-directus \
  --restart always \
  -p 8055:8055 \
  -v /home/user/directus/uploads:/directus/uploads \
  # ... 他の -e 環境変数 ...
  directus/directus:latest
```

### 永続化追加後（extensions マウント追加）

```bash
# 既存コンテナを停止・削除
docker stop ocpp-directus && docker rm ocpp-directus

# extensions マウントを追加して再作成
docker run -d \
  --name ocpp-directus \
  --restart always \
  -p 8055:8055 \
  -v /home/user/directus/uploads:/directus/uploads \
  -v /home/user/directus-extensions-deployed:/directus/extensions \
  # ... 他の -e 環境変数 (docker inspect で確認) ...
  directus/directus:latest
```

> **注意**: コンテナ再作成後、`directus_extensions` テーブルに拡張が登録されていない場合は以下の SQL を実行:
> ```sql
> INSERT INTO directus_extensions (id, enabled, folder, source, bundle) VALUES
>   (gen_random_uuid(), true, 'export-transactions-api', 'local', null),
>   (gen_random_uuid(), true, 'export-transactions-ui', 'local', null)
> ON CONFLICT DO NOTHING;
> ```

---

## ソースを変更した後のビルド手順

**前提**: Node.js はホストマシンに不要。コンテナ内でビルドする。

### 1. エンドポイント (api.js) をリビルド

```bash
# ソースをコンテナにコピー
docker cp /home/user/directus-extensions/export-transactions/src/api/index.js \
  ocpp-directus:/directus/extensions/export-transactions-api/src/index.js

# コンテナ内でビルド
docker exec -w /directus/extensions/export-transactions-api ocpp-directus sh -c "
  NODE_ENV=development npm install @directus/extensions-sdk exceljs --save-dev --save --quiet &&
  ./node_modules/.bin/directus-extension build -t endpoint -i src/index.js -o api.js
"

# ホストにバックアップ
docker cp ocpp-directus:/directus/extensions/export-transactions-api/api.js \
  /home/user/directus-extensions-deployed/export-transactions-api/api.js
```

### 2. モジュール UI (app.js) をリビルド

```bash
# ソースをコンテナにコピー
docker cp /home/user/directus-extensions/export-transactions/src/app/index.js \
  ocpp-directus:/directus/extensions/export-transactions-ui/src/index.js
# ExportPage.vue も必要な場合
docker cp /home/user/directus-extensions/export-transactions/src/app/ExportPage.vue \
  ocpp-directus:/directus/extensions/export-transactions-ui/src/ExportPage.vue

# コンテナ内でビルド
docker exec -w /directus/extensions/export-transactions-ui ocpp-directus sh -c "
  NODE_ENV=development npm install @directus/extensions-sdk --save-dev --quiet &&
  ./node_modules/.bin/directus-extension build -t module -i src/index.js -o app.js
"

# ホストにバックアップ
docker cp ocpp-directus:/directus/extensions/export-transactions-ui/app.js \
  /home/user/directus-extensions-deployed/export-transactions-ui/app.js
```

### 3. 再起動

```bash
docker restart ocpp-directus
```

---

## 動作確認

```bash
# トークン取得
TOKEN=$(curl -s -X POST http://localhost:8055/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ai-charge.com","password":"<password>"}' \
  | python3 -c "import sys,json; print(json.load(sys.stdin)['data']['access_token'])")

# エンドポイントテスト (XLSX が返れば OK)
curl -w "HTTP: %{http_code} | Size: %{size_download}b\n" \
  "http://localhost:8055/export-transactions?from=2026-06-01&to=2026-06-29" \
  -H "Authorization: Bearer $TOKEN" -o /tmp/test.xlsx

# App extension JS テスト (200 が返れば UI がロードされる)
curl -w "HTTP: %{http_code} | Size: %{size_download}b\n" \
  "http://localhost:8055/extensions/sources/index.js" \
  -H "Authorization: Bearer $TOKEN" -o /dev/null
```

---

## 技術仕様

| 項目 | 内容 |
|------|------|
| Directus バージョン | 11.17.4 |
| 拡張タイプ | endpoint + module (2つの standalone extension) |
| エクセルライブラリ | ExcelJS 4.4.0 (api.js にバンドル) |
| 認証 | Directus セッション認証 (管理画面ログイン済みユーザーのみ) |
| フィルタ対象フィールド | `Transactions.startTime` (_gte / _lte) |
| ルート | `GET /export-transactions?from=YYYY-MM-DD&to=YYYY-MM-DD` |
